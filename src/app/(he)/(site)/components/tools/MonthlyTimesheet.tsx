'use client'

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Download, Printer } from 'lucide-react'
import {
  DAY_LENGTH,
  FIRST_YEAR,
  LAST_YEAR,
  MAX_BREAK_MINUTES,
  blankModel,
  buildModel,
  dayMonth,
  defaultSettings,
  localMonth,
  monthKey,
  monthTitle,
  parseBreakSetting,
  rulesText,
  timesheetCsv,
  timesheetDocument,
  weekOptions,
  type DayStatus,
  type Entries,
  type Entry,
  type SheetDay,
  type SheetModel,
  type SheetSettings,
  type WorkWeek,
} from '@/lib/monthly-timesheet'
import { MONTH_NAMES } from '@/lib/work-days'
import {
  formatClock,
  formatDecimalHours,
  formatDuration,
  parseClock,
  parseHoursSetting,
  type Parsed,
} from '@/lib/work-hours'
import ui from './toolUi.module.css'
import styles from './MonthlyTimesheet.module.css'

type TextKey = 'employee' | 'employeeId' | 'employer' | 'dayLength' | 'shortLength' | 'weekly' | 'breakMinutes'
type TimeField = 'start' | 'end'
type Draft = { settings: SheetSettings; entries: Entries }
type MonthPoint = { year: number; month: number }

const STORAGE_KEY = 'aiterra-monthly-timesheet-v1'
const MAX_SAVED_DAYS = 400
const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const ANNOUNCE_DELAY_MS = 900
const EMPTY_ENTRY: Entry = { start: '', end: '' }

const isText = (value: unknown): value is string => typeof value === 'string'

const textOr = (value: unknown, fallback: string, max = 80) => (isText(value) ? value.slice(0, max) : fallback)

const inRange = (value: unknown, min: number, max: number): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max

const hasTime = (entry: Entry | undefined) => Boolean(entry && (entry.start.trim() || entry.end.trim()))

function readEntries(value: unknown): Entries {
  if (typeof value !== 'object' || value === null) return {}
  const entries: Entries = {}
  for (const [iso, item] of Object.entries(value as Record<string, unknown>).slice(-MAX_SAVED_DAYS)) {
    if (!ISO_PATTERN.test(iso) || typeof item !== 'object' || item === null) continue
    const entry = item as Record<string, unknown>
    entries[iso] = { start: textOr(entry.start, '', 8), end: textOr(entry.end, '', 8) }
  }
  return entries
}

function readDraft(current: MonthPoint): Draft | null {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return null
    const data = JSON.parse(saved) as Record<string, unknown>
    const stored = (data.settings ?? {}) as Record<string, unknown>
    const base = defaultSettings(current.year, current.month)
    const entries = readEntries(data.entries)
    const year = inRange(stored.year, FIRST_YEAR, LAST_YEAR) ? stored.year : base.year
    const month = inRange(stored.month, 1, 12) ? stored.month : base.month
    const prefix = `${monthKey(year, month)}-`
    const keepMonth = Object.entries(entries).some(([iso, entry]) => iso.startsWith(prefix) && hasTime(entry))
    return {
      settings: {
        year: keepMonth ? year : base.year,
        month: keepMonth ? month : base.month,
        employee: textOr(stored.employee, ''),
        employeeId: textOr(stored.employeeId, '', 12),
        employer: textOr(stored.employer, ''),
        week: stored.week === 'sun-fri' ? 'sun-fri' : 'sun-thu',
        dayLength: textOr(stored.dayLength, base.dayLength, 8),
        shortLength: textOr(stored.shortLength, base.shortLength, 8),
        weekly: textOr(stored.weekly, base.weekly, 8),
        breakMinutes: textOr(stored.breakMinutes, base.breakMinutes, 8),
      },
      entries,
    }
  } catch {
    return null
  }
}

function writeDraft(draft: Draft) {
  try {
    const entries = Object.fromEntries(
      Object.entries(draft.entries)
        .filter(([, entry]) => hasTime(entry))
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-MAX_SAVED_DAYS),
    )
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ settings: draft.settings, entries }))
    return true
  } catch {
    return false
  }
}

const hoursError = (parsed: Parsed, max: number) => {
  if (parsed.ok) return ''
  if (parsed.reason === 'empty') return 'הקלידו מספר שעות.'
  if (parsed.reason === 'out-of-range') return `הקלידו מספר גדול מ-0 ועד ${max}.`
  return 'הקלידו מספר, למשל 8 או 8.6.'
}

const breakError = (input: string) => {
  const parsed = parseBreakSetting(input)
  if (parsed.ok) return ''
  if (parsed.reason === 'out-of-range') return `הקלידו מספר דקות בין 0 ל-${MAX_BREAK_MINUTES}.`
  return 'הקלידו מספר דקות, למשל 30.'
}

const normalizeClock = (value: string) => {
  const parsed = parseClock(value)
  return parsed.ok ? formatClock(parsed.value) : value
}

const statusMessage = (status: DayStatus | undefined) => {
  if (!status) return null
  if (status.status === 'incomplete') {
    return { error: false, text: status.missing === 'end' ? 'חסרה יציאה' : 'חסרה כניסה' }
  }
  if (status.status !== 'error') return null
  if (status.error === 'invalid-start') return { error: true, text: 'כניסה לא תקינה' }
  if (status.error === 'invalid-end') return { error: true, text: 'יציאה לא תקינה' }
  if (status.error === 'same-time') return { error: true, text: 'כניסה ויציאה זהות' }
  return { error: true, text: 'שעה לא תקינה' }
}

const invalidField = (status: DayStatus | undefined): TimeField | null => {
  if (status?.status !== 'error') return null
  return status.error === 'invalid-start' ? 'start' : 'end'
}

const fileSafe = (value: string) => value.trim().replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, '-')

function yearOptions(initial: number, selected: number) {
  const years = new Set<number>([selected])
  for (let year = initial - 2; year <= initial + 1; year += 1) {
    if (year >= FIRST_YEAR && year <= LAST_YEAR) years.add(year)
  }
  return [...years].sort((a, b) => a - b)
}

function Field({
  label,
  hint,
  error,
  className,
  children,
}: {
  label: string
  hint?: string
  error?: string
  className?: string
  children: (id: string, describedBy: string | undefined) => ReactNode
}) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : ''
  const errorId = error ? `${id}-error` : ''
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
  return (
    <div className={`${ui.field} ${className ?? ''}`}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      {hint ? (
        <p id={hintId} className={ui.hint}>
          {hint}
        </p>
      ) : null}
      {children(id, describedBy)}
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

function NumberInput({
  id,
  describedBy,
  value,
  invalid,
  numeric = false,
  onChange,
}: {
  id: string
  describedBy?: string
  value: string
  invalid: boolean
  numeric?: boolean
  onChange: (value: string) => void
}) {
  return (
    <input
      id={id}
      className={`${ui.input} ${ui.ltr} ${styles.number}`}
      inputMode={numeric ? 'numeric' : 'decimal'}
      autoComplete="off"
      spellCheck={false}
      value={value}
      aria-invalid={invalid ? true : undefined}
      aria-describedby={describedBy}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

function DayRow({
  day,
  index,
  month,
  entry,
  status,
  tableId,
  onChange,
  onBlur,
  onKeyDown,
}: {
  day: SheetDay
  index: number
  month: number
  entry: Entry
  status: DayStatus | undefined
  tableId: string
  onChange: (field: TimeField, value: string) => void
  onBlur: (field: TimeField) => void
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
}) {
  const messageId = `${tableId}-msg-${day.date}`
  const dayLabel = `${day.weekdayName} ${dayMonth(day, month)}${day.note ? `, ${day.note}` : ''}`
  const message = statusMessage(status)
  const invalid = invalidField(status)
  const worked = status?.status === 'ok' ? status : null
  const rowClass = day.rest ? styles.rest : day.kind === 'day-off' ? styles.off : undefined
  const overtime = (minutes: number) => (minutes ? formatDuration(minutes) : '')

  return (
    <tr className={rowClass}>
      <th scope="row" className={styles.dayCell}>
        <span className={styles.dayName}>
          {day.weekdayName} {dayMonth(day, month)}
        </span>
        {day.note ? <span className={styles.dayNote}>{day.note}</span> : null}
      </th>
      {(['start', 'end'] as TimeField[]).map((field) => (
        <td key={field} className={styles.timeCell}>
          <label htmlFor={`${tableId}-${field}-${day.date}`} className={styles.visuallyHidden}>
            {field === 'start' ? 'כניסה' : 'יציאה'}, {dayLabel}
          </label>
          <input
            id={`${tableId}-${field}-${day.date}`}
            className={`${ui.input} ${ui.ltr} ${styles.time}`}
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            maxLength={8}
            value={entry[field]}
            aria-invalid={invalid === field ? true : undefined}
            aria-describedby={invalid === field ? messageId : undefined}
            data-row={index}
            data-field={field}
            onChange={(event) => onChange(field, event.target.value)}
            onBlur={() => onBlur(field)}
            onKeyDown={onKeyDown}
          />
        </td>
      ))}
      <td className={styles.hoursCell}>
        {worked ? (
          <span className={styles.hours}>{formatDuration(worked.worked)}</span>
        ) : message ? (
          <span id={messageId} className={message.error ? styles.cellError : styles.cellNote}>
            {message.text}
          </span>
        ) : null}
      </td>
      <td className={styles.otCell}>{worked ? overtime(worked.overtime1) : ''}</td>
      <td className={styles.otCell}>{worked ? overtime(worked.overtime2) : ''}</td>
    </tr>
  )
}

function SummaryRow({ term, value, main = false }: { term: string; value: ReactNode; main?: boolean }) {
  return (
    <div className={main ? `${styles.resultRow} ${styles.main}` : styles.resultRow}>
      <dt className={styles.term}>{term}</dt>
      <dd className={styles.value}>{value}</dd>
    </div>
  )
}

function openPrint(model: SheetModel) {
  const frame = document.createElement('iframe')
  frame.setAttribute('aria-hidden', 'true')
  frame.tabIndex = -1
  Object.assign(frame.style, { position: 'fixed', bottom: '0', width: '0', height: '0', border: '0' })
  frame.onload = () => {
    const view = frame.contentWindow
    if (!view) return
    view.focus()
    view.print()
    window.setTimeout(() => frame.remove(), 1000)
  }
  frame.srcdoc = timesheetDocument(model)
  document.body.appendChild(frame)
}

export default function MonthlyTimesheet({ initialYear, initialMonth }: { initialYear: number; initialMonth: number }) {
  const [draft, setDraft] = useState<Draft>(() => ({
    settings: defaultSettings(initialYear, initialMonth),
    entries: {},
  }))
  const [restored, setRestored] = useState(false)
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const summaryRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLTableElement>(null)
  const weekName = useId()
  const tableId = useId()
  const hintId = useId()

  const { settings, entries } = draft
  const model = useMemo(() => buildModel(settings, entries), [settings, entries])
  const { calendar, result } = model
  const { totals, rules, filled } = result
  const title = monthTitle(settings.year, settings.month)

  const summaryText = filled
    ? `סך הכול ${formatDuration(totals.minutes)} שעות ב-${totals.days} ימים` +
      (rules
        ? `, מהן ${formatDuration(totals.overtime1)} שעות נוספות של 125% ו-${formatDuration(totals.overtime2)} של 150%`
        : '')
    : ''

  useEffect(() => {
    const current = localMonth()
    setDraft(readDraft(current) ?? { settings: defaultSettings(current.year, current.month), entries: {} })
    setRestored(true)
  }, [])

  useEffect(() => {
    if (restored) writeDraft(draft)
  }, [draft, restored])

  useEffect(() => {
    if (!restored) return
    const timer = window.setTimeout(() => setAnnouncement(summaryText), ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [summaryText, restored])

  const setSetting = <K extends keyof SheetSettings>(key: K, value: SheetSettings[K]) =>
    setDraft((current) => ({ ...current, settings: { ...current.settings, [key]: value } }))

  const setText = (key: TextKey) => (value: string) => setSetting(key, value)

  const setWeek = (week: WorkWeek) =>
    setDraft((current) => {
      const previous = current.settings
      const dayLength = previous.dayLength === DAY_LENGTH[previous.week] ? DAY_LENGTH[week] : previous.dayLength
      return { ...current, settings: { ...previous, week, dayLength } }
    })

  const setTime = (iso: string) => (field: TimeField, value: string) =>
    setDraft((current) => ({
      ...current,
      entries: { ...current.entries, [iso]: { ...(current.entries[iso] ?? EMPTY_ENTRY), [field]: value } },
    }))

  const normalizeTime = (iso: string) => (field: TimeField) =>
    setDraft((current) => {
      const entry = current.entries[iso]
      if (!entry) return current
      const value = normalizeClock(entry[field])
      if (value === entry[field]) return current
      return { ...current, entries: { ...current.entries, [iso]: { ...entry, [field]: value } } }
    })

  const moveFocus = (event: KeyboardEvent<HTMLInputElement>) => {
    const step = event.key === 'ArrowDown' || event.key === 'Enter' ? 1 : event.key === 'ArrowUp' ? -1 : 0
    if (!step) return
    const { row, field } = event.currentTarget.dataset
    const target = tableRef.current?.querySelector<HTMLInputElement>(
      `[data-row="${Number(row) + step}"][data-field="${field}"]`,
    )
    if (!target) return
    event.preventDefault()
    target.focus()
    target.select()
  }

  const track = (event: 'timesheet_print' | 'timesheet_csv', blank: boolean) =>
    window.gtag?.('event', event, { blank })

  const print = (blank: boolean) => {
    openPrint(blank ? blankModel(model) : model)
    setStatus('נפתח חלון ההדפסה. כדי לקבל קובץ PDF, בחרו ביעד ״שמירה כ-PDF״.')
    track('timesheet_print', blank || !filled)
  }

  const downloadCsv = () => {
    const url = URL.createObjectURL(new Blob([timesheetCsv(model)], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    const name = fileSafe(settings.employee)
    link.href = url
    link.download = `דוח-שעות-${monthKey(settings.year, settings.month)}${name ? `-${name}` : ''}.csv`
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setStatus('קובץ ה-CSV ירד. אפשר לפתוח אותו ב-Excel או ב-Google Sheets.')
    track('timesheet_csv', !filled)
  }

  const clearMonth = () => {
    if (!window.confirm(`למחוק את כל השעות של ${title}?`)) return
    setDraft((current) => ({
      ...current,
      entries: Object.fromEntries(
        Object.entries(current.entries).filter(([iso]) => !calendar.days.some((day) => day.iso === iso)),
      ),
    }))
    setStatus(`השעות של ${title} נמחקו`)
  }

  const showSummary = () => {
    summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    summaryRef.current?.focus({ preventScroll: true })
  }

  const errors = {
    dayLength: hoursError(parseHoursSetting(settings.dayLength, 24), 24),
    shortLength: hoursError(parseHoursSetting(settings.shortLength, 24), 24),
    weekly: hoursError(parseHoursSetting(settings.weekly, 168), 168),
    breakMinutes: breakError(settings.breakMinutes),
  }
  const rulesLine = rulesText(settings)

  return (
    <section className={`${ui.tool} ${styles.root}`} aria-label="דוח שעות עבודה חודשי">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>פרטי הדוח</legend>
            <div className={styles.pair}>
              <Field label="חודש">
                {(id) => (
                  <select
                    id={id}
                    className={`${ui.input} ${styles.select}`}
                    value={settings.month}
                    onChange={(event) => setSetting('month', Number(event.target.value))}
                  >
                    {MONTH_NAMES.map((name, index) => (
                      <option key={name} value={index + 1}>
                        {name}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <Field label="שנה">
                {(id) => (
                  <select
                    id={id}
                    className={`${ui.input} ${styles.select}`}
                    value={settings.year}
                    onChange={(event) => setSetting('year', Number(event.target.value))}
                  >
                    {yearOptions(initialYear, settings.year).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
            </div>
            <div className={ui.row}>
              <Field label="שם העובד">
                {(id) => (
                  <input
                    id={id}
                    className={ui.input}
                    autoComplete="off"
                    value={settings.employee}
                    onChange={(event) => setSetting('employee', event.target.value)}
                  />
                )}
              </Field>
              <Field label="תעודת זהות (לא חובה)">
                {(id) => (
                  <input
                    id={id}
                    className={`${ui.input} ${ui.ltr}`}
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={12}
                    value={settings.employeeId}
                    onChange={(event) => setSetting('employeeId', event.target.value)}
                  />
                )}
              </Field>
              <Field label="שם המעסיק">
                {(id) => (
                  <input
                    id={id}
                    className={ui.input}
                    autoComplete="organization"
                    value={settings.employer}
                    onChange={(event) => setSetting('employer', event.target.value)}
                  />
                )}
              </Field>
            </div>
            <div className={styles.blankRow}>
              <button type="button" className={ui.primary} onClick={() => print(true)}>
                <Printer aria-hidden="true" />
                הדפסת טופס ריק ל{title}
              </button>
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>שעות עבודה ושעות נוספות</legend>
            <fieldset className={ui.group}>
              <legend className={ui.legend}>שבוע העבודה</legend>
              <div className={ui.options}>
                {weekOptions.map((option) => (
                  <label key={option.value} className={ui.option}>
                    <input
                      type="radio"
                      name={weekName}
                      value={option.value}
                      className={ui.checkbox}
                      checked={settings.week === option.value}
                      onChange={() => setWeek(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className={styles.pair}>
              <Field
                label="יום עבודה רגיל, בשעות"
                hint="בשבוע של 5 ימים 8.6, בשבוע של 6 ימים 8."
                error={errors.dayLength}
              >
                {(id, describedBy) => (
                  <NumberInput
                    id={id}
                    describedBy={describedBy}
                    value={settings.dayLength}
                    invalid={Boolean(errors.dayLength)}
                    onChange={setText('dayLength')}
                  />
                )}
              </Field>
              <Field
                label="הפסקה שלא נספרת, בדקות"
                hint="מנוכה מכל יום של 6 שעות ומעלה."
                error={errors.breakMinutes}
              >
                {(id, describedBy) => (
                  <NumberInput
                    id={id}
                    describedBy={describedBy}
                    value={settings.breakMinutes}
                    invalid={Boolean(errors.breakMinutes)}
                    numeric
                    onChange={setText('breakMinutes')}
                  />
                )}
              </Field>
            </div>
            <details className={styles.details}>
              <summary className={styles.summaryToggle}>ערב שבת וחג, משמרת לילה ושבוע עבודה</summary>
              <div className={styles.pair}>
                <Field
                  label="ערב שבת, ערב חג ולילה, בשעות"
                  hint="סעיף 2(ב) לחוק: 7 שעות."
                  error={errors.shortLength}
                >
                  {(id, describedBy) => (
                    <NumberInput
                      id={id}
                      describedBy={describedBy}
                      value={settings.shortLength}
                      invalid={Boolean(errors.shortLength)}
                      onChange={setText('shortLength')}
                    />
                  )}
                </Field>
                <Field label="שבוע עבודה, בשעות" hint="צו ההרחבה משנת 2018: 42 שעות." error={errors.weekly}>
                  {(id, describedBy) => (
                    <NumberInput
                      id={id}
                      describedBy={describedBy}
                      value={settings.weekly}
                      invalid={Boolean(errors.weekly)}
                      onChange={setText('weekly')}
                    />
                  )}
                </Field>
              </div>
            </details>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>שעות כניסה ויציאה</legend>
            <p id={hintId} className={ui.hint}>
              שעון של 24 שעות: אפשר להקליד 0830, 8:30 או 8.30. יציאה אחרי חצות נספרת למחרת. Enter וחיצים עוברים
              בין השורות.
            </p>
            {!calendar.holidays ? (
              <p className={styles.notice}>הדפדפן הזה לא מחשב את הלוח העברי, ולכן החגים לא מסומנים בטבלה.</p>
            ) : null}
            <div className={styles.toolbar}>
              <button type="button" className={styles.jump} onClick={showSummary}>
                לסיכום החודש
              </button>
            </div>
            <div className={styles.tableWrap}>
              <table ref={tableRef} className={styles.table} aria-describedby={hintId}>
                <caption className={styles.visuallyHidden}>שעות כניסה ויציאה ב{title}</caption>
                <thead>
                  <tr>
                    <th scope="col" className={styles.colDay}>
                      יום
                    </th>
                    <th scope="col" className={styles.colTime}>
                      כניסה
                    </th>
                    <th scope="col" className={styles.colTime}>
                      יציאה
                    </th>
                    <th scope="col" className={styles.colHours}>
                      שעות
                    </th>
                    <th scope="col" className={`${styles.colOt} ${styles.otCell}`}>
                      125%
                    </th>
                    <th scope="col" className={`${styles.colOt} ${styles.otCell}`}>
                      150%
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {calendar.days.map((day, index) => (
                    <DayRow
                      key={day.iso}
                      day={day}
                      index={index}
                      month={calendar.month}
                      entry={entries[day.iso] ?? EMPTY_ENTRY}
                      status={result.days.get(day.iso)}
                      tableId={tableId}
                      onChange={setTime(day.iso)}
                      onBlur={normalizeTime(day.iso)}
                      onKeyDown={moveFocus}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            {filled ? (
              <button type="button" className={styles.textButton} onClick={clearMonth}>
                ניקוי השעות של {title}
              </button>
            ) : null}
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <div ref={summaryRef} className={styles.summary} tabIndex={-1}>
              <h2 className={ui.outputTitle}>סיכום {title}</h2>
              {filled ? (
                <>
                  <dl className={styles.results}>
                    <SummaryRow
                      term="סך הכול שעות"
                      main
                      value={
                        <>
                          {formatDuration(totals.minutes)}
                          <span className={styles.valueNote}> ({formatDecimalHours(totals.minutes)})</span>
                        </>
                      }
                    />
                    <SummaryRow term="ימי עבודה" value={totals.days} />
                    {rules ? (
                      <>
                        <SummaryRow term="שעות רגילות" value={formatDuration(totals.regular)} />
                        <SummaryRow term="שעות נוספות 125%" value={formatDuration(totals.overtime1)} />
                        <SummaryRow term="שעות נוספות 150%" value={formatDuration(totals.overtime2)} />
                      </>
                    ) : null}
                    {totals.rest ? <SummaryRow term="בשבת ובחג" value={formatDuration(totals.rest)} /> : null}
                  </dl>
                  {!rules ? (
                    <p className={styles.notice}>תקנו את מספר השעות בטופס כדי לראות שעות נוספות.</p>
                  ) : null}
                </>
              ) : (
                <p className={styles.empty}>
                  כשמקלידים שעות כניסה ויציאה, כאן מופיעים סך השעות והשעות הנוספות של החודש.
                </p>
              )}
            </div>
            <div className={ui.actions}>
              {filled ? (
                <button type="button" className={`${ui.primary} ${styles.wide}`} onClick={() => print(false)}>
                  <Printer aria-hidden="true" />
                  הדפסה או PDF עם השעות
                </button>
              ) : null}
              <button type="button" className={`${ui.secondary} ${styles.wide}`} onClick={downloadCsv}>
                <Download aria-hidden="true" />
                הורדה ל-Excel (CSV)
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={styles.visuallyHidden} aria-live="polite" aria-atomic="true">
              {announcement}
            </p>
            {filled && totals.rest ? (
              <p className={ui.note}>
                שעות בשבת ובחג לא נכנסות לחישוב השעות הנוספות. על עבודה במנוחה השבועית משלמים לפחות 150%
                (סעיף 17 לחוק).
              </p>
            ) : null}
            <p className={ui.note}>
              {rulesLine} הדוח נשמר רק בדפדפן שלכם. שבוע שהתחיל בחודש הקודם נספר רק מהימים שבדוח.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
