'use client'

import { useEffect, useState } from 'react'

export default function PageLoadSpinner() {
  const [visible, setVisible] = useState(true)
  const [render, setRender] = useState(true)

  useEffect(() => {
    let cancelled = false
    const start = performance.now()

    // Spin until the page has fully loaded (window 'load' = all critical
    // assets in). MIN avoids a jarring flicker on instant loads; MAX is a
    // safety cap so the overlay can never get stuck covering the content.
    const MIN_MS = 500
    const MAX_MS = 5000

    const hide = () => {
      if (!cancelled) setVisible(false)
    }

    const onLoaded = () => {
      const elapsed = performance.now() - start
      window.setTimeout(hide, Math.max(0, MIN_MS - elapsed))
    }

    if (document.readyState === 'complete') onLoaded()
    else window.addEventListener('load', onLoaded, { once: true })

    const maxTimer = window.setTimeout(hide, MAX_MS)

    return () => {
      cancelled = true
      window.clearTimeout(maxTimer)
      window.removeEventListener('load', onLoaded)
    }
  }, [])

  useEffect(() => {
    if (!visible) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [visible])

  useEffect(() => {
    if (visible) return
    const t = window.setTimeout(() => setRender(false), 500)
    return () => window.clearTimeout(t)
  }, [visible])

  if (!render) return null

  return (
    <>
      {/* No-JS clients & crawlers without a JS renderer never run the hide
          effect, so make sure the overlay is hidden for them — the content
          underneath is fully server-rendered and stays in the DOM either way.
          dangerouslySetInnerHTML keeps the noscript body a single raw node so
          React doesn't hit a hydration mismatch. */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: '<style>.page-load-overlay{display:none!important}</style>',
        }}
      />
      <style>{`
        .abstergo-wrap {
          --primary: #fff;
          --secondary: rgba(255,255,255,0.3);
          --shadow-blur: 3px;
          --text-shadow-blur: 3px;
          --animation-duration: 2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          row-gap: 30px;
        }
        .abstergo-wrap .ui-text {
          color: var(--primary);
          text-shadow: 0 0 var(--text-shadow-blur) var(--secondary);
          font-family: Menlo, monospace;
          display: flex;
          align-items: baseline;
          column-gap: 3px;
          font-size: 14px;
          letter-spacing: 0.05em;
        }
        .abstergo-wrap .ui-dot {
          display: block;
          width: 3px;
          height: 3px;
          animation: abstergo-dots var(--animation-duration) infinite linear;
          animation-delay: .4s;
          background-color: var(--primary);
        }
        .abstergo-wrap .ui-dot:nth-child(2) { animation-delay: .8s; }
        .abstergo-wrap .ui-dot:nth-child(3) { animation-delay: 1.2s; }
        .abstergo-wrap .ui-dot + .ui-dot { margin-left: 3px; }

        .abstergo-loader {
          width: 103px;
          height: 90px;
          position: relative;
          box-sizing: content-box;
        }
        .abstergo-loader div {
          width: 50px;
          border-right: 12px solid transparent;
          border-left: 12px solid transparent;
          border-top: 21px solid var(--primary);
          position: absolute;
          filter: drop-shadow(0 0 var(--shadow-blur) var(--secondary));
          box-sizing: content-box;
        }
        .abstergo-loader div:nth-child(1) {
          top: 27px; left: 7px; rotate: -60deg;
          animation: abstergo-line1 var(--animation-duration) linear infinite alternate;
        }
        .abstergo-loader div:nth-child(2) {
          bottom: 2px; left: 0; rotate: 180deg;
          animation: abstergo-line2 var(--animation-duration) linear infinite alternate;
        }
        .abstergo-loader div:nth-child(3) {
          bottom: 16px; right: -9px; rotate: 60deg;
          animation: abstergo-line3 var(--animation-duration) linear infinite alternate;
        }

        @keyframes abstergo-line1 {
          0%,40%  { top: 27px; left: 7px;  rotate: -60deg; }
          60%,100%{ top: 22px; left: 14px; rotate: 60deg;  }
        }
        @keyframes abstergo-line2 {
          0%,40%  { bottom: 2px; left: 0;  rotate: 180deg; }
          60%,100%{ bottom: 5px; left: -8px; rotate: 300deg; }
        }
        @keyframes abstergo-line3 {
          0%,40%  { bottom: 16px; right: -9px;  rotate: 60deg;  }
          60%,100%{ bottom: 7px;  right: -11px; rotate: 180deg; }
        }
        @keyframes abstergo-dots {
          0%       { background-color: var(--secondary); }
          30%      { background-color: var(--primary);   }
          70%,100% { background-color: var(--secondary); }
        }
      `}</style>

      <div
        className={`page-load-overlay fixed inset-0 z-9999 flex items-center justify-center bg-[#080112] transition-opacity duration-500 ease-out ${
          visible ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        role="status"
        aria-busy={visible}
        aria-live="polite"
        aria-label="טוען את האתר"
      >
        <div className="abstergo-wrap">
          <div className="abstergo-loader">
            <div />
            <div />
            <div />
          </div>
          <div className="ui-text" dir="rtl">
            סנכרון
            <div className="ui-dot" />
            <div className="ui-dot" />
            <div className="ui-dot" />
          </div>
        </div>
      </div>
    </>
  )
}
