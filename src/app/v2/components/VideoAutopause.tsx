'use client'

import { useEffect } from 'react'

export default function VideoAutopause() {
  useEffect(() => {
    const root = document.querySelector('.v2Root')
    if (!root || !('IntersectionObserver' in window)) return

    const videos = Array.from(root.querySelectorAll<HTMLVideoElement>('video[autoplay]'))
    if (videos.length === 0) return

    const observer = new IntersectionObserver(
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

    videos.forEach((video) => observer.observe(video))
    return () => observer.disconnect()
  }, [])

  return null
}
