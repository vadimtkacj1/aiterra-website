import type { Metadata } from 'next'
import Header from '../components/Header'
import PageHero from '../components/PageHero'
import PageCrumbs from '../components/PageCrumbs'
import ContactForm from '../components/ContactForm'
import ContactDetails from '../components/ContactDetails'
import Footer from '../components/Footer'
import { getV2Content } from '@/lib/v2-content-server'
import { pageMetadata } from '@/lib/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbList, webPage } from '@/lib/schema'

export function generateMetadata(): Metadata {
  const { contactPage } = getV2Content()
  return pageMetadata({
    title: contactPage.metaTitle,
    description: contactPage.metaDescription,
    path: '/contact',
  })
}

export default function V2ContactPage() {
  const { contactPage } = getV2Content()

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
      </main>
      <Footer />
    </>
  )
}
