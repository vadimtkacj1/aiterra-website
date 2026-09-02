import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog-server'
import { getAllAuthors } from '@/lib/authors-server'
import { getAllPortfolioProjects } from '@/lib/portfolio-server'
import { getV2Content } from '@/lib/v2-content-server'
import { SITE_URL } from '@/lib/seo'

export const revalidate = 3600

const LEGAL_DATE = new Date('2026-05-01')

const absUrl = (u: string) =>
  u.startsWith('http') ? u : `${SITE_URL}${u.startsWith('/') ? '' : '/'}${u}`

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const posts = getAllPosts()

  const latestContent = posts.reduce<Date>((max, p) => {
    const d = new Date(p.dateModified || p.datePublished || now)
    return Number.isNaN(d.getTime()) ? max : d > max ? d : max
  }, LEGAL_DATE)

  const commercialRoutes: {
    path: string
    changeFrequency: 'weekly' | 'monthly'
    priority: number
  }[] = [
    { path: '', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/services', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/projects', changeFrequency: 'monthly', priority: 0.8 },
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
    '/terms-of-use',
    '/accessibility-statement',
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: LEGAL_DATE,
    changeFrequency: 'yearly',
    priority: 0.3,
  }))

  const serviceEntries: MetadataRoute.Sitemap = Object.keys(
    getV2Content().servicePages,
  ).map((slug) => ({
    url: `${SITE_URL}/services/${slug}`,
    lastModified: latestContent,
    changeFrequency: 'monthly',
    priority: 0.9,
  }))

  const projectEntries: MetadataRoute.Sitemap = getAllPortfolioProjects().map((project) => {
    const imgs = [project.image, ...(project.galleryImages ?? [])]
      .filter((x): x is string => Boolean(x))
      .map(absUrl)
    return {
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified: latestContent,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      ...(imgs.length ? { images: imgs } : {}),
    }
  })

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
    ...projectEntries,
    ...postEntries,
    ...authorEntries,
  ]
}
