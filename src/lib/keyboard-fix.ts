export type FixDirection = 'toHebrew' | 'toEnglish'

const latinKeys = "qwertyuiopasdfghjkl;'zxcvbnm,./`"
const hebrewKeys = "/'קראטוןםפשדגכעיחלךף,זסבהנמצתץ.;"

const toHebrewMap = new Map<string, string>()
const toEnglishMap = new Map<string, string>()

for (let index = 0; index < latinKeys.length; index += 1) {
  toHebrewMap.set(latinKeys[index], hebrewKeys[index])
  toEnglishMap.set(hebrewKeys[index], latinKeys[index])
}

const hebrewLetter = /[א-ת]/
const latinLetter = /[a-z]/i

export function convertLayout(text: string, direction: FixDirection): string {
  return Array.from(text)
    .map((char) => {
      if (direction === 'toHebrew') {
        const lower = char.toLowerCase()
        return latinLetter.test(char) || toHebrewMap.has(char) ? (toHebrewMap.get(lower) ?? char) : char
      }
      return toEnglishMap.get(char) ?? char
    })
    .join('')
}

export function detectDirection(text: string): FixDirection {
  let latin = 0
  let hebrew = 0
  for (const char of text) {
    if (latinLetter.test(char)) latin += 1
    else if (hebrewLetter.test(char)) hebrew += 1
  }
  return hebrew > latin ? 'toEnglish' : 'toHebrew'
}

export const keyPairs = Array.from(latinKeys)
  .map((key, index) => ({ latin: key, hebrew: hebrewKeys[index] }))
  .filter((pair) => latinLetter.test(pair.latin))

export const examples = [
  { typed: 'akuo', meant: 'שלום' },
  { typed: 'ebhv', meant: 'קניה' },
  { typed: 'cshev', meant: 'בדיקה' },
  { typed: 'nv eurv', meant: 'מה קורה' },
]
