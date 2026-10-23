import { specimenUrl, stylesheetUrl } from '@/lib/hebrew-fonts'

export type SignatureMode = 'draw' | 'type'
export type InkId = 'black' | 'blue'
export type ThicknessId = 'thin' | 'medium' | 'thick'
export type ExportScale = 2 | 3

export type Point = { x: number; y: number; w: number }
export type Stroke = Point[]
export type Box = { left: number; top: number; right: number; bottom: number }

export type Segment =
  | { kind: 'dot'; x: number; y: number; w: number }
  | { kind: 'curve'; x0: number; y0: number; cx: number; cy: number; x1: number; y1: number; w: number }

export type ExportFrame = { width: number; height: number; factor: number; originX: number; originY: number }

export type SignatureFont = { family: string; weight: number; slant: number }
export type SignatureStyle = { id: string; label: string; hebrew: SignatureFont; latin: SignatureFont }

export type FontLicence = { family: string; designer: string; specimen: string; licence: string }

export const inks: { id: InkId; label: string; color: string }[] = [
  { id: 'black', label: 'שחור', color: '#17171c' },
  { id: 'blue', label: 'כחול כמו עט', color: '#1c3a92' },
]

export const thicknesses: { id: ThicknessId; label: string; width: number }[] = [
  { id: 'thin', label: 'דק', width: 1.6 },
  { id: 'medium', label: 'בינוני', width: 2.6 },
  { id: 'thick', label: 'עבה', width: 3.8 },
]

export const exportScales: { value: ExportScale; label: string }[] = [
  { value: 2, label: 'פי 2' },
  { value: 3, label: 'פי 3, חד יותר' },
]

export const MIN_POINT_DISTANCE = 1.5
export const EXPORT_PADDING = 8
export const MAX_EXPORT_SIDE = 4096
export const CSS_PX_PER_INCH = 192
export const TYPE_FONT_SIZE = 96
export const MAX_NAME_LENGTH = 40
export const SAMPLE_NAME = 'ישראל ישראלי'
export const ALPHA_THRESHOLD = 8

const DOC_TEXT_PX = 15
const DOC_TEXT_PT = 11
const POINTS_PER_INCH = 72
const METERS_PER_INCH = 0.0254

export const PREVIEW_RATIO = DOC_TEXT_PX / (DOC_TEXT_PT / POINTS_PER_INCH) / CSS_PX_PER_INCH

export const signatureStyles: SignatureStyle[] = [
  {
    id: 'flowing',
    label: 'רהוט',
    hebrew: { family: 'Gveret Levin', weight: 400, slant: 0 },
    latin: { family: 'Dancing Script', weight: 400, slant: 0 },
  },
  {
    id: 'slanted',
    label: 'רהוט נטוי',
    hebrew: { family: 'Gveret Levin', weight: 400, slant: -0.2 },
    latin: { family: 'Great Vibes', weight: 400, slant: 0 },
  },
  {
    id: 'fine',
    label: 'עט דק',
    hebrew: { family: 'Playpen Sans Hebrew', weight: 200, slant: 0 },
    latin: { family: 'Sacramento', weight: 400, slant: 0 },
  },
  {
    id: 'quick',
    label: 'כתב מהיר',
    hebrew: { family: 'Playpen Sans Hebrew', weight: 300, slant: -0.22 },
    latin: { family: 'La Belle Aurore', weight: 400, slant: 0 },
  },
  {
    id: 'marker',
    label: 'טוש',
    hebrew: { family: 'Playpen Sans Hebrew', weight: 600, slant: 0 },
    latin: { family: 'Mr Dafoe', weight: 400, slant: 0 },
  },
  {
    id: 'print',
    label: 'אותיות דפוס',
    hebrew: { family: 'Amatic SC', weight: 700, slant: 0 },
    latin: { family: 'Caveat', weight: 600, slant: 0 },
  },
]

const OFL = 'SIL Open Font License 1.1'

export const fontLicences: FontLicence[] = [
  { family: 'Gveret Levin', designer: 'AlefAlefAlef', specimen: specimenUrl('Gveret Levin'), licence: OFL },
  { family: 'Playpen Sans Hebrew', designer: 'TypeTogether', specimen: specimenUrl('Playpen Sans Hebrew'), licence: OFL },
  { family: 'Amatic SC', designer: 'Vernon Adams, Ben Nathan, Thomas Jockin', specimen: specimenUrl('Amatic SC'), licence: OFL },
  { family: 'Dancing Script', designer: 'Impallari Type', specimen: specimenUrl('Dancing Script'), licence: OFL },
  { family: 'Great Vibes', designer: 'Robert Leuschke', specimen: specimenUrl('Great Vibes'), licence: OFL },
  { family: 'Sacramento', designer: 'Astigmatic', specimen: specimenUrl('Sacramento'), licence: OFL },
  { family: 'La Belle Aurore', designer: 'Kimberly Geswein', specimen: specimenUrl('La Belle Aurore'), licence: OFL },
  { family: 'Mr Dafoe', designer: 'Sudtipos', specimen: specimenUrl('Mr Dafoe'), licence: OFL },
  { family: 'Caveat', designer: 'Impallari Type', specimen: specimenUrl('Caveat'), licence: OFL },
]

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const round = (value: number) => Math.round(value * 100) / 100

export const hasHebrew = (text: string) => /[֐-׿יִ-ﭏ]/.test(text)

export const findStyle = (id: string) => signatureStyles.find((style) => style.id === id) ?? signatureStyles[0]

export const fontFor = (style: SignatureStyle, text: string) => (hasHebrew(text) ? style.hebrew : style.latin)

export const cssFont = (font: SignatureFont, size: number) => `${font.weight} ${size}px "${font.family}"`

export const slantTransform = (slant: number) => (slant ? `skewX(${round(Math.atan(slant))}rad)` : undefined)

export function signatureFontsUrl() {
  const choices = signatureStyles.flatMap((style) => [style.hebrew, style.latin])
  return stylesheetUrl(choices.map(({ family, weight }) => ({ family, weight })))
}

export function farEnough(from: { x: number; y: number }, to: { x: number; y: number }, min = MIN_POINT_DISTANCE) {
  return Math.hypot(to.x - from.x, to.y - from.y) >= min
}

export function targetWidth(sample: { pointerType: string; pressure: number; speed: number }) {
  if (sample.pointerType === 'pen' && sample.pressure > 0) return clamp(0.35 + sample.pressure * 1.3, 0.35, 1.6)
  return clamp(1.3 - sample.speed * 0.45, 0.6, 1.3)
}

export const startWidth = (sample: { pointerType: string; pressure: number }) =>
  sample.pointerType === 'pen' && sample.pressure > 0 ? targetWidth({ ...sample, speed: 0 }) : 1

export function smoothWidth(previous: number, target: number, amount = 0.3) {
  return previous + (target - previous) * amount
}

const midpoint = (a: Point, b: Point) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })

function line(from: { x: number; y: number }, to: { x: number; y: number }, w: number): Segment {
  return {
    kind: 'curve',
    x0: from.x,
    y0: from.y,
    cx: (from.x + to.x) / 2,
    cy: (from.y + to.y) / 2,
    x1: to.x,
    y1: to.y,
    w,
  }
}

export function strokeSegments(points: Stroke): Segment[] {
  if (!points.length) return []
  if (points.length === 1) return [{ kind: 'dot', x: points[0].x, y: points[0].y, w: points[0].w }]
  if (points.length === 2) return [line(points[0], points[1], (points[0].w + points[1].w) / 2)]
  const last = points.length - 1
  const segments: Segment[] = [line(points[0], midpoint(points[0], points[1]), (points[0].w + points[1].w) / 2)]
  for (let index = 1; index < last; index += 1) {
    const start = midpoint(points[index - 1], points[index])
    const end = midpoint(points[index], points[index + 1])
    segments.push({
      kind: 'curve',
      x0: start.x,
      y0: start.y,
      cx: points[index].x,
      cy: points[index].y,
      x1: end.x,
      y1: end.y,
      w: points[index].w,
    })
  }
  segments.push(line(midpoint(points[last - 1], points[last]), points[last], (points[last - 1].w + points[last].w) / 2))
  return segments
}

export function strokesBounds(strokes: Stroke[], base: number): Box | null {
  let box: Box | null = null
  for (const stroke of strokes) {
    for (const point of stroke) {
      const half = (point.w * base) / 2
      box = box
        ? {
            left: Math.min(box.left, point.x - half),
            top: Math.min(box.top, point.y - half),
            right: Math.max(box.right, point.x + half),
            bottom: Math.max(box.bottom, point.y + half),
          }
        : { left: point.x - half, top: point.y - half, right: point.x + half, bottom: point.y + half }
    }
  }
  return box
}

export function exportFrame(
  box: Box,
  scale: number,
  padding = EXPORT_PADDING,
  maxSide = MAX_EXPORT_SIDE,
): ExportFrame {
  const width = box.right - box.left + padding * 2
  const height = box.bottom - box.top + padding * 2
  const factor = Math.min(scale, maxSide / width, maxSide / height)
  return {
    width: Math.max(1, Math.ceil(width * factor)),
    height: Math.max(1, Math.ceil(height * factor)),
    factor,
    originX: box.left - padding,
    originY: box.top - padding,
  }
}

export function alphaBounds(
  data: ArrayLike<number>,
  width: number,
  height: number,
  threshold = ALPHA_THRESHOLD,
): Box | null {
  let left = width
  let top = height
  let right = -1
  let bottom = -1
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] <= threshold) continue
      if (x < left) left = x
      if (x > right) right = x
      if (y < top) top = y
      if (y > bottom) bottom = y
    }
  }
  if (right < 0) return null
  return { left, top, right: right + 1, bottom: bottom + 1 }
}

export function cropRect(box: Box, padding: number, width: number, height: number) {
  const left = Math.max(0, box.left - padding)
  const top = Math.max(0, box.top - padding)
  const right = Math.min(width, box.right + padding)
  const bottom = Math.min(height, box.bottom + padding)
  return { x: left, y: top, width: right - left, height: bottom - top }
}

export function typedCanvasLayout(textWidth: number, fontSize: number, slant: number) {
  const width = Math.ceil(textWidth + fontSize * (2 + Math.abs(slant) * 2))
  const height = Math.ceil(fontSize * 2.6)
  return { width, height, centerX: width / 2, baseline: Math.round(fontSize * 1.65) }
}

export const pixelsPerInch = (factor: number) => Math.round(CSS_PX_PER_INCH * factor)

export const previewWidth = (exportWidth: number, factor: number) => Math.round((exportWidth / factor) * PREVIEW_RATIO)

type Context = Pick<
  CanvasRenderingContext2D,
  'beginPath' | 'moveTo' | 'quadraticCurveTo' | 'arc' | 'stroke' | 'fill' | 'lineWidth' | 'lineCap' | 'lineJoin'
> & { strokeStyle: unknown; fillStyle: unknown }

export function paintStrokes(context: Context, strokes: Stroke[], base: number, color: string) {
  context.strokeStyle = color
  context.fillStyle = color
  context.lineCap = 'round'
  context.lineJoin = 'round'
  for (const stroke of strokes) {
    for (const segment of strokeSegments(stroke)) {
      context.beginPath()
      if (segment.kind === 'dot') {
        context.arc(segment.x, segment.y, (segment.w * base) / 2, 0, Math.PI * 2)
        context.fill()
        continue
      }
      context.lineWidth = segment.w * base
      context.moveTo(segment.x0, segment.y0)
      context.quadraticCurveTo(segment.cx, segment.cy, segment.x1, segment.y1)
      context.stroke()
    }
  }
}

export function signatureSvg(strokes: Stroke[], base: number, color: string, padding = EXPORT_PADDING) {
  const box = strokesBounds(strokes, base)
  if (!box) return null
  const frame = exportFrame(box, 1, padding, Number.POSITIVE_INFINITY)
  const x = (value: number) => round(value - frame.originX)
  const y = (value: number) => round(value - frame.originY)
  const paths: string[] = []
  const dots: string[] = []
  for (const stroke of strokes) {
    let current: { width: number; d: string } | null = null
    for (const segment of strokeSegments(stroke)) {
      if (segment.kind === 'dot') {
        dots.push(`<circle cx="${x(segment.x)}" cy="${y(segment.y)}" r="${round((segment.w * base) / 2)}"/>`)
        continue
      }
      const width = round(segment.w * base)
      const curve = `Q${x(segment.cx)} ${y(segment.cy)} ${x(segment.x1)} ${y(segment.y1)}`
      if (current && current.width === width) {
        current.d += curve
        continue
      }
      if (current) paths.push(`<path stroke-width="${current.width}" d="${current.d}"/>`)
      current = { width, d: `M${x(segment.x0)} ${y(segment.y0)}${curve}` }
    }
    if (current) paths.push(`<path stroke-width="${current.width}" d="${current.d}"/>`)
  }
  const width = round(box.right - box.left + padding * 2)
  const height = round(box.bottom - box.top + padding * 2)
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<g fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round">${paths.join('')}</g>`,
    dots.length ? `<g fill="${color}">${dots.join('')}</g>` : '',
    '</svg>',
  ].join('')
}

const crcTable = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n += 1) {
    let c = n
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

export function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10]

const chunkType = (bytes: Uint8Array, offset: number) => String.fromCharCode(...bytes.subarray(offset + 4, offset + 8))

function physChunk(pixelsPerMeter: number) {
  const chunk = new Uint8Array(21)
  const view = new DataView(chunk.buffer)
  view.setUint32(0, 9)
  chunk.set([112, 72, 89, 115], 4)
  view.setUint32(8, pixelsPerMeter)
  view.setUint32(12, pixelsPerMeter)
  chunk[16] = 1
  view.setUint32(17, crc32(chunk.subarray(4, 17)))
  return chunk
}

export function withPixelDensity(png: Uint8Array<ArrayBuffer>, ppi: number): Uint8Array<ArrayBuffer> {
  if (png.length < 33 || PNG_SIGNATURE.some((byte, index) => png[index] !== byte)) return png
  if (chunkType(png, 8) !== 'IHDR') return png
  const view = new DataView(png.buffer, png.byteOffset, png.byteLength)
  const parts: Uint8Array[] = []
  let offset = 8
  while (offset + 12 <= png.length) {
    const length = view.getUint32(offset)
    const end = offset + 12 + length
    if (end > png.length) return png
    if (chunkType(png, offset) !== 'pHYs') parts.push(png.subarray(offset, end))
    offset = end
  }
  const phys = physChunk(Math.round(ppi / METERS_PER_INCH))
  const total = 8 + phys.length + parts.reduce((sum, part) => sum + part.length, 0)
  const output = new Uint8Array(total)
  output.set(png.subarray(0, 8), 0)
  let cursor = 8
  parts.forEach((part, index) => {
    output.set(part, cursor)
    cursor += part.length
    if (index === 0) {
      output.set(phys, cursor)
      cursor += phys.length
    }
  })
  return output
}
