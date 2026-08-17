import Link from 'next/link'
import type { PortfolioProject } from '@/types'
import PortfolioShot from './PortfolioShot'
import PortfolioPrefetch from './PortfolioPrefetch'

/** Live client URL shown in the frame's address bar (and opened by the ↗ button). */
function liveUrlOf(p: PortfolioProject): string | undefined {
  return p.liveSiteUrl || p.externalUrl
}

function domainOf(url?: string): string {
  if (!url) return ''
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

export default function PortfolioGrid({
  projects,
  showButton = true,
  priorityCount = 0,
}: {
  projects: PortfolioProject[]
  showButton?: boolean
  /** How many leading frames to eager-load. Use only when the grid sits near
   *  the top of the page (e.g. the /portfolio page) — keep 0 for below-the-fold
   *  placements (homepage) so it doesn't compete with that page's LCP. */
  priorityCount?: number
}) {
  const shots = projects.map((p) => p.screenshot || p.image).filter(Boolean)

  return (
    <section className="bg-white py-16 md:py-24" dir="rtl">
      <PortfolioPrefetch srcs={shots} />
      <div className="max-w-7xl mx-auto px-6">
        {/* ── Header ── */}
        <div className="mb-10 md:mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="mb-4 flex items-center gap-3 text-[12px] font-semibold tracking-[0.14em] text-[#8b8b94]">
              <span className="h-px w-8 bg-[linear-gradient(92.63deg,#1B1BB3_14.57%,#530FAD_99.27%)]" />
              PORTFOLIO
            </span>

            <h2 className="text-[20px] md:text-[48px] font-black text-gray-900 text-right leading-tight text-balance">
              תיק עבודות – הפרויקטים שלנו
            </h2>

            <p className="mt-4 text-[13px] md:text-[15px] leading-relaxed text-[#626262]">
              בלי מוקאפים ובלי הדמיות — אלו צילומי מסך אמיתיים מהאתרים שבנינו, כפי שהם באוויר עכשיו.
              העבירו את העכבר על כרטיס כדי לגלול את האתר המלא בתוך החלון.
            </p>
          </div>

          {showButton && (
            <Link
              href="/portfolio"
              style={{
                border: '1px solid',
                borderImageSource: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)',
                borderImageSlice: 1,
                width: '265px',
                height: '45px',
              }}
              className="group inline-flex shrink-0 items-center justify-center gap-2.5 text-[13px] text-[#1B1BB3] transition-opacity duration-300 hover:opacity-80"
            >
              צפו בכל הפרויקטים
              <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>
            </Link>
          )}
        </div>

        {/* ── Frames ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {projects.map((project, index) => {
            const live = liveUrlOf(project)
            const domain = domainOf(live)
            const alt = project.imageAlt?.trim() || project.title
            const src = project.screenshot || project.image

            return (
              <article
                key={project.slug}
                className="shot-card group relative flex flex-col rounded-xl border border-[#ededf2] bg-[#f8f8fb] p-2.5 transition-[background-color,border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-transparent hover:bg-white hover:shadow-[0_18px_44px_rgba(16,16,40,0.12)] md:p-3"
              >
                {/* Browser chrome — the address bar is the proof: a real live domain */}
                <div className="mb-2.5 flex items-center gap-2.5 px-1.5 pt-0.5">
                  <span aria-hidden className="flex shrink-0 items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#dedee7]" />
                    <span className="h-2 w-2 rounded-full bg-[#dedee7]" />
                    <span className="h-2 w-2 rounded-full bg-[#dedee7]" />
                  </span>

                  <span
                    dir="ltr"
                    className="flex min-w-0 max-w-[70%] items-center gap-1.5 rounded-md border border-[#ededf2] bg-white px-2.5 py-1 text-[11px] text-[#8b8b94]"
                  >
                    <svg aria-hidden viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="4" y="11" width="16" height="9" rx="2" />
                      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                    </svg>
                    <span className="truncate">{domain || 'aiterra.co.il'}</span>
                  </span>

                  {live && (
                    <a
                      href={live}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} — פתיחת האתר החי בחלון חדש`}
                      className="relative z-20 ms-auto shrink-0 rounded-md p-1 text-[#b4b4c0] transition-colors duration-200 hover:bg-[#f4f4f7] hover:text-[#1B1BB3]"
                    >
                      <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17 17 7" />
                        <path d="M8 7h9v9" />
                      </svg>
                    </a>
                  )}
                </div>

                <PortfolioShot
                  src={src}
                  alt={alt}
                  scrollable={Boolean(project.screenshot)}
                  priority={index < priorityCount}
                />

                {/* ── Meta — one editorial line (index · title → ⎯ category), tags below ── */}
                <div className="px-1.5 pt-4 pb-1">
                  <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-2.5">
                    <div className="flex min-w-0 items-baseline gap-2.5">
                      <span
                        aria-hidden
                        className="shrink-0 text-[12px] font-bold tabular-nums text-transparent bg-clip-text bg-[linear-gradient(92.63deg,#1B1BB3_14.57%,#530FAD_99.27%)]"
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <h3 className="min-w-0 text-[15px] font-bold text-gray-900 md:truncate md:text-[17px]">
                        {live ? (
                          <a
                            href={live}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${project.title} — פתיחת האתר החי בחלון חדש`}
                            className="after:absolute after:inset-0 after:content-['']"
                          >
                            {project.title}
                            <svg
                              aria-hidden
                              viewBox="0 0 24 24"
                              className="mr-1.5 inline-block h-3.5 w-3.5 align-[-0.1em] text-[#c9c9d6] transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:text-[#1B1BB3]"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M7 17 17 7" />
                              <path d="M8 7h9v9" />
                            </svg>
                          </a>
                        ) : (
                          project.title
                        )}
                      </h3>
                    </div>

                    <span aria-hidden className="hidden h-px min-w-4 flex-1 bg-[#ececf1] md:block" />

                    <span className="shrink-0 ps-6 text-[12px] text-[#8b8b94] md:ps-0">
                      {project.category}
                    </span>
                  </div>

                  {project.tags.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 4).map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-[#e6e6ee] bg-white px-2.5 py-1 text-[11px] text-[#717171] transition-colors duration-300 group-hover:border-[#dcdce6]"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
