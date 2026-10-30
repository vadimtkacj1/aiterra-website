import { noticeLength } from './notice-period'
import { DAY_RATE_AGOROT, daysForYear } from './recuperation-pay'
import { calculateSeverance } from './severance-pay'

const WORK_DAYS_IN_MONTH = 22
const NOTICE_DAYS_IN_MONTH = 30

export type SettlementInput = {
  start: string
  end: string
  salary: string
  dismissed: boolean
  section14: boolean
  noticeUnworked: boolean
  vacationDays: number
}

export type SettlementRow = { label: string; amount: number }

export function calculateSettlement(input: SettlementInput) {
  const outcome = calculateSeverance({
    start: input.start,
    end: input.end,
    salary: input.salary,
    section14: 'none',
  })
  if (outcome.kind !== 'result') return null
  const { salary, tenure, severance } = outcome

  const serviceYear = Math.ceil(tenure.months / 12)
  const monthsInLastYear = tenure.months % 12 || 12
  const recuperation =
    tenure.months >= 12 ? (daysForYear(serviceYear) * DAY_RATE_AGOROT * monthsInLastYear) / 1200 : 0

  const length = noticeLength('salaried', tenure.months + 1)
  const noticeShare = length.kind === 'month' ? 1 : length.hundredths / 100 / NOTICE_DAYS_IN_MONTH
  const notice = input.dismissed && input.noticeUnworked ? salary * noticeShare : 0

  const rows: SettlementRow[] = [
    { label: 'פיצויי פיטורים', amount: input.dismissed && !input.section14 ? severance : 0 },
    { label: 'פדיון ימי חופשה', amount: (salary / WORK_DAYS_IN_MONTH) * input.vacationDays },
    { label: 'דמי הבראה לשנה האחרונה', amount: recuperation },
    { label: 'חלף הודעה מוקדמת', amount: notice },
  ]
  return { rows, total: rows.reduce((sum, row) => sum + row.amount, 0), tenure }
}
