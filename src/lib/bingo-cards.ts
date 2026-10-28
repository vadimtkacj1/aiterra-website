export type BingoMode = 'numbers' | 'words'
export type BingoSize = 3 | 4 | 5
export type RandomFn = () => number

export type BingoSettings = {
  mode: BingoMode
  size: BingoSize
  freeCenter: boolean
  count: number
  words: string[]
}

export type BingoCell = { value: string; free: boolean }
export type BingoCard = { id: number; cells: BingoCell[] }

export type BingoResult =
  | { ok: true; cards: BingoCard[]; pool: string[]; headers: string[]; duplicatesAvoided: boolean }
  | { ok: false; error: string }

export const MAX_NUMBER = 75
export const MIN_CARDS = 1
export const MAX_CARDS = 60
export const FREE_LABEL = 'חינם'
export const BINGO_LETTERS = ['B', 'I', 'N', 'G', 'O']
export const REVIEWED_LABEL = '28.10.2026'

export const SOURCES = {
  americanBingo: {
    href: 'https://en.wikipedia.org/wiki/Bingo_(American_version)',
    label: 'Wikipedia: Bingo (American version)',
    note: 'מבנה הכרטיס 5 על 5, טורי B-I-N-G-O עם 15 מספרים לכל טור, משבצת חינם במרכז ומספר הכרטיסים האפשריים',
  },
}

export const SAMPLE_WORDS = [
  'שולחן', 'כיסא', 'חלון', 'דלת', 'ספר', 'מחברת', 'עיפרון', 'מחק', 'לוח', 'גיר',
  'תיק', 'מורה', 'תלמיד', 'כיתה', 'הפסקה', 'צלצול', 'מבחן', 'שיעור', 'סרגל', 'מספריים',
  'דבק', 'צבע', 'מחשב', 'מפה', 'שעון',
]

export function cryptoRandom(): number {
  const buffer = new Uint32Array(1)
  globalThis.crypto.getRandomValues(buffer)
  return buffer[0] / 2 ** 32
}

export function seededRandom(seed: number): RandomFn {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 2 ** 32
  }
}

export function shuffle<T>(items: readonly T[], random: RandomFn): T[] {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1))
    ;[copy[index], copy[swap]] = [copy[swap], copy[index]]
  }
  return copy
}

export function parseWords(text: string): string[] {
  const seen = new Set<string>()
  const words: string[] = []
  for (const raw of text.split(/[\n,]+/)) {
    const word = raw.trim().replace(/\s+/g, ' ').slice(0, 40)
    if (word && !seen.has(word)) {
      seen.add(word)
      words.push(word)
    }
  }
  return words
}

export function clampCount(value: number): number {
  if (!Number.isFinite(value)) return MIN_CARDS
  return Math.min(MAX_CARDS, Math.max(MIN_CARDS, Math.round(value)))
}

export function hasFreeCell(size: BingoSize, freeCenter: boolean): boolean {
  return freeCenter && size % 2 === 1
}

export function numberColumns(size: BingoSize): number[][] {
  const span = Math.floor(MAX_NUMBER / size)
  return Array.from({ length: size }, (_, column) => {
    const start = column * span + 1
    const end = column === size - 1 ? MAX_NUMBER : start + span - 1
    return Array.from({ length: end - start + 1 }, (_, offset) => start + offset)
  })
}

export function numberHeaders(size: BingoSize): string[] {
  return size === 5 ? BINGO_LETTERS : []
}

function centerIndex(size: BingoSize): number {
  return Math.floor((size * size) / 2)
}

function numberCard(size: BingoSize, free: boolean, random: RandomFn): BingoCell[] {
  const columns = numberColumns(size).map((column) => shuffle(column, random).slice(0, size))
  const cells: BingoCell[] = []
  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size; column += 1) {
      cells.push({ value: String(columns[column][row]), free: false })
    }
  }
  if (free) cells[centerIndex(size)] = { value: FREE_LABEL, free: true }
  return cells
}

function wordCard(size: BingoSize, free: boolean, words: string[], random: RandomFn): BingoCell[] {
  const needed = size * size - (free ? 1 : 0)
  const picked = shuffle(words, random).slice(0, needed)
  const cells = picked.map((value) => ({ value, free: false }))
  if (free) cells.splice(centerIndex(size), 0, { value: FREE_LABEL, free: true })
  return cells
}

function setKey(cells: BingoCell[]): string {
  return cells
    .filter((cell) => !cell.free)
    .map((cell) => cell.value)
    .sort()
    .join('|')
}

function orderKey(cells: BingoCell[]): string {
  return cells.map((cell) => cell.value).join('|')
}

export function wordsNeeded(size: BingoSize, freeCenter: boolean): number {
  return size * size - (hasFreeCell(size, freeCenter) ? 1 : 0)
}

export function generateCards(settings: BingoSettings, random: RandomFn = cryptoRandom): BingoResult {
  const { mode, size } = settings
  const free = hasFreeCell(size, settings.freeCenter)
  const count = clampCount(settings.count)
  const needed = wordsNeeded(size, settings.freeCenter)

  if (mode === 'words' && settings.words.length < needed) {
    return {
      ok: false,
      error: `לכרטיס ${size} על ${size} צריך לפחות ${needed} מילים שונות. כרגע יש ${settings.words.length}.`,
    }
  }

  const build = () =>
    mode === 'numbers' ? numberCard(size, free, random) : wordCard(size, free, settings.words, random)
  const pool =
    mode === 'numbers' ? Array.from({ length: MAX_NUMBER }, (_, index) => String(index + 1)) : [...settings.words]

  const sets = new Set<string>()
  const orders = new Set<string>()
  const cards: BingoCard[] = []
  let duplicatesAvoided = true
  let attempts = 0
  const maxAttempts = count * 400

  while (cards.length < count && attempts < maxAttempts) {
    attempts += 1
    const cells = build()
    const order = orderKey(cells)
    if (orders.has(order)) continue
    const set = setKey(cells)
    const strict = attempts < maxAttempts / 2
    if (strict && sets.has(set)) continue
    if (sets.has(set)) duplicatesAvoided = false
    sets.add(set)
    orders.add(order)
    cards.push({ id: cards.length + 1, cells })
  }

  if (cards.length < count) {
    return { ok: false, error: 'אין מספיק מילים כדי ליצור כל כך הרבה כרטיסים שונים. הוסיפו מילים או הקטינו את הכמות.' }
  }

  return { ok: true, cards, pool, headers: mode === 'numbers' ? numberHeaders(size) : [], duplicatesAvoided }
}

export function numberLetter(value: string): string {
  const number = Number(value)
  if (!Number.isInteger(number) || number < 1 || number > MAX_NUMBER) return ''
  return BINGO_LETTERS[Math.floor((number - 1) / 15)]
}

export function drawNext(pool: readonly string[], drawn: readonly string[], random: RandomFn = cryptoRandom) {
  const taken = new Set(drawn)
  const left = pool.filter((item) => !taken.has(item))
  if (!left.length) return null
  return left[Math.floor(random() * left.length)]
}
