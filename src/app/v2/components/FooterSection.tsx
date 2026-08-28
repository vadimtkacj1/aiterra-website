'use client'

import { useState, type ReactNode } from 'react'
import { ChevronDownIcon, CrossMark } from './icons'
import styles from './Footer.module.css'

type FooterSectionProps = {
  id: string
  title: string
  as?: 'nav' | 'div'
  defaultOpen?: boolean
  children: ReactNode
}

export default function FooterSection({
  id,
  title,
  as = 'div',
  defaultOpen = false,
  children,
}: FooterSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const Tag = as
  const headingId = `v2-footer-${id}`
  const bodyId = `${headingId}-body`

  return (
    <Tag className={styles.column} data-open={open || undefined} aria-labelledby={headingId}>
      <CrossMark className={[styles.cross, styles.crossTop].join(' ')} />
      <CrossMark className={[styles.cross, styles.crossBottom].join(' ')} />

      <h2 id={headingId} className={styles.title}>
        <span className={styles.titleText}>{title}</span>
        <button
          type="button"
          className={styles.titleButton}
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen((current) => !current)}
        >
          {title}
          <ChevronDownIcon className={styles.chevron} />
        </button>
      </h2>

      <div id={bodyId} className={styles.body}>
        {children}
      </div>
    </Tag>
  )
}
