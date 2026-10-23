export type RingMode = 'circumference' | 'diameter'

export type RingSizes = {
  circumference: number
  diameter: number
  iso: number
  us: number | null
  uk: string | null
  continental: number
}

export const RING_CHECKED = '2026-10-23'
export const RING_CHECKED_LABEL = '23.10.2026'

export const MIN_CIRCUMFERENCE = 40
export const MAX_CIRCUMFERENCE = 80

export const modes: { id: RingMode; label: string; hint: string }[] = [
  { id: 'circumference', label: 'היקף האצבע', hint: 'במ״מ, מדידה עם חוט או רצועת נייר' },
  { id: 'diameter', label: 'קוטר פנימי של טבעת', hint: 'במ״מ, מדידת טבעת שמתאימה לכם' },
]

export const ringSources = {
  iso: {
    label: 'ISO 8653:2016: Jewellery and precious metals, ring sizes - Definition, measurement and designation',
    href: 'https://www.iso.org/standard/65408.html',
  },
  wikipedia: {
    label: 'Wikipedia: Ring size (ISO, North America, UK and continental systems, formulas)',
    href: 'https://en.wikipedia.org/wiki/Ring_size',
  },
} as const

export const circumferenceOf = (value: number, mode: RingMode) => (mode === 'diameter' ? value * Math.PI : value)

export const inRange = (circumference: number) =>
  circumference >= MIN_CIRCUMFERENCE && circumference <= MAX_CIRCUMFERENCE

const roundTo = (value: number, step: number) => Math.round(value / step) * step

export const usSize = (circumference: number) => {
  const size = roundTo((circumference - 36.5) / 2.55, 0.25)
  return size >= 0 ? size : null
}

export const ukSize = (circumference: number) => {
  const position = roundTo(2 + (circumference - 40) / 1.25, 0.5)
  if (position < 0 || position > 25.5) return null
  const letter = String.fromCharCode(65 + Math.floor(position))
  return Number.isInteger(position) ? letter : `${letter} ½`
}

export const convert = (value: number, mode: RingMode): RingSizes => {
  const circumference = circumferenceOf(value, mode)
  return {
    circumference,
    diameter: circumference / Math.PI,
    iso: Math.round(circumference),
    us: usSize(circumference),
    uk: ukSize(circumference),
    continental: Math.round(circumference - 40),
  }
}

export const formatUs = (size: number | null) => {
  if (size === null) return 'מחוץ לטבלה'
  const whole = Math.floor(size)
  const fraction = size - whole
  const part = fraction === 0 ? '' : fraction === 0.25 ? '¼' : fraction === 0.5 ? '½' : '¾'
  return whole === 0 && part ? part : `${whole}${part}`
}

export const tableRows = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, index) => convert(from + index, 'circumference'))

export const TABLE_FROM = 44
export const TABLE_TO = 70
