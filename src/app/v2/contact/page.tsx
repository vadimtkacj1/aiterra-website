import type { Metadata } from 'next'
import Header from '../components/Header'
import PageHero from '../components/PageHero'
import PageCrumbs from '../components/PageCrumbs'
import ContactForm from '../components/ContactForm'
import ContactDetails from '../components/ContactDetails'
import Footer from '../components/Footer'
import { contactPage } from '../content'

export const metadata: Metadata = {
  title: contactPage.metaTitle,
  description: contactPage.lede,
}

export default function V2ContactPage() {
  return (
    <>
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
