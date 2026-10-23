export type Operation = 'add' | 'sub' | 'mul' | 'div' | 'simplify'

export type Fraction = { n: number; d: number }

export type OperandInput = { whole: string; numerator: string; denominator: string }

export type Operand =
  | { kind: 'empty' }
  | { kind: 'error'; message: string }
  | { kind: 'ok'; value: Fraction; label: string; mixed: boolean }

export type Step = { text: string; math?: string }

export type Calculation =
  | { kind: 'error'; message: string }
  | { kind: 'ok'; result: Fraction; steps: Step[] }

export const FRACTIONS_REVIEWED = '2026-10-23'

export const operations: { value: Operation; label: string; symbol: string }[] = [
  { value: 'add', label: 'חיבור', symbol: '+' },
  { value: 'sub', label: 'חיסור', symbol: '−' },
  { value: 'mul', label: 'כפל', symbol: '×' },
  { value: 'div', label: 'חילוק', symbol: '÷' },
  { value: 'simplify', label: 'צמצום שבר', symbol: '' },
]

export const gcd = (a: number, b: number): number => {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y !== 0) {
    const rest = x % y
    x = y
    y = rest
  }
  return x
}

export const lcm = (a: number, b: number): number => (a / gcd(a, b)) * b

export const simplify = (fraction: Fraction): Fraction => {
  if (fraction.n === 0) return { n: 0, d: 1 }
  const divisor = gcd(fraction.n, fraction.d)
  return { n: fraction.n / divisor, d: fraction.d / divisor }
}

export const formatFraction = (fraction: Fraction): string =>
  fraction.d === 1 ? String(fraction.n) : `${fraction.n}/${fraction.d}`

export const toMixed = (fraction: Fraction): { sign: string; whole: number; n: number; d: number } | null => {
  const abs = Math.abs(fraction.n)
  if (fraction.d === 1 || abs < fraction.d) return null
  return {
    sign: fraction.n < 0 ? '-' : '',
    whole: Math.floor(abs / fraction.d),
    n: abs % fraction.d,
    d: fraction.d,
  }
}

export const formatMixed = (fraction: Fraction): string | null => {
  const mixed = toMixed(fraction)
  if (!mixed) return null
  return mixed.n === 0 ? `${mixed.sign}${mixed.whole}` : `${mixed.sign}${mixed.whole} ${mixed.n}/${mixed.d}`
}

const terminates = (denominator: number): boolean => {
  let rest = denominator
  while (rest % 2 === 0) rest /= 2
  while (rest % 5 === 0) rest /= 5
  return rest === 1
}

export const toDecimal = (fraction: Fraction): { text: string; exact: boolean } => {
  const value = fraction.n / fraction.d
  const exact = terminates(fraction.d)
  const text = exact ? String(value) : value.toFixed(6).replace(/0+$/, '')
  return { text, exact }
}

export const parseOperand = (input: OperandInput): Operand => {
  const whole = input.whole.trim()
  const numerator = input.numerator.trim()
  const denominator = input.denominator.trim()
  if (!whole && !numerator && !denominator) return { kind: 'empty' }
  if (whole && !/^-?\d{1,4}$/.test(whole)) return { kind: 'error', message: 'המספר השלם הוא מספר שלם עד 4 ספרות.' }
  if (!numerator && !denominator) {
    return { kind: 'ok', value: { n: Number(whole), d: 1 }, label: String(Number(whole)), mixed: false }
  }
  if (!numerator) return { kind: 'error', message: 'הקלידו מונה.' }
  if (!denominator) return { kind: 'error', message: 'הקלידו מכנה.' }
  if (!/^-?\d{1,4}$/.test(numerator)) return { kind: 'error', message: 'המונה הוא מספר שלם עד 4 ספרות.' }
  if (!/^\d{1,4}$/.test(denominator)) return { kind: 'error', message: 'המכנה הוא מספר שלם חיובי עד 4 ספרות.' }
  const d = Number(denominator)
  if (d === 0) return { kind: 'error', message: 'המכנה לא יכול להיות אפס.' }
  if (!whole) {
    const n = Number(numerator)
    return { kind: 'ok', value: { n, d }, label: `${n}/${d}`, mixed: false }
  }
  if (numerator.startsWith('-')) {
    return { kind: 'error', message: 'במספר מעורב כותבים מינוס רק ליד המספר השלם.' }
  }
  const w = Number(whole)
  const negative = whole.startsWith('-')
  const magnitude = Math.abs(w) * d + Number(numerator)
  return {
    kind: 'ok',
    value: { n: negative ? -magnitude : magnitude, d },
    label: `${w} ${Number(numerator)}/${d}`,
    mixed: true,
  }
}

const improperStep = (operand: Extract<Operand, { kind: 'ok' }>, name: string): Step | null => {
  if (!operand.mixed) return null
  const [wholeText, rest] = operand.label.split(' ')
  const [num, den] = rest.split('/')
  const sign = wholeText.startsWith('-') ? '-' : ''
  const absWhole = Math.abs(Number(wholeText))
  return {
    text: `ממירים את ${name} ממספר מעורב לשבר שהמונה שלו גדול מהמכנה.`,
    math: `${operand.label} = ${sign}(${absWhole} × ${den} + ${num}) / ${den} = ${formatFraction(operand.value)}`,
  }
}

const finishSteps = (raw: Fraction, steps: Step[]): Fraction => {
  const result = simplify(raw)
  const divisor = raw.n === 0 ? 1 : gcd(raw.n, raw.d)
  if (raw.n === 0) {
    steps.push({ text: 'המונה הוא אפס, ולכן התוצאה היא 0.', math: '0' })
  } else if (divisor > 1) {
    steps.push({
      text: `מצמצמים: הגורם המשותף הגדול ביותר של ${Math.abs(raw.n)} ו-${raw.d} הוא ${divisor}, ומחלקים בו את המונה ואת המכנה.`,
      math: `${formatFraction(raw)} = ${formatFraction(result)}`,
    })
  } else if (raw.d !== 1) {
    steps.push({ text: `אי אפשר לצמצם עוד: הגורם המשותף הגדול ביותר של ${Math.abs(raw.n)} ו-${raw.d} הוא 1.` })
  }
  const mixed = formatMixed(result)
  if (mixed) {
    steps.push({
      text: 'כשהמונה גדול מהמכנה אפשר לכתוב גם כמספר מעורב: מחלקים את המונה במכנה, המנה היא השלם והשארית היא המונה החדש.',
      math: `${formatFraction(result)} = ${mixed}`,
    })
  }
  return result
}

export const calculate = (operation: Operation, first: Operand, second: Operand): Calculation => {
  if (first.kind !== 'ok') return { kind: 'error', message: 'הקלידו את השבר הראשון.' }
  if (operation !== 'simplify' && second.kind !== 'ok') return { kind: 'error', message: 'הקלידו את השבר השני.' }
  const a = first.value
  const steps: Step[] = []
  const firstStep = improperStep(first, 'המספר הראשון')
  if (firstStep) steps.push(firstStep)

  if (operation === 'simplify') {
    if (steps.length === 0 && a.d === 1) {
      return { kind: 'ok', result: a, steps: [{ text: 'זה מספר שלם, ואין מה לצמצם.' }] }
    }
    return { kind: 'ok', result: finishSteps(a, steps), steps }
  }

  if (second.kind !== 'ok') return { kind: 'error', message: 'הקלידו את השבר השני.' }
  const b = second.value
  const secondStep = improperStep(second, 'המספר השני')
  if (secondStep) steps.push(secondStep)

  if (operation === 'add' || operation === 'sub') {
    const common = lcm(a.d, b.d)
    const left = a.n * (common / a.d)
    const right = b.n * (common / b.d)
    const symbol = operation === 'add' ? '+' : '−'
    steps.push({
      text:
        a.d === b.d
          ? 'המכנים שווים, ואפשר לחבר ישירות את המונים.'
          : `מוצאים מכנה משותף: המכפלה המשותפת הקטנה ביותר של ${a.d} ו-${b.d} היא ${common}.`,
    })
    if (a.d !== b.d) {
      steps.push({
        text: 'מרחיבים כל שבר כך שהמכנה יהיה המכנה המשותף, ומכפילים את המונה באותו מספר.',
        math: `${formatFraction(a)} = ${left}/${common},  ${formatFraction(b)} = ${right}/${common}`,
      })
    }
    const total = operation === 'add' ? left + right : left - right
    steps.push({
      text: operation === 'add' ? 'מחברים את המונים ומשאירים את המכנה.' : 'מחסרים את המונים ומשאירים את המכנה.',
      math: `${left}/${common} ${symbol} ${right}/${common} = ${total}/${common}`,
    })
    return { kind: 'ok', result: finishSteps({ n: total, d: common }, steps), steps }
  }

  if (operation === 'mul') {
    const raw = { n: a.n * b.n, d: a.d * b.d }
    steps.push({
      text: 'בכפל מכפילים מונה במונה ומכנה במכנה.',
      math: `${formatFraction(a)} × ${formatFraction(b)} = (${a.n} × ${b.n}) / (${a.d} × ${b.d}) = ${raw.n}/${raw.d}`,
    })
    return { kind: 'ok', result: finishSteps(raw, steps), steps }
  }

  if (b.n === 0) return { kind: 'error', message: 'אי אפשר לחלק באפס.' }
  const flipped = b.n < 0 ? { n: -b.d, d: -b.n } : { n: b.d, d: b.n }
  steps.push({
    text: 'בחילוק הופכים את השבר השני, כלומר מחליפים בין המונה למכנה, והופכים את החילוק לכפל.',
    math: `${formatFraction(a)} ÷ ${formatFraction(b)} = ${formatFraction(a)} × ${formatFraction(flipped)}`,
  })
  const raw = { n: a.n * flipped.n, d: a.d * flipped.d }
  steps.push({
    text: 'מכפילים מונה במונה ומכנה במכנה.',
    math: `(${a.n} × ${flipped.n}) / (${a.d} × ${flipped.d}) = ${raw.n}/${raw.d}`,
  })
  return { kind: 'ok', result: finishSteps(raw, steps), steps }
}
