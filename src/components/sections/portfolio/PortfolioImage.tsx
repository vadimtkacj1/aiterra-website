'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface Props {
  src: string
  alt: string
  /** Eager-load + preload (use only for images above the fold). */
  priority?: boolean
}

/**
 * Portfolio mockup with a skeleton-shimmer loader. The reserved 900×506 box
 * keeps layout stable (no CLS) and shows an animated placeholder until the
 * image paints, then cross-fades it in. Images are served unoptimized — they're
 * already small pre-optimized webp (16–40KB), so the /_next/image round-trip
 * was pure latency (and a rate-limit/cold-start risk under nginx). The cache is
 * warmed on idle (see PortfolioPrefetch), so on scroll these usually paint from
 * cache and the skeleton barely flashes.
 */
export default function PortfolioImage({ src, alt, priority }: Props) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // A cache hit can complete before React attaches onLoad — catch that here so
  // the skeleton never stays up over an already-painted image.
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true)
  }, [])

  return (
    <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: '900 / 506' }}>
      <div
        aria-hidden
        className={`portfolio-skeleton absolute inset-0 transition-opacity duration-300 ${
          loaded ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      />
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        unoptimized
        onLoad={() => setLoaded(true)}
        className={`object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
