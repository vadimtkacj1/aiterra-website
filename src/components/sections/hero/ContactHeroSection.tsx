'use client'

import Link from 'next/link'
import ReactDOM from 'react-dom'
import HeroVideoBackdrop from '@/components/ui/HeroVideoBackdrop'

export default function ContactHeroSection() {
  // Heebo paints above the fold here; preload it per-route (no longer global).
  ReactDOM.preload('/fonts/Heebo/Heebo-VariableFont_wght.woff2', {
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  })

  return (
    <section
      className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center font-sans"
      dir="rtl"
      style={{ backgroundColor: '#060B22' }}
    >
      <HeroVideoBackdrop src='/videos/gradient2.mp4' />

      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-28 text-center md:pt-40">

        <h1
          className="text-white mb-6 font-bold"
          style={{
            fontSize: 'clamp(20px, 8vw, 85px)',
            lineHeight: '1.1',
          }}
        >
          צרו קשר – ייעוץ דיגיטלי חינם לעסק שלכם
        </h1>

        <p
          className="text-white/90 max-w-2xl mb-12 text-base md:text-lg font-medium"
          style={{ lineHeight: '1.5' }}
        >
          מביסוס תשתיות טכנולוגיות ועד להבאת לקוחות משלמים – נשמח להכיר את העסק שלכם. השאירו פרטים ונחזור אליכם עם תוכנית פעולה מותאמת.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">

          {/* Primary — gradient fill */}
          <button
            style={{
              background: 'linear-gradient(92.63deg, #2447D6 14.57%, #3E96F9 99.27%)',
              fontWeight: 700,
              fontSize: '14px',
              fontFamily: "'Heebo', sans-serif",
            }}
            className="w-full sm:w-45 h-13.75 px-4 text-white flex items-center justify-center text-center leading-tight"
            onClick={() => {
              const section = document.getElementById('contact-form')
              if (section) section.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            השאירו פרטים
          </button>

          {/* Secondary — gradient border, white fill */}
          <Link href="/portfolio" className="w-full sm:w-45 h-13.75">
            <div
              style={{ background: 'linear-gradient(92.63deg, #2447D6 14.57%, #3E96F9 99.27%)' }}
              className="p-px w-full h-full"
            >
              <div
                style={{ fontWeight: 700, fontSize: '14px', fontFamily: "'Heebo', sans-serif", color: '#2447D6' }}
                className="w-full h-full bg-white flex items-center justify-center text-center leading-tight"
              >
                צפו בתיק העבודות
              </div>
            </div>
          </Link>

        </div>
      </div>
    </section>
  )
}
