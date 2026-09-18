import Link from 'next/link'
import React from 'react'
import { SearchBox } from '@/components/site/SearchBox'

export default function NotFound() {
  return (
    <div className="wrap" style={{ padding: '56px 20px', maxWidth: 680 }}>
      <h1>This page isn’t here</h1>
      <p>It may have moved or been removed. Search for what you wanted to color, or <Link href="/">go to the home page</Link>.</p>
      <SearchBox big />
    </div>
  )
}
