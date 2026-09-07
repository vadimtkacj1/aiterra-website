import type { Metadata } from 'next'
import Header from '../../../(he)/v2/components/Header'
import PageHero from '../../../(he)/v2/components/PageHero'
import PageCrumbs from '../../../(he)/v2/components/PageCrumbs'
import ServicesStack from '../../../(he)/v2/components/ServicesStack'
import AllIn from '../../../(he)/v2/components/AllIn'
import Partners from '../../../(he)/v2/components/Partners'
import Faq from '../../../(he)/v2/components/Faq'
import ContactForm from '../../../(he)/v2/components/ContactForm'
import Footer from '../../../(he)/v2/components/Footer'
import { getV2ContentEn } from '@/lib/v2-content-server'
import { pageMetadata } from '@/lib/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbList, faqPage, webPage } from '@/lib/schema'
import { getEnFaq } from '@/lib/content-en-faq'

export function generateMetadata(): Metadata {
  const { servicesPage } = getV2ContentEn()
  return pageMetadata({
    title: servicesPage.metaTitle,
    description: servicesPage.metaDescription,
    path: '/en/services',
    locale: 'en',
    altPath: '/services',
  })
}

export const revalidate = 300

export default function EnServicesPage() {
  const { servicesPage } = getV2ContentEn()
  const enFaq = getEnFaq('/en/services')
  const entries = (enFaq?.items ?? []).map((item, index) => ({
    id: `en-services-faq-${index + 1}`,
    question: item.q,
    answer: item.a,
  }))
  const faqJsonLd = faqPage({
    path: '/en/services',
    entries: entries.map(({ question, answer }) => ({ question, answer })),
    locale: 'en',
  })

  return (
    <>
      <JsonLd
        data={webPage({
          path: '/en/services',
          name: servicesPage.metaTitle,
          description: servicesPage.metaDescription,
          type: 'CollectionPage',
          locale: 'en',
        })}
      />
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/en' },
          { name: servicesPage.crumb, path: '/en/services' },
        ])}
      />
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
      <Header />
      <main id="main-content">
        <PageHero
          title={servicesPage.title}
          crumb={servicesPage.crumb}
          lede={servicesPage.lede}
          action={servicesPage.action}
          headingId="en-services-page-heading"
          locale="en"
        />
        <PageCrumbs current={servicesPage.crumb} locale="en" homeHref="/en" />
        <ServicesStack />
        <AllIn />
        <Partners locale="en" />
        {entries.length && enFaq ? <Faq heading={enFaq.heading} entries={entries} /> : null}
      </main>
      <Footer locale="en">
        <ContactForm variant="footer" source="en-services" />
      </Footer>
    </>
  )
}
