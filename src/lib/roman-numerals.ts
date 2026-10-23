export const ROMAN_MAX = 3999
export const ROMAN_REVIEWED = '2026-10-23'

const symbols: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
]

const letterValues: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }

const canonical = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/

export const toRoman = (value: number): string => {
  let rest = value
  let result = ''
  for (const [size, symbol] of symbols) {
    while (rest >= size) {
      result += symbol
      rest -= size
    }
  }
  return result
}

export type ToRomanOutcome =
  | { kind: 'empty' }
  | { kind: 'error'; message: string }
  | { kind: 'ok'; roman: string; value: number }

export const convertNumber = (input: string): ToRomanOutcome => {
  const clean = input.trim()
  if (!clean) return { kind: 'empty' }
  if (!/^\d+$/.test(clean)) return { kind: 'error', message: 'הקלידו מספר שלם בספרות, בלי נקודה ובלי מינוס.' }
  const value = Number(clean)
  if (value < 1) return { kind: 'error', message: 'במספרים רומיים אין אפס. הקלידו מספר מ-1.' }
  if (value > ROMAN_MAX) {
    return { kind: 'error', message: `הכתיב הסטנדרטי מגיע עד ${ROMAN_MAX} (MMMCMXCIX). הקלידו מספר קטן יותר.` }
  }
  return { kind: 'ok', roman: toRoman(value), value }
}

export type FromRomanOutcome =
  | { kind: 'empty' }
  | { kind: 'error'; message: string }
  | { kind: 'ok'; value: number; roman: string }

const looseValue = (letters: string): number => {
  let total = 0
  for (let index = 0; index < letters.length; index += 1) {
    const current = letterValues[letters[index]]
    const next = letterValues[letters[index + 1]] ?? 0
    total += current < next ? -current : current
  }
  return total
}

export const convertRoman = (input: string): FromRomanOutcome => {
  const clean = input.trim().toUpperCase()
  if (!clean) return { kind: 'empty' }
  if (!/^[IVXLCDM]+$/.test(clean)) {
    return { kind: 'error', message: 'אפשר להקליד רק את האותיות I, V, X, L, C, D ו-M.' }
  }
  if (canonical.test(clean)) return { kind: 'ok', value: looseValue(clean), roman: clean }
  const guess = looseValue(clean)
  if (guess >= 1 && guess <= ROMAN_MAX) {
    return {
      kind: 'error',
      message: `זה לא כתיב רומי תקני. הכתיב התקני של ${guess} הוא ${toRoman(guess)}.`,
    }
  }
  return { kind: 'error', message: 'זה לא כתיב רומי תקני של מספר בין 1 ל-3999.' }
}

export const keyLetters = [
  { letter: 'I', value: 1 },
  { letter: 'V', value: 5 },
  { letter: 'X', value: 10 },
  { letter: 'L', value: 50 },
  { letter: 'C', value: 100 },
  { letter: 'D', value: 500 },
  { letter: 'M', value: 1000 },
]

export const tableValues: number[] = [
  ...Array.from({ length: 20 }, (_, index) => index + 1),
  30,
  40,
  50,
  60,
  70,
  80,
  90,
  100,
  200,
  300,
  400,
  500,
  600,
  700,
  800,
  900,
  1000,
  2000,
  3000,
]
