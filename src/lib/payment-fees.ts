export const FEES_CHECKED_ON = '2026-10-28'
export const VAT_RATE = 0.18

export type FeeSource = { label: string; url: string; checkedOn: string }

export type PlatformId = 'paypal' | 'grow' | 'grow-light' | 'ebay' | 'custom'
export type Currency = 'ILS' | 'USD' | 'EUR'
export type PaypalRegion = 'domestic' | 'near' | 'other'

export const SOURCES = {
  paypal: {
    label: 'PayPal ישראל: עמלות בעל עסק (עודכן 13 באוקטובר 2026)',
    url: 'https://www.paypal.com/il/business/paypal-business-fees',
    checkedOn: FEES_CHECKED_ON,
  },
  grow: {
    label: 'Grow (לשעבר משולם): כמה זה עולה',
    url: 'https://grow.business/price-offer/',
    checkedOn: FEES_CHECKED_ON,
  },
  ebay: {
    label: 'eBay: Selling fees',
    url: 'https://www.ebay.com/help/selling/fees-credits-invoices/selling-fees?id=4822',
    checkedOn: FEES_CHECKED_ON,
  },
  stripe: {
    label: 'Stripe: Global availability',
    url: 'https://stripe.com/global',
    checkedOn: FEES_CHECKED_ON,
  },
} satisfies Record<string, FeeSource>

export const PAYPAL = {
  domesticPercent: 3.4,
  regionExtraPercent: { domestic: 0, near: 1, other: 2 } as Record<PaypalRegion, number>,
  fixedFee: { ILS: 1.2, USD: 0.3, EUR: 0.35 } as Record<Currency, number>,
  conversionPercent: 2.5,
  withdrawalFeeIls: 8,
  withdrawalFreeFromIls: 1000,
  source: SOURCES.paypal,
}

export const GROW = {
  percent: 0.75,
  monthlyIls: 59,
  monthlyNoCommitmentIls: 69,
  includedTransactions: 100,
  extraTransactionIls: 0.5,
  lightPercent: 1,
  lightMonthlyIls: 29,
  lightIncludedTransactions: 20,
  dinersPercent: 1.5,
  touristCardPercent: 3.5,
  source: SOURCES.grow,
}

export const EBAY = {
  finalValuePercent: 13.6,
  finalValueThresholdUsd: 7500,
  finalValueAbovePercent: 2.35,
  perOrderSmallUsd: 0.3,
  perOrderLargeUsd: 0.4,
  perOrderThresholdUsd: 10,
  internationalPercent: 1.65,
  source: SOURCES.ebay,
}

export type FeeInput = {
  platform: PlatformId
  currency: Currency
  paypalRegion: PaypalRegion
  paypalConvert: boolean
  customPercent: number
  customFixed: number
  customVat: boolean
}

export type FeeBreakdown = {
  gross: number
  fee: number
  vat: number
  conversion: number
  totalCost: number
  net: number
  effectivePercent: number
}

export const platformCurrencies: Record<PlatformId, Currency[]> = {
  paypal: ['ILS', 'USD', 'EUR'],
  grow: ['ILS'],
  'grow-light': ['ILS'],
  ebay: ['USD'],
  custom: ['ILS'],
}

export const currencySymbol: Record<Currency, string> = { ILS: '₪', USD: '$', EUR: '€' }

const round = (value: number) => Math.round(value * 100) / 100

function baseFee(input: FeeInput, gross: number): { fee: number; vatable: boolean } {
  switch (input.platform) {
    case 'paypal': {
      const percent = PAYPAL.domesticPercent + PAYPAL.regionExtraPercent[input.paypalRegion]
      return { fee: (gross * percent) / 100 + PAYPAL.fixedFee[input.currency], vatable: true }
    }
    case 'grow':
      return { fee: (gross * GROW.percent) / 100, vatable: true }
    case 'grow-light':
      return { fee: (gross * GROW.lightPercent) / 100, vatable: true }
    case 'ebay': {
      const lower = Math.min(gross, EBAY.finalValueThresholdUsd)
      const upper = Math.max(0, gross - EBAY.finalValueThresholdUsd)
      const perOrder = gross > EBAY.perOrderThresholdUsd ? EBAY.perOrderLargeUsd : EBAY.perOrderSmallUsd
      const fee =
        (lower * EBAY.finalValuePercent) / 100 +
        (upper * EBAY.finalValueAbovePercent) / 100 +
        perOrder +
        (gross * EBAY.internationalPercent) / 100
      return { fee, vatable: false }
    }
    case 'custom':
      return { fee: (gross * input.customPercent) / 100 + input.customFixed, vatable: input.customVat }
  }
}

export function calculateFees(input: FeeInput, gross: number): FeeBreakdown {
  const { fee, vatable } = baseFee(input, gross)
  const roundedFee = round(fee)
  const vat = vatable ? round(roundedFee * VAT_RATE) : 0
  const afterFees = gross - roundedFee - vat
  const conversion =
    input.platform === 'paypal' && input.paypalConvert && input.currency !== 'ILS' && afterFees > 0
      ? round((afterFees * PAYPAL.conversionPercent) / 100)
      : 0
  const totalCost = round(roundedFee + vat + conversion)
  const net = round(gross - totalCost)
  return {
    gross: round(gross),
    fee: roundedFee,
    vat,
    conversion,
    totalCost,
    net,
    effectivePercent: gross > 0 ? (totalCost / gross) * 100 : 0,
  }
}

const MAX_GROSS = 10_000_000

export function grossForNet(input: FeeInput, target: number): FeeBreakdown | null {
  if (target <= 0) return null
  if (calculateFees(input, MAX_GROSS).net < target) return null
  let low = 0
  let high = MAX_GROSS * 100
  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    if (calculateFees(input, mid / 100).net >= target) high = mid
    else low = mid + 1
  }
  return calculateFees(input, low / 100)
}

export function parseAmount(value: string): number | null {
  const cleaned = value.replace(/[,\s₪$€]/g, '')
  if (!cleaned) return null
  if (!/^\d+(\.\d{0,2})?$/.test(cleaned)) return null
  const amount = Number(cleaned)
  return amount > 0 && amount <= MAX_GROSS ? amount : null
}

export function parsePercent(value: string): number | null {
  const cleaned = value.replace(/[%\s]/g, '')
  if (!cleaned) return null
  if (!/^\d+(\.\d{0,3})?$/.test(cleaned)) return null
  const percent = Number(cleaned)
  return percent >= 0 && percent < 100 ? percent : null
}

export function formatMoney(value: number, currency: Currency) {
  const formatted = value.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return currency === 'ILS' ? `${formatted} ₪` : `${currencySymbol[currency]}${formatted}`
}

export function formatPercent(value: number) {
  return `${value.toLocaleString('he-IL', { maximumFractionDigits: 2 })}%`
}
