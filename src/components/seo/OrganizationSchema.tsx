import JsonLd from './JsonLd'
import { CONTACT_EMAIL, CONTACT_PHONE_INTL, SOCIAL_PROFILES } from '@/lib/contact'
import { SITE_NAME, SITE_URL } from '@/lib/seo'

export default function OrganizationSchema() {
  const org = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService', 'Organization'],
    '@id': `${SITE_URL}#organization`,
    url: SITE_URL,
    name: SITE_NAME,
    alternateName: 'AITERRA – Digital Marketing & Web Development Agency',
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE_INTL,
    description: 'סוכנות שיווק דיגיטלי מלא – בניית אתרים, SEO, פרסום ממומן ואוטומציה עסקית',
    // Google prefers a raster logo with known dimensions for rich results; SVG
    // can be ignored. TODO: ship a PNG logo and point `url` at it.
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
    // Explicit topical expertise — a direct signal to LLMs of what AITERRA is
    // authoritative on (competitors don't expose this as an Organization node).
    knowsAbout: [
      'בניית אתרים',
      'קידום אתרים אורגני (SEO)',
      'GEO',
      'AEO',
      'אוטומציה עסקית',
      'CRM',
      'בוטים לוואטסאפ',
      'פרסום ממומן (PPC)',
      'בניית חנויות איקומרס',
      'נגישות אתרים תקן 5568',
      'Morning (חשבונית ירוקה)',
      'חשבשבת',
      'iCount',
      'Greeninvoice',
      'Rivhit',
      'Priority',
      'Fireberry',
      'Powerlink',
    ],
    availableLanguage: ['he', 'en', 'ru'],
    currenciesAccepted: 'ILS',
    paymentAccepted: 'מזומן, כרטיס אשראי, העברה בנקאית',
    priceRange: '₪₪',
    // TODO (needs real data): founder (link to /blog/author Person nodes),
    // foundingDate, numberOfEmployees, geo (geocode Ha-Rav Nisanbaum St 37),
    // openingHoursSpecification, and a real Review[]/AggregateRating once
    // genuine on-page reviews exist.
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
