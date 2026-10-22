'use client'

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  BTL_MAX_INCOME_MONTHLY,
  BTL_MIN_INCOME_MONTHLY,
  BTL_RATES,
  CREDIT_POINT_ANNUAL,
  DEFAULT_CREDIT_POINTS,
  MAX_CREDIT_POINTS,
  TAX_YEAR,
  WOMAN_EXTRA_POINTS,
  bracketLabel,
  calculateTax,
  formatBasisPoints,
  formatNumber,
  formatPoints,
  formatRatio,
  formatShekels,
  monthsFor,
  parseAmount,
  parsePoints,
  resultToText,
  toAnnual,
  toMonthly,
  type Gender,
  type Period,
  type TaxResult,
} from '@/lib/self-employed-tax'
import type { ParsedNumber } from '@/lib/vat-calculator'
import ui from './toolUi.module.css'
import styles from './SelfEmployedTaxCalculator.module.css'

const ANNOUNCE_DELAY_MS = 900

const periodOptions: { value: Period; label: string; hint: string }[] = [
  { value: 'year', label: 'לשנה', hint: `סכומים לכל שנת ${TAX_YEAR}` },
  { value: 'month', label: 'לחודש', hint: 'ממוצע חודשי' },
]

const genderOptions: { value: Gender; label: string; hint: string }[] = [
  { value: 'man', label: 'גבר', hint: `${formatPoints(DEFAULT_CREDIT_POINTS.man)} נקודות` },
  { value: 'woman', label: 'אישה', hint: `${formatPoints(DEFAULT_CREDIT_POINTS.woman)} נקודות` },
]

const unitFor = (period: Period) => (period === 'year' ? 'לשנה' : 'לחודש')

const amountError = (parsed: ParsedNumber) => {
  if (parsed.ok || parsed.reason === 'empty') return ''
  if (parsed.reason === 'too-large') return 'הסכום גדול מדי.'
  return 'אפשר להקליד רק ספרות, ונקודה או פסיק לאגורות.'
}

const pointsError = (parsed: ParsedNumber) => {
  if (parsed.ok) return ''
  if (parsed.reason === 'empty') return 'הקלידו מספר נקודות, למשל 2.25.'
  return `הקלידו מספר בין 0 ל-${MAX_CREDIT_POINTS}.`
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

function IncomeTaxTable({ result, period }: { result: TaxResult; period: Period }) {
  const { incomeTax, btl, profit } = result
  const unit = unitFor(period)
  const marginal = formatBasisPoints(result.marginalRateBasisPoints)

  return (
    <div className={styles.block}>
      <h3 className={styles.blockTitle}>מס הכנסה לפי מדרגות {TAX_YEAR}</h3>
      <p className={styles.blockText}>
        הכנסה חייבת: {formatShekels(incomeTax.taxable)} {unit}. זה הרווח, {formatShekels(profit)}, פחות{' '}
        {formatShekels(btl.deductible)}, שהם 52% מדמי הביטוח הלאומי שמותר לנכות.
      </p>
      <TableRegion label="מס הכנסה לפי מדרגות">
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">מדרגה (₪ {unit})</th>
              <th scope="col">שיעור</th>
              <th scope="col">הכנסה במדרגה</th>
              <th scope="col">מס</th>
            </tr>
          </thead>
          <tbody>
            {incomeTax.rows.map((row) => (
              <tr key={row.rateBasisPoints} className={row.income > 0 ? undefined : styles.unused}>
                <th scope="row">{bracketLabel(row)}</th>
                <td>{formatBasisPoints(row.rateBasisPoints)}</td>
                <td>{formatNumber(row.income)}</td>
                <td>{formatNumber(row.tax)}</td>
              </tr>
            ))}
            {incomeTax.surtaxIncome > 0 ? (
              <tr>
                <th scope="row">מס יסף, מעל {formatNumber(incomeTax.surtaxThreshold)}</th>
                <td>3%</td>
                <td>{formatNumber(incomeTax.surtaxIncome)}</td>
                <td>{formatNumber(incomeTax.surtax)}</td>
              </tr>
            ) : null}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colSpan={3}>
                מס לפי המדרגות
              </th>
              <td>{formatNumber(incomeTax.gross)}</td>
            </tr>
            <tr>
              <th scope="row" colSpan={3}>
                פחות {formatPoints(incomeTax.creditPointsHundredths)} נקודות זיכוי
              </th>
              <td>{formatNumber(incomeTax.creditUsed)}</td>
            </tr>
            <tr className={styles.totalRow}>
              <th scope="row" colSpan={3}>
                מס הכנסה {unit}
              </th>
              <td>{formatShekels(incomeTax.net)}</td>
            </tr>
          </tfoot>
        </table>
      </TableRegion>
      {incomeTax.taxable > 0 ? (
        <p className={styles.blockNote}>
          המדרגה השולית: {marginal}. כל שקל נוסף של הכנסה חייבת יוסיף {marginal} מס הכנסה, לפני ביטוח לאומי.
        </p>
      ) : null}
      {incomeTax.creditValue > incomeTax.gross ? (
        <p className={styles.blockNote}>
          נקודות הזיכוי שוות {formatShekels(incomeTax.creditValue)}, יותר מהמס, ולכן מס ההכנסה הוא 0. היתרה לא
          מוחזרת ולא עוברת לשנה הבאה.
        </p>
      ) : null}
    </div>
  )
}

function BtlTable({ result, period }: { result: TaxResult; period: Period }) {
  const { btl, months } = result
  const unit = unitFor(period)

  return (
    <div className={styles.block}>
      <h3 className={styles.blockTitle}>ביטוח לאומי ודמי ביטוח בריאות</h3>
      <p className={styles.blockText}>
        בסיס החישוב: {formatShekels(btl.base)} {unit}. הביטוח הלאומי מוריד מהרווח 52% מדמי הביטוח הלאומי עצמם,
        ומחשב לפי שתי מדרגות.
      </p>
      <TableRegion label="ביטוח לאומי ודמי ביטוח בריאות">
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">חלק ההכנסה (₪ {unit})</th>
              <th scope="col">הכנסה</th>
              <th scope="col">ביטוח לאומי</th>
              <th scope="col">בריאות</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">מופחת, עד {formatNumber(btl.reducedLimit)}</th>
              <td>{formatNumber(btl.reducedPart)}</td>
              <td>
                {formatNumber(btl.nationalReduced)}
                <span className={styles.rate}>{formatBasisPoints(BTL_RATES.national.reduced)}</span>
              </td>
              <td>
                {formatNumber(btl.healthReduced)}
                <span className={styles.rate}>{formatBasisPoints(BTL_RATES.health.reduced)}</span>
              </td>
            </tr>
            <tr className={btl.fullPart > 0 ? undefined : styles.unused}>
              <th scope="row">מלא, עד {formatNumber(BTL_MAX_INCOME_MONTHLY * months)}</th>
              <td>{formatNumber(btl.fullPart)}</td>
              <td>
                {formatNumber(btl.nationalFull)}
                <span className={styles.rate}>{formatBasisPoints(BTL_RATES.national.full)}</span>
              </td>
              <td>
                {formatNumber(btl.healthFull)}
                <span className={styles.rate}>{formatBasisPoints(BTL_RATES.health.full)}</span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className={styles.totalRow}>
              <th scope="row">סך הכול</th>
              <td>{formatNumber(btl.base)}</td>
              <td>{formatShekels(btl.national)}</td>
              <td>{formatShekels(btl.health)}</td>
            </tr>
          </tfoot>
        </table>
      </TableRegion>
      {btl.minimumApplied ? (
        <p className={styles.blockNote}>
          הרווח נמוך מההכנסה המזערית לעובד עצמאי, {formatShekels(BTL_MIN_INCOME_MONTHLY)} לחודש, ולכן דמי הביטוח
          חושבו לפי ההכנסה המזערית.
        </p>
      ) : null}
      {btl.ceilingApplied ? (
        <p className={styles.blockNote}>
          על רווח מעל {formatShekels(BTL_MAX_INCOME_MONTHLY)} לחודש לא משלמים דמי ביטוח לאומי ובריאות.
        </p>
      ) : null}
    </div>
  )
}

export default function SelfEmployedTaxCalculator() {
  const [period, setPeriod] = useState<Period>('year')
  const [revenue, setRevenue] = useState('')
  const [expenses, setExpenses] = useState('')
  const [gender, setGender] = useState<Gender>('man')
  const [points, setPoints] = useState(pointsText(DEFAULT_CREDIT_POINTS.man))
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const lastSpoken = useRef('')

  const parsedRevenue = parseAmount(revenue)
  const parsedExpenses = parseAmount(expenses)
  const parsedPoints = parsePoints(points)
  const revenueError = amountError(parsedRevenue)
  const expensesError = amountError(parsedExpenses)
  const pointsFieldError = pointsError(parsedPoints)
  const unit = unitFor(period)
  const months = monthsFor(period)

  const revenueAgorot = parsedRevenue.ok ? parsedRevenue.hundredths : null
  const expensesAgorot = parsedExpenses.ok ? parsedExpenses.hundredths : expenses.trim() ? null : 0
  const pointsHundredths = parsedPoints.ok ? parsedPoints.hundredths : null

  const result = useMemo(() => {
    if (revenueAgorot === null || expensesAgorot === null || pointsHundredths === null) return null
    return calculateTax({ revenueAgorot, expensesAgorot, creditPointsHundredths: pointsHundredths, months })
  }, [revenueAgorot, expensesAgorot, pointsHundredths, months])

  const spoken = result
    ? `נטו לחודש ${formatShekels(toMonthly(result.net, months))}. מס הכנסה ${unit} ${formatShekels(
        result.incomeTax.net,
      )}. ביטוח לאומי ובריאות ${unit} ${formatShekels(result.btl.total)}.`
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

  const changePeriod = (next: Period) => {
    setPeriod(next)
    setStatus('')
  }

  const copy = async () => {
    if (!result) {
      setStatus('הקלידו הכנסות כדי להעתיק את התוצאה.')
      return
    }
    try {
      await navigator.clipboard.writeText(resultToText(result, period))
      setStatus('התוצאה הועתקה')
      window.gtag?.('event', 'self_employed_tax_copy', { period, gender })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את התוצאה והעתיקו ידנית.')
    }
  }

  const summary = result
    ? [
        { key: 'netMonth', term: 'נטו לחודש', value: toMonthly(result.net, months), main: true },
        { key: 'netYear', term: 'נטו לשנה', value: toAnnual(result.net, months), main: false },
        { key: 'tax', term: `מס הכנסה ${unit}`, value: result.incomeTax.net, main: false },
        { key: 'btl', term: `ביטוח לאומי ובריאות ${unit}`, value: result.btl.total, main: false },
      ]
    : []

  return (
    <section className={ui.tool} aria-label="מחשבון מס הכנסה וביטוח לאומי לעצמאי">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <ChoiceGroup
            legend="הסכומים שאקליד הם"
            name="tax-period"
            options={periodOptions}
            value={period}
            onChange={changePeriod}
          />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>הכנסות והוצאות {unit}</legend>
            <NumberField
              label="הכנסות מהעסק"
              hint="עוסק מורשה: בלי מע״מ. עוסק פטור: כל מה שקיבלתם."
              value={revenue}
              error={revenueError}
              suffix="₪"
              onChange={setRevenue}
            />
            <NumberField
              label="הוצאות מוכרות"
              hint="ההוצאות שמותר לנכות מההכנסה. אם אין, השאירו ריק."
              value={expenses}
              error={expensesError}
              suffix="₪"
              onChange={setExpenses}
            />
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>נקודות זיכוי</legend>
            <ChoiceGroup
              legend="תושב או תושבת ישראל"
              name="tax-gender"
              options={genderOptions}
              value={gender}
              onChange={changeGender}
            />
            <NumberField
              label="סך נקודות הזיכוי"
              hint={`נקודה שווה ${formatShekels(CREDIT_POINT_ANNUAL)} לשנה. ילדים, תואר, שחרור מצה״ל ומילואים מוסיפים נקודות, ואפשר לשנות את המספר.`}
              value={points}
              error={pointsFieldError}
              onChange={setPoints}
            />
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התוצאה</h2>
            {result ? (
              <>
                <dl className={styles.results}>
                  {summary.map((row) => (
                    <div key={row.key} className={row.main ? `${styles.row} ${styles.main}` : styles.row}>
                      <dt className={styles.term}>{row.term}</dt>
                      <dd className={styles.value}>{formatShekels(row.value)}</dd>
                    </div>
                  ))}
                  <div className={styles.row}>
                    <dt className={styles.term}>סך הכול מס וביטוח לאומי {unit}</dt>
                    <dd className={styles.value}>
                      {formatShekels(result.total)}
                      <span className={styles.share}>{formatRatio(result.effectiveRate)} מהרווח</span>
                    </dd>
                  </div>
                </dl>

                <div className={styles.advance}>
                  <h3 className={styles.advanceTitle}>מקדמות משוערות לחודש</h3>
                  <dl className={styles.advanceList}>
                    <div className={styles.advanceRow}>
                      <dt>מס הכנסה</dt>
                      <dd>
                        {formatShekels(toMonthly(result.incomeTax.net, months))}
                        {result.revenue > 0 ? (
                          <span className={styles.share}>כ-{formatRatio(result.advanceRate)} מהמחזור</span>
                        ) : null}
                      </dd>
                    </div>
                    <div className={styles.advanceRow}>
                      <dt>ביטוח לאומי ובריאות</dt>
                      <dd>{formatShekels(toMonthly(result.btl.total, months))}</dd>
                    </div>
                  </dl>
                  <p className={styles.advanceNote}>
                    קירוב בלבד. את שיעור המקדמה קובעים רשות המסים והביטוח הלאומי לפי הדוחות שלכם.
                  </p>
                </div>

                {result.loss ? (
                  <p className={styles.notice}>
                    ההוצאות גבוהות מההכנסות, ולכן אין רווח ואין מס הכנסה. הביטוח הלאומי עשוי לגבות מעובד עצמאי
                    דמי ביטוח לפי הכנסה מזערית של {formatShekels(BTL_MIN_INCOME_MONTHLY)} לחודש.
                  </p>
                ) : null}
              </>
            ) : (
              <p className={styles.empty}>הקלידו את ההכנסות כדי לראות כמה מס וביטוח לאומי תשלמו וכמה יישאר לכם.</p>
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
              הערכה לפי השיעורים של {TAX_YEAR}, לתושבי ישראל מגיל 18 ועד גיל פרישה. לא ייעוץ מס ולא תחליף לדוח
              השנתי או לרואה חשבון. החישוב נעשה בדפדפן, והסכומים לא נשלחים לשום מקום.
            </p>
          </div>
        </div>
      </div>

      {result && result.profit > 0 ? (
        <div className={styles.details}>
          <h2 className={styles.detailsTitle}>פירוט החישוב</h2>
          <div className={styles.detailsGrid}>
            <IncomeTaxTable result={result} period={period} />
            <BtlTable result={result} period={period} />
          </div>
        </div>
      ) : null}
    </section>
  )
}
