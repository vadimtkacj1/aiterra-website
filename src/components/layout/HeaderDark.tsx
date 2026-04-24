'use client'
import React, { useState } from 'react'
import Link from 'next/link'

const navLinks = [
  { href: '/', label: 'ראשי' },
  { href: '/services', label: 'שירותים' },
  { href: '/blog', label: 'בלוג' },
  { href: '/portfolio', label: 'תיק עבודות' },
  { href: '/about', label: 'אודותינו' },
  { href: '/contact', label: 'צור קשר' },
]

export default function HeaderDark() {
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full h-28 relative z-50" style={{ background: 'transparent' }}>
      <div className="max-w-[915px] h-full px-8 flex flex-row-reverse md:flex-row justify-between">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <img
            src="/icons/logo-white.svg"
            alt="Logo"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/icons/logo.svg' }}
            className="object-contain w-16 h-16 md:w-28 md:h-28"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10" dir="rtl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] font-bold text-white/80 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Contacts */}
        <div className="hidden md:flex items-center gap-6">
          <div className="h-10 w-px bg-white/20 mx-6" />
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="text-[14px] font-bold leading-none whitespace-nowrap text-white/80 hover:text-white transition-colors"
            >
              צור קשר
            </Link>
            <a
              href="mailto:info@aiterra.co.il"
              className="text-[14px] font-bold leading-none whitespace-nowrap text-white/80 hover:text-white transition-colors"
              dir="ltr"
            >
              info@aiterra.co.il
            </a>
          </div>
        </div>

        {/* Mobile Burger */}
        <div className="md:hidden flex items-center z-[70]">
          <button
            onClick={() => setOpen(!open)}
            className="flex flex-col gap-1.5 p-2 outline-none"
            aria-label="Menu"
          >
            <div className={`h-[3.5px] bg-white transition-all duration-300 ${open ? 'w-7 rotate-45 translate-y-[8.5px]' : 'w-8'}`} />
            <div className={`h-[3.5px] bg-white transition-all duration-300 ${open ? 'opacity-0' : 'w-8'}`} />
            <div className={`h-[3.5px] bg-white transition-all duration-300 ${open ? 'w-7 -rotate-45 -translate-y-[8.5px]' : 'w-5'}`} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-[280px] shadow-2xl z-[60] transition-transform duration-300 ease-in-out md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ background: '#080112' }}
      >
        <div className="flex flex-col h-full">
          <div className="h-28 flex items-center px-6 border-b border-white/10" />
          <nav className="flex flex-col p-8 gap-6 text-right" dir="rtl">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xl font-bold text-white border-b border-white/10 pb-4 transition-all duration-500 ${
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

      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </header>
  )
}
