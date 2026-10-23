import {
  blessingPacks,
  type LongToneId,
  type OccasionId,
  type RelationId,
  type ToneId,
} from './blessings-content'

export type { OccasionId, RelationId, ToneId } from './blessings-content'

export type GenderId = 'm' | 'f'

export type BlessingInput = {
  occasion: OccasionId
  tone: ToneId
  relation: RelationId
  gender: GenderId
  name: string
  age: string
  sender: string
  round: number
}

export type BlessingResult = { blessings: string[]; card: string }

export const VARIANT_COUNT = 3
export const DEFAULT_TONE: ToneId = 'heartfelt'
export const DEFAULT_RELATION: RelationId = 'friend'

export const tones: { id: ToneId; label: string; hint: string }[] = [
  { id: 'heartfelt', label: 'מרגש', hint: 'חם ואישי' },
  { id: 'funny', label: 'מצחיק', hint: 'עם חיוך' },
  { id: 'short', label: 'קצר', hint: 'שורה או שתיים' },
  { id: 'religious', label: 'דתי', hint: 'עם ברכת ה׳' },
]

const SIGNOFF: Record<RelationId, string> = {
  friend: 'באהבה',
  family: 'באהבה גדולה',
  colleague: 'בברכה',
}

const OPTIONAL_SEGMENT = /\[\[(.*?)\]\]/g
const GENDERED_PAIR = /\{([^{}|]+)\|([^{}|]+)\}/g
const MAX_AGE = 120

const mulberry32 = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

function shuffled<T>(items: T[], random: () => number) {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1))
    ;[copy[index], copy[swap]] = [copy[swap], copy[index]]
  }
  return copy
}

function pick<T>(items: T[], count: number, random: () => number) {
  const order = shuffled(items, random)
  return Array.from({ length: count }, (_, index) => order[index % order.length])
}

export const cleanAge = (value: string) => {
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) || parsed < 1 || parsed > MAX_AGE ? '' : String(parsed)
}

export function renderTemplate(
  template: string,
  values: { name: string; age: string; gender: GenderId },
) {
  return template
    .replace(OPTIONAL_SEGMENT, (_, inner: string) => {
      const needsName = inner.includes('{name}') && !values.name
      const needsAge = inner.includes('{age}') && !values.age
      return needsName || needsAge ? '' : inner
    })
    .replace(/\{name\}/g, values.name)
    .replace(/\{age\}/g, values.age)
    .replace(GENDERED_PAIR, (_, masculine: string, feminine: string) =>
      values.gender === 'm' ? masculine : feminine,
    )
    .replace(/ {2,}/g, ' ')
    .replace(/\s+([,.!?])/g, '$1')
    .trim()
}

const withSender = (text: string, relation: RelationId, sender: string) =>
  sender ? `${text}\n\n${SIGNOFF[relation]}, ${sender}` : text

export function joinNames(first: string, second: string) {
  const a = first.trim()
  const b = second.trim()
  return a && b ? `${a} ו${b}` : ''
}

export function buildBlessings(input: BlessingInput): BlessingResult {
  const pack = blessingPacks[input.occasion]
  const random = mulberry32(input.round * 7919 + 13)
  const values = { name: input.name.trim(), age: cleanAge(input.age), gender: input.gender }
  const sender = input.sender.trim()
  const render = (template: string) => renderTemplate(template, values)

  const cardPool = input.tone === 'religious' ? pack.card.religious : pack.card.general
  const card = render(pick(cardPool, 1, random)[0])

  if (input.tone === 'short') {
    const texts = pick(pack.short[input.relation], VARIANT_COUNT, random).map(render)
    return { blessings: texts.map((text) => withSender(text, input.relation, sender)), card }
  }

  const tone: LongToneId = input.tone
  if (input.relation === 'colleague' && pack.colleagueFull) {
    const texts = pick(pack.colleagueFull[tone], VARIANT_COUNT, random).map(render)
    return { blessings: texts.map((text) => withSender(text, input.relation, sender)), card }
  }

  const openers = pick(pack.openers[tone], VARIANT_COUNT, random)
  const bodies = pick(pack.bodies[tone], VARIANT_COUNT, random)
  const closers = pick(pack.closers[tone], VARIANT_COUNT, random)
  const relationLines = pick(pack.relation[input.relation], VARIANT_COUNT, random)

  const blessings = Array.from({ length: VARIANT_COUNT }, (_, index) => {
    const middle = `${bodies[index]} ${relationLines[index]}`
    const text = `${render(openers[index])}\n\n${render(middle)}\n\n${render(closers[index])}`
    return withSender(text, input.relation, sender)
  })

  return { blessings, card }
}

export function combineBlessings(blessings: string[], card: string) {
  const numbered = blessings.map((text, index) => `ברכה ${index + 1}:\n${text}`)
  return [...numbered, `ברכה קצרה לכרטיס:\n${card}`].join('\n\n---\n\n')
}

export const countWords = (text: string) => text.split(/\s+/).filter(Boolean).length
