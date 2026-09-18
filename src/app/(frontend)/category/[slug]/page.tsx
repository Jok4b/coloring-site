import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { SheetGrid } from '@/components/site/SheetCard'
import { Pager } from '@/components/site/Pager'
import { categoryBySlug, pagesInCategory } from '@/lib/queries'
import { JsonLd } from '@/lib/jsonld'
import { absoluteUrl } from '@/lib/site'

const PER_PAGE = 48
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = Number((await searchParams).page) || 1
  const c = await categoryBySlug(slug)
  if (!c) return {}
  const base = `/category/${c.slug}`
  return {
    title: `${c.name} coloring pages${page > 1 ? `, page ${page}` : ''}: free printable`,
    description: c.intro?.slice(0, 160) || `Free printable ${c.name.toLowerCase()} coloring pages for kids and adults. Print, download a PDF, or color online.`,
    alternates: { canonical: page > 1 ? `${base}?page=${page}` : base },
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const page = Math.max(1, Number((await searchParams).page) || 1)
  const c = await categoryBySlug(slug)
  if (!c) notFound()
  const res = await pagesInCategory(c.id, PER_PAGE, page)
  if (page > 1 && !res.docs.length) notFound()
  const path = `/category/${c.slug}`
  return (
    <div className="wrap">
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'All coloring pages', path: '/coloring-pages' }, { name: c.name, path }]} />
      <header className="page-head">
        <h1>{c.name} coloring pages</h1>
        {c.intro ? <p>{c.intro}</p> : <p>{res.totalDocs} free {c.name.toLowerCase()} pages to print or color online.</p>}
      </header>
      {res.docs.length ? <SheetGrid pages={res.docs} /> : <div className="empty"><p>No pages in this category yet.</p></div>}
      <Pager page={page} total={res.totalPages} base={path} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${c.name} coloring pages`,
          url: absoluteUrl(path),
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: res.docs.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: absoluteUrl(`/coloring-pages/${p.slug}`), name: p.title })),
          },
        }}
      />
    </div>
  )
}
