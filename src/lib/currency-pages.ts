export type CurrencyPage = {
  slug: string
  code: string
  name: string
  country: string
  samples: number[]
  short?: string
  headline?: number
  region: Region
  representative?: boolean
  representativeUnits?: number
  plural?: string
}

export type Region = 'america' | 'europe' | 'east' | 'mideast' | 'asia'

export const CURRENCY_HUB_PATH = '/tools/currency'
export const RATES_REVALIDATE_SECONDS = 3600
export const LEV_RETIRED_ON = '2026-02-01'
export const LEV_PER_EURO = 1.95583

const SNAPSHOT_URLS = (tag: string) => [
  `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${tag}/v1/currencies/ils.json`,
  `https://${tag}.currency-api.pages.dev/v1/currencies/ils.json`,
]
const FALLBACK_API = 'https://open.er-api.com/v6/latest/ILS'

export type RatesSource = { label: string; href: string }

export const SNAPSHOT_SOURCE: RatesSource = {
  label: 'currency-api (fawazahmed0)',
  href: 'https://github.com/fawazahmed0/exchange-api',
}
const FALLBACK_SOURCE: RatesSource = { label: 'ExchangeRate-API', href: 'https://www.exchangerate-api.com' }

export const currencyPages: CurrencyPage[] = [
  { slug: 'usd', code: 'USD', name: 'דולר אמריקאי', country: 'ארצות הברית', samples: [1, 10, 50, 75, 100, 500, 1000], short: 'דולר', region: 'america', representative: true },
  { slug: 'eur', code: 'EUR', name: 'יורו', country: 'גוש האירו', samples: [1, 10, 50, 100, 500, 1000], region: 'europe', representative: true },
  { slug: 'gbp', code: 'GBP', name: 'לירה שטרלינג', country: 'בריטניה', samples: [1, 10, 50, 100, 500, 1000], region: 'europe', representative: true, plural: 'לירות שטרלינג' },
  { slug: 'pln', code: 'PLN', name: 'זלוטי פולני', country: 'פולין', samples: [1, 10, 50, 100, 500, 1000], short: 'זלוטי', region: 'europe' },
  { slug: 'krw', code: 'KRW', name: 'וון קוריאני', country: 'דרום קוריאה', samples: [1000, 5000, 10000, 50000, 100000, 1000000], short: 'וון', headline: 10000, region: 'asia' },
  { slug: 'thb', code: 'THB', name: 'באט תאילנדי', country: 'תאילנד', samples: [1, 100, 500, 1000, 5000, 10000], short: 'באט', headline: 100, region: 'asia' },
  { slug: 'uah', code: 'UAH', name: 'גריבנה אוקראינית', country: 'אוקראינה', samples: [1, 100, 500, 1000, 5000, 10000], short: 'גריבנה', headline: 100, region: 'east' },
  { slug: 'aed', code: 'AED', name: 'דירהם', country: 'איחוד האמירויות', samples: [1, 10, 50, 100, 500, 1000], region: 'mideast' },
  { slug: 'inr', code: 'INR', name: 'רופי הודי', country: 'הודו', samples: [1, 100, 500, 1000, 10000, 100000], short: 'רופי', headline: 100, region: 'asia' },
  { slug: 'try', code: 'TRY', name: 'לירה טורקית', country: 'טורקיה', samples: [1, 10, 100, 500, 1000, 5000], headline: 100, region: 'mideast', plural: 'לירות טורקיות' },
  { slug: 'rub', code: 'RUB', name: 'רובל רוסי', country: 'רוסיה', samples: [1, 100, 500, 1000, 5000, 10000], short: 'רובל', headline: 1000, region: 'east' },
  { slug: 'cny', code: 'CNY', name: 'יואן סיני', country: 'סין', samples: [1, 10, 100, 500, 1000, 10000], short: 'יואן', region: 'asia' },
  { slug: 'jpy', code: 'JPY', name: 'ין יפני', country: 'יפן', samples: [100, 1000, 5000, 10000, 50000, 100000], short: 'ין', headline: 1000, region: 'asia', representative: true, representativeUnits: 100 },
  { slug: 'gel', code: 'GEL', name: 'לארי גאורגי', country: 'גאורגיה', samples: [1, 10, 50, 100, 500, 1000], short: 'לארי', headline: 100, region: 'east' },
  { slug: 'czk', code: 'CZK', name: 'קורונה צ׳כית', country: 'צ׳כיה', samples: [1, 100, 500, 1000, 5000, 10000], headline: 100, region: 'europe', plural: 'קורונות צ׳כיות' },
  { slug: 'huf', code: 'HUF', name: 'פורינט הונגרי', country: 'הונגריה', samples: [100, 1000, 5000, 10000, 50000, 100000], short: 'פורינט', headline: 1000, region: 'europe' },
  { slug: 'vnd', code: 'VND', name: 'דונג וייטנאמי', country: 'וייטנאם', samples: [10000, 50000, 100000, 500000, 1000000], short: 'דונג', headline: 10000, region: 'asia' },
  { slug: 'php', code: 'PHP', name: 'פסו פיליפיני', country: 'הפיליפינים', samples: [1, 100, 500, 1000, 5000, 10000], short: 'פסו פיליפיני', headline: 100, region: 'asia' },
  { slug: 'bgn', code: 'BGN', name: 'לב בולגרי', country: 'בולגריה', samples: [1, 10, 50, 100, 500, 1000], region: 'europe', plural: 'לב' },
  { slug: 'ron', code: 'RON', name: 'לאו רומני', country: 'רומניה', samples: [1, 10, 50, 100, 500, 1000], short: 'לאו', region: 'europe' },
  { slug: 'mad', code: 'MAD', name: 'דירהם מרוקאי', country: 'מרוקו', samples: [1, 10, 100, 500, 1000, 5000], headline: 100, region: 'mideast' },
  { slug: 'cad', code: 'CAD', name: 'דולר קנדי', country: 'קנדה', samples: [1, 10, 50, 100, 500, 1000], region: 'america', representative: true },
  { slug: 'aud', code: 'AUD', name: 'דולר אוסטרלי', country: 'אוסטרליה', samples: [1, 10, 50, 100, 500, 1000], region: 'america', representative: true },
  { slug: 'chf', code: 'CHF', name: 'פרנק שווייצרי', country: 'שווייץ', samples: [1, 10, 50, 100, 500, 1000], region: 'europe', representative: true },
]

export const currencyPath = (slug: string) => `${CURRENCY_HUB_PATH}/${slug}`

export const currencyPage = (slug: string) => currencyPages.find((page) => page.slug === slug)

export type IlsRates = { rates: Record<string, number>; updated: string; date: string; source: RatesSource }

export type RatesSnapshot = { date: string; rates: Record<string, number> }

export const formatIsoDate = (iso: string) =>
  new Intl.DateTimeFormat('he-IL', { timeZone: 'UTC', day: 'numeric', month: 'numeric', year: 'numeric' }).format(new Date(`${iso}T00:00:00Z`))

const upperKeys = (rates: Record<string, number>) =>
  Object.fromEntries(Object.entries(rates).map(([code, value]) => [code.toUpperCase(), value]))

async function fetchSnapshot(tag: string, cache: 'hourly' | 'forever'): Promise<RatesSnapshot | null> {
  for (const url of SNAPSHOT_URLS(tag)) {
    try {
      const response = await fetch(url, cache === 'forever' ? { cache: 'force-cache' } : { next: { revalidate: RATES_REVALIDATE_SECONDS } })
      if (!response.ok) continue
      const data = (await response.json()) as { date?: string; ils?: Record<string, number> }
      if (data.date && data.ils) return { date: data.date, rates: upperKeys(data.ils) }
    } catch {
      continue
    }
  }
  return null
}

async function fetchFallbackRates(): Promise<IlsRates | null> {
  try {
    const response = await fetch(FALLBACK_API, { next: { revalidate: RATES_REVALIDATE_SECONDS } })
    if (!response.ok) return null
    const data = (await response.json()) as { result?: string; rates?: Record<string, number>; time_last_update_unix?: number }
    if (data.result !== 'success' || !data.rates || !data.time_last_update_unix) return null
    const date = new Date(data.time_last_update_unix * 1000).toISOString().slice(0, 10)
    return { rates: data.rates, date, updated: formatIsoDate(date), source: FALLBACK_SOURCE }
  } catch {
    return null
  }
}

export async function fetchIlsRates(): Promise<IlsRates | null> {
  const latest = await fetchSnapshot('latest', 'hourly')
  if (latest) return { ...latest, updated: formatIsoDate(latest.date), source: SNAPSHOT_SOURCE }
  return fetchFallbackRates()
}

const shiftIso = (iso: string, { days = 0, months = 0, years = 0 }) => {
  const date = new Date(`${iso}T00:00:00Z`)
  date.setUTCFullYear(date.getUTCFullYear() + years, date.getUTCMonth() + months, date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

const monthStarts = (iso: string, count: number) => {
  const first = `${iso.slice(0, 7)}-01`
  return Array.from({ length: count }, (_, index) => shiftIso(first, { months: index - count + 1 })).filter((date) => date < iso)
}

export type RatesHistory = { monthAgo: RatesSnapshot | null; yearAgo: RatesSnapshot | null; months: RatesSnapshot[] }

export async function fetchIlsHistory(latestIso: string): Promise<RatesHistory> {
  const monthDates = monthStarts(latestIso, 13)
  const [monthAgo, yearAgo, ...months] = await Promise.all([
    fetchSnapshot(shiftIso(latestIso, { months: -1 }), 'forever'),
    fetchSnapshot(shiftIso(latestIso, { years: -1 }), 'forever'),
    ...monthDates.map((date) => fetchSnapshot(date, 'forever')),
  ])
  return { monthAgo, yearAgo, months: months.filter((snapshot): snapshot is RatesSnapshot => snapshot !== null) }
}

export const shekelsPer = (rates: IlsRates, code: string) => {
  const perShekel = rates.rates[code]
  return perShekel ? 1 / perShekel : null
}

export const shortName = (page: CurrencyPage) => page.short ?? page.name

export const pluralName = (page: CurrencyPage) => page.plural ?? shortName(page)

export const headlineAmount = (page: CurrencyPage) => page.headline ?? 1

export const roundedShekels = (value: number) =>
  new Intl.NumberFormat('he-IL', { maximumFractionDigits: value >= 100 ? 0 : value >= 10 ? 1 : 2 }).format(value)

export const formatMoney = (value: number) =>
  new Intl.NumberFormat('he-IL', { maximumFractionDigits: value >= 100 ? 2 : value >= 1 ? 3 : 5 }).format(value)
