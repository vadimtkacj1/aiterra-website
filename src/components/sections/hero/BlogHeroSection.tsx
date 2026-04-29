'use client'

import Link from 'next/link'
import HeroVideoBackdrop from '@/components/ui/HeroVideoBackdrop'
import Breadcrumb from '@/components/ui/Breadcrumb'

export default function BlogHeroSection() {
  return (
    <section
      className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center font-sans"
      dir="rtl"
      style={{ backgroundColor: '#080112' }}
    >
      <HeroVideoBackdrop />

      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-28 text-center md:pt-40">
        <div className="flex justify-center mb-4">
          <Breadcrumb items={[{ label: 'בלוג', href: '/blog' }]} variant="dark" />
        </div>
        <h1
          className="text-white mb-6 font-bold"
          style={{
            fontSize: 'clamp(20px, 8vw, 85px)',
            lineHeight: '1.1',
          }}
        >
          בלוג ומאמרים
        </h1>

        <p
          className="text-white/90 max-w-2xl mb-12 text-base md:text-lg font-medium"
          style={{ lineHeight: '1.5' }}
        >
          תובנות מקצועיות, מדריכים מעשיים וחדשות מעולם הדיגיטל. הידע שלנו – בשבילכם.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">

          <button
            className="border border-white bg-transparent text-white px-8 py-3.5 w-full sm:w-55 transition-colors hover:bg-white/10"
            style={{ fontWeight: 600, fontSize: '15px' }}
            onClick={() => {
              const section = document.getElementById('blog-posts')
              if (section) section.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            קראו את הבלוג
          </button>

          <Link
            href="/contact"
            className="bg-white px-8 py-3.5 w-full sm:w-55 transition-transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center"
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
          </Link>

        </div>
      </div>
    </section>
  )
}
