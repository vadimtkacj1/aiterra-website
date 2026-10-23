'use client'

import { useId, useState } from 'react'
import { Copy } from 'lucide-react'
import { convertNumber, convertRoman } from '@/lib/roman-numerals'
import ui from './toolUi.module.css'
import styles from './RomanNumeralsConverter.module.css'

export default function RomanNumeralsConverter() {
  const [number, setNumber] = useState('2026')
  const [roman, setRoman] = useState('MCMXCIV')
  const [status, setStatus] = useState('')
  const baseId = useId()

  const toRoman = convertNumber(number)
  const fromRoman = convertRoman(roman)

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setStatus(`הועתק: ${text}`)
    } catch {
      setStatus('לא הצלחנו להעתיק. סמנו את התוצאה והעתיקו ידנית.')
    }
  }

  return (
    <section className={ui.tool} aria-labelledby={`${baseId}-title`}>
      <div className={`${ui.inner} ${styles.inner}`}>
        <div className={ui.form}>
          <fieldset className={ui.group}>
            <legend id={`${baseId}-title`} className={ui.legend}>
              ממספר רגיל לרומי
            </legend>
            <div className={ui.field}>
              <label htmlFor={`${baseId}-number`} className={ui.label}>
                מספר בין 1 ל-3999
              </label>
              <input
                id={`${baseId}-number`}
                className={`${ui.input} ${ui.ltr}`}
                inputMode="numeric"
                autoComplete="off"
                maxLength={6}
                value={number}
                aria-invalid={toRoman.kind === 'error' ? true : undefined}
                aria-describedby={toRoman.kind === 'error' ? `${baseId}-number-error` : undefined}
                onChange={(event) => {
                  setStatus('')
                  setNumber(event.target.value)
                }}
              />
              {toRoman.kind === 'error' ? (
                <p id={`${baseId}-number-error`} className={styles.error}>
                  {toRoman.message}
                </p>
              ) : null}
            </div>
            <div aria-live="polite" aria-atomic="true">
              {toRoman.kind === 'ok' ? (
                <div className={styles.result}>
                  <p className={styles.resultText} dir="ltr" lang="en">
                    {toRoman.roman}
                  </p>
                  <button type="button" className={ui.secondary} onClick={() => copy(toRoman.roman)}>
                    <Copy aria-hidden="true" />
                    העתקה
                  </button>
                </div>
              ) : null}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>מרומי למספר רגיל</legend>
            <div className={ui.field}>
              <label htmlFor={`${baseId}-roman`} className={ui.label}>
                מספר רומי
              </label>
              <input
                id={`${baseId}-roman`}
                className={`${ui.input} ${ui.ltr}`}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                maxLength={16}
                value={roman}
                aria-invalid={fromRoman.kind === 'error' ? true : undefined}
                aria-describedby={fromRoman.kind === 'error' ? `${baseId}-roman-error` : undefined}
                onChange={(event) => {
                  setStatus('')
                  setRoman(event.target.value)
                }}
              />
              {fromRoman.kind === 'error' ? (
                <p id={`${baseId}-roman-error`} className={styles.error}>
                  {fromRoman.message}
                </p>
              ) : null}
            </div>
            <div aria-live="polite" aria-atomic="true">
              {fromRoman.kind === 'ok' ? (
                <div className={styles.result}>
                  <p className={styles.resultText} dir="ltr">
                    {fromRoman.value}
                  </p>
                  <button type="button" className={ui.secondary} onClick={() => copy(String(fromRoman.value))}>
                    <Copy aria-hidden="true" />
                    העתקה
                  </button>
                </div>
              ) : null}
            </div>
          </fieldset>
          <p className={ui.status} role="status">
            {status}
          </p>
        </div>
      </div>
    </section>
  )
}
