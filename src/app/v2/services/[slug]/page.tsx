import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '../../components/Header'
import ServiceHero from '../../components/ServiceHero'
import About from '../../components/About'
import ManagementSystem from '../../components/ManagementSystem'
import HowItWorks from '../../components/HowItWorks'
import Pricing from '../../components/Pricing'
import ServiceCases from '../../components/ServiceCases'
import Reels from '../../components/Reels'
import BannerCta from '../../components/BannerCta'
import Faq from '../../components/Faq'
import ContactForm from '../../components/ContactForm'
import Footer from '../../components/Footer'
import ServiceJsonLd from '../../components/ServiceJsonLd'
import { getFaqData } from '@/lib/faq-server'
import { getV2Content } from '@/lib/v2-content-server'
import { pageMetadata } from '@/lib/metadata'

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return Object.keys(getV2Content().servicePages).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const service = getV2Content().servicePages[slug]
  if (!service) return {}

  return pageMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${slug}`,
    image: service.image,
    imageAlt: service.metaTitle,
  })
}

const SHOW_SERVICE_CASES = false
const SHOW_SERVICE_REELS = false

export const revalidate = 300

export default async function V2ServiceDetailPage({ params }: Params) {
  const { slug } = await params
  const service = getV2Content().servicePages[slug]
  if (!service) notFound()

  const shared = getFaqData('/services')
  const entries = (
    service.faqEntries ??
    shared.items.map((item) => ({ question: item.q, answer: item.a }))
  ).map((entry, index) => ({ id: `${slug}-faq-${index + 1}`, ...entry }))

  return (
    <>
      <ServiceJsonLd
        slug={slug}
        name={service.metaTitle}
        description={service.metaDescription}
        entries={entries}
      />
      <Header />
      <main id="main-content">
        <ServiceHero service={service} headingId={`v2-service-${slug}-heading`} />
        <About
          eyebrow={service.advantages.eyebrow}
          heading={service.advantages.heading}
          lede={service.advantages.lede}
          roles={service.advantages.roles}
          outro={service.advantages.outro}
          action={service.advantages.action}
          headingId={`v2-service-${slug}-advantages`}
        />
        {service.system ? (
          <ManagementSystem
            system={service.system}
            headingId={`v2-service-${slug}-system`}
          />
        ) : null}
        {service.howItWorks ? (
          <HowItWorks
            howItWorks={service.howItWorks}
            headingId={`v2-service-${slug}-how`}
          />
        ) : null}
        {SHOW_SERVICE_CASES && service.cases ? (
          <ServiceCases cases={service.cases} headingId={`v2-service-${slug}-cases`} />
        ) : null}
        {SHOW_SERVICE_REELS && service.cases ? <Reels /> : null}
        {service.banner ? (
          <BannerCta banner={service.banner} headingId={`v2-service-${slug}-banner`} />
        ) : null}
        {service.pricing ? (
          <Pricing
            pricing={service.pricing}
            headingId={`v2-service-${slug}-pricing`}
            serviceLabel={getV2Content().serviceTabs.find((tab) => tab.id === slug)?.label}
          />
        ) : null}

        <Faq heading={service.faqHeading} entries={entries} />
      </main>
      <Footer>
        <ContactForm variant="footer" source={`v2-service-${slug}`} />
      </Footer>
    </>
  )
}
