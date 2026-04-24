import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import PageLoadSpinner from '@/components/layout/PageLoadSpinner'
import Providers from '@/components/layout/Providers'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'AITERRA | שיווק דיגיטלי, בניית אתרים ופיתוח מתקדם',
  description: 'מערכת 360° לצמיחה עסקית. פיתוח מתקרים, עיצוב UI/UX, קידום אורגני SEO.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
      </head>
      <body>
        <PageLoadSpinner />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
