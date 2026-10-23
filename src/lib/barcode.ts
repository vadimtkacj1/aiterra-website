export type Symbology = 'ean13' | 'upca' | 'ean8' | 'code128'
export type RetailSymbology = Exclude<Symbology, 'code128'>
export type ColorProblem = 'inverted' | 'low' | 'red' | null

export type BarcodeSettings = {
  xMm: number
  heightMm: number
  showText: boolean
  quietZone: boolean
  dark: string
  light: string
}

export type SheetSettings = {
  columns: number
  rows: number
  pages: number
  marginTop: number
  marginSide: number
  gapX: number
  gapY: number
  sequence: boolean
  outline: boolean
}

export type ParsedValue =
  | { status: 'empty' }
  | { status: 'invalid'; error: string }
  | { status: 'valid'; data: string; notices: string[] }

export type Encoded = { symbology: Symbology; data: string; bits: string }
export type LayoutBar = { x: number; y: number; width: number; height: number }
export type LayoutLabel = { text: string; x: number; y: number; size: number }
export type BarcodeLayout = {
  width: number
  height: number
  xMm: number
  bars: LayoutBar[]
  labels: LayoutLabel[]
}
export type CheckStep = { digit: number; weight: number; product: number }
export type SheetGeometry =
  | { status: 'ok'; labelWidth: number; labelHeight: number }
  | { status: 'invalid'; error: string }
export type SheetValues = { status: 'ok'; values: string[] } | { status: 'invalid'; error: string }
export type SheetFit = { scale: number; width: number; height: number }

export const symbologies: { id: Symbology; label: string; use: string }[] = [
  { id: 'ean13', label: 'EAN-13', use: 'מוצר בחנות, בישראל ובעולם' },
  { id: 'upca', label: 'UPC-A', use: 'מוצר שנמכר בארה״ב ובקנדה' },
  { id: 'ean8', label: 'EAN-8', use: 'אריזה קטנה מאוד' },
  { id: 'code128', label: 'Code 128', use: 'מק״ט פנימי, אותיות וספרות' },
]

export const NOMINAL_X = 0.33
export const MIN_RETAIL_X = 0.264
export const xOptions = [0.264, 0.33, 0.4, 0.5, 0.66]
export const MIN_HEIGHT_MM = 3
export const MAX_HEIGHT_MM = 120
export const MAX_CODE128_LENGTH = 48
export const LONG_CODE128 = 20
export const PRINT_DPI = 300
export const A4 = { width: 210, height: 297 }
export const LABEL_PADDING = 2
export const BARCODE_FONT = "'OCR-B', 'OCRB', Consolas, Menlo, 'DejaVu Sans Mono', 'Courier New', monospace"

type RetailSpec = { length: number; quiet: [number, number]; nominalHeight: number }

const retailSpec: Record<RetailSymbology, RetailSpec> = {
  ean13: { length: 13, quiet: [11, 7], nominalHeight: 22.85 },
  upca: { length: 12, quiet: [9, 9], nominalHeight: 22.85 },
  ean8: { length: 8, quiet: [7, 7], nominalHeight: 18.23 },
}

const CODE128_QUIET = 10
const CODE128_NOMINAL_HEIGHT = 15
const GUARD_EXTENSION = 5
const TEXT_GAP = 1.5
const DIGIT_SIZE = 10
const SMALL_DIGIT_SIZE = 7
const TEXT_BAND = 9.5
const VERTICAL_PAD = 2
const MIN_CONTRAST = 4.5
const MIN_RED_CONTRAST = 0.5
const MIN_LABEL = 8
const HEX_COLOR = /^#[\da-f]{6}$/i
const HEBREW = /[֐-׿]/

const EAN_SET_A = ['3211', '2221', '2122', '1411', '1132', '1231', '1114', '1312', '1213', '3112']
const EAN_PARITY = [
  'AAAAAA', 'AABABB', 'AABBAB', 'AABBBA', 'ABAABB', 'ABBAAB', 'ABBBAA', 'ABABAB', 'ABABBA', 'ABBABA',
]
const NORMAL_GUARD = '101'
const CENTRE_GUARD = '01010'

const CODE128 = [
  '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213',
  '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132',
  '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211',
  '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313',
  '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331',
  '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111',
  '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214',
  '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111',
  '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141',
  '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141',
  '114131', '311141', '411131', '211412', '211214', '211232',
]
const CODE128_STOP = '2331112'
const START_B = 104
const START_C = 105
const CODE_B = 100
const CODE_C = 99

export const defaultValues: Record<Symbology, string> = {
  ean13: '',
  upca: '',
  ean8: '',
  code128: '',
}

export const defaultSettings: BarcodeSettings = {
  xMm: NOMINAL_X,
  heightMm: 22.85,
  showText: true,
  quietZone: true,
  dark: '#000000',
  light: '#ffffff',
}

export const sheetPresets: (Omit<SheetSettings, 'pages' | 'sequence' | 'outline'> & { id: string })[] = [
  { id: '3x8', columns: 3, rows: 8, marginTop: 0, marginSide: 0, gapX: 0, gapY: 0 },
  { id: '4x10', columns: 4, rows: 10, marginTop: 0, marginSide: 0, gapX: 0, gapY: 0 },
  { id: '3x7', columns: 3, rows: 7, marginTop: 15.15, marginSide: 7.25, gapX: 2.5, gapY: 0 },
  { id: '2x7', columns: 2, rows: 7, marginTop: 15.15, marginSide: 4.65, gapX: 2.5, gapY: 0 },
  { id: '5x13', columns: 5, rows: 13, marginTop: 10.7, marginSide: 4.75, gapX: 2.5, gapY: 0 },
]

export const defaultSheet: SheetSettings = {
  columns: 3,
  rows: 8,
  marginTop: 0,
  marginSide: 0,
  gapX: 0,
  gapY: 0,
  pages: 1,
  sequence: false,
  outline: false,
}

export const sheetLimits: Record<
  'columns' | 'rows' | 'pages' | 'marginTop' | 'marginSide' | 'gapX' | 'gapY',
  { min: number; max: number; step: number }
> = {
  columns: { min: 1, max: 8, step: 1 },
  rows: { min: 1, max: 20, step: 1 },
  pages: { min: 1, max: 20, step: 1 },
  marginTop: { min: 0, max: 60, step: 0.1 },
  marginSide: { min: 0, max: 60, step: 0.1 },
  gapX: { min: 0, max: 20, step: 0.1 },
  gapY: { min: 0, max: 20, step: 0.1 },
}

export const isRetail = (symbology: Symbology): symbology is RetailSymbology => symbology !== 'code128'

export const dataLength = (symbology: RetailSymbology) => retailSpec[symbology].length

export const isSymbology = (value: unknown): value is Symbology => symbologies.some((item) => item.id === value)

export const symbologyLabel = (symbology: Symbology) =>
  symbologies.find((item) => item.id === symbology)?.label ?? symbology

export function gs1CheckDigit(body: string) {
  let sum = 0
  for (let index = 0; index < body.length; index += 1) {
    const weight = (body.length - index) % 2 === 1 ? 3 : 1
    sum += Number(body[index]) * weight
  }
  return (10 - (sum % 10)) % 10
}

export function checkDigitSteps(body: string) {
  const steps: CheckStep[] = [...body].map((char, index) => {
    const digit = Number(char)
    const weight = (body.length - index) % 2 === 1 ? 3 : 1
    return { digit, weight, product: digit * weight }
  })
  const sum = steps.reduce((total, step) => total + step.product, 0)
  return { steps, sum, next: Math.ceil(sum / 10) * 10, checkDigit: gs1CheckDigit(body) }
}

function retailNotices(symbology: RetailSymbology, data: string) {
  if (symbology !== 'ean13') return []
  if (data.startsWith('729')) {
    return ['קידומת 729 שייכת ל-GS1 ישראל. מספר כזה תקף רק אם קיבלתם אותו מ-GS1 ישראל, כחלק ממספר הספק שלכם.']
  }
  if (/^04\d/.test(data)) {
    return ['מספרים שמתחילים ב-040 עד 049 שמורים ב-GS1 לשימוש פנימי בתוך החברה, ולא יתנגשו במוצר רשום.']
  }
  return []
}

function parseRetail(symbology: RetailSymbology, raw: string): ParsedValue {
  const cleaned = raw.replace(/[\s-]/g, '')
  if (!cleaned) return { status: 'empty' }
  const { length } = retailSpec[symbology]
  const name = symbologyLabel(symbology)
  if (/\D/.test(cleaned)) return { status: 'invalid', error: `ב-${name} יש רק ספרות, בלי אותיות וסימנים.` }
  if (cleaned.length === length - 1) {
    const data = `${cleaned}${gs1CheckDigit(cleaned)}`
    return {
      status: 'valid',
      data,
      notices: [`ספרת הביקורת ${data[length - 1]} חושבה ונוספה בסוף.`, ...retailNotices(symbology, data)],
    }
  }
  if (cleaned.length === length) {
    const expected = gs1CheckDigit(cleaned.slice(0, -1))
    const given = Number(cleaned[length - 1])
    if (expected !== given) {
      return {
        status: 'invalid',
        error: `ספרת הביקורת לא מתאימה: לפי החישוב היא ${expected} ולא ${given}. בדקו את המספר, או הקלידו רק את ${
          length - 1
        } הספרות הראשונות.`,
      }
    }
    return { status: 'valid', data: cleaned, notices: retailNotices(symbology, cleaned) }
  }
  return {
    status: 'invalid',
    error: `ל-${name} צריך ${length - 1} ספרות, ואז ספרת הביקורת מחושבת לבד, או ${length} ספרות עם ספרת הביקורת. הקלדתם ${cleaned.length}.`,
  }
}

function parseCode128(raw: string): ParsedValue {
  const text = raw.trim()
  if (!text) return { status: 'empty' }
  if (HEBREW.test(text)) {
    return {
      status: 'invalid',
      error: 'Code 128 לא מקודד אותיות בעברית. השתמשו באותיות לועזיות, בספרות ובסימנים, למשל SKU-1042.',
    }
  }
  const unsupported = [...text].find((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) > 126)
  if (unsupported) {
    return {
      status: 'invalid',
      error: `התו ״${unsupported}״ לא נתמך. אפשר אותיות לועזיות, ספרות, רווח ורוב הסימנים שבמקלדת.`,
    }
  }
  if (text.length > MAX_CODE128_LENGTH) {
    return {
      status: 'invalid',
      error: `עד ${MAX_CODE128_LENGTH} תווים. ברקוד ארוך יותר יוצא רחב מדי לסריקה נוחה.`,
    }
  }
  return {
    status: 'valid',
    data: text,
    notices:
      text.length > LONG_CODE128 ? ['קוד ארוך יוצא רחב. מק״ט קצר נותן ברקוד קטן יותר וקל יותר לסריקה.'] : [],
  }
}

export function parseValue(symbology: Symbology, raw: string): ParsedValue {
  return isRetail(symbology) ? parseRetail(symbology, raw) : parseCode128(raw)
}

function widthsToBits(widths: string, darkFirst: boolean) {
  let dark = darkFirst
  let bits = ''
  for (const width of widths) {
    bits += (dark ? '1' : '0').repeat(Number(width))
    dark = !dark
  }
  return bits
}

const reversed = (value: string) => [...value].reverse().join('')

export function eanDigitBits(digit: number, set: 'A' | 'B' | 'C') {
  if (set === 'A') return widthsToBits(EAN_SET_A[digit], false)
  if (set === 'B') return widthsToBits(reversed(EAN_SET_A[digit]), false)
  return widthsToBits(EAN_SET_A[digit], true)
}

export const eanParity = (leadingDigit: number) => EAN_PARITY[leadingDigit]

function ean13Bits(data: string) {
  const digits = [...data].map(Number)
  const parity = EAN_PARITY[digits[0]]
  const left = digits
    .slice(1, 7)
    .map((digit, index) => eanDigitBits(digit, parity[index] as 'A' | 'B'))
    .join('')
  const right = digits
    .slice(7)
    .map((digit) => eanDigitBits(digit, 'C'))
    .join('')
  return `${NORMAL_GUARD}${left}${CENTRE_GUARD}${right}${NORMAL_GUARD}`
}

function ean8Bits(data: string) {
  const digits = [...data].map(Number)
  const left = digits
    .slice(0, 4)
    .map((digit) => eanDigitBits(digit, 'A'))
    .join('')
  const right = digits
    .slice(4)
    .map((digit) => eanDigitBits(digit, 'C'))
    .join('')
  return `${NORMAL_GUARD}${left}${CENTRE_GUARD}${right}${NORMAL_GUARD}`
}

const digitRun = (text: string, start: number) => {
  let end = start
  while (end < text.length && text[end] >= '0' && text[end] <= '9') end += 1
  return end - start
}

export function code128Values(text: string) {
  const leading = digitRun(text, 0)
  const startC = leading >= 4 || (leading === 2 && text.length === 2)
  const values = [startC ? START_C : START_B]
  let set: 'B' | 'C' = startC ? 'C' : 'B'
  let index = 0
  while (index < text.length) {
    const run = digitRun(text, index)
    if (set === 'C') {
      if (run >= 2) {
        values.push(Number(text.slice(index, index + 2)))
        index += 2
      } else {
        values.push(CODE_B)
        set = 'B'
      }
      continue
    }
    if (run >= 4 && (index + run === text.length || run >= 6)) {
      if (run % 2 === 1) {
        values.push(text.charCodeAt(index) - 32)
        index += 1
      }
      values.push(CODE_C)
      set = 'C'
      continue
    }
    values.push(text.charCodeAt(index) - 32)
    index += 1
  }
  return values
}

export const code128Pattern = (value: number) => (value === 106 ? CODE128_STOP : CODE128[value])

export function code128Checksum(values: number[]) {
  return values.reduce((sum, value, index) => sum + value * Math.max(index, 1), 0) % 103
}

function code128Bits(text: string) {
  const values = code128Values(text)
  const symbols = [...values, code128Checksum(values)]
  return symbols.map((value) => widthsToBits(CODE128[value], true)).join('') + widthsToBits(CODE128_STOP, true)
}

export function encode(symbology: Symbology, data: string): Encoded {
  if (symbology === 'ean13') return { symbology, data, bits: ean13Bits(data) }
  if (symbology === 'upca') return { symbology, data, bits: ean13Bits(`0${data}`) }
  if (symbology === 'ean8') return { symbology, data, bits: ean8Bits(data) }
  return { symbology, data, bits: code128Bits(data) }
}

function longModule(symbology: Symbology) {
  const ranges: Record<Symbology, [number, number][]> = {
    ean13: [
      [0, 3],
      [45, 50],
      [92, 95],
    ],
    upca: [
      [0, 10],
      [45, 50],
      [85, 95],
    ],
    ean8: [
      [0, 3],
      [31, 36],
      [64, 67],
    ],
    code128: [],
  }
  return (index: number) => ranges[symbology].some(([from, to]) => index >= from && index < to)
}

export function quietZones(symbology: Symbology): [number, number] {
  return isRetail(symbology) ? retailSpec[symbology].quiet : [CODE128_QUIET, CODE128_QUIET]
}

function margins(symbology: Symbology, settings: BarcodeSettings): [number, number] {
  if (settings.quietZone) return quietZones(symbology)
  if (!settings.showText) return [0, 0]
  if (symbology === 'ean13') return [8, 0]
  if (symbology === 'upca') return [9, 9]
  return [0, 0]
}

function retailLabels(symbology: RetailSymbology, data: string, start: number, baseline: number) {
  const cell = (offset: number, index: number) => offset + 7 * index + 3.5
  const digit = (text: string, x: number, size = DIGIT_SIZE): LayoutLabel => ({ text, x, y: baseline, size })
  if (symbology === 'ean13') {
    return [
      digit(data[0], start - 4.5),
      ...[...data.slice(1, 7)].map((char, index) => digit(char, cell(start + 3, index))),
      ...[...data.slice(7)].map((char, index) => digit(char, cell(start + 50, index))),
    ]
  }
  if (symbology === 'ean8') {
    return [
      ...[...data.slice(0, 4)].map((char, index) => digit(char, cell(start + 3, index))),
      ...[...data.slice(4)].map((char, index) => digit(char, cell(start + 36, index))),
    ]
  }
  return [
    digit(data[0], start - 7, SMALL_DIGIT_SIZE),
    ...[...data.slice(1, 6)].map((char, index) => digit(char, cell(start + 10, index))),
    ...[...data.slice(6, 11)].map((char, index) => digit(char, cell(start + 50, index))),
    digit(data[11], start + 102, SMALL_DIGIT_SIZE),
  ]
}

export function layoutBarcode(encoded: Encoded, settings: BarcodeSettings): BarcodeLayout {
  const { symbology, data, bits } = encoded
  const [left, right] = margins(symbology, settings)
  const top = settings.quietZone ? VERTICAL_PAD : 0
  const barHeight = settings.heightMm / settings.xMm
  const retail = isRetail(symbology)
  const isLong = longModule(symbology)
  const bars: LayoutBar[] = []
  let index = 0
  while (index < bits.length) {
    if (bits[index] !== '1') {
      index += 1
      continue
    }
    const long = retail && isLong(index)
    let end = index
    while (end < bits.length && bits[end] === '1' && isLong(end) === isLong(index)) end += 1
    bars.push({ x: left + index, y: top, width: end - index, height: barHeight + (long ? GUARD_EXTENSION : 0) })
    index = end
  }
  const width = left + bits.length + right
  let labels: LayoutLabel[] = []
  let bottom = top + barHeight + (retail ? GUARD_EXTENSION : 0)
  if (settings.showText && retail) {
    const baseline = top + barHeight + TEXT_GAP + DIGIT_SIZE * 0.72
    labels = retailLabels(symbology, data, left, baseline)
    bottom = top + barHeight + TEXT_BAND
  } else if (settings.showText) {
    const size = Math.min(DIGIT_SIZE, bits.length / (data.length * 0.62))
    labels = [{ text: data, x: left + bits.length / 2, y: top + barHeight + TEXT_GAP + size * 0.72, size }]
    bottom = top + barHeight + TEXT_GAP + size * 0.97
  }
  return { width, height: bottom + (settings.quietZone ? VERTICAL_PAD : 0), xMm: settings.xMm, bars, labels }
}

export function nominalHeight(symbology: Symbology, xMm: number) {
  const height = isRetail(symbology) ? retailSpec[symbology].nominalHeight : CODE128_NOMINAL_HEIGHT
  return roundTo((height * xMm) / NOMINAL_X, 2)
}

export const minimumHeight = (symbology: Symbology, xMm: number) =>
  isRetail(symbology) ? nominalHeight(symbology, xMm) : null

export const isTruncated = (symbology: Symbology, settings: BarcodeSettings) => {
  const minimum = minimumHeight(symbology, settings.xMm)
  return minimum !== null && settings.heightMm < minimum - 0.005
}

export const magnification = (xMm: number) => Math.round((xMm / NOMINAL_X) * 100)

export function roundTo(value: number, digits = 3) {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

export const printSize = (layout: BarcodeLayout) => ({
  width: roundTo(layout.width * layout.xMm, 2),
  height: roundTo(layout.height * layout.xMm, 2),
})

export const barPath = (layout: BarcodeLayout) =>
  layout.bars
    .map((bar) => {
      const width = roundTo(bar.width)
      return `M${roundTo(bar.x)} ${roundTo(bar.y)}h${width}v${roundTo(bar.height)}h-${width}z`
    })
    .join('')

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function barcodeSvg(
  layout: BarcodeLayout,
  colors: { dark: string; light: string },
  title: string,
  scale = 1,
) {
  const width = roundTo(layout.width * layout.xMm * scale)
  const height = roundTo(layout.height * layout.xMm * scale)
  const viewWidth = roundTo(layout.width)
  const viewHeight = roundTo(layout.height)
  const name = escapeXml(title)
  const labels = layout.labels
    .map((label) => {
      const position = `x="${roundTo(label.x)}" y="${roundTo(label.y)}" font-size="${roundTo(label.size)}"`
      return `<text ${position}>${escapeXml(label.text)}</text>`
    })
    .join('')
  const font = `font-family="${escapeXml(BARCODE_FONT)}" text-anchor="middle" direction="ltr"`
  const text = labels ? `<g fill="${colors.dark}" ${font}>${labels}</g>` : ''
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}mm" height="${height}mm"`,
    ` viewBox="0 0 ${viewWidth} ${viewHeight}" role="img" aria-label="${name}">`,
    `<title>${name}</title>`,
    `<rect width="${viewWidth}" height="${viewHeight}" fill="${colors.light}"/>`,
    `<path fill="${colors.dark}" shape-rendering="crispEdges" d="${barPath(layout)}"/>`,
    text,
    '</svg>',
  ].join('')
}

export const barcodeTitle = (symbology: Symbology, data: string) =>
  `ברקוד ${symbologyLabel(symbology)}: ${data}`

export const pixelsPerModule = (xMm: number) => Math.max(2, Math.round((xMm * PRINT_DPI) / 25.4))

export const effectiveDpi = (xMm: number) => (pixelsPerModule(xMm) * 25.4) / xMm

let crcTable: Uint32Array | null = null

function crc32(bytes: Uint8Array) {
  if (!crcTable) {
    crcTable = new Uint32Array(256)
    for (let n = 0; n < 256; n += 1) {
      let c = n
      for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      crcTable[n] = c >>> 0
    }
  }
  let crc = 0xffffffff
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

export function pngWithDpi(png: Uint8Array, dpi: number) {
  const view = new DataView(png.buffer, png.byteOffset, png.byteLength)
  const chunks: Uint8Array[] = [png.subarray(0, 8)]
  let offset = 8
  while (offset + 12 <= png.length) {
    const length = view.getUint32(offset)
    const type = String.fromCharCode(...png.subarray(offset + 4, offset + 8))
    const end = offset + 12 + length
    if (type !== 'pHYs') chunks.push(png.subarray(offset, end))
    if (type === 'IHDR') {
      const physical = new Uint8Array(21)
      const physicalView = new DataView(physical.buffer)
      const perMetre = Math.round(dpi / 0.0254)
      physicalView.setUint32(0, 9)
      physical.set([0x70, 0x48, 0x59, 0x73], 4)
      physicalView.setUint32(8, perMetre)
      physicalView.setUint32(12, perMetre)
      physical[16] = 1
      physicalView.setUint32(17, crc32(physical.subarray(4, 17)))
      chunks.push(physical)
    }
    offset = end
  }
  const output = new Uint8Array(chunks.reduce((total, chunk) => total + chunk.length, 0))
  let position = 0
  for (const chunk of chunks) {
    output.set(chunk, position)
    position += chunk.length
  }
  return output
}

const channel = (hex: string, start: number) => parseInt(hex.slice(start, start + 2), 16) / 255

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((start) => {
    const value = channel(hex, start)
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export const isHexColor = (value: string) => HEX_COLOR.test(value)

export function colorProblem(dark: string, light: string): ColorProblem {
  if (!isHexColor(dark) || !isHexColor(light)) return null
  const darkLuminance = luminance(dark)
  const lightLuminance = luminance(light)
  if (darkLuminance >= lightLuminance) return 'inverted'
  if ((lightLuminance + 0.05) / (darkLuminance + 0.05) < MIN_CONTRAST) return 'low'
  if (channel(light, 1) - channel(dark, 1) < MIN_RED_CONTRAST) return 'red'
  return null
}

export function sheetGeometry(sheet: SheetSettings): SheetGeometry {
  const labelWidth = (A4.width - 2 * sheet.marginSide - (sheet.columns - 1) * sheet.gapX) / sheet.columns
  const labelHeight = (A4.height - 2 * sheet.marginTop - (sheet.rows - 1) * sheet.gapY) / sheet.rows
  if (labelWidth < MIN_LABEL || labelHeight < MIN_LABEL) {
    return {
      status: 'invalid',
      error: 'עם המספרים האלה המדבקות יוצאות קטנות מ-8 מ״מ, או שהשוליים גדולים מהדף. הקטינו את השוליים או את מספר העמודות והשורות.',
    }
  }
  return { status: 'ok', labelWidth: roundTo(labelWidth, 2), labelHeight: roundTo(labelHeight, 2) }
}

export function sheetFit(layout: BarcodeLayout, labelWidth: number, labelHeight: number): SheetFit {
  const width = layout.width * layout.xMm
  const height = layout.height * layout.xMm
  const room = { width: labelWidth - 2 * LABEL_PADDING, height: labelHeight - 2 * LABEL_PADDING }
  const scale = Math.min(1, room.width / width, room.height / height)
  return { scale: Math.max(scale, 0), width: roundTo(width * scale, 2), height: roundTo(height * scale, 2) }
}

function addToDigits(digits: string, amount: number) {
  const output = [...digits]
  let carry = amount
  for (let index = output.length - 1; index >= 0 && carry > 0; index -= 1) {
    const sum = Number(output[index]) + carry
    output[index] = String(sum % 10)
    carry = Math.floor(sum / 10)
  }
  return carry > 0 ? `${carry}${output.join('')}` : output.join('')
}

export function sheetValues(symbology: Symbology, data: string, count: number, sequence: boolean): SheetValues {
  if (!sequence) return { status: 'ok', values: Array.from({ length: count }, () => data) }
  if (isRetail(symbology)) {
    const body = data.slice(0, -1)
    const values: string[] = []
    for (let index = 0; index < count; index += 1) {
      const next = addToDigits(body, index)
      if (next.length > body.length) {
        return { status: 'invalid', error: 'הרצף עובר את המספר הגבוה ביותר שאפשר. התחילו ממספר נמוך יותר.' }
      }
      values.push(`${next}${gs1CheckDigit(next)}`)
    }
    return { status: 'ok', values }
  }
  const match = /^(.*?)(\d+)$/.exec(data)
  if (!match) {
    return { status: 'invalid', error: 'כדי ליצור רצף, הקוד צריך להסתיים בספרות, למשל SKU-0001.' }
  }
  const [, prefix, digits] = match
  const values = Array.from({ length: count }, (_, index) => `${prefix}${addToDigits(digits, index)}`)
  if (values.some((value) => value.length > MAX_CODE128_LENGTH)) {
    return { status: 'invalid', error: `הרצף יוצר קודים ארוכים מ-${MAX_CODE128_LENGTH} תווים.` }
  }
  return { status: 'ok', values }
}

export function labelPosition(
  index: number,
  sheet: SheetSettings,
  geometry: { labelWidth: number; labelHeight: number },
) {
  const row = Math.floor(index / sheet.columns)
  const column = index % sheet.columns
  return {
    start: sheet.marginSide + (sheet.columns - 1 - column) * (geometry.labelWidth + sheet.gapX),
    top: sheet.marginTop + row * (geometry.labelHeight + sheet.gapY),
  }
}

export function sheetDocument(
  labels: string[],
  sheet: SheetSettings,
  geometry: { labelWidth: number; labelHeight: number },
) {
  const perPage = sheet.columns * sheet.rows
  const pages: string[] = []
  for (let first = 0; first < labels.length; first += perPage) {
    const cells = labels
      .slice(first, first + perPage)
      .map((svg, index) => {
        const { start, top } = labelPosition(index, sheet, geometry)
        return `<div class="label" style="inset-inline-start:${roundTo(start, 2)}mm;inset-block-start:${roundTo(
          top,
          2,
        )}mm;width:${geometry.labelWidth}mm;height:${geometry.labelHeight}mm">${svg}</div>`
      })
      .join('')
    pages.push(`<section class="page">${cells}</section>`)
  }
  const outline = sheet.outline ? '.label{outline:0.2mm dashed #8a8a8a;outline-offset:-0.1mm}' : ''
  const sheetCss = [
    '@page{size:A4;margin:0}',
    '*{box-sizing:border-box}',
    'html,body{margin:0;padding:0;background:#fff}',
    '.page{position:relative;direction:ltr;width:210mm;height:296.8mm;overflow:hidden;break-after:page}',
    '.page:last-child{break-after:auto}',
    '.label{position:absolute;display:flex;align-items:center;justify-content:center;overflow:hidden}',
    '.label svg{display:block;flex:none}',
    '@media screen{html,body{background:#e9e6e1}',
    '.page{margin:8mm auto;background:#fff;box-shadow:0 2px 14px #0003}}',
  ].join('')
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>דף מדבקות ברקוד</title>
<style>${sheetCss}${outline}</style>
</head>
<body>
${pages.join('\n')}
</body>
</html>`
}

export function fileName(symbology: Symbology, data: string) {
  const safe = data.replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)
  return `barcode-${symbology}${safe ? `-${safe}` : ''}`
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const inRange = (value: unknown, min: number, max: number): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max

export function restoreValues(value: unknown): Record<Symbology, string> {
  if (!isRecord(value)) return defaultValues
  const restored = { ...defaultValues }
  for (const item of symbologies) {
    const saved = value[item.id]
    if (typeof saved === 'string') restored[item.id] = saved.slice(0, 80)
  }
  return restored
}

export function restoreSettings(value: unknown): BarcodeSettings {
  if (!isRecord(value)) return defaultSettings
  const { xMm, heightMm, showText, quietZone, dark, light } = value
  return {
    xMm: xOptions.includes(xMm as number) ? (xMm as number) : defaultSettings.xMm,
    heightMm: inRange(heightMm, MIN_HEIGHT_MM, MAX_HEIGHT_MM) ? heightMm : defaultSettings.heightMm,
    showText: typeof showText === 'boolean' ? showText : defaultSettings.showText,
    quietZone: typeof quietZone === 'boolean' ? quietZone : defaultSettings.quietZone,
    dark: typeof dark === 'string' && isHexColor(dark) ? dark : defaultSettings.dark,
    light: typeof light === 'string' && isHexColor(light) ? light : defaultSettings.light,
  }
}

export function restoreSheet(value: unknown): SheetSettings {
  if (!isRecord(value)) return defaultSheet
  const restored = { ...defaultSheet }
  for (const key of Object.keys(sheetLimits) as (keyof typeof sheetLimits)[]) {
    const { min, max } = sheetLimits[key]
    const saved = value[key]
    if (inRange(saved, min, max)) restored[key] = saved
  }
  if (typeof value.sequence === 'boolean') restored.sequence = value.sequence
  if (typeof value.outline === 'boolean') restored.outline = value.outline
  return restored
}
