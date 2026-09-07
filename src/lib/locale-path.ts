import { EN_SERVICE_SLUGS } from '@/lib/content-en'
import { postsEn } from '@/lib/content-en-blog-data'

export type Locale = 'he' | 'en'

const PAIRED_ROOTS = [
  '/services',
  '/projects',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms-of-use',
  '/accessibility-statement',
  '/blog',
] as const

const stripTrailingSlash = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path)

export function localeOf(pathname: string): Locale {
  const path = stripTrailingSlash(pathname)
  return path === '/en' || path.startsWith('/en/') ? 'en' : 'he'
}

export function toHebrewPath(pathname: string): string {
  const path = stripTrailingSlash(pathname)
  if (localeOf(path) === 'he') return path
  const hePath = path === '/en' ? '/' : path.slice(3)
  return hasHebrewCounterpart(hePath) ? hePath : '/'
}

export function toEnglishPath(pathname: string): string {
  const path = stripTrailingSlash(pathname)
  if (localeOf(path) === 'en') return path
  const enPath = path === '/' ? '/en' : `/en${path}`
  return hasEnglishCounterpart(path) ? enPath : '/en'
}

export function counterpartPath(pathname: string, target: Locale): string {
  return target === 'en' ? toEnglishPath(pathname) : toHebrewPath(pathname)
}

function isServiceSlugPath(path: string) {
  const match = /^\/services\/([a-z0-9-]+)$/.exec(path)
  return match ? match[1] : null
}

function hasEnglishCounterpart(hePath: string): boolean {
  if (hePath === '/') return true
  if ((PAIRED_ROOTS as readonly string[]).includes(hePath)) return true
  if (/^\/projects\/[a-z0-9-]+$/.test(hePath)) return true
  if (/^\/blog\/author\/[a-z0-9-]+$/.test(hePath)) return true
  const post = /^\/blog\/([a-z0-9-]+)$/.exec(hePath)
  if (post) return Boolean(postsEn[post[1]])
  const slug = isServiceSlugPath(hePath)
  return slug ? (EN_SERVICE_SLUGS as readonly string[]).includes(slug) : false
}

function hasHebrewCounterpart(hePath: string): boolean {
  return hasEnglishCounterpart(hePath)
}
