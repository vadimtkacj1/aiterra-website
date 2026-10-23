import {
  MAX_GREGORIAN_YEAR,
  MAX_HEBREW_YEAR,
  MIN_GREGORIAN_YEAR,
  MIN_HEBREW_YEAR,
  UPCOMING_YEARS,
  anniversaryOf,
  fromHebrew,
  hebrewDateLetters,
  hebrewYearFull,
  isLeapYear,
  monthForYear,
  parseHebrewYear,
  parseIso,
  toHebrew,
  type BirthKind,
  type ConverterMode,
  type ConverterOutcome,
  type DateRow,
  type Detail,
  type HebrewDate,
  type HebrewDateInput,
  type HebrewMonth,
  type Milestone,
  type ParsedYear,
} from '@/lib/hebrew-date'

const DAY_MS = 86_400_000

export const enConverterModes: { id: ConverterMode; label: string; hint: string }[] = [
  { id: 'hebrew-to-gregorian', label: 'Hebrew to Gregorian', hint: 'Hebrew date to civil date' },
  { id: 'gregorian-to-hebrew', label: 'Gregorian to Hebrew', hint: 'Civil date to Hebrew date' },
  { id: 'hebrew-age', label: 'Age and bar mitzvah', hint: 'Hebrew age and birthday' },
]

export const enMonthNames: Record<HebrewMonth, string> = {
  tishri: 'Tishrei',
  heshvan: 'Cheshvan',
  kislev: 'Kislev',
  tevet: 'Tevet',
  shevat: 'Shevat',
  adar: 'Adar',
  adar1: 'Adar I',
  adar2: 'Adar II',
  nisan: 'Nisan',
  iyar: 'Iyar',
  sivan: 'Sivan',
  tamuz: 'Tammuz',
  av: 'Av',
  elul: 'Elul',
}

const dateOf = (dayNumber: number) => new Date(dayNumber * DAY_MS)

const longFormat = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' })
const shortFormat = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric' })
const weekdayFormat = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', weekday: 'long' })

const gregorianLong = (dayNumber: number) => longFormat.format(dateOf(dayNumber))
const gregorianShort = (dayNumber: number) => shortFormat.format(dateOf(dayNumber))
const weekdayOf = (dayNumber: number) => weekdayFormat.format(dateOf(dayNumber))

export const enHebrewDate = (date: HebrewDate) => `${date.day} ${enMonthNames[date.month]} ${date.year}`

const yearKind = (year: number) =>
  `${year} (${hebrewYearFull(year)}), ${isLeapYear(year) ? 'leap year (13 months)' : 'regular year (12 months)'}`

export const enYearHint = (parsed: ParsedYear) => {
  if (!parsed.ok) return 'e.g. 5787 or תשפ״ז'
  const kind = isLeapYear(parsed.year) ? 'leap year, with Adar I and Adar II' : 'regular year, with one Adar'
  return `${parsed.year} (${hebrewYearFull(parsed.year)}): ${kind}`
}

export const enYearError = (parsed: ParsedYear) => {
  if (parsed.ok || parsed.reason === 'empty') return ''
  if (parsed.reason === 'range') return `Hebrew years from ${MIN_HEBREW_YEAR} to ${MAX_HEBREW_YEAR} can be converted.`
  return 'Type the year in digits, like 5787, or in Hebrew letters, like תשפ״ז.'
}

const upcomingRows = (date: HebrewDate, originDay: number, today: number) => {
  const rows: DateRow[] = []
  const startYear = Math.max(date.year + 1, toHebrew(today).year)
  for (let year = startYear; year <= MAX_HEBREW_YEAR && rows.length < UPCOMING_YEARS; year += 1) {
    const target = anniversaryOf(date, year)
    const dayNumber = fromHebrew(target)
    if (dayNumber === null || dayNumber < today || dayNumber <= originDay) continue
    rows.push({ hebrew: enHebrewDate(target), gregorian: gregorianShort(dayNumber), weekday: weekdayOf(dayNumber) })
  }
  return rows
}

const anniversaryNotes = (date: HebrewDate) => {
  const memorial = 'For a yahrzeit (memorial day) customs differ, so ask a rabbi.'
  if (date.month === 'adar' || date.month === 'adar2') {
    return [`In a leap year the table shows Adar II, as is customary for birthdays and bar mitzvahs. ${memorial}`]
  }
  if (date.month === 'adar1') {
    const thirty = date.day === 30 ? ' Instead of 30 Adar I, it shows 1 Nisan in such a year, because Adar has 29 days.' : ''
    return [`A regular year has only one Adar, and the table shows it.${thirty} ${memorial}`]
  }
  if (date.day === 30 && (date.month === 'heshvan' || date.month === 'kislev')) {
    const next = date.month === 'heshvan' ? '1 Kislev' : '1 Tevet'
    return [
      `In years when ${enMonthNames[date.month]} has 29 days, the table shows ${next}, as is customary for birthdays. ${memorial}`,
    ]
  }
  return []
}

const missingDayMessage = (date: HebrewDate) => {
  const name = enMonthNames[date.month]
  if (date.month !== 'heshvan' && date.month !== 'kislev') return `${name} always has 29 days, so it has no 30th.`
  const next = date.month === 'heshvan' ? '1 Kislev' : '1 Tevet'
  return `In ${date.year} ${name} has only 29 days, so there is no 30 ${name}. After 29 ${name} comes ${next}.`
}

const daysUntilText = (days: number) => {
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  return `In ${days.toLocaleString('en-US')} days`
}

const yearsText = (years: number) => {
  if (years === 0) return 'Less than a year'
  if (years === 1) return '1 year'
  return `${years} years`
}

const gregorianAge = (birth: number, today: number) => {
  const from = dateOf(birth)
  const to = dateOf(today)
  const beforeBirthday =
    to.getUTCMonth() < from.getUTCMonth() ||
    (to.getUTCMonth() === from.getUTCMonth() && to.getUTCDate() < from.getUTCDate())
  return to.getUTCFullYear() - from.getUTCFullYear() - (beforeBirthday ? 1 : 0)
}

const detailsToText = (details: Detail[]) => details.map((detail) => `${detail.label}: ${detail.value}`)

const unsupported: ConverterOutcome = {
  kind: 'message',
  tone: 'error',
  message: 'This browser cannot calculate the Hebrew calendar. Try a current version of Chrome, Safari, Edge or Firefox.',
}

const hebrewDateFromInput = (input: HebrewDateInput): HebrewDate | ConverterOutcome => {
  const parsed = parseHebrewYear(input.year)
  if (!parsed.ok) {
    if (parsed.reason === 'empty') return { kind: 'message', tone: 'empty', message: 'Type a Hebrew year to see the result.' }
    return { kind: 'message', tone: 'error', message: enYearError(parsed) }
  }
  const month = monthForYear(input.month, parsed.year)
  const date: HebrewDate = { year: parsed.year, month, day: Number(input.day) }
  if (fromHebrew(date) === null) return { kind: 'message', tone: 'error', message: missingDayMessage(date) }
  return date
}

const isOutcome = (value: HebrewDate | ConverterOutcome): value is ConverterOutcome => 'kind' in value

export const enConvertGregorian = (iso: string, afterSunset: boolean, supported: boolean): ConverterOutcome => {
  if (!supported) return unsupported
  if (!iso) return { kind: 'message', tone: 'empty', message: 'Choose a civil date to see the Hebrew date.' }
  const civil = parseIso(iso)
  if (civil === null) {
    return {
      kind: 'message',
      tone: 'error',
      message: `Dates from ${MIN_GREGORIAN_YEAR} to ${MAX_GREGORIAN_YEAR} can be converted.`,
    }
  }
  const dayNumber = civil + (afterSunset ? 1 : 0)
  const hebrew = toHebrew(dayNumber)
  const english = enHebrewDate(hebrew)
  const letters = hebrewDateLetters(hebrew)
  const weekday = afterSunset
    ? `Night of ${weekdayOf(civil + 1)} (${weekdayOf(civil)} evening)`
    : weekdayOf(civil)
  const details: Detail[] = [
    { label: 'In Hebrew', value: letters },
    { label: 'Civil date', value: `${gregorianLong(civil)}${afterSunset ? ', after sunset' : ''}` },
    { label: 'Year', value: yearKind(hebrew.year) },
  ]
  const notes = afterSunset
    ? [`You marked that it happened after sunset, so the Hebrew date is that of ${weekdayOf(civil + 1)}: the Hebrew day starts in the evening.`]
    : []
  return {
    kind: 'result',
    lead: 'Hebrew date',
    headline: english,
    sub: weekday,
    details,
    upcoming: [],
    milestones: [],
    notes,
    copyMain: `${english} (${letters})`,
    copyAll: [`Hebrew date: ${english}`, `Day of the week: ${weekday}`, ...detailsToText(details)].join('\n'),
    announce: `Hebrew date: ${english}`,
  }
}

export const enConvertHebrew = (input: HebrewDateInput, today: number | null, supported: boolean): ConverterOutcome => {
  if (!supported) return unsupported
  const date = hebrewDateFromInput(input)
  if (isOutcome(date)) return date
  const dayNumber = fromHebrew(date) ?? 0
  const english = enHebrewDate(date)
  const longText = gregorianLong(dayNumber)
  const details: Detail[] = [
    { label: 'Hebrew date', value: `${english} (${hebrewDateLetters(date)})` },
    { label: 'Starts in the evening', value: `${weekdayOf(dayNumber - 1)}, ${gregorianShort(dayNumber - 1)}, at nightfall` },
    { label: 'Year', value: yearKind(date.year) },
  ]
  const upcoming = today === null ? [] : upcomingRows(date, dayNumber, today)
  const upcomingText = upcoming.map((row) => `${row.hebrew}: ${row.weekday}, ${row.gregorian}`)
  return {
    kind: 'result',
    lead: 'Gregorian date',
    headline: longText,
    sub: weekdayOf(dayNumber),
    details,
    upcoming,
    milestones: [],
    notes: upcoming.length ? anniversaryNotes(date) : [],
    copyMain: `${weekdayOf(dayNumber)}, ${longText}`,
    copyAll: [
      `${english} = ${weekdayOf(dayNumber)}, ${longText}`,
      ...detailsToText(details.slice(1)),
      ...(upcomingText.length ? ['', 'The same Hebrew date in the coming years:', ...upcomingText] : []),
    ].join('\n'),
    announce: `${english} is ${weekdayOf(dayNumber)}, ${longText}`,
  }
}

export const enHebrewAge = ({
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
  if (today === null) return { kind: 'message', tone: 'empty', message: 'One moment, working out today’s date.' }

  let birthDay: number
  let birth: HebrewDate
  if (kind === 'gregorian') {
    if (!iso) return { kind: 'message', tone: 'empty', message: 'Choose a date of birth to see the Hebrew age.' }
    const civil = parseIso(iso)
    if (civil === null) {
      return { kind: 'message', tone: 'error', message: `Birth dates from ${MIN_GREGORIAN_YEAR} onwards can be used.` }
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
    return { kind: 'message', tone: 'error', message: 'That date of birth has not come yet. Choose a date in the past.' }
  }

  const currentYear = toHebrew(today).year
  const thisYear = fromHebrew(anniversaryOf(birth, currentYear)) ?? today
  const reached = today >= thisYear
  const age = Math.max(0, currentYear - birth.year - (reached ? 0 : 1))
  const birthdayToday = today === thisYear && age > 0
  const nextYear = Math.max(birth.year + 1, reached && !birthdayToday ? currentYear + 1 : currentYear)
  const nextHebrew = anniversaryOf(birth, nextYear)
  const nextDay = fromHebrew(nextHebrew) ?? today
  const english = enHebrewDate(birth)

  const milestone = (title: string, years: number): Milestone => {
    const target = anniversaryOf(birth, birth.year + years)
    const dayNumber = fromHebrew(target) ?? 0
    return {
      title,
      hebrew: enHebrewDate(target),
      gregorian: `${weekdayOf(dayNumber)}, ${gregorianShort(dayNumber)}`,
    }
  }
  const milestones =
    birth.year + 13 <= MAX_HEBREW_YEAR ? [milestone('Bar mitzvah, age 13', 13), milestone('Bat mitzvah, age 12', 12)] : []

  const details: Detail[] = [
    { label: 'Hebrew date of birth', value: `${english} (${hebrewDateLetters(birth)})` },
    { label: 'Age by the civil calendar', value: yearsText(gregorianAge(civilBirth, today)) },
    {
      label: birthdayToday ? 'Hebrew birthday' : 'Next Hebrew birthday',
      value: `${enHebrewDate(nextHebrew)}, ${weekdayOf(nextDay)} ${gregorianShort(nextDay)}`,
    },
    ...(birthdayToday ? [] : [{ label: 'Until the birthday', value: daysUntilText(nextDay - today) }]),
  ]

  const notes = [
    'The bar and bat mitzvah dates here are a calendar calculation: the day 13 or 12 Hebrew years are completed, which begins the evening before. The aliyah to the Torah and the celebration are arranged with the synagogue or rabbi.',
  ]

  return {
    kind: 'result',
    lead: 'Age by the Hebrew calendar',
    headline: yearsText(age),
    sub: birthdayToday ? 'Today is your Hebrew birthday. Mazal tov!' : '',
    details,
    upcoming: [],
    milestones,
    notes,
    copyMain: `${english} (${hebrewDateLetters(birth)})`,
    copyAll: [
      `Age by the Hebrew calendar: ${yearsText(age)}`,
      ...detailsToText(details),
      ...milestones.map((item) => `${item.title}: ${item.hebrew}, ${item.gregorian}`),
    ].join('\n'),
    announce: `Age by the Hebrew calendar: ${yearsText(age)}. Hebrew date of birth: ${english}`,
  }
}
