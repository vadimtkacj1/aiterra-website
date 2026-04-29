'use client'

import type { Service } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import AiterraWordmark from '@/components/ui/AiterraWordmark'
import HeroVideoBackdrop from '@/components/ui/HeroVideoBackdrop'
import Breadcrumb from '@/components/ui/Breadcrumb'

interface Props {
  service: Service
}

export default function ServicePageHeroSection({ service }: Props) {
  return (
    <section
      className="relative overflow-hidden min-h-[100vh] flex flex-col items-center justify-center font-sans"
      dir="rtl"
      style={{ backgroundColor: '#080112' }}
    >
      <HeroVideoBackdrop src='/videos/gradient2.mp4' />
      
      {/* Main Content Container - Centered Vertically */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-grow flex-col items-center justify-center px-6 pt-28 text-center md:pt-40">
        
        {/* Icon Container - 40x40 */}
        <div className="mb-8 flex flex-col items-center justify-center w-full">
            <div className="relative w-[40px] h-[40px]">
              <Image
                src={service.icon}
                alt="Service icon"
                fill
                className="object-contain"
                priority
              />
            </div>
        </div>

        <div className="flex justify-center mb-4">
          <Breadcrumb items={[{ label: 'שירותים', href: '/services' }, { label: service.title }]} variant="dark" />
        </div>
        {/* Title - 48px desktop, 20px mobile */}
        <h1
          className="text-white font-bold mb-6 whitespace-pre-line tracking-tight text-center w-full text-[20px] md:text-[48px]"
          style={{
            lineHeight: '1.2',
          }}
        >
          {service.heroTitle}
        </h1>

        {/* Description - 14px */}
        <p
          className="text-white/90 font-medium mb-10 max-w-3xl text-center"
          style={{ fontSize: '14px' }}
        >
          {service.heroDescription}
        </p>

        {/* Action Button */}
        <Link
          href="/contact"
          className="border border-white text-white px-12 py-3 transition-all hover:bg-white hover:text-purple-900 active:scale-95 inline-block"
          style={{ 
            fontWeight: 500, 
            fontSize: '14px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(4px)'
          }}
        >
          התחילו פרויקט חדש
        </Link>
      </div>

      {/* Background Bottom Text/Logo - Positioned absolute at bottom */}
      <div className="absolute bottom-0 left-0 right-0 w-full flex justify-center pointer-events-none">
          <AiterraWordmark
            src="/images/hero/transperent-aiterra.svg"
            height={400}
            priority
          />
      </div>
    </section>
  )
}