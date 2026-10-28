export type Unit = 'mm' | 'cm' | 'm'
export type Dimension = 'area' | 'volume'

export type ShapeId =
  | 'square'
  | 'rectangle'
  | 'triangle'
  | 'circle'
  | 'trapezoid'
  | 'parallelogram'
  | 'rhombus'
  | 'hexagon'
  | 'cube'
  | 'box'
  | 'cylinder'
  | 'cone'
  | 'sphere'
  | 'pyramid'
  | 'prism'

export type ShapeParam = { key: string; label: string }

export type Shape = {
  id: ShapeId
  name: string
  dimension: Dimension
  params: ShapeParam[]
  formula: string
  solve: (v: Record<string, number>) => { substitution: string; value: number }
}

export const REVIEWED_LABEL = '28.10.2026'

export const UNITS: { id: Unit; label: string; toMeters: number }[] = [
  { id: 'mm', label: 'מ״מ', toMeters: 0.001 },
  { id: 'cm', label: 'ס״מ', toMeters: 0.01 },
  { id: 'm', label: 'מטר', toMeters: 1 },
]

export const SOURCES = {
  area: {
    href: 'https://en.wikipedia.org/wiki/Area',
    label: 'Wikipedia: Area',
    note: 'טבלת נוסחאות השטח למשולש, מעוין, טרפז, משושה משוכלל ועיגול',
  },
  volume: {
    href: 'https://en.wikipedia.org/wiki/Volume',
    label: 'Wikipedia: Volume',
    note: 'נפח של מנסרה, תיבה, קובייה וגליל כשטח הבסיס כפול הגובה',
  },
  litre: {
    href: 'https://en.wikipedia.org/wiki/Litre',
    label: 'Wikipedia: Litre',
    note: 'ליטר אחד שווה דצימטר מעוקב, 1,000 סמ״ק או 0.001 מ״ק',
  },
}

const numberFormat = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 4 })

export const formatNumber = (value: number) => numberFormat.format(value)

const n = formatNumber

export const SHAPES: Shape[] = [
  {
    id: 'square',
    name: 'ריבוע',
    dimension: 'area',
    params: [{ key: 'a', label: 'צלע a' }],
    formula: 'S = a²',
    solve: ({ a }) => ({ substitution: `S = ${n(a)}²`, value: a * a }),
  },
  {
    id: 'rectangle',
    name: 'מלבן',
    dimension: 'area',
    params: [
      { key: 'a', label: 'אורך a' },
      { key: 'b', label: 'רוחב b' },
    ],
    formula: 'S = a × b',
    solve: ({ a, b }) => ({ substitution: `S = ${n(a)} × ${n(b)}`, value: a * b }),
  },
  {
    id: 'triangle',
    name: 'משולש',
    dimension: 'area',
    params: [
      { key: 'b', label: 'בסיס b' },
      { key: 'h', label: 'גובה לבסיס h' },
    ],
    formula: 'S = (b × h) / 2',
    solve: ({ b, h }) => ({ substitution: `S = (${n(b)} × ${n(h)}) / 2`, value: (b * h) / 2 }),
  },
  {
    id: 'circle',
    name: 'עיגול',
    dimension: 'area',
    params: [{ key: 'r', label: 'רדיוס r' }],
    formula: 'S = π × r²',
    solve: ({ r }) => ({ substitution: `S = 3.1416 × ${n(r)}²`, value: Math.PI * r * r }),
  },
  {
    id: 'trapezoid',
    name: 'טרפז',
    dimension: 'area',
    params: [
      { key: 'a', label: 'בסיס עליון a' },
      { key: 'b', label: 'בסיס תחתון b' },
      { key: 'h', label: 'גובה h' },
    ],
    formula: 'S = (a + b) × h / 2',
    solve: ({ a, b, h }) => ({ substitution: `S = (${n(a)} + ${n(b)}) × ${n(h)} / 2`, value: ((a + b) * h) / 2 }),
  },
  {
    id: 'parallelogram',
    name: 'מקבילית',
    dimension: 'area',
    params: [
      { key: 'b', label: 'צלע b' },
      { key: 'h', label: 'גובה לצלע h' },
    ],
    formula: 'S = b × h',
    solve: ({ b, h }) => ({ substitution: `S = ${n(b)} × ${n(h)}`, value: b * h }),
  },
  {
    id: 'rhombus',
    name: 'מעוין',
    dimension: 'area',
    params: [
      { key: 'd1', label: 'אלכסון d1' },
      { key: 'd2', label: 'אלכסון d2' },
    ],
    formula: 'S = (d1 × d2) / 2',
    solve: ({ d1, d2 }) => ({ substitution: `S = (${n(d1)} × ${n(d2)}) / 2`, value: (d1 * d2) / 2 }),
  },
  {
    id: 'hexagon',
    name: 'משושה משוכלל',
    dimension: 'area',
    params: [{ key: 'a', label: 'צלע a' }],
    formula: 'S = (3√3 / 2) × a²',
    solve: ({ a }) => ({ substitution: `S = 2.5981 × ${n(a)}²`, value: ((3 * Math.sqrt(3)) / 2) * a * a }),
  },
  {
    id: 'cube',
    name: 'קובייה',
    dimension: 'volume',
    params: [{ key: 'a', label: 'מקצוע a' }],
    formula: 'V = a³',
    solve: ({ a }) => ({ substitution: `V = ${n(a)}³`, value: a * a * a }),
  },
  {
    id: 'box',
    name: 'תיבה',
    dimension: 'volume',
    params: [
      { key: 'a', label: 'אורך a' },
      { key: 'b', label: 'רוחב b' },
      { key: 'c', label: 'גובה c' },
    ],
    formula: 'V = a × b × c',
    solve: ({ a, b, c }) => ({ substitution: `V = ${n(a)} × ${n(b)} × ${n(c)}`, value: a * b * c }),
  },
  {
    id: 'cylinder',
    name: 'גליל',
    dimension: 'volume',
    params: [
      { key: 'r', label: 'רדיוס הבסיס r' },
      { key: 'h', label: 'גובה h' },
    ],
    formula: 'V = π × r² × h',
    solve: ({ r, h }) => ({ substitution: `V = 3.1416 × ${n(r)}² × ${n(h)}`, value: Math.PI * r * r * h }),
  },
  {
    id: 'cone',
    name: 'חרוט',
    dimension: 'volume',
    params: [
      { key: 'r', label: 'רדיוס הבסיס r' },
      { key: 'h', label: 'גובה h' },
    ],
    formula: 'V = π × r² × h / 3',
    solve: ({ r, h }) => ({ substitution: `V = 3.1416 × ${n(r)}² × ${n(h)} / 3`, value: (Math.PI * r * r * h) / 3 }),
  },
  {
    id: 'sphere',
    name: 'כדור',
    dimension: 'volume',
    params: [{ key: 'r', label: 'רדיוס r' }],
    formula: 'V = (4/3) × π × r³',
    solve: ({ r }) => ({ substitution: `V = (4/3) × 3.1416 × ${n(r)}³`, value: (4 / 3) * Math.PI * r ** 3 }),
  },
  {
    id: 'pyramid',
    name: 'פירמידה',
    dimension: 'volume',
    params: [
      { key: 'a', label: 'אורך הבסיס a' },
      { key: 'b', label: 'רוחב הבסיס b' },
      { key: 'h', label: 'גובה h' },
    ],
    formula: 'V = (a × b × h) / 3',
    solve: ({ a, b, h }) => ({ substitution: `V = (${n(a)} × ${n(b)} × ${n(h)}) / 3`, value: (a * b * h) / 3 }),
  },
  {
    id: 'prism',
    name: 'מנסרה משולשת',
    dimension: 'volume',
    params: [
      { key: 'b', label: 'בסיס המשולש b' },
      { key: 'h', label: 'גובה המשולש h' },
      { key: 'l', label: 'אורך המנסרה L' },
    ],
    formula: 'V = (b × h / 2) × L',
    solve: ({ b, h, l }) => ({ substitution: `V = (${n(b)} × ${n(h)} / 2) × ${n(l)}`, value: ((b * h) / 2) * l }),
  },
]

export const shapeById = (id: ShapeId) => SHAPES.find((shape) => shape.id === id) ?? SHAPES[0]

export const unitById = (id: Unit) => UNITS.find((unit) => unit.id === id) ?? UNITS[2]

export type Solution = {
  formula: string
  substitution: string
  value: number
  unit: Unit
  squareMeters?: number
  cubicMeters?: number
  liters?: number
}

export function solveShape(shapeId: ShapeId, unit: Unit, values: Record<string, number>): Solution | null {
  const shape = shapeById(shapeId)
  const valid = shape.params.every(({ key }) => Number.isFinite(values[key]) && values[key] > 0)
  if (!valid) return null
  const { substitution, value } = shape.solve(values)
  const factor = unitById(unit).toMeters
  if (shape.dimension === 'area') {
    return { formula: shape.formula, substitution, value, unit, squareMeters: value * factor ** 2 }
  }
  const cubicMeters = value * factor ** 3
  return { formula: shape.formula, substitution, value, unit, cubicMeters, liters: cubicMeters * 1000 }
}

export type RoomResult = { floor: number; floorWithWaste: number; walls: number; perimeter: number }

export function roomArea(length: number, width: number, height: number, wastePercent: number): RoomResult | null {
  if (![length, width].every((value) => Number.isFinite(value) && value > 0)) return null
  const safeHeight = Number.isFinite(height) && height > 0 ? height : 0
  const safeWaste = Number.isFinite(wastePercent) && wastePercent > 0 ? wastePercent : 0
  const floor = length * width
  const perimeter = 2 * (length + width)
  return { floor, floorWithWaste: floor * (1 + safeWaste / 100), walls: perimeter * safeHeight, perimeter }
}
