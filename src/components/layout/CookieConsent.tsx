'use client'

import { useState, useEffect } from 'react'
import {
  CONSENT_ACCEPTED,
  CONSENT_DECLINED,
  COOKIE_CONSENT_KEY,
  OPEN_COOKIE_SETTINGS_EVENT,
} from '@/lib/cookie-consent'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    clarity?: (...args: unknown[]) => void
  }
}

const COPY = {
  he: {
    dir: 'rtl' as const,
    aria: 'הסכמה לשימוש בעוגיות',
    title: 'אנו משתמשים בעוגיות (Cookies)',
    body: 'לשיפור חוויית המשתמש וניתוח תנועה באמצעות Google Analytics ו-Microsoft Clarity. ניתן לבטל את הסכמתכם בכל עת.',
    decline: 'דחיה',
    accept: 'אני מסכים',
    align: 'sm:text-right',
  },
  en: {
    dir: 'ltr' as const,
    aria: 'Cookie consent',
    title: 'We use cookies',
    body: 'To improve your experience and measure traffic with Google Analytics and Microsoft Clarity. You can withdraw consent at any time.',
    decline: 'Decline',
    accept: 'Accept',
    align: 'sm:text-left',
  },
}

export default function CookieConsent({ locale = 'he' }: { locale?: 'he' | 'en' }) {
  const copy = COPY[locale]
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // The GA tag itself is loaded in the root layout (Consent Mode v2) with
    // analytics_storage denied by default; this banner only flips consent.
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (stored !== CONSENT_ACCEPTED && stored !== CONSENT_DECLINED) setVisible(true)

    const openSettings = () => setVisible(true)
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings)
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings)
  }, [])

  // The Sienna launcher sits in the same bottom-left corner with an inline
  // z-index of 500000; this class lets globals.css tuck it under the banner
  // for as long as the banner is up.
  useEffect(() => {
    document.body.classList.toggle('cookie-banner-open', visible)
    return () => document.body.classList.remove('cookie-banner-open')
  }, [visible])

  function accept() {
    localStorage.setItem(COOKIE_CONSENT_KEY, CONSENT_ACCEPTED)
    setVisible(false)
    window.gtag?.('consent', 'update', { analytics_storage: 'granted' })
    window.clarity?.('consent')
  }

  function decline() {
    localStorage.setItem(COOKIE_CONSENT_KEY, CONSENT_DECLINED)
    setVisible(false)
    window.gtag?.('consent', 'update', { analytics_storage: 'denied' })
    window.clarity?.('consent', false)
  }

  return (
    <>
      {visible && (
        <div
          className="fixed bottom-0 left-0 right-0 z-[9999] px-4 py-4 md:px-8 md:py-5"
          style={{ background: 'rgba(255,255,255,0.97)', borderTop: '1px solid rgba(17,24,39,0.12)' }}
          dir={copy.dir}
          role="dialog"
          aria-label={copy.aria}
        >
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className={`text-center ${copy.align}`}>
              <p className="text-[#111827] font-semibold text-[15px] mb-0.5">
                {copy.title}
              </p>
              <p className="text-[#6b7280] text-[13px] leading-relaxed">
                {copy.body}
              </p>
            </div>

            <div className="flex gap-3 shrink-0">
              <button
                onClick={decline}
                className="px-5 py-2.5 text-[13px] font-semibold text-[#4b5563] hover:text-[#111827] border border-[#d1d5db] hover:border-[#9ca3af] transition-colors rounded-md"
              >
                {copy.decline}
              </button>
              <button
                onClick={accept}
                className="px-6 py-2.5 text-[13px] font-bold text-white rounded-md"
                style={{ background: 'linear-gradient(92.63deg, #2447D6 14.57%, #3E96F9 99.27%)' }}
              >
                {copy.accept}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
