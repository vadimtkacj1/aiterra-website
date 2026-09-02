import fs from 'fs'
import path from 'path'
import { readJsonFile } from './read-json-file'
import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/seo'
import {
  EDITABLE_SEO_ROUTES,
  ROUTE_DEFAULTS,
  type RouteSeoPayload,
  type SiteSeoFile,
  canonicalPath,
  ogTitleFromPageTitle,
} from '@/lib/site-seo-config'

export type { RouteSeoPayload, SiteSeoFile } from '@/lib/site-seo-config'
export { EDITABLE_SEO_ROUTES } from '@/lib/site-seo-config'

const DATA_FILE = path.join(process.cwd(), 'data', 'site-seo.json')

export interface ResolvedRouteSeo {
  title: string
  description: string
  ogTitle: string
  ogDescription: string
  twitterTitle: string
  twitterDescription: string
  keywords: string[]
  jsonLd?: string
}

function ensureFile() {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) {
    const initial: SiteSeoFile = {}
    for (const { path: p } of EDITABLE_SEO_ROUTES) {
      initial[p] = { ...ROUTE_DEFAULTS[p] }
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8')
  }
}

function readOverrides(): SiteSeoFile {
  ensureFile()
  return readJsonFile<SiteSeoFile>(DATA_FILE, {})
}

export function resolveRouteSeo(routePath: string): ResolvedRouteSeo | null {
  const def = ROUTE_DEFAULTS[routePath]
  if (!def) return null
  const ov = (readOverrides()[routePath] ?? {}) as Partial<RouteSeoPayload>
  const title = (ov.title ?? def.title).trim()
  const description = (ov.description ?? def.description).trim()
  if (!title || !description) return null

  const ogTitle = (ov.ogTitle ?? '').trim() || ogTitleFromPageTitle(title)
  const ogDescription = (ov.ogDescription ?? '').trim() || description
  const twitterTitle = (ov.twitterTitle ?? '').trim() || ogTitle
  const twitterDescription = (ov.twitterDescription ?? '').trim() || description
  const kw = (ov.keywords ?? '').trim()
  const keywords = kw ? kw.split(',').map((k) => k.trim()).filter(Boolean) : []
  const jsonLd = (ov.jsonLd ?? '').trim() || undefined

  return {
    title,
    description,
    ogTitle,
    ogDescription,
    twitterTitle,
    twitterDescription,
    keywords,
    jsonLd,
  }
}

/** Merged title/description + raw optional fields from file (for admin form). */
export function payloadForRoute(routePath: string): RouteSeoPayload {
  const def = ROUTE_DEFAULTS[routePath]
  const ov = (readOverrides()[routePath] ?? {}) as Partial<RouteSeoPayload>
  return {
    title: (ov.title ?? def?.title ?? '').trim(),
    description: (ov.description ?? def?.description ?? '').trim(),
    ogTitle: (ov.ogTitle ?? '').trim(),
    ogDescription: (ov.ogDescription ?? '').trim(),
    twitterTitle: (ov.twitterTitle ?? '').trim(),
    twitterDescription: (ov.twitterDescription ?? '').trim(),
    keywords: (ov.keywords ?? '').trim(),
    jsonLd: (ov.jsonLd ?? '').trim(),
  }
}

export function getAllSeoPayloadsForAdmin(): Record<string, RouteSeoPayload> {
  const out: Record<string, RouteSeoPayload> = {}
  for (const { path: p } of EDITABLE_SEO_ROUTES) {
    out[p] = payloadForRoute(p)
  }
  return out
}

function validateJsonLd(raw: string) {
  const t = raw.trim()
  if (!t) return
  try {
    const v = JSON.parse(t) as unknown
    if (v === null || (typeof v !== 'object' && !Array.isArray(v))) {
      throw new Error('JSON-LD must be an object or array of objects')
    }
    if (Array.isArray(v)) {
      for (const item of v) {
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
          throw new Error('JSON-LD array must contain only objects')
        }
      }
    }
  } catch (e) {
    if (e instanceof SyntaxError) throw new Error('JSON-LD: invalid JSON')
    throw e
  }
}

function stripForStorage(p: RouteSeoPayload): RouteSeoPayload {
  const out: RouteSeoPayload = {
    title: p.title.trim(),
    description: p.description.trim(),
  }
  const opt = (s?: string) => (s ?? '').trim()
  if (opt(p.ogTitle)) out.ogTitle = opt(p.ogTitle)
  if (opt(p.ogDescription)) out.ogDescription = opt(p.ogDescription)
  if (opt(p.twitterTitle)) out.twitterTitle = opt(p.twitterTitle)
  if (opt(p.twitterDescription)) out.twitterDescription = opt(p.twitterDescription)
  if (opt(p.keywords)) out.keywords = opt(p.keywords)
  if (opt(p.jsonLd)) out.jsonLd = opt(p.jsonLd)
  return out
}

export function writeSiteSeoPayloads(data: Record<string, RouteSeoPayload>) {
  const allowed = new Set(EDITABLE_SEO_ROUTES.map((r) => r.path))
  const next: SiteSeoFile = {}
  for (const { path: p } of EDITABLE_SEO_ROUTES) {
    const payload = data[p]
    if (!payload) throw new Error(`missing route: ${p}`)
    const title = (payload.title ?? '').trim()
    const description = (payload.description ?? '').trim()
    if (!title || !description) throw new Error(`missing title/description: ${p}`)
    if (!allowed.has(p)) continue
    if ((payload.jsonLd ?? '').trim()) validateJsonLd(payload.jsonLd!)
    next[p] = stripForStorage(payload)
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(next, null, 2), 'utf-8')
}

export function metadataForRoute(routePath: string): Metadata {
  const r = resolveRouteSeo(routePath)
  // Never ship a page with no canonical: even when SEO copy is missing, emit a
  // self-referencing canonical so the route can't end up canonical-less.
  if (!r) return { alternates: { canonical: canonicalPath(routePath) } }
  const meta: Metadata = {
    // The root layout's title.template doesn't apply to a page in its own
    // segment (Next.js behavior) — append the brand to the homepage here
    title: routePath === '/' ? ogTitleFromPageTitle(r.title) : r.title,
    description: r.description,
    alternates: { canonical: canonicalPath(routePath) },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: r.ogTitle,
      description: r.ogDescription,
      url: canonicalPath(routePath),
      locale: 'he_IL',
      images: [
        {
          url: '/images/og/og-aiterra-v2.png',
          width: 1200,
          height: 630,
          alt: r.ogTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: r.twitterTitle,
      description: r.twitterDescription,
      images: ['/images/og/og-aiterra-v2.png'],
    },
  }
  if (r.keywords.length) meta.keywords = r.keywords
  return meta
}
