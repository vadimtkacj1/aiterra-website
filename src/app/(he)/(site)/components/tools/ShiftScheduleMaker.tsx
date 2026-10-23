'use client'

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Eraser,
  FileSpreadsheet,
  FileText,
  History,
  MessageCircle,
  Plus,
  Printer,
  Trash2,
  UserPlus,
  WandSparkles,
} from 'lucide-react'
import {
  DAY_NAMES,
  MAX_EMPLOYEES,
  MAX_NEED,
  MAX_SHIFT_TYPES,
  MAX_WEEK_DATE,
  MAX_WEEK_SHIFTS,
  MIN_WEEK_DATE,
  NAME_LIMIT,
  PHONE_LIMIT,
  autoFill,
  buildModel,
  defaultWeek,
  emptyPlan,
  employeeLabel,
  employeeLink,
  fileBase,
  formatHours,
  hasAssignments,
  hoursText,
  isOff,
  missingText,
  newEmployee,
  newShift,
  nextId,
  phoneDigits,
  phoneError,
  pruneWeeks,
  readStored,
  sampleSetup,
  scheduleCsv,
  scheduleDocument,
  scheduleXlsx,
  shiftHours,
  shiftMinutes,
  shiftValid,
  shiftWeek,
  shiftsText,
  slotKey,
  sundayOf,
  teamMessage,
  weekRange,
  type Cell,
  type Employee,
  type ModelDay,
  type Setup,
  type ShiftDef,
  type Stored,
  type WeekPlan,
} from '@/lib/shift-schedule'
import { todayIso } from '@/lib/work-days'
import ui from './toolUi.module.css'
import styles from './ShiftScheduleMaker.module.css'

const STORAGE_KEY = 'aiterra-shift-schedule-v1'
const EMPTY_PLAN = emptyPlan()
const XLSX_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
const needOptions = Array.from({ length: MAX_NEED + 1 }, (_, value) => value)
const maxOptions = Array.from({ length: MAX_WEEK_SHIFTS }, (_, index) => index + 1)

type GridStyle = CSSProperties & { '--col'?: number; '--row'?: number; '--span'?: number }

function loadStored() {
  try {
    return readStored(window.localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

function saveStored(value: Stored) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function downloadFile(data: BlobPart, type: string, name: string) {
  const url = URL.createObjectURL(new Blob([data], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const withoutShift = (plan: WeekPlan, shiftId: string): WeekPlan => ({
  ...plan,
  assignments: Object.fromEntries(
    Object.entries(plan.assignments).filter(([key]) => !key.endsWith(`:${shiftId}`)),
  ),
})

const withoutEmployee = (plan: WeekPlan, employeeId: string): WeekPlan => ({
  ...plan,
  assignments: Object.fromEntries(
    Object.entries(plan.assignments).map(([key, ids]) => [key, ids.filter((id) => id !== employeeId)]),
  ),
})

const mapWeeks = (weeks: Record<string, WeekPlan>, change: (plan: WeekPlan) => WeekPlan) =>
  Object.fromEntries(Object.entries(weeks).map(([key, plan]) => [key, change(plan)]))

function ShiftEditor({
  shift,
  baseId,
  onChange,
  onRemove,
}: {
  shift: ShiftDef
  baseId: string
  onChange: (patch: Partial<ShiftDef>) => void
  onRemove: () => void
}) {
  const id = `${baseId}-shift-${shift.id}`
  const valid = shiftValid(shift)
  const minutes = shiftMinutes(shift)
  const overnight = valid && shift.end <= shift.start
  const label = shift.name.trim() || 'חדשה'

  return (
    <li className={styles.card}>
      <div className={styles.shiftFields}>
        <div className={ui.field}>
          <label htmlFor={`${id}-name`} className={ui.label}>
            שם המשמרת
          </label>
          <input
            id={`${id}-name`}
            className={ui.input}
            value={shift.name}
            maxLength={NAME_LIMIT}
            placeholder="למשל: אמצע"
            autoComplete="off"
            onChange={(event) => onChange({ name: event.target.value })}
          />
        </div>
        <div className={ui.field}>
          <label htmlFor={`${id}-start`} className={ui.label}>
            התחלה
          </label>
          <input
            id={`${id}-start`}
            type="time"
            className={`${ui.input} ${styles.time}`}
            value={shift.start}
            aria-invalid={valid ? undefined : true}
            onChange={(event) => onChange({ start: event.target.value })}
          />
        </div>
        <div className={ui.field}>
          <label htmlFor={`${id}-end`} className={ui.label}>
            סיום
          </label>
          <input
            id={`${id}-end`}
            type="time"
            className={`${ui.input} ${styles.time}`}
            value={shift.end}
            aria-invalid={valid ? undefined : true}
            onChange={(event) => onChange({ end: event.target.value })}
          />
        </div>
        <button
          type="button"
          className={styles.iconButton}
          aria-label={`מחיקת המשמרת ${label}`}
          onClick={onRemove}
        >
          <Trash2 aria-hidden="true" />
        </button>
      </div>
      {valid ? (
        <p className={styles.meta}>
          {hoursText(minutes)}
          {overnight ? ', נגמרת למחרת' : ''}
        </p>
      ) : (
        <p className={styles.error}>בחרו שעת התחלה ושעת סיום.</p>
      )}
      <fieldset className={styles.needs}>
        <legend className={styles.smallLegend}>כמה עובדים צריך במשמרת {label}</legend>
        <div className={styles.needGrid}>
          {DAY_NAMES.map((name, dayIndex) => (
            <label key={name} className={styles.need}>
              <span>{name}</span>
              <select
                className={styles.needSelect}
                value={shift.need[dayIndex] ?? 0}
                onChange={(event) =>
                  onChange({
                    need: shift.need.map((value, index) => (index === dayIndex ? Number(event.target.value) : value)),
                  })
                }
              >
                {needOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </fieldset>
    </li>
  )
}

function EmployeeEditor({
  employee,
  index,
  shifts,
  baseId,
  onChange,
  onToggleOff,
  onRemove,
}: {
  employee: Employee
  index: number
  shifts: ShiftDef[]
  baseId: string
  onChange: (patch: Partial<Employee>) => void
  onToggleOff: (key: string) => void
  onRemove: () => void
}) {
  const id = `${baseId}-employee-${employee.id}`
  const label = employeeLabel(employee, index)
  const error = phoneError(employee.phone)
  const offCount = employee.off.length

  return (
    <li className={styles.card}>
      <div className={styles.personFields}>
        <div className={`${ui.field} ${styles.areaName}`}>
          <label htmlFor={`${id}-name`} className={ui.label}>
            שם
          </label>
          <input
            id={`${id}-name`}
            className={ui.input}
            value={employee.name}
            maxLength={NAME_LIMIT}
            autoComplete="off"
            onChange={(event) => onChange({ name: event.target.value })}
          />
        </div>
        <div className={`${ui.field} ${styles.areaRole}`}>
          <label htmlFor={`${id}-role`} className={ui.label}>
            תפקיד
          </label>
          <input
            id={`${id}-role`}
            className={ui.input}
            value={employee.role}
            maxLength={NAME_LIMIT}
            autoComplete="off"
            onChange={(event) => onChange({ role: event.target.value })}
          />
        </div>
        <div className={`${ui.field} ${styles.areaPhone}`}>
          <label htmlFor={`${id}-phone`} className={ui.label}>
            נייד לוואטסאפ
          </label>
          <input
            id={`${id}-phone`}
            type="tel"
            inputMode="tel"
            className={`${ui.input} ${ui.ltr}`}
            value={employee.phone}
            maxLength={PHONE_LIMIT}
            autoComplete="off"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-phone-error` : undefined}
            onChange={(event) => onChange({ phone: event.target.value })}
          />
          {error ? (
            <p id={`${id}-phone-error`} className={styles.error}>
              {error}
            </p>
          ) : null}
        </div>
        <div className={`${ui.field} ${styles.areaMax}`}>
          <label htmlFor={`${id}-max`} className={ui.label}>
            משמרות בשבוע
          </label>
          <select
            id={`${id}-max`}
            className={`${ui.input} ${styles.select}`}
            value={employee.maxShifts}
            onChange={(event) => onChange({ maxShifts: Number(event.target.value) })}
          >
            {maxOptions.map((value) => (
              <option key={value} value={value}>
                עד {value}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className={`${styles.iconButton} ${styles.areaRemove}`}
          aria-label={`מחיקת ${label}`}
          onClick={onRemove}
        >
          <Trash2 aria-hidden="true" />
        </button>
      </div>
      <details className={styles.constraints}>
        <summary className={styles.summary}>
          אילוצים של {label}
          {offCount ? <span className={styles.badge}>{offCount}</span> : null}
        </summary>
        <div className={styles.offList}>
          {DAY_NAMES.map((name, dayIndex) => {
            const wholeDay = employee.off.includes(String(dayIndex))
            return (
              <fieldset key={name} className={styles.offDay}>
                <legend className={styles.offLegend}>{name}</legend>
                <div className={styles.offChips}>
                  <label className={styles.chip}>
                    <input type="checkbox" checked={wholeDay} onChange={() => onToggleOff(String(dayIndex))} />
                    <span>כל היום</span>
                  </label>
                  {shifts.map((shift) => (
                    <label key={shift.id} className={styles.chip}>
                      <input
                        type="checkbox"
                        checked={wholeDay || employee.off.includes(slotKey(dayIndex, shift.id))}
                        disabled={wholeDay}
                        onChange={() => onToggleOff(slotKey(dayIndex, shift.id))}
                      />
                      <span>{shift.name.trim() || 'משמרת'}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )
          })}
        </div>
      </details>
    </li>
  )
}

function ScheduleCell({
  cell,
  day,
  row,
  active,
  activeLabel,
  describedBy,
  onToggle,
}: {
  cell: Cell
  day: ModelDay
  row: number
  active: Employee | null
  activeLabel: string
  describedBy: string
  onToggle: () => void
}) {
  const pressed = active ? cell.assigned.some((person) => person.id === active.id) : false
  const blocked = active ? isOff(active, day.index, cell.shift.id) : false
  const flag =
    cell.status === 'under' ? `חסר ${cell.gap}` : cell.status === 'over' ? `עודף ${-cell.gap}` : ''
  const names = cell.assigned.map((person) => person.label).join(', ')
  const spoken = [
    names ? `משובצים: ${names}` : 'אין משובצים',
    `${cell.assigned.length} מתוך ${cell.need}`,
    cell.status === 'under' ? missingText(cell.gap) : '',
    cell.status === 'over' ? `עודף של ${-cell.gap}` : '',
    blocked ? `אילוץ של ${activeLabel}` : '',
  ]
    .filter(Boolean)
    .join('. ')
  const style: GridStyle = { '--col': day.index + 2, '--row': row + 2 }

  return (
    <button
      type="button"
      className={styles.cell}
      style={style}
      data-status={cell.status}
      data-blocked={blocked ? '' : undefined}
      aria-pressed={pressed}
      aria-label={`${day.short} ${cell.shift.name}: ${activeLabel}`}
      aria-describedby={describedBy}
      disabled={!active}
      onClick={onToggle}
    >
      <span className={styles.cellShift} aria-hidden="true">
        {cell.shift.name} <span dir="ltr">{shiftHours(cell.shift)}</span>
      </span>
      <span className={styles.cellNames} aria-hidden="true">
        {cell.assigned.length ? (
          cell.assigned.map((person) => (
            <span key={person.id} className={person.id === active?.id ? styles.nameActive : styles.name}>
              {person.label}
            </span>
          ))
        ) : (
          <span className={styles.nameEmpty}>אין שיבוץ</span>
        )}
      </span>
      <span className={styles.cellMeta} aria-hidden="true">
        <span className={styles.count}>
          {cell.assigned.length}/{cell.need}
        </span>
        {flag ? <span className={cell.status === 'under' ? styles.flagUnder : styles.flagOver}>{flag}</span> : null}
        {blocked ? <span className={styles.flagOff}>אילוץ</span> : null}
      </span>
      <span id={describedBy} className={styles.srOnly}>
        {spoken}
      </span>
    </button>
  )
}

export default function ShiftScheduleMaker() {
  const [setup, setSetup] = useState<Setup>(sampleSetup)
  const [weeks, setWeeks] = useState<Record<string, WeekPlan>>({})
  const [week, setWeek] = useState('')
  const [activeId, setActiveId] = useState('e1')
  const [restored, setRestored] = useState(false)
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const baseId = useId()
  const pendingFocus = useRef('')
  const addShiftRef = useRef<HTMLButtonElement>(null)
  const addEmployeeRef = useRef<HTMLButtonElement>(null)

  const plan = weeks[week] ?? EMPTY_PLAN
  const model = useMemo(() => buildModel(setup, plan, week), [setup, plan, week])
  const activeIndex = Math.max(
    0,
    setup.employees.findIndex((employee) => employee.id === activeId),
  )
  const active = setup.employees[activeIndex] ?? null
  const activeLabel = active ? employeeLabel(active, activeIndex) : ''

  useEffect(() => {
    const stored = loadStored()
    const today = todayIso()
    if (stored) {
      setSetup(stored.setup)
      setWeeks(stored.weeks)
      setActiveId(stored.setup.employees[0]?.id ?? '')
    }
    const current = sundayOf(today)
    setWeek(stored?.week && stored.week >= current ? stored.week : defaultWeek(today))
    setRestored(true)
  }, [])

  useEffect(() => {
    if (restored && week) saveStored({ week, setup, weeks })
  }, [restored, week, setup, weeks])

  useEffect(() => {
    const target = pendingFocus.current
    if (!target) return
    pendingFocus.current = ''
    document.getElementById(target)?.focus()
  }, [setup])

  const track = (event: string, params: Record<string, string | number | boolean> = {}) =>
    window.gtag?.('event', event, {
      employees: setup.employees.length,
      shift_types: setup.shifts.length,
      needed: model.needed,
      filled: model.filled,
      ...params,
    })

  const savePlan = (next: WeekPlan) => {
    if (!week) return
    setWeeks((current) => pruneWeeks({ ...current, [week]: next }))
  }

  const goToWeek = (value: string) => {
    const sunday = sundayOf(value)
    if (!sunday) return
    setWeek(sunday)
    setStatus('')
    setAnnouncement(`השבוע ${weekRange(sunday)}`)
  }

  const setOpen = (dayIndex: number, open: boolean) =>
    savePlan({ ...plan, closed: plan.closed.map((closed, index) => (index === dayIndex ? !open : closed)) })

  const updateShift = (shiftId: string, patch: Partial<ShiftDef>) =>
    setSetup((current) => ({
      ...current,
      shifts: current.shifts.map((shift) => (shift.id === shiftId ? { ...shift, ...patch } : shift)),
    }))

  const addShift = () => {
    if (setup.shifts.length >= MAX_SHIFT_TYPES) return
    const id = nextId('s', setup.shifts)
    pendingFocus.current = `${baseId}-shift-${id}-name`
    setSetup((current) => ({ ...current, shifts: [...current.shifts, newShift(id)] }))
  }

  const removeShift = (shift: ShiftDef) => {
    const name = shift.name.trim() || 'החדשה'
    if (!window.confirm(`למחוק את המשמרת ${name} ואת כל השיבוצים שלה?`)) return
    setSetup((current) => ({ ...current, shifts: current.shifts.filter((item) => item.id !== shift.id) }))
    setWeeks((current) => mapWeeks(current, (item) => withoutShift(item, shift.id)))
    addShiftRef.current?.focus()
    setStatus(`המשמרת ${name} נמחקה`)
  }

  const updateEmployee = (employeeId: string, patch: Partial<Employee>) =>
    setSetup((current) => ({
      ...current,
      employees: current.employees.map((employee) =>
        employee.id === employeeId ? { ...employee, ...patch } : employee,
      ),
    }))

  const toggleOff = (employee: Employee, key: string) => {
    const has = employee.off.includes(key)
    const dayOnly = !key.includes(':')
    const off = has
      ? employee.off.filter((item) => item !== key)
      : [...employee.off.filter((item) => !(dayOnly && item.startsWith(`${key}:`))), key]
    updateEmployee(employee.id, { off })
  }

  const addEmployee = () => {
    if (setup.employees.length >= MAX_EMPLOYEES) return
    const id = nextId('e', setup.employees)
    pendingFocus.current = `${baseId}-employee-${id}-name`
    setSetup((current) => ({ ...current, employees: [...current.employees, newEmployee(id)] }))
    setActiveId(id)
  }

  const removeEmployee = (employee: Employee, index: number) => {
    const label = employeeLabel(employee, index)
    if (!window.confirm(`למחוק את ${label} מהרשימה ומכל הסידורים?`)) return
    setSetup((current) => ({ ...current, employees: current.employees.filter((item) => item.id !== employee.id) }))
    setWeeks((current) => mapWeeks(current, (item) => withoutEmployee(item, employee.id)))
    if (activeId === employee.id) setActiveId(setup.employees.find((item) => item.id !== employee.id)?.id ?? '')
    addEmployeeRef.current?.focus()
    setStatus(`${label} כבר לא ברשימה`)
  }

  const removeAllEmployees = () => {
    if (!setup.employees.length) return
    if (!window.confirm('למחוק את כל העובדים ואת כל השיבוצים?')) return
    setSetup((current) => ({ ...current, employees: [] }))
    setWeeks((current) => mapWeeks(current, (item) => ({ ...item, assignments: {} })))
    setActiveId('')
    addEmployeeRef.current?.focus()
    setStatus('הרשימה נמחקה. הוסיפו את העובדים שלכם.')
  }

  const toggleCell = (cell: Cell, day: ModelDay) => {
    if (!active || !week) return
    const list = plan.assignments[cell.key] ?? []
    const removing = list.includes(active.id)
    const next: WeekPlan = {
      ...plan,
      assignments: {
        ...plan.assignments,
        [cell.key]: removing ? list.filter((id) => id !== active.id) : [...list, active.id],
      },
    }
    savePlan(next)
    setStatus('')
    const nextModel = buildModel(setup, next, week)
    const nextCell = nextModel.cells[day.index].find((item) => item.key === cell.key)
    const before = new Set(model.issues.map((issue) => issue.text))
    const fresh = nextModel.issues
      .filter((issue) => issue.kind !== 'staffing' && !before.has(issue.text))
      .map((issue) => issue.text)
    const staffing = nextCell ? `${nextCell.assigned.length} מתוך ${nextCell.need}.` : ''
    setAnnouncement([staffing, ...fresh].join(' '))
  }

  const fill = () => {
    if (!week) return
    if (!setup.employees.length) {
      setStatus('הוסיפו עובדים כדי למלא את הסידור.')
      return
    }
    const result = autoFill(setup, plan)
    savePlan(result.plan)
    const added = result.added ? `שובצו ${shiftsText(result.added)}.` : 'לא נוספו שיבוצים.'
    const left = result.missing
      ? ` ${result.missing === 1 ? 'מקום אחד נשאר ריק' : `${result.missing} מקומות נשארו ריקים`}, כי אין עובד פנוי שעומד באילוצים, במקסימום המשמרות ובמנוחה.`
      : ' כל המשמרות מאוישות.'
    setStatus(`${added}${left}`)
    track('shift_autofill', { added: result.added, missing: result.missing })
  }

  const clearWeek = () => {
    if (!hasAssignments(plan)) return
    if (!window.confirm(`למחוק את כל השיבוצים בשבוע ${weekRange(week)}?`)) return
    savePlan({ ...plan, assignments: {} })
    setStatus('השיבוצים של השבוע נמחקו')
  }

  const copyLastWeek = () => {
    if (!week) return
    const previous = weeks[shiftWeek(week, -1)]
    if (!previous || !hasAssignments(previous)) {
      setStatus('אין בדפדפן הזה סידור שמור לשבוע הקודם.')
      return
    }
    if (hasAssignments(plan) && !window.confirm('להחליף את השיבוצים של השבוע הזה בסידור של השבוע הקודם?')) return
    savePlan({ ...plan, assignments: Object.fromEntries(Object.entries(previous.assignments).map(([key, ids]) => [key, [...ids]])) })
    setStatus('הסידור של השבוע הקודם הועתק. בדקו את האילוצים ואת ההתראות.')
  }

  const print = () => {
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
    frame.srcdoc = scheduleDocument(model)
    document.body.appendChild(frame)
    setStatus('נפתח חלון ההדפסה. כדי לקבל קובץ PDF, בחרו ביעד שמירה כ-PDF.')
    track('shift_print')
  }

  const downloadCsv = () => {
    downloadFile(scheduleCsv(model), 'text/csv;charset=utf-8', `${fileBase(model)}.csv`)
    setStatus('קובץ ה-CSV ירד. אפשר לפתוח אותו ב-Excel או ב-Google Sheets.')
    track('shift_csv', { format: 'csv' })
  }

  const downloadXlsx = () => {
    downloadFile(scheduleXlsx(model), XLSX_TYPE, `${fileBase(model)}.xlsx`)
    setStatus('קובץ האקסל ירד.')
    track('shift_csv', { format: 'xlsx' })
  }

  const copyTeam = async () => {
    try {
      await navigator.clipboard.writeText(teamMessage(model))
      setStatus('הסידור הועתק. הדביקו אותו בקבוצת הוואטסאפ של העובדים.')
      track('shift_whatsapp_copy', { scope: 'team' })
    } catch {
      setStatus('ההעתקה נכשלה. נסו שוב, או הורידו את הסידור כקובץ.')
    }
  }

  const rows: GridStyle[] = model.shifts.map((_, index) => ({ '--row': index + 2 }))

  return (
    <section className={`${ui.tool} ${styles.maker}`} aria-label="בניית סידור עבודה">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={styles.setup} onSubmit={(event) => event.preventDefault()}>
          <div className={styles.column}>
            <fieldset className={ui.group}>
              <legend className={ui.legend}>השבוע</legend>
              <div className={styles.weekRow}>
                <button type="button" className={`${ui.secondary} ${styles.weekPrev}`} onClick={() => week && goToWeek(shiftWeek(week, -1))}>
                  <ChevronRight aria-hidden="true" />
                  השבוע הקודם
                </button>
                <div className={`${ui.field} ${styles.weekField}`}>
                  <label htmlFor={`${baseId}-week`} className={ui.label}>
                    יום ראשון של השבוע
                  </label>
                  <input
                    id={`${baseId}-week`}
                    type="date"
                    className={`${ui.input} ${styles.weekInput}`}
                    min={MIN_WEEK_DATE}
                    max={MAX_WEEK_DATE}
                    value={week}
                    onChange={(event) => goToWeek(event.target.value)}
                  />
                </div>
                <button type="button" className={`${ui.secondary} ${styles.weekNext}`} onClick={() => week && goToWeek(shiftWeek(week, 1))}>
                  השבוע הבא
                  <ChevronLeft aria-hidden="true" />
                </button>
              </div>
              <fieldset className={ui.group}>
                <legend className={ui.legend}>ימים שהעסק פתוח</legend>
                <div className={styles.days}>
                  {model.days.map((day) => (
                    <label key={day.index} className={styles.dayOption} data-tone={day.tone || undefined}>
                      <input type="checkbox" checked={!day.closed} onChange={(event) => setOpen(day.index, event.target.checked)} />
                      <span className={styles.dayName}>{DAY_NAMES[day.index]}</span>
                      {day.date ? <span className={styles.dayDate}>{day.date}</span> : null}
                      {day.closed ? <span className={styles.dayState}>סגור</span> : null}
                      {day.tag ? <span className={styles.dayTag}>{day.tag}</span> : null}
                    </label>
                  ))}
                </div>
              </fieldset>
            </fieldset>

            <fieldset className={ui.group}>
              <legend className={ui.legend}>משמרות</legend>
              <ul className={styles.cards}>
                {setup.shifts.map((shift) => (
                  <ShiftEditor
                    key={shift.id}
                    shift={shift}
                    baseId={baseId}
                    onChange={(patch) => updateShift(shift.id, patch)}
                    onRemove={() => removeShift(shift)}
                  />
                ))}
              </ul>
              {setup.shifts.length < MAX_SHIFT_TYPES ? (
                <div className={styles.listActions}>
                  <button ref={addShiftRef} type="button" className={ui.secondary} onClick={addShift}>
                    <Plus aria-hidden="true" />
                    הוספת משמרת
                  </button>
                </div>
              ) : null}
            </fieldset>
          </div>

          <div className={styles.column}>
            <fieldset className={ui.group}>
              <legend className={ui.legend}>עובדים ואילוצים</legend>
              {setup.employees.length ? (
                <ul className={styles.cards}>
                  {setup.employees.map((employee, index) => (
                    <EmployeeEditor
                      key={employee.id}
                      employee={employee}
                      index={index}
                      shifts={setup.shifts}
                      baseId={baseId}
                      onChange={(patch) => updateEmployee(employee.id, patch)}
                      onToggleOff={(key) => toggleOff(employee, key)}
                      onRemove={() => removeEmployee(employee, index)}
                    />
                  ))}
                </ul>
              ) : (
                <p className={styles.meta}>עוד אין עובדים ברשימה.</p>
              )}
              <div className={styles.listActions}>
                {setup.employees.length < MAX_EMPLOYEES ? (
                  <button ref={addEmployeeRef} type="button" className={ui.secondary} onClick={addEmployee}>
                    <UserPlus aria-hidden="true" />
                    הוספת עובד
                  </button>
                ) : null}
                {setup.employees.length ? (
                  <button type="button" className={styles.textButton} onClick={removeAllEmployees}>
                    מחיקת כל העובדים
                  </button>
                ) : null}
              </div>
            </fieldset>
          </div>
        </form>

        <div className={styles.board}>
          <div className={styles.boardHead}>
            <h2 className={styles.boardTitle}>
              הסידור{model.week ? <span className={styles.boardRange}>{weekRange(model.week)}</span> : null}
            </h2>
            <div className={styles.toolbar}>
              <button type="button" className={ui.primary} onClick={fill}>
                <WandSparkles aria-hidden="true" />
                מילוי אוטומטי
              </button>
              <button type="button" className={ui.secondary} onClick={copyLastWeek}>
                <History aria-hidden="true" />
                העתקת השבוע הקודם
              </button>
              <button type="button" className={ui.secondary} onClick={clearWeek}>
                <Eraser aria-hidden="true" />
                ניקוי השבוע
              </button>
            </div>
          </div>

          {setup.employees.length ? (
            <fieldset className={styles.palette}>
              <legend className={styles.paletteLegend}>את מי משבצים? בוחרים עובד ולוחצים על המשמרות שלו</legend>
              <div className={styles.picks}>
                {model.totals.map((total) => (
                  <label key={total.employee.id} className={styles.pick}>
                    <input
                      type="radio"
                      name={`${baseId}-active`}
                      value={total.employee.id}
                      checked={active?.id === total.employee.id}
                      onChange={() => setActiveId(total.employee.id)}
                    />
                    <span>{total.label}</span>
                    <span className={styles.pickCount}>
                      {total.shifts}/{total.employee.maxShifts}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}

          <div className={styles.grid}>
            {model.shifts.map((shift, index) => (
              <div key={shift.id} className={styles.rowHead} style={rows[index]} aria-hidden="true">
                <span>{shift.name.trim() || 'משמרת'}</span>
                <span className={styles.rowHours} dir="ltr">
                  {shiftHours(shift)}
                </span>
              </div>
            ))}
            {model.days.map((day) => {
              const column: GridStyle = { '--col': day.index + 2, '--span': Math.max(1, model.shifts.length) }
              return (
                <div key={day.index} className={styles.day} data-tone={day.tone || undefined}>
                  <h3 className={styles.dayHead} style={column}>
                    <span>{day.name}</span>
                    {day.date ? <span className={styles.dayHeadDate}>{day.date}</span> : null}
                    {day.tag ? <span className={styles.dayHeadTag}>{day.tag}</span> : null}
                  </h3>
                  {day.closed ? (
                    <div className={styles.closedCell} style={column}>
                      סגור
                    </div>
                  ) : (
                    model.cells[day.index].map((cell, row) => (
                      <ScheduleCell
                        key={cell.key}
                        cell={cell}
                        day={day}
                        row={row}
                        active={active}
                        activeLabel={activeLabel}
                        describedBy={`${baseId}-cell-${cell.key}`}
                        onToggle={() => toggleCell(cell, day)}
                      />
                    ))
                  )}
                </div>
              )
            })}
          </div>
          <p className={styles.srOnly} role="status" aria-live="polite">
            {announcement}
          </p>

          <div className={styles.after}>
            <section className={styles.panel} aria-labelledby={`${baseId}-issues`}>
              <h3 id={`${baseId}-issues`} className={styles.panelTitle}>
                התראות
              </h3>
              {model.issues.length ? (
                <ul className={styles.issues}>
                  {model.issues.map((issue) => (
                    <li key={`${issue.kind}-${issue.text}`} className={styles.issue} data-kind={issue.kind}>
                      {issue.text}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.clear}>
                  {model.assigned
                    ? 'אין התראות: כל המשמרות מאוישות, אין חריגה ממקסימום המשמרות, ויש מנוחה בין המשמרות.'
                    : 'עוד אין שיבוצים בשבוע הזה.'}
                </p>
              )}
            </section>

            <section className={styles.panel} aria-labelledby={`${baseId}-totals`}>
              <h3 id={`${baseId}-totals`} className={styles.panelTitle}>
                סיכום לכל עובד
              </h3>
              {model.totals.length ? (
                <table className={styles.totals}>
                  <thead>
                    <tr>
                      <th scope="col">עובד</th>
                      <th scope="col">משמרות</th>
                      <th scope="col">שעות</th>
                      <th scope="col">וואטסאפ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {model.totals.map((total) => (
                      <tr key={total.employee.id}>
                        <th scope="row">
                          {total.label}
                          {total.employee.role.trim() ? (
                            <span className={styles.role}>{total.employee.role.trim()}</span>
                          ) : null}
                        </th>
                        <td>
                          <span aria-hidden="true" dir="ltr">
                            {total.shifts}
                            <span className={styles.ofMax}>/{total.employee.maxShifts}</span>
                          </span>
                          <span className={styles.srOnly}>
                            {total.shifts} מתוך {total.employee.maxShifts}
                          </span>
                        </td>
                        <td>{formatHours(total.minutes)}</td>
                        <td>
                          <a
                            className={styles.waLink}
                            href={employeeLink(model, total)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`שליחה בוואטסאפ ל${total.label}`}
                            onClick={() =>
                              track('shift_whatsapp_copy', {
                                scope: 'employee',
                                has_phone: Boolean(phoneDigits(total.employee.phone)),
                              })
                            }
                          >
                            <MessageCircle aria-hidden="true" />
                            שליחה
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className={styles.meta}>הוסיפו עובדים כדי לראות סיכום.</p>
              )}
            </section>
          </div>

          <div className={styles.exports}>
            <h3 className={styles.panelTitle}>שליחה, הדפסה ואקסל</h3>
            <div className={styles.exportActions}>
              <button type="button" className={ui.primary} onClick={copyTeam}>
                <Copy aria-hidden="true" />
                העתקה לוואטסאפ
              </button>
              <button type="button" className={ui.secondary} onClick={print}>
                <Printer aria-hidden="true" />
                הדפסה או PDF
              </button>
              <button type="button" className={ui.secondary} onClick={downloadXlsx}>
                <FileSpreadsheet aria-hidden="true" />
                הורדה לאקסל
              </button>
              <button type="button" className={ui.secondary} onClick={downloadCsv}>
                <FileText aria-hidden="true" />
                הורדת CSV
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>
              הסידור נשמר רק בדפדפן הזה ולא נשלח לשום שרת. בשבוע הבא פותחים את הדף ולוחצים על ״העתקת השבוע הקודם״.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
