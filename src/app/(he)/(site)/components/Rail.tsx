import type { ReactNode } from 'react'
import Link from 'next/link'
import CircleButton from './CircleButton'
import styles from './Rail.module.css'

type RailProps = {
  title: string
  advanceLabel: string
  href?: string
  onAdvance?: () => void
  children: ReactNode
}

export default function Rail({ title, advanceLabel, href, onAdvance, children }: RailProps) {
  return (
    <section className={styles.rail} aria-label={title}>
      {href ? (
        <Link href={href} className={[styles.head, styles.headLink].join(' ')}>
          <h2 className={styles.title}>{title}</h2>
          <CircleButton label={advanceLabel} as="span" />
        </Link>
      ) : (
        <div className={styles.head}>
          <h2 className={styles.title}>{title}</h2>
          <CircleButton label={advanceLabel} onClick={onAdvance} />
        </div>
      )}
      {children}
    </section>
  )
}
