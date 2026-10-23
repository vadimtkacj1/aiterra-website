'use client'

import { useId, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  MAX_AMOUNT_SHEKELS,
  MAX_LINES,
  STANDARD_VAT_RATE,
  calculateVat,
  parseAmount,
  parseRate,
  rateBasisPoints,
  type ParsedNumber,
  type VatBreakdown,
  type VatMode,
  type VatRateChoice,
  type VatResult,
} from '@/lib/vat-calculator'
import ui from '../../../../(he)/(site)/components/tools/toolUi.module.css'
import styles from '../../../../(he)/(site)/components/tools/VatCalculator.module.css'

type Line = { id: number; value: string }
type CopyTarget = 'all' | 'net' | 'vat' | 'gross'

const FULL_RATE_BASIS_POINTS = 10_000

const shekelFormat = new Intl.NumberFormat('en-IL', {
  style: 'currency',
  currency: 'ILS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const rateFormat = new Intl.NumberFormat('en-IL', { maximumFractionDigits: 2 })
const multiplierFormat = new Intl.NumberFormat('en-IL', { maximumFractionDigits: 4, useGrouping: false })

const formatShekels = (agorot: number) => shekelFormat.format(agorot / 100)
const formatRate = (basisPoints: number) => `${rateFormat.format(basisPoints / 100)}%`
const formatMultiplier = (basisPoints: number) =>
  multiplierFormat.format((FULL_RATE_BASIS_POINTS + basisPoints) / FULL_RATE_BASIS_POINTS)

const formulaText = (total: VatBreakdown, mode: VatMode, basisPoints: number) => {
  const multiplier = formatMultiplier(basisPoints)
  if (mode === 'add') return `${formatShekels(total.net)} × ${multiplier} = ${formatShekels(total.gross)}`
  return `${formatShekels(total.gross)} ÷ ${multiplier} = ${formatShekels(total.net)}`
}

const resultToText = (result: VatResult, basisPoints: number) => {
  const summary = [
    `Net (before VAT): ${formatShekels(result.total.net)}`,
    `VAT (${formatRate(basisPoints)}): ${formatShekels(result.total.vat)}`,
    `Gross (incl. VAT): ${formatShekels(result.total.gross)}`,
  ]
  if (result.lines.length < 2) return summary.join('\n')
  const lines = result.lines.map(
    (line, index) =>
      `${index + 1}. ${formatShekels(line.net)} + ${formatShekels(line.vat)} VAT = ${formatShekels(line.gross)}`,
  )
  return [...lines, '', ...summary].join('\n')
}

const modeOptions: { value: VatMode; label: string; hint: string }[] = [
  { value: 'add', label: 'Add VAT', hint: 'to a net amount' },
  { value: 'extract', label: 'Extract VAT', hint: 'from a VAT-inclusive total' },
]

const rateOptions: { value: VatRateChoice; label: string; hint: string }[] = [
  { value: 'standard', label: `${STANDARD_VAT_RATE}%`, hint: 'Current rate' },
  { value: 'eilat', label: '0%', hint: 'Eilat' },
  { value: 'custom', label: 'Other rate', hint: 'Type your own' },
]

const amountError = (parsed: ParsedNumber) => {
  if (parsed.ok || parsed.reason === 'empty') return ''
  if (parsed.reason === 'too-large') {
    return `That amount is too large. The maximum is ${formatShekels(MAX_AMOUNT_SHEKELS * 100)}.`
  }
  return 'Use digits only, with a dot before the agorot.'
}

const rateError = (parsed: ParsedNumber) => {
  if (parsed.ok) return ''
  if (parsed.reason === 'empty') return 'Enter a rate in percent.'
  return 'Enter a rate between 0 and 100.'
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
  const label = total > 1 ? `Line ${index + 1}` : 'Amount in shekels (₪)'

  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      <div className={styles.lineControl}>
        <input
          ref={inputRef}
          id={id}
          className={`${ui.input} ${styles.amount}`}
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          value={line.value}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        {total > 1 ? (
          <button type="button" className={styles.remove} aria-label={`Remove line ${index + 1}`} onClick={onRemove}>
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

export default function VatCalculatorEn() {
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
  const amountLegend = mode === 'add' ? 'Amount before VAT' : 'Amount including VAT'

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
      setStatus('Enter an amount to copy the result.')
      return
    }
    const value = target === 'all' ? resultToText(result, basisPoints ?? 0) : plainAmount(result.total[target])
    try {
      await navigator.clipboard.writeText(value)
      setStatus(target === 'all' ? 'Result copied' : `${formatShekels(result.total[target])} copied`)
      window.gtag?.('event', 'vat_calc_copy', {
        target,
        mode,
        rate: (basisPoints ?? 0) / 100,
        lines: amounts.length,
        locale: 'en',
      })
    } catch {
      setStatus('Copying failed. Select the amount and copy it manually.')
    }
  }

  const rows: { key: Exclude<CopyTarget, 'all'>; term: string; copyLabel: string; entered: boolean }[] = [
    { key: 'net', term: 'Before VAT', copyLabel: 'the amount before VAT', entered: mode === 'add' },
    {
      key: 'vat',
      term: basisPoints === null ? 'VAT' : `VAT ${formatRate(basisPoints)}`,
      copyLabel: 'the VAT amount',
      entered: false,
    },
    { key: 'gross', term: 'Including VAT', copyLabel: 'the amount including VAT', entered: mode === 'extract' },
  ]

  return (
    <section className={ui.tool} aria-label="Israel VAT calculator">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <ChoiceGroup
            legend="What do you want to calculate?"
            name="vat-mode"
            options={modeOptions}
            value={mode}
            onChange={setMode}
            layout={styles.modeChoices}
          />

          <ChoiceGroup
            legend="VAT rate"
            name="vat-rate"
            options={rateOptions}
            value={rateChoice}
            onChange={setRateChoice}
            layout={styles.rateChoices}
          >
            {rateChoice === 'custom' ? (
              <div className={ui.field}>
                <label htmlFor={customRateId} className={ui.label}>
                  Rate in percent
                </label>
                <p id={customRateHintId} className={ui.hint}>
                  For example 17, the rate that applied until the end of 2024.
                </p>
                <input
                  id={customRateId}
                  className={`${ui.input} ${styles.rate}`}
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
                In Eilat, sales by an Eilat-resident business for use in Eilat, and services it provides in Eilat,
                are VAT-exempt. There are exceptions, such as private cars, tobacco and expensive jewellery.{' '}
                <a href="#eilat">What exactly is exempt in Eilat</a>
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
                Add a line
              </button>
            ) : null}
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>Result</h2>
            {result ? (
              <dl className={styles.results}>
                {rows.map((row) => (
                  <div key={row.key} className={row.entered ? styles.row : `${styles.row} ${styles.computed}`}>
                    <dt className={styles.term}>{row.term}</dt>
                    <dd className={styles.cell}>
                      <span className={styles.value}>{formatShekels(result.total[row.key])}</span>
                      <button type="button" className={styles.copyOne} onClick={() => copy(row.key)}>
                        Copy<span className={styles.srOnly}> {row.copyLabel}</span>
                      </button>
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className={styles.empty}>Enter a valid VAT rate to see the result.</p>
            )}

            {result && hasAmount && basisPoints !== null ? (
              <p className={styles.formula}>Calculation: {formulaText(result.total, mode, basisPoints)}</p>
            ) : null}

            {result && result.lines.length > 1 ? (
              <div className={styles.tableWrap} role="region" aria-label="Breakdown by line" tabIndex={0}>
                <table className={styles.table}>
                  <caption className={styles.caption}>Breakdown by line</caption>
                  <thead>
                    <tr>
                      <th scope="col">Line</th>
                      <th scope="col">Before VAT</th>
                      <th scope="col">VAT</th>
                      <th scope="col">Including VAT</th>
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
                The VAT on the individual lines differs by an agora from the VAT on the total, because each line is
                rounded to agorot separately. The total VAT is calculated on the sum of all lines.
              </p>
            ) : null}

            <div className={ui.actions}>
              <button type="button" className={ui.primary} onClick={() => copy('all')}>
                Copy the result
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>
              The calculation runs in your browser and the amounts are not sent anywhere. Results are rounded to
              agorot.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
