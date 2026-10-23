export const MIN_BPM = 30
export const MAX_BPM = 300
export const DEFAULT_BPM = 100

export type SignatureId = '2-4' | '3-4' | '4-4' | '5-4' | '6-8' | '7-8'

export type Signature = { id: SignatureId; label: string; beats: number; groups: number[] }

export const signatures: Signature[] = [
  { id: '2-4', label: '2/4', beats: 2, groups: [2] },
  { id: '3-4', label: '3/4', beats: 3, groups: [3] },
  { id: '4-4', label: '4/4', beats: 4, groups: [4] },
  { id: '5-4', label: '5/4', beats: 5, groups: [3, 2] },
  { id: '6-8', label: '6/8', beats: 6, groups: [3, 3] },
  { id: '7-8', label: '7/8', beats: 7, groups: [2, 2, 3] },
]

export const DEFAULT_SIGNATURE: SignatureId = '4-4'

export type SubdivisionId = 'none' | 'eighths' | 'triplets' | 'sixteenths'

export const subdivisions: { id: SubdivisionId; label: string; hint: string; perBeat: number }[] = [
  { id: 'none', label: 'בלי חלוקה', hint: 'נקישה לכל פעמה', perBeat: 1 },
  { id: 'eighths', label: 'שמיניות', hint: 'שתי נקישות לפעמה', perBeat: 2 },
  { id: 'triplets', label: 'שלישיות', hint: 'שלוש נקישות לפעמה', perBeat: 3 },
  { id: 'sixteenths', label: 'שש עשריות', hint: 'ארבע נקישות לפעמה', perBeat: 4 },
]

export const DEFAULT_SUBDIVISION: SubdivisionId = 'none'

export type BeatLevel = 'strong' | 'medium' | 'normal'

export const beatLevels = (signature: Signature): BeatLevel[] => {
  const levels: BeatLevel[] = []
  signature.groups.forEach((size, groupIndex) => {
    for (let index = 0; index < size; index += 1) {
      levels.push(index === 0 ? (groupIndex === 0 ? 'strong' : 'medium') : 'normal')
    }
  })
  return levels
}

export const clampBpm = (value: number) => Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(value)))

export type TempoBand = { from: number; name: string; meaning: string }

export const tempoBands: TempoBand[] = [
  { from: 30, name: 'גרייב', meaning: 'איטי מאוד וחגיגי' },
  { from: 40, name: 'לארגו', meaning: 'איטי ורחב' },
  { from: 66, name: 'אדג׳ו', meaning: 'איטי ורגוע' },
  { from: 76, name: 'אנדנטה', meaning: 'קצב הליכה' },
  { from: 108, name: 'מודרטו', meaning: 'מתון' },
  { from: 120, name: 'אלגרו', meaning: 'מהיר ועליז' },
  { from: 156, name: 'ויואצ׳ה', meaning: 'חי ומהיר' },
  { from: 168, name: 'פרסטו', meaning: 'מהיר מאוד' },
  { from: 200, name: 'פרסטיסימו', meaning: 'מהיר במיוחד' },
]

export const tempoBand = (bpm: number) =>
  [...tempoBands].reverse().find((band) => bpm >= band.from) ?? tempoBands[0]

export const presets: { id: string; label: string; bpm: number }[] = [
  { id: 'slow', label: 'איטי', bpm: 50 },
  { id: 'ballad', label: 'בלדה', bpm: 70 },
  { id: 'walk', label: 'הליכה', bpm: 100 },
  { id: 'march', label: 'מצעד', bpm: 120 },
  { id: 'dance', label: 'ריקוד', bpm: 140 },
  { id: 'fast', label: 'מהיר', bpm: 180 },
]

export const TAP_RESET_MS = 2000
export const TAP_WINDOW = 8

export function nextTaps(taps: number[], now: number) {
  const recent = taps.length && now - taps[taps.length - 1] > TAP_RESET_MS ? [] : taps
  return [...recent, now].slice(-TAP_WINDOW)
}

export function bpmFromTaps(taps: number[]) {
  if (taps.length < 2) return null
  const average = (taps[taps.length - 1] - taps[0]) / (taps.length - 1)
  return clampBpm(60000 / average)
}

export const secondsPerTick = (bpm: number, perBeat: number) => 60 / bpm / perBeat

export const barDurationSeconds = (bpm: number, beats: number) => (beats * 60) / bpm
