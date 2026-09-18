import fs from 'fs/promises'
import path from 'path'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import sharp from 'sharp'
import { getSettings } from '@/lib/payload'
import { MEDIA_DIR } from '@/lib/paths'
import { pageBySlug } from '@/lib/queries'
import { siteHost } from '@/lib/site'

export const dynamic = 'force-dynamic'

const SIZES = { letter: [612, 792], a4: [595.28, 841.89] } as const

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const paper = new URL(req.url).searchParams.get('paper') === 'a4' ? 'a4' : 'letter'
  const page = await pageBySlug(slug)
  const media = page && typeof page.image === 'object' ? page.image : null
  if (!page || !media?.filename) return new Response('Not found', { status: 404 })

  let png: Buffer
  try {
    const file = await fs.readFile(path.join(MEDIA_DIR, path.basename(media.filename)))
    png = await sharp(file, { density: 200 })
      .flatten({ background: '#ffffff' })
      .resize({ width: 2550, height: 2550, fit: 'inside', withoutEnlargement: true })
      .png()
      .toBuffer()
  } catch {
    return new Response('Image file missing', { status: 404 })
  }

  const pdf = await PDFDocument.create()
  pdf.setTitle(page.title)
  const img = await pdf.embedPng(png)
  const landscape = img.width > img.height
  const [w, h] = landscape ? [SIZES[paper][1], SIZES[paper][0]] : SIZES[paper]
  const sheet = pdf.addPage([w, h])
  const margin = 28
  const footerSpace = 18
  const scale = Math.min((w - margin * 2) / img.width, (h - margin * 2 - footerSpace) / img.height)
  const iw = img.width * scale, ih = img.height * scale
  sheet.drawImage(img, { x: (w - iw) / 2, y: margin + footerSpace + (h - margin * 2 - footerSpace - ih) / 2, width: iw, height: ih })

  const s = await getSettings()
  const host = siteHost()
  const label = host ? `${s.siteName} · ${host}` : s.siteName
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const safe = label.replace(/[^\x20-\x7E]/g, '-')
  const size = 8
  sheet.drawText(safe, { x: (w - font.widthOfTextAtSize(safe, size)) / 2, y: margin - 6, size, font, color: rgb(0.55, 0.55, 0.55) })

  const bytes = await pdf.save()
  return new Response(Buffer.from(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${page.slug}-${paper}.pdf"`,
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'noindex',
    },
  })
}
