export type Parsed = { ok: true; value: number } | { ok: false; reason: 'empty' | 'invalid' | 'out-of-range' }

export type ShiftError = 'invalid-start' | 'invalid-end' | 'same-time' | 'invalid-break' | 'break-too-long'

export type Shift =
  | { status: 'empty' }
  | { status: 'incomplete'; missing: 'start' | 'end' }
  | { status: 'error'; error: ShiftError }
  | {
      status: 'ok'
      start: number
      end: number
      span: number
      breakMinutes: number
      worked: number
      overnight: boolean
      nightMinutes: number
    }

export type DayRow = {
  id: number
  date: string
  start: string
  end: string
  breakMinutes: string
  short: boolean
}

export type Settings = {
  daily: string
  short: string
  weekly: string
  rate1: string
  rate2: string
  wage: string
}

export type Rules = {
  daily: number
  short: number
  weekly: number
  rate1: number
  rate2: number
}

export type Split = { minutes: number; regular: number; overtime1: number; overtime2: number }

export type DayResult = Split & { date: string; shifts: number; night: boolean; short: boolean; threshold: number }

export type WeekResult = { start: string; end: string; days: DayResult[]; totals: Split }

export type MonthResult = { month: string; totals: Split }

export type Pay = { wage: number; regular: number; overtime1: number; overtime2: number; total: number }

export type RowResult = { shift: Shift; dateMissing: boolean }

export type Timesheet = {
  rows: Map<number, RowResult>
  days: DayResult[]
  weeks: WeekResult[]
  months: MonthResult[]
  totals: Split & { days: number }
  rules: Rules | null
  pay: Pay | null
}

export const MINUTES_PER_DAY = 1440
export const NIGHT_THRESHOLD_MINUTES = 120
export const FIRST_TIER_MINUTES = 120
export const MAX_ROWS = 62
export const MAX_WAGE_SHEKELS = 10_000
export const GENERATOR_URL = 'https://www.aiterra.co.il/tools/work-hours-calculator'

export const DEFAULT_SETTINGS: Settings = {
  daily: '8',
  short: '7',
  weekly: '42',
  rate1: '125',
  rate2: '150',
  wage: '',
}

const WEEKDAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
const DAY_MS = 86_400_000

const pad = (value: number) => String(value).padStart(2, '0')

export function parseClock(input: string): Parsed {
  const value = input.replace(/[\s‎‏]/g, '')
  if (!value) return { ok: false, reason: 'empty' }
  let hours: number
  let minutes: number
  const separated = /^(\d{1,2})[:.,;](\d{1,2})$/.exec(value)
  if (separated) {
    hours = Number(separated[1])
    minutes = Number(separated[2])
  } else if (/^\d{1,2}$/.test(value)) {
    hours = Number(value)
    minutes = 0
  } else if (/^\d{3,4}$/.test(value)) {
    hours = Number(value.slice(0, -2))
    minutes = Number(value.slice(-2))
  } else {
    return { ok: false, reason: 'invalid' }
  }
  if (hours === 24 && minutes === 0) return { ok: true, value: 0 }
  if (hours > 23 || minutes > 59) return { ok: false, reason: 'invalid' }
  return { ok: true, value: hours * 60 + minutes }
}

export function parseBreak(input: string): Parsed {
  const value = input.replace(/\s/g, '')
  if (!value) return { ok: true, value: 0 }
  const clock = /^(\d{1,2}):(\d{2})$/.exec(value)
  const minutes = clock ? Number(clock[1]) * 60 + Number(clock[2]) : /^\d{1,4}$/.test(value) ? Number(value) : NaN
  if (Number.isNaN(minutes)) return { ok: false, reason: 'invalid' }
  if (minutes >= MINUTES_PER_DAY) return { ok: false, reason: 'out-of-range' }
  return { ok: true, value: minutes }
}

export function parseHundredths(input: string): Parsed {
  let value = input.replace(/[\s‎‏₪%]/g, '').replace(/ש["״']?ח$/, '')
  if (!value) return { ok: false, reason: 'empty' }
  if (!value.includes('.') && /^\d+,\d{1,2}$/.test(value)) value = value.replace(',', '.')
  value = value.replace(/,(?=\d{3}(\D|$))/g, '')
  const match = /^(\d{1,9})(?:\.(\d+))?$/.exec(value)
  if (!match) return { ok: false, reason: 'invalid' }
  const fraction = (match[2] ?? '').padEnd(3, '0')
  const roundUp = Number(fraction[2]) >= 5 ? 1 : 0
  return { ok: true, value: Number(match[1]) * 100 + Number(fraction.slice(0, 2)) + roundUp }
}

const withinRange = (parsed: Parsed, min: number, max: number): Parsed => {
  if (!parsed.ok) return parsed
  if (parsed.value < min || parsed.value > max) return { ok: false, reason: 'out-of-range' }
  return parsed
}

export function parseHoursSetting(input: string, maxHours: number): Parsed {
  const parsed = withinRange(parseHundredths(input), 1, maxHours * 100)
  return parsed.ok ? { ok: true, value: Math.round((parsed.value * 60) / 100) } : parsed
}

export const parseRateSetting = (input: string) => withinRange(parseHundredths(input), 100_00, 500_00)

export const parseWage = (input: string) => withinRange(parseHundredths(input), 1, MAX_WAGE_SHEKELS * 100)

export function parseRules(settings: Settings): Rules | null {
  const daily = parseHoursSetting(settings.daily, 24)
  const short = parseHoursSetting(settings.short, 24)
  const weekly = parseHoursSetting(settings.weekly, 168)
  const rate1 = parseRateSetting(settings.rate1)
  const rate2 = parseRateSetting(settings.rate2)
  if (!daily.ok || !short.ok || !weekly.ok || !rate1.ok || !rate2.ok) return null
  return { daily: daily.value, short: short.value, weekly: weekly.value, rate1: rate1.value, rate2: rate2.value }
}

const overlap = (from: number, to: number, windowFrom: number, windowTo: number) =>
  Math.max(0, Math.min(to, windowTo) - Math.max(from, windowFrom))

export function nightMinutes(start: number, span: number): number {
  const end = start + span
  let total = 0
  for (let day = 0; day <= 2; day += 1) {
    const midnight = day * MINUTES_PER_DAY
    total += overlap(start, end, midnight - 120, midnight + 360)
  }
  return total
}

export function calculateShift(startInput: string, endInput: string, breakInput: string): Shift {
  const start = parseClock(startInput)
  const end = parseClock(endInput)
  if (!start.ok && start.reason === 'empty' && !end.ok && end.reason === 'empty') return { status: 'empty' }
  if (!start.ok && start.reason !== 'empty') return { status: 'error', error: 'invalid-start' }
  if (!end.ok && end.reason !== 'empty') return { status: 'error', error: 'invalid-end' }
  if (!start.ok) return { status: 'incomplete', missing: 'start' }
  if (!end.ok) return { status: 'incomplete', missing: 'end' }
  const pause = parseBreak(breakInput)
  if (!pause.ok) return { status: 'error', error: 'invalid-break' }
  if (start.value === end.value) return { status: 'error', error: 'same-time' }
  const overnight = end.value < start.value
  const span = overnight ? end.value + MINUTES_PER_DAY - start.value : end.value - start.value
  if (pause.value >= span) return { status: 'error', error: 'break-too-long' }
  return {
    status: 'ok',
    start: start.value,
    end: end.value,
    span,
    breakMinutes: pause.value,
    worked: span - pause.value,
    overnight,
    nightMinutes: nightMinutes(start.value, span),
  }
}

export const shiftErrorText: Record<ShiftError, string> = {
  'invalid-start': 'שעת ההתחלה לא תקינה. הקלידו שעה בין 00:00 ל-23:59, למשל 08:30.',
  'invalid-end': 'שעת הסיום לא תקינה. הקלידו שעה בין 00:00 ל-23:59, למשל 17:15.',
  'same-time': 'שעת הסיום זהה לשעת ההתחלה.',
  'invalid-break': 'הקלידו את ההפסקה בדקות, למשל 30.',
  'break-too-long': 'ההפסקה ארוכה מהמשמרת או שווה לה.',
}

export const errorField = (error: ShiftError): 'start' | 'end' | 'break' =>
  error === 'invalid-start' ? 'start' : error === 'invalid-break' || error === 'break-too-long' ? 'break' : 'end'

export function isIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false
  const time = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return new Date(time).toISOString().slice(0, 10) === value
}

const isoToTime = (iso: string) => {
  const [year, month, day] = iso.split('-').map(Number)
  return Date.UTC(year, month - 1, day)
}

const timeToIso = (time: number) => new Date(time).toISOString().slice(0, 10)

export const addDays = (iso: string, days: number) => (isIsoDate(iso) ? timeToIso(isoToTime(iso) + days * DAY_MS) : '')

export const weekdayIndex = (iso: string) => new Date(isoToTime(iso)).getUTCDay()

export const weekdayName = (iso: string) => WEEKDAYS[weekdayIndex(iso)]

export const weekStart = (iso: string) => addDays(iso, -weekdayIndex(iso))

export function localIsoDate(now = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export const formatDate = (iso: string) => {
  const [year, month, day] = iso.split('-')
  return `${day}.${month}.${year}`
}

export const formatShortDate = (iso: string) => {
  const [, month, day] = iso.split('-')
  return `${day}.${month}`
}

export const formatMonth = (month: string) => {
  const [year, number] = month.split('-')
  return `${number}/${year}`
}

export const formatClock = (minutes: number) => `${pad(Math.floor(minutes / 60) % 24)}:${pad(minutes % 60)}`

export const formatDuration = (minutes: number) => `${Math.floor(minutes / 60)}:${pad(minutes % 60)}`

const decimalFormat = new Intl.NumberFormat('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const plainDecimalFormat = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: false,
})
const settingFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 2 })
const shekelFormat = new Intl.NumberFormat('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const hundredthsOfHour = (minutes: number) => Math.round((minutes * 100) / 60) / 100

export const formatDecimalHours = (minutes: number) => decimalFormat.format(hundredthsOfHour(minutes))

export const plainDecimalHours = (minutes: number) => plainDecimalFormat.format(hundredthsOfHour(minutes))

export const formatSettingHours = (minutes: number) => settingFormat.format(minutes / 60)

export const formatPercent = (hundredths: number) => `${settingFormat.format(hundredths / 100)}%`

export const formatShekels = (agorot: number) => `${shekelFormat.format(agorot / 100)} ₪`

const plainShekels = (agorot: number) => (agorot / 100).toFixed(2)

const emptySplit = (): Split => ({ minutes: 0, regular: 0, overtime1: 0, overtime2: 0 })

const addSplit = (target: Split, source: Split) => {
  target.minutes += source.minutes
  target.regular += source.regular
  target.overtime1 += source.overtime1
  target.overtime2 += source.overtime2
}

type Entry = { date: string; worked: number; night: boolean; short: boolean }

function splitWeek(days: Omit<DayResult, keyof Split | 'threshold'>[], minutes: number[], rules: Rules | null) {
  let weekRegular = 0
  return days.map((day, index): DayResult => {
    const worked = minutes[index]
    if (!rules) {
      return { ...day, minutes: worked, regular: worked, overtime1: 0, overtime2: 0, threshold: 0 }
    }
    const threshold = day.night || day.short ? rules.short : rules.daily
    const dailyOver = Math.max(0, worked - threshold)
    const withinDay = worked - dailyOver
    weekRegular += withinDay
    const weeklyOver = Math.min(withinDay, Math.max(0, weekRegular - rules.weekly))
    const overtime = dailyOver + weeklyOver
    const overtime1 = Math.min(overtime, FIRST_TIER_MINUTES)
    return {
      ...day,
      minutes: worked,
      regular: withinDay - weeklyOver,
      overtime1,
      overtime2: overtime - overtime1,
      threshold,
    }
  })
}

export function calculatePay(split: Split, wage: number, rules: Rules): Pay {
  const regular = Math.round((split.regular * wage) / 60)
  const overtime1 = Math.round((split.overtime1 * wage * rules.rate1) / 600_000)
  const overtime2 = Math.round((split.overtime2 * wage * rules.rate2) / 600_000)
  return { wage, regular, overtime1, overtime2, total: regular + overtime1 + overtime2 }
}

export function calculateTimesheet(rows: DayRow[], settings: Settings): Timesheet {
  const rules = parseRules(settings)
  const results = new Map<number, RowResult>()
  const entries: Entry[] = []

  for (const row of rows) {
    const shift = calculateShift(row.start, row.end, row.breakMinutes)
    const dateMissing = shift.status === 'ok' && !isIsoDate(row.date)
    results.set(row.id, { shift, dateMissing })
    if (shift.status === 'ok' && !dateMissing) {
      entries.push({
        date: row.date,
        worked: shift.worked,
        night: shift.nightMinutes >= NIGHT_THRESHOLD_MINUTES,
        short: row.short,
      })
    }
  }

  const byDate = new Map<string, { worked: number; shifts: number; night: boolean; short: boolean }>()
  for (const entry of entries) {
    const current = byDate.get(entry.date) ?? { worked: 0, shifts: 0, night: false, short: false }
    byDate.set(entry.date, {
      worked: current.worked + entry.worked,
      shifts: current.shifts + 1,
      night: current.night || entry.night,
      short: current.short || entry.short,
    })
  }

  const dates = [...byDate.keys()].sort()
  const weekKeys = [...new Set(dates.map(weekStart))]
  const weeks: WeekResult[] = weekKeys.map((key) => {
    const weekDates = dates.filter((date) => weekStart(date) === key)
    const base = weekDates.map((date) => {
      const day = byDate.get(date)!
      return { date, shifts: day.shifts, night: day.night, short: day.short }
    })
    const days = splitWeek(
      base,
      weekDates.map((date) => byDate.get(date)!.worked),
      rules,
    )
    const totals = emptySplit()
    days.forEach((day) => addSplit(totals, day))
    return { start: key, end: addDays(key, 6), days, totals }
  })

  const days = weeks.flatMap((week) => week.days)
  const monthMap = new Map<string, Split>()
  for (const day of days) {
    const month = day.date.slice(0, 7)
    const split = monthMap.get(month) ?? emptySplit()
    addSplit(split, day)
    monthMap.set(month, split)
  }
  const months = [...monthMap.entries()].map(([month, totals]) => ({ month, totals }))

  const totals = { ...emptySplit(), days: days.length }
  days.forEach((day) => addSplit(totals, day))

  const wage = parseWage(settings.wage)
  const pay = rules && wage.ok && days.length ? calculatePay(totals, wage.value, rules) : null

  return { rows: results, days, weeks, months, totals, rules, pay }
}

export const dayLabel = (day: DayResult) => {
  const marks = [day.night ? 'לילה' : '', day.short && !day.night ? 'יום קצר' : ''].filter(Boolean)
  return `${weekdayName(day.date)} ${formatDate(day.date)}${marks.length ? ` (${marks.join(', ')})` : ''}`
}

export const rulesSummary = (rules: Rules) =>
  `שעות נוספות מעל ${formatSettingHours(rules.daily)} שעות ביום ` +
  `(${formatSettingHours(rules.short)} ביום קצר ובמשמרת לילה) ` +
  `ומעל ${formatSettingHours(rules.weekly)} שעות בשבוע. ` +
  `שעתיים נוספות ראשונות ביום: ${formatPercent(rules.rate1)}, ואחריהן: ${formatPercent(rules.rate2)}.`

export function quickResultText(shift: Extract<Shift, { status: 'ok' }>): string {
  const until = `${formatClock(shift.end)}${shift.overnight ? ' למחרת' : ''}`
  const lines = [
    `שעות עבודה: ${formatDuration(shift.worked)} (${plainDecimalHours(shift.worked)} שעות)`,
    `משמרת: ${formatClock(shift.start)} עד ${until}, ${formatDuration(shift.span)} שעות`,
  ]
  if (shift.breakMinutes) lines.push(`הפסקה: ${shift.breakMinutes} דקות`)
  return lines.join('\n')
}

type ReportRow = { row: DayRow; shift: Extract<Shift, { status: 'ok' }> }

const reportRows = (rows: DayRow[], sheet: Timesheet): ReportRow[] =>
  rows
    .flatMap((row) => {
      const result = sheet.rows.get(row.id)
      return result && result.shift.status === 'ok' && !result.dateMissing ? [{ row, shift: result.shift }] : []
    })
    .sort((a, b) => a.row.date.localeCompare(b.row.date) || a.shift.start - b.shift.start)

const periodText = (sheet: Timesheet) => {
  const first = sheet.days[0]?.date
  const last = sheet.days[sheet.days.length - 1]?.date
  if (!first || !last) return ''
  return first === last ? formatDate(first) : `${formatDate(first)} עד ${formatDate(last)}`
}

const shiftText = (shift: Extract<Shift, { status: 'ok' }>) =>
  `${formatClock(shift.start)}-${formatClock(shift.end)}${shift.overnight ? ' (למחרת)' : ''}` +
  (shift.breakMinutes ? `, הפסקה ${shift.breakMinutes} דק׳` : '')

const splitText = (split: Split, rules: Rules | null) =>
  rules
    ? `${formatDuration(split.minutes)} שעות (רגילות ${formatDuration(split.regular)}, ` +
      `${formatPercent(rules.rate1)}: ${formatDuration(split.overtime1)}, ` +
      `${formatPercent(rules.rate2)}: ${formatDuration(split.overtime2)})`
    : `${formatDuration(split.minutes)} שעות`

export function timesheetText(rows: DayRow[], sheet: Timesheet): string {
  const shiftsByDate = new Map<string, ReportRow[]>()
  for (const item of reportRows(rows, sheet)) {
    shiftsByDate.set(item.row.date, [...(shiftsByDate.get(item.row.date) ?? []), item])
  }
  const lines = ['דוח שעות עבודה', `תקופה: ${periodText(sheet)}`, '']
  for (const week of sheet.weeks) {
    for (const day of week.days) {
      const shifts = (shiftsByDate.get(day.date) ?? []).map((item) => shiftText(item.shift)).join('; ')
      lines.push(`${dayLabel(day)}: ${shifts}. סה״כ ${splitText(day, sheet.rules)}`)
    }
    const range = `${formatShortDate(week.start)}-${formatShortDate(week.end)}`
    lines.push(`סה״כ שבוע ${range}: ${splitText(week.totals, sheet.rules)}`, '')
  }
  if (sheet.months.length > 1) {
    for (const month of sheet.months) {
      lines.push(`חודש ${formatMonth(month.month)}: ${splitText(month.totals, sheet.rules)}`)
    }
    lines.push('')
  }
  const { minutes, days } = sheet.totals
  lines.push(`סך הכול: ${formatDuration(minutes)} שעות (${plainDecimalHours(minutes)}) ב-${days} ימים`)
  if (sheet.rules) {
    lines.push(
      `שעות רגילות: ${formatDuration(sheet.totals.regular)}`,
      `שעות נוספות ${formatPercent(sheet.rules.rate1)}: ${formatDuration(sheet.totals.overtime1)}`,
      `שעות נוספות ${formatPercent(sheet.rules.rate2)}: ${formatDuration(sheet.totals.overtime2)}`,
    )
  }
  if (sheet.pay && sheet.rules) {
    lines.push(
      '',
      `שכר לשעה: ${formatShekels(sheet.pay.wage)}`,
      `שכר ברוטו לפני ניכויים: ${formatShekels(sheet.pay.total)}`,
    )
  }
  if (sheet.rules) lines.push('', rulesSummary(sheet.rules))
  return lines.join('\n')
}

const UTF8_BOM = String.fromCharCode(0xfeff)

const csvCell = (value: string | number) => {
  const text = String(value)
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function timesheetCsv(rows: DayRow[], sheet: Timesheet): string {
  const rate1 = sheet.rules ? formatPercent(sheet.rules.rate1) : '125%'
  const rate2 = sheet.rules ? formatPercent(sheet.rules.rate2) : '150%'
  const header = [
    'תאריך',
    'יום',
    'התחלה',
    'סיום',
    'הפסקה (דקות)',
    'שעות',
    'שעות (עשרוני)',
    'סה״כ ליום',
    'רגילות',
    `נוספות ${rate1}`,
    `נוספות ${rate2}`,
  ]
  const items = reportRows(rows, sheet)
  const dayMap = new Map(sheet.days.map((day) => [day.date, day]))
  const lines = [header]
  items.forEach((item, index) => {
    const isLastOfDay = items[index + 1]?.row.date !== item.row.date
    const day = dayMap.get(item.row.date)
    const dayCells =
      isLastOfDay && day
        ? [
            plainDecimalHours(day.minutes),
            plainDecimalHours(day.regular),
            plainDecimalHours(day.overtime1),
            plainDecimalHours(day.overtime2),
          ]
        : ['', '', '', '']
    lines.push([
      formatDate(item.row.date),
      weekdayName(item.row.date),
      formatClock(item.shift.start),
      formatClock(item.shift.end) + (item.shift.overnight ? ' (+1)' : ''),
      String(item.shift.breakMinutes),
      formatDuration(item.shift.worked),
      plainDecimalHours(item.shift.worked),
      ...dayCells,
    ])
  })
  const total = sheet.totals
  lines.push([
    'סה״כ',
    '',
    '',
    '',
    '',
    formatDuration(total.minutes),
    plainDecimalHours(total.minutes),
    plainDecimalHours(total.minutes),
    plainDecimalHours(total.regular),
    plainDecimalHours(total.overtime1),
    plainDecimalHours(total.overtime2),
  ])
  if (sheet.pay) {
    lines.push(
      [],
      ['שכר לשעה (₪)', plainShekels(sheet.pay.wage)],
      ['שכר ברוטו לפני ניכויים (₪)', plainShekels(sheet.pay.total)],
    )
  }
  return `${UTF8_BOM}${lines.map((line) => line.map(csvCell).join(',')).join('\r\n')}\r\n`
}

const htmlEntities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => htmlEntities[char])

export function timesheetDocument(rows: DayRow[], sheet: Timesheet): string {
  const rules = sheet.rules
  const shiftsByDate = new Map<string, string[]>()
  for (const item of reportRows(rows, sheet)) {
    shiftsByDate.set(item.row.date, [...(shiftsByDate.get(item.row.date) ?? []), shiftText(item.shift)])
  }
  const otHeads = rules
    ? `<th>רגילות</th><th>נוספות ${formatPercent(rules.rate1)}</th><th>נוספות ${formatPercent(rules.rate2)}</th>`
    : ''
  const cell = (minutes: number) => `<td>${formatDuration(minutes)}</td>`
  const otCells = (split: Split) =>
    rules ? `${cell(split.regular)}${cell(split.overtime1)}${cell(split.overtime2)}` : ''
  const body = sheet.weeks
    .map((week) => {
      const dayRows = week.days
        .map(
          (day) =>
            `<tr><td>${escapeHtml(dayLabel(day))}</td>` +
            `<td>${escapeHtml((shiftsByDate.get(day.date) ?? []).join('; '))}</td>` +
            `${cell(day.minutes)}${otCells(day)}</tr>`,
        )
        .join('')
      const range = `${formatShortDate(week.start)}-${formatShortDate(week.end)}`
      const subtotal =
        `<tr class="sub"><td colspan="2">סה״כ שבוע ${range}</td>` +
        `${cell(week.totals.minutes)}${otCells(week.totals)}</tr>`
      return dayRows + subtotal
    })
    .join('')
  const total =
    `<tr class="total"><td colspan="2">סך הכול (${sheet.totals.days} ימים)</td>` +
    `${cell(sheet.totals.minutes)}${otCells(sheet.totals)}</tr>`
  const pay = sheet.pay
    ? `<p class="pay">שכר לשעה: ${formatShekels(sheet.pay.wage)}. ` +
      `שכר ברוטו לפני ניכויים: <strong>${formatShekels(sheet.pay.total)}</strong></p>`
    : ''
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<title>דוח שעות עבודה ${escapeHtml(periodText(sheet))}</title>
<style>
@page { size: A4; margin: 14mm; }
body { margin: 0; font-family: Arial, 'Segoe UI', Helvetica, sans-serif; color: #1a1f33; font-size: 12px; }
h1 { margin: 0 0 4px; font-size: 22px; }
.period { margin: 0 0 14px; color: #4a4f63; }
table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
th, td { padding: 6px 8px; border-bottom: 1px solid #ddd6cc; text-align: start; vertical-align: top; }
th { background: #f1eee9; font-weight: 700; }
tr.sub td { background: #f7f5f1; font-weight: 700; }
tr.total td { border-top: 2px solid #1a1f33; font-weight: 700; font-size: 13px; }
.pay { margin: 14px 0 0; font-size: 14px; }
.rules, .foot { margin: 10px 0 0; color: #4a4f63; font-size: 11px; }
</style>
</head>
<body>
<h1>דוח שעות עבודה</h1>
<p class="period">${escapeHtml(periodText(sheet))}</p>
<table>
<thead><tr><th>יום</th><th>משמרות</th><th>שעות</th>${otHeads}</tr></thead>
<tbody>${body}${total}</tbody>
</table>
${pay}
${rules ? `<p class="rules">${escapeHtml(rulesSummary(rules))}</p>` : ''}
<p class="foot">נוצר במחשבון שעות העבודה של AITERRA: ${GENERATOR_URL}</p>
</body>
</html>`
}
