import type { ReactNode } from 'react'
import { CrossMark } from './icons'
import styles from './Footer.module.css'

type FooterSectionProps = {
  id: string
  title: string
  as?: 'nav' | 'div'
  children: ReactNode
}

export default function FooterSection({ id, title, as = 'div', children }: FooterSectionProps) {
  const Tag = as
  const headingId = `v2-footer-${id}`

  return (
    <Tag className={styles.column} aria-labelledby={headingId}>
      <CrossMark className={[styles.cross, styles.crossTop].join(' ')} />
      <CrossMark className={[styles.cross, styles.crossBottom].join(' ')} />

      <h2 id={headingId} className={styles.title}>
        {title}
      </h2>

      <div className={styles.body}>{children}</div>
    </Tag>
  )
}
