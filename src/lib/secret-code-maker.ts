export const ALPHABET = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת']

export const cipherIds = ['atbash', 'caesar', 'number', 'mirror', 'pigpen'] as const
export type CipherId = (typeof cipherIds)[number]
export type Direction = 'encode' | 'decode'

export const cipherLabels: Record<CipherId, string> = {
  atbash: 'אתב״ש',
  caesar: 'הזזה (קיסר)',
  number: 'קוד מספרים',
  mirror: 'מראה',
  pigpen: 'כתב חזיר (סמלים)',
}

export const cipherDescriptions: Record<CipherId, string> = {
  atbash: 'האות הראשונה מתחלפת באחרונה, השנייה בלפני אחרונה, וכך הלאה: א הופכת ת, ב הופכת ש.',
  caesar: 'כל אות זזה מספר קבוע של מקומות באלף־בית. ההזזה היא המפתח הסודי.',
  number: 'כל אות מוחלפת במספר שלה באלף־בית, מ־1 עד 22. אפשר להפריד מילים בקו נטוי.',
  mirror: 'כל מילה נכתבת מהסוף להתחלה, כמו שרואים אותה במראה.',
  pigpen: 'כל אות מקבלת סמל מצויר לפי המקום שלה ברשת. מפענחים בעזרת הטבלה.',
}

const FINAL_TO_BASE: Record<string, string> = { ך: 'כ', ם: 'מ', ן: 'נ', ף: 'פ', ץ: 'צ' }

export function normalizeLetter(char: string): string {
  return FINAL_TO_BASE[char] ?? char
}

export function indexOfLetter(char: string): number {
  return ALPHABET.indexOf(normalizeLetter(char))
}

function mapLetters(text: string, transform: (index: number) => string): string {
  return Array.from(text)
    .map((char) => {
      const index = indexOfLetter(char)
      return index === -1 ? char : transform(index)
    })
    .join('')
}

export function atbash(text: string): string {
  return mapLetters(text, (index) => ALPHABET[ALPHABET.length - 1 - index])
}

export function clampShift(shift: number): number {
  if (!Number.isFinite(shift)) return 1
  return Math.min(21, Math.max(1, Math.round(shift)))
}

export function caesar(text: string, shift: number, direction: Direction): string {
  const step = direction === 'encode' ? clampShift(shift) : -clampShift(shift)
  const size = ALPHABET.length
  return mapLetters(text, (index) => ALPHABET[(((index + step) % size) + size) % size])
}

export function toNumbers(text: string): string {
  const parts: string[] = []
  let word: string[] = []
  const flush = () => {
    if (word.length) parts.push(word.join(' '))
    word = []
  }
  for (const char of Array.from(text)) {
    const index = indexOfLetter(char)
    if (index !== -1) word.push(String(index + 1))
    else if (/\s/.test(char)) flush()
    else word.push(char)
  }
  flush()
  return parts.join(' / ')
}

export function fromNumbers(text: string): string {
  return text
    .split('/')
    .map((word) =>
      word
        .trim()
        .split(/[\s,.-]+/)
        .filter(Boolean)
        .map((token) => {
          const value = Number(token)
          return Number.isInteger(value) && value >= 1 && value <= ALPHABET.length ? ALPHABET[value - 1] : token
        })
        .join(''),
    )
    .join(' ')
}

export function mirror(text: string): string {
  return text
    .split(/(\s+)/)
    .map((part) => Array.from(part).reverse().join(''))
    .join('')
}

export type PigpenShape = { kind: 'cell'; row: number; col: number; dot: boolean } | { kind: 'wedge'; side: 'top' | 'bottom' | 'start' | 'end' }

export function pigpenShape(index: number): PigpenShape {
  if (index < 9) return { kind: 'cell', row: Math.floor(index / 3), col: index % 3, dot: false }
  if (index < 18) {
    const local = index - 9
    return { kind: 'cell', row: Math.floor(local / 3), col: local % 3, dot: true }
  }
  const sides = ['top', 'start', 'end', 'bottom'] as const
  return { kind: 'wedge', side: sides[index - 18] }
}

export function pigpenLines(shape: PigpenShape): { x1: number; y1: number; x2: number; y2: number }[] {
  if (shape.kind === 'wedge') {
    const apex = { x: 20, y: 20 }
    const corners = {
      top: [
        { x: 4, y: 4 },
        { x: 36, y: 4 },
      ],
      bottom: [
        { x: 4, y: 36 },
        { x: 36, y: 36 },
      ],
      start: [
        { x: 4, y: 4 },
        { x: 4, y: 36 },
      ],
      end: [
        { x: 36, y: 4 },
        { x: 36, y: 36 },
      ],
    }[shape.side]
    return corners.map((corner) => ({ x1: apex.x, y1: apex.y, x2: corner.x, y2: corner.y }))
  }
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = []
  if (shape.col > 0) lines.push({ x1: 6, y1: 6, x2: 6, y2: 34 })
  if (shape.col < 2) lines.push({ x1: 34, y1: 6, x2: 34, y2: 34 })
  if (shape.row > 0) lines.push({ x1: 6, y1: 6, x2: 34, y2: 6 })
  if (shape.row < 2) lines.push({ x1: 6, y1: 34, x2: 34, y2: 34 })
  return lines
}

export function encodeText(text: string, cipher: Exclude<CipherId, 'pigpen'>, shift: number, direction: Direction): string {
  if (cipher === 'atbash') return atbash(text)
  if (cipher === 'caesar') return caesar(text, shift, direction)
  if (cipher === 'mirror') return mirror(text)
  return direction === 'encode' ? toNumbers(text) : fromNumbers(text)
}
