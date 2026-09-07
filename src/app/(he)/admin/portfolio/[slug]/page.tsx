import { notFound } from 'next/navigation'
import AdminHeader from '@/components/admin/AdminHeader'
import PortfolioForm from '@/components/admin/PortfolioForm'
import { getProjectBySlug } from '@/lib/portfolio-server'

export const dynamic = 'force-dynamic'

export default async function EditPortfolioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  return (
    <div>
      <AdminHeader title="עריכת פרויקט" subtitle={project.title} />
      <div className="p-8 max-w-3xl">
        <PortfolioForm initial={project} />
      </div>
    </div>
  )
}
