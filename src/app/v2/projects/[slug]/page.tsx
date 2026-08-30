import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '../../components/Header'
import BannerCta from '../../components/BannerCta'
import ContactForm from '../../components/ContactForm'
import Footer from '../../components/Footer'
import MoreProjects from '../../components/MoreProjects'
import { ProjectAbout, ProjectIntro, ProjectStory } from '../../components/ProjectCase'
import { getAllPortfolioProjects, getProjectBySlug } from '@/lib/portfolio-server'
import { getV2Content } from '@/lib/v2-content-server'

type Params = { params: Promise<{ slug: string }> }

export const revalidate = 300

export function generateStaticParams() {
  return getAllPortfolioProjects().map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return {}
  return {
    title: project.metaTitle || project.title,
    description: project.metaDescription || project.heroDescription,
  }
}

export default async function V2ProjectPage({ params }: Params) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const content = getV2Content()
  const copy = content.projectPage
  const item = content.portfolioItems.find((entry) => entry.id === slug)

  return (
    <>
      <Header />
      <main id="main-content">
        <ProjectIntro project={project} item={item} copy={copy} />
        <ProjectAbout project={project} item={item} copy={copy} />
        <ProjectStory project={project} copy={copy} />
        <BannerCta banner={content.projectBanner} headingId="v2-project-banner" />
        <MoreProjects
          currentId={slug}
          eyebrow={copy.moreEyebrow}
          heading={copy.moreHeading}
        />
      </main>
      <Footer>
        <ContactForm variant="footer" source={`v2-project-${slug}`} />
      </Footer>
    </>
  )
}
