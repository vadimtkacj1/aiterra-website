import { seededRandom, shuffle, type RandomFn } from '@/lib/bingo-cards'
import { escapeHtml, printCredit, printPage } from '@/lib/print-frame'

export type Operation = 'add' | 'subtract' | 'multiply' | 'divide'
export type WorksheetRange = 10 | 20 | 100 | 1000
export type WorksheetLayout = 'row' | 'column' | 'missing'

export type WorksheetSettings = {
  operations: Operation[]
  range: WorksheetRange
  layout: WorksheetLayout
  count: number
  title: string
  seed: number
}

export type Exercise = { a: number; b: number; operation: Operation; answer: number; hidden: 'answer' | 'a' | 'b' }

export type WorksheetPreset = { id: string; label: string; operations: Operation[]; range: WorksheetRange }

export const OPERATIONS: Operation[] = ['add', 'subtract', 'multiply', 'divide']
export const RANGES: WorksheetRange[] = [10, 20, 100, 1000]
export const MIN_EXERCISES = 6
export const MAX_EXERCISES = 60
export const DEFAULT_EXERCISES = 24
export const DEFAULT_WORKSHEET_TITLE = 'דף עבודה בחשבון'
export const DEFAULT_WORKSHEET_SEED = 20261126
export const WORKSHEET_REVIEWED_LABEL = '26.11.2026'

export const operationLabels: Record<Operation, string> = {
  add: 'חיבור',
  subtract: 'חיסור',
  multiply: 'כפל',
  divide: 'חילוק',
}

export const operationSigns: Record<Operation, string> = { add: '+', subtract: '−', multiply: '×', divide: ':' }

export const presets: WorksheetPreset[] = [
  { id: 'to-10', label: 'חיבור וחיסור עד 10', operations: ['add', 'subtract'], range: 10 },
  { id: 'to-20', label: 'חיבור וחיסור עד 20', operations: ['add', 'subtract'], range: 20 },
  { id: 'to-100', label: 'חיבור וחיסור עד 100', operations: ['add', 'subtract'], range: 100 },
  { id: 'times', label: 'כפל וחילוק עד 100', operations: ['multiply', 'divide'], range: 100 },
  { id: 'to-1000', label: 'חיבור וחיסור עד 1000', operations: ['add', 'subtract'], range: 1000 },
]

const MAX_ATTEMPTS = 40
const TABLE_FACTOR = 10
const BLANK = '____'

export const clampExercises = (value: number) =>
  Number.isFinite(value) ? Math.min(MAX_EXERCISES, Math.max(MIN_EXERCISES, Math.round(value))) : DEFAULT_EXERCISES

export const columnOperations = (operations: Operation[]) => operations.filter((operation) => operation !== 'divide')

const between = (min: number, max: number, random: RandomFn) => min + Math.floor(random() * (max - min + 1))

const smallestOperand = (range: WorksheetRange) => (range <= 20 ? 1 : range / 10)

function factors(range: WorksheetRange, random: RandomFn): [number, number] {
  if (range === 1000) {
    const small = between(2, 9, random)
    return [small, between(11, Math.floor(range / small), random)]
  }
  const least = range <= 20 ? 1 : 2
  const first = between(least, Math.min(TABLE_FACTOR, Math.floor(range / least)), random)
  return [first, between(least, Math.min(TABLE_FACTOR, Math.floor(range / first)), random)]
}

function draw(operation: Operation, range: WorksheetRange, random: RandomFn): Omit<Exercise, 'hidden'> {
  if (operation === 'add') {
    const a = between(smallestOperand(range), range - 1, random)
    const b = between(1, range - a, random)
    return { a, b, operation, answer: a + b }
  }
  if (operation === 'subtract') {
    const a = between(Math.max(2, smallestOperand(range)), range, random)
    const b = between(1, a - 1, random)
    return { a, b, operation, answer: a - b }
  }
  const [first, second] = factors(range, random)
  if (operation === 'multiply') return { a: first, b: second, operation, answer: first * second }
  return { a: first * second, b: first, operation, answer: second }
}

const exerciseKey = (exercise: Omit<Exercise, 'hidden'>) => `${exercise.a}${exercise.operation}${exercise.b}`

export function generateExercises(settings: Omit<WorksheetSettings, 'title'>): Exercise[] {
  const operations = settings.layout === 'column' ? columnOperations(settings.operations) : settings.operations
  if (!operations.length) return []
  const random = seededRandom(settings.seed)
  const seen = new Set<string>()
  const exercises = Array.from({ length: clampExercises(settings.count) }, (_, index) => {
    const operation = operations[index % operations.length]
    let candidate = draw(operation, settings.range, random)
    for (let attempt = 0; attempt < MAX_ATTEMPTS && seen.has(exerciseKey(candidate)); attempt += 1) {
      candidate = draw(operation, settings.range, random)
    }
    seen.add(exerciseKey(candidate))
    const hidden: Exercise['hidden'] = settings.layout === 'missing' ? (random() < 0.5 ? 'a' : 'b') : 'answer'
    return { ...candidate, hidden }
  })
  return shuffle(exercises, random)
}

const part = (value: number, blank: boolean, solved: boolean) => (blank && !solved ? BLANK : String(value))

export function exerciseText(exercise: Exercise, solved = false) {
  const a = part(exercise.a, exercise.hidden === 'a', solved)
  const b = part(exercise.b, exercise.hidden === 'b', solved)
  const answer = part(exercise.answer, exercise.hidden === 'answer', solved)
  return `${a} ${operationSigns[exercise.operation]} ${b} = ${answer}`
}

export const hiddenValue = (exercise: Exercise) =>
  exercise.hidden === 'a' ? exercise.a : exercise.hidden === 'b' ? exercise.b : exercise.answer

const PRINT_CSS = `
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Arial, sans-serif; color: #000; }
  .page + .page { break-before: page; }
  h1 { margin: 0 0 3mm; font-size: 20pt; text-align: center; }
  .meta { display: flex; justify-content: space-between; margin: 0 0 7mm; font-size: 12pt; }
  .rows { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0 14mm; margin: 0; padding: 0; list-style: none; }
  .rows li { display: flex; align-items: baseline; gap: 3mm; padding: 3.2mm 0; border-bottom: 0.2mm solid #bbb; font-size: 17pt; break-inside: avoid; }
  .n { flex: none; min-width: 8mm; font-size: 9pt; color: #555; }
  .x { direction: ltr; unicode-bidi: isolate; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .columns { display: grid; grid-template-columns: repeat(4, 1fr); gap: 9mm 8mm; margin: 0; padding: 0; list-style: none; }
  .columns li { position: relative; display: flex; justify-content: center; padding-top: 2mm; break-inside: avoid; }
  .columns .n { position: absolute; inset-block-start: 0; inset-inline-start: 0; }
  .stack { display: inline-grid; min-width: 22mm; direction: ltr; text-align: right; font-size: 18pt; font-variant-numeric: tabular-nums; line-height: 1.35; }
  .stack .second { display: flex; justify-content: space-between; gap: 4mm; padding-bottom: 1mm; border-bottom: 0.5mm solid #000; }
  .stack .result { min-height: 9mm; }
  .answers { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2mm 8mm; margin: 0; padding: 0; list-style: none; font-size: 12pt; }
  .answers li { display: flex; gap: 2mm; break-inside: avoid; }
  .credit { margin: 6mm 0 0; font-size: 8pt; color: #555; text-align: center; }
`

const rowItem = (exercise: Exercise, index: number) =>
  `<li><span class="n">${index + 1}.</span><span class="x">${escapeHtml(exerciseText(exercise))}</span></li>`

const columnItem = (exercise: Exercise, index: number) =>
  `<li><span class="n">${index + 1}.</span><div class="stack"><span>${exercise.a}</span>` +
  `<span class="second"><span>${operationSigns[exercise.operation]}</span><span>${exercise.b}</span></span>` +
  `<span class="result"></span></div></li>`

const answerItem = (exercise: Exercise, index: number) =>
  `<li><span class="n">${index + 1}.</span><span class="x">${hiddenValue(exercise)}</span></li>`

export function worksheetPrintDocument(settings: WorksheetSettings, withAnswers: boolean): string {
  const exercises = generateExercises(settings)
  const heading = settings.title.trim() || DEFAULT_WORKSHEET_TITLE
  const credit = printCredit('מחולל דפי העבודה בחשבון')
  const list =
    settings.layout === 'column'
      ? `<ol class="columns">${exercises.map(columnItem).join('')}</ol>`
      : `<ol class="rows">${exercises.map(rowItem).join('')}</ol>`
  const sheet =
    `<section class="page"><h1>${escapeHtml(heading)}</h1>` +
    `<p class="meta"><span>שם: ____________________</span><span>תאריך: ____________</span></p>${list}${credit}</section>`
  const answers = withAnswers
    ? `<section class="page"><h1>${escapeHtml(heading)}: תשובות</h1><ol class="answers">${exercises.map(answerItem).join('')}</ol>${credit}</section>`
    : ''
  return printPage(heading, PRINT_CSS, sheet + answers)
}
