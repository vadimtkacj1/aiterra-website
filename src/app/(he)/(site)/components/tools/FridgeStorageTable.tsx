'use client'

import { useId, useState } from 'react'
import {
  FRIDGE_CHECKED,
  FRIDGE_CHECKED_LABEL,
  fridgeGroups,
  fridgeRows,
  rowMatches,
  sourceLink,
  type FridgeGroupId,
} from '@/lib/fridge-storage'
import ui from './toolUi.module.css'
import styles from './FridgeStorageTable.module.css'

type GroupFilter = FridgeGroupId | 'all'

export default function FridgeStorageTable() {
  const searchId = useId()
  const groupId = useId()
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState<GroupFilter>('all')

  const visible = fridgeRows.filter((row) => (group === 'all' || row.group === group) && rowMatches(row, query))
  const countText = visible.length === 0 ? 'לא נמצאו מאכלים' : `מוצגים ${visible.length} מתוך ${fridgeRows.length} מאכלים`

  return (
    <section className={ui.tool} aria-label="טבלת זמני אחסון במקרר ובמקפיא">
      <div className={styles.panel}>
        <div className={styles.controls}>
          <div className={ui.field}>
            <label htmlFor={searchId} className={ui.label}>
              חיפוש מאכל
            </label>
            <input
              id={searchId}
              type="search"
              className={ui.input}
              autoComplete="off"
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
              onChange={(event) => setGroup(event.target.value as GroupFilter)}
            >
              <option value="all">כל הקבוצות</option>
              {fridgeGroups.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className={styles.count} role="status" aria-live="polite">
          {countText}
        </p>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption>
              זמני אחסון לפי מקורות רשמיים. נבדק לאחרונה: <time dateTime={FRIDGE_CHECKED}>{FRIDGE_CHECKED_LABEL}</time>
            </caption>
            <thead>
              <tr>
                <th scope="col">מאכל</th>
                <th scope="col">במקרר (עד 4°C)</th>
                <th scope="col">במקפיא (-18°C)</th>
                <th scope="col">בטמפרטורת החדר</th>
                <th scope="col">מקור</th>
              </tr>
            </thead>
            {fridgeGroups.map((item) => {
              const rows = visible.filter((row) => row.group === item.id)
              if (rows.length === 0) return null
              return (
                <tbody key={item.id}>
                  <tr className={styles.groupRow}>
                    <th scope="rowgroup" colSpan={5} className={styles.groupHead}>
                      {item.label}
                    </th>
                  </tr>
                  {rows.map((row) => {
                    const link = sourceLink(row)
                    return (
                      <tr key={`${row.source}-${row.fkId ?? ''}-${row.name}`}>
                        <th scope="row" className={styles.food}>
                          {row.name}
                          {row.note ? <span className={styles.note}>{row.note}</span> : null}
                        </th>
                        <td data-label="במקרר">{row.fridge}</td>
                        <td data-label="במקפיא">{row.freezer}</td>
                        <td data-label="בטמפרטורת החדר">{row.room}</td>
                        <td data-label="מקור" className={styles.sourceCell}>
                          <a href={link.href} rel="noopener" target="_blank" lang="en" dir="ltr">
                            {link.text}
                          </a>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              )
            })}
          </table>
        </div>
      </div>
    </section>
  )
}
