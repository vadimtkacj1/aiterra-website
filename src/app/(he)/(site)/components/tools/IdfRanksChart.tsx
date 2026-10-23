'use client'

import { Fragment, useId, useState } from 'react'
import { compareRanks, filterRanks, groupLabels, groupNotes, idfRanks, type RankGroup } from '@/lib/idf-ranks'
import ui from './toolUi.module.css'
import styles from './IdfRanksChart.module.css'

type Filter = RankGroup | 'all'

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'הכול' },
  { id: 'enlisted', label: groupLabels.enlisted },
  { id: 'nco', label: groupLabels.nco },
  { id: 'officer', label: groupLabels.officer },
]

const groupOrder: RankGroup[] = ['enlisted', 'nco', 'officer']

function RankSelect({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const id = useId()
  return (
    <div className={`${ui.field} ${styles.grow}`}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      <select id={id} className={ui.input} value={value} onChange={(event) => onChange(event.target.value)}>
        {idfRanks.map((rank) => (
          <option key={rank.id} value={rank.id}>
            {rank.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function IdfRanksChart() {
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState<Filter>('all')
  const [first, setFirst] = useState('samal')
  const [second, setSecond] = useState('rav-seren')
  const searchId = useId()
  const groupId = useId()
  const rows = filterRanks(query, group)

  const nameOf = (id: string) => idfRanks.find((rank) => rank.id === id)?.name ?? ''
  const result = compareRanks(first, second)
  const higher = result === 'first' ? first : second
  const lower = result === 'first' ? second : first
  const verdict = result === 'same' ? 'זו אותה דרגה.' : `${nameOf(higher)} גבוהה מ${nameOf(lower)}.`

  return (
    <section className={ui.tool} aria-label="טבלת דרגות צה״ל">
      <div className={`${ui.inner} ${styles.panel}`}>
        <div className={styles.controls}>
          <div className={`${ui.field} ${styles.grow}`}>
            <label htmlFor={searchId} className={ui.label}>
              חיפוש דרגה, ראשי תיבות או שם באנגלית
            </label>
            <input
              id={searchId}
              type="search"
              className={ui.input}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className={ui.field}>
            <label htmlFor={groupId} className={ui.label}>
              קבוצה
            </label>
            <select
              id={groupId}
              className={ui.input}
              value={group}
              onChange={(event) => setGroup(event.target.value as Filter)}
            >
              {filters.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.tableWrap} role="region" aria-label="טבלת הדרגות" tabIndex={0}>
          <table className={styles.table}>
            <caption>דרגות צה״ל מהנמוכה לגבוהה</caption>
            <thead>
              <tr>
                <th scope="col">דרגה</th>
                <th scope="col">ראשי תיבות</th>
                <th scope="col">באנגלית</th>
                <th scope="col">קוד נאט״ו</th>
                <th scope="col">סימן הדרגה</th>
              </tr>
            </thead>
            <tbody>
              {groupOrder.map((id) => {
                const inGroup = rows.filter((rank) => rank.group === id)
                if (!inGroup.length) return null
                return (
                  <Fragment key={id}>
                    <tr className={styles.groupRow}>
                      <th scope="colgroup" colSpan={5}>
                        {groupLabels[id]}
                        <span className={styles.groupNote}>{groupNotes[id]}</span>
                      </th>
                    </tr>
                    {inGroup.map((rank) => (
                      <tr key={rank.id}>
                        <th scope="row">{rank.name}</th>
                        <td>{rank.abbreviation}</td>
                        <td lang="en" dir="ltr">
                          {rank.english}
                        </td>
                        <td lang="en" dir="ltr">
                          {rank.nato || '—'}
                        </td>
                        <td>{rank.worn ? `${rank.insignia}, ${rank.worn}` : rank.insignia}</td>
                      </tr>
                    ))}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className={styles.empty} role="status">
          {rows.length ? '' : 'לא נמצאה דרגה כזו.'}
        </p>

        <div className={styles.compare}>
          <h2 className={ui.outputTitle}>איזו דרגה גבוהה יותר</h2>
          <div className={styles.controls}>
            <RankSelect label="דרגה ראשונה" value={first} onChange={setFirst} />
            <RankSelect label="דרגה שנייה" value={second} onChange={setSecond} />
          </div>
          <p className={styles.verdict} role="status" aria-live="polite">
            {verdict}
          </p>
        </div>
      </div>
    </section>
  )
}
