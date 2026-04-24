'use client'

import { useEffect, useRef } from 'react'
import { useDocumentEnd } from '@/context/DocumentEndContext'

/** Marks the physical end of the page; drives header hide via IntersectionObserver. */
export default function DocumentEndSentinel() {
  const ref = useRef<HTMLDivElement>(null)
  const { setDocumentEnd } = useDocumentEnd()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        setDocumentEnd(entry.isIntersecting)
      },
      {
        threshold: 0,
        // Slightly extend the viewport bottom so the header tucks away before the last pixel.
        rootMargin: '0px 0px 64px 0px',
      },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [setDocumentEnd])

  return (
    <div
      ref={ref}
      className="h-px w-full shrink-0"
      aria-hidden
    />
  )
}
