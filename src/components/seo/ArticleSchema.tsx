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
  image,
}: {
  title: string
  description?: string
  datePublished: string
  dateModified?: string
  urlPath?: string
  author?: string
  authorUrl?: string
  image?: string
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description || undefined,
    datePublished,
    dateModified: dateModified ?? datePublished,
    mainEntityOfPage: urlPath ? { '@type': 'WebPage', '@id': `${SITE_URL}${urlPath}` } : undefined,
    author: author
      ? { '@type': 'Person', name: author, ...(authorUrl ? { url: authorUrl } : {}) }
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
