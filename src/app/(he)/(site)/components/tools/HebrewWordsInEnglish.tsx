'use client'

import { useId, useState } from 'react'
import { cityNames, isTruncatedInRegister, searchCities } from '@/lib/hebrew-words-in-english'
import ui from './toolUi.module.css'
import styles from './HebrewWordsInEnglish.module.css'

export default function HebrewWordsInEnglish() {
  const searchId = useId()
  const [query, setQuery] = useState('')
  const results = searchCities(query)
  const countText = results.length === 0 ? 'לא נמצאה עיר' : `מוצגות ${results.length} מתוך ${cityNames.length} ערים`

  return (
    <section className={ui.tool} aria-label="שמות ערים בישראל באנגלית">
      <div className={styles.panel}>
        <div className={ui.field}>
          <label htmlFor={searchId} className={ui.label}>
            חיפוש עיר בעברית או באנגלית
          </label>
          <input
            id={searchId}
            type="search"
            className={ui.input}
            autoComplete="off"
            placeholder="למשל באר שבע, Haifa או Petah"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <p className={styles.count} role="status" aria-live="polite">
          {countText}
        </p>
        <div className={styles.tableWrap} tabIndex={0} role="region" aria-label="טבלת שמות ערים">
          <table className={styles.table}>
            <caption className={styles.caption}>שמות ערים ויישובים בעברית, באיות הרשמי ובאיות המקובל באנגלית</caption>
            <thead>
              <tr>
                <th scope="col">בעברית</th>
                <th scope="col">איות מקובל</th>
                <th scope="col">איות רשמי ברשם</th>
              </tr>
            </thead>
            <tbody>
              {results.map((city) => (
                <tr key={city.hebrew}>
                  <th scope="row" className={styles.hebrew}>
                    {city.hebrew}
                  </th>
                  <td data-label="איות מקובל">
                    <span dir="ltr" className={styles.latin}>
                      {city.common}
                    </span>
                    {city.alt?.length ? (
                      <span className={styles.alt}>
                        גם נפוץ:{' '}
                        <span dir="ltr" className={styles.latin}>
                          {city.alt.join(', ')}
                        </span>
                      </span>
                    ) : null}
                  </td>
                  <td data-label="איות רשמי ברשם">
                    <span dir="ltr" className={styles.latin}>
                      {city.official}
                    </span>
                    {isTruncatedInRegister(city) ? <span className={styles.alt}>נחתך ל-20 תווים ברשם</span> : null}
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
