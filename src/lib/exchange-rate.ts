import { STANDARD_VAT_RATE, breakdown, formatShekels, parseAmount, type VatBreakdown } from '@/lib/vat-calculator'

export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'CHF'
  | 'JPY'
  | 'CAD'
  | 'AUD'
  | 'SEK'
  | 'NOK'
  | 'DKK'
  | 'ZAR'
  | 'JOD'
  | 'EGP'
  | 'LBP'

export type Currency = { code: CurrencyCode; name: string; unit: number }

export type Observation = { iso: string; micros: number; unit: number }

export type RateSeries = Partial<Record<CurrencyCode, Observation[]>>

export type Direction = 'to-ils' | 'from-ils'

export type RatesFailure = 'network' | 'timeout' | 'server' | 'format' | 'aborted'

export type RatesResult = { ok: true; series: RateSeries } | { ok: false; failure: RatesFailure }

export type RateLookup = { observation: Observation; exact: boolean }

export type MissingReason = 'weekend' | 'not-yet' | 'no-rate'

export type ParsedRate = { ok: true; micros: number } | { ok: false; reason: 'empty' | 'invalid' | 'zero' }

export type Conversion = {
  direction: Direction
  code: CurrencyCode
  micros: number
  unit: number
  withVat: boolean
  foreign: VatBreakdown
  shekels: VatBreakdown
}

export type IsraelNow = { iso: string; minutes: number }

export const BOI_RATES_PAGE = 'https://www.boi.org.il/roles/markets/exchangerates/'
export const BOI_REPRATE_PAGE = 'https://www.boi.org.il/roles/markets/reprate/'
export const BOI_SERIES_BROWSER = 'https://edge.boi.gov.il/FusionDataBrowser/?locale=he'
export const BOI_DATES_PDF =
  'https://www.boi.org.il/media/pnplqicn/%D7%A8%D7%A9%D7%99%D7%9E%D7%AA-%D7%9E%D7%95%D7%A2%D7%93%D7%99%D7%9D-%D7%94%D7%9E%D7%A9%D7%A4%D7%99%D7%A2%D7%99%D7%9D-%D7%A2%D7%9C-%D7%A4%D7%A2%D7%99%D7%9C%D7%95%D7%AA-%D7%91%D7%A0%D7%A7-%D7%99%D7%A9%D7%A8%D7%90%D7%9C-%D7%9C%D7%A9%D7%A0%D7%99%D7%9D-2026-2027.pdf'
export const BOI_API_GUIDE_PDF =
  'https://www.boi.org.il/media/upqgqpuv/extracting-representative-exchange-rates-from-the-new-series-database.pdf'
export const BOI_DATA_URL = 'https://edge.boi.org.il/FusionEdgeServer/sdmx/v2/data/dataflow/BOI.STATISTICS/EXR/1.0'

export const VAT_BASIS_POINTS = STANDARD_VAT_RATE * 100
export const HISTORY_ROWS = 30
export const FETCH_SPAN_DAYS = 62
export const MIN_DATE = '2000-01-03'
export const REQUEST_TIMEOUT_MS = 15000
export const SLOW_AFTER_MS = 5000
export const TIMEOUT_REASON = 'timeout'
export const MAX_RATE_DECIMALS = 6

const MICROS = 1_000_000
const DAY_MS = 86_400_000
const WEEKDAY_CLOSE_MINUTES = 16 * 60
const FRIDAY_CLOSE_MINUTES = 13 * 60
const MAX_RATE_MICROS = 100_000 * MICROS

export const currencies: Currency[] = [
  { code: 'USD', name: 'דולר אמריקני', unit: 1 },
  { code: 'EUR', name: 'אירו', unit: 1 },
  { code: 'GBP', name: 'לירה שטרלינג', unit: 1 },
  { code: 'CHF', name: 'פרנק שווצרי', unit: 1 },
  { code: 'JPY', name: 'ין יפני', unit: 100 },
  { code: 'CAD', name: 'דולר קנדי', unit: 1 },
  { code: 'AUD', name: 'דולר אוסטרלי', unit: 1 },
  { code: 'SEK', name: 'קרונה שוודית', unit: 1 },
  { code: 'NOK', name: 'כתר נורווגי', unit: 1 },
  { code: 'DKK', name: 'כתר דני', unit: 1 },
  { code: 'ZAR', name: 'ראנד דרום אפריקאי', unit: 1 },
  { code: 'JOD', name: 'דינר ירדני', unit: 1 },
  { code: 'EGP', name: 'לירה מצרית', unit: 1 },
  { code: 'LBP', name: 'לירה לבנונית', unit: 10 },
]

const currencyCodes = new Set<string>(currencies.map((currency) => currency.code))

export const isCurrencyCode = (value: string): value is CurrencyCode => currencyCodes.has(value)

export const currencyOf = (code: CurrencyCode) => currencies.find((currency) => currency.code === code) ?? currencies[0]

const WEEKDAY_NAMES = ['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי', 'שבת']

const pad = (value: number) => String(value).padStart(2, '0')

export const dayFromIso = (iso: string) => {
  const [year, month, date] = iso.split('-').map(Number)
  return Date.UTC(year, month - 1, date) / DAY_MS
}

export const isoFromDay = (day: number) => {
  const date = new Date(day * DAY_MS)
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`
}

export const shiftIso = (iso: string, days: number) => isoFromDay(dayFromIso(iso) + days)

export const weekdayOfIso = (iso: string) => new Date(dayFromIso(iso) * DAY_MS).getUTCDay()

export const weekdayNameOfIso = (iso: string) => WEEKDAY_NAMES[weekdayOfIso(iso)]

export const formatDots = (iso: string) => {
  const [year, month, date] = iso.split('-')
  return `${date}.${month}.${year}`
}

export const isValidIso = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false
  return isoFromDay(dayFromIso(value)) === value
}

export const israelNow = (now: Date = new Date()): IsraelNow => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jerusalem',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? '0'
  return {
    iso: `${part('year')}-${part('month')}-${part('day')}`,
    minutes: Number(part('hour')) * 60 + Number(part('minute')),
  }
}

export function parseRateMicros(text: string): number | null {
  const match = /^(\d+)(?:\.(\d+))?$/.exec(text.trim())
  if (!match) return null
  const fraction = (match[2] ?? '').padEnd(MAX_RATE_DECIMALS + 1, '0')
  const roundUp = Number(fraction[MAX_RATE_DECIMALS]) >= 5 ? 1 : 0
  const micros = Number(match[1]) * MICROS + Number(fraction.slice(0, MAX_RATE_DECIMALS)) + roundUp
  return Number.isSafeInteger(micros) ? micros : null
}

export function parseRateInput(input: string): ParsedRate {
  const cleaned = input.replace(/[\s\p{Cf}₪]/gu, '')
  if (!cleaned) return { ok: false, reason: 'empty' }
  const normalized = cleaned.includes('.') ? cleaned : cleaned.replace(',', '.')
  const micros = parseRateMicros(normalized)
  if (micros === null || micros > MAX_RATE_MICROS) return { ok: false, reason: 'invalid' }
  if (micros === 0) return { ok: false, reason: 'zero' }
  return { ok: true, micros }
}

export const parseForeignAmount = parseAmount

const splitCsvLine = (line: string) => {
  const cells: string[] = []
  let current = ''
  let quoted = false
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    if (quoted) {
      if (char === '"' && line[index + 1] === '"') {
        current += '"'
        index += 1
      } else if (char === '"') quoted = false
      else current += char
    } else if (char === '"') quoted = true
    else if (char === ',') {
      cells.push(current)
      current = ''
    } else current += char
  }
  cells.push(current)
  return cells
}

export function parseRatesCsv(text: string): RateSeries | null {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/).filter((line) => line.trim())
  if (!lines.length) return null
  const header = splitCsvLine(lines[0]).map((cell) => cell.trim())
  const column = (name: string) => header.indexOf(name)
  const seriesIndex = column('SERIES_CODE')
  const periodIndex = column('TIME_PERIOD')
  const valueIndex = column('OBS_VALUE')
  const multIndex = column('UNIT_MULT')
  if (seriesIndex < 0 || periodIndex < 0 || valueIndex < 0) return null

  const byCode = new Map<CurrencyCode, Map<string, Observation>>()
  for (const line of lines.slice(1)) {
    const cells = splitCsvLine(line)
    const code = /^RER_([A-Z]{3})_ILS$/.exec(cells[seriesIndex]?.trim() ?? '')?.[1] ?? ''
    if (!isCurrencyCode(code)) continue
    const iso = cells[periodIndex]?.trim() ?? ''
    if (!isValidIso(iso)) continue
    const micros = parseRateMicros(cells[valueIndex] ?? '')
    if (!micros) continue
    const mult = multIndex >= 0 ? Number(cells[multIndex]?.trim() || '0') : 0
    const unit = Number.isInteger(mult) && mult >= 0 && mult <= 6 ? 10 ** mult : currencyOf(code).unit
    const observations = byCode.get(code) ?? new Map<string, Observation>()
    observations.set(iso, { iso, micros, unit })
    byCode.set(code, observations)
  }

  const series: RateSeries = {}
  for (const [code, observations] of byCode) {
    series[code] = [...observations.values()].sort((a, b) => (a.iso < b.iso ? -1 : a.iso > b.iso ? 1 : 0))
  }
  return series
}

export function rateFor(observations: Observation[] | undefined, iso: string): RateLookup | null {
  if (!observations?.length) return null
  for (let index = observations.length - 1; index >= 0; index -= 1) {
    const observation = observations[index]
    if (observation.iso <= iso) return { observation, exact: observation.iso === iso }
  }
  return null
}

export function historyFor(observations: Observation[] | undefined, iso: string, rows = HISTORY_ROWS) {
  if (!observations?.length) return []
  const upTo = observations.filter((observation) => observation.iso <= iso)
  const start = Math.max(0, upTo.length - rows)
  return upTo
    .slice(start)
    .map((observation, index, list) => {
      const previous = index > 0 ? list[index - 1] : start > 0 ? upTo[start - 1] : null
      const change = previous ? (observation.micros - previous.micros) / previous.micros : null
      return { observation, change }
    })
    .reverse()
}

export function missingReason(targetIso: string, now: IsraelNow): MissingReason {
  const weekday = weekdayOfIso(targetIso)
  if (weekday === 0 || weekday === 6) return 'weekend'
  if (targetIso !== now.iso) return 'no-rate'
  const close = weekday === 5 ? FRIDAY_CLOSE_MINUTES : WEEKDAY_CLOSE_MINUTES
  return now.minutes < close ? 'not-yet' : 'no-rate'
}

export function fallbackNotice(targetIso: string, used: Observation, reason: MissingReason) {
  const usedText = `מוצג השער האחרון שפורסם לפני כן, מ${weekdayNameOfIso(used.iso)}, ${formatDots(used.iso)}.`
  if (reason === 'weekend') {
    return `ב${weekdayNameOfIso(targetIso)}, ${formatDots(targetIso)}, בנק ישראל לא מפרסם שער יציג. ${usedText}`
  }
  if (reason === 'not-yet') {
    return `השער של היום עוד לא פורסם. בנק ישראל מפרסם אותו בדרך כלל זמן קצר אחרי 15:15, ובימי שישי ובערבי חג אחרי 12:15. ${usedText}`
  }
  return `ב-${formatDots(targetIso)} לא פורסם שער יציג, למשל בגלל חג בישראל או בחו״ל. ${usedText}`
}

export const ratesWindow = (endIso: string) => ({ start: shiftIso(endIso, -FETCH_SPAN_DAYS), end: endIso })

export const seriesKey = currencies.map((currency) => `RER_${currency.code}_ILS`).join(',')

export const ratesUrl = (startIso: string, endIso: string, base = BOI_DATA_URL) =>
  `${base}/${seriesKey}?${new URLSearchParams({ startperiod: startIso, endperiod: endIso, format: 'csv' })}`

export const RATES_PROXY_PATH = '/api/tools/boi-rates'

export const proxyRatesUrl = (startIso: string, endIso: string) =>
  `${RATES_PROXY_PATH}?${new URLSearchParams({ start: startIso, end: endIso })}`

export async function fetchRates(url: string, signal: AbortSignal): Promise<RatesResult> {
  try {
    const response = await fetch(url, { signal, headers: { Accept: 'text/csv' } })
    if (!response.ok) return { ok: false, failure: 'server' }
    const series = parseRatesCsv(await response.text())
    return series ? { ok: true, series } : { ok: false, failure: 'format' }
  } catch {
    if (signal.aborted) return { ok: false, failure: signal.reason === TIMEOUT_REASON ? 'timeout' : 'aborted' }
    return { ok: false, failure: 'network' }
  }
}

export const failureText: Record<Exclude<RatesFailure, 'aborted'>, string> = {
  network: 'השער לא נטען מבנק ישראל.',
  timeout: 'בנק ישראל לא ענה בתוך 15 שניות.',
  server: 'מאגר השערים של בנק ישראל לא זמין כרגע.',
  format: 'בנק ישראל החזיר תשובה שלא הצלחנו לקרוא.',
}

const toBig = (value: number) => BigInt(Math.round(value))

const mulDiv = (value: number, multiplier: number, divisor: number) => {
  const two = BigInt(2)
  const denominator = toBig(divisor)
  return Number((toBig(value) * toBig(multiplier) * two + denominator) / (two * denominator))
}

const withoutVat = (amount: number): VatBreakdown => ({ net: amount, vat: 0, gross: amount })

export type ConversionInput = {
  amount: number
  direction: Direction
  micros: number
  unit: number
  withVat: boolean
  code: CurrencyCode
}

export function convert({ amount, direction, micros, unit, withVat, code }: ConversionInput): Conversion {
  const foreignNet = direction === 'to-ils' ? amount : mulDiv(amount, unit * MICROS, micros)
  const shekelNet = direction === 'to-ils' ? mulDiv(amount, micros, unit * MICROS) : amount
  const split = (value: number) => (withVat ? breakdown(value, 'add', VAT_BASIS_POINTS) : withoutVat(value))
  return {
    direction,
    code,
    micros,
    unit,
    withVat,
    foreign: split(foreignNet),
    shekels: split(shekelNet),
  }
}

const moneyFormat = new Intl.NumberFormat('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const rateFormat = new Intl.NumberFormat('he-IL', {
  minimumFractionDigits: 4,
  maximumFractionDigits: MAX_RATE_DECIMALS,
  useGrouping: false,
})
const changeFormat = new Intl.NumberFormat('he-IL', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: 'exceptZero',
})

export const formatForeign = (hundredths: number, code: CurrencyCode) => `${moneyFormat.format(hundredths / 100)} ${code}`

export { formatShekels }

export const formatRate = (micros: number) => rateFormat.format(micros / MICROS)

export const formatChange = (change: number) => `${changeFormat.format(change * 100)}%`

export const rateInputValue = (micros: number) => String(micros / MICROS)

export const unitText = (unit: number, code: CurrencyCode) => `${unit} ${code}`

export const invoiceLine = (micros: number, unit: number, code: CurrencyCode, iso: string) =>
  `לפי שער יציג של ${formatRate(micros)} ₪ ל-${unitText(unit, code)} מיום ${formatDots(iso)}`

export function conversionText(conversion: Conversion, iso: string) {
  const { foreign, shekels, code, micros, unit } = conversion
  const rate = formatRate(micros)
  const multiplier = unit === 1 ? rate : `${rate} ÷ ${unit}`
  const lines =
    conversion.direction === 'to-ils'
      ? [`${formatForeign(foreign.net, code)} × ${multiplier} = ${formatShekels(shekels.net)}`]
      : [`${formatShekels(shekels.net)} ÷ ${multiplier} = ${formatForeign(foreign.net, code)}`]
  if (conversion.withVat) {
    lines.push(
      `מע״מ ${STANDARD_VAT_RATE}%: ${formatShekels(shekels.vat)}`,
      `סה״כ כולל מע״מ: ${formatShekels(shekels.gross)} (${formatForeign(foreign.gross, code)})`,
    )
  }
  lines.push(invoiceLine(micros, unit, code, iso))
  return lines.join('\n')
}

export const directionOptions: { value: Direction; label: string }[] = [
  { value: 'to-ils', label: 'ממטבע חוץ לשקלים' },
  { value: 'from-ils', label: 'משקלים למטבע חוץ' },
]
