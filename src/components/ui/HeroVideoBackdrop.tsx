'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { SpinnerRing } from '@/components/ui/SpinnerRing'

/** Full-bleed hero video with a spinner until the first frame is ready (slow network / large file). */
export default function HeroVideoBackdrop({ src = '/videos/gradient.mp4' }: { src?: string }) {
  const [ready, setReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const markReady = useCallback(() => {
    setReady(true)
  }, [])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    // Already decoded enough to show a frame (e.g. back/forward cache, fast load)
    if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      markReady()
    }
  }, [src, markReady])

  useEffect(() => {
    const t = window.setTimeout(markReady, 14_000)
    return () => window.clearTimeout(t)
  }, [src, markReady])

  return (
    <div className="absolute inset-0 z-0">
      <video
        ref={videoRef}
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src={src}
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={markReady}
        onCanPlay={markReady}
        onPlaying={markReady}
        onError={markReady}
      />
      {!ready && (
        <div
          className="absolute inset-0 z-[1] flex items-center justify-center bg-[#080112]"
          aria-busy="true"
          aria-label="טוען וידאו"
        >
          <SpinnerRing variant="on-dark" className="h-14 w-14" />
        </div>
      )}
    </div>
  )
}
