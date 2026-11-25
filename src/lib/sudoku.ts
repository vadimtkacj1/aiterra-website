import { seededRandom, shuffle, type RandomFn } from '@/lib/bingo-cards'
import { escapeHtml, printCredit, printPage } from '@/lib/print-frame'

export type SudokuSize = 4 | 6 | 9
export type SudokuLevel = 'easy' | 'medium' | 'hard' | 'blank'
export type PerPage = 1 | 2 | 4 | 6

export type SudokuSettings = {
  size: SudokuSize
  level: SudokuLevel
  count: number
  perPage: PerPage
  title: string
  seed: number
}

export type SudokuPuzzle = { id: number; size: SudokuSize; cells: number[]; solution: number[] }

export const SUDOKU_SIZES: SudokuSize[] = [9, 6, 4]
export const SUDOKU_LEVELS: SudokuLevel[] = ['easy', 'medium', 'hard', 'blank']
export const PER_PAGE_OPTIONS: PerPage[] = [1, 2, 4, 6]
export const MIN_PUZZLES = 1
export const MAX_PUZZLES = 12
export const DEFAULT_PUZZLES = 4
export const DEFAULT_SUDOKU_TITLE = 'סודוקו'
export const DEFAULT_SUDOKU_SEED = 20261126
export const SUDOKU_REVIEWED_LABEL = '26.11.2026'

export const levelLabels: Record<SudokuLevel, string> = {
  easy: 'קל',
  medium: 'בינוני',
  hard: 'קשה',
  blank: 'לוח ריק',
}

export const clueTargets: Record<SudokuSize, Record<Exclude<SudokuLevel, 'blank'>, number>> = {
  4: { easy: 8, medium: 6, hard: 5 },
  6: { easy: 20, medium: 16, hard: 12 },
  9: { easy: 40, medium: 32, hard: 26 },
}

const BOX_ROWS: Record<SudokuSize, number> = { 4: 2, 6: 2, 9: 3 }
const SEED_STEP = 7919
const SOLUTIONS_PER_PAGE = 6
const GRID_MM: Record<PerPage, number> = { 1: 168, 2: 112, 4: 86, 6: 72 }
const SOLUTION_GRID_MM = 72

export const boxRows = (size: SudokuSize) => BOX_ROWS[size]
export const boxColumns = (size: SudokuSize) => size / BOX_ROWS[size]

export const clampPuzzles = (value: number) =>
  Number.isFinite(value) ? Math.min(MAX_PUZZLES, Math.max(MIN_PUZZLES, Math.round(value))) : DEFAULT_PUZZLES

const boxOf = (size: SudokuSize, row: number, column: number) =>
  Math.floor(row / boxRows(size)) * boxRows(size) + Math.floor(column / boxColumns(size))

type Masks = { rows: number[]; columns: number[]; boxes: number[] }

function masksOf(cells: number[], size: SudokuSize): Masks {
  const masks: Masks = {
    rows: Array<number>(size).fill(0),
    columns: Array<number>(size).fill(0),
    boxes: Array<number>(size).fill(0),
  }
  cells.forEach((value, index) => {
    if (!value) return
    const row = Math.floor(index / size)
    const column = index % size
    const bit = 1 << value
    masks.rows[row] |= bit
    masks.columns[column] |= bit
    masks.boxes[boxOf(size, row, column)] |= bit
  })
  return masks
}

const bitCount = (mask: number) => {
  let count = 0
  for (let rest = mask; rest; rest &= rest - 1) count += 1
  return count
}

function mostConstrained(cells: number[], size: SudokuSize, masks: Masks) {
  const full = (1 << (size + 1)) - 2
  let best = -1
  let bestOptions = 0
  let bestCount = size + 1
  for (let index = 0; index < cells.length; index += 1) {
    if (cells[index]) continue
    const row = Math.floor(index / size)
    const column = index % size
    const options = full & ~(masks.rows[row] | masks.columns[column] | masks.boxes[boxOf(size, row, column)])
    const count = bitCount(options)
    if (count < bestCount) {
      best = index
      bestOptions = options
      bestCount = count
      if (count <= 1) break
    }
  }
  return { index: best, options: bestOptions }
}

function place(cells: number[], size: SudokuSize, masks: Masks, index: number, value: number) {
  const row = Math.floor(index / size)
  const column = index % size
  const bit = 1 << value
  cells[index] = value
  masks.rows[row] ^= bit
  masks.columns[column] ^= bit
  masks.boxes[boxOf(size, row, column)] ^= bit
}

function unplace(cells: number[], size: SudokuSize, masks: Masks, index: number) {
  const value = cells[index]
  place(cells, size, masks, index, value)
  cells[index] = 0
}

function search(cells: number[], size: SudokuSize, masks: Masks, limit: number, order: (values: number[]) => number[]) {
  const { index, options } = mostConstrained(cells, size, masks)
  if (index < 0) return 1
  let found = 0
  const values = order(Array.from({ length: size }, (_, offset) => offset + 1).filter((value) => options & (1 << value)))
  for (const value of values) {
    place(cells, size, masks, index, value)
    found += search(cells, size, masks, limit - found, order)
    if (found >= limit) return found
    unplace(cells, size, masks, index)
  }
  return found
}

export function countSolutions(cells: number[], size: SudokuSize, limit = 2) {
  const copy = [...cells]
  return search(copy, size, masksOf(copy, size), limit, (values) => values)
}

function solvedGrid(size: SudokuSize, random: RandomFn) {
  const cells = Array<number>(size * size).fill(0)
  search(cells, size, masksOf(cells, size), 1, (values) => shuffle(values, random))
  return cells
}

function carve(solution: number[], size: SudokuSize, clues: number, random: RandomFn) {
  const cells = [...solution]
  let remaining = cells.length
  for (const index of shuffle(cells.map((_, position) => position), random)) {
    if (remaining <= clues) break
    const value = cells[index]
    cells[index] = 0
    if (countSolutions(cells, size) === 1) remaining -= 1
    else cells[index] = value
  }
  return cells
}

export function generatePuzzle(size: SudokuSize, level: SudokuLevel, seed: number, id: number): SudokuPuzzle {
  if (level === 'blank') {
    const empty = Array<number>(size * size).fill(0)
    return { id, size, cells: empty, solution: empty }
  }
  const random = seededRandom(seed)
  const solution = solvedGrid(size, random)
  return { id, size, cells: carve(solution, size, clueTargets[size][level], random), solution }
}

export function generatePuzzles(settings: Pick<SudokuSettings, 'size' | 'level' | 'count' | 'seed'>) {
  return Array.from({ length: clampPuzzles(settings.count) }, (_, index) =>
    generatePuzzle(settings.size, settings.level, settings.seed + index * SEED_STEP, index + 1),
  )
}

export const cluesIn = (puzzle: SudokuPuzzle) => puzzle.cells.filter(Boolean).length

export const cellEdges = (size: SudokuSize, index: number) => {
  const row = Math.floor(index / size)
  const column = index % size
  return {
    boxEnd: (column + 1) % boxColumns(size) === 0 && column < size - 1,
    boxBottom: (row + 1) % boxRows(size) === 0 && row < size - 1,
  }
}

const PRINT_CSS = `
  @page { size: A4; margin: 12mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Arial, sans-serif; color: #000; }
  .page + .page { break-before: page; }
  h1 { margin: 0 0 5mm; font-size: 18pt; text-align: center; }
  .boards { display: grid; gap: 7mm 10mm; justify-content: center; }
  .per-1, .per-2 { grid-template-columns: auto; }
  .per-4, .per-6 { grid-template-columns: auto auto; }
  .board { break-inside: avoid; }
  .label { margin: 0 0 1.5mm; font-size: 10pt; text-align: center; }
  table { border-collapse: collapse; direction: ltr; border: 0.8mm solid #000; }
  td { width: var(--cell); height: var(--cell); padding: 0; border: 0.2mm solid #000; text-align: center; font-size: var(--font); font-weight: 700; font-variant-numeric: tabular-nums; }
  td.e { border-right: 0.8mm solid #000; }
  td.b { border-bottom: 0.8mm solid #000; }
  td.s { font-weight: 400; color: #555; }
  .credit { margin: 4mm 0 0; font-size: 8pt; color: #555; text-align: center; }
`

function boardHtml(puzzle: SudokuPuzzle, gridMm: number, label: string, solved: boolean) {
  const cell = Math.floor((gridMm / puzzle.size) * 10) / 10
  const font = Math.round(cell * 1.7)
  const rows = Array.from({ length: puzzle.size }, (_, row) => {
    const cells = Array.from({ length: puzzle.size }, (_, column) => {
      const index = row * puzzle.size + column
      const edges = cellEdges(puzzle.size, index)
      const given = puzzle.cells[index]
      const classes = [edges.boxEnd ? 'e' : '', edges.boxBottom ? 'b' : '', solved && !given ? 's' : ''].filter(Boolean)
      const value = given || (solved ? puzzle.solution[index] : 0)
      return `<td${classes.length ? ` class="${classes.join(' ')}"` : ''}>${value || ''}</td>`
    }).join('')
    return `<tr>${cells}</tr>`
  }).join('')
  return `<div class="board"><p class="label">${escapeHtml(label)}</p><table style="--cell:${cell}mm;--font:${font}pt">${rows}</table></div>`
}

const chunks = <T>(items: T[], size: number) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, (index + 1) * size))

export const puzzleLabel = (puzzle: SudokuPuzzle, level: SudokuLevel) =>
  level === 'blank' ? `לוח ${puzzle.id}` : `סודוקו ${puzzle.id}, ${levelLabels[level]}`

export function sudokuPrintDocument(settings: SudokuSettings, withSolutions: boolean): string {
  const puzzles = generatePuzzles(settings)
  const heading = settings.title.trim() || DEFAULT_SUDOKU_TITLE
  const credit = printCredit('מחולל הסודוקו')
  const page = (title: string, boards: string, perPage: PerPage) =>
    `<section class="page"><h1>${escapeHtml(title)}</h1><div class="boards per-${perPage}">${boards}</div>${credit}</section>`
  const puzzlePages = chunks(puzzles, settings.perPage).map((group) =>
    page(
      heading,
      group.map((puzzle) => boardHtml(puzzle, GRID_MM[settings.perPage], puzzleLabel(puzzle, settings.level), false)).join(''),
      settings.perPage,
    ),
  )
  const solutionPages =
    withSolutions && settings.level !== 'blank'
      ? chunks(puzzles, SOLUTIONS_PER_PAGE).map((group) =>
          page(
            `${heading}: פתרונות`,
            group.map((puzzle) => boardHtml(puzzle, SOLUTION_GRID_MM, `פתרון ${puzzle.id}`, true)).join(''),
            6,
          ),
        )
      : []
  return printPage(heading, PRINT_CSS, [...puzzlePages, ...solutionPages].join(''))
}
