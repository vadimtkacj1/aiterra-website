'use client'

import { useId, useState } from 'react'
import { MAX_DATE, MIN_DATE, findZodiac, formatDate } from '@/lib/chinese-zodiac-finder'
import ui from './toolUi.module.css'
import styles from './ChineseZodiacFinder.module.css'

export default function ChineseZodiacFinder() {
  const [date, setDate] = useState('')
  const baseId = useId()
  const result = findZodiac(date)

  return (
    <section className={ui.tool} aria-labelledby={`${baseId}-title`}>
      <div className={`${ui.inner} ${styles.inner}`}>
        <div className={ui.form}>
          <fieldset className={ui.group}>
            <legend id={`${baseId}-title`} className={ui.legend}>
              תאריך הלידה
            </legend>
            <div className={ui.field}>
              <label htmlFor={`${baseId}-date`} className={ui.label}>
                תאריך לידה
              </label>
              <input
                id={`${baseId}-date`}
                type="date"
                className={`${ui.input} ${ui.date}`}
                min={MIN_DATE}
                max={MAX_DATE}
                value={date}
                aria-invalid={result.kind === 'error' ? true : undefined}
                aria-describedby={`${baseId}-hint${result.kind === 'error' ? ` ${baseId}-error` : ''}`}
                onChange={(event) => setDate(event.target.value)}
              />
              <p id={`${baseId}-hint`} className={ui.hint}>
                אפשר לבחור תאריך בין {formatDate(MIN_DATE)} ל-{formatDate(MAX_DATE)}.
              </p>
              {result.kind === 'error' ? (
                <p id={`${baseId}-error`} className={styles.error}>
                  {result.message}
                </p>
              ) : null}
            </div>
            <div aria-live="polite" aria-atomic="true">
              {result.kind === 'ok' ? (
                <div className={styles.card}>
                  <p>המזל הסיני שלכם הוא</p>
                  <p className={styles.animal}>
                    {result.animal.he} <span lang="en" dir="ltr">({result.animal.en})</span>
                  </p>
                  <dl className={styles.facts}>
                    <div>
                      <dt>יסוד</dt>
                      <dd>{result.element}</dd>
                    </div>
                    <div>
                      <dt>יין או יאנג</dt>
                      <dd>{result.polarity}</dd>
                    </div>
                    <div>
                      <dt>ראש השנה הסיני</dt>
                      <dd>{formatDate(result.startsOn)}</dd>
                    </div>
                  </dl>
                  <p>השנה הסינית הבאה מתחילה ב-{formatDate(result.nextStartsOn)}.</p>
                  {result.beforeNewYear ? (
                    <p>
                      נולדתם לפני ראש השנה הסיני של {result.calendarYear}, ולכן השנה הסינית שלכם היא של{' '}
                      {result.zodiacYear} ולא של {result.calendarYear}.
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className={ui.note}>בחרו תאריך כדי לראות את המזל הסיני.</p>
              )}
            </div>
            <p className={ui.note}>לשעשוע בלבד. אין לכך בסיס מדעי.</p>
          </fieldset>
        </div>
      </div>
    </section>
  )
}
