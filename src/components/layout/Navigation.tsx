'use client'
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useDocumentEnd } from '@/context/DocumentEndContext';

const navLinks = [
  { href: '/', label: 'ראשי' },
  { href: '/services', label: 'שירותים' },
  { href: '/blog', label: 'בלוג' },
  { href: '/portfolio', label: 'תיק עבודות' },
  { href: '/about', label: 'אודותינו' },
  { href: '/contact', label: 'צור קשר' },
];

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { atDocumentEnd } = useDocumentEnd();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (atDocumentEnd) setOpen(false);
  }, [atDocumentEnd]);

  const mobileLayer =
    mounted &&
    createPortal(
      <>
        <div
          className={`fixed top-0 right-0 z-[100] h-screen w-[280px] bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex h-16 items-center justify-between border-b border-gray-50 px-6">
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
        {open && (
          <div
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </>,
      document.body,
    );

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-10" dir="rtl">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[14px] font-bold text-black hover:opacity-70 transition-opacity"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Burger — fixed tap area, centered icon (matches Header row height) */}
      <div className="z-[70] flex h-full items-center md:hidden">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="relative flex h-16 w-12 shrink-0 items-center justify-center outline-none"
          aria-label="Menu"
        >
          <span className="flex flex-col items-end gap-[5px]" dir="ltr" aria-hidden>
            <span
              className={`block h-[3.5px] rounded-full bg-black transition-all duration-300 ${open ? 'w-7 translate-y-[8.5px] rotate-45' : 'w-8'}`}
            />
            <span
              className={`block h-[3.5px] w-8 rounded-full bg-black transition-all duration-300 ${open ? 'opacity-0' : ''}`}
            />
            <span
              className={`block h-[3.5px] rounded-full bg-black transition-all duration-300 ${open ? 'w-7 -translate-y-[8.5px] -rotate-45' : 'w-5'}`}
            />
          </span>
        </button>
      </div>

      {mobileLayer}
    </>
  );
};

export default Navigation;
