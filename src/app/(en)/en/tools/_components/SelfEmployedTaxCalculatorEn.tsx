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
  calculateTax,
  monthsFor,
  parseAmount,
  parsePoints,
  toAnnual,
  toMonthly,
  type BracketRow,
  type Gender,
  type Period,
  type TaxResult,
} from '@/lib/self-employed-tax'
import type { ParsedNumber } from '@/lib/vat-calculator'
import ui from '../../../../(he)/(site)/components/tools/toolUi.module.css'
import styles from '../../../../(he)/(site)/components/tools/SelfEmployedTaxCalculator.module.css'

const ANNOUNCE_DELAY_MS = 900

const shekelFormat = new Intl.NumberFormat('en-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 })
const numberFormat = new Intl.NumberFormat('en-IL', { maximumFractionDigits: 0 })
const plainFormat = new Intl.NumberFormat('en-IL', { maximumFractionDigits: 2 })
const percentFormat = new Intl.NumberFormat('en-IL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

const shekels = (amount: number) => shekelFormat.format(amount)
const num = (amount: number) => numberFormat.format(amount)
const points = (hundredths: number) => plainFormat.format(hundredths / 100)
const basisPoints = (value: number) => `${plainFormat.format(value / 100)}%`
const ratio = (value: number) => `${percentFormat.format(value * 100)}%`

const bracketText = (row: BracketRow) => {
  if (row.to === null) return `Over ${num(row.from - 1)}`
  if (row.from === 0) return `Up to ${num(row.to)}`
  return `${num(row.from)} to ${num(row.to)}`
}

const periodOptions: { value: Period; label: string; hint: string }[] = [
  { value: 'year', label: 'Per year', hint: `Amounts for all of ${TAX_YEAR}` },
  { value: 'month', label: 'Per month', hint: 'Monthly average' },
]

const genderOptions: { value: Gender; label: string; hint: string }[] = [
  { value: 'man', label: 'Man', hint: `${points(DEFAULT_CREDIT_POINTS.man)} points` },
  { value: 'woman', label: 'Woman', hint: `${points(DEFAULT_CREDIT_POINTS.woman)} points` },
]

const unitFor = (period: Period) => (period === 'year' ? 'per year' : 'per month')

const amountError = (parsed: ParsedNumber) => {
  if (parsed.ok || parsed.reason === 'empty') return ''
  if (parsed.reason === 'too-large') return 'The amount is too large.'
  return 'Use digits only, with a dot for agorot.'
}

const pointsError = (parsed: ParsedNumber) => {
  if (parsed.ok) return ''
  if (parsed.reason === 'empty') return 'Enter a number of points, for example 2.25.'
  return `Enter a number between 0 and ${MAX_CREDIT_POINTS}.`
}

const pointsText = (hundredths: number) => points(hundredths).replace(/,/g, '')

const resultText = (result: TaxResult, period: Period) => {
  const { months } = result
  const unit = unitFor(period)
  return [
    `Israel self-employed tax calculator ${TAX_YEAR}, estimate only`,
    `Revenue ${unit}: ${shekels(result.revenue)}`,
    `Deductible expenses ${unit}: ${shekels(result.expenses)}`,
    `Profit ${unit}: ${shekels(result.profit)}`,
    `Income tax ${unit}: ${shekels(result.incomeTax.net)}`,
    `National Insurance ${unit}: ${shekels(result.btl.national)}`,
    `Health insurance ${unit}: ${shekels(result.btl.health)}`,
    `Total tax and National Insurance ${unit}: ${shekels(result.total)} (${ratio(result.effectiveRate)} of profit)`,
    `Net per month: ${shekels(toMonthly(result.net, months))}`,
    `Net per year: ${shekels(toAnnual(result.net, months))}`,
    `Estimated monthly income tax advance: ${shekels(toMonthly(result.incomeTax.net, months))}`,
    `Estimated monthly National Insurance and health advance: ${shekels(toMonthly(result.btl.total, months))}`,
    `Credit points: ${points(result.incomeTax.creditPointsHundredths)}`,
  ].join('\n')
}

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
  const marginal = basisPoints(result.marginalRateBasisPoints)

  return (
    <div className={styles.block}>
      <h3 className={styles.blockTitle}>Income tax by {TAX_YEAR} brackets</h3>
      <p className={styles.blockText}>
        Taxable income: {shekels(incomeTax.taxable)} {unit}. That is the profit, {shekels(profit)}, minus{' '}
        {shekels(btl.deductible)}, which is the deductible 52% of National Insurance contributions.
      </p>
      <TableRegion label="Income tax by bracket">
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Bracket (₪ {unit})</th>
              <th scope="col">Rate</th>
              <th scope="col">Income in bracket</th>
              <th scope="col">Tax</th>
            </tr>
          </thead>
          <tbody>
            {incomeTax.rows.map((row) => (
              <tr key={row.rateBasisPoints} className={row.income > 0 ? undefined : styles.unused}>
                <th scope="row">{bracketText(row)}</th>
                <td>{basisPoints(row.rateBasisPoints)}</td>
                <td>{num(row.income)}</td>
                <td>{num(row.tax)}</td>
              </tr>
            ))}
            {incomeTax.surtaxIncome > 0 ? (
              <tr>
                <th scope="row">Surtax, over {num(incomeTax.surtaxThreshold)}</th>
                <td>3%</td>
                <td>{num(incomeTax.surtaxIncome)}</td>
                <td>{num(incomeTax.surtax)}</td>
              </tr>
            ) : null}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colSpan={3}>
                Tax by brackets
              </th>
              <td>{num(incomeTax.gross)}</td>
            </tr>
            <tr>
              <th scope="row" colSpan={3}>
                Minus {points(incomeTax.creditPointsHundredths)} credit points
              </th>
              <td>{num(incomeTax.creditUsed)}</td>
            </tr>
            <tr className={styles.totalRow}>
              <th scope="row" colSpan={3}>
                Income tax {unit}
              </th>
              <td>{shekels(incomeTax.net)}</td>
            </tr>
          </tfoot>
        </table>
      </TableRegion>
      {incomeTax.taxable > 0 ? (
        <p className={styles.blockNote}>
          Marginal rate: {marginal}. Each extra shekel of taxable income adds {marginal} income tax, before National
          Insurance.
        </p>
      ) : null}
      {incomeTax.creditValue > incomeTax.gross ? (
        <p className={styles.blockNote}>
          Your credit points are worth {shekels(incomeTax.creditValue)}, more than the tax, so income tax is 0. The
          remainder is not refunded and does not carry over to next year.
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
      <h3 className={styles.blockTitle}>National Insurance and health insurance</h3>
      <p className={styles.blockText}>
        Calculation base: {shekels(btl.base)} {unit}. National Insurance deducts from profit 52% of the National
        Insurance contributions themselves and calculates in two tiers.
      </p>
      <TableRegion label="National Insurance and health insurance">
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Part of income (₪ {unit})</th>
              <th scope="col">Income</th>
              <th scope="col">National Insurance</th>
              <th scope="col">Health</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Reduced, up to {num(btl.reducedLimit)}</th>
              <td>{num(btl.reducedPart)}</td>
              <td>
                {num(btl.nationalReduced)}
                <span className={styles.rate}>{basisPoints(BTL_RATES.national.reduced)}</span>
              </td>
              <td>
                {num(btl.healthReduced)}
                <span className={styles.rate}>{basisPoints(BTL_RATES.health.reduced)}</span>
              </td>
            </tr>
            <tr className={btl.fullPart > 0 ? undefined : styles.unused}>
              <th scope="row">Full, up to {num(BTL_MAX_INCOME_MONTHLY * months)}</th>
              <td>{num(btl.fullPart)}</td>
              <td>
                {num(btl.nationalFull)}
                <span className={styles.rate}>{basisPoints(BTL_RATES.national.full)}</span>
              </td>
              <td>
                {num(btl.healthFull)}
                <span className={styles.rate}>{basisPoints(BTL_RATES.health.full)}</span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className={styles.totalRow}>
              <th scope="row">Total</th>
              <td>{num(btl.base)}</td>
              <td>{shekels(btl.national)}</td>
              <td>{shekels(btl.health)}</td>
            </tr>
          </tfoot>
        </table>
      </TableRegion>
      {btl.minimumApplied ? (
        <p className={styles.blockNote}>
          The profit is below the minimum income for a self-employed person, {shekels(BTL_MIN_INCOME_MONTHLY)} a month,
          so contributions were calculated on the minimum income.
        </p>
      ) : null}
      {btl.ceilingApplied ? (
        <p className={styles.blockNote}>
          No National Insurance or health contributions are paid on profit above {shekels(BTL_MAX_INCOME_MONTHLY)} a
          month.
        </p>
      ) : null}
    </div>
  )
}

export default function SelfEmployedTaxCalculatorEn() {
  const [period, setPeriod] = useState<Period>('year')
  const [revenue, setRevenue] = useState('')
  const [expenses, setExpenses] = useState('')
  const [gender, setGender] = useState<Gender>('man')
  const [creditPoints, setCreditPoints] = useState(pointsText(DEFAULT_CREDIT_POINTS.man))
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const lastSpoken = useRef('')

  const parsedRevenue = parseAmount(revenue)
  const parsedExpenses = parseAmount(expenses)
  const parsedPoints = parsePoints(creditPoints)
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
    ? `Net per month ${shekels(toMonthly(result.net, months))}. Income tax ${unit} ${shekels(
        result.incomeTax.net,
      )}. National Insurance and health ${unit} ${shekels(result.btl.total)}.`
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
    const parsed = parsePoints(creditPoints)
    if (!parsed.ok) {
      setCreditPoints(pointsText(DEFAULT_CREDIT_POINTS[next]))
      return
    }
    const shift = next === 'woman' ? WOMAN_EXTRA_POINTS : -WOMAN_EXTRA_POINTS
    setCreditPoints(pointsText(Math.max(0, parsed.hundredths + shift)))
  }

  const changePeriod = (next: Period) => {
    setPeriod(next)
    setStatus('')
  }

  const copy = async () => {
    if (!result) {
      setStatus('Enter your revenue to copy the result.')
      return
    }
    try {
      await navigator.clipboard.writeText(resultText(result, period))
      setStatus('Result copied')
      window.gtag?.('event', 'self_employed_tax_copy', { period, gender, locale: 'en' })
    } catch {
      setStatus('Copying failed. Select the result and copy it manually.')
    }
  }

  const summary = result
    ? [
        { key: 'netMonth', term: 'Net per month', value: toMonthly(result.net, months), main: true },
        { key: 'netYear', term: 'Net per year', value: toAnnual(result.net, months), main: false },
        { key: 'tax', term: `Income tax ${unit}`, value: result.incomeTax.net, main: false },
        { key: 'btl', term: `National Insurance and health ${unit}`, value: result.btl.total, main: false },
      ]
    : []

  return (
    <section className={ui.tool} aria-label="Israel self-employed income tax and National Insurance calculator">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <ChoiceGroup
            legend="The amounts I enter are"
            name="tax-period"
            options={periodOptions}
            value={period}
            onChange={changePeriod}
          />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>Revenue and expenses {unit}</legend>
            <NumberField
              label="Business revenue"
              hint="Osek murshe: without VAT. Osek patur: everything you received."
              value={revenue}
              error={revenueError}
              suffix="₪"
              onChange={setRevenue}
            />
            <NumberField
              label="Deductible expenses"
              hint="Expenses you may deduct from income. Leave empty if none."
              value={expenses}
              error={expensesError}
              suffix="₪"
              onChange={setExpenses}
            />
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>Credit points</legend>
            <ChoiceGroup
              legend="Israeli resident"
              name="tax-gender"
              options={genderOptions}
              value={gender}
              onChange={changeGender}
            />
            <NumberField
              label="Total credit points"
              hint={`One point is worth ${shekels(CREDIT_POINT_ANNUAL)} a year. Children, a degree, army discharge, aliyah and reserve duty add points, so you can change the number.`}
              value={creditPoints}
              error={pointsFieldError}
              onChange={setCreditPoints}
            />
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>Result</h2>
            {result ? (
              <>
                <dl className={styles.results}>
                  {summary.map((row) => (
                    <div key={row.key} className={row.main ? `${styles.row} ${styles.main}` : styles.row}>
                      <dt className={styles.term}>{row.term}</dt>
                      <dd className={styles.value}>{shekels(row.value)}</dd>
                    </div>
                  ))}
                  <div className={styles.row}>
                    <dt className={styles.term}>Total tax and National Insurance {unit}</dt>
                    <dd className={styles.value}>
                      {shekels(result.total)}
                      <span className={styles.share}>{ratio(result.effectiveRate)} of profit</span>
                    </dd>
                  </div>
                </dl>

                <div className={styles.advance}>
                  <h3 className={styles.advanceTitle}>Estimated monthly advances</h3>
                  <dl className={styles.advanceList}>
                    <div className={styles.advanceRow}>
                      <dt>Income tax</dt>
                      <dd>
                        {shekels(toMonthly(result.incomeTax.net, months))}
                        {result.revenue > 0 ? (
                          <span className={styles.share}>about {ratio(result.advanceRate)} of turnover</span>
                        ) : null}
                      </dd>
                    </div>
                    <div className={styles.advanceRow}>
                      <dt>National Insurance and health</dt>
                      <dd>{shekels(toMonthly(result.btl.total, months))}</dd>
                    </div>
                  </dl>
                  <p className={styles.advanceNote}>
                    An approximation. The Israel Tax Authority and National Insurance set your advance rate from your
                    reports.
                  </p>
                </div>

                {result.loss ? (
                  <p className={styles.notice}>
                    Expenses exceed revenue, so there is no profit and no income tax. National Insurance may still
                    charge a self-employed person contributions on the minimum income of{' '}
                    {shekels(BTL_MIN_INCOME_MONTHLY)} a month.
                  </p>
                ) : null}
              </>
            ) : (
              <p className={styles.empty}>Enter your revenue to see how much tax and National Insurance you will pay and what you keep.</p>
            )}

            <div className={ui.actions}>
              <button type="button" className={ui.primary} onClick={copy}>
                Copy the result
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>
            <p className={ui.note}>
              An estimate at {TAX_YEAR} rates, for Israeli residents aged 18 up to retirement age. Not tax advice and no
              substitute for the annual return or an accountant. The calculation runs in your browser and nothing is
              sent anywhere.
            </p>
          </div>
        </div>
      </div>

      {result && result.profit > 0 ? (
        <div className={styles.details}>
          <h2 className={styles.detailsTitle}>Calculation details</h2>
          <div className={styles.detailsGrid}>
            <IncomeTaxTable result={result} period={period} />
            <BtlTable result={result} period={period} />
          </div>
        </div>
      ) : null}
    </section>
  )
}
