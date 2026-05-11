import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'
import { getAllPortfolioProjects } from '@/lib/portfolio-server'
import AdminPortfolioActions from './AdminPortfolioActions'

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

        {projects.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 py-16 text-center text-[#9ca3af] text-[14px]">
            אין פרויקטים
          </div>
        )}

        <div className="flex flex-col gap-3 md:hidden">
          {projects.map((project) => (
            <div key={project.slug} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              {project.image && (
                <div className="w-full h-32 rounded-lg overflow-hidden mb-3 bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="font-semibold text-[14px] text-[#111827] leading-snug mb-1">{project.title}</div>
              <div className="text-[11px] text-[#9ca3af] mb-2">{project.slug}</div>
              <div className="text-[12px] text-[#6b7280] mb-1">{project.category}</div>
              <div className="text-[11px] text-[#9ca3af] mb-3">סדר: {project.sortOrder ?? 0}</div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-2">
                  <Link
                    href={`/admin/portfolio/${project.slug}`}
                    className="px-3 py-1.5 text-[12px] font-medium text-[#1B1BB3] border border-[#1B1BB3]/30 rounded-lg hover:bg-[#1B1BB3]/5 transition-colors"
                  >
                    עריכה
                  </Link>
                  <AdminPortfolioActions slug={project.slug} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-right px-6 py-3.5 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide">פרויקט</th>
                <th className="text-right px-4 py-3.5 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide">קטגוריה</th>
                <th className="text-right px-3 py-3.5 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide w-20">סדר</th>
                <th className="text-right px-6 py-3.5 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {projects.map((project) => (
                <tr key={project.slug} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {project.image && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={project.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-[14px] text-[#111827] max-w-xs truncate">{project.title}</div>
                        <div className="text-[12px] text-[#9ca3af] mt-0.5">{project.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[13px] text-[#6b7280]">{project.category}</td>
                  <td className="px-3 py-4 text-[13px] text-[#9ca3af] tabular-nums">{project.sortOrder ?? 0}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/portfolio/${project.slug}`}
                        className="px-3 py-1.5 text-[12px] font-medium text-[#1B1BB3] border border-[#1B1BB3]/30 rounded-lg hover:bg-[#1B1BB3]/5 transition-colors"
                      >
                        עריכה
                      </Link>
                      <AdminPortfolioActions slug={project.slug} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
