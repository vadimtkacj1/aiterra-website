import type { MetadataRoute } from 'next'
import { services } from '@/data/services'
import { portfolioProjects } from '@/data/portfolio'
import { getAllPosts } from '@/lib/blog-server'
import { SITE_URL } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/services',
    '/services/web-development',
    '/services/seo',
    '/services/automation',
    '/services/adv',
    '/portfolio',
    '/blog',
  ]

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }))

  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${SITE_URL}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.75,
  }))

  const portfolioEntries: MetadataRoute.Sitemap = portfolioProjects.map((project) => ({
    url: `${SITE_URL}/portfolio/${project.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const postEntries: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.datePublished ? new Date(post.datePublished) : now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticEntries, ...serviceEntries, ...portfolioEntries, ...postEntries]
}
