import fs from 'fs'
import path from 'path'
import type { PortfolioProject } from '@/types'
import { PORTFOLIO_SEED } from '@/data/portfolio'

const DATA_FILE = path.join(process.cwd(), 'data', 'portfolio-projects.json')

function ensureFile() {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(PORTFOLIO_SEED, null, 2), 'utf-8')
  }
}

function optUrl(s: unknown): string | undefined {
  const t = typeof s === 'string' ? s.trim() : ''
  return t || undefined
}

function normalizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return []
  return tags.map((t) => String(t).trim()).filter(Boolean)
}

function normalizeCaseStudy(cs: unknown): string[] | undefined {
  if (!Array.isArray(cs)) return undefined
  const paras = cs.map((s) => String(s).trim()).filter(Boolean)
  return paras.length ? paras : undefined
}

function normalizeGalleryImages(imgs: unknown): string[] | undefined {
  if (!Array.isArray(imgs)) return undefined
  const urls = imgs.map((s) => String(s).trim()).filter(Boolean)
  return urls.length ? urls : undefined
}

function optStr(s: unknown): string | undefined {
  const t = typeof s === 'string' ? s.trim() : ''
  return t || undefined
}

function normalizeSortOrder(n: unknown): number | undefined {
  if (n === '' || n === null || n === undefined) return undefined
  const v = typeof n === 'number' ? n : Number.parseInt(String(n), 10)
  if (!Number.isFinite(v)) return undefined
  return v
}

export function normalizePortfolioPayload(raw: Partial<PortfolioProject>): PortfolioProject {
  const hasPage = raw.hasPage === false ? false : undefined
  return {
    slug: (raw.slug ?? '').trim(),
    title: (raw.title ?? '').trim(),
    category: (raw.category ?? '').trim(),
    heroTitle: (raw.heroTitle ?? '').trim(),
    heroDescription: (raw.heroDescription ?? '').trim(),
    image: (raw.image ?? '').trim(),
    tags: normalizeTags(raw.tags),
    hasPage,
    liveSiteUrl: optUrl(raw.liveSiteUrl),
    externalUrl: optUrl(raw.externalUrl),
    caseStudy: normalizeCaseStudy(raw.caseStudy),
    imageAlt: optStr(raw.imageAlt),
    metaTitle: optStr(raw.metaTitle),
    metaDescription: optStr(raw.metaDescription),
    heroCtaPrimaryLabel: optStr(raw.heroCtaPrimaryLabel),
    heroCtaPrimaryHref: optStr(raw.heroCtaPrimaryHref),
    heroCtaSecondaryLabel: optStr(raw.heroCtaSecondaryLabel),
    heroCtaSecondaryHref: optStr(raw.heroCtaSecondaryHref),
    galleryImages: normalizeGalleryImages(raw.galleryImages),
    sortOrder: normalizeSortOrder(raw.sortOrder),
  }
}

function readProjectsFromDisk(): PortfolioProject[] {
  ensureFile()
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) as PortfolioProject[]
}

function sortProjects(list: PortfolioProject[]): PortfolioProject[] {
  return list
    .map((p, index) => ({ p, index }))
    .sort((a, b) => {
      const ao = a.p.sortOrder ?? 0
      const bo = b.p.sortOrder ?? 0
      if (ao !== bo) return ao - bo
      return a.index - b.index
    })
    .map(({ p }) => p)
}

function writeProjectsSorted(list: PortfolioProject[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(sortProjects(list), null, 2), 'utf-8')
}

export function getAllPortfolioProjects(): PortfolioProject[] {
  return sortProjects(readProjectsFromDisk())
}

export function getProjectBySlug(slug: string): PortfolioProject | null {
  return getAllPortfolioProjects().find((p) => p.slug === slug) ?? null
}

function assertRequired(p: PortfolioProject) {
  const missing: string[] = []
  if (!p.slug) missing.push('slug')
  if (!p.title) missing.push('title')
  if (!p.category) missing.push('category')
  if (!p.image) missing.push('image')
  if (p.hasPage !== false) {
    if (!p.heroTitle) missing.push('heroTitle')
    if (!p.heroDescription) missing.push('heroDescription')
  }
  if (missing.length) throw new Error(`missing: ${missing.join(', ')}`)
}

export function createPortfolioProject(raw: Partial<PortfolioProject>): PortfolioProject {
  const list = readProjectsFromDisk()
  const p = normalizePortfolioPayload(raw)
  assertRequired(p)
  if (list.find((x) => x.slug === p.slug)) throw new Error('slug already exists')
  list.unshift(p)
  writeProjectsSorted(list)
  return p
}

export function updatePortfolioProject(slug: string, raw: Partial<PortfolioProject>): PortfolioProject {
  const list = readProjectsFromDisk()
  const idx = list.findIndex((x) => x.slug === slug)
  if (idx === -1) throw new Error('not found')
  const merged = normalizePortfolioPayload({ ...list[idx], ...raw, slug: list[idx].slug })
  assertRequired(merged)
  list[idx] = merged
  writeProjectsSorted(list)
  return merged
}

export function deletePortfolioProject(slug: string): void {
  const next = readProjectsFromDisk().filter((p) => p.slug !== slug)
  writeProjectsSorted(next)
}
