export const TIME_DIFFERENCE_PATH = '/tools/time-difference-israel'
export const TIME_DIFFERENCE_CHECKED = '2026-10-23'
export const ISRAEL_TIME_ZONE = 'Asia/Jerusalem'

export type City = { id: string; name: string; country: string; zone: string }

export const cities: City[] = [
  { id: 'new-york', name: 'ניו יורק', country: 'ארצות הברית', zone: 'America/New_York' },
  { id: 'los-angeles', name: 'לוס אנג׳לס', country: 'ארצות הברית', zone: 'America/Los_Angeles' },
  { id: 'chicago', name: 'שיקגו', country: 'ארצות הברית', zone: 'America/Chicago' },
  { id: 'miami', name: 'מיאמי', country: 'ארצות הברית', zone: 'America/New_York' },
  { id: 'denver', name: 'דנוור', country: 'ארצות הברית', zone: 'America/Denver' },
  { id: 'phoenix', name: 'פניקס', country: 'ארצות הברית', zone: 'America/Phoenix' },
  { id: 'honolulu', name: 'הונולולו', country: 'ארצות הברית', zone: 'Pacific/Honolulu' },
  { id: 'anchorage', name: 'אנקורג׳', country: 'ארצות הברית', zone: 'America/Anchorage' },
  { id: 'toronto', name: 'טורונטו', country: 'קנדה', zone: 'America/Toronto' },
  { id: 'vancouver', name: 'ונקובר', country: 'קנדה', zone: 'America/Vancouver' },
  { id: 'mexico-city', name: 'מקסיקו סיטי', country: 'מקסיקו', zone: 'America/Mexico_City' },
  { id: 'panama', name: 'פנמה', country: 'פנמה', zone: 'America/Panama' },
  { id: 'bogota', name: 'בוגוטה', country: 'קולומביה', zone: 'America/Bogota' },
  { id: 'lima', name: 'לימה', country: 'פרו', zone: 'America/Lima' },
  { id: 'sao-paulo', name: 'סאו פאולו', country: 'ברזיל', zone: 'America/Sao_Paulo' },
  { id: 'buenos-aires', name: 'בואנוס איירס', country: 'ארגנטינה', zone: 'America/Argentina/Buenos_Aires' },
  { id: 'santiago', name: 'סנטיאגו', country: 'צ׳ילה', zone: 'America/Santiago' },
  { id: 'london', name: 'לונדון', country: 'בריטניה', zone: 'Europe/London' },
  { id: 'dublin', name: 'דבלין', country: 'אירלנד', zone: 'Europe/Dublin' },
  { id: 'lisbon', name: 'ליסבון', country: 'פורטוגל', zone: 'Europe/Lisbon' },
  { id: 'madrid', name: 'מדריד', country: 'ספרד', zone: 'Europe/Madrid' },
  { id: 'paris', name: 'פריז', country: 'צרפת', zone: 'Europe/Paris' },
  { id: 'amsterdam', name: 'אמסטרדם', country: 'הולנד', zone: 'Europe/Amsterdam' },
  { id: 'brussels', name: 'בריסל', country: 'בלגיה', zone: 'Europe/Brussels' },
  { id: 'berlin', name: 'ברלין', country: 'גרמניה', zone: 'Europe/Berlin' },
  { id: 'zurich', name: 'ציריך', country: 'שווייץ', zone: 'Europe/Zurich' },
  { id: 'vienna', name: 'וינה', country: 'אוסטריה', zone: 'Europe/Vienna' },
  { id: 'rome', name: 'רומא', country: 'איטליה', zone: 'Europe/Rome' },
  { id: 'prague', name: 'פראג', country: 'צ׳כיה', zone: 'Europe/Prague' },
  { id: 'budapest', name: 'בודפשט', country: 'הונגריה', zone: 'Europe/Budapest' },
  { id: 'warsaw', name: 'ורשה', country: 'פולין', zone: 'Europe/Warsaw' },
  { id: 'stockholm', name: 'שטוקהולם', country: 'שבדיה', zone: 'Europe/Stockholm' },
  { id: 'copenhagen', name: 'קופנהגן', country: 'דנמרק', zone: 'Europe/Copenhagen' },
  { id: 'athens', name: 'אתונה', country: 'יוון', zone: 'Europe/Athens' },
  { id: 'bucharest', name: 'בוקרשט', country: 'רומניה', zone: 'Europe/Bucharest' },
  { id: 'sofia', name: 'סופיה', country: 'בולגריה', zone: 'Europe/Sofia' },
  { id: 'kyiv', name: 'קייב', country: 'אוקראינה', zone: 'Europe/Kyiv' },
  { id: 'istanbul', name: 'איסטנבול', country: 'טורקיה', zone: 'Europe/Istanbul' },
  { id: 'moscow', name: 'מוסקבה', country: 'רוסיה', zone: 'Europe/Moscow' },
  { id: 'tbilisi', name: 'טביליסי', country: 'גאורגיה', zone: 'Asia/Tbilisi' },
  { id: 'baku', name: 'באקו', country: 'אזרבייג׳ן', zone: 'Asia/Baku' },
  { id: 'cairo', name: 'קהיר', country: 'מצרים', zone: 'Africa/Cairo' },
  { id: 'amman', name: 'עמאן', country: 'ירדן', zone: 'Asia/Amman' },
  { id: 'dubai', name: 'דובאי', country: 'איחוד האמירויות', zone: 'Asia/Dubai' },
  { id: 'riyadh', name: 'ריאד', country: 'סעודיה', zone: 'Asia/Riyadh' },
  { id: 'tehran', name: 'טהרן', country: 'איראן', zone: 'Asia/Tehran' },
  { id: 'mumbai', name: 'מומבאי', country: 'הודו', zone: 'Asia/Kolkata' },
  { id: 'delhi', name: 'דלהי', country: 'הודו', zone: 'Asia/Kolkata' },
  { id: 'bangkok', name: 'בנגקוק', country: 'תאילנד', zone: 'Asia/Bangkok' },
  { id: 'singapore', name: 'סינגפור', country: 'סינגפור', zone: 'Asia/Singapore' },
  { id: 'hong-kong', name: 'הונג קונג', country: 'הונג קונג', zone: 'Asia/Hong_Kong' },
  { id: 'beijing', name: 'בייג׳ינג', country: 'סין', zone: 'Asia/Shanghai' },
  { id: 'seoul', name: 'סיאול', country: 'דרום קוריאה', zone: 'Asia/Seoul' },
  { id: 'tokyo', name: 'טוקיו', country: 'יפן', zone: 'Asia/Tokyo' },
  { id: 'manila', name: 'מנילה', country: 'הפיליפינים', zone: 'Asia/Manila' },
  { id: 'sydney', name: 'סידני', country: 'אוסטרליה', zone: 'Australia/Sydney' },
  { id: 'perth', name: 'פרת׳', country: 'אוסטרליה', zone: 'Australia/Perth' },
  { id: 'auckland', name: 'אוקלנד', country: 'ניו זילנד', zone: 'Pacific/Auckland' },
  { id: 'johannesburg', name: 'יוהנסבורג', country: 'דרום אפריקה', zone: 'Africa/Johannesburg' },
  { id: 'nairobi', name: 'נאירובי', country: 'קניה', zone: 'Africa/Nairobi' },
  { id: 'addis-ababa', name: 'אדיס אבבה', country: 'אתיופיה', zone: 'Africa/Addis_Ababa' },
  { id: 'casablanca', name: 'קזבלנקה', country: 'מרוקו', zone: 'Africa/Casablanca' },
]

export const cityById = (id: string) => cities.find((city) => city.id === id)

const formatters = new Map<string, Intl.DateTimeFormat>()

const formatterFor = (zone: string) => {
  const cached = formatters.get(zone)
  if (cached) return cached
  const created = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  })
  formatters.set(zone, created)
  return created
}

export function offsetMinutes(zone: string, at: Date) {
  const values: Record<string, number> = {}
  for (const part of formatterFor(zone).formatToParts(at)) {
    if (part.type !== 'literal') values[part.type] = Number(part.value)
  }
  const asUtc = Date.UTC(values.year, values.month - 1, values.day, values.hour, values.minute, values.second)
  return Math.round((asUtc - Math.floor(at.getTime() / 1000) * 1000) / 60000)
}

export const differenceFromIsrael = (zone: string, at: Date) =>
  offsetMinutes(zone, at) - offsetMinutes(ISRAEL_TIME_ZONE, at)

export function formatDifference(minutes: number) {
  if (minutes === 0) return 'אותה שעה'
  const sign = minutes > 0 ? '+' : '−'
  const absolute = Math.abs(minutes)
  const hours = Math.floor(absolute / 60)
  const rest = absolute % 60
  const amount = rest ? `${hours}:${String(rest).padStart(2, '0')}` : String(hours)
  return `${sign}${amount} ${absolute === 60 ? 'שעה' : 'שעות'}`
}

export function describeDifference(minutes: number) {
  if (minutes === 0) return 'השעה זהה לשעה בישראל'
  const amount = formatDifference(minutes).slice(1)
  return minutes > 0 ? `היעד מקדים את ישראל ב-${amount}` : `היעד מאחר אחרי ישראל ב-${amount}`
}

export const WINTER_REFERENCE = new Date(Date.UTC(2027, 0, 15, 12))
export const SUMMER_REFERENCE = new Date(Date.UTC(2027, 6, 15, 12))

export type CityDifferences = { city: City; winter: number; summer: number }

export const cityDifferences = (): CityDifferences[] =>
  cities.map((city) => ({
    city,
    winter: differenceFromIsrael(city.zone, WINTER_REFERENCE),
    summer: differenceFromIsrael(city.zone, SUMMER_REFERENCE),
  }))

export type GapRun = { from: Date; to: Date; days: number; minutes: number }

export function gapRuns(zone: string, fromYear: number, toYear: number): GapRun[] {
  const runs: GapRun[] = []
  const start = Date.UTC(fromYear, 0, 1, 12)
  const end = Date.UTC(toYear, 11, 31, 12)
  for (let time = start; time <= end; time += 86400000) {
    const at = new Date(time)
    const minutes = differenceFromIsrael(zone, at)
    const last = runs[runs.length - 1]
    if (last && last.minutes === minutes) {
      last.to = at
      last.days += 1
    } else {
      runs.push({ from: at, to: at, days: 1, minutes })
    }
  }
  return runs
}

export const gapZones = [
  { zone: 'America/New_York', label: 'ניו יורק (ארצות הברית)' },
  { zone: 'Europe/London', label: 'לונדון (בריטניה)' },
  { zone: 'Europe/Paris', label: 'פריז (מרכז אירופה)' },
  { zone: 'Australia/Sydney', label: 'סידני (אוסטרליה)' },
]

export const SLOTS_PER_DAY = 48

export type WorkWindow = { start: number; end: number }

export const hoursText = (hours: number) => {
  const whole = Math.floor(hours)
  const minutes = Math.round((hours - whole) * 60)
  return `${String(whole % 24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export type Overlap = { slots: boolean[]; ranges: { israelStart: number; israelEnd: number }[]; totalHours: number }

export function meetingOverlap(differenceMinutes: number, israel: WorkWindow, destination: WorkWindow): Overlap {
  const inWindow = (hour: number, window: WorkWindow) => hour >= window.start && hour < window.end
  const shift = differenceMinutes / 60
  const slots: boolean[] = []
  for (let slot = 0; slot < SLOTS_PER_DAY; slot += 1) {
    const israelHour = slot / 2
    const destinationHour = (((israelHour + shift) % 24) + 24) % 24
    slots.push(inWindow(israelHour, israel) && inWindow(destinationHour, destination))
  }
  const ranges: Overlap['ranges'] = []
  let open: number | null = null
  slots.forEach((on, slot) => {
    if (on && open === null) open = slot
    if (!on && open !== null) {
      ranges.push({ israelStart: open / 2, israelEnd: slot / 2 })
      open = null
    }
  })
  if (open !== null) ranges.push({ israelStart: open / 2, israelEnd: SLOTS_PER_DAY / 2 })
  return { slots, ranges, totalHours: slots.filter(Boolean).length / 2 }
}

export const timeDifferenceSources = {
  kan: {
    label: 'כאן חדשות: מתי מזיזים את השעון ב-2026',
    href: 'https://www.kan.org.il/content/kan-news/local/1018268/',
  },
  protocol: { label: 'שעון קיץ 2026-2027 בישראל', href: 'https://protocol.co.il/summer-time/' },
  iana: { label: 'IANA Time Zone Database', href: 'https://www.iana.org/time-zones' },
  mdn: {
    label: 'MDN: Intl.DateTimeFormat',
    href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat',
  },
}
