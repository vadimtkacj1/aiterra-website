import JsonLd from './JsonLd'
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_INTL,
  DIRECTORY_PROFILES,
  GOOGLE_BUSINESS_PROFILE_URL,
  OPENING_HOURS,
  SOCIAL_PROFILES,
} from '@/lib/contact'
import { authorsEn } from '@/lib/content-en-authors'
import { personId, personNames, personUrl } from '@/lib/schema'
import { SITE_NAME, SITE_URL } from '@/lib/seo'
import { teamMembers } from '@/data/team-members'

const DISAMBIGUATING_DESCRIPTION = {
  he: 'סוכנות תוכנה ודיגיטל ישראלית מבת ים שבונה אתרים, אפליקציות ואוטומציה לעסקים קטנים ובינוניים.',
  en: 'Israeli software and digital agency based in Bat Yam that builds websites, apps and automation for small and medium businesses.',
}

const DESCRIPTION = {
  he: 'סוכנות דיגיטל ופיתוח – בניית אתרים, SEO ו-GEO, פרסום ממומן, אוטומציה לעסקים וסוכני AI (בינה מלאכותית)',
  en: 'Digital and development agency: websites, SEO and GEO, paid advertising, business automation and AI agents.',
}

const STREET_ADDRESS = { he: 'רחוב הרב ניסנבאום 37', en: 'Ha-Rav Nisanbaum St 37' }
const LOCALITY = { he: 'בת ים', en: 'Bat Yam' }
const SERVED_CITIES = { he: ['בת ים', 'תל אביב', 'גוש דן'], en: ['Bat Yam', 'Tel Aviv', 'Gush Dan'] }
const PAYMENT_ACCEPTED = { he: 'מזומן, כרטיס אשראי, העברה בנקאית', en: 'Cash, credit card, bank transfer' }

export default function OrganizationSchema({ locale = 'he' }: { locale?: 'he' | 'en' }) {
  const employees = teamMembers.map((m) => ({
    '@type': 'Person',
    '@id': personId(m.id),
    ...personNames(m.id, m.name, locale),
    jobTitle: locale === 'en' ? authorsEn[m.id]?.role ?? m.role : m.role,
    url: personUrl(m.id, locale),
  }))
  const org = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService', 'Organization'],
    '@id': `${SITE_URL}#organization`,
    url: SITE_URL,
    name: SITE_NAME,
    alternateName: ['Aiterra', 'אייטרה', 'Aiterra Agency', 'AITERRA – Digital Marketing & Web Development Agency'],
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE_INTL,
    description: DESCRIPTION[locale],
    disambiguatingDescription: DISAMBIGUATING_DESCRIPTION[locale],
    // Raster logo with known dimensions — Google prefers this over SVG for rich
    // results (generated from icons/logo.svg by scripts, see public/icons/logo-512-v2.png).
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/icons/logo-512-v2.png`,
      width: 512,
      height: 512,
    },
    image: `${SITE_URL}/images/og/og-aiterra-v2.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: STREET_ADDRESS[locale],
      addressLocality: LOCALITY[locale],
      postalCode: '5962030',
      addressCountry: 'IL',
    },
    hasMap: GOOGLE_BUSINESS_PROFILE_URL,
    openingHoursSpecification: OPENING_HOURS.map(({ days, opens, closes }) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: days.map((day) => `https://schema.org/${day}`),
      opens,
      closes,
    })),
    areaServed: [
      { '@type': 'Country', name: 'Israel' },
      ...SERVED_CITIES[locale].map((name) => ({ '@type': 'City', name })),
    ],
    // Explicit topical expertise — a direct signal to LLMs of what AITERRA is
    // authoritative on (competitors don't expose this as an Organization node).
    knowsAbout: [
      'בניית אתרים',
      'Web development',
      'פיתוח אפליקציות למובייל ולדסקטופ',
      'Mobile and desktop app development',
      'פיתוח תוכנה בכל סטאק',
      'למידת מכונה (Machine learning)',
      'שילוב AI באתרים',
      'AI integration for websites',
      'DevOps',
      'Paid advertising',
      'SEO and GEO',
      'Online stores',
      'קידום אתרים אורגני (SEO)',
      'GEO',
      'AEO',
      'אוטומציה עסקית',
      'אוטומציה לעסקים',
      'אוטומציות AI',
      'Business automation',
      'סוכני AI',
      'AI agents',
      'בינה מלאכותית לעסקים',
      'WhatsApp Business API',
      'Make',
      'n8n',
      'Zapier',
      'CRM',
      'Monday',
      'HubSpot',
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
    paymentAccepted: PAYMENT_ACCEPTED[locale],
    priceRange: '₪₪',
    employee: employees,
    numberOfEmployees: { '@type': 'QuantitativeValue', value: teamMembers.length },
    sameAs: [...Object.values(SOCIAL_PROFILES).filter(Boolean), ...DIRECTORY_PROFILES, GOOGLE_BUSINESS_PROFILE_URL],
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    alternateName: ['Aiterra', 'אייטרה'],
    publisher: { '@id': `${SITE_URL}#organization` },
    inLanguage: ['he', 'en'],
  }

  return (
    <>
      <JsonLd data={org} />
      <JsonLd data={website} />
    </>
  )
}
