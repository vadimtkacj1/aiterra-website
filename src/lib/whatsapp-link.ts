export type PhoneResult =
  | { status: 'empty' }
  | { status: 'invalid'; error: string }
  | { status: 'valid'; digits: string; assumedIsraeli: boolean }

export type ButtonPlacement = 'inline' | 'floating'

export const ISRAEL_CODE = '972'
export const DEFAULT_BUTTON_LABEL = 'שלחו לנו הודעה בוואטסאפ'

export const PHONE_ERRORS = {
  characters: 'אפשר להקליד רק ספרות, רווחים, מקפים וסוגריים, ו-+ בתחילת המספר.',
  zeroAfterPlus: 'אחרי ה-+ או ה-00 באה קידומת המדינה, בלי 0 נוסף. לישראל הקידומת היא 972.',
  israeli: 'המספר לא נראה כמו מספר ישראלי תקין. בדקו שהקלדתם את כל הספרות, למשל 050-1234567.',
  israeliMobile: 'למספר נייד ישראלי יש 10 ספרות כולל ה-0 בהתחלה, למשל 050-1234567.',
  international: 'המספר קצר או ארוך מדי. מספר מחו״ל מתחיל בקידומת המדינה, ואחריה המספר המלא.',
} as const

export const ASSUMED_ISRAELI_NOTE =
  'הנחנו שזה מספר נייד ישראלי בלי ה-0 והוספנו את הקידומת 972. אם זה מספר מחו״ל, הקלידו אותו עם + וקידומת המדינה.'

const SEPARATORS = /[\s\-‐-―().\/‎‏‪-‮]/g
const ISRAELI_NATIONAL = /^[2-9]\d{7,8}$/
const ISRAELI_MOBILE_WITHOUT_ZERO = /^5\d{8}$/
const MIN_INTERNATIONAL_DIGITS = 7
const MAX_INTERNATIONAL_DIGITS = 15

const invalid = (error: string): PhoneResult => ({ status: 'invalid', error })

function checkIsraeli(national: string, assumedIsraeli = false): PhoneResult {
  if (national.startsWith('5') && national.length !== 9) return invalid(PHONE_ERRORS.israeliMobile)
  if (!ISRAELI_NATIONAL.test(national)) return invalid(PHONE_ERRORS.israeli)
  return { status: 'valid', digits: `${ISRAEL_CODE}${national}`, assumedIsraeli }
}

function checkInternational(digits: string): PhoneResult {
  if (digits.startsWith(ISRAEL_CODE)) return checkIsraeli(digits.slice(ISRAEL_CODE.length).replace(/^0/, ''))
  if (digits.startsWith('0')) return invalid(PHONE_ERRORS.zeroAfterPlus)
  if (digits.length < MIN_INTERNATIONAL_DIGITS || digits.length > MAX_INTERNATIONAL_DIGITS) {
    return invalid(PHONE_ERRORS.international)
  }
  return { status: 'valid', digits, assumedIsraeli: false }
}

export function normalizePhone(raw: string): PhoneResult {
  const compact = raw.replace(SEPARATORS, '')
  if (!compact) return { status: 'empty' }
  if (!/^\+?\d+$/.test(compact)) return invalid(PHONE_ERRORS.characters)

  if (compact.startsWith('+')) return checkInternational(compact.slice(1))
  if (compact.startsWith('00')) return checkInternational(compact.slice(2))
  if (compact.startsWith(ISRAEL_CODE)) return checkInternational(compact)
  if (compact.startsWith('0')) return checkIsraeli(compact.slice(1))
  if (ISRAELI_MOBILE_WITHOUT_ZERO.test(compact)) return checkIsraeli(compact, true)
  return checkInternational(compact)
}

export function buildWhatsAppLink(digits: string, message: string) {
  const text = message.trim()
  const base = `https://wa.me/${digits}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}

export function countCharacters(text: string) {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    return [...new Intl.Segmenter('he', { granularity: 'grapheme' }).segment(text)].length
  }
  return Array.from(text).length
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const BUTTON_STYLE: [string, string][] = [
  ['display', 'inline-flex'],
  ['align-items', 'center'],
  ['justify-content', 'center'],
  ['min-height', '48px'],
  ['padding', '12px 24px'],
  ['border-radius', '999px'],
  ['background', '#0f7a3d'],
  ['color', '#ffffff'],
  ['font-family', 'inherit'],
  ['font-size', '16px'],
  ['font-weight', '600'],
  ['line-height', '1.2'],
  ['text-decoration', 'none'],
]

const FLOATING_STYLE: [string, string][] = [
  ['position', 'fixed'],
  ['bottom', '20px'],
  ['inset-inline-end', '20px'],
  ['z-index', '1000'],
  ['box-shadow', '0 8px 24px rgba(0, 0, 0, 0.25)'],
]

const toCss = (rules: [string, string][]) => rules.map(([property, value]) => `${property}:${value}`).join(';')

export function buttonSnippet({
  link,
  label,
  placement,
}: {
  link: string
  label: string
  placement: ButtonPlacement
}) {
  const rules = placement === 'floating' ? [...BUTTON_STYLE, ...FLOATING_STYLE] : BUTTON_STYLE
  const text = escapeHtml(label.trim() || DEFAULT_BUTTON_LABEL)
  return `<a href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer" dir="auto" style="${toCss(rules)}">${text}</a>`
}
