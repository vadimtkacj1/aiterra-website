// Article structured data для страниц блога
import JsonLd from './JsonLd'
import { SITE_URL } from '@/lib/seo'

export default function ArticleSchema({
  title,
  datePublished,
  urlPath,
}: {
  title: string
  datePublished: string
  urlPath?: string
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    datePublished,
    mainEntityOfPage: urlPath ? `${SITE_URL}${urlPath}` : undefined,
  }
  return <JsonLd data={data} />
}
