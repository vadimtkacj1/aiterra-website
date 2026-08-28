import type { ReactNode } from 'react'
import CircleButton from './CircleButton'
import styles from './Rail.module.css'

type RailProps = {
  title: string
  advanceLabel: string
  onAdvance: () => void
  children: ReactNode
}

export default function Rail({ title, advanceLabel, onAdvance, children }: RailProps) {
  return (
    <section className={styles.rail} aria-label={title}>
      <div className={styles.head}>
        <h2 className={styles.title}>{title}</h2>
        <CircleButton label={advanceLabel} onClick={onAdvance} />
      </div>
      {children}
    </section>
  )
}
