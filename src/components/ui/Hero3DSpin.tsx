'use client'

import { useEffect } from 'react'
import { SpinnerRing } from '@/components/ui/SpinnerRing'

/** Full-viewport overlay while something heavy blocks the hero (optional). */
export function Hero3DSpin({ label = 'Loading 3D' }: { label?: string }) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[8000] flex flex-col items-center justify-center gap-4 bg-white"
      role="status"
      aria-busy="true"
      aria-label={label}
    >
      <SpinnerRing variant="on-light" className="h-14 w-14" />
    </div>
  )
}
