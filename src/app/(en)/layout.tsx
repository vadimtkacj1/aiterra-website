import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Script from 'next/script'
import Providers from '@/components/layout/Providers'
import OrganizationSchema from '@/components/seo/OrganizationSchema'
import CookieConsent from '@/components/layout/CookieConsent'
import { SITE_NAME, SITE_URL } from '@/lib/seo'
import '../../styles/globals.css'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'AITERRA - Custom Web Development and SEO Agency',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Aiterra builds custom websites and web platforms in code, then ranks them. Full-stack engineering, SEO and website promotion from one in-house team.',
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: SITE_NAME,
    images: [{ url: '/images/og/og-aiterra-v2.png', width: 1200, height: 630, alt: 'AITERRA' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/og/og-aiterra-v2.png'],
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
    icon: [{ url: '/favicon.ico?v=2', sizes: 'any' }],
    shortcut: '/favicon.ico?v=2',
  },
}

export default function EnRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preload" as="font" type="font/woff2" href="/fonts/GoogleSans/GoogleSans-VariableFont_wght.woff2" crossOrigin="anonymous" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/TelAviv-BrutalistBold.woff2" crossOrigin="anonymous" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/TelAviv-ModernistRegular.woff2" crossOrigin="anonymous" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/TelAviv-ModernistBold.woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <div
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
<div id="page-loader" aria-hidden="true">
  <img src="/icons/logo-v2.svg" alt="" width="120" height="120" />
</div>
<noscript><style>#page-loader{display:none}</style></noscript>
<script>(function(){
  var el = document.getElementById('page-loader');
  if (!el) return;
  var hidden = false;
  function hide() {
    if (hidden) return;
    hidden = true;
    el.classList.add('page-loader--done');
    setTimeout(function () { el.style.display = 'none'; }, 500);
  }
  if (document.readyState !== 'loading') hide();
  else document.addEventListener('DOMContentLoaded', hide, { once: true });
  setTimeout(hide, 1200);
  window.addEventListener('pageshow', function (e) { if (e.persisted) hide(); });
})();</script>`,
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-white focus:text-[#2447D6] focus:font-bold focus:rounded focus:shadow-lg"
        >
          Skip to main content
        </a>
        <Script
          src="https://website-widgets.pages.dev/dist/sienna.min.js"
          strategy="lazyOnload"
        />
        <Script id="microsoft-clarity" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "wjb2tel6du");`}
        </Script>
        {GA_ID && (
          <>
            <Script id="ga-consent-default" strategy="beforeInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              var granted = false;
              try { granted = localStorage.getItem('cookie-consent') === 'accepted'; } catch (e) {}
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: granted ? 'granted' : 'denied',
                wait_for_update: 500,
              });
            `}</Script>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="lazyOnload"
            />
            <Script id="ga-init" strategy="lazyOnload">{`
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}</Script>
          </>
        )}
        <OrganizationSchema />
        <Providers>{children}</Providers>
        <CookieConsent locale="en" />
      </body>
    </html>
  )
}
