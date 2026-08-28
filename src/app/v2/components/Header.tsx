'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import ActionButton from './ActionButton'
import { BurgerIcon, ChevronDownIcon } from './icons'
import { portfolioFilters, servicesStack } from '../content'
import styles from './Header.module.css'

type NavLink = { label: string; href: string }
type NavItem = NavLink & { children?: NavLink[] }

const navItems: NavItem[] = [
  {
    label: 'שירותים',
    href: '/v2/services',
    children: servicesStack.items.map((item) => ({
      label: item.title,
      href: `/v2/services#v2-service-${item.id}`,
    })),
  },
  { label: 'בלוג', href: '/v2/blog' },
  {
    label: 'תיק עבודות',
    href: '/v2#v2-portfolio',
    children: portfolioFilters
      .filter((filter) => filter.id !== 'all')
      .map((filter) => ({ label: filter.label, href: `/v2#v2-portfolio-${filter.id}` })),
  },
  { label: 'אודות הסוכנות', href: '/v2/about' },
]

const ctaHref = '/v2/contact'
const ctaLabel = 'לקבלת הצעת מחיר'

function NavAnchor({
  href,
  className,
  onClick,
  children,
}: {
  href: string
  className?: string
  onClick?: () => void
  children: ReactNode
}) {
  if (href.includes('#')) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(navItems[0].href)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <header className={styles.bar} data-open={menuOpen || undefined}>
      <div className={styles.inner}>
        <Link href="/v2" className={styles.brand} aria-label="AITERRA" onClick={close}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/aiterra-blog-v2.svg"
            alt=""
            width={55}
            height={40}
            className={styles.logoMark}
          />
          <span className={styles.logoWordmark}>AITERRA</span>
        </Link>

        <nav className={styles.nav} aria-label="ניווט ראשי">
          {navItems.map((item) =>
            item.children ? (
              <div
                key={item.href}
                className={styles.navItem}
                data-open={openMenu === item.href || undefined}
                onMouseEnter={() => setOpenMenu(item.href)}
                onMouseLeave={() => setOpenMenu((current) => (current === item.href ? null : current))}
                onFocus={() => setOpenMenu(item.href)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setOpenMenu((current) => (current === item.href ? null : current))
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setOpenMenu(null)
                }}
              >
                <NavAnchor href={item.href} className={styles.navLink}>
                  <span>{item.label}</span>
                  <ChevronDownIcon className={styles.navChevron} />
                </NavAnchor>

                <div className={styles.menu}>
                  <ul className={styles.menuList}>
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <NavAnchor
                          href={child.href}
                          className={styles.menuLink}
                          onClick={() => setOpenMenu(null)}
                        >
                          {child.label}
                        </NavAnchor>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <NavAnchor key={item.href} href={item.href} className={styles.navLink}>
                <span>{item.label}</span>
              </NavAnchor>
            ),
          )}
        </nav>

        <div className={styles.actions}>
          <ActionButton
            href={ctaHref}
            label={ctaLabel}
            className={styles.cta}
            labelClassName={styles.ctaLabel}
          />

          <button
            type="button"
            className={styles.burger}
            aria-label={menuOpen ? 'סגירת תפריט' : 'תפריט'}
            aria-expanded={menuOpen}
            aria-controls="v2-mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <span className={styles.close} aria-hidden="true" /> : <BurgerIcon className={styles.burgerBars} />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div id="v2-mobile-nav" className={styles.sheet}>
          <nav className={styles.sheetList} aria-label="ניווט נייד">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.href} className={styles.sheetGroup} data-expanded={expanded === item.href || undefined}>
                  <div className={styles.sheetRow}>
                    <NavAnchor href={item.href} className={styles.sheetRowLink} onClick={close}>
                      {item.label}
                    </NavAnchor>
                    <button
                      type="button"
                      className={styles.sheetToggle}
                      aria-label={`${item.label} — ${expanded === item.href ? 'סגירה' : 'פתיחה'}`}
                      aria-expanded={expanded === item.href}
                      aria-controls={`v2-sheet-${item.href.replace(/\W+/g, '-')}`}
                      onClick={() => setExpanded((current) => (current === item.href ? null : item.href))}
                    >
                      <ChevronDownIcon className={styles.sheetChevron} />
                    </button>
                  </div>
                  {expanded === item.href ? (
                    <ul id={`v2-sheet-${item.href.replace(/\W+/g, '-')}`} className={styles.sheetSub}>
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <NavAnchor href={child.href} className={styles.sheetSubLink} onClick={close}>
                            {child.label}
                          </NavAnchor>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : (
                <NavAnchor key={item.href} href={item.href} className={styles.sheetLink} onClick={close}>
                  {item.label}
                </NavAnchor>
              ),
            )}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
