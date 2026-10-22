'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Copy, Hash } from 'lucide-react'
import {
  amountLine,
  amountToWords,
  countingNote,
  errorMessage,
  formatAmount,
  formatNumber,
  numberLine,
  parseValue,
  signedNumberToWords,
  totalAgorot,
  type CurrencyStyle,
  type Gender,
  type WordsMode,
} from '@/lib/amount-in-words'
import ui from './toolUi.module.css'
import styles from './AmountInWords.module.css'

type Option<T extends string> = { value: T; label: string; hint: string }

type Outcome = { words: string; digits: string; line: string; note: string } | null

const ANNOUNCE_DELAY_MS = 900

const modeOptions: Option<WordsMode>[] = [
  { value: 'money', label: 'סכום בשקלים', hint: "לצ'ק, לחשבונית ולקבלה" },
  { value: 'number', label: 'מספר', hint: 'בזכר או בנקבה' },
]

const styleOptions: Option<CurrencyStyle>[] = [
  { value: 'new-shekel', label: 'שקלים חדשים', hint: 'הנוסח המלא' },
  { value: 'abbreviation', label: 'ש״ח', hint: 'בקיצור' },
  { value: 'shekel', label: 'שקלים', hint: 'בלי ״חדשים״' },
]

const genderOptions: Option<Gender>[] = [
  { value: 'feminine', label: 'נקבה', hint: 'מספר סתמי, או שם עצם בנקבה' },
  { value: 'masculine', label: 'זכר', hint: 'שם עצם בזכר: ימים, ספרים' },
]

const fieldText: Record<WordsMode, { label: string; hint: string; empty: string }> = {
  money: {
    label: 'סכום בספרות',
    hint: 'למשל 1,250.50 או 1250.5 ₪',
    empty: 'הקלידו סכום, ותקבלו אותו כאן במילים. למשל, 1,250.50 ₪ הם אלף מאתיים וחמישים שקלים חדשים וחמישים אגורות בלבד.',
  },
  number: {
    label: 'מספר בספרות',
    hint: 'למשל 15 או 2,000',
    empty: 'הקלידו מספר, ותקבלו אותו כאן במילים. למשל, 15 הוא חמש עשרה בנקבה וחמישה עשר בזכר.',
  },
}

function ChoiceGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  layout,
  children,
}: {
  legend: string
  name: string
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  layout: string
  children?: ReactNode
}) {
  return (
    <fieldset className={ui.group}>
      <legend className={ui.legend}>{legend}</legend>
      <div className={`${styles.choices} ${layout}`}>
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
      {children}
    </fieldset>
  )
}

export default function AmountInWords() {
  const [mode, setMode] = useState<WordsMode>('money')
  const [value, setValue] = useState('')
  const [style, setStyle] = useState<CurrencyStyle>('new-shekel')
  const [only, setOnly] = useState(true)
  const [gender, setGender] = useState<Gender>('feminine')
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const name = useId()
  const inputId = useId()
  const hintId = `${inputId}-hint`
  const errorId = `${inputId}-error`

  const parsed = parseValue(value, mode)
  const error = errorMessage(parsed, mode)
  const text = fieldText[mode]

  let outcome: Outcome = null
  if (parsed.ok && mode === 'money') {
    const agorot = totalAgorot(parsed)
    const words = amountToWords(agorot, style, only)
    outcome = { words, digits: formatAmount(agorot), line: amountLine(agorot, words), note: '' }
  } else if (parsed.ok) {
    const words = signedNumberToWords(parsed.whole, parsed.negative, gender)
    outcome = {
      words,
      digits: formatNumber(parsed.whole, parsed.negative),
      line: numberLine(parsed.whole, parsed.negative, words),
      note: countingNote(parsed.whole, parsed.negative, gender),
    }
  }

  const spoken = outcome?.words ?? ''
  const lastSpoken = useRef(spoken)

  useEffect(() => {
    if (spoken === lastSpoken.current) return
    const timer = window.setTimeout(() => {
      lastSpoken.current = spoken
      setAnnouncement(spoken)
    }, ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  const selectMode = (next: WordsMode) => {
    setMode(next)
    setStatus('')
  }

  const copy = async (target: 'words' | 'line') => {
    if (!outcome) {
      setStatus(mode === 'money' ? 'הקלידו סכום כדי להעתיק אותו במילים.' : 'הקלידו מספר כדי להעתיק אותו במילים.')
      return
    }
    try {
      await navigator.clipboard.writeText(target === 'words' ? outcome.words : outcome.line)
      setStatus(target === 'words' ? 'המילים הועתקו' : 'השורה עם הספרות והמילים הועתקה')
      window.gtag?.('event', 'amount_words_copy', {
        target,
        mode,
        style: mode === 'money' ? style : undefined,
        only: mode === 'money' ? only : undefined,
        gender: mode === 'number' ? gender : undefined,
      })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הטקסט והעתיקו ידנית.')
    }
  }

  return (
    <section className={ui.tool} aria-label="המרת סכום ומספר למילים">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <ChoiceGroup
            legend="מה ממירים למילים"
            name={`${name}-mode`}
            options={modeOptions}
            value={mode}
            onChange={selectMode}
            layout={styles.twoChoices}
          />

          <div className={ui.group}>
            <label htmlFor={inputId} className={ui.legend}>
              {text.label}
            </label>
            <p id={hintId} className={ui.hint}>
              {text.hint}
            </p>
            <input
              id={inputId}
              className={`${ui.input} ${ui.ltr} ${styles.amount}`}
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="done"
              maxLength={32}
              value={value}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${hintId} ${errorId}` : hintId}
              onChange={(event) => setValue(event.target.value)}
            />
            {error ? (
              <p id={errorId} className={styles.error}>
                {error}
              </p>
            ) : null}
          </div>

          {mode === 'money' ? (
            <ChoiceGroup
              legend="איך לכתוב את המטבע"
              name={`${name}-style`}
              options={styleOptions}
              value={style}
              onChange={setStyle}
              layout={styles.threeChoices}
            >
              <label className={`${ui.option} ${styles.only}`}>
                <input
                  type="checkbox"
                  className={ui.checkbox}
                  checked={only}
                  onChange={(event) => setOnly(event.target.checked)}
                />
                <span>להוסיף ״בלבד״ בסוף, כמו בצ&apos;ק</span>
              </label>
            </ChoiceGroup>
          ) : (
            <ChoiceGroup
              legend="זכר או נקבה"
              name={`${name}-gender`}
              options={genderOptions}
              value={gender}
              onChange={setGender}
              layout={styles.twoChoices}
            />
          )}
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>במילים</h2>
            {outcome ? (
              <div key="result" className={styles.card}>
                <p className={styles.words}>{outcome.words}</p>
                <p className={styles.digits}>
                  בספרות: <span dir={mode === 'number' ? 'ltr' : undefined}>{outcome.digits}</span>
                </p>
                {outcome.note ? <p className={styles.note}>{outcome.note}</p> : null}
              </div>
            ) : (
              <div key="empty" className={styles.card}>
                <p className={styles.empty}>{text.empty}</p>
              </div>
            )}
            <div className={ui.actions}>
              <button type="button" className={`${ui.primary} ${styles.copyMain}`} onClick={() => copy('words')}>
                <Copy aria-hidden="true" />
                העתקת המילים
              </button>
              <button type="button" className={ui.secondary} onClick={() => copy('line')}>
                <Hash aria-hidden="true" />
                העתקה עם הספרות
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>
            <p className={ui.note}>ההמרה נעשית בדפדפן שלכם, והסכומים לא נשלחים לשום מקום.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
