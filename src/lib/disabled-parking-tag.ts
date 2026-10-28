import { DATA_API, fetchRecords, formatDataDate, type LookupFailure } from '@/lib/company-lookup'
import { searchVehicle, type Vehicle } from '@/lib/vehicle-lookup'

export const TAG_RESOURCE_ID = 'c8b9f9c8-4612-4068-934f-d4acd2e3c06e'
export const TAG_DATASET_URL = 'https://data.gov.il/he/dataset/rechev-tag-nachim'
export const TAG_RECORDS_APPROX = '643 אלף'

export type DisabledTag = { plate: string; issuedOn: string; tagType: number | null }

export type TagSearch =
  | { ok: true; tag: DisabledTag | null; vehicle: Vehicle | null; dataDate: string }
  | { ok: false; failure: LookupFailure }

const issuedOf = (value: unknown) => {
  const match = /^(\d{4})(\d{2})(\d{2})$/.exec(String(value ?? ''))
  return match ? `${match[3]}.${match[2]}.${match[1]}` : ''
}

const searchUrl = (plate: string) =>
  `${DATA_API}/datastore_search?${new URLSearchParams({
    resource_id: TAG_RESOURCE_ID,
    include_total: 'false',
    limit: '1',
    filters: JSON.stringify({ 'MISPAR RECHEV': Number(plate) }),
  })}`

async function tagDataDate(signal: AbortSignal) {
  try {
    const response = await fetch(`${DATA_API}/resource_show?id=${TAG_RESOURCE_ID}`, { signal })
    if (!response.ok) return ''
    const { result } = (await response.json()) as { result?: { last_modified?: unknown } }
    return formatDataDate(result?.last_modified)
  } catch {
    return ''
  }
}

export async function searchTag(plate: string, signal: AbortSignal): Promise<TagSearch> {
  const [tagResult, vehicleResult, dataDate] = await Promise.all([
    fetchRecords(searchUrl(plate), signal),
    searchVehicle(plate, signal),
    tagDataDate(signal),
  ])
  if (!tagResult.ok) return tagResult
  const record = tagResult.records[0]
  const tag = record
    ? {
        plate,
        issuedOn: issuedOf(record['TAARICH HAFAKAT TAG']),
        tagType: Number.isFinite(Number(record['SUG TAV'])) ? Number(record['SUG TAV']) : null,
      }
    : null
  return { ok: true, tag, vehicle: vehicleResult.ok ? vehicleResult.vehicle : null, dataDate }
}
