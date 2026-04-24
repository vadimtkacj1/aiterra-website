'use client'

import { useEffect, useRef } from 'react'
import { useDocumentEnd } from '@/context/DocumentEndContext'

/**
 * Must sit **after** any `sticky bottom` footer wrapper in the document flow so it only
 * intersects the viewport when the user has scrolled to the true end of the page.
 */
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
      { threshold: 0, rootMargin: '0px' },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [setDocumentEnd])

  return <div ref={ref} className="h-px w-full shrink-0" aria-hidden />
}
