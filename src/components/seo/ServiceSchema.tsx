import JsonLd from './JsonLd'
import { SITE_URL } from '@/lib/seo'

export default function ServiceSchema({
  name,
  description,
  urlPath,
}: {
  name: string
  description: string
  urlPath: string
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: `${SITE_URL}${urlPath}`,
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}#organization`,
    },
    areaServed: { '@type': 'Country', name: 'Israel' },
    serviceType: name,
    inLanguage: 'he',
  }
  return <JsonLd data={data} />
}
