import type { NextConfig } from 'next'

const cleanToV2: { clean: string; v2: string }[] = [
  { clean: '/services', v2: '/v2/services' },
  { clean: '/services/:slug', v2: '/v2/services/:slug' },
  { clean: '/about', v2: '/v2/about' },
  { clean: '/contact', v2: '/v2/contact' },
  { clean: '/blog', v2: '/v2/blog' },
  { clean: '/blog/:slug', v2: '/v2/blog/:slug' },
  { clean: '/projects', v2: '/v2/projects' },
  { clean: '/projects/:slug', v2: '/v2/projects/:slug' },
  { clean: '/privacy-policy', v2: '/v2/privacy-policy' },
  { clean: '/terms-of-use', v2: '/v2/terms-of-use' },
  { clean: '/accessibility-statement', v2: '/v2/accessibility-statement' },
]

const retiredServiceSlugs: { from: string; to: string }[] = [
  { from: '/services/web-development', to: '/services/brochure' },
  { from: '/services/seo', to: '/services/marketing' },
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
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/v2' },
        ...cleanToV2.map(({ clean, v2 }) => ({ source: clean, destination: v2 })),
      ],
      afterFiles: [],
      fallback: [],
    }
  },
  async redirects() {
    return [
      ...retiredServiceSlugs.map(({ from, to }) => ({
        source: from,
        destination: to,
        permanent: true,
      })),
      { source: '/packages', destination: '/services', permanent: true },
      { source: '/portfolio', destination: '/projects', permanent: true },
      { source: '/portfolio/:slug', destination: '/projects/:slug', permanent: true },
      { source: '/v2', destination: '/', permanent: true },
      ...cleanToV2.map(({ clean, v2 }) => ({ source: v2, destination: clean, permanent: true })),
    ]
  },
}

export default nextConfig
