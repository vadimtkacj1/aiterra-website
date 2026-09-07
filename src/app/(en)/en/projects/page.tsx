import type { Metadata } from 'next'
import { Suspense } from 'react'
import Header from '../../../(he)/v2/components/Header'
import PageHero from '../../../(he)/v2/components/PageHero'
import PageCrumbs from '../../../(he)/v2/components/PageCrumbs'
import ProjectsGrid from '../../../(he)/v2/components/ProjectsGrid'
import ContactForm from '../../../(he)/v2/components/ContactForm'
import Footer from '../../../(he)/v2/components/Footer'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbList, webPage } from '@/lib/schema'
import { projectsPageEn } from '@/lib/content-en'
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
        <Suspense fallback={null}>
          <ProjectsGrid />
        </Suspense>
      </main>
      <Footer>
        <ContactForm variant="footer" source="en-projects" />
      </Footer>
    </>
  )
}
