'use client'

import dynamic from 'next/dynamic'
import { Hero3DSpin } from '@/components/ui/Hero3DSpin'

const Hero3DScene = dynamic(() => import('@/components/ui/Hero3DScene'), {
  ssr: false,
  loading: () => <Hero3DSpin />,
})

export default function Hero3DWrapper() {
  return <Hero3DScene />
}
