'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { isAtPageBottom } from '@/lib/scroll'

const gradientStyle = 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)'

const gradientTextStyle: React.CSSProperties = {
  background: gradientStyle,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

const navLinks = [
  { href: '/', label: 'ראשי' },
  { href: '/services', label: 'שירותים' },
  { href: '/blog', label: 'בלוג' },
  { href: '/portfolio', label: 'תיק עבודות' },
  { href: '/about', label: 'אודותינו' },
  { href: '/contact', label: 'צור קשר' },
]

interface HeaderAltProps {
  transparent?: boolean
}

export default function HeaderAlt({ transparent = false }: HeaderAltProps) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [atBottom, setAtBottom] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
      const bottom = isAtPageBottom()
      setAtBottom(bottom)
      if (bottom) setOpen(false)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const onDarkHero = transparent && !scrolled
  const linkClass = `text-[14px] font-bold hover:opacity-70 whitespace-nowrap ${onDarkHero ? 'text-white' : 'text-black'}`
  const contactStyle = onDarkHero ? { color: 'rgba(255,255,255,0.9)' } : gradientTextStyle

  const shellClass = transparent
    ? scrolled
      ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100/80'
      : 'bg-transparent'
    : 'bg-white border-b border-gray-100 shadow-sm'

  return (
    <header
      className={`sticky top-0 z-[80] w-full transition-all duration-300 ${
        atBottom ? '-translate-y-full pointer-events-none' : 'translate-y-0'
      } ${shellClass}`}
    >

      {/* ===== DESKTOP ===== */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-center">

          <div className="flex items-center gap-10">
            <Link href="/" className={linkClass}>ראשי</Link>
            <Link href="/services" className={linkClass}>שירותים</Link>
            <Link href="/contact" className={linkClass}>צור קשר</Link>
          </div>

          <div className="mx-12 flex flex-col items-center">
            <Link href="/">
              <img
                src={onDarkHero ? '/icons/white-logo.svg' : '/icons/logo.svg'}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/icons/logo.svg' }}
                alt="AITERRA"
                className="w-[100px] h-[100px] object-contain"
              />
            </Link>
            <div className="flex items-center gap-1">
              <a href="mailto:info@aiterra.co.il" style={contactStyle} className="text-[14px] font-bold tracking-tight" dir="ltr">
                info@aiterra.co.il
              </a>
              <Link href="/contact" style={contactStyle} className="text-[14px] font-bold">
                צור קשר
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-10" dir="rtl">
            <Link href="/blog" className={linkClass}>בלוג</Link>
            <Link href="/portfolio" className={linkClass}>תיק עבודות</Link>
            <Link href="/about" className={linkClass}>אודותינו</Link>
          </div>

        </div>
      </div>

      {/* ===== MOBILE ===== */}
      <div className="flex h-16 items-center justify-between px-6 md:hidden">

        {/* Logo — block image avoids baseline gap under the icon */}
        <Link href="/" className="flex h-16 w-16 shrink-0 items-center justify-center leading-none">
          <img
            src={onDarkHero ? '/icons/white-logo.svg' : '/icons/logo.svg'}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/icons/logo.svg' }}
            alt="AITERRA"
            className="block h-14 w-14 max-h-14 max-w-14 object-contain"
          />
        </Link>

        {/* Burger — same row height as logo for vertical alignment */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative flex h-16 w-12 shrink-0 items-center justify-center outline-none"
          aria-label="Open menu"
        >
          <span className="flex flex-col items-end gap-[5px]" dir="ltr" aria-hidden>
            <span className={`block h-[3.5px] w-8 rounded-full ${onDarkHero ? 'bg-white' : 'bg-black'} transition-colors duration-300`} />
            <span className={`block h-[3.5px] w-8 rounded-full ${onDarkHero ? 'bg-white' : 'bg-black'} transition-colors duration-300`} />
            <span className={`block h-[3.5px] w-5 rounded-full ${onDarkHero ? 'bg-white' : 'bg-black'} transition-colors duration-300`} />
          </span>
        </button>
      </div>

      {/* Side Drawer */}
      <div
        className={`fixed top-0 right-0 z-[100] h-screen w-70 bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex h-16 items-center justify-between border-b border-gray-50 px-6">
            {/* X всередині дровера */}
            <button
              onClick={() => setOpen(false)}
              className="p-2 outline-none"
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <nav className="flex flex-col p-8 gap-6 text-right" dir="rtl">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xl font-bold text-black border-b border-gray-50 pb-4 transition-all duration-500 ${
                  open ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}
                style={{ transitionDelay: `${i * 70}ms` }}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

    </header>
  )
}