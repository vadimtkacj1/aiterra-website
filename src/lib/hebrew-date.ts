export type HebrewMonth =
  | 'tishri'
  | 'heshvan'
  | 'kislev'
  | 'tevet'
  | 'shevat'
  | 'adar'
  | 'adar1'
  | 'adar2'
  | 'nisan'
  | 'iyar'
  | 'sivan'
  | 'tamuz'
  | 'av'
  | 'elul'

export type HebrewDate = { year: number; month: HebrewMonth; day: number }

export type HebrewDateInput = { day: string; month: HebrewMonth; year: string }

export type ConverterMode = 'hebrew-to-gregorian' | 'gregorian-to-hebrew' | 'hebrew-age'

export type BirthKind = 'gregorian' | 'hebrew'

export type Detail = { label: string; value: string }

export type DateRow = { hebrew: string; gregorian: string; weekday: string }

export type Milestone = { title: string; hebrew: string; gregorian: string }

export type ConverterResult = {
  kind: 'result'
  lead: string
  headline: string
  sub: string
  details: Detail[]
  upcoming: DateRow[]
  milestones: Milestone[]
  notes: string[]
  copyMain: string
  copyAll: string
  announce: string
}

export type ConverterOutcome = ConverterResult | { kind: 'message'; tone: 'empty' | 'error'; message: string }

export type ParsedYear = { ok: true; year: number } | { ok: false; reason: 'empty' | 'invalid' | 'range' }

export const MIN_GREGORIAN_YEAR = 1800
export const MAX_GREGORIAN_YEAR = 2199
export const MIN_HEBREW_YEAR = 5561
export const MAX_HEBREW_YEAR = 5959
export const MIN_ISO = `${MIN_GREGORIAN_YEAR}-01-01`
export const MAX_ISO = `${MAX_GREGORIAN_YEAR}-12-31`
export const UPCOMING_YEARS = 5

const DAY_MS = 86_400_000
const SEARCH_DAYS = 60
const MEAN_YEAR_DAYS = 365.2468
const MEAN_MONTH_DAYS = 29.5306
const ANCHOR_YEAR = 5787

export const converterModes: { id: ConverterMode; label: string; hint: string }[] = [
  { id: 'hebrew-to-gregorian', label: 'מעברי ללועזי', hint: 'תאריך עברי לתאריך לועזי' },
  { id: 'gregorian-to-hebrew', label: 'מלועזי לעברי', hint: 'תאריך לועזי לתאריך עברי' },
  { id: 'hebrew-age', label: 'גיל ובר מצווה', hint: 'גיל ויום הולדת עברי' },
]

export const DEFAULT_MODE: ConverterMode = 'hebrew-to-gregorian'

export const modeFromHash = (hash: string) =>
  converterModes.find((mode) => `#${mode.id}` === hash)?.id ?? null

export const hebrewMonthNames: Record<HebrewMonth, string> = {
  tishri: 'תשרי',
  heshvan: 'חשוון',
  kislev: 'כסלו',
  tevet: 'טבת',
  shevat: 'שבט',
  adar: 'אדר',
  adar1: 'אדר א׳',
  adar2: 'אדר ב׳',
  nisan: 'ניסן',
  iyar: 'אייר',
  sivan: 'סיוון',
  tamuz: 'תמוז',
  av: 'אב',
  elul: 'אלול',
}

const fixedMonthLength: Partial<Record<HebrewMonth, number>> = {
  tishri: 30,
  tevet: 29,
  shevat: 30,
  adar: 29,
  adar1: 30,
  adar2: 29,
  nisan: 30,
  iyar: 29,
  sivan: 30,
  tamuz: 29,
  av: 30,
  elul: 29,
}

const intlMonths: Record<string, HebrewMonth> = {
  tishri: 'tishri',
  tishrei: 'tishri',
  heshvan: 'heshvan',
  cheshvan: 'heshvan',
  marcheshvan: 'heshvan',
  kislev: 'kislev',
  tevet: 'tevet',
  teveth: 'tevet',
  shevat: 'shevat',
  shvat: 'shevat',
  adar: 'adar',
  adari: 'adar1',
  adar1: 'adar1',
  adarii: 'adar2',
  adar2: 'adar2',
  nisan: 'nisan',
  nissan: 'nisan',
  iyar: 'iyar',
  iyyar: 'iyar',
  sivan: 'sivan',
  tamuz: 'tamuz',
  tammuz: 'tamuz',
  av: 'av',
  elul: 'elul',
}

const gregorianMonthNames = [
  'ינואר',
  'פברואר',
  'מרץ',
  'אפריל',
  'מאי',
  'יוני',
  'יולי',
  'אוגוסט',
  'ספטמבר',
  'אוקטובר',
  'נובמבר',
  'דצמבר',
]

const weekdayNames = ['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי', 'שבת']

const nightNames = ['מוצאי שבת', 'ליל שני', 'ליל שלישי', 'ליל רביעי', 'ליל חמישי', 'ליל שישי', 'ליל שבת']

const letterValues: [number, string][] = [
  [400, 'ת'],
  [300, 'ש'],
  [200, 'ר'],
  [100, 'ק'],
  [90, 'צ'],
  [80, 'פ'],
  [70, 'ע'],
  [60, 'ס'],
  [50, 'נ'],
  [40, 'מ'],
  [30, 'ל'],
  [20, 'כ'],
  [10, 'י'],
  [9, 'ט'],
  [8, 'ח'],
  [7, 'ז'],
  [6, 'ו'],
  [5, 'ה'],
  [4, 'ד'],
  [3, 'ג'],
  [2, 'ב'],
  [1, 'א'],
]

const letterLookup: Record<string, number> = {
  ...Object.fromEntries(letterValues.map(([value, letter]) => [letter, value])),
  ך: 20,
  ם: 40,
  ן: 50,
  ף: 80,
  ץ: 90,
}

let formatter: Intl.DateTimeFormat | null = null
const hebrewCache = new Map<number, HebrewDate>()
const monthStartCache = new Map<string, number | null>()

const hebrewFormatter = () => {
  formatter ??= new Intl.DateTimeFormat('en-u-ca-hebrew', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
  return formatter
}

export const dayNumberOf = (year: number, month: number, day: number) => {
  const date = new Date(Date.UTC(2000, month - 1, day))
  date.setUTCFullYear(year)
  return Math.round(date.getTime() / DAY_MS)
}

const dateOf = (dayNumber: number) => new Date(dayNumber * DAY_MS)

export const toHebrew = (dayNumber: number): HebrewDate => {
  const cached = hebrewCache.get(dayNumber)
  if (cached) return cached
  const parts = hebrewFormatter().formatToParts(dateOf(dayNumber))
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? ''
  const month = intlMonths[part('month').toLowerCase().replace(/[^a-z0-9]/g, '')]
  const day = Number(part('day').replace(/\D/g, ''))
  const year = Number(part('year').replace(/\D/g, ''))
  if (!month || !day || !year) throw new Error('hebrew-calendar-unsupported')
  const result = { year, month, day }
  hebrewCache.set(dayNumber, result)
  return result
}

export const supportsHebrewCalendar = () => {
  try {
    const sample = toHebrew(dayNumberOf(2026, 10, 22))
    return sample.year === 5787 && sample.month === 'heshvan' && sample.day === 11
  } catch {
    return false
  }
}

export const isLeapYear = (year: number) => (7 * year + 1) % 19 < 7

export const monthsOfYear = (year: number | null): HebrewMonth[] => {
  const adar: HebrewMonth[] = year !== null && isLeapYear(year) ? ['adar1', 'adar2'] : ['adar']
  const spring: HebrewMonth[] = ['nisan', 'iyar', 'sivan', 'tamuz', 'av', 'elul']
  return ['tishri', 'heshvan', 'kislev', 'tevet', 'shevat', ...adar, ...spring]
}

export const monthForYear = (month: HebrewMonth, year: number | null): HebrewMonth => {
  const leap = year !== null && isLeapYear(year)
  if (leap && month === 'adar') return 'adar2'
  if (!leap && (month === 'adar1' || month === 'adar2')) return 'adar'
  return month
}

const estimateDay = (year: number, month: HebrewMonth, day: number) => {
  const anchor = dayNumberOf(2026, 9, 12)
  const monthIndex = monthsOfYear(year).indexOf(month)
  return anchor + Math.round((year - ANCHOR_YEAR) * MEAN_YEAR_DAYS + monthIndex * MEAN_MONTH_DAYS) + day - 1
}

const monthStart = (year: number, month: HebrewMonth) => {
  const key = `${year}-${month}`
  if (monthStartCache.has(key)) return monthStartCache.get(key) ?? null
  let found: number | null = null
  if (monthsOfYear(year).includes(month)) {
    const guess = estimateDay(year, month, 1)
    for (let offset = 0; offset <= SEARCH_DAYS && found === null; offset += 1) {
      for (const candidate of offset ? [guess + offset, guess - offset] : [guess]) {
        const date = toHebrew(candidate)
        if (date.year === year && date.month === month && date.day === 1) {
          found = candidate
          break
        }
      }
    }
  }
  monthStartCache.set(key, found)
  return found
}

export const monthLength = (year: number, month: HebrewMonth) => {
  const fixed = fixedMonthLength[month]
  if (fixed) return fixed
  const start = monthStart(year, month)
  if (start === null) return 29
  return toHebrew(start + 29).day === 30 ? 30 : 29
}

export const fromHebrew = (date: HebrewDate) => {
  if (date.day < 1 || date.day > monthLength(date.year, date.month)) return null
  const start = monthStart(date.year, date.month)
  return start === null ? null : start + date.day - 1
}

export const gematriaLetters = (value: number) => {
  let rest = value
  let letters = ''
  for (const [amount, letter] of letterValues.slice(0, 4)) {
    while (rest >= amount) {
      letters += letter
      rest -= amount
    }
  }
  if (rest === 15) return `${letters}טו`
  if (rest === 16) return `${letters}טז`
  for (const [amount, letter] of letterValues.slice(4)) {
    while (rest >= amount) {
      letters += letter
      rest -= amount
    }
  }
  return letters
}

export const gematria = (value: number) => {
  const letters = gematriaLetters(value)
  if (letters.length === 1) return `${letters}׳`
  return `${letters.slice(0, -1)}״${letters.slice(-1)}`
}

export const hebrewYearLetters = (year: number) => gematria(year % 1000)

export const hebrewYearFull = (year: number) =>
  `${gematriaLetters(Math.floor(year / 1000))}׳${hebrewYearLetters(year)}`

export const hebrewDateLetters = (date: HebrewDate) =>
  `${gematria(date.day)} ב${hebrewMonthNames[date.month]} ${hebrewYearFull(date.year)}`

const hebrewDateShort = (date: HebrewDate) =>
  `${gematria(date.day)} ב${hebrewMonthNames[date.month]} ${hebrewYearLetters(date.year)}`

export const hebrewDateNumbers = (date: HebrewDate) => `${date.day} ב${hebrewMonthNames[date.month]} ${date.year}`

export const dayOptionLabel = (day: number) => `${gematria(day)} (${day})`

export const parseHebrewYear = (text: string): ParsedYear => {
  const trimmed = text.trim()
  if (!trimmed) return { ok: false, reason: 'empty' }
  const compact = trimmed.replace(/\s+/g, '')
  let year: number | null = null

  if (/^\d+$/.test(compact)) {
    const value = Number(compact)
    year = value < 1000 ? value + 5000 : value
  } else {
    const explicit = compact.match(/^([א-ת])['׳`’]([א-ת"'׳״`’”“]+)$/u)
    const body = (explicit ? explicit[2] : compact).replace(/["'׳״`’”“]/g, '')
    if (!/^[א-ת]+$/u.test(body)) return { ok: false, reason: 'invalid' }
    const values = [...body].map((letter) => letterLookup[letter] ?? 0)
    if (values.some((value) => !value)) return { ok: false, reason: 'invalid' }
    let thousands = explicit ? (letterLookup[explicit[1]] ?? 0) : 0
    if (!explicit && values.length > 1 && values[0] < values[1]) thousands = values.shift() ?? 0
    const units = values.reduce((sum, value) => sum + value, 0)
    if (units >= 1000) return { ok: false, reason: 'invalid' }
    year = (thousands || 5) * 1000 + units
  }

  if (year < MIN_HEBREW_YEAR || year > MAX_HEBREW_YEAR) return { ok: false, reason: 'range' }
  return { ok: true, year }
}

const yearWithNumber = (year: number) => `${hebrewYearFull(year)} (${year})`

export const yearRangeText = `אפשר להמיר שנים עבריות בין ${yearWithNumber(MIN_HEBREW_YEAR)} לבין ${yearWithNumber(
  MAX_HEBREW_YEAR,
)}.`

export const yearHint = (parsed: ParsedYear) => {
  if (!parsed.ok) return 'למשל 5787 או תשפ״ז'
  const kind = isLeapYear(parsed.year) ? 'שנה מעוברת, עם אדר א׳ ואדר ב׳' : 'שנה רגילה, עם אדר אחד'
  return `${hebrewYearFull(parsed.year)} (${parsed.year}): ${kind}`
}

export const yearError = (parsed: ParsedYear) => {
  if (parsed.ok || parsed.reason === 'empty') return ''
  if (parsed.reason === 'range') return yearRangeText
  return 'הקלידו שנה בספרות, כמו 5787, או באותיות, כמו תשפ״ז.'
}

const pad = (value: number) => String(value).padStart(2, '0')

const gregorianParts = (dayNumber: number) => {
  const date = dateOf(dayNumber)
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    weekday: date.getUTCDay(),
  }
}

export const isoOf = (dayNumber: number) => {
  const { year, month, day } = gregorianParts(dayNumber)
  return `${String(year).padStart(4, '0')}-${pad(month)}-${pad(day)}`
}

export const parseIso = (value: string) => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null
  const [year, month, day] = match.slice(1).map(Number)
  if (year < MIN_GREGORIAN_YEAR || year > MAX_GREGORIAN_YEAR) return null
  const dayNumber = dayNumberOf(year, month, day)
  const check = gregorianParts(dayNumber)
  if (check.year !== year || check.month !== month || check.day !== day) return null
  return dayNumber
}

export const todayDayNumber = () => {
  const now = new Date()
  return dayNumberOf(now.getFullYear(), now.getMonth() + 1, now.getDate())
}

export const weekdayOf = (dayNumber: number) => weekdayNames[gregorianParts(dayNumber).weekday]

const nightOf = (dayNumber: number) => nightNames[gregorianParts(dayNumber + 1).weekday]

export const gregorianLong = (dayNumber: number) => {
  const { year, month, day } = gregorianParts(dayNumber)
  return `${day} ב${gregorianMonthNames[month - 1]} ${year}`
}

export const gregorianShort = (dayNumber: number) => {
  const { year, month, day } = gregorianParts(dayNumber)
  return `${day}.${month}.${year}`
}

const yearKind = (year: number) =>
  `${hebrewYearLetters(year)}, ${isLeapYear(year) ? 'שנה מעוברת (13 חודשים)' : 'שנה רגילה (12 חודשים)'}`

export const anniversaryOf = (date: HebrewDate, targetYear: number): HebrewDate => {
  if (targetYear === date.year) return date
  const targetLeap = isLeapYear(targetYear)
  if (date.month === 'adar' || date.month === 'adar2') {
    return { year: targetYear, month: targetLeap ? 'adar2' : 'adar', day: date.day }
  }
  if (date.month === 'adar1' && !targetLeap) {
    if (date.day === 30) return { year: targetYear, month: 'nisan', day: 1 }
    return { year: targetYear, month: 'adar', day: date.day }
  }
  if (date.day === 30 && (date.month === 'heshvan' || date.month === 'kislev')) {
    if (monthLength(targetYear, date.month) === 29) {
      return { year: targetYear, month: date.month === 'heshvan' ? 'kislev' : 'tevet', day: 1 }
    }
  }
  return { ...date, year: targetYear }
}

const anniversaryDay = (date: HebrewDate, targetYear: number) => fromHebrew(anniversaryOf(date, targetYear))

const upcomingRows = (date: HebrewDate, originDay: number, today: number) => {
  const rows: DateRow[] = []
  const startYear = Math.max(date.year + 1, toHebrew(today).year)
  for (let year = startYear; year <= MAX_HEBREW_YEAR && rows.length < UPCOMING_YEARS; year += 1) {
    const target = anniversaryOf(date, year)
    const dayNumber = fromHebrew(target)
    if (dayNumber === null || dayNumber < today || dayNumber <= originDay) continue
    rows.push({
      hebrew: hebrewDateShort(target),
      gregorian: gregorianShort(dayNumber),
      weekday: weekdayOf(dayNumber),
    })
  }
  return rows
}

const anniversaryNotes = (date: HebrewDate) => {
  const memorial = 'ליום זיכרון (אזכרה) יש מנהגים שונים, וכדאי לשאול רב.'
  if (date.month === 'adar' || date.month === 'adar2') {
    return [`בשנה מעוברת הטבלה מציגה את אדר ב׳, כמו שנוהגים ביום הולדת ובבר מצווה. ${memorial}`]
  }
  if (date.month === 'adar1') {
    const thirty = date.day === 30 ? ' במקום ל׳ באדר א׳ היא מציגה בשנה כזו את א׳ בניסן, כי באדר יש 29 ימים.' : ''
    return [`בשנה רגילה יש רק אדר אחד, והטבלה מציגה אותו.${thirty} ${memorial}`]
  }
  if (date.day === 30 && (date.month === 'heshvan' || date.month === 'kislev')) {
    const next = date.month === 'heshvan' ? 'א׳ בכסלו' : 'א׳ בטבת'
    const name = hebrewMonthNames[date.month]
    return [`בשנים שבהן יש ב${name} 29 ימים, הטבלה מציגה את ${next}, כמו שנוהגים ביום הולדת. ${memorial}`]
  }
  return []
}

const missingDayMessage = (date: HebrewDate) => {
  const name = hebrewMonthNames[date.month]
  if (fixedMonthLength[date.month] === 29) return `בחודש ${name} יש תמיד 29 ימים, ולכן אין בו ל׳.`
  const next = date.month === 'heshvan' ? 'א׳ בכסלו' : 'א׳ בטבת'
  const year = hebrewYearLetters(date.year)
  return `בשנת ${year} יש ב${name} 29 ימים בלבד, ולכן אין ל׳ ב${name}. אחרי כ״ט ב${name} בא ${next}.`
}

const daysUntilText = (days: number) => {
  if (days === 0) return 'היום'
  if (days === 1) return 'מחר'
  if (days === 2) return 'בעוד יומיים'
  return `בעוד ${days.toLocaleString('he-IL')} ימים`
}

const yearsText = (years: number) => {
  if (years === 0) return 'פחות משנה'
  if (years === 1) return 'שנה אחת'
  if (years === 2) return 'שנתיים'
  return `${years} שנים`
}

const gregorianAge = (birth: number, today: number) => {
  const from = gregorianParts(birth)
  const to = gregorianParts(today)
  const beforeBirthday = to.month < from.month || (to.month === from.month && to.day < from.day)
  return to.year - from.year - (beforeBirthday ? 1 : 0)
}

const detailsToText = (details: Detail[]) => details.map((detail) => `${detail.label}: ${detail.value}`)

const unsupported: ConverterOutcome = {
  kind: 'message',
  tone: 'error',
  message: 'הדפדפן הזה לא יודע לחשב את הלוח העברי. נסו גרסה עדכנית של Chrome, Safari, Edge או Firefox.',
}

const hebrewDateFromInput = (input: HebrewDateInput): HebrewDate | ConverterOutcome => {
  const parsed = parseHebrewYear(input.year)
  if (!parsed.ok) {
    if (parsed.reason === 'empty') {
      return { kind: 'message', tone: 'empty', message: 'הקלידו שנה עברית כדי לראות את התוצאה.' }
    }
    return { kind: 'message', tone: 'error', message: yearError(parsed) }
  }
  const month = monthForYear(input.month, parsed.year)
  const date: HebrewDate = { year: parsed.year, month, day: Number(input.day) }
  if (fromHebrew(date) === null) return { kind: 'message', tone: 'error', message: missingDayMessage(date) }
  return date
}

const isOutcome = (value: HebrewDate | ConverterOutcome): value is ConverterOutcome => 'kind' in value

export const convertGregorian = (iso: string, afterSunset: boolean, supported: boolean): ConverterOutcome => {
  if (!supported) return unsupported
  if (!iso) return { kind: 'message', tone: 'empty', message: 'בחרו תאריך לועזי כדי לראות את התאריך העברי.' }
  const civil = parseIso(iso)
  if (civil === null) {
    return {
      kind: 'message',
      tone: 'error',
      message: `אפשר להמיר תאריכים משנת ${MIN_GREGORIAN_YEAR} עד שנת ${MAX_GREGORIAN_YEAR}.`,
    }
  }
  const dayNumber = civil + (afterSunset ? 1 : 0)
  const hebrew = toHebrew(dayNumber)
  const letters = hebrewDateLetters(hebrew)
  const weekday = afterSunset ? `${nightOf(civil)} (${weekdayOf(civil)} בערב)` : weekdayOf(civil)
  const details: Detail[] = [
    { label: 'במספרים', value: hebrewDateNumbers(hebrew) },
    { label: 'התאריך הלועזי', value: `${gregorianLong(civil)}${afterSunset ? ', אחרי השקיעה' : ''}` },
    { label: 'השנה', value: yearKind(hebrew.year) },
  ]
  const notes = afterSunset
    ? [`סימנתם שהאירוע היה אחרי השקיעה, ולכן התאריך העברי הוא של ${weekdayOf(civil + 1)}: היום העברי מתחיל בערב.`]
    : []
  return {
    kind: 'result',
    lead: 'התאריך העברי',
    headline: letters,
    sub: weekday,
    details,
    upcoming: [],
    milestones: [],
    notes,
    copyMain: letters,
    copyAll: [`התאריך העברי: ${letters}`, `היום בשבוע: ${weekday}`, ...detailsToText(details)].join('\n'),
    announce: `התאריך העברי: ${letters}`,
  }
}

export const convertHebrew = (
  input: HebrewDateInput,
  today: number | null,
  supported: boolean,
): ConverterOutcome => {
  if (!supported) return unsupported
  const date = hebrewDateFromInput(input)
  if (isOutcome(date)) return date
  const dayNumber = fromHebrew(date) ?? 0
  const letters = hebrewDateLetters(date)
  const longText = gregorianLong(dayNumber)
  const details: Detail[] = [
    { label: 'בתאריך עברי', value: letters },
    { label: 'במספרים', value: gregorianShort(dayNumber) },
    { label: 'מתחיל בערב', value: `${weekdayOf(dayNumber - 1)}, ${gregorianShort(dayNumber - 1)}, בצאת הכוכבים` },
    { label: 'השנה', value: yearKind(date.year) },
  ]
  const upcoming = today === null ? [] : upcomingRows(date, dayNumber, today)
  const upcomingText = upcoming.map((row) => `${row.hebrew}: ${row.weekday}, ${row.gregorian}`)
  return {
    kind: 'result',
    lead: 'התאריך הלועזי',
    headline: longText,
    sub: weekdayOf(dayNumber),
    details,
    upcoming,
    milestones: [],
    notes: upcoming.length ? anniversaryNotes(date) : [],
    copyMain: `${weekdayOf(dayNumber)}, ${longText}`,
    copyAll: [
      `${letters} = ${weekdayOf(dayNumber)}, ${longText}`,
      ...detailsToText(details.slice(1)),
      ...(upcomingText.length ? ['', 'אותו תאריך עברי בשנים הבאות:', ...upcomingText] : []),
    ].join('\n'),
    announce: `${letters} הוא ${weekdayOf(dayNumber)}, ${longText}`,
  }
}

export const hebrewAge = ({
  kind,
  iso,
  afterSunset,
  hebrewInput,
  today,
  supported,
}: {
  kind: BirthKind
  iso: string
  afterSunset: boolean
  hebrewInput: HebrewDateInput
  today: number | null
  supported: boolean
}): ConverterOutcome => {
  if (!supported) return unsupported
  if (today === null) return { kind: 'message', tone: 'empty', message: 'רגע, מחשבים את התאריך של היום.' }

  let birthDay: number
  let birth: HebrewDate
  if (kind === 'gregorian') {
    if (!iso) return { kind: 'message', tone: 'empty', message: 'בחרו תאריך לידה כדי לראות את הגיל העברי.' }
    const civil = parseIso(iso)
    if (civil === null) {
      return {
        kind: 'message',
        tone: 'error',
        message: `אפשר לחשב תאריכי לידה משנת ${MIN_GREGORIAN_YEAR} ואילך.`,
      }
    }
    birthDay = civil + (afterSunset ? 1 : 0)
    birth = toHebrew(birthDay)
  } else {
    const date = hebrewDateFromInput(hebrewInput)
    if (isOutcome(date)) return date
    birth = date
    birthDay = fromHebrew(date) ?? 0
  }

  const civilBirth = kind === 'gregorian' ? (parseIso(iso) ?? birthDay) : birthDay
  if (civilBirth > today) {
    return { kind: 'message', tone: 'error', message: 'תאריך הלידה עוד לא הגיע. בחרו תאריך שכבר עבר.' }
  }

  const currentYear = toHebrew(today).year
  const thisYear = anniversaryDay(birth, currentYear) ?? today
  const reached = today >= thisYear
  const age = Math.max(0, currentYear - birth.year - (reached ? 0 : 1))
  const birthdayToday = today === thisYear && age > 0
  const nextYear = Math.max(birth.year + 1, reached && !birthdayToday ? currentYear + 1 : currentYear)
  const nextHebrew = anniversaryOf(birth, nextYear)
  const nextDay = fromHebrew(nextHebrew) ?? today
  const letters = hebrewDateLetters(birth)

  const milestone = (title: string, years: number): Milestone => {
    const target = anniversaryOf(birth, birth.year + years)
    const dayNumber = fromHebrew(target) ?? 0
    return {
      title,
      hebrew: hebrewDateLetters(target),
      gregorian: `${weekdayOf(dayNumber)}, ${gregorianShort(dayNumber)}`,
    }
  }
  const milestones =
    birth.year + 13 <= MAX_HEBREW_YEAR ? [milestone('בר מצווה, גיל 13', 13), milestone('בת מצווה, גיל 12', 12)] : []

  const details: Detail[] = [
    { label: 'תאריך הלידה העברי', value: letters },
    { label: 'הגיל לפי הלוח הלועזי', value: yearsText(gregorianAge(civilBirth, today)) },
    {
      label: birthdayToday ? 'יום ההולדת העברי' : 'יום ההולדת העברי הבא',
      value: `${hebrewDateShort(nextHebrew)}, ${weekdayOf(nextDay)} ${gregorianShort(nextDay)}`,
    },
    ...(birthdayToday ? [] : [{ label: 'עד יום ההולדת', value: daysUntilText(nextDay - today) }]),
  ]

  const notes = [
    'בר ובת מצווה כאן הם חישוב לפי הלוח: היום שבו מלאו 13 או 12 שנים עבריות, והוא מתחיל בערב שלפניו. את העלייה לתורה ואת החגיגה קובעים עם בית הכנסת או הרב.',
  ]

  return {
    kind: 'result',
    lead: 'הגיל לפי הלוח העברי',
    headline: yearsText(age),
    sub: birthdayToday ? 'היום יום ההולדת העברי שלכם. מזל טוב!' : '',
    details,
    upcoming: [],
    milestones,
    notes,
    copyMain: letters,
    copyAll: [
      `הגיל לפי הלוח העברי: ${yearsText(age)}`,
      ...detailsToText(details),
      ...milestones.map((item) => `${item.title}: ${item.hebrew}, ${item.gregorian}`),
    ].join('\n'),
    announce: `הגיל לפי הלוח העברי: ${yearsText(age)}. תאריך הלידה העברי: ${letters}`,
  }
}
