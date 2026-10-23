export const FIRST_YEAR = 1924
export const LAST_YEAR = 2043
export const MIN_DATE = '1924-02-05'
export const MAX_DATE = '2044-01-29'
export const LAST_NEXT_START = '2044-01-30'
export const ZODIAC_REVIEWED = '2026-10-23'

const startDates = `
02-05 01-24 02-13 02-02 01-23 02-10 01-30 02-17 02-06 01-26 02-14 02-04
01-24 02-11 01-31 02-19 02-08 01-27 02-15 02-05 01-25 02-13 02-02 01-22
02-10 01-29 02-17 02-06 01-27 02-14 02-03 01-24 02-12 01-31 02-18 02-08
01-28 02-15 02-05 01-25 02-13 02-02 01-21 02-09 01-30 02-17 02-06 01-27
02-15 02-03 01-23 02-11 01-31 02-18 02-07 01-28 02-16 02-05 01-25 02-13
02-02 02-20 02-09 01-29 02-17 02-06 01-27 02-15 02-04 01-23 02-10 01-31
02-19 02-07 01-28 02-16 02-05 01-24 02-12 02-01 01-22 02-09 01-29 02-18
02-07 01-26 02-14 02-03 01-23 02-10 01-31 02-19 02-08 01-28 02-16 02-05
01-25 02-12 02-01 01-22 02-10 01-29 02-17 02-06 01-26 02-13 02-03 01-23
02-11 01-31 02-19 02-08 01-28 02-15 02-04 01-24 02-12 02-01 01-22 02-10
`
  .trim()
  .split(/\s+/)

export type Animal = { id: string; he: string; en: string }

export const animals: Animal[] = [
  { id: 'rat', he: 'חולדה', en: 'Rat' },
  { id: 'ox', he: 'שור', en: 'Ox' },
  { id: 'tiger', he: 'נמר', en: 'Tiger' },
  { id: 'rabbit', he: 'ארנב', en: 'Rabbit' },
  { id: 'dragon', he: 'דרקון', en: 'Dragon' },
  { id: 'snake', he: 'נחש', en: 'Snake' },
  { id: 'horse', he: 'סוס', en: 'Horse' },
  { id: 'goat', he: 'עז', en: 'Goat' },
  { id: 'monkey', he: 'קוף', en: 'Monkey' },
  { id: 'rooster', he: 'תרנגול', en: 'Rooster' },
  { id: 'dog', he: 'כלב', en: 'Dog' },
  { id: 'pig', he: 'חזיר', en: 'Pig' },
]

const elements = ['עץ', 'אש', 'אדמה', 'מתכת', 'מים']

export const newYearIso = (year: number): string => `${year}-${startDates[year - FIRST_YEAR]}`

export const formatDate = (iso: string): string => iso.split('-').reverse().join('.')

export const animalOf = (year: number): Animal => animals[(((year - 4) % 12) + 12) % 12]

export const elementOf = (year: number): string => elements[Math.floor((((year - 4) % 10) + 10) % 10 / 2)]

export const polarityOf = (year: number): string => (year % 2 === 0 ? 'יאנג' : 'יין')

export type ZodiacResult =
  | { kind: 'empty' }
  | { kind: 'error'; message: string }
  | {
      kind: 'ok'
      zodiacYear: number
      animal: Animal
      element: string
      polarity: string
      startsOn: string
      nextStartsOn: string
      calendarYear: number
      beforeNewYear: boolean
    }

export const findZodiac = (iso: string): ZodiacResult => {
  const value = iso.trim()
  if (!value) return { kind: 'empty' }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return { kind: 'error', message: 'בחרו תאריך מלא.' }
  if (value < MIN_DATE || value > MAX_DATE) {
    return { kind: 'error', message: `הכלי מכסה תאריכים מ-${formatDate(MIN_DATE)} עד ${formatDate(MAX_DATE)}.` }
  }
  const calendarYear = Number(value.slice(0, 4))
  const zodiacYear =
    calendarYear > LAST_YEAR || value < newYearIso(calendarYear) ? Math.min(calendarYear - 1, LAST_YEAR) : calendarYear
  const nextStartsOn = zodiacYear === LAST_YEAR ? LAST_NEXT_START : newYearIso(zodiacYear + 1)
  return {
    kind: 'ok',
    zodiacYear,
    animal: animalOf(zodiacYear),
    element: elementOf(zodiacYear),
    polarity: polarityOf(zodiacYear),
    startsOn: newYearIso(zodiacYear),
    nextStartsOn,
    calendarYear,
    beforeNewYear: zodiacYear !== calendarYear,
  }
}

export const years = (from: number, to: number): number[] =>
  Array.from({ length: to - from + 1 }, (_, index) => from + index)

export const allYears = years(FIRST_YEAR, LAST_YEAR)

export const recentYearsOf = (animalId: string, upTo: number, count: number): number[] =>
  allYears
    .filter((year) => animalOf(year).id === animalId && year <= upTo)
    .slice(-count)
    .reverse()
