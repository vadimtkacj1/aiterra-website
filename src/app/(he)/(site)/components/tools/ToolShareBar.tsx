'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Check, Link as LinkIcon, Share2 } from 'lucide-react'
import { SITE_URL } from '@/lib/seo'
import styles from './ToolShareBar.module.css'

type ShareMethod = 'whatsapp' | 'facebook' | 'linkedin' | 'x' | 'copy' | 'native'

function BrandIcon({ d }: { d: string }) {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d={d} />
    </svg>
  )
}

const WHATSAPP_PATH =
  'M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.23 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z'
const FACEBOOK_PATH = 'M14 8h3V4h-3c-2.76 0-5 2.24-5 5v2H7v4h2v7h4v-7h3l1-4h-4V9c0-.55.45-1 1-1Z'
const LINKEDIN_PATH =
  'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-4.98c0-1.19-.02-2.72-1.66-2.72-1.66 0-1.91 1.3-1.91 2.63V21h-4V9.75Z'
const X_PATH =
  'M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3Zm-1.08 16.18h1.7L7.4 4.73H5.58l11.09 14.45Z'

export default function ToolShareBar({ path, title }: { path: string; title: string }) {
  const [canShare, setCanShare] = useState(false)
  const [copied, setCopied] = useState(false)
  const url = `${SITE_URL}${path}`
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  useEffect(() => {
    setCanShare(typeof navigator.share === 'function')
  }, [])

  const track = (method: ShareMethod) => window.gtag?.('event', 'tool_share', { method, path })

  const links: { method: ShareMethod; label: string; href: string; icon: ReactNode }[] = [
    {
      method: 'whatsapp',
      label: 'שיתוף בוואטסאפ',
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      icon: <BrandIcon d={WHATSAPP_PATH} />,
    },
    {
      method: 'facebook',
      label: 'שיתוף בפייסבוק',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <BrandIcon d={FACEBOOK_PATH} />,
    },
    {
      method: 'linkedin',
      label: 'שיתוף בלינקדאין',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <BrandIcon d={LINKEDIN_PATH} />,
    },
    {
      method: 'x',
      label: 'שיתוף ב-X',
      href: `https://x.com/intent/post?text=${encodedTitle}&url=${encodedUrl}`,
      icon: <BrandIcon d={X_PATH} />,
    },
  ]

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
      track('copy')
    } catch {
      setCopied(false)
    }
  }

  const nativeShare = async () => {
    try {
      await navigator.share({ title, url })
      track('native')
    } catch {
      return
    }
  }

  return (
    <div className={styles.bar}>
      <p className={styles.label} id="tool-share-label">
        שתפו את הכלי
      </p>
      <ul className={styles.list} aria-labelledby="tool-share-label">
        {links.map((link) => (
          <li key={link.method}>
            <a
              href={link.href}
              className={styles.button}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              title={link.label}
              onClick={() => track(link.method)}
            >
              {link.icon}
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            className={styles.button}
            aria-label={copied ? 'הקישור הועתק' : 'העתקת קישור'}
            title="העתקת קישור"
            onClick={copyLink}
          >
            {copied ? <Check className={styles.icon} aria-hidden="true" /> : <LinkIcon className={styles.icon} aria-hidden="true" />}
          </button>
        </li>
        {canShare ? (
          <li>
            <button type="button" className={styles.button} aria-label="שיתוף" title="שיתוף" onClick={nativeShare}>
              <Share2 className={styles.icon} aria-hidden="true" />
            </button>
          </li>
        ) : null}
      </ul>
      <p className={styles.status} role="status">
        {copied ? 'הקישור הועתק' : ''}
      </p>
    </div>
  )
}
