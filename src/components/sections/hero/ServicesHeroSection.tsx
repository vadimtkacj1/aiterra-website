'use client'

import HeroVideoBackdrop from '@/components/ui/HeroVideoBackdrop'
import Breadcrumb from '@/components/ui/Breadcrumb'

export default function ServicesHeroSection() {
  return (
    <section
      className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center font-sans"
      dir="rtl"
      style={{ backgroundColor: '#080112' }}
    >
      <HeroVideoBackdrop />

      {/* Dim overlay so text stays readable */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-28 text-center md:pt-40">

        <div className="flex justify-center mb-4">
          <Breadcrumb items={[{ label: 'שירותים', href: '/services' }]} variant="dark" />
        </div>
        <h1
          className="text-white mb-6 font-bold"
          style={{
            fontSize: 'clamp(20px, 8vw, 85px)',
            lineHeight: '1.1',
          }}
        >
          פתרונות דיגיטל מקצה לקצה
        </h1>

        <p
          className="text-white/90 max-w-175 mb-12 text-base md:text-lg font-medium"
          style={{ lineHeight: '1.5' }}
        >
          מבסוס תשתיות טכנולוגיות ועד להבאת לקוחות משלמים. אנו מספקים מעטפת שירותים
          מלאה שתפורה למידות של העסק שלכם, כדי להפוך כל נכס דיגיטלי למנוע של צמיחה.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">

          <button
            className="border border-white bg-transparent text-white px-8 py-3.5 w-full sm:w-55 transition-colors hover:bg-white/10"
            style={{ fontWeight: 600, fontSize: '15px' }}
          >
            צפו בתיק העבודות
          </button>

          <button
            className="bg-white px-8 py-3.5 w-full sm:w-55 transition-transform hover:scale-105 active:scale-95 shadow-lg"
            style={{ fontWeight: 700, fontSize: '15px' }}
          >
            <span
              style={{
                background: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block',
              }}
            >
              התחילו פרויקט חדש
            </span>
          </button>

        </div>
      </div>
    </section>
  )
}
