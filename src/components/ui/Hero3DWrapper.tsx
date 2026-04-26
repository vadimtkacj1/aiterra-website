'use client'

import dynamic from 'next/dynamic'
import { SpinnerRing } from '@/components/ui/SpinnerRing'

const Hero3DScene = dynamic(() => import('@/components/ui/Hero3DScene'), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-full min-h-[180px] w-full items-center justify-center bg-white"
      aria-busy="true"
      aria-label="טוען תלת-ממד"
    >
      <SpinnerRing variant="on-light" className="h-14 w-14" />
    </div>
  ),
})

export default function Hero3DWrapper() {
  return <Hero3DScene />
}
