import {
  DEFAULT_SETTINGS,
  MONTH_NAMES,
  MAX_YEAR as WORK_MAX_YEAR,
  MIN_YEAR as WORK_MIN_YEAR,
  countWorkDays,
  dateOf,
  dayFromParts,
  formatDate,
  formatLongDate,
  isoFromDay,
  monthOf,
  specialDaysForYear,
  todayIso,
  weekdayOf,
  yearOf,
  type SpecialDay,
} from '@/lib/work-days'
import {
  MAX_GREGORIAN_YEAR,
  MIN_GREGORIAN_YEAR,
  fromHebrew,
  hebrewDateLetters,
  monthForYear,
  supportsHebrewCalendar,
  toHebrew,
} from '@/lib/hebrew-date'

export type CalcMode = 'between' | 'add' | 'countdown'

export type TimeUnit = 'days' | 'weeks' | 'months' | 'years'

export type Operation = 'add' | 'subtract'

export type HolidayId =
  | 'rosh-hashanah'
  | 'yom-kippur'
  | 'sukkot'
  | 'hanukkah'
  | 'purim'
  | 'pesach'
  | 'independence'
  | 'shavuot'

export type TargetChoice = HolidayId | 'custom'

export type ParsedDay = { ok: true; day: number } | { ok: false; reason: 'empty' | 'invalid' | 'out-of-range' }

export type ParsedCount = { ok: true; value: number } | { ok: false; reason: 'empty' | 'invalid' | 'out-of-range' }

export type Difference = {
  forward: boolean
  days: number
  weeks: number
  weekDays: number
  months: number
  monthDays: number
  years: number
  yearMonths: number
  yearDays: number
}

export type ShiftResult = { day: number; clamped: boolean }

export type HolidayDate = { id: HolidayId; name: string; day: number }

export type Detail = { label: string; value: string }

export type CalcInputs = {
  start: string
  end: string
  includeEnd: boolean
  base: string
  count: string
  unit: TimeUnit
  operation: Operation
  target: TargetChoice
  targetDate: string
}

export type Outcome =
  | { kind: 'message'; message: string }
  | {
      kind: 'result'
      headline: string
      sentence: string
      details: Detail[]
      notes: string[]
      workDays: number | null
      text: string
    }

export const MIN_YEAR = 1583
export const MAX_YEAR = 9999
export const MIN_ISO = `${MIN_YEAR}-01-01`
export const MAX_ISO = `${MAX_YEAR}-12-31`
export const MAX_COUNT = 99_999
export const WORK_DAYS_PATH = '/tools/work-days-calculator'
export const HEBREW_DATE_PATH = '/tools/hebrew-date-converter'

const MIN_DAY = dayFromParts(MIN_YEAR, 1, 1)
const MAX_DAY = dayFromParts(MAX_YEAR, 12, 31)

export const holidays: { id: HolidayId; name: string }[] = [
  { id: 'rosh-hashanah', name: 'ראש השנה' },
  { id: 'yom-kippur', name: 'יום כיפור' },
  { id: 'sukkot', name: 'סוכות' },
  { id: 'hanukkah', name: 'חנוכה' },
  { id: 'purim', name: 'פורים' },
  { id: 'pesach', name: 'פסח' },
  { id: 'independence', name: 'יום העצמאות' },
  { id: 'shavuot', name: 'שבועות' },
]

const holidayIds = new Set<string>(holidays.map((holiday) => holiday.id))

export const isHolidayId = (value: string): value is HolidayId => holidayIds.has(value)

const workDaysName: Partial<Record<HolidayId, string>> = {
  'rosh-hashanah': 'ראש השנה',
  'yom-kippur': 'יום כיפור',
  sukkot: 'סוכות',
  pesach: 'פסח',
  independence: 'יום העצמאות',
  shavuot: 'שבועות',
}

const HEBREW_YEAR_OFFSET = 3760

export const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0

const MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

export const daysInMonth = (year: number, month: number) =>
  month === 2 && isLeapYear(year) ? 29 : MONTH_LENGTHS[month - 1]

export function parseDay(value: string): ParsedDay {
  const trimmed = value.trim()
  if (!trimmed) return { ok: false, reason: 'empty' }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)
  if (!match) return { ok: false, reason: 'invalid' }
  const [year, month, date] = [Number(match[1]), Number(match[2]), Number(match[3])]
  if (month < 1 || month > 12 || date < 1 || date > daysInMonth(year, month)) return { ok: false, reason: 'invalid' }
  if (year < MIN_YEAR || year > MAX_YEAR) return { ok: false, reason: 'out-of-range' }
  return { ok: true, day: dayFromParts(year, month, date) }
}

export function parseCount(value: string): ParsedCount {
  const trimmed = value.trim()
  if (!trimmed) return { ok: false, reason: 'empty' }
  if (!/^\d+$/.test(trimmed)) return { ok: false, reason: 'invalid' }
  const parsed = Number(trimmed)
  if (parsed > MAX_COUNT) return { ok: false, reason: 'out-of-range' }
  return { ok: true, value: parsed }
}

export const dateError = (value: string) => {
  const parsed = parseDay(value)
  if (parsed.ok || parsed.reason === 'empty') return ''
  if (parsed.reason === 'out-of-range') {
    return `המחשבון עובד לפי הלוח הגרגוריאני, שנכנס לשימוש ב-1582. אפשר לבחור תאריך מ-1 בינואר ${MIN_YEAR} עד 31 בדצמבר ${MAX_YEAR}.`
  }
  return 'התאריך לא תקין. בחרו יום, חודש ושנה.'
}

export const countError = (value: string) => {
  const parsed = parseCount(value)
  if (parsed.ok || parsed.reason === 'empty') return ''
  if (parsed.reason === 'out-of-range') return `אפשר להקליד מספר עד ${MAX_COUNT.toLocaleString('he-IL')}.`
  return 'הקלידו מספר שלם, בספרות בלבד.'
}

const targetYear = (day: number, months: number) => Math.floor((yearOf(day) * 12 + (monthOf(day) - 1) + months) / 12)

export function addMonths(day: number, months: number): ShiftResult {
  const total = yearOf(day) * 12 + (monthOf(day) - 1) + months
  const year = Math.floor(total / 12)
  const month = total - year * 12 + 1
  const length = daysInMonth(year, month)
  const date = dateOf(day)
  return { day: dayFromParts(year, month, Math.min(date, length)), clamped: date > length }
}

const monthsBetween = (from: number, to: number) => {
  let months = (yearOf(to) - yearOf(from)) * 12 + (monthOf(to) - monthOf(from))
  if (addMonths(from, months).day > to) months -= 1
  return months
}

export function difference(start: number, end: number, includeEnd: boolean): Difference {
  const forward = end >= start
  const from = Math.min(start, end)
  const to = Math.max(start, end) + (includeEnd ? 1 : 0)
  const days = to - from
  const months = monthsBetween(from, to)
  const monthDays = to - addMonths(from, months).day
  return {
    forward,
    days,
    weeks: Math.floor(days / 7),
    weekDays: days % 7,
    months,
    monthDays,
    years: Math.floor(months / 12),
    yearMonths: months % 12,
    yearDays: monthDays,
  }
}

export function shiftDate(day: number, count: number, unit: TimeUnit, operation: Operation): ShiftResult | null {
  const sign = operation === 'add' ? 1 : -1
  const months = unit === 'years' ? sign * count * 12 : sign * count
  if ((unit === 'months' || unit === 'years') && (targetYear(day, months) < MIN_YEAR || targetYear(day, months) > MAX_YEAR)) {
    return null
  }
  const result =
    unit === 'days'
      ? { day: day + sign * count, clamped: false }
      : unit === 'weeks'
        ? { day: day + sign * count * 7, clamped: false }
        : addMonths(day, months)
  return result.day < MIN_DAY || result.day > MAX_DAY ? null : result
}

const numberText = (value: number) => value.toLocaleString('he-IL')

const unitWords: Record<TimeUnit, { one: string; two: string; many: string }> = {
  days: { one: 'יום אחד', two: 'יומיים', many: 'ימים' },
  weeks: { one: 'שבוע אחד', two: 'שבועיים', many: 'שבועות' },
  months: { one: 'חודש אחד', two: 'חודשיים', many: 'חודשים' },
  years: { one: 'שנה אחת', two: 'שנתיים', many: 'שנים' },
}

export const countText = (value: number, unit: TimeUnit) => {
  const words = unitWords[unit]
  if (value === 1) return words.one
  if (value === 2) return words.two
  return `${numberText(value)} ${words.many}`
}

const withVav = (text: string) => (/^\d/.test(text) ? `ו-${text}` : `ו${text}`)

export const joinParts = (parts: string[]) => {
  if (parts.length <= 1) return parts[0] ?? ''
  return `${parts.slice(0, -1).join(', ')} ${withVav(parts[parts.length - 1])}`
}

export const compoundText = (pairs: [number, TimeUnit][]) => {
  const parts = pairs.filter(([value]) => value > 0).map(([value, unit]) => countText(value, unit))
  return parts.length ? joinParts(parts) : countText(0, 'days')
}

export const weeksText = (diff: Difference) =>
  compoundText([
    [diff.weeks, 'weeks'],
    [diff.weekDays, 'days'],
  ])

export const monthsText = (diff: Difference) =>
  compoundText([
    [diff.months, 'months'],
    [diff.monthDays, 'days'],
  ])

export const yearsText = (diff: Difference) =>
  compoundText([
    [diff.years, 'years'],
    [diff.yearMonths, 'months'],
    [diff.yearDays, 'days'],
  ])

export const hebrewDateOf = (day: number) => {
  const year = yearOf(day)
  if (year < MIN_GREGORIAN_YEAR || year > MAX_GREGORIAN_YEAR || !supportsHebrewCalendar()) return ''
  try {
    return hebrewDateLetters(toHebrew(day))
  } catch {
    return ''
  }
}

const inWorkRange = (from: number, to: number) => yearOf(from) >= WORK_MIN_YEAR && yearOf(to) <= WORK_MAX_YEAR

export function workDaysIn(from: number, to: number) {
  if (to < from) return 0
  if (!inWorkRange(from, to)) return null
  return countWorkDays(from, to, DEFAULT_SETTINGS)?.workDays ?? null
}

export function specialDayOn(day: number): SpecialDay | null {
  const year = yearOf(day)
  if (year < WORK_MIN_YEAR || year > WORK_MAX_YEAR) return null
  return specialDaysForYear(year)?.find((special) => special.day === day) ?? null
}

export function holidayOn(id: HolidayId, year: number): number | null {
  if (year < WORK_MIN_YEAR || year > WORK_MAX_YEAR) return null
  try {
    if (id === 'hanukkah') return fromHebrew({ year: year + HEBREW_YEAR_OFFSET + 1, month: 'kislev', day: 25 })
    if (id === 'purim') {
      const hebrewYear = year + HEBREW_YEAR_OFFSET
      return fromHebrew({ year: hebrewYear, month: monthForYear('adar', hebrewYear), day: 14 })
    }
    const name = workDaysName[id]
    return specialDaysForYear(year)?.find((special) => special.name === name && special.kind === 'rest')?.day ?? null
  } catch {
    return null
  }
}

export function nextHolidays(from: number): HolidayDate[] {
  const year = yearOf(from)
  return holidays
    .map((holiday) => {
      const day = [year, year + 1]
        .map((candidate) => holidayOn(holiday.id, candidate))
        .find((candidate): candidate is number => candidate !== null && candidate >= from)
      return day === undefined ? null : { ...holiday, day }
    })
    .filter((holiday): holiday is HolidayDate => holiday !== null)
    .sort((a, b) => a.day - b.day)
}

export function holidaysBetween(from: number, to: number): HolidayDate[] {
  const found: HolidayDate[] = []
  for (let year = yearOf(from); year <= yearOf(to); year += 1) {
    for (const holiday of holidays) {
      const day = holidayOn(holiday.id, year)
      if (day !== null && day >= from && day <= to) found.push({ ...holiday, day })
    }
  }
  return found.sort((a, b) => a.day - b.day)
}

export const holidayName = (id: HolidayId) => holidays.find((holiday) => holiday.id === id)?.name ?? ''

const specialNote = (day: number) => {
  const special = specialDayOn(day)
  if (special) return `${formatDate(day)} הוא ${special.name}.`
  if (weekdayOf(day) === 6) return `${formatDate(day)} חל בשבת.`
  return ''
}

const hebrewDetail = (label: string, day: number): Detail[] => {
  const hebrew = hebrewDateOf(day)
  return hebrew ? [{ label, value: hebrew }] : []
}

const breakdownDetails = (diff: Difference): Detail[] => [
  ...(diff.weeks ? [{ label: 'בשבועות', value: weeksText(diff) }] : []),
  ...(diff.months ? [{ label: 'בחודשים', value: monthsText(diff) }] : []),
  ...(diff.years ? [{ label: 'בשנים, חודשים וימים', value: yearsText(diff) }] : []),
]

const datesIncomplete = (values: ParsedDay[]) => values.some((value) => !value.ok && value.reason === 'empty')

const fixFields: Outcome = { kind: 'message', message: 'כדי לראות את התוצאה, תקנו את השדה שמתחתיו הודעת שגיאה.' }

function betweenOutcome(inputs: CalcInputs): Outcome {
  const start = parseDay(inputs.start)
  const end = parseDay(inputs.end)
  if (!start.ok || !end.ok) {
    return datesIncomplete([start, end])
      ? { kind: 'message', message: 'בחרו תאריך התחלה ותאריך סיום.' }
      : fixFields
  }
  const diff = difference(start.day, end.day, inputs.includeEnd)
  const from = Math.min(start.day, end.day)
  const to = Math.max(start.day, end.day)
  const workDays = workDaysIn(from, inputs.includeEnd ? to : to - 1)
  const inclusion = inputs.includeEnd ? 'כולל יום הסיום' : 'בלי יום הסיום'
  const headline = countText(diff.days, 'days')
  const sentence = `בין ${formatDate(start.day)} ל-${formatDate(end.day)}, ${inclusion}`
  const notes = diff.forward ? [] : ['תאריך הסיום מוקדם מתאריך ההתחלה, ולכן זה מספר הימים אחורה.']
  const breakdown = breakdownDetails(diff)
  const details: Detail[] = [
    ...breakdown,
    ...hebrewDetail('תאריך ההתחלה בעברית', start.day),
    ...hebrewDetail('תאריך הסיום בעברית', end.day),
  ]
  return {
    kind: 'result',
    headline,
    sentence,
    details,
    notes,
    workDays,
    text: [
      `${sentence}: ${headline}.`,
      breakdown.map((detail) => `${detail.label}: ${detail.value}.`).join(' '),
      workDays === null ? '' : `ימי עבודה בטווח (ראשון עד חמישי, בלי חגים): ${numberText(workDays)}.`,
    ]
      .filter(Boolean)
      .join('\n'),
  }
}

function addOutcome(inputs: CalcInputs): Outcome {
  const base = parseDay(inputs.base)
  const count = parseCount(inputs.count)
  if (!base.ok || !count.ok) {
    const empty = datesIncomplete([base]) || (!count.ok && count.reason === 'empty')
    return empty ? { kind: 'message', message: 'בחרו תאריך והקלידו מספר.' } : fixFields
  }
  const result = shiftDate(base.day, count.value, inputs.unit, inputs.operation)
  if (!result) {
    return { kind: 'message', message: `התוצאה יוצאת מחוץ לטווח של ${MIN_YEAR} עד ${MAX_YEAR}. נסו מספר קטן יותר.` }
  }
  const amount = countText(count.value, inputs.unit)
  const direction = inputs.operation === 'add' ? 'אחרי' : 'לפני'
  const sentence = `${amount} ${direction} ${formatDate(base.day)}`
  const headline = formatLongDate(result.day)
  const notes = [
    result.clamped
      ? `ב${MONTH_NAMES[monthOf(result.day) - 1]} ${yearOf(result.day)} אין ${dateOf(base.day)} ימים, ולכן התוצאה היא היום האחרון בחודש.`
      : '',
    specialNote(result.day),
  ].filter(Boolean)
  const span = Math.abs(result.day - base.day)
  const details: Detail[] = [
    ...(inputs.unit === 'days' ? [] : [{ label: 'ימים בדרך', value: countText(span, 'days') }]),
    ...hebrewDetail('בתאריך העברי', result.day),
  ]
  return {
    kind: 'result',
    headline,
    sentence,
    details,
    notes,
    workDays: null,
    text: `${sentence}: ${headline}.${notes.length ? ` ${notes.join(' ')}` : ''}`,
  }
}

function countdownOutcome(inputs: CalcInputs, today: number): Outcome {
  const target =
    inputs.target === 'custom'
      ? parseDay(inputs.targetDate)
      : (() => {
          const found = nextHolidays(today).find((holiday) => holiday.id === inputs.target)
          return found ? ({ ok: true, day: found.day } as const) : ({ ok: false, reason: 'invalid' } as const)
        })()
  if (!target.ok) {
    if (target.reason === 'empty') return { kind: 'message', message: 'בחרו תאריך יעד.' }
    return inputs.target === 'custom'
      ? fixFields
      : { kind: 'message', message: 'הדפדפן הזה לא מחשב את הלוח העברי. בחרו ״תאריך אחר״ והקלידו את התאריך.' }
  }
  const diff = difference(today, target.day, false)
  const label = inputs.target === 'custom' ? formatLongDate(target.day) : `${holidayName(inputs.target)}, ${formatLongDate(target.day)}`
  const headline =
    diff.days === 0 ? 'היום' : diff.forward ? `עוד ${countText(diff.days, 'days')}` : `עברו ${countText(diff.days, 'days')}`
  const sentence = diff.days === 0 ? `${label} הוא היום` : diff.forward ? `עד ${label}` : `מאז ${label}`
  const notes = [
    inputs.target === 'custom' ? '' : `החג מתחיל בערב שלפני, ${formatLongDate(target.day - 1)}.`,
    `נכון להיום, ${formatDate(today)}.`,
  ].filter(Boolean)
  const details: Detail[] = [...breakdownDetails(diff), ...hebrewDetail('בתאריך העברי', target.day)]
  return {
    kind: 'result',
    headline,
    sentence,
    details,
    notes,
    workDays: null,
    text: `${headline} ${sentence}. ${notes.join(' ')}`.replace(/\s+/g, ' ').trim(),
  }
}

export function calculate(mode: CalcMode, inputs: CalcInputs, today: number): Outcome {
  if (mode === 'add') return addOutcome(inputs)
  if (mode === 'countdown') return countdownOutcome(inputs, today)
  return betweenOutcome(inputs)
}

export const calcModes: { id: CalcMode; label: string; hint: string }[] = [
  { id: 'between', label: 'ימים בין תאריכים', hint: 'כמה ימים, שבועות וחודשים' },
  { id: 'add', label: 'הוספת ימים לתאריך', hint: 'תאריך ועוד או פחות' },
  { id: 'countdown', label: 'כמה ימים נשארו עד', hint: 'לתאריך או לחג' },
]

export const unitOptions: { value: TimeUnit; label: string }[] = [
  { value: 'days', label: 'ימים' },
  { value: 'weeks', label: 'שבועות' },
  { value: 'months', label: 'חודשים' },
  { value: 'years', label: 'שנים' },
]

export const operationOptions: { value: Operation; label: string }[] = [
  { value: 'add', label: 'הוספה' },
  { value: 'subtract', label: 'הפחתה' },
]

const isMode = (value: string): value is CalcMode => calcModes.some((mode) => mode.id === value)

const isUnit = (value: string): value is TimeUnit => unitOptions.some((option) => option.value === value)

export const defaultInputs = (today: number): CalcInputs => ({
  start: isoFromDay(dayFromParts(yearOf(today), 1, 1)),
  end: isoFromDay(today),
  includeEnd: false,
  base: isoFromDay(today),
  count: '30',
  unit: 'days',
  operation: 'add',
  target: nextHolidays(today)[0]?.id ?? 'custom',
  targetDate: isoFromDay(today + 100),
})

const validIso = (value: string | null) => (value && parseDay(value).ok ? value : null)

export function readQuery(search: string, today: number): { mode: CalcMode; inputs: CalcInputs } {
  const params = new URLSearchParams(search)
  const inputs = defaultInputs(today)
  const rawMode = params.get('mode') ?? ''
  const mode: CalcMode = isMode(rawMode) ? rawMode : 'between'
  if (mode === 'between') {
    inputs.start = validIso(params.get('from')) ?? inputs.start
    inputs.end = validIso(params.get('to')) ?? inputs.end
    inputs.includeEnd = params.get('end') === '1'
  }
  if (mode === 'add') {
    inputs.base = validIso(params.get('date')) ?? inputs.base
    const count = params.get('n') ?? ''
    if (parseCount(count).ok) inputs.count = count
    const unit = params.get('unit') ?? ''
    if (isUnit(unit)) inputs.unit = unit
    if (params.get('op') === 'subtract') inputs.operation = 'subtract'
  }
  if (mode === 'countdown') {
    const holiday = params.get('holiday') ?? ''
    const to = validIso(params.get('to'))
    if (isHolidayId(holiday)) inputs.target = holiday
    else if (to) {
      inputs.target = 'custom'
      inputs.targetDate = to
    }
  }
  return { mode, inputs }
}

export function writeQuery(mode: CalcMode, inputs: CalcInputs) {
  const params = new URLSearchParams()
  if (mode === 'between') {
    params.set('from', inputs.start)
    params.set('to', inputs.end)
    if (inputs.includeEnd) params.set('end', '1')
  }
  if (mode === 'add') {
    params.set('mode', 'add')
    params.set('date', inputs.base)
    params.set('n', inputs.count)
    params.set('unit', inputs.unit)
    if (inputs.operation === 'subtract') params.set('op', 'subtract')
  }
  if (mode === 'countdown') {
    params.set('mode', 'countdown')
    if (inputs.target === 'custom') params.set('to', inputs.targetDate)
    else params.set('holiday', inputs.target)
  }
  return params.toString()
}

export const todayDay = () => {
  const [year, month, date] = todayIso().split('-').map(Number)
  return dayFromParts(year, month, date)
}
