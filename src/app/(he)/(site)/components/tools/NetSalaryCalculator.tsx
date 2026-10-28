'use client'

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import {
  BTL_EMPLOYEE_RATES,
  BTL_EMPLOYER_RATES,
  BTL_MAX_INCOME_MONTHLY,
  BTL_REDUCED_LIMIT_MONTHLY,
  CREDIT_POINT_ANNUAL,
  DEFAULT_CREDIT_POINTS,
  HISHTALMUT_EMPLOYEE_BASIS_POINTS,
  HISHTALMUT_EMPLOYER_BASIS_POINTS,
  HISHTALMUT_SALARY_CEILING_MONTHLY,
  PENSION_EMPLOYEE_BASIS_POINTS,
  PENSION_EMPLOYER_BASIS_POINTS,
  TAX_YEAR,
  WOMAN_EXTRA_POINTS,
  calculateSalary,
  formatBasisPoints,
  formatPoints,
  formatRatio,
  formatShekels,
  grossForNet,
  parseAmount,
  parsePoints,
  ratio,
  resultToText,
  type Gender,
  type SalaryResult,
  type Severance,
} from '@/lib/net-salary'
import type { ParsedNumber } from '@/lib/vat-calculator'
import ui from './toolUi.module.css'
import styles from './SelfEmployedTaxCalculator.module.css'

type Direction = 'gross' | 'net'
type View = 'employee' | 'employer'

const ANNOUNCE_DELAY_MS = 900

const directionOptions: { value: Direction; label: string; hint: string }[] = [
  { value: 'gross', label: 'מברוטו לנטו', hint: 'יודעים את הברוטו' },
  { value: 'net', label: 'מנטו לברוטו', hint: 'יודעים כמה רוצים לקבל' },
]

const genderOptions: { value: Gender; label: string; hint: string }[] = [
  { value: 'man', label: 'גבר', hint: `${formatPoints(DEFAULT_CREDIT_POINTS.man)} נקודות` },
  { value: 'woman', label: 'אישה', hint: `${formatPoints(DEFAULT_CREDIT_POINTS.woman)} נקודות` },
]

const severanceOptions: { value: Severance; label: string; hint: string }[] = [
  { value: 'partial', label: '6%', hint: 'המינימום לפי צו הפנסיה' },
  { value: 'full', label: '8.33%', hint: 'פיצויים מלאים' },
]

const views: { value: View; label: string }[] = [
  { value: 'employee', label: 'ניכויים מהעובד' },
  { value: 'employer', label: 'עלות מעביד' },
]

const amountError = (parsed: ParsedNumber) => {
  if (parsed.ok || parsed.reason === 'empty') return ''
  if (parsed.reason === 'too-large') return 'הסכום גדול מדי.'
  return 'אפשר להקליד רק ספרות, ונקודה או פסיק לאגורות.'
}

const pointsError = (parsed: ParsedNumber) => {
  if (parsed.ok) return ''
  if (parsed.reason === 'empty') return 'הקלידו מספר נקודות, למשל 2.25.'
  return 'הקלידו מספר בין 0 ל-40.'
}

const pointsText = (hundredths: number) => formatPoints(hundredths).replace(/,/g, '')

function ChoiceGroup<T extends string>({
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

function NumberField({
  label,
  hint,
  value,
  error,
  suffix,
  onChange,
}: {
  label: string
  hint?: string
  value: string
  error: string
  suffix?: string
  onChange: (value: string) => void
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
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="done"
          maxLength={24}
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

function TableRegion({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.tableWrap} role="region" aria-label={label} tabIndex={0}>
      {children}
    </div>
  )
}

function Rate({ basisPoints }: { basisPoints: number }) {
  return <span className={styles.rate}>{formatBasisPoints(basisPoints)}</span>
}

function EmployeeTable({ result }: { result: SalaryResult }) {
  const { incomeTax, btl } = result
  const employeeReduced = BTL_EMPLOYEE_RATES.national.reduced + BTL_EMPLOYEE_RATES.health.reduced
  const employeeFull = BTL_EMPLOYEE_RATES.national.full + BTL_EMPLOYEE_RATES.health.full

  return (
    <div className={styles.block}>
      <h3 className={styles.blockTitle}>מה יורד מהברוטו</h3>
      <TableRegion label="ניכויים מהשכר">
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">רכיב</th>
              <th scope="col">לחודש</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">מס לפי המדרגות</th>
              <td>{formatShekels(incomeTax.gross)}</td>
            </tr>
            <tr>
              <th scope="row">פחות {formatPoints(incomeTax.creditPointsHundredths)} נקודות זיכוי</th>
              <td>−{formatShekels(incomeTax.creditUsed)}</td>
            </tr>
            <tr className={result.pensionCredit > 0 ? undefined : styles.unused}>
              <th scope="row">פחות זיכוי 35% על ההפקדה לפנסיה</th>
              <td>−{formatShekels(result.pensionCredit)}</td>
            </tr>
            <tr className={styles.totalRow}>
              <th scope="row">מס הכנסה</th>
              <td>{formatShekels(result.tax)}</td>
            </tr>
            <tr>
              <th scope="row">
                ביטוח לאומי
              </th>
              <td>{formatShekels(btl.national)}</td>
            </tr>
            <tr>
              <th scope="row">
                דמי ביטוח בריאות
              </th>
              <td>{formatShekels(btl.health)}</td>
            </tr>
            <tr>
              <th scope="row">
                פנסיה, חלק העובד
                <Rate basisPoints={PENSION_EMPLOYEE_BASIS_POINTS} />
              </th>
              <td>{formatShekels(result.pension)}</td>
            </tr>
            {result.hishtalmut > 0 ? (
              <tr>
                <th scope="row">
                  קרן השתלמות, חלק העובד
                  <Rate basisPoints={HISHTALMUT_EMPLOYEE_BASIS_POINTS} />
                </th>
                <td>{formatShekels(result.hishtalmut)}</td>
              </tr>
            ) : null}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">סך הניכויים</th>
              <td>{formatShekels(result.deductions)}</td>
            </tr>
            <tr className={styles.totalRow}>
              <th scope="row">נטו</th>
              <td>{formatShekels(result.net)}</td>
            </tr>
          </tfoot>
        </table>
      </TableRegion>
      <p className={styles.blockNote}>
        ביטוח לאומי ובריאות: {formatBasisPoints(employeeReduced)} על השכר עד{' '}
        {formatShekels(BTL_REDUCED_LIMIT_MONTHLY)}, ו-{formatBasisPoints(employeeFull)} על החלק שמעל, עד{' '}
        {formatShekels(BTL_MAX_INCOME_MONTHLY)}.
      </p>
      {result.hishtalmutBenefit > 0 ? (
        <p className={styles.blockNote}>
          הפקדת המעסיק לקרן ההשתלמות על השכר שמעל {formatShekels(HISHTALMUT_SALARY_CEILING_MONTHLY)} חייבת במס
          כהטבה, ולכן נוספו {formatShekels(result.hishtalmutBenefit)} להכנסה החייבת.
        </p>
      ) : null}
      {incomeTax.creditValue > incomeTax.gross ? (
        <p className={styles.blockNote}>
          נקודות הזיכוי שוות יותר מהמס, ולכן מס ההכנסה הוא 0. היתרה לא מוחזרת.
        </p>
      ) : null}
    </div>
  )
}

function EmployerTable({ result }: { result: SalaryResult }) {
  const { employer } = result
  return (
    <div className={styles.block}>
      <h3 className={styles.blockTitle}>כמה העובד עולה למעסיק</h3>
      <TableRegion label="עלות מעביד">
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">רכיב</th>
              <th scope="col">לחודש</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">שכר ברוטו</th>
              <td>{formatShekels(result.gross)}</td>
            </tr>
            <tr>
              <th scope="row">
                ביטוח לאומי, חלק המעסיק
              </th>
              <td>{formatShekels(employer.btl)}</td>
            </tr>
            <tr>
              <th scope="row">
                פנסיה, תגמולי מעסיק
                <Rate basisPoints={PENSION_EMPLOYER_BASIS_POINTS} />
              </th>
              <td>{formatShekels(employer.pension)}</td>
            </tr>
            <tr>
              <th scope="row">
                פיצויים
                <Rate basisPoints={employer.severanceBasisPoints} />
              </th>
              <td>{formatShekels(employer.severance)}</td>
            </tr>
            {employer.hishtalmut > 0 ? (
              <tr>
                <th scope="row">
                  קרן השתלמות, חלק המעסיק
                  <Rate basisPoints={HISHTALMUT_EMPLOYER_BASIS_POINTS} />
                </th>
                <td>{formatShekels(employer.hishtalmut)}</td>
              </tr>
            ) : null}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">תוספת על הברוטו</th>
              <td>
                {formatShekels(employer.total)}
                <span className={styles.share}>{formatRatio(ratio(employer.total, result.gross))}</span>
              </td>
            </tr>
            <tr className={styles.totalRow}>
              <th scope="row">עלות מעביד</th>
              <td>{formatShekels(employer.cost)}</td>
            </tr>
          </tfoot>
        </table>
      </TableRegion>
      <p className={styles.blockNote}>
        ביטוח לאומי של המעסיק: {formatBasisPoints(BTL_EMPLOYER_RATES.reduced)} על השכר עד{' '}
        {formatShekels(BTL_REDUCED_LIMIT_MONTHLY)} ו-{formatBasisPoints(BTL_EMPLOYER_RATES.full)} על החלק שמעל.
        המעסיק לא משלם דמי ביטוח בריאות. לא כללנו ביטוח אובדן כושר עבודה, דמי הבראה, נסיעות וחופשה.
      </p>
    </div>
  )
}

export default function NetSalaryCalculator() {
  const [direction, setDirection] = useState<Direction>('gross')
  const [amount, setAmount] = useState('')
  const [gender, setGender] = useState<Gender>('man')
  const [points, setPoints] = useState(pointsText(DEFAULT_CREDIT_POINTS.man))
  const [hishtalmut, setHishtalmut] = useState(false)
  const [severance, setSeverance] = useState<Severance>('partial')
  const [view, setView] = useState<View>('employee')
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const lastSpoken = useRef('')
  const tabsId = useId()

  const parsedAmount = parseAmount(amount)
  const parsedPoints = parsePoints(points)
  const amountFieldError = amountError(parsedAmount)
  const pointsFieldError = pointsError(parsedPoints)

  const shekels = parsedAmount.ok ? Math.round(parsedAmount.hundredths / 100) : null
  const pointsHundredths = parsedPoints.ok ? parsedPoints.hundredths : null

  const computed = useMemo(() => {
    if (shekels === null || pointsHundredths === null) return null
    const options = { creditPointsHundredths: pointsHundredths, hishtalmut, severance }
    const gross = direction === 'gross' ? shekels : grossForNet(shekels, options)
    if (gross === null) return { tooLarge: true as const }
    return { tooLarge: false as const, result: calculateSalary({ ...options, gross }) }
  }, [shekels, pointsHundredths, hishtalmut, severance, direction])

  const result = computed && !computed.tooLarge ? computed.result : null

  const spoken = result
    ? `ברוטו ${formatShekels(result.gross)}. נטו ${formatShekels(result.net)}. עלות מעביד ${formatShekels(
        result.employer.cost,
      )}.`
    : ''

  useEffect(() => {
    if (spoken === lastSpoken.current) return
    const timer = window.setTimeout(() => {
      lastSpoken.current = spoken
      setAnnouncement(spoken)
    }, ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  const changeGender = (next: Gender) => {
    if (next === gender) return
    setGender(next)
    const parsed = parsePoints(points)
    if (!parsed.ok) {
      setPoints(pointsText(DEFAULT_CREDIT_POINTS[next]))
      return
    }
    const shift = next === 'woman' ? WOMAN_EXTRA_POINTS : -WOMAN_EXTRA_POINTS
    setPoints(pointsText(Math.max(0, parsed.hundredths + shift)))
  }

  const copy = async () => {
    if (!result) {
      setStatus('הקלידו שכר כדי להעתיק את התוצאה.')
      return
    }
    try {
      await navigator.clipboard.writeText(resultToText(result))
      setStatus('התוצאה הועתקה')
      window.gtag?.('event', 'net_salary_copy', { direction, gender })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את התוצאה והעתיקו ידנית.')
    }
  }

  const moveTab = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const next = view === 'employee' ? 'employer' : 'employee'
    setView(next)
    document.getElementById(`${tabsId}-${next}-tab`)?.focus()
  }

  const summary = result
    ? [
        { key: 'net', term: 'נטו לחודש', value: result.net, main: true },
        { key: 'gross', term: 'ברוטו לחודש', value: result.gross, main: false },
        { key: 'deductions', term: 'סך הניכויים', value: result.deductions, main: false },
        { key: 'cost', term: 'עלות מעביד לחודש', value: result.employer.cost, main: false },
      ]
    : []

  return (
    <section className={ui.tool} aria-label="מחשבון שכר נטו ועלות מעביד">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <ChoiceGroup
            legend="מה לחשב"
            name="salary-direction"
            options={directionOptions}
            value={direction}
            onChange={(next) => {
              setDirection(next)
              setStatus('')
            }}
          />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>שכר חודשי</legend>
            <NumberField
              label={direction === 'gross' ? 'שכר ברוטו לחודש' : 'נטו רצוי לחודש'}
              hint={
                direction === 'gross'
                  ? 'השכר בתלוש לפני ניכויים, כולל תוספות קבועות.'
                  : 'המחשבון ימצא את הברוטו שנותן את הנטו הזה.'
              }
              value={amount}
              error={amountFieldError}
              suffix="₪"
              onChange={setAmount}
            />
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>נקודות זיכוי</legend>
            <ChoiceGroup
              legend="תושב או תושבת ישראל"
              name="salary-gender"
              options={genderOptions}
              value={gender}
              onChange={changeGender}
            />
            <NumberField
              label="סך נקודות הזיכוי"
              hint={`נקודה שווה ${formatShekels(CREDIT_POINT_ANNUAL / 12)} לחודש. ילדים, תואר ושחרור מצה״ל מוסיפים נקודות.`}
              value={points}
              error={pointsFieldError}
              onChange={setPoints}
            />
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>הפרשות</legend>
            <label className={styles.choice}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={hishtalmut}
                onChange={(event) => setHishtalmut(event.target.checked)}
              />
              <span className={styles.choiceText}>
                <span className={styles.choiceLabel}>יש קרן השתלמות</span>
                <span className={styles.choiceHint}>2.5% מהעובד ו-7.5% מהמעסיק</span>
              </span>
            </label>
            <ChoiceGroup
              legend="הפרשת המעסיק לפיצויים"
              name="salary-severance"
              options={severanceOptions}
              value={severance}
              onChange={setSeverance}
            />
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התוצאה</h2>
            {result ? (
              <dl className={styles.results}>
                {summary.map((row) => (
                  <div key={row.key} className={row.main ? `${styles.row} ${styles.main}` : styles.row}>
                    <dt className={styles.term}>{row.term}</dt>
                    <dd className={styles.value}>
                      {formatShekels(row.value)}
                      {row.key === 'deductions' ? (
                        <span className={styles.share}>{formatRatio(ratio(result.deductions, result.gross))}</span>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : computed?.tooLarge ? (
              <p className={styles.notice}>הנטו גבוה מדי לחישוב. נסו סכום קטן יותר.</p>
            ) : (
              <p className={styles.empty}>הקלידו שכר כדי לראות את הנטו, הניכויים ועלות המעביד.</p>
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
              הערכה לפי השיעורים של {TAX_YEAR}, לעובד תושב ישראל מגיל 18 ועד גיל פרישה עם מקום עבודה אחד. התלוש
              בפועל יכול להיות שונה. החישוב נעשה בדפדפן, והסכומים לא נשלחים לשום מקום.
            </p>
          </div>
        </div>
      </div>

      {result && result.gross > 0 ? (
        <div className={styles.details}>
          <h2 className={styles.detailsTitle}>פירוט החישוב</h2>
          <div className={styles.choices} role="tablist" aria-label="פירוט">
            {views.map((item) => (
              <button
                key={item.value}
                type="button"
                role="tab"
                id={`${tabsId}-${item.value}-tab`}
                aria-selected={view === item.value}
                aria-controls={`${tabsId}-panel`}
                tabIndex={view === item.value ? 0 : -1}
                className={view === item.value ? ui.primary : ui.secondary}
                onClick={() => setView(item.value)}
                onKeyDown={moveTab}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div id={`${tabsId}-panel`} role="tabpanel" aria-labelledby={`${tabsId}-${view}-tab`}>
            {view === 'employee' ? <EmployeeTable result={result} /> : <EmployerTable result={result} />}
          </div>
        </div>
      ) : null}
    </section>
  )
}
