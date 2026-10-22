'use client'

import { useId, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  MAX_AMOUNT_SHEKELS,
  MAX_LINES,
  STANDARD_VAT_RATE,
  calculateVat,
  formatRate,
  formatShekels,
  formulaText,
  parseAmount,
  parseRate,
  rateBasisPoints,
  resultToText,
  type ParsedNumber,
  type VatMode,
  type VatRateChoice,
} from '@/lib/vat-calculator'
import ui from './toolUi.module.css'
import styles from './VatCalculator.module.css'

type Line = { id: number; value: string }
type CopyTarget = 'all' | 'net' | 'vat' | 'gross'

const modeOptions: { value: VatMode; label: string; hint: string }[] = [
  { value: 'add', label: 'הוספת מע״מ', hint: 'מסכום לפני מע״מ' },
  { value: 'extract', label: 'חילוץ מע״מ', hint: 'מסכום כולל מע״מ' },
]

const rateOptions: { value: VatRateChoice; label: string; hint: string }[] = [
  { value: 'standard', label: `${STANDARD_VAT_RATE}%`, hint: 'השיעור הנוכחי' },
  { value: 'eilat', label: '0%', hint: 'אילת' },
  { value: 'custom', label: 'שיעור אחר', hint: 'מקלידים בעצמכם' },
]

const amountError = (parsed: ParsedNumber) => {
  if (parsed.ok || parsed.reason === 'empty') return ''
  if (parsed.reason === 'too-large') {
    return `הסכום גדול מדי. אפשר להקליד עד ${MAX_AMOUNT_SHEKELS.toLocaleString('he-IL')} ₪.`
  }
  return 'אפשר להקליד רק ספרות, ונקודה או פסיק לאגורות.'
}

const rateError = (parsed: ParsedNumber) => {
  if (parsed.ok) return ''
  if (parsed.reason === 'empty') return 'הקלידו שיעור באחוזים.'
  return 'הקלידו שיעור בין 0 ל-100.'
}

const plainAmount = (agorot: number) => (agorot / 100).toFixed(2)

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
  options: { value: T; label: string; hint: string }[]
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

function AmountField({
  line,
  index,
  total,
  onChange,
  onRemove,
  inputRef,
}: {
  line: Line
  index: number
  total: number
  onChange: (value: string) => void
  onRemove: () => void
  inputRef: (node: HTMLInputElement | null) => void
}) {
  const id = useId()
  const errorId = `${id}-error`
  const error = amountError(parseAmount(line.value))
  const label = total > 1 ? `שורה ${index + 1}` : 'סכום בשקלים'

  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      <div className={styles.lineControl}>
        <input
          ref={inputRef}
          id={id}
          className={`${ui.input} ${ui.ltr} ${styles.amount}`}
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          value={line.value}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        {total > 1 ? (
          <button type="button" className={styles.remove} aria-label={`הסרת שורה ${index + 1}`} onClick={onRemove}>
            <span aria-hidden="true">×</span>
          </button>
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

export default function VatCalculator() {
  const [mode, setMode] = useState<VatMode>('add')
  const [rateChoice, setRateChoice] = useState<VatRateChoice>('standard')
  const [customRate, setCustomRate] = useState('17')
  const [lines, setLines] = useState<Line[]>([{ id: 1, value: '' }])
  const [status, setStatus] = useState('')
  const nextId = useRef(2)
  const pendingFocus = useRef<number | null>(null)
  const inputs = useRef(new Map<number, HTMLInputElement>())
  const customRateId = useId()
  const customRateHintId = `${customRateId}-hint`
  const customRateErrorId = `${customRateId}-error`

  const basisPoints = rateBasisPoints(rateChoice, customRate)
  const customRateError = rateChoice === 'custom' ? rateError(parseRate(customRate)) : ''

  const amounts = useMemo(
    () =>
      lines
        .map((line) => parseAmount(line.value))
        .filter((parsed): parsed is { ok: true; hundredths: number } => parsed.ok)
        .map((parsed) => parsed.hundredths),
    [lines],
  )

  const result = useMemo(
    () => (basisPoints === null ? null : calculateVat(amounts, mode, basisPoints)),
    [amounts, mode, basisPoints],
  )

  const hasAmount = amounts.length > 0
  const amountLegend = mode === 'add' ? 'סכום לפני מע״מ' : 'סכום כולל מע״מ'

  const registerInput = (id: number) => (node: HTMLInputElement | null) => {
    if (!node) {
      inputs.current.delete(id)
      return
    }
    inputs.current.set(id, node)
    if (pendingFocus.current === id) {
      node.focus()
      pendingFocus.current = null
    }
  }

  const updateLine = (id: number, value: string) =>
    setLines((current) => current.map((line) => (line.id === id ? { ...line, value } : line)))

  const addLine = () => {
    const id = nextId.current
    nextId.current += 1
    pendingFocus.current = id
    setLines((current) => [...current, { id, value: '' }])
  }

  const removeLine = (id: number) => {
    const index = lines.findIndex((line) => line.id === id)
    const neighbour = lines[index - 1] ?? lines[index + 1]
    if (neighbour) inputs.current.get(neighbour.id)?.focus()
    setLines((current) => current.filter((line) => line.id !== id))
  }

  const copy = async (target: CopyTarget) => {
    if (!result || !hasAmount) {
      setStatus('הקלידו סכום כדי להעתיק את התוצאה.')
      return
    }
    const value = target === 'all' ? resultToText(result, basisPoints ?? 0) : plainAmount(result.total[target])
    try {
      await navigator.clipboard.writeText(value)
      setStatus(target === 'all' ? 'התוצאה הועתקה' : `הסכום ${formatShekels(result.total[target])} הועתק`)
      window.gtag?.('event', 'vat_calc_copy', {
        target,
        mode,
        rate: (basisPoints ?? 0) / 100,
        lines: amounts.length,
      })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הסכום והעתיקו ידנית.')
    }
  }

  const rows: { key: Exclude<CopyTarget, 'all'>; term: string; copyLabel: string; entered: boolean }[] = [
    { key: 'net', term: 'לפני מע״מ', copyLabel: 'הסכום לפני מע״מ', entered: mode === 'add' },
    {
      key: 'vat',
      term: basisPoints === null ? 'מע״מ' : `מע״מ ${formatRate(basisPoints)}`,
      copyLabel: 'סכום המע״מ',
      entered: false,
    },
    { key: 'gross', term: 'כולל מע״מ', copyLabel: 'הסכום כולל מע״מ', entered: mode === 'extract' },
  ]

  return (
    <section className={ui.tool} aria-label="מחשבון מע״מ">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <ChoiceGroup
            legend="מה רוצים לחשב"
            name="vat-mode"
            options={modeOptions}
            value={mode}
            onChange={setMode}
            layout={styles.modeChoices}
          />

          <ChoiceGroup
            legend="שיעור המע״מ"
            name="vat-rate"
            options={rateOptions}
            value={rateChoice}
            onChange={setRateChoice}
            layout={styles.rateChoices}
          >
            {rateChoice === 'custom' ? (
              <div className={ui.field}>
                <label htmlFor={customRateId} className={ui.label}>
                  שיעור באחוזים
                </label>
                <p id={customRateHintId} className={ui.hint}>
                  למשל 17, השיעור שחל עד סוף 2024.
                </p>
                <input
                  id={customRateId}
                  className={`${ui.input} ${ui.ltr} ${styles.rate}`}
                  inputMode="decimal"
                  autoComplete="off"
                  value={customRate}
                  aria-invalid={customRateError ? true : undefined}
                  aria-describedby={customRateError ? `${customRateHintId} ${customRateErrorId}` : customRateHintId}
                  onChange={(event) => setCustomRate(event.target.value)}
                />
                {customRateError ? (
                  <p id={customRateErrorId} className={styles.error}>
                    {customRateError}
                  </p>
                ) : null}
              </div>
            ) : null}
            {rateChoice === 'eilat' ? (
              <p className={styles.eilat}>
                באילת פטורות ממע״מ מכירה של עוסק תושב אילת לצריכה או לשימוש באילת, ושירות שהוא נותן באילת. יש
                חריגים, למשל רכב פרטי, טבק ותכשיטים יקרים. <a href="#eilat">מה בדיוק פטור באילת</a>
              </p>
            ) : null}
          </ChoiceGroup>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>{amountLegend}</legend>
            {lines.map((line, index) => (
              <AmountField
                key={line.id}
                line={line}
                index={index}
                total={lines.length}
                inputRef={registerInput(line.id)}
                onChange={(value) => updateLine(line.id, value)}
                onRemove={() => removeLine(line.id)}
              />
            ))}
            {lines.length < MAX_LINES ? (
              <button type="button" className={`${ui.secondary} ${styles.addLine}`} onClick={addLine}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
                הוספת שורה
              </button>
            ) : null}
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התוצאה</h2>
            {result ? (
              <dl className={styles.results}>
                {rows.map((row) => (
                  <div key={row.key} className={row.entered ? styles.row : `${styles.row} ${styles.computed}`}>
                    <dt className={styles.term}>{row.term}</dt>
                    <dd className={styles.cell}>
                      <span className={styles.value}>{formatShekels(result.total[row.key])}</span>
                      <button type="button" className={styles.copyOne} onClick={() => copy(row.key)}>
                        העתקה<span className={styles.srOnly}> של {row.copyLabel}</span>
                      </button>
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className={styles.empty}>הקלידו שיעור מע״מ תקין כדי לראות את התוצאה.</p>
            )}

            {result && hasAmount && basisPoints !== null ? (
              <p className={styles.formula}>החישוב: {formulaText(result.total, mode, basisPoints)}</p>
            ) : null}

            {result && result.lines.length > 1 ? (
              <div className={styles.tableWrap} role="region" aria-label="פירוט לפי שורות" tabIndex={0}>
                <table className={styles.table}>
                  <caption className={styles.caption}>פירוט לפי שורות</caption>
                  <thead>
                    <tr>
                      <th scope="col">שורה</th>
                      <th scope="col">לפני מע״מ</th>
                      <th scope="col">מע״מ</th>
                      <th scope="col">כולל מע״מ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.lines.map((line, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{formatShekels(line.net)}</td>
                        <td>{formatShekels(line.vat)}</td>
                        <td>{formatShekels(line.gross)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            {result?.roundingGap ? (
              <p className={styles.formula}>
                סכום המע״מ בשורות שונה באגורה מהמע״מ בסך הכול, כי כל שורה מעוגלת לאגורות בנפרד. בסך הכול המע״מ
                מחושב על סכום כל השורות.
              </p>
            ) : null}

            <div className={ui.actions}>
              <button type="button" className={ui.primary} onClick={() => copy('all')}>
                העתקת התוצאה
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>
              החישוב נעשה בדפדפן שלכם, והסכומים לא נשלחים לשום מקום. התוצאות מעוגלות לאגורות.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
