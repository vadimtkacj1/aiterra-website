'use client'

import dynamic from 'next/dynamic'

const Hero3DScene = dynamic(() => import('@/components/ui/Hero3DScene'), {
  ssr: false,
  loading: () => null,
})

export default function Hero3DWrapper() {
  return <Hero3DScene />
}
