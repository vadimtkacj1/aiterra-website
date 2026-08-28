import { useId } from 'react'
import { CrossMark } from './icons'
import type { FaqEntry } from '../content'
import styles from './FaqItem.module.css'

type FaqItemProps = {
  entry: FaqEntry
  open: boolean
  onToggle: () => void
}

export default function FaqItem({ entry, open, onToggle }: FaqItemProps) {
  const id = useId()
  const triggerId = `${id}-trigger`
  const panelId = `${id}-panel`

  return (
    <li className={[styles.item, open ? styles.open : ''].filter(Boolean).join(' ')}>
      <h3 className={styles.question}>
        <button
          type="button"
          id={triggerId}
          className={styles.trigger}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className={styles.label}>{entry.question}</span>
          <span className={styles.toggle} aria-hidden="true" />
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!open}
        className={styles.panel}
      >
        <div className={styles.panelInner}>
          <p className={styles.answer}>{entry.answer}</p>
        </div>
      </div>

      <CrossMark className={[styles.cross, styles.crossStart].join(' ')} />
      <CrossMark className={[styles.cross, styles.crossEnd].join(' ')} />
    </li>
  )
}
