export const ADDRESS_REVIEWED = '2026-10-23'
export const ADDRESS_REVIEWED_LABEL = '23.10.2026'

export const SETTLEMENTS_API =
  'https://data.gov.il/api/3/action/datastore_search?resource_id=5c78e9fa-c2e2-4771-93ff-7f400a12f7ba&limit=2000&fields=%D7%A9%D7%9D_%D7%99%D7%A9%D7%95%D7%91,%D7%A9%D7%9D_%D7%99%D7%A9%D7%95%D7%91_%D7%9C%D7%95%D7%A2%D7%96%D7%99'

export const ZIP_LOOKUP_URL = 'https://www.israelpost.co.il/zipcode.nsf/demozip?openform'

export type Settlement = { hebrew: string; english: string }

export type StreetType = 'street' | 'boulevard' | 'road' | 'square' | 'alley' | 'neighborhood' | 'none'

export type SpellingStyle = 'standard' | 'simple'

export const streetTypes: { id: StreetType; hebrew: string; english: string }[] = [
  { id: 'street', hebrew: 'רחוב', english: 'St.' },
  { id: 'boulevard', hebrew: 'שדרות', english: 'Blvd.' },
  { id: 'road', hebrew: 'דרך', english: 'Rd.' },
  { id: 'square', hebrew: 'כיכר', english: 'Sq.' },
  { id: 'alley', hebrew: 'סמטת', english: 'Alley' },
  { id: 'neighborhood', hebrew: 'שכונת', english: 'Neighborhood' },
  { id: 'none', hebrew: 'בלי סוג', english: '' },
]

export const fallbackSettlements: Settlement[] = [
  { hebrew: 'ירושלים', english: 'Jerusalem' },
  { hebrew: 'תל אביב - יפו', english: 'Tel Aviv-Yafo' },
  { hebrew: 'חיפה', english: 'Haifa' },
  { hebrew: 'ראשון לציון', english: 'Rishon LeZion' },
  { hebrew: 'פתח תקווה', english: 'Petah Tikva' },
  { hebrew: 'אשדוד', english: 'Ashdod' },
  { hebrew: 'נתניה', english: 'Netanya' },
  { hebrew: 'באר שבע', english: 'Beer Sheva' },
  { hebrew: 'בני ברק', english: 'Bnei Brak' },
  { hebrew: 'חולון', english: 'Holon' },
  { hebrew: 'רמת גן', english: 'Ramat Gan' },
  { hebrew: 'אשקלון', english: 'Ashkelon' },
  { hebrew: 'רחובות', english: 'Rehovot' },
  { hebrew: 'בת ים', english: 'Bat Yam' },
  { hebrew: 'הרצליה', english: 'Herzliya' },
  { hebrew: 'כפר סבא', english: 'Kfar Saba' },
  { hebrew: 'רעננה', english: 'Raanana' },
  { hebrew: 'מודיעין-מכבים-רעות', english: 'Modiin-Maccabim-Reut' },
  { hebrew: 'לוד', english: 'Lod' },
  { hebrew: 'רמלה', english: 'Ramla' },
  { hebrew: 'נהריה', english: 'Nahariyya' },
  { hebrew: 'טבריה', english: 'Tiberias' },
  { hebrew: 'אילת', english: 'Eilat' },
  { hebrew: 'עכו', english: 'Akko' },
  { hebrew: 'הוד השרון', english: 'Hod HaSharon' },
]

const WORD_SMALL = new Set(['of', 'the'])

export function titleCaseCity(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s*-\s*/g, '-')
    .replace(/(^|[\s\-(])([a-z])/g, (_, lead: string, letter: string) => lead + letter.toUpperCase())
    .replace(/\b(Of|The)\b/g, (word) => (WORD_SMALL.has(word.toLowerCase()) ? word.toLowerCase() : word))
}

const collapse = (value: string) => value.replace(/\s+/g, ' ').trim()

export const normalizeHebrew = (value: string) =>
  collapse(value.replace(/[֑-ׇ]/g, '').replace(/[׳״"'`’]/g, ''))

export function parseSettlements(
  records: { שם_ישוב?: string; שם_ישוב_לועזי?: string }[],
): Settlement[] {
  const list: Settlement[] = []
  for (const record of records) {
    const hebrew = collapse(record.שם_ישוב ?? '')
    const english = collapse(record.שם_ישוב_לועזי ?? '')
    if (hebrew && english) list.push({ hebrew, english: titleCaseCity(english) })
  }
  return list.sort((a, b) => a.hebrew.localeCompare(b.hebrew, 'he'))
}

export function findSettlement(list: Settlement[], hebrew: string): Settlement | undefined {
  const needle = normalizeHebrew(hebrew)
  if (!needle) return undefined
  return list.find((entry) => normalizeHebrew(entry.hebrew) === needle)
}

const knownStreets: Record<string, string> = {
  הרצל: 'Herzl',
  'בן גוריון': 'Ben-Gurion',
  זבוטינסקי: 'Jabotinsky',
  ויצמן: 'Weizmann',
  רוטשילד: 'Rothschild',
  אלנבי: 'Allenby',
  דיזנגוף: 'Dizengoff',
  'המלך גורג': 'King George',
  'בן יהודה': 'Ben Yehuda',
  הירקון: 'HaYarkon',
  הנשיא: 'HaNasi',
  הפלמח: 'HaPalmach',
  ביאליק: 'Bialik',
  ארלוזורוב: 'Arlozorov',
  בגין: 'Begin',
  רבין: 'Rabin',
  אוסישקין: 'Ussishkin',
  סוקולוב: 'Sokolov',
  הנביאים: 'HaNevi’im',
  הגפן: 'HaGefen',
  הזית: 'HaZayit',
  הדקל: 'HaDekel',
  האלון: 'HaAlon',
  הברוש: 'HaBrosh',
  הרימון: 'HaRimon',
  התמר: 'HaTamar',
  הגליל: 'HaGalil',
  הנגב: 'HaNegev',
  העצמאות: 'HaAtzmaut',
  החלוצים: 'HaHalutzim',
  הפרחים: 'HaPerachim',
  השלום: 'HaShalom',
  מוהליבר: 'Mohliver',
  קפלן: 'Kaplan',
  'אבן גבירול': 'Ibn Gvirol',
  שינקין: 'Shenkin',
  'נחלת בנימין': 'Nahalat Binyamin',
  הכרמל: 'HaCarmel',
  העלייה: 'HaAliyah',
  'הרב קוק': 'HaRav Kook',
  הרמבם: 'HaRambam',
  רשי: 'Rashi',
  'אחד העם': 'Ahad HaAm',
  יפו: 'Jaffa',
  ירושלים: 'Jerusalem',
  הבורסה: 'HaBursa',
  התקווה: 'HaTikva',
  הגלעד: 'HaGilad',
  הנרקיס: 'HaNarkis',
  הרקפת: 'HaRakefet',
  הדגל: 'HaDegel',
}

const letters: Record<string, { standard: string; simple: string }> = {
  ב: { standard: 'b', simple: 'b' },
  ג: { standard: 'g', simple: 'g' },
  ד: { standard: 'd', simple: 'd' },
  ה: { standard: 'h', simple: 'h' },
  ז: { standard: 'z', simple: 'z' },
  ח: { standard: 'ch', simple: 'h' },
  ט: { standard: 't', simple: 't' },
  כ: { standard: 'kh', simple: 'k' },
  ך: { standard: 'kh', simple: 'k' },
  ל: { standard: 'l', simple: 'l' },
  מ: { standard: 'm', simple: 'm' },
  ם: { standard: 'm', simple: 'm' },
  נ: { standard: 'n', simple: 'n' },
  ן: { standard: 'n', simple: 'n' },
  ס: { standard: 's', simple: 's' },
  פ: { standard: 'p', simple: 'p' },
  ף: { standard: 'f', simple: 'f' },
  צ: { standard: 'tz', simple: 'ts' },
  ץ: { standard: 'tz', simple: 'ts' },
  ק: { standard: 'k', simple: 'k' },
  ר: { standard: 'r', simple: 'r' },
  ש: { standard: 'sh', simple: 'sh' },
  ת: { standard: 't', simple: 't' },
}

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

function transliterateWord(word: string, style: SpellingStyle): string {
  let prefix = ''
  let rest = word
  if (rest.length > 3 && rest.startsWith('ה')) {
    prefix = 'Ha'
    rest = rest.slice(1)
  }
  let output = ''
  let previousConsonant = false
  const chars = [...rest]
  chars.forEach((char, index) => {
    const isLast = index === chars.length - 1
    if (char === 'ו') {
      output += index === 0 ? 'v' : 'o'
      previousConsonant = false
      return
    }
    if (char === 'י') {
      output += index === 0 ? 'y' : 'i'
      previousConsonant = false
      return
    }
    if (char === 'א' || char === 'ע') {
      output += index === 0 || isLast ? '' : 'a'
      previousConsonant = false
      return
    }
    if (char === 'ה' && isLast && index > 0) {
      output += 'a'
      previousConsonant = false
      return
    }
    const mapped = letters[char]
    if (!mapped) {
      output += /[A-Za-z0-9]/.test(char) ? char : ''
      previousConsonant = false
      return
    }
    if (previousConsonant) output += 'e'
    output += mapped[style]
    previousConsonant = true
  })
  return prefix + capitalize(output)
}

export function transliterateStreet(name: string, style: SpellingStyle): { text: string; known: boolean } {
  const clean = normalizeHebrew(name).replace(/^(רחוב|שדרות|דרך|כיכר|סמטת|סמטה|שכונת)\s+/, '')
  if (!clean) return { text: '', known: false }
  const direct = knownStreets[clean]
  if (direct) return { text: direct, known: true }
  const text = clean
    .split(' ')
    .map((word) => (/[א-ת]/.test(word) ? transliterateWord(word, style) : word))
    .join(' ')
  return { text, known: false }
}

export type AddressInput = {
  street: string
  type: StreetType
  number: string
  entrance: string
  apartment: string
  floor: string
  city: string
  zip: string
  recipient: string
  style: SpellingStyle
  zipFirst: boolean
}

export function buildAddress(input: AddressInput): { lines: string[]; streetKnown: boolean } {
  const street = transliterateStreet(input.street, input.style)
  const typeEnglish = streetTypes.find((entry) => entry.id === input.type)?.english ?? ''
  const streetName = [street.text, typeEnglish].filter(Boolean).join(' ')
  const streetLine = [input.number.trim(), streetName].filter(Boolean).join(' ')
  const detail = [
    input.entrance.trim() ? `Entrance ${input.entrance.trim()}` : '',
    input.floor.trim() ? `Floor ${input.floor.trim()}` : '',
    input.apartment.trim() ? `Apt. ${input.apartment.trim()}` : '',
  ]
    .filter(Boolean)
    .join(', ')
  const zip = input.zip.replace(/\D/g, '')
  const city = input.city.trim()
  const cityLine = (input.zipFirst ? [zip, city] : [city, zip]).filter(Boolean).join(' ')
  const lines = [input.recipient.trim(), streetLine, detail, cityLine, city || streetLine ? 'ISRAEL' : '']
  return { lines: lines.filter(Boolean), streetKnown: street.known }
}
