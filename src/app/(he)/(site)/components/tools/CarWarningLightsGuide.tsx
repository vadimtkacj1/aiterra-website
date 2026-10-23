'use client'

import { useId, useState } from 'react'
import { filterLights, levels, type LightLevel } from '@/lib/car-warning-lights-guide'
import CarWarningLightIcon from './CarWarningLightIcons'
import ui from './toolUi.module.css'
import styles from './CarWarningLightsGuide.module.css'

type Filter = LightLevel | 'all'

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'הכול' },
  ...levels.map((level) => ({ value: level.value, label: level.label })),
]

export default function CarWarningLightsGuide() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const baseId = useId()
  const lights = filterLights(query, filter)

  return (
    <section className={ui.tool} aria-labelledby={`${baseId}-title`}>
      <div className={`${ui.inner} ${styles.inner}`}>
        <div className={ui.form}>
          <fieldset className={ui.group}>
            <legend id={`${baseId}-title`} className={ui.legend}>
              חיפוש נורת אזהרה
            </legend>
            <div className={ui.field}>
              <label htmlFor={`${baseId}-query`} className={ui.label}>
                שם הנורה או מילה מהתיאור
              </label>
              <input
                id={`${baseId}-query`}
                type="search"
                className={ui.input}
                autoComplete="off"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div role="group" aria-label="סינון לפי צבע" className={styles.filters}>
              {filters.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={styles.filter}
                  aria-pressed={filter === item.value}
                  onClick={() => setFilter(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className={styles.count} role="status">
              {lights.length > 0 ? `מוצגות ${lights.length} נורות` : 'לא נמצאה נורה. נסו מילה אחרת או הגדירו הכול.'}
            </p>
            <ul className={styles.grid}>
              {lights.map((light) => (
                <li key={light.id} className={`${styles.card} ${styles[light.level]}`}>
                  <span className={styles.icon}>
                    <CarWarningLightIcon id={light.id} />
                  </span>
                  <div className={styles.body}>
                    <h3 className={styles.name}>{light.name}</h3>
                    <p className={styles.badge}>צבע בדרך כלל: {light.colorName}</p>
                    <p>{light.meaning}</p>
                    <p>
                      <strong>מה עושים:</strong> {light.action}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <p className={ui.note}>
              הסמלים בכלי מצוירים על ידינו ואינם זהים לסמלים של יצרן מסוים. הצורה והצבע בלוח המחוונים של הרכב שלכם
              עשויים להיראות שונה, ולכן בדקו תמיד בספר הרכב.
            </p>
          </fieldset>
        </div>
      </div>
    </section>
  )
}
