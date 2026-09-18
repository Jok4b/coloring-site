import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { SheetGrid } from '@/components/site/SheetCard'
import { allCategories, latestPages } from '@/lib/queries'
import { Pager } from '@/components/site/Pager'

const PER_PAGE = 48
type Props = { searchParams: Promise<{ page?: string }> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const page = Number((await searchParams).page) || 1
  return {
    title: page > 1 ? `All coloring pages, page ${page}` : 'All free printable coloring pages',
    description: 'Browse every free printable coloring page. Print in one click, download a PDF, or color online.',
    alternates: { canonical: page > 1 ? `/coloring-pages?page=${page}` : '/coloring-pages' },
  }
}

export default async function AllPages({ searchParams }: Props) {
  const page = Math.max(1, Number((await searchParams).page) || 1)
  const [res, categories] = await Promise.all([latestPages(PER_PAGE, page), allCategories()])
  if (page > 1 && res.docs.length === 0) notFound()
  return (
    <div className="wrap">
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'All coloring pages', path: '/coloring-pages' }]} />
      <header className="page-head">
        <h1>All coloring pages</h1>
        <p>{res.totalDocs} free pages to print or color online.</p>
        {categories.length > 0 && (
          <div className="chips" style={{ justifyContent: 'flex-start' }}>
            {categories.map((c) => (
              <Link key={c.id} className="chip" href={`/category/${c.slug}`}>{c.name}</Link>
            ))}
          </div>
        )}
      </header>
      <SheetGrid pages={res.docs} />
      <Pager page={page} total={res.totalPages} base="/coloring-pages" />
    </div>
  )
}
