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

    const whenLoaded = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') resolve()
      else window.addEventListener('load', () => resolve(), { once: true })
    })

    void Promise.all([whenLoaded, document.fonts.ready]).then(hide)

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
    const t = window.setTimeout(() => setRender(false), 400)
    return () => window.clearTimeout(t)
  }, [visible])

  if (!render) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-[#080112] transition-opacity duration-300 ease-out ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-busy={visible}
      aria-label="טוען את האתר"
    >
      <div
        className="h-14 w-14 animate-spin rounded-full border-2 border-white/15 border-l-[#530FAD] border-t-transparent [animation-duration:0.85s]"
        role="presentation"
      />
      <p className="text-sm font-medium text-white/70" dir="rtl">
        טוען…
      </p>
    </div>
  )
}
