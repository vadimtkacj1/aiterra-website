import { parseAmount, parseHundredths, type ParsedNumber } from './vat-calculator'

export type WorkerType = 'salaried' | 'hourly' | 'intermittent'

export type WorkWeek = 'six' | 'five'

export type SickInput = {
  months: string
  partialDays: string
  week: WorkWeek
  usedDays: string
  worker: WorkerType
  spellDays: string
  dailyWage: string
  treatment: boolean
}

export type Accrual = {
  months: number
  partialDays: number
  earned: number
  atCap: boolean
  overCap: boolean
  used: number
  balance: number
  overused: boolean
}

export type Coverage = 'full' | 'partial' | 'none'

export type SpellSegment = { from: number; to: number; rate: number; coverage: Coverage; paid: number }

export type Spell = {
  days: number
  treatment: boolean
  segments: SpellSegment[]
  paidDays: number
  usedFromBalance: number
  balanceAfter: number
  shortOfBalance: boolean
  amount: number | null
}

export type SickResult = { kind: 'result'; accrual: Accrual; spell: Spell | null; worker: WorkerType }

export type SickOutcome =
  | SickResult
  | { kind: 'incomplete'; message: string }
  | { kind: 'invalid'; message: string }

export type SickField = 'months' | 'partialDays' | 'usedDays' | 'spellDays' | 'dailyWage'

export type SickErrors = Partial<Record<SickField, string>>

export const DAYS_PER_MONTH = 1.5
export const MAX_BALANCE_DAYS = 90
export const MONTHS_TO_CAP = MAX_BALANCE_DAYS / DAYS_PER_MONTH
export const MAX_MONTHS = 600
export const MAX_PARTIAL_DAYS = 999
export const MAX_SPELL_DAYS = 365

const UNIT = 100
const MONTH_ACCRUAL = DAYS_PER_MONTH * UNIT
const MAX_BALANCE = MAX_BALANCE_DAYS * UNIT
const MAX_WAGE_AGOROT = 10_000_000

export const monthWorkDays: Record<WorkWeek, string> = { six: '25', five: '21⅔' }

export const workerOptions: { value: WorkerType; label: string; hint: string }[] = [
  { value: 'salaried', label: 'עובד במשכורת', hint: 'שכר חודשי' },
  { value: 'hourly', label: 'עובד בשכר', hint: 'שעתי או יומי, משרה מלאה' },
  { value: 'intermittent', label: 'עובד לסירוגין', hint: 'שעתי או יומי, לא בכל הימים' },
]

export const weekOptions: { value: WorkWeek; label: string }[] = [
  { value: 'five', label: '5 ימים בשבוע' },
  { value: 'six', label: '6 ימים בשבוע' },
]

export const emptySickInput: SickInput = {
  months: '',
  partialDays: '',
  week: 'five',
  usedDays: '',
  worker: 'salaried',
  spellDays: '',
  dailyWage: '',
  treatment: false,
}

const partialAccrual = (days: number, week: WorkWeek) =>
  week === 'six' ? Math.round((MONTH_ACCRUAL * days) / 25) : Math.round((MONTH_ACCRUAL * days * 3) / 65)

export function accrue(months: number, partialDays: number, week: WorkWeek, used: number): Accrual {
  const raw = months * MONTH_ACCRUAL + partialAccrual(partialDays, week)
  const earned = Math.min(raw, MAX_BALANCE)
  return {
    months,
    partialDays,
    earned,
    atCap: earned === MAX_BALANCE,
    overCap: raw > MAX_BALANCE,
    used,
    balance: Math.max(0, earned - used),
    overused: used > earned,
  }
}

export const dayRate = (day: number, treatment: boolean) => {
  if (treatment) return 100
  if (day === 1) return 0
  if (day <= 3) return 50
  return 100
}

const coverageOf = (rate: number, covered: number): Coverage => {
  if (rate === 0 || covered === UNIT) return 'full'
  return covered > 0 ? 'partial' : 'none'
}

export function payForSpell(days: number, balance: number, treatment: boolean, wage: number | null): Spell {
  const segments: SpellSegment[] = []
  let remaining = balance
  let paidDays = 0
  let short = false
  for (let day = 1; day <= days; day += 1) {
    const rate = dayRate(day, treatment)
    const covered = rate > 0 ? Math.min(UNIT, remaining) : 0
    remaining -= covered
    if (rate > 0 && covered < UNIT) short = true
    const paid = (covered * rate) / 100
    paidDays += paid
    const coverage = coverageOf(rate, covered)
    const last = segments[segments.length - 1]
    if (last && last.rate === rate && last.coverage === coverage && coverage !== 'partial') {
      last.to = day
      last.paid += paid
    } else {
      segments.push({ from: day, to: day, rate, coverage, paid })
    }
  }
  return {
    days,
    treatment,
    segments,
    paidDays,
    usedFromBalance: balance - remaining,
    balanceAfter: remaining,
    shortOfBalance: short,
    amount: wage === null ? null : Math.round((wage * paidDays) / UNIT),
  }
}

const parseWhole = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return { ok: false as const, empty: true }
  if (!/^\d+$/.test(trimmed)) return { ok: false as const, empty: false }
  return { ok: true as const, value: Number(trimmed) }
}

const wholeError = (value: string, max: number, example: string) => {
  const parsed = parseWhole(value)
  if (parsed.ok) return parsed.value > max ? `אפשר להקליד עד ${max}.` : ''
  return parsed.empty ? '' : `הקלידו מספר שלם, למשל ${example}.`
}

const daysError = (parsed: ParsedNumber, max: number) => {
  if (parsed.ok) return parsed.hundredths > max * UNIT ? `אפשר להקליד עד ${max}.` : ''
  if (parsed.reason === 'empty') return ''
  return 'הקלידו מספר ימים, למשל 4 או 2.5.'
}

const wageError = (parsed: ParsedNumber) => {
  if (parsed.ok) return parsed.hundredths > MAX_WAGE_AGOROT ? 'הסכום גדול מדי.' : ''
  if (parsed.reason === 'empty') return ''
  if (parsed.reason === 'too-large') return 'הסכום גדול מדי.'
  return 'הקלידו סכום בספרות, למשל 420.'
}

export function sickErrors(input: SickInput): SickErrors {
  const errors: SickErrors = {}
  const months = wholeError(input.months, MAX_MONTHS, '14')
  if (months) errors.months = months
  const partial = wholeError(input.partialDays, MAX_PARTIAL_DAYS, '10')
  if (partial) errors.partialDays = partial
  const used = daysError(parseHundredths(input.usedDays), MAX_MONTHS * DAYS_PER_MONTH)
  if (used) errors.usedDays = used
  const spell = wholeError(input.spellDays, MAX_SPELL_DAYS, '5')
  if (spell) errors.spellDays = spell
  else if (input.spellDays.trim() && Number(input.spellDays) === 0) {
    errors.spellDays = 'תקופת מחלה היא יום אחד לפחות.'
  }
  const wage = wageError(parseAmount(input.dailyWage))
  if (wage) errors.dailyWage = wage
  return errors
}

export function calculateSick(input: SickInput): SickOutcome {
  if (Object.keys(sickErrors(input)).length) {
    return { kind: 'invalid', message: 'כדי לראות את התוצאה, תקנו את השדה שמתחתיו הודעת שגיאה.' }
  }
  if (!input.months.trim() && !input.partialDays.trim()) {
    return { kind: 'incomplete', message: 'כדי לראות את התוצאה, מלאו כמה חודשים מלאים עבדתם אצל המעסיק.' }
  }
  const usedParsed = parseHundredths(input.usedDays)
  const accrual = accrue(
    Number(input.months || 0),
    Number(input.partialDays || 0),
    input.week,
    usedParsed.ok ? usedParsed.hundredths : 0,
  )
  if (!input.spellDays.trim() || input.worker === 'intermittent') {
    return { kind: 'result', accrual, spell: null, worker: input.worker }
  }
  const wageParsed = parseAmount(input.dailyWage)
  const wage = wageParsed.ok && wageParsed.hundredths > 0 ? wageParsed.hundredths : null
  const spell = payForSpell(Number(input.spellDays), accrual.balance, input.treatment, wage)
  return { kind: 'result', accrual, spell, worker: input.worker }
}

const dayFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 2 })
const moneyFormat = new Intl.NumberFormat('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const formatDays = (hundredths: number) => dayFormat.format(Math.round(hundredths) / UNIT)

export const daysLabel = (hundredths: number) =>
  Math.round(hundredths) === UNIT ? 'יום אחד' : `${formatDays(hundredths)} ימים`

export const countLabel = (count: number) => (count === 1 ? 'יום אחד' : `${count} ימים`)

export const formatShekels = (agorot: number) => `${moneyFormat.format(Math.round(agorot) / 100)} ₪`

export const rangeLabel = ({ from, to }: SpellSegment) => (from === to ? `יום ${from}` : `ימים ${from}–${to}`)

export const segmentLabel = ({ rate, coverage }: SpellSegment) => {
  if (rate === 0) return 'לא משולם'
  if (coverage === 'none') return 'לא משולם, היתרה נגמרה'
  const base = rate === 50 ? 'חצי שכר' : 'שכר מלא'
  return coverage === 'partial' ? `${base}, חלקי לפי היתרה` : base
}

const monthsLabel = (months: number) => {
  if (months === 1) return 'חודש אחד'
  if (months === 12) return '12 חודשים (שנה)'
  if (months === 24) return '24 חודשים (שנתיים)'
  if (months % 12 === 0) return `${months} חודשים (${months / 12} שנים)`
  return `${months} חודשים`
}

export type AccrualRow = { months: string; days: string }

export function accrualTable(points = [1, 3, 6, 12, 24, 36, 48, 60, 72]): AccrualRow[] {
  return points.map((months) => {
    const accrual = accrue(months, 0, 'five', 0)
    const days = accrual.overCap ? `${MAX_BALANCE_DAYS} (התקרה)` : formatDays(accrual.earned)
    return { months: monthsLabel(months), days }
  })
}

export type PartialRow = { days: string; five: string; six: string }

export function partialTable(points = [5, 10, 15, 20]): PartialRow[] {
  return points.map((days) => ({
    days: `${days} ימי עבודה`,
    five: formatDays(partialAccrual(days, 'five')),
    six: formatDays(partialAccrual(days, 'six')),
  }))
}

export type ExampleRow = { day: string; rate: string; pay: string }

export type WorkedExample = {
  months: number
  usedDays: number
  spellDays: number
  wage: number
  accrual: Accrual
  spell: Spell
  rows: ExampleRow[]
}

export function workedExample(): WorkedExample {
  const months = 10
  const usedDays = 2
  const spellDays = 6
  const wage = 40_000
  const accrual = accrue(months, 0, 'five', usedDays * UNIT)
  const spell = payForSpell(spellDays, accrual.balance, false, wage)
  const rows = Array.from({ length: spellDays }, (_, index) => {
    const rate = dayRate(index + 1, false)
    return { day: `יום ${index + 1}`, rate: `${rate}%`, pay: formatShekels((wage * rate) / 100) }
  })
  return { months, usedDays, spellDays, wage, accrual, spell, rows }
}

export function resultToText({ accrual, spell }: SickResult) {
  const lines = [
    'מחשבון ימי מחלה לפי חוק דמי מחלה',
    `צבירה לפי החוק: ${daysLabel(accrual.earned)}${accrual.atCap ? ' (התקרה)' : ''}`,
  ]
  if (accrual.used) lines.push(`ימים שכבר שולמו: ${daysLabel(accrual.used)}`)
  lines.push(`יתרה: ${daysLabel(accrual.balance)}`)
  if (spell) {
    lines.push(`תקופת מחלה של ${countLabel(spell.days)}:`)
    for (const segment of spell.segments) lines.push(`${rangeLabel(segment)}: ${segmentLabel(segment)}`)
    lines.push(`משולם כמו ${daysLabel(spell.paidDays)} של שכר מלא`)
    if (spell.amount !== null) lines.push(`דמי מחלה: ${formatShekels(spell.amount)}`)
    lines.push(`יתרה אחרי התקופה: ${daysLabel(spell.balanceAfter)}`)
  }
  lines.push('חישוב עזר לפי חוק דמי מחלה, התשל״ו-1976. הסכם קיבוצי, צו הרחבה או חוזה יכולים לתת יותר.')
  lines.push('https://www.aiterra.co.il/tools/sick-days-calculator')
  return lines.join('\n')
}
