export type IncomeKind = 'salary' | 'business' | 'gift' | 'allowance'
export type SalaryBasis = 'net' | 'gross'
export type Rate = 'maaser' | 'chomesh'
export type Period = 'month' | 'year'

export type IncomeInput = {
  salary: number
  salaryBasis: SalaryBasis
  taxes: number
  business: number
  gifts: number
  allowances: number
  workExpenses: number
  deductTaxes: boolean
  deductWorkExpenses: boolean
}

export type Donation = { id: string; date: string; amount: number; note: string }

export const REVIEWED_LABEL = '28.10.2026'
export const LEDGER_STORAGE_KEY = 'aiterra-maaser-ledger-v1'

export const RATE_PERCENT: Record<Rate, number> = { maaser: 10, chomesh: 20 }

export const DONATION_TAX_CREDIT_PERCENT = 35
export const DONATION_MIN_ANNUAL_2026 = 207
export const DONATION_INCOME_CAP_PERCENT = 30

export const SOURCES = {
  penineiHalakha: {
    href: 'https://ph.yhb.org.il/08-06-10/',
    label: 'פניני הלכה, הלכות צדקה פרק ו, הלכה י: דרכי חישוב מעשר כספים (הרב אליעזר מלמד)',
    note: 'שכיר מפריש מהנטו, מנכה נסיעות לעבודה ולא אוכל בעבודה; חסכונות וקופות גמל; מידת חומש',
  },
  chabadQa: {
    href: 'https://www.chabad.org.il/Questions/PrintQuestion.asp?ArticleID=301&CategoryID=68',
    label: 'צעירי אגודת חב"ד, שאלות לרב: הוצאה מוכרת לצורך מעשר (הרב יוסף ש. גינזבורג)',
    note: 'מס הכנסה, ביטוח לאומי ומע"מ לא נכללים ברווח; קרן השתלמות וביטוחים לא מנוכים; הוצאות שנחוצות להשגת הרווח מנוכות',
  },
  machonHalacha: {
    href: 'https://machon-halacha.co.il/%D7%9B%D7%99%D7%A6%D7%93-%D7%9E%D7%97%D7%A9%D7%91%D7%99%D7%9D-%D7%9E%D7%A2%D7%A9%D7%A8-%D7%91%D7%A4%D7%95%D7%A2%D7%9C-%D7%91%D7%9E%D7%A6%D7%91%D7%99%D7%9D-%D7%A9%D7%95%D7%A0%D7%99%D7%9D/',
    label: 'מכון הלכה חב"ד: כיצד מחשבים מעשר בפועל במצבים שונים',
    note: 'נטו לשכיר, נסיעות, לימודים וציוד לעבודה, הוצאות עסקיות לעצמאי, קצבאות ביטוח לאומי',
  },
  taxCredit: {
    href: 'https://www.gov.il/he/pages/tax-credit-for-donations-to-individuals',
    label: 'רשות המסים: מדריך זיכוי ממס על תרומות ליחידים',
    note: 'זיכוי של 35% על תרומה למוסד מוכר לפי סעיף 46, מינימום 207 ₪ בשנה ב-2026, עד 30% מההכנסה החייבת',
  },
} as const

export const EMPTY_INCOME: IncomeInput = {
  salary: 0,
  salaryBasis: 'net',
  taxes: 0,
  business: 0,
  gifts: 0,
  allowances: 0,
  workExpenses: 0,
  deductTaxes: true,
  deductWorkExpenses: true,
}

export type MaaserResult = {
  salaryBase: number
  totalIncome: number
  deductions: number
  base: number
  percent: number
  owed: number
}

const clean = (value: number) => (Number.isFinite(value) && value > 0 ? value : 0)

export function calculateMaaser(input: IncomeInput, rate: Rate): MaaserResult {
  const salary = clean(input.salary)
  const taxDeduction = input.salaryBasis === 'gross' && input.deductTaxes ? Math.min(clean(input.taxes), salary) : 0
  const salaryBase = salary - taxDeduction
  const totalIncome = salaryBase + clean(input.business) + clean(input.gifts) + clean(input.allowances)
  const deductions = input.deductWorkExpenses ? Math.min(clean(input.workExpenses), totalIncome) : 0
  const base = totalIncome - deductions
  const percent = RATE_PERCENT[rate]
  const owed = Math.round((base * percent) / 100)
  return { salaryBase, totalIncome, deductions, base, percent, owed }
}

export function annualize(amount: number, period: Period) {
  return period === 'month' ? amount * 12 : amount
}

export function totalGiven(ledger: Donation[]) {
  return ledger.reduce((sum, item) => sum + clean(item.amount), 0)
}

export function taxCreditEstimate(annualDonations: number) {
  if (annualDonations < DONATION_MIN_ANNUAL_2026) return 0
  return Math.round((annualDonations * DONATION_TAX_CREDIT_PERCENT) / 100)
}

export function parseShekels(raw: string) {
  const normalized = raw.replace(/[,\s₪]/g, '').replace(/[٫،]/g, '.')
  if (!normalized) return 0
  if (!/^\d+(\.\d{0,2})?$/.test(normalized)) return Number.NaN
  const value = Number(normalized)
  return value > 1_000_000_000 ? Number.NaN : value
}

export function isDonation(value: unknown): value is Donation {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  return (
    typeof item.id === 'string' &&
    typeof item.date === 'string' &&
    typeof item.note === 'string' &&
    typeof item.amount === 'number' &&
    Number.isFinite(item.amount)
  )
}

export function formatShekels(value: number) {
  return `${Math.round(value).toLocaleString('he-IL')} ₪`
}
