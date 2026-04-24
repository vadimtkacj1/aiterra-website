'use client'

import type { PortfolioProject } from '@/types'
import Link from 'next/link'

interface Props {
  project: PortfolioProject
}

export default function PortfolioProjectHeroSection({ project }: Props) {
  return (
    <section
      className="relative overflow-hidden min-h-[100vh] flex flex-col items-center justify-center font-sans"
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

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-grow flex-col items-center justify-center px-6 pt-28 text-center md:pt-40">

        <span
          className="text-white/60 text-sm font-medium mb-4 tracking-widest uppercase"
        >
          {project.category}
        </span>

        <h1
          className="text-white font-bold mb-6 whitespace-pre-line tracking-tight"
          style={{ fontSize: 'clamp(20px, 7vw, 72px)', lineHeight: '1.15' }}
        >
          {project.heroTitle}
        </h1>

        <p
          className="text-white/80 font-medium mb-8 max-w-2xl"
          style={{ fontSize: '16px', lineHeight: '1.7' }}
        >
          {project.heroDescription}
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-white/70 text-xs border border-white/20 px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/contact"
            className="border border-white bg-transparent text-white px-8 py-3.5 transition-colors hover:bg-white/10"
            style={{ fontWeight: 600, fontSize: '15px' }}
          >
            התחילו פרויקט דומה
          </Link>

          <Link
            href="/portfolio"
            className="bg-white px-8 py-3.5 transition-transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center"
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
              כל הפרויקטים
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
