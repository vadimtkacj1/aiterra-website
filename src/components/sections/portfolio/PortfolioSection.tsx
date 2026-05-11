import { getAllPortfolioProjects } from '@/lib/portfolio-server'
import PortfolioGrid from './PortfolioGrid'

export default async function PortfolioSection({ showButton = true }: { showButton?: boolean }) {
  const projects = getAllPortfolioProjects()
  return <PortfolioGrid projects={projects} showButton={showButton} />
}
