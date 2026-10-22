export type PercentMode =
  | 'percent-of'
  | 'what-percent'
  | 'percent-change'
  | 'add-subtract'
  | 'after-discount'
  | 'before-discount'
  | 'margin-markup'

export type FieldKey = 'a' | 'b' | 'c'
export type FieldKind = 'number' | 'money' | 'percent'
export type Direction = 'add' | 'subtract'
export type PricingBasis = 'markup' | 'margin' | 'price'

export type ModeSpec = { id: PercentMode; label: string; hint: string; question: string }

export type FieldSpec = {
  key: FieldKey
  label: string
  kind: FieldKind
  hint?: string
  optional?: boolean
  max?: number
}

export type ModeInput = { values: Record<FieldKey, string>; direction: Direction; basis: PricingBasis }

export type ParsedNumber =
  | { ok: true; value: number }
  | { ok: false; reason: 'empty' | 'invalid' | 'negative' | 'too-large' }

export type Segment = { text: string; strong?: boolean }
export type Detail = { label: string; value: string }
export type FormulaLine = { label: string; expression: string }
export type MarginMarkup = { margin: string; markup: string }

export type CalcResult = {
  kind: 'result'
  sentence: Segment[]
  answer: number
  details: Detail[]
  formula: FormulaLine[]
  note?: string
  compare?: MarginMarkup
}

export type CalcOutcome =
  | CalcResult
  | { kind: 'incomplete' }
  | { kind: 'invalid' }
  | { kind: 'impossible'; message: string }

export const DEFAULT_MODE: PercentMode = 'percent-of'

export const modes: ModeSpec[] = [
  { id: 'percent-of', label: 'אחוז ממספר', hint: 'כמה זה 15% מ-240', question: 'כמה זה אחוז ממספר?' },
  {
    id: 'what-percent',
    label: 'כמה אחוזים זה',
    hint: '36 מ-240 באחוזים',
    question: 'כמה אחוזים זה מתוך הסך הכול?',
  },
  {
    id: 'percent-change',
    label: 'שינוי באחוזים',
    hint: 'עלייה או ירידה',
    question: 'בכמה אחוזים זה עלה או ירד?',
  },
  {
    id: 'after-discount',
    label: 'מחיר אחרי הנחה',
    hint: 'כמה משלמים בפועל',
    question: 'כמה משלמים אחרי ההנחה?',
  },
  {
    id: 'before-discount',
    label: 'מחיר לפני הנחה',
    hint: 'מה היה המחיר המקורי',
    question: 'מה היה המחיר לפני ההנחה?',
  },
  {
    id: 'margin-markup',
    label: 'רווח ותמחור',
    hint: 'מרווח רווח ותוספת על העלות',
    question: 'כמה לגבות ומה הרווח?',
  },
  {
    id: 'add-subtract',
    label: 'הוספת או הורדת אחוזים',
    hint: '240 ועוד 15%, או פחות',
    question: 'מספר ועוד אחוז, או פחות אחוז',
  },
]

export const directionOptions: { value: Direction; label: string }[] = [
  { value: 'add', label: 'מוסיפים אחוזים' },
  { value: 'subtract', label: 'מורידים אחוזים' },
]

export const basisOptions: { value: PricingBasis; label: string }[] = [
  { value: 'markup', label: 'תוספת על העלות' },
  { value: 'margin', label: 'מרווח רווח' },
  { value: 'price', label: 'מחיר מכירה ידוע' },
]

const modeInput = (a: string, b: string, c = ''): ModeInput => ({
  values: { a, b, c },
  direction: 'add',
  basis: 'markup',
})

export const defaultInputs: Record<PercentMode, ModeInput> = {
  'percent-of': modeInput('15', '240'),
  'what-percent': modeInput('36', '240'),
  'percent-change': modeInput('200', '250'),
  'add-subtract': modeInput('240', '15'),
  'after-discount': modeInput('250', '20'),
  'before-discount': modeInput('200', '20'),
  'margin-markup': modeInput('100', '25', '125'),
}

export const isPercentMode = (value: string): value is PercentMode => modes.some((mode) => mode.id === value)

export const modeFromHash = (hash: string): PercentMode | null => {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  return isPercentMode(id) ? id : null
}

export const modeSpec = (mode: PercentMode) => modes.find((item) => item.id === mode) ?? modes[0]

export function fieldsFor(mode: PercentMode, input: ModeInput): FieldSpec[] {
  switch (mode) {
    case 'percent-of':
      return [
        { key: 'a', label: 'האחוז', kind: 'percent' },
        { key: 'b', label: 'מתוך המספר', kind: 'number' },
      ]
    case 'what-percent':
      return [
        { key: 'a', label: 'החלק', kind: 'number' },
        { key: 'b', label: 'מתוך הסך הכול', kind: 'number' },
      ]
    case 'percent-change':
      return [
        { key: 'a', label: 'ערך קודם', kind: 'number' },
        { key: 'b', label: 'ערך חדש', kind: 'number' },
      ]
    case 'add-subtract':
      return [
        { key: 'a', label: 'המספר', kind: 'number' },
        { key: 'b', label: 'האחוז', kind: 'percent' },
      ]
    case 'after-discount':
      return [
        { key: 'a', label: 'מחיר לפני הנחה', kind: 'money' },
        { key: 'b', label: 'הנחה', kind: 'percent', max: 100 },
        {
          key: 'c',
          label: 'הנחה נוספת',
          kind: 'percent',
          max: 100,
          optional: true,
          hint: 'לא חובה. הנחה שנייה, על המחיר שכבר ירד.',
        },
      ]
    case 'before-discount':
      return [
        { key: 'a', label: 'מחיר אחרי הנחה', kind: 'money' },
        { key: 'b', label: 'ההנחה שקיבלתם', kind: 'percent', max: 100 },
      ]
    case 'margin-markup': {
      const cost: FieldSpec = { key: 'a', label: 'עלות לפני מע״מ', kind: 'money' }
      if (input.basis === 'price') return [cost, { key: 'c', label: 'מחיר מכירה לפני מע״מ', kind: 'money' }]
      const label = input.basis === 'margin' ? 'מרווח רווח רצוי' : 'תוספת רצויה'
      return [cost, { key: 'b', label, kind: 'percent' }]
    }
  }
}

const MAX_VALUE = 1_000_000_000_000

const stripDecoration = (input: string) =>
  input.replace(/[\s\p{Cf}₪%]/gu, '').replace(/ש["״']?ח/g, '')

const toPlainDecimal = (value: string): string | null => {
  const lastDot = value.lastIndexOf('.')
  const lastComma = value.lastIndexOf(',')
  const commaCount = value.split(',').length - 1
  const dotCount = value.split('.').length - 1

  if (lastDot >= 0 && lastComma >= 0) {
    const decimalSeparator = lastDot > lastComma ? '.' : ','
    const groupSeparator = decimalSeparator === '.' ? ',' : '.'
    const decimalCount = decimalSeparator === '.' ? dotCount : commaCount
    if (decimalCount > 1) return null
    return value.split(groupSeparator).join('').replace(decimalSeparator, '.')
  }
  const groupedThousands = value.length - lastComma - 1 === 3 && /[1-9]/.test(value.slice(0, lastComma))
  if (commaCount === 1 && !groupedThousands) return value.replace(',', '.')
  if (commaCount > 0) return value.split(',').join('')
  if (dotCount > 1) return value.split('.').join('')
  return value
}

export function parseNumber(input: string): ParsedNumber {
  const cleaned = stripDecoration(input)
  if (!cleaned) return { ok: false, reason: 'empty' }
  if (/^[-‐-―−]/.test(cleaned)) return { ok: false, reason: 'negative' }
  if (!/^[\d.,]+$/.test(cleaned) || !/\d/.test(cleaned)) return { ok: false, reason: 'invalid' }

  const plain = toPlainDecimal(cleaned)
  if (!plain || !/^\d*(\.\d*)?$/.test(plain)) return { ok: false, reason: 'invalid' }
  const value = Number(plain)
  if (!Number.isFinite(value)) return { ok: false, reason: 'invalid' }
  if (value > MAX_VALUE) return { ok: false, reason: 'too-large' }
  return { ok: true, value }
}

export function fieldError(field: FieldSpec, raw: string): string {
  const parsed = parseNumber(raw)
  if (parsed.ok) {
    if (field.max !== undefined && parsed.value > field.max) return `אפשר להקליד עד ${field.max}%.`
    return ''
  }
  if (parsed.reason === 'empty') return ''
  if (parsed.reason === 'negative') return 'המחשבון עובד עם מספרים חיוביים בלבד.'
  if (parsed.reason === 'too-large') return 'המספר גדול מדי לחישוב.'
  return 'הקלידו מספר, למשל 240 או 12.5.'
}

export const round = (value: number, digits = 2) => {
  const factor = 10 ** digits
  const shifted = Number((Math.abs(value) * factor).toPrecision(15))
  return (Math.sign(value) * Math.round(shifted)) / factor || 0
}

const numberFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 2 })
const moneyFormat = new Intl.NumberFormat('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const inputFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 6 })
const factorFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 6, useGrouping: false })

export const formatNumber = (value: number) => numberFormat.format(round(value))

export const formatPercent = (value: number) => `${formatNumber(value)}%`

export const formatMoney = (value: number) => {
  const rounded = round(value)
  const amount = Number.isInteger(rounded) ? numberFormat.format(rounded) : moneyFormat.format(rounded)
  return `${amount} ₪`
}

const typed = (value: number) => inputFormat.format(value)

const typedPercent = (value: number) => `${typed(value)}%`

const typedMoney = (value: number) => (round(value) === value ? formatMoney(value) : `${typed(value)} ₪`)

const formatFactor = (value: number) => factorFormat.format(round(value, 6))

export const plainNumber = (value: number) => String(round(value))

export const segmentsToText = (segments: Segment[]) => segments.map((segment) => segment.text).join('')

const percentOf = (n: number, p: number): CalcResult => {
  const value = (n * p) / 100
  return {
    kind: 'result',
    sentence: [{ text: `${typedPercent(p)} מתוך ${typed(n)} הם ` }, { text: formatNumber(value), strong: true }],
    answer: value,
    details: [],
    formula: [{ label: 'החישוב', expression: `${typed(n)} × ${typed(p)} ÷ 100 = ${formatNumber(value)}` }],
  }
}

const whatPercent = (part: number, whole: number): CalcOutcome => {
  if (whole === 0) {
    return { kind: 'impossible', message: 'אי אפשר לחשב אחוז מתוך 0. הסך הכול צריך להיות גדול מ-0.' }
  }
  const value = (part / whole) * 100
  return {
    kind: 'result',
    sentence: [
      { text: `${typed(part)} הם ` },
      { text: formatPercent(value), strong: true },
      { text: ` מתוך ${typed(whole)}` },
    ],
    answer: value,
    details: [],
    formula: [{ label: 'החישוב', expression: `${typed(part)} ÷ ${typed(whole)} × 100 = ${formatPercent(value)}` }],
  }
}

const changeWord = (change: number) => (change > 0 ? 'עלייה' : 'ירידה')

const percentChange = (from: number, to: number): CalcOutcome => {
  const difference = to - from
  if (from === 0) {
    const gap = difference === 0 ? '' : ` ההפרש הוא ${formatNumber(Math.abs(difference))}.`
    return {
      kind: 'impossible',
      message: `כשהערך הקודם הוא 0 אי אפשר לחשב שינוי באחוזים, כי אין בסיס להשוואה.${gap}`,
    }
  }
  const change = (difference / from) * 100
  const route = `מ-${typed(from)} ל-${typed(to)}`
  const sentence: Segment[] =
    difference === 0
      ? [{ text: `${route}: ` }, { text: 'אין שינוי', strong: true }]
      : [{ text: `${route} זו ` }, { text: `${changeWord(change)} של ${formatPercent(Math.abs(change))}`, strong: true }]
  const reverse = to === 0 ? 0 : ((from - to) / to) * 100
  const note =
    difference !== 0 && to !== 0
      ? `בכיוון ההפוך, מ-${typed(to)} ל-${typed(from)}, זו ${changeWord(reverse)} של ${formatPercent(Math.abs(reverse))}.`
      : undefined
  return {
    kind: 'result',
    sentence,
    answer: change,
    details: difference === 0 ? [] : [{ label: 'ההפרש', value: formatNumber(Math.abs(difference)) }],
    formula: [
      {
        label: 'החישוב',
        expression: `(${typed(to)} − ${typed(from)}) ÷ ${typed(from)} × 100 = ${formatPercent(change)}`,
      },
    ],
    note,
  }
}

const returnNote = (n: number, p: number, value: number, add: boolean) => {
  if (p <= 0 || n <= 0 || (!add && p >= 100)) return undefined
  const back = add ? (p / (100 + p)) * 100 : (p / (100 - p)) * 100
  const verb = add ? 'להוריד' : 'להוסיף'
  return `כדי לחזור מ-${formatNumber(value)} ל-${typed(n)} צריך ${verb} ${formatPercent(back)}, לא ${typedPercent(p)}.`
}

const addSubtract = (n: number, p: number, direction: Direction): CalcResult => {
  const add = direction === 'add'
  const factor = add ? 100 + p : 100 - p
  const value = (n * factor) / 100
  return {
    kind: 'result',
    sentence: [
      { text: `${typed(n)} ${add ? 'ועוד' : 'פחות'} ${typedPercent(p)} הם ` },
      { text: formatNumber(value), strong: true },
    ],
    answer: value,
    details: [{ label: add ? 'התוספת' : 'ההפחתה', value: formatNumber((n * p) / 100) }],
    formula: [{ label: 'החישוב', expression: `${typed(n)} × ${formatFactor(factor / 100)} = ${formatNumber(value)}` }],
    note: returnNote(n, p, value, add),
  }
}

const afterDiscount = (price: number, first: number, second: number | null): CalcResult => {
  const keepFirst = 100 - first
  const keepSecond = second === null ? 100 : 100 - second
  const final = (price * keepFirst * keepSecond) / 10_000
  const total = 100 - (keepFirst * keepSecond) / 100
  const discounts = second === null ? typedPercent(first) : `${typedPercent(first)} ועוד ${typedPercent(second)}`
  const factors =
    second === null
      ? formatFactor(keepFirst / 100)
      : `${formatFactor(keepFirst / 100)} × ${formatFactor(keepSecond / 100)}`
  const details: Detail[] = [{ label: 'חוסכים', value: formatMoney(price - final) }]
  if (second !== null) details.push({ label: 'ההנחה הכוללת', value: formatPercent(total) })
  const note =
    second !== null && first > 0 && second > 0
      ? `שתי ההנחות יחד הן ${formatPercent(total)} ולא ${formatPercent(first + second)}, כי ההנחה השנייה מחושבת מהמחיר שכבר ירד.`
      : undefined
  return {
    kind: 'result',
    sentence: [
      { text: `מחיר של ${typedMoney(price)} בהנחה של ${discounts} יורד ל-` },
      { text: formatMoney(final), strong: true },
    ],
    answer: final,
    details,
    formula: [{ label: 'החישוב', expression: `${typed(price)} × ${factors} = ${formatNumber(final)}` }],
    note,
  }
}

const beforeDiscount = (final: number, discount: number): CalcOutcome => {
  if (discount >= 100) {
    return {
      kind: 'impossible',
      message: 'בהנחה של 100% המחיר הסופי הוא 0, ולכן אי אפשר לדעת ממנו מה היה המחיר המקורי.',
    }
  }
  const original = (final * 100) / (100 - discount)
  const naive = (final * (100 + discount)) / 100
  return {
    kind: 'result',
    sentence: [
      { text: `מחיר של ${typedMoney(final)} אחרי הנחה של ${typedPercent(discount)} היה ` },
      { text: formatMoney(original), strong: true },
      { text: ' לפני ההנחה' },
    ],
    answer: original,
    details: [{ label: 'סכום ההנחה', value: formatMoney(original - final) }],
    formula: [
      {
        label: 'החישוב',
        expression: `${typed(final)} ÷ ${formatFactor((100 - discount) / 100)} = ${formatNumber(original)}`,
      },
    ],
    note:
      discount > 0 && final > 0
        ? `שימו לב: ${typedMoney(final)} ועוד ${typedPercent(discount)} הם רק ${formatMoney(naive)}, כי ההנחה חושבה מהמחיר המקורי ולא מהמחיר הסופי.`
        : undefined,
  }
}

const pricingNote = (cost: number, basis: 'markup' | 'margin', percent: number) => {
  if (percent <= 0) return undefined
  if (basis === 'margin') {
    return `תוספת של ${typedPercent(percent)} על העלות הייתה מביאה למחיר של ${formatMoney((cost * (100 + percent)) / 100)} בלבד.`
  }
  if (percent >= 100) return undefined
  return `למרווח רווח של ${typedPercent(percent)} המחיר צריך להיות ${formatMoney((cost * 100) / (100 - percent))}.`
}

const sellingPrice = (cost: number, basis: PricingBasis, percent: number, knownPrice: number) => {
  if (basis === 'markup') return (cost * (100 + percent)) / 100
  if (basis === 'margin') return (cost * 100) / (100 - percent)
  return knownPrice
}

const marginMarkup = (cost: number, basis: PricingBasis, percent: number, knownPrice: number): CalcOutcome => {
  if (cost === 0) {
    return { kind: 'impossible', message: 'כשהעלות היא 0 אין ממה לחשב אחוזי רווח. הקלידו עלות גדולה מ-0.' }
  }
  if (basis === 'margin' && percent >= 100) {
    return {
      kind: 'impossible',
      message: 'מרווח רווח הוא חלק ממחיר המכירה, ולכן הוא תמיד קטן מ-100%. הקלידו מרווח קטן מ-100%.',
    }
  }
  if (basis === 'price' && knownPrice === 0) {
    return { kind: 'impossible', message: 'הקלידו מחיר מכירה גדול מ-0 כדי לחשב את הרווח.' }
  }

  const price = sellingPrice(cost, basis, percent, knownPrice)
  const profit = price - cost
  const margin = (profit / price) * 100
  const markup = (profit / cost) * 100
  const compare = { margin: formatPercent(margin), markup: formatPercent(markup) }

  if (basis === 'price') {
    const gap = `(${typed(price)} − ${typed(cost)})`
    return {
      kind: 'result',
      sentence: [
        {
          text: `בעלות של ${typedMoney(cost)} ומחיר מכירה של ${typedMoney(price)}, ${profit < 0 ? 'ההפסד' : 'הרווח'} הוא `,
        },
        { text: formatMoney(Math.abs(profit)), strong: true },
      ],
      answer: profit,
      details: [],
      formula: [
        { label: 'מרווח', expression: `${gap} ÷ ${typed(price)} × 100 = ${compare.margin}` },
        { label: 'תוספת', expression: `${gap} ÷ ${typed(cost)} × 100 = ${compare.markup}` },
      ],
      compare,
    }
  }

  const isMarkup = basis === 'markup'
  const priceExpression = isMarkup
    ? `${typed(cost)} × ${formatFactor((100 + percent) / 100)} = ${formatNumber(price)}`
    : `${typed(cost)} ÷ ${formatFactor((100 - percent) / 100)} = ${formatNumber(price)}`
  const otherLine: FormulaLine = isMarkup
    ? { label: 'מרווח', expression: `${formatNumber(profit)} ÷ ${formatNumber(price)} × 100 = ${compare.margin}` }
    : { label: 'תוספת', expression: `${formatNumber(profit)} ÷ ${typed(cost)} × 100 = ${compare.markup}` }
  return {
    kind: 'result',
    sentence: [
      {
        text: `בעלות של ${typedMoney(cost)} ו${isMarkup ? 'תוספת' : 'מרווח רווח'} של ${typedPercent(percent)}, מחיר המכירה הוא `,
      },
      { text: formatMoney(price), strong: true },
    ],
    answer: price,
    details: [{ label: 'הרווח על כל יחידה', value: formatMoney(profit) }],
    formula: [{ label: 'מחיר המכירה', expression: priceExpression }, otherLine],
    note: pricingNote(cost, basis, percent),
    compare,
  }
}

export function calculate(mode: PercentMode, input: ModeInput): CalcOutcome {
  const fields = fieldsFor(mode, input)
  const values: Partial<Record<FieldKey, number>> = {}
  let incomplete = false

  for (const field of fields) {
    const raw = input.values[field.key]
    if (fieldError(field, raw)) return { kind: 'invalid' }
    const parsed = parseNumber(raw)
    if (parsed.ok) values[field.key] = parsed.value
    else if (!field.optional) incomplete = true
  }
  if (incomplete) return { kind: 'incomplete' }

  const a = values.a ?? 0
  const b = values.b ?? 0
  const c = values.c ?? 0

  switch (mode) {
    case 'percent-of':
      return percentOf(b, a)
    case 'what-percent':
      return whatPercent(a, b)
    case 'percent-change':
      return percentChange(a, b)
    case 'add-subtract':
      return addSubtract(a, b, input.direction)
    case 'after-discount':
      return afterDiscount(a, b, values.c ?? null)
    case 'before-discount':
      return beforeDiscount(a, b)
    case 'margin-markup':
      return marginMarkup(a, input.basis, b, c)
  }
}

export function resultToText(result: CalcResult): string {
  const lines = [segmentsToText(result.sentence)]
  if (result.compare) {
    lines.push(`מרווח רווח: ${result.compare.margin}`, `תוספת על העלות: ${result.compare.markup}`)
  }
  for (const detail of result.details) lines.push(`${detail.label}: ${detail.value}`)
  if (result.note) lines.push(result.note)
  return lines.join('\n')
}
