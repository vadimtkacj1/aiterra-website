'use client'

import { useId, useState } from 'react'
import { dialFromIsrael, filterCountries, flagOf, type DialingSort } from '@/lib/international-dialing-codes'
import ui from './toolUi.module.css'
import styles from './DialingCodesTable.module.css'

const sortOptions: { id: DialingSort; label: string }[] = [
  { id: 'name', label: 'לפי שם המדינה' },
  { id: 'code', label: 'לפי הקידומת' },
]

export default function DialingCodesTable() {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<DialingSort>('name')
  const searchId = useId()
  const sortId = useId()
  const rows = filterCountries(query, sort)

  return (
    <section className={ui.tool} aria-label="טבלת קידומות בינלאומיות">
      <div className={`${ui.inner} ${styles.panel}`}>
        <div className={styles.controls}>
          <div className={`${ui.field} ${styles.grow}`}>
            <label htmlFor={searchId} className={ui.label}>
              חיפוש לפי שם מדינה, שם באנגלית או קידומת
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
            <label htmlFor={sortId} className={ui.label}>
              מיון
            </label>
            <select
              id={sortId}
              className={ui.input}
              value={sort}
              onChange={(event) => setSort(event.target.value as DialingSort)}
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.tableWrap} role="region" aria-label="קידומות המדינות" tabIndex={0}>
          <table className={styles.table}>
            <caption>קידומות מדינות לחיוג בינלאומי</caption>
            <thead>
              <tr>
                <th scope="col">מדינה</th>
                <th scope="col">באנגלית</th>
                <th scope="col">קידומת</th>
                <th scope="col">חיוג מישראל</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((country) => (
                <tr key={country.iso}>
                  <th scope="row">
                    <span className={styles.flag} aria-hidden="true">
                      {flagOf(country.iso)}
                    </span>
                    {country.name}
                  </th>
                  <td lang="en" dir="ltr">
                    {country.english}
                  </td>
                  <td className={styles.code}>
                    <bdi dir="ltr">+{country.digits}</bdi>
                    {country.note ? <span> ({country.note})</span> : null}
                  </td>
                  <td className={styles.code}>
                    <bdi dir="ltr">{dialFromIsrael(country)}</bdi>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.empty} role="status">
          {rows.length ? '' : 'לא נמצאה מדינה או קידומת כזו.'}
        </p>
      </div>
    </section>
  )
}
