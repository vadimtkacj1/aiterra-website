import { dateOf, dayFromParts, formatDate, formatShortDate, monthOf, specialDaysForYear, weekdayOf, yearOf } from '@/lib/work-days'

export type MonthKey = number

export type IndexPoint = { key: MonthKey; value: number; base: string; percent: number }

export type BaseLink = { base: string; previous: string; coefficient: number }

export type CpiData = { points: Map<MonthKey, IndexPoint>; links: Map<string, BaseLink>; latest: MonthKey }

export type Purpose = 'rent' | 'amount'

export type Method = 'known' | 'month'

export type CpiInput = {
  purpose: Purpose
  amount: string
  method: Method
  fromDate: string
  toDate: string
  fromMonth: string
  fromYear: string
  toMonth: string
  toYear: string
}

export type LiveStatus = 'loading' | 'ready' | 'failed'

export type IndexUse = { key: MonthKey; point: IndexPoint; published: number; date: number | null }

export type CpiResult = {
  kind: 'result'
  purpose: Purpose
  method: Method
  amount: number
  from: IndexUse
  to: IndexUse
  ratio: number
  coefficient: number
  changePercent: number
  indexed: number
  floored: number
  falling: boolean
  calculatorDiffers: boolean
}

export type CpiOutcome =
  | CpiResult
  | { kind: 'incomplete'; message: string }
  | { kind: 'invalid'; message: string }
  | { kind: 'loading'; message: string }
  | { kind: 'offline'; message: string }
  | { kind: 'unpublished'; message: string }

export type CpiFieldErrors = { amount?: string; fromDate?: string; toDate?: string; order?: string }

type SeriesSegment = { base: string; startYear: number; values: number[]; percents: number[] }

export type LiveFailure = 'network' | 'timeout' | 'blocked' | 'server' | 'format' | 'aborted'

export type LiveResult = { ok: true; points: IndexPoint[]; links: BaseLink[] } | { ok: false; failure: LiveFailure }

export const CPI_SERIES_CODE = 120010
export const CBS_API = 'https://api.cbs.gov.il/index/data/price'
export const CBS_CALCULATOR_URL = 'https://www.cbs.gov.il/he/cbsNewBrand/Pages/Calculator.aspx'
export const CBS_SCHEDULE_URL = 'https://www.cbs.gov.il/he/Pages/%D7%AA%D7%97%D7%96%D7%99%D7%AA-%D7%A4%D7%A8%D7%A1%D7%95%D7%9D.aspx'
export const DATA_SOURCE_URL = `${CBS_API}?id=${CPI_SERIES_CODE}&format=json&download=false&coef=true&startPeriod=01-2000`
export const DATA_CHECKED = '23.10.2026'
export const REQUEST_TIMEOUT_MS = 12000
export const TIMEOUT_REASON = 'timeout'
export const MAX_AMOUNT = 100_000_000_000

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

const segments: SeriesSegment[] = [
  {
    base: '1998 ממוצע',
    startYear: 2000,
    values: [
      106.1, 105.6, 105.3, 105.8, 106.7, 107, 107.3, 106.7, 106.1, 106.7, 106.7, 106.6,
    ],
    percents: [
      -0.5, -0.5, -0.3, 0.5, 0.9, 0.3, 0.3, -0.6, -0.6, 0.6, 0, -0.1,
    ],
  },
  {
    base: '2000 ממוצע',
    startYear: 2001,
    values: [
      99.6, 99.5, 99.7, 100.6, 101, 101.3, 101.7, 102, 102.2, 102.3, 101.7, 101.6,
      102.7, 103.5, 104, 105.6, 106.6, 108, 108.7, 108.3, 108.7, 109.4, 108.5, 108.2,
    ],
    percents: [
      -0.6, -0.1, 0.2, 0.9, 0.4, 0.3, 0.4, 0.3, 0.2, 0.1, -0.6, -0.1,
      1.1, 0.8, 0.5, 1.5, 0.9, 1.3, 0.6, -0.4, 0.4, 0.6, -0.8, -0.3,
    ],
  },
  {
    base: '2002 ממוצע',
    startYear: 2003,
    values: [
      101.5, 101.9, 102.1, 101.9, 101.4, 100.8, 100.1, 100.3, 99.8, 99.8, 99.6, 99.4,
      99.2, 99.4, 99.3, 100.4, 100.8, 100.8, 100.6, 100.8, 100.6, 100.6, 100.5, 100.6,
      100, 100.2, 100, 100.7, 101, 101.1, 102.2, 102.4, 102.5, 103.3, 103.2, 103,
      102.7, 103.3, 103.6, 104.5, 104.5, 104.6, 104.7, 104.7, 103.8, 103.1, 102.9, 102.9,
    ],
    percents: [
      0.2, 0.4, 0.2, -0.2, -0.5, -0.6, -0.7, 0.2, -0.5, 0, -0.2, -0.2,
      -0.2, 0.2, -0.1, 1.1, 0.4, 0, -0.2, 0.2, -0.2, 0, -0.1, 0.1,
      -0.6, 0.2, -0.2, 0.7, 0.3, 0.1, 1.1, 0.2, 0.1, 0.8, -0.1, -0.2,
      -0.3, 0.6, 0.3, 0.9, 0, 0.1, 0.1, 0, -0.9, -0.7, -0.2, 0,
    ],
  },
  {
    base: '2006 ממוצע',
    startYear: 2007,
    values: [
      99, 98.7, 98.9, 99.4, 99.4, 100.1, 101.2, 101.9, 101.4, 101.5, 101.9, 102.5,
      102.5, 102.3, 102.6, 104.1, 104.8, 104.9, 106.1, 107, 107, 107.1, 106.5, 106.4,
    ],
    percents: [
      -0.1, -0.3, 0.2, 0.5, 0, 0.7, 1.1, 0.7, -0.5, 0.1, 0.4, 0.6,
      0, -0.2, 0.3, 1.5, 0.7, 0.1, 1.1, 0.8, 0, 0.1, -0.6, -0.1,
    ],
  },
  {
    base: '2008 ממוצע',
    startYear: 2009,
    values: [
      100.7, 100.6, 101.1, 102.1, 102.5, 103.4, 104.5, 105, 104.7, 104.9, 105.2, 105.2,
      104.5, 104.2, 104.3, 105.2, 105.6, 105.9, 106.4, 106.9, 107.2, 107.5, 107.6, 108,
    ],
    percents: [
      -0.5, -0.1, 0.5, 1, 0.4, 0.9, 1.1, 0.5, -0.3, 0.2, 0.3, 0,
      -0.7, -0.3, 0.1, 0.9, 0.4, 0.3, 0.5, 0.5, 0.3, 0.3, 0.1, 0.4,
    ],
  },
  {
    base: '2010 ממוצע',
    startYear: 2011,
    values: [
      102, 102.3, 102.5, 103.1, 103.6, 104, 103.7, 104.2, 104, 104.1, 104, 104,
      104, 104, 104.4, 105.3, 105.3, 105, 105.1, 106.2, 106.2, 106, 105.5, 105.7,
    ],
    percents: [
      0.2, 0.3, 0.2, 0.6, 0.5, 0.4, -0.3, 0.5, -0.2, 0.1, -0.1, 0,
      0, 0, 0.4, 0.9, 0, -0.3, 0.1, 1, 0, -0.2, -0.5, 0.2,
    ],
  },
  {
    base: '2012 ממוצע',
    startYear: 2013,
    values: [
      100.3, 100.3, 100.5, 100.9, 101, 101.8, 102.1, 102.3, 102.3, 102.6, 102.2, 102.3,
      101.7, 101.5, 101.8, 101.9, 102, 102.3, 102.4, 102.3, 102, 102.3, 102.1, 102.1,
    ],
    percents: [
      -0.2, 0, 0.2, 0.4, 0.1, 0.8, 0.3, 0.2, 0, 0.3, -0.4, 0.1,
      -0.6, -0.2, 0.3, 0.1, 0.1, 0.3, 0.1, -0.1, -0.3, 0.3, -0.2, 0,
    ],
  },
  {
    base: '2014 ממוצע',
    startYear: 2015,
    values: [
      99.2, 98.5, 98.8, 99.4, 99.6, 99.9, 100.1, 99.9, 99.5, 99.6, 99.2, 99.1,
      98.6, 98.3, 98.1, 98.5, 98.8, 99.1, 99.5, 99.2, 99.1, 99.3, 98.9, 98.9,
    ],
    percents: [
      -0.9, -0.7, 0.3, 0.6, 0.2, 0.3, 0.2, -0.2, -0.4, 0.1, -0.4, -0.1,
      -0.5, -0.3, -0.2, 0.4, 0.3, 0.3, 0.4, -0.3, -0.1, 0.2, -0.4, 0,
    ],
  },
  {
    base: '2016 ממוצע',
    startYear: 2017,
    values: [
      99.8, 99.8, 100.1, 100.3, 100.7, 100, 99.9, 100.2, 100.3, 100.6, 100.3, 100.4,
      99.9, 100, 100.3, 100.7, 101.2, 101.3, 101.3, 101.4, 101.5, 101.8, 101.5, 101.2,
    ],
    percents: [
      -0.2, 0, 0.3, 0.2, 0.4, -0.7, -0.1, 0.3, 0.1, 0.3, -0.3, 0.1,
      -0.5, 0.1, 0.3, 0.4, 0.5, 0.1, 0, 0.1, 0.1, 0.3, -0.3, -0.3,
    ],
  },
  {
    base: '2018 ממוצע',
    startYear: 2019,
    values: [
      100.1, 100.2, 100.7, 101, 101.7, 101.1, 100.8, 101, 100.8, 101.2, 100.8, 100.8,
      100.4, 100.3, 100.7, 100.4, 100.1, 100, 100.2, 100.2, 100.1, 100.4, 100.2, 100.1,
    ],
    percents: [
      -0.1, 0.1, 0.5, 0.3, 0.7, -0.6, -0.3, 0.2, -0.2, 0.4, -0.4, 0,
      -0.4, -0.1, 0.4, -0.3, -0.3, -0.1, 0.2, 0, -0.1, 0.3, -0.2, -0.1,
    ],
  },
  {
    base: '2020 ממוצע',
    startYear: 2021,
    values: [
      99.7, 100, 100.6, 100.9, 101.3, 101.4, 101.8, 102.1, 102.3, 102.4, 102.3, 102.6,
      102.8, 103.5, 104.1, 104.9, 105.5, 105.9, 107.1, 106.8, 107, 107.6, 107.7, 108,
    ],
    percents: [
      -0.1, 0.3, 0.6, 0.3, 0.4, 0.1, 0.4, 0.3, 0.2, 0.1, -0.1, 0.3,
      0.2, 0.7, 0.6, 0.8, 0.6, 0.4, 1.1, -0.3, 0.2, 0.6, 0.1, 0.3,
    ],
  },
  {
    base: '2022 ממוצע',
    startYear: 2023,
    values: [
      102.3, 102.8, 103.2, 104, 104.2, 104.2, 104.5, 105, 104.9, 105.4, 105.1, 105,
      105, 105.4, 106, 106.9, 107.1, 107.2, 107.8, 108.8, 108.6, 109.1, 108.7, 108.4,
    ],
    percents: [
      0.3, 0.5, 0.4, 0.8, 0.2, 0, 0.3, 0.5, -0.1, 0.5, -0.3, -0.1,
      0, 0.4, 0.6, 0.8, 0.2, 0.1, 0.6, 0.9, -0.2, 0.5, -0.4, -0.3,
    ],
  },
  {
    base: '2024 ממוצע',
    startYear: 2025,
    values: [
      101.5, 101.5, 102, 103.1, 102.8, 103.1, 103.5, 104.2, 103.6, 104.1, 103.6, 103.6,
      103.3, 103.5, 103.9, 105.1, 104.8, 104.8, 105.1, 105.8, 105.3,
    ],
    percents: [
      0.6, 0, 0.5, 1.1, -0.3, 0.3, 0.4, 0.7, -0.6, 0.5, -0.5, 0,
      -0.3, 0.2, 0.4, 1.2, -0.3, 0, 0.3, 0.7, -0.5,
    ],
  },
]

const baseLinks: BaseLink[] = [
  { base: '2024 ממוצע', previous: '2022 ממוצע', coefficient: 1.074 },
  { base: '2022 ממוצע', previous: '2020 ממוצע', coefficient: 1.059 },
  { base: '2020 ממוצע', previous: '2018 ממוצע', coefficient: 1.003 },
  { base: '2018 ממוצע', previous: '2016 ממוצע', coefficient: 1.01 },
  { base: '2016 ממוצע', previous: '2014 ממוצע', coefficient: 0.989 },
  { base: '2014 ממוצע', previous: '2012 ממוצע', coefficient: 1.02 },
  { base: '2012 ממוצע', previous: '2010 ממוצע', coefficient: 1.052 },
  { base: '2010 ממוצע', previous: '2008 ממוצע', coefficient: 1.061 },
  { base: '2008 ממוצע', previous: '2006 ממוצע', coefficient: 1.051 },
  { base: '2006 ממוצע', previous: '2002 ממוצע', coefficient: 1.038 },
  { base: '2002 ממוצע', previous: '2000 ממוצע', coefficient: 1.068 },
  { base: '2000 ממוצע', previous: '1998 ממוצע', coefficient: 1.064 },
]

export const monthKey = (year: number, month: number): MonthKey => year * 12 + (month - 1)

export const keyYear = (key: MonthKey) => Math.floor(key / 12)

export const keyMonth = (key: MonthKey) => (key % 12) + 1

export const keyOfDay = (day: number) => monthKey(yearOf(day), monthOf(day))

export const formatMonth = (key: MonthKey) => `${monthNames[keyMonth(key) - 1]} ${keyYear(key)}`

export const FIRST_KEY = monthKey(segments[0].startYear, 1)

const buildEmbedded = (): CpiData => {
  const points = new Map<MonthKey, IndexPoint>()
  let latest = FIRST_KEY
  for (const segment of segments) {
    segment.values.forEach((value, index) => {
      const key = monthKey(segment.startYear, 1) + index
      points.set(key, { key, value, base: segment.base, percent: segment.percents[index] })
      latest = Math.max(latest, key)
    })
  }
  return { points, links: new Map(baseLinks.map((link) => [link.base, link])), latest }
}

let embedded: CpiData | null = null

export const embeddedData = () => {
  embedded ??= buildEmbedded()
  return embedded
}

export const DATA_AS_OF_KEY = embeddedData().latest

export function mergeLive(data: CpiData, points: IndexPoint[], links: BaseLink[]): CpiData {
  const mergedPoints = new Map(data.points)
  const mergedLinks = new Map(data.links)
  let latest = data.latest
  for (const point of points) {
    mergedPoints.set(point.key, point)
    latest = Math.max(latest, point.key)
  }
  for (const link of links) {
    if (!mergedLinks.has(link.base)) mergedLinks.set(link.base, link)
  }
  return { points: mergedPoints, links: mergedLinks, latest }
}

const isRestDay = (day: number) => {
  if (weekdayOf(day) === 6) return true
  const specials = specialDaysForYear(yearOf(day))
  return specials ? specials.some((special) => special.day === day && special.kind === 'rest') : false
}

export function publicationDay(key: MonthKey) {
  const next = key + 1
  let day = dayFromParts(keyYear(next), keyMonth(next), 15)
  while (isRestDay(day)) day -= 1
  return day
}

export function knownKey(day: number): MonthKey {
  const previous = keyOfDay(day) - 1
  return publicationDay(previous) < day ? previous : previous - 1
}

export const calculatorKey = (day: number): MonthKey => keyOfDay(day) - (dateOf(day) <= 15 ? 2 : 1)

export const firstKnownDay = () => publicationDay(FIRST_KEY) + 1

const valueInBase = (point: IndexPoint, base: string, links: Map<string, BaseLink>) => {
  let value = point.value
  let current = point.base
  let steps = 0
  while (current !== base) {
    const link = links.get(current)
    if (!link || steps > 40) return null
    value *= link.coefficient
    current = link.previous
    steps += 1
  }
  return value
}

export function chainRatio(from: IndexPoint, to: IndexPoint, links: Map<string, BaseLink>) {
  if (from.base === to.base) return { ratio: to.value / from.value, coefficient: 1 }
  const toInFromBase = valueInBase(to, from.base, links)
  if (toInFromBase !== null) return { ratio: toInFromBase / from.value, coefficient: toInFromBase / to.value }
  const fromInToBase = valueInBase(from, to.base, links)
  if (fromInToBase !== null) return { ratio: to.value / fromInToBase, coefficient: from.value / fromInToBase }
  return null
}

export const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100

export function parseAmount(raw: string) {
  const cleaned = raw.replace(/[\s,₪‎‏]/g, '')
  if (!cleaned) return { kind: 'empty' as const }
  if (!/^\d+(\.\d{0,2})?$/.test(cleaned)) return { kind: 'invalid' as const }
  const value = Number(cleaned)
  if (!(value > 0) || value > MAX_AMOUNT) return { kind: 'invalid' as const }
  return { kind: 'ok' as const, value }
}

export function parseIsoDay(raw: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim())
  if (!match) return null
  const [year, month, date] = [Number(match[1]), Number(match[2]), Number(match[3])]
  const day = dayFromParts(year, month, date)
  if (yearOf(day) !== year || monthOf(day) !== month || dateOf(day) !== date) return null
  return day
}

const MAX_YEAR = 2099

export function fieldErrors(input: CpiInput): CpiFieldErrors {
  const errors: CpiFieldErrors = {}
  const amount = parseAmount(input.amount)
  if (amount.kind === 'invalid') errors.amount = 'הקלידו סכום חיובי בספרות, למשל 5000 או 5,250.50.'
  if (input.method === 'known') {
    const minDay = firstKnownDay()
    const from = input.fromDate ? parseIsoDay(input.fromDate) : null
    const to = input.toDate ? parseIsoDay(input.toDate) : null
    if (input.fromDate && from === null) errors.fromDate = 'התאריך לא תקין.'
    else if (from !== null && from < minDay) errors.fromDate = `המחשבון כולל מדדים מ${formatMonth(FIRST_KEY)}, ולכן תאריך הבסיס הוא ${formatShortDate(minDay)} ואילך.`
    else if (from !== null && yearOf(from) > MAX_YEAR) errors.fromDate = 'התאריך רחוק מדי.'
    if (input.toDate && to === null) errors.toDate = 'התאריך לא תקין.'
    else if (to !== null && to < minDay) errors.toDate = `התאריך צריך להיות ${formatShortDate(minDay)} ואילך.`
    else if (to !== null && yearOf(to) > MAX_YEAR) errors.toDate = 'התאריך רחוק מדי.'
    if (from !== null && to !== null && !errors.fromDate && !errors.toDate && to < from) {
      errors.order = 'תאריך העדכון לפני תאריך הבסיס. החליפו ביניהם.'
    }
  } else if (input.fromMonth && input.fromYear && input.toMonth && input.toYear) {
    const from = monthKey(Number(input.fromYear), Number(input.fromMonth))
    const to = monthKey(Number(input.toYear), Number(input.toMonth))
    if (to < from) errors.order = 'חודש היעד לפני חודש הבסיס. החליפו ביניהם.'
  }
  return errors
}

export function joinHebrew(parts: string[]) {
  if (parts.length <= 1) return parts.join('')
  return `${parts.slice(0, -1).join(', ')} ו${parts[parts.length - 1]}`
}

const missingFields = (input: CpiInput) => {
  const amountLabel = input.purpose === 'rent' ? 'שכר הדירה' : 'סכום'
  const amount = parseAmount(input.amount).kind === 'empty' ? amountLabel : ''
  if (input.method === 'known') {
    return [amount, input.fromDate ? '' : 'תאריך בסיס', input.toDate ? '' : 'תאריך עדכון'].filter(Boolean)
  }
  return [
    amount,
    input.fromMonth && input.fromYear ? '' : 'חודש מדד הבסיס',
    input.toMonth && input.toYear ? '' : 'חודש מדד היעד',
  ].filter(Boolean)
}

const notPublished = (key: MonthKey, today: number | null, status: LiveStatus): CpiOutcome => {
  if (status === 'loading') return { kind: 'loading', message: 'בודקים בלמ״ס אם פורסם מדד חדש יותר.' }
  if (status === 'failed') {
    return {
      kind: 'offline',
      message: `כדי לחשב צריך את מדד ${formatMonth(key)}, ולא הצלחנו לטעון אותו מהלמ״ס. נסו שוב בעוד רגע.`,
    }
  }
  const published = publicationDay(key)
  if (today === null || published >= today) {
    return {
      kind: 'unpublished',
      message: `מדד ${formatMonth(key)} עוד לא פורסם. לפי לוח הפרסומים של הלמ״ס הוא יתפרסם ב-${formatShortDate(published)}.`,
    }
  }
  return {
    kind: 'unpublished',
    message: `מדד ${formatMonth(key)} עוד לא מופיע במאגר של הלמ״ס, אף שמועד הפרסום הרגיל עבר. נסו שוב מאוחר יותר.`,
  }
}

export function calculate(input: CpiInput, data: CpiData, status: LiveStatus, today: number | null): CpiOutcome {
  const errors = fieldErrors(input)
  if (Object.keys(errors).length) {
    return { kind: 'invalid', message: 'כדי לראות את התוצאה, תקנו את השדה שמתחתיו הודעת שגיאה.' }
  }
  const missing = missingFields(input)
  if (missing.length) return { kind: 'incomplete', message: `כדי לראות את התוצאה, מלאו: ${joinHebrew(missing)}.` }

  const amount = parseAmount(input.amount)
  if (amount.kind !== 'ok') return { kind: 'incomplete', message: 'כדי לראות את התוצאה, מלאו סכום.' }

  let fromKey: MonthKey
  let toKey: MonthKey
  let fromDay: number | null = null
  let toDay: number | null = null
  if (input.method === 'known') {
    fromDay = parseIsoDay(input.fromDate)
    toDay = parseIsoDay(input.toDate)
    if (fromDay === null || toDay === null) return { kind: 'invalid', message: 'התאריך לא תקין.' }
    fromKey = knownKey(fromDay)
    toKey = knownKey(toDay)
  } else {
    fromKey = monthKey(Number(input.fromYear), Number(input.fromMonth))
    toKey = monthKey(Number(input.toYear), Number(input.toMonth))
  }

  for (const key of [fromKey, toKey]) {
    if (key < FIRST_KEY) {
      return { kind: 'invalid', message: `המחשבון כולל מדדים מ${formatMonth(FIRST_KEY)} ואילך.` }
    }
    if (!data.points.has(key)) return notPublished(key, today, status)
  }

  const fromPoint = data.points.get(fromKey) as IndexPoint
  const toPoint = data.points.get(toKey) as IndexPoint
  const chained = chainRatio(fromPoint, toPoint, data.links)
  if (!chained) {
    return { kind: 'offline', message: 'חסר מקדם קשר בין בסיסי המדד. נסו לטעון מחדש את הדף.' }
  }

  const indexed = roundMoney(amount.value * chained.ratio)
  const calculatorDiffers =
    fromDay !== null && toDay !== null && (calculatorKey(fromDay) !== fromKey || calculatorKey(toDay) !== toKey)

  return {
    kind: 'result',
    purpose: input.purpose,
    method: input.method,
    amount: amount.value,
    from: { key: fromKey, point: fromPoint, published: publicationDay(fromKey), date: fromDay },
    to: { key: toKey, point: toPoint, published: publicationDay(toKey), date: toDay },
    ratio: chained.ratio,
    coefficient: chained.coefficient,
    changePercent: (chained.ratio - 1) * 100,
    indexed,
    floored: Math.max(indexed, amount.value),
    falling: indexed < amount.value,
    calculatorDiffers,
  }
}

const moneyFormat = new Intl.NumberFormat('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const indexFormat = new Intl.NumberFormat('he-IL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

const coefficientFormat = new Intl.NumberFormat('he-IL', { minimumFractionDigits: 3, maximumFractionDigits: 6 })

export const formatMoney = (value: number) => `${moneyFormat.format(value)} ₪`

export const formatIndex = (value: number) => indexFormat.format(value)

export const formatCoefficient = (value: number) => coefficientFormat.format(value)

export const formatPercent = (value: number) => {
  const rounded = Math.round(Math.abs(value) * 100) / 100
  return `${rounded.toFixed(2)}%`
}

export const changeWord = (value: number) => {
  if (Math.abs(value) < 0.005) return 'לא השתנה'
  return value > 0 ? 'עלה' : 'ירד'
}

export const changeText = (value: number) => {
  const word = changeWord(value)
  return word === 'לא השתנה' ? word : `${word} ב-${formatPercent(value)}`
}

export const formatDay = (day: number) => formatDate(day)

export const formatShortDay = (day: number) => formatShortDate(day)

export const indexLabel = (use: IndexUse) => `מדד ${formatMonth(use.key)}: ${formatIndex(use.point.value)} נקודות`

const baseNote = (result: CpiResult) =>
  result.coefficient === 1
    ? ''
    : ` המדדים בבסיסים שונים (${result.from.point.base} ו-${result.to.point.base}), ולכן הם שורשרו לפי מקדם הקשר של הלמ״ס, ${formatCoefficient(result.coefficient)}.`

export function rentMessage(result: CpiResult) {
  const baseLine =
    result.method === 'known' && result.from.date !== null && result.to.date !== null
      ? `מדד הבסיס הוא המדד הידוע ב-${formatDay(result.from.date)}, מדד ${formatMonth(result.from.key)} (${formatIndex(result.from.point.value)} נקודות), והמדד הידוע ב-${formatDay(result.to.date)} הוא מדד ${formatMonth(result.to.key)} (${formatIndex(result.to.point.value)} נקודות).`
      : `מדד הבסיס הוא מדד ${formatMonth(result.from.key)} (${formatIndex(result.from.point.value)} נקודות), ומדד העדכון הוא מדד ${formatMonth(result.to.key)} (${formatIndex(result.to.point.value)} נקודות).`
  const payLine =
    result.method === 'known' && result.to.date !== null
      ? `שכר הדירה לתשלום ב-${formatDay(result.to.date)} הוא ${formatMoney(result.indexed)}`
      : `שכר הדירה המעודכן הוא ${formatMoney(result.indexed)}`
  const lines = [
    `לפי סעיף ההצמדה בחוזה, שכר הדירה הבסיסי הוא ${formatMoney(result.amount)} לחודש, צמוד למדד המחירים לצרכן.`,
    `${baseLine}${baseNote(result)}`,
    `המדד ${changeText(result.changePercent)}, ולכן ${payLine}.`,
  ]
  if (result.falling) {
    lines.push(
      `אם בחוזה נקבע ששכר הדירה לא יורד מתחת לשכר הבסיסי, התשלום נשאר ${formatMoney(result.floored)}.`,
    )
  }
  lines.push('החישוב לפי נתוני הלשכה המרכזית לסטטיסטיקה.')
  return lines.join(' ')
}

export function resultToText(result: CpiResult) {
  const lines = [
    `מחשבון הצמדה למדד המחירים לצרכן`,
    `${result.purpose === 'rent' ? 'שכר דירה בסיסי' : 'סכום בסיס'}: ${formatMoney(result.amount)}`,
    `מדד הבסיס: ${indexLabel(result.from)} (בסיס ${result.from.point.base})${
      result.from.date !== null ? `, המדד הידוע ב-${formatShortDay(result.from.date)}` : ''
    }`,
    `מדד העדכון: ${indexLabel(result.to)} (בסיס ${result.to.point.base})${
      result.to.date !== null ? `, המדד הידוע ב-${formatShortDay(result.to.date)}` : ''
    }`,
  ]
  if (result.coefficient !== 1) lines.push(`מקדם קשר בין הבסיסים: ${formatCoefficient(result.coefficient)}`)
  lines.push(`שינוי במדד: ${changeText(result.changePercent)}`)
  lines.push(`${result.purpose === 'rent' ? 'שכר הדירה המעודכן' : 'הסכום אחרי הצמדה'}: ${formatMoney(result.indexed)}`)
  if (result.falling) lines.push(`עם רצפה (לא פחות מסכום הבסיס): ${formatMoney(result.floored)}`)
  lines.push('מקור הנתונים: הלשכה המרכזית לסטטיסטיקה')
  lines.push('https://www.aiterra.co.il/tools/cpi-indexation-calculator')
  return lines.join('\n')
}

export const announcementFor = (outcome: CpiOutcome) => {
  if (outcome.kind === 'result') {
    const label = outcome.purpose === 'rent' ? 'שכר הדירה המעודכן' : 'הסכום אחרי הצמדה'
    return `${label}: ${formatMoney(outcome.indexed)}. המדד ${changeText(outcome.changePercent)}.`
  }
  if (outcome.kind === 'unpublished' || outcome.kind === 'offline') return outcome.message
  return ''
}

const toPeriod = (key: MonthKey) => `${String(keyMonth(key)).padStart(2, '0')}-${keyYear(key)}`

export const liveUrl = (fromKey: MonthKey, toKey: MonthKey) =>
  `${CBS_API}?${new URLSearchParams({
    id: String(CPI_SERIES_CODE),
    format: 'json',
    download: 'false',
    coef: 'true',
    startPeriod: toPeriod(fromKey),
    endPeriod: toPeriod(toKey),
    PageSize: '200',
  })}`

type RawPrevBase = { coeff?: unknown; baseDesc?: unknown }

type RawPoint = {
  year?: unknown
  month?: unknown
  percent?: unknown
  currBase?: { baseDesc?: unknown; value?: unknown }
  prevBase?: RawPrevBase[] | null
}

export function parseLive(data: unknown): { points: IndexPoint[]; links: BaseLink[] } | null {
  if (!data || typeof data !== 'object') return null
  const months = (data as { month?: unknown }).month
  if (months === null) return { points: [], links: [] }
  if (!Array.isArray(months)) return null
  const series = months.find((item) => (item as { code?: unknown }).code === CPI_SERIES_CODE) as
    | { date?: unknown }
    | undefined
  if (!series || !Array.isArray(series.date)) return null
  const points: IndexPoint[] = []
  const links: BaseLink[] = []
  for (const raw of series.date as RawPoint[]) {
    const year = Number(raw.year)
    const month = Number(raw.month)
    const value = Number(raw.currBase?.value)
    const base = typeof raw.currBase?.baseDesc === 'string' ? raw.currBase.baseDesc : ''
    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) return null
    if (!(value > 0) || !base) return null
    points.push({ key: monthKey(year, month), value, base, percent: Number(raw.percent) || 0 })
    const previous = raw.prevBase?.[0]
    const coefficient = Number(previous?.coeff)
    if (previous && typeof previous.baseDesc === 'string' && coefficient > 0) {
      links.push({ base, previous: previous.baseDesc, coefficient })
    }
  }
  return { points, links }
}

export async function fetchLive(fromKey: MonthKey, toKey: MonthKey, signal: AbortSignal): Promise<LiveResult> {
  try {
    const response = await fetch(liveUrl(fromKey, toKey), { signal, headers: { Accept: 'application/json' } })
    if (response.status === 403 || response.status === 429) return { ok: false, failure: 'blocked' }
    if (!response.ok) return { ok: false, failure: 'server' }
    const parsed = parseLive(await response.json())
    return parsed ? { ok: true, ...parsed } : { ok: false, failure: 'format' }
  } catch (error) {
    if (signal.aborted) return { ok: false, failure: signal.reason === TIMEOUT_REASON ? 'timeout' : 'aborted' }
    return { ok: false, failure: error instanceof SyntaxError ? 'format' : 'network' }
  }
}

export type RecentRow = { key: MonthKey; month: string; value: string; base: string; percent: string; published: string }

const signedPercent = (value: number) => {
  if (value === 0) return '0.0%'
  return `${value > 0 ? '+' : '−'}${Math.abs(value).toFixed(1)}%`
}

export function recentRows(count: number, data: CpiData = embeddedData()): RecentRow[] {
  const rows: RecentRow[] = []
  for (let key = data.latest; key > data.latest - count; key -= 1) {
    const point = data.points.get(key)
    if (!point) continue
    rows.push({
      key,
      month: formatMonth(key),
      value: formatIndex(point.value),
      base: point.base,
      percent: signedPercent(point.percent),
      published: formatShortDate(publicationDay(key)),
    })
  }
  return rows
}

export const signedChange = signedPercent

export const linkRows = () =>
  baseLinks.map((link) => ({ base: link.base, previous: link.previous, coefficient: formatCoefficient(link.coefficient) }))

export function exampleResult(input: Omit<CpiInput, 'purpose'> & { purpose?: Purpose }) {
  const outcome = calculate({ purpose: 'rent', ...input }, embeddedData(), 'ready', null)
  return outcome.kind === 'result' ? outcome : null
}

export const isoOfDay = (day: number) =>
  `${yearOf(day)}-${String(monthOf(day)).padStart(2, '0')}-${String(dateOf(day)).padStart(2, '0')}`
