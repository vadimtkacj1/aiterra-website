import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import PageLoadSpinner from '@/components/layout/PageLoadSpinner'
import Providers from '@/components/layout/Providers'
import OrganizationSchema from '@/components/seo/OrganizationSchema'
import { SITE_NAME, SITE_URL } from '@/lib/seo'
import '../styles/globals.css'

// Force request-time rendering across the app segment (SSR).
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'AITERRA | שיווק דיגיטלי, בניית אתרים ופיתוח מתקדם',
    template: `%s | ${SITE_NAME}`,
  },
  description: 'מערכת 360° לצמיחה עסקית. פיתוח מתקרים, עיצוב UI/UX, קידום אורגני SEO.',
  applicationName: SITE_NAME,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'AITERRA | שיווק דיגיטלי, בניית אתרים ופיתוח מתקדם',
    description: 'מערכת 360° לצמיחה עסקית. פיתוח מתקרים, עיצוב UI/UX, קידום אורגני SEO.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AITERRA | שיווק דיגיטלי, בניית אתרים ופיתוח מתקדם',
    description: 'מערכת 360° לצמיחה עסקית. פיתוח מתקרים, עיצוב UI/UX, קידום אורגני SEO.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }],
    shortcut: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <OrganizationSchema />
        <PageLoadSpinner />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
