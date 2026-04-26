import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import PageLoadSpinner from '@/components/layout/PageLoadSpinner'
import Providers from '@/components/layout/Providers'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'AITERRA | שיווק דיגיטלי, בניית אתרים ופיתוח מתקדם',
  description: 'מערכת 360° לצמיחה עסקית. פיתוח מתקרים, עיצוב UI/UX, קידום אורגני SEO.',
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }],
    shortcut: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <PageLoadSpinner />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
