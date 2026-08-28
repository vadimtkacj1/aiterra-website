'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './StatValue.module.css'

type StatValueProps = {
  value: string
  delay?: number
  duration?: number
  className?: string
}

const DIGITS = '0123456789'.split('')
const ROUNDS = 3
const COLUMN_STAGGER = 120
const STRIP = Array.from({ length: ROUNDS + 1 }, () => DIGITS).flat()
const SPARKS = [-150, -110, -70, -30, 30, 70, 110, 150]

const parse = (value: string) => {
  const match = /^(\D*)(\d+)(\D*)$/.exec(value.trim())
  if (!match) return null
  return { prefix: match[1], digits: match[2].split('').map(Number), suffix: match[3] }
}

const easeOutQuint = (t: number) => 1 - (1 - t) ** 5

export default function StatValue({ value, delay = 0, duration = 2000, className }: StatValueProps) {
  const parts = useMemo(() => parse(value), [value])
  const ref = useRef<HTMLParagraphElement>(null)
  const stripsRef = useRef<Array<HTMLSpanElement | null>>([])
  const [phase, setPhase] = useState<'idle' | 'run' | 'done'>('idle')

  useEffect(() => {
    const element = ref.current
    if (!element || !parts) return

    const strips = stripsRef.current.filter(Boolean) as HTMLSpanElement[]
    const count = strips.length
    const finalIndex = (column: number) => {
      const fromRight = count - 1 - column
      return (ROUNDS - Math.min(fromRight, ROUNDS - 1)) * 10 + parts.digits[column]
    }
    const place = (strip: HTMLSpanElement, position: number) => {
      strip.style.transform = `translate3d(0, ${(-position).toFixed(4)}em, 0)`
    }
    const settle = () => {
      strips.forEach((strip, column) => place(strip, finalIndex(column)))
      setPhase('done')
    }

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (calm || !('IntersectionObserver' in window)) {
      settle()
      return
    }

    let frame = 0
    let timer: ReturnType<typeof setTimeout>

    const run = () => {
      setPhase('run')
      const start = performance.now()
      const tick = (now: number) => {
        let finished = true
        strips.forEach((strip, column) => {
          const fromRight = count - 1 - column
          const progress = Math.min(1, Math.max(0, (now - start - fromRight * COLUMN_STAGGER) / duration))
          if (progress < 1) finished = false
          place(strip, finalIndex(column) * easeOutQuint(progress))
        })
        if (finished) settle()
        else frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        timer = setTimeout(run, delay)
      },
      { threshold: 0.4 },
    )

    observer.observe(element)
    return () => {
      observer.disconnect()
      clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [parts, delay, duration])

  if (!parts) {
    return <p className={className}>{value}</p>
  }

  return (
    <p ref={ref} className={[styles.value, className].filter(Boolean).join(' ')} data-phase={phase}>
      <span className={styles.figure} aria-hidden="true">
        {parts.prefix ? <span className={styles.affix}>{parts.prefix}</span> : null}
        {parts.digits.map((digit, column) => (
          <span key={column} className={styles.column}>
            <span
              ref={(node) => {
                stripsRef.current[column] = node
              }}
              className={styles.strip}
            >
              {STRIP.map((glyph, index) => (
                <span key={index} className={styles.glyph}>
                  {glyph}
                </span>
              ))}
            </span>
          </span>
        ))}
        {parts.suffix ? <span className={styles.affix}>{parts.suffix}</span> : null}
      </span>
      <span className={styles.sparks} aria-hidden="true">
        {SPARKS.map((angle, index) => (
          <span
            key={angle}
            className={styles.spark}
            style={{ '--angle': `${angle}deg`, '--spark-delay': `${index * 30}ms` } as React.CSSProperties}
          />
        ))}
      </span>
      <span className={styles.srOnly}>{value}</span>
    </p>
  )
}
