'use client'

import Link from 'next/link'

export default function ContactHeroSection() {
  return (
    <section
      className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center font-sans"
      dir="rtl"
      style={{ backgroundColor: '#080112' }}
    >
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/gradient.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-28 text-center md:pt-40">

        <h1
          className="text-white mb-6 font-bold"
          style={{
            fontSize: 'clamp(20px, 8vw, 85px)',
            lineHeight: '1.1',
          }}
        >
          Contacts
        </h1>

        <p
          className="text-white/90 max-w-2xl mb-12 text-base md:text-lg font-medium"
          style={{ lineHeight: '1.5' }}
        >
          תכסיסות טכנולוגיות ועד להבאת לקוחות משלמים. אנו מספקים מעטפת שירותים מלאה שתאפשר למדידות של העסק שלכם, כדי להפוך כל נכס דיגיטלי למנוע של צמיחה.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">

          {/* Primary — gradient fill */}
          <button
            style={{
              background: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)',
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
              style={{ background: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)' }}
              className="p-px w-full h-full"
            >
              <div
                style={{ fontWeight: 700, fontSize: '14px', fontFamily: "'Heebo', sans-serif", color: '#1B1BB3' }}
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
