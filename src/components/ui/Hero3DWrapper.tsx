'use client'

import { useEffect, useState } from 'react'
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

type State = 'loading' | 'mobile' | 'desktop'

export default function Hero3DWrapper() {
  const [state, setState] = useState<State>('loading')

  useEffect(() => {
    const resolve = () =>
      setState(window.innerWidth < 1024 ? 'mobile' : 'desktop')

    if (document.readyState === 'complete') {
      resolve()
    } else {
      window.addEventListener('load', resolve, { once: true })
      return () => window.removeEventListener('load', resolve)
    }
  }, [])

  if (state === 'loading') {
    return (
      <div
        className="flex h-full min-h-[180px] w-full items-center justify-center bg-white"
        aria-label="טוען תלת-ממד"
      >
        <SpinnerRing variant="on-light" className="h-14 w-14" />
      </div>
    )
  }

  if (state === 'mobile') {
    return (
      <img
        src="/images/hero/model-poster.webp"
        alt=""
        width={600}
        height={600}
        className="w-full h-full object-contain"
        loading="eager"
        decoding="async"
      />
    )
  }

  return <Hero3DScene />
}
