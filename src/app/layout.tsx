import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Script from 'next/script'
import Providers from '@/components/layout/Providers'
import OrganizationSchema from '@/components/seo/OrganizationSchema'
import CookieConsent from '@/components/layout/CookieConsent'
import { SITE_NAME, SITE_URL } from '@/lib/seo'
import '../styles/globals.css'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'AITERRA – שיווק דיגיטלי, בניית אתרים ופיתוח מתקדם',
    template: `%s | ${SITE_NAME}`,
  },
  description: 'סוכנות AITERRA מציעה מערכת 360° לצמיחה עסקית: בניית אתרים מתקדמת, קידום אורגני SEO, פרסום ממומן ואוטומציה עסקית. ייעוץ חינם – השאירו פרטים!',
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'AITERRA | שיווק דיגיטלי, בניית אתרים ופיתוח מתקדם',
    description: 'סוכנות AITERRA מציעה מערכת 360° לצמיחה עסקית: בניית אתרים מתקדמת, קידום אורגני SEO, פרסום ממומן ואוטומציה עסקית. ייעוץ חינם – השאירו פרטים!',
    images: [{ url: '/images/og/og-aiterra-v2.png', width: 1200, height: 630, alt: 'AITERRA' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AITERRA | שיווק דיגיטלי, בניית אתרים ופיתוח מתקדם',
    description: 'סוכנות AITERRA מציעה מערכת 360° לצמיחה עסקית: בניית אתרים מתקדמת, קידום אורגני SEO, פרסום ממומן ואוטומציה עסקית. ייעוץ חינם – השאירו פרטים!',
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        {/* Preload only the fonts that paint above the fold on (almost) every
            route: headings (Brutalist Bold), body (Modernist Regular) and nav
            (Modernist Bold). Brutalist Regular + Heebo load via font-display:
            swap; Heebo is preloaded per-route where it's actually used (home/
            about/contact heroes). Fewer preloads = less bandwidth contention
            with the LCP image on slow connections. */}
        <link rel="preload" as="font" type="font/woff2" href="/fonts/TelAviv-BrutalistBold.woff2" crossOrigin="anonymous" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/TelAviv-ModernistRegular.woff2" crossOrigin="anonymous" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/TelAviv-ModernistBold.woff2" crossOrigin="anonymous" />
      </head>
      <body>
        {/* Full-page splash while the page loads. Server-rendered inside
            dangerouslySetInnerHTML so React never reconciles it — the inline
            script below can hide it without fighting hydration. Hides on
            window load, hard-capped at 2.5s so it can never trap the user;
            bfcache restores (pageshow) hide it instantly. */}
        <div
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
  if (document.readyState === 'complete') hide();
  else window.addEventListener('load', hide, { once: true });
  setTimeout(hide, 2500);
  window.addEventListener('pageshow', function (e) { if (e.persisted) hide(); });
})();</script>`,
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-white focus:text-[#2447D6] focus:font-bold focus:rounded focus:shadow-lg"
        >
          דלגו לתוכן הראשי
        </a>
        {/* Sienna accessibility widget (open source) — floating a11y menu
            (contrast, text size, stop animations, screen-reader hints etc.).
            Renders in Hebrew via html lang="he". lazyOnload: the button is
            not part of the initial paint, so keep it off the LCP path. */}
        <Script
          src="https://website-widgets.pages.dev/dist/sienna.min.js"
          strategy="lazyOnload"
        />
        <Script id="microsoft-clarity" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "wjb2tel6du");`}
        </Script>
        {GA_ID && (
          <>
            {/* Google Analytics 4 — Consent Mode v2. The tag loads on every page
                (so GA is always present and collecting), but analytics_storage is
                'denied' by default until the visitor accepts the cookie banner
                (CookieConsent calls gtag('consent','update')). Returning visitors
                who already accepted are granted immediately via the localStorage
                check below. This replaces the old accept-gated loader that left
                GA absent for the ~80% who never clicked the banner. */}
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
            {/* gtag.js (~176KB) is decorative-invisible analytics — defer it to
                lazyOnload (browser idle, after window.load) so its bytes don't
                compete with the LCP poster + fonts on slow mobile. Consent still
                works: the beforeInteractive stub above defines window.gtag and
                queues consent/config into dataLayer, which gtag.js drains when it
                finally loads (incl. a CookieConsent accept fired before then). */}
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
        <CookieConsent />
      </body>
    </html>
  )
}
