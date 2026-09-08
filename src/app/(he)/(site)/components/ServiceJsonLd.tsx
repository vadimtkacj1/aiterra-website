import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbList, faqPage, serviceOffers, ORG_ID } from '@/lib/schema'
import type { ServicePlanOffer } from '@/lib/schema'
import { SITE_URL } from '@/lib/seo'

type Entry = { question: string; answer: string }

type ServiceJsonLdProps = {
  slug: string
  name: string
  description: string
  entries: Entry[]
  plans?: ServicePlanOffer[]
}

export default function ServiceJsonLd({
  slug,
  name,
  description,
  entries,
  plans,
}: ServiceJsonLdProps) {
  const url = `${SITE_URL}/services/${slug}`
  const offers = serviceOffers(url, plans)

  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name,
    description,
    serviceType: name,
    url,
    inLanguage: 'he',
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'Israel' },
    ...(offers ? { offers } : {}),
  }

  const crumbs = breadcrumbList([
    { name: 'דף הבית', path: '/' },
    { name: 'שירותים', path: '/services' },
    { name, path: `/services/${slug}` },
  ])

  const faq = faqPage({ path: `/services/${slug}`, entries })

  return (
    <>
      <JsonLd data={service} />
      <JsonLd data={crumbs} />
      {faq ? <JsonLd data={faq} /> : null}
    </>
  )
}
