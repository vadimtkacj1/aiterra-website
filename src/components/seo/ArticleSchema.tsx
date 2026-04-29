import JsonLd from './JsonLd'
import { SITE_NAME, SITE_URL } from '@/lib/seo'

export default function ArticleSchema({
  title,
  datePublished,
  urlPath,
  author,
  image,
}: {
  title: string
  datePublished: string
  urlPath?: string
  author?: string
  image?: string
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    datePublished,
    mainEntityOfPage: urlPath ? { '@type': 'WebPage', '@id': `${SITE_URL}${urlPath}` } : undefined,
    author: author
      ? { '@type': 'Person', name: author }
      : { '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: SITE_NAME },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
      name: SITE_NAME,
    },
    image: image ? { '@type': 'ImageObject', url: image } : undefined,
    inLanguage: 'he',
  }
  return <JsonLd data={data} />
}
