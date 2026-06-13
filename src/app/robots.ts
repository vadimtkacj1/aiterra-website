import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api/admin'] },
      // Training / index AI crawlers — build the model's knowledge base.
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'Amazonbot', allow: '/' },
      // Realtime "user" fetchers — these visit at answer time and produce the
      // live cited link in ChatGPT / Perplexity / Claude, so allow them too.
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'Perplexity-User', allow: '/' },
      { userAgent: 'Claude-User', allow: '/' },
      { userAgent: 'Claude-SearchBot', allow: '/' },
      // Google-Extended controls AI training use only (not Search indexing)
      // Remove the line below to allow Google to use content for AI training
      { userAgent: 'Google-Extended', allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
