import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '../../components/Header'
import ServiceHero from '../../components/ServiceHero'
import About from '../../components/About'
import ManagementSystem from '../../components/ManagementSystem'
import HowItWorks from '../../components/HowItWorks'
import Pricing from '../../components/Pricing'
import BannerCta from '../../components/BannerCta'
import Faq from '../../components/Faq'
import ContactForm from '../../components/ContactForm'
import Footer from '../../components/Footer'
import { getFaqData } from '@/lib/faq-server'
import { getV2Content } from '@/lib/v2-content-server'

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return Object.keys(getV2Content().servicePages).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const service = getV2Content().servicePages[slug]
  if (!service) return {}

  return {
    title: service.metaTitle,
    description: service.metaDescription,
  }
}

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
      <Header />
      <main id="main-content">
        <ServiceHero service={service} headingId={`v2-service-${slug}-heading`} />
        <About
          eyebrow={service.advantages.eyebrow}
          heading={service.advantages.heading}
          lede={service.advantages.lede}
          roles={service.advantages.roles}
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
        {service.banner ? (
          <BannerCta banner={service.banner} headingId={`v2-service-${slug}-banner`} />
        ) : null}
        {service.pricing ? (
          <Pricing pricing={service.pricing} headingId={`v2-service-${slug}-pricing`} />
        ) : null}

        <Faq heading={service.faqHeading} entries={entries} />
      </main>
      <Footer>
        <ContactForm variant="footer" source={`v2-service-${slug}`} />
      </Footer>
    </>
  )
}
