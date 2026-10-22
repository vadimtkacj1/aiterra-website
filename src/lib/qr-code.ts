import QRCode from 'qrcode'
import { ASSUMED_ISRAELI_NOTE, buildWhatsAppLink, normalizePhone } from './whatsapp-link'

export type QrType = 'url' | 'whatsapp' | 'review' | 'wifi' | 'vcard' | 'text'
export type WifiSecurity = 'WPA' | 'WEP' | 'nopass'
export type QrLevel = 'L' | 'M' | 'Q' | 'H'
export type ColorProblem = 'inverted' | 'low' | null

export type QrFields = {
  url: string
  waPhone: string
  waMessage: string
  review: string
  wifiSsid: string
  wifiPassword: string
  wifiSecurity: WifiSecurity
  wifiHidden: boolean
  firstName: string
  lastName: string
  phone: string
  email: string
  company: string
  website: string
  address: string
  text: string
}

export type QrSettings = {
  dark: string
  light: string
  margin: number
  size: number
  level: QrLevel
}

export type QrSummary = { text: string; detail?: string; detailDir?: 'ltr' | 'auto' }
export type QrNotice = { field: keyof QrFields; text: string }

export type QrPayload =
  | { status: 'empty' }
  | { status: 'invalid'; field: keyof QrFields; error: string }
  | { status: 'valid'; value: string; summary: QrSummary; notice?: QrNotice }

export type QrSymbol = { status: 'ok'; modules: number } | { status: 'too-long' }

export const qrTypes: { id: QrType; label: string }[] = [
  { id: 'url', label: 'קישור' },
  { id: 'whatsapp', label: 'וואטסאפ' },
  { id: 'review', label: 'ביקורת בגוגל' },
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'vcard', label: 'כרטיס ביקור' },
  { id: 'text', label: 'טקסט' },
]

export const wifiSecurityOptions: { id: WifiSecurity; label: string }[] = [
  { id: 'WPA', label: 'WPA או WPA2, הנפוץ' },
  { id: 'WEP', label: 'WEP, בנתבים ישנים' },
  { id: 'nopass', label: 'בלי סיסמה' },
]

export const levelOptions: { id: QrLevel; label: string }[] = [
  { id: 'L', label: 'L, כ-7%' },
  { id: 'M', label: 'M, כ-15%' },
  { id: 'Q', label: 'Q, כ-25%' },
  { id: 'H', label: 'H, כ-30%' },
]

export const marginOptions: { value: number; label: string }[] = [
  { value: 2, label: 'צרים, 2 ריבועים' },
  { value: 4, label: 'רגילים, 4 ריבועים' },
  { value: 8, label: 'רחבים, 8 ריבועים' },
]

export const sizeOptions = [512, 1024, 2048]

export const LOGO_LEVEL: QrLevel = 'H'
export const MAX_LOGO_BYTES = 3 * 1024 * 1024
export const LOGO_TYPES = 'image/png,image/jpeg,image/webp,image/svg+xml'
const LOGO_SCALE = 0.22
const LOGO_INSET = 0.1
const LOGO_RADIUS = 0.18
const MIN_SCAN_CONTRAST = 4
const DENSE_MODULES = 57

export const defaultFields: QrFields = {
  url: '',
  waPhone: '',
  waMessage: '',
  review: '',
  wifiSsid: '',
  wifiPassword: '',
  wifiSecurity: 'WPA',
  wifiHidden: false,
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  company: '',
  website: '',
  address: '',
  text: '',
}

export const defaultSettings: QrSettings = {
  dark: '#0e1730',
  light: '#ffffff',
  margin: 4,
  size: 1024,
  level: 'M',
}

export const URL_ERROR = 'הכתובת לא נראית תקינה. בדקו שהקלדתם אותה נכון, למשל www.example.co.il.'
export const REVIEW_NOTICE = 'הקישור לא נראה כמו קישור של גוגל. ודאו שהעתקתם אותו מפרופיל העסק.'
export const WIFI_PASSWORD_ERROR = 'הקלידו את סיסמת הרשת, או בחרו ״בלי סיסמה״.'
export const VCARD_NAME_ERROR = 'הוסיפו שם או שם עסק, כדי שאיש הקשר יישמר בטלפון עם שם.'

const SCHEME = /^[a-z][a-z\d+.-]*:(?!\d)/i
const WEB_SCHEME = /^https?:$/
const GOOGLE_HOST = /(^|\.)(google\.[a-z.]+|g\.page|goo\.gl)$/i
const HEX_COLOR = /^#[\da-f]{6}$/i

type UrlResult = { status: 'empty' } | { status: 'invalid' } | { status: 'valid'; url: string; host: string }

export function normalizeUrl(raw: string): UrlResult {
  const trimmed = raw.trim()
  if (!trimmed) return { status: 'empty' }
  if (/\s/.test(trimmed)) return { status: 'invalid' }
  const candidate = SCHEME.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const parsed = new URL(candidate)
    if (WEB_SCHEME.test(parsed.protocol)) {
      const host = parsed.hostname
      if (!host.includes('.') || host.endsWith('.') || host.startsWith('.')) return { status: 'invalid' }
    }
    return { status: 'valid', url: candidate, host: parsed.hostname }
  } catch {
    return { status: 'invalid' }
  }
}

const readableUrl = (url: string) => url.replace(/^https?:\/\//i, '').replace(/\/$/, '')

export const escapeWifi = (value: string) => value.replace(/([\\;,":])/g, '\\$1')

export const escapeVcard = (value: string) =>
  value
    .trim()
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/([,;])/g, '\\$1')

function vcardPhone(raw: string) {
  const result = normalizePhone(raw)
  if (result.status !== 'valid') return { value: raw.trim(), mobile: false }
  return { value: `+${result.digits}`, mobile: result.digits.startsWith('9725') }
}

function vcardWebsite(raw: string) {
  const result = normalizeUrl(raw)
  return result.status === 'valid' ? result.url : raw.trim()
}

export function buildVcard(fields: QrFields) {
  const first = escapeVcard(fields.firstName)
  const last = escapeVcard(fields.lastName)
  const company = escapeVcard(fields.company)
  const fullName = [first, last].filter(Boolean).join(' ') || company
  const phone = fields.phone.trim() ? vcardPhone(fields.phone) : null
  const lines = ['BEGIN:VCARD', 'VERSION:3.0', `N:${last};${first};;;`, `FN:${fullName}`]
  if (company) lines.push(`ORG:${company}`)
  if (phone) lines.push(`TEL;TYPE=${phone.mobile ? 'CELL' : 'WORK,VOICE'}:${phone.value}`)
  if (fields.email.trim()) lines.push(`EMAIL;TYPE=INTERNET:${escapeVcard(fields.email)}`)
  if (fields.website.trim()) lines.push(`URL:${vcardWebsite(fields.website)}`)
  if (fields.address.trim()) lines.push(`ADR;TYPE=WORK:;;${escapeVcard(fields.address)};;;;`)
  lines.push('END:VCARD')
  return lines.join('\r\n')
}

export function buildWifi(fields: QrFields) {
  const password = fields.wifiSecurity === 'nopass' ? '' : `P:${escapeWifi(fields.wifiPassword)};`
  const hidden = fields.wifiHidden ? 'H:true;' : ''
  return `WIFI:T:${fields.wifiSecurity};S:${escapeWifi(fields.wifiSsid)};${password}${hidden};`
}

const vcardFields: (keyof QrFields)[] = [
  'firstName',
  'lastName',
  'phone',
  'email',
  'company',
  'website',
  'address',
]

function urlPayload(raw: string, field: 'url' | 'review'): QrPayload {
  const result = normalizeUrl(raw)
  if (result.status === 'empty') return { status: 'empty' }
  if (result.status === 'invalid') return { status: 'invalid', field, error: URL_ERROR }
  if (field === 'review') {
    return {
      status: 'valid',
      value: result.url,
      summary: { text: 'פותח את טופס הביקורת:', detail: readableUrl(result.url), detailDir: 'ltr' },
      notice: GOOGLE_HOST.test(result.host) ? undefined : { field, text: REVIEW_NOTICE },
    }
  }
  return {
    status: 'valid',
    value: result.url,
    summary: { text: 'פותח את', detail: readableUrl(result.url), detailDir: 'ltr' },
  }
}

export function buildPayload(type: QrType, fields: QrFields): QrPayload {
  if (type === 'url') return urlPayload(fields.url, 'url')
  if (type === 'review') return urlPayload(fields.review, 'review')

  if (type === 'whatsapp') {
    const phone = normalizePhone(fields.waPhone)
    if (phone.status === 'empty') return { status: 'empty' }
    if (phone.status === 'invalid') return { status: 'invalid', field: 'waPhone', error: phone.error }
    return {
      status: 'valid',
      value: buildWhatsAppLink(phone.digits, fields.waMessage),
      summary: { text: 'פותח צ׳אט בוואטסאפ עם', detail: `+${phone.digits}`, detailDir: 'ltr' },
      notice: phone.assumedIsraeli ? { field: 'waPhone', text: ASSUMED_ISRAELI_NOTE } : undefined,
    }
  }

  if (type === 'wifi') {
    if (!fields.wifiSsid) return { status: 'empty' }
    if (fields.wifiSecurity !== 'nopass' && !fields.wifiPassword) {
      return { status: 'invalid', field: 'wifiPassword', error: WIFI_PASSWORD_ERROR }
    }
    return {
      status: 'valid',
      value: buildWifi(fields),
      summary: { text: 'מחבר לרשת', detail: fields.wifiSsid, detailDir: 'auto' },
    }
  }

  if (type === 'vcard') {
    if (vcardFields.every((key) => !String(fields[key]).trim())) return { status: 'empty' }
    if (![fields.firstName, fields.lastName, fields.company].some((value) => value.trim())) {
      return { status: 'invalid', field: 'firstName', error: VCARD_NAME_ERROR }
    }
    const name = [fields.firstName, fields.lastName].map((part) => part.trim()).filter(Boolean).join(' ')
    return {
      status: 'valid',
      value: buildVcard(fields),
      summary: { text: 'שומר איש קשר:', detail: name || fields.company.trim(), detailDir: 'auto' },
    }
  }

  const text = fields.text.trim()
  if (!text) return { status: 'empty' }
  return { status: 'valid', value: text, summary: { text: 'מציג את הטקסט שכתבתם' } }
}

export function createSymbol(value: string, level: QrLevel): QrSymbol {
  try {
    return { status: 'ok', modules: QRCode.create(value, { errorCorrectionLevel: level }).modules.size }
  } catch {
    return { status: 'too-long' }
  }
}

export const isDense = (modules: number) => modules > DENSE_MODULES

function luminance(hex: string) {
  const channels = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255)
  const [r, g, b] = channels.map((value) =>
    value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
  )
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export const isHexColor = (value: string) => HEX_COLOR.test(value)

export function colorProblem(dark: string, light: string): ColorProblem {
  if (!isHexColor(dark) || !isHexColor(light)) return null
  const darkLuminance = luminance(dark)
  const lightLuminance = luminance(light)
  if (darkLuminance > lightLuminance) return 'inverted'
  if ((lightLuminance + 0.05) / (darkLuminance + 0.05) < MIN_SCAN_CONTRAST) return 'low'
  return null
}

export function logoBox(imageSize: number, modules: number, margin: number) {
  const symbol = (imageSize * modules) / (modules + margin * 2)
  const side = symbol * LOGO_SCALE
  const start = (imageSize - side) / 2
  const inset = side * LOGO_INSET
  return {
    plate: { x: start, y: start, side, radius: side * LOGO_RADIUS },
    image: { x: start + inset, y: start + inset, side: side - inset * 2 },
  }
}

const round = (value: number) => Number(value.toFixed(3))

const escapeAttribute = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function svgWithLogo(
  svg: string,
  { logo, background, modules, margin }: { logo: string; background: string; modules: number; margin: number },
) {
  const { plate, image } = logoBox(modules + margin * 2, modules, margin)
  const plateTag = `<rect x="${round(plate.x)}" y="${round(plate.y)}" width="${round(plate.side)}" height="${round(
    plate.side,
  )}" rx="${round(plate.radius)}" fill="${background}"/>`
  const imageTag = `<image x="${round(image.x)}" y="${round(image.y)}" width="${round(image.side)}" height="${round(
    image.side,
  )}" preserveAspectRatio="xMidYMid meet" xlink:href="${escapeAttribute(logo)}"/>`
  return svg
    .replace('<svg ', '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ')
    .replace('</svg>', `${plateTag}${imageTag}</svg>`)
}

export function fileName(type: QrType) {
  return `qr-code-${type}`
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const isQrType = (value: unknown): value is QrType => qrTypes.some((item) => item.id === value)

export function restoreFields(value: unknown): QrFields {
  if (!isRecord(value)) return defaultFields
  const restored = { ...defaultFields }
  for (const key of Object.keys(defaultFields) as (keyof QrFields)[]) {
    const saved = value[key]
    if (typeof saved === typeof defaultFields[key]) Object.assign(restored, { [key]: saved })
  }
  if (!wifiSecurityOptions.some((option) => option.id === restored.wifiSecurity)) {
    restored.wifiSecurity = defaultFields.wifiSecurity
  }
  return { ...restored, wifiPassword: '' }
}

export function restoreSettings(value: unknown): QrSettings {
  if (!isRecord(value)) return defaultSettings
  const { dark, light, margin, size, level } = value
  return {
    dark: typeof dark === 'string' && isHexColor(dark) ? dark : defaultSettings.dark,
    light: typeof light === 'string' && isHexColor(light) ? light : defaultSettings.light,
    margin: marginOptions.some((option) => option.value === margin) ? (margin as number) : defaultSettings.margin,
    size: sizeOptions.includes(size as number) ? (size as number) : defaultSettings.size,
    level: levelOptions.some((option) => option.id === level) ? (level as QrLevel) : defaultSettings.level,
  }
}
