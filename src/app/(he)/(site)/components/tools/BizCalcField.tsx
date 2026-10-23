'use client'

import { useId } from 'react'
import ui from './toolUi.module.css'
import styles from './BizCalc.module.css'

export function BizNumberField({
  label,
  value,
  onChange,
  suffix,
  hint,
  error,
  inputMode = 'decimal',
  maxLength = 16,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  suffix?: string
  hint?: string
  error?: string
  inputMode?: 'decimal' | 'numeric' | 'text'
  maxLength?: number
}) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ')

  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      {hint ? (
        <p id={hintId} className={ui.hint}>
          {hint}
        </p>
      ) : null}
      <div className={styles.affix}>
        <input
          id={id}
          className={`${ui.input} ${ui.ltr} ${styles.number}${suffix ? ` ${styles.withSuffix}` : ''}`}
          inputMode={inputMode}
          autoComplete="off"
          spellCheck={false}
          maxLength={maxLength}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        {suffix ? (
          <span className={styles.suffix} aria-hidden="true">
            {suffix}
          </span>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function BizChoice<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string
  name: string
  options: { value: T; label: string; hint: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <fieldset className={ui.group}>
      <legend className={ui.legend}>{legend}</legend>
      <div className={styles.choices}>
        {options.map((option) => (
          <label key={option.value} className={styles.choice}>
            <input
              type="radio"
              name={name}
              value={option.value}
              className={ui.checkbox}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className={styles.choiceText}>
              <span className={styles.choiceLabel}>{option.label}</span>
              <span className={styles.choiceHint}>{option.hint}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function BizResults({ rows }: { rows: { term: string; value: string; main?: boolean; ltr?: boolean }[] }) {
  return (
    <dl className={styles.results}>
      {rows.map((row) => (
        <div key={row.term} className={row.main ? `${styles.row} ${styles.main}` : styles.row}>
          <dt className={styles.term}>{row.term}</dt>
          <dd className={styles.value} dir={row.ltr ? 'ltr' : undefined}>
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export async function copyText(text: string, setStatus: (status: string) => void, done: string) {
  try {
    await navigator.clipboard.writeText(text)
    setStatus(done)
  } catch {
    setStatus('ההעתקה נכשלה. סמנו את הטקסט והעתיקו ידנית.')
  }
}
