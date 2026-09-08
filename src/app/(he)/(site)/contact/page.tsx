import type { Metadata } from 'next'
import Header from '../components/Header'
import PageHero from '../components/PageHero'
import PageCrumbs from '../components/PageCrumbs'
import ContactForm from '../components/ContactForm'
import ContactDetails from '../components/ContactDetails'
import Faq from '../components/Faq'
import Footer from '../components/Footer'
import { getV2Content } from '@/lib/v2-content-server'
import { getFaqData } from '@/lib/faq-server'
import { pageMetadata } from '@/lib/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbList, faqPage, webPage } from '@/lib/schema'

export function generateMetadata(): Metadata {
  const { contactPage } = getV2Content()
  return pageMetadata({
    title: contactPage.metaTitle,
    description: contactPage.metaDescription,
    path: '/contact',
    altPath: '/en/contact',
  })
}

export default function V2ContactPage() {
  const { contactPage } = getV2Content()
  const faq = getFaqData('/contact')
  const entries = faq.items.map((item, index) => ({
    id: `contact-faq-${index + 1}`,
    question: item.q,
    answer: item.a,
  }))
  const faqJsonLd = faqPage({ path: '/contact', entries: entries.map(({ question, answer }) => ({ question, answer })) })

  return (
    <>
      <JsonLd data={webPage({
        path: '/contact',
        name: contactPage.metaTitle,
        description: contactPage.metaDescription,
        type: 'ContactPage',
      })} />
      <JsonLd data={breadcrumbList([
        { name: 'בית', path: '/' },
        { name: contactPage.crumb, path: '/contact' },
      ])} />
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
      <Header />
      <main id="main-content">
        <PageHero
          title={contactPage.title}
          crumb={contactPage.crumb}
          lede={contactPage.lede}
          headingId="v2-contact-page-heading"
        />
        <PageCrumbs current={contactPage.crumb} />
        <ContactForm source="v2-contact">
          <ContactDetails />
        </ContactForm>
        {entries.length ? <Faq heading={contactPage.faqHeading} entries={entries} /> : null}
      </main>
      <Footer />
    </>
  )
}
