'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import ActionButton from './ActionButton'
import { BurgerIcon, ChevronDownIcon } from './icons'
import {
  header as headerDefaults,
  portfolioFilters as portfolioFiltersDefaults,
  servicesStack as servicesStackDefaults,
} from '../content'
import { useV2 } from '../V2ContentProvider'
import styles from './Header.module.css'

type NavLink = { label: string; href: string }
type NavItem = NavLink & { children?: NavLink[]; overviewLabel?: string }

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
  const header = useV2('header', headerDefaults)
  const servicesStack = useV2('servicesStack', servicesStackDefaults)
  const portfolioFilters = useV2('portfolioFilters', portfolioFiltersDefaults)

  const submenus: Record<string, NavLink[]> = {
    services: servicesStack.items.map((item) => ({
      label: item.title,
      href: item.action.href.startsWith('/services/')
        ? item.action.href
        : `/services#v2-service-${item.id}`,
    })),
    portfolio: portfolioFilters
      .filter((filter) => filter.id !== 'all')
      .map((filter) => ({ label: filter.label, href: `/projects?filter=${filter.id}` })),
  }

  const navItems: NavItem[] = header.nav.map((item) => ({
    label: item.label,
    href: item.href,
    overviewLabel: item.overviewLabel,
    children: item.submenu ? submenus[item.submenu] : undefined,
  }))

  const [menuOpen, setMenuOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

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
    <>
      <header className={styles.bar} data-open={menuOpen || undefined}>
        <div className={styles.inner}>
          <Link href="/" className={styles.brand} aria-label={header.brand} onClick={close}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/aiterra-logo-dark.png"
              alt=""
              width={211}
              height={50}
              className={styles.logoMark}
            />
          </Link>

          <nav className={styles.nav} aria-label={header.navLabel}>
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
              href={header.cta.href}
              label={header.cta.label}
              className={styles.cta}
              labelClassName={styles.ctaLabel}
            />

            <button
              type="button"
              className={styles.burger}
              aria-label={menuOpen ? header.menuClose : header.menuOpen}
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
            <nav className={styles.sheetList} aria-label={header.mobileNavLabel}>
              {navItems.map((item) =>
                item.children ? (
                  <div key={item.href} className={styles.sheetGroup} data-expanded={expanded === item.href || undefined}>
                    <div className={styles.sheetRow}>
                      <button
                        type="button"
                        className={styles.sheetRowLink}
                        aria-expanded={expanded === item.href}
                        aria-controls={`v2-sheet-${item.href.replace(/\W+/g, '-')}`}
                        onClick={() => setExpanded((current) => (current === item.href ? null : item.href))}
                      >
                        {item.label}
                        <ChevronDownIcon className={styles.sheetChevron} />
                      </button>
                    </div>
                    {expanded === item.href ? (
                      <ul id={`v2-sheet-${item.href.replace(/\W+/g, '-')}`} className={styles.sheetSub}>
                        <li>
                          <NavAnchor href={item.href} className={styles.sheetSubLink} onClick={close}>
                            {item.overviewLabel ?? item.label}
                          </NavAnchor>
                        </li>
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

      {menuOpen ? (
        <button type="button" className={styles.scrim} aria-label={header.menuClose} onClick={close} />
      ) : null}
    </>
  )
}
