'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function CookieConsent() {
  const [consent, setConsent] = useState<'accepted' | 'declined' | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('cookie-consent') as 'accepted' | 'declined' | null
    setConsent(stored)
    if (!stored) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('cookie-consent', 'accepted')
    setConsent('accepted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem('cookie-consent', 'declined')
    setConsent('declined')
    setVisible(false)
  }

  return (
    <>
      {consent === 'accepted' && GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { anonymize_ip: true });
          `}</Script>
        </>
      )}

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
