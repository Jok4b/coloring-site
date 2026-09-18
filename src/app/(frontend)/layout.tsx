import type { Metadata } from 'next'
import React from 'react'
import '@fontsource/fredoka/500.css'
import '@fontsource/fredoka/600.css'
import '@fontsource/fredoka/700.css'
import '@fontsource/atkinson-hyperlegible/400.css'
import '@fontsource/atkinson-hyperlegible/700.css'
import './styles.css'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { getSettings } from '@/lib/payload'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${s.siteName}: free printable coloring pages`, template: `%s | ${s.siteName}` },
    description: s.homeDescription,
    openGraph: { siteName: s.siteName, type: 'website' },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings()
  return (
    <html lang="en">
      <body>
        <Header siteName={s.siteName} />
        <main>{children}</main>
        <Footer siteName={s.siteName} text={s.footerText} />
      </body>
    </html>
  )
}
