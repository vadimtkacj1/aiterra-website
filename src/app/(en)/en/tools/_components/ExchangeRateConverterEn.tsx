'use client'

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { Copy, ExternalLink, RotateCcw } from 'lucide-react'
import {
  BOI_RATES_PAGE,
  BOI_SERIES_BROWSER,
  MIN_DATE,
  REQUEST_TIMEOUT_MS,
  SLOW_AFTER_MS,
  TIMEOUT_REASON,
  convert,
  currencies,
  currencyOf,
  fetchRates,
  formatDots,
  historyFor,
  isCurrencyCode,
  isValidIso,
  israelNow,
  missingReason,
  parseForeignAmount,
  parseRateInput,
  rateFor,
  rateInputValue,
  proxyRatesUrl,
  ratesWindow,
  unitText,
  weekdayOfIso,
  type Conversion,
  type CurrencyCode,
  type Direction,
  type IsraelNow,
  type MissingReason,
  type Observation,
  type RateSeries,
  type RatesFailure,
} from '@/lib/exchange-rate'
import { STANDARD_VAT_RATE } from '@/lib/vat-calculator'
import { currencyNamesEn, enInvoiceLine, enRate, enShekels, enForeign } from '@/lib/exchange-rate-en'
import ui from '../../../../(he)/(site)/components/tools/toolUi.module.css'
import styles from '../../../../(he)/(site)/components/tools/ExchangeRateConverter.module.css'

type Phase =
  | { kind: 'idle' }
  | { kind: 'loading'; key: string; slow: boolean }
  | { kind: 'ready'; key: string; series: RateSeries }
  | { kind: 'failed'; key: string; failure: Exclude<RatesFailure, 'aborted'> }

type Outcome =
  | { kind: 'message'; message: ReactNode; spoken: string }
  | { kind: 'result'; conversion: Conversion; rateIso: string; notice: string; manual: boolean }

const ANNOUNCE_DELAY_MS = 900
const FETCH_DEBOUNCE_MS = 350
const HISTORY_PREVIEW = 10

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const weekday = (iso: string) => WEEKDAYS[weekdayOfIso(iso)]

const changeFormat = new Intl.NumberFormat('en-IL', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: 'exceptZero',
})

const formatChange = (change: number) => `${changeFormat.format(change * 100)}%`

const failureText: Record<Exclude<RatesFailure, 'aborted'>, string> = {
  network: 'The rate did not load from the Bank of Israel.',
  timeout: 'The Bank of Israel did not answer within 15 seconds.',
  server: 'The Bank of Israel rates database is not available right now.',
  format: 'The Bank of Israel returned a response we could not read.',
}

const directionOptions: { value: Direction; label: string }[] = [
  { value: 'to-ils', label: 'Foreign currency to shekels' },
  { value: 'from-ils', label: 'Shekels to foreign currency' },
]

const fallbackNotice = (targetIso: string, used: Observation, reason: MissingReason) => {
  const usedText = `Showing the last rate published before it, from ${weekday(used.iso)}, ${formatDots(used.iso)}.`
  if (reason === 'weekend') {
    return `On ${weekday(targetIso)}, ${formatDots(targetIso)}, the Bank of Israel does not publish a representative rate. ${usedText}`
  }
  if (reason === 'not-yet') {
    return `Today’s rate is not published yet. The Bank of Israel usually publishes it shortly after 15:15, and after 12:15 on Fridays and holiday eves. ${usedText}`
  }
  return `No representative rate was published on ${formatDots(targetIso)}, for example because of a holiday in Israel or abroad. ${usedText}`
}

const conversionText = (conversion: Conversion, iso: string) => {
  const { foreign, shekels, code, micros, unit } = conversion
  const rate = enRate(micros)
  const multiplier = unit === 1 ? rate : `${rate} ÷ ${unit}`
  const lines =
    conversion.direction === 'to-ils'
      ? [`${enForeign(foreign.net, code)} × ${multiplier} = ${enShekels(shekels.net)}`]
      : [`${enShekels(shekels.net)} ÷ ${multiplier} = ${enForeign(foreign.net, code)}`]
  if (conversion.withVat) {
    lines.push(
      `VAT ${STANDARD_VAT_RATE}%: ${enShekels(shekels.vat)}`,
      `Total including VAT: ${enShekels(shekels.gross)} (${enForeign(foreign.gross, code)})`,
    )
  }
  lines.push(enInvoiceLine(micros, unit, code, iso))
  return lines.join('\n')
}

const amountError = (value: string) => {
  const parsed = parseForeignAmount(value)
  if (parsed.ok || parsed.reason === 'empty') return ''
  if (parsed.reason === 'too-large') return 'The amount is too large. The maximum is 100 million.'
  return 'Enter an amount in digits, for example 2500 or 2,500.50.'
}

const rateError = (value: string | null) => {
  if (value === null) return ''
  const parsed = parseRateInput(value)
  if (parsed.ok || parsed.reason === 'empty') return ''
  if (parsed.reason === 'zero') return 'The rate must be greater than zero.'
  return 'Enter a rate in digits, for example 3.107.'
}

const dateError = (value: string, today: IsraelNow | null) => {
  if (!value) return ''
  if (!isValidIso(value)) return 'Invalid date. Choose a day, month and year.'
  if (value < MIN_DATE) return `Choose a date from ${formatDots(MIN_DATE)} onwards.`
  if (today && value > today.iso) return 'The Bank of Israel only publishes rates for days that have arrived. Choose today or earlier.'
  return ''
}

const BoiLink = ({ children }: { children: ReactNode }) => (
  <a href={BOI_RATES_PAGE} target="_blank" rel="noopener" className={styles.inlineLink}>
    {children}
  </a>
)

export default function ExchangeRateConverterEn() {
  const [direction, setDirection] = useState<Direction>('to-ils')
  const [code, setCode] = useState<CurrencyCode>('USD')
  const [date, setDate] = useState('')
  const [today, setToday] = useState<IsraelNow | null>(null)
  const [amount, setAmount] = useState('1000')
  const [withVat, setWithVat] = useState(false)
  const [manualRate, setManualRate] = useState<string | null>(null)
  const [stored, setPhase] = useState<Phase>({ kind: 'idle' })
  const [attempt, setAttempt] = useState(0)
  const [showAll, setShowAll] = useState(false)
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const touched = useRef(false)
  const cache = useRef(new Map<string, RateSeries>())
  const radioName = useId()
  const currencyId = useId()
  const dateId = useId()
  const amountId = useId()
  const rateId = useId()
  const historyHeadingId = useId()
  const currency = currencyOf(code)

  useEffect(() => {
    const now = israelNow()
    setToday(now)
    setDate((current) => current || now.iso)
    const requested = new URLSearchParams(window.location.search).get('currency')?.toUpperCase() ?? ''
    if (isCurrencyCode(requested)) setCode(requested)
  }, [])

  const dateProblem = dateError(date, today)
  const fetchable = Boolean(date) && !dateProblem && today !== null

  useEffect(() => {
    if (!fetchable) return
    const cached = cache.current.get(date)
    if (cached) {
      setPhase({ kind: 'ready', key: date, series: cached })
      return
    }
    const controller = new AbortController()
    const timers: number[] = []
    const start = window.setTimeout(() => {
      setPhase({ kind: 'loading', key: date, slow: false })
      timers.push(
        window.setTimeout(() => setPhase((current) => (current.kind === 'loading' ? { ...current, slow: true } : current)), SLOW_AFTER_MS),
        window.setTimeout(() => controller.abort(TIMEOUT_REASON), REQUEST_TIMEOUT_MS),
      )
      const range = ratesWindow(date)
      fetchRates(proxyRatesUrl(range.start, range.end), controller.signal).then((result) => {
        timers.forEach((timer) => window.clearTimeout(timer))
        if (!result.ok) {
          if (result.failure !== 'aborted') setPhase({ kind: 'failed', key: date, failure: result.failure })
          return
        }
        cache.current.set(date, result.series)
        setPhase({ kind: 'ready', key: date, series: result.series })
      })
    }, FETCH_DEBOUNCE_MS)
    return () => {
      window.clearTimeout(start)
      timers.forEach((timer) => window.clearTimeout(timer))
      controller.abort('superseded')
    }
  }, [date, fetchable, attempt])

  const phase: Phase =
    stored.kind === 'idle' || stored.key === date || !fetchable ? stored : { kind: 'loading', key: date, slow: false }
  const series = phase.kind === 'ready' ? phase.series[code] : undefined
  const lookup = fetchable && phase.kind === 'ready' ? rateFor(series, date) : null
  const unit = lookup?.observation.unit ?? currency.unit
  const rateValue = manualRate ?? (lookup ? rateInputValue(lookup.observation.micros) : '')

  const outcome = useMemo<Outcome>(() => {
    const parsedAmount = parseForeignAmount(amount)
    if (!date || !amount.trim()) {
      const text = 'Choose a currency and date and enter an amount.'
      return { kind: 'message', message: text, spoken: text }
    }
    if (dateProblem || !parsedAmount.ok) {
      const text = 'To see the result, fix the field with the error message below it.'
      return { kind: 'message', message: text, spoken: text }
    }
    const typed = manualRate !== null ? parseRateInput(manualRate) : null
    if (typed && !typed.ok) {
      const text = typed.reason === 'empty' ? 'Enter the representative rate to calculate.' : 'To see the result, fix the rate.'
      return { kind: 'message', message: text, spoken: text }
    }
    const micros = typed?.ok ? typed.micros : lookup?.observation.micros
    if (!micros) {
      if (phase.kind === 'loading' || phase.kind === 'idle') {
        return { kind: 'message', message: 'Loading the rate from the Bank of Israel…', spoken: 'Loading the rate from the Bank of Israel' }
      }
      const text = `Enter the representative rate of ${code} for ${formatDots(date)} to calculate. You can find it on the Bank of Israel website.`
      return {
        kind: 'message',
        spoken: text,
        message: (
          <>
            Type the {code} rate for {formatDots(date)} in the representative rate field. You can find it on the{' '}
            <BoiLink>Bank of Israel website</BoiLink>.
          </>
        ),
      }
    }
    const conversion = convert({ amount: parsedAmount.hundredths, direction, micros, unit, withVat, code })
    const manual = Boolean(typed?.ok)
    const rateIso = manual || !lookup ? date : lookup.observation.iso
    const notice =
      !manual && lookup && !lookup.exact && today
        ? fallbackNotice(date, lookup.observation, missingReason(date, today))
        : ''
    return { kind: 'result', conversion, rateIso, notice, manual }
  }, [amount, code, date, dateProblem, direction, lookup, manualRate, phase.kind, today, unit, withVat])

  const line =
    outcome.kind === 'result'
      ? enInvoiceLine(outcome.conversion.micros, outcome.conversion.unit, outcome.conversion.code, outcome.rateIso)
      : ''
  const spoken =
    outcome.kind === 'result'
      ? `${
          outcome.conversion.direction === 'to-ils'
            ? enShekels(withVat ? outcome.conversion.shekels.gross : outcome.conversion.shekels.net)
            : enForeign(withVat ? outcome.conversion.foreign.gross : outcome.conversion.foreign.net, code)
        }, ${line}`
      : outcome.spoken

  useEffect(() => {
    if (!touched.current) return
    const timer = window.setTimeout(() => setAnnouncement(spoken), ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  const touch = () => {
    touched.current = true
    setStatus('')
  }

  const selectCurrency = (next: string) => {
    if (!isCurrencyCode(next)) return
    touch()
    setCode(next)
    setManualRate(null)
    setShowAll(false)
  }

  const selectDate = (next: string) => {
    touch()
    setDate(next)
    setManualRate(null)
  }

  const retry = () => {
    touch()
    setAttempt((current) => current + 1)
  }

  const copy = async (text: string, done: string, kind: 'line' | 'full') => {
    try {
      await navigator.clipboard.writeText(text)
      setStatus(done)
      window.gtag?.('event', 'exchange_rate_copy', { kind, currency: code, direction, vat: withVat, locale: 'en' })
    } catch {
      setStatus('Copying failed. Select the text and copy it manually.')
    }
  }

  const amountLabel = direction === 'to-ils' ? `Amount in ${code}` : 'Amount in shekels'
  const amountProblem = amountError(amount)
  const rateProblem = rateError(manualRate)

  let rateHint: ReactNode
  if (manualRate !== null) {
    rateHint = (
      <>
        A rate you typed.{' '}
        {lookup ? (
          <button type="button" className={styles.textButton} onClick={() => setManualRate(null)}>
            Back to the Bank of Israel rate
          </button>
        ) : null}
      </>
    )
  } else if (phase.kind === 'loading' || (phase.kind === 'idle' && fetchable)) {
    rateHint =
      phase.kind === 'loading' && phase.slow
        ? 'The Bank of Israel is slow to answer. Waiting up to 15 seconds.'
        : 'Loading from the Bank of Israel…'
  } else if (phase.kind === 'failed') {
    rateHint = (
      <>
        {failureText[phase.failure]} Type the rate from the <BoiLink>Bank of Israel website</BoiLink>, or{' '}
        <button type="button" className={styles.textButton} onClick={retry}>
          try again
        </button>
        .
      </>
    )
  } else if (lookup) {
    rateHint = `From the Bank of Israel, the rate of ${weekday(lookup.observation.iso)}, ${formatDots(lookup.observation.iso)}.`
  } else if (phase.kind === 'ready') {
    rateHint = `The Bank of Israel has no ${code} rate up to this date. Type a rate.`
  } else {
    rateHint = 'The rate loads from the Bank of Israel once you choose a date.'
  }

  const history = phase.kind === 'ready' && fetchable ? historyFor(series, date) : []
  const shownHistory = showAll ? history : history.slice(0, HISTORY_PREVIEW)

  return (
    <section className={`${ui.tool} ${styles.fx}`} aria-label="Currency conversion at the representative rate">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()} noValidate>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>Conversion direction</legend>
            <div className={styles.choices}>
              {directionOptions.map((option) => (
                <label key={option.value} className={styles.choice}>
                  <input
                    type="radio"
                    name={radioName}
                    value={option.value}
                    checked={direction === option.value}
                    onChange={() => {
                      touch()
                      setDirection(option.value)
                    }}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>Currency and date</legend>
            <div className={styles.fields}>
              <div className={ui.field}>
                <label htmlFor={currencyId} className={ui.label}>
                  Currency
                </label>
                <select
                  id={currencyId}
                  className={`${ui.input} ${styles.select}`}
                  value={code}
                  onChange={(event) => selectCurrency(event.target.value)}
                >
                  {currencies.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.code} · {currencyNamesEn[item.code]}
                      {item.unit > 1 ? ` (${item.unit} units)` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className={ui.field}>
                <label htmlFor={dateId} className={ui.label}>
                  Invoice date
                </label>
                <input
                  id={dateId}
                  type="date"
                  className={`${ui.input} ${styles.dateInput}`}
                  min={MIN_DATE}
                  max={today?.iso}
                  value={date}
                  aria-invalid={dateProblem ? true : undefined}
                  aria-describedby={dateProblem ? `${dateId}-error` : undefined}
                  onChange={(event) => selectDate(event.target.value)}
                />
                {dateProblem ? (
                  <p id={`${dateId}-error`} className={styles.error}>
                    {dateProblem}
                  </p>
                ) : null}
              </div>
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>Amount and rate</legend>
            <div className={styles.fields}>
              <div className={ui.field}>
                <label htmlFor={amountId} className={ui.label}>
                  {amountLabel}
                </label>
                <input
                  id={amountId}
                  className={`${ui.input} ${ui.ltr} ${styles.number}`}
                  inputMode="decimal"
                  autoComplete="off"
                  spellCheck={false}
                  enterKeyHint="done"
                  maxLength={20}
                  value={amount}
                  aria-invalid={amountProblem ? true : undefined}
                  aria-describedby={`${amountId}-hint${amountProblem ? ` ${amountId}-error` : ''}`}
                  onChange={(event) => {
                    touch()
                    setAmount(event.target.value)
                  }}
                />
                <p id={`${amountId}-hint`} className={ui.hint}>
                  {withVat ? 'Before VAT.' : 'The amount on the invoice.'}
                </p>
                {amountProblem ? (
                  <p id={`${amountId}-error`} className={styles.error}>
                    {amountProblem}
                  </p>
                ) : null}
              </div>
              <div className={ui.field}>
                <label htmlFor={rateId} className={ui.label}>
                  Representative rate, ₪ per {unitText(unit, code)}
                </label>
                <input
                  id={rateId}
                  className={`${ui.input} ${ui.ltr} ${styles.number}`}
                  inputMode="decimal"
                  autoComplete="off"
                  spellCheck={false}
                  enterKeyHint="done"
                  maxLength={14}
                  value={rateValue}
                  aria-invalid={rateProblem ? true : undefined}
                  aria-describedby={`${rateId}-hint${rateProblem ? ` ${rateId}-error` : ''}`}
                  onChange={(event) => {
                    touch()
                    setManualRate(event.target.value)
                  }}
                />
                <p id={`${rateId}-hint`} className={ui.hint}>
                  {rateHint}
                </p>
                {rateProblem ? (
                  <p id={`${rateId}-error`} className={styles.error}>
                    {rateProblem}
                  </p>
                ) : null}
              </div>
            </div>
            <label className={`${ui.option} ${styles.vat}`}>
              <input
                type="checkbox"
                className={ui.checkbox}
                checked={withVat}
                onChange={(event) => {
                  touch()
                  setWithVat(event.target.checked)
                }}
              />
              <span>
                Add {STANDARD_VAT_RATE}% VAT
                <span className={styles.optionNote}>
                  A service to a client abroad can be zero-rated.{' '}
                  <a href="#vat" className={styles.inlineLink}>
                    When
                  </a>
                </span>
              </span>
            </label>
          </fieldset>
        </form>

        <div className={`${ui.output} ${styles.outputPane}`}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>Result</h2>
            <div className={styles.card} aria-busy={phase.kind === 'loading'}>
              {outcome.kind === 'message' ? (
                <p className={styles.message}>{outcome.message}</p>
              ) : (
                <ResultBody outcome={outcome} />
              )}
            </div>
            {outcome.kind === 'result' ? (
              <div className={styles.lineBox}>
                <p className={styles.lineLabel}>Line for the invoice</p>
                <p className={styles.line}>{line}</p>
                <div className={ui.actions}>
                  <button
                    type="button"
                    className={`${ui.primary} ${styles.grow}`}
                    onClick={() => copy(line, 'Line copied', 'line')}
                  >
                    <Copy aria-hidden="true" />
                    Copy the line
                  </button>
                  <button
                    type="button"
                    className={`${ui.secondary} ${styles.grow}`}
                    onClick={() => copy(conversionText(outcome.conversion, outcome.rateIso), 'Calculation copied', 'full')}
                  >
                    <Copy aria-hidden="true" />
                    Copy the calculation
                  </button>
                </div>
              </div>
            ) : null}
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>
            <p className={ui.note}>
              Rates come from the Bank of Israel rates database and refresh hourly. The amounts you type are not sent
              anywhere.
            </p>
          </div>
        </div>

        <div className={styles.history}>
          <h2 id={historyHeadingId} className={styles.historyTitle}>
            {code} representative rate over the last 30 trading days
          </h2>
          {history.length ? (
            <>
              <div className={styles.tableWrap}>
                <table className={styles.table} aria-labelledby={historyHeadingId}>
                  <thead>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Rate, ₪ per {unitText(history[0].observation.unit, code)}</th>
                      <th scope="col">Change from previous day</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shownHistory.map(({ observation, change }) => {
                      const used = outcome.kind === 'result' && !outcome.manual && observation.iso === outcome.rateIso
                      return (
                        <tr key={observation.iso} className={used ? styles.usedRow : undefined}>
                          <th scope="row">
                            <span className={styles.rowDate}>{formatDots(observation.iso)}</span>
                            <span className={styles.rowDay}>{weekday(observation.iso)}</span>
                            {used ? <span className={styles.usedBadge}>Used</span> : null}
                          </th>
                          <td className={styles.rateCell}>{enRate(observation.micros)}</td>
                          <td
                            className={
                              change === null ? undefined : change > 0 ? styles.up : change < 0 ? styles.down : undefined
                            }
                          >
                            {change === null ? '' : formatChange(change)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {history.length > HISTORY_PREVIEW ? (
                <button
                  type="button"
                  className={`${ui.secondary} ${styles.more}`}
                  aria-expanded={showAll}
                  onClick={() => setShowAll((current) => !current)}
                >
                  {showAll ? 'Show the last 10 days' : `Show all ${history.length} days`}
                </button>
              ) : null}
            </>
          ) : (
            <p className={styles.historyNote}>
              {phase.kind === 'failed' ? (
                <>
                  The table is built from Bank of Israel data, which did not load.{' '}
                  <button type="button" className={styles.textButton} onClick={retry}>
                    <RotateCcw aria-hidden="true" className={styles.textButtonIcon} />
                    Try again
                  </button>{' '}
                  You can also see the rates in the{' '}
                  <a href={BOI_SERIES_BROWSER} target="_blank" rel="noopener" className={styles.inlineLink}>
                    Bank of Israel series database
                    <ExternalLink aria-hidden="true" className={styles.linkIcon} />
                  </a>
                  .
                </>
              ) : phase.kind === 'ready' ? (
                `The Bank of Israel has no ${code} rates up to the date you chose.`
              ) : (
                'Loading rates from the Bank of Israel…'
              )}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

function ResultBody({ outcome }: { outcome: Extract<Outcome, { kind: 'result' }> }) {
  const { conversion } = outcome
  const { foreign, shekels, code, micros, unit, withVat, direction } = conversion
  const toShekels = direction === 'to-ils'
  const main = toShekels
    ? enShekels(withVat ? shekels.gross : shekels.net)
    : enForeign(withVat ? foreign.gross : foreign.net, code)
  const from = toShekels ? enForeign(foreign.net, code) : enShekels(shekels.net)

  return (
    <>
      <p className={styles.sentence}>
        <strong className={styles.answer}>{main}</strong>
        <span>
          {from} at ₪{enRate(micros)} per {unitText(unit, code)}
          {withVat ? `, including ${STANDARD_VAT_RATE}% VAT` : ''}
        </span>
      </p>
      {outcome.notice ? <p className={styles.insight}>{outcome.notice}</p> : null}
      {withVat ? (
        <dl className={styles.details}>
          <div className={styles.detail}>
            <dt>Before VAT</dt>
            <dd>{enShekels(shekels.net)}</dd>
          </div>
          <div className={styles.detail}>
            <dt>VAT {STANDARD_VAT_RATE}%</dt>
            <dd>{enShekels(shekels.vat)}</dd>
          </div>
          <div className={styles.detail}>
            <dt>Total including VAT</dt>
            <dd>{enShekels(shekels.gross)}</dd>
          </div>
          <div className={styles.detail}>
            <dt>Total in {code}</dt>
            <dd>{enForeign(foreign.gross, code)}</dd>
          </div>
        </dl>
      ) : null}
    </>
  )
}
