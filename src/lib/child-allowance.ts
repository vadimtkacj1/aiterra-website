export const ALLOWANCE_YEAR = 2026
export const FIRST_CHILD = 173
export const MIDDLE_CHILD = 219
export const FIFTH_PLUS_CHILD = 173
export const SUPPLEMENT = 113
export const SAVINGS_DEPOSIT = 58
export const MAX_CHILDREN = 20

export type ChildAllowanceInput = { children: string; supplement: boolean; doubleSavings: boolean }

export type ChildLine = { position: number; allowance: number; supplement: number }

export type ChildAllowanceResult = {
  kind: 'result'
  children: number
  lines: ChildLine[]
  allowance: number
  supplement: number
  doubling: number
  paid: number
  savings: number
}

export type ChildAllowanceOutcome = ChildAllowanceResult | { kind: 'incomplete' | 'invalid'; message: string }

export const emptyChildAllowanceInput: ChildAllowanceInput = { children: '', supplement: false, doubleSavings: false }

export const allowanceFor = (position: number) => {
  if (position === 1) return FIRST_CHILD
  if (position <= 4) return MIDDLE_CHILD
  return FIFTH_PLUS_CHILD
}

export const supplementFor = (position: number) => (position === 3 || position === 4 ? SUPPLEMENT : 0)

export function computeAllowance(children: number, supplement: boolean, doubleSavings: boolean): ChildAllowanceResult {
  const lines = Array.from({ length: children }, (_, index) => ({
    position: index + 1,
    allowance: allowanceFor(index + 1),
    supplement: supplement ? supplementFor(index + 1) : 0,
  }))
  const allowance = lines.reduce((sum, line) => sum + line.allowance, 0)
  const extra = lines.reduce((sum, line) => sum + line.supplement, 0)
  const doubling = doubleSavings ? children * SAVINGS_DEPOSIT : 0
  return {
    kind: 'result',
    children,
    lines,
    allowance,
    supplement: extra,
    doubling,
    paid: allowance + extra - doubling,
    savings: children * SAVINGS_DEPOSIT + doubling,
  }
}

export function childrenError(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (!/^\d+$/.test(trimmed)) return 'הקלידו מספר שלם, למשל 3.'
  const count = Number(trimmed)
  if (count < 1 || count > MAX_CHILDREN) return `הקלידו מספר בין 1 ל-${MAX_CHILDREN}.`
  return ''
}

export function calculateChildAllowance(input: ChildAllowanceInput): ChildAllowanceOutcome {
  if (childrenError(input.children)) return { kind: 'invalid', message: 'כדי לראות את התוצאה, תקנו את מספר הילדים.' }
  if (!input.children.trim()) return { kind: 'incomplete', message: 'כדי לראות את התוצאה, הקלידו כמה ילדים מתחת לגיל 18 יש במשפחה.' }
  return computeAllowance(Number(input.children.trim()), input.supplement, input.doubleSavings)
}

const shekelFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 0 })

export const formatShekels = (amount: number) => `${shekelFormat.format(amount)} ₪`

const ordinals = ['', 'הראשון', 'השני', 'השלישי', 'הרביעי', 'החמישי', 'השישי', 'השביעי', 'השמיני', 'התשיעי', 'העשירי']

export const positionLabel = (position: number) =>
  position < ordinals.length ? `הילד ${ordinals[position]}` : `הילד ה-${position}`

export type AllowanceTableRow = { children: number; allowance: number; withSupplement: number; savings: number }

export const allowanceTable = (): AllowanceTableRow[] =>
  [1, 2, 3, 4, 5, 6, 7, 8].map((children) => {
    const base = computeAllowance(children, false, false)
    const plus = computeAllowance(children, true, false)
    return { children, allowance: base.allowance, withSupplement: plus.paid, savings: base.savings }
  })

export function resultToText(result: ChildAllowanceResult) {
  const lines = [`מחשבון קצבת ילדים ${ALLOWANCE_YEAR}`, `מספר ילדים מתחת לגיל 18: ${result.children}`]
  result.lines.forEach((line) => {
    const extra = line.supplement ? ` + תוספת ${formatShekels(line.supplement)}` : ''
    lines.push(`${positionLabel(line.position)}: ${formatShekels(line.allowance)}${extra}`)
  })
  if (result.doubling) lines.push(`הכפלת החיסכון מהקצבה: −${formatShekels(result.doubling)}`)
  lines.push(`משולם לחשבון הבנק בחודש: ${formatShekels(result.paid)}`)
  lines.push(`מופקד בחודש לחיסכון של הילדים: ${formatShekels(result.savings)}`)
  lines.push('לפי סכומי הביטוח הלאומי מ-1.1.2026.')
  lines.push('https://www.aiterra.co.il/tools/child-allowance-calculator-2026')
  return lines.join('\n')
}
