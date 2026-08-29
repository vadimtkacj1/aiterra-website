'use client'

import { useId, useState } from 'react'
import SectionHeading from './SectionHeading'
import GridRule from './GridRule'
import FaqItem from './FaqItem'
import { faq, faqEntries } from '../content'
import type { FaqEntry } from '../content'
import styles from './Faq.module.css'

type FaqProps = {
  heading?: string[]
  entries?: FaqEntry[]
  initialOpenId?: string | null
}

export default function Faq({
  heading = faq.heading,
  entries = faqEntries,
  initialOpenId = entries[0]?.id ?? null,
}: FaqProps) {
  const headingId = useId()
  const [openId, setOpenId] = useState<string | null>(initialOpenId)

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id))
  }

  return (
    <section className={styles.faq} aria-labelledby={headingId}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.head}>
            <SectionHeading id={headingId} lines={heading} className={styles.heading} />
          </div>

          <div className={styles.rule}>
            <GridRule columns={[1, 2, 1]} />
          </div>

          <ul className={styles.list}>
            {entries.map((entry) => (
              <FaqItem
                key={entry.id}
                entry={entry}
                open={entry.id === openId}
                onToggle={() => toggle(entry.id)}
              />
            ))}
          </ul>

          <div className={styles.rule}>
            <GridRule columns={[1, 2, 1]} />
          </div>
        </div>
      </div>
    </section>
  )
}
