export type MethodId = 'standard' | 'gadol' | 'katan' | 'ordinal' | 'atbash' | 'albam'

export type Method = { id: MethodId; name: string; short: string; description: string }

export type LetterRow = { letter: string; values: Record<MethodId, number>; atbash: string; albam: string }

export type GematriaResult = {
  text: string
  letters: LetterRow[]
  totals: Record<MethodId, number>
  atbashText: string
  albamText: string
  ignored: string[]
}

export const LETTERS = 'אבגדהוזחטיכלמנסעפצקרשת'

export const FINALS: Record<string, string> = { ך: 'כ', ם: 'מ', ן: 'נ', ף: 'פ', ץ: 'צ' }

const FINAL_OF: Record<string, string> = { כ: 'ך', מ: 'ם', נ: 'ן', פ: 'ף', צ: 'ץ' }

const GADOL_FINALS: Record<string, number> = { ך: 500, ם: 600, ן: 700, ף: 800, ץ: 900 }

export const MAX_LENGTH = 200

export const methods: Method[] = [
  {
    id: 'standard',
    name: 'מספר הכרחי',
    short: 'רגיל',
    description: 'הגימטריה הרגילה: א׳ עד ט׳ הן 1 עד 9, י׳ עד צ׳ הן 10 עד 90, ק׳ עד ת׳ הן 100 עד 400. אותיות סופיות שוות לרגילות.',
  },
  {
    id: 'gadol',
    name: 'מספר גדול',
    short: 'סופיות',
    description: 'כמו הרגיל, אבל האותיות הסופיות ממשיכות את הספירה: ך׳ 500, ם׳ 600, ן׳ 700, ף׳ 800 ו-ץ׳ 900.',
  },
  {
    id: 'katan',
    name: 'מספר קטן',
    short: 'קטן',
    description: 'מורידים את האפסים מערך כל אות: י׳ היא 1, כ׳ 2, ק׳ 1 ו-ת׳ 4. כל אות שווה מספר בין 1 ל-9.',
  },
  {
    id: 'ordinal',
    name: 'מספר סידורי',
    short: 'סידורי',
    description: 'מקום האות באלף-בית: א׳ 1, ב׳ 2 וכן הלאה עד ת׳ 22. אותיות סופיות מקבלות את מקום האות הרגילה.',
  },
  {
    id: 'atbash',
    name: 'אתב״ש',
    short: 'אתב״ש',
    description: 'מחליפים כל אות באות שמולה כשהופכים את האלף-בית: א׳ בת׳, ב׳ בש׳, ג׳ בר׳, ומחשבים את המילה החדשה בגימטריה הרגילה.',
  },
  {
    id: 'albam',
    name: 'אלב״ם',
    short: 'אלב״ם',
    description: 'מחלקים את האלף-בית לשני חצאים ומחליפים: א׳ בל׳, ב׳ במ׳, ג׳ בנ׳, ומחשבים את המילה החדשה בגימטריה הרגילה.',
  },
]

const standardOf = (letter: string) => {
  const index = LETTERS.indexOf(letter)
  if (index < 9) return index + 1
  if (index < 18) return (index - 8) * 10
  return (index - 17) * 100
}

const regularOf = (letter: string) => FINALS[letter] ?? letter

const mirror = (letter: string, map: (index: number) => number) => {
  const regular = regularOf(letter)
  return LETTERS[map(LETTERS.indexOf(regular))]
}

const atbashLetter = (letter: string) => mirror(letter, (index) => 21 - index)

const albamLetter = (letter: string) => mirror(letter, (index) => (index + 11) % 22)

export const isHebrewLetter = (char: string) => LETTERS.includes(char) || char in FINALS

const NIQQUD = /[֑-ׇ]/g

const withFinals = (letters: string[]) =>
  letters.map((letter, index) => {
    const next = letters[index + 1]
    const atEnd = next === undefined || next === ' '
    return atEnd && FINAL_OF[letter] ? FINAL_OF[letter] : letter
  })

export function letterRow(letter: string): LetterRow {
  const regular = regularOf(letter)
  const standard = standardOf(regular)
  const atbash = atbashLetter(letter)
  const albam = albamLetter(letter)
  return {
    letter,
    atbash,
    albam,
    values: {
      standard,
      gadol: GADOL_FINALS[letter] ?? standard,
      katan: Number(String(standard).replace(/0+$/, '')),
      ordinal: LETTERS.indexOf(regular) + 1,
      atbash: standardOf(atbash),
      albam: standardOf(albam),
    },
  }
}

export function calculate(input: string): GematriaResult {
  const text = input.replace(NIQQUD, '').slice(0, MAX_LENGTH)
  const letters: LetterRow[] = []
  const ignored = new Set<string>()
  const atbash: string[] = []
  const albam: string[] = []
  for (const char of text) {
    if (isHebrewLetter(char)) {
      const row = letterRow(char)
      letters.push(row)
      atbash.push(row.atbash)
      albam.push(row.albam)
    } else if (/\s/.test(char)) {
      if (atbash.length && atbash[atbash.length - 1] !== ' ') {
        atbash.push(' ')
        albam.push(' ')
      }
    } else if (!/[׳״"'.,\-־?!]/.test(char)) {
      ignored.add(char)
    }
  }
  const totals = Object.fromEntries(
    methods.map((method) => [method.id, letters.reduce((sum, row) => sum + row.values[method.id], 0)]),
  ) as Record<MethodId, number>
  return {
    text,
    letters,
    totals,
    atbashText: withFinals(atbash).join('').trim(),
    albamText: withFinals(albam).join('').trim(),
    ignored: [...ignored].slice(0, 8),
  }
}

export const valueOf = (word: string) => calculate(word).totals.standard

export const curatedWords = [
  'אחד',
  'אהבה',
  'יין',
  'סוד',
  'נחש',
  'משיח',
  'אור',
  'רז',
  'אלהים',
  'הטבע',
  'סולם',
  'סיני',
  'חי',
  'טוב',
  'לב',
  'אב',
  'אם',
  'בן',
  'בת',
  'אח',
  'אחות',
  'אדם',
  'חוה',
  'אמת',
  'שלום',
  'שמחה',
  'ברכה',
  'תורה',
  'ישראל',
  'ירושלים',
  'ציון',
  'שבת',
  'חג',
  'מזל',
  'מזל טוב',
  'חיים',
  'אמונה',
  'תפילה',
  'חסד',
  'צדקה',
  'חכמה',
  'בינה',
  'דעת',
  'גן',
  'עדן',
  'שמים',
  'ארץ',
  'מים',
  'אש',
  'שמש',
  'ירח',
  'כוכב',
  'לחם',
  'נר',
  'זהב',
  'כסף',
  'מלך',
  'משה',
  'אהרן',
  'דוד',
  'אברהם',
  'יצחק',
  'יעקב',
  'שרה',
  'רבקה',
  'רחל',
  'לאה',
  'בית',
  'משפחה',
  'אמן',
  'נצח',
  'כבוד',
  'ענוה',
  'פרי',
  'זרע',
  'עשו',
  'גדול',
  'קטן',
  'יום',
  'לילה',
]

const valueIndex = new Map<number, string[]>()
for (const word of curatedWords) {
  const value = valueOf(word)
  valueIndex.set(value, [...(valueIndex.get(value) ?? []), word])
}

export const wordsWithValue = (value: number, exclude: string) => {
  const own = exclude.replace(NIQQUD, '').trim()
  return (valueIndex.get(value) ?? []).filter((word) => word !== own)
}

export const famousPairs = (() => {
  const pairs: { value: number; words: string[] }[] = []
  for (const [value, words] of valueIndex) if (words.length > 1) pairs.push({ value, words })
  return pairs.sort((a, b) => a.value - b.value)
})()

export const toHebrewNumeral = (value: number) => {
  if (value <= 0 || value >= 1000) return ''
  let rest = value
  let letters = ''
  for (const [amount, letter] of [
    [400, 'ת'],
    [300, 'ש'],
    [200, 'ר'],
    [100, 'ק'],
  ] as const) {
    while (rest >= amount) {
      letters += letter
      rest -= amount
    }
  }
  if (rest === 15) letters += 'טו'
  else if (rest === 16) letters += 'טז'
  else {
    const tens = Math.floor(rest / 10)
    const units = rest % 10
    if (tens) letters += LETTERS[8 + tens]
    if (units) letters += LETTERS[units - 1]
  }
  return letters.length === 1 ? `${letters}׳` : `${letters.slice(0, -1)}״${letters.slice(-1)}`
}

export const readQuery = (search: string) => new URLSearchParams(search).get('text')?.slice(0, MAX_LENGTH) ?? null

export const writeQuery = (text: string) => {
  const trimmed = text.trim()
  return trimmed ? `?text=${encodeURIComponent(trimmed)}` : ''
}
