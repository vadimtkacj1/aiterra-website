import JsonLd from './JsonLd'
import { CONTACT_EMAIL } from '@/lib/contact'
import { SITE_NAME, SITE_URL } from '@/lib/seo'

export default function OrganizationSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}#organization`,
    url: SITE_URL,
    name: SITE_NAME,
    email: CONTACT_EMAIL,
    description: 'סוכנות שיווק דיגיטלי מלא – בניית אתרים, SEO, פרסום ממומן ואוטומציה עסקית',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'רחוב הרב ניסנבאום 37',
      addressLocality: 'בת ים',
      postalCode: '5962030',
      addressCountry: 'IL',
    },
    areaServed: { '@type': 'Country', name: 'Israel' },
    priceRange: '₪₪',
  }
  return <JsonLd data={data} />
}
