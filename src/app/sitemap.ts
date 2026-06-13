import type { MetadataRoute } from 'next'
import { services } from '@/data/services'
import { getAllPortfolioProjects } from '@/lib/portfolio-server'
import { getAllPosts } from '@/lib/blog-server'
import { getAllAuthors } from '@/lib/authors-server'
import { SITE_URL } from '@/lib/seo'

// ISR: serve a cached sitemap to crawlers (no per-request disk reads) and let
// the admin write handlers refresh it on demand — they already call
// revalidatePath('/sitemap.xml') on every blog/portfolio create/update/delete.
export const revalidate = 3600

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
    // Homepage emits the trailing-slash form to stay in sync with its canonical
    url: `${SITE_URL}${route || '/'}`,
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

  // Author profile pages — E-E-A-T entity surface for each named expert
  const authorEntries: MetadataRoute.Sitemap = getAllAuthors().map((author) => ({
    url: `${SITE_URL}/blog/author/${author.id}`,
    lastModified: STATIC_DATE,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [...staticEntries, ...serviceEntries, ...portfolioEntries, ...postEntries, ...authorEntries]
}
