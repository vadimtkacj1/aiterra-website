'use client'

import { useState, useEffect } from 'react'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // The GA tag itself is loaded in the root layout (Consent Mode v2) with
    // analytics_storage denied by default; this banner only flips consent.
    const stored = localStorage.getItem('cookie-consent')
    if (!stored) setVisible(true)
  }, [])

  // The Sienna launcher sits in the same bottom-left corner with an inline
  // z-index of 500000; this class lets globals.css tuck it under the banner
  // for as long as the banner is up.
  useEffect(() => {
    document.body.classList.toggle('cookie-banner-open', visible)
    return () => document.body.classList.remove('cookie-banner-open')
  }, [visible])

  function accept() {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
    window.gtag?.('consent', 'update', { analytics_storage: 'granted' })
  }

  function decline() {
    localStorage.setItem('cookie-consent', 'declined')
    setVisible(false)
    window.gtag?.('consent', 'update', { analytics_storage: 'denied' })
  }

  return (
    <>
      {visible && (
        <div
          className="fixed bottom-0 left-0 right-0 z-[9999] px-4 py-4 md:px-8 md:py-5"
          style={{ background: 'rgba(255,255,255,0.97)', borderTop: '1px solid rgba(17,24,39,0.12)' }}
          dir="rtl"
          role="dialog"
          aria-label="הסכמה לשימוש בעוגיות"
        >
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-right">
              <p className="text-[#111827] font-semibold text-[15px] mb-0.5">
                אנו משתמשים בעוגיות (Cookies)
              </p>
              <p className="text-[#6b7280] text-[13px] leading-relaxed">
                לשיפור חווית המשתמש וניתוח תנועה באמצעות Google Analytics.{' '}
                ניתן לבטל את הסכמתכם בכל עת.
              </p>
            </div>

            <div className="flex gap-3 shrink-0">
              <button
                onClick={decline}
                className="px-5 py-2.5 text-[13px] font-semibold text-[#4b5563] hover:text-[#111827] border border-[#d1d5db] hover:border-[#9ca3af] transition-colors rounded-md"
              >
                דחיה
              </button>
              <button
                onClick={accept}
                className="px-6 py-2.5 text-[13px] font-bold text-white rounded-md"
                style={{ background: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)' }}
              >
                אני מסכים
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
