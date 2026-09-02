import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

const PRIVATE_PATHS = ['/admin', '/api/admin']

const aiCrawler = (userAgent: string) => ({
  userAgent,
  allow: '/',
  disallow: PRIVATE_PATHS,
})

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE_PATHS },
      // Training / index AI crawlers — build the model's knowledge base.
      aiCrawler('GPTBot'),
      aiCrawler('ClaudeBot'),
      aiCrawler('PerplexityBot'),
      aiCrawler('Applebot-Extended'),
      aiCrawler('CCBot'),
      aiCrawler('Amazonbot'),
      // Realtime "user" fetchers — these visit at answer time and produce the
      // live cited link in ChatGPT / Perplexity / Claude, so allow them too.
      aiCrawler('OAI-SearchBot'),
      aiCrawler('ChatGPT-User'),
      aiCrawler('Perplexity-User'),
      aiCrawler('Claude-User'),
      aiCrawler('Claude-SearchBot'),
      // Google-Extended controls AI training use only (not Search indexing)
      // Remove the line below to allow Google to use content for AI training
      aiCrawler('Google-Extended'),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
