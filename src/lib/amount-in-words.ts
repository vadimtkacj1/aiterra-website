export type Gender = 'feminine' | 'masculine'

export type WordsMode = 'money' | 'number'

export type CurrencyStyle = 'new-shekel' | 'abbreviation' | 'shekel'

export type ParseError = 'empty' | 'invalid' | 'negative' | 'too-large' | 'decimals' | 'fraction'

export type ParsedValue =
  | { ok: true; whole: number; agorot: number; negative: boolean }
  | { ok: false; reason: ParseError }

type Noun = { singular: string; plural: string }

export const MAX_WHOLE = 999_999_999_999

const ZERO = 'אפס'
const MINUS = 'מינוס'
const ONLY = 'בלבד'

const UNITS: Record<Gender, string[]> = {
  feminine: ['', 'אחת', 'שתיים', 'שלוש', 'ארבע', 'חמש', 'שש', 'שבע', 'שמונה', 'תשע'],
  masculine: ['', 'אחד', 'שניים', 'שלושה', 'ארבעה', 'חמישה', 'שישה', 'שבעה', 'שמונה', 'תשעה'],
}

const TEENS: Record<Gender, string[]> = {
  feminine: [
    'עשר',
    'אחת עשרה',
    'שתים עשרה',
    'שלוש עשרה',
    'ארבע עשרה',
    'חמש עשרה',
    'שש עשרה',
    'שבע עשרה',
    'שמונה עשרה',
    'תשע עשרה',
  ],
  masculine: [
    'עשרה',
    'אחד עשר',
    'שנים עשר',
    'שלושה עשר',
    'ארבעה עשר',
    'חמישה עשר',
    'שישה עשר',
    'שבעה עשר',
    'שמונה עשר',
    'תשעה עשר',
  ],
}

const TENS = ['', '', 'עשרים', 'שלושים', 'ארבעים', 'חמישים', 'שישים', 'שבעים', 'שמונים', 'תשעים']

const HUNDREDS = [
  '',
  'מאה',
  'מאתיים',
  'שלוש מאות',
  'ארבע מאות',
  'חמש מאות',
  'שש מאות',
  'שבע מאות',
  'שמונה מאות',
  'תשע מאות',
]

const EXACT_THOUSANDS = [
  '',
  'אלף',
  'אלפיים',
  'שלושת אלפים',
  'ארבעת אלפים',
  'חמשת אלפים',
  'ששת אלפים',
  'שבעת אלפים',
  'שמונת אלפים',
  'תשעת אלפים',
  'עשרת אלפים',
]

const CONSTRUCT_TWO: Record<Gender, string> = { feminine: 'שתי', masculine: 'שני' }

const SHEKEL: Record<CurrencyStyle, Noun> = {
  'new-shekel': { singular: 'שקל חדש', plural: 'שקלים חדשים' },
  abbreviation: { singular: 'ש״ח', plural: 'ש״ח' },
  shekel: { singular: 'שקל', plural: 'שקלים' },
}

const AGORA: Noun = { singular: 'אגורה', plural: 'אגורות' }

const BILLION = 1_000_000_000
const MILLION = 1_000_000
const THOUSAND = 1_000

function belowThousand(value: number, gender: Gender): string[] {
  const hundreds = Math.floor(value / 100)
  const rest = value % 100
  const elements = hundreds ? [HUNDREDS[hundreds]] : []
  if (rest >= 10 && rest < 20) return [...elements, TEENS[gender][rest - 10]]
  const tens = Math.floor(rest / 10)
  const units = rest % 10
  if (tens) elements.push(TENS[tens])
  if (units) elements.push(UNITS[gender][units])
  return elements
}

export function joinElements(elements: string[]): string {
  if (elements.length < 2) return elements.join('')
  return `${elements.slice(0, -1).join(' ')} ו${elements[elements.length - 1]}`
}

function scaleElement(count: number, word: string): string {
  if (count === 1) return word
  if (count === 2) return `${CONSTRUCT_TWO.masculine} ${word}`
  return `${joinElements(belowThousand(count, 'masculine'))} ${word}`
}

function thousandsElement(count: number): string {
  if (count < EXACT_THOUSANDS.length) return EXACT_THOUSANDS[count]
  return `${joinElements(belowThousand(count, 'masculine'))} אלף`
}

function numberElements(value: number, gender: Gender): string[] {
  const billions = Math.floor(value / BILLION)
  const millions = Math.floor(value / MILLION) % 1000
  const thousands = Math.floor(value / THOUSAND) % 1000
  const elements: string[] = []
  if (billions) elements.push(scaleElement(billions, 'מיליארד'))
  if (millions) elements.push(scaleElement(millions, 'מיליון'))
  if (thousands) elements.push(thousandsElement(thousands))
  return [...elements, ...belowThousand(value % THOUSAND, gender)]
}

export function numberToWords(value: number, gender: Gender): string {
  if (value === 0) return ZERO
  return joinElements(numberElements(value, gender))
}

export function signedNumberToWords(value: number, negative: boolean, gender: Gender): string {
  const words = numberToWords(value, gender)
  return negative && value > 0 ? `${MINUS} ${words}` : words
}

function countNoun(value: number, gender: Gender, noun: Noun): string {
  if (value === 0) return `${ZERO} ${noun.plural}`
  if (value === 1) return `${noun.singular} ${UNITS[gender][1]}`
  if (value === 2) return `${CONSTRUCT_TWO[gender]} ${noun.plural}`
  return `${numberToWords(value, gender)} ${noun.plural}`
}

export function amountToWords(agorot: number, style: CurrencyStyle, only: boolean): string {
  const shekels = Math.floor(agorot / 100)
  const cents = agorot % 100
  const parts: string[] = []
  if (shekels || !cents) parts.push(countNoun(shekels, 'masculine', SHEKEL[style]))
  if (cents) parts.push(countNoun(cents, 'feminine', AGORA))
  const words = parts.join(' ו')
  return only ? `${words} ${ONLY}` : words
}

const groupFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 0 })

export const formatNumber = (value: number, negative = false) =>
  `${negative && value > 0 ? '-' : ''}${groupFormat.format(value)}`

export const formatAmount = (agorot: number) =>
  `${groupFormat.format(Math.floor(agorot / 100))}.${String(agorot % 100).padStart(2, '0')} ₪`

export const amountLine = (agorot: number, words: string) => `${formatAmount(agorot)} (${words})`

export const numberLine = (value: number, negative: boolean, words: string) =>
  `${formatNumber(value, negative)} (${words})`

const stripDecoration = (input: string) =>
  input
    .replace(/[\s\p{Cf}]/gu, '')
    .replace(/₪|ש["״'׳]?ח|שקלים|שקל|nis|ils/giu, '')

const GROUPED = /^\d{1,3}(?:([.,])\d{3})(?:\1\d{3})*$/

function decimalIndexOf(value: string): number {
  const lastDot = value.lastIndexOf('.')
  const lastComma = value.lastIndexOf(',')
  if (lastDot >= 0 && lastComma >= 0) return Math.max(lastDot, lastComma)
  if (lastDot >= 0) return value.indexOf('.') === lastDot ? lastDot : -1
  if (lastComma >= 0) {
    const single = value.indexOf(',') === lastComma
    const groupedThousands = value.length - lastComma - 1 === 3 && lastComma > 0
    return single && !groupedThousands ? lastComma : -1
  }
  return -1
}

function wholeDigits(part: string, decimalSeparator: string): string | null {
  if (/^\d*$/.test(part)) return part
  const grouped = GROUPED.exec(part)
  if (!grouped || grouped[1] === decimalSeparator) return null
  return part.replace(/[.,]/g, '')
}

export function parseValue(input: string, mode: WordsMode): ParsedValue {
  const cleaned = stripDecoration(input)
  if (!cleaned) return { ok: false, reason: 'empty' }
  const negative = /^[-\u2212\u2013]/.test(cleaned)
  const unsigned = negative ? cleaned.slice(1) : cleaned
  if (!/^[\d.,]+$/.test(unsigned) || !/\d/.test(unsigned)) return { ok: false, reason: 'invalid' }

  const decimalIndex = decimalIndexOf(unsigned)
  const decimalSeparator = decimalIndex >= 0 ? unsigned[decimalIndex] : ''
  const wholePart = decimalIndex >= 0 ? unsigned.slice(0, decimalIndex) : unsigned
  const fractionPart = decimalIndex >= 0 ? unsigned.slice(decimalIndex + 1) : ''
  const digits = wholeDigits(wholePart, decimalSeparator)
  if (digits === null || !/^\d*$/.test(fractionPart)) return { ok: false, reason: 'invalid' }

  const significant = digits.replace(/^0+/, '')
  if (significant.length > String(MAX_WHOLE).length) return { ok: false, reason: 'too-large' }
  const fraction = fractionPart.replace(/0+$/, '')
  if (mode === 'number' && fraction) return { ok: false, reason: 'fraction' }
  if (fraction.length > 2) return { ok: false, reason: 'decimals' }
  if (negative && mode === 'money') return { ok: false, reason: 'negative' }

  const whole = Number(significant || '0')
  const agorot = Number(fraction.padEnd(2, '0'))
  return { ok: true, whole, agorot, negative }
}

export const totalAgorot = (parsed: { whole: number; agorot: number }) => parsed.whole * 100 + parsed.agorot

const errorMessages: Record<WordsMode, Record<Exclude<ParseError, 'empty'>, string>> = {
  money: {
    invalid: 'אפשר להקליד רק ספרות, פסיקים בין האלפים ונקודה לפני האגורות.',
    negative: 'סכום לתשלום לא יכול להיות שלילי. הקלידו אותו בלי מינוס.',
    'too-large': `הסכום גדול מדי. אפשר עד ${groupFormat.format(MAX_WHOLE)}.99 ₪.`,
    decimals: 'לאגורות יש רק שתי ספרות אחרי הנקודה.',
    fraction: '',
  },
  number: {
    invalid: 'אפשר להקליד רק ספרות, ופסיקים בין האלפים.',
    negative: '',
    'too-large': `המספר גדול מדי. אפשר עד ${groupFormat.format(MAX_WHOLE)}.`,
    decimals: '',
    fraction: 'כאן ממירים מספר שלם. לסכום עם אגורות בחרו ״סכום בשקלים״.',
  },
}

export function errorMessage(parsed: ParsedValue, mode: WordsMode): string {
  if (parsed.ok || parsed.reason === 'empty') return ''
  return errorMessages[mode][parsed.reason]
}

export const commonAmountsAgorot = [
  100, 180, 200, 250, 360, 500, 750, 1_000, 1_200, 1_250.5, 1_500, 2_000, 2_500, 3_000, 5_000, 7_500, 10_000,
  20_000, 100_000,
].map((shekels) => Math.round(shekels * 100))

export const genderTableNumbers = Array.from({ length: 22 }, (_, index) => index + 1)

export function countingNote(value: number, negative: boolean, gender: Gender): string {
  if (negative) return ''
  if (value === 1) {
    return gender === 'masculine'
      ? 'עם שם עצם, ״אחד״ בא אחריו: ספר אחד, יום אחד.'
      : 'עם שם עצם, ״אחת״ באה אחריו: שעה אחת, מחברת אחת.'
  }
  if (value === 2) {
    return gender === 'masculine'
      ? 'לפני שם עצם כותבים ״שני״: שני ספרים, שני ימים.'
      : 'לפני שם עצם כותבים ״שתי״: שתי שעות, שתי מחברות.'
  }
  return ''
}
