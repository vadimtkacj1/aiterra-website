'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Copy } from 'lucide-react'
import {
  DAYS_PER_MONTH,
  MAX_BALANCE_DAYS,
  MAX_MONTHS,
  MAX_PARTIAL_DAYS,
  MAX_SPELL_DAYS,
  calculateSick,
  emptySickInput,
  type SickErrors,
  type SickField,
  type SickInput,
  type SickResult,
  type SpellSegment,
  type WorkWeek,
  type WorkerType,
} from '@/lib/sick-days'
import { parseAmount, parseHundredths, type ParsedNumber } from '@/lib/vat-calculator'
import ui from '../../../../(he)/(site)/components/tools/toolUi.module.css'
import styles from '../../../../(he)/(site)/components/tools/SickDaysCalculator.module.css'

const ANNOUNCE_DELAY_MS = 900
const UNIT = 100
const MAX_WAGE_AGOROT = 10_000_000

const dayFormat = new Intl.NumberFormat('en-IL', { maximumFractionDigits: 2 })
const moneyFormat = new Intl.NumberFormat('en-IL', {
  style: 'currency',
  currency: 'ILS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const formatShekels = (agorot: number) => moneyFormat.format(Math.round(agorot) / 100)
const daysLabel = (hundredths: number) =>
  Math.round(hundredths) === UNIT ? '1 day' : `${dayFormat.format(Math.round(hundredths) / UNIT)} days`
const countLabel = (count: number) => (count === 1 ? '1 day' : `${count} days`)
const rangeLabel = ({ from, to }: SpellSegment) => (from === to ? `Day ${from}` : `Days ${from}–${to}`)
const segmentLabel = ({ rate, coverage }: SpellSegment) => {
  if (rate === 0) return 'Unpaid'
  if (coverage === 'none') return 'Unpaid, balance used up'
  const base = rate === 50 ? 'Half pay' : 'Full pay'
  return coverage === 'partial' ? `${base}, partly covered by the balance` : base
}

const workerOptions: { value: WorkerType; label: string; hint: string }[] = [
  { value: 'salaried', label: 'Salaried', hint: 'Monthly salary' },
  { value: 'hourly', label: 'Paid by hour or day', hint: 'Full-time' },
  { value: 'intermittent', label: 'Intermittent', hint: 'Hourly or daily, not every day' },
]

const weekOptions: { value: WorkWeek; label: string; full: string }[] = [
  { value: 'five', label: '5 days a week', full: '21⅔' },
  { value: 'six', label: '6 days a week', full: '25' },
]

const spellHints: Record<WorkerType, string> = {
  salaried: 'Count every sick day in a row, including Shabbat and holidays.',
  hourly: 'Count sick days without weekly rest days and holidays.',
  intermittent: '',
}

const wholeError = (value: string, max: number, example: string) => {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (!/^\d+$/.test(trimmed)) return `Enter a whole number, for example ${example}.`
  return Number(trimmed) > max ? `The maximum is ${max}.` : ''
}

const daysError = (parsed: ParsedNumber, max: number) => {
  if (parsed.ok) return parsed.hundredths > max * UNIT ? `The maximum is ${max}.` : ''
  if (parsed.reason === 'empty') return ''
  return 'Enter a number of days, for example 4 or 2.5.'
}

const wageError = (parsed: ParsedNumber) => {
  if (parsed.ok) return parsed.hundredths > MAX_WAGE_AGOROT ? 'That amount is too large.' : ''
  if (parsed.reason === 'empty') return ''
  if (parsed.reason === 'too-large') return 'That amount is too large.'
  return 'Enter an amount in digits, for example 420.'
}

const englishErrors = (input: SickInput): SickErrors => {
  const errors: SickErrors = {}
  const months = wholeError(input.months, MAX_MONTHS, '14')
  if (months) errors.months = months
  const partial = wholeError(input.partialDays, MAX_PARTIAL_DAYS, '10')
  if (partial) errors.partialDays = partial
  const used = daysError(parseHundredths(input.usedDays), MAX_MONTHS * DAYS_PER_MONTH)
  if (used) errors.usedDays = used
  const spell = wholeError(input.spellDays, MAX_SPELL_DAYS, '5')
  if (spell) errors.spellDays = spell
  else if (input.spellDays.trim() && Number(input.spellDays) === 0) errors.spellDays = 'A sick spell is at least one day.'
  const wage = wageError(parseAmount(input.dailyWage))
  if (wage) errors.dailyWage = wage
  return errors
}

const resultToTextEn = ({ accrual, spell }: SickResult) => {
  const lines = [
    'Israel sick days calculator (Sick Pay Law)',
    `Accrued under the law: ${daysLabel(accrual.earned)}${accrual.atCap ? ' (the cap)' : ''}`,
  ]
  if (accrual.used) lines.push(`Days already paid: ${daysLabel(accrual.used)}`)
  lines.push(`Balance: ${daysLabel(accrual.balance)}`)
  if (spell) {
    lines.push(`Sick spell of ${countLabel(spell.days)}:`)
    for (const segment of spell.segments) lines.push(`${rangeLabel(segment)}: ${segmentLabel(segment)}`)
    lines.push(`Paid as ${daysLabel(spell.paidDays)} of full pay`)
    if (spell.amount !== null) lines.push(`Sick pay: ${formatShekels(spell.amount)}`)
    lines.push(`Balance after the spell: ${daysLabel(spell.balanceAfter)}`)
  }
  lines.push('Estimate under the Sick Pay Law, 1976. A collective agreement, extension order or contract can give more.')
  lines.push('https://www.aiterra.co.il/en/tools/sick-days-calculator')
  return lines.join('\n')
}

function Field({
  id,
  label,
  hint,
  error,
  value,
  onChange,
  decimal = false,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  value: string
  onChange: (value: string) => void
  decimal?: boolean
}) {
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const described = [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ')
  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      <input
        id={id}
        className={`${ui.input} ${ui.ltr} ${styles.number}`}
        inputMode={decimal ? 'decimal' : 'numeric'}
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="done"
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={described || undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint ? (
        <p id={hintId} className={ui.hint}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

function ResultCard({ result }: { result: SickResult }) {
  const { accrual, spell, worker } = result
  return (
    <div className={styles.card}>
      <p className={styles.kicker}>Sick day balance</p>
      <p className={styles.answer}>{daysLabel(accrual.balance)}</p>
      <p className={styles.basis}>
        {accrual.used
          ? `${daysLabel(accrual.earned)} accrued, minus ${daysLabel(accrual.used)} already paid`
          : `1.5 days for every full month of work, up to ${MAX_BALANCE_DAYS} days`}
      </p>
      {accrual.atCap ? (
        <p className={styles.insight}>The balance has reached the {MAX_BALANCE_DAYS}-day cap in section 4(a) of the law.</p>
      ) : null}
      {accrual.overCap && accrual.used ? (
        <p className={styles.insight}>
          Once the balance has reached the cap, a calculation based on months alone may not match your real balance.
          Check the balance on your payslip.
        </p>
      ) : null}
      {accrual.overused ? (
        <p className={styles.insight}>The days entered exceed what the law accrues, so the balance is 0.</p>
      ) : null}

      {spell ? (
        <>
          <h3 className={styles.subTitle}>Sick spell of {countLabel(spell.days)}</h3>
          <dl className={styles.segments}>
            {spell.segments.map((segment) => (
              <div key={segment.from} className={styles.segment}>
                <dt>{rangeLabel(segment)}</dt>
                <dd>{segmentLabel(segment)}</dd>
              </div>
            ))}
          </dl>
          <dl className={styles.facts}>
            <div className={styles.fact}>
              <dt>Paid as</dt>
              <dd>{daysLabel(spell.paidDays)} of full pay</dd>
            </div>
            {spell.amount !== null ? (
              <div className={styles.fact}>
                <dt>Sick pay for the spell</dt>
                <dd>{formatShekels(spell.amount)}</dd>
              </div>
            ) : null}
            <div className={styles.fact}>
              <dt>Balance afterwards</dt>
              <dd>{daysLabel(spell.balanceAfter)}</dd>
            </div>
          </dl>
          {spell.treatment ? (
            <p className={styles.insight}>
              Treatment or tests for cancer or dialysis are paid from the first day, if the employer receives a written
              medical certificate (section 2(a1)).
            </p>
          ) : null}
          {spell.shortOfBalance ? (
            <p className={styles.insight}>
              The balance does not cover the whole spell. The law does not require sick pay for days beyond the balance.
            </p>
          ) : null}
        </>
      ) : null}
      {worker === 'intermittent' ? (
        <p className={styles.insight}>
          For an intermittent worker the law counts sick days by the ratio between their working days and the working
          days in the fullest quarter (section 2(b)(3) and (4)). The calculator does not work out pay for that case;
          the accrual and balance are still correct.
        </p>
      ) : null}
    </div>
  )
}

export default function SickDaysCalculatorEn() {
  const [input, setInput] = useState<SickInput>(emptySickInput)
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const id = useId()
  const errors = englishErrors(input)
  const hasErrors = Object.keys(errors).length > 0
  const outcome = useMemo(() => calculateSick(input), [input])
  const result = !hasErrors && outcome.kind === 'result' ? outcome : null
  const showWeek = Number(input.partialDays) > 0

  const spoken = (() => {
    if (!result) return ''
    const balance = `Sick day balance: ${daysLabel(result.accrual.balance)}.`
    if (!result.spell) return balance
    const pay = result.spell.amount !== null ? ` Sick pay: ${formatShekels(result.spell.amount)}.` : ''
    return `${balance} The spell is paid as ${daysLabel(result.spell.paidDays)} of full pay.${pay}`
  })()
  const lastSpoken = useRef(spoken)

  useEffect(() => {
    if (spoken === lastSpoken.current) return
    const timer = window.setTimeout(() => {
      lastSpoken.current = spoken
      setAnnouncement(spoken)
    }, ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  const update = (patch: Partial<SickInput>) => {
    setInput((current) => ({ ...current, ...patch }))
    setStatus('')
  }

  const setField = (field: SickField) => (value: string) => update({ [field]: value.replace(/\s/g, '') })

  const copy = async () => {
    if (!result) {
      setStatus('Enter your months of work to get a result to copy.')
      return
    }
    try {
      await navigator.clipboard.writeText(resultToTextEn(result))
      setStatus('Summary copied')
      window.gtag?.('event', 'sick_days_calc', { worker: result.worker, with_spell: Boolean(result.spell), locale: 'en' })
    } catch {
      setStatus('Copying failed. Select the result and copy it manually.')
    }
  }

  const message = hasErrors
    ? 'To see the result, fix the field with the error message below it.'
    : 'To see the result, enter how many full months you have worked for the employer.'

  return (
    <section className={`${ui.tool} ${styles.calc}`} aria-label="Israel sick days calculator">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>Time with the employer</legend>
            <div className={styles.pair}>
              <Field
                id={`${id}-months`}
                label="Full months worked"
                value={input.months}
                error={errors.months}
                onChange={setField('months')}
              />
              <Field
                id={`${id}-used`}
                label="Days already paid as sick pay"
                hint="Optional"
                value={input.usedDays}
                error={errors.usedDays}
                decimal
                onChange={setField('usedDays')}
              />
            </div>
            <Field
              id={`${id}-partial`}
              label="Working days in partial months"
              hint="Optional. A month in which you did not work every working day gives a proportional share."
              value={input.partialDays}
              error={errors.partialDays}
              onChange={setField('partialDays')}
            />
            {showWeek ? (
              <fieldset className={ui.group}>
                <legend className={ui.legend}>Working week at your workplace</legend>
                <div className={styles.choices}>
                  {weekOptions.map((option) => (
                    <label key={option.value} className={styles.choice}>
                      <input
                        type="radio"
                        name={`${id}-week`}
                        value={option.value}
                        checked={input.week === option.value}
                        onChange={() => update({ week: option.value })}
                      />
                      <span>
                        {option.label}
                        <span className={styles.choiceHint}>Full month = {option.full} working days</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>Sick spell</legend>
            <p className={ui.hint}>Optional. Fill in to see what is paid for a particular spell.</p>
            <fieldset className={ui.group}>
              <legend className={ui.legend}>Type of employee</legend>
              <div className={`${styles.choices} ${styles.three}`}>
                {workerOptions.map((option) => (
                  <label key={option.value} className={styles.choice}>
                    <input
                      type="radio"
                      name={`${id}-worker`}
                      value={option.value}
                      checked={input.worker === option.value}
                      onChange={() => update({ worker: option.value })}
                    />
                    <span>
                      {option.label}
                      <span className={styles.choiceHint}>{option.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            {input.worker !== 'intermittent' ? (
              <>
                <div className={styles.pair}>
                  <Field
                    id={`${id}-spell`}
                    label="Sick days in a row"
                    hint={spellHints[input.worker]}
                    value={input.spellDays}
                    error={errors.spellDays}
                    onChange={setField('spellDays')}
                  />
                  <Field
                    id={`${id}-wage`}
                    label="Pay per sick day (₪)"
                    hint="Optional. Base pay and fixed supplements, without overtime."
                    value={input.dailyWage}
                    error={errors.dailyWage}
                    decimal
                    onChange={setField('dailyWage')}
                  />
                </div>
                <label className={ui.option}>
                  <input
                    type="checkbox"
                    className={ui.checkbox}
                    checked={input.treatment}
                    onChange={(event) => update({ treatment: event.target.checked })}
                  />
                  <span>The absence is for treatment or tests for cancer or dialysis</span>
                </label>
              </>
            ) : null}
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>Result</h2>
            {result ? (
              <ResultCard result={result} />
            ) : (
              <div className={styles.card}>
                <p className={styles.message}>{message}</p>
              </div>
            )}
            <div className={ui.actions}>
              <button type="button" className={`${ui.primary} ${styles.copyMain}`} onClick={copy}>
                <Copy aria-hidden="true" />
                Copy the summary
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>
            <p className={ui.note}>
              Calculated under the Sick Pay Law only. A collective agreement, extension order or personal contract can
              give more. The calculation runs in your browser and nothing is sent anywhere.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
