import type { MetadataRoute } from 'next'
import { services } from '@/data/services'
import { getAllPortfolioProjects } from '@/lib/portfolio-server'
import { getAllPosts } from '@/lib/blog-server'
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
    '/privacy-policy',
    '/accessibility-statement',
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

  // hasPage: false projects render 404 — keep them out of the sitemap
  const portfolioEntries: MetadataRoute.Sitemap = getAllPortfolioProjects()
    .filter((project) => project.hasPage !== false)
    .map((project) => ({
      url: `${SITE_URL}/portfolio/${project.slug}`,
      lastModified: STATIC_DATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

  // getAllPosts() already merges admin-created posts with the bundled seed
  const postEntries: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.datePublished ? new Date(post.datePublished) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticEntries, ...serviceEntries, ...portfolioEntries, ...postEntries]
}
