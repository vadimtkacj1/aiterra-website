import type { NextConfig } from 'next'

const legacyV2Paths: string[] = [
  '/services',
  '/services/:slug',
  '/about',
  '/contact',
  '/blog',
  '/blog/:slug',
  '/projects',
  '/projects/:slug',
  '/privacy-policy',
  '/terms-of-use',
  '/accessibility-statement',
]

const retiredServiceSlugs: { from: string; to: string }[] = [
  { from: '/services/adv', to: '/services/marketing' },
  { from: '/services/automation', to: '/services/development' },
  { from: '/services/custom', to: '/services/development' },
]

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 90],
    minimumCacheTTL: 2592000,
  },
  async redirects() {
    return [
      ...retiredServiceSlugs.map(({ from, to }) => ({
        source: from,
        destination: to,
        permanent: true,
      })),
      { source: '/packages', destination: '/services', permanent: true },
      { source: '/landings/ecomerce', destination: '/lp/ecomerce', permanent: true },
      { source: '/portfolio', destination: '/projects', permanent: true },
      { source: '/portfolio/:slug', destination: '/projects/:slug', permanent: true },
      { source: '/v2', destination: '/', permanent: true },
      ...legacyV2Paths.map((path) => ({
        source: `/v2${path}`,
        destination: path,
        permanent: true,
      })),
    ]
  },
}

export default nextConfig
