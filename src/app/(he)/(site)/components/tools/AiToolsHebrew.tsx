'use client'

import { useState } from 'react'
import {
  aiToolCategories,
  aiTools,
  categoryLabel,
  freeLabels,
  hebrewUiLabels,
  type AiToolCategory,
} from '@/lib/ai-tools-hebrew'
import styles from './AiToolsHebrew.module.css'

type Filter = AiToolCategory | 'all'

export default function AiToolsHebrew({ checked }: { checked: string }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [hebrewOnly, setHebrewOnly] = useState(false)
  const visible = aiTools.filter(
    (tool) => (filter === 'all' || tool.category === filter) && (!hebrewOnly || tool.hebrewUi === 'yes'),
  )

  const filters: { id: Filter; label: string }[] = [{ id: 'all', label: 'הכול' }, ...aiToolCategories]

  return (
    <section className={styles.tool} aria-label="טבלת כלי AI בעברית">
      <div className={styles.inner}>
        <div className={styles.controls}>
          <div className={styles.filters} role="group" aria-label="סינון לפי קטגוריה">
            {filters.map((item) => {
              const count = item.id === 'all' ? aiTools.length : aiTools.filter((tool) => tool.category === item.id).length
              return (
                <button
                  key={item.id}
                  type="button"
                  className={styles.filter}
                  aria-pressed={filter === item.id}
                  onClick={() => setFilter(item.id)}
                >
                  {item.label} <span className={styles.count}>{count}</span>
                </button>
              )
            })}
          </div>
          <label className={styles.toggle}>
            <input type="checkbox" checked={hebrewOnly} onChange={() => setHebrewOnly((value) => !value)} />
            <span>רק כלים עם ממשק בעברית</span>
          </label>
        </div>
        <p className={styles.summary} role="status" aria-live="polite">
          מוצגים {visible.length} כלים. נבדק לאחרונה: {checked}.
        </p>
        <table className={styles.table}>
          <caption className={styles.caption}>כלי AI ומה היצרן מתעד על עברית</caption>
          <thead>
            <tr>
              <th scope="col">כלי</th>
              <th scope="col">ממשק בעברית</th>
              <th scope="col">עברית לפי היצרן</th>
              <th scope="col">חינם</th>
              <th scope="col">לעסק קטן</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((tool) => (
              <tr key={tool.id} data-tool-row={tool.id}>
                <th scope="row" className={styles.name}>
                  <a href={tool.url} rel="noopener" target="_blank" lang="en" dir="ltr">
                    {tool.name}
                  </a>
                  <span className={styles.category}>{categoryLabel(tool.category)}</span>
                </th>
                <td data-label="ממשק בעברית">
                  <span className={`${styles.badge} ${styles[tool.hebrewUi]}`}>{hebrewUiLabels[tool.hebrewUi]}</span>
                </td>
                <td data-label="עברית לפי היצרן">
                  {tool.hebrew}{' '}
                  <a href={tool.source} rel="noopener" target="_blank" className={styles.source} aria-label={`מקור: ${tool.name}`}>
                    מקור
                  </a>
                </td>
                <td data-label="חינם">
                  <span className={styles.free}>{freeLabels[tool.free]}</span>
                  {tool.freeNote ? <span className={styles.freeNote}>{tool.freeNote}</span> : null}
                  <a href={tool.pricing} rel="noopener" target="_blank" className={styles.source} aria-label={`מחירים: ${tool.name}`}>
                    מחירים
                  </a>
                </td>
                <td data-label="לעסק קטן">{tool.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 ? <p className={styles.empty}>אין בקטגוריה הזו כלי עם ממשק בעברית.</p> : null}
      </div>
    </section>
  )
}
