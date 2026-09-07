import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '../../../../(he)/v2/components/Header'
import BannerCta from '../../../../(he)/v2/components/BannerCta'
import ContactForm from '../../../../(he)/v2/components/ContactForm'
import Footer from '../../../../(he)/v2/components/Footer'
import MoreProjects from '../../../../(he)/v2/components/MoreProjects'
import {
  ProjectAbout,
  ProjectIntro,
  ProjectStory,
} from '../../../../(he)/v2/components/ProjectCase'
import { getAllPortfolioProjects, getProjectBySlug } from '@/lib/portfolio-server'
import { applyProjectEn } from '@/lib/content-en-projects'
import { getV2ContentEn } from '@/lib/v2-content-server'
import { pageMetadata } from '@/lib/metadata'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbList, projectSchema } from '@/lib/schema'

type Params = { params: Promise<{ slug: string }> }

export const revalidate = 300

export function generateStaticParams() {
  return getAllPortfolioProjects().map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const base = getProjectBySlug(slug)
  if (!base) return {}
  const project = applyProjectEn(base)
  return pageMetadata({
    title: project.metaTitle || project.title,
    description:
      project.metaDescription ||
      project.heroDescription ||
      `${project.title} - a project from the AITERRA portfolio: ${project.category}.`,
    path: `/en/projects/${slug}`,
    image: project.image,
    imageAlt: project.imageAlt || project.title,
    locale: 'en',
    altPath: `/projects/${slug}`,
  })
}

export default async function EnProjectPage({ params }: Params) {
  const { slug } = await params
  const base = getProjectBySlug(slug)
  if (!base) notFound()
  const project = applyProjectEn(base)

  const content = getV2ContentEn()
  const copy = content.projectPage
  const item = content.portfolioItems.find((entry) => entry.id === slug)

  return (
    <>
      <JsonLd
        data={projectSchema({
          slug: project.slug,
          title: project.title,
          description: project.metaDescription || project.heroDescription || project.title,
          image: project.image,
          category: project.category,
          tags: project.tags,
          launchedAt: project.launchedAt,
          liveSiteUrl: project.liveSiteUrl || project.externalUrl,
        })}
      />
      <JsonLd
        data={breadcrumbList([
          { name: copy.crumbHome, path: '/en' },
          { name: copy.crumb, path: '/en/projects' },
          { name: project.title, path: `/en/projects/${project.slug}` },
        ])}
      />
      <Header />
      <main id="main-content">
        <ProjectIntro project={project} item={item} copy={copy} />
        <ProjectAbout project={project} item={item} copy={copy} />
        <ProjectStory project={project} copy={copy} />
        <BannerCta banner={content.projectBanner} headingId="v2-project-banner" />
        <MoreProjects currentId={slug} eyebrow={copy.moreEyebrow} heading={copy.moreHeading} />
      </main>
      <Footer locale="en">
        <ContactForm variant="footer" source={`en-project-${slug}`} />
      </Footer>
    </>
  )
}
