'use client'

import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

const noop = () => {}

type AutoplayOptions = {
  delay?: number
  enabled?: boolean
  holdOnHover?: boolean
}

export default function useAutoplay(
  ref: RefObject<HTMLElement | null>,
  step: () => void,
  { delay = 5000, enabled = true, holdOnHover = true }: AutoplayOptions = {},
) {
  const stepRef = useRef(step)
  const restartRef = useRef<() => void>(noop)

  useEffect(() => {
    stepRef.current = step
  })

  useEffect(() => {
    const host = ref.current
    if (!host || !enabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let timer = 0
    let onScreen = false
    let held = false

    const stop = () => {
      if (timer) window.clearTimeout(timer)
      timer = 0
    }

    const start = () => {
      stop()
      if (!onScreen || held || document.hidden) return
      timer = window.setTimeout(() => {
        timer = 0
        stepRef.current()
        start()
      }, delay)
    }

    const hold = () => {
      held = true
      stop()
    }

    const release = () => {
      held = false
      start()
    }

    const observer = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0].isIntersecting
        start()
      },
      { threshold: 0.25 },
    )
    observer.observe(host)
    restartRef.current = start

    if (holdOnHover) {
      host.addEventListener('pointerenter', hold)
      host.addEventListener('pointerleave', release)
    }
    host.addEventListener('focusin', hold)
    host.addEventListener('focusout', release)
    host.addEventListener('touchstart', hold, { passive: true })
    host.addEventListener('touchend', release, { passive: true })
    host.addEventListener('wheel', start, { passive: true })
    document.addEventListener('visibilitychange', start)

    return () => {
      stop()
      restartRef.current = noop
      observer.disconnect()
      host.removeEventListener('pointerenter', hold)
      host.removeEventListener('pointerleave', release)
      host.removeEventListener('focusin', hold)
      host.removeEventListener('focusout', release)
      host.removeEventListener('touchstart', hold)
      host.removeEventListener('touchend', release)
      host.removeEventListener('wheel', start)
      document.removeEventListener('visibilitychange', start)
    }
  }, [ref, enabled, delay, holdOnHover])

  return restartRef
}
