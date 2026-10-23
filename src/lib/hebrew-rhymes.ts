import { WORD_LIST } from './hebrew-rhyme-words'

export type RhymeStrength = 'perfect' | 'good' | 'near'

export type RhymeResult = Record<RhymeStrength, string[]>

export const RHYME_STRENGTHS: { id: RhymeStrength; label: string; description: string }[] = [
  { id: 'perfect', label: 'חרוזים מלאים', description: 'הסיום זהה, לפחות שלוש אותיות או שתיים שאינן סיומת דקדוקית' },
  { id: 'good', label: 'חרוזים טובים', description: 'אותה סיומת דקדוקית, כמו ״ים״ או ״תי״' },
  { id: 'near', label: 'חרוזים קרובים', description: 'צלילים דומים: ת וט, כ וח, א וע' },
]

const FINAL_TO_REGULAR: Record<string, string> = { ך: 'כ', ם: 'מ', ן: 'נ', ף: 'פ', ץ: 'צ' }

const SOUND_CLASS: Record<string, string> = { ט: 'ת', ח: 'כ', ק: 'כ', ע: 'א', ה: 'א' }

const NON_LETTERS = /[^א-ת]/g

export const MIN_LETTERS = 2

export const normalizeWord = (input: string) =>
  input
    .normalize('NFD')
    .replace(NON_LETTERS, '')
    .replace(/[ךםןףץ]/g, (letter) => FINAL_TO_REGULAR[letter])

const INFLECTIONAL_ENDINGS = ['ים', 'ות', 'תי', 'נו'].map(normalizeWord)

const soundKey = (normalized: string) =>
  Array.from(normalized, (letter) => SOUND_CLASS[letter] ?? letter).join('')

const commonSuffixLength = (a: string, b: string) => {
  let length = 0
  while (length < a.length && length < b.length && a.at(-1 - length) === b.at(-1 - length)) length += 1
  return length
}

type Entry = { word: string; normalized: string; sound: string }

const ENTRIES: Entry[] = WORD_LIST.map((word) => {
  const normalized = normalizeWord(word)
  return { word, normalized, sound: soundKey(normalized) }
})

export const dictionarySize = ENTRIES.length

export function lastWord(input: string) {
  const parts = input.trim().split(/\s+/)
  return parts[parts.length - 1] ?? ''
}

function classify(target: Entry, candidate: Entry): { strength: RhymeStrength; score: number } | null {
  if (candidate.normalized === target.normalized) return null
  const exact = commonSuffixLength(target.normalized, candidate.normalized)
  const sound = commonSuffixLength(target.sound, candidate.sound)
  const endsInflected = INFLECTIONAL_ENDINGS.includes(target.normalized.slice(-2))
  if (exact >= 3 || (exact === 2 && !endsInflected)) return { strength: 'perfect', score: exact * 10 + sound }
  if (exact === 2) return { strength: 'good', score: sound }
  if (sound >= 2) return { strength: 'near', score: sound }
  return null
}

export function findRhymes(input: string): RhymeResult {
  const empty: RhymeResult = { perfect: [], good: [], near: [] }
  const normalized = normalizeWord(lastWord(input))
  if (normalized.length < MIN_LETTERS) return empty

  const target: Entry = { word: input, normalized, sound: soundKey(normalized) }
  const buckets: Record<RhymeStrength, { word: string; score: number; gap: number }[]> = {
    perfect: [],
    good: [],
    near: [],
  }

  for (const candidate of ENTRIES) {
    const match = classify(target, candidate)
    if (!match) continue
    buckets[match.strength].push({
      word: candidate.word,
      score: match.score,
      gap: Math.abs(candidate.normalized.length - normalized.length),
    })
  }

  const order = (bucket: { word: string; score: number; gap: number }[]) =>
    bucket
      .sort((a, b) => b.score - a.score || a.gap - b.gap || a.word.localeCompare(b.word, 'he'))
      .map((item) => item.word)

  return { perfect: order(buckets.perfect), good: order(buckets.good), near: order(buckets.near) }
}

export type LengthFilter = 'any' | 'short' | 'long'

export const LENGTH_FILTERS: { id: LengthFilter; label: string; hint: string }[] = [
  { id: 'any', label: 'כל האורכים', hint: 'בלי סינון' },
  { id: 'short', label: 'מילים קצרות', hint: 'עד 4 אותיות' },
  { id: 'long', label: 'מילים ארוכות', hint: '5 אותיות ומעלה' },
]

export const SHORT_WORD_LETTERS = 4

export function filterByLength(words: string[], filter: LengthFilter) {
  if (filter === 'any') return words
  return words.filter((word) => {
    const length = normalizeWord(word).length
    return filter === 'short' ? length <= SHORT_WORD_LETTERS : length > SHORT_WORD_LETTERS
  })
}

export const EXAMPLE_WORDS = ['אהבה', 'שלום', 'לילה', 'חלום', 'שמחה', 'כוכב']
