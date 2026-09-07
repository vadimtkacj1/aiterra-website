import type { Metadata } from 'next'
import { Suspense } from 'react'
import Header from '../../../(he)/v2/components/Header'
import PageHero from '../../../(he)/v2/components/PageHero'
import PageCrumbs from '../../../(he)/v2/components/PageCrumbs'
import ProjectsGrid from '../../../(he)/v2/components/ProjectsGrid'
import ProjectsGridStatic from '../../../(he)/v2/components/ProjectsGridStatic'
import ContactForm from '../../../(he)/v2/components/ContactForm'
import Footer from '../../../(he)/v2/components/Footer'
import Faq from '../../../(he)/v2/components/Faq'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbList, faqPage, webPage } from '@/lib/schema'
import { getEnFaq } from '@/lib/content-en-faq'
import { projectsPageEn } from '@/lib/content-en'
import { getV2ContentEn } from '@/lib/v2-content-server'
import { pageMetadata } from '@/lib/metadata'

export const metadata: Metadata = pageMetadata({
  title: projectsPageEn.metaTitle,
  description: projectsPageEn.metaDescription,
  path: '/en/projects',
  locale: 'en',
  altPath: '/projects',
})

export const revalidate = 300

export default function EnProjectsPage() {
  const content = getV2ContentEn()
  const enFaq = getEnFaq('/en/projects')
  const entries = (enFaq?.items ?? []).map((item, index) => ({
    id: `en-projects-faq-${index + 1}`,
    question: item.q,
    answer: item.a,
  }))
  const faqJsonLd = faqPage({
    path: '/en/projects',
    entries: entries.map(({ question, answer }) => ({ question, answer })),
    locale: 'en',
  })

  return (
    <>
      <JsonLd
        data={webPage({
          path: '/en/projects',
          name: projectsPageEn.metaTitle,
          description: projectsPageEn.metaDescription,
          type: 'CollectionPage',
          locale: 'en',
        })}
      />
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/en' },
          { name: projectsPageEn.crumb, path: '/en/projects' },
        ])}
      />
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
      <Header />
      <main id="main-content">
        <PageHero
          title={projectsPageEn.title}
          crumb={projectsPageEn.crumb}
          lede={projectsPageEn.lede}
          action={projectsPageEn.action}
          headingId="en-projects-heading"
          locale="en"
        />
        <PageCrumbs current={projectsPageEn.crumb} locale="en" homeHref="/en" />
        <Suspense
          fallback={
            <ProjectsGridStatic items={content.portfolioItems} cardAction={content.portfolio.cardAction} />
          }
        >
          <ProjectsGrid />
        </Suspense>
        {entries.length && enFaq ? <Faq heading={enFaq.heading} entries={entries} /> : null}
      </main>
      <Footer locale="en">
        <ContactForm variant="footer" source="en-projects" />
      </Footer>
    </>
  )
}
