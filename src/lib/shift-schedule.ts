import {
  MAX_YEAR,
  MIN_YEAR,
  dayFromIso,
  formatDayMonth,
  formatShortDate,
  isoFromDay,
  specialDaysBetween,
  weekdayOf,
  yearOf,
} from '@/lib/work-days'
import { buildWhatsAppLink, normalizePhone } from '@/lib/whatsapp-link'

export type ShiftDef = { id: string; name: string; start: string; end: string; need: number[] }

export type Employee = {
  id: string
  name: string
  role: string
  phone: string
  maxShifts: number
  off: string[]
}

export type Setup = { shifts: ShiftDef[]; employees: Employee[] }

export type Assignments = Record<string, string[]>

export type WeekPlan = { closed: boolean[]; assignments: Assignments }

export type DayTone = 'rest' | 'eve' | 'chol' | ''

export type WeekDay = {
  index: number
  day: number | null
  date: string
  name: string
  short: string
  tag: string
  tone: DayTone
}

export type ModelDay = WeekDay & { closed: boolean }

export type CellStatus = 'closed' | 'idle' | 'ok' | 'under' | 'over'

export type Person = { id: string; label: string }

export type Cell = {
  key: string
  dayIndex: number
  shift: ShiftDef
  need: number
  assigned: Person[]
  status: CellStatus
  gap: number
}

export type Slot = { dayIndex: number; shift: ShiftDef; start: number; end: number }

export type EmployeeTotal = { employee: Employee; label: string; shifts: number; minutes: number; slots: Slot[] }

export type IssueKind = 'staffing' | 'constraint' | 'overlap' | 'rest' | 'weekly-rest' | 'max'

export type Issue = { kind: IssueKind; employeeId: string; text: string }

export type ScheduleModel = {
  week: string
  days: ModelDay[]
  shifts: ShiftDef[]
  cells: Cell[][]
  totals: EmployeeTotal[]
  issues: Issue[]
  needed: number
  filled: number
  missing: number
  assigned: number
}

export type FillResult = { plan: WeekPlan; added: number; missing: number }

export type Stored = { week: string; setup: Setup; weeks: Record<string, WeekPlan> }

export type SheetRow = { kind: 'title' | 'note' | 'blank' | 'header' | 'body'; cells: (string | number)[] }

export const DAY_COUNT = 7
export const MIN_REST_HOURS = 8
export const WEEKLY_REST_HOURS = 36
export const MAX_SHIFT_TYPES = 5
export const MAX_EMPLOYEES = 30
export const MAX_NEED = 9
export const MAX_WEEK_SHIFTS = 7
export const DEFAULT_MAX_SHIFTS = 5
export const NAME_LIMIT = 40
export const PHONE_LIMIT = 24
export const STORED_WEEKS = 26
export const TOOL_URL = 'https://www.aiterra.co.il/tools/shift-schedule-maker'
export const MIN_WEEK_DATE = `${MIN_YEAR}-01-01`
export const MAX_WEEK_DATE = `${MAX_YEAR}-12-31`

const MINUTES_PER_DAY = 1440
const WEEK_MINUTES = DAY_COUNT * MINUTES_PER_DAY
const MIN_REST = MIN_REST_HOURS * 60
const WEEKLY_REST = WEEKLY_REST_HOURS * 60
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const TIME = /^(\d{1,2}):(\d{2})$/
const ID = /^[a-z]\d{1,4}$/
const OFF_KEY = /^[0-6](:[a-z]\d{1,4})?$/
const SLOT_KEY = /^[0-6]:[a-z]\d{1,4}$/

export const DAY_NAMES = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']

const DAY_LETTERS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳']

export const dayName = (index: number) => (index === 6 ? 'שבת' : `יום ${DAY_NAMES[index]}`)

export const dayShort = (index: number) => (index === 6 ? 'שבת' : `יום ${DAY_LETTERS[index]}`)

const onDay = (index: number) => (index === 6 ? 'בשבת' : `ביום ${DAY_LETTERS[index]}`)

export const slotKey = (dayIndex: number, shiftId: string) => `${dayIndex}:${shiftId}`

const hoursFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 2 })

export const formatHours = (minutes: number) => hoursFormat.format(minutes / 60)

export const plainHours = (minutes: number) => Math.round((minutes / 60) * 100) / 100

export const hoursText = (minutes: number) => (minutes === 60 ? 'שעה אחת' : `${formatHours(minutes)} שעות`)

export const shiftsText = (count: number) => (count === 1 ? 'משמרת אחת' : `${count} משמרות`)

export const missingText = (count: number) => (count === 1 ? 'חסר עובד אחד' : `חסרים ${count} עובדים`)

export function parseTime(value: string): number | null {
  const match = TIME.exec(value.trim())
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) return null
  return hours * 60 + minutes
}

export const shiftValid = (shift: Pick<ShiftDef, 'start' | 'end'>) =>
  parseTime(shift.start) !== null && parseTime(shift.end) !== null

export function shiftMinutes(shift: Pick<ShiftDef, 'start' | 'end'>) {
  const start = parseTime(shift.start)
  const end = parseTime(shift.end)
  if (start === null || end === null) return 0
  return (end - start + MINUTES_PER_DAY) % MINUTES_PER_DAY || MINUTES_PER_DAY
}

export const shiftHours = (shift: Pick<ShiftDef, 'start' | 'end'>) => `${shift.start}-${shift.end}`

export const employeeLabel = (employee: Employee, index: number) => employee.name.trim() || `עובד ${index + 1}`

export const isOff = (employee: Employee, dayIndex: number, shiftId: string) =>
  employee.off.includes(String(dayIndex)) || employee.off.includes(slotKey(dayIndex, shiftId))

export function sundayOf(iso: string) {
  if (!ISO_DATE.test(iso)) return ''
  const day = dayFromIso(iso)
  if (!Number.isFinite(day)) return ''
  const year = yearOf(day)
  if (year < MIN_YEAR || year > MAX_YEAR) return ''
  return isoFromDay(day - weekdayOf(day))
}

export const shiftWeek = (week: string, count: number) => isoFromDay(dayFromIso(week) + count * DAY_COUNT)

export function defaultWeek(today: string) {
  const day = dayFromIso(today)
  const weekday = weekdayOf(day)
  return isoFromDay(day - weekday + (weekday >= 4 ? DAY_COUNT : 0))
}

export function weekSpan(week: string) {
  if (!week) return ''
  const start = dayFromIso(week)
  return `${formatDayMonth(start)}-${formatDayMonth(start + 6)}`
}

export function weekRange(week: string) {
  if (!week) return ''
  const start = dayFromIso(week)
  return `${formatShortDate(start)} עד ${formatShortDate(start + 6)}`
}

export function weekDays(week: string): WeekDay[] {
  const start = week ? dayFromIso(week) : null
  const specials = start === null ? null : specialDaysBetween(start, start + 6)
  return Array.from({ length: DAY_COUNT }, (_, index) => {
    const day = start === null ? null : start + index
    const special = day === null ? undefined : specials?.get(day)
    const tone: DayTone =
      index === 6 || special?.kind === 'rest'
        ? 'rest'
        : special?.kind === 'chol-hamoed'
          ? 'chol'
          : special
            ? 'eve'
            : ''
    return {
      index,
      day,
      date: day === null ? '' : formatDayMonth(day),
      name: dayName(index),
      short: dayShort(index),
      tag: special?.name ?? '',
      tone,
    }
  })
}

export const dayTitle = (day: WeekDay) => (day.date ? `${day.name} ${day.date}` : day.name)

const dayHeading = (day: WeekDay) => (day.tag ? `${dayTitle(day)} (${day.tag})` : dayTitle(day))

const needAll = (value: number) => Array.from({ length: DAY_COUNT }, () => value)

export const defaultShifts = (): ShiftDef[] => [
  { id: 's1', name: 'בוקר', start: '07:00', end: '15:00', need: [2, 2, 2, 2, 2, 2, 1] },
  { id: 's2', name: 'ערב', start: '15:00', end: '23:00', need: [2, 2, 2, 2, 2, 1, 1] },
  { id: 's3', name: 'לילה', start: '23:00', end: '07:00', need: needAll(1) },
]

export const sampleEmployees = (): Employee[] => [
  { id: 'e1', name: 'דנה', role: 'אחראית משמרת', phone: '', maxShifts: 5, off: [] },
  { id: 'e2', name: 'יוסי', role: '', phone: '', maxShifts: 5, off: ['6'] },
  { id: 'e3', name: 'מיכל', role: 'סטודנטית', phone: '', maxShifts: 3, off: ['0', '2'] },
  { id: 'e4', name: 'אבי', role: '', phone: '', maxShifts: 5, off: ['5:s3', '6:s3'] },
  { id: 'e5', name: 'נועה', role: '', phone: '', maxShifts: 5, off: ['1:s1'] },
  { id: 'e6', name: 'עומר', role: '', phone: '', maxShifts: 5, off: [] },
  { id: 'e7', name: 'שירה', role: '', phone: '', maxShifts: 5, off: ['4'] },
]

export const sampleSetup = (): Setup => ({ shifts: defaultShifts(), employees: sampleEmployees() })

export const emptyPlan = (): WeekPlan => ({ closed: Array.from({ length: DAY_COUNT }, () => false), assignments: {} })

export const newShift = (id: string): ShiftDef => ({ id, name: '', start: '09:00', end: '17:00', need: needAll(1) })

export const newEmployee = (id: string): Employee => ({
  id,
  name: '',
  role: '',
  phone: '',
  maxShifts: DEFAULT_MAX_SHIFTS,
  off: [],
})

export function nextId(prefix: 's' | 'e', items: { id: string }[]) {
  const numbers = items.map((item) => Number(item.id.slice(1))).filter((value) => Number.isFinite(value))
  return `${prefix}${Math.max(0, ...numbers) + 1}`
}

export const hasAssignments = (plan: WeekPlan) => Object.values(plan.assignments).some((list) => list.length > 0)

const slotOf = (dayIndex: number, shift: ShiftDef): Slot | null => {
  const start = parseTime(shift.start)
  if (start === null || parseTime(shift.end) === null) return null
  const from = dayIndex * MINUTES_PER_DAY + start
  return { dayIndex, shift, start: from, end: from + shiftMinutes(shift) }
}

const restBetween = (a: Slot, b: Slot) => (a.start <= b.start ? b.start - a.end : a.start - b.end)

export function longestRest(slots: Slot[]) {
  if (!slots.length) return WEEK_MINUTES
  const sorted = [...slots].sort((a, b) => a.start - b.start)
  let longest = 0
  let reach = sorted[0].end
  for (const slot of sorted.slice(1)) {
    longest = Math.max(longest, slot.start - reach)
    reach = Math.max(reach, slot.end)
  }
  return Math.max(0, longest, sorted[0].start + WEEK_MINUTES - reach)
}

const uniqueIds = (ids: string[]) => ids.filter((id, index) => ids.indexOf(id) === index)

const restIssue = (label: string, first: Slot, second: Slot, gap: number) => {
  const rest = gap === 0 ? 'אין מנוחה' : `רק ${hoursText(gap)} מנוחה`
  return (
    `${label}: ${rest} בין ${first.shift.name} ${onDay(first.dayIndex)} לבין ${second.shift.name} ` +
    `${onDay(second.dayIndex)}. לפי החוק צריך לפחות ${MIN_REST_HOURS} שעות.`
  )
}

function employeeIssues(total: EmployeeTotal): Issue[] {
  const { employee, label } = total
  const issues: Issue[] = []
  const sorted = [...total.slots].sort((a, b) => a.start - b.start)
  sorted.forEach((slot, index) => {
    const next = sorted[index + 1]
    if (!next) return
    const gap = next.start - slot.end
    if (gap < 0) {
      issues.push({
        kind: 'overlap',
        employeeId: employee.id,
        text: `${label}: שתי משמרות חופפות, ${slot.shift.name} ${onDay(slot.dayIndex)} ו-${next.shift.name} ${onDay(next.dayIndex)}.`,
      })
    } else if (gap < MIN_REST) {
      issues.push({ kind: 'rest', employeeId: employee.id, text: restIssue(label, slot, next, gap) })
    }
  })
  if (sorted.length) {
    const longest = longestRest(sorted)
    if (longest < WEEKLY_REST) {
      issues.push({
        kind: 'weekly-rest',
        employeeId: employee.id,
        text: `${label}: אין השבוע ${WEEKLY_REST_HOURS} שעות מנוחה רצופות. הרצף הארוך ביותר הוא ${hoursText(longest)}.`,
      })
    }
  }
  if (total.shifts > employee.maxShifts) {
    issues.push({
      kind: 'max',
      employeeId: employee.id,
      text: `${label}: ${shiftsText(total.shifts)}, יותר מ-${employee.maxShifts} שהגדרתם.`,
    })
  }
  return issues
}

export function buildModel(setup: Setup, plan: WeekPlan, week: string): ScheduleModel {
  const days = weekDays(week).map((day) => ({ ...day, closed: plan.closed[day.index] === true }))
  const order = new Map(setup.employees.map((employee, index) => [employee.id, index]))
  const totals: EmployeeTotal[] = setup.employees.map((employee, index) => ({
    employee,
    label: employeeLabel(employee, index),
    shifts: 0,
    minutes: 0,
    slots: [],
  }))
  const constraintIssues: Issue[] = []
  let needed = 0
  let filled = 0
  let missing = 0
  let assigned = 0
  let underCells = 0

  const cells = days.map((day) =>
    setup.shifts.map((shift): Cell => {
      const key = slotKey(day.index, shift.id)
      const need = day.closed ? 0 : (shift.need[day.index] ?? 0)
      const ids = day.closed
        ? []
        : uniqueIds(plan.assignments[key] ?? [])
            .filter((id) => order.has(id))
            .sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0))
      const slot = slotOf(day.index, shift)
      const people = ids.map((id) => {
        const total = totals[order.get(id) ?? 0]
        total.shifts += 1
        total.minutes += shiftMinutes(shift)
        if (slot) total.slots.push(slot)
        if (isOff(total.employee, day.index, shift.id)) {
          constraintIssues.push({
            kind: 'constraint',
            employeeId: id,
            text: `${total.label}: ${shift.name} ${onDay(day.index)} מסומן כאילוץ.`,
          })
        }
        return { id, label: total.label }
      })
      const gap = need - ids.length
      needed += need
      filled += Math.min(need, ids.length)
      assigned += ids.length
      if (gap > 0) {
        missing += gap
        underCells += 1
      }
      const status: CellStatus = day.closed
        ? 'closed'
        : !need && !ids.length
          ? 'idle'
          : gap > 0
            ? 'under'
            : gap < 0
              ? 'over'
              : 'ok'
      return { key, dayIndex: day.index, shift, need, assigned: people, status, gap }
    }),
  )

  const staffing: Issue[] = missing
    ? [
        {
          kind: 'staffing',
          employeeId: '',
          text:
            underCells === 1
              ? `במשמרת אחת ${missingText(missing)}.`
              : `ב-${underCells} משמרות ${missingText(missing)} בסך הכול.`,
        },
      ]
    : []

  return {
    week,
    days,
    shifts: setup.shifts,
    cells,
    totals,
    issues: [...staffing, ...constraintIssues, ...totals.flatMap(employeeIssues)],
    needed,
    filled,
    missing,
    assigned,
  }
}

type OpenSlot = { key: string; slot: Slot; order: number; shiftIndex: number; missing: number; ids: string[] }

type Candidate = { employee: Employee; index: number }

const MAX_FILL_ROUNDS = 20

const compareRanks = (a: number[], b: number[]) => {
  for (let index = 0; index < a.length; index += 1) {
    if (a[index] !== b[index]) return a[index] - b[index]
  }
  return 0
}

export function autoFill(setup: Setup, plan: WeekPlan): FillResult {
  const employees = setup.employees
  const known = new Set(employees.map((employee) => employee.id))
  const held = new Map<string, Slot[]>(employees.map((employee) => [employee.id, []]))
  const placed = new Set<string>()
  const assignments: Assignments = {}
  for (const [key, ids] of Object.entries(plan.assignments)) assignments[key] = [...ids]
  const open: OpenSlot[] = []

  for (let dayIndex = 0; dayIndex < DAY_COUNT; dayIndex += 1) {
    if (plan.closed[dayIndex]) continue
    setup.shifts.forEach((shift, shiftIndex) => {
      const slot = slotOf(dayIndex, shift)
      if (!slot) return
      const key = slotKey(dayIndex, shift.id)
      const ids = uniqueIds(assignments[key] ?? []).filter((id) => known.has(id))
      assignments[key] = ids
      ids.forEach((id) => held.get(id)?.push(slot))
      const need = shift.need[dayIndex] ?? 0
      if (need > ids.length) {
        const order = dayIndex * setup.shifts.length + shiftIndex
        open.push({ key, slot, order, shiftIndex, missing: need - ids.length, ids })
      }
    })
  }
  open.sort((a, b) => a.slot.start - b.slot.start || a.shiftIndex - b.shiftIndex)
  const openByKey = new Map(open.map((target) => [target.key, target]))

  const eligible = (employee: Employee, target: OpenSlot, without?: Slot) => {
    const slots = (held.get(employee.id) ?? []).filter((slot) => slot !== without)
    if (target.ids.includes(employee.id)) return false
    if (isOff(employee, target.slot.dayIndex, target.slot.shift.id)) return false
    if (slots.length >= employee.maxShifts) return false
    if (slots.some((slot) => slot.dayIndex === target.slot.dayIndex)) return false
    if (slots.some((slot) => restBetween(slot, target.slot) < MIN_REST)) return false
    return longestRest([...slots, target.slot]) >= WEEKLY_REST
  }

  const rank = ({ employee, index }: Candidate, target: OpenSlot) => {
    const slots = held.get(employee.id) ?? []
    const size = employees.length
    return [
      slots.length,
      slots.filter((slot) => slot.shift.id === target.slot.shift.id).length,
      slots.reduce((sum, slot) => sum + slot.end - slot.start, 0),
      (index - (target.order % size) + size) % size,
      index,
    ]
  }

  const place = (employee: Employee, target: OpenSlot) => {
    target.ids.push(employee.id)
    assignments[target.key] = [...target.ids]
    held.get(employee.id)?.push(target.slot)
    placed.add(`${target.key}|${employee.id}`)
    target.missing -= 1
  }

  const unplace = (employee: Employee, target: OpenSlot) => {
    target.ids = target.ids.filter((id) => id !== employee.id)
    assignments[target.key] = [...target.ids]
    held.set(
      employee.id,
      (held.get(employee.id) ?? []).filter((slot) => slot !== target.slot),
    )
    placed.delete(`${target.key}|${employee.id}`)
    target.missing += 1
  }

  const candidatesFor = (target: OpenSlot) =>
    employees.map((employee, index) => ({ employee, index })).filter(({ employee }) => eligible(employee, target))

  const fillGreedy = () => {
    let added = 0
    for (;;) {
      let best: { target: OpenSlot; candidates: Candidate[] } | null = null
      for (const target of open) {
        if (target.missing <= 0) continue
        const candidates = candidatesFor(target)
        if (!candidates.length) continue
        if (!best || candidates.length < best.candidates.length) best = { target, candidates }
      }
      if (!best) return added
      const { target, candidates } = best
      const pick = candidates
        .map((candidate) => ({ candidate, key: rank(candidate, target) }))
        .sort((a, b) => compareRanks(a.key, b.key))[0].candidate
      place(pick.employee, target)
      added += 1
    }
  }

  const repairOne = (target: OpenSlot) => {
    for (const employee of employees) {
      for (const slot of [...(held.get(employee.id) ?? [])]) {
        const source = openByKey.get(slotKey(slot.dayIndex, slot.shift.id))
        if (!source || source === target || !placed.has(`${source.key}|${employee.id}`)) continue
        if (!eligible(employee, target, slot)) continue
        unplace(employee, source)
        const replacement = candidatesFor(source)
          .filter((candidate) => candidate.employee.id !== employee.id)
          .map((candidate) => ({ candidate, key: rank(candidate, source) }))
          .sort((a, b) => compareRanks(a.key, b.key))[0]?.candidate
        if (replacement && eligible(employee, target)) {
          place(employee, target)
          place(replacement.employee, source)
          return true
        }
        place(employee, source)
      }
    }
    return false
  }

  let added = fillGreedy()
  for (let round = 0; round < MAX_FILL_ROUNDS; round += 1) {
    const repaired = open.filter((target) => target.missing > 0 && repairOne(target)).length
    if (!repaired) break
    added += repaired + fillGreedy()
  }

  for (const key of Object.keys(assignments)) {
    if (!assignments[key].length) delete assignments[key]
  }
  const missing = open.reduce((sum, target) => sum + Math.max(0, target.missing), 0)
  return { plan: { closed: [...plan.closed], assignments }, added, missing }
}

const cellNames = (cell: Cell, separator: string) =>
  cell.status === 'closed' ? 'סגור' : cell.assigned.map((person) => person.label).join(separator)

export function teamMessage(model: ScheduleModel) {
  const span = weekSpan(model.week)
  const lines = [span ? `*סידור עבודה ${span}*` : '*סידור עבודה*']
  for (const day of model.days) {
    lines.push('', `*${dayTitle(day)}*${day.tag ? ` (${day.tag})` : ''}`)
    if (day.closed) {
      lines.push('סגור')
      continue
    }
    const rows = model.cells[day.index]
      .filter((cell) => cell.need > 0 || cell.assigned.length > 0)
      .map((cell) => `${cell.shift.name} ${shiftHours(cell.shift)}: ${cellNames(cell, ', ') || 'טרם שובץ'}`)
    lines.push(...(rows.length ? rows : ['אין משמרות']))
  }
  return lines.join('\n')
}

export function employeeMessage(model: ScheduleModel, total: EmployeeTotal) {
  const span = weekSpan(model.week)
  if (!total.slots.length) return `היי ${total.label}, בשבוע ${span} אין לך משמרות.`
  const rows = [...total.slots]
    .sort((a, b) => a.start - b.start)
    .map((slot) => `${dayTitle(model.days[slot.dayIndex])}: ${slot.shift.name} ${shiftHours(slot.shift)}`)
  return [
    `היי ${total.label}, המשמרות שלך בשבוע ${span}:`,
    ...rows,
    `סה״כ ${shiftsText(total.shifts)}, ${hoursText(total.minutes)}.`,
  ].join('\n')
}

export function phoneDigits(phone: string) {
  const result = normalizePhone(phone)
  return result.status === 'valid' ? result.digits : ''
}

export const phoneError = (phone: string) => {
  const result = normalizePhone(phone)
  return result.status === 'invalid' ? result.error : ''
}

export const employeeLink = (model: ScheduleModel, total: EmployeeTotal) =>
  buildWhatsAppLink(phoneDigits(total.employee.phone), employeeMessage(model, total))

export function sheetRows(model: ScheduleModel, separator: string): SheetRow[] {
  return [
    { kind: 'title', cells: ['סידור עבודה'] },
    { kind: 'note', cells: [weekRange(model.week)] },
    { kind: 'blank', cells: [] },
    { kind: 'header', cells: ['משמרת', 'שעות', ...model.days.map(dayHeading)] },
    ...model.shifts.map(
      (shift, shiftIndex): SheetRow => ({
        kind: 'body',
        cells: [
          shift.name,
          shiftHours(shift),
          ...model.days.map((day) => cellNames(model.cells[day.index][shiftIndex], separator)),
        ],
      }),
    ),
    { kind: 'blank', cells: [] },
    { kind: 'header', cells: ['עובד', 'תפקיד', 'משמרות', 'שעות'] },
    ...model.totals.map(
      (total): SheetRow => ({
        kind: 'body',
        cells: [total.label, total.employee.role.trim(), total.shifts, plainHours(total.minutes)],
      }),
    ),
  ]
}

const UTF8_BOM = String.fromCharCode(0xfeff)

const csvCell = (value: string | number) => {
  const text = String(value)
  const safe = typeof value === 'string' && /^[=+\-@\t\r]/.test(text) ? `'${text}` : text
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
}

export function scheduleCsv(model: ScheduleModel) {
  const lines = sheetRows(model, ', ').map((row) => row.cells.map(csvCell).join(','))
  return `${UTF8_BOM}${lines.join('\r\n')}\r\n`
}

const escapeXml = (value: string) =>
  value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f￾￿]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const columnName = (index: number) => String.fromCharCode(65 + index)

const XML_HEAD = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
const MAIN_NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
const REL_NS = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
const PKG_REL_NS = 'http://schemas.openxmlformats.org/package/2006/relationships'
const STYLE_FOR: Record<SheetRow['kind'], number> = { title: 1, note: 0, blank: 0, header: 2, body: 3 }

const contentTypes = `${XML_HEAD}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`

const rootRels = `${XML_HEAD}<Relationships xmlns="${PKG_REL_NS}"><Relationship Id="rId1" Type="${REL_NS}/officeDocument" Target="xl/workbook.xml"/></Relationships>`

const workbookRels = `${XML_HEAD}<Relationships xmlns="${PKG_REL_NS}"><Relationship Id="rId1" Type="${REL_NS}/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="${REL_NS}/styles" Target="styles.xml"/></Relationships>`

const workbook = `${XML_HEAD}<workbook xmlns="${MAIN_NS}" xmlns:r="${REL_NS}"><bookViews><workbookView/></bookViews><sheets><sheet name="סידור עבודה" sheetId="1" r:id="rId1"/></sheets></workbook>`

const BORDER_SIDE = '<color rgb="FFD9D3CA"/>'

const styles = `${XML_HEAD}<styleSheet xmlns="${MAIN_NS}"><fonts count="3"><font><sz val="11"/><name val="Arial"/></font><font><b/><sz val="11"/><name val="Arial"/></font><font><b/><sz val="14"/><name val="Arial"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF1EEE9"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin">${BORDER_SIDE}</left><right style="thin">${BORDER_SIDE}</right><top style="thin">${BORDER_SIDE}</top><bottom style="thin">${BORDER_SIDE}</bottom><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="4"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`

function worksheet(rows: SheetRow[]) {
  const widths = [14, 13, ...needAll(18)]
  const cols = widths
    .map((width, index) => `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`)
    .join('')
  const body = rows
    .map((row, rowIndex) => {
      const number = rowIndex + 1
      const style = STYLE_FOR[row.kind]
      const lines = Math.max(1, ...row.cells.map((cell) => String(cell).split('\n').length))
      const height = row.kind === 'title' ? ' ht="22" customHeight="1"' : lines > 1 ? ` ht="${lines * 15}" customHeight="1"` : ''
      const cells = row.cells
        .map((cell, cellIndex) => {
          const ref = `${columnName(cellIndex)}${number}`
          if (typeof cell === 'number') return `<c r="${ref}" s="${style}"><v>${cell}</v></c>`
          return `<c r="${ref}" s="${style}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(cell)}</t></is></c>`
        })
        .join('')
      return `<row r="${number}"${height}>${cells}</row>`
    })
    .join('')
  return `${XML_HEAD}<worksheet xmlns="${MAIN_NS}" xmlns:r="${REL_NS}"><sheetPr><pageSetUpPr fitToPage="1"/></sheetPr><sheetViews><sheetView rightToLeft="1" workbookViewId="0"/></sheetViews><sheetFormatPr defaultRowHeight="15"/><cols>${cols}</cols><sheetData>${body}</sheetData><pageMargins left="0.4" right="0.4" top="0.5" bottom="0.5" header="0.3" footer="0.3"/><pageSetup paperSize="9" orientation="landscape" fitToWidth="1" fitToHeight="0"/></worksheet>`
}

let crcTable: Uint32Array | null = null

function crc32(bytes: Uint8Array) {
  crcTable ??= Uint32Array.from({ length: 256 }, (_, value) => {
    let crc = value
    for (let bit = 0; bit < 8; bit += 1) crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1
    return crc >>> 0
  })
  let crc = 0xffffffff
  for (let index = 0; index < bytes.length; index += 1) crc = crcTable[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

const DOS_DATE = (1 << 5) | 1

export function zipFiles(files: { name: string; content: string }[]) {
  const encoder = new TextEncoder()
  const parts: Uint8Array[] = []
  const directory: Uint8Array[] = []
  let offset = 0
  for (const file of files) {
    const name = encoder.encode(file.name)
    const data = encoder.encode(file.content)
    const crc = crc32(data)
    const local = new Uint8Array(30 + name.length)
    const head = new DataView(local.buffer)
    head.setUint32(0, 0x04034b50, true)
    head.setUint16(4, 20, true)
    head.setUint16(6, 0x0800, true)
    head.setUint16(8, 0, true)
    head.setUint16(10, 0, true)
    head.setUint16(12, DOS_DATE, true)
    head.setUint32(14, crc, true)
    head.setUint32(18, data.length, true)
    head.setUint32(22, data.length, true)
    head.setUint16(26, name.length, true)
    head.setUint16(28, 0, true)
    local.set(name, 30)
    const entry = new Uint8Array(46 + name.length)
    const central = new DataView(entry.buffer)
    central.setUint32(0, 0x02014b50, true)
    central.setUint16(4, 20, true)
    central.setUint16(6, 20, true)
    central.setUint16(8, 0x0800, true)
    central.setUint16(10, 0, true)
    central.setUint16(12, 0, true)
    central.setUint16(14, DOS_DATE, true)
    central.setUint32(16, crc, true)
    central.setUint32(20, data.length, true)
    central.setUint32(24, data.length, true)
    central.setUint16(28, name.length, true)
    central.setUint16(30, 0, true)
    central.setUint16(32, 0, true)
    central.setUint16(34, 0, true)
    central.setUint16(36, 0, true)
    central.setUint32(38, 0, true)
    central.setUint32(42, offset, true)
    entry.set(name, 46)
    parts.push(local, data)
    directory.push(entry)
    offset += local.length + data.length
  }
  const directorySize = directory.reduce((sum, entry) => sum + entry.length, 0)
  const end = new Uint8Array(22)
  const tail = new DataView(end.buffer)
  tail.setUint32(0, 0x06054b50, true)
  tail.setUint16(4, 0, true)
  tail.setUint16(6, 0, true)
  tail.setUint16(8, files.length, true)
  tail.setUint16(10, files.length, true)
  tail.setUint32(12, directorySize, true)
  tail.setUint32(16, offset, true)
  tail.setUint16(20, 0, true)
  const chunks = [...parts, ...directory, end]
  const output = new Uint8Array(chunks.reduce((sum, chunk) => sum + chunk.length, 0))
  let position = 0
  for (const chunk of chunks) {
    output.set(chunk, position)
    position += chunk.length
  }
  return output
}

export function scheduleXlsx(model: ScheduleModel) {
  return zipFiles([
    { name: '[Content_Types].xml', content: contentTypes },
    { name: '_rels/.rels', content: rootRels },
    { name: 'xl/workbook.xml', content: workbook },
    { name: 'xl/_rels/workbook.xml.rels', content: workbookRels },
    { name: 'xl/styles.xml', content: styles },
    { name: 'xl/worksheets/sheet1.xml', content: worksheet(sheetRows(model, '\n')) },
  ])
}

export const fileBase = (model: ScheduleModel) => `סידור-עבודה-${model.week || 'שבועי'}`

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const documentCss = `@page{size:A4 landscape;margin:10mm}
*{box-sizing:border-box}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{margin:0;background:#fff;color:#1a1f33;font:12px/1.4 Arial,"Segoe UI",Helvetica,sans-serif}
.sheet{max-width:277mm;margin:0 auto}
h1{margin:0;font-size:20px;line-height:1.25}
.range{margin:2px 0 10px;color:#5c6072;font-size:13px}
table{width:100%;border-collapse:collapse;table-layout:fixed}
th,td{padding:5px 6px;border:1px solid #cfc9c0;text-align:start;vertical-align:top;overflow-wrap:anywhere}
thead th{background:#f1eee9;font-size:12px}
thead th.rest{background:#e4e8fa}
thead th.eve,thead th.chol{background:#f6ecdc}
.tag{display:block;font-size:10.5px;font-weight:400;color:#5c6072}
tbody th{width:12%;background:#faf8f5}
tbody th small{display:block;font-weight:400;color:#5c6072;direction:ltr;text-align:end}
td.closed{background:#f4f2ee;color:#8a8580}
td ul{margin:0;padding:0;list-style:none}
tr{break-inside:avoid}
.people{margin:12px 0 0;padding:0;list-style:none;columns:3;column-gap:18px;font-size:11.5px}
.people li{break-inside:avoid;padding:2px 0}
.foot{margin-top:10px;color:#5c6072;font-size:10px}
.foot a{color:#2447d6}
@media screen{body{padding:16px;background:#ece8e2}.sheet{padding:16px;background:#fff}}`

export function scheduleDocument(model: ScheduleModel) {
  const head = model.days
    .map((day) => {
      const tone = day.closed ? '' : day.tone
      const tag = day.closed ? 'סגור' : day.tag
      return `<th scope="col"${tone ? ` class="${tone}"` : ''}>${escapeHtml(dayTitle(day))}${tag ? `<span class="tag">${escapeHtml(tag)}</span>` : ''}</th>`
    })
    .join('')
  const rows = model.shifts
    .map((shift, shiftIndex) => {
      const cells = model.days
        .map((day) => {
          const cell = model.cells[day.index][shiftIndex]
          if (cell.status === 'closed') return '<td class="closed">סגור</td>'
          const names = cell.assigned.map((person) => `<li>${escapeHtml(person.label)}</li>`).join('')
          return `<td>${names ? `<ul>${names}</ul>` : ''}</td>`
        })
        .join('')
      return `<tr><th scope="row">${escapeHtml(shift.name)}<small>${escapeHtml(shiftHours(shift))}</small></th>${cells}</tr>`
    })
    .join('\n')
  const people = model.totals
    .map((total) => {
      const role = total.employee.role.trim() ? ` (${escapeHtml(total.employee.role.trim())})` : ''
      return `<li>${escapeHtml(total.label)}${role}: ${shiftsText(total.shifts)}, ${hoursText(total.minutes)}</li>`
    })
    .join('')
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(`סידור עבודה ${weekRange(model.week)}`)}</title>
<style>${documentCss}</style>
</head>
<body>
<article class="sheet">
<h1>סידור עבודה</h1>
<p class="range">${escapeHtml(weekRange(model.week))}</p>
<table>
<thead><tr><th scope="col">משמרת</th>${head}</tr></thead>
<tbody>
${rows}
</tbody>
</table>
${people ? `<ul class="people">${people}</ul>` : ''}
<p class="foot">נבנה בכלי סידור העבודה של <a href="${TOOL_URL}">AITERRA</a></p>
</article>
</body>
</html>
`
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

const text = (value: unknown, limit: number) => (typeof value === 'string' ? value.slice(0, limit) : '')

const timeText = (value: unknown, fallback: string) =>
  typeof value === 'string' && parseTime(value) !== null ? value : fallback

const clampInt = (value: unknown, min: number, max: number, fallback: number) =>
  typeof value === 'number' && Number.isInteger(value) ? Math.min(max, Math.max(min, value)) : fallback

function readShift(value: unknown): ShiftDef | null {
  if (!isRecord(value) || typeof value.id !== 'string' || !ID.test(value.id)) return null
  const need = Array.isArray(value.need) ? value.need : []
  return {
    id: value.id,
    name: text(value.name, NAME_LIMIT),
    start: timeText(value.start, '07:00'),
    end: timeText(value.end, '15:00'),
    need: needAll(0).map((_, index) => clampInt(need[index], 0, MAX_NEED, 1)),
  }
}

function readEmployee(value: unknown): Employee | null {
  if (!isRecord(value) || typeof value.id !== 'string' || !ID.test(value.id)) return null
  const off = Array.isArray(value.off) ? value.off : []
  return {
    id: value.id,
    name: text(value.name, NAME_LIMIT),
    role: text(value.role, NAME_LIMIT),
    phone: text(value.phone, PHONE_LIMIT),
    maxShifts: clampInt(value.maxShifts, 1, MAX_WEEK_SHIFTS, DEFAULT_MAX_SHIFTS),
    off: uniqueIds(off.filter((key): key is string => typeof key === 'string' && OFF_KEY.test(key))),
  }
}

const uniqueById = <T extends { id: string }>(items: T[]) =>
  items.filter((item, index) => items.findIndex((other) => other.id === item.id) === index)

function readPlan(value: unknown, known: Set<string>): WeekPlan | null {
  if (!isRecord(value)) return null
  const closed = Array.isArray(value.closed) ? value.closed : []
  const assignments: Assignments = {}
  if (isRecord(value.assignments)) {
    for (const [key, ids] of Object.entries(value.assignments)) {
      if (!SLOT_KEY.test(key) || !Array.isArray(ids)) continue
      const list = uniqueIds(ids.filter((id): id is string => typeof id === 'string' && known.has(id)))
      if (list.length) assignments[key] = list
    }
  }
  return { closed: needAll(0).map((_, index) => closed[index] === true), assignments }
}

export function pruneWeeks(weeks: Record<string, WeekPlan>) {
  const keys = Object.keys(weeks).sort().reverse().slice(0, STORED_WEEKS)
  return Object.fromEntries(keys.map((key) => [key, weeks[key]]))
}

export function readStored(raw: string | null): Stored | null {
  if (!raw) return null
  try {
    const data: unknown = JSON.parse(raw)
    if (!isRecord(data) || !isRecord(data.setup)) return null
    const shiftList = Array.isArray(data.setup.shifts) ? data.setup.shifts : []
    const employeeList = Array.isArray(data.setup.employees) ? data.setup.employees : []
    const shifts = uniqueById(shiftList.map(readShift).filter((item): item is ShiftDef => item !== null)).slice(
      0,
      MAX_SHIFT_TYPES,
    )
    const employees = uniqueById(
      employeeList.map(readEmployee).filter((item): item is Employee => item !== null),
    ).slice(0, MAX_EMPLOYEES)
    const known = new Set(employees.map((employee) => employee.id))
    const weeks: Record<string, WeekPlan> = {}
    if (isRecord(data.weeks)) {
      for (const [key, value] of Object.entries(data.weeks)) {
        if (sundayOf(key) !== key) continue
        const plan = readPlan(value, known)
        if (plan) weeks[key] = plan
      }
    }
    const week = typeof data.week === 'string' && sundayOf(data.week) === data.week ? data.week : ''
    return { week, setup: { shifts, employees }, weeks: pruneWeeks(weeks) }
  } catch {
    return null
  }
}
