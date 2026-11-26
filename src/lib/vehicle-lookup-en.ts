import {
  checkPlate,
  formatPlate,
  testStateOf,
  type SourceKind,
  type TestState,
  type Vehicle,
  type VehicleFailure,
} from '@/lib/vehicle-lookup'
import {
  LICENCE_FEE_DATE,
  OWNERSHIP_FROM_YEAR,
  licenceFeeOf,
  type OwnershipRecord,
  type VehicleExtras,
  type VehicleHistory,
} from '@/lib/vehicle-extras'

export type Localised = { text: string; hebrew: boolean }

type Dictionary = Record<string, string>

const HEBREW_LETTER = /[א-ת]/
const PLATE_SEPARATORS = /[\s\-‐-―־./‎‏‪-‮]/g
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const tidy = (value: string) => value.replace(/["״]/g, '').replace(/\s+/g, ' ').trim()

const asIs = (value: string): Localised => ({ text: value, hebrew: HEBREW_LETTER.test(value) })

export function localise(value: string, dictionary: Dictionary): Localised {
  if (!value) return { text: '', hebrew: false }
  const english = dictionary[tidy(value)]
  return english ? { text: english, hebrew: false } : asIs(value)
}

export const numberEn = (value: number) => value.toLocaleString('en-IL')

export const formatDateEn = (value: string) => {
  const match = /^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?/.exec(value)
  if (!match) return value
  const month = MONTHS[Number(match[2]) - 1]
  if (!month) return value
  return match[3] ? `${Number(match[3])} ${month} ${match[1]}` : `${month} ${match[1]}`
}

export const dottedDateEn = (value: string) => {
  const match = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(value)
  const month = match ? MONTHS_LONG[Number(match[2]) - 1] : undefined
  return match && month ? `${Number(match[1])} ${month} ${match[3]}` : value
}

export const LICENCE_FEE_DATE_EN = dottedDateEn(LICENCE_FEE_DATE)

const BRANDS: Dictionary = {
  'אאודי': 'Audi',
  'אודי': 'Audi',
  'אומודה': 'Omoda',
  'אופל': 'Opel',
  'אורה': 'Ora',
  'איווייס': 'Aiways',
  'איווקו': 'Iveco',
  'איון': 'Aion',
  'איסוזו': 'Isuzu',
  'אינדיאן': 'Indian',
  'אלפא רומיאו': 'Alfa Romeo',
  "אנרג'יקה": 'Energica',
  'אס ווי אמ': 'SYM',
  'אס ווי אם': 'SYM',
  'אף איי דבליו': 'FAW',
  'אפריליה': 'Aprilia',
  'אקספנג': 'Xpeng',
  'ארקטיק קאט': 'Arctic Cat',
  'ב מ וו': 'BMW',
  'בומברדיה': 'Bombardier',
  'בטה': 'Beta',
  'בי ווי די': 'BYD',
  'בי.אר.פי': 'BRP',
  'ביואיק': 'Buick',
  'ביואל': 'Buell',
  'בנלי': 'Benelli',
  "ג'אק": 'JAC',
  "ג'אקו": 'Jaecoo',
  "ג'י.אמ.סי": 'GMC',
  "ג'ילי": 'Geely',
  "ג'יפ": 'Jeep',
  'גאס גאס': 'GasGas',
  'גאסגאס': 'GasGas',
  'גולדן דרגון': 'Golden Dragon',
  'דאף': 'DAF',
  "דאצ'יה": 'Dacia',
  'דאציה': 'Dacia',
  'דוקאטי': 'Ducati',
  'דונגפנג': 'Dongfeng',
  'דייהו': 'Daewoo',
  'דייהטסו': 'Daihatsu',
  'דיילים': 'Daelim',
  'דיימלר קרייזלר': 'DaimlerChrysler',
  'דימלרקריזלר': 'DaimlerChrysler',
  'דיפאל': 'Deepal',
  'האמר': 'Hummer',
  'הארלי דיוידסון': 'Harley-Davidson',
  'הונדה': 'Honda',
  'הינו': 'Hino',
  'הסקוורנה': 'Husqvarna',
  'וואי': 'Wey',
  'ווג': 'Voge',
  'וויה': 'Voyah',
  'וולבו': 'Volvo',
  'וי די אל': 'VDL',
  'זונטס': 'Zontes',
  'זיקר': 'Zeekr',
  'טויוטה': 'Toyota',
  'טסלה': 'Tesla',
  'טריאומף': 'Triumph',
  'טריומף': 'Triumph',
  'יגואר': 'Jaguar',
  'יוטונג': 'Yutong',
  'יונדאי': 'Hyundai',
  'יוסנג': 'Hyosung',
  'ימאהה': 'Yamaha',
  'לינק אנד קו': 'Lynk & Co',
  'ליפמוטור': 'Leapmotor',
  'למברטה': 'Lambretta',
  "לנצ'יה": 'Lancia',
  'לקסוס': 'Lexus',
  "מ.ג'י": 'MG',
  'מ.ג.': 'MG',
  'מאן': 'MAN',
  'מוטו מוריני': 'Moto Morini',
  'מוטוגוצי': 'Moto Guzzi',
  'מונדיאל': 'Mondial',
  'מורבידלי': 'Morbidelli',
  'מזארטי': 'Maserati',
  'מזדה': 'Mazda',
  'מיצובישי': 'Mitsubishi',
  'מקסוס': 'Maxus',
  'מרוטי סוזוקי': 'Maruti Suzuki',
  'מרצדס בנץ': 'Mercedes-Benz',
  'ניסאן': 'Nissan',
  'סאן יאנג': 'Sanyang (SYM)',
  'סאנגיונג': 'SsangYong',
  'סובארו': 'Subaru',
  'סוזוקי': 'Suzuki',
  'סורון': 'Sur-Ron',
  'סטארק': 'Stark',
  'סי.אף.מוטו': 'CFMoto',
  'סיאט': 'SEAT',
  'סיטרואן': 'Citroen',
  'סמארט': 'Smart',
  'סקודה': 'Skoda',
  'סקיוול': 'Skywell',
  'סקניה': 'Scania',
  'סרס': 'Seres',
  'פולאריס': 'Polaris',
  'פולקסווגן': 'Volkswagen',
  'פולריס': 'Polaris',
  'פורד': 'Ford',
  'פורשה': 'Porsche',
  "פיאג'ו": 'Piaggio',
  'פיאט': 'Fiat',
  "פיג'ו": 'Peugeot',
  'פנטיק': 'Fantic',
  "צ'רי": 'Chery',
  'קאדילאק': 'Cadillac',
  'קואנג יאנג': 'Kwang Yang (Kymco)',
  'קוואסאקי': 'Kawasaki',
  'קופרה': 'Cupra',
  'קי.טי.אם': 'KTM',
  'קי.טי.אמ': 'KTM',
  'קיה': 'Kia',
  'קיוואי': 'Keeway',
  "קיי ג'י מובילי": 'KG Mobility',
  'קיי טי אם': 'KTM',
  'קימקו': 'Kymco',
  'קרייזלר': 'Chrysler',
  'רובר': 'Rover',
  'רויאל אנפילד': 'Royal Enfield',
  'רנו': 'Renault',
  'שברולט': 'Chevrolet',
  'שירקו': 'Sherco',
  'תאלאריה': 'Talaria',
}

const COUNTRIES: Dictionary = {
  'אוסטריה': 'Austria',
  'אוסטרליה': 'Australia',
  'איטליה': 'Italy',
  'אינדונזיה': 'Indonesia',
  'אנגליה': 'UK',
  'ארגנטינה': 'Argentina',
  'ארהב': 'USA',
  'בלגיה': 'Belgium',
  'ברזיל': 'Brazil',
  'בריטניה': 'UK',
  'גרמניה': 'Germany',
  'ד. אפריקה': 'South Africa',
  'ד. קוריאה': 'South Korea',
  'דרום אפריקה': 'South Africa',
  'הודו': 'India',
  'הולנד': 'Netherlands',
  'הונג קונג': 'Hong Kong',
  'הונגריה': 'Hungary',
  'ויאטנם': 'Vietnam',
  'ויטנאם': 'Vietnam',
  'טאיוואן': 'Taiwan',
  'טורקיה': 'Turkey',
  'יפן': 'Japan',
  'ישראל': 'Israel',
  'מקסיקו': 'Mexico',
  'מרוקו': 'Morocco',
  'סין': 'China',
  'סלובניה': 'Slovenia',
  'סלובקיה': 'Slovakia',
  'ספרד': 'Spain',
  'סרביה': 'Serbia',
  'פולין': 'Poland',
  'פורטוגל': 'Portugal',
  "צ'כיה": 'Czechia',
  'צרפת': 'France',
  'קנדה': 'Canada',
  'רומניה': 'Romania',
  'שבדיה': 'Sweden',
  'תאילנד': 'Thailand',
}

const COLOURS: Dictionary = {
  'אדום': 'Red',
  'אדום בהיר': 'Light red',
  'אדום זוהר': 'Bright red',
  'אדום כהה (יין)': 'Dark red (wine)',
  'אדום מטל': 'Metallic red',
  'אדום קלאסי': 'Classic red',
  'אדום שחור': 'Red and black',
  'אפור': 'Grey',
  'אפור בהיר': 'Light grey',
  'אפור בהיר מטלי': 'Metallic light grey',
  'אפור ברונזה': 'Bronze grey',
  'אפור כהה': 'Dark grey',
  'אפור כהה מטלי': 'Metallic dark grey',
  'אפור כחול מטלי': 'Metallic blue-grey',
  'אפור מטל': 'Metallic grey',
  'אפור פלדה': 'Steel grey',
  'בורדו': 'Burgundy',
  'בורדו מטל': 'Metallic burgundy',
  'בז': 'Beige',
  'בז כהה': 'Dark beige',
  'בז מטאלי': 'Metallic beige',
  'ברונזה': 'Bronze',
  'ורוד': 'Pink',
  'זהב': 'Gold',
  'זהב מטאלי': 'Metallic gold',
  'זהוב': 'Golden',
  'זית מטאלי': 'Metallic olive',
  'חום': 'Brown',
  'חום בהיר': 'Light brown',
  'חום כהה': 'Dark brown',
  'חציל': 'Aubergine',
  'טורקיז': 'Turquoise',
  'טורקיז כהה': 'Dark turquoise',
  'טורקיז מטאלי': 'Metallic turquoise',
  'ירוק': 'Green',
  'ירוק אקווה': 'Aqua green',
  'ירוק בהיר': 'Light green',
  'ירוק זהב מטלי': 'Metallic gold-green',
  'ירוק זית': 'Olive green',
  'ירוק זית מטלי': 'Metallic olive green',
  'ירוק כהה': 'Dark green',
  'ירוק כסוף': 'Silver green',
  'ירוק מטל': 'Metallic green',
  'ירקרק': 'Greenish',
  'ירקרק בהיר': 'Light greenish',
  'ירקרק מטלי': 'Metallic greenish',
  'כחול': 'Blue',
  'כחול בהיר': 'Light blue',
  'כחול כהה': 'Dark blue',
  'כחול מטל': 'Metallic blue',
  'כחול פחם מטלי': 'Metallic charcoal blue',
  'כחול פנינה': 'Pearl blue',
  'כסוף בהיר': 'Light silver',
  'כסוף כהה': 'Dark silver',
  'כסוף כהה מטלי': 'Metallic dark silver',
  'כסוף מילניום': 'Millennium silver',
  'כסף': 'Silver',
  'כסף ים': 'Sea silver',
  'כסף ירקרק': 'Greenish silver',
  'כסף כחלחל מטלי': 'Metallic bluish silver',
  'כסף מטלי': 'Metallic silver',
  'כסף תכלת מטלי': 'Metallic sky-blue silver',
  'כתום': 'Orange',
  'נחושת': 'Copper',
  'נחושת מטאלי': 'Metallic copper',
  'סגול': 'Purple',
  'סגול בהיר': 'Light purple',
  'סגול כהה': 'Dark purple',
  'סהרה': 'Sahara',
  'פלטינה': 'Platinum',
  'צהוב': 'Yellow',
  'צהוב לימון': 'Lemon yellow',
  'צהוב מטאלי': 'Metallic yellow',
  'קפה מטאלי': 'Metallic coffee',
  'קרם': 'Cream',
  'רב גווני': 'Multicolour',
  'רוז מתכתי': 'Metallic rose',
  'שחור': 'Black',
  'שחור חציל': 'Aubergine black',
  'שחור מטלי': 'Metallic black',
  'שחור פנינה': 'Pearl black',
  'שן פיל': 'Ivory',
  'שנהב לבן': 'Ivory white',
  'לבן': 'White',
  'תכלת': 'Sky blue',
  'תכלת מטאלי': 'Metallic sky blue',
}

const FUELS: Dictionary = {
  'בנזין': 'Petrol',
  'דיזל': 'Diesel',
  'חשמל': 'Electric',
  'חשמל/בנזין': 'Hybrid (electric and petrol)',
  'חשמל/דיזל': 'Hybrid (electric and diesel)',
  'גפמ': 'LPG',
  'גז טבעי דחוס': 'Compressed natural gas (CNG)',
}

const OWNERSHIP: Dictionary = {
  'פרטי': 'Private',
  'חברה': 'Company',
  'ליסינג': 'Leasing',
  'החכר': 'Leasing',
  'השכרה': 'Rental',
  'סוחר': 'Car dealer',
}

const ORIGINS: Dictionary = {
  'החכר': 'Leasing',
  'השכרה': 'Rental',
  'יבוא אישי': 'Personal import',
  'יבוא אישי-משומש': 'Personal import of a used vehicle',
  'ביס לנהיגה': 'Driving school',
  'מדינת ישראל': 'State of Israel',
}

const VEHICLE_TYPES: Dictionary = {
  'אופנוע': 'Motorcycle',
  'קטנוע': 'Scooter',
  'תלת אופנוע': 'Three-wheeled motorcycle',
  'טרקטורון': 'ATV',
  'מונית': 'Taxi',
  'פרטי נוסעים': 'Private passenger car',
  'פרטי נוסעים 3 דלתות': 'Private passenger car, 3 doors',
  'פרטי נוסעים 5 דלתות': 'Private passenger car, 5 doors',
  'פרטי רגיל': 'Private car',
}

const RECALL_TYPES: Dictionary = {
  'קמפיין שרות טכני': 'Technical service campaign',
  'תקלה סידרתית בטיחותית': 'Serial safety defect',
}

const RECALL_AREAS: Dictionary = {
  'אביזרים': 'Accessories',
  'אחר': 'Other',
  'בלמים': 'Brakes',
  'היגוי ומתלים': 'Steering and suspension',
  'חגורות בטיחות': 'Seat belts',
  'חשמל אליקטרוניקה ומיזוג': 'Electrics, electronics and air conditioning',
  'כריות אוויר': 'Airbags',
  'מנוע ומערכותיו': 'Engine and its systems',
  'מערכת הבטיחות': 'Safety system',
  'מערכת הדלק': 'Fuel system',
  'מערכת העברת כוח': 'Drivetrain',
  'מערכת הפליטה': 'Exhaust system',
  'מרכב ושילדה': 'Body and chassis',
}

const BODIES: Dictionary = {
  'MPV': 'MPV',
  "הצ'בק": 'Hatchback',
  'ואן/נוסעים': 'Passenger van',
  'סגור/משלוח': 'Closed delivery van',
  'פנאי-שטח': 'SUV',
  'קומבי': 'Estate',
  'תא בודד': 'Single cab',
  'תא כפול': 'Double cab',
}

const GEARBOXES: Dictionary = {
  'אוטומטית': 'Automatic',
  'ידנית': 'Manual',
}

const BRAND_KEYS = Object.keys(BRANDS).sort((a, b) => b.length - a.length)
const BRAND_BOUNDARY = /^[\s_\-.]/
const COUNTRY_NOISE = /[\s_\-.']/g
const MIN_COUNTRY_PREFIX = 3

const countryKeys = Object.keys(COUNTRIES).map((name) => ({ compact: name.replace(COUNTRY_NOISE, ''), english: COUNTRIES[name] }))

function countryOf(rest: string) {
  const wanted = rest.replace(COUNTRY_NOISE, '')
  if (!wanted) return ''
  const exact = countryKeys.find((key) => key.compact === wanted)
  if (exact) return exact.english
  if (wanted.length < MIN_COUNTRY_PREFIX) return ''
  const candidates = new Set(countryKeys.filter((key) => key.compact.startsWith(wanted)).map((key) => key.english))
  return candidates.size === 1 ? [...candidates][0] : ''
}

export type Maker = { brand: string; country: string }

export function makerOf(manufacturer: string): Maker | null {
  const value = tidy(manufacturer)
  const key = BRAND_KEYS.find((brand) => value === brand || (value.startsWith(brand) && BRAND_BOUNDARY.test(value.slice(brand.length))))
  if (!key) return null
  return { brand: BRANDS[key], country: countryOf(value.slice(key.length)) }
}

export function manufacturerEn(manufacturer: string): Localised {
  const maker = makerOf(manufacturer)
  if (!maker) return asIs(manufacturer)
  return { text: maker.country ? `${maker.brand}, made in ${maker.country}` : maker.brand, hebrew: false }
}

export function vehicleTitleEn(vehicle: Vehicle): Localised {
  const model = vehicle.commercialName || vehicle.modelCode
  const maker = makerOf(vehicle.manufacturer)
  if (maker) return { text: [maker.brand, model].filter(Boolean).join(' '), hebrew: false }
  const title = [vehicle.manufacturer, model].filter(Boolean).join(' ')
  return title ? asIs(title) : { text: 'Vehicle', hebrew: false }
}

export const colourEn = (value: string) => localise(value, COLOURS)
export const fuelEn = (value: string) => (tidy(value).startsWith('לא ידוע') ? { text: '', hebrew: false } : localise(value, FUELS))
export const ownershipEn = (value: string) => localise(value, OWNERSHIP)
export const vehicleTypeEn = (value: string) => localise(value, VEHICLE_TYPES)
export const recallTypeEn = (value: string) => localise(value, RECALL_TYPES)
export const recallAreaEn = (value: string) => localise(value, RECALL_AREAS)
export const bodyEn = (value: string) => localise(value, BODIES)
export const gearboxEn = (value: string) => localise(value, GEARBOXES)
export const countryEn = (value: string) => localise(value, COUNTRIES)

export const originEn = (origin: string): Localised =>
  origin ? localise(origin, ORIGINS) : { text: 'Private, not leasing or rental', hebrew: false }

export const kindLabelsEn: Record<SourceKind, string> = {
  car: 'Private or light commercial vehicle',
  motorcycle: 'Motorcycle or two-wheeler',
  inactive: 'Inactive vehicle',
  removed: 'Vehicle taken off the road',
}

export const sourceLabelsEn: Record<SourceKind, string> = {
  car: 'private and commercial vehicles file',
  motorcycle: 'two-wheeled vehicles file',
  inactive: 'inactive vehicles file',
  removed: 'file of vehicles taken off the road',
}

export const failureTextEn: Record<VehicleFailure, string> = {
  network: 'We could not connect to the data.gov.il database. Check your internet connection and try again.',
  timeout: 'The government database did not respond within 15 seconds. This happens when it is busy. Try again in a moment.',
  blocked: 'The data.gov.il database temporarily blocked the search, probably because of many searches in a row. Wait a minute and try again.',
  server: 'The data.gov.il database is not available right now. Try again in a few minutes.',
  format: 'The database returned a response we could not read. Try again in a few minutes.',
}

export function plateErrorEn(raw: string) {
  const check = checkPlate(raw)
  if (check.kind === 'valid') return ''
  if (check.kind === 'empty') return 'Enter the licence plate number, 7 or 8 digits.'
  const typed = raw.replace(PLATE_SEPARATORS, '')
  if (/\D/.test(typed)) {
    return 'An Israeli licence plate number has digits only. Dashes and spaces do not matter, but letters are not part of the number.'
  }
  const digits = typed.length
  if (digits > 8) return `A licence plate number has up to 8 digits. You entered ${digits}.`
  return `A licence plate number has 7 or 8 digits. You entered ${digits}. Very old vehicles can have 5 or 6.`
}

const daysEn = (days: number) => {
  const count = Math.abs(days)
  return count === 1 ? '1 day' : `${numberEn(count)} days`
}

export function testStateEn(vehicle: Vehicle, now: Date): TestState {
  const state = testStateOf(vehicle, now)
  const until = formatDateEn(vehicle.testUntil)
  if (state.status === 'removed') {
    return {
      ...state,
      label: 'Taken off the road',
      detail: vehicle.removedOn
        ? `The vehicle has been registered as permanently cancelled since ${formatDateEn(vehicle.removedOn)}. Its licence cannot be renewed and it cannot return to the road.`
        : 'The vehicle is registered as permanently cancelled. Its licence cannot be renewed and it cannot return to the road.',
    }
  }
  if (state.status === 'inactive') {
    return {
      ...state,
      label: 'Inactive',
      detail: vehicle.testUntil
        ? `The vehicle licence expired on ${until} and the vehicle appears in the inactive vehicles file. To return it to the road it has to pass the annual test and renew the licence.`
        : 'The vehicle appears in the inactive vehicles file, which means it has no valid licence.',
    }
  }
  if (state.status === 'unknown') {
    return {
      ...state,
      label: 'No test date in the file',
      detail:
        vehicle.kind === 'motorcycle'
          ? 'The Ministry of Transport motorcycle file has no licence expiry date, so the tool cannot show the annual test for a motorcycle. The expiry date is printed on the vehicle licence.'
          : 'This vehicle has no expiry date in the file. The expiry date is printed on the vehicle licence.',
    }
  }
  const days = state.days ?? 0
  if (state.status === 'expired') {
    return {
      ...state,
      label: 'Annual test expired',
      detail: `The vehicle licence expired on ${until}, ${daysEn(days)} ago. Driving a vehicle without a valid licence is an offence, so it has to pass the annual test and renew.`,
    }
  }
  if (state.status === 'expiring') {
    return {
      ...state,
      label: days === 0 ? 'Annual test expires today' : 'Annual test about to expire',
      detail:
        days === 0
          ? `The vehicle licence expires today, ${until}.`
          : `The vehicle licence expires on ${until}, in ${daysEn(days)}. It is worth booking the annual test now.`,
    }
  }
  return {
    ...state,
    label: 'Annual test valid',
    detail: `The vehicle licence is valid until ${until}, ${daysEn(days)} from now.`,
  }
}

export const changesEn = (history: VehicleHistory) =>
  [
    history.structureChanged ? 'Structural change' : '',
    history.gasConversion ? 'LPG conversion' : '',
    history.colorChanged ? 'Colour change' : '',
    history.tiresChanged ? 'Tyre size change' : '',
  ].filter(Boolean)

export function ownershipSummaryEn(records: OwnershipRecord[]) {
  const counts = new Map<string, number>()
  for (const record of records) counts.set(record.type, (counts.get(record.type) ?? 0) + 1)
  return [...counts]
    .map(([type, count]) => ({ type, label: ownershipEn(type), count }))
    .sort((a, b) => b.count - a.count)
}

const sourceLineEn = (kind: SourceKind, dataDate: string) =>
  `Source: Ministry of Transport ${sourceLabelsEn[kind]} on data.gov.il${dataDate ? `, data updated ${dataDate}` : ''}`

export const vehicleSourceEn = (vehicle: Vehicle, dataDate: string) => `${sourceLineEn(vehicle.kind, dataDate)}.`

export function vehicleToTextEn(vehicle: Vehicle, state: TestState, dataDate: string) {
  const lines = [
    `Licence plate: ${formatPlate(vehicle.plate)}`,
    vehicleTitleEn(vehicle).text,
    `Status: ${state.label}`,
    vehicle.testUntil && vehicle.kind !== 'removed' ? `Licence valid until: ${formatDateEn(vehicle.testUntil)}` : '',
    vehicle.lastTest ? `Last annual test: ${formatDateEn(vehicle.lastTest)}` : '',
    vehicle.removedOn ? `Taken off the road: ${formatDateEn(vehicle.removedOn)}` : '',
    vehicle.year ? `Year of manufacture: ${vehicle.year}` : '',
    vehicle.color ? `Colour: ${colourEn(vehicle.color).text}` : '',
    fuelEn(vehicle.fuel).text ? `Fuel: ${fuelEn(vehicle.fuel).text}` : '',
    vehicle.ownership ? `Ownership: ${ownershipEn(vehicle.ownership).text}` : '',
    sourceLineEn(vehicle.kind, dataDate),
  ]
  return lines.filter(Boolean).join('\n')
}

export function extrasToTextEn(extras: VehicleExtras, year: number | null) {
  const { history, ownership, recalls, model } = extras
  const fee = licenceFeeOf(model, year)
  const ownershipLine = ownership
    ? `Ownership records since ${OWNERSHIP_FROM_YEAR}: ${ownership.length} (${ownershipSummaryEn(ownership)
        .map((item) => `${item.label.text} ${item.count}`)
        .join(', ')})`
    : ''
  return [
    history?.mileage ? `Mileage at the last annual test: ${numberEn(history.mileage)} km` : '',
    history ? `Origin: ${originEn(history.origin).text}` : '',
    ownershipLine,
    recalls ? `Open recalls: ${recalls.length || 'none'}` : '',
    model?.horsepower ? `Horsepower: ${model.horsepower}` : '',
    model?.feeGroup ? `Licence fee group: ${model.feeGroup}` : '',
    fee ? `Annual licence fee: ₪${numberEn(fee)} (tariff from ${LICENCE_FEE_DATE_EN})` : '',
  ].filter(Boolean)
}

export const announcementEn = (vehicle: Vehicle | null, state: TestState | null) => {
  if (!vehicle || !state) return 'No vehicle found with this number'
  return `Vehicle found: ${vehicleTitleEn(vehicle).text}, ${state.label}`
}
