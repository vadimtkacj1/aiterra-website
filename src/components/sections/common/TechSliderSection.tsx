import type { ReactElement } from 'react'

const techs = [
  { name: 'Next.js', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg' },
  { name: 'TypeScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
  { name: 'Node.js', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original-wordmark.svg' },
  { name: 'Tailwind CSS', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'PostgreSQL', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' },
  { name: 'MongoDB', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg' },
  { name: 'AWS', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
  { name: 'React', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
  { name: 'Python', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
]

export default function TechSliderSection(): ReactElement {
  return (
    <section className="bg-white py-8 overflow-hidden" dir="rtl">
      <style>
        {`
          @keyframes ticker-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-ticker-left {
            animation: ticker-left 30s linear infinite;
          }
        `}
      </style>
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
          <div className="flex w-max animate-ticker-left hover:[animation-play-state:paused]">
            <div className="flex gap-12 pr-12 min-w-max">
              {techs.map((tech, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center gap-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 shrink-0 w-24 h-24"
                >
                  <img src={tech.src} alt={tech.name} className="w-12 h-12 object-contain" />
                  <span className="text-xs font-medium whitespace-nowrap text-gray-600">{tech.name}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-12 pr-12 min-w-max">
              {techs.map((tech, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center gap-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 shrink-0 w-24 h-24"
                >
                  <img src={tech.src} alt={tech.name} className="w-12 h-12 object-contain" />
                  <span className="text-xs font-medium whitespace-nowrap text-gray-600">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}