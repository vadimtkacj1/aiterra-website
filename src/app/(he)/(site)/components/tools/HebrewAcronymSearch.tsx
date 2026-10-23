'use client'

import { useId, useState } from 'react'
import {
  acronymCategories,
  acronymEntries,
  categoryLabel,
  searchAcronyms,
  type AcronymCategoryId,
} from '@/lib/hebrew-acronyms'
import ui from './toolUi.module.css'
import styles from './HebrewAcronymSearch.module.css'

type CategoryFilter = AcronymCategoryId | 'all'

export default function HebrewAcronymSearch() {
  const searchId = useId()
  const categoryId = useId()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('all')

  const results = searchAcronyms(query, category)
  const countText = results.length === 0 ? 'לא נמצאו ראשי תיבות' : `מוצגים ${results.length} מתוך ${acronymEntries.length} ראשי תיבות`

  return (
    <section className={ui.tool} aria-label="מילון ראשי תיבות">
      <div className={styles.panel}>
        <div className={styles.controls}>
          <div className={ui.field}>
            <label htmlFor={searchId} className={ui.label}>
              חיפוש ראשי תיבות או פירוש
            </label>
            <input
              id={searchId}
              type="search"
              className={ui.input}
              autoComplete="off"
              placeholder="למשל צה״ל, בס״ד או בערבון"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className={ui.field}>
            <label htmlFor={categoryId} className={ui.label}>
              תחום
            </label>
            <select
              id={categoryId}
              className={ui.input}
              value={category}
              onChange={(event) => setCategory(event.target.value as CategoryFilter)}
            >
              <option value="all">כל התחומים</option>
              {acronymCategories.map((item) => (
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

        <div className={styles.tableWrap} tabIndex={0} role="region" aria-label="טבלת ראשי תיבות">

          <table className={styles.table}>
            <caption className={styles.caption}>ראשי תיבות בעברית עם פירוש ותחום</caption>
            <thead>
              <tr>
                <th scope="col">ראשי תיבות</th>
                <th scope="col">פירוש</th>
                <th scope="col">תחום</th>
              </tr>
            </thead>
            <tbody>
              {results.map((entry) => (
                <tr key={entry.key}>
                  <th scope="row" className={styles.acronym}>
                    {entry.display}
                  </th>
                  <td data-label="פירוש">
                    <ul className={styles.meanings}>
                      {entry.meanings.map((meaning) => (
                        <li key={meaning.text}>{meaning.text}</li>
                      ))}
                    </ul>
                  </td>
                  <td data-label="תחום">
                    <ul className={styles.meanings}>
                      {entry.meanings.map((meaning) => (
                        <li key={meaning.text}>{categoryLabel(meaning.category)}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
