'use client'

import { useEffect, useState } from 'react'

export default function PageLoadSpinner() {
  const [visible, setVisible] = useState(true)
  const [render, setRender] = useState(true)

  useEffect(() => {
    let cancelled = false

    const hide = () => {
      if (!cancelled) setVisible(false)
    }

    const timeout = new Promise<void>((resolve) => setTimeout(resolve, 800))

    const whenLoaded = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') resolve()
      else window.addEventListener('load', () => resolve(), { once: true })
    })

    void Promise.race([whenLoaded, timeout]).then(hide)

    return () => {
      cancelled = true
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
        className={`fixed inset-0 z-9999 flex items-center justify-center bg-[#080112] transition-opacity duration-500 ease-out ${
          visible ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-busy={visible}
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
