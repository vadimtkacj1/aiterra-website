export type IdMode = 'validate' | 'check-digit' | 'company'

export type ModeSpec = {
  id: IdMode
  label: string
  hint: string
  field: string
  fieldHint: string
  length: number
}

export type Step = {
  position: number
  digit: number
  weight: number
  product: number
  added: number
}

export type Prefix = { prefix: string; label: string }

export type IdOutcome =
  | { kind: 'prompt'; message: string }
  | { kind: 'error'; message: string; switchToValidate: boolean }
  | {
      kind: 'checked'
      valid: boolean
      number: string
      typedLength: number
      zerosAdded: number
      steps: Step[]
      sum: number
      expectedCheckDigit: number
      entity: string | null
    }
  | {
      kind: 'computed'
      base: string
      typedLength: number
      zerosAdded: number
      steps: Step[]
      sum: number
      checkDigit: number
      number: string
    }

export const ID_LENGTH = 9
export const BASE_LENGTH = 8
export const DEFAULT_MODE: IdMode = 'validate'

export const modes: ModeSpec[] = [
  {
    id: 'validate',
    label: 'בדיקת תעודת זהות',
    hint: '9 ספרות, תקין או לא',
    field: 'מספר תעודת הזהות',
    fieldHint: '9 ספרות, כולל ספרת הביקורת בסוף. אפשר להקליד בלי האפסים שבהתחלה.',
    length: ID_LENGTH,
  },
  {
    id: 'check-digit',
    label: 'חישוב ספרת ביקורת',
    hint: 'מ-8 הספרות הראשונות',
    field: '8 הספרות הראשונות',
    fieldHint: 'בלי ספרת הביקורת. נחשב את הספרה התשיעית.',
    length: BASE_LENGTH,
  },
  {
    id: 'company',
    label: 'ח.פ. או עוסק מורשה',
    hint: 'חברה, שותפות, עמותה',
    field: 'מספר ח.פ., עוסק מורשה או עמותה',
    fieldHint: '9 ספרות. מספר של חברה, שותפות או עמותה מתחיל ב-5.',
    length: ID_LENGTH,
  },
]

export const corporatePrefixes: Prefix[] = [
  { prefix: '51', label: 'חברה ישראלית' },
  { prefix: '52', label: 'חברה ישראלית' },
  { prefix: '53', label: 'שותפות זרה שנרשמה בישראל' },
  { prefix: '54', label: 'שותפות ישראלית' },
  { prefix: '55', label: 'שותפות ישראלית' },
  { prefix: '56', label: 'חברת חוץ שנרשמה בישראל' },
  { prefix: '58', label: 'עמותה' },
]

const WEIGHTS = [1, 2, 1, 2, 1, 2, 1, 2, 1]
const SEPARATORS = /[\s\-‐-―־./‎‏‪-‮]/g

const isMode = (value: string): value is IdMode => modes.some((mode) => mode.id === value)

export const modeFromHash = (hash: string): IdMode | null => {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  return isMode(id) ? id : null
}

export const modeSpec = (mode: IdMode) => modes.find((item) => item.id === mode) ?? modes[0]

export const steps = (digits: string): Step[] =>
  [...digits].map((char, index) => {
    const digit = Number(char)
    const weight = WEIGHTS[index]
    const product = digit * weight
    return { position: index + 1, digit, weight, product, added: product > 9 ? product - 9 : product }
  })

export const stepsSum = (list: Step[]) => list.reduce((total, step) => total + step.added, 0)

export const checkDigitFor = (base: string) => (10 - (stepsSum(steps(base)) % 10)) % 10

export const isValidId = (value: string) => {
  const digits = value.replace(SEPARATORS, '')
  if (!/^\d{1,9}$/.test(digits) || /^0+$/.test(digits)) return false
  return stepsSum(steps(digits.padStart(ID_LENGTH, '0'))) % 10 === 0
}

export const entityFor = (number: string) => {
  const match = corporatePrefixes.find((item) => number.startsWith(item.prefix))
  if (match) return `לפי הקידומת ${match.prefix}, זה מספר של ${match.label}.`
  if (number.startsWith('5')) return 'המספר מתחיל ב-5 כמו מספרי תאגידים, אבל הקידומת הזו לא הופיעה במאגרים שבדקנו.'
  return 'המספר לא מתחיל ב-5, ולכן הוא לא מספר של חברה, שותפות או עמותה. עוסק מורשה שהוא אדם פרטי רשום בדרך כלל לפי מספר תעודת הזהות שלו.'
}

const prompts: Record<IdMode, string> = {
  validate: 'הקלידו מספר תעודת זהות כדי לבדוק את ספרת הביקורת ולראות את החישוב.',
  'check-digit': 'הקלידו את 8 הספרות הראשונות כדי לקבל את ספרת הביקורת.',
  company: 'הקלידו מספר ח.פ., עוסק מורשה או עמותה כדי לבדוק את ספרת הביקורת.',
}

const error = (message: string, switchToValidate = false): IdOutcome => ({
  kind: 'error',
  message,
  switchToValidate,
})

export function evaluate(mode: IdMode, raw: string): IdOutcome {
  const digits = raw.replace(SEPARATORS, '')
  if (!digits) return { kind: 'prompt', message: prompts[mode] }
  if (!/^\d+$/.test(digits)) return error('אפשר להקליד רק ספרות. רווחים ומקפים לא משנים.')

  const spec = modeSpec(mode)
  if (mode === 'check-digit' && digits.length === ID_LENGTH) {
    return error('הקלדתם 9 ספרות, כלומר מספר מלא עם ספרת ביקורת. כדי לבדוק אותו, עברו לבדיקת תעודת זהות.', true)
  }
  if (digits.length > spec.length) {
    return error(`יש כאן ${digits.length} ספרות. ${mode === 'check-digit' ? 'מקלידים 8 ספרות לכל היותר.' : 'במספר יש 9 ספרות לכל היותר.'}`)
  }
  if (/^0+$/.test(digits)) return error('מספר שכולו אפסים הוא לא מספר זהות או מספר תאגיד.')

  const padded = digits.padStart(spec.length, '0')
  const list = steps(padded)
  const sum = stepsSum(list)
  const zerosAdded = spec.length - digits.length

  if (mode === 'check-digit') {
    const checkDigit = (10 - (sum % 10)) % 10
    return {
      kind: 'computed',
      base: padded,
      typedLength: digits.length,
      zerosAdded,
      steps: list,
      sum,
      checkDigit,
      number: `${padded}${checkDigit}`,
    }
  }

  return {
    kind: 'checked',
    valid: sum % 10 === 0,
    number: padded,
    typedLength: digits.length,
    zerosAdded,
    steps: list,
    sum,
    expectedCheckDigit: checkDigitFor(padded.slice(0, BASE_LENGTH)),
    entity: mode === 'company' ? entityFor(padded) : null,
  }
}

export const nextTen = (sum: number) => Math.ceil(sum / 10) * 10

export const zerosText = (count: number) => (count === 1 ? '0 אחד' : `${count} אפסים`)

export function paddingNote(outcome: IdOutcome) {
  if (outcome.kind !== 'checked' && outcome.kind !== 'computed') return ''
  if (!outcome.zerosAdded) return ''
  const shown = outcome.kind === 'checked' ? outcome.number : outcome.base
  return `הקלדתם ${outcome.typedLength} ספרות, ולכן הוספנו ${zerosText(outcome.zerosAdded)} משמאל: ${shown}.`
}

export function verdictFor(outcome: IdOutcome) {
  if (outcome.kind === 'computed') {
    const gap = outcome.checkDigit
      ? `עד ${nextTen(outcome.sum)} חסרים ${outcome.checkDigit}`
      : 'הסכום כבר מתחלק ב-10'
    return {
      headline: `ספרת הביקורת היא ${outcome.checkDigit}`,
      reason: `סכום 8 הספרות הוא ${outcome.sum}. ${gap}, ולכן המספר המלא הוא ${outcome.number}. זה חישוב בלבד, ולא אומר שהמספר ניתן למישהו.`,
    }
  }
  if (outcome.kind !== 'checked') return null
  if (outcome.valid) {
    return {
      headline: 'המספר תקין',
      reason: `הסכום הוא ${outcome.sum} ומתחלק ב-10, ולכן ספרת הביקורת מתאימה. זה אומר שהמספר בנוי נכון, לא שהוא שייך למישהו, קיים או בתוקף.`,
    }
  }
  return {
    headline: 'המספר לא תקין',
    reason: `הסכום הוא ${outcome.sum} ולא מתחלק ב-10. אם 8 הספרות הראשונות נכונות, ספרת הביקורת צריכה להיות ${outcome.expectedCheckDigit}, אבל הטעות יכולה להיות גם בספרה אחרת. בדקו מול התעודה או המסמך.`,
  }
}

export const announcementFor = (outcome: IdOutcome) => {
  if (outcome.kind === 'error') return outcome.message
  if (outcome.kind === 'computed') return `ספרת הביקורת היא ${outcome.checkDigit}`
  if (outcome.kind === 'checked') return outcome.valid ? 'המספר תקין' : 'המספר לא תקין'
  return ''
}

export function resultToText(outcome: IdOutcome) {
  if (outcome.kind === 'computed') {
    return `ספרת הביקורת של ${outcome.base} היא ${outcome.checkDigit}. המספר המלא: ${outcome.number}`
  }
  if (outcome.kind !== 'checked') return ''
  const verdict = outcome.valid ? 'ספרת הביקורת תקינה' : 'ספרת הביקורת לא תקינה'
  const lines = [`${outcome.number}: ${verdict} (סכום ${outcome.sum}).`]
  if (outcome.entity) lines.push(outcome.entity)
  lines.push('זו בדיקת מבנה בלבד, ולא בדיקה שהמספר קיים או בתוקף.')
  return lines.join('\n')
}

export const fullNumber = (outcome: IdOutcome) =>
  outcome.kind === 'checked' || outcome.kind === 'computed' ? outcome.number : ''

export const EXCEL_VALIDATE_FORMULA =
  '=AND(IFERROR(--A2<>0,FALSE),IFERROR(LEN(TEXT(A2,"0"))<=9,FALSE),IFERROR(MOD(SUMPRODUCT(MID(TEXT(A2,"000000000"),{1,2,3,4,5,6,7,8,9},1)*{1,2,1,2,1,2,1,2,1}-9*(MID(TEXT(A2,"000000000"),{1,2,3,4,5,6,7,8,9},1)*{1,2,1,2,1,2,1,2,1}>9)),10)=0,FALSE))'

export const EXCEL_CHECK_DIGIT_FORMULA =
  '=MOD(10-MOD(SUMPRODUCT(MID(TEXT(A2,"00000000"),{1,2,3,4,5,6,7,8},1)*{1,2,1,2,1,2,1,2}-9*(MID(TEXT(A2,"00000000"),{1,2,3,4,5,6,7,8},1)*{1,2,1,2,1,2,1,2}>9)),10),10)'

export const EXCEL_PAD_FORMULA = '=TEXT(A2,"000000000")'

export const JS_SNIPPET = `function isValidIsraeliId(value) {
  const digits = String(value).replace(/[\\s-]/g, '')
  if (!/^\\d{1,9}$/.test(digits) || Number(digits) === 0) return false
  const id = digits.padStart(9, '0')
  let sum = 0
  for (let i = 0; i < 9; i++) {
    let step = Number(id[i]) * (i % 2 === 0 ? 1 : 2)
    if (step > 9) step -= 9
    sum += step
  }
  return sum % 10 === 0
}`
