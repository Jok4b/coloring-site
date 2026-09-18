import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { NameSheets } from '@/components/site/NameSheets'
import { getSettings } from '@/lib/payload'
import { activeTemplates, nameBySlug, publishedNames, toSheetTemplates } from '@/lib/queries'
import { JsonLd } from '@/lib/jsonld'
import { absoluteUrl, siteHost } from '@/lib/site'
import type { Name } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

// Small stable choice so pages don't all open with the same sentence.
const pick = <T,>(seed: string, list: T[]) => list[[...seed].reduce((a, c) => a + c.charCodeAt(0), 0) % list.length]

function intro(n: Name) {
  const who = n.gender === 'F' ? 'girls' : n.gender === 'M' ? 'boys' : 'kids'
  return pick(n.name, [
    `Print ${n.name} in big outlined letters and let the coloring begin. Each design below is free and fits on one sheet of paper.`,
    `Here are free coloring pages that spell ${n.name} in large, easy-to-color letters, a fun way for ${who} to practice their name.`,
    `Looking for something special for ${n.name}? Pick a design, print it, and color the name with crayons, markers or paint.`,
  ])
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = await nameBySlug((await params).slug)
  if (!n) return {}
  return {
    title: `${n.name} coloring pages: free printable name sheets`,
    description: `Free printable ${n.name} name coloring pages. Big outlined letters to color, sized for Letter and A4 paper. Print, save, or color online.`,
    alternates: { canonical: `/name-coloring-pages/${n.slug}` },
  }
}

export default async function NamePage({ params }: Props) {
  const n = await nameBySlug((await params).slug)
  if (!n) notFound()
  const [templates, all, s] = await Promise.all([activeTemplates(), publishedNames(), getSettings()])
  const host = siteHost()
  const footer = host ? `${s.siteName} · ${host}` : s.siteName
  const L = n.name[0].toUpperCase()
  const sameLetter = all.filter((x) => x.id !== n.id && x.name[0].toUpperCase() === L).slice(0, 12)
  const similar = n.rank
    ? all
        .filter((x) => x.id !== n.id && x.gender === n.gender && x.rank)
        .sort((a, b) => Math.abs(a.rank! - n.rank!) - Math.abs(b.rank! - n.rank!))
        .slice(0, 8)
    : []
  const letters = n.name.replace(/[^a-zA-Z]/g, '').length
  const path = `/name-coloring-pages/${n.slug}`

  return (
    <div className="wrap">
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Name coloring pages', path: '/name-coloring-pages' },
          { name: L, path: `/name-coloring-pages/letter/${L.toLowerCase()}` },
          { name: n.name, path },
        ]}
      />
      <header className="page-head">
        <h1>{n.name} coloring pages</h1>
        <p>{intro(n)}</p>
      </header>

      <NameSheets name={n.name} templates={toSheetTemplates(templates)} footer={footer} />

      <section className="section">
        <h2>About the name {n.name}</h2>
        <div className="name-facts">
          <div><strong>{letters}</strong> letters</div>
          {n.rank && n.year ? <div><strong>#{n.rank}</strong> for {n.gender === 'F' ? 'girls' : 'boys'} in the US in {n.year}</div> : null}
          {n.births && n.year ? <div><strong>{n.births.toLocaleString('en-US')}</strong> babies named {n.name} in {n.year}</div> : null}
        </div>
        <p>Spell it out while you color:</p>
        <div className="spell" aria-label={`${n.name} spelled out`}>
          {n.name.toUpperCase().split('').map((ch, i) => <span key={i}>{ch}</span>)}
        </div>
        {n.about ? <div className="prose"><p style={{ margin: 0 }}>{n.about}</p></div> : null}
        {n.rank && n.year ? <p className="muted" style={{ fontSize: '.9rem' }}>Popularity data: US Social Security Administration, {n.year}.</p> : null}
      </section>

      {similar.length > 0 && (
        <section className="section">
          <h2>Names as popular as {n.name}</h2>
          <ul className="name-list">
            {similar.map((x) => <li key={x.id}><Link href={`/name-coloring-pages/${x.slug}`}>{x.name}</Link></li>)}
          </ul>
        </section>
      )}
      {sameLetter.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>More names starting with {L}</h2>
            <Link href={`/name-coloring-pages/letter/${L.toLowerCase()}`}>All {L} names</Link>
          </div>
          <ul className="name-list">
            {sameLetter.map((x) => <li key={x.id}><Link href={`/name-coloring-pages/${x.slug}`}>{x.name}</Link></li>)}
          </ul>
        </section>
      )}

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: `${n.name} coloring pages`,
          url: absoluteUrl(path),
          description: `Free printable ${n.name} name coloring pages.`,
          isPartOf: { '@type': 'CollectionPage', name: 'Name coloring pages', url: absoluteUrl('/name-coloring-pages') },
        }}
      />
    </div>
  )
}
