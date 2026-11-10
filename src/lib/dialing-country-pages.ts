import { countryCodes, type CountryCode } from './international-dialing-codes'
import { timeInPage, type TimeInPage } from './time-in-cities'

export const DIALING_HUB_PATH = '/tools/international-dialing-codes'

export type TrunkRule = 'zero' | 'zero-landline' | 'none' | 'eight' | 'zero-six' | 'nanp'

type PageSeed = { iso: string; trunk: TrunkRule; timeIn?: string }

const SEEDS: PageSeed[] = [
  { iso: 'US', trunk: 'nanp', timeIn: 'new-york' },
  { iso: 'CA', trunk: 'nanp', timeIn: 'toronto' },
  { iso: 'GB', trunk: 'zero', timeIn: 'london' },
  { iso: 'IT', trunk: 'none', timeIn: 'italy' },
  { iso: 'TH', trunk: 'zero', timeIn: 'thailand' },
  { iso: 'GR', trunk: 'none', timeIn: 'greece' },
  { iso: 'PL', trunk: 'none' },
  { iso: 'AU', trunk: 'zero', timeIn: 'sydney' },
  { iso: 'CN', trunk: 'zero-landline', timeIn: 'china' },
  { iso: 'AE', trunk: 'zero', timeIn: 'dubai' },
  { iso: 'AT', trunk: 'zero' },
  { iso: 'FR', trunk: 'zero', timeIn: 'paris' },
  { iso: 'DE', trunk: 'zero', timeIn: 'germany' },
  { iso: 'ES', trunk: 'none', timeIn: 'spain' },
  { iso: 'RU', trunk: 'eight', timeIn: 'moscow' },
  { iso: 'UA', trunk: 'zero', timeIn: 'ukraine' },
  { iso: 'CY', trunk: 'none' },
  { iso: 'TR', trunk: 'zero', timeIn: 'turkey' },
  { iso: 'EG', trunk: 'zero' },
  { iso: 'JO', trunk: 'zero' },
  { iso: 'IN', trunk: 'zero-landline', timeIn: 'india' },
  { iso: 'JP', trunk: 'zero', timeIn: 'japan' },
  { iso: 'NL', trunk: 'zero' },
  { iso: 'BE', trunk: 'zero' },
  { iso: 'CH', trunk: 'zero' },
  { iso: 'PT', trunk: 'none' },
  { iso: 'HU', trunk: 'zero-six' },
  { iso: 'RO', trunk: 'zero' },
  { iso: 'CZ', trunk: 'none' },
  { iso: 'GE', trunk: 'zero' },
  { iso: 'BG', trunk: 'zero' },
  { iso: 'BR', trunk: 'zero', timeIn: 'brazil' },
  { iso: 'PH', trunk: 'zero' },
  { iso: 'VN', trunk: 'zero' },
  { iso: 'ZA', trunk: 'zero' },
  { iso: 'MD', trunk: 'zero' },
  { iso: 'MA', trunk: 'zero' },
  { iso: 'IE', trunk: 'zero' },
  { iso: 'SE', trunk: 'zero' },
  { iso: 'KR', trunk: 'zero' },
  { iso: 'HR', trunk: 'zero' },
  { iso: 'ME', trunk: 'zero' },
  { iso: 'RS', trunk: 'zero' },
  { iso: 'NZ', trunk: 'zero' },
  { iso: 'AZ', trunk: 'zero' },
  { iso: 'LT', trunk: 'zero' },
  { iso: 'FI', trunk: 'zero' },
  { iso: 'SK', trunk: 'zero' },
  { iso: 'SI', trunk: 'zero' },
  { iso: 'AL', trunk: 'zero' },
  { iso: 'DK', trunk: 'none' },
  { iso: 'NO', trunk: 'none' },
  { iso: 'LV', trunk: 'none' },
  { iso: 'EE', trunk: 'none' },
  { iso: 'MT', trunk: 'none' },
  { iso: 'SG', trunk: 'none' },
  { iso: 'BY', trunk: 'eight' },
  { iso: 'KZ', trunk: 'eight' },
]

const DEFINITE_ARTICLE_NAMES = new Set(['הפיליפינים'])

export type DialingCountryPage = {
  slug: string
  country: CountryCode
  trunk: TrunkRule
  timeIn?: TimeInPage
}

const slugOf = (english: string) =>
  english
    .toLowerCase()
    .replace(/[^a-z]+/g, '-')
    .replace(/^-|-$/g, '')

export const dialingCountryPages: DialingCountryPage[] = SEEDS.map((seed) => {
  const country = countryCodes.find((item) => item.iso === seed.iso)
  if (!country) throw new Error(`Missing dialing code for ${seed.iso}`)
  return {
    slug: slugOf(country.english),
    country,
    trunk: seed.trunk,
    timeIn: seed.timeIn ? timeInPage(seed.timeIn) : undefined,
  }
})

export const dialingCountryPath = (slug: string) => `${DIALING_HUB_PATH}/${slug}`

export const dialingCountryBySlug = (slug: string) => dialingCountryPages.find((page) => page.slug === slug)

export const dialingCountryByIso = (iso: string) => dialingCountryPages.find((page) => page.country.iso === iso)

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
