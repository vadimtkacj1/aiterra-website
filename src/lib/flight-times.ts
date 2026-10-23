import {
  SUMMER_REFERENCE,
  WINTER_REFERENCE,
  differenceFromIsrael,
  formatDifference,
} from '@/lib/time-difference'

export const FLIGHT_TIMES_PATH = '/tools/flight-time-from-israel'
export const FLIGHT_TIMES_CHECKED = '2026-10-23'

export const TLV = { name: 'נתב״ג', lat: 32.0114, lon: 34.8867 }

export const CRUISE_KMH = 760
export const FIXED_MINUTES = 35

export type Region =
  | 'greece-cyprus'
  | 'europe'
  | 'caucasus'
  | 'middle-east'
  | 'asia'
  | 'africa'
  | 'north-america'
  | 'south-america'
  | 'oceania'

export const regionLabels: Record<Region, string> = {
  'greece-cyprus': 'יוון וקפריסין',
  europe: 'אירופה',
  caucasus: 'קווקז',
  'middle-east': 'המפרץ',
  asia: 'אסיה',
  africa: 'אפריקה',
  'north-america': 'צפון אמריקה',
  'south-america': 'דרום אמריקה',
  oceania: 'אוקיאניה',
}

export const regionOrder = Object.keys(regionLabels) as Region[]

export type Destination = {
  id: string
  name: string
  country: string
  region: Region
  iata: string
  lat: number
  lon: number
  zone: string
  directMinutes: number | null
  viaMinutes: number | null
  winter: number
  summer: number
  distanceKm: number
}

type Row = [string, string, string, Region, string, number, number, string, number, number]

const rows: Row[] = [
  ['athens', 'אתונה', 'יוון', 'greece-cyprus', 'ATH', 37.94, 23.94, 'Europe/Athens', 135, 0],
  ['larnaca', 'לרנקה', 'קפריסין', 'greece-cyprus', 'LCA', 34.88, 33.63, 'Asia/Nicosia', 65, 0],
  ['paphos', 'פאפוס', 'קפריסין', 'greece-cyprus', 'PFO', 34.72, 32.49, 'Asia/Nicosia', 65, 0],
  ['rhodes', 'רודוס', 'יוון', 'greece-cyprus', 'RHO', 36.41, 28.09, 'Europe/Athens', 105, 0],
  ['heraklion', 'הרקליון (כרתים)', 'יוון', 'greece-cyprus', 'HER', 35.34, 25.18, 'Europe/Athens', 125, 0],
  ['thessaloniki', 'סלוניקי', 'יוון', 'greece-cyprus', 'SKG', 40.52, 22.97, 'Europe/Athens', 150, 0],
  ['corfu', 'קורפו', 'יוון', 'greece-cyprus', 'CFU', 39.6, 19.91, 'Europe/Athens', 175, 0],
  ['santorini', 'סנטוריני', 'יוון', 'greece-cyprus', 'JTR', 36.4, 25.48, 'Europe/Athens', 130, 0],
  ['mykonos', 'מיקונוס', 'יוון', 'greece-cyprus', 'JMK', 37.44, 25.35, 'Europe/Athens', 135, 0],
  ['rome', 'רומא', 'איטליה', 'europe', 'FCO', 41.8, 12.25, 'Europe/Rome', 230, 0],
  ['milan', 'מילאנו', 'איטליה', 'europe', 'MXP', 45.63, 8.72, 'Europe/Rome', 250, 0],
  ['venice', 'ונציה', 'איטליה', 'europe', 'VCE', 45.51, 12.35, 'Europe/Rome', 240, 0],
  ['naples', 'נאפולי', 'איטליה', 'europe', 'NAP', 40.88, 14.29, 'Europe/Rome', 215, 0],
  ['paris', 'פריז', 'צרפת', 'europe', 'CDG', 49.01, 2.55, 'Europe/Paris', 300, 0],
  ['london', 'לונדון', 'בריטניה', 'europe', 'LHR', 51.47, -0.45, 'Europe/London', 325, 0],
  ['dublin', 'דבלין', 'אירלנד', 'europe', 'DUB', 53.43, -6.27, 'Europe/Dublin', 0, 450],
  ['amsterdam', 'אמסטרדם', 'הולנד', 'europe', 'AMS', 52.31, 4.76, 'Europe/Amsterdam', 295, 0],
  ['brussels', 'בריסל', 'בלגיה', 'europe', 'BRU', 50.9, 4.48, 'Europe/Brussels', 290, 0],
  ['frankfurt', 'פרנקפורט', 'גרמניה', 'europe', 'FRA', 50.03, 8.57, 'Europe/Berlin', 280, 0],
  ['berlin', 'ברלין', 'גרמניה', 'europe', 'BER', 52.36, 13.5, 'Europe/Berlin', 270, 0],
  ['munich', 'מינכן', 'גרמניה', 'europe', 'MUC', 48.35, 11.79, 'Europe/Berlin', 250, 0],
  ['vienna', 'וינה', 'אוסטריה', 'europe', 'VIE', 48.11, 16.57, 'Europe/Vienna', 235, 0],
  ['zurich', 'ציריך', 'שווייץ', 'europe', 'ZRH', 47.46, 8.55, 'Europe/Zurich', 265, 0],
  ['geneva', 'ז׳נבה', 'שווייץ', 'europe', 'GVA', 46.24, 6.11, 'Europe/Zurich', 275, 0],
  ['madrid', 'מדריד', 'ספרד', 'europe', 'MAD', 40.47, -3.56, 'Europe/Madrid', 315, 0],
  ['barcelona', 'ברצלונה', 'ספרד', 'europe', 'BCN', 41.3, 2.08, 'Europe/Madrid', 285, 0],
  ['lisbon', 'ליסבון', 'פורטוגל', 'europe', 'LIS', 38.78, -9.14, 'Europe/Lisbon', 355, 0],
  ['prague', 'פראג', 'צ׳כיה', 'europe', 'PRG', 50.1, 14.26, 'Europe/Prague', 250, 0],
  ['budapest', 'בודפשט', 'הונגריה', 'europe', 'BUD', 47.44, 19.26, 'Europe/Budapest', 215, 0],
  ['warsaw', 'ורשה', 'פולין', 'europe', 'WAW', 52.17, 20.97, 'Europe/Warsaw', 240, 0],
  ['krakow', 'קרקוב', 'פולין', 'europe', 'KRK', 50.08, 19.78, 'Europe/Warsaw', 230, 0],
  ['bucharest', 'בוקרשט', 'רומניה', 'europe', 'OTP', 44.57, 26.08, 'Europe/Bucharest', 165, 0],
  ['sofia', 'סופיה', 'בולגריה', 'europe', 'SOF', 42.7, 23.41, 'Europe/Sofia', 160, 0],
  ['belgrade', 'בלגרד', 'סרביה', 'europe', 'BEG', 44.82, 20.31, 'Europe/Belgrade', 195, 0],
  ['zagreb', 'זאגרב', 'קרואטיה', 'europe', 'ZAG', 45.74, 16.07, 'Europe/Zagreb', 210, 0],
  ['podgorica', 'פודגוריצה (מונטנגרו)', 'מונטנגרו', 'europe', 'TGD', 42.36, 19.25, 'Europe/Podgorica', 200, 0],
  ['tirana', 'טירנה', 'אלבניה', 'europe', 'TIA', 41.41, 19.72, 'Europe/Tirane', 190, 0],
  ['malta', 'מלטה', 'מלטה', 'europe', 'MLA', 35.86, 14.48, 'Europe/Malta', 200, 0],
  ['copenhagen', 'קופנהגן', 'דנמרק', 'europe', 'CPH', 55.62, 12.65, 'Europe/Copenhagen', 290, 0],
  ['stockholm', 'שטוקהולם', 'שבדיה', 'europe', 'ARN', 59.65, 17.92, 'Europe/Stockholm', 310, 0],
  ['istanbul', 'איסטנבול', 'טורקיה', 'europe', 'IST', 41.26, 28.74, 'Europe/Istanbul', 0, 330],
  ['batumi', 'בטומי', 'גאורגיה', 'caucasus', 'BUS', 41.61, 41.6, 'Asia/Tbilisi', 140, 0],
  ['tbilisi', 'טביליסי', 'גאורגיה', 'caucasus', 'TBS', 41.67, 44.95, 'Asia/Tbilisi', 155, 0],
  ['dubai', 'דובאי', 'איחוד האמירויות', 'middle-east', 'DXB', 25.25, 55.36, 'Asia/Dubai', 190, 0],
  ['abu-dhabi', 'אבו דאבי', 'איחוד האמירויות', 'middle-east', 'AUH', 24.43, 54.65, 'Asia/Dubai', 190, 0],
  ['doha', 'דוחה', 'קטאר', 'middle-east', 'DOH', 25.27, 51.61, 'Asia/Qatar', 0, 360],
  ['mumbai', 'מומבאי', 'הודו', 'asia', 'BOM', 19.09, 72.87, 'Asia/Kolkata', 0, 540],
  ['delhi', 'דלהי', 'הודו', 'asia', 'DEL', 28.56, 77.1, 'Asia/Kolkata', 0, 600],
  ['bangkok', 'בנגקוק', 'תאילנד', 'asia', 'BKK', 13.69, 100.75, 'Asia/Bangkok', 700, 0],
  ['phuket', 'פוקט', 'תאילנד', 'asia', 'HKT', 8.11, 98.32, 'Asia/Bangkok', 710, 0],
  ['bali', 'באלי', 'אינדונזיה', 'asia', 'DPS', -8.75, 115.17, 'Asia/Makassar', 0, 1020],
  ['ho-chi-minh', 'הו צ׳י מין', 'וייטנאם', 'asia', 'SGN', 10.82, 106.65, 'Asia/Ho_Chi_Minh', 0, 840],
  ['singapore', 'סינגפור', 'סינגפור', 'asia', 'SIN', 1.36, 103.99, 'Asia/Singapore', 0, 840],
  ['hong-kong', 'הונג קונג', 'הונג קונג', 'asia', 'HKG', 22.31, 113.91, 'Asia/Hong_Kong', 0, 900],
  ['beijing', 'בייג׳ינג', 'סין', 'asia', 'PEK', 40.08, 116.58, 'Asia/Shanghai', 0, 840],
  ['seoul', 'סיאול', 'דרום קוריאה', 'asia', 'ICN', 37.46, 126.44, 'Asia/Seoul', 0, 960],
  ['tokyo', 'טוקיו', 'יפן', 'asia', 'NRT', 35.77, 140.39, 'Asia/Tokyo', 690, 0],
  ['addis-ababa', 'אדיס אבבה', 'אתיופיה', 'africa', 'ADD', 8.98, 38.8, 'Africa/Addis_Ababa', 255, 0],
  ['nairobi', 'נאירובי', 'קניה', 'africa', 'NBO', -1.32, 36.93, 'Africa/Nairobi', 0, 480],
  ['johannesburg', 'יוהנסבורג', 'דרום אפריקה', 'africa', 'JNB', -26.14, 28.25, 'Africa/Johannesburg', 0, 840],
  ['casablanca', 'קזבלנקה', 'מרוקו', 'africa', 'CMN', 33.37, -7.59, 'Africa/Casablanca', 330, 0],
  ['new-york', 'ניו יורק', 'ארצות הברית', 'north-america', 'JFK', 40.64, -73.78, 'America/New_York', 725, 0],
  ['boston', 'בוסטון', 'ארצות הברית', 'north-america', 'BOS', 42.36, -71.01, 'America/New_York', 690, 0],
  ['miami', 'מיאמי', 'ארצות הברית', 'north-america', 'MIA', 25.79, -80.29, 'America/New_York', 810, 0],
  ['chicago', 'שיקגו', 'ארצות הברית', 'north-america', 'ORD', 41.98, -87.91, 'America/Chicago', 760, 0],
  ['los-angeles', 'לוס אנג׳לס', 'ארצות הברית', 'north-america', 'LAX', 33.94, -118.41, 'America/Los_Angeles', 895, 0],
  ['san-francisco', 'סן פרנסיסקו', 'ארצות הברית', 'north-america', 'SFO', 37.62, -122.38, 'America/Los_Angeles', 900, 0],
  ['toronto', 'טורונטו', 'קנדה', 'north-america', 'YYZ', 43.68, -79.63, 'America/Toronto', 715, 0],
  ['mexico-city', 'מקסיקו סיטי', 'מקסיקו', 'north-america', 'MEX', 19.44, -99.07, 'America/Mexico_City', 0, 1200],
  ['sao-paulo', 'סאו פאולו', 'ברזיל', 'south-america', 'GRU', -23.43, -46.47, 'America/Sao_Paulo', 0, 1140],
  ['buenos-aires', 'בואנוס איירס', 'ארגנטינה', 'south-america', 'EZE', -34.82, -58.54, 'America/Argentina/Buenos_Aires', 0, 1260],
  ['sydney', 'סידני', 'אוסטרליה', 'oceania', 'SYD', -33.95, 151.18, 'Australia/Sydney', 0, 1560],
]

export function greatCircleKm(aLat: number, aLon: number, bLat: number, bLon: number) {
  const rad = Math.PI / 180
  const dLat = (bLat - aLat) * rad
  const dLon = (bLon - aLon) * rad
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(aLat * rad) * Math.cos(bLat * rad) * Math.sin(dLon / 2) ** 2
  return Math.round(2 * 6371 * Math.asin(Math.sqrt(h)))
}

export const estimateMinutes = (distanceKm: number, routeFactor = 1) =>
  Math.round(FIXED_MINUTES + (distanceKm * routeFactor) / CRUISE_KMH * 60)

export const destinations: Destination[] = rows.map(
  ([id, name, country, region, iata, lat, lon, zone, direct, via]) => ({
    id,
    name,
    country,
    region,
    iata,
    lat,
    lon,
    zone,
    directMinutes: direct || null,
    viaMinutes: via || null,
    winter: differenceFromIsrael(zone, WINTER_REFERENCE),
    summer: differenceFromIsrael(zone, SUMMER_REFERENCE),
    distanceKm: greatCircleKm(TLV.lat, TLV.lon, lat, lon),
  }),
)

export const destinationById = (id: string) => destinations.find((item) => item.id === id)

export function durationText(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest} דקות`
  const hourPart = hours === 1 ? 'שעה' : `${hours} שעות`
  if (rest === 0) return hourPart
  return `${hourPart} ו-${rest} דקות`
}

export const clockDuration = (minutes: number) =>
  `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`

export function offsetText(item: Pick<Destination, 'winter' | 'summer'>) {
  if (item.winter === item.summer) return formatDifference(item.winter)
  return `${formatDifference(item.winter)} / ${formatDifference(item.summer)}`
}

export const flightSources = {
  elal: { label: 'אל על: לוח טיסות ויעדים', href: 'https://www.elal.com/' },
  israir: { label: 'ישראייר: יעדי טיסה', href: 'https://www.israir.co.il/' },
  arkia: { label: 'ארקיע: יעדי טיסה', href: 'https://www.arkia.co.il/' },
  wizz: { label: 'Wizz Air: מפת יעדים מתל אביב', href: 'https://wizzair.com/' },
  iaa: { label: 'רשות שדות התעופה: לוח טיסות נתב״ג', href: 'https://www.iaa.gov.il/' },
  haversine: {
    label: 'ויקיפדיה: נוסחת הברסין (מרחק על כדור)',
    href: 'https://en.wikipedia.org/wiki/Haversine_formula',
  },
}
