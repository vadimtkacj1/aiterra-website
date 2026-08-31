import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
  GOOGLE_MAPS_OPEN_URL,
  OFFICE_ADDRESS_HE,
  SOCIAL_PROFILES,
} from '@/lib/contact'
import { FacebookIcon, InstagramIcon } from './icons'
import FooterSection from './FooterSection'
import { getV2Content } from '@/lib/v2-content-server'
import styles from './Footer.module.css'

export default function Footer({ children }: { children?: ReactNode }) {
  const { footer } = getV2Content()

  const socialLinks = [
    {
      id: 'instagram',
      label: footer.socialLabels.instagram,
      href: SOCIAL_PROFILES.instagram || 'https://www.instagram.com/',
      Icon: InstagramIcon,
    },
    {
      id: 'facebook',
      label: footer.socialLabels.facebook,
      href: SOCIAL_PROFILES.facebook || 'https://www.facebook.com/',
      Icon: FacebookIcon,
    },
  ]

  return (
    <footer className={styles.footer}>
      <div className={styles.media}>
        <video
          className={styles.mediaVideo}
          src="/videos/v2-hero.mp4?v=2"
          poster="/videos/v2-hero-poster.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      </div>

      {children}

      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={[styles.column, styles.brandColumn].join(' ')}>
            <Link href="/v2" className={styles.brand} aria-label={footer.brand}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/aiterra-logo-light.png"
                alt=""
                width={283}
                height={64}
                className={styles.logoMark}
              />
            </Link>
          </div>

          {footer.columns.map((column) => (
            <FooterSection key={column.id} id={column.id} title={column.title} as="nav">
              <ul className={styles.list}>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterSection>
          ))}

          <FooterSection id="contact" title={footer.contactTitle}>
            <address className={styles.contactList}>
              <a href={CONTACT_PHONE_HREF} className={styles.contactLink}>
                <span dir="ltr">{CONTACT_PHONE}</span>
              </a>
              <a
                href={GOOGLE_MAPS_OPEN_URL}
                className={styles.contactLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {OFFICE_ADDRESS_HE}
              </a>
            </address>
            <ul className={styles.social}>
              {socialLinks.map(({ id, label, href, Icon }) => (
                <li key={id}>
                  <a
                    href={href}
                    className={styles.socialLink}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className={styles.socialIcon} />
                  </a>
                </li>
              ))}
            </ul>
          </FooterSection>
        </div>

        <div className={styles.meta}>
          <p className={styles.copyright}>{footer.copyright}</p>
          <ul className={styles.legal}>
            {footer.legal.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.legalLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
