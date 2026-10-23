'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { Copy, RotateCcw } from 'lucide-react'
import {
  DATA_AS_OF_KEY,
  FIRST_KEY,
  REQUEST_TIMEOUT_MS,
  TIMEOUT_REASON,
  announcementFor,
  calculate,
  calculatorKey,
  changeText,
  embeddedData,
  fetchLive,
  fieldErrors,
  firstKnownDay,
  formatCoefficient,
  formatIndex,
  formatMoney,
  formatMonth,
  formatShortDay,
  isoOfDay,
  keyMonth,
  keyYear,
  mergeLive,
  monthKey,
  monthNames,
  parseIsoDay,
  publicationDay,
  rentMessage,
  resultToText,
  type CpiData,
  type CpiInput,
  type CpiOutcome,
  type CpiResult,
  type IndexUse,
  type LiveStatus,
  type Method,
  type Purpose,
} from '@/lib/cpi-indexation'
import { todayIso } from '@/lib/work-days'
import ui from './toolUi.module.css'
import styles from './CpiIndexationCalculator.module.css'

const ANNOUNCE_DELAY_MS = 900

type FormState = {
  purpose: Purpose
  amount: string
  method: Method
  fromDate: string
  toDate: string | null
  fromMonth: string
  fromYear: string
  toMonth: string | null
  toYear: string | null
}

const initialForm: FormState = {
  purpose: 'rent',
  amount: '',
  method: 'known',
  fromDate: '',
  toDate: null,
  fromMonth: '',
  fromYear: '',
  toMonth: null,
  toYear: null,
}

const purposeOptions: { value: Purpose; label: string }[] = [
  { value: 'rent', label: 'שכר דירה' },
  { value: 'amount', label: 'סכום אחר' },
]

const methodOptions: { value: Method; label: string; hint: string }[] = [
  { value: 'known', label: 'מדד ידוע', hint: 'המדד האחרון שפורסם לפני התאריך' },
  { value: 'month', label: 'מדד של חודש מסוים', hint: 'מדד בגין: בוחרים את חודש המדד' },
]

const subscribeNever = () => () => {}

function useTodayIso() {
  return useSyncExternalStore(subscribeNever, todayIso, () => '')
}

function ChoiceGroup<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
}: {
  legend: string
  name: string
  value: T
  options: { value: T; label: string; hint?: string }[]
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
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className={styles.choiceLabel}>{option.label}</span>
            {option.hint ? <span className={styles.choiceHint}>{option.hint}</span> : null}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  children: (props: { describedBy: string | undefined; invalid: true | undefined }) => ReactNode
}) {
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined
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
      {children({ describedBy, invalid: error ? true : undefined })}
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

function MonthPicker({
  id,
  legend,
  hint,
  month,
  year,
  years,
  onChange,
}: {
  id: string
  legend: string
  hint?: string
  month: string
  year: string
  years: number[]
  onChange: (patch: { month?: string; year?: string }) => void
}) {
  const hintId = `${id}-hint`
  return (
    <fieldset className={`${ui.group} ${styles.subGroup}`} aria-describedby={hint ? hintId : undefined}>
      <legend className={ui.legend}>{legend}</legend>
      {hint ? (
        <p id={hintId} className={ui.hint}>
          {hint}
        </p>
      ) : null}
      <div className={styles.monthRow}>
        <div className={ui.field}>
          <label htmlFor={`${id}-month`} className={ui.label}>
            חודש
          </label>
          <select
            id={`${id}-month`}
            className={`${ui.input} ${styles.select}`}
            value={month}
            onChange={(event) => onChange({ month: event.target.value })}
          >
            <option value="">בחרו</option>
            {monthNames.map((name, index) => (
              <option key={name} value={String(index + 1)}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className={ui.field}>
          <label htmlFor={`${id}-year`} className={ui.label}>
            שנה
          </label>
          <select
            id={`${id}-year`}
            className={`${ui.input} ${styles.select}`}
            value={year}
            onChange={(event) => onChange({ year: event.target.value })}
          >
            <option value="">בחרו</option>
            {years.map((item) => (
              <option key={item} value={String(item)}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
    </fieldset>
  )
}

function IndexFact({ title, use }: { title: string; use: IndexUse }) {
  return (
    <div className={styles.fact}>
      <dt>{title}</dt>
      <dd>
        <span className={styles.factMain}>מדד {formatMonth(use.key)}</span>
        <span className={styles.factLine}>
          {formatIndex(use.point.value)} נקודות, בסיס {use.point.base}
        </span>
        <span className={styles.factLine}>
          {use.date !== null ? `המדד הידוע ב-${formatShortDay(use.date)}. ` : ''}פורסם ב-{formatShortDay(use.published)}
        </span>
      </dd>
    </div>
  )
}

function calculatorNote(result: CpiResult) {
  const sides = [result.from, result.to].filter(
    (use) => use.date !== null && calculatorKey(use.date) !== use.key,
  )
  if (!sides.length) return null
  const parts = sides.map(
    (use) => `מדד ${formatMonth(use.key)} פורסם ב-${formatShortDay(use.published)}, לפני ה-15 בחודש`,
  )
  return `${parts.join(', ו')}, כי ה-15 חל בשבת או בחג. המחשבון באתר הלמ״ס מניח פרסום ב-15 בחודש ולכן ישתמש לתאריך הזה במדד הקודם. כאן החישוב לפי המדד שכבר פורסם באותו יום.`
}

function ResultCard({ outcome }: { outcome: CpiOutcome }) {
  if (outcome.kind !== 'result') {
    return (
      <div className={`${styles.card} ${outcome.kind === 'offline' ? styles.problem : ''}`}>
        <p className={styles.message}>{outcome.message}</p>
      </div>
    )
  }
  const rent = outcome.purpose === 'rent'
  const difference = outcome.indexed - outcome.amount
  const differenceText =
    Math.abs(difference) < 0.005
      ? ''
      : `, ${difference > 0 ? 'תוספת' : 'הפחתה'} של ${formatMoney(Math.abs(difference))}${rent ? ' לחודש' : ''}`
  const note = calculatorNote(outcome)
  return (
    <div className={styles.card}>
      <p className={styles.kicker}>{rent ? 'שכר הדירה המעודכן לחודש' : 'הסכום אחרי הצמדה'}</p>
      <p className={styles.answer}>{formatMoney(outcome.indexed)}</p>
      <p className={styles.change}>
        המדד {changeText(outcome.changePercent)}
        {differenceText}
      </p>
      <dl className={styles.facts}>
        <IndexFact title="מדד הבסיס" use={outcome.from} />
        <IndexFact title={rent && outcome.method === 'known' ? 'המדד ליום התשלום' : 'מדד היעד'} use={outcome.to} />
      </dl>
      {outcome.falling ? (
        <div className={styles.floor}>
          <p className={styles.floorTitle}>המדד ירד. יש חוזים שקובעים רצפה, כלומר שהסכום לא יורד מתחת לסכום הבסיס.</p>
          <dl className={styles.floorList}>
            <div>
              <dt>בלי רצפה</dt>
              <dd>{formatMoney(outcome.indexed)}</dd>
            </div>
            <div>
              <dt>עם רצפה</dt>
              <dd>{formatMoney(outcome.floored)}</dd>
            </div>
          </dl>
        </div>
      ) : null}
      {outcome.coefficient !== 1 ? (
        <p className={styles.insight}>
          שני המדדים פורסמו בבסיסים שונים. לפני החלוקה, המדד החדש הוכפל במקדם הקשר של הלמ״ס,{' '}
          {formatCoefficient(outcome.coefficient)}, שמעביר אותו לבסיס של מדד הבסיס.
        </p>
      ) : null}
      {note ? <p className={styles.insight}>{note}</p> : null}
    </div>
  )
}

export default function CpiIndexationCalculator() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [data, setData] = useState<CpiData>(() => embeddedData())
  const [live, setLive] = useState<LiveStatus>('loading')
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const controllerRef = useRef<AbortController | null>(null)
  const today = useTodayIso()
  const id = useId()

  const load = useCallback(() => {
    controllerRef.current?.abort('superseded')
    const controller = new AbortController()
    controllerRef.current = controller
    const timer = window.setTimeout(() => controller.abort(TIMEOUT_REASON), REQUEST_TIMEOUT_MS)
    const now = new Date()
    fetchLive(DATA_AS_OF_KEY, monthKey(now.getFullYear(), now.getMonth() + 1), controller.signal).then((result) => {
      window.clearTimeout(timer)
      if (controllerRef.current !== controller) return
      controllerRef.current = null
      if (result.ok) {
        setData((current) => mergeLive(current, result.points, result.links))
        setLive('ready')
      } else if (result.failure !== 'aborted') {
        setLive('failed')
      }
    })
  }, [])

  useEffect(() => {
    load()
    return () => controllerRef.current?.abort('unmount')
  }, [load])

  const retry = () => {
    setLive('loading')
    load()
  }

  const input: CpiInput = {
    purpose: form.purpose,
    amount: form.amount,
    method: form.method,
    fromDate: form.fromDate,
    toDate: form.toDate ?? today,
    fromMonth: form.fromMonth,
    fromYear: form.fromYear,
    toMonth: form.toMonth ?? String(keyMonth(data.latest)),
    toYear: form.toYear ?? String(keyYear(data.latest)),
  }
  const todayDay = today ? parseIsoDay(today) : null
  const errors = fieldErrors(input)
  const outcome = calculate(input, data, live, todayDay)
  const spoken = announcementFor(outcome)
  const lastSpoken = useRef(spoken)
  const years = useMemo(() => {
    const list: number[] = []
    for (let year = keyYear(data.latest) + 1; year >= keyYear(FIRST_KEY); year -= 1) list.push(year)
    return list
  }, [data.latest])
  const minIso = isoOfDay(firstKnownDay())
  const latestPoint = data.points.get(data.latest)

  useEffect(() => {
    if (spoken === lastSpoken.current) return
    const timer = window.setTimeout(() => {
      lastSpoken.current = spoken
      setAnnouncement(spoken)
    }, ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  const update = (patch: Partial<FormState>) => {
    setForm((current) => ({ ...current, ...patch }))
    setStatus('')
  }

  const copy = async (text: string, what: 'message' | 'summary') => {
    try {
      await navigator.clipboard.writeText(text)
      setStatus(what === 'message' ? 'ההודעה הועתקה' : 'הסיכום הועתק')
      window.gtag?.('event', 'cpi_indexation_copy', { what, purpose: form.purpose, method: form.method })
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הטקסט והעתיקו ידנית.')
    }
  }

  const rent = form.purpose === 'rent'
  const result = outcome.kind === 'result' ? outcome : null
  const message = result && result.purpose === 'rent' ? rentMessage(result) : ''

  return (
    <section className={`${ui.tool} ${styles.calc}`} aria-label="חישוב ההצמדה">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()} noValidate>
          <ChoiceGroup
            legend="מה מצמידים"
            name={`${id}-purpose`}
            value={form.purpose}
            options={purposeOptions}
            onChange={(purpose) => update({ purpose })}
          />

          <fieldset className={ui.group}>
            <legend className={ui.legend}>{rent ? 'שכר הדירה' : 'הסכום'}</legend>
            <Field
              id={`${id}-amount`}
              label={rent ? 'שכר הדירה החודשי לפי החוזה, בשקלים' : 'הסכום להצמדה, בשקלים'}
              hint={rent ? 'הסכום שכתוב בחוזה, לפני הצמדה.' : 'למשל חוב, הלוואה, פיצוי או מחיר בחוזה.'}
              error={errors.amount}
            >
              {({ describedBy, invalid }) => (
                <input
                  id={`${id}-amount`}
                  className={`${ui.input} ${ui.ltr} ${styles.amount}`}
                  inputMode="decimal"
                  autoComplete="off"
                  enterKeyHint="next"
                  spellCheck={false}
                  maxLength={18}
                  value={form.amount}
                  aria-invalid={invalid}
                  aria-describedby={describedBy}
                  onChange={(event) => update({ amount: event.target.value })}
                />
              )}
            </Field>
          </fieldset>

          <ChoiceGroup
            legend="לפי איזה מדד מחשבים"
            name={`${id}-method`}
            value={form.method}
            options={methodOptions}
            onChange={(method) => update({ method })}
          />

          {form.method === 'known' ? (
            <fieldset className={ui.group}>
              <legend className={ui.legend}>תאריכים</legend>
              <div className={styles.dateRow}>
                <Field
                  id={`${id}-from`}
                  label={rent ? 'תאריך הבסיס בחוזה' : 'תאריך הבסיס'}
                  hint={rent ? 'בדרך כלל יום החתימה על החוזה.' : 'היום שממנו הסכום צמוד.'}
                  error={errors.fromDate}
                >
                  {({ describedBy, invalid }) => (
                    <input
                      id={`${id}-from`}
                      type="date"
                      className={`${ui.input} ${styles.date}`}
                      min={minIso}
                      max="2099-12-31"
                      value={form.fromDate}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                      onChange={(event) => update({ fromDate: event.target.value })}
                    />
                  )}
                </Field>
                <Field
                  id={`${id}-to`}
                  label={rent ? 'תאריך התשלום' : 'תאריך העדכון'}
                  hint="ברירת המחדל היא היום."
                  error={errors.toDate}
                >
                  {({ describedBy, invalid }) => (
                    <input
                      id={`${id}-to`}
                      type="date"
                      className={`${ui.input} ${styles.date}`}
                      min={minIso}
                      max="2099-12-31"
                      value={input.toDate}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                      onChange={(event) => update({ toDate: event.target.value })}
                    />
                  )}
                </Field>
              </div>
              {errors.order ? <p className={styles.error}>{errors.order}</p> : null}
            </fieldset>
          ) : (
            <fieldset className={ui.group}>
              <legend className={ui.legend}>חודשי המדד</legend>
              <MonthPicker
                id={`${id}-from-month`}
                legend="חודש מדד הבסיס"
                hint="החודש שהחוזה קובע כמדד הבסיס."
                month={form.fromMonth}
                year={form.fromYear}
                years={years}
                onChange={(patch) =>
                  update({
                    ...(patch.month !== undefined ? { fromMonth: patch.month } : {}),
                    ...(patch.year !== undefined ? { fromYear: patch.year } : {}),
                  })
                }
              />
              <MonthPicker
                id={`${id}-to-month`}
                legend="חודש מדד היעד"
                hint="ברירת המחדל היא המדד האחרון שפורסם."
                month={input.toMonth}
                year={input.toYear}
                years={years}
                onChange={(patch) =>
                  update({
                    toMonth: patch.month !== undefined ? patch.month : input.toMonth,
                    toYear: patch.year !== undefined ? patch.year : input.toYear,
                  })
                }
              />
              {errors.order ? <p className={styles.error}>{errors.order}</p> : null}
            </fieldset>
          )}
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>התוצאה</h2>
            <div aria-busy={outcome.kind === 'loading'}>
              <ResultCard outcome={outcome} />
            </div>

            {message ? (
              <div className={styles.paste}>
                <h3 className={styles.pasteTitle}>הודעה לשוכר או למשכיר</h3>
                <p className={styles.pasteText}>{message}</p>
              </div>
            ) : null}

            {result ? (
              <div className={ui.actions}>
                {message ? (
                  <button
                    type="button"
                    className={`${ui.primary} ${styles.grow}`}
                    onClick={() => copy(message, 'message')}
                  >
                    <Copy aria-hidden="true" />
                    העתקת ההודעה
                  </button>
                ) : null}
                <button
                  type="button"
                  className={`${message ? ui.secondary : ui.primary} ${styles.grow}`}
                  onClick={() => copy(resultToText(result), 'summary')}
                >
                  <Copy aria-hidden="true" />
                  העתקת הסיכום
                </button>
              </div>
            ) : null}
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>

            <div className={styles.dataLine}>
              {latestPoint ? (
                <p>
                  המדד האחרון שפורסם: {formatMonth(data.latest)}, {formatIndex(latestPoint.value)} נקודות (בסיס{' '}
                  {latestPoint.base}), פורסם ב-{formatShortDay(publicationDay(data.latest))}.
                </p>
              ) : null}
              {live === 'loading' ? <p>בודקים בלמ״ס אם פורסם מדד חדש יותר.</p> : null}
              {live === 'failed' ? (
                <div className={styles.offline}>
                  <p>
                    לא הצלחנו להתחבר ל-API של הלמ״ס, ולכן לא בדקנו אם יש מדד חדש מ{formatMonth(DATA_AS_OF_KEY)}. המדדים
                    עד {formatMonth(DATA_AS_OF_KEY)} שמורים בכלי והחישוב איתם עובד.
                  </p>
                  <button type="button" className={ui.secondary} onClick={retry}>
                    <RotateCcw aria-hidden="true" />
                    ניסיון נוסף
                  </button>
                </div>
              ) : null}
            </div>
            <p className={ui.note}>
              מדד המחירים לצרכן הכללי, לפי ערכי הלמ״ס ושיטת השרשור שלה. החישוב נעשה בדפדפן, והסכומים לא נשלחים לשום
              מקום.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
