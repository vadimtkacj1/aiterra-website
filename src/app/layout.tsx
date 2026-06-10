import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Script from 'next/script'
import Providers from '@/components/layout/Providers'
import OrganizationSchema from '@/components/seo/OrganizationSchema'
import WebSiteSchema from '@/components/seo/WebSiteSchema'
import CookieConsent from '@/components/layout/CookieConsent'
import { SITE_NAME, SITE_URL } from '@/lib/seo'
import '../styles/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'AITERRA | שיווק דיגיטלי, בניית אתרים ופיתוח מתקדם',
    template: `%s | ${SITE_NAME}`,
  },
  description: 'סוכנות AITERRA מציעה מערכת 360° לצמיחה עסקית: בניית אתרים מתקדמת, קידום אורגני SEO, פרסום ממומן ואוטומציה עסקית. ייעוץ חינם – השאירו פרטים!',
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
    description: 'סוכנות AITERRA מציעה מערכת 360° לצמיחה עסקית: בניית אתרים מתקדמת, קידום אורגני SEO, פרסום ממומן ואוטומציה עסקית. ייעוץ חינם – השאירו פרטים!',
    images: [{ url: '/images/hero/hero-aiterra.png', width: 1200, height: 630, alt: 'AITERRA' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AITERRA | שיווק דיגיטלי, בניית אתרים ופיתוח מתקדם',
    description: 'סוכנות AITERRA מציעה מערכת 360° לצמיחה עסקית: בניית אתרים מתקדמת, קידום אורגני SEO, פרסום ממומן ואוטומציה עסקית. ייעוץ חינם – השאירו פרטים!',
    images: ['/images/hero/hero-aiterra.png'],
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
      <head>
        <link rel="preload" as="font" type="font/woff2" href="/fonts/TelAviv-BrutalistRegular.woff2" crossOrigin="anonymous" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/TelAviv-ModernistRegular.woff2" crossOrigin="anonymous" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/Heebo/Heebo-VariableFont_wght.woff2" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-white focus:text-[#1B1BB3] focus:font-bold focus:rounded focus:shadow-lg"
        >
          דלגו לתוכן הראשי
        </a>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "wjb2tel6du");`}
        </Script>
        <OrganizationSchema />
        <WebSiteSchema />
        <Providers>{children}</Providers>
        <CookieConsent />
      </body>
    </html>
  )
}
