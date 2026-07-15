'use client'

import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react'

type WireSceneProps = {
  children: ReactNode
  /** aspect ratio of the drawing's frame, e.g. "4 / 3" */
  ratio?: string
  /**
   * How scroll progress is measured. The two cases are genuinely different:
   *
   * `page` — the drawing is already on screen at load (the hero). Measuring it
   * against viewport entry would report it half-travelled before the reader has
   * scrolled at all, so it would greet them half-assembled and lose the
   * exploded state entirely. Progress runs off the page's own scroll instead.
   *
   * `view` — the drawing arrives from below. Progress runs off its travel
   * through the viewport, and it finishes assembling as it reaches the middle
   * rather than on its way out the top.
   */
  mode?: 'page' | 'view'
  className?: string
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

/**
 * The stage every wireframe object stands on.
 *
 * It tracks how far the drawing has travelled through the viewport and writes
 * that as `--p` (0 → 1) and `--explode` (1 → 0). The objects scale each part's
 * Z by `--explode`, so scrolling **assembles** them: the storefront comes
 * together, the modules gather into the box. That is the whole point — the page
 * says "Built to Sell", and the drawings build themselves while you read it.
 *
 * Driven from a scroll listener rather than CSS `animation-timeline`, which
 * would have to hide behind an `@supports` guard — and Lightning CSS silently
 * prunes guards it does not recognise (we already lost the hero's text-stroke
 * that way). A rAF-throttled listener works in every browser and cannot be
 * optimised away.
 *
 * Under `prefers-reduced-motion` the listener never attaches and the object
 * simply holds a composed pose: no scroll-linked movement, no idle turn.
 */
export default function WireScene({
  children,
  ratio = '4 / 3',
  mode = 'view',
  className = '',
}: WireSceneProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduced.matches) {
      // A composed, half-open pose — readable as a drawing, and static.
      el.style.setProperty('--p', '0.35')
      el.style.setProperty('--explode', '0.65')
      return
    }

    let frame = 0
    const update = () => {
      frame = 0
      const vh = window.innerHeight || 1
      let p: number
      if (mode === 'page') {
        // Assembles over roughly the first screenful of scrolling.
        p = clamp01(window.scrollY / (vh * 0.8))
      } else {
        const r = el.getBoundingClientRect()
        // Doubled so the drawing is fully assembled by the time it reaches the
        // middle of the viewport, not as it disappears off the top.
        p = clamp01(((vh - r.top) / (vh + r.height)) * 2)
      }
      el.style.setProperty('--p', p.toFixed(4))
      el.style.setProperty('--explode', (1 - p).toFixed(4))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [mode])

  return (
    <div
      ref={ref}
      aria-hidden
      className={`wire-scene ${className}`}
      style={{ aspectRatio: ratio } as CSSProperties}
    >
      <div className="wire-stack">{children}</div>
    </div>
  )
}
