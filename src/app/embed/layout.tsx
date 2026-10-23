import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SITE_NAME, SITE_URL } from '@/lib/seo'
import '../../styles/globals.css'
import '../(he)/(site)/styles/v2.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  robots: { index: false, follow: true },
  icons: {
    icon: [{ url: '/favicon.ico?v=2', sizes: 'any' }],
  },
}

export default function EmbedLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
