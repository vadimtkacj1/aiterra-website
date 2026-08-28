import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '../../components/Header'
import ServiceHero from '../../components/ServiceHero'
import About from '../../components/About'
import Faq from '../../components/Faq'
import ContactForm from '../../components/ContactForm'
import Footer from '../../components/Footer'
import { getFaqData } from '@/lib/faq-server'
import { servicePages } from '../../content'

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return Object.keys(servicePages).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const service = servicePages[slug]
  if (!service) return {}

  return {
    title: service.metaTitle,
    description: service.metaDescription,
  }
}

export const revalidate = 300

export default async function V2ServiceDetailPage({ params }: Params) {
  const { slug } = await params
  const service = servicePages[slug]
  if (!service) notFound()

  const faq = getFaqData('/services')
  const entries = faq.items.map((item, index) => ({
    id: `${slug}-faq-${index + 1}`,
    question: item.q,
    answer: item.a,
  }))

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
        <Faq heading={service.faqHeading} entries={entries} />
      </main>
      <Footer>
        <ContactForm variant="footer" source={`v2-service-${slug}`} />
      </Footer>
    </>
  )
}
