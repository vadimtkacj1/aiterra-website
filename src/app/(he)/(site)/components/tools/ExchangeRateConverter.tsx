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
  conversionText,
  currencies,
  currencyOf,
  directionOptions,
  failureText,
  fallbackNotice,
  fetchRates,
  formatChange,
  formatDots,
  formatForeign,
  formatRate,
  formatShekels,
  historyFor,
  invoiceLine,
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
  weekdayNameOfIso,
  type Conversion,
  type CurrencyCode,
  type Direction,
  type IsraelNow,
  type RateSeries,
  type RatesFailure,
} from '@/lib/exchange-rate'
import { STANDARD_VAT_RATE } from '@/lib/vat-calculator'
import ui from './toolUi.module.css'
import styles from './ExchangeRateConverter.module.css'

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

const amountError = (value: string) => {
  const parsed = parseForeignAmount(value)
  if (parsed.ok || parsed.reason === 'empty') return ''
  if (parsed.reason === 'too-large') return 'הסכום גדול מדי. אפשר עד 100 מיליון.'
  return 'הקלידו סכום בספרות, למשל 2500 או 2,500.50.'
}

const rateError = (value: string | null) => {
  if (value === null) return ''
  const parsed = parseRateInput(value)
  if (parsed.ok || parsed.reason === 'empty') return ''
  if (parsed.reason === 'zero') return 'השער צריך להיות גדול מאפס.'
  return 'הקלידו שער בספרות, למשל 3.107.'
}

const dateError = (value: string, today: IsraelNow | null) => {
  if (!value) return ''
  if (!isValidIso(value)) return 'התאריך לא תקין. בחרו יום, חודש ושנה.'
  if (value < MIN_DATE) return `אפשר לבחור תאריך מ-${formatDots(MIN_DATE)} והלאה.`
  if (today && value > today.iso) return 'בנק ישראל מפרסם שער רק לימים שכבר הגיעו. בחרו את היום או תאריך מוקדם יותר.'
  return ''
}

const BoiLink = ({ children }: { children: ReactNode }) => (
  <a href={BOI_RATES_PAGE} target="_blank" rel="noopener" className={styles.inlineLink}>
    {children}
  </a>
)

export default function ExchangeRateConverter() {
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
      return {
        kind: 'message',
        message: 'בחרו מטבע ותאריך והקלידו סכום.',
        spoken: 'בחרו מטבע ותאריך והקלידו סכום.',
      }
    }
    if (dateProblem || !parsedAmount.ok) {
      const text = 'כדי לראות את התוצאה, תקנו את השדה שמתחתיו הודעת שגיאה.'
      return { kind: 'message', message: text, spoken: text }
    }
    const typed = manualRate !== null ? parseRateInput(manualRate) : null
    if (typed && !typed.ok) {
      const text =
        typed.reason === 'empty' ? 'הקלידו את השער היציג כדי לחשב.' : 'כדי לראות את התוצאה, תקנו את השער.'
      return { kind: 'message', message: text, spoken: text }
    }
    const micros = typed?.ok ? typed.micros : lookup?.observation.micros
    if (!micros) {
      if (phase.kind === 'loading' || phase.kind === 'idle') {
        return { kind: 'message', message: 'טוען את השער מבנק ישראל…', spoken: 'טוען את השער מבנק ישראל' }
      }
      const text = `הקלידו את השער היציג של ${code} מ-${formatDots(date)} כדי לחשב. את השער מוצאים באתר בנק ישראל.`
      return {
        kind: 'message',
        spoken: text,
        message: (
          <>
            הקלידו בשדה ״השער היציג״ את השער של {code} מ-{formatDots(date)}. את השער מוצאים ב
            <BoiLink>אתר בנק ישראל</BoiLink>.
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
      ? invoiceLine(outcome.conversion.micros, outcome.conversion.unit, outcome.conversion.code, outcome.rateIso)
      : ''
  const spoken =
    outcome.kind === 'result'
      ? `${
          outcome.conversion.direction === 'to-ils'
            ? formatShekels(withVat ? outcome.conversion.shekels.gross : outcome.conversion.shekels.net)
            : formatForeign(withVat ? outcome.conversion.foreign.gross : outcome.conversion.foreign.net, code)
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
      window.gtag?.('event', 'exchange_rate_copy', { kind, currency: code, direction, vat: withVat })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הטקסט והעתיקו ידנית.')
    }
  }

  const amountLabel = direction === 'to-ils' ? `סכום ב-${code}` : 'סכום בשקלים'
  const amountProblem = amountError(amount)
  const rateProblem = rateError(manualRate)

  let rateHint: ReactNode
  if (manualRate !== null) {
    rateHint = (
      <>
        שער שהקלדתם.{' '}
        {lookup ? (
          <button type="button" className={styles.textButton} onClick={() => setManualRate(null)}>
            חזרה לשער של בנק ישראל
          </button>
        ) : null}
      </>
    )
  } else if (phase.kind === 'loading' || (phase.kind === 'idle' && fetchable)) {
    rateHint = phase.kind === 'loading' && phase.slow ? 'בנק ישראל עונה לאט. ממתינים עד 15 שניות.' : 'טוען מבנק ישראל…'
  } else if (phase.kind === 'failed') {
    rateHint = (
      <>
        {failureText[phase.failure]} הקלידו את השער מ<BoiLink>אתר בנק ישראל</BoiLink>, או{' '}
        <button type="button" className={styles.textButton} onClick={retry}>
          נסו שוב
        </button>
        .
      </>
    )
  } else if (lookup) {
    rateHint = `מבנק ישראל, השער מ${weekdayNameOfIso(lookup.observation.iso)}, ${formatDots(lookup.observation.iso)}.`
  } else if (phase.kind === 'ready') {
    rateHint = `אין בבנק ישראל שער ל-${code} עד התאריך הזה. הקלידו שער.`
  } else {
    rateHint = 'השער נטען מבנק ישראל אחרי שבוחרים תאריך.'
  }

  const history = phase.kind === 'ready' && fetchable ? historyFor(series, date) : []
  const shownHistory = showAll ? history : history.slice(0, HISTORY_PREVIEW)

  return (
    <section className={`${ui.tool} ${styles.fx}`} aria-label="המרת מטבע לפי שער יציג">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()} noValidate>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>כיוון ההמרה</legend>
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
            <legend className={ui.legend}>מטבע ותאריך</legend>
            <div className={styles.fields}>
              <div className={ui.field}>
                <label htmlFor={currencyId} className={ui.label}>
                  מטבע
                </label>
                <select
                  id={currencyId}
                  className={`${ui.input} ${styles.select}`}
                  value={code}
                  onChange={(event) => selectCurrency(event.target.value)}
                >
                  {currencies.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.code} · {item.name}
                      {item.unit > 1 ? ` (${item.unit} יחידות)` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className={ui.field}>
                <label htmlFor={dateId} className={ui.label}>
                  תאריך החשבונית
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
            <legend className={ui.legend}>סכום ושער</legend>
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
                  {withVat ? 'לפני מע״מ.' : 'הסכום שעל החשבונית.'}
                </p>
                {amountProblem ? (
                  <p id={`${amountId}-error`} className={styles.error}>
                    {amountProblem}
                  </p>
                ) : null}
              </div>
              <div className={ui.field}>
                <label htmlFor={rateId} className={ui.label}>
                  השער היציג, ₪ ל-{unitText(unit, code)}
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
                להוסיף מע״מ {STANDARD_VAT_RATE}%
                <span className={styles.optionNote}>
                  שירות ללקוח בחו״ל יכול להיות במע״מ אפס.{' '}
                  <a href="#vat" className={styles.inlineLink}>
                    מתי
                  </a>
                </span>
              </span>
            </label>
          </fieldset>
        </form>

        <div className={`${ui.output} ${styles.outputPane}`}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התוצאה</h2>
            <div className={styles.card} aria-busy={phase.kind === 'loading'}>
              {outcome.kind === 'message' ? (
                <p className={styles.message}>{outcome.message}</p>
              ) : (
                <ResultBody outcome={outcome} />
              )}
            </div>
            {outcome.kind === 'result' ? (
              <div className={styles.lineBox}>
                <p className={styles.lineLabel}>שורה לחשבונית</p>
                <p className={styles.line}>{line}</p>
                <div className={ui.actions}>
                  <button
                    type="button"
                    className={`${ui.primary} ${styles.grow}`}
                    onClick={() => copy(line, 'השורה הועתקה', 'line')}
                  >
                    <Copy aria-hidden="true" />
                    העתקת השורה
                  </button>
                  <button
                    type="button"
                    className={`${ui.secondary} ${styles.grow}`}
                    onClick={() => copy(conversionText(outcome.conversion, outcome.rateIso), 'החישוב הועתק', 'full')}
                  >
                    <Copy aria-hidden="true" />
                    העתקת החישוב
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
              השער נלקח ממאגר השערים של בנק ישראל ומתעדכן פעם בשעה. הסכומים שהקלדתם לא נשלחים לשום מקום.
            </p>
          </div>
        </div>

        <div className={styles.history}>
          <h2 id={historyHeadingId} className={styles.historyTitle}>
            השער היציג של {code} ב-30 ימי המסחר האחרונים
          </h2>
          {history.length ? (
            <>
              <div className={styles.tableWrap}>
                <table className={styles.table} aria-labelledby={historyHeadingId}>
                  <thead>
                    <tr>
                      <th scope="col">תאריך</th>
                      <th scope="col">שער, ₪ ל-{unitText(history[0].observation.unit, code)}</th>
                      <th scope="col">שינוי מהיום הקודם</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shownHistory.map(({ observation, change }) => {
                      const used =
                        outcome.kind === 'result' && !outcome.manual && observation.iso === outcome.rateIso
                      return (
                        <tr key={observation.iso} className={used ? styles.usedRow : undefined}>
                          <th scope="row">
                            <span className={styles.rowDate}>{formatDots(observation.iso)}</span>
                            <span className={styles.rowDay}>{weekdayNameOfIso(observation.iso)}</span>
                            {used ? <span className={styles.usedBadge}>בחישוב</span> : null}
                          </th>
                          <td className={styles.rateCell}>{formatRate(observation.micros)}</td>
                          <td
                            className={
                              change === null ? undefined : change > 0 ? styles.up : change < 0 ? styles.down : undefined
                            }
                          >
                            <span dir="ltr">{change === null ? '' : formatChange(change)}</span>
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
                  {showAll ? 'הצגת 10 הימים האחרונים' : `הצגת כל ${history.length} הימים`}
                </button>
              ) : null}
            </>
          ) : (
            <p className={styles.historyNote}>
              {phase.kind === 'failed' ? (
                <>
                  הטבלה נבנית מנתוני בנק ישראל, והם לא נטענו.{' '}
                  <button type="button" className={styles.textButton} onClick={retry}>
                    <RotateCcw aria-hidden="true" className={styles.textButtonIcon} />
                    ניסיון נוסף
                  </button>{' '}
                  אפשר לראות את השערים גם ב
                  <a href={BOI_SERIES_BROWSER} target="_blank" rel="noopener" className={styles.inlineLink}>
                    מאגר הסדרות של בנק ישראל
                    <ExternalLink aria-hidden="true" className={styles.linkIcon} />
                  </a>
                  .
                </>
              ) : phase.kind === 'ready' ? (
                `אין בבנק ישראל שערים של ${code} עד התאריך שבחרתם.`
              ) : (
                'טוען את השערים מבנק ישראל…'
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
    ? formatShekels(withVat ? shekels.gross : shekels.net)
    : formatForeign(withVat ? foreign.gross : foreign.net, code)
  const from = toShekels ? formatForeign(foreign.net, code) : formatShekels(shekels.net)

  return (
    <>
      <p className={styles.sentence}>
        <strong className={styles.answer}>{main}</strong>
        <span>
          {from} לפי {formatRate(micros)} ₪ ל-{unitText(unit, code)}
          {withVat ? `, כולל מע״מ ${STANDARD_VAT_RATE}%` : ''}
        </span>
      </p>
      {outcome.notice ? <p className={styles.insight}>{outcome.notice}</p> : null}
      {withVat ? (
        <dl className={styles.details}>
          <div className={styles.detail}>
            <dt>לפני מע״מ</dt>
            <dd>{formatShekels(shekels.net)}</dd>
          </div>
          <div className={styles.detail}>
            <dt>מע״מ {STANDARD_VAT_RATE}%</dt>
            <dd>{formatShekels(shekels.vat)}</dd>
          </div>
          <div className={styles.detail}>
            <dt>סה״כ כולל מע״מ</dt>
            <dd>{formatShekels(shekels.gross)}</dd>
          </div>
          <div className={styles.detail}>
            <dt>סה״כ ב-{code}</dt>
            <dd>{formatForeign(foreign.gross, code)}</dd>
          </div>
        </dl>
      ) : null}
    </>
  )
}
