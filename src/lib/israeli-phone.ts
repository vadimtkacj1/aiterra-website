import { ISRAEL_CODE, buildWhatsAppLink, normalizePhone } from '@/lib/whatsapp-link'

export type PhoneKind = 'mobile' | 'landline' | 'national' | 'foreign' | 'tollFree' | 'service' | 'star'

export type FormattedPhone = {
  kind: PhoneKind
  label: string
  local: string
  e164: string | null
  digits: string | null
  international: string | null
  whatsapp: string | null
  tel: string | null
  notes: string[]
}

export type PhoneResult =
  | { status: 'empty' }
  | { status: 'invalid'; reason: string }
  | { status: 'valid'; phone: FormattedPhone }

export type ListFormat = 'e164' | 'digits' | 'local'

export type BulkEntry = { line: number; phone: FormattedPhone; cells: string[] }
export type BulkIssue = { line: number; text: string; reason: string }
export type BulkDuplicate = { line: number; text: string; firstLine: number }

export type BulkResult = {
  rows: number
  entries: BulkEntry[]
  issues: BulkIssue[]
  duplicates: BulkDuplicate[]
  columns: string[]
  column: number
  header: string[] | null
  truncated: boolean
}

export const PLAN_EDITION_DATE = '2 בפברואר 2023'
export const ALLOCATIONS_DATE = '14 בספטמבר 2026'
export const PORTABILITY_START = '2 בדצמבר 2007'
export const MAX_BULK_ROWS = 10000

export const AREA_NAMES: Record<string, string> = {
  '2': 'ירושלים',
  '3': 'תל אביב',
  '4': 'חיפה והצפון',
  '8': 'השפלה והדרום',
  '9': 'השרון',
}

export const MOBILE_PREFIXES = ['50', '51', '52', '53', '54', '55', '56', '58', '59']
export const NATIONAL_PREFIXES = ['72', '73', '74', '76', '77', '79']
const PALESTINIAN_PREFIXES = ['56', '59']
const M2M_DIGITS = ['0', '1']

const LANDLINE_LENGTH = 8
const NINE_DIGIT_LENGTH = 9
const MAX_DIGITS = 15
const MIN_EMBEDDED_DIGITS = 7

export const PHONE_REASONS = {
  noNumber: 'לא מצאנו כאן מספר טלפון.',
  emptyCell: 'אין בשורה הזו מספר טלפון.',
  multiple: 'נראה שיש כאן יותר ממספר אחד. שימו כל מספר בשורה נפרדת.',
  tooLong: 'יש כאן יותר מדי ספרות. אולי חוברו שני מספרים, או שנוספה ספרה.',
  scientific:
    'Excel הציג את המספר בכתיב מדעי, למשל 9.72523E+11, והספרות האחרונות לא הועתקו. תנו לעמודה ב-Excel עיצוב מספר בלי ספרות אחרי הנקודה, והעתיקו שוב.',
  unrecognized:
    'לא זיהינו כאן מספר ישראלי. מספר ישראלי מתחיל ב-0, ב-972 או ב-+972. אם זה מספר מחו״ל, כתבו אותו עם + וקידומת המדינה.',
  localStart:
    'אחרי הקידומת המספר מתחיל בספרה 2 עד 9. מספר שמתחיל שם ב-0 או ב-1 לא קיים בתוכנית המספור.',
  reserved: 'הקידומת 06 שמורה בתוכנית המספור לשימוש עתידי, ואין בה מספרים.',
  carrier:
    'מספר שמתחיל ב-01 הוא חיוג לחו״ל דרך ספק בינלאומי, כמו 013 או 014. כתבו אותו עם + וקידומת המדינה, בלי קוד הספק.',
  shortCode: 'זה מספר מקוצר לשירות, כמו 100 או 144. אין לו צורה בינלאומית.',
  service: 'מספר שירות שמתחיל ב-1, כמו 1-800 או 1-700, בנוי מ-10 ספרות.',
  star: 'מספר כוכבית לעסקים בנוי מכוכבית וארבע ספרות, כמו *2345. קוד אחר עם כוכבית הוא קוד שירות של חברת הטלפון.',
  serviceFromAbroad:
    'למספרי שירות שמתחילים ב-1 ולמספרי כוכבית אין צורה עם 972, כי לא מחייגים אליהם מחו״ל.',
  prefix057:
    'הקידומת 057 לא מוקצית היום לאף חברת טלפון לפי רשימת ההקצאות של משרד התקשורת. ייתכן שזה מספר ישן, כדאי לבדוק מול הלקוח.',
} as const

const NOTES = {
  addedZero: 'הוספנו את ה-0 שחסר בהתחלה. זה קורה כשמספר עובר דרך Excel.',
  removedZero: 'הורדנו את ה-0 שהופיע אחרי 972. אחרי קידומת המדינה לא כותבים 0.',
  m2m: 'הטווח הזה מוקצה לשירותי M2M, כלומר לכרטיסי SIM של מכשירים, ולא לטלפונים של אנשים.',
  palestinian: 'הקידומת הזו הוקצתה למפעילים ברשות הפלסטינית.',
  notMobile: 'קו שאינו נייד אפשר לרשום רק באפליקציית WhatsApp Business, כך שהקישור לוואטסאפ יעבוד רק אם המספר נרשם שם.',
  foreign: 'זה מספר מחו״ל. בדקנו רק שהאורך שלו סביר, לא את תוכנית המספור של אותה מדינה.',
  domesticOnly:
    'לפי תוכנית המספור, מחו״ל מחייגים אחרי 972 רק מספר קווי, מספר נייד או מספר בקידומת 07. למספר הזה אין צורה בינלאומית, ולכן אין לו גם קישור לוואטסאפ.',
} as const

const lengthReason = (kind: 'mobile' | 'national' | 'landline', count: number) => {
  if (kind === 'mobile') return `למספר נייד יש 10 ספרות כולל ה-0 בהתחלה, וכאן יש ${count}.`
  if (kind === 'national') return `למספר בקידומת 07 יש 10 ספרות כולל ה-0 בהתחלה, וכאן יש ${count}.`
  return `למספר קווי יש 9 ספרות כולל ה-0 בהתחלה, וכאן יש ${count}.`
}

const unallocatedReason = (prefix: string) =>
  `הקידומת ${prefix} לא מוקצית היום לאף חברת טלפון, לפי רשימת ההקצאות של משרד התקשורת.`

const notInternationalReason = (label: string) => `${label}: אין לו צורה בינלאומית, ולכן הוא לא נכנס לרשימה.`

const SEPARATORS = /[\s\-‐-―−().‎‏‪-‮⁦-⁩]/g
const FOREIGN_DIGITS = /[٠-٩۰-۹０-９]/g
const PHONE_ONLY = /^[+*]?\d+$/
const SCIENTIFIC = /^\d(?:[.,]\d+)?e\+?\d+$/i
const CANDIDATES = /[+*]?\d[\d\s\-‐-―−().]*\d/g
const STAR_NUMBER = /^\*\d{4}$/
const SERVICE_NUMBER = /^1[1-9]\d{8}$/
const TOLL_FREE_CODE = '1800'

type Flags = { addedZero?: boolean; removedZero?: boolean }

const invalid = (reason: string): PhoneResult => ({ status: 'invalid', reason })
const valid = (phone: FormattedPhone): PhoneResult => ({ status: 'valid', phone })

const toAsciiDigits = (text: string) =>
  text.replace(FOREIGN_DIGITS, (digit) => String(digit.charCodeAt(0) & 0xf))

const digitCount = (text: string) => text.replace(/\D/g, '').length

function flagNotes(flags: Flags) {
  const notes: string[] = []
  if (flags.addedZero) notes.push(NOTES.addedZero)
  if (flags.removedZero) notes.push(NOTES.removedZero)
  return notes
}

function israeliPhone(kind: PhoneKind, nsn: string, label: string, split: number, notes: string[]): FormattedPhone {
  const digits = `${ISRAEL_CODE}${nsn}`
  const head = nsn.slice(0, split)
  const rest = nsn.slice(split)
  return {
    kind,
    label,
    local: `0${head}-${rest}`,
    e164: `+${digits}`,
    digits,
    international: `+${ISRAEL_CODE} ${head} ${rest.slice(0, 3)} ${rest.slice(3)}`,
    whatsapp: buildWhatsAppLink(digits, ''),
    tel: `tel:+${digits}`,
    notes,
  }
}

function checkMobile(nsn: string, notes: string[]): PhoneResult {
  const prefix = nsn.slice(0, 2)
  if (nsn.length !== NINE_DIGIT_LENGTH) return invalid(lengthReason('mobile', nsn.length + 1))
  if (prefix === '57') return invalid(PHONE_REASONS.prefix057)
  if (!MOBILE_PREFIXES.includes(prefix)) return invalid(unallocatedReason(`0${prefix}`))
  if (M2M_DIGITS.includes(nsn.charAt(2))) notes.push(NOTES.m2m)
  if (PALESTINIAN_PREFIXES.includes(prefix)) notes.push(NOTES.palestinian)
  return valid(israeliPhone('mobile', nsn, 'נייד', 2, notes))
}

function checkNationalRange(nsn: string, notes: string[]): PhoneResult {
  const prefix = nsn.slice(0, 2)
  if (nsn.length !== NINE_DIGIT_LENGTH) return invalid(lengthReason('national', nsn.length + 1))
  if (!NATIONAL_PREFIXES.includes(prefix)) return invalid(unallocatedReason(`0${prefix}`))
  if (M2M_DIGITS.includes(nsn.charAt(2))) return invalid(PHONE_REASONS.localStart)
  return valid(israeliPhone('national', nsn, `מספר ארצי בקידומת 0${prefix}`, 2, [...notes, NOTES.notMobile]))
}

function checkLandline(nsn: string, notes: string[]): PhoneResult {
  if (nsn.length !== LANDLINE_LENGTH) return invalid(lengthReason('landline', nsn.length + 1))
  if (M2M_DIGITS.includes(nsn.charAt(1))) return invalid(PHONE_REASONS.localStart)
  const label = `קווי, אזור החיוג של ${AREA_NAMES[nsn.charAt(0)]}`
  return valid(israeliPhone('landline', nsn, label, 1, [...notes, NOTES.notMobile]))
}

function checkNational(nsn: string, flags: Flags = {}): PhoneResult {
  const first = nsn.charAt(0)
  const notes = flagNotes(flags)
  if (first === '5') return checkMobile(nsn, notes)
  if (first === '7') return checkNationalRange(nsn, notes)
  if (first in AREA_NAMES) return checkLandline(nsn, notes)
  if (first === '6') return invalid(PHONE_REASONS.reserved)
  return invalid(PHONE_REASONS.unrecognized)
}

function domesticPhone(kind: PhoneKind, label: string, local: string, tel: string | null): PhoneResult {
  return valid({
    kind,
    label,
    local,
    e164: null,
    digits: null,
    international: null,
    whatsapp: null,
    tel,
    notes: [NOTES.domesticOnly],
  })
}

function checkService(compact: string): PhoneResult {
  if (compact.length <= 4) return invalid(PHONE_REASONS.shortCode)
  if (!SERVICE_NUMBER.test(compact)) return invalid(PHONE_REASONS.service)
  const code = `${compact.charAt(0)}-${compact.slice(1, 4)}`
  const local = `${code}-${compact.slice(4, 7)}-${compact.slice(7)}`
  if (compact.startsWith(TOLL_FREE_CODE)) return domesticPhone('tollFree', `מספר חינם ${code}`, local, `tel:${compact}`)
  return domesticPhone('service', `מספר שירות ${code}`, local, `tel:${compact}`)
}

function checkStar(compact: string): PhoneResult {
  if (!STAR_NUMBER.test(compact)) return invalid(PHONE_REASONS.star)
  return domesticPhone('star', 'מספר כוכבית לעסקים', compact, null)
}

function checkAfterIsraelCode(rest: string): PhoneResult {
  const removedZero = rest.startsWith('0')
  const nsn = removedZero ? rest.slice(1) : rest
  if (!nsn) return invalid(PHONE_REASONS.unrecognized)
  if (nsn.startsWith('1')) return invalid(PHONE_REASONS.serviceFromAbroad)
  return checkNational(nsn, { removedZero })
}

function checkInternational(rest: string): PhoneResult {
  if (!rest) return invalid(PHONE_REASONS.unrecognized)
  if (rest.startsWith(ISRAEL_CODE)) return checkAfterIsraelCode(rest.slice(ISRAEL_CODE.length))
  const result = normalizePhone(`+${rest}`)
  if (result.status === 'invalid') return invalid(result.error)
  if (result.status === 'empty') return invalid(PHONE_REASONS.unrecognized)
  const e164 = `+${result.digits}`
  return valid({
    kind: 'foreign',
    label: 'מספר מחו״ל',
    local: e164,
    e164,
    digits: result.digits,
    international: e164,
    whatsapp: buildWhatsAppLink(result.digits, ''),
    tel: `tel:${e164}`,
    notes: [NOTES.foreign],
  })
}

const missingZero = (compact: string) =>
  (compact.length === LANDLINE_LENGTH && compact.charAt(0) in AREA_NAMES) ||
  (compact.length === NINE_DIGIT_LENGTH && (compact.startsWith('5') || compact.startsWith('7')))

function checkCompact(compact: string): PhoneResult {
  if (digitCount(compact) > MAX_DIGITS) return invalid(PHONE_REASONS.tooLong)
  if (compact.startsWith('*')) return checkStar(compact)
  if (compact.startsWith('+')) return checkInternational(compact.slice(1))
  if (compact.startsWith('00')) return checkInternational(compact.slice(2))
  if (compact.startsWith(ISRAEL_CODE) && compact.length > NINE_DIGIT_LENGTH) {
    return checkAfterIsraelCode(compact.slice(ISRAEL_CODE.length))
  }
  if (compact.startsWith('01')) return invalid(PHONE_REASONS.carrier)
  if (compact.startsWith('0')) return checkNational(compact.slice(1))
  if (compact.startsWith('1')) return checkService(compact)
  if (missingZero(compact)) return checkNational(compact, { addedZero: true })
  return invalid(PHONE_REASONS.unrecognized)
}

function checkEmbedded(text: string): PhoneResult {
  const candidates = (text.match(CANDIDATES) ?? [])
    .map((candidate) => candidate.replace(SEPARATORS, ''))
    .filter((candidate) => digitCount(candidate) >= MIN_EMBEDDED_DIGITS || STAR_NUMBER.test(candidate))
  if (!candidates.length) return invalid(/\d/.test(text) ? PHONE_REASONS.unrecognized : PHONE_REASONS.noNumber)
  const results = candidates.map(checkCompact)
  const found = results.filter((result) => result.status === 'valid')
  if (found.length > 1) return invalid(PHONE_REASONS.multiple)
  return found[0] ?? results[0]
}

export function parsePhone(raw: string): PhoneResult {
  const text = toAsciiDigits(raw).trim()
  if (!text) return { status: 'empty' }
  if (SCIENTIFIC.test(text.replace(/\s/g, ''))) return invalid(PHONE_REASONS.scientific)
  const compact = text.replace(SEPARATORS, '')
  if (PHONE_ONLY.test(compact)) return checkCompact(compact)
  return checkEmbedded(text)
}

export const typedDigitCount = (raw: string) => digitCount(toAsciiDigits(raw))

export function formatValue(phone: FormattedPhone, format: ListFormat) {
  if (format === 'e164') return phone.e164 ?? ''
  if (format === 'digits') return phone.digits ?? ''
  return phone.local
}

export const listText = (entries: BulkEntry[], format: ListFormat) =>
  entries.map((entry) => formatValue(entry.phone, format)).join('\n')

function detectDelimiter(lines: string[]) {
  if (lines.some((line) => line.includes('\t'))) return '\t'
  if (lines.some((line) => line.includes(';'))) return ';'
  if (lines.some((line) => line.includes(','))) return ','
  return null
}

function splitRow(line: string, delimiter: string) {
  const cells: string[] = []
  let cell = ''
  let quoted = false
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    if (quoted && char === '"' && line[index + 1] === '"') {
      cell += '"'
      index += 1
    } else if (char === '"' && (quoted || !cell.trim())) {
      quoted = !quoted
    } else if (char === delimiter && !quoted) {
      cells.push(cell.trim())
      cell = ''
    } else {
      cell += char
    }
  }
  cells.push(cell.trim())
  return cells
}

type TableRow = { line: number; cells: string[] }

function bestColumn(rows: TableRow[], width: number) {
  if (width === 1) return 0
  let best = 0
  let bestScore = -1
  for (let column = 0; column < width; column += 1) {
    const score = rows.filter((row) => parsePhone(row.cells[column] ?? '').status === 'valid').length
    if (score > bestScore) {
      best = column
      bestScore = score
    }
  }
  return best
}

const MAX_LABEL_LENGTH = 28

const shorten = (text: string) => (text.length > MAX_LABEL_LENGTH ? `${text.slice(0, MAX_LABEL_LENGTH)}…` : text)

function columnLabels(width: number, header: string[] | null, sample: string[] | undefined) {
  return Array.from({ length: width }, (_, index) => {
    const name = header?.[index]
    const example = sample?.[index]
    if (name) return `${shorten(name)} (עמודה ${index + 1})`
    return example ? `עמודה ${index + 1}: ${shorten(example)}` : `עמודה ${index + 1}`
  })
}

function readTable(text: string) {
  const lines = text.split(/\r\n|\r|\n/)
  const filled = lines.map((line, index) => ({ line: index + 1, text: line })).filter((row) => row.text.trim())
  const kept = filled.slice(0, MAX_BULK_ROWS)
  const delimiter = detectDelimiter(kept.map((row) => row.text))
  const rows: TableRow[] = kept.map((row) => ({
    line: row.line,
    cells: delimiter ? splitRow(row.text, delimiter) : [row.text.trim()],
  }))
  const single = rows.length === 1 && rows[0].cells.length > 1
  const table = single ? rows[0].cells.map((cell) => ({ line: rows[0].line, cells: [cell] })) : rows
  return { table, truncated: filled.length > MAX_BULK_ROWS }
}

export function cleanList(text: string, preferredColumn: number | null): BulkResult {
  const { table, truncated } = readTable(text)
  const width = table.reduce((max, row) => Math.max(max, row.cells.length), 1)
  const column = preferredColumn !== null && preferredColumn < width ? preferredColumn : bestColumn(table, width)
  const first = table[0]
  const header = first && !/\d/.test(toAsciiDigits(first.cells[column] ?? '')) ? first.cells : null
  const body = header ? table.slice(1) : table

  const entries: BulkEntry[] = []
  const issues: BulkIssue[] = []
  const duplicates: BulkDuplicate[] = []
  const seen = new Map<string, number>()

  for (const row of body) {
    const cell = row.cells[column] ?? ''
    const result = parsePhone(cell)
    if (result.status === 'empty') {
      issues.push({ line: row.line, text: row.cells.filter(Boolean).join(' '), reason: PHONE_REASONS.emptyCell })
      continue
    }
    if (result.status === 'invalid') {
      issues.push({ line: row.line, text: cell, reason: result.reason })
      continue
    }
    const { phone } = result
    if (!phone.e164) {
      issues.push({ line: row.line, text: cell, reason: notInternationalReason(phone.label) })
      continue
    }
    const firstLine = seen.get(phone.e164)
    if (firstLine !== undefined) {
      duplicates.push({ line: row.line, text: cell, firstLine })
      continue
    }
    seen.set(phone.e164, row.line)
    entries.push({ line: row.line, phone, cells: row.cells })
  }

  return {
    rows: body.length,
    entries,
    issues,
    duplicates,
    columns: width > 1 ? columnLabels(width, header, body[0]?.cells) : [],
    column,
    header,
    truncated,
  }
}

const UTF8_BOM = String.fromCharCode(0xfeff)

const csvCell = (value: string) => (/[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value)

export const PHONE_CSV_COLUMNS = ['phone_e164', 'phone_whatsapp', 'phone_local', 'phone_type']

export function listCsv(result: BulkResult) {
  const width = result.columns.length
  const sourceHeader = Array.from({ length: width }, (_, index) => result.header?.[index] || `column_${index + 1}`)
  const rows = result.entries.map(({ phone, cells }) => [
    ...Array.from({ length: width }, (_, index) => cells[index] ?? ''),
    phone.e164 ?? '',
    phone.digits ?? '',
    phone.local,
    phone.label,
  ])
  const lines = [[...sourceHeader, ...PHONE_CSV_COLUMNS], ...rows].map((row) => row.map(csvCell).join(','))
  return `${UTF8_BOM}${lines.join('\r\n')}\r\n`
}
