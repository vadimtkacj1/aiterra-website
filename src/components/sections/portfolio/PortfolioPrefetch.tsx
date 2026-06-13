'use client'

import { useEffect } from 'react'

/**
 * Warms the browser cache for the portfolio mockups once the page is idle
 * (i.e. after the LCP / initial work is done). The grid images stay lazy so
 * they never compete with first paint, but by the time the user scrolls down
 * they're already cached and paint instantly — the skeleton barely flashes.
 *
 * Uses the exact same direct static URLs the <Image>s request (no /_next/image
 * indirection), so the lazy request is a guaranteed cache hit.
 */
export default function PortfolioPrefetch({ srcs }: { srcs: string[] }) {
  useEffect(() => {
    if (!srcs.length) return

    const warm = () => {
      for (const src of srcs) {
        const img = new window.Image()
        // Low priority so warming never steals bandwidth from anything visible.
        try {
          ;(img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = 'low'
        } catch {}
        img.decoding = 'async'
        img.src = src
      }
    }

    const ric = window.requestIdleCallback
    if (ric) {
      const id = ric(warm, { timeout: 3000 })
      return () => window.cancelIdleCallback?.(id)
    }
    const id = window.setTimeout(warm, 1200)
    return () => window.clearTimeout(id)
  }, [srcs])

  return null
}
