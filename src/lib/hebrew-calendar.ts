import { gematria, hebrewMonthNames, hebrewYearFull, toHebrew, type HebrewMonth } from './hebrew-date'
import {
  MONTH_NAMES,
  dayFromParts,
  isoFromDay,
  monthOf,
  roshHashanah,
  specialDaysForYear,
  weekdayOf,
  yearOf,
} from './work-days'

export type EventKind = 'rest' | 'eve' | 'cholHamoed' | 'fast' | 'memorial' | 'minor' | 'roshChodesh'

export type CalendarEvent = { day: number; name: string; kind: EventKind }

export type YearChoiceId = '5787' | '2026' | '2027'

export type YearChoice = { id: YearChoiceId; label: string; title: string }

export type CalendarCell = {
  day: number
  date: number
  hebrewDay: string
  hebrewMonth: string | null
  weekday: number
  events: CalendarEvent[]
}

export type MonthGrid = {
  key: string
  title: string
  hebrewSpan: string
  leading: number
  cells: CalendarCell[]
}

export type CalendarYear = {
  choice: YearChoice
  from: number
  to: number
  months: MonthGrid[]
  events: CalendarEvent[]
}

export type PrintLayout = 'month' | 'year'

export const HEBREW_YEAR = 5787

export const yearChoices: YearChoice[] = [
  { id: '5787', label: 'תשפ״ז (2026–2027)', title: 'שנת תשפ״ז' },
  { id: '2026', label: '2026', title: 'שנת 2026' },
  { id: '2027', label: '2027', title: 'שנת 2027' },
]

export const DEFAULT_YEAR: YearChoiceId = '5787'

export const isYearChoice = (value: string): value is YearChoiceId => yearChoices.some((choice) => choice.id === value)

export const WEEKDAY_SHORT = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳']

export const WEEKDAY_FULL = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']

export const kindLabels: Record<EventKind, string> = {
  rest: 'חג ויום שבתון',
  eve: 'ערב חג',
  cholHamoed: 'חול המועד',
  fast: 'צום',
  memorial: 'יום זיכרון',
  minor: 'חג ומועד בלי שבתון',
  roshChodesh: 'ראש חודש',
}

export const legendKinds: EventKind[] = ['rest', 'eve', 'cholHamoed', 'fast', 'memorial', 'minor', 'roshChodesh']

const SATURDAY = 6
const FRIDAY = 5
const SUNDAY = 0

const restKind = (name: string, kind: string): EventKind => {
  if (name.includes('זיכרון')) return 'memorial'
  if (kind === 'rest') return 'rest'
  if (kind === 'eve') return 'eve'
  return 'cholHamoed'
}

const adarOfPurim = (year: number): HebrewMonth => ((7 * year + 1) % 19 < 7 ? 'adar2' : 'adar')

const hebrewEventsOn = (day: number): CalendarEvent[] => {
  const hebrew = toHebrew(day)
  const weekday = weekdayOf(day)
  const events: CalendarEvent[] = []
  const add = (target: number, name: string, kind: EventKind) => events.push({ day: target, name, kind })
  const { month, day: date } = hebrew

  if (date === 1 && month !== 'tishri') add(day, `ראש חודש ${hebrewMonthNames[month]}`, 'roshChodesh')
  if (date === 30) add(day, `ראש חודש ${hebrewMonthNames[toHebrew(day + 1).month]}`, 'roshChodesh')

  if (month === 'tishri' && date === 3) add(weekday === SATURDAY ? day + 1 : day, 'צום גדליה', 'fast')
  if (month === 'heshvan' && date === 29) add(day, 'סיגד', 'minor')
  if (month === 'kislev' && date === 25) {
    for (let candle = 1; candle <= 8; candle += 1) add(day + candle - 1, `חנוכה, נר ${gematria(candle)}`, 'minor')
  }
  if (month === 'tevet' && date === 10) add(day, 'צום עשרה בטבת', 'fast')
  if (month === 'shevat' && date === 15) add(day, 'ט״ו בשבט', 'minor')
  if (month === adarOfPurim(hebrew.year)) {
    if (date === 13) add(weekday === SATURDAY ? day - 2 : day, 'תענית אסתר', 'fast')
    if (date === 14) add(day, 'פורים', 'minor')
    if (date === 15) add(day, 'שושן פורים', 'minor')
  }
  if (month === 'nisan' && date === 27) {
    const shifted = weekday === FRIDAY ? day - 1 : weekday === SUNDAY ? day + 1 : day
    add(shifted, 'יום הזיכרון לשואה ולגבורה', 'memorial')
  }
  if (month === 'iyar' && date === 18) add(day, 'ל״ג בעומר', 'minor')
  if (month === 'iyar' && date === 28) add(day, 'יום ירושלים', 'minor')
  if (month === 'tamuz' && date === 17) add(weekday === SATURDAY ? day + 1 : day, 'צום י״ז בתמוז', 'fast')
  if (month === 'av' && date === 9) add(weekday === SATURDAY ? day + 1 : day, 'תשעה באב', 'fast')
  if (month === 'av' && date === 15) add(day, 'ט״ו באב', 'minor')
  return events
}

const kindOrder: Record<EventKind, number> = {
  rest: 0,
  memorial: 1,
  fast: 2,
  eve: 3,
  cholHamoed: 4,
  minor: 5,
  roshChodesh: 6,
}

export function eventsBetween(from: number, to: number): CalendarEvent[] | null {
  const events: CalendarEvent[] = []
  for (let year = yearOf(from); year <= yearOf(to); year += 1) {
    const special = specialDaysForYear(year)
    if (!special) return null
    for (const item of special) {
      if (item.name.startsWith('יום הבחירות')) continue
      events.push({ day: item.day, name: item.name, kind: restKind(item.name, item.kind) })
    }
  }
  for (let day = from - 8; day <= to; day += 1) events.push(...hebrewEventsOn(day))
  const seen = new Set<string>()
  return events
    .filter((event) => event.day >= from && event.day <= to)
    .filter((event) => {
      const key = `${event.day}|${event.name}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .sort((a, b) => a.day - b.day || kindOrder[a.kind] - kindOrder[b.kind])
}

export function rangeOf(id: YearChoiceId): { from: number; to: number } | null {
  if (id === '5787') {
    const start = roshHashanah(2026)
    const next = roshHashanah(2027)
    return start === null || next === null ? null : { from: start, to: next - 1 }
  }
  const year = Number(id)
  return { from: dayFromParts(year, 1, 1), to: dayFromParts(year, 12, 31) }
}

const hebrewYearShort = (year: number) => hebrewYearFull(year).replace(/^[^׳]*׳/, '')

export function monthGrid(year: number, month: number, from: number, to: number, events: CalendarEvent[]): MonthGrid {
  const first = dayFromParts(year, month, 1)
  const last = dayFromParts(year, month + 1, 1) - 1
  const byDay = new Map<number, CalendarEvent[]>()
  for (const event of events) byDay.set(event.day, [...(byDay.get(event.day) ?? []), event])
  const cells: CalendarCell[] = []
  for (let day = first; day <= last; day += 1) {
    const hebrew = toHebrew(day)
    const inRange = day >= from && day <= to
    cells.push({
      day,
      date: day - first + 1,
      hebrewDay: gematria(hebrew.day),
      hebrewMonth: hebrew.day === 1 || day === first ? hebrewMonthNames[hebrew.month] : null,
      weekday: weekdayOf(day),
      events: inRange ? (byDay.get(day) ?? []) : [],
    })
  }
  const start = toHebrew(first)
  const end = toHebrew(last)
  const startText = `${hebrewMonthNames[start.month]}${start.year === end.year ? '' : ` ${hebrewYearShort(start.year)}`}`
  const hebrewSpan =
    start.month === end.month
      ? `${hebrewMonthNames[end.month]} ${hebrewYearShort(end.year)}`
      : `${startText}–${hebrewMonthNames[end.month]} ${hebrewYearShort(end.year)}`
  return {
    key: `${year}-${month}`,
    title: `${MONTH_NAMES[month - 1]} ${year}`,
    hebrewSpan,
    leading: weekdayOf(first),
    cells,
  }
}

const yearCache = new Map<YearChoiceId, CalendarYear | null>()

export function calendarYear(id: YearChoiceId): CalendarYear | null {
  const cached = yearCache.get(id)
  if (cached !== undefined) return cached
  const range = rangeOf(id)
  const events = range ? eventsBetween(range.from, range.to) : null
  if (!range || !events) {
    yearCache.set(id, null)
    return null
  }
  const months: MonthGrid[] = []
  let year = yearOf(range.from)
  let month = monthOf(range.from)
  while (dayFromParts(year, month, 1) <= range.to) {
    months.push(monthGrid(year, month, range.from, range.to, events))
    month += 1
    if (month > 12) {
      month = 1
      year += 1
    }
  }
  const choice = yearChoices.find((item) => item.id === id) ?? yearChoices[0]
  const result = { choice, from: range.from, to: range.to, months, events }
  yearCache.set(id, result)
  return result
}

export function holidayTable(events: CalendarEvent[]) {
  const rows: CalendarEvent[] = []
  for (const event of events) {
    if (event.name.startsWith('חנוכה, נר')) {
      if (event.name.endsWith('א׳')) rows.push({ ...event, name: 'חנוכה (נר ראשון)' })
      continue
    }
    if (event.kind === 'roshChodesh' || event.kind === 'cholHamoed') continue
    rows.push(event)
  }
  return rows
}

export const hebrewDateText = (day: number) => {
  const hebrew = toHebrew(day)
  return `${gematria(hebrew.day)} ב${hebrewMonthNames[hebrew.month]} ${hebrewYearShort(hebrew.year)}`
}

export const shortDate = (day: number) => {
  const iso = isoFromDay(day)
  const [year, month, date] = iso.split('-').map(Number)
  return `${date}.${month}.${year}`
}

export const weekdayText = (day: number) => `יום ${WEEKDAY_FULL[weekdayOf(day)]}`

const icsText = (value: string) => value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')

const encoder = new TextEncoder()

export const foldLine = (line: string) => {
  const parts: string[] = []
  let current = ''
  let size = 0
  for (const char of line) {
    const bytes = encoder.encode(char).length
    const limit = parts.length ? 74 : 75
    if (size + bytes > limit) {
      parts.push(current)
      current = ''
      size = 0
    }
    current += char
    size += bytes
  }
  parts.push(current)
  return parts.join('\r\n ')
}

const compactDate = (day: number) => isoFromDay(day).replace(/-/g, '')

export function icsCalendar(events: CalendarEvent[], name: string, stamp: Date): string {
  const dtstamp = stamp.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Aiterra//Hebrew Calendar//HE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${icsText(name)}`,
    ...events.flatMap((event, index) => [
      'BEGIN:VEVENT',
      `UID:${compactDate(event.day)}-${index}@aiterra.co.il`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;VALUE=DATE:${compactDate(event.day)}`,
      `DTEND;VALUE=DATE:${compactDate(event.day + 1)}`,
      `SUMMARY:${icsText(event.name)}`,
      `CATEGORIES:${icsText(kindLabels[event.kind])}`,
      'TRANSP:TRANSPARENT',
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
  ]
  return `${lines.map(foldLine).join('\r\n')}\r\n`
}

export const icsFileName = (id: YearChoiceId) => `hebrew-holidays-${id}.ics`

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const kindColors: Record<EventKind, { fill: string; ink: string }> = {
  rest: { fill: '#fde2e1', ink: '#a1201b' },
  eve: { fill: '#fdf0dc', ink: '#8a4b00' },
  cholHamoed: { fill: '#fbe9e8', ink: '#8c2a25' },
  fast: { fill: '#e9e6f5', ink: '#4a3b8f' },
  memorial: { fill: '#e7e9ee', ink: '#333a4d' },
  minor: { fill: '#e2effc', ink: '#1b4f8f' },
  roshChodesh: { fill: '#e6f4ea', ink: '#1d6b3a' },
}

const cellKind = (cell: CalendarCell) =>
  cell.events.length ? cell.events.reduce((best, event) => (kindOrder[event.kind] < kindOrder[best.kind] ? event : best)).kind : null

const monthTableHtml = (grid: MonthGrid, compact: boolean) => {
  const blanks = Array.from({ length: grid.leading }, () => '<td class="blank"></td>')
  const cells = grid.cells.map((cell) => {
    const kind = cellKind(cell)
    const style = kind ? ` style="background:${kindColors[kind].fill}"` : ''
    const shabbat = cell.weekday === SATURDAY ? ' shabbat' : ''
    const names = compact
      ? ''
      : cell.events.map((event) => `<span class="ev" style="color:${kindColors[event.kind].ink}">${escapeHtml(event.name)}</span>`).join('')
    const hebrewMonth = !compact && cell.hebrewMonth ? ` ${escapeHtml(cell.hebrewMonth)}` : ''
    return `<td class="day${shabbat}"${style}><span class="g">${cell.date}</span><span class="h">${escapeHtml(cell.hebrewDay)}${hebrewMonth}</span>${names}</td>`
  })
  const all = [...blanks, ...cells]
  while (all.length % 7) all.push('<td class="blank"></td>')
  const rows: string[] = []
  for (let index = 0; index < all.length; index += 7) rows.push(`<tr>${all.slice(index, index + 7).join('')}</tr>`)
  const head = WEEKDAY_SHORT.map((name) => `<th scope="col">${name}</th>`).join('')
  return (
    `<section class="month"><h2>${escapeHtml(grid.title)} <small>${escapeHtml(grid.hebrewSpan)}</small></h2>` +
    `<table><thead><tr>${head}</tr></thead><tbody>${rows.join('')}</tbody></table></section>`
  )
}

const legendHtml = () =>
  `<ul class="legend">${legendKinds
    .map((kind) => `<li><span style="background:${kindColors[kind].fill};border-color:${kindColors[kind].ink}"></span>${kindLabels[kind]}</li>`)
    .join('')}</ul>`

const monthCss = `
@page{size:A4 portrait;margin:12mm}
*{box-sizing:border-box}
body{margin:0;font-family:Arial,"Noto Sans Hebrew",sans-serif;color:#111;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.month{break-after:page;page-break-after:always}
.month:last-of-type{break-after:auto;page-break-after:auto}
h1{margin:0 0 4mm;font-size:13pt;font-weight:600;color:#555}
h2{margin:0 0 4mm;font-size:24pt}
h2 small{font-size:14pt;font-weight:400;color:#555}
table{width:100%;border-collapse:collapse;table-layout:fixed}
th{padding:2mm;font-size:11pt;border:1px solid #999;background:#f2f2f2}
td{height:34mm;padding:1.5mm;vertical-align:top;border:1px solid #999;overflow:hidden}
td.blank{background:#fafafa}
.g{display:block;font-size:16pt;font-weight:700}
.h{display:block;font-size:9pt;color:#444}
.ev{display:block;margin-top:1mm;font-size:8pt;line-height:1.2;font-weight:600}
.shabbat .g{color:#a1201b}
.legend{display:flex;flex-wrap:wrap;gap:2mm 5mm;margin:4mm 0 0;padding:0;list-style:none;font-size:9pt}
.legend span{display:inline-block;width:3.5mm;height:3.5mm;margin-inline-end:1.5mm;border:1px solid;vertical-align:middle}
.credit{margin-top:3mm;font-size:8pt;color:#666}
`

const yearCss = `
@page{size:A4 portrait;margin:8mm}
*{box-sizing:border-box}
body{margin:0;font-family:Arial,"Noto Sans Hebrew",sans-serif;color:#111;-webkit-print-color-adjust:exact;print-color-adjust:exact}
h1{margin:0 0 3mm;font-size:16pt;text-align:center}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:2.5mm 3mm}
.month h2{margin:0 0 1mm;font-size:8.5pt;text-align:center}
.month h2 small{display:block;font-size:6.5pt;font-weight:400;color:#555}
table{width:100%;border-collapse:collapse;table-layout:fixed}
th{font-size:6pt;font-weight:600;color:#555;border-bottom:1px solid #999}
td{height:6.6mm;padding:0.3mm;text-align:center;vertical-align:top;border:0.5px solid #ddd}
.g{display:block;font-size:7pt;font-weight:700;line-height:1.1}
.h{display:block;font-size:5pt;color:#555;line-height:1.1}
.shabbat .g{color:#a1201b}
.list{columns:3;column-gap:5mm;margin:3mm 0 0;padding:0;list-style:none;font-size:6.5pt;line-height:1.35}
.list b{font-weight:600}
.legend{display:flex;flex-wrap:wrap;justify-content:center;gap:1mm 4mm;margin:2mm 0 0;padding:0;list-style:none;font-size:6.5pt}
.legend span{display:inline-block;width:2.5mm;height:2.5mm;margin-inline-end:1mm;border:1px solid;vertical-align:middle}
.credit{margin-top:2mm;font-size:6pt;color:#666;text-align:center}
`

const CREDIT = 'לוח שנה עברי-לועזי מ-aiterra.co.il/tools/hebrew-calendar-2027'

export function printDocument(calendar: CalendarYear, layout: PrintLayout): string {
  const title = `לוח שנה עברי-לועזי, ${calendar.choice.title}`
  const head = `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>`
  if (layout === 'month') {
    const pages = calendar.months
      .map((grid) => monthTableHtml(grid, false).replace('</table></section>', `</table>${legendHtml()}<p class="credit">${CREDIT}</p></section>`))
      .join('')
    return `${head}<style>${monthCss}</style></head><body>${pages}</body></html>`
  }
  const list = holidayTable(calendar.events)
    .map((event) => `<li><b>${shortDate(event.day)}</b> ${escapeHtml(event.name)}</li>`)
    .join('')
  return (
    `${head}<style>${yearCss}</style></head><body><h1>${escapeHtml(title)}</h1>` +
    `<div class="grid">${calendar.months.map((grid) => monthTableHtml(grid, true)).join('')}</div>` +
    `${legendHtml()}<ul class="list">${list}</ul><p class="credit">${CREDIT}</p></body></html>`
  )
}

export const hebrewYearName = hebrewYearFull(HEBREW_YEAR)
