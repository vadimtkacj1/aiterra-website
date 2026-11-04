import { DATA_API, cleanText, fetchRecords, type CompanyRecord } from '@/lib/company-lookup'
import type { Vehicle } from '@/lib/vehicle-lookup'

export const HISTORY_RESOURCE_ID = '56063a99-8a3e-4ff4-912e-5966c0279bad'
export const OPEN_RECALLS_RESOURCE_ID = '36bf1404-0be4-49d2-82dc-2f1ead4a8b93'
export const RECALL_NOTICES_RESOURCE_ID = '2c33523f-87aa-44ec-a736-edbb0a82975e'
export const MODELS_RESOURCE_ID = '142afde2-6228-49f9-8a29-9b6c3a0cbe40'

export const HISTORY_DATASET_URL = 'https://data.gov.il/he/datasets/ministry_of_transport/shinui_mivne'
export const OPEN_RECALLS_DATASET_URL = 'https://data.gov.il/he/datasets/ministry_of_transport/hagbalat_recall'
export const MODELS_DATASET_URL = 'https://data.gov.il/he/datasets/ministry_of_transport/degem-rechev-wltp'
export const LICENCE_FEE_URL = 'https://www.gov.il/he/pages/drivers-car-license-fee-boards'
export const LICENCE_FEE_DATE = '1.4.2026'
const MAX_FEE_WEIGHT_KG = 3500

const LICENCE_FEES: Record<number, [number, number, number, number]> = {
  1: [1266, 1109, 972, 849],
  2: [1610, 1404, 1230, 1076],
  3: [1941, 1698, 1487, 1297],
  4: [2315, 1968, 1674, 1422],
  5: [2651, 2184, 1802, 1490],
  6: [3764, 2823, 2117, 1585],
  7: [5364, 3753, 2627, 1840],
}

const feeColumn = (year: number) => (year >= 2024 ? 0 : year >= 2021 ? 1 : year >= 2017 ? 2 : 3)

export function licenceFeeOf(model: ModelInfo | null, year: number | null) {
  if (!model?.feeGroup || year === null) return null
  if (model.totalWeight !== null && model.totalWeight > MAX_FEE_WEIGHT_KG) return null
  const row = LICENCE_FEES[model.feeGroup]
  return row ? row[feeColumn(year)] : null
}

const MAX_RECALLS = 10

export type VehicleHistory = {
  mileage: number | null
  origin: string
  firstRegistration: string
  structureChanged: boolean
  gasConversion: boolean
  colorChanged: boolean
  tiresChanged: boolean
}

export type OpenRecall = {
  id: number
  type: string
  area: string
  description: string
  opened: string
  importer: string
  phone: string
  website: string
}

export type ModelInfo = {
  horsepower: number | null
  engineCc: number | null
  gearbox: string
  body: string
  seats: number | null
  doors: number | null
  totalWeight: number | null
  feeGroup: number | null
  safetyLevel: number | null
  country: string
}

export type VehicleExtras = {
  history: VehicleHistory | null
  recalls: OpenRecall[] | null
  model: ModelInfo | null
}

const positive = (value: unknown) => {
  const parsed = Number(value)
  return value !== null && value !== '' && Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

const flag = (value: unknown) => Number(value) === 1

const level = (value: unknown) => {
  const parsed = Number(value)
  return value !== null && value !== '' && Number.isInteger(parsed) && parsed >= 0 ? parsed : null
}

const isoDay = (value: unknown) => {
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(cleanText(value))
  return match ? match[1] : ''
}

const searchUrl = (resourceId: string, filters: Record<string, unknown>, limit: number) =>
  `${DATA_API}/datastore_search?${new URLSearchParams({
    resource_id: resourceId,
    include_total: 'false',
    limit: String(limit),
    filters: JSON.stringify(filters),
  })}`

const recordsFrom = async (url: string, signal: AbortSignal) => {
  const result = await fetchRecords(url, signal)
  return result.ok ? result.records : null
}

const originLabels: Record<string, string> = {
  החכר: 'ליסינג (החכר)',
  השכרה: 'השכרה',
  'יבוא אישי-משומש': 'יבוא אישי של רכב משומש',
}

export const originText = (origin: string) => (origin ? (originLabels[origin] ?? origin) : 'פרטי, לא ליסינג ולא השכרה')

function toHistory(record: CompanyRecord): VehicleHistory {
  return {
    mileage: positive(record.kilometer_test_aharon),
    origin: cleanText(record.mkoriut_nm),
    firstRegistration: isoDay(record.rishum_rishon_dt),
    structureChanged: flag(record.shinui_mivne_ind),
    gasConversion: flag(record.gapam_ind),
    colorChanged: flag(record.shnui_zeva_ind),
    tiresChanged: flag(record.shinui_zmig_ind),
  }
}

async function fetchHistory(plate: string, signal: AbortSignal) {
  const records = await recordsFrom(searchUrl(HISTORY_RESOURCE_ID, { mispar_rechev: Number(plate) }, 1), signal)
  if (!records) return null
  return records.length ? toHistory(records[0]) : null
}

async function fetchRecalls(plate: string, signal: AbortSignal): Promise<OpenRecall[] | null> {
  const open = await recordsFrom(
    searchUrl(OPEN_RECALLS_RESOURCE_ID, { MISPAR_RECHEV: Number(plate) }, MAX_RECALLS),
    signal,
  )
  if (!open) return null
  if (!open.length) return []
  const ids = [...new Set(open.map((record) => Number(record.RECALL_ID)).filter(Number.isFinite))]
  const notices = (await recordsFrom(searchUrl(RECALL_NOTICES_RESOURCE_ID, { RECALL_ID: ids }, ids.length), signal)) ?? []
  const noticeById = new Map(notices.map((notice) => [Number(notice.RECALL_ID), notice]))
  return open.map((record) => {
    const id = Number(record.RECALL_ID)
    const notice = noticeById.get(id)
    return {
      id,
      type: cleanText(record.SUG_RECALL),
      area: cleanText(record.SUG_TAKALA),
      description: cleanText(record.TEUR_TAKALA),
      opened: isoDay(record.TAARICH_PTICHA),
      importer: cleanText(notice?.YEVUAN_TEUR),
      phone: cleanText(notice?.TELEPHONE),
      website: cleanText(notice?.WEBSITE).toLowerCase(),
    }
  })
}

function toModel(record: CompanyRecord): ModelInfo {
  const automatic = record.automatic_ind
  return {
    horsepower: positive(record.koah_sus),
    engineCc: positive(record.nefah_manoa),
    gearbox: automatic === null || automatic === undefined ? '' : flag(automatic) ? 'אוטומטית' : 'ידנית',
    body: cleanText(record.merkav),
    seats: positive(record.mispar_moshavim),
    doors: positive(record.mispar_dlatot),
    totalWeight: positive(record.mishkal_kolel),
    feeGroup: positive(record.kvuzat_agra_cd),
    safetyLevel: level(record.ramat_eivzur_betihuty),
    country: cleanText(record.tozeret_eretz_nm),
  }
}

async function fetchModel(vehicle: Vehicle, signal: AbortSignal) {
  if (vehicle.manufacturerCode === null || vehicle.modelNumber === null || vehicle.year === null) return null
  const filters: Record<string, unknown> = {
    tozeret_cd: vehicle.manufacturerCode,
    degem_cd: vehicle.modelNumber,
    shnat_yitzur: vehicle.year,
  }
  if (vehicle.modelKind) filters.sug_degem = vehicle.modelKind
  const records = await recordsFrom(searchUrl(MODELS_RESOURCE_ID, filters, 1), signal)
  return records?.length ? toModel(records[0]) : null
}

export async function fetchVehicleExtras(vehicle: Vehicle, signal: AbortSignal): Promise<VehicleExtras> {
  const ownRecords = vehicle.kind === 'car'
  const [history, recalls, model] = await Promise.all([
    ownRecords ? fetchHistory(vehicle.plate, signal) : Promise.resolve(null),
    vehicle.kind === 'removed' ? Promise.resolve(null) : fetchRecalls(vehicle.plate, signal),
    ownRecords ? fetchModel(vehicle, signal) : Promise.resolve(null),
  ])
  return { history, recalls, model }
}

export function extrasToText(extras: VehicleExtras, year: number | null) {
  const { history, recalls, model } = extras
  const fee = licenceFeeOf(model, year)
  return [
    history?.mileage ? `קילומטראז׳ בטסט האחרון: ${history.mileage.toLocaleString('he-IL')} ק״מ` : '',
    history ? `מקוריות: ${originText(history.origin)}` : '',
    recalls ? (recalls.length ? `ריקולים פתוחים: ${recalls.length}` : 'ריקולים פתוחים: אין') : '',
    model?.horsepower ? `כוח סוס: ${model.horsepower}` : '',
    model?.feeGroup ? `קבוצת אגרת רישוי: ${model.feeGroup}` : '',
    fee ? `אגרת רישוי שנתית: ${fee.toLocaleString('he-IL')} ₪ (תעריף מ-${LICENCE_FEE_DATE})` : '',
  ].filter(Boolean)
}
