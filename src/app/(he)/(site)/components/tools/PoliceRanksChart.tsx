'use client'

import { Fragment, useId, useState } from 'react'
import {
  filterPoliceRanks,
  groupLabels,
  groupNotes,
  idfNameOf,
  policeGroupOrder,
  type PoliceGroup,
} from '@/lib/police-ranks'
import ui from './toolUi.module.css'
import styles from './PoliceRanksChart.module.css'

type Filter = PoliceGroup | 'all'

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'הכול' },
  ...policeGroupOrder.map((id) => ({ id, label: groupLabels[id] })),
]

export default function PoliceRanksChart() {
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState<Filter>('all')
  const searchId = useId()
  const groupId = useId()
  const rows = filterPoliceRanks(query, group)

  return (
    <section className={ui.tool} aria-label="טבלת דרגות משטרת ישראל">
      <div className={`${ui.inner} ${styles.panel}`}>
        <div className={styles.controls}>
          <div className={`${ui.field} ${styles.grow}`}>
            <label htmlFor={searchId} className={ui.label}>
              חיפוש דרגה, ראשי תיבות, שם באנגלית או דרגה בצה״ל
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
            <caption>דרגות משטרת ישראל מהנמוכה לגבוהה</caption>
            <thead>
              <tr>
                <th scope="col">דרגה</th>
                <th scope="col">ראשי תיבות</th>
                <th scope="col">באנגלית</th>
                <th scope="col">מקבילה בצה״ל</th>
                <th scope="col">תפקיד אופייני</th>
                <th scope="col">מיקום הדרגה</th>
              </tr>
            </thead>
            <tbody>
              {policeGroupOrder.map((id) => {
                const inGroup = rows.filter((rank) => rank.group === id)
                if (!inGroup.length) return null
                return (
                  <Fragment key={id}>
                    <tr className={styles.groupRow}>
                      <th scope="colgroup" colSpan={6}>
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
                        <td>{idfNameOf(rank.idfId)}</td>
                        <td>{rank.role || <span className={styles.dash}>—</span>}</td>
                        <td>{rank.worn}</td>
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
      </div>
    </section>
  )
}
