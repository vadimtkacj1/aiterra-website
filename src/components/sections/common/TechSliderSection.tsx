import type { ReactElement } from 'react'

// Self-hosted (was cdn.jsdelivr.net/devicon@latest) — drops an external origin,
// the preconnect, 9 third-party requests, and the unpinned @latest version.
const techs = [
  { name: 'Next.js', src: '/icons/tech/nextjs.svg' },
  { name: 'TypeScript', src: '/icons/tech/typescript.svg' },
  { name: 'Node.js', src: '/icons/tech/nodejs.svg' },
  { name: 'Tailwind CSS', src: '/icons/tech/tailwindcss.svg' },
  { name: 'PostgreSQL', src: '/icons/tech/postgresql.svg' },
  { name: 'MongoDB', src: '/icons/tech/mongodb.svg' },
  { name: 'AWS', src: '/icons/tech/aws.svg' },
  { name: 'React', src: '/icons/tech/react.svg' },
  { name: 'Python', src: '/icons/tech/python.svg' },
]

export default function TechSliderSection(): ReactElement {
  return (
    <section className="bg-white py-8 overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 px-4">
        <div className="shrink-0 text-right z-10 bg-white">
          <p className="font-bold text-[20px] md:text-[32px] leading-snug">
טכנולוגיות שאנו משתמשים בהם
          </p>
        </div>

        <div
          className="flex-1 relative overflow-hidden"
          dir="ltr"
        >
          <div className="flex w-max animate-ticker hover:[animation-play-state:paused]">
            <div className="flex gap-12 pr-12 min-w-max">
              {techs.map((tech, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center gap-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 shrink-0 w-24 h-24"
                >
                  <img src={tech.src} alt={tech.name} width={48} height={48} loading="lazy" decoding="async" className="w-12 h-12 object-contain" />
                  <span className="text-xs font-medium whitespace-nowrap text-gray-600">{tech.name}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-12 pr-12 min-w-max" aria-hidden="true">
              {techs.map((tech, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center gap-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 shrink-0 w-24 h-24"
                >
                  <img src={tech.src} alt="" width={48} height={48} loading="lazy" decoding="async" className="w-12 h-12 object-contain" />
                  <span className="text-xs font-medium whitespace-nowrap text-gray-600" aria-hidden="true">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}