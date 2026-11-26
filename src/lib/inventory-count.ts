export type MarkId = 'obsolete' | 'damaged' | 'slow' | 'scrap' | 'others'

export type CountItem = {
  id: number
  sku: string
  name: string
  unit: string
  serial: string
  mark: MarkId | ''
  expected: string
  counted: string
  cost: string
}

export type CountSettings = {
  business: string
  taxId: string
  date: string
  location: string
  counters: string
  firstSheet: string
  rowsPerSheet: number
  blankSheets: number
  showSku: boolean
  showSerial: boolean
  showCost: boolean
  showExpected: boolean
}

export type ColumnRole = 'name' | 'sku' | 'expected' | 'unit' | 'cost' | 'serial'
export type ColumnMap = Partial<Record<ColumnRole, number>>
export type DateStatus = 'balance' | 'near' | 'notice' | 'outside'
export type PrintMode = 'blank' | 'count' | 'result'
export type Sheet = { number: number; page: number; total: number; firstRow: number; rows: (CountItem | null)[] }
export type Difference = { item: CountItem; expected: number; counted: number; delta: number; value: number | null }
export type CountSummary = {
  rows: number
  countedRows: number
  matching: number
  shortUnits: number
  extraUnits: number
  countedValue: number | null
  valueDelta: number | null
  differences: Difference[]
}

export const GENERATOR_URL = 'https://www.aiterra.co.il/tools/inventory-count-sheet'
export const MAX_ITEMS = 5000
export const MAX_BLANK_SHEETS = 50
export const MAX_FIRST_SHEET = 9999
export const MAX_COUNTERS = 4
export const NOTICE_FREE_DAYS = 10
export const ROWS_PER_SHEET = [20, 25, 30] as const
export const COLUMN_ROLES: ColumnRole[] = ['name', 'sku', 'expected', 'unit', 'cost', 'serial']

export const ROLE_LABELS: Record<ColumnRole, string> = {
  name: 'תיאור הפריט',
  sku: 'מק״ט או ברקוד',
  expected: 'כמות רשומה',
  unit: 'יחידת מידה',
  cost: 'עלות ליחידה',
  serial: 'מספר סידורי',
}

export const MARKS: { id: MarkId; code: string; label: string }[] = [
  { id: 'obsolete', code: 'מ', label: 'מיושן' },
  { id: 'damaged', code: 'ק', label: 'מקולקל' },
  { id: 'slow', code: 'א', label: 'מחזור איטי' },
  { id: 'scrap', code: 'פ', label: 'פסולת' },
  { id: 'others', code: 'ש', label: 'שייך לאחרים' },
]

const UTF8_BOM = '﻿'
const DAY_MS = 86_400_000
const DELIMITERS = [',', ';', '\t']
const LOOSE_ROLES = new Set<ColumnRole>(['name', 'sku', 'expected'])
const SKIPPED_TYPES = new Set(['variable', 'grouped', 'external'])
const DEFAULT_OPTION = 'default title'
const ROW_HEIGHT_MM: Record<number, number> = { 20: 10, 25: 8, 30: 6.7 }
const TEMPLATE_ROWS = 50
const PRINTABLE_WIDTH_MM = 190
const NUMBER_WIDTH_MM = 9
const MIN_NAME_WIDTH_MM = 45

const HEADER_HINTS: Record<ColumnRole, string[]> = {
  name: [
    'title',
    'name',
    'product name',
    'item name',
    'שם',
    'שם המוצר',
    'שם מוצר',
    'שם הפריט',
    'שם פריט',
    'תיאור הפריט',
    'תיאור',
    'תאור',
    'מוצר',
    'פריט',
    'description',
  ],
  sku: ['variant sku', 'sku', 'מק"ט', 'מקט', 'קוד פריט', 'קוד מוצר', 'variant barcode', 'barcode', 'ברקוד'],
  expected: [
    'on hand (current)',
    'on hand',
    'available (not editable)',
    'available',
    'variant inventory qty',
    'stock',
    'כמות רשומה',
    'כמות במלאי',
    'מלאי',
    'יתרה',
    'כמות',
    'quantity',
    'qty',
    'inventory',
  ],
  unit: ['unit', 'יחידת מידה', 'יחידה', "יח'"],
  cost: ['cost per item', 'unit cost', 'cost', 'עלות ליחידה', 'מחיר עלות', 'מחיר קניה', 'מחיר קנייה', 'עלות'],
  serial: ['serial number', 'serial', 'מספר סידורי'],
}

export function parseNumber(value: string): number | null {
  const compact = value.replace(/[\s ₪]/g, '')
  if (!compact) return null
  const decimalComma = /^-?\d+,\d{1,3}$/.test(compact) && !/^-?\d{1,3},\d{3}$/.test(compact)
  const normalized = decimalComma ? compact.replace(',', '.') : compact.replace(/,/g, '')
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(normalized)) return null
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

export const formatQuantity = (value: number) => String(Number(value.toFixed(3)))

export const formatMoney = (value: number) =>
  value.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const numberText = (value: string) => {
  const parsed = parseNumber(value)
  return parsed === null ? '' : formatQuantity(parsed)
}

function parseIso(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!match) return null
  const [year, month, day] = match.slice(1).map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null
}

function shiftMonth(date: Date, delta: number) {
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + delta
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  return new Date(Date.UTC(year, month, Math.min(date.getUTCDate(), lastDay)))
}

export function displayDate(iso: string) {
  const date = parseIso(iso)
  if (!date) return ''
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${day}.${month}.${date.getUTCFullYear()}`
}

export function balanceDateFor(countIso: string) {
  const date = parseIso(countIso)
  if (!date) return ''
  const year = date.getUTCMonth() < 6 ? date.getUTCFullYear() - 1 : date.getUTCFullYear()
  return `${year}-12-31`
}

export function daysFromBalance(countIso: string) {
  const count = parseIso(countIso)
  const balance = parseIso(balanceDateFor(countIso))
  return count && balance ? Math.round((count.getTime() - balance.getTime()) / DAY_MS) : null
}

export function dateStatus(countIso: string): DateStatus | null {
  const count = parseIso(countIso)
  const balance = parseIso(balanceDateFor(countIso))
  if (!count || !balance) return null
  const days = Math.abs(Math.round((count.getTime() - balance.getTime()) / DAY_MS))
  if (days === 0) return 'balance'
  if (days <= NOTICE_FREE_DAYS) return 'near'
  return count >= shiftMonth(balance, -1) && count <= shiftMonth(balance, 1) ? 'notice' : 'outside'
}

export function firstSheetNumber(value: string) {
  const parsed = Number(value.trim())
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= MAX_FIRST_SHEET ? parsed : null
}

export function defaultSettings(todayIso: string): CountSettings {
  const [year, month] = todayIso.split('-').map(Number)
  return {
    business: '',
    taxId: '',
    date: `${month <= 2 ? year - 1 : year}-12-31`,
    location: '',
    counters: '',
    firstSheet: '1',
    rowsPerSheet: 25,
    blankSheets: 3,
    showSku: true,
    showSerial: false,
    showCost: false,
    showExpected: false,
  }
}

export const emptyItem = (id: number): CountItem => ({
  id,
  sku: '',
  name: '',
  unit: '',
  serial: '',
  mark: '',
  expected: '',
  counted: '',
  cost: '',
})

export function decodeText(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  if (bytes[0] === 0xff && bytes[1] === 0xfe) return new TextDecoder('utf-16le').decode(buffer)
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(buffer)
  } catch {
    return new TextDecoder('windows-1255').decode(buffer)
  }
}

function detectDelimiter(source: string) {
  const firstLine = source.slice(0, source.search(/[\r\n]|$/))
  const counts = DELIMITERS.map((delimiter) => firstLine.split(delimiter).length - 1)
  return DELIMITERS[counts.indexOf(Math.max(...counts))]
}

export function parseDelimited(text: string): string[][] {
  const source = text.replace(/^﻿/, '')
  const delimiter = detectDelimiter(source)
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index]
    if (quoted) {
      if (char === '"' && source[index + 1] === '"') {
        cell += '"'
        index += 1
      } else if (char === '"') quoted = false
      else cell += char
    } else if (char === '"' && cell === '') quoted = true
    else if (char === delimiter) {
      row.push(cell)
      cell = ''
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && source[index + 1] === '\n') index += 1
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else cell += char
  }
  if (cell !== '' || row.length) rows.push([...row, cell])
  return rows.filter((cells) => cells.some((value) => value.trim() !== ''))
}

const normalizeHeader = (value: string) =>
  value
    .replace(/^﻿/, '')
    .replace(/[״”“]/g, '"')
    .replace(/[׳’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

export function detectColumns(header: string[]): ColumnMap {
  const names = header.map(normalizeHeader)
  const taken = new Set<number>()
  const map: ColumnMap = {}
  const firstMatch = (hints: string[], matches: (name: string, hint: string) => boolean) =>
    hints
      .map((hint) => names.findIndex((name, index) => !taken.has(index) && matches(name, hint)))
      .find((index) => index !== -1)
  for (const role of COLUMN_ROLES) {
    const hints = HEADER_HINTS[role]
    const exact = firstMatch(hints, (name, hint) => name === hint)
    const found = exact ?? (LOOSE_ROLES.has(role) ? firstMatch(hints, (name, hint) => name.includes(hint)) : undefined)
    if (found === undefined) continue
    map[role] = found
    taken.add(found)
  }
  return map
}

export const looksLikeHeader = (map: ColumnMap) => map.name !== undefined || map.sku !== undefined

function structureColumns(header: string[]) {
  const names = header.map(normalizeHeader)
  const indexOf = (...candidates: string[]) => {
    const index = names.findIndex((name) => candidates.includes(name))
    return index === -1 ? undefined : index
  }
  return {
    handle: indexOf('handle'),
    type: indexOf('type', 'סוג'),
    options: names.flatMap((name, index) => (/^option\d+ value$/.test(name) ? [index] : [])),
  }
}

export function tableToItems(rows: string[][], map: ColumnMap, hasHeader: boolean, firstId: number): CountItem[] {
  const structure = structureColumns(hasHeader ? (rows[0] ?? []) : [])
  const cell = (row: string[], index: number | undefined) => (index === undefined ? '' : (row[index] ?? '').trim())
  const titles = new Map<string, string>()
  const items: CountItem[] = []
  for (const row of rows.slice(hasHeader ? 1 : 0)) {
    if (items.length >= MAX_ITEMS) break
    if (SKIPPED_TYPES.has(cell(row, structure.type).toLowerCase())) continue
    const handle = cell(row, structure.handle)
    const ownTitle = cell(row, map.name)
    if (handle && ownTitle) titles.set(handle, ownTitle)
    const options = structure.options
      .map((index) => cell(row, index))
      .filter((value) => value && value.toLowerCase() !== DEFAULT_OPTION)
    const sku = cell(row, map.sku)
    if (!ownTitle && !options.length && !sku) continue
    const name = [ownTitle || titles.get(handle) || '', ...options].filter(Boolean).join(' / ')
    items.push({
      ...emptyItem(firstId + items.length),
      sku,
      name,
      unit: cell(row, map.unit),
      serial: cell(row, map.serial),
      expected: numberText(cell(row, map.expected)),
      cost: numberText(cell(row, map.cost)),
    })
  }
  return items
}

export const counterNames = (counters: string) =>
  counters
    .split(/[,\n;]+/)
    .map((name) => name.trim())
    .filter(Boolean)
    .slice(0, MAX_COUNTERS)

export function buildSheets(items: CountItem[], rowsPerSheet: number, blankSheets: number, firstSheet: number): Sheet[] {
  const total = items.length ? Math.ceil(items.length / rowsPerSheet) : Math.max(1, blankSheets)
  return Array.from({ length: total }, (_, index) => {
    const slice = items.slice(index * rowsPerSheet, (index + 1) * rowsPerSheet)
    const padding: null[] = Array.from({ length: rowsPerSheet - slice.length }, () => null)
    return {
      number: firstSheet + index,
      page: index + 1,
      total,
      firstRow: index * rowsPerSheet + 1,
      rows: [...slice, ...padding],
    }
  })
}

export const sheetLabel = (sheet: Pick<Sheet, 'number' | 'page' | 'total'>) =>
  sheet.number === sheet.page
    ? `גיליון ${sheet.number} מתוך ${sheet.total}`
    : `גיליון ${sheet.number} (${sheet.page} מתוך ${sheet.total})`

export function summarize(items: CountItem[]): CountSummary {
  const differences: Difference[] = []
  let countedRows = 0
  let matching = 0
  let shortUnits = 0
  let extraUnits = 0
  let countedValue = 0
  let valueDelta = 0
  let priced = false
  for (const item of items) {
    const counted = parseNumber(item.counted)
    if (counted === null) continue
    countedRows += 1
    const cost = parseNumber(item.cost)
    if (cost !== null) {
      priced = true
      countedValue += counted * cost
    }
    const expected = parseNumber(item.expected)
    if (expected === null) continue
    const delta = counted - expected
    if (delta === 0) {
      matching += 1
      continue
    }
    if (delta < 0) shortUnits -= delta
    else extraUnits += delta
    if (cost !== null) valueDelta += delta * cost
    differences.push({ item, expected, counted, delta, value: cost === null ? null : delta * cost })
  }
  return {
    rows: items.length,
    countedRows,
    matching,
    shortUnits,
    extraUnits,
    countedValue: priced ? countedValue : null,
    valueDelta: priced ? valueDelta : null,
    differences,
  }
}

const markOf = (id: MarkId | '') => MARKS.find((mark) => mark.id === id)

const csvCell = (value: string | number) => {
  if (typeof value === 'number') return String(value)
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
}

const CSV_COLUMNS = [
  'גיליון',
  'מס׳',
  'מק״ט',
  'תיאור הפריט',
  'סימון',
  'מספר סידורי',
  'יחידת מידה',
  'כמות רשומה',
  'כמות שנספרה',
  'הפרש',
  'עלות ליחידה',
  'שווי שנספר',
]

export function countCsv(settings: CountSettings, items: CountItem[]): string {
  const firstSheet = firstSheetNumber(settings.firstSheet) ?? 1
  const sheetOf = (index: number) => firstSheet + Math.floor(index / settings.rowsPerSheet)
  const orBlank = (value: number | null) => (value === null ? '' : Number(value.toFixed(3)))
  const body = items.length
    ? items.map((item, index) => {
        const expected = parseNumber(item.expected)
        const counted = parseNumber(item.counted)
        const cost = parseNumber(item.cost)
        return [
          sheetOf(index),
          index + 1,
          item.sku,
          item.name,
          markOf(item.mark)?.label ?? '',
          item.serial,
          item.unit,
          orBlank(expected),
          orBlank(counted),
          orBlank(expected === null || counted === null ? null : counted - expected),
          orBlank(cost),
          orBlank(counted === null || cost === null ? null : counted * cost),
        ]
      })
    : Array.from({ length: TEMPLATE_ROWS }, (_, index) => [
        sheetOf(index),
        index + 1,
        ...CSV_COLUMNS.slice(2).map(() => ''),
      ])
  const lines: (string | number)[][] = [
    ['רשימת מפקד המצאי (ספירת מלאי)'],
    ['שם העסק', settings.business.trim()],
    ['מספר עוסק או ח.פ.', settings.taxId.trim()],
    ['תאריך הספירה', displayDate(settings.date)],
    ['יום המאזן', displayDate(balanceDateFor(settings.date))],
    ['מקום האחסון', settings.location.trim()],
    ['שמות הפוקדים', counterNames(settings.counters).join(', ')],
    [`סימון: ${MARKS.map((mark) => mark.label).join(', ')}`],
    [],
    CSV_COLUMNS,
    ...body,
  ]
  return `${UTF8_BOM}${lines.map((line) => line.map(csvCell).join(',')).join('\r\n')}\r\n`
}

const htmlEntities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => htmlEntities[char])

const printCss = `@page{size:A4 portrait;margin:10mm}
*{box-sizing:border-box}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{margin:0;color:#1a1f33;font:10.5px/1.3 Arial,"Segoe UI",Helvetica,sans-serif}
.sheet{display:flex;flex-direction:column;height:276mm;overflow:hidden;break-after:page;page-break-after:always}
.sheet:last-child{break-after:auto;page-break-after:auto}
.head{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;padding-bottom:5px;border-bottom:2px solid #1a1f33}
h1{margin:0;font-size:17px;line-height:1.2}
.number{margin:0;font-size:13px;font-weight:700;white-space:nowrap}
.facts{display:grid;grid-template-columns:auto 1fr auto 1fr;gap:5px 8px;margin:6px 0;font-size:11px}
.facts dt{color:#4a4f63;white-space:nowrap}
.facts dd{margin:0;min-height:15px;border-bottom:1px solid #8a8f9f;font-weight:700;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.facts .wide{grid-column:2 / -1}
table{width:100%;border-collapse:collapse;table-layout:fixed;font-variant-numeric:tabular-nums}
table.tight{font-size:9.5px}
th,td{padding:0 3px;border:1px solid #b9b4ac;text-align:center;vertical-align:middle;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
thead th{height:9mm;padding:2px;background:#ece8e2;font-size:9px;line-height:1.15;white-space:normal}
td.name{text-align:start}
.legend{margin:4px 0 0;color:#4a4f63;font-size:9px}
.sign{display:grid;grid-template-columns:1fr 1fr;gap:6mm 14mm;margin-top:auto;padding-top:5mm}
.sign div{display:grid;grid-template-columns:auto 1fr auto 1fr;align-items:end;gap:6px;font-size:10.5px}
.sign span{color:#4a4f63;white-space:nowrap}
.sign b{display:block;min-height:15px;border-bottom:1px solid #1a1f33;font-weight:700;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.foot{display:flex;justify-content:space-between;gap:12px;margin-top:3mm;color:#6b7083;font-size:8.5px}
@media screen{body{max-width:210mm;margin:16px auto;padding:0 12px}.sheet{height:auto;min-height:276mm;margin-bottom:24px}}`

type PrintColumn = { key: string; head: string; width: number; tight: number; cell: (item: CountItem) => string }

function printColumns(settings: CountSettings, mode: PrintMode): PrintColumn[] {
  const text = (value: string) => escapeHtml(value.trim())
  const ltr = (value: string) => `<span dir="ltr">${text(value)}</span>`
  const result = mode === 'result'
  const showExpected = settings.showExpected && mode !== 'blank'
  const delta = (item: CountItem) => {
    const expected = parseNumber(item.expected)
    const counted = parseNumber(item.counted)
    if (expected === null || counted === null || counted === expected) return ''
    return `<span dir="ltr">${counted > expected ? '+' : ''}${formatQuantity(counted - expected)}</span>`
  }
  const money = (value: number | null) => (value === null ? '' : formatMoney(value))
  const value = (item: CountItem) => {
    const counted = parseNumber(item.counted)
    const cost = parseNumber(item.cost)
    return counted === null || cost === null ? null : counted * cost
  }
  const columns: (PrintColumn | false)[] = [
    settings.showSku && { key: 'sku', head: 'מק״ט', width: 25, tight: 20, cell: (item) => ltr(item.sku) },
    { key: 'name', head: 'תיאור הפריט', width: 0, tight: 0, cell: (item) => text(item.name) },
    { key: 'mark', head: 'סימון', width: 11, tight: 9, cell: (item) => markOf(item.mark)?.code ?? '' },
    settings.showSerial && {
      key: 'serial',
      head: 'יצרן ומספר סידורי',
      width: 25,
      tight: 22,
      cell: (item) => ltr(item.serial),
    },
    { key: 'unit', head: 'יחידת מידה', width: 14, tight: 11, cell: (item) => text(item.unit) },
    showExpected && {
      key: 'expected',
      head: 'כמות רשומה',
      width: 17,
      tight: 14,
      cell: (item) => numberText(item.expected),
    },
    {
      key: 'counted',
      head: 'כמות שנספרה',
      width: 17,
      tight: 14,
      cell: (item) => (result ? numberText(item.counted) : ''),
    },
    showExpected && result && { key: 'delta', head: 'הפרש', width: 17, tight: 14, cell: delta },
    settings.showCost && {
      key: 'cost',
      head: 'עלות ליחידה',
      width: 17,
      tight: 15,
      cell: (item) => money(parseNumber(item.cost)),
    },
    settings.showCost && {
      key: 'value',
      head: 'שווי',
      width: 19,
      tight: 17,
      cell: (item) => (result ? money(value(item)) : ''),
    },
    { key: 'note', head: 'הערות', width: 23, tight: 23, cell: () => '' },
  ]
  return columns.filter((column): column is PrintColumn => column !== false)
}

function fitColumns(columns: PrintColumn[]) {
  const nameWidth = (list: PrintColumn[]) =>
    PRINTABLE_WIDTH_MM - NUMBER_WIDTH_MM - list.reduce((sum, column) => sum + column.width, 0)
  if (nameWidth(columns) >= MIN_NAME_WIDTH_MM) return { columns, tight: false }
  const withoutNotes = columns.filter((column) => column.key !== 'note')
  return { columns: withoutNotes, tight: nameWidth(withoutNotes) < MIN_NAME_WIDTH_MM }
}

export function sheetDocument(settings: CountSettings, items: CountItem[], mode: PrintMode): string {
  const { columns, tight } = fitColumns(printColumns(settings, mode))
  const firstSheet = firstSheetNumber(settings.firstSheet) ?? 1
  const sheets = buildSheets(mode === 'blank' ? [] : items, settings.rowsPerSheet, settings.blankSheets, firstSheet)
  const rowHeight = ROW_HEIGHT_MM[settings.rowsPerSheet] ?? ROW_HEIGHT_MM[25]
  const names = counterNames(settings.counters)
  const signatures = Array.from({ length: Math.max(2, names.length) }, (_, index) => names[index] ?? '')
  const balance = displayDate(balanceDateFor(settings.date))
  const fact = (term: string, value: string, wide = false) =>
    `<dt>${term}</dt><dd${wide ? ' class="wide"' : ''}>${escapeHtml(value.trim())}</dd>`
  const widthOf = (column: PrintColumn) => (tight ? column.tight : column.width)
  const cols = columns
    .map((column) => (column.key === 'name' ? '<col>' : `<col style="width:${widthOf(column)}mm">`))
    .join('')
  const head = columns.map((column) => `<th scope="col">${column.head}</th>`).join('')
  const legend = MARKS.map((mark) => `${mark.code} = ${mark.label}`).join(' · ')
  const sign = signatures
    .map((name) => `<div><span>שם הפוקד</span><b>${escapeHtml(name)}</b><span>חתימה</span><b></b></div>`)
    .join('')
  const pages = sheets
    .map((sheet) => {
      const rows = sheet.rows
        .map((item, index) => {
          const cells = columns
            .map((column) => `<td${column.key === 'name' ? ' class="name"' : ''}>${item ? column.cell(item) : ''}</td>`)
            .join('')
          return `<tr style="height:${rowHeight}mm"><td>${sheet.firstRow + index}</td>${cells}</tr>`
        })
        .join('\n')
      const label = sheetLabel(sheet)
      return `<section class="sheet">
<header class="head"><h1>רשימת מפקד המצאי (ספירת מלאי)</h1><p class="number">${label}</p></header>
<dl class="facts">${fact('שם העסק', settings.business)}${fact('מספר עוסק או ח.פ.', settings.taxId)}${fact('תאריך הספירה', displayDate(settings.date))}${fact('יום המאזן', balance)}${fact('מקום האחסון', settings.location, true)}</dl>
<table${tight ? ' class="tight"' : ''}>
<colgroup><col style="width:${NUMBER_WIDTH_MM}mm">${cols}</colgroup>
<thead><tr><th scope="col">מס׳</th>${head}</tr></thead>
<tbody>
${rows}
</tbody>
</table>
<p class="legend">סימון: ${legend}. לטובין של אחרים רושמים גם את שם הבעלים.</p>
<section class="sign">${sign}</section>
<p class="foot"><span>${label}</span><span>נוצר בכלי ספירת המלאי של AITERRA: ${GENERATOR_URL}</span></p>
</section>`
    })
    .join('\n')
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>רשימת מפקד המצאי ${escapeHtml(displayDate(settings.date))}</title>
<style>${printCss}</style>
</head>
<body>
${pages}
</body>
</html>`
}
