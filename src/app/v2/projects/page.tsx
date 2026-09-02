import type { Metadata } from 'next'
import { Suspense } from 'react'
import Header from '../components/Header'
import PageHero from '../components/PageHero'
import PageCrumbs from '../components/PageCrumbs'
import ProjectsGrid from '../components/ProjectsGrid'
import Faq from '../components/Faq'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'
import { getFaqData } from '@/lib/faq-server'
import { projectsPage } from '../content'
import { pageMetadata } from '@/lib/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbList, webPage } from '@/lib/schema'

export const metadata: Metadata = pageMetadata({
  title: projectsPage.metaTitle,
  description: projectsPage.metaDescription,
  path: '/projects',
})

export const revalidate = 300

export default function V2ProjectsPage() {
  const faq = getFaqData('/')
  const entries = faq.items.map((item, index) => ({
    id: `projects-faq-${index + 1}`,
    question: item.q,
    answer: item.a,
  }))

  return (
    <>
      <JsonLd data={webPage({
        path: '/projects',
        name: projectsPage.metaTitle,
        description: projectsPage.metaDescription,
        type: 'CollectionPage',
      })} />
      <JsonLd data={breadcrumbList([
        { name: 'בית', path: '/' },
        { name: projectsPage.crumb, path: '/projects' },
      ])} />
      <Header />
      <main id="main-content">
        <PageHero
          title={projectsPage.title}
          crumb={projectsPage.crumb}
          lede={projectsPage.lede}
          action={projectsPage.action}
          headingId="v2-projects-heading"
        />
        <PageCrumbs current={projectsPage.crumb} />
        <Suspense fallback={null}>
          <ProjectsGrid />
        </Suspense>
        <Faq heading={projectsPage.faqHeading} entries={entries} />
      </main>
      <Footer>
        <ContactForm variant="footer" source="v2-projects" />
      </Footer>
    </>
  )
}
