'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import { cn } from '@/lib/ecomerce/utils'

interface NumberTickerProps {
  value: number
  delay?: number
  decimalPlaces?: number
  prefix?: string
  suffix?: string
  className?: string
  style?: CSSProperties
}

function format(value: number, decimalPlaces: number) {
  return Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(Number(value.toFixed(decimalPlaces)))
}

/**
 * Counts a number up when it scrolls into view.
 *
 * The rendered fallback is the FINAL value, not zero. These numbers are the
 * page's claims — "12 months of support", "100% custom" — so a copy of the
 * page with no JS, a failed hydration, or a crawler must never be left
 * asserting "0 months" and "0% custom". The count-up is an enhancement layered
 * on top of a figure that is already correct, and it is skipped outright when
 * the reader has asked for reduced motion.
 *
 * Driven by a rAF ease rather than a spring library: one counter does not earn
 * an animation dependency in the host app's bundle. easeOutCubic lands softly
 * on the target, which reads the same as the old spring's settle.
 */
export default function NumberTicker({
  value,
  delay = 0,
  decimalPlaces = 0,
  prefix = '',
  suffix = '',
  className,
  style,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const DURATION = 1400
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
    let raf = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    let start = 0

    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min(1, (ts - start) / DURATION)
      el.textContent = `${prefix}${format(value * easeOutCubic(p), decimalPlaces)}${suffix}`
      if (p < 1) raf = requestAnimationFrame(step)
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          io.unobserve(entry.target)
          // reset to zero, then count up after the requested delay
          el.textContent = `${prefix}${format(0, decimalPlaces)}${suffix}`
          timer = setTimeout(() => {
            start = 0
            raf = requestAnimationFrame(step)
          }, delay * 1000)
        })
      },
      { threshold: 0, rootMargin: '0px' }
    )
    io.observe(el)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      if (timer) clearTimeout(timer)
    }
  }, [value, delay, decimalPlaces, prefix, suffix])

  return (
    <span ref={ref} className={cn('inline-block tabular-nums', className)} style={style}>
      {prefix}
      {format(value, decimalPlaces)}
      {suffix}
    </span>
  )
}
