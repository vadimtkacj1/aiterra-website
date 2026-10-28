export const SEED_MAX_LENGTH = 60
export const QUESTION_PREFIXES = ['איך', 'מה', 'כמה', 'למה', 'איפה', 'האם', 'מתי']
export const HEBREW_LETTERS = 'אבגדהוזחטיכלמנסעפצקרשת'.split('')
export const LATIN_LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('')

export type KeywordGroupId = 'seed' | 'questions' | 'hebrew' | 'latin'

export type KeywordGroup = { id: KeywordGroupId; keywords: string[] }

export type KeywordIdeasResponse = { seed: string; total: number; groups: KeywordGroup[] }

export type KeywordQuery = { group: KeywordGroupId; query: string }

export function normalizeSeed(input: string) {
  const seed = input.replace(/[\u0000-\u001f<>{}]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase()
  if (seed.length < 2 || seed.length > SEED_MAX_LENGTH) return null
  return /[\p{L}\p{N}]/u.test(seed) ? seed : null
}

export function buildQueries(seed: string): KeywordQuery[] {
  return [
    { group: 'seed', query: seed },
    ...QUESTION_PREFIXES.map((prefix) => ({ group: 'questions' as const, query: `${prefix} ${seed}` })),
    ...HEBREW_LETTERS.map((letter) => ({ group: 'hebrew' as const, query: `${seed} ${letter}` })),
    ...LATIN_LETTERS.map((letter) => ({ group: 'latin' as const, query: `${seed} ${letter}` })),
  ]
}

export function parseSuggestions(payload: unknown) {
  if (!Array.isArray(payload) || !Array.isArray(payload[1])) return []
  return payload[1].filter((item): item is string => typeof item === 'string')
}

const clean = (keyword: string) => keyword.replace(/\s+/g, ' ').trim().toLowerCase()

export function groupKeywords(seed: string, results: { group: KeywordGroupId; suggestions: string[] }[]) {
  const seen = new Set<string>()
  const buckets: Record<KeywordGroupId, string[]> = { seed: [], questions: [], hebrew: [], latin: [] }
  for (const { group, suggestions } of results) {
    for (const raw of suggestions) {
      const keyword = clean(raw)
      if (!keyword || keyword === seed || seen.has(keyword)) continue
      seen.add(keyword)
      const isQuestion = QUESTION_PREFIXES.some((prefix) => keyword.startsWith(`${prefix} `))
      buckets[isQuestion ? 'questions' : group].push(keyword)
    }
  }
  const groups = (Object.keys(buckets) as KeywordGroupId[])
    .map((id) => ({ id, keywords: buckets[id] }))
    .filter((group) => group.keywords.length)
  return { seed, total: seen.size, groups }
}

export const GROUP_LABELS: Record<KeywordGroupId, string> = {
  seed: 'השלמות ישירות',
  questions: 'שאלות',
  hebrew: 'המשכים באותיות עבריות',
  latin: 'המשכים באותיות לועזיות',
}

const csvCell = (value: string) => `"${value.replace(/"/g, '""')}"`

export function toCsv(response: KeywordIdeasResponse) {
  const rows = response.groups.flatMap((group) =>
    group.keywords.map((keyword) => [csvCell(keyword), csvCell(GROUP_LABELS[group.id])].join(',')),
  )
  return `﻿${['"keyword","group"', ...rows].join('\r\n')}`
}
