import {
  REQUEST_TIMEOUT_MS,
  TIMEOUT_REASON,
  fetchRates,
  israelNow,
  proxyRatesUrl,
  ratesWindow,
} from '@/lib/exchange-rate'
import { DEFAULT_USD_ILS } from '@/lib/whatsapp-api-cost'

export type VendorId = 'chatgpt' | 'claude' | 'gemini' | 'copilot' | 'perplexity'

export type Billing = 'monthly' | 'annual'

export type TaxMark = 'inclusive' | 'exclusive'

export type LocalPrice = { monthly: number; annualPerMonth: number | null; tax: TaxMark }

export type AiPlan = {
  id: string
  vendor: VendorId
  name: string
  monthlyUsd: number
  annualPerMonthUsd: number | null
  perSeat: boolean
  audience: string
  local?: LocalPrice
}

export type Vendor = { id: VendorId; name: string; company: string; source: { href: string; label: string } }

export type PlanCost = {
  plan: AiPlan
  billing: Billing
  usdPerSeatMonth: number
  ilsPerSeatMonth: number
  ilsPerSeatYear: number
  ilsTeamMonth: number
  ilsTeamYear: number
  ilsPerWorkday: number
  annualFallback: boolean
}

export const PRICES_AS_OF = '2026-10-23'

export const WORKDAYS_PER_MONTH = 22

export const MAX_SEATS = 10_000

export const FALLBACK_USD_ILS = DEFAULT_USD_ILS

export const vendors: Vendor[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    company: 'OpenAI',
    source: { href: 'https://chatgpt.com/pricing', label: 'OpenAI: ChatGPT Pricing' },
  },
  {
    id: 'claude',
    name: 'Claude',
    company: 'Anthropic',
    source: { href: 'https://claude.com/pricing', label: 'Anthropic: Claude Pricing' },
  },
  {
    id: 'gemini',
    name: 'Gemini',
    company: 'Google',
    source: { href: 'https://gemini.google/subscriptions/', label: 'Google: Gemini subscriptions' },
  },
  {
    id: 'copilot',
    name: 'Microsoft Copilot',
    company: 'Microsoft',
    source: {
      href: 'https://www.microsoft.com/en-us/microsoft-365/copilot/pricing',
      label: 'Microsoft: Microsoft 365 Copilot pricing',
    },
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    company: 'Perplexity',
    source: { href: 'https://www.perplexity.ai/hub/pricing', label: 'Perplexity: Pricing' },
  },
]

export const plans: AiPlan[] = [
  {
    id: 'chatgpt-go',
    vendor: 'chatgpt',
    name: 'ChatGPT Go',
    monthlyUsd: 8,
    annualPerMonthUsd: null,
    perSeat: false,
    audience: 'המסלול הזול של ChatGPT, למשתמש יחיד',
    local: { monthly: 25, annualPerMonth: null, tax: 'inclusive' },
  },
  {
    id: 'chatgpt-plus',
    vendor: 'chatgpt',
    name: 'ChatGPT Plus',
    monthlyUsd: 20,
    annualPerMonthUsd: 16.67,
    perSeat: false,
    audience: 'המסלול הנפוץ למשתמש יחיד',
    local: { monthly: 70, annualPerMonth: 58.33, tax: 'inclusive' },
  },
  {
    id: 'chatgpt-pro-100',
    vendor: 'chatgpt',
    name: 'ChatGPT Pro 100',
    monthlyUsd: 100,
    annualPerMonthUsd: null,
    perSeat: false,
    audience: 'למשתמש כבד, יותר שימוש מ-Plus',
    local: { monthly: 310, annualPerMonth: null, tax: 'inclusive' },
  },
  {
    id: 'chatgpt-pro-200',
    vendor: 'chatgpt',
    name: 'ChatGPT Pro 200',
    monthlyUsd: 200,
    annualPerMonthUsd: null,
    perSeat: false,
    audience: 'למשתמש כבד מאוד',
    local: { monthly: 700, annualPerMonth: null, tax: 'inclusive' },
  },
  {
    id: 'chatgpt-pro-500',
    vendor: 'chatgpt',
    name: 'ChatGPT Pro 500',
    monthlyUsd: 500,
    annualPerMonthUsd: null,
    perSeat: false,
    audience: 'המסלול האישי היקר ביותר',
    local: { monthly: 1550, annualPerMonth: null, tax: 'inclusive' },
  },
  {
    id: 'chatgpt-business',
    vendor: 'chatgpt',
    name: 'ChatGPT Business',
    monthlyUsd: 25,
    annualPerMonthUsd: 20,
    perSeat: true,
    audience: 'לצוות, מחיר למשתמש, עם ניהול מרוכז',
    local: { monthly: 78, annualPerMonth: 62, tax: 'exclusive' },
  },
  {
    id: 'claude-pro',
    vendor: 'claude',
    name: 'Claude Pro',
    monthlyUsd: 20,
    annualPerMonthUsd: 17,
    perSeat: false,
    audience: 'המסלול הבסיסי בתשלום למשתמש יחיד',
  },
  {
    id: 'claude-max-5',
    vendor: 'claude',
    name: 'Claude Max 5x',
    monthlyUsd: 100,
    annualPerMonthUsd: null,
    perSeat: false,
    audience: 'פי 5 שימוש מ-Pro',
  },
  {
    id: 'claude-max-20',
    vendor: 'claude',
    name: 'Claude Max 20x',
    monthlyUsd: 200,
    annualPerMonthUsd: null,
    perSeat: false,
    audience: 'פי 20 שימוש מ-Pro',
  },
  {
    id: 'claude-team',
    vendor: 'claude',
    name: 'Claude Team Standard',
    monthlyUsd: 25,
    annualPerMonthUsd: 20,
    perSeat: true,
    audience: 'לצוות, מחיר למשתמש',
  },
  {
    id: 'claude-team-premium',
    vendor: 'claude',
    name: 'Claude Team Premium',
    monthlyUsd: 125,
    annualPerMonthUsd: 100,
    perSeat: true,
    audience: 'לצוות, פי 5 שימוש ממושב Standard',
  },
  {
    id: 'gemini-plus',
    vendor: 'gemini',
    name: 'Google AI Plus',
    monthlyUsd: 4.99,
    annualPerMonthUsd: null,
    perSeat: false,
    audience: 'Gemini עם יותר שימוש, ואחסון בגוגל',
  },
  {
    id: 'gemini-pro',
    vendor: 'gemini',
    name: 'Google AI Pro',
    monthlyUsd: 19.99,
    annualPerMonthUsd: null,
    perSeat: false,
    audience: 'המסלול הנפוץ של Gemini, ואחסון בגוגל',
  },
  {
    id: 'gemini-ultra',
    vendor: 'gemini',
    name: 'Google AI Ultra',
    monthlyUsd: 99.99,
    annualPerMonthUsd: null,
    perSeat: false,
    audience: 'פי 5 שימוש מ-AI Pro',
  },
  {
    id: 'gemini-ultra-20',
    vendor: 'gemini',
    name: 'Google AI Ultra 20x',
    monthlyUsd: 199.99,
    annualPerMonthUsd: null,
    perSeat: false,
    audience: 'פי 20 שימוש מ-AI Pro',
  },
  {
    id: 'gemini-enterprise-business',
    vendor: 'gemini',
    name: 'Gemini Enterprise Business',
    monthlyUsd: 21,
    annualPerMonthUsd: null,
    perSeat: true,
    audience: 'לעסקים וצוותים עד 300 משתמשים',
  },
  {
    id: 'm365-premium',
    vendor: 'copilot',
    name: 'Microsoft 365 Premium',
    monthlyUsd: 19.99,
    annualPerMonthUsd: 16.67,
    perSeat: false,
    audience: 'Copilot באופיס למשתמש פרטי',
  },
  {
    id: 'copilot-business',
    vendor: 'copilot',
    name: 'Microsoft 365 Copilot Business',
    monthlyUsd: 25.2,
    annualPerMonthUsd: 21,
    perSeat: true,
    audience: 'תוספת למנוי Microsoft 365 לעסקים, למשתמש',
  },
  {
    id: 'perplexity-pro',
    vendor: 'perplexity',
    name: 'Perplexity Pro',
    monthlyUsd: 20,
    annualPerMonthUsd: 17,
    perSeat: false,
    audience: 'חיפוש עם מקורות, למשתמש יחיד',
  },
  {
    id: 'perplexity-max',
    vendor: 'perplexity',
    name: 'Perplexity Max',
    monthlyUsd: 200,
    annualPerMonthUsd: 167,
    perSeat: false,
    audience: 'המסלול האישי היקר של Perplexity',
  },
  {
    id: 'perplexity-enterprise-pro',
    vendor: 'perplexity',
    name: 'Perplexity Enterprise Pro',
    monthlyUsd: 40,
    annualPerMonthUsd: 33.33,
    perSeat: true,
    audience: 'לצוות, מחיר למשתמש',
  },
]

export const vendorOf = (id: VendorId) => vendors.find((vendor) => vendor.id === id) ?? vendors[0]

export const plansOf = (vendor: VendorId | 'all') =>
  vendor === 'all' ? plans : plans.filter((plan) => plan.vendor === vendor)

const roundAgorot = (value: number) => Math.round(value * 100) / 100

export function planCost(plan: AiPlan, billing: Billing, usdIls: number, seats: number): PlanCost {
  const annual = billing === 'annual' && plan.annualPerMonthUsd !== null
  const usdPerSeatMonth = annual ? (plan.annualPerMonthUsd as number) : plan.monthlyUsd
  const ilsPerSeatMonth = roundAgorot(usdPerSeatMonth * usdIls)
  const ilsPerSeatYear = roundAgorot(usdPerSeatMonth * 12 * usdIls)
  return {
    plan,
    billing,
    usdPerSeatMonth,
    ilsPerSeatMonth,
    ilsPerSeatYear,
    ilsTeamMonth: roundAgorot(usdPerSeatMonth * seats * usdIls),
    ilsTeamYear: roundAgorot(usdPerSeatMonth * 12 * seats * usdIls),
    ilsPerWorkday: roundAgorot((usdPerSeatMonth * usdIls) / WORKDAYS_PER_MONTH),
    annualFallback: billing === 'annual' && plan.annualPerMonthUsd === null,
  }
}

export const annualSavingPercent = (plan: AiPlan) =>
  plan.annualPerMonthUsd === null ? null : Math.round((1 - plan.annualPerMonthUsd / plan.monthlyUsd) * 100)

const usdFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})
const shekelFormat = new Intl.NumberFormat('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
const shekelCentsFormat = new Intl.NumberFormat('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const usdCentsFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })

export const formatPlanUsd = (usd: number) => (Number.isInteger(usd) ? usdFormat : usdCentsFormat).format(usd)

export const formatIls = (ils: number) => `${shekelFormat.format(ils)} ₪`

export const formatIlsExact = (ils: number) =>
  Number.isInteger(ils) ? `${shekelFormat.format(ils)} ₪` : `${shekelCentsFormat.format(ils)} ₪`

export const localPriceFor = (plan: AiPlan, billing: Billing) => {
  if (!plan.local) return null
  if (billing === 'annual' && plan.local.annualPerMonth !== null) return plan.local.annualPerMonth
  return plan.local.monthly
}

export type UsdIlsRate = { rate: number; date: string }

export async function loadUsdIls(signal: AbortSignal): Promise<UsdIlsRate | null> {
  const { start, end } = ratesWindow(israelNow().iso)
  const result = await fetchRates(proxyRatesUrl(start, end), signal)
  if (!result.ok) return null
  const observations = result.series.USD
  const last = observations?.[observations.length - 1]
  if (!last) return null
  return { rate: last.micros / 1_000_000 / last.unit, date: last.iso }
}

export function loadUsdIlsWithTimeout(onRate: (rate: UsdIlsRate) => void) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(TIMEOUT_REASON), REQUEST_TIMEOUT_MS)
  loadUsdIls(controller.signal)
    .then((rate) => {
      if (rate && !controller.signal.aborted) onRate(rate)
    })
    .finally(() => clearTimeout(timer))
  return () => {
    clearTimeout(timer)
    controller.abort()
  }
}
