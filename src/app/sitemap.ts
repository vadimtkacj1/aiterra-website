import type { MetadataRoute } from 'next'
import { services } from '@/data/services'
import { getAllPortfolioProjects } from '@/lib/portfolio-server'
import { getAllPosts } from '@/lib/blog-server'
import { blogPosts as staticBlogPosts } from '@/data/blog'
import { SITE_URL } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const STATIC_DATE = new Date('2026-05-01')

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Core static routes — service sub-pages added via serviceEntries (no duplicates)
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/services',
    '/packages',
    '/portfolio',
    '/blog',
  ]

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: STATIC_DATE,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }))

  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${SITE_URL}/services/${service.slug}`,
    lastModified: STATIC_DATE,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const portfolioEntries: MetadataRoute.Sitemap = getAllPortfolioProjects().map((project) => ({
    url: `${SITE_URL}/portfolio/${project.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Merge admin-created posts with hardcoded static posts — deduplicate by slug
  const adminPosts = getAllPosts()
  const adminSlugs = new Set(adminPosts.map((p) => p.slug))
  const staticOnlyPosts = staticBlogPosts.filter((p) => !adminSlugs.has(p.slug))

  const postEntries: MetadataRoute.Sitemap = [
    ...adminPosts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.datePublished ? new Date(post.datePublished) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...staticOnlyPosts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.datePublished ? new Date(post.datePublished) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  return [...staticEntries, ...serviceEntries, ...portfolioEntries, ...postEntries]
}
