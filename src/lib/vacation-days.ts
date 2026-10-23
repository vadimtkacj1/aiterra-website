import { countWorkDays, dayFromParts, formatDate, isoFromDay, yearOf } from './work-days'

export type WorkWeek = '5' | '6'

export type SeniorityMode = 'dates' | 'year'

export type YearCoverage = 'full' | 'partial'

export type SourceId = 'law' | 'order' | 'agency'

type Band = { from: number; to: number | null; six: number; five: number }

type LawBand = Band & { gross: number }

export const lawBands: LawBand[] = [
  { from: 1, to: 5, gross: 16, six: 14, five: 12 },
  { from: 6, to: 6, gross: 18, six: 16, five: 14 },
  { from: 7, to: 7, gross: 21, six: 18, five: 15 },
  { from: 8, to: 8, gross: 22, six: 19, five: 16 },
  { from: 9, to: 9, gross: 23, six: 20, five: 17 },
  { from: 10, to: 10, gross: 24, six: 21, five: 18 },
  { from: 11, to: 11, gross: 25, six: 22, five: 19 },
  { from: 12, to: 12, gross: 26, six: 23, five: 20 },
  { from: 13, to: 13, gross: 27, six: 24, five: 20 },
  { from: 14, to: null, gross: 28, six: 24, five: 20 },
]

export const orderBands: Band[] = [
  { from: 1, to: 2, six: 12, five: 10 },
  { from: 3, to: 4, six: 13, five: 11 },
  { from: 5, to: 5, six: 14, five: 12 },
  { from: 6, to: 8, six: 19, five: 17 },
  { from: 9, to: null, six: 26, five: 23 },
]

export const agencyBands: Band[] = [
  { from: 1, to: 4, six: 13, five: 11 },
  { from: 5, to: 5, six: 14, five: 12 },
  { from: 6, to: 8, six: 19, five: 17 },
  { from: 9, to: null, six: 26, five: 23 },
]

export const sourceLabels: Record<SourceId, string> = {
  law: 'חוק חופשה שנתית',
  order: 'צו ההרחבה לקיצור שבוע העבודה',
  agency: 'צו ההרחבה לעובדי קבלן כוח אדם',
}

export const FULL_YEAR_THRESHOLD = 200
export const PARTIAL_YEAR_THRESHOLD = 240
export const SHORT_WORKER_DAYS = 75
export const MAX_SENIORITY = 50
export const MIN_YEAR = 1950
export const MAX_YEAR = 2099
const ESTIMATE_MIN_YEAR = 2020

const findBand = <T extends Band>(bands: T[], year: number) =>
  bands.find((band) => year >= band.from && (band.to === null || year <= band.to)) ?? bands[bands.length - 1]

const pick = (band: Band, week: WorkWeek) => (week === '5' ? band.five : band.six)

export type Entitlement = {
  law: number
  lawGross: number
  order: number | null
  agency: number | null
  best: number
  sources: SourceId[]
}

export function entitlementFor(
  seniorityYear: number,
  week: WorkWeek,
  options: { orderApplies: boolean; agency: boolean },
): Entitlement {
  const lawBand = findBand(lawBands, seniorityYear)
  const law = pick(lawBand, week)
  const order = options.orderApplies ? pick(findBand(orderBands, seniorityYear), week) : null
  const agency = options.agency ? pick(findBand(agencyBands, seniorityYear), week) : null
  const best = Math.max(law, order ?? 0, agency ?? 0)
  const sources: SourceId[] = []
  if (order === best) sources.push('order')
  if (agency === best && order !== best) sources.push('agency')
  if (law === best) sources.push('law')
  return { law, lawGross: lawBand.gross, order, agency, best, sources }
}

export type VacationInput = {
  mode: SeniorityMode
  start: string
  end: string
  calendarYear: string
  seniority: string
  coverage: YearCoverage
  week: WorkWeek
  orderApplies: boolean
  agency: boolean
  daysWorked: string
}

export const defaultInput = (year: number): VacationInput => ({
  mode: 'dates',
  start: '',
  end: '',
  calendarYear: String(year),
  seniority: '1',
  coverage: 'full',
  week: '5',
  orderApplies: true,
  agency: false,
  daysWorked: '',
})

export type FieldErrors = { start?: string; end?: string; calendarYear?: string; daysWorked?: string }

const parseIso = (value: string): number | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())
  if (!match) return null
  const [year, month, date] = [Number(match[1]), Number(match[2]), Number(match[3])]
  if (year < MIN_YEAR || year > MAX_YEAR) return null
  const day = dayFromParts(year, month, date)
  return isoFromDay(day) === value.trim() ? day : null
}

const parseWhole = (value: string, min: number, max: number): number | null => {
  const trimmed = value.trim()
  if (!/^\d+$/.test(trimmed)) return null
  const parsed = Number(trimmed)
  return parsed >= min && parsed <= max ? parsed : null
}

type Period = { from: number; to: number; fullYear: boolean; seniorityYear: number; calendarYear: number }

const periodFor = (input: VacationInput, errors: FieldErrors): Period | null => {
  const start = parseIso(input.start)
  const end = input.end.trim() ? parseIso(input.end) : null
  const year = parseWhole(input.calendarYear, MIN_YEAR, MAX_YEAR)
  if (input.start.trim() && start === null) errors.start = 'תאריך לא תקין.'
  if (input.end.trim() && end === null) errors.end = 'תאריך לא תקין.'
  if (input.calendarYear.trim() && year === null) errors.calendarYear = `הקלידו שנה בין ${MIN_YEAR} ל-${MAX_YEAR}.`
  if (start === null || year === null) return null
  if (end !== null && end < start) {
    errors.end = 'סיום העבודה לפני תחילתה.'
    return null
  }
  if (year < yearOf(start)) {
    errors.calendarYear = `העבודה התחילה ב-${yearOf(start)}, ולכן אין זכאות בשנת ${year}.`
    return null
  }
  if (end !== null && year > yearOf(end)) {
    errors.calendarYear = `העבודה הסתיימה ב-${yearOf(end)}. בחרו שנה עד ${yearOf(end)}.`
    return null
  }
  const yearStart = dayFromParts(year, 1, 1)
  const yearEnd = dayFromParts(year, 12, 31)
  const from = Math.max(start, yearStart)
  const to = end === null ? yearEnd : Math.min(end, yearEnd)
  return { from, to, fullYear: from === yearStart && to === yearEnd, seniorityYear: year - yearOf(start) + 1, calendarYear: year }
}

export function fieldErrors(input: VacationInput): FieldErrors {
  const errors: FieldErrors = {}
  if (input.mode === 'dates') periodFor(input, errors)
  if (input.daysWorked.trim() && parseWhole(input.daysWorked, 0, 366) === null) {
    errors.daysWorked = 'הקלידו מספר ימים שלם בין 0 ל-366.'
  }
  return errors
}

export type DaysSource = 'entered' | 'estimated' | 'none'

export type VacationResult = {
  kind: 'result'
  seniorityYear: number
  calendarYear: number | null
  period: { from: number; to: number } | null
  fullYear: boolean
  threshold: number
  week: WorkWeek
  entitlement: Entitlement
  daysWorked: number | null
  daysSource: DaysSource
  prorated: boolean
  exact: number
  days: number
  perMonth: number
  shortWorker: boolean
}

export type VacationOutcome =
  | VacationResult
  | { kind: 'incomplete'; message: string }
  | { kind: 'invalid'; message: string }

const estimateWorkDays = (from: number, to: number, week: WorkWeek) => {
  if (yearOf(from) < ESTIMATE_MIN_YEAR) return null
  const counted = countWorkDays(from, to, {
    week: week === '5' ? 'sun-thu' : 'sun-fri',
    countEves: true,
    countCholHamoed: true,
  })
  return counted ? counted.workDays : null
}

export const prorate = (days: number, worked: number, threshold: number) =>
  worked >= threshold ? days : Math.floor((days * worked) / threshold)

export function calculateVacation(input: VacationInput): VacationOutcome {
  if (Object.values(fieldErrors(input)).some(Boolean)) {
    return { kind: 'invalid', message: 'כדי לראות את התוצאה, תקנו את השדה שמתחתיו הודעת שגיאה.' }
  }
  const period = input.mode === 'dates' ? periodFor(input, {}) : null
  if (input.mode === 'dates' && !period) {
    return { kind: 'incomplete', message: 'כדי לראות את התוצאה, בחרו את תאריך תחילת העבודה.' }
  }

  const seniorityYear = period ? period.seniorityYear : (parseWhole(input.seniority, 1, MAX_SENIORITY) ?? 1)
  const fullYear = period ? period.fullYear : input.coverage === 'full'
  const threshold = fullYear ? FULL_YEAR_THRESHOLD : PARTIAL_YEAR_THRESHOLD
  const entitlement = entitlementFor(seniorityYear, input.week, { orderApplies: input.orderApplies, agency: input.agency })

  let daysWorked = input.daysWorked.trim() ? parseWhole(input.daysWorked, 0, 366) : null
  let daysSource: DaysSource = daysWorked === null ? 'none' : 'entered'
  if (daysWorked === null && period && !period.fullYear) {
    const estimate = estimateWorkDays(period.from, period.to, input.week)
    if (estimate !== null) {
      daysWorked = estimate
      daysSource = 'estimated'
    }
  }

  const exact = daysWorked === null || daysWorked >= threshold ? entitlement.best : (entitlement.best * daysWorked) / threshold
  const days = daysWorked === null ? entitlement.best : prorate(entitlement.best, daysWorked, threshold)

  return {
    kind: 'result',
    seniorityYear,
    calendarYear: period ? period.calendarYear : null,
    period: period ? { from: period.from, to: period.to } : null,
    fullYear,
    threshold,
    week: input.week,
    entitlement,
    daysWorked,
    daysSource,
    prorated: daysWorked !== null && daysWorked < threshold,
    exact,
    days,
    perMonth: days / 12,
    shortWorker: daysWorked !== null && daysWorked < SHORT_WORKER_DAYS,
  }
}

const decimalFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 2 })

export const formatDecimal = (value: number) => decimalFormat.format(value)

export const daysText = (count: number) => (count === 1 ? 'יום אחד' : `${count} ימים`)

export const vacationDaysText = (count: number) => (count === 1 ? 'יום חופשה אחד' : `${count} ימי חופשה`)

export const perMonthText = (value: number) => (value === 1 ? 'יום אחד' : `${decimalFormat.format(value)} ימים`)

export const weekText = (week: WorkWeek) => (week === '5' ? 'שבוע עבודה של 5 ימים' : 'שבוע עבודה של 6 ימים')

export type SeniorityRow = { label: string; year: number; lawGross: number; law: number; order: number; best: number }

export function seniorityTable(week: WorkWeek): SeniorityRow[] {
  return Array.from({ length: 14 }, (_, index) => index + 1).map((year) => {
    const entitlement = entitlementFor(year, week, { orderApplies: true, agency: false })
    return {
      label: year === 14 ? '14 ואילך' : String(year),
      year,
      lawGross: entitlement.lawGross,
      law: entitlement.law,
      order: entitlement.order ?? 0,
      best: entitlement.best,
    }
  })
}

export function resultToText(result: VacationResult) {
  const lines = [
    `מחשבון ימי חופשה: שנת ותק ${result.seniorityYear}${result.calendarYear ? ` (שנת ${result.calendarYear})` : ''}, ${weekText(result.week)}`,
    `ימי חופשה לשנה מלאה: ${daysText(result.entitlement.best)} עבודה (${result.entitlement.sources.map((id) => sourceLabels[id]).join(', ')})`,
  ]
  if (result.prorated && result.daysWorked !== null) {
    lines.push(
      `${result.daysSource === 'estimated' ? 'כ-' : ''}${result.daysWorked} ימי עבודה בפועל מתוך ${result.threshold}: ${daysText(result.days)}`,
    )
  }
  if (result.period) lines.push(`התקופה: ${formatDate(result.period.from)} עד ${formatDate(result.period.to)}`)
  lines.push(`בממוצע לחודש: ${perMonthText(result.perMonth)}`)
  lines.push('חישוב עזר לפי חוק חופשה שנתית וצו ההרחבה, כפי שפורסמו באתר משרד העבודה. אינו ייעוץ משפטי.')
  lines.push('https://www.aiterra.co.il/tools/vacation-days-calculator')
  return lines.join('\n')
}
