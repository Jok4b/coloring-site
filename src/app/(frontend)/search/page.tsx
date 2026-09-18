import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { SearchBox } from '@/components/site/SearchBox'
import { SheetGrid } from '@/components/site/SheetCard'
import { latestPages, logMissedSearch, publishedNames, searchPages } from '@/lib/queries'
import { toSlug } from '@/fields/slug'

type Props = { searchParams: Promise<{ q?: string }> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = (await searchParams).q?.trim()
  return { title: q ? `Search: ${q}` : 'Search', robots: { index: false, follow: true } }
}

export default async function SearchPage({ searchParams }: Props) {
  const q = ((await searchParams).q || '').trim().slice(0, 80)
  const res = q ? await searchPages(q) : null
  const nameMatch = q && /^[a-zA-Z' -]{2,16}$/.test(q) ? (await publishedNames({ slug: { equals: toSlug(q) } }, 1))[0] : undefined
  if (q && res && res.docs.length === 0 && !nameMatch) await logMissedSearch(q)
  const fallback = res && res.docs.length === 0 ? await latestPages(12) : null

  return (
    <div className="wrap">
      <header className="page-head" style={{ paddingTop: 28 }}>
        <h1>{q ? `Coloring pages for “${q}”` : 'Search coloring pages'}</h1>
        <div style={{ maxWidth: 640 }}>
          <SearchBox big initial={q} autoFocus={!q} />
        </div>
      </header>
      {nameMatch && (
        <p className="prose">
          Looking for the name {nameMatch.name}? <Link href={`/name-coloring-pages/${nameMatch.slug}`}>Print {nameMatch.name} name coloring pages</Link>.
        </p>
      )}
      {res && res.docs.length > 0 && (
        <>
          <p className="muted">{res.totalDocs} {res.totalDocs === 1 ? 'page' : 'pages'} found</p>
          <SheetGrid pages={res.docs} />
        </>
      )}
      {fallback && (
        <>
          <div className="empty" style={{ margin: '12px 0 32px' }}>
            <p><strong>We don’t have “{q}” yet.</strong></p>
            <p>We keep a list of what people look for and draw the most wanted pages first. Here are some new ones in the meantime.</p>
          </div>
          <SheetGrid pages={fallback.docs} />
        </>
      )}
    </div>
  )
}
