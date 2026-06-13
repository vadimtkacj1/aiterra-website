'use client'

import { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

/**
 * Full-bleed hero video. The poster is the LCP element, so we preload it at
 * high priority (hoisted to <head> by React) and let it paint immediately —
 * no spinner, a full-screen loader over the poster made every page feel broken
 * on slow networks.
 *
 * The video itself (~120KB, purely decorative gradient) is deferred until the
 * browser is idle so its bytes don't compete with the poster + fonts during
 * the critical LCP / Speed-Index window. It swaps in seamlessly a moment later.
 *
 * The default src MUST be the lightweight `gradient2.mp4` (~124KB), NOT the
 * 1.1MB `gradient.mp4`: on Slow 4G the big file's full-screen first frame paints
 * ~5s in and overtakes the 17KB poster as the LCP element (blog mobile LCP was
 * 5.2s with the heavy default; the flagship service pages always passed
 * gradient2 explicitly and scored 100). Don't point this back at gradient.mp4.
 */
export default function HeroVideoBackdrop({
  src = '/videos/gradient2.mp4',
  poster = '/videos/gradient-poster.webp',
}: {
  src?: string
  poster?: string
}) {
  // High-priority preload for the LCP poster. Safe to call on every render —
  // React dedupes, and it emits the <link> into <head> during SSR.
  ReactDOM.preload(poster, { as: 'image', fetchPriority: 'high' })

  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined)

  useEffect(() => {
    const start = () => setVideoSrc(src)
    const ric = window.requestIdleCallback
    if (ric) {
      const id = ric(start, { timeout: 2500 })
      return () => window.cancelIdleCallback?.(id)
    }
    const id = window.setTimeout(start, 1500)
    return () => window.clearTimeout(id)
  }, [src])

  // autoPlay won't fire for a src attached after mount — kick it off ourselves.
  useEffect(() => {
    if (videoSrc) videoRef.current?.play().catch(() => {})
  }, [videoSrc])

  return (
    <div className="absolute inset-0 z-0 bg-[#080112]">
      <video
        ref={videoRef}
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        poster={poster}
      />
    </div>
  )
}
