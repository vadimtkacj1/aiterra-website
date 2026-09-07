import type { Metadata } from 'next'
import Header from '../../../(he)/v2/components/Header'
import PageHero from '../../../(he)/v2/components/PageHero'
import PageCrumbs from '../../../(he)/v2/components/PageCrumbs'
import ContactForm from '../../../(he)/v2/components/ContactForm'
import ContactDetails from '../../../(he)/v2/components/ContactDetails'
import Footer from '../../../(he)/v2/components/Footer'
import { getV2ContentEn } from '@/lib/v2-content-server'
import { pageMetadata } from '@/lib/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbList, webPage } from '@/lib/schema'

export function generateMetadata(): Metadata {
  const { contactPage } = getV2ContentEn()
  return pageMetadata({
    title: contactPage.metaTitle,
    description: contactPage.metaDescription,
    path: '/en/contact',
    locale: 'en',
    altPath: '/contact',
  })
}

export const revalidate = 300

export default function EnContactPage() {
  const { contactPage } = getV2ContentEn()

  return (
    <>
      <JsonLd
        data={webPage({
          path: '/en/contact',
          name: contactPage.metaTitle,
          description: contactPage.metaDescription,
          type: 'ContactPage',
          locale: 'en',
        })}
      />
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/en' },
          { name: contactPage.crumb, path: '/en/contact' },
        ])}
      />
      <Header />
      <main id="main-content">
        <PageHero
          title={contactPage.title}
          crumb={contactPage.crumb}
          lede={contactPage.lede}
          headingId="en-contact-page-heading"
          locale="en"
        />
        <PageCrumbs current={contactPage.crumb} locale="en" homeHref="/en" />
        <ContactForm source="en-contact">
          <ContactDetails locale="en" />
        </ContactForm>
      </main>
      <Footer locale="en" />
    </>
  )
}
