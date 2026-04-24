'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Navigation from './Navigation'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const gradientTextStyle: React.CSSProperties = {
    background: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  }

  return (
    <header
      className={`w-full h-28 sticky top-0 z-80 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="flex h-full max-w-[1000px] flex-row-reverse items-center justify-between px-8 md:flex-row">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center leading-none md:block">
          <img
            src="/icons/logo.svg"
            alt="Logo"
            className="block h-14 w-14 object-contain md:h-28 md:w-28"
          />
        </Link>

        {/* Navigation & Mobile Burger */}
        <Navigation />

        {/* Desktop Contacts */}
        <div className="hidden md:flex items-center gap-6">
          <div className="h-10 w-px bg-gray-300 mx-6" />
          <div className="flex items-center">
            <Link
              href="/contact"
              className="text-[14px] font-bold leading-none whitespace-nowrap"
              style={gradientTextStyle}
            >
              צור קשר
            </Link>
            <a
              href="mailto:info@aiterra.co.il"
              className="text-[14px] font-bold leading-none whitespace-nowrap ml-4"
              style={gradientTextStyle}
              dir="ltr"
            >
              info@aiterra.co.il
            </a>
          </div>
        </div>

      </div>
    </header>
  )
}
