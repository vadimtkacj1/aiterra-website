import { countryCodes, type CountryCode } from './international-dialing-codes'
import { timeInCity, timeInPage, type TimeInPage } from './time-in-cities'

export const DIALING_HUB_PATH = '/tools/international-dialing-codes'

export type TrunkRule = 'zero' | 'zero-landline' | 'none' | 'eight' | 'zero-six' | 'nanp'

type PageSeed = { iso: string; trunk: TrunkRule; timeIn?: string; zone?: string }

const SEEDS: PageSeed[] = [
  { iso: 'US', trunk: 'nanp', timeIn: 'new-york' },
  { iso: 'CA', trunk: 'nanp', timeIn: 'toronto' },
  { iso: 'GB', trunk: 'zero', timeIn: 'london' },
  { iso: 'IT', trunk: 'none', timeIn: 'italy' },
  { iso: 'TH', trunk: 'zero', timeIn: 'thailand' },
  { iso: 'GR', trunk: 'none', timeIn: 'greece' },
  { iso: 'PL', trunk: 'none', zone: 'Europe/Warsaw' },
  { iso: 'AU', trunk: 'zero', timeIn: 'sydney' },
  { iso: 'CN', trunk: 'zero-landline', timeIn: 'china' },
  { iso: 'AE', trunk: 'zero', timeIn: 'dubai' },
  { iso: 'AT', trunk: 'zero', zone: 'Europe/Vienna' },
  { iso: 'FR', trunk: 'zero', timeIn: 'paris' },
  { iso: 'DE', trunk: 'zero', timeIn: 'germany' },
  { iso: 'ES', trunk: 'none', timeIn: 'spain' },
  { iso: 'RU', trunk: 'eight', timeIn: 'moscow' },
  { iso: 'UA', trunk: 'zero', timeIn: 'ukraine' },
  { iso: 'CY', trunk: 'none', zone: 'Europe/Nicosia' },
  { iso: 'TR', trunk: 'zero', timeIn: 'turkey' },
  { iso: 'EG', trunk: 'zero', zone: 'Africa/Cairo' },
  { iso: 'JO', trunk: 'zero', zone: 'Asia/Amman' },
  { iso: 'IN', trunk: 'zero-landline', timeIn: 'india' },
  { iso: 'JP', trunk: 'zero', timeIn: 'japan' },
  { iso: 'NL', trunk: 'zero', zone: 'Europe/Amsterdam' },
  { iso: 'BE', trunk: 'zero', zone: 'Europe/Brussels' },
  { iso: 'CH', trunk: 'zero', zone: 'Europe/Zurich' },
  { iso: 'PT', trunk: 'none', zone: 'Europe/Lisbon' },
  { iso: 'HU', trunk: 'zero-six', zone: 'Europe/Budapest' },
  { iso: 'RO', trunk: 'zero', zone: 'Europe/Bucharest' },
  { iso: 'CZ', trunk: 'none', zone: 'Europe/Prague' },
  { iso: 'GE', trunk: 'zero', zone: 'Asia/Tbilisi' },
  { iso: 'BG', trunk: 'zero', zone: 'Europe/Sofia' },
  { iso: 'BR', trunk: 'zero', timeIn: 'brazil' },
  { iso: 'PH', trunk: 'zero', zone: 'Asia/Manila' },
  { iso: 'VN', trunk: 'zero', zone: 'Asia/Ho_Chi_Minh' },
  { iso: 'ZA', trunk: 'zero', zone: 'Africa/Johannesburg' },
  { iso: 'MD', trunk: 'zero', zone: 'Europe/Chisinau' },
  { iso: 'MA', trunk: 'zero', zone: 'Africa/Casablanca' },
  { iso: 'IE', trunk: 'zero', zone: 'Europe/Dublin' },
  { iso: 'SE', trunk: 'zero', zone: 'Europe/Stockholm' },
  { iso: 'KR', trunk: 'zero', zone: 'Asia/Seoul' },
  { iso: 'HR', trunk: 'zero', zone: 'Europe/Zagreb' },
  { iso: 'ME', trunk: 'zero', zone: 'Europe/Podgorica' },
  { iso: 'RS', trunk: 'zero', zone: 'Europe/Belgrade' },
  { iso: 'NZ', trunk: 'zero', zone: 'Pacific/Auckland' },
  { iso: 'AZ', trunk: 'zero', zone: 'Asia/Baku' },
  { iso: 'LT', trunk: 'zero', zone: 'Europe/Vilnius' },
  { iso: 'FI', trunk: 'zero', zone: 'Europe/Helsinki' },
  { iso: 'SK', trunk: 'zero', zone: 'Europe/Bratislava' },
  { iso: 'SI', trunk: 'zero', zone: 'Europe/Ljubljana' },
  { iso: 'AL', trunk: 'zero', zone: 'Europe/Tirane' },
  { iso: 'DK', trunk: 'none', zone: 'Europe/Copenhagen' },
  { iso: 'NO', trunk: 'none', zone: 'Europe/Oslo' },
  { iso: 'LV', trunk: 'none', zone: 'Europe/Riga' },
  { iso: 'EE', trunk: 'none', zone: 'Europe/Tallinn' },
  { iso: 'MT', trunk: 'none', zone: 'Europe/Malta' },
  { iso: 'SG', trunk: 'none', zone: 'Asia/Singapore' },
  { iso: 'BY', trunk: 'eight', zone: 'Europe/Minsk' },
  { iso: 'KZ', trunk: 'eight', zone: 'Asia/Almaty' },
]

const DEFINITE_ARTICLE_NAMES = new Set(['הפיליפינים'])

export type DialingCountryPage = {
  slug: string
  country: CountryCode
  trunk: TrunkRule
  timeIn?: TimeInPage
  zone: string
}

const slugOf = (english: string) =>
  english
    .toLowerCase()
    .replace(/[^a-z]+/g, '-')
    .replace(/^-|-$/g, '')

export const dialingCountryPages: DialingCountryPage[] = SEEDS.map((seed) => {
  const country = countryCodes.find((item) => item.iso === seed.iso)
  if (!country) throw new Error(`Missing dialing code for ${seed.iso}`)
  const timeIn = seed.timeIn ? timeInPage(seed.timeIn) : undefined
  const zone = seed.zone ?? (timeIn ? timeInCity(timeIn).zone : undefined)
  if (!zone) throw new Error(`Missing time zone for ${seed.iso}`)
  return { slug: slugOf(country.english), country, trunk: seed.trunk, timeIn, zone }
})

export const continentOf = (page: DialingCountryPage) => page.zone.split('/')[0]

export const dialingCountryPath = (slug: string) => `${DIALING_HUB_PATH}/${slug}`

export const dialingCountryBySlug = (slug: string) => dialingCountryPages.find((page) => page.slug === slug)

export const dialingCountryByTimeIn = (timeInSlug: string) =>
  dialingCountryPages.find((page) => page.timeIn?.slug === timeInSlug)

export const dialingCountryByIso =(iso: string) => dialingCountryPages.find((page) => page.country.iso === iso)

export const withPreposition = (letter: 'ל' | 'ב' | 'מ', name: string) =>
  `${letter}${DEFINITE_ARTICLE_NAMES.has(name) ? name.slice(1) : name}`

export const trunkLabel: Record<TrunkRule, string> = {
  zero: '0',
  'zero-landline': '0, לקווים קוויים בלבד',
  none: 'אין',
  eight: '8',
  'zero-six': '06',
  nanp: '1',
}

export const droppedPart: Record<TrunkRule, string> = {
  zero: 'המספר בלי ה-0 שבתחילתו',
  'zero-landline': 'המספר בלי ה-0 של קידומת האזור',
  none: 'המספר המלא, בלי להשמיט דבר',
  eight: 'המספר בלי ה-8 שבתחילתו',
  'zero-six': 'המספר בלי ה-06 שבתחילתו',
  nanp: 'כל 10 הספרות של המספר',
}

export function trunkRuleText(page: DialingCountryPage) {
  const { name, digits } = page.country
  const inCountry = withPreposition('ב', name)
  switch (page.trunk) {
    case 'zero':
      return `מספר טלפון ${inCountry} מתחיל בתוך המדינה ב-0. כשמחייגים מחו״ל ה-0 נשמט: מקלידים +${digits} ואחריו המספר בלי ה-0.`
    case 'zero-landline':
      return `${inCountry} ה-0 מופיע רק לפני קידומת אזור של קו קווי, ומחו״ל הוא נשמט. מספר נייד לא מתחיל ב-0, ואחרי +${digits} מקלידים אותו במלואו.`
    case 'none':
      return `${inCountry} אין קידומת ארצית, והספרה הראשונה היא חלק מהמספר. מחו״ל מקלידים +${digits} ואחריו המספר המלא, בלי להשמיט דבר.`
    case 'eight':
      return `בתוך ${name} מחייגים 8 לפני מספר בעיר אחרת או לפני נייד. מחו״ל ה-8 נשמט: מקלידים +${digits} ואחריו המספר בלי ה-8.`
    case 'zero-six':
      return `בתוך ${name} מחייגים 06 לפני קידומת האזור או הנייד. מחו״ל ה-06 נשמט: מקלידים +${digits} ואחריו המספר בלי ה-06.`
    case 'nanp':
      return `מספר ${inCountry} הוא בן 10 ספרות: קידומת אזור בת 3 ספרות ומספר בן 7. מישראל מקלידים +1 ואחריו 10 הספרות. הספרה 1 היא גם הקידומת הבינלאומית וגם מה שמחייגים בתוך המדינה לפני שיחה לאזור אחר.`
  }
}

const COUNTRY_NOTES: Record<string, string> = {
  IT: 'ה-0 של מספר קווי נשאר גם בחיוג מחו״ל, למשל 06 של רומא: +39 06 ואחריו המספר.',
  GR: 'מספרים קוויים ביוון מתחילים ב-2 וניידים ב-6. הספרות האלה החליפו את ה-0 הישן.',
}

export const countryNoteOf = (page: DialingCountryPage) => COUNTRY_NOTES[page.country.iso] ?? ''

export function sharedWith(page: DialingCountryPage) {
  return countryCodes.filter((item) => item.digits === page.country.digits && item.iso !== page.country.iso)
}

export const nanpMembers = () => countryCodes.filter((item) => item.digits.startsWith('1') && item.digits.length === 4)
