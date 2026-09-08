import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '../../../../(he)/(site)/components/Header'
import ServiceHero from '../../../../(he)/(site)/components/ServiceHero'
import About from '../../../../(he)/(site)/components/About'
import ManagementSystem from '../../../../(he)/(site)/components/ManagementSystem'
import HowItWorks from '../../../../(he)/(site)/components/HowItWorks'
import BannerCta from '../../../../(he)/(site)/components/BannerCta'
import Faq from '../../../../(he)/(site)/components/Faq'
import ContactForm from '../../../../(he)/(site)/components/ContactForm'
import Footer from '../../../../(he)/(site)/components/Footer'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbList, faqPage, serviceOffers, ORG_ID } from '@/lib/schema'
import { SITE_URL } from '@/lib/seo'
import { getV2Content, getV2ContentEn } from '@/lib/v2-content-server'
import { EN_SERVICE_SLUGS } from '@/lib/content-en'
import { pageMetadata } from '@/lib/metadata'

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return EN_SERVICE_SLUGS.map((slug) => ({ slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const service = getV2ContentEn().servicePages[slug]
  if (!service) return {}

  const hasHebrewVersion = Boolean(getV2Content().servicePages[slug])

  return pageMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/en/services/${slug}`,
    image: service.image,
    imageAlt: service.metaTitle,
    locale: 'en',
    ...(hasHebrewVersion ? { altPath: `/services/${slug}` } : {}),
  })
}

export const revalidate = 300

export default async function EnServiceDetailPage({ params }: Params) {
  const { slug } = await params
  if (!(EN_SERVICE_SLUGS as readonly string[]).includes(slug)) notFound()

  const service = getV2ContentEn().servicePages[slug]
  if (!service) notFound()

  const entries = (service.faqEntries ?? []).map((entry, index) => ({
    id: `${slug}-faq-${index + 1}`,
    ...entry,
  }))

  const url = `${SITE_URL}/en/services/${slug}`
  const offers = serviceOffers(url, service.pricing?.plans)

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          '@id': `${url}#service`,
          name: service.metaTitle,
          description: service.metaDescription,
          serviceType: service.metaTitle,
          url,
          inLanguage: 'en',
          provider: { '@id': ORG_ID },
          areaServed: { '@type': 'Country', name: 'Israel' },
          ...(offers ? { offers } : {}),
        }}
      />
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/en' },
          { name: 'Services', path: '/en/services' },
          { name: service.crumb, path: `/en/services/${slug}` },
        ])}
      />
      {entries.length ? <JsonLd data={faqPage({ path: `/en/services/${slug}`, entries, locale: 'en' })!} /> : null}
      <Header />
      <main id="main-content">
        <ServiceHero
          service={service}
          headingId={`en-service-${slug}-heading`}
          locale="en"
          servicesHref="/en/services"
        />
        <About
          eyebrow={service.advantages.eyebrow}
          heading={service.advantages.heading}
          lede={service.advantages.lede}
          roles={service.advantages.roles}
          outro={service.advantages.outro}
          action={service.advantages.action}
          headingId={`en-service-${slug}-advantages`}
          locale="en"
        />
        {service.system ? (
          <ManagementSystem system={service.system} headingId={`en-service-${slug}-system`} />
        ) : null}
        {service.howItWorks ? (
          <HowItWorks howItWorks={service.howItWorks} headingId={`en-service-${slug}-how`} />
        ) : null}
        {service.banner ? (
          <BannerCta banner={service.banner} headingId={`en-service-${slug}-banner`} />
        ) : null}
        <Faq heading={service.faqHeading} entries={entries} />
      </main>
      <Footer locale="en">
        <ContactForm variant="footer" source={`en-service-${slug}`} />
      </Footer>
    </>
  )
}
