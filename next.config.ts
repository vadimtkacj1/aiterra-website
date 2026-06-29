import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
  },
  async redirects() {
    return [
      // /packages was a thin duplicate of /services (no real package tiers) —
      // consolidate so Google indexes one strong commercial page, not two.
      { source: '/packages', destination: '/services', permanent: true },
    ]
  },
}

export default nextConfig
