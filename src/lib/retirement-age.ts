export type Gender = 'female' | 'male'

export type AgeSpan = { years: number; months: number }

export type CalendarDate = { year: number; month: number; day: number }

export type BirthInput = { gender: Gender | ''; day: string; month: string; year: string }

type MonthIndex = number

type ScheduleRow = { from: MonthIndex; to: MonthIndex; age: AgeSpan }

export type Milestone = {
  id: 'early' | 'mandatory' | 'pension'
  label: string
  hint: string
  age: AgeSpan
  date: CalendarDate
}

export type RetirementResult = {
  kind: 'result'
  gender: Gender
  birth: CalendarDate
  dayKnown: boolean
  age: AgeSpan
  date: CalendarDate
  basis: string
  milestones: Milestone[]
  transitionGrant: boolean
}

export type RetirementOutcome =
  | RetirementResult
  | { kind: 'incomplete'; message: string }
  | { kind: 'invalid'; message: string }
  | { kind: 'unsupported'; message: string }

export type FieldErrors = { day?: string; year?: string }

export const MIN_BIRTH_YEAR = 1940

export const monthNames = [
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

export const genderOptions: { value: Gender; label: string }[] = [
  { value: 'female', label: 'אישה' },
  { value: 'male', label: 'גבר' },
]

const toIndex = (year: number, month: number): MonthIndex => year * 12 + (month - 1)

const span = (years: number, months = 0): AgeSpan => ({ years, months })

const row = (fromYear: number, fromMonth: number, toYear: number, toMonth: number, age: AgeSpan): ScheduleRow => ({
  from: toIndex(fromYear, fromMonth),
  to: toIndex(toYear, toMonth),
  age,
})

const WOMEN_SCHEDULE_START = toIndex(1947, 5)

const menTransition: ScheduleRow[] = [
  row(1939, 9, 1940, 4, span(65, 8)),
  row(1940, 5, 1940, 12, span(66)),
  row(1941, 1, 1941, 8, span(66, 4)),
  row(1941, 9, 1942, 4, span(66, 8)),
]

const womenRetirement: ScheduleRow[] = [
  row(1947, 5, 1959, 12, span(62)),
  row(1960, 1, 1960, 12, span(62, 4)),
  row(1961, 1, 1961, 12, span(62, 8)),
  row(1962, 1, 1962, 12, span(63)),
  row(1963, 1, 1963, 12, span(63, 3)),
  row(1964, 1, 1964, 12, span(63, 6)),
  row(1965, 1, 1965, 12, span(63, 9)),
  row(1966, 1, 1966, 12, span(64)),
  row(1967, 1, 1967, 12, span(64, 3)),
  row(1968, 1, 1968, 12, span(64, 6)),
  row(1969, 1, 1969, 12, span(64, 9)),
]

const womenEarly: ScheduleRow[] = [
  row(1947, 5, 1949, 12, span(57)),
  row(1950, 1, 1950, 8, span(57, 4)),
  row(1950, 9, 1951, 4, span(57, 8)),
  row(1951, 5, 1951, 12, span(58)),
  row(1952, 1, 1952, 8, span(58, 4)),
  row(1952, 9, 1953, 4, span(58, 8)),
  row(1953, 5, 1953, 12, span(59)),
  row(1954, 1, 1954, 8, span(59, 4)),
  row(1954, 9, 1955, 4, span(59, 8)),
]

const womenPension: ScheduleRow[] = [
  row(1947, 5, 1947, 8, span(68, 4)),
  row(1947, 9, 1948, 4, span(68, 8)),
  row(1948, 5, 1948, 12, span(69)),
  row(1949, 1, 1949, 8, span(69, 4)),
  row(1949, 9, 1950, 4, span(69, 8)),
]

const findRow = (rows: ScheduleRow[], index: MonthIndex) =>
  rows.find((item) => index >= item.from && index <= item.to)

export const daysInMonth = (year: number, month: number) => new Date(Date.UTC(year, month, 0)).getUTCDate()

export const addSpan = (start: CalendarDate, age: AgeSpan): CalendarDate => {
  const total = toIndex(start.year, start.month) + age.years * 12 + age.months
  const year = Math.floor(total / 12)
  const month = (total % 12) + 1
  return { year, month, day: Math.min(start.day, daysInMonth(year, month)) }
}

const toUtc = (date: CalendarDate) => Date.UTC(date.year, date.month - 1, date.day)

export const compareDates = (a: CalendarDate, b: CalendarDate) => Math.sign(toUtc(a) - toUtc(b))

export type Duration = { years: number; months: number; days: number }

export const durationBetween = (from: CalendarDate, to: CalendarDate): Duration => {
  let months = (to.year - from.year) * 12 + (to.month - from.month)
  while (months > 0 && compareDates(addSpan(from, span(0, months)), to) > 0) months -= 1
  const anchor = addSpan(from, span(0, months))
  const days = Math.round((toUtc(to) - toUtc(anchor)) / 86400000)
  return { years: Math.floor(months / 12), months: months % 12, days }
}

export const todayDate = (now = new Date()): CalendarDate => ({
  year: now.getFullYear(),
  month: now.getMonth() + 1,
  day: now.getDate(),
})

const retirementAge = (gender: Gender, index: MonthIndex) => {
  if (gender === 'male') {
    const transition = findRow(menTransition, index)
    return transition
      ? { age: transition.age, basis: 'סעיף 6(1) וחלק א׳ בתוספת לחוק גיל פרישה' }
      : { age: span(67), basis: 'סעיף 3 לחוק גיל פרישה' }
  }
  const scheduled = findRow(womenRetirement, index)
  return scheduled
    ? { age: scheduled.age, basis: 'סעיף 6(2) וחלק ב׳ בתוספת לחוק גיל פרישה' }
    : { age: span(65), basis: 'סעיף 3 לחוק גיל פרישה' }
}

const earlyAge = (gender: Gender, index: MonthIndex) =>
  (gender === 'female' ? findRow(womenEarly, index)?.age : undefined) ?? span(60)

const mandatoryAge = (index: MonthIndex) => findRow(menTransition, index)?.age ?? span(67)

const pensionAge = (gender: Gender, index: MonthIndex) =>
  (gender === 'female' ? findRow(womenPension, index)?.age : undefined) ?? span(70)

export function fieldErrors(input: BirthInput, today: CalendarDate | null): FieldErrors {
  const errors: FieldErrors = {}
  const year = input.year.trim()
  const maxYear = today?.year ?? new Date().getFullYear()
  if (year && !/^\d+$/.test(year)) errors.year = 'הקלידו שנה בספרות, למשל 1965.'
  else if (year.length > 4) errors.year = 'שנה היא ארבע ספרות, למשל 1965.'
  else if (year.length === 4) {
    const value = Number(year)
    if (value < MIN_BIRTH_YEAR || value > maxYear) errors.year = `הקלידו שנה בין ${MIN_BIRTH_YEAR} ל-${maxYear}.`
  }
  if (input.day && input.month && year.length === 4 && !errors.year) {
    const limit = daysInMonth(Number(year), Number(input.month))
    if (Number(input.day) > limit) {
      errors.day = `ב${monthNames[Number(input.month) - 1]} ${year} יש ${limit} ימים.`
    }
  }
  if (!errors.day && !errors.year && today && input.month && year.length === 4) {
    const birth = { year: Number(year), month: Number(input.month), day: Number(input.day || 1) }
    if (compareDates(birth, today) > 0) errors.day = 'תאריך הלידה הוא אחרי היום.'
  }
  return errors
}

export function calculateRetirement(input: BirthInput, today: CalendarDate | null): RetirementOutcome {
  const errors = fieldErrors(input, today)
  if (errors.year || errors.day) return { kind: 'invalid', message: 'כדי לראות את התוצאה, תקנו את השדה שמתחתיו הודעת שגיאה.' }

  const missing = [
    input.gender ? '' : 'אישה או גבר',
    input.month ? '' : 'חודש לידה',
    input.year.trim().length === 4 ? '' : 'שנת לידה',
  ].filter(Boolean)
  if (missing.length || !input.gender) {
    return { kind: 'incomplete', message: `כדי לראות את התוצאה, מלאו: ${joinHebrew(missing)}.` }
  }

  const gender = input.gender
  const year = Number(input.year)
  const month = Number(input.month)
  const index = toIndex(year, month)

  if (gender === 'female' && index < WOMEN_SCHEDULE_START) {
    return {
      kind: 'unsupported',
      message:
        'נשים שנולדו לפני מאי 1947 כבר הגיעו לגיל הפרישה, בגיל 60 עד 61 ו-8 חודשים לפי לוח א׳1 לחוק הביטוח הלאומי. הטבלה בנוסח הנוכחי של חוק גיל פרישה מתחילה במאי 1947, ולכן המחשבון לא מחשב תאריך לשנים מוקדמות יותר.',
    }
  }

  const dayKnown = Boolean(input.day)
  const birth = { year, month, day: dayKnown ? Number(input.day) : 1 }
  const main = retirementAge(gender, index)
  const early = earlyAge(gender, index)
  const mandatory = mandatoryAge(index)
  const pension = pensionAge(gender, index)

  const milestones: Milestone[] = [
    {
      id: 'early',
      label: 'פרישה מוקדמת',
      hint: 'קצבה מקרן פנסיה או ממעסיק, לפי התנאים שלהם. לא מביטוח לאומי.',
      age: early,
      date: addSpan(birth, early),
    },
    {
      id: 'mandatory',
      label: 'גיל פרישת חובה',
      hint: 'מהגיל הזה מעסיק יכול לחייב לפרוש.',
      age: mandatory,
      date: addSpan(birth, mandatory),
    },
    {
      id: 'pension',
      label: 'קצבת אזרח ותיק בלי מבחן הכנסות',
      hint: 'מהגיל הזה ביטוח לאומי משלם בלי לבדוק הכנסה.',
      age: pension,
      date: addSpan(birth, pension),
    },
  ]

  return {
    kind: 'result',
    gender,
    birth,
    dayKnown,
    age: main.age,
    date: addSpan(birth, main.age),
    basis: main.basis,
    milestones,
    transitionGrant: gender === 'female' && year >= 1960 && year <= 1966,
  }
}

export function joinHebrew(parts: string[]) {
  if (parts.length <= 1) return parts.join('')
  const last = parts[parts.length - 1]
  const glue = /^\d/.test(last) ? 'ו-' : 'ו'
  return `${parts.slice(0, -1).join(', ')} ${glue}${last}`
}

const unit = (value: number, one: string, two: string, many: string) => {
  if (value === 1) return one
  if (value === 2) return two
  return `${value} ${many}`
}

export const formatAge = ({ years, months }: AgeSpan) =>
  months ? `${years} שנים ו-${months} חודשים` : `${years} שנים`

export const formatAgeShort = ({ years, months }: AgeSpan) => (months ? `${years} ו-${months} חודשים` : `${years}`)

export const formatDuration = ({ years, months, days }: Duration) => {
  const parts = [
    years ? unit(years, 'שנה', 'שנתיים', 'שנים') : '',
    months ? unit(months, 'חודש', 'חודשיים', 'חודשים') : '',
    days ? unit(days, 'יום', 'יומיים', 'ימים') : '',
  ].filter(Boolean)
  return parts.length ? joinHebrew(parts) : 'פחות מיום'
}

export const formatMonthYear = (date: CalendarDate) => `${monthNames[date.month - 1]} ${date.year}`

export const formatDate = (date: CalendarDate) => `${date.day} ב${monthNames[date.month - 1]} ${date.year}`

export const formatWhen = (date: CalendarDate, dayKnown: boolean) =>
  dayKnown ? formatDate(date) : formatMonthYear(date)

export type Countdown =
  | { kind: 'future'; text: string; until: CalendarDate }
  | { kind: 'today' }
  | { kind: 'past'; text: string }

export function countdown(target: CalendarDate, dayKnown: boolean, today: CalendarDate): Countdown {
  if (!dayKnown) {
    const start = { ...target, day: 1 }
    const sameMonth = target.year === today.year && target.month === today.month
    if (sameMonth) return { kind: 'today' }
    if (compareDates(start, today) > 0) return { kind: 'future', text: formatDuration(durationBetween(today, start)), until: start }
    return { kind: 'past', text: formatDuration(durationBetween(start, today)) }
  }
  const order = compareDates(target, today)
  if (order === 0) return { kind: 'today' }
  if (order > 0) return { kind: 'future', text: formatDuration(durationBetween(today, target)), until: target }
  return { kind: 'past', text: formatDuration(durationBetween(target, today)) }
}

export function resultToText(result: RetirementResult, today: CalendarDate | null) {
  const who = result.gender === 'female' ? 'אישה' : 'גבר'
  const born = result.dayKnown ? formatDate(result.birth) : formatMonthYear(result.birth)
  const lines = [
    `מחשבון גיל פרישה: ${who}, תאריך לידה ${born}`,
    `גיל הפרישה: ${formatAge(result.age)} (${result.basis})`,
    `${result.dayKnown ? 'תאריך ההגעה לגיל הפרישה' : 'החודש שבו מגיעים לגיל הפרישה'}: ${formatWhen(result.date, result.dayKnown)}`,
  ]
  if (today) {
    const left = countdown(result.date, result.dayKnown, today)
    if (left.kind === 'future') lines.push(`זמן שנותר: ${left.text}`)
    if (left.kind === 'past') lines.push(`הגעה לגיל הפרישה: לפני ${left.text}`)
  }
  for (const milestone of result.milestones) {
    lines.push(`${milestone.label}: גיל ${formatAgeShort(milestone.age)}, ${formatWhen(milestone.date, result.dayKnown)}`)
  }
  lines.push('חישוב עזר לפי חוק גיל פרישה. התשובה הרשמית מביטוח לאומי.')
  lines.push('https://www.aiterra.co.il/tools/retirement-age-calculator')
  return lines.join('\n')
}

export type ScheduleTableRow = { born: string; age: string; reach: string }

const indexToDate = (index: MonthIndex): CalendarDate => ({ year: Math.floor(index / 12), month: (index % 12) + 1, day: 1 })

const birthRange = (item: ScheduleRow) => {
  const from = indexToDate(item.from)
  const to = indexToDate(item.to)
  if (from.year === to.year && from.month === 1 && to.month === 12) return `${from.year}`
  return `${formatMonthYear(from)} עד ${formatMonthYear(to)}`
}

export function womenScheduleTable(): ScheduleTableRow[] {
  const rows = womenRetirement.map((item) => ({
    born: birthRange(item),
    age: formatAgeShort(item.age),
    reach: `${formatMonthYear(addSpan(indexToDate(item.from), item.age))} עד ${formatMonthYear(
      addSpan(indexToDate(item.to), item.age),
    )}`,
  }))
  rows.push({
    born: '1970 ואילך',
    age: '65',
    reach: `${formatMonthYear(addSpan({ year: 1970, month: 1, day: 1 }, span(65)))} ואילך`,
  })
  return rows
}
