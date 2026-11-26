import {
  DATA_API,
  buildNameQuery,
  cleanText,
  fetchRecords,
  formatDataDate,
  type CompanyRecord,
  type LookupFailure,
} from '@/lib/company-lookup'

export const BROKERS_RESOURCE_ID = 'a0f56034-88db-4132-8803-854bcdb01ca1'
export const BROKERS_DATASET_URL = 'https://data.gov.il/he/datasets/ministry_of_justice/metavhim'
export const BROKERS_REGISTER_URL = 'https://www.gov.il/he/departments/dynamiccollectors/search-mediators'
export const BROKERS_LAW_URL =
  'https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%94%D7%9E%D7%AA%D7%95%D7%95%D7%9B%D7%99%D7%9D_%D7%91%D7%9E%D7%A7%D7%A8%D7%A7%D7%A2%D7%99%D7%9F'
export const BROKERS_ORDER_REGULATIONS_URL =
  'https://he.wikisource.org/wiki/%D7%AA%D7%A7%D7%A0%D7%95%D7%AA_%D7%94%D7%9E%D7%AA%D7%95%D7%95%D7%9B%D7%99%D7%9D_%D7%91%D7%9E%D7%A7%D7%A8%D7%A7%D7%A2%D7%99%D7%9F_(%D7%A4%D7%A8%D7%98%D7%99_%D7%94%D7%96%D7%9E%D7%A0%D7%94_%D7%91%D7%9B%D7%AA%D7%91)'
export const BROKERS_REVIEWED_LABEL = '26.11.2026'
export const BROKERS_DATA_LABEL = '25.11.2026'
export const BROKERS_COUNT = 25586
export const BROKERS_DISTINCT_NAMES = 24790
export const SAME_NAME_EXAMPLE = 'כהן דוד'
export const SAME_NAME_EXAMPLE_COUNT = 15
export const SAME_NAME_SEARCH_ROWS = 22
export const SEVEN_DIGIT_LICENSES = 15724
export const LICENSE_MIN_DIGITS = 4
export const LICENSE_MAX_DIGITS = 9
export const BROKER_RESULTS_LIMIT = 20

const NAME_ROWS_LIMIT = 300
const HEBREW_LETTER = /[א-ת]/
const LATIN_LETTER = /[a-z]/i

const FIELD = {
  license: 'מס רשיון',
  name: 'שם המתווך',
} as const

export type Broker = {
  license: string
  name: string
}

export type BrokerQueryProblem = 'digits' | 'latin' | 'short'

export type BrokerQuery =
  | { kind: 'empty' }
  | { kind: 'invalid'; problem: BrokerQueryProblem; digits: number }
  | { kind: 'license'; value: string }
  | { kind: 'name'; value: string; tsquery: string }

export type ValidBrokerQuery = Exclude<BrokerQuery, { kind: 'empty' | 'invalid' }>

export type BrokerSearch = { ok: true; brokers: Broker[]; more: boolean } | { ok: false; failure: LookupFailure }

export function checkBrokerQuery(raw: string): BrokerQuery {
  const value = raw.trim()
  if (!value) return { kind: 'empty' }
  const digits = value.replace(/[\s\-./]/g, '')
  if (/^\d+$/.test(digits)) {
    const significant = String(Number(digits))
    if (significant.length >= LICENSE_MIN_DIGITS && significant.length <= LICENSE_MAX_DIGITS) {
      return { kind: 'license', value: significant }
    }
    return { kind: 'invalid', problem: 'digits', digits: digits.length }
  }
  if (!HEBREW_LETTER.test(value)) {
    return { kind: 'invalid', problem: LATIN_LETTER.test(value) ? 'latin' : 'short', digits: 0 }
  }
  const query = buildNameQuery(value)
  if (!query) return { kind: 'invalid', problem: 'short', digits: 0 }
  return { kind: 'name', value, tsquery: query.tsquery }
}

export function toBrokers(records: CompanyRecord[]): Broker[] {
  const byLicense = new Map<string, Broker>()
  for (const record of records) {
    const license = cleanText(record[FIELD.license])
    const name = cleanText(record[FIELD.name])
    if (license && name) byLicense.set(license, { license, name })
  }
  return [...byLicense.values()]
}

const searchUrl = (params: Record<string, string>) =>
  `${DATA_API}/datastore_search?${new URLSearchParams({
    resource_id: BROKERS_RESOURCE_ID,
    fields: Object.values(FIELD).join(','),
    include_total: 'false',
    ...params,
  })}`

const queryUrl = (query: ValidBrokerQuery) =>
  query.kind === 'name'
    ? searchUrl({
        q: JSON.stringify({ [FIELD.name]: query.tsquery }),
        plain: 'false',
        limit: String(NAME_ROWS_LIMIT),
      })
    : searchUrl({ filters: JSON.stringify({ [FIELD.license]: query.value }), limit: '2' })

const wordsOf = (text: string) => text.split(/[^\p{L}\p{N}]+/u).filter(Boolean)

function rankByName(brokers: Broker[], searched: string) {
  const typed = wordsOf(searched)
  const rank = (broker: Broker) => {
    const words = wordsOf(broker.name)
    if (words.length === typed.length && typed.every((word) => words.includes(word))) return 0
    return typed.some((word) => words[0]?.startsWith(word)) ? 1 : 2
  }
  return brokers
    .map((broker, index) => ({ broker, index, rank: rank(broker) }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map((entry) => entry.broker)
}

export async function searchBrokers(query: ValidBrokerQuery, signal: AbortSignal): Promise<BrokerSearch> {
  const result = await fetchRecords(queryUrl(query), signal)
  if (!result.ok) return result
  const found = toBrokers(result.records)
  const ranked = query.kind === 'name' ? rankByName(found, query.value) : found
  return { ok: true, brokers: ranked.slice(0, BROKER_RESULTS_LIMIT), more: ranked.length > BROKER_RESULTS_LIMIT }
}

export async function fetchBrokersDataDate(signal: AbortSignal) {
  try {
    const response = await fetch(`${DATA_API}/resource_show?id=${BROKERS_RESOURCE_ID}`, { signal })
    if (!response.ok) return ''
    const { result } = (await response.json()) as { result?: { last_modified?: unknown } }
    return formatDataDate(result?.last_modified)
  } catch {
    return ''
  }
}
