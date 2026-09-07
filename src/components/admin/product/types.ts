export interface ProductEventRow {
  name: string
  props: Record<string, string | number>
  count: number
}

export interface ProductDeviceRollup {
  devices: number
  active1: number
  active7: number
  active30: number
  byPlatform: Record<string, number>
  byVersion: Record<string, number>
  shops: number
  activeShops7: number
}

export interface ProductPayload {
  ok: boolean
  at: number
  days: number
  devices: ProductDeviceRollup | null
  events: ProductEventRow[]
  audit: Record<string, number>
  shopsSeen: number
}

export interface Slice {
  key: string
  count: number
}

export interface PrintSummary {
  labels: number
  printed: number
  failed: number
  cancelled: number
  failureRate: number
}

export interface StockSummary {
  bySource: Slice[]
  saved: number
  failed: number
  total: number
}

export interface SearchSummary {
  searches: number
  found: number
  hitRate: number
}

export interface FrictionSummary {
  writes: number
  refused: number
  clamped: number
  unknown: number
  frictionRate: number
}
