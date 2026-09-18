import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { absoluteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const [pages, cats, names] = await Promise.all([
    payload.find({ collection: 'coloring-pages', where: { _status: { equals: 'published' } }, pagination: false, depth: 0, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'categories', pagination: false, depth: 0, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'names', where: { published: { equals: true } }, pagination: false, depth: 0, select: { slug: true, name: true, updatedAt: true } }),
  ])
  const letters = [...new Set(names.docs.map((n) => (n.name as string)[0].toLowerCase()))]
  return [
    { url: absoluteUrl('/'), changeFrequency: 'daily', priority: 1 },
    { url: absoluteUrl('/coloring-pages'), changeFrequency: 'daily', priority: 0.8 },
    ...cats.docs.map((c) => ({ url: absoluteUrl(`/category/${c.slug}`), lastModified: c.updatedAt, priority: 0.8 })),
    ...pages.docs.map((p) => ({ url: absoluteUrl(`/coloring-pages/${p.slug}`), lastModified: p.updatedAt, priority: 0.7 })),
    ...(names.docs.length ? [{ url: absoluteUrl('/name-coloring-pages'), priority: 0.7 }] : []),
    ...letters.map((l) => ({ url: absoluteUrl(`/name-coloring-pages/letter/${l}`), priority: 0.4 })),
    ...names.docs.map((n) => ({ url: absoluteUrl(`/name-coloring-pages/${n.slug}`), lastModified: n.updatedAt, priority: 0.5 })),
  ]
}
