'use client'

import { useEffect } from 'react'

/** Full-viewport overlay while the 3D hero chunk or assets load. */
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
      <div
        className="h-14 w-14 shrink-0 rounded-full border-[3px] border-gray-200/90 border-t-[#530FAD] animate-spin shadow-sm"
        aria-hidden
      />
    </div>
  )
}
