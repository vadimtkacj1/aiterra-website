import JsonLd from './JsonLd'
import { CONTACT_EMAIL, CONTACT_PHONE_HREF, SOCIAL_PROFILES } from '@/lib/contact'
import { SITE_NAME, SITE_URL } from '@/lib/seo'

export default function OrganizationSchema() {
  const org = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}#organization`,
    url: SITE_URL,
    name: SITE_NAME,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE_HREF,
    description: 'סוכנות שיווק דיגיטלי מלא – בניית אתרים, SEO, פרסום ממומן ואוטומציה עסקית',
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/icons/logo.svg`,
    },
    image: `${SITE_URL}/images/hero/hero-aiterra.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'רחוב הרב ניסנבאום 37',
      addressLocality: 'בת ים',
      postalCode: '5962030',
      addressCountry: 'IL',
    },
    areaServed: [
      { '@type': 'Country', name: 'Israel' },
      { '@type': 'City', name: 'בת ים' },
      { '@type': 'City', name: 'תל אביב' },
      { '@type': 'City', name: 'גוש דן' },
    ],
    priceRange: '₪₪',
    sameAs: Object.values(SOCIAL_PROFILES).filter(Boolean),
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { '@id': `${SITE_URL}#organization` },
    inLanguage: 'he',
  }

  return (
    <>
      <JsonLd data={org} />
      <JsonLd data={website} />
    </>
  )
}
