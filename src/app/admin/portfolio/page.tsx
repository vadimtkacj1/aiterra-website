import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'
import PortfolioReorderList from '@/components/admin/PortfolioReorderList'
import { getAllPortfolioProjects } from '@/lib/portfolio-server'

export const dynamic = 'force-dynamic'

const gradient = 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)'

export default function AdminPortfolioPage() {
  const projects = getAllPortfolioProjects()

  return (
    <div>
      <AdminHeader title="תיק עבודות" subtitle={`${projects.length} פרויקטים`} />

      <div className="p-4 md:p-8">
        <div className="flex justify-end mb-5">
          <Link
            href="/admin/portfolio/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-[14px] font-bold hover:opacity-90 transition-opacity"
            style={{ background: gradient }}
          >
            + פרויקט חדש
          </Link>
        </div>

        <PortfolioReorderList projects={projects} />
      </div>
    </div>
  )
}
