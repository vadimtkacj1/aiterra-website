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
import { enMethodNames } from './gematria-en'
import ui from '../../../../(he)/(site)/components/tools/toolUi.module.css'
import styles from '../../../../(he)/(site)/components/tools/GematriaCalculator.module.css'

const ANNOUNCE_DELAY_MS = 900
const DEFAULT_TEXT = 'שלום'

export default function GematriaCalculatorEn() {
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

  const spoken = hasLetters ? `${text.trim()} in gematria: ${standard}` : ''

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
    const lines = methods.map((method) => `${enMethodNames[method.id].name}: ${result.totals[method.id]}`)
    try {
      await navigator.clipboard.writeText(`${text.trim()}\n${lines.join('\n')}\n${window.location.href}`)
      setStatus('Result copied.')
    } catch {
      setStatus('Could not copy. Select the result and copy it manually.')
    }
  }

  return (
    <section className={ui.tool} aria-labelledby="gematria-input-label" dir="ltr">
      <div className={ui.inner}>
        <div className={ui.form}>
          <div className={ui.group}>
            <div className={ui.field}>
              <label id="gematria-input-label" htmlFor="gematria-input" className={ui.legend}>
                Hebrew word, name or phrase
              </label>
              <textarea
                id="gematria-input"
                dir="rtl"
                lang="he"
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
                Only Hebrew letters are counted. Vowel points, spaces, digits and Latin letters are ignored.
              </p>
              {result.ignored.length ? (
                <p className={ui.hint}>
                  Not counted: <span dir="auto">{result.ignored.join(' ')}</span>
                </p>
              ) : null}
            </div>
          </div>

          {hasLetters ? (
            <div className={ui.group}>
              <h2 className={ui.legend}>Letter by letter</h2>
              <div className={styles.tableWrap} tabIndex={0} role="region" aria-label="Letter values">
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">Letter</th>
                      {methods.map((method) => (
                        <th key={method.id} scope="col">
                          {enMethodNames[method.id].short}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.letters.map((row, index) => (
                      <tr key={`${row.letter}-${index}`}>
                        <th scope="row" className={styles.letter} lang="he">
                          {row.letter}
                        </th>
                        {methods.map((method) => (
                          <td key={method.id}>
                            {method.id === 'atbash' || method.id === 'albam' ? (
                              <>
                                <span className={styles.swap} lang="he">
                                  {method.id === 'atbash' ? row.atbash : row.albam}
                                </span>{' '}
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
                      <th scope="row">Total</th>
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
            <h2 className={ui.outputTitle}>Result</h2>
            {hasLetters ? (
              <>
                <div className={styles.main}>
                  <span className={styles.mainLabel}>
                    <span lang="he" dir="rtl">
                      {text.trim()}
                    </span>{' '}
                    in gematria
                  </span>
                  <span className={styles.mainValue}>{standard.toLocaleString('en-US')}</span>
                  {toHebrewNumeral(standard) ? (
                    <span className={styles.mainNumeral}>
                      In Hebrew letters: <span lang="he">{toHebrewNumeral(standard)}</span>
                    </span>
                  ) : null}
                </div>
                <dl className={styles.totals}>
                  {methods.slice(1).map((method) => (
                    <div key={method.id} className={styles.total}>
                      <dt>{enMethodNames[method.id].name}</dt>
                      <dd>
                        {result.totals[method.id].toLocaleString('en-US')}
                        {method.id === 'atbash' ? (
                          <span className={styles.swapText} lang="he">
                            {result.atbashText}
                          </span>
                        ) : null}
                        {method.id === 'albam' ? (
                          <span className={styles.swapText} lang="he">
                            {result.albamText}
                          </span>
                        ) : null}
                      </dd>
                    </div>
                  ))}
                </dl>
                <h3 className={styles.sameTitle}>Well-known words with the same value ({standard})</h3>
                {same.length ? (
                  <ul className={styles.same}>
                    {same.map((word) => (
                      <li key={word}>
                        <button
                          type="button"
                          lang="he"
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
                  <p className={ui.note}>No other word in our short list has this value.</p>
                )}
                <div className={ui.actions}>
                  <button type="button" className={ui.secondary} onClick={copy}>
                    <Copy aria-hidden="true" />
                    Copy result and link
                  </button>
                </div>
              </>
            ) : (
              <p className={ui.note}>Type a word in Hebrew to see its value.</p>
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
