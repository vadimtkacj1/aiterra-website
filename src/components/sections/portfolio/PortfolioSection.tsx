import Image from 'next/image'
import Link from 'next/link'
import { portfolioProjects } from '@/data/portfolio'

export default function PortfolioSection({ showButton = true }: { showButton?: boolean }) {
  return (
    <section className="py-20" dir="rtl">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
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
                gap: '10px'
              }}
              className="text-[#1B1BB3] text-[13px] transition-opacity duration-300 hover:opacity-80"
            >
              צפו בכל הפרויקטים
            </Link>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolioProjects.map((project) => {
            const external = project.externalUrl?.trim()
            const href = external || `/portfolio/${project.slug}`
            const isExternal = Boolean(external)

            return (
            <Link
              key={project.slug}
              href={href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className="relative w-full overflow-hidden group cursor-pointer block"
            >
              <Image
                src={project.image}
                alt={project.title}
                width={680}
                height={480}
                className="w-full h-auto object-contain"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end p-6 opacity-0 group-hover:opacity-100">
                <span className="text-white font-semibold text-lg">{project.title}</span>
              </div>
            </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
