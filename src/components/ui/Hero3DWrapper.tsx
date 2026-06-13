'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const Hero3DScene = dynamic(() => import('@/components/ui/Hero3DScene'), {
  ssr: false,
  loading: () => <HeroPoster />,
})

/**
 * Static poster of the 3D mark. Server-rendered so the hero visual paints
 * immediately (no spinner, no layout shift when the canvas takes over the
 * same box).
 */
function HeroPoster() {
  return (
    <img
      src="/images/hero/model-poster.webp"
      alt=""
      width={600}
      height={600}
      className="w-full h-full object-contain"
      loading="eager"
      fetchPriority="high"
      decoding="async"
    />
  )
}

/**
 * True when WebGL is hardware-accelerated. Headless/lab environments and
 * GPU-less machines fall back to software rasterizers (SwiftShader/llvmpipe),
 * where running the 3D scene burns ~1s of main thread for a degraded result —
 * those get the poster instead.
 */
function hasHardwareWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    if (!gl || !('getParameter' in gl)) return false
    const ctx = gl as WebGLRenderingContext
    const debugInfo = ctx.getExtension('WEBGL_debug_renderer_info')
    const renderer = debugInfo
      ? String(ctx.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL))
      : String(ctx.getParameter(ctx.RENDERER))
    ctx.getExtension('WEBGL_lose_context')?.loseContext()
    return !/swiftshader|llvmpipe|software|basic render/i.test(renderer)
  } catch {
    return false
  }
}

export default function Hero3DWrapper() {
  const [show3D, setShow3D] = useState(false)

  useEffect(() => {
    let cancelled = false

    const decide = () => {
      if (cancelled) return
      if (window.innerWidth >= 1024 && hasHardwareWebGL()) setShow3D(true)
    }

    // Wait for full page load, then an idle slot, so the three.js chunk
    // never competes with critical-path work.
    const afterLoad = () => {
      if (cancelled) return
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(decide, { timeout: 2000 })
      } else {
        window.setTimeout(decide, 300)
      }
    }

    if (document.readyState === 'complete') {
      afterLoad()
    } else {
      window.addEventListener('load', afterLoad, { once: true })
    }

    return () => {
      cancelled = true
      window.removeEventListener('load', afterLoad)
    }
  }, [])

  if (!show3D) return <HeroPoster />

  return <Hero3DScene />
}
