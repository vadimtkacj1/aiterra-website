// Organization structured data (schema.org/Organization)
import JsonLd from './JsonLd'
import { CONTACT_EMAIL, OFFICE_ADDRESS_HE } from '@/lib/contact'
import { SITE_NAME, SITE_URL } from '@/lib/seo'

export default function OrganizationSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}#organization`,
    url: SITE_URL,
    name: SITE_NAME,
    email: CONTACT_EMAIL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: OFFICE_ADDRESS_HE,
      addressCountry: 'IL',
    },
  }
  return <JsonLd data={data} />
}
