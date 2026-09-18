import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { searchPages } from '@/lib/queries'
import { mediaUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get('q') || '').trim().slice(0, 60)
  if (q.length < 2) return NextResponse.json({ results: [] })
  const payload = await getPayloadClient()
  const [pages, names, cats] = await Promise.all([
    searchPages(q, 6),
    payload.find({ collection: 'names', where: { and: [{ published: { equals: true } }, { name: { like: q } }] }, limit: 3, depth: 0, sort: 'rank' }),
    payload.find({ collection: 'categories', where: { name: { like: q } }, limit: 2, depth: 0 }),
  ])
  const results = [
    ...cats.docs.map((c) => ({ title: `${c.name} coloring pages`, href: `/category/${c.slug}`, thumb: null, kind: 'category' as const })),
    ...pages.docs.map((p) => ({ title: p.title, href: `/coloring-pages/${p.slug}`, thumb: mediaUrl(p.image, 'thumb'), kind: 'page' as const })),
    ...names.docs.map((n) => ({ title: `${n.name} name coloring pages`, href: `/name-coloring-pages/${n.slug}`, thumb: null, kind: 'name' as const })),
  ]
  return NextResponse.json({ results }, { headers: { 'Cache-Control': 'public, max-age=30, s-maxage=60' } })
}
