export const MAX_NAMES = 60
export const MIN_SPIN_NAMES = 2
export const SPIN_TURNS = 5
export const SPIN_MS = 4500
export const WHEEL_REVIEWED = '2026-10-23'
export const WHEEL_REVIEWED_LABEL = '23.10.2026'

const FULL_TURN = Math.PI * 2

export const wheelColors = ['#2447D6', '#0E7490', '#7C3AED', '#B45309', '#047857', '#BE123C']

export const sampleNames = ['דנה', 'יוסי', 'מיכל', 'אורי', 'נועה', 'איתי']

export const yesNoNames = ['כן', 'לא']

export function parseNames(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, MAX_NAMES)
}

export function randomBelow(limit: number, source: Uint32Array = fillRandom(new Uint32Array(1))): number {
  if (limit <= 0) return 0
  const range = 0x100000000
  const cutoff = range - (range % limit)
  let value = source[0]
  while (value >= cutoff) value = fillRandom(new Uint32Array(1))[0]
  return value % limit
}

function fillRandom(buffer: Uint32Array): Uint32Array {
  return crypto.getRandomValues(buffer)
}

export const segmentAngle = (count: number) => FULL_TURN / Math.max(count, 1)

const mod = (value: number, base: number) => ((value % base) + base) % base

export function indexAtPointer(rotation: number, count: number): number {
  const angle = segmentAngle(count)
  return Math.min(count - 1, Math.floor(mod(-rotation, FULL_TURN) / angle))
}

export function targetRotation(current: number, winner: number, count: number, jitter: number): number {
  const angle = segmentAngle(count)
  const centre = -((winner + 0.5 + jitter * 0.8) * angle)
  const forward = mod(centre - current, FULL_TURN)
  return current + SPIN_TURNS * FULL_TURN + forward
}

export const easeOut = (progress: number) => 1 - Math.pow(1 - progress, 4)

export function shareQuery(names: string[]): string {
  const params = new URLSearchParams()
  params.set('names', names.join('\n'))
  return params.toString()
}

export function namesFromQuery(search: string): string[] {
  const value = new URLSearchParams(search).get('names')
  return value ? parseNames(value) : []
}

export function removeAt(names: string[], index: number): string[] {
  return names.filter((_, position) => position !== index)
}
