export type CurrencyPage = { slug: string; code: string; name: string; country: string; samples: number[] }

export const CURRENCY_HUB_PATH = '/tools/currency'
export const RATES_SOURCE_URL = 'https://www.exchangerate-api.com'
export const RATES_API = 'https://open.er-api.com/v6/latest/ILS'
export const RATES_REVALIDATE_SECONDS = 3600

export const currencyPages: CurrencyPage[] = [
  { slug: 'usd', code: 'USD', name: 'דולר אמריקאי', country: 'ארצות הברית', samples: [1, 10, 50, 75, 100, 500, 1000] },
  { slug: 'eur', code: 'EUR', name: 'יורו', country: 'גוש האירו', samples: [1, 10, 50, 100, 500, 1000] },
  { slug: 'gbp', code: 'GBP', name: 'לירה שטרלינג', country: 'בריטניה', samples: [1, 10, 50, 100, 500, 1000] },
  { slug: 'pln', code: 'PLN', name: 'זלוטי פולני', country: 'פולין', samples: [1, 10, 50, 100, 500, 1000] },
  { slug: 'krw', code: 'KRW', name: 'וון קוריאני', country: 'דרום קוריאה', samples: [1000, 5000, 10000, 50000, 100000, 1000000] },
  { slug: 'thb', code: 'THB', name: 'באט תאילנדי', country: 'תאילנד', samples: [1, 100, 500, 1000, 5000, 10000] },
  { slug: 'uah', code: 'UAH', name: 'גריבנה אוקראינית', country: 'אוקראינה', samples: [1, 100, 500, 1000, 5000, 10000] },
  { slug: 'aed', code: 'AED', name: 'דירהם', country: 'איחוד האמירויות', samples: [1, 10, 50, 100, 500, 1000] },
  { slug: 'inr', code: 'INR', name: 'רופי הודי', country: 'הודו', samples: [1, 100, 500, 1000, 10000, 100000] },
  { slug: 'try', code: 'TRY', name: 'לירה טורקית', country: 'טורקיה', samples: [1, 10, 100, 500, 1000, 5000] },
  { slug: 'rub', code: 'RUB', name: 'רובל רוסי', country: 'רוסיה', samples: [1, 100, 500, 1000, 5000, 10000] },
  { slug: 'cny', code: 'CNY', name: 'יואן סיני', country: 'סין', samples: [1, 10, 100, 500, 1000, 10000] },
  { slug: 'jpy', code: 'JPY', name: 'ין יפני', country: 'יפן', samples: [100, 1000, 5000, 10000, 50000, 100000] },
  { slug: 'gel', code: 'GEL', name: 'לארי גאורגי', country: 'גאורגיה', samples: [1, 10, 50, 100, 500, 1000] },
  { slug: 'czk', code: 'CZK', name: 'קורונה צ׳כית', country: 'צ׳כיה', samples: [1, 100, 500, 1000, 5000, 10000] },
  { slug: 'huf', code: 'HUF', name: 'פורינט הונגרי', country: 'הונגריה', samples: [100, 1000, 5000, 10000, 50000, 100000] },
  { slug: 'vnd', code: 'VND', name: 'דונג וייטנאמי', country: 'וייטנאם', samples: [10000, 50000, 100000, 500000, 1000000] },
  { slug: 'php', code: 'PHP', name: 'פסו פיליפיני', country: 'הפיליפינים', samples: [1, 100, 500, 1000, 5000, 10000] },
  { slug: 'bgn', code: 'BGN', name: 'לב בולגרי', country: 'בולגריה', samples: [1, 10, 50, 100, 500, 1000] },
  { slug: 'ron', code: 'RON', name: 'לאו רומני', country: 'רומניה', samples: [1, 10, 50, 100, 500, 1000] },
  { slug: 'mad', code: 'MAD', name: 'דירהם מרוקאי', country: 'מרוקו', samples: [1, 10, 100, 500, 1000, 5000] },
  { slug: 'cad', code: 'CAD', name: 'דולר קנדי', country: 'קנדה', samples: [1, 10, 50, 100, 500, 1000] },
  { slug: 'aud', code: 'AUD', name: 'דולר אוסטרלי', country: 'אוסטרליה', samples: [1, 10, 50, 100, 500, 1000] },
  { slug: 'chf', code: 'CHF', name: 'פרנק שווייצרי', country: 'שווייץ', samples: [1, 10, 50, 100, 500, 1000] },
]

export const currencyPath = (slug: string) => `${CURRENCY_HUB_PATH}/${slug}`

export const currencyPage = (slug: string) => currencyPages.find((page) => page.slug === slug)

export type IlsRates = { rates: Record<string, number>; updated: string }

export async function fetchIlsRates(): Promise<IlsRates | null> {
  try {
    const response = await fetch(RATES_API, { next: { revalidate: RATES_REVALIDATE_SECONDS } })
    if (!response.ok) return null
    const data = (await response.json()) as { result?: string; rates?: Record<string, number>; time_last_update_unix?: number }
    if (data.result !== 'success' || !data.rates) return null
    const updated = data.time_last_update_unix
      ? new Intl.DateTimeFormat('he-IL', { timeZone: 'Asia/Jerusalem', day: 'numeric', month: 'numeric', year: 'numeric' }).format(
          new Date(data.time_last_update_unix * 1000),
        )
      : ''
    return { rates: data.rates, updated }
  } catch {
    return null
  }
}

export const shekelsPer = (rates: IlsRates, code: string) => {
  const perShekel = rates.rates[code]
  return perShekel ? 1 / perShekel : null
}

export const formatMoney = (value: number) =>
  new Intl.NumberFormat('he-IL', { maximumFractionDigits: value >= 100 ? 2 : value >= 1 ? 3 : 5 }).format(value)
