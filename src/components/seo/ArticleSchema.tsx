// Article structured data для страниц блога
import JsonLd from './JsonLd'

export default function ArticleSchema({ title, datePublished }: { title: string; datePublished: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    datePublished,
  }
  return <JsonLd data={data} />
}
