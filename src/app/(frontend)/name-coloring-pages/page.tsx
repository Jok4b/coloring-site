import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { NameMaker } from '@/components/site/NameSheets'
import { LetterBar } from '@/components/site/LetterBar'
import { getSettings } from '@/lib/payload'
import { activeTemplates, publishedNames, toSheetTemplates } from '@/lib/queries'
import { siteHost } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Name coloring pages: print any name for free',
  description: 'Free printable name coloring pages. Type any name, or pick from popular names, then print it in big letters to color.',
  alternates: { canonical: '/name-coloring-pages' },
}

export default async function NameHub() {
  const [names, templates, s] = await Promise.all([publishedNames(), activeTemplates(), getSettings()])
  const host = siteHost()
  const footer = host ? `${s.siteName} · ${host}` : s.siteName
  const letters = new Set(names.map((n) => n.name[0].toUpperCase()))
  const top = (g: 'F' | 'M') => names.filter((n) => n.gender === g && n.rank).sort((a, b) => a.rank! - b.rank!).slice(0, 24)
  const girls = top('F'), boys = top('M')

  return (
    <div className="wrap">
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Name coloring pages', path: '/name-coloring-pages' }]} />
      <header className="page-head">
        <h1>Name coloring pages</h1>
        <p>Print a name in big outlined letters for kids to color. Perfect for birthdays, the first day of school, and learning to spell a name.</p>
      </header>

      <NameMaker templates={toSheetTemplates(templates)} footer={footer} />

      {names.length > 0 && (
        <>
          <section className="section">
            <h2>Browse names by letter</h2>
            <LetterBar have={letters} />
          </section>
          {girls.length > 0 && (
            <section className="section">
              <h2>Popular girl names</h2>
              <NameList names={girls} />
            </section>
          )}
          {boys.length > 0 && (
            <section className="section">
              <h2>Popular boy names</h2>
              <NameList names={boys} />
            </section>
          )}
        </>
      )}
    </div>
  )
}

function NameList({ names }: { names: { id: number; name: string; slug?: string | null; rank?: number | null }[] }) {
  return (
    <ul className="name-list">
      {names.map((n) => (
        <li key={n.id}>
          <Link href={`/name-coloring-pages/${n.slug}`}>
            {n.name}
            {n.rank ? <small>#{n.rank}</small> : null}
          </Link>
        </li>
      ))}
    </ul>
  )
}
