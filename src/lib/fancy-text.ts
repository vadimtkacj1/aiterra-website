export type FancyStyleId =
  | 'bold'
  | 'italic'
  | 'boldItalic'
  | 'sansBold'
  | 'script'
  | 'fraktur'
  | 'doubleStruck'
  | 'monospace'
  | 'circled'
  | 'squared'
  | 'smallCaps'
  | 'underline'
  | 'strike'

type MathStyle = { upper: number; lower: number; digit?: number; exceptions?: Record<string, number> }

const mathStyles: Partial<Record<FancyStyleId, MathStyle>> = {
  bold: { upper: 0x1d400, lower: 0x1d41a, digit: 0x1d7ce },
  italic: { upper: 0x1d434, lower: 0x1d44e, exceptions: { h: 0x210e } },
  boldItalic: { upper: 0x1d468, lower: 0x1d482 },
  sansBold: { upper: 0x1d5d4, lower: 0x1d5ee, digit: 0x1d7ec },
  script: {
    upper: 0x1d49c,
    lower: 0x1d4b6,
    exceptions: {
      B: 0x212c,
      E: 0x2130,
      F: 0x2131,
      H: 0x210b,
      I: 0x2110,
      L: 0x2112,
      M: 0x2133,
      R: 0x211b,
      e: 0x212f,
      g: 0x210a,
      o: 0x2134,
    },
  },
  fraktur: {
    upper: 0x1d504,
    lower: 0x1d51e,
    exceptions: { C: 0x212d, H: 0x210c, I: 0x2111, R: 0x211c, Z: 0x2128 },
  },
  doubleStruck: {
    upper: 0x1d538,
    lower: 0x1d552,
    digit: 0x1d7d8,
    exceptions: { C: 0x2102, H: 0x210d, N: 0x2115, P: 0x2119, Q: 0x211a, R: 0x211d, Z: 0x2124 },
  },
  monospace: { upper: 0x1d670, lower: 0x1d68a, digit: 0x1d7f6 },
}

const SMALL_CAPS = 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ'

const COMBINING_UNDERLINE = '̲'
const COMBINING_STRIKE = '̶'

export const fancyStyles: { id: FancyStyleId; label: string; hebrew: boolean }[] = [
  { id: 'bold', label: 'מודגש', hebrew: false },
  { id: 'italic', label: 'נטוי', hebrew: false },
  { id: 'boldItalic', label: 'מודגש ונטוי', hebrew: false },
  { id: 'sansBold', label: 'מודגש בלי סריפים', hebrew: false },
  { id: 'script', label: 'כתב יד', hebrew: false },
  { id: 'fraktur', label: 'גותי', hebrew: false },
  { id: 'doubleStruck', label: 'קו כפול', hebrew: false },
  { id: 'monospace', label: 'מכונת כתיבה', hebrew: false },
  { id: 'circled', label: 'בעיגולים', hebrew: false },
  { id: 'squared', label: 'בריבועים', hebrew: false },
  { id: 'smallCaps', label: 'אותיות גדולות קטנות', hebrew: false },
  { id: 'underline', label: 'קו תחתון', hebrew: true },
  { id: 'strike', label: 'קו חוצה', hebrew: true },
]

const isUpper = (code: number) => code >= 65 && code <= 90
const isLower = (code: number) => code >= 97 && code <= 122
const isDigit = (code: number) => code >= 48 && code <= 57

function mapMath(char: string, style: MathStyle): string {
  const code = char.charCodeAt(0)
  const exception = style.exceptions?.[char]
  if (exception) return String.fromCodePoint(exception)
  if (isUpper(code)) return String.fromCodePoint(style.upper + code - 65)
  if (isLower(code)) return String.fromCodePoint(style.lower + code - 97)
  if (isDigit(code) && style.digit !== undefined) return String.fromCodePoint(style.digit + code - 48)
  return char
}

function mapCircled(char: string): string {
  const code = char.charCodeAt(0)
  if (isUpper(code)) return String.fromCodePoint(0x24b6 + code - 65)
  if (isLower(code)) return String.fromCodePoint(0x24d0 + code - 97)
  if (code === 48) return '⓪'
  if (isDigit(code)) return String.fromCodePoint(0x2460 + code - 49)
  return char
}

function mapSquared(char: string): string {
  const code = char.toUpperCase().charCodeAt(0)
  return isUpper(code) ? String.fromCodePoint(0x1f130 + code - 65) : char
}

function mapSmallCaps(char: string): string {
  const code = char.toLowerCase().charCodeAt(0)
  return isLower(code) ? SMALL_CAPS[code - 97] : char
}

const isCombinable = (char: string) => /\S/u.test(char)

function combine(text: string, mark: string): string {
  return Array.from(text)
    .map((char) => (isCombinable(char) ? char + mark : char))
    .join('')
}

export function convertText(text: string, style: FancyStyleId): string {
  if (style === 'underline') return combine(text, COMBINING_UNDERLINE)
  if (style === 'strike') return combine(text, COMBINING_STRIKE)
  const chars = Array.from(text)
  if (style === 'circled') return chars.map(mapCircled).join('')
  if (style === 'squared') return chars.map(mapSquared).join('')
  if (style === 'smallCaps') return chars.map(mapSmallCaps).join('')
  const math = mathStyles[style]
  return math ? chars.map((char) => mapMath(char, math)).join('') : text
}

export function hasLatin(text: string): boolean {
  return /[A-Za-z0-9]/.test(text)
}

export function hasHebrew(text: string): boolean {
  return /[֐-׿]/.test(text)
}

export type WhatsAppStyle = 'bold' | 'italic' | 'strike' | 'mono'

export const whatsAppStyles: { id: WhatsAppStyle; label: string; marker: string }[] = [
  { id: 'bold', label: 'מודגש', marker: '*' },
  { id: 'italic', label: 'נטוי', marker: '_' },
  { id: 'strike', label: 'קו חוצה', marker: '~' },
  { id: 'mono', label: 'רוחב קבוע', marker: '```' },
]

export function wrapWhatsApp(text: string, style: WhatsAppStyle): string {
  const trimmed = text.trim()
  if (!trimmed) return ''
  const marker = whatsAppStyles.find((item) => item.id === style)?.marker ?? ''
  return trimmed
    .split('\n')
    .map((line) => (line.trim() ? `${marker}${line.trim()}${marker}` : line))
    .join('\n')
}

export type FrameId = 'stars' | 'sparkles' | 'brackets' | 'arrows' | 'hearts' | 'line'

export const frames: { id: FrameId; label: string; start: string; end: string }[] = [
  { id: 'stars', label: 'כוכבים', start: '★ ', end: ' ★' },
  { id: 'sparkles', label: 'נצנצים', start: '✨ ', end: ' ✨' },
  { id: 'brackets', label: 'סוגריים', start: '【 ', end: ' 】' },
  { id: 'arrows', label: 'חצים', start: '» ', end: ' «' },
  { id: 'hearts', label: 'לבבות', start: '♥ ', end: ' ♥' },
  { id: 'line', label: 'קו מפריד', start: '━━━ ', end: ' ━━━' },
]

export function frameText(text: string, frame: FrameId): string {
  const trimmed = text.trim()
  if (!trimmed) return ''
  const item = frames.find((entry) => entry.id === frame)
  return item ? `${item.start}${trimmed}${item.end}` : trimmed
}

export const SEPARATORS = ['• • •', '━━━━━━━━', '✦ ✦ ✦', '〰〰〰〰', '◆◇◆◇◆', '— ✿ —']

export type FormattedPiece = { text: string; styles: WhatsAppStyle[] }

const WHATSAPP_PATTERN = /```([^`]+)```|\*([^*\n]+)\*|_([^_\n]+)_|~([^~\n]+)~/

export function parseWhatsApp(text: string, inherited: WhatsAppStyle[] = []): FormattedPiece[] {
  const pieces: FormattedPiece[] = []
  let rest = text
  while (rest) {
    const match = WHATSAPP_PATTERN.exec(rest)
    if (!match) {
      pieces.push({ text: rest, styles: inherited })
      break
    }
    if (match.index > 0) pieces.push({ text: rest.slice(0, match.index), styles: inherited })
    const [, mono, bold, italic, strike] = match
    if (mono !== undefined) pieces.push({ text: mono, styles: [...inherited, 'mono'] })
    else if (bold !== undefined) pieces.push(...parseWhatsApp(bold, [...inherited, 'bold']))
    else if (italic !== undefined) pieces.push(...parseWhatsApp(italic, [...inherited, 'italic']))
    else if (strike !== undefined) pieces.push(...parseWhatsApp(strike, [...inherited, 'strike']))
    rest = rest.slice(match.index + match[0].length)
  }
  return pieces
}
