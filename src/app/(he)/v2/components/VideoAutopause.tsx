'use client'

import { useEffect } from 'react'

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
  cancelIdleCallback?: (handle: number) => void
}

export default function VideoAutopause() {
  useEffect(() => {
    const root = document.querySelector('.v2Root')
    if (!root || !('IntersectionObserver' in window)) return

    const videos = Array.from(
      root.querySelectorAll<HTMLVideoElement>('video[autoplay], video[data-autoplay]'),
    )
    if (videos.length === 0) return

    const win = window as IdleWindow
    let observer: IntersectionObserver | undefined
    let idleHandle: number | undefined
    let timerHandle: ReturnType<typeof setTimeout> | undefined
    let cancelled = false

    const start = () => {
      if (cancelled) return
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const video = entry.target as HTMLVideoElement
            if (entry.isIntersecting) {
              video.play().catch(() => undefined)
            } else if (!video.paused) {
              video.pause()
            }
          }
        },
        { rootMargin: '200px 0px', threshold: 0 },
      )
      videos.forEach((video) => observer?.observe(video))
    }

    const schedule = () => {
      if (cancelled) return
      if (typeof win.requestIdleCallback === 'function') {
        idleHandle = win.requestIdleCallback(start, { timeout: 3000 })
      } else {
        timerHandle = setTimeout(start, 1200)
      }
    }

    if (document.readyState === 'complete') {
      schedule()
    } else {
      window.addEventListener('load', schedule, { once: true })
    }

    return () => {
      cancelled = true
      window.removeEventListener('load', schedule)
      if (idleHandle !== undefined && typeof win.cancelIdleCallback === 'function') {
        win.cancelIdleCallback(idleHandle)
      }
      if (timerHandle !== undefined) clearTimeout(timerHandle)
      observer?.disconnect()
    }
  }, [])

  return null
}
