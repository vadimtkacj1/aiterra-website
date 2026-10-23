export type DirectionId = 'rtl' | 'ltr' | 'vertical' | 'diagonal'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type Settings = {
  title: string
  words: string
  size: number
  directions: DirectionId[]
  reverse: boolean
  difficulty: Difficulty
  finals: boolean
  seed: string
}

export type Placement = { word: string; display: string; row: number; col: number; dr: number; dc: number }

export type Puzzle = {
  grid: string[][]
  placements: Placement[]
  skipped: { word: string; reason: 'long' | 'no-room' | 'duplicate' | 'short' }[]
  size: number
}

export const MIN_SIZE = 6
export const MAX_SIZE = 20
export const MAX_WORDS = 30
export const MIN_WORD = 2

export const REGULAR = 'אבגדהוזחטיכלמנסעפצקרשת'

const FINAL_TO_REGULAR: Record<string, string> = { ך: 'כ', ם: 'מ', ן: 'נ', ף: 'פ', ץ: 'צ' }

export const directionOptions: { id: DirectionId; label: string }[] = [
  { id: 'rtl', label: 'מימין לשמאל' },
  { id: 'ltr', label: 'משמאל לימין' },
  { id: 'vertical', label: 'מלמעלה למטה' },
  { id: 'diagonal', label: 'באלכסון' },
]

export const difficultyOptions: { id: Difficulty; label: string; hint: string }[] = [
  { id: 'easy', label: 'קל', hint: 'מימין לשמאל ומלמעלה למטה, רשת 10 על 10' },
  { id: 'medium', label: 'בינוני', hint: 'גם משמאל לימין ובאלכסון, רשת 12 על 12' },
  { id: 'hard', label: 'קשה', hint: 'כל הכיוונים, גם הפוך, רשת 15 ואותיות מילוי מתוך המילים' },
]

export const difficultyPreset: Record<Difficulty, Pick<Settings, 'size' | 'directions' | 'reverse'>> = {
  easy: { size: 10, directions: ['rtl', 'vertical'], reverse: false },
  medium: { size: 12, directions: ['rtl', 'ltr', 'vertical', 'diagonal'], reverse: false },
  hard: { size: 15, directions: ['rtl', 'ltr', 'vertical', 'diagonal'], reverse: true },
}

export const SAMPLE_WORDS = 'תפוח\nבננה\nענבים\nאבטיח\nתות\nשזיף\nאפרסק\nמלון\nרימון\nלימון'

export const defaultSettings = (): Settings => ({
  title: 'תפזורת פירות',
  words: SAMPLE_WORDS,
  ...difficultyPreset.easy,
  difficulty: 'easy',
  finals: true,
  seed: '2027',
})

const NIQQUD = /[֑-ׇ]/g

export const cleanWord = (raw: string) =>
  raw
    .replace(NIQQUD, '')
    .replace(/[^א-ת]/g, '')

export const gridLetters = (word: string, keepFinals: boolean) =>
  keepFinals ? [...word] : [...word].map((letter) => FINAL_TO_REGULAR[letter] ?? letter)

export const parseWords = (text: string) =>
  text
    .split(/[\n,،;]+/)
    .map((line) => ({ display: line.replace(NIQQUD, '').trim(), word: cleanWord(line) }))
    .filter((item) => item.display.length > 0)

const hashSeed = (text: string) => {
  let hash = 2166136261
  for (const char of text) {
    hash ^= char.codePointAt(0) ?? 0
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export const randomFrom = (seed: string) => {
  let state = hashSeed(seed) || 1
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

export const vectorsFor = (directions: DirectionId[], reverse: boolean) => {
  const vectors: [number, number][] = []
  const add = (dr: number, dc: number) => {
    vectors.push([dr, dc])
    if (reverse) vectors.push([-dr, -dc])
  }
  if (directions.includes('rtl')) add(0, 1)
  if (directions.includes('ltr') && !(reverse && directions.includes('rtl'))) add(0, -1)
  if (directions.includes('vertical')) add(1, 0)
  if (directions.includes('diagonal')) {
    add(1, 1)
    add(1, -1)
  }
  const seen = new Set<string>()
  return vectors.filter(([dr, dc]) => {
    const key = `${dr},${dc}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

type Item = { word: string; display: string; letters: string[] }

const tryPlace = (grid: (string | null)[][], item: Item, vectors: [number, number][], random: () => number) => {
  const size = grid.length
  const options: Placement[] = []
  const length = item.letters.length
  for (const [dr, dc] of vectors) {
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        const endRow = row + dr * (length - 1)
        const endCol = col + dc * (length - 1)
        if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) continue
        let fits = true
        let overlap = 0
        for (let index = 0; index < length; index += 1) {
          const current = grid[row + dr * index][col + dc * index]
          if (current === null) continue
          if (current !== item.letters[index]) {
            fits = false
            break
          }
          overlap += 1
        }
        if (fits && overlap < length) options.push({ word: item.word, display: item.display, row, col, dr, dc })
      }
    }
  }
  if (!options.length) return null
  return options[Math.floor(random() * options.length)]
}

const attempt = (items: Item[], size: number, vectors: [number, number][], random: () => number) => {
  const grid: (string | null)[][] = Array.from({ length: size }, () => Array<string | null>(size).fill(null))
  const placements: Placement[] = []
  for (const item of items) {
    const placement = tryPlace(grid, item, vectors, random)
    if (!placement) return null
    item.letters.forEach((letter, index) => {
      grid[placement.row + placement.dr * index][placement.col + placement.dc * index] = letter
    })
    placements.push(placement)
  }
  return { grid, placements }
}

const ATTEMPTS = 60
const FILL_ROUNDS = 30

const ALL_VECTORS: [number, number][] = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
]

export const countOccurrences = (grid: string[][], letters: string[]) => {
  const size = grid.length
  let count = 0
  for (const [dr, dc] of ALL_VECTORS) {
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        let match = true
        for (let index = 0; index < letters.length && match; index += 1) {
          const r = row + dr * index
          const c = col + dc * index
          match = r >= 0 && r < size && c >= 0 && c < size && grid[r][c] === letters[index]
        }
        if (match) count += 1
      }
    }
  }
  const palindrome = letters.join('') === [...letters].reverse().join('')
  return palindrome ? count / 2 : count
}

const hasRepeats = (grid: string[][], items: Item[]) => items.some((item) => countOccurrences(grid, item.letters) > 1)

export function buildPuzzle(settings: Settings): Puzzle {
  const size = Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.round(settings.size) || MIN_SIZE))
  const vectors = vectorsFor(settings.directions.length ? settings.directions : ['rtl'], settings.reverse)
  const skipped: Puzzle['skipped'] = []
  const seen = new Set<string>()
  const items: Item[] = []
  for (const { word, display } of parseWords(settings.words).slice(0, MAX_WORDS)) {
    const letters = gridLetters(word, settings.finals)
    const key = letters.join('')
    if (letters.length < MIN_WORD) skipped.push({ word: display, reason: 'short' })
    else if (letters.length > size) skipped.push({ word: display, reason: 'long' })
    else if (seen.has(key)) skipped.push({ word: display, reason: 'duplicate' })
    else {
      seen.add(key)
      items.push({ word: key, display, letters })
    }
  }
  const ordered = [...items].sort((a, b) => b.letters.length - a.letters.length)
  const random = randomFrom(`${settings.seed}|${size}|${vectors.join(';')}|${ordered.map((item) => item.word).join(',')}`)

  let result: ReturnType<typeof attempt> = null
  let placed = ordered
  for (let round = 0; round < ATTEMPTS && !result; round += 1) result = attempt(placed, size, vectors, random)
  while (!result && placed.length) {
    const dropped = placed[placed.length - 1]
    skipped.push({ word: dropped.display, reason: 'no-room' })
    placed = placed.slice(0, -1)
    for (let round = 0; round < ATTEMPTS && !result; round += 1) result = attempt(placed, size, vectors, random)
  }
  const grid = result?.grid ?? Array.from({ length: size }, () => Array<string | null>(size).fill(null))
  const pool =
    settings.difficulty === 'hard' && placed.length
      ? placed.flatMap((item) => item.letters).filter((letter) => !(letter in FINAL_TO_REGULAR))
      : [...REGULAR]
  const fill = () => grid.map((row) => row.map((cell) => cell ?? pool[Math.floor(random() * pool.length)]))
  let filled = fill()
  for (let round = 0; round < FILL_ROUNDS && hasRepeats(filled, placed); round += 1) filled = fill()
  const order = new Map(items.map((item, index) => [item.word, index]))
  const placements = (result?.placements ?? []).sort((a, b) => (order.get(a.word) ?? 0) - (order.get(b.word) ?? 0))
  return { grid: filled, placements, skipped, size }
}

export const cellKey = (row: number, col: number) => `${row}:${col}`

export const answerCells = (placements: Placement[]) => {
  const cells = new Map<string, number>()
  placements.forEach((placement, index) => {
    for (let step = 0; step < placement.word.length; step += 1) {
      cells.set(cellKey(placement.row + placement.dr * step, placement.col + placement.dc * step), index)
    }
  })
  return cells
}

export const directionName = (placement: Placement) => {
  const { dr, dc } = placement
  if (dr === 0) return dc === 1 ? 'מימין לשמאל' : 'משמאל לימין'
  if (dc === 0) return dr === 1 ? 'מלמעלה למטה' : 'מלמטה למעלה'
  const vertical = dr === 1 ? 'למטה' : 'למעלה'
  const horizontal = dc === 1 ? 'שמאלה' : 'ימינה'
  return `באלכסון ${vertical} ו${horizontal}`
}

export const isDirection = (value: string): value is DirectionId => directionOptions.some((option) => option.id === value)

const isDifficulty = (value: string): value is Difficulty => difficultyOptions.some((option) => option.id === value)

export function readQuery(search: string): Settings | null {
  const params = new URLSearchParams(search)
  const words = params.get('w')
  if (!words) return null
  const base = defaultSettings()
  const difficulty = params.get('d') ?? ''
  const directions = (params.get('dir') ?? '').split(',').filter(isDirection)
  return {
    title: (params.get('t') ?? '').slice(0, 80),
    words: words.slice(0, 1200),
    size: Number(params.get('s')) || base.size,
    directions: directions.length ? directions : base.directions,
    reverse: params.get('r') === '1',
    difficulty: isDifficulty(difficulty) ? difficulty : base.difficulty,
    finals: params.get('f') !== '0',
    seed: (params.get('seed') ?? base.seed).slice(0, 24),
  }
}

export function writeQuery(settings: Settings) {
  const params = new URLSearchParams({
    t: settings.title,
    w: settings.words,
    s: String(settings.size),
    dir: settings.directions.join(','),
    r: settings.reverse ? '1' : '0',
    d: settings.difficulty,
    f: settings.finals ? '1' : '0',
    seed: settings.seed,
  })
  return `?${params.toString()}`
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const PRINT_CSS = `
@page{size:A4 portrait;margin:14mm}
*{box-sizing:border-box}
body{margin:0;font-family:Arial,"Noto Sans Hebrew",sans-serif;color:#111;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{break-after:page;page-break-after:always}
.page:last-child{break-after:auto;page-break-after:auto}
h1{margin:0 0 3mm;font-size:22pt;text-align:center}
.meta{display:flex;justify-content:space-between;margin:0 0 6mm;font-size:11pt}
table{margin:0 auto;border-collapse:collapse}
td{width:var(--cell);height:var(--cell);border:1px solid #444;text-align:center;vertical-align:middle;font-size:var(--font);font-weight:700}
td.hit{background:#ffe08a}
.words{columns:3;column-gap:8mm;margin:8mm 0 0;padding:0;list-style:none;font-size:13pt;line-height:1.7}
.words li::before{content:"☐ ";color:#666}
.key li::before{content:""}
.credit{margin-top:6mm;font-size:8pt;color:#666;text-align:center}
`

export function printDocument(puzzle: Puzzle, title: string, withKey: boolean): string {
  const cell = Math.min(14, Math.floor(170 / puzzle.size))
  const vars = `--cell:${cell}mm;--font:${Math.max(10, Math.round(cell * 1.7))}pt`
  const hits = answerCells(puzzle.placements)
  const table = (key: boolean) =>
    `<table style="${vars}">${puzzle.grid
      .map(
        (row, r) =>
          `<tr>${row.map((letter, c) => `<td${key && hits.has(cellKey(r, c)) ? ' class="hit"' : ''}>${letter}</td>`).join('')}</tr>`,
      )
      .join('')}</table>`
  const heading = escapeHtml(title.trim() || 'תפזורת')
  const words = puzzle.placements.map((placement) => `<li>${escapeHtml(placement.display)}</li>`).join('')
  const keyWords = puzzle.placements
    .map(
      (placement) =>
        `<li>${escapeHtml(placement.display)}: שורה ${placement.row + 1}, עמודה ${placement.col + 1}, ${directionName(placement)}</li>`,
    )
    .join('')
  const credit = '<p class="credit">נוצר במחולל התפזורות של aiterra.co.il</p>'
  const puzzlePage =
    `<section class="page"><h1>${heading}</h1><p class="meta"><span>שם: ____________________</span><span>מצאו ${puzzle.placements.length} מילים</span></p>` +
    `${table(false)}<ul class="words">${words}</ul>${credit}</section>`
  const keyPage = withKey
    ? `<section class="page"><h1>${heading}: פתרון</h1>${table(true)}<ul class="words key">${keyWords}</ul>${credit}</section>`
    : ''
  return `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>${heading}</title><style>${PRINT_CSS}</style></head><body>${puzzlePage}${keyPage}</body></html>`
}
