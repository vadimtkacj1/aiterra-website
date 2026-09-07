import { SITE_NAME, SITE_URL } from '@/lib/seo'

export const ORG_ID = `${SITE_URL}#organization`
export const SITE_ID = `${SITE_URL}#website`

const abs = (u: string) =>
  u.startsWith('http') ? u : `${SITE_URL}${u.startsWith('/') ? '' : '/'}${u}`

export const toPlainText = (value: string) =>
  value
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

export type Crumb = { name: string; path: string }

export function breadcrumbList(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: abs(crumb.path),
    })),
  }
}

export function webPage({
  path,
  name,
  description,
  image,
  type = 'WebPage',
  locale = 'he',
}: {
  path: string
  name: string
  description: string
  image?: string
  type?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage'
  locale?: 'he' | 'en'
}) {
  const url = abs(path)
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: locale,
    isPartOf: { '@id': SITE_ID },
    about: { '@id': ORG_ID },
    ...(image ? { primaryImageOfPage: { '@type': 'ImageObject', url: abs(image) } } : {}),
  }
}

export function faqPage({
  path,
  entries,
  locale = 'he',
}: {
  path: string
  entries: { question: string; answer: string }[]
  locale?: 'he' | 'en'
}) {
  if (!entries.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${abs(path)}#faq`,
    inLanguage: locale,
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: toPlainText(entry.question),
      acceptedAnswer: { '@type': 'Answer', text: toPlainText(entry.answer) },
    })),
  }
}

export function articleSchema({
  slug,
  title,
  excerpt,
  datePublished,
  dateModified,
  images,
  authorName,
  authorId,
  tags,
  wordCount,
}: {
  slug: string
  title: string
  excerpt: string
  datePublished: string
  dateModified?: string
  images: string[]
  authorName: string
  authorId?: string
  tags: string[]
  wordCount?: number
}) {
  const url = `${SITE_URL}/blog/${slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${url}#webpage` },
    headline: title.slice(0, 110),
    name: title,
    description: toPlainText(excerpt),
    inLanguage: 'he',
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    ...(images.length ? { image: images.map(abs) } : {}),
    author: authorId
      ? { '@id': `${SITE_URL}/blog/author/${authorId}#person` }
      : { '@type': 'Organization', '@id': ORG_ID, name: SITE_NAME },
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': SITE_ID },
    ...(tags.length ? { keywords: tags.join(', ') } : {}),
    ...(wordCount ? { wordCount } : {}),
  }
}

export function projectSchema({
  slug,
  title,
  description,
  image,
  category,
  tags,
  launchedAt,
  liveSiteUrl,
}: {
  slug: string
  title: string
  description: string
  image?: string
  category?: string
  tags?: string[]
  launchedAt?: string
  liveSiteUrl?: string
}) {
  const url = `${SITE_URL}/projects/${slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${url}#project`,
    name: title,
    description: toPlainText(description),
    url,
    inLanguage: 'he',
    creator: { '@id': ORG_ID },
    provider: { '@id': ORG_ID },
    ...(image ? { image: abs(image) } : {}),
    ...(category ? { genre: category } : {}),
    ...(tags?.length ? { keywords: tags.join(', ') } : {}),
    ...(launchedAt ? { datePublished: launchedAt } : {}),
    ...(liveSiteUrl ? { sameAs: [liveSiteUrl] } : {}),
  }
}

export type ServicePlanOffer = {
  id: string
  name: string
  price: string
  priceNote?: string
  audience?: string
}

export function serviceOffers(url: string, plans: ServicePlanOffer[] | undefined) {
  if (!plans?.length) return undefined
  const offers = plans
    .map((plan) => {
      const amount = plan.price.replace(/[^\d.]/g, '')
      if (!amount) return null
      const note = plan.priceNote || ''
      const monthly = note.includes('לחודש') || /month/i.test(note)
      return {
        '@type': 'Offer',
        '@id': `${url}#offer-${plan.id}`,
        name: plan.name,
        ...(plan.audience ? { description: plan.audience } : {}),
        priceCurrency: 'ILS',
        price: amount,
        ...(monthly
          ? {
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: amount,
                priceCurrency: 'ILS',
                unitCode: 'MON',
                billingIncrement: 1,
              },
            }
          : {}),
        availability: 'https://schema.org/InStock',
        url,
      }
    })
    .filter(Boolean)
  return offers.length ? offers : undefined
}
