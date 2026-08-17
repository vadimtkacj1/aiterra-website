'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface Props {
  src: string
  alt: string
  /** Tall full-page capture (900×1800) → scrolls inside the frame. */
  scrollable?: boolean
  /** Eager-load + preload (use only for frames above the fold). */
  priority?: boolean
}

/**
 * The live-site window: a real full-page screenshot inside a browser frame.
 * On a mouse the whole page scrolls through the window on hover; on touch it
 * plays once while the card is centred in the viewport (no hover to rely on).
 *
 * The 16/10 window + fixed 900×1800 capture keep the travel distance identical
 * for every card, so a single CSS translate (--shot-travel) drives them all and
 * layout never shifts. Images are served unoptimized — they're already small
 * pre-optimized webp (52–123KB), so the /_next/image round-trip was pure
 * latency (and a rate-limit risk under nginx). The cache is warmed on idle (see
 * PortfolioPrefetch).
 */
export default function PortfolioShot({ src, alt, scrollable = true, priority }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [live, setLive] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)

  // A cache hit can complete before React attaches onLoad — catch that here so
  // the skeleton never stays up over an already-painted image.
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true)
  }, [])

  // Touch devices have no hover: play the scroll while the card is on screen.
  useEffect(() => {
    if (!scrollable) return
    const el = frameRef.current
    if (!el) return
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const io = new IntersectionObserver(
      ([entry]) => setLive(entry.isIntersecting),
      { threshold: 0.55 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [scrollable])

  return (
    <div
      ref={frameRef}
      className="shot-frame relative overflow-hidden rounded-[10px] bg-white"
      style={{ aspectRatio: '16 / 10' }}
    >
      <div
        aria-hidden
        className={`shot-skeleton absolute inset-0 transition-opacity duration-300 ${
          loaded ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      />

      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        width={900}
        height={scrollable ? 1800 : 506}
        sizes="(max-width: 768px) 92vw, 600px"
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        unoptimized
        onLoad={() => setLoaded(true)}
        className={`absolute inset-x-0 top-0 w-full transition-opacity duration-300 ${
          scrollable ? 'shot-img h-auto' : 'h-full object-contain'
        } ${live ? 'is-live' : ''} ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Scroll-progress bar — fills in step with the travel, like a playhead. */}
      {scrollable && (
        <span aria-hidden className="shot-rail-track absolute inset-x-0 bottom-0 h-0.75 bg-black/5">
          <span className="shot-rail block h-full w-full origin-right bg-[linear-gradient(90deg,#3E96F9_0%,#2447D6_100%)]" />
        </span>
      )}
    </div>
  )
}
