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
  grossForNet,
  parseAmount,
  parsePoints,
  ratio,
  type Gender,
  type SalaryResult,
  type Severance,
} from '@/lib/net-salary'
import type { ParsedNumber } from '@/lib/vat-calculator'
import ui from '../../../../(he)/(site)/components/tools/toolUi.module.css'
import styles from '../../../../(he)/(site)/components/tools/SelfEmployedTaxCalculator.module.css'
import { COPY_FAILED, ils } from './en-format'

const formatShekels = ils

type Direction = 'gross' | 'net'
type View = 'employee' | 'employer'

const ANNOUNCE_DELAY_MS = 900

const directionOptions: { value: Direction; label: string; hint: string }[] = [
  { value: 'gross', label: 'Gross to net', hint: 'You know the gross' },
  { value: 'net', label: 'Net to gross', hint: 'You know the net you want' },
]

const genderOptions: { value: Gender; label: string; hint: string }[] = [
  { value: 'man', label: 'Man', hint: `${formatPoints(DEFAULT_CREDIT_POINTS.man)} points` },
  { value: 'woman', label: 'Woman', hint: `${formatPoints(DEFAULT_CREDIT_POINTS.woman)} points` },
]

const severanceOptions: { value: Severance; label: string; hint: string }[] = [
  { value: 'partial', label: '6%', hint: 'Pension order minimum' },
  { value: 'full', label: '8.33%', hint: 'Full severance' },
]

const views: { value: View; label: string }[] = [
  { value: 'employee', label: 'Employee deductions' },
  { value: 'employer', label: 'Employer cost' },
]

const amountError = (parsed: ParsedNumber) => {
  if (parsed.ok || parsed.reason === 'empty') return ''
  if (parsed.reason === 'too-large') return 'The amount is too large.'
  return 'Use digits only, with a point for agorot.'
}

const pointsError = (parsed: ParsedNumber) => {
  if (parsed.ok) return ''
  if (parsed.reason === 'empty') return 'Enter a number of points, for example 2.25.'
  return 'Enter a number from 0 to 40.'
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
      <h3 className={styles.blockTitle}>What comes off the gross</h3>
      <TableRegion label="Salary deductions">
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Per month</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Tax by brackets</th>
              <td>{formatShekels(incomeTax.gross)}</td>
            </tr>
            <tr>
              <th scope="row">Less {formatPoints(incomeTax.creditPointsHundredths)} credit points</th>
              <td>−{formatShekels(incomeTax.creditUsed)}</td>
            </tr>
            <tr className={result.pensionCredit > 0 ? undefined : styles.unused}>
              <th scope="row">Less 35% credit on the pension deposit</th>
              <td>−{formatShekels(result.pensionCredit)}</td>
            </tr>
            <tr className={styles.totalRow}>
              <th scope="row">Income tax</th>
              <td>{formatShekels(result.tax)}</td>
            </tr>
            <tr>
              <th scope="row">
                National Insurance
              </th>
              <td>{formatShekels(btl.national)}</td>
            </tr>
            <tr>
              <th scope="row">
                Health insurance
              </th>
              <td>{formatShekels(btl.health)}</td>
            </tr>
            <tr>
              <th scope="row">
                Pension, employee
                <Rate basisPoints={PENSION_EMPLOYEE_BASIS_POINTS} />
              </th>
              <td>{formatShekels(result.pension)}</td>
            </tr>
            {result.hishtalmut > 0 ? (
              <tr>
                <th scope="row">
                  Keren hishtalmut, employee
                  <Rate basisPoints={HISHTALMUT_EMPLOYEE_BASIS_POINTS} />
                </th>
                <td>{formatShekels(result.hishtalmut)}</td>
              </tr>
            ) : null}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Total deductions</th>
              <td>{formatShekels(result.deductions)}</td>
            </tr>
            <tr className={styles.totalRow}>
              <th scope="row">Net</th>
              <td>{formatShekels(result.net)}</td>
            </tr>
          </tfoot>
        </table>
      </TableRegion>
      <p className={styles.blockNote}>
        National Insurance and health: {formatBasisPoints(employeeReduced)} on pay up to{' '}
        {formatShekels(BTL_REDUCED_LIMIT_MONTHLY)}, and {formatBasisPoints(employeeFull)} on the part above, up to{' '}
        {formatShekels(BTL_MAX_INCOME_MONTHLY)}.
      </p>
      {result.hishtalmutBenefit > 0 ? (
        <p className={styles.blockNote}>
          The employer deposit to the keren hishtalmut on pay above {formatShekels(HISHTALMUT_SALARY_CEILING_MONTHLY)} is a
          taxable benefit, so {formatShekels(result.hishtalmutBenefit)} was added to taxable income.
        </p>
      ) : null}
      {incomeTax.creditValue > incomeTax.gross ? (
        <p className={styles.blockNote}>
          Your credit points are worth more than the tax, so income tax is 0. The balance is not refunded.
        </p>
      ) : null}
    </div>
  )
}

function EmployerTable({ result }: { result: SalaryResult }) {
  const { employer } = result
  return (
    <div className={styles.block}>
      <h3 className={styles.blockTitle}>What the employee costs the employer</h3>
      <TableRegion label="Employer cost">
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Per month</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Gross salary</th>
              <td>{formatShekels(result.gross)}</td>
            </tr>
            <tr>
              <th scope="row">
                National Insurance, employer
              </th>
              <td>{formatShekels(employer.btl)}</td>
            </tr>
            <tr>
              <th scope="row">
                Pension, employer
                <Rate basisPoints={PENSION_EMPLOYER_BASIS_POINTS} />
              </th>
              <td>{formatShekels(employer.pension)}</td>
            </tr>
            <tr>
              <th scope="row">
                Severance
                <Rate basisPoints={employer.severanceBasisPoints} />
              </th>
              <td>{formatShekels(employer.severance)}</td>
            </tr>
            {employer.hishtalmut > 0 ? (
              <tr>
                <th scope="row">
                  Keren hishtalmut, employer
                  <Rate basisPoints={HISHTALMUT_EMPLOYER_BASIS_POINTS} />
                </th>
                <td>{formatShekels(employer.hishtalmut)}</td>
              </tr>
            ) : null}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">On top of gross</th>
              <td>
                {formatShekels(employer.total)}
                <span className={styles.share}>{formatRatio(ratio(employer.total, result.gross))}</span>
              </td>
            </tr>
            <tr className={styles.totalRow}>
              <th scope="row">Employer cost</th>
              <td>{formatShekels(employer.cost)}</td>
            </tr>
          </tfoot>
        </table>
      </TableRegion>
      <p className={styles.blockNote}>
        Employer National Insurance: {formatBasisPoints(BTL_EMPLOYER_RATES.reduced)} on pay up to{' '}
        {formatShekels(BTL_REDUCED_LIMIT_MONTHLY)} and {formatBasisPoints(BTL_EMPLOYER_RATES.full)} on the part above.
        Employers pay no health insurance. Disability cover, dmei havraa, travel and vacation are not included.
      </p>
    </div>
  )
}

const resultText = (result: SalaryResult) =>
  [
    `Israel net salary ${TAX_YEAR}, estimate only`,
    `Gross per month: ${ils(result.gross)}`,
    `Income tax: ${ils(result.tax)}`,
    `National Insurance: ${ils(result.btl.national)}`,
    `Health insurance: ${ils(result.btl.health)}`,
    `Pension (employee): ${ils(result.pension)}`,
    ...(result.hishtalmut > 0 ? [`Keren hishtalmut (employee): ${ils(result.hishtalmut)}`] : []),
    `Net per month: ${ils(result.net)}`,
    `Credit points: ${formatPoints(result.incomeTax.creditPointsHundredths)}`,
    `Employer cost per month: ${ils(result.employer.cost)}`,
    'https://www.aiterra.co.il/en/tools/net-salary-calculator',
  ].join('\n')

export default function NetSalaryCalculatorEn() {
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
    ? `Gross ${formatShekels(result.gross)}. Net ${formatShekels(result.net)}. Employer cost ${formatShekels(
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
      setStatus('Enter a salary to copy the result.')
      return
    }
    try {
      await navigator.clipboard.writeText(resultText(result))
      setStatus('Result copied')
      window.gtag?.('event', 'net_salary_copy', { direction, gender })
    } catch {
      setStatus(COPY_FAILED)
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
        { key: 'net', term: 'Net per month', value: result.net, main: true },
        { key: 'gross', term: 'Gross per month', value: result.gross, main: false },
        { key: 'deductions', term: 'Total deductions', value: result.deductions, main: false },
        { key: 'cost', term: 'Employer cost per month', value: result.employer.cost, main: false },
      ]
    : []

  return (
    <section className={ui.tool} aria-label="Israel net salary and employer cost calculator">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <ChoiceGroup
            legend="What to calculate"
            name="salary-direction"
            options={directionOptions}
            value={direction}
            onChange={(next) => {
              setDirection(next)
              setStatus('')
            }}
          />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>Monthly salary</legend>
            <NumberField
              label={direction === 'gross' ? 'Gross salary per month' : 'Desired net per month'}
              hint={
                direction === 'gross'
                  ? 'Payslip salary before deductions, with fixed additions.'
                  : 'The calculator finds the gross that gives this net.'
              }
              value={amount}
              error={amountFieldError}
              suffix="₪"
              onChange={setAmount}
            />
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>Credit points</legend>
            <ChoiceGroup
              legend="Israeli resident"
              name="salary-gender"
              options={genderOptions}
              value={gender}
              onChange={changeGender}
            />
            <NumberField
              label="Total credit points"
              hint={`One point is worth ${formatShekels(CREDIT_POINT_ANNUAL / 12)} a month. Children, a degree and IDF discharge add points.`}
              value={points}
              error={pointsFieldError}
              onChange={setPoints}
            />
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>Contributions</legend>
            <label className={styles.choice}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={hishtalmut}
                onChange={(event) => setHishtalmut(event.target.checked)}
              />
              <span className={styles.choiceText}>
                <span className={styles.choiceLabel}>I have a keren hishtalmut</span>
                <span className={styles.choiceHint}>2.5% from you and 7.5% from the employer</span>
              </span>
            </label>
            <ChoiceGroup
              legend="Employer severance contribution"
              name="salary-severance"
              options={severanceOptions}
              value={severance}
              onChange={setSeverance}
            />
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>Result</h2>
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
              <p className={styles.notice}>That net is too high to calculate. Try a smaller amount.</p>
            ) : (
              <p className={styles.empty}>Enter a salary to see net pay, deductions and employer cost.</p>
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
              Estimate at {TAX_YEAR} rates, for an Israeli resident aged 18 to retirement age with one job. Your payslip
              can differ. Calculated in your browser; nothing is sent anywhere.
            </p>
          </div>
        </div>
      </div>

      {result && result.gross > 0 ? (
        <div className={styles.details}>
          <h2 className={styles.detailsTitle}>Calculation details</h2>
          <div className={styles.choices} role="tablist" aria-label="Details">
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
