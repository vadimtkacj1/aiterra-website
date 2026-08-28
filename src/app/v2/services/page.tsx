import type { Metadata } from 'next'
import Header from '../components/Header'
import PageHero from '../components/PageHero'
import PageCrumbs from '../components/PageCrumbs'
import ServicesStack from '../components/ServicesStack'
import AllIn from '../components/AllIn'
import Partners from '../components/Partners'
import Faq from '../components/Faq'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'
import { getFaqData } from '@/lib/faq-server'
import { servicesPage } from '../content'

export const metadata: Metadata = {
  title: servicesPage.metaTitle,
  description: servicesPage.lede,
}

export const revalidate = 300

export default function V2ServicesPage() {
  const faq = getFaqData('/services')
  const entries = faq.items.map((item, index) => ({
    id: `services-faq-${index + 1}`,
    question: item.q,
    answer: item.a,
  }))

  return (
    <>
      <Header />
      <main id="main-content">
        <PageHero
          title={servicesPage.title}
          crumb={servicesPage.crumb}
          lede={servicesPage.lede}
          action={servicesPage.action}
          headingId="v2-services-page-heading"
        />
        <PageCrumbs current={servicesPage.crumb} />
        <ServicesStack />
        <AllIn />
        <Partners />
        <Faq heading={servicesPage.faqHeading} entries={entries} />
      </main>
      <Footer>
        <ContactForm variant="footer" source="v2-services" />
      </Footer>
    </>
  )
}
