'use client'

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { Copy, Download, Plus, Printer, Trash2 } from 'lucide-react'
import {
  DEFAULT_SETTINGS,
  MAX_ROWS,
  MAX_WAGE_SHEKELS,
  addDays,
  calculateShift,
  calculateTimesheet,
  errorField,
  formatClock,
  formatDate,
  formatDecimalHours,
  formatDuration,
  formatMonth,
  formatPercent,
  formatShekels,
  formatShortDate,
  isIsoDate,
  localIsoDate,
  parseClock,
  parseHoursSetting,
  parseRateSetting,
  parseWage,
  quickResultText,
  shiftErrorText,
  timesheetCsv,
  timesheetDocument,
  timesheetText,
  weekStart,
  weekdayIndex,
  weekdayName,
  type DayResult,
  type DayRow,
  type Parsed,
  type Rules,
  type Settings,
  type Shift,
  type Split,
} from '@/lib/work-hours'
import ui from './toolUi.module.css'
import styles from './WorkHoursCalculator.module.css'

type Mode = 'quick' | 'sheet'
type Quick = { start: string; end: string; breakMinutes: string }
type Draft = { mode: Mode; quick: Quick; rows: DayRow[]; settings: Settings }
type RowKey = 'date' | 'start' | 'end' | 'breakMinutes'
type ExportFormat = 'text' | 'csv' | 'print'

const STORAGE_KEY = 'aiterra-work-hours-v1'
const LEGAL_BREAK_MINUTES = 45
const LONG_DAY_MINUTES = 360

const modeOptions: { value: Mode; label: string; hint: string }[] = [
  { value: 'quick', label: 'משמרת אחת', hint: 'התחלה, סיום והפסקה' },
  { value: 'sheet', label: 'דוח שעות', hint: 'כמה ימים, שעות נוספות ושכר' },
]

const emptyRow = (id: number, date: string): DayRow => ({
  id,
  date,
  start: '',
  end: '',
  breakMinutes: '',
  short: false,
})

const defaultDraft = (today: string): Draft => ({
  mode: 'quick',
  quick: { start: '', end: '', breakMinutes: '' },
  rows: [emptyRow(1, today ? weekStart(today) : '')],
  settings: DEFAULT_SETTINGS,
})

const isText = (value: unknown): value is string => typeof value === 'string'

function readDraft(today: string): Draft | null {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return null
    const data = JSON.parse(saved) as Record<string, unknown>
    const base = defaultDraft(today)
    const quickData = (data.quick ?? {}) as Record<string, unknown>
    const settingsData = (data.settings ?? {}) as Record<string, unknown>
    const settings = { ...base.settings }
    for (const key of Object.keys(settings) as (keyof Settings)[]) {
      if (isText(settingsData[key])) settings[key] = settingsData[key] as string
    }
    const rows = (Array.isArray(data.rows) ? data.rows : [])
      .filter((row): row is Record<string, unknown> => typeof row === 'object' && row !== null)
      .slice(0, MAX_ROWS)
      .map((row, index) => ({
        id: index + 1,
        date: isText(row.date) && isIsoDate(row.date) ? row.date : '',
        start: isText(row.start) ? row.start : '',
        end: isText(row.end) ? row.end : '',
        breakMinutes: isText(row.breakMinutes) ? row.breakMinutes : '',
        short: row.short === true,
      }))
    return {
      mode: data.mode === 'sheet' ? 'sheet' : 'quick',
      quick: {
        start: isText(quickData.start) ? quickData.start : '',
        end: isText(quickData.end) ? quickData.end : '',
        breakMinutes: isText(quickData.breakMinutes) ? quickData.breakMinutes : '',
      },
      rows: rows.length ? rows : base.rows,
      settings,
    }
  } catch {
    return null
  }
}

function writeDraft(draft: Draft) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
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

const rateError = (parsed: Parsed) => {
  if (parsed.ok) return ''
  if (parsed.reason === 'empty') return 'הקלידו אחוז.'
  if (parsed.reason === 'out-of-range') return 'הקלידו אחוז בין 100 ל-500.'
  return 'הקלידו מספר, למשל 125.'
}

const wageError = (input: string) => {
  const parsed = parseWage(input)
  if (parsed.ok || parsed.reason === 'empty') return ''
  if (parsed.reason === 'out-of-range') {
    return `הקלידו שכר גדול מ-0 ועד ${MAX_WAGE_SHEKELS.toLocaleString('he-IL')} ₪ לשעה.`
  }
  return 'הקלידו סכום בשקלים, למשל 45.50.'
}

const normalizeClock = (value: string) => {
  const parsed = parseClock(value)
  return parsed.ok ? formatClock(parsed.value) : value
}

const rowLegend = (row: DayRow, index: number) =>
  isIsoDate(row.date) ? `${weekdayName(row.date)} ${formatDate(row.date)}` : `יום ${index + 1}`

function nextDate(rows: DayRow[]) {
  const last = rows[rows.length - 1]
  if (!last || !isIsoDate(last.date)) return ''
  const worksWeekends = rows.some((row) => isIsoDate(row.date) && weekdayIndex(row.date) >= 5)
  let date = addDays(last.date, 1)
  while (!worksWeekends && weekdayIndex(date) >= 5) date = addDays(date, 1)
  return date
}

function SettingField({
  label,
  source,
  value,
  error,
  onChange,
}: {
  label: string
  source: string
  value: string
  error: string
  onChange: (value: string) => void
}) {
  const id = useId()
  const sourceId = `${id}-source`
  const errorId = `${id}-error`
  return (
    <div className={styles.setting}>
      <label htmlFor={id} className={`${ui.label} ${styles.settingLabel}`}>
        {label}
      </label>
      <p id={sourceId} className={`${ui.hint} ${styles.settingSource}`}>
        {source}
      </p>
      <TextInput
        id={id}
        describedBy={error ? `${sourceId} ${errorId}` : sourceId}
        value={value}
        invalid={Boolean(error)}
        onChange={onChange}
        className={styles.settingInput}
      />
      {error ? (
        <p id={errorId} className={`${styles.error} ${styles.settingError}`}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

function Field({
  label,
  hint,
  error,
  extraDescription,
  className,
  children,
}: {
  label: string
  hint?: ReactNode
  error?: string
  extraDescription?: string
  className?: string
  children: (id: string, describedBy: string | undefined) => ReactNode
}) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : ''
  const errorId = error ? `${id}-error` : ''
  const describedBy = [extraDescription ?? '', hintId, errorId].filter(Boolean).join(' ') || undefined
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

function TextInput({
  id,
  describedBy,
  value,
  invalid,
  onChange,
  onBlur,
  numeric,
  className,
}: {
  id: string
  describedBy?: string
  value: string
  invalid: boolean
  onChange: (value: string) => void
  onBlur?: () => void
  numeric?: boolean
  className?: string
}) {
  return (
    <input
      id={id}
      className={`${ui.input} ${ui.ltr} ${styles.number} ${className ?? ''}`}
      inputMode={numeric ? 'numeric' : 'decimal'}
      autoComplete="off"
      spellCheck={false}
      value={value}
      aria-invalid={invalid ? true : undefined}
      aria-describedby={describedBy}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
    />
  )
}

function DayFields({
  row,
  index,
  count,
  shift,
  dateMissing,
  onChange,
  onToggleShort,
  onRemove,
}: {
  row: DayRow
  index: number
  count: number
  shift: Shift
  dateMissing: boolean
  onChange: (key: RowKey, value: string) => void
  onToggleShort: () => void
  onRemove: () => void
}) {
  const id = useId()
  const errorId = `${id}-error`
  const legend = rowLegend(row, index)
  const error = shift.status === 'error' ? shift.error : null
  const invalidField = error ? errorField(error) : null
  const message = error ? shiftErrorText[error] : dateMissing ? 'בחרו תאריך.' : ''
  const describe = (field: 'date' | 'start' | 'end' | 'break') =>
    (field === 'date' && dateMissing) || invalidField === field ? errorId : undefined
  const invalid = (field: 'date' | 'start' | 'end' | 'break') => Boolean(describe(field))

  return (
    <fieldset className={styles.day} data-row={row.id}>
      <legend className={styles.dayLegend}>{legend}</legend>
      <p className={styles.dayTotal}>
        {shift.status === 'ok' ? (
          <>
            {formatDuration(shift.worked)}
            <span className={styles.dayTotalUnit}> שעות</span>
          </>
        ) : null}
      </p>
      {count > 1 ? (
        <button
          type="button"
          className={`${styles.iconButton} ${styles.danger}`}
          aria-label={`הסרת ${legend}`}
          onClick={onRemove}
        >
          <Trash2 aria-hidden="true" />
        </button>
      ) : null}
      <div className={styles.dayFields}>
        <div className={`${ui.field} ${styles.dateField}`}>
          <label htmlFor={`${id}-date`} className={ui.label}>
            תאריך
          </label>
          <input
            id={`${id}-date`}
            type="date"
            data-focus="date"
            className={`${ui.input} ${styles.dateInput}`}
            value={row.date}
            aria-invalid={invalid('date') ? true : undefined}
            aria-describedby={describe('date')}
            onChange={(event) => onChange('date', event.target.value)}
          />
        </div>
        {(
          [
            ['start', 'התחלה', 'start'],
            ['end', 'סיום', 'end'],
          ] as [RowKey, string, 'start' | 'end'][]
        ).map(([key, label, field]) => (
          <div key={key} className={ui.field}>
            <label htmlFor={`${id}-${key}`} className={ui.label}>
              {label}
            </label>
            <TextInput
              id={`${id}-${key}`}
              describedBy={describe(field)}
              value={row[key]}
              invalid={invalid(field)}
              onChange={(value) => onChange(key, value)}
              onBlur={() => onChange(key, normalizeClock(row[key]))}
            />
          </div>
        ))}
        <div className={ui.field}>
          <label htmlFor={`${id}-break`} className={ui.label}>
            הפסקה<span className={styles.visuallyHidden}> בדקות</span>
          </label>
          <div className={styles.unitWrap}>
            <TextInput
              id={`${id}-break`}
              describedBy={describe('break')}
              value={row.breakMinutes}
              invalid={invalid('break')}
              numeric
              onChange={(value) => onChange('breakMinutes', value)}
              className={styles.withUnit}
            />
            <span className={styles.unit} aria-hidden="true">
              דק׳
            </span>
          </div>
        </div>
        <label className={`${ui.option} ${styles.shortOption}`}>
          <input type="checkbox" className={ui.checkbox} checked={row.short} onChange={onToggleShort} />
          <span>ערב שבת או חג</span>
        </label>
      </div>
      {message ? (
        <p id={errorId} className={`${styles.error} ${styles.dayError}`}>
          {message}
        </p>
      ) : null}
    </fieldset>
  )
}

function QuickResult({ shift }: { shift: Shift }) {
  if (shift.status !== 'ok') {
    return (
      <p className={styles.empty}>
        {shift.status === 'error'
          ? 'תקנו את השדה המסומן כדי לראות את התוצאה.'
          : 'הקלידו שעת התחלה ושעת סיום כדי לראות כמה שעות עבדתם.'}
      </p>
    )
  }
  const shortBreak = shift.worked >= LONG_DAY_MINUTES && shift.breakMinutes < LEGAL_BREAK_MINUTES
  return (
    <>
      <dl className={styles.results}>
        <div className={`${styles.resultRow} ${styles.main}`}>
          <dt className={styles.term}>שעות עבודה</dt>
          <dd className={styles.value}>{formatDuration(shift.worked)}</dd>
        </div>
        <div className={styles.resultRow}>
          <dt className={styles.term}>בשבר עשרוני</dt>
          <dd className={styles.value}>{formatDecimalHours(shift.worked)}</dd>
        </div>
      </dl>
      <p className={styles.formula}>
        מ-{formatClock(shift.start)} עד {formatClock(shift.end)}
        {shift.overnight ? ' למחרת' : ''}: {formatDuration(shift.span)} שעות
        {shift.breakMinutes ? `, פחות הפסקה של ${shift.breakMinutes} דקות` : ''}.
      </p>
      {shortBreak ? (
        <p className={styles.notice}>
          ביום עבודה של 6 שעות ומעלה מגיעה לעובד הפסקה של 45 דקות לפחות, ובהן חצי שעה רצופה. בערב שבת או חג:
          חצי שעה לפחות (סעיף 20(א) לחוק שעות עבודה ומנוחה).
        </p>
      ) : null}
    </>
  )
}

function SummaryRow({ term, minutes, main = false }: { term: string; minutes: number; main?: boolean }) {
  return (
    <div className={main ? `${styles.resultRow} ${styles.main}` : styles.resultRow}>
      <dt className={styles.term}>{term}</dt>
      <dd className={styles.value}>
        {formatDuration(minutes)}
        {main ? <span className={styles.valueNote}> ({formatDecimalHours(minutes)} שעות)</span> : null}
      </dd>
    </div>
  )
}

function DayCells({ split, rules }: { split: Split; rules: Rules | null }) {
  return (
    <>
      <td role="cell" data-label="שעות">
        {formatDuration(split.minutes)}
      </td>
      {rules ? (
        <>
          <td role="cell" data-label="רגילות">
            {formatDuration(split.regular)}
          </td>
          <td role="cell" data-label={`נוספות ${formatPercent(rules.rate1)}`}>
            {formatDuration(split.overtime1)}
          </td>
          <td role="cell" data-label={`נוספות ${formatPercent(rules.rate2)}`}>
            {formatDuration(split.overtime2)}
          </td>
        </>
      ) : null}
    </>
  )
}

const dayMark = (day: DayResult) => (day.night ? 'לילה' : day.short ? 'יום קצר' : '')

export default function WorkHoursCalculator() {
  const [draft, setDraft] = useState<Draft>(() => defaultDraft(''))
  const [restored, setRestored] = useState(false)
  const [status, setStatus] = useState('')
  const [rowStatus, setRowStatus] = useState('')
  const nextId = useRef(2)
  const pendingFocus = useRef<number | null>(null)
  const rowsRef = useRef<HTMLDivElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const modeName = useId()
  const quickHintId = useId()
  const rowsHintId = useId()

  const { mode, quick, rows, settings } = draft
  const quickShift = useMemo(() => calculateShift(quick.start, quick.end, quick.breakMinutes), [quick])
  const sheet = useMemo(() => calculateTimesheet(rows, settings), [rows, settings])
  const { rules, totals, pay } = sheet
  const settingsChanged = (Object.keys(DEFAULT_SETTINGS) as (keyof Settings)[]).some(
    (key) => key !== 'wage' && settings[key] !== DEFAULT_SETTINGS[key],
  )

  useEffect(() => {
    const today = localIsoDate()
    const next = readDraft(today) ?? defaultDraft(today)
    nextId.current = Math.max(...next.rows.map((row) => row.id)) + 1
    setDraft(next)
    setRestored(true)
  }, [])

  useEffect(() => {
    if (restored) writeDraft(draft)
  }, [draft, restored])

  useEffect(() => {
    const id = pendingFocus.current
    if (id === null) return
    pendingFocus.current = null
    rowsRef.current?.querySelector<HTMLElement>(`[data-row="${id}"] [data-focus="date"]`)?.focus()
  }, [rows])

  const update = (patch: Partial<Draft>) => setDraft((current) => ({ ...current, ...patch }))

  const setQuick = (key: keyof Quick, value: string) =>
    setDraft((current) => ({ ...current, quick: { ...current.quick, [key]: value } }))

  const setSetting = (key: keyof Settings, value: string) =>
    setDraft((current) => ({ ...current, settings: { ...current.settings, [key]: value } }))

  const updateRows = (change: (rows: DayRow[]) => DayRow[]) =>
    setDraft((current) => ({ ...current, rows: change(current.rows) }))

  const setRow = (id: number) => (key: RowKey, value: string) =>
    updateRows((list) => list.map((row) => (row.id === id ? { ...row, [key]: value } : row)))

  const toggleShort = (id: number) => () =>
    updateRows((list) => list.map((row) => (row.id === id ? { ...row, short: !row.short } : row)))

  const addRow = () => {
    if (rows.length >= MAX_ROWS) return
    const id = nextId.current
    nextId.current += 1
    const last = rows[rows.length - 1]
    const date = nextDate(rows)
    pendingFocus.current = id
    updateRows((list) => [
      ...list,
      { ...emptyRow(id, date), start: last?.start ?? '', end: last?.end ?? '', breakMinutes: last?.breakMinutes ?? '' },
    ])
    setRowStatus(
      date ? `נוסף יום: ${weekdayName(date)} ${formatDate(date)}, עם השעות של היום הקודם` : 'נוסף יום חדש',
    )
  }

  const removeRow = (id: number) => () => {
    const index = rows.findIndex((row) => row.id === id)
    const neighbour = rows[index + 1] ?? rows[index - 1]
    if (neighbour) pendingFocus.current = neighbour.id
    setRowStatus(`${rowLegend(rows[index], index)} הוסר`)
    updateRows((list) => list.filter((row) => row.id !== id))
  }

  const resetSheet = () => {
    if (!window.confirm('למחוק את כל הימים בדוח ולהתחיל מחדש?')) return
    nextId.current = 2
    setDraft((current) => ({
      ...current,
      rows: [emptyRow(1, weekStart(localIsoDate()))],
      settings: { ...current.settings, wage: '' },
    }))
    pendingFocus.current = 1
    setStatus('הדוח נוקה')
  }

  const track = (format: ExportFormat) =>
    window.gtag?.('event', 'work_hours_copy', {
      format,
      mode,
      days: mode === 'sheet' ? totals.days : 1,
      has_wage: mode === 'sheet' && Boolean(pay),
      custom_rules: settingsChanged,
    })

  const copyText = async (text: string, done: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setStatus(done)
      track('text')
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הטקסט והעתיקו ידנית.')
    }
  }

  const copyQuick = () => {
    if (quickShift.status !== 'ok') {
      setStatus('הקלידו שעת התחלה ושעת סיום כדי להעתיק את התוצאה.')
      return
    }
    copyText(quickResultText(quickShift), 'התוצאה הועתקה')
  }

  const hasDays = totals.days > 0

  const copySheet = () => {
    if (!hasDays) return
    copyText(timesheetText(rows, sheet), 'הסיכום הועתק כטקסט')
  }

  const downloadCsv = () => {
    if (!hasDays) return
    const url = URL.createObjectURL(new Blob([timesheetCsv(rows, sheet)], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `דוח-שעות-${sheet.days[0].date}.csv`
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setStatus('קובץ ה-CSV ירד. אפשר לפתוח אותו ב-Excel או ב-Google Sheets.')
    track('csv')
  }

  const print = () => {
    if (!hasDays) return
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
    frame.srcdoc = timesheetDocument(rows, sheet)
    document.body.appendChild(frame)
    setStatus('נפתח חלון ההדפסה. כדי לקבל קובץ PDF, בחרו ביעד שמירה כ-PDF.')
    track('print')
  }

  const showSummary = () => {
    summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    summaryRef.current?.focus({ preventScroll: true })
  }

  const quickError = quickShift.status === 'error' ? quickShift.error : null
  const quickField = quickError ? errorField(quickError) : null
  const quickMessage = (field: 'start' | 'end' | 'break') =>
    quickError && quickField === field ? shiftErrorText[quickError] : ''

  const settingErrors = {
    daily: hoursError(parseHoursSetting(settings.daily, 24), 24),
    short: hoursError(parseHoursSetting(settings.short, 24), 24),
    weekly: hoursError(parseHoursSetting(settings.weekly, 168), 168),
    rate1: rateError(parseRateSetting(settings.rate1)),
    rate2: rateError(parseRateSetting(settings.rate2)),
  }

  const settingField = (key: Exclude<keyof Settings, 'wage'>, label: string, source: string) => (
    <SettingField
      label={label}
      source={source}
      value={settings[key]}
      error={settingErrors[key]}
      onChange={(value) => setSetting(key, value)}
    />
  )

  return (
    <section className={ui.tool} aria-label="מחשבון שעות עבודה">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>מה רוצים לחשב</legend>
            <div className={styles.choices}>
              {modeOptions.map((option) => (
                <label key={option.value} className={styles.choice}>
                  <input
                    type="radio"
                    name={modeName}
                    value={option.value}
                    className={ui.checkbox}
                    checked={mode === option.value}
                    onChange={() => {
                      update({ mode: option.value })
                      setStatus('')
                    }}
                  />
                  <span className={styles.choiceText}>
                    <span className={styles.choiceLabel}>{option.label}</span>
                    <span className={styles.choiceHint}>{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {mode === 'quick' ? (
            <fieldset className={ui.group}>
              <legend className={ui.legend}>המשמרת</legend>
              <p id={quickHintId} className={ui.hint}>
                שעון של 24 שעות: אפשר להקליד 0830, 8:30 או 8.30. משמרת שנגמרת אחרי חצות נספרת עד למחרת. בהפסקה
                רושמים רק זמן שלא נחשב לשעות עבודה.
              </p>
              <div className={styles.quickFields}>
                <Field label="שעת התחלה" error={quickMessage('start')} extraDescription={quickHintId}>
                  {(id, describedBy) => (
                    <TextInput
                      id={id}
                      describedBy={describedBy}
                      value={quick.start}
                      invalid={quickField === 'start'}
                      onChange={(value) => setQuick('start', value)}
                      onBlur={() => setQuick('start', normalizeClock(quick.start))}
                      className={styles.big}
                    />
                  )}
                </Field>
                <Field label="שעת סיום" error={quickMessage('end')} extraDescription={quickHintId}>
                  {(id, describedBy) => (
                    <TextInput
                      id={id}
                      describedBy={describedBy}
                      value={quick.end}
                      invalid={quickField === 'end'}
                      onChange={(value) => setQuick('end', value)}
                      onBlur={() => setQuick('end', normalizeClock(quick.end))}
                      className={styles.big}
                    />
                  )}
                </Field>
                <Field label="הפסקה בדקות" error={quickMessage('break')} extraDescription={quickHintId}>
                  {(id, describedBy) => (
                    <TextInput
                      id={id}
                      describedBy={describedBy}
                      value={quick.breakMinutes}
                      invalid={quickField === 'break'}
                      numeric
                      onChange={(value) => setQuick('breakMinutes', value)}
                      className={styles.big}
                    />
                  )}
                </Field>
              </div>
            </fieldset>
          ) : (
            <>
              <div className={styles.toolbar}>
                <button type="button" className={styles.jump} onClick={showSummary}>
                  לסיכום השעות
                </button>
              </div>

              <fieldset className={ui.group}>
                <legend className={ui.legend}>ימי עבודה</legend>
                <p id={rowsHintId} className={ui.hint}>
                  שעון של 24 שעות. כל יום שמוסיפים מקבל את השעות של היום הקודם, ואפשר לשנות אותן. משמרת לילה, עם
                  שעתיים לפחות בין 22:00 ל-06:00, מזוהה לבד.
                </p>
                <div ref={rowsRef} className={styles.days}>
                  {rows.map((row, index) => {
                    const result = sheet.rows.get(row.id)
                    return (
                      <DayFields
                        key={row.id}
                        row={row}
                        index={index}
                        count={rows.length}
                        shift={result?.shift ?? { status: 'empty' }}
                        dateMissing={result?.dateMissing ?? false}
                        onChange={setRow(row.id)}
                        onToggleShort={toggleShort(row.id)}
                        onRemove={removeRow(row.id)}
                      />
                    )
                  })}
                </div>
                {rows.length < MAX_ROWS ? (
                  <button type="button" className={`${ui.secondary} ${styles.add}`} onClick={addRow}>
                    <Plus aria-hidden="true" />
                    הוספת יום
                  </button>
                ) : (
                  <p className={ui.hint}>אפשר עד {MAX_ROWS} שורות בדוח אחד.</p>
                )}
                <p className={styles.visuallyHidden} role="status" aria-live="polite">
                  {rowStatus}
                </p>
              </fieldset>

              <fieldset className={ui.group}>
                <legend className={ui.legend}>שכר</legend>
                <Field
                  label="שכר לשעה בשקלים (לא חובה)"
                  hint="שכר רגיל לשעה, עם כל התוספות הקבועות. בלי שכר יוצגו רק השעות."
                  error={wageError(settings.wage)}
                  className={styles.wage}
                >
                  {(id, describedBy) => (
                    <TextInput
                      id={id}
                      describedBy={describedBy}
                      value={settings.wage}
                      invalid={Boolean(wageError(settings.wage))}
                      onChange={(value) => setSetting('wage', value)}
                    />
                  )}
                </Field>
              </fieldset>

              <fieldset className={ui.group}>
                <legend className={ui.legend}>מתי מתחילות שעות נוספות</legend>
                <p className={ui.hint}>
                  ברירת המחדל לפי חוק שעות עבודה ומנוחה וצו ההרחבה לקיצור שבוע העבודה. אם בהסכם הקיבוצי או בחוזה
                  נקבעו אצלכם ספים או תעריפים אחרים, הקלידו אותם.
                </p>
                <div className={styles.settings}>
                  {settingField('daily', 'יום עבודה, בשעות', 'סעיף 2(א) לחוק: 8 שעות')}
                  {settingField(
                    'short',
                    'ערב שבת או חג ומשמרת לילה, בשעות',
                    'סעיף 2(ב) לחוק: 7 שעות',
                  )}
                  {settingField('weekly', 'שבוע עבודה, בשעות', 'צו ההרחבה, סעיף 2.1: 42 שעות (בחוק עצמו: 45)')}
                  {settingField('rate1', 'שעתיים נוספות ראשונות ביום, באחוזים', 'סעיף 16(א) לחוק: 125% לפחות')}
                  {settingField('rate2', 'מהשעה הנוספת השלישית, באחוזים', 'סעיף 16(א) לחוק: 150% לפחות')}
                </div>
                {settingsChanged ? (
                  <button
                    type="button"
                    className={styles.textButton}
                    onClick={() => update({ settings: { ...DEFAULT_SETTINGS, wage: settings.wage } })}
                  >
                    חזרה לערכים שבחוק
                  </button>
                ) : null}
              </fieldset>

              <div className={styles.footerRow}>
                <button type="button" className={styles.textButton} onClick={resetSheet}>
                  ניקוי הדוח
                </button>
              </div>
            </>
          )}
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            {mode === 'quick' ? (
              <>
                <h2 className={ui.outputTitle}>התוצאה</h2>
                <QuickResult shift={quickShift} />
                <div className={ui.actions}>
                  <button type="button" className={ui.primary} onClick={copyQuick}>
                    <Copy aria-hidden="true" />
                    העתקת התוצאה
                  </button>
                </div>
              </>
            ) : (
              <div ref={summaryRef} className={styles.summary} tabIndex={-1}>
                <h2 className={ui.outputTitle}>סיכום השעות</h2>
                {hasDays ? (
                  <>
                    <dl className={styles.results}>
                      <SummaryRow term={`סך הכול ב-${totals.days} ימים`} minutes={totals.minutes} main />
                      {rules ? (
                        <>
                          <SummaryRow term="שעות רגילות" minutes={totals.regular} />
                          <SummaryRow term={`שעות נוספות ${formatPercent(rules.rate1)}`} minutes={totals.overtime1} />
                          <SummaryRow term={`שעות נוספות ${formatPercent(rules.rate2)}`} minutes={totals.overtime2} />
                        </>
                      ) : null}
                    </dl>
                    {!rules ? (
                      <p className={styles.notice}>תקנו את הספים בטופס כדי לראות שעות נוספות ושכר.</p>
                    ) : null}
                    {pay && rules ? (
                      <div className={styles.pay}>
                        <h3 className={styles.payTitle}>שכר ברוטו לפני ניכויים</h3>
                        <p className={styles.payTotal}>{formatShekels(pay.total)}</p>
                        <ul className={styles.payLines}>
                          <li>
                            {formatDuration(totals.regular)} שעות רגילות × {formatShekels(pay.wage)}:{' '}
                            {formatShekels(pay.regular)}
                          </li>
                          {totals.overtime1 ? (
                            <li>
                              {formatDuration(totals.overtime1)} שעות ב-{formatPercent(rules.rate1)}:{' '}
                              {formatShekels(pay.overtime1)}
                            </li>
                          ) : null}
                          {totals.overtime2 ? (
                            <li>
                              {formatDuration(totals.overtime2)} שעות ב-{formatPercent(rules.rate2)}:{' '}
                              {formatShekels(pay.overtime2)}
                            </li>
                          ) : null}
                        </ul>
                      </div>
                    ) : null}
                    <div className={ui.actions}>
                      <button type="button" className={`${ui.primary} ${styles.wide}`} onClick={copySheet}>
                        <Copy aria-hidden="true" />
                        העתקת הסיכום
                      </button>
                      <button type="button" className={ui.secondary} onClick={downloadCsv}>
                        <Download aria-hidden="true" />
                        ייצוא ל-Excel (CSV)
                      </button>
                      <button type="button" className={ui.secondary} onClick={print}>
                        <Printer aria-hidden="true" />
                        הדפסה
                      </button>
                    </div>
                  </>
                ) : (
                  <p className={styles.empty}>מלאו תאריך, שעת התחלה ושעת סיום לפחות ביום אחד.</p>
                )}
              </div>
            )}

            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>

            {mode === 'sheet' && hasDays ? (
              <div className={styles.report}>
                <table className={styles.table} role="table">
                  <caption className={styles.caption}>פירוט לפי ימים ושבועות</caption>
                  <thead role="rowgroup" className={styles.thead}>
                    <tr role="row">
                      <th role="columnheader" scope="col">
                        יום
                      </th>
                      <th role="columnheader" scope="col">
                        שעות
                      </th>
                      {rules ? (
                        <>
                          <th role="columnheader" scope="col">
                            רגילות
                          </th>
                          <th role="columnheader" scope="col">
                            נוספות {formatPercent(rules.rate1)}
                          </th>
                          <th role="columnheader" scope="col">
                            נוספות {formatPercent(rules.rate2)}
                          </th>
                        </>
                      ) : null}
                    </tr>
                  </thead>
                  {sheet.weeks.map((week) => (
                    <tbody key={week.start} role="rowgroup">
                      {week.days.map((day) => (
                        <tr key={day.date} role="row">
                          <th role="rowheader" scope="row">
                            {weekdayName(day.date)} {formatShortDate(day.date)}
                            {dayMark(day) ? <span className={styles.mark}>{dayMark(day)}</span> : null}
                          </th>
                          <DayCells split={day} rules={rules} />
                        </tr>
                      ))}
                      <tr role="row" className={styles.subtotal}>
                        <th role="rowheader" scope="row">
                          שבוע {formatShortDate(week.start)}-{formatShortDate(week.end)}
                        </th>
                        <DayCells split={week.totals} rules={rules} />
                      </tr>
                    </tbody>
                  ))}
                </table>
                {sheet.months.length > 1 ? (
                  <ul className={styles.months}>
                    {sheet.months.map((month) => (
                      <li key={month.month}>
                        <span>חודש {formatMonth(month.month)}</span>
                        <span>{formatDuration(month.totals.minutes)} שעות</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}

            <p className={ui.note}>
              {mode === 'quick'
                ? 'החישוב נעשה בדפדפן שלכם, והשעות לא נשלחות לשום מקום.'
                : 'החישוב נעשה בדפדפן שלכם והדוח נשמר רק בו. ' +
                  'המחשבון לא מחשב גמול על עבודה במנוחה השבועית, ניכויים ומסים.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
