import type { Metadata } from 'next'
import { getAllPortfolioProjects } from '@/lib/portfolio-server'
import { metadataForRoute } from '@/lib/site-seo-server'
import RouteJsonLd from '@/components/seo/RouteJsonLd'
import HomePageClient from './HomePageClient'

export async function generateMetadata(): Promise<Metadata> {
  return metadataForRoute('/')
}

export default async function HomePage() {
  const portfolioProjects = getAllPortfolioProjects()
  return (
    <>
      <RouteJsonLd path="/" />
      <HomePageClient portfolioProjects={portfolioProjects} />
    </>
  )
}
