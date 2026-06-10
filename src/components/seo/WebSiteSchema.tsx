import JsonLd from './JsonLd'
import { SITE_NAME, SITE_URL } from '@/lib/seo'

export default function WebSiteSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: 'he',
  }
  return <JsonLd data={data} />
}
