import Link from 'next/link'
import React from 'react'
import { OutlineTitle } from '@/components/site/OutlineTitle'
import { SearchBox } from '@/components/site/SearchBox'
import { SheetGrid } from '@/components/site/SheetCard'
import { getSettings } from '@/lib/payload'
import { allCategories, latestPages, pagesInCategory } from '@/lib/queries'
import { JsonLd } from '@/lib/jsonld'
import { SITE_URL } from '@/lib/site'

export default async function HomePage() {
  const [s, categories, latest] = await Promise.all([getSettings(), allCategories(), latestPages(12)])
  const featured = categories.filter((c) => c.showOnHome).slice(0, 4)
  const rows = await Promise.all(featured.map(async (c) => ({ c, pages: (await pagesInCategory(c.id, 6)).docs })))

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: s.siteName,
          url: SITE_URL,
          potentialAction: { '@type': 'SearchAction', target: `${SITE_URL}/search?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
        }}
      />
      <section className="hero">
        <div className="wrap">
          <OutlineTitle text={s.heroTitle} />
          <p>{s.heroText}</p>
          <SearchBox big />
          {categories.length > 0 && (
            <div className="chips">
              {categories.slice(0, 10).map((c) => (
                <Link key={c.id} className="chip" href={`/category/${c.slug}`}>{c.name}</Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {latest.docs.length === 0 ? (
        <div className="wrap">
          <div className="empty">
            <p><strong>No coloring pages yet.</strong></p>
            <p>Log in at /admin, add a coloring page and press Publish. It will show up here.</p>
          </div>
        </div>
      ) : (
        <div className="wrap">
          <section className="section">
            <div className="section-head">
              <h2>New coloring pages</h2>
              <Link href="/coloring-pages">See all</Link>
            </div>
            <SheetGrid pages={latest.docs} />
          </section>
          {rows.filter((r) => r.pages.length > 0).map(({ c, pages }) => (
            <section className="section" key={c.id}>
              <div className="section-head">
                <h2>{c.name} coloring pages</h2>
                <Link href={`/category/${c.slug}`}>See all {c.name.toLowerCase()}</Link>
              </div>
              <SheetGrid pages={pages} />
            </section>
          ))}
          <section className="section">
            <div className="section-head">
              <h2>Coloring pages with a name</h2>
              <Link href="/name-coloring-pages">Find a name</Link>
            </div>
            <p>Type any name and print a page with it in big letters to color. Great for birthdays, classrooms and name practice.</p>
          </section>
        </div>
      )}
    </>
  )
}
