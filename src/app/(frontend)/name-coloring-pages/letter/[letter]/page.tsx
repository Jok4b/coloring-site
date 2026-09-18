import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { LetterBar } from '@/components/site/LetterBar'
import { publishedNames } from '@/lib/queries'

type Props = { params: Promise<{ letter: string }> }

const clean = (l: string) => (/^[a-z]$/i.test(l) ? l.toUpperCase() : null)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const L = clean((await params).letter)
  if (!L) return {}
  return {
    title: `Name coloring pages starting with ${L}`,
    description: `Free printable coloring pages for names that start with ${L}. Pick a name and print it in big letters to color.`,
    alternates: { canonical: `/name-coloring-pages/letter/${L.toLowerCase()}` },
  }
}

export default async function LetterPage({ params }: Props) {
  const L = clean((await params).letter)
  if (!L) notFound()
  const all = await publishedNames()
  const list = all.filter((n) => n.name[0].toUpperCase() === L)
  if (!list.length) notFound()
  const have = new Set(all.map((n) => n.name[0].toUpperCase()))
  return (
    <div className="wrap">
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Name coloring pages', path: '/name-coloring-pages' },
          { name: `Names starting with ${L}`, path: `/name-coloring-pages/letter/${L.toLowerCase()}` },
        ]}
      />
      <header className="page-head">
        <h1>Names starting with {L}</h1>
        <p>{list.length} {list.length === 1 ? 'name' : 'names'} ready to print. Don’t see yours? <Link href="/name-coloring-pages">Type any name</Link>.</p>
      </header>
      <LetterBar have={have} current={L} />
      <ul className="name-list" style={{ marginTop: 20 }}>
        {list.map((n) => (
          <li key={n.id}>
            <Link href={`/name-coloring-pages/${n.slug}`}>{n.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
