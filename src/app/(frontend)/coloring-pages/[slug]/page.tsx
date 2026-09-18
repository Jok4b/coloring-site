import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { PageActions } from '@/components/site/PageActions'
import { SheetGrid } from '@/components/site/SheetCard'
import { getSettings } from '@/lib/payload'
import { pageBySlug, relatedPages } from '@/lib/queries'
import { JsonLd } from '@/lib/jsonld'
import { absoluteUrl, mediaDims, mediaUrl, pageTitle, siteHost } from '@/lib/site'
import type { Category } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

const LEVEL: Record<string, string> = {
  easy: 'Big, simple shapes. Good for young kids and crayons.',
  medium: 'A mix of big and small areas. Good for markers and colored pencils.',
  detailed: 'Lots of small details. Best with fine markers or colored pencils.',
}

const describe = (title: string, category?: Category | null) =>
  `Free printable ${pageTitle(title).toLowerCase()}${category ? ` from our ${category.name.toLowerCase()} collection` : ''}. Print it in one click, download the PDF, or color it online.`

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await pageBySlug((await params).slug)
  if (!page) return {}
  const cat = typeof page.category === 'object' ? page.category : null
  const img = mediaUrl(page.image, 'card')
  return {
    title: `${pageTitle(page.title)} (free printable)`,
    description: page.description?.slice(0, 160) || describe(page.title, cat),
    alternates: { canonical: `/coloring-pages/${page.slug}` },
    openGraph: { type: 'article', title: pageTitle(page.title), images: img ? [{ url: img }] : undefined },
  }
}

export default async function ColoringPageView({ params }: Props) {
  const page = await pageBySlug((await params).slug)
  if (!page) notFound()
  const [related, settings] = await Promise.all([relatedPages(page), getSettings()])
  const cat = typeof page.category === 'object' ? page.category : null
  const original = mediaUrl(page.image, 'original')!
  const card = mediaUrl(page.image, 'card') || original
  const thumb = mediaUrl(page.image, 'thumb') || card
  const { width, height } = mediaDims(page.image)
  const landscape = width > height
  const alt = (typeof page.image === 'object' && page.image?.alt) || `${pageTitle(page.title)} line art`
  const path = `/coloring-pages/${page.slug}`
  const host = siteHost()
  const footer = host ? `${settings.siteName} · ${host}` : settings.siteName

  const crumbs = [{ name: 'Home', path: '/' }]
  if (cat) crumbs.push({ name: cat.name, path: `/category/${cat.slug}` })
  else crumbs.push({ name: 'All coloring pages', path: '/coloring-pages' })
  crumbs.push({ name: page.title, path })

  return (
    <div className="wrap">
      <Breadcrumbs items={crumbs} />
      <article className="detail">
        <div className={`sheet-paper${landscape ? ' landscape' : ''}`}>
          <img
            src={card}
            srcSet={`${thumb} 400w, ${card} 800w`}
            sizes="(max-width: 860px) 92vw, 560px"
            alt={alt}
            width={width}
            height={height}
            fetchPriority="high"
          />
        </div>
        <div className="detail-info">
          <h1>{pageTitle(page.title)}</h1>
          <p>{page.description || describe(page.title, cat)}</p>
          <ul className="facts" aria-label="About this page">
            {page.difficulty && <li>{page.difficulty === 'detailed' ? 'Detailed' : page.difficulty === 'medium' ? 'Medium' : 'Easy'}</li>}
            {page.audience && <li>{page.audience === 'adults' ? 'For adults' : page.audience === 'all' ? 'For everyone' : 'For kids'}</li>}
            <li>{landscape ? 'Landscape' : 'Portrait'}</li>
            <li>Letter and A4</li>
          </ul>
          <PageActions slug={page.slug!} title={pageTitle(page.title)} src={original} footer={footer} />
          {page.difficulty && <p className="muted">{LEVEL[page.difficulty]}</p>}
        </div>
      </article>

      {related.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>{cat && related.every((r) => (typeof r.category === 'object' ? r.category?.id : r.category) === cat.id) ? `More ${cat.name.toLowerCase()} coloring pages` : 'More pages to color'}</h2>
          </div>
          <SheetGrid pages={related} />
        </section>
      )}

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ImageObject',
          name: pageTitle(page.title),
          description: page.description || describe(page.title, cat),
          contentUrl: absoluteUrl(original),
          thumbnailUrl: absoluteUrl(thumb),
          url: absoluteUrl(path),
          width: String(width),
          height: String(height),
          datePublished: page.createdAt,
          dateModified: page.updatedAt,
        }}
      />
    </div>
  )
}
