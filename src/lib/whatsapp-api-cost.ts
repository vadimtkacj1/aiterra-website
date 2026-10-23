export type MessageCategory = 'marketing' | 'utility' | 'authentication' | 'service'

export type MarketId =
  | 'IL'
  | 'NAM'
  | 'GB'
  | 'FR'
  | 'DE'
  | 'IT'
  | 'ES'
  | 'NL'
  | 'RU'
  | 'UA'
  | 'AE'
  | 'WEU'
  | 'CEEU'
  | 'MDE'
  | 'GLO'

export type Market = { label: string; rates: Record<MessageCategory, number> }

export type Parsed = { ok: true; value: number } | { ok: false; reason: 'empty' | 'invalid' | 'too-large' }

export type CostInput = {
  counts: Record<MessageCategory, number>
  phoneNumbers: number
  freeEntryShareBp: number
  secondMarket: MarketId | null
  secondMarketShareBp: number
  usdIls: number
  providerFeeAgorot: number
}

export type CategoryCost = {
  category: MessageCategory
  sent: number
  free: number
  billable: number
  usdCents: number
  agorot: number
}

export type CostResult = {
  lines: CategoryCost[]
  sent: number
  billable: number
  metaUsdCents: number
  metaAgorot: number
  providerAgorot: number
  totalAgorot: number
  perThousand: { usdCents: number; agorot: number } | null
  volumeTierCategories: MessageCategory[]
}

export type Scenario = {
  id: string
  label: string
  description: string
  counts: Record<MessageCategory, number>
}

export const RATES_AS_OF = '2026-10-01'

const rates = (marketing: number, other: number): Record<MessageCategory, number> => ({
  marketing,
  utility: other,
  authentication: other,
  service: other,
})

export const META_RATES: {
  asOf: string
  checkedOn: string
  currency: 'USD'
  freeServicePerNumber: number
  freeEntryWindowDays: number
  businessAgentUsdPerMillionTokens: number
  israelVolumeTierAbove: Record<'utility' | 'authentication', number>
  markets: Record<MarketId, Market>
} = {
  asOf: RATES_AS_OF,
  checkedOn: '2026-10-23',
  currency: 'USD',
  freeServicePerNumber: 1000,
  freeEntryWindowDays: 7,
  businessAgentUsdPerMillionTokens: 2,
  israelVolumeTierAbove: { utility: 100_000, authentication: 300_000 },
  markets: {
    IL: { label: 'ישראל (‎+972)', rates: rates(0.0353, 0.0053) },
    NAM: { label: 'ארה״ב וקנדה (‎+1)', rates: rates(0.025, 0.0034) },
    GB: { label: 'בריטניה (‎+44)', rates: rates(0.0635, 0.022) },
    FR: { label: 'צרפת (‎+33)', rates: rates(0.0859, 0.03) },
    DE: { label: 'גרמניה (‎+49)', rates: rates(0.1365, 0.055) },
    IT: { label: 'איטליה (‎+39)', rates: rates(0.0795, 0.03) },
    ES: { label: 'ספרד (‎+34)', rates: rates(0.0707, 0.02) },
    NL: { label: 'הולנד (‎+31)', rates: rates(0.1597, 0.05) },
    RU: { label: 'רוסיה (‎+7)', rates: rates(0.0802, 0.04) },
    UA: { label: 'אוקראינה (‎+380)', rates: rates(0.086, 0.0298) },
    AE: { label: 'איחוד האמירויות (‎+971)', rates: rates(0.0576, 0.0157) },
    WEU: { label: 'שאר מערב אירופה: אוסטריה, בלגיה, שווייץ, פורטוגל ועוד', rates: rates(0.0592, 0.0171) },
    CEEU: { label: 'שאר מרכז ומזרח אירופה: יוון, צ׳כיה, בולגריה ועוד', rates: rates(0.086, 0.0212) },
    MDE: { label: 'שאר המזרח התיכון: ירדן, לבנון, בחריין, תימן', rates: rates(0.0392, 0.0091) },
    GLO: { label: 'מדינות שלא משויכות לאזור (Other), למשל קפריסין', rates: rates(0.0604, 0.0077) },
  },
}

export const DEFAULT_USD_ILS = { rate: 3.107, date: '2026-10-22' }

export const MAX_MONTHLY_MESSAGES = 50_000_000
export const MAX_PHONE_NUMBERS = 1000
export const MAX_PROVIDER_FEE_SHEKELS = 10_000_000

export const CATEGORIES: MessageCategory[] = ['marketing', 'utility', 'authentication', 'service']

export const SECOND_MARKETS = (Object.keys(META_RATES.markets) as MarketId[]).filter((id) => id !== 'IL')

export const CATEGORY_INFO: Record<MessageCategory, { name: string; english: string; hint: string }> = {
  marketing: { name: 'שיווק', english: 'Marketing', hint: 'מבצעים, הטבות, תזכורת לעגלה נטושה' },
  utility: { name: 'עדכונים', english: 'Utility', hint: 'תזכורת לתור, אישור הזמנה, עדכון משלוח' },
  authentication: { name: 'אימות', english: 'Authentication', hint: 'קוד חד-פעמי לכניסה או לאימות' },
  service: { name: 'שירות', english: 'Service', hint: 'תשובה חופשית בתוך 24 שעות מההודעה של הלקוח' },
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'clinic',
    label: 'קליניקה',
    description: '1,000 תזכורות לתור ו-300 תשובות למטופלים',
    counts: { marketing: 0, utility: 1000, authentication: 0, service: 300 },
  },
  {
    id: 'broadcast',
    label: 'חנות: מבצע',
    description: '4,000 הודעות שיווק לרשימת לקוחות שהסכימו לקבל אותן',
    counts: { marketing: 4000, utility: 0, authentication: 0, service: 0 },
  },
  {
    id: 'support-bot',
    label: 'בוט שירות',
    description: '3,000 תשובות של בוט ללקוחות ו-500 עדכוני הזמנה',
    counts: { marketing: 0, utility: 500, authentication: 0, service: 3000 },
  },
  {
    id: 'online-store',
    label: 'חנות אונליין',
    description: '1,000 הודעות שיווק, 1,500 עדכוני משלוח, 2,000 קודי אימות ו-800 תשובות',
    counts: { marketing: 1000, utility: 1500, authentication: 2000, service: 800 },
  },
]

export const EMPTY_COUNTS: Record<MessageCategory, number> = { marketing: 0, utility: 0, authentication: 0, service: 0 }

export const DEFAULT_INPUT: CostInput = {
  counts: EMPTY_COUNTS,
  phoneNumbers: 1,
  freeEntryShareBp: 0,
  secondMarket: null,
  secondMarketShareBp: 0,
  usdIls: DEFAULT_USD_ILS.rate,
  providerFeeAgorot: 0,
}

const BASIS_POINTS = 10_000
const MICROS_PER_USD = 1_000_000
const MICROS_PER_CENT = 10_000

export const toMicros = (usd: number) => Math.round(usd * MICROS_PER_USD)

export const microsToCents = (micros: number) => Math.round(micros / MICROS_PER_CENT)

export const microsToAgorot = (micros: number, usdIls: number) => Math.round((micros * usdIls) / MICROS_PER_CENT)

export function blendedRateMicros(category: MessageCategory, secondMarket: MarketId | null, secondShareBp: number) {
  const home = toMicros(META_RATES.markets.IL.rates[category])
  if (!secondMarket || secondShareBp === 0) return home
  const other = toMicros(META_RATES.markets[secondMarket].rates[category])
  return (home * (BASIS_POINTS - secondShareBp) + other * secondShareBp) / BASIS_POINTS
}

export function calculateCost(input: CostInput): CostResult {
  const freeService = META_RATES.freeServicePerNumber * input.phoneNumbers
  const secondShareBp = input.secondMarket ? input.secondMarketShareBp : 0
  let totalMicros = 0

  const lines = CATEGORIES.map((category): CategoryCost => {
    const sent = input.counts[category]
    const inFreeEntry = Math.round((sent * input.freeEntryShareBp) / BASIS_POINTS)
    const outside = sent - inFreeEntry
    const billable = category === 'service' ? Math.max(0, outside - freeService) : outside
    const micros = billable * blendedRateMicros(category, input.secondMarket, secondShareBp)
    totalMicros += micros
    return {
      category,
      sent,
      free: sent - billable,
      billable,
      usdCents: microsToCents(micros),
      agorot: microsToAgorot(micros, input.usdIls),
    }
  })

  const sent = lines.reduce((sum, line) => sum + line.sent, 0)
  const billable = lines.reduce((sum, line) => sum + line.billable, 0)
  const metaUsdCents = microsToCents(totalMicros)
  const metaAgorot = microsToAgorot(totalMicros, input.usdIls)
  const perThousandMicros = sent > 0 ? (totalMicros * 1000) / sent : null

  const volumeTierCategories = (['utility', 'authentication'] as const).filter((category) => {
    const line = lines.find((item) => item.category === category)
    const israelBillable = ((line?.billable ?? 0) * (BASIS_POINTS - secondShareBp)) / BASIS_POINTS
    return israelBillable > META_RATES.israelVolumeTierAbove[category]
  })

  return {
    lines,
    sent,
    billable,
    metaUsdCents,
    metaAgorot,
    providerAgorot: input.providerFeeAgorot,
    totalAgorot: metaAgorot + input.providerFeeAgorot,
    perThousand:
      perThousandMicros === null
        ? null
        : {
            usdCents: microsToCents(perThousandMicros),
            agorot: microsToAgorot(perThousandMicros, input.usdIls),
          },
    volumeTierCategories,
  }
}

const stripInput = (input: string) => input.replace(/[\s\p{Cf}]/gu, '')

export function parseCount(input: string, max = MAX_MONTHLY_MESSAGES): Parsed {
  const value = stripInput(input)
  if (!value) return { ok: false, reason: 'empty' }
  if (!/^(\d+|\d{1,3}(,\d{3})+)$/.test(value)) return { ok: false, reason: 'invalid' }
  const number = Number(value.replace(/,/g, ''))
  if (number > max) return { ok: false, reason: 'too-large' }
  return { ok: true, value: number }
}

export function parseScaled(input: string, decimals: number): Parsed {
  const value = stripInput(input).replace(/[₪$%]/g, '')
  if (!value) return { ok: false, reason: 'empty' }
  const match = /^(\d+)(?:[.,](\d*))?$/.exec(value)
  if (!match) return { ok: false, reason: 'invalid' }
  const whole = match[1].replace(/^0+(?=\d)/, '')
  if (whole.length > 10) return { ok: false, reason: 'too-large' }
  const fraction = (match[2] ?? '').padEnd(decimals + 1, '0')
  const roundUp = Number(fraction[decimals]) >= 5 ? 1 : 0
  const scale = 10 ** decimals
  return { ok: true, value: Number(whole) * scale + Number(fraction.slice(0, decimals) || '0') + roundUp }
}

export function parsePercentBp(input: string): Parsed {
  const parsed = parseScaled(input, 2)
  if (parsed.ok && parsed.value > BASIS_POINTS) return { ok: false, reason: 'too-large' }
  return parsed
}

export function parseUsdIls(input: string): Parsed {
  const parsed = parseScaled(input, 4)
  if (!parsed.ok) return parsed
  if (parsed.value === 0) return { ok: false, reason: 'invalid' }
  if (parsed.value > 100 * BASIS_POINTS) return { ok: false, reason: 'too-large' }
  return { ok: true, value: parsed.value / BASIS_POINTS }
}

export function parseShekelsToAgorot(input: string): Parsed {
  const value = stripInput(input).replace(/ש["״']?ח$/, '')
  const grouped = /^\d{1,3}(,\d{3})+(\.\d*)?$/.test(value.replace(/₪/g, ''))
  const parsed = parseScaled(grouped ? value.replace(/,/g, '') : value, 2)
  if (parsed.ok && parsed.value > MAX_PROVIDER_FEE_SHEKELS * 100) return { ok: false, reason: 'too-large' }
  return parsed
}

const usdFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const rateFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
})
const shekelFormat = new Intl.NumberFormat('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const countFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 0 })
const fxFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 4 })
const agorotFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 1 })
const longDateFormat = new Intl.DateTimeFormat('he-IL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

export const formatUsd = (cents: number) => usdFormat.format(cents / 100)

export const formatRate = (usd: number) => rateFormat.format(usd)

export const formatShekels = (agorot: number) => `${shekelFormat.format(agorot / 100)} ₪`

export const formatCount = (count: number) => countFormat.format(count)

export const formatFx = (rate: number) => fxFormat.format(rate)

export const formatAgorotPerMessage = (usd: number, usdIls: number) => agorotFormat.format(usd * usdIls * 100)

export const formatShortDate = (iso: string) => {
  const [year, month, day] = iso.split('-').map(Number)
  return `${day}.${month}.${year}`
}

export const formatLongDate = (iso: string) => longDateFormat.format(new Date(`${iso}T00:00:00Z`))

export const perThousandAgorot = (usd: number, usdIls: number) => microsToAgorot(toMicros(usd) * 1000, usdIls)

export const perThousandCents = (usd: number) => microsToCents(toMicros(usd) * 1000)

export function resultToText(result: CostResult, input: CostInput): string {
  const header = `עלות WhatsApp Business API לחודש, לפי תעריפי Meta מ-${formatShortDate(RATES_AS_OF)} ושער ${formatFx(input.usdIls)} ₪ לדולר:`
  const lines = result.lines
    .filter((line) => line.sent > 0)
    .map((line) => {
      const info = CATEGORY_INFO[line.category]
      const free = line.free > 0 ? `, מהן ${formatCount(line.free)} בחינם` : ''
      return `${info.name} (${info.english}): ${formatCount(line.sent)} הודעות${free}, ${formatUsd(line.usdCents)} (${formatShekels(line.agorot)})`
    })
  const market = input.secondMarket
    ? [
        `${(input.secondMarketShareBp / 100).toString()}% מהנמענים: ${META_RATES.markets[input.secondMarket].label}. השאר בישראל.`,
      ]
    : []
  const totals = [`תשלום ל-Meta: ${formatUsd(result.metaUsdCents)} (${formatShekels(result.metaAgorot)})`]
  if (result.providerAgorot > 0) {
    totals.push(`דמי ספק: ${formatShekels(result.providerAgorot)}`, `סך הכול: ${formatShekels(result.totalAgorot)}`)
  }
  return [header, ...lines, ...market, ...totals, 'לפני מע״מ ומסים אחרים.'].join('\n')
}
