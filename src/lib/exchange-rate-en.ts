import { MAX_RATE_DECIMALS, formatDots, unitText, type CurrencyCode } from './exchange-rate'

const MICROS = 1_000_000

export const currencyNamesEn: Record<CurrencyCode, string> = {
  USD: 'US dollar',
  EUR: 'Euro',
  GBP: 'Pound sterling',
  CHF: 'Swiss franc',
  JPY: 'Japanese yen',
  CAD: 'Canadian dollar',
  AUD: 'Australian dollar',
  SEK: 'Swedish krona',
  NOK: 'Norwegian krone',
  DKK: 'Danish krone',
  ZAR: 'South African rand',
  JOD: 'Jordanian dinar',
  EGP: 'Egyptian pound',
  LBP: 'Lebanese pound',
}

const shekelFormat = new Intl.NumberFormat('en-IL', {
  style: 'currency',
  currency: 'ILS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const moneyFormat = new Intl.NumberFormat('en-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const rateFormat = new Intl.NumberFormat('en-IL', {
  minimumFractionDigits: 4,
  maximumFractionDigits: MAX_RATE_DECIMALS,
  useGrouping: false,
})

export const enShekels = (agorot: number) => shekelFormat.format(agorot / 100)

export const enForeign = (hundredths: number, code: CurrencyCode) => `${moneyFormat.format(hundredths / 100)} ${code}`

export const enRate = (micros: number) => rateFormat.format(micros / MICROS)

export const enInvoiceLine = (micros: number, unit: number, code: CurrencyCode, iso: string) =>
  `At the Bank of Israel representative rate of ₪${enRate(micros)} per ${unitText(unit, code)} of ${formatDots(iso)}`
