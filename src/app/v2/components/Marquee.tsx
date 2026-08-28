'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, type ReactNode } from 'react'
import styles from './Marquee.module.css'

export type MarqueeHandle = {
  nudge: (px: number) => void
}

type MarqueeProps = {
  direction: 'left' | 'right'
  speed?: number
  highlightCenter?: boolean
  className?: string
  groupClassName?: string
  children: ReactNode
}

const COPIES = [0, 1, 2, 3]
const NUDGE_SPEED = 600

const Marquee = forwardRef<MarqueeHandle, MarqueeProps>(function Marquee(
  { direction, speed = 24, highlightCenter = false, className, groupClassName, children },
  ref,
) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const laneRef = useRef<HTMLDivElement>(null)
  const motion = useRef({ offset: 0, pending: 0, paused: false, hidden: false })

  useImperativeHandle(
    ref,
    () => ({
      nudge: (px) => {
        motion.current.pending += px
      },
    }),
    [],
  )

  useEffect(() => {
    const viewport = viewportRef.current
    const lane = laneRef.current
    if (!viewport || !lane) return

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const sign = direction === 'right' ? 1 : -1
    const groups = Array.from(lane.children) as HTMLElement[]

    const copyWidth = () => {
      const [first, second] = groups
      if (!first || !second) return 0
      return Math.abs(second.getBoundingClientRect().left - first.getBoundingClientRect().left)
    }

    const markCenter = () => {
      const middle = viewport.getBoundingClientRect().left + viewport.clientWidth / 2
      let nearest: Element | null = null
      let smallest = Infinity
      const items = groups.flatMap((group) => Array.from(group.children))
      for (const item of items) {
        const box = item.getBoundingClientRect()
        const distance = Math.abs(box.left + box.width / 2 - middle)
        if (distance < smallest) {
          smallest = distance
          nearest = item
        }
      }
      for (const item of items) {
        if (item === nearest) item.setAttribute('data-center', '')
        else item.removeAttribute('data-center')
      }
    }

    const paint = () => {
      const width = copyWidth()
      if (!width) return
      const state = motion.current
      const shift = ((state.offset % width) + width) % width
      lane.style.transform = `translateX(${shift}px)`
      if (highlightCenter) markCenter()
    }

    let last = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const elapsed = Math.min(64, now - last)
      last = now
      const state = motion.current
      if (!calm && !state.paused && !state.hidden) state.offset += (sign * speed * elapsed) / 1000
      if (state.pending) {
        const step = Math.sign(state.pending) * Math.min(Math.abs(state.pending), (NUDGE_SPEED * elapsed) / 1000)
        state.offset += sign * step
        state.pending -= step
      }
      paint()
      frame = requestAnimationFrame(tick)
    }

    const pause = () => {
      motion.current.paused = true
    }
    const resume = () => {
      motion.current.paused = false
    }

    viewport.addEventListener('pointerenter', pause)
    viewport.addEventListener('pointerleave', resume)
    viewport.addEventListener('focusin', pause)
    viewport.addEventListener('focusout', resume)
    frame = requestAnimationFrame(tick)

    const visibility = new IntersectionObserver((entries) => {
      motion.current.hidden = !entries.some((entry) => entry.isIntersecting)
    })
    visibility.observe(viewport)

    return () => {
      visibility.disconnect()
      cancelAnimationFrame(frame)
      viewport.removeEventListener('pointerenter', pause)
      viewport.removeEventListener('pointerleave', resume)
      viewport.removeEventListener('focusin', pause)
      viewport.removeEventListener('focusout', resume)
    }
  }, [direction, speed, highlightCenter])

  return (
    <div ref={viewportRef} className={[styles.viewport, className].filter(Boolean).join(' ')}>
      <div ref={laneRef} className={styles.lane}>
        {COPIES.map((copy) => (
          <div
            key={copy}
            className={[styles.group, groupClassName].filter(Boolean).join(' ')}
            aria-hidden={copy > 0 || undefined}
            inert={copy > 0 || undefined}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  )
})

export default Marquee
