import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
  },
  async rewrites() {
    return {
      beforeFiles: [{ source: '/', destination: '/v2' }],
      afterFiles: [],
      fallback: [],
    }
  },
  async redirects() {
    return [
      // /packages was a thin duplicate of /services (no real package tiers) —
      // consolidate so Google indexes one strong commercial page, not two.
      { source: '/packages', destination: '/services', permanent: true },
      // Per-project case pages were dropped — the grid card now opens the live
      // client site directly. Fold the indexed /portfolio/<slug> URLs back into
      // the hub instead of letting them 404.
      { source: '/portfolio/:slug', destination: '/portfolio', permanent: true },
    ]
  },
}

export default nextConfig
