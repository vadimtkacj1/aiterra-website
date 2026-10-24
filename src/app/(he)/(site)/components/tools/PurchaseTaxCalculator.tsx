'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  BRACKETS_VALID_UNTIL,
  OLEH_VALUE_CEILING,
  bracketLabel,
  calculatePurchaseTax,
  formatBasisPoints,
  formatNumber,
  formatRatio,
  formatShekels,
  parseValue,
  resultToText,
  type BuyerKind,
} from '@/lib/purchase-tax'
import type { ParsedNumber } from '@/lib/vat-calculator'
import ui from './toolUi.module.css'
import styles from './PurchaseTaxCalculator.module.css'

const ANNOUNCE_DELAY_MS = 900

const kindOptions: { value: BuyerKind; label: string; hint: string }[] = [
  { value: 'single', label: 'דירה יחידה', hint: 'זו הדירה היחידה שלכם' },
  { value: 'additional', label: 'דירה נוספת', hint: 'יש לכם דירה אחרת' },
  { value: 'oleh', label: 'עולה חדש', hint: 'דירה יחידה, עד 7 שנים מהעלייה' },
]

const valueError = (parsed: ParsedNumber) => {
  if (parsed.ok || parsed.reason === 'empty') return ''
  if (parsed.reason === 'too-large') return 'הסכום גדול מדי.'
  return 'אפשר להקליד רק ספרות, ונקודה או פסיק לאגורות.'
}

export default function PurchaseTaxCalculator() {
  const [value, setValue] = useState('')
  const [kind, setKind] = useState<BuyerKind>('single')
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const lastSpoken = useRef('')
  const valueId = useId()
  const hintId = `${valueId}-hint`
  const errorId = `${valueId}-error`

  const parsed = parseValue(value)
  const error = valueError(parsed)
  const agorot = parsed.ok ? parsed.hundredths : null

  const result = useMemo(() => (agorot === null || agorot === 0 ? null : calculatePurchaseTax(agorot, kind)), [agorot, kind])

  const spoken = result
    ? `מס רכישה ${formatShekels(result.tax)}, ${formatRatio(result.effectiveRate)} משווי הדירה.`
    : ''

  useEffect(() => {
    if (spoken === lastSpoken.current) return
    const timer = window.setTimeout(() => {
      lastSpoken.current = spoken
      setAnnouncement(spoken)
    }, ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  const copy = async () => {
    if (!result) {
      setStatus('הקלידו שווי דירה כדי להעתיק את התוצאה.')
      return
    }
    try {
      await navigator.clipboard.writeText(resultToText(result))
      setStatus('התוצאה הועתקה')
      window.gtag?.('event', 'purchase_tax_copy', { kind })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את התוצאה והעתיקו ידנית.')
    }
  }

  return (
    <section className={ui.tool} aria-label="מחשבון מס רכישה לדירה">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>סוג הרכישה</legend>
            <div className={styles.choices}>
              {kindOptions.map((option) => (
                <label key={option.value} className={styles.choice}>
                  <input
                    type="radio"
                    name="purchase-kind"
                    value={option.value}
                    className={ui.checkbox}
                    checked={kind === option.value}
                    onChange={() => {
                      setKind(option.value)
                      setStatus('')
                    }}
                  />
                  <span className={styles.choiceText}>
                    <span className={styles.choiceLabel}>{option.label}</span>
                    <span className={styles.choiceHint}>{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>שווי הדירה</legend>
            <div className={ui.field}>
              <label htmlFor={valueId} className={ui.label}>
                מחיר הרכישה
              </label>
              <p id={hintId} className={ui.hint}>
                הקלידו את המחיר שנקבע בחוזה. בדרך כלל זה הסכום שעליו מחושב המס.
              </p>
              <div className={styles.affix}>
                <input
                  id={valueId}
                  className={`${ui.input} ${ui.ltr} ${styles.number} ${styles.withSuffix}`}
                  inputMode="decimal"
                  autoComplete="off"
                  spellCheck={false}
                  enterKeyHint="done"
                  maxLength={24}
                  value={value}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${hintId} ${errorId}` : hintId}
                  onChange={(event) => {
                    setValue(event.target.value)
                    setStatus('')
                  }}
                />
                <span className={styles.suffix} aria-hidden="true">
                  ₪
                </span>
              </div>
              {error ? (
                <p id={errorId} className={styles.error}>
                  {error}
                </p>
              ) : null}
            </div>
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התוצאה</h2>
            {result ? (
              <>
                <dl className={styles.results}>
                  <div className={`${styles.row} ${styles.main}`}>
                    <dt className={styles.term}>מס רכישה לתשלום</dt>
                    <dd className={styles.value}>{formatShekels(result.tax)}</dd>
                  </div>
                  <div className={styles.row}>
                    <dt className={styles.term}>שיעור אפקטיבי</dt>
                    <dd className={styles.value}>{formatRatio(result.effectiveRate)}</dd>
                  </div>
                  {result.kind === 'oleh' && !result.olehBenefitDenied ? (
                    <div className={styles.row}>
                      <dt className={styles.term}>חיסכון לעומת דירה יחידה רגילה</dt>
                      <dd className={styles.value}>{formatShekels(result.savingVersusSingle)}</dd>
                    </div>
                  ) : null}
                </dl>

                {result.tax === 0 ? (
                  <p className={styles.notice}>
                    השווי בתוך המדרגה הפטורה, ולכן אין מס רכישה לתשלום. עדיין צריך להגיש הצהרה לרשות המסים תוך 30
                    יום מהמכירה, בדרך כלל דרך עורך הדין.
                  </p>
                ) : null}
                {result.olehBenefitDenied ? (
                  <p className={styles.notice}>
                    שווי הדירה מעל {formatNumber(OLEH_VALUE_CEILING)} ₪, ולכן הטבת העולה לא חלה. החישוב הוא לפי
                    המדרגות של דירה יחידה.
                  </p>
                ) : null}
              </>
            ) : (
              <p className={styles.empty}>הקלידו את שווי הדירה כדי לראות כמה מס רכישה תשלמו ואיך הוא מתחלק למדרגות.</p>
            )}

            <div className={ui.actions}>
              <button type="button" className={ui.primary} onClick={copy}>
                העתקת התוצאה
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>
            <p className={ui.note}>
              הערכה לפי מדרגות מס הרכישה שבתוקף עד {BRACKETS_VALID_UNTIL}. לא ייעוץ משפטי או מס. את המס הסופי קובע
              שמאי המקרקעין ברשות המסים, והחישוב נעשה בדפדפן בלי לשלוח את הסכומים לשום מקום.
            </p>
          </div>
        </div>
      </div>

      {result ? (
        <div className={styles.details}>
          <h2 className={styles.detailsTitle}>פירוט החישוב לפי מדרגות</h2>
          <div className={styles.tableWrap} role="region" aria-label="מס רכישה לפי מדרגות" tabIndex={0}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">מדרגה (₪)</th>
                  <th scope="col">שיעור</th>
                  <th scope="col">חלק משווי הדירה</th>
                  <th scope="col">מס</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row) => (
                  <tr key={row.from} className={row.amount > 0 ? undefined : styles.unused}>
                    <th scope="row">{bracketLabel(row)}</th>
                    <td>{formatBasisPoints(row.rateBasisPoints)}</td>
                    <td>{formatNumber(row.amount)}</td>
                    <td>{formatNumber(row.tax)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className={styles.totalRow}>
                  <th scope="row" colSpan={2}>
                    סך הכול
                  </th>
                  <td>{formatNumber(result.value)}</td>
                  <td>{formatShekels(result.tax)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  )
}
