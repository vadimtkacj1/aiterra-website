import {
  MIN_RETAIL_X,
  NOMINAL_X,
  barcodeSvg,
  encode,
  layoutBarcode,
  parseValue,
  roundTo,
  type BarcodeSettings,
  type Symbology,
} from './barcode'
import { parseNumber } from './inventory-count'

export type LabelItem = {
  id: number
  name: string
  variant: string
  price: string
  sku: string
  barcode: string
  stock: string
}

export type ItemText = Exclude<keyof LabelItem, 'id'>

export type SheetSpec = {
  columns: number
  rows: number
  labelWidth: number
  labelHeight: number
  marginTop: number
  marginSide: number
}

export type SheetPreset = SheetSpec & { id: string; label: string; group: 'avery' | 'full' }

export type CustomSheet = Record<keyof SheetSpec, string>

export type CopiesMode = 'one' | 'fixed' | 'stock'

export type LabelSettings = {
  sheetId: string
  custom: CustomSheet
  skip: string
  offsetX: string
  offsetY: string
  headline: string
  showName: boolean
  showVariant: boolean
  showPrice: boolean
  showSku: boolean
  showBarcode: boolean
  copiesMode: CopiesMode
  copies: string
}

export type SheetLayout =
  | { status: 'ok'; spec: SheetSpec; gapX: number; gapY: number; perPage: number }
  | { status: 'invalid'; error: string }

export type ColumnRole = 'name' | 'variant' | 'price' | 'sku' | 'barcode' | 'stock'
export type ColumnMap = Partial<Record<ColumnRole, number>>

export type SkipReason = 'parent' | 'empty' | 'noProduct'

export type ImportResult = {
  items: LabelItem[]
  read: number
  skipped: Record<SkipReason, number>
  salePrices: number
  truncated: number
}

export type FileStructure = {
  handle?: number
  type?: number
  options: number[]
  salePrice?: number
  regularPrice?: number
}

export type HeaderMatch = { index: number; map: ColumnMap; structure: FileStructure }

export type BarcodeChoice =
  | { status: 'none' }
  | { status: 'ok'; symbology: Symbology; data: string; fromSku: boolean; invalidBarcode: boolean }
  | { status: 'invalid'; error: string }

export type LabelPlan = {
  pad: number
  gap: number
  headline: number
  name: number
  nameLines: number
  variant: number
  price: number
  sku: number
  barcode: number
  dropped: PlanPart[]
}

export type PlanPart = 'headline' | 'name' | 'variant' | 'price' | 'sku' | 'barcode' | 'nameLine'

export type FittedText = { text: string; cut: boolean }

export type RenderedLabel = {
  item: LabelItem
  headline: FittedText | null
  name: FittedText | null
  variant: FittedText | null
  price: { text: string; size: number } | null
  sku: FittedText | null
  barcode: { svg: string; xMm: number; symbology: Symbology; narrow: boolean } | null
  barcodeProblem: 'invalid' | 'noRoom' | null
  invalidBarcodeValue: boolean
}

export type LabelReport = {
  labels: number
  pages: number
  items: number
  cutNames: number
  cutOther: number
  noPrice: number
  noBarcode: number
  invalidBarcodes: number
  narrowBarcodes: number
  zeroStock: number
  noStock: number
  limited: boolean
  dropped: PlanPart[]
  examples: string[]
}

export type LabelSheet = { html: string; report: LabelReport }

export const GENERATOR_URL = 'https://www.aiterra.co.il/tools/price-labels'
export const A4_WIDTH = 210
export const A4_HEIGHT = 297
export const MAX_ITEMS = 2000
export const MAX_LABELS = 3000
export const MAX_COPIES = 500
export const MAX_OFFSET = 10
export const CUSTOM_SHEET = 'custom'
export const COLUMN_ROLES: ColumnRole[] = ['name', 'variant', 'price', 'sku', 'barcode', 'stock']

export const ROLE_LABELS: Record<ColumnRole, string> = {
  name: 'שם המוצר',
  variant: 'וריאנט (מידה, צבע)',
  price: 'מחיר',
  sku: 'מק״ט',
  barcode: 'ברקוד',
  stock: 'כמות במלאי',
}

export const SKIP_LABELS: Record<SkipReason, string> = {
  parent: 'מוצר אב של וריאציות ב-WooCommerce (הווריאציות עצמן נכנסו)',
  empty: 'שורה בלי שם, מק״ט, ברקוד או מחיר, למשל שורת תמונה נוספת ב-Shopify',
  noProduct: 'מוצר מקובץ WooCommerce מסוג קבוצה או מוצר חיצוני',
}

export const PART_LABELS: Record<PlanPart, string> = {
  headline: 'שורת הכותרת',
  name: 'שם המוצר',
  nameLine: 'שורה שנייה לשם המוצר',
  variant: 'הווריאנט',
  price: 'המחיר',
  sku: 'המק״ט',
  barcode: 'הברקוד',
}

export const SHEET_PRESETS: SheetPreset[] = [
  avery('L7160', 3, 7, 63.5, 38.1, 15.15),
  avery('L7159', 3, 8, 63.5, 33.9, 12.9),
  avery('L7163', 2, 7, 99.1, 38.1, 15.15),
  avery('L7651', 5, 13, 38.1, 21.2, 10.7),
  fullSheet(3, 8),
  fullSheet(3, 7),
  fullSheet(2, 8),
  fullSheet(4, 10),
  fullSheet(2, 4),
]

export const DEFAULT_SHEET = SHEET_PRESETS[0].id

const LINE_HEIGHT = 1.15
const MIN_PAD = 1.2
const MAX_PAD = 2.5
const BLOCK_GAP = 0.5
const SHRINK_STEP = 0.92
const MIN_BAR_HEIGHT = 4
const BARCODE_RESERVE = 3.2
const ELLIPSIS = '…'
const HEADER_SCAN_ROWS = 15
const DEFAULT_OPTION = 'default title'
const BOLD_FACTOR = 1.08
const SAFETY = 1.06
const MAX_EXAMPLES = 5
const PAGE_HEIGHT = 296.8
const UTF8_BOM = /^﻿/
const HEBREW = /[֐-׿]/
const LATIN_UPPER = /[A-Z]/
const DIGIT = /\d/
const NARROW = /[.,:;'|!il1\s״׳"()-]/

const SIZES = {
  headline: { ratio: 0.075, min: 1.9, max: 2.8 },
  name: { ratio: 0.11, min: 2.2, max: 4.2 },
  variant: { ratio: 0.075, min: 1.9, max: 2.8 },
  price: { ratio: 0.2, min: 3.2, max: 9 },
  sku: { ratio: 0.07, min: 1.8, max: 2.6 },
  barcode: { ratio: 0.3, min: MIN_BAR_HEIGHT, max: 14 },
} as const

const DROP_ORDER: PlanPart[] = ['headline', 'variant', 'sku', 'nameLine', 'barcode', 'name']

const HEADER_NAMES: Record<ColumnRole, string[]> = {
  name: ['title', 'name', 'שם', 'שם המוצר', 'שם מוצר', 'מוצר', 'תיאור', 'תיאור הפריט'],
  variant: ['variant', 'וריאנט', 'וריאציה'],
  price: ['price', 'variant price', 'מחיר', 'מחיר לצרכן', 'מחיר מכירה'],
  sku: ['sku', 'variant sku', 'מק"ט', 'מקט', 'קוד פריט', 'קוד מוצר'],
  barcode: ['barcodes', 'barcode', 'variant barcode', 'ברקוד'],
  stock: ['inventory quantity', 'variant inventory qty', 'stock', 'מלאי', 'כמות', 'כמות במלאי'],
}

const SKIPPED_TYPES: Record<string, SkipReason> = {
  variable: 'parent',
  grouped: 'noProduct',
  external: 'noProduct',
}

function avery(code: string, columns: number, rows: number, width: number, height: number, top: number): SheetPreset {
  const gap = columns > 1 ? 2.5 : 0
  const side = roundTo((A4_WIDTH - columns * width - (columns - 1) * gap) / 2, 2)
  return {
    id: code.toLowerCase(),
    label: `${columns * rows} בדף, ${width} × ${height} מ״מ (כמו Avery ${code})`,
    group: 'avery',
    columns,
    rows,
    labelWidth: width,
    labelHeight: height,
    marginTop: top,
    marginSide: side,
  }
}

function fullSheet(columns: number, rows: number): SheetPreset {
  const width = roundTo(A4_WIDTH / columns, 2)
  const height = roundTo(A4_HEIGHT / rows, 2)
  return {
    id: `full-${columns}x${rows}`,
    label: `${columns * rows} בדף, ${columns} × ${rows}, בלי שוליים (${width} × ${height} מ״מ)`,
    group: 'full',
    columns,
    rows,
    labelWidth: width,
    labelHeight: height,
    marginTop: 0,
    marginSide: 0,
  }
}

export const defaultCustom = (): CustomSheet => ({
  columns: '3',
  rows: '8',
  labelWidth: '70',
  labelHeight: '37',
  marginTop: '0.5',
  marginSide: '0',
})

export const defaultSettings = (): LabelSettings => ({
  sheetId: DEFAULT_SHEET,
  custom: defaultCustom(),
  skip: '0',
  offsetX: '0',
  offsetY: '0',
  headline: '',
  showName: true,
  showVariant: true,
  showPrice: true,
  showSku: false,
  showBarcode: true,
  copiesMode: 'one',
  copies: '1',
})

export const emptyItem = (id: number): LabelItem => ({
  id,
  name: '',
  variant: '',
  price: '',
  sku: '',
  barcode: '',
  stock: '',
})

const toNumber = (value: string) => {
  const parsed = parseNumber(value)
  return parsed === null ? NaN : parsed
}

function readCustom(custom: CustomSheet): SheetSpec | string {
  const spec = {
    columns: toNumber(custom.columns),
    rows: toNumber(custom.rows),
    labelWidth: toNumber(custom.labelWidth),
    labelHeight: toNumber(custom.labelHeight),
    marginTop: toNumber(custom.marginTop),
    marginSide: toNumber(custom.marginSide),
  }
  if (!Number.isInteger(spec.columns) || spec.columns < 1 || spec.columns > 10) return 'מספר העמודות: מספר שלם בין 1 ל-10.'
  if (!Number.isInteger(spec.rows) || spec.rows < 1 || spec.rows > 30) return 'מספר השורות: מספר שלם בין 1 ל-30.'
  if (!(spec.labelWidth >= 15) || !(spec.labelHeight >= 10)) return 'מדבקה קטנה מ-15 × 10 מ״מ לא מתאימה למחיר ולשם מוצר.'
  if (!(spec.marginTop >= 0) || !(spec.marginSide >= 0)) return 'השוליים: 0 או יותר, במילימטרים.'
  return spec
}

export function sheetLayout(settings: Pick<LabelSettings, 'sheetId' | 'custom'>): SheetLayout {
  const preset = SHEET_PRESETS.find((sheet) => sheet.id === settings.sheetId)
  const spec = preset ?? readCustom(settings.custom)
  if (typeof spec === 'string') return { status: 'invalid', error: spec }
  const freeWidth = A4_WIDTH - 2 * spec.marginSide - spec.columns * spec.labelWidth
  const freeHeight = A4_HEIGHT - 2 * spec.marginTop - spec.rows * spec.labelHeight
  if (freeWidth < -0.05 || freeHeight < -0.05) {
    return {
      status: 'invalid',
      error: `המדבקות והשוליים לא נכנסים בדף A4 (210 × 297 מ״מ). חסרים ${roundTo(Math.max(-freeWidth, -freeHeight), 1)} מ״מ. בדקו את המידות.`,
    }
  }
  const gapX = spec.columns > 1 ? Math.max(0, freeWidth) / (spec.columns - 1) : 0
  const gapY = spec.rows > 1 ? Math.max(0, freeHeight) / (spec.rows - 1) : 0
  return { status: 'ok', spec, gapX: roundTo(gapX, 3), gapY: roundTo(gapY, 3), perPage: spec.columns * spec.rows }
}

export function labelPosition(index: number, layout: Extract<SheetLayout, { status: 'ok' }>) {
  const { spec, gapX, gapY } = layout
  const row = Math.floor(index / spec.columns)
  const column = index % spec.columns
  return {
    left: roundTo(spec.marginSide + (spec.columns - 1 - column) * (spec.labelWidth + gapX), 3),
    top: roundTo(spec.marginTop + row * (spec.labelHeight + gapY), 3),
  }
}

export function clampInteger(value: string, min: number, max: number, fallback: number) {
  const parsed = parseNumber(value)
  if (parsed === null || !Number.isFinite(parsed)) return fallback
  return Math.min(max, Math.max(min, Math.round(parsed)))
}

export function clampOffset(value: string) {
  const parsed = parseNumber(value)
  if (parsed === null) return 0
  return Math.min(MAX_OFFSET, Math.max(-MAX_OFFSET, parsed))
}

export function formatPrice(value: string): string | null {
  const parsed = parseNumber(value)
  if (parsed === null || parsed < 0) return null
  const whole = Math.round(parsed * 100) % 100 === 0
  const text = parsed.toLocaleString('en-US', {
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  })
  return `${text} ₪`
}

const normalizeHeader = (value: string) =>
  value
    .replace(UTF8_BOM, '')
    .replace(/[״”“]/g, '"')
    .replace(/[׳’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

function exactColumns(header: string[]) {
  const names = header.map(normalizeHeader)
  const map: ColumnMap = {}
  const taken = new Set<number>()
  for (const role of COLUMN_ROLES) {
    for (const hint of HEADER_NAMES[role]) {
      const index = names.findIndex((name, column) => !taken.has(column) && name === hint)
      if (index === -1) continue
      map[role] = index
      taken.add(index)
      break
    }
  }
  const indexOf = (...candidates: string[]) => {
    const index = names.findIndex((name) => candidates.includes(name))
    return index === -1 ? undefined : index
  }
  const structure: FileStructure = {
    handle: indexOf('url handle', 'handle'),
    type: indexOf('type'),
    options: names.flatMap((name, index) => (/^option[1-3] value$/.test(name) ? [index] : [])),
    salePrice: indexOf('sale price'),
    regularPrice: indexOf('regular price'),
  }
  if (map.price === undefined && structure.regularPrice !== undefined) map.price = structure.regularPrice
  return { map, structure }
}

const hasNumber = (row: string[]) => row.some((value) => value.trim() !== '' && parseNumber(value) !== null)

export function findHeader(rows: string[][]): HeaderMatch | null {
  for (const [index, row] of rows.slice(0, HEADER_SCAN_ROWS).entries()) {
    if (hasNumber(row)) continue
    const { map, structure } = exactColumns(row)
    if (map.name !== undefined || map.sku !== undefined) return { index, map, structure }
  }
  return null
}

export const isCompleteHeader = (match: HeaderMatch) => match.map.price !== undefined

export const mayBeHeader = (row: string[]) => row.length > 0 && !hasNumber(row)

export const headerStructure = (header: string[]): FileStructure => exactColumns(header).structure

export const guessColumns = (header: string[]): ColumnMap => exactColumns(header).map

const cellAt = (row: string[], index: number | undefined) => (index === undefined ? '' : (row[index] ?? '').trim())

export function firstBarcode(value: string) {
  const parts: string[] = []
  let current = ''
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index]
    if (char === '\\' && index + 1 < value.length) {
      current += value[index + 1]
      index += 1
    } else if (char === ';') {
      parts.push(current)
      current = ''
    } else if (char === ':') current = ''
    else current += char
  }
  parts.push(current)
  return parts.map((part) => part.trim()).find(Boolean) ?? ''
}

const numberText = (value: string) => {
  const parsed = parseNumber(value)
  return parsed === null ? value.trim() : String(Number(parsed.toFixed(2)))
}

export function tableToItems(
  rows: string[][],
  map: ColumnMap,
  headerIndex: number | null,
  firstId: number,
  structure: FileStructure = { options: [] },
): ImportResult {
  const titles = new Map<string, string>()
  const result: ImportResult = {
    items: [],
    read: 0,
    skipped: { parent: 0, empty: 0, noProduct: 0 },
    salePrices: 0,
    truncated: 0,
  }
  for (const row of rows.slice(headerIndex === null ? 0 : headerIndex + 1)) {
    result.read += 1
    const skip = SKIPPED_TYPES[cellAt(row, structure.type).toLowerCase()]
    if (skip) {
      result.skipped[skip] += 1
      continue
    }
    const handle = cellAt(row, structure.handle)
    const ownTitle = cellAt(row, map.name)
    if (handle && ownTitle) titles.set(handle, ownTitle)
    const options = structure.options
      .map((index) => cellAt(row, index))
      .filter((value) => value && value.toLowerCase() !== DEFAULT_OPTION)
    const sale = cellAt(row, structure.salePrice)
    const regular = cellAt(row, map.price)
    const usesSale = sale !== '' && parseNumber(sale) !== null
    const price = usesSale ? sale : regular
    const sku = cellAt(row, map.sku)
    const barcode = firstBarcode(cellAt(row, map.barcode))
    const variant = [cellAt(row, map.variant), ...options].filter(Boolean).join(' / ')
    if (!ownTitle && !variant && !sku && !barcode && !price) {
      result.skipped.empty += 1
      continue
    }
    if (result.items.length >= MAX_ITEMS) {
      result.truncated += 1
      continue
    }
    if (usesSale) result.salePrices += 1
    result.items.push({
      id: firstId + result.items.length,
      name: ownTitle || titles.get(handle) || '',
      variant,
      price: price ? numberText(price) : '',
      sku,
      barcode,
      stock: numberText(cellAt(row, map.stock)),
    })
  }
  return result
}

export function chooseBarcode(item: Pick<LabelItem, 'barcode' | 'sku'>): BarcodeChoice {
  const digits = item.barcode.replace(/[\s-]/g, '')
  let invalidBarcode = false
  if (digits) {
    const symbology: Symbology | null =
      digits.length === 13 ? 'ean13' : digits.length === 12 ? 'upca' : digits.length === 8 ? 'ean8' : null
    const parsed = symbology ? parseValue(symbology, digits) : parseValue('code128', item.barcode)
    if (parsed.status === 'valid') {
      return { status: 'ok', symbology: symbology ?? 'code128', data: parsed.data, fromSku: false, invalidBarcode }
    }
    invalidBarcode = true
  }
  if (item.sku.trim()) {
    const parsed = parseValue('code128', item.sku)
    if (parsed.status === 'valid') {
      return { status: 'ok', symbology: 'code128', data: parsed.data, fromSku: true, invalidBarcode }
    }
    return { status: 'invalid', error: parsed.status === 'invalid' ? parsed.error : '' }
  }
  return invalidBarcode ? { status: 'invalid', error: 'ברקוד לא תקין' } : { status: 'none' }
}

function charWidth(char: string) {
  if (DIGIT.test(char)) return 0.56
  if (NARROW.test(char)) return 0.3
  if (char === '₪') return 0.8
  if (HEBREW.test(char)) return 0.62
  if (LATIN_UPPER.test(char)) return 0.72
  if (/[a-z]/.test(char)) return 0.56
  return 0.75
}

export function textWidth(text: string, size: number, bold = false) {
  let total = 0
  for (const char of text) total += charWidth(char)
  return total * size * (bold ? BOLD_FACTOR : 1) * SAFETY
}

function splitWord(word: string, width: number, size: number, bold: boolean) {
  const pieces: string[] = []
  let current = ''
  for (const char of word) {
    if (current && textWidth(current + char, size, bold) > width) {
      pieces.push(current)
      current = char
    } else current += char
  }
  if (current) pieces.push(current)
  return pieces
}

export function wrapText(text: string, width: number, size: number, bold = false) {
  const lines: string[] = []
  let current = ''
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = current ? `${current} ${word}` : word
    if (textWidth(candidate, size, bold) <= width) {
      current = candidate
      continue
    }
    if (current) lines.push(current)
    if (textWidth(word, size, bold) <= width) {
      current = word
      continue
    }
    const pieces = splitWord(word, width, size, bold)
    lines.push(...pieces.slice(0, -1))
    current = pieces[pieces.length - 1] ?? ''
  }
  if (current) lines.push(current)
  return lines
}

export function fitText(text: string, width: number, size: number, maxLines: number, bold = false): FittedText {
  const clean = text.replace(/\s+/g, ' ').trim()
  const lines = wrapText(clean, width, size, bold)
  if (lines.length <= maxLines) return { text: clean, cut: false }
  const kept = lines.slice(0, maxLines)
  let last = kept[maxLines - 1]
  while (last && textWidth(`${last}${ELLIPSIS}`, size, bold) > width) last = last.slice(0, -1).trimEnd()
  kept[maxLines - 1] = `${last}${ELLIPSIS}`
  return { text: kept.join(' '), cut: true }
}

const sizeFor = (part: keyof typeof SIZES, height: number, scale: number) => {
  const { ratio, min, max } = SIZES[part]
  return Math.max(min, Math.min(max, height * ratio) * scale)
}

export type PlanInput = {
  width: number
  height: number
  headline: boolean
  name: boolean
  variant: boolean
  price: boolean
  sku: boolean
  barcode: boolean
}

function planHeight(plan: LabelPlan) {
  const blocks = [
    plan.headline * LINE_HEIGHT,
    plan.name * LINE_HEIGHT * plan.nameLines,
    plan.variant * LINE_HEIGHT,
    plan.price * LINE_HEIGHT,
    plan.sku * LINE_HEIGHT,
    plan.barcode ? plan.barcode + BARCODE_RESERVE : 0,
  ].filter((value) => value > 0)
  return blocks.reduce((sum, value) => sum + value, 0) + Math.max(0, blocks.length - 1) * plan.gap
}

export function planLabel(input: PlanInput): LabelPlan {
  const pad = Math.max(MIN_PAD, Math.min(MAX_PAD, Math.min(input.width, input.height) * 0.06))
  const inner = input.height - 2 * pad
  const wanted = (part: Exclude<PlanPart, 'nameLine'>) => input[part]
  const build = (scale: number, dropped: PlanPart[]): LabelPlan => {
    const on = (part: Exclude<PlanPart, 'nameLine'>) => wanted(part) && !dropped.includes(part)
    return {
      pad,
      gap: BLOCK_GAP,
      headline: on('headline') ? sizeFor('headline', input.height, scale) : 0,
      name: on('name') ? sizeFor('name', input.height, scale) : 0,
      nameLines: dropped.includes('nameLine') ? 1 : 2,
      variant: on('variant') ? sizeFor('variant', input.height, scale) : 0,
      price: on('price') ? sizeFor('price', input.height, scale) : 0,
      sku: on('sku') ? sizeFor('sku', input.height, scale) : 0,
      barcode: on('barcode') ? sizeFor('barcode', input.height, scale) : 0,
      dropped,
    }
  }
  let scale = 1
  const dropped: PlanPart[] = []
  let plan = build(scale, dropped)
  while (planHeight(plan) > inner) {
    const atMinimum = scale <= 0.35
    if (!atMinimum) {
      const next = build(scale * SHRINK_STEP, dropped)
      if (planHeight(next) < planHeight(plan)) {
        scale *= SHRINK_STEP
        plan = next
        continue
      }
    }
    const part = DROP_ORDER.find(
      (candidate) =>
        !dropped.includes(candidate) && (candidate === 'nameLine' ? wanted('name') : wanted(candidate)),
    )
    if (!part) break
    dropped.push(part)
    plan = build(scale, dropped)
  }
  while (scale < 1) {
    const larger = Math.min(1, scale / SHRINK_STEP)
    const next = build(larger, dropped)
    if (planHeight(next) > inner) break
    scale = larger
    plan = next
  }
  return plan
}

const BARCODE_BASE: BarcodeSettings = {
  xMm: NOMINAL_X,
  heightMm: 10,
  showText: true,
  quietZone: true,
  dark: '#000000',
  light: '#ffffff',
}

function renderBarcode(choice: Extract<BarcodeChoice, { status: 'ok' }>, width: number, room: number) {
  const encoded = encode(choice.symbology, choice.data)
  const probe = layoutBarcode(encoded, { ...BARCODE_BASE, xMm: 1, heightMm: 1 })
  const xMm = Math.min(NOMINAL_X, width / probe.width)
  const extra = (probe.height - 1) * xMm
  const heightMm = room - extra
  if (heightMm < MIN_BAR_HEIGHT) return null
  const layout = layoutBarcode(encoded, { ...BARCODE_BASE, xMm, heightMm })
  return {
    svg: barcodeSvg(layout, BARCODE_BASE, `ברקוד ${choice.data}`),
    xMm: roundTo(xMm, 3),
    symbology: choice.symbology,
    narrow: xMm < MIN_RETAIL_X,
  }
}

export function renderLabel(item: LabelItem, plan: LabelPlan, width: number, headline: string): RenderedLabel {
  const inner = width - 2 * plan.pad
  const fit = (text: string, size: number, lines = 1, bold = false) =>
    size > 0 && text.trim() ? fitText(text, inner, size, lines, bold) : null
  const priceText = plan.price ? formatPrice(item.price) : null
  const priceSize = priceText ? Math.min(plan.price, inner / textWidth(priceText, 1, true)) : 0
  const choice = plan.barcode ? chooseBarcode(item) : ({ status: 'none' } as BarcodeChoice)
  const barcode =
    choice.status === 'ok' ? renderBarcode(choice, inner, plan.barcode + BARCODE_RESERVE) : null
  const skuShown = plan.sku > 0 && !(barcode && choice.status === 'ok' && choice.fromSku)
  return {
    item,
    headline: fit(headline, plan.headline),
    name: fit(item.name || item.sku, plan.name, plan.nameLines, true),
    variant: fit(item.variant, plan.variant),
    price: priceText ? { text: priceText, size: roundTo(priceSize, 2) } : null,
    sku: skuShown ? fit(item.sku, plan.sku) : null,
    barcode,
    barcodeProblem: choice.status === 'invalid' ? 'invalid' : choice.status === 'ok' && !barcode ? 'noRoom' : null,
    invalidBarcodeValue: choice.status === 'ok' ? choice.invalidBarcode : choice.status === 'invalid',
  }
}

export function copiesFor(item: LabelItem, settings: Pick<LabelSettings, 'copiesMode' | 'copies'>) {
  if (settings.copiesMode === 'one') return { copies: 1, stock: 'counted' as const }
  if (settings.copiesMode === 'fixed') return { copies: clampInteger(settings.copies, 1, MAX_COPIES, 1), stock: 'counted' as const }
  const stock = parseNumber(item.stock)
  if (stock === null) return { copies: 1, stock: 'missing' as const }
  if (stock <= 0) return { copies: 0, stock: 'zero' as const }
  return { copies: Math.min(MAX_COPIES, Math.floor(stock)), stock: 'counted' as const }
}

const htmlEntities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => htmlEntities[char])

const mm = (value: number) => `${roundTo(value, 2)}mm`

function textBlock(kind: string, text: FittedText | null, size: number, lines = 1) {
  if (!text) return ''
  const style = `font-size:${mm(size)};max-height:${mm(size * LINE_HEIGHT * lines + 0.2)}`
  return `<p class="${kind}" dir="auto" style="${style}">${escapeHtml(text.text)}</p>`
}

function labelHtml(label: RenderedLabel, plan: LabelPlan) {
  const parts = [
    textBlock('headline', label.headline, plan.headline),
    textBlock('name', label.name, plan.name, plan.nameLines),
    textBlock('variant', label.variant, plan.variant),
    label.price
      ? `<p class="price" dir="ltr" style="font-size:${mm(label.price.size)}">${escapeHtml(label.price.text)}</p>`
      : '',
    textBlock('sku', label.sku, plan.sku),
    label.barcode ? `<div class="code">${label.barcode.svg}</div>` : '',
  ]
  return parts.join('')
}

const SCREEN_CSS = '@media screen{html,body{background:#e9e6e1}.page{margin:8mm auto;background:#fff;box-shadow:0 2px 14px #0003}}'
const PREVIEW_CSS = 'html,body{overflow:hidden}.page{margin:0;background:#fff}'

const sheetCss = (plan: LabelPlan, outline: boolean, preview: boolean) =>
  [
    '@page{size:A4;margin:0}',
    '*{box-sizing:border-box}',
    'html,body{margin:0;padding:0;background:#fff}',
    `body{color:#000;font-family:Arial,"Segoe UI",Helvetica,sans-serif}`,
    `.page{position:relative;width:${A4_WIDTH}mm;height:${PAGE_HEIGHT}mm;overflow:hidden;break-after:page}`,
    '.page:last-child{break-after:auto}',
    '.shift{position:absolute;inset:0}',
    `.label{position:absolute;overflow:hidden;padding:${mm(plan.pad)};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${mm(plan.gap)};text-align:center}`,
    '.label p{margin:0;width:100%;line-height:1.15;overflow:hidden;overflow-wrap:anywhere;white-space:normal}',
    '.name{font-weight:700}',
    '.price{font-weight:700;white-space:nowrap;font-variant-numeric:tabular-nums}',
    '.headline,.variant,.sku{color:#222}',
    '.code{display:flex;justify-content:center;width:100%}',
    '.code svg{display:block;flex:none}',
    outline ? '.label{outline:0.2mm dashed #888;outline-offset:-0.1mm}' : '',
    preview ? PREVIEW_CSS : SCREEN_CSS,
  ].join('')

export type SheetOptions = { outline?: boolean; maxPages?: number; preview?: boolean }

export function buildSheet(
  items: LabelItem[],
  settings: LabelSettings,
  options: SheetOptions = {},
): LabelSheet | { error: string } {
  const layout = sheetLayout(settings)
  if (layout.status === 'invalid') return { error: layout.error }
  const { spec, perPage } = layout
  const skip = clampInteger(settings.skip, 0, perPage - 1, 0)
  const headline = settings.headline.trim()
  const plan = planLabel({
    width: spec.labelWidth,
    height: spec.labelHeight,
    headline: headline !== '',
    name: settings.showName && items.some((item) => item.name.trim() || item.sku.trim()),
    variant: settings.showVariant && items.some((item) => item.variant.trim()),
    price: settings.showPrice,
    sku: settings.showSku && items.some((item) => item.sku.trim()),
    barcode: settings.showBarcode && items.some((item) => chooseBarcode(item).status === 'ok'),
  })
  const report: LabelReport = {
    labels: 0,
    pages: 0,
    items: 0,
    cutNames: 0,
    cutOther: 0,
    noPrice: 0,
    noBarcode: 0,
    invalidBarcodes: 0,
    narrowBarcodes: 0,
    zeroStock: 0,
    noStock: 0,
    limited: false,
    dropped: plan.dropped,
    examples: [],
  }
  const cells: string[] = []
  for (const item of items) {
    const { copies, stock } = copiesFor(item, settings)
    if (stock === 'zero') report.zeroStock += 1
    if (stock === 'missing') report.noStock += 1
    if (!copies) continue
    const label = renderLabel(item, plan, spec.labelWidth, headline)
    const room = MAX_LABELS - cells.length
    const count = Math.min(copies, room)
    if (count < copies) report.limited = true
    if (count <= 0) break
    report.items += 1
    if (label.name?.cut) {
      report.cutNames += 1
      if (report.examples.length < MAX_EXAMPLES && !report.examples.includes(item.name)) report.examples.push(item.name)
    }
    if (label.variant?.cut || label.headline?.cut || label.sku?.cut) report.cutOther += 1
    if (settings.showPrice && !label.price) report.noPrice += 1
    if (settings.showBarcode && plan.barcode && !label.barcode) report.noBarcode += 1
    if (label.invalidBarcodeValue) report.invalidBarcodes += 1
    if (label.barcode?.narrow) report.narrowBarcodes += 1
    const html = labelHtml(label, plan)
    for (let copy = 0; copy < count; copy += 1) cells.push(html)
  }
  report.labels = cells.length
  const slots = skip + cells.length
  const totalPages = Math.max(1, Math.ceil(slots / perPage))
  report.pages = cells.length ? totalPages : 0
  const offsetX = clampOffset(settings.offsetX)
  const offsetY = clampOffset(settings.offsetY)
  const shown = Math.min(totalPages, options.maxPages ?? totalPages)
  const pages: string[] = []
  for (let page = 0; page < shown; page += 1) {
    const boxes: string[] = []
    for (let slot = 0; slot < perPage; slot += 1) {
      const index = page * perPage + slot - skip
      const content = index >= 0 ? (cells[index] ?? null) : null
      const skipped = index < 0
      if (content === null && !options.outline && !skipped) continue
      const { left, top } = labelPosition(slot, layout)
      const style = `left:${mm(left)};top:${mm(top)};width:${mm(spec.labelWidth)};height:${mm(spec.labelHeight)}`
      const className = skipped ? 'label used' : 'label'
      boxes.push(`<div class="${className}" style="${style}">${content ?? ''}</div>`)
    }
    const shift = `transform:translate(${mm(offsetX)},${mm(offsetY)})`
    pages.push(`<section class="page"><div class="shift" style="${shift}">${boxes.join('')}</div></section>`)
  }
  const usedCss = options.outline ? '.used{background:repeating-linear-gradient(45deg,#eee 0 2mm,#fff 2mm 4mm)}' : ''
  const html = `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>מדבקות מחיר להדפסה</title>
<style>${sheetCss(plan, Boolean(options.outline), Boolean(options.preview))}${usedCss}</style>
</head>
<body>
${pages.join('\n')}
</body>
</html>`
  return { html, report }
}
