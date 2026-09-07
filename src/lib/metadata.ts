import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL } from '@/lib/seo'

const DEFAULT_OG_IMAGE = '/images/og/og-aiterra-v2.png'

export function buildMetadata(overrides: Partial<Metadata>): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    ...overrides,
  }
}

type PageMetaInput = {
  title: string
  description: string
  path: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  section?: string
  tags?: string[]
  noIndex?: boolean
  locale?: 'he' | 'en'
  altPath?: string
}

const withSuffix = (title: string) =>
  title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`

const normalizePath = (path: string) => {
  if (!path || path === '/') return '/'
  const withLead = path.startsWith('/') ? path : `/${path}`
  return withLead.replace(/\/+$/, '')
}

export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  imageAlt = SITE_NAME,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
  noIndex = false,
  locale = 'he',
  altPath,
}: PageMetaInput): Metadata {
  const canonical = normalizePath(path)
  const fullTitle = withSuffix(title)
  const alt = altPath ? normalizePath(altPath) : undefined

  const hePath = locale === 'he' ? canonical : alt
  const enPath = locale === 'en' ? canonical : alt

  const languages =
    hePath && enPath
      ? { 'he-IL': hePath, en: enPath, 'x-default': enPath }
      : undefined

  return {
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type,
      locale: locale === 'en' ? 'en_US' : 'he_IL',
      siteName: SITE_NAME,
      url: canonical,
      title: fullTitle,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: imageAlt }],
      ...(type === 'article'
        ? {
            ...(publishedTime ? { publishedTime } : {}),
            ...(modifiedTime ? { modifiedTime } : {}),
            ...(authors?.length ? { authors } : {}),
            ...(section ? { section } : {}),
            ...(tags?.length ? { tags } : {}),
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
  }
}
