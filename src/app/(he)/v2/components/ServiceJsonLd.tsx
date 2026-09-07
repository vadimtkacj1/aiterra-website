import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbList, faqPage, ORG_ID } from '@/lib/schema'
import { SITE_URL } from '@/lib/seo'

type Entry = { question: string; answer: string }

type ServiceJsonLdProps = {
  slug: string
  name: string
  description: string
  entries: Entry[]
}

export default function ServiceJsonLd({ slug, name, description, entries }: ServiceJsonLdProps) {
  const url = `${SITE_URL}/services/${slug}`

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
