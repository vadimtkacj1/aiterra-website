'use client'

import { useEffect, useRef } from 'react'

/**
 * Thin flat-accent scroll-progress bar pinned to the top of the viewport
 * (solid colour + glow shadow via `.scroll-progress` in globals.css — no
 * gradient). Uses a rAF-throttled passive scroll listener and scaleX for
 * cheap updates.
 */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let queued = false
    const update = () => {
      queued = false
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const p = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0
      el.style.transform = `scaleX(${p.toFixed(4)})`
    }
    const onScroll = () => {
      if (!queued) {
        queued = true
        requestAnimationFrame(update)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return <div ref={ref} aria-hidden className="scroll-progress" style={{ transform: 'scaleX(0)' }} />
}
