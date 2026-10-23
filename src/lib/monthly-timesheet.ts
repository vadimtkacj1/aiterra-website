import {
  calculateShift,
  calculateTimesheet,
  formatClock,
  formatDuration,
  formatSettingHours,
  parseBreak,
  parseHoursSetting,
  plainDecimalHours,
  type DayRow,
  type Parsed,
  type Rules,
  type Settings,
  type Shift,
} from './work-hours'
import {
  MAX_YEAR,
  MIN_YEAR,
  MONTH_NAMES,
  dayFromParts,
  isoFromDay,
  lastDayOfMonth,
  specialDaysBetween,
  weekdayName,
  weekdayOf,
  type SpecialDay,
} from './work-days'

export type WorkWeek = 'sun-thu' | 'sun-fri'

export type DayKind = 'work' | 'eve' | 'chol-hamoed' | 'day-off' | 'shabbat' | 'holiday'

export type SheetDay = {
  iso: string
  date: number
  weekday: number
  weekdayName: string
  kind: DayKind
  note: string
  rest: boolean
  short: boolean
}

export type MonthCalendar = { year: number; month: number; days: SheetDay[]; holidays: boolean }

export type Entry = { start: string; end: string }

export type Entries = Record<string, Entry>

export type SheetSettings = {
  year: number
  month: number
  employee: string
  employeeId: string
  employer: string
  week: WorkWeek
  dayLength: string
  shortLength: string
  weekly: string
  breakMinutes: string
}

export type WorkedDay = {
  status: 'ok'
  start: number
  end: number
  overnight: boolean
  breakMinutes: number
  worked: number
  regular: number
  overtime1: number
  overtime2: number
  rest: number
}

export type DayStatus = Exclude<Shift, { status: 'ok' }> | WorkedDay

export type MonthTotals = {
  minutes: number
  regular: number
  overtime1: number
  overtime2: number
  rest: number
  days: number
}

export type MonthResult = { days: Map<string, DayStatus>; totals: MonthTotals; rules: Rules | null; filled: boolean }

export type SheetModel = { calendar: MonthCalendar; entries: Entries; settings: SheetSettings; result: MonthResult }

export const GENERATOR_URL = 'https://www.aiterra.co.il/tools/monthly-timesheet'
export const BREAK_FROM_MINUTES = 360
export const MAX_BREAK_MINUTES = 180
export const FIRST_YEAR = MIN_YEAR
export const LAST_YEAR = MAX_YEAR

export const DAY_LENGTH: Record<WorkWeek, string> = { 'sun-thu': '8.6', 'sun-fri': '8' }

export const weekOptions: { value: WorkWeek; label: string }[] = [
  { value: 'sun-thu', label: 'ראשון עד חמישי' },
  { value: 'sun-fri', label: 'ראשון עד שישי' },
]

export const defaultSettings = (year: number, month: number): SheetSettings => ({
  year,
  month,
  employee: '',
  employeeId: '',
  employer: '',
  week: 'sun-thu',
  dayLength: DAY_LENGTH['sun-thu'],
  shortLength: '7',
  weekly: '42',
  breakMinutes: '30',
})

const EMPTY_ENTRY: Entry = { start: '', end: '' }

const pad = (value: number) => String(value).padStart(2, '0')

export const monthTitle = (year: number, month: number) => `${MONTH_NAMES[month - 1]} ${year}`

export const monthKey = (year: number, month: number) => `${year}-${pad(month)}`

export const dayMonth = (day: SheetDay, month: number) => `${day.date}.${month}`

const fullDate = (day: SheetDay, calendar: MonthCalendar) => `${pad(day.date)}.${pad(calendar.month)}.${calendar.year}`

export function monthInTimeZone(now: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: 'numeric' }).formatToParts(now)
  const value = (type: 'year' | 'month') => Number(parts.find((part) => part.type === type)?.value)
  return { year: value('year'), month: value('month') }
}

export const localMonth = (now = new Date()) => ({ year: now.getFullYear(), month: now.getMonth() + 1 })

const isEve = (special: SpecialDay | null) =>
  special !== null && (special.kind === 'eve' || special.kind === 'chol-hamoed-eve')

function kindOf(weekday: number, special: SpecialDay | null, week: WorkWeek): DayKind {
  if (weekday === 6) return 'shabbat'
  if (special?.kind === 'rest') return 'holiday'
  if (weekday === 5 && week === 'sun-thu') return 'day-off'
  if (isEve(special)) return 'eve'
  if (special?.kind === 'chol-hamoed') return 'chol-hamoed'
  return 'work'
}

function sheetDay(day: number, special: SpecialDay | null, week: WorkWeek): SheetDay {
  const weekday = weekdayOf(day)
  const iso = isoFromDay(day)
  const kind = kindOf(weekday, special, week)
  const rest = kind === 'shabbat' || kind === 'holiday'
  return {
    iso,
    date: Number(iso.slice(8)),
    weekday,
    weekdayName: weekdayName(day),
    kind,
    note: special?.name ?? '',
    rest,
    short: !rest && (weekday === 5 || isEve(special)),
  }
}

export function monthCalendar(year: number, month: number, week: WorkWeek): MonthCalendar {
  const first = dayFromParts(year, month, 1)
  const last = lastDayOfMonth(first)
  const specials = specialDaysBetween(first, last)
  const days: SheetDay[] = []
  for (let day = first; day <= last; day += 1) days.push(sheetDay(day, specials?.get(day) ?? null, week))
  return { year, month, days, holidays: specials !== null }
}

export function parseBreakSetting(input: string): Parsed {
  const parsed = parseBreak(input)
  if (parsed.ok && parsed.value > MAX_BREAK_MINUTES) return { ok: false, reason: 'out-of-range' }
  return parsed
}

const hoursSettings = (settings: SheetSettings): Settings => ({
  daily: settings.dayLength,
  short: settings.shortLength,
  weekly: settings.weekly,
  rate1: '125',
  rate2: '150',
  wage: '',
})

const hasText = (entry: Entry | undefined) => Boolean(entry && (entry.start.trim() || entry.end.trim()))

export function calculateMonth(calendar: MonthCalendar, entries: Entries, settings: SheetSettings): MonthResult {
  const pause = parseBreakSetting(settings.breakMinutes)
  const breakMinutes = pause.ok ? pause.value : 0
  const rows: DayRow[] = []
  const shifts = calendar.days.map((day, index) => {
    const entry = entries[day.iso] ?? EMPTY_ENTRY
    const plain = calculateShift(entry.start, entry.end, '')
    const deduct = plain.status === 'ok' && plain.span >= BREAK_FROM_MINUTES ? breakMinutes : 0
    const shift = deduct ? calculateShift(entry.start, entry.end, String(deduct)) : plain
    if (shift.status === 'ok' && !day.rest) {
      rows.push({
        id: index,
        date: day.iso,
        start: entry.start,
        end: entry.end,
        breakMinutes: deduct ? String(deduct) : '',
        short: day.short,
      })
    }
    return shift
  })
  const sheet = calculateTimesheet(rows, hoursSettings(settings))
  const splits = new Map(sheet.days.map((day) => [day.date, day]))
  const totals: MonthTotals = { minutes: 0, regular: 0, overtime1: 0, overtime2: 0, rest: 0, days: 0 }
  const days = new Map<string, DayStatus>()
  calendar.days.forEach((day, index) => {
    const shift = shifts[index]
    if (shift.status !== 'ok') {
      days.set(day.iso, shift)
      return
    }
    const split = splits.get(day.iso)
    const worked: WorkedDay = {
      status: 'ok',
      start: shift.start,
      end: shift.end,
      overnight: shift.overnight,
      breakMinutes: shift.breakMinutes,
      worked: shift.worked,
      regular: split?.regular ?? 0,
      overtime1: split?.overtime1 ?? 0,
      overtime2: split?.overtime2 ?? 0,
      rest: day.rest ? shift.worked : 0,
    }
    days.set(day.iso, worked)
    totals.minutes += worked.worked
    totals.regular += worked.regular
    totals.overtime1 += worked.overtime1
    totals.overtime2 += worked.overtime2
    totals.rest += worked.rest
    totals.days += 1
  })
  const filled = calendar.days.some((day) => hasText(entries[day.iso]))
  return { days, totals, rules: sheet.rules, filled }
}

export function buildModel(settings: SheetSettings, entries: Entries): SheetModel {
  const calendar = monthCalendar(settings.year, settings.month, settings.week)
  return { calendar, entries, settings, result: calculateMonth(calendar, entries, settings) }
}

export const blankModel = (model: SheetModel): SheetModel => ({
  ...model,
  entries: {},
  result: calculateMonth(model.calendar, {}, model.settings),
})

export const weekText = (week: WorkWeek) => (week === 'sun-thu' ? 'ראשון עד חמישי' : 'ראשון עד שישי')

export function rulesText(settings: SheetSettings): string {
  const day = parseHoursSetting(settings.dayLength, 24)
  const short = parseHoursSetting(settings.shortLength, 24)
  const weekly = parseHoursSetting(settings.weekly, 168)
  const pause = parseBreakSetting(settings.breakMinutes)
  const parts: string[] = []
  if (day.ok && short.ok && weekly.ok) {
    parts.push(
      `שעות נוספות מעל ${formatSettingHours(day.value)} שעות ביום ` +
        `(${formatSettingHours(short.value)} בערב שבת, בערב חג ובמשמרת לילה) ` +
        `ומעל ${formatSettingHours(weekly.value)} שעות בשבוע.`,
    )
  }
  if (pause.ok && pause.value) parts.push(`הפסקה של ${pause.value} דקות מנוכה מכל יום של 6 שעות ומעלה.`)
  return parts.join(' ')
}

export const timeText = (day: WorkedDay) => ({
  start: formatClock(day.start),
  end: `${formatClock(day.end)}${day.overnight ? ' +1' : ''}`,
})

export const sheetTitle = (settings: SheetSettings) =>
  ['דוח שעות עבודה', monthTitle(settings.year, settings.month), settings.employee.trim()].filter(Boolean).join(' - ')

const UTF8_BOM = String.fromCharCode(0xfeff)

const csvCell = (value: string) => {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
}

const decimalOrBlank = (minutes: number, show: boolean) => (show ? plainDecimalHours(minutes) : '')

export function timesheetCsv(model: SheetModel): string {
  const { calendar, entries, settings, result } = model
  const lines: string[][] = [
    ['דוח שעות עבודה חודשי', monthTitle(calendar.year, calendar.month)],
    ['שם העובד', settings.employee.trim()],
    ['תעודת זהות', settings.employeeId.trim()],
    ['שם המעסיק', settings.employer.trim()],
    [],
    [
      'תאריך',
      'יום',
      'הערה',
      'כניסה',
      'יציאה',
      'הפסקה (דקות)',
      'שעות',
      'שעות (עשרוני)',
      'רגילות',
      'נוספות 125%',
      'נוספות 150%',
      'שבת וחג',
    ],
  ]
  for (const day of calendar.days) {
    const status = result.days.get(day.iso)
    const base = [fullDate(day, calendar), day.weekdayName, day.note]
    if (status?.status === 'ok') {
      const time = timeText(status)
      lines.push([
        ...base,
        time.start,
        time.end,
        String(status.breakMinutes),
        formatDuration(status.worked),
        plainDecimalHours(status.worked),
        plainDecimalHours(status.regular),
        plainDecimalHours(status.overtime1),
        plainDecimalHours(status.overtime2),
        plainDecimalHours(status.rest),
      ])
    } else {
      const entry = entries[day.iso] ?? EMPTY_ENTRY
      lines.push([...base, entry.start.trim(), entry.end.trim(), '', '', '', '', '', '', ''])
    }
  }
  const { totals } = result
  const show = result.filled
  lines.push([
    'סה״כ',
    '',
    '',
    '',
    '',
    '',
    show ? formatDuration(totals.minutes) : '',
    decimalOrBlank(totals.minutes, show),
    decimalOrBlank(totals.regular, show),
    decimalOrBlank(totals.overtime1, show),
    decimalOrBlank(totals.overtime2, show),
    decimalOrBlank(totals.rest, show),
  ])
  const rules = rulesText(settings)
  if (rules) lines.push([], [rules])
  return `${UTF8_BOM}${lines.map((line) => line.map(csvCell).join(',')).join('\r\n')}\r\n`
}

const htmlEntities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => htmlEntities[char])

const printCss = `@page{size:A4 portrait;margin:9mm 10mm}
*{box-sizing:border-box}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{margin:0;color:#1a1f33;font:10.5px/1.3 Arial,"Segoe UI",Helvetica,sans-serif}
.head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;padding-bottom:6px;border-bottom:2px solid #1a1f33}
h1{margin:0;font-size:19px;line-height:1.2}
.period{margin:2px 0 0;font-size:14px;font-weight:700}
.who{display:grid;grid-template-columns:auto 44mm;gap:3px 8px;margin:0;font-size:11px}
.who dt{color:#4a4f63}
.who dd{margin:0;min-height:14px;border-bottom:1px solid #8a8f9f;font-weight:700}
.rules{margin:5px 0 6px;color:#4a4f63;font-size:9.5px}
table{width:100%;border-collapse:collapse;table-layout:fixed;font-variant-numeric:tabular-nums}
th,td{height:6.4mm;padding:0 3px;border:1px solid #b9b4ac;text-align:center;vertical-align:middle;overflow:hidden}
thead th{height:auto;padding:3px;background:#ece8e2;font-size:9.5px;line-height:1.2}
tbody th{font-weight:400;text-align:start;white-space:nowrap}
.note{font-size:8.5px;line-height:1.1;text-align:start}
.rest td,.rest th{background:#e9e5de}
.off td,.off th{background:#f5f3ef}
tfoot th,tfoot td{height:7mm;background:#ece8e2;font-weight:700}
tfoot th{text-align:start}
.c-date{width:13mm}.c-day{width:12mm}.c-note{width:auto}.c-time{width:14.5mm}.c-hours{width:13mm}.c-ot{width:11mm}.c-sign{width:22mm}
.summary{margin:5px 0 0;font-size:10.5px}
.legend{margin:3px 0 0;color:#4a4f63;font-size:9px}
.sign{display:grid;grid-template-columns:1fr 1fr;gap:28mm;margin-top:12mm}
.sign p{margin:0;padding-top:4px;border-top:1px solid #1a1f33;color:#4a4f63;font-size:10px}
.foot{margin-top:5mm;color:#6b7083;font-size:8.5px}
@media screen{body{max-width:210mm;margin:16px auto;padding:0 12px}}`

export function timesheetDocument(model: SheetModel): string {
  const { calendar, entries, settings, result } = model
  const filled = result.filled
  const text = (value: string) => escapeHtml(value.trim())
  const duration = (minutes: number, show = true) => (show && minutes ? formatDuration(minutes) : '')
  const rows = calendar.days
    .map((day) => {
      const status = result.days.get(day.iso)
      const worked = status?.status === 'ok' ? status : null
      const entry = entries[day.iso] ?? EMPTY_ENTRY
      const time = worked ? timeText(worked) : { start: text(entry.start), end: text(entry.end) }
      const rowClass = day.rest ? ' class="rest"' : day.kind === 'day-off' ? ' class="off"' : ''
      return (
        `<tr${rowClass}><th scope="row">${dayMonth(day, calendar.month)}</th><td>${day.weekdayName}</td>` +
        `<td class="note">${escapeHtml(day.note)}</td>` +
        `<td dir="ltr">${time.start}</td><td dir="ltr">${time.end}</td>` +
        `<td>${worked ? formatDuration(worked.worked) : ''}</td>` +
        `<td>${worked ? duration(worked.overtime1) : ''}</td><td>${worked ? duration(worked.overtime2) : ''}</td>` +
        '<td></td><td></td></tr>'
      )
    })
    .join('\n')
  const { totals } = result
  const summary = filled
    ? `<p class="summary">ימי עבודה: ${totals.days} · שעות רגילות: ${formatDuration(totals.regular)} · ` +
      `נוספות 125%: ${formatDuration(totals.overtime1)} · נוספות 150%: ${formatDuration(totals.overtime2)}` +
      (totals.rest ? ` · בשבת ובחג: ${formatDuration(totals.rest)}` : '') +
      '</p>'
    : ''
  const field = (term: string, value: string) => `<dt>${term}</dt><dd>${text(value)}</dd>`
  const rules = rulesText(settings)
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(sheetTitle(settings))}</title>
<style>${printCss}</style>
</head>
<body>
<header class="head">
<div>
<h1>דוח שעות עבודה חודשי</h1>
<p class="period">${monthTitle(calendar.year, calendar.month)}</p>
</div>
<dl class="who">${field('שם העובד', settings.employee)}${field('תעודת זהות', settings.employeeId)}${field('שם המעסיק', settings.employer)}</dl>
</header>
<p class="rules">שבוע עבודה: ${weekText(settings.week)}. ${escapeHtml(rules)}</p>
<table>
<thead><tr><th scope="col" class="c-date">תאריך</th><th scope="col" class="c-day">יום</th><th scope="col" class="c-note">הערה</th><th scope="col" class="c-time">כניסה</th><th scope="col" class="c-time">יציאה</th><th scope="col" class="c-hours">שעות</th><th scope="col" class="c-ot">נוספות 125%</th><th scope="col" class="c-ot">נוספות 150%</th><th scope="col" class="c-sign">חתימת העובד</th><th scope="col" class="c-sign">אישור אחראי</th></tr></thead>
<tbody>
${rows}
</tbody>
<tfoot><tr><th scope="row" colspan="5">סך הכול</th><td>${duration(totals.minutes, filled)}</td><td>${duration(totals.overtime1, filled)}</td><td>${duration(totals.overtime2, filled)}</td><td colspan="2"></td></tr></tfoot>
</table>
${summary}
<p class="legend">נוספות 125%: שתי השעות הנוספות הראשונות בכל יום. נוספות 150%: מהשעה הנוספת השלישית (סעיף 16 לחוק שעות עבודה ומנוחה). <span dir="ltr">+1</span>: היציאה למחרת.</p>
<section class="sign"><p>חתימת העובד ותאריך</p><p>חתימת המעסיק ותאריך</p></section>
<p class="foot">נוצר בכלי דוח השעות החודשי של AITERRA: ${GENERATOR_URL}</p>
</body>
</html>`
}
