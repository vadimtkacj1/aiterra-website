import {
  DATA_API,
  cleanText,
  fetchRecords,
  formatDataDate,
  type CompanyRecord,
  type LookupFailure,
} from '@/lib/company-lookup'

export { REQUEST_TIMEOUT_MS, SLOW_AFTER_MS, TIMEOUT_REASON } from '@/lib/company-lookup'

export type VehicleStatus = 'valid' | 'expiring' | 'expired' | 'unknown' | 'inactive' | 'removed'

export type Tone = 'active' | 'caution' | 'ended' | 'unknown'

export type SourceKind = 'car' | 'motorcycle' | 'inactive' | 'removed'

export type VehicleSource = {
  id: string
  resourceId: string
  kind: SourceKind
  plateAsText: boolean
  label: string
}

export type Vehicle = {
  plate: string
  kind: SourceKind
  sourceLabel: string
  manufacturer: string
  commercialName: string
  vehicleType: string
  modelCode: string
  trim: string
  year: number | null
  color: string
  fuel: string
  ownership: string
  engineModel: string
  engineCc: number | null
  vin: string
  firstOnRoad: string
  lastTest: string
  testUntil: string
  removedOn: string
  pollutionGroup: number | null
  frontTire: string
  rearTire: string
}

export type TestState = {
  status: VehicleStatus
  tone: Tone
  label: string
  detail: string
  days: number | null
}

export type PlateCheck =
  | { kind: 'empty' }
  | { kind: 'invalid'; message: string }
  | { kind: 'valid'; plate: string }

export type VehicleFailure = Exclude<LookupFailure, 'aborted'>

export type VehicleSearch =
  | { ok: true; vehicle: Vehicle | null; dataDate: string }
  | { ok: false; failure: LookupFailure }

export const VEHICLES_DATASET_URL = 'https://data.gov.il/he/dataset/private-and-commercial-vehicles'
export const MOTORCYCLES_DATASET_URL = 'https://data.gov.il/he/dataset/motorcycle'
export const INACTIVE_DATASET_URL = 'https://data.gov.il/he/dataset/rechev_le_pail_with_degem'
export const INACTIVE_NO_MODEL_DATASET_URL = 'https://data.gov.il/he/dataset/rechev_le_pail_without-degem'
export const REMOVED_DATASET_URL = 'https://data.gov.il/he/dataset/reshev_bitul_sofi'
export const PLATE_MIN_DIGITS = 5
export const PLATE_MAX_DIGITS = 8
export const EXPIRING_WITHIN_DAYS = 30

const MS_PER_DAY = 86_400_000
const SEPARATORS = /[\s\-‐-―־./‎‏‪-‮]/g

const ACTIVE_SOURCES: VehicleSource[] = [
  {
    id: 'cars',
    resourceId: '053cea08-09bc-40ec-8f7a-156f0677aff3',
    kind: 'car',
    plateAsText: false,
    label: 'מאגר מספרי הרישוי של כלי רכב פרטיים ומסחריים',
  },
]

const FALLBACK_SOURCES: VehicleSource[] = [
  {
    id: 'motorcycles',
    resourceId: 'bf9df4e2-d90d-4c0a-a400-19e15af8e95f',
    kind: 'motorcycle',
    plateAsText: false,
    label: 'מאגר כלי הרכב הדו גלגליים',
  },
  {
    id: 'inactive-model',
    resourceId: 'f6efe89a-fb3d-43a4-bb61-9bf12a9b9099',
    kind: 'inactive',
    plateAsText: false,
    label: 'מאגר כלי רכב לא פעילים עם קוד דגם',
  },
  {
    id: 'inactive-no-model',
    resourceId: '6f6acd03-f351-4a8f-8ecf-df792f4f573a',
    kind: 'inactive',
    plateAsText: false,
    label: 'מאגר כלי רכב לא פעילים וחסרי קוד דגם',
  },
  {
    id: 'removed',
    resourceId: '851ecab1-0622-4dbe-a6c7-f950cf82abf9',
    kind: 'removed',
    plateAsText: false,
    label: 'מאגר כלי רכב שירדו מהכביש בביטול סופי',
  },
  {
    id: 'removed-2010-2016',
    resourceId: '4e6b9724-4c1e-43f0-909a-154d4cc4e046',
    kind: 'removed',
    plateAsText: true,
    label: 'מאגר כלי רכב שירדו מהכביש בביטול סופי, 2010 עד 2016',
  },
  {
    id: 'removed-2000-2009',
    resourceId: 'ec8cbc34-72e1-4b69-9c48-22821ba0bd6c',
    kind: 'removed',
    plateAsText: true,
    label: 'מאגר כלי רכב שירדו מהכביש בביטול סופי, 2000 עד 2009',
  },
]

export const kindLabels: Record<SourceKind, string> = {
  car: 'רכב פרטי או מסחרי קל',
  motorcycle: 'אופנוע או כלי דו גלגלי',
  inactive: 'רכב לא פעיל',
  removed: 'רכב שירד מהכביש',
}

export const failureText: Record<VehicleFailure, string> = {
  network: 'לא הצלחנו להתחבר למאגר של data.gov.il. בדקו את החיבור לאינטרנט ונסו שוב.',
  timeout: 'המאגר הממשלתי לא ענה בתוך 15 שניות. זה קורה כשהוא עמוס. נסו שוב בעוד רגע.',
  blocked: 'המאגר של data.gov.il חסם זמנית את החיפוש, כנראה בגלל הרבה חיפושים ברצף. חכו דקה ונסו שוב.',
  server: 'המאגר של data.gov.il לא זמין כרגע. נסו שוב בעוד כמה דקות.',
  format: 'המאגר החזיר תשובה שלא הצלחנו לקרוא. נסו שוב בעוד כמה דקות.',
}

export function checkPlate(raw: string): PlateCheck {
  const digits = raw.replace(SEPARATORS, '')
  if (!digits) return { kind: 'empty' }
  if (!/^\d+$/.test(digits)) {
    return {
      kind: 'invalid',
      message: 'מספר רישוי בנוי מספרות בלבד. מקפים ורווחים לא משנים, אבל אותיות לא מופיעות במאגר.',
    }
  }
  if (digits.length < PLATE_MIN_DIGITS) {
    return {
      kind: 'invalid',
      message: `מספר רישוי הוא 7 או 8 ספרות, והקלדתם ${digits.length}. ברכבים ישנים מאוד יש גם 5 או 6.`,
    }
  }
  if (digits.length > PLATE_MAX_DIGITS) {
    return { kind: 'invalid', message: `מספר רישוי הוא עד 8 ספרות, והקלדתם ${digits.length}.` }
  }
  return { kind: 'valid', plate: String(Number(digits)) }
}

export function formatPlate(plate: string) {
  if (plate.length === 7) return `${plate.slice(0, 2)}-${plate.slice(2, 5)}-${plate.slice(5)}`
  if (plate.length === 8) return `${plate.slice(0, 3)}-${plate.slice(3, 5)}-${plate.slice(5)}`
  return plate
}

const numberOf = (value: unknown) => {
  const parsed = Number(value)
  return value !== null && value !== '' && Number.isFinite(parsed) ? parsed : null
}

const yearOf = (value: unknown) => {
  const year = numberOf(value)
  return year !== null && year > 1900 ? year : null
}

export const formatIsoDate = (value: string) => {
  const match = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(value)
  if (!match) return value
  const [, year, month, day] = match
  return day ? `${Number(day)}.${Number(month)}.${year}` : `${Number(month)}.${year}`
}

const dateOnly = (value: unknown) => {
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(cleanText(value))
  return match ? match[1] : ''
}

const monthOf = (value: unknown) => {
  const text = cleanText(value)
  return /^\d{4}(-\d{2})?(-\d{2})?/.test(text) ? text.slice(0, 7) : ''
}

const pollutionGroupOf = (value: unknown) => {
  const group = numberOf(value)
  return group !== null && group > 0 ? group : null
}

const colorOf = (value: unknown) => {
  const color = cleanText(value)
  return color === 'לא ידוע' ? '' : color
}

export function toVehicle(record: CompanyRecord, source: VehicleSource): Vehicle {
  const removed = source.kind === 'removed'
  return {
    plate: String(Number(record.mispar_rechev)),
    kind: source.kind,
    sourceLabel: source.label,
    manufacturer: cleanText(record.tozeret_nm),
    commercialName: cleanText(record.kinuy_mishari),
    vehicleType: cleanText(record.sug_rechev_nm),
    modelCode: cleanText(record.degem_nm),
    trim: cleanText(record.ramat_gimur),
    year: yearOf(record.shnat_yitzur),
    color: colorOf(record.tzeva_rechev),
    fuel: cleanText(record.sug_delek_nm),
    ownership: cleanText(record.baalut),
    engineModel: cleanText(record.degem_manoa),
    engineCc: source.kind === 'motorcycle' ? numberOf(record.nefach_manoa) : null,
    vin: cleanText(record.misgeret),
    firstOnRoad: monthOf(record.moed_aliya_lakvish),
    lastTest: dateOnly(record.mivchan_acharon_dt),
    testUntil: dateOnly(record.tokef_dt),
    removedOn: removed ? dateOnly(record.bitul_dt) : '',
    pollutionGroup: pollutionGroupOf(record.kvutzat_zihum),
    frontTire: cleanText(record.zmig_kidmi || record.mida_zmig_kidmi),
    rearTire: cleanText(record.zmig_ahori || record.mida_zmig_ahori),
  }
}

export const daysBetween = (isoDate: string, now: Date) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate)
  if (!match) return null
  const target = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((target - today) / MS_PER_DAY)
}

const daysText = (days: number) => {
  const count = Math.abs(days)
  if (count === 1) return 'יום אחד'
  return `${count.toLocaleString('he-IL')} ימים`
}

export function testStateOf(vehicle: Vehicle, now: Date): TestState {
  if (vehicle.kind === 'removed') {
    return {
      status: 'removed',
      tone: 'ended',
      label: 'ירד מהכביש',
      detail: vehicle.removedOn
        ? `הרכב רשום בביטול סופי מ-${formatIsoDate(vehicle.removedOn)}. אי אפשר לחדש לו רישיון ולהחזיר אותו לכביש.`
        : 'הרכב רשום בביטול סופי. אי אפשר לחדש לו רישיון ולהחזיר אותו לכביש.',
      days: null,
    }
  }
  if (vehicle.kind === 'inactive') {
    return {
      status: 'inactive',
      tone: 'caution',
      label: 'לא פעיל',
      detail: vehicle.testUntil
        ? `הרישיון של הרכב פג ב-${formatIsoDate(vehicle.testUntil)} והוא מופיע בקובץ הרכבים הלא פעילים. כדי להחזיר אותו לכביש צריך לעבור טסט ולחדש רישיון.`
        : 'הרכב מופיע בקובץ הרכבים הלא פעילים, כלומר אין לו רישיון בתוקף.',
      days: null,
    }
  }
  const days = daysBetween(vehicle.testUntil, now)
  if (days === null) {
    return {
      status: 'unknown',
      tone: 'unknown',
      label: 'אין תאריך טסט בקובץ',
      detail:
        vehicle.kind === 'motorcycle'
          ? 'בקובץ האופנועים של משרד התחבורה אין תאריך תוקף רישיון, ולכן הכלי לא יכול להציג טסט לאופנוע. את התוקף אפשר לראות ברישיון הרכב.'
          : 'לרכב הזה אין תאריך תוקף בקובץ. את תוקף הרישיון אפשר לראות ברישיון הרכב.',
      days: null,
    }
  }
  if (days < 0) {
    return {
      status: 'expired',
      tone: 'ended',
      label: 'הטסט פג תוקף',
      detail: `תוקף הרישיון הסתיים ב-${formatIsoDate(vehicle.testUntil)}, לפני ${daysText(days)}. נסיעה ברכב בלי רישיון בתוקף היא עבירה, ולכן צריך לעבור טסט ולחדש.`,
      days,
    }
  }
  if (days <= EXPIRING_WITHIN_DAYS) {
    return {
      status: 'expiring',
      tone: 'caution',
      label: days === 0 ? 'הטסט פג היום' : 'הטסט עומד לפוג',
      detail:
        days === 0
          ? `תוקף הרישיון מסתיים היום, ${formatIsoDate(vehicle.testUntil)}.`
          : `תוקף הרישיון מסתיים ב-${formatIsoDate(vehicle.testUntil)}, בעוד ${daysText(days)}. כדאי לקבוע טסט עכשיו.`,
      days,
    }
  }
  return {
    status: 'valid',
    tone: 'active',
    label: 'הטסט בתוקף',
    detail: `תוקף הרישיון עד ${formatIsoDate(vehicle.testUntil)}, בעוד ${daysText(days)}.`,
    days,
  }
}

const searchUrl = (source: VehicleSource, plate: string) =>
  `${DATA_API}/datastore_search?${new URLSearchParams({
    resource_id: source.resourceId,
    include_total: 'false',
    limit: '1',
    filters: JSON.stringify({
      mispar_rechev: source.plateAsText ? plate.padStart(PLATE_MAX_DIGITS, '0') : Number(plate),
    }),
  })}`

const dateUrl = (source: VehicleSource) => `${DATA_API}/resource_show?id=${source.resourceId}`

export async function fetchDataDate(source: VehicleSource, signal: AbortSignal) {
  try {
    const response = await fetch(dateUrl(source), { signal, headers: { Accept: 'application/json' } })
    if (!response.ok) return ''
    const { result } = (await response.json()) as { result?: { last_modified?: unknown } }
    return formatDataDate(result?.last_modified)
  } catch {
    return ''
  }
}

async function lookupIn(sources: VehicleSource[], plate: string, signal: AbortSignal) {
  const results = await Promise.all(
    sources.map(async (source) => ({ source, result: await fetchRecords(searchUrl(source, plate), signal) })),
  )
  const failed = results.find(({ result }) => !result.ok)
  const hit = results.find(({ result }) => result.ok && result.records.length > 0)
  return { results, failed, hit }
}

export async function searchVehicle(plate: string, signal: AbortSignal): Promise<VehicleSearch> {
  const first = await lookupIn(ACTIVE_SOURCES, plate, signal)
  const firstHit = first.hit
  if (firstHit && firstHit.result.ok) {
    const dataDate = await fetchDataDate(firstHit.source, signal)
    return { ok: true, vehicle: toVehicle(firstHit.result.records[0], firstHit.source), dataDate }
  }
  if (first.failed && !first.failed.result.ok) return { ok: false, failure: first.failed.result.failure }

  const rest = await lookupIn(FALLBACK_SOURCES, plate, signal)
  const restHit = rest.hit
  if (restHit && restHit.result.ok) {
    const dataDate = await fetchDataDate(restHit.source, signal)
    return { ok: true, vehicle: toVehicle(restHit.result.records[0], restHit.source), dataDate }
  }
  if (rest.failed && !rest.failed.result.ok) return { ok: false, failure: rest.failed.result.failure }
  return { ok: true, vehicle: null, dataDate: '' }
}

export function vehicleToText(vehicle: Vehicle, state: TestState, dataDate: string) {
  const title = [vehicle.manufacturer, vehicle.commercialName || vehicle.modelCode].filter(Boolean).join(' ')
  const lines = [
    `מספר רישוי: ${formatPlate(vehicle.plate)}`,
    title,
    `סטטוס: ${state.label}`,
    vehicle.testUntil && vehicle.kind !== 'removed' ? `תוקף טסט: ${formatIsoDate(vehicle.testUntil)}` : '',
    vehicle.lastTest ? `טסט אחרון: ${formatIsoDate(vehicle.lastTest)}` : '',
    vehicle.removedOn ? `ירד מהכביש: ${formatIsoDate(vehicle.removedOn)}` : '',
    vehicle.year ? `שנת ייצור: ${vehicle.year}` : '',
    vehicle.color ? `צבע: ${vehicle.color}` : '',
    vehicle.fuel ? `סוג דלק: ${vehicle.fuel}` : '',
    vehicle.ownership ? `בעלות: ${vehicle.ownership}` : '',
    `מקור: ${vehicle.sourceLabel} של משרד התחבורה ב-data.gov.il${dataDate ? `, נתונים מעודכנים ל-${dataDate}` : ''}`,
  ]
  return lines.filter(Boolean).join('\n')
}

export const announcementFor = (vehicle: Vehicle | null, state: TestState | null) => {
  if (!vehicle || !state) return 'לא נמצא רכב עם המספר הזה'
  return `נמצא רכב ${vehicle.manufacturer} ${vehicle.commercialName || vehicle.modelCode}, ${state.label}`
}
