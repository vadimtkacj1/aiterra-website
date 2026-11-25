import { seededRandom, shuffle } from '@/lib/bingo-cards'
import { escapeHtml, printCredit, printPage } from '@/lib/print-frame'

export type TableSize = 10 | 12 | 20
export type TableFill = 'full' | 'empty' | 'partial'

export type TableSettings = {
  size: TableSize
  fill: TableFill
  color: boolean
  title: string
  seed: number
}

export type TableCell = { row: number; column: number; product: number; shown: boolean }

export const TABLE_SIZES: TableSize[] = [10, 12, 20]
export const DEFAULT_TABLE_TITLE = 'לוח הכפל'
export const DEFAULT_TABLE_SEED = 20261126
export const MULTIPLICATION_REVIEWED_LABEL = '26.11.2026'

const HIDDEN_SHARE = 0.5
const PRINT_WIDTH_MM = 184

export const ROW_COLORS = [
  '#fde3e1',
  '#fdecd6',
  '#fdf5c8',
  '#e9f5d0',
  '#d9f1dd',
  '#d4f0ec',
  '#d8ecfa',
  '#dde4fb',
  '#fbe1ec',
  '#f1ebe1',
]

export const rowColor = (row: number) => ROW_COLORS[(row - 1) % ROW_COLORS.length]

export const uniqueFacts = (size: number) => (size * (size + 1)) / 2

function hiddenKeys({ size, fill, seed }: Pick<TableSettings, 'size' | 'fill' | 'seed'>) {
  const keys = Array.from({ length: size * size }, (_, index) => index)
  if (fill === 'full') return new Set<number>()
  if (fill === 'empty') return new Set(keys)
  return new Set(shuffle(keys, seededRandom(seed)).slice(0, Math.floor(keys.length * HIDDEN_SHARE)))
}

export function buildTable(settings: Pick<TableSettings, 'size' | 'fill' | 'seed'>): TableCell[][] {
  const hidden = hiddenKeys(settings)
  return Array.from({ length: settings.size }, (_, rowIndex) =>
    Array.from({ length: settings.size }, (_, columnIndex) => ({
      row: rowIndex + 1,
      column: columnIndex + 1,
      product: (rowIndex + 1) * (columnIndex + 1),
      shown: !hidden.has(rowIndex * settings.size + columnIndex),
    })),
  )
}

const PRINT_CSS = `
  @page { size: A4; margin: 12mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Arial, sans-serif; color: #000; }
  h1 { margin: 0 0 4mm; font-size: 22pt; text-align: center; }
  .meta { margin: 0 0 5mm; font-size: 12pt; text-align: center; }
  table { margin: 0 auto; border-collapse: collapse; direction: ltr; }
  th, td { width: var(--cell); height: var(--cell); border: 0.3mm solid #000; text-align: center; font-size: var(--font); font-variant-numeric: tabular-nums; padding: 0; }
  th { font-weight: 700; background: #e6e6e6; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  td { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  .color th { background: #0e1730; color: #fff; }
  .credit { margin: 5mm 0 0; font-size: 8pt; color: #555; text-align: center; }
`

export function tablePrintDocument(settings: TableSettings): string {
  const table = buildTable(settings)
  const cell = Math.floor((PRINT_WIDTH_MM / (settings.size + 1)) * 10) / 10
  const font = Math.round(cell * 1.15)
  const heading = settings.title.trim() || DEFAULT_TABLE_TITLE
  const header = `<tr><th>×</th>${table[0].map((entry) => `<th>${entry.column}</th>`).join('')}</tr>`
  const rows = table
    .map((row) => {
      const tint = settings.color ? ` style="background:${rowColor(row[0].row)}"` : ''
      const cells = row.map((entry) => `<td${tint}>${entry.shown ? entry.product : ''}</td>`).join('')
      return `<tr><th>${row[0].row}</th>${cells}</tr>`
    })
    .join('')
  const meta = settings.fill === 'full' ? '' : '<p class="meta">שם: ____________________ תאריך: ____________</p>'
  const body =
    `<h1>${escapeHtml(heading)}</h1>${meta}` +
    `<table class="${settings.color ? 'color' : 'plain'}" style="--cell:${cell}mm;--font:${font}pt">${header}${rows}</table>` +
    printCredit('מחולל לוח הכפל')
  return printPage(heading, PRINT_CSS, body)
}
