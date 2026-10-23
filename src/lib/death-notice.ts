import { dayNumberOf, hebrewDateLetters, parseIso, supportsHebrewCalendar, toHebrew, weekdayOf } from '@/lib/hebrew-date'

export type ToneId = 'traditional' | 'secular'
export type GenderId = 'male' | 'female'
export type PrintSize = 'A4' | 'A5'

export type NoticeInput = {
  tone: ToneId
  gender: GenderId
  name: string
  parentName: string
  age: string
  deathDate: string
  family: string
  funeralDate: string
  funeralTime: string
  funeralPlace: string
  shivaAddress: string
  shivaHours: string
  shivaNote: string
  signature: string
}

export const DEFAULT_TONE: ToneId = 'traditional'
export const DEFAULT_GENDER: GenderId = 'male'
export const DEFAULT_SIGNATURE = 'המשפחה'

export const emptyInput: NoticeInput = {
  tone: DEFAULT_TONE,
  gender: DEFAULT_GENDER,
  name: '',
  parentName: '',
  age: '',
  deathDate: '',
  family: '',
  funeralDate: '',
  funeralTime: '',
  funeralPlace: '',
  shivaAddress: '',
  shivaHours: '',
  shivaNote: '',
  signature: DEFAULT_SIGNATURE,
}

export const tones: { id: ToneId; label: string; hint: string }[] = [
  { id: 'traditional', label: 'מסורתי', hint: 'ניסוח מקובל במודעות אבל, עם ״יהי זכרו ברוך״' },
  { id: 'secular', label: 'חילוני', hint: 'ניסוח אישי ופשוט, בלי ביטויים דתיים' },
]

export const genders: { id: GenderId; label: string }[] = [
  { id: 'male', label: 'הנפטר' },
  { id: 'female', label: 'הנפטרת' },
]

export const printSizes: { id: PrintSize; label: string }[] = [
  { id: 'A4', label: 'A4' },
  { id: 'A5', label: 'A5' },
]

const clean = (value: string) => value.replace(/\s+/g, ' ').trim()

export const familyLines = (family: string) =>
  family
    .split('\n')
    .map(clean)
    .filter((line) => line !== '')

const dateLabel = (iso: string) => {
  const dayNumber = parseIso(iso)
  if (dayNumber === null) return ''
  const [year, month, day] = iso.split('-').map(Number)
  const civil = `${day}.${month}.${year}`
  const weekday = weekdayOf(dayNumber)
  try {
    if (!supportsHebrewCalendar()) return `${weekday}, ${civil}`
    return `${weekday}, ${civil} (${hebrewDateLetters(toHebrew(dayNumberOf(year, month, day))).replace(/ ה׳/, ' ')})`
  } catch {
    return `${weekday}, ${civil}`
  }
}

export const dateIsValid = (iso: string) => iso === '' || parseIso(iso) !== null

type Forms = {
  passed: string
  child: string
  died: string
  memory: string
  nameSuffix: string
}

const forms = (gender: GenderId): Forms =>
  gender === 'male'
    ? { passed: 'פטירתו', child: 'בן', died: 'הלך לעולמו', memory: 'יהי זכרו ברוך', nameSuffix: 'ז״ל' }
    : { passed: 'פטירתה', child: 'בת', died: 'הלכה לעולמה', memory: 'יהי זכרה ברוך', nameSuffix: 'ע״ה' }

const nameWithSuffix = (input: NoticeInput) => {
  const name = clean(input.name)
  return input.tone === 'traditional' ? `${name} ${forms(input.gender).nameSuffix}` : name
}

const parentPart = (input: NoticeInput) => {
  const parent = clean(input.parentName)
  return parent ? `${forms(input.gender).child} ${parent}` : ''
}

const agePart = (input: NoticeInput) => {
  const age = clean(input.age)
  return age ? `בגיל ${age}` : ''
}

const deathPart = (input: NoticeInput) => {
  const label = dateLabel(input.deathDate)
  if (!label) return ''
  const when = `ביום ${label.replace(/^יום /, '')}`
  return `${forms(input.gender).died} ${when}`
}

const detailLine = (input: NoticeInput) =>
  [parentPart(input), agePart(input), deathPart(input)].filter((part) => part !== '').join(', ')

const funeralSentence = (input: NoticeInput) => {
  const label = dateLabel(input.funeralDate)
  const time = clean(input.funeralTime)
  const place = clean(input.funeralPlace)
  const parts = [label, time ? `בשעה ${time}` : '', place].filter((part) => part !== '')
  if (parts.length === 0) return ''
  const when = parts.join(', ')
  return `ההלוויה תתקיים: ${when}.`
}

const shivaSentences = (input: NoticeInput) => {
  const address = clean(input.shivaAddress)
  const hours = clean(input.shivaHours)
  const note = clean(input.shivaNote)
  const lines: string[] = []
  if (address) lines.push(`השבעה תתקיים בכתובת: ${address}.`)
  if (hours) lines.push(`שעות ניחום: ${hours}.`)
  if (note) lines.push(note.endsWith('.') ? note : `${note}.`)
  return lines
}

export const hasName = (input: NoticeInput) => clean(input.name) !== ''

const signature = (input: NoticeInput) => clean(input.signature) || DEFAULT_SIGNATURE

const openingLine = (input: NoticeInput) => {
  const f = forms(input.gender)
  return input.tone === 'traditional'
    ? `בצער רב ובכאב עמוק מודיעים על ${f.passed} של`
    : `בלב כבד ובעצב רב נפרדים מ${input.gender === 'male' ? 'אהובנו' : 'אהובתנו'}`
}

const closingLine = (input: NoticeInput) => {
  const f = forms(input.gender)
  return input.tone === 'traditional'
    ? `${f.memory}. המקום ינחם אתכם בתוך שאר אבלי ציון וירושלים.`
    : `${f.memory}.`
}

export const buildNewspaper = (input: NoticeInput) => {
  if (!hasName(input)) return ''
  const lines: string[] = [openingLine(input), nameWithSuffix(input)]
  const detail = detailLine(input)
  if (detail) lines.push(detail)
  lines.push(...familyLines(input.family))
  const funeral = funeralSentence(input)
  if (funeral) lines.push(funeral)
  lines.push(...shivaSentences(input), closingLine(input), signature(input))
  return lines.join('\n')
}

export const buildWhatsApp = (input: NoticeInput) => {
  if (!hasName(input)) return ''
  const lines: string[] = [openingLine(input), `*${nameWithSuffix(input)}*`]
  const detail = detailLine(input)
  if (detail) lines.push(detail)
  const family = familyLines(input.family)
  if (family.length) lines.push('', ...family)
  const funeral = funeralSentence(input)
  const shiva = shivaSentences(input)
  if (funeral || shiva.length) lines.push('')
  if (funeral) lines.push(funeral)
  lines.push(...shiva, '', closingLine(input), signature(input))
  return lines.join('\n')
}

export const buildFacebook = (input: NoticeInput) => {
  if (!hasName(input)) return ''
  const f = forms(input.gender)
  const lead =
    input.tone === 'traditional'
      ? `בצער רב ובכאב עמוק אנחנו משתפים בבשורה על ${f.passed} של ${nameWithSuffix(input)}`
      : `בלב כבד אנחנו משתפים שנפרדנו מ${input.gender === 'male' ? 'אהובנו' : 'אהובתנו'}, ${nameWithSuffix(input)}`
  const detail = detailLine(input)
  const lines: string[] = [`${lead}${detail ? `, ${detail}` : ''}.`]
  const family = familyLines(input.family)
  if (family.length) lines.push('', 'בני המשפחה:', ...family.map((line) => `• ${line}`))
  const funeral = funeralSentence(input)
  const shiva = shivaSentences(input)
  if (funeral || shiva.length) lines.push('')
  if (funeral) lines.push(funeral)
  lines.push(...shiva, '', 'תודה לכל מי שעוטף אותנו בימים אלה.', closingLine(input), signature(input))
  return lines.join('\n')
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export const buildPrintHtml = (input: NoticeInput, size: PrintSize) => {
  const text = buildNewspaper(input)
  const paragraphs = text.split('\n')
  const body = paragraphs
    .map((line, index) => {
      if (index === 1) return `<h1>${escapeHtml(line)}</h1>`
      if (index === paragraphs.length - 1) return `<p class="sign">${escapeHtml(line)}</p>`
      return `<p>${escapeHtml(line)}</p>`
    })
    .join('')
  const scale = size === 'A4' ? 1 : 0.72
  return `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>${escapeHtml(`מודעת אבל ${clean(input.name)}`)}</title><style>@page{size:${size};margin:14mm}html,body{margin:0;padding:0}body{font-family:'David Libre','Frank Ruhl Libre',Georgia,'Times New Roman',serif;color:#111}.frame{box-sizing:border-box;border:3px double #111;padding:${Math.round(24 * scale)}mm ${Math.round(16 * scale)}mm;text-align:center;font-size:${Math.round(22 * scale)}pt;line-height:1.6;min-height:${size === 'A4' ? '250mm' : '170mm'}}h1{margin:${Math.round(10 * scale)}mm 0;font-size:${Math.round(40 * scale)}pt;font-weight:700}p{margin:0 0 ${Math.round(6 * scale)}mm}.sign{margin-top:${Math.round(14 * scale)}mm;font-weight:700}</style></head><body><div class="frame">${body}</div></body></html>`
}

export const combineOutputs = (input: NoticeInput) => ({
  newspaper: buildNewspaper(input),
  whatsapp: buildWhatsApp(input),
  facebook: buildFacebook(input),
})
