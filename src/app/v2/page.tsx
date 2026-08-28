import type { Metadata } from 'next'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Stats from './components/Stats'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import AllIn from './components/AllIn'
import Partners from './components/Partners'
import Reels from './components/Reels'
import Faq from './components/Faq'
import ContactForm from './components/ContactForm'
import Reviews from './components/Reviews'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: { absolute: 'AITERRA — סוכנות פיתוח ושיווק דיגיטלי' },
  description:
    'אנחנו בונים אתרי מכירות, אתרי תדמית ודפי נחיתה, מפתחים פתרונות מותאמים לעסקים ומנהלים את מערך השיווק הדיגיטלי — מקמפיינים במטא ובגוגל ועד קידום אורגני במנועי החיפוש.',
  alternates: { canonical: '/' },
}

export default function V2Page() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <Stats />
        <Services />
        <Portfolio />
        <AllIn />
        <Partners />
        <Reels />
        <Reviews />
        <Faq />
      </main>
      <Footer>
        <ContactForm variant="footer" />
      </Footer>
    </>
  )
}
