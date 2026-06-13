'use client'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

interface AiterraWordmarkProps {
  height?: number
  priority?: boolean
  className?: string
  src?: string
}

/**
 * Entrance (fade-up) is pure CSS so it starts on first paint instead of
 * waiting for hydration. The scroll parallax writes a transform directly to
 * the DOM from a rAF-throttled scroll listener — no re-renders, no
 * animation-library payload.
 */
export default function AiterraWordmark({
  height = 300,
  priority,
  className = '',
  src = '/images/hero/hero-aiterra.webp',
}: AiterraWordmarkProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const target = parallaxRef.current
    if (!container || !target) return

    let raf = 0
    const update = () => {
      raf = 0
      const rect = container.getBoundingClientRect()
      const vh = window.innerHeight
      // progress 0 when the container top reaches the viewport center,
      // 1 when its bottom leaves the viewport top (framer's "start center" → "end start")
      const total = vh / 2 + rect.height
      const progress = total > 0 ? Math.min(1, Math.max(0, (vh / 2 - rect.top) / total)) : 0
      target.style.transform = `translateY(${(progress * 400).toFixed(1)}px)`
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full ${className}`.trim()}
    >
      <div ref={parallaxRef} className="will-change-transform">
        <div className="wordmark-enter relative select-none pointer-events-none">
          <Image
            src={src}
            alt="AITERRA"
            width={1920}
            height={height}
            className="w-full h-auto object-contain px-4"
            priority={priority}
          />
        </div>
      </div>
    </div>
  )
}
