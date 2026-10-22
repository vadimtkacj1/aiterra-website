import {
  MONTHS_IN_YEAR,
  TAX_YEAR,
  calculateIncomeTax,
  calculateTax,
  formatBasisPoints,
  formatPoints,
  formatShekels,
} from './self-employed-tax'

export type DepositsInput = {
  incomeAgorot: number
  creditPointsHundredths: number
  hishtalmutDepositedAgorot: number
  pensionDepositedAgorot: number
}

export type HishtalmutResult = {
  qualifyingIncome: number
  deductible: number
  beneficialDeposit: number
  fundShare: number
  deposited: number
  remainingDeductible: number
  remainingBeneficial: number
  aboveBeneficial: number
  saving: number
}

export type MandatoryResult = {
  lowerIncome: number
  upperIncome: number
  lowerDeposit: number
  upperDeposit: number
  total: number
  remaining: number
}

export type PensionResult = {
  qualifyingIncome: number
  deduction: number
  creditBase: number
  credit: number
  fullDeposit: number
  deposited: number
  remaining: number
  saving: number
}

export type DepositsResult = {
  income: number
  taxable: number
  marginalRateBasisPoints: number
  creditPointsHundredths: number
  taxBefore: number
  taxAfter: number
  totalSaving: number
  remainingTotal: number
  hishtalmut: HishtalmutResult
  mandatory: MandatoryResult
  pension: PensionResult
}

export const HISHTALMUT_INCOME_CEILING = 293_397
export const HISHTALMUT_DEDUCTION_BASIS_POINTS = 450
export const HISHTALMUT_BENEFICIAL_DEPOSIT = 20_566
export const HISHTALMUT_FUND_SHARE_BASIS_POINTS = 700

export const AVERAGE_WAGE_MONTHLY = 13_769
export const MANDATORY_LOWER_BASIS_POINTS = 445
export const MANDATORY_UPPER_BASIS_POINTS = 1_255

export const PENSION_INCOME_CEILING_MONTHLY = 19_400
export const PENSION_DEDUCTION_BASIS_POINTS = 1_100
export const PENSION_CREDIT_BASE_BASIS_POINTS = 550
export const PENSION_CREDIT_BASE_WITH_DISABILITY_BASIS_POINTS = 500
export const PENSION_CREDIT_RATE_BASIS_POINTS = 3_500
export const BENEFICIARY_SHARE_BASIS_POINTS = 1_600

export const EARLY_RETIREMENT_AGE = 60
export const MANDATORY_MIN_AGE = 21

const FULL = 10_000

const applyRate = (amount: number, basisPoints: number) => Math.round((amount * basisPoints) / FULL)

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export const AVERAGE_WAGE_ANNUAL = AVERAGE_WAGE_MONTHLY * MONTHS_IN_YEAR
export const MANDATORY_LOWER_LIMIT = AVERAGE_WAGE_ANNUAL / 2
export const PENSION_INCOME_CEILING = PENSION_INCOME_CEILING_MONTHLY * MONTHS_IN_YEAR
export const BENEFICIARY_MIN_DEPOSIT = Math.floor((AVERAGE_WAGE_ANNUAL * BENEFICIARY_SHARE_BASIS_POINTS) / FULL)

export const HISHTALMUT_MAX_DEDUCTIBLE = applyRate(HISHTALMUT_INCOME_CEILING, HISHTALMUT_DEDUCTION_BASIS_POINTS)
export const PENSION_MAX_DEDUCTION = applyRate(PENSION_INCOME_CEILING, PENSION_DEDUCTION_BASIS_POINTS)
export const PENSION_MAX_CREDIT_BASE = applyRate(PENSION_INCOME_CEILING, PENSION_CREDIT_BASE_BASIS_POINTS)
export const PENSION_MAX_DEPOSIT = PENSION_MAX_DEDUCTION + PENSION_MAX_CREDIT_BASE
export const PENSION_MAX_CREDIT = applyRate(PENSION_MAX_CREDIT_BASE, PENSION_CREDIT_RATE_BASIS_POINTS)

export function mandatoryDeposit(income: number, deposited = 0): MandatoryResult {
  const lowerIncome = clamp(income, 0, MANDATORY_LOWER_LIMIT)
  const upperIncome = clamp(income - MANDATORY_LOWER_LIMIT, 0, AVERAGE_WAGE_ANNUAL - MANDATORY_LOWER_LIMIT)
  const lowerDeposit = applyRate(lowerIncome, MANDATORY_LOWER_BASIS_POINTS)
  const upperDeposit = applyRate(upperIncome, MANDATORY_UPPER_BASIS_POINTS)
  const total = lowerDeposit + upperDeposit
  return { lowerIncome, upperIncome, lowerDeposit, upperDeposit, total, remaining: Math.max(0, total - deposited) }
}

export const MANDATORY_MAX_DEPOSIT = mandatoryDeposit(AVERAGE_WAGE_ANNUAL).total

function hishtalmutLimits(income: number, deposited: number) {
  const qualifyingIncome = clamp(income, 0, HISHTALMUT_INCOME_CEILING)
  const deductible = applyRate(qualifyingIncome, HISHTALMUT_DEDUCTION_BASIS_POINTS)
  return {
    qualifyingIncome,
    deductible,
    beneficialDeposit: HISHTALMUT_BENEFICIAL_DEPOSIT,
    fundShare: Math.min(applyRate(qualifyingIncome, HISHTALMUT_FUND_SHARE_BASIS_POINTS), HISHTALMUT_BENEFICIAL_DEPOSIT),
    deposited,
    remainingDeductible: Math.max(0, deductible - deposited),
    remainingBeneficial: Math.max(0, HISHTALMUT_BENEFICIAL_DEPOSIT - deposited),
    aboveBeneficial: Math.max(0, deposited - HISHTALMUT_BENEFICIAL_DEPOSIT),
  }
}

function pensionLimits(income: number, deposited: number) {
  const qualifyingIncome = clamp(income, 0, PENSION_INCOME_CEILING)
  const deduction = applyRate(qualifyingIncome, PENSION_DEDUCTION_BASIS_POINTS)
  const creditBase = applyRate(qualifyingIncome, PENSION_CREDIT_BASE_BASIS_POINTS)
  const fullDeposit = deduction + creditBase
  return {
    qualifyingIncome,
    deduction,
    creditBase,
    credit: applyRate(creditBase, PENSION_CREDIT_RATE_BASIS_POINTS),
    fullDeposit,
    deposited,
    remaining: Math.max(0, fullDeposit - deposited),
  }
}

export function calculateDeposits({
  incomeAgorot,
  creditPointsHundredths,
  hishtalmutDepositedAgorot,
  pensionDepositedAgorot,
}: DepositsInput): DepositsResult {
  const income = Math.max(0, Math.round(incomeAgorot / 100))
  const hishtalmutDeposited = Math.max(0, Math.round(hishtalmutDepositedAgorot / 100))
  const pensionDeposited = Math.max(0, Math.round(pensionDepositedAgorot / 100))

  const base = calculateTax({
    revenueAgorot: income * 100,
    expensesAgorot: 0,
    creditPointsHundredths,
    months: MONTHS_IN_YEAR,
  })
  const taxable = base.incomeTax.taxable
  const taxAfterDeduction = (deduction: number) =>
    calculateIncomeTax(Math.max(0, taxable - deduction), creditPointsHundredths, MONTHS_IN_YEAR).net

  const hishtalmut = hishtalmutLimits(income, hishtalmutDeposited)
  const pension = pensionLimits(income, pensionDeposited)
  const mandatory = mandatoryDeposit(income, pensionDeposited)

  const taxBefore = base.incomeTax.net
  const taxAfterHishtalmut = taxAfterDeduction(hishtalmut.deductible)
  const taxAfter = Math.max(0, taxAfterDeduction(hishtalmut.deductible + pension.deduction) - pension.credit)

  return {
    income,
    taxable,
    marginalRateBasisPoints: base.marginalRateBasisPoints,
    creditPointsHundredths,
    taxBefore,
    taxAfter,
    totalSaving: taxBefore - taxAfter,
    remainingTotal: hishtalmut.remainingDeductible + pension.remaining,
    hishtalmut: { ...hishtalmut, saving: taxBefore - taxAfterHishtalmut },
    mandatory,
    pension: { ...pension, saving: taxAfterHishtalmut - taxAfter },
  }
}

export const depositsForIncome = (income: number, creditPointsHundredths: number) =>
  calculateDeposits({
    incomeAgorot: income * 100,
    creditPointsHundredths,
    hishtalmutDepositedAgorot: 0,
    pensionDepositedAgorot: 0,
  })

export const savingPerHundred = (saving: number, deposit: number) =>
  deposit > 0 ? Math.round((saving * 100) / deposit) : 0

export function resultToText(result: DepositsResult) {
  const { hishtalmut, pension, mandatory } = result
  const lines = [
    `מחשבון קרן השתלמות ופנסיה לעצמאי ${TAX_YEAR}, הערכה בלבד`,
    `הכנסה חייבת מהעסק לשנה: ${formatShekels(result.income)}`,
    `נקודות זיכוי: ${formatPoints(result.creditPointsHundredths)}`,
    `מדרגת המס השולית: ${formatBasisPoints(result.marginalRateBasisPoints)}`,
    '',
    'קרן השתלמות',
    `הפקדה שמוכרת בניכוי (4.5%): ${formatShekels(hishtalmut.deductible)}`,
    `הפקדה מוטבת, פטורה ממס רווחי הון: עד ${formatShekels(hishtalmut.beneficialDeposit)}`,
    `כבר הופקד: ${formatShekels(hishtalmut.deposited)}`,
    `נשאר להפקיד עד 31.12 לניכוי המלא: ${formatShekels(hishtalmut.remainingDeductible)}`,
    `חיסכון משוער במס הכנסה: ${formatShekels(hishtalmut.saving)}`,
    '',
    'פנסיה',
    `הפקדת חובה לפי החוק: ${formatShekels(mandatory.total)}`,
    `הפקדה שמנצלת את מלוא הטבת המס (16.5%): ${formatShekels(pension.fullDeposit)}`,
    `כבר הופקד: ${formatShekels(pension.deposited)}`,
    `נשאר להפקיד עד 31.12 לחובה: ${formatShekels(mandatory.remaining)}`,
    `נשאר להפקיד עד 31.12 להטבה המלאה: ${formatShekels(pension.remaining)}`,
    `חיסכון משוער במס הכנסה: ${formatShekels(pension.saving)}`,
    '',
    `סך החיסכון המשוער במס הכנסה: ${formatShekels(result.totalSaving)}`,
  ]
  return lines.join('\n')
}
