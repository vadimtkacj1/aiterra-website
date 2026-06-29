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

// Legal/utility pages genuinely change ~never.
const LEGAL_DATE = new Date('2026-05-01')

const absUrl = (u: string) =>
  u.startsWith('http') ? u : `${SITE_URL}${u.startsWith('/') ? '' : '/'}${u}`

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const posts = getAllPosts()

  // Freshness anchor for content hubs (home, /services, /packages, /blog, …):
  // the most recent real content change. This replaces the old hardcoded
  // 2026-05-01 lastmod, which gave Google no reason to (re)crawl those pages —
  // the never-crawled commercial pages all carried that stale date.
  const latestContent = posts.reduce<Date>((max, p) => {
    const d = new Date(p.dateModified || p.datePublished || now)
    return Number.isNaN(d.getTime()) ? max : d > max ? d : max
  }, LEGAL_DATE)

  // Commercial / hub routes — money pages get the highest priority.
  const commercialRoutes: { path: string; changeFrequency: 'weekly' | 'monthly'; priority: number }[] = [
    { path: '', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/services', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/packages', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/portfolio', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/blog', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
  ]

  const commercialEntries: MetadataRoute.Sitemap = commercialRoutes.map((r) => ({
    url: `${SITE_URL}${r.path || '/'}`,
    lastModified: latestContent,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  const legalEntries: MetadataRoute.Sitemap = [
    '/privacy-policy',
    '/accessibility-statement',
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: LEGAL_DATE,
    changeFrequency: 'yearly',
    priority: 0.3,
  }))

  // Service sub-pages are the conversion core — keep them at money-page priority.
  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${SITE_URL}/services/${service.slug}`,
    lastModified: latestContent,
    changeFrequency: 'monthly',
    priority: 0.9,
  }))

  // hasPage: false projects render 404 — keep them out of the sitemap
  const portfolioEntries: MetadataRoute.Sitemap = getAllPortfolioProjects()
    .filter((project) => project.hasPage !== false)
    .map((project) => {
      const imgs = [project.image, ...(project.galleryImages ?? [])].filter(Boolean).map(absUrl)
      return {
        url: `${SITE_URL}/portfolio/${project.slug}`,
        lastModified: latestContent,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
        ...(imgs.length ? { images: imgs } : {}),
      }
    })

  // getAllPosts() already merges admin-created posts with the bundled seed
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => {
    const imgs = (post.images ?? []).filter(Boolean).map(absUrl)
    return {
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.dateModified || post.datePublished || now),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      ...(imgs.length ? { images: imgs } : {}),
    }
  })

  // Author profile pages — E-E-A-T entity surface for each named expert
  const authorEntries: MetadataRoute.Sitemap = getAllAuthors().map((author) => ({
    url: `${SITE_URL}/blog/author/${author.id}`,
    lastModified: latestContent,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [
    ...commercialEntries,
    ...legalEntries,
    ...serviceEntries,
    ...portfolioEntries,
    ...postEntries,
    ...authorEntries,
  ]
}
