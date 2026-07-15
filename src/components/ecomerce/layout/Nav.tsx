'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import Logo from '@/components/ecomerce/ui/Logo'

// The landing lives at /landings/ecomerce inside the main site, so every hash
// target is absolute to that route — a bare `/#…` would jump to the site home.
const BASE = '/landings/ecomerce'
const LINKS = [
  { href: `${BASE}#about`, label: 'מי אנחנו' },
  { href: `${BASE}#advantages`, label: 'היתרונות' },
  { href: `${BASE}#portfolio`, label: 'תיק עבודות' },
  { href: `${BASE}#testimonials`, label: 'המלצות' },
]

const CTA_HREF = `${BASE}#lead-form`

/**
 * Full-bleed hairline bar, flush to the top edge. Not a floating glass pill:
 * the nav belongs to the paper band and is separated from the page by a single
 * rule that only appears once you have scrolled past the hero's first line.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // The sheet covers the viewport, so the page behind it must not scroll.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // A phone in landscape is already past 768px (iPhone 14 Pro 852, Pixel 7 915),
  // where the sheet and its X are both md:hidden — but the body lock above is
  // keyed to `open`, not to the breakpoint. Rotating with the menu open would
  // strand the page: nothing left to close, `overflow: hidden` still on the body.
  useEffect(() => {
    if (!open) return
    const mq = window.matchMedia('(min-width: 768px)')
    const sync = () => {
      if (mq.matches) setOpen(false)
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [open])

  // The X is the sheet's only pointer dismissal, and it sits in the bar rather
  // than inside the panel — so the panel is deliberately not `aria-modal` (that
  // would hide its own close control from a screen reader). Escape is the second
  // way out for anyone driving this from a keyboard.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // While the sheet is open the bar IS the panel's top edge, so it carries the
  // solid state even at scroll 0 — and the single hairline at 64px lives here,
  // not on the sheet. It is also opaque on a phone: a translucent bar composites
  // whatever ink band is passing beneath it into a darker strip across an
  // otherwise uniform paper panel.
  return (
    <header
      dir="rtl"
      className={`band-paper fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        open || scrolled
          ? 'rule-b bg-paper md:bg-paper/95 md:backdrop-blur-sm'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-[72px] md:px-8">
        <Link
          href={BASE}
          aria-label="Aiterra — לעמוד הבית"
          className="flex items-center gap-2.5 max-md:min-h-11"
        >
          <Logo className="h-5.5 w-auto" />
          <span className="font-brutalist text-[21px] font-bold lowercase leading-none tracking-[-0.03em]">
            aiterra
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="sweep label t-muted transition-colors hover:text-[color:var(--fg)]"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={CTA_HREF}
            className="btn btn-primary hidden px-6 py-3 text-[13px] md:inline-flex"
          >
            שיחת אפיון
          </a>
          <button
            type="button"
            aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="rule-all grid h-11 w-11 place-items-center md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* mobile sheet — a solid paper panel of ruled rows. No glass. */}
      {open && (
        <div
          id="mobile-nav"
          role="dialog"
          aria-label="תפריט ניווט"
          className="band-paper fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto md:hidden"
        >
          {/* The inset lives on the link, not the list: a row rule has to run the
              full bleed the bar's rule does, and the thumb has to reach the edge. */}
          <ul className="flex flex-col">
            {LINKS.map((l, i) => (
              <li key={l.href} className="rule-b">
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 px-5 py-5"
                >
                  <span className="mark t-accent text-[12px] font-bold">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-brutalist text-[24px] font-bold">
                    {l.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="p-5">
            <a
              href={CTA_HREF}
              onClick={() => setOpen(false)}
              className="btn btn-primary w-full"
            >
              שיחת אפיון עם מומחה
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
