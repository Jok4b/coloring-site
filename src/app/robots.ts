import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/print/', '/pdf/', '/search'] },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
