import JsonLd from './JsonLd'
import { SITE_NAME, SITE_URL } from '@/lib/seo'

export default function ArticleSchema({
  title,
  description,
  datePublished,
  dateModified,
  urlPath,
  author,
  authorUrl,
  authorJobTitle,
  authorBio,
  authorImage,
  authorSameAs,
  image,
}: {
  title: string
  description?: string
  datePublished: string
  dateModified?: string
  urlPath?: string
  author?: string
  authorUrl?: string
  authorJobTitle?: string
  authorBio?: string
  authorImage?: string
  authorSameAs?: string[]
  image?: string
}) {
  const absolute = (u?: string) => (u ? (u.startsWith('http') ? u : `${SITE_URL}${u}`) : undefined)
  const sameAs = (authorSameAs ?? []).filter(Boolean)
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description || undefined,
    datePublished,
    dateModified: dateModified ?? datePublished,
    mainEntityOfPage: urlPath ? { '@type': 'WebPage', '@id': `${SITE_URL}${urlPath}` } : undefined,
    // Full Person for author E-E-A-T (credentials, link, photo, employer)
    // instead of a bare name — a strong authority signal for LLMs.
    author: author
      ? {
          '@type': 'Person',
          name: author,
          ...(authorJobTitle ? { jobTitle: authorJobTitle } : {}),
          ...(authorBio ? { description: authorBio } : {}),
          ...(absolute(authorImage) ? { image: absolute(authorImage) } : {}),
          ...(absolute(authorUrl) ? { url: absolute(authorUrl) } : {}),
          // sameAs = external identity anchors only (the on-site author page is `url`).
          ...(sameAs.length ? { sameAs } : {}),
          worksFor: { '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: SITE_NAME },
        }
      : { '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: SITE_NAME },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
      name: SITE_NAME,
    },
    image: image
      ? { '@type': 'ImageObject', url: image.startsWith('http') ? image : `${SITE_URL}${image}` }
      : undefined,
    inLanguage: 'he',
  }
  return <JsonLd data={data} />
}
