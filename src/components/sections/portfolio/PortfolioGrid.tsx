import Link from 'next/link'
import type { PortfolioProject } from '@/types'
import PortfolioImage from './PortfolioImage'
import PortfolioPrefetch from './PortfolioPrefetch'

export default function PortfolioGrid({
  projects,
  showButton = true,
  priorityCount = 0,
}: {
  projects: PortfolioProject[]
  showButton?: boolean
  /** How many leading images to eager-load. Use only when the grid sits near
   *  the top of the page (e.g. the /portfolio page) — keep 0 for below-the-fold
   *  placements (homepage) so it doesn't compete with that page's LCP. */
  priorityCount?: number
}) {
  return (
    <section className="py-20" dir="rtl">
      <PortfolioPrefetch srcs={projects.map((p) => p.image)} />
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-4 mb-12">
          <h2 className="text-[20px] md:text-[48px] font-black text-gray-900 text-right leading-tight">
            תיק עבודות – הפרויקטים שלנו
          </h2>

          {showButton && (
            <Link
              href="/portfolio"
              style={{
                border: '1px solid',
                borderImageSource: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)',
                borderImageSlice: 1,
                width: '265px',
                height: '45px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
              className="text-[#1B1BB3] text-[13px] transition-opacity duration-300 hover:opacity-80"
            >
              צפו בכל הפרויקטים
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const noPage = project.hasPage === false
            const href = noPage ? null : `/portfolio/${project.slug}`
            const isExternal = false

            const inner = (
              <>
                <PortfolioImage
                  src={project.image}
                  alt={project.imageAlt?.trim() || project.title}
                  priority={index < priorityCount}
                />
                {href && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end p-6 opacity-0 group-hover:opacity-100">
                    <span className="text-white font-semibold text-lg">{project.title}</span>
                  </div>
                )}
              </>
            )

            if (!href) {
              return (
                <div key={project.slug} className="relative w-full overflow-hidden block">
                  {inner}
                </div>
              )
            }

            return (
              <Link
                key={project.slug}
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                aria-label={isExternal ? `${project.title} (נפתח בחלון חדש)` : project.title}
                className="relative w-full overflow-hidden group cursor-pointer block"
              >
                {inner}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
