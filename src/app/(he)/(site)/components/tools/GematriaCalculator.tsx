'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Copy } from 'lucide-react'
import {
  MAX_LENGTH,
  calculate,
  methods,
  readQuery,
  toHebrewNumeral,
  wordsWithValue,
  writeQuery,
} from '@/lib/gematria'
import ui from './toolUi.module.css'
import styles from './GematriaCalculator.module.css'

const ANNOUNCE_DELAY_MS = 900
const DEFAULT_TEXT = 'שלום'

export default function GematriaCalculator() {
  const [text, setText] = useState(DEFAULT_TEXT)
  const [announcement, setAnnouncement] = useState('')
  const [status, setStatus] = useState('')
  const touched = useRef(false)
  const result = useMemo(() => calculate(text), [text])
  const standard = result.totals.standard
  const same = wordsWithValue(standard, text)
  const hasLetters = result.letters.length > 0

  useEffect(() => {
    const initial = readQuery(window.location.search)
    if (initial) setText(initial)
  }, [])

  const spoken = hasLetters ? `${text.trim()} בגימטריה: ${standard}` : ''

  useEffect(() => {
    if (!touched.current) return
    const timer = window.setTimeout(() => setAnnouncement(spoken), ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  useEffect(() => {
    if (!touched.current) return
    window.history.replaceState(null, '', `${window.location.pathname}${writeQuery(text)}`)
  }, [text])

  const copy = async () => {
    const lines = methods.map((method) => `${method.name}: ${result.totals[method.id]}`)
    try {
      await navigator.clipboard.writeText(`${text.trim()}\n${lines.join('\n')}\n${window.location.href}`)
      setStatus('התוצאה הועתקה.')
    } catch {
      setStatus('לא הצלחנו להעתיק. סמנו את התוצאה והעתיקו ידנית.')
    }
  }

  return (
    <section className={ui.tool} aria-labelledby="gematria-input-label">
      <div className={ui.inner}>
        <div className={ui.form}>
          <div className={ui.group}>
            <div className={ui.field}>
              <label id="gematria-input-label" htmlFor="gematria-input" className={ui.legend}>
                מילה, שם או משפט
              </label>
              <textarea
                id="gematria-input"
                className={`${ui.input} ${ui.textarea} ${styles.input}`}
                value={text}
                maxLength={MAX_LENGTH}
                rows={2}
                spellCheck={false}
                aria-describedby="gematria-input-hint"
                onChange={(event) => {
                  touched.current = true
                  setStatus('')
                  setText(event.target.value)
                }}
              />
              <p id="gematria-input-hint" className={ui.hint}>
                אותיות עבריות בלבד נספרות. ניקוד, רווחים, מספרים ואותיות לועזיות לא נכנסים לחישוב.
              </p>
              {result.ignored.length ? (
                <p className={ui.hint}>לא נספרו: {result.ignored.join(' ')}</p>
              ) : null}
            </div>
          </div>

          {hasLetters ? (
            <div className={ui.group}>
              <h2 className={ui.legend}>פירוט לפי אות</h2>
              <div className={styles.tableWrap} tabIndex={0} role="region" aria-label="פירוט ערכי האותיות">
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">אות</th>
                      {methods.map((method) => (
                        <th key={method.id} scope="col">
                          {method.short}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.letters.map((row, index) => (
                      <tr key={`${row.letter}-${index}`}>
                        <th scope="row" className={styles.letter}>
                          {row.letter}
                        </th>
                        {methods.map((method) => (
                          <td key={method.id}>
                            {method.id === 'atbash' || method.id === 'albam' ? (
                              <>
                                <span className={styles.swap}>{method.id === 'atbash' ? row.atbash : row.albam}</span>{' '}
                                {row.values[method.id]}
                              </>
                            ) : (
                              row.values[method.id]
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th scope="row">סה״כ</th>
                      {methods.map((method) => (
                        <td key={method.id}>{result.totals[method.id]}</td>
                      ))}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ) : null}
        </div>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התוצאה</h2>
            {hasLetters ? (
              <>
                <div className={styles.main}>
                  <span className={styles.mainLabel}>{text.trim()} בגימטריה</span>
                  <span className={styles.mainValue}>{standard.toLocaleString('he-IL')}</span>
                  {toHebrewNumeral(standard) ? (
                    <span className={styles.mainNumeral}>באותיות: {toHebrewNumeral(standard)}</span>
                  ) : null}
                </div>
                <dl className={styles.totals}>
                  {methods.slice(1).map((method) => (
                    <div key={method.id} className={styles.total}>
                      <dt>{method.name}</dt>
                      <dd>
                        {result.totals[method.id].toLocaleString('he-IL')}
                        {method.id === 'atbash' ? <span className={styles.swapText}>{result.atbashText}</span> : null}
                        {method.id === 'albam' ? <span className={styles.swapText}>{result.albamText}</span> : null}
                      </dd>
                    </div>
                  ))}
                </dl>
                <h3 className={styles.sameTitle}>מילים מוכרות עם אותו ערך ({standard})</h3>
                {same.length ? (
                  <ul className={styles.same}>
                    {same.map((word) => (
                      <li key={word}>
                        <button
                          type="button"
                          className={styles.sameButton}
                          onClick={() => {
                            touched.current = true
                            setText(word)
                          }}
                        >
                          {word}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={ui.note}>אין ברשימה הקצרה שלנו מילה אחרת עם הערך הזה.</p>
                )}
                <div className={ui.actions}>
                  <button type="button" className={ui.secondary} onClick={copy}>
                    <Copy aria-hidden="true" />
                    העתקת התוצאה והקישור
                  </button>
                </div>
              </>
            ) : (
              <p className={ui.note}>הקלידו מילה בעברית כדי לראות את הערך שלה.</p>
            )}
            <p className={ui.status} role="status">
              {status}
            </p>
            <p className={styles.srOnly} aria-live="polite">
              {announcement}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
