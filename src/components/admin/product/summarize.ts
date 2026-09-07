import type {
  FrictionSummary,
  PrintSummary,
  ProductEventRow,
  SearchSummary,
  Slice,
  StockSummary,
} from './types'

const toCount = (value: unknown): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

const rowsNamed = (events: readonly ProductEventRow[], name: string): ProductEventRow[] =>
  events.filter((row) => row.name === name)

const sortBySize = (slices: Slice[]): Slice[] =>
  [...slices].sort((left, right) => right.count - left.count || left.key.localeCompare(right.key))

export function groupBy(
  events: readonly ProductEventRow[],
  name: string,
  prop: string
): Slice[] {
  const totals = new Map<string, number>()
  for (const row of rowsNamed(events, name)) {
    const key = String(row.props?.[prop] ?? 'unknown')
    totals.set(key, (totals.get(key) ?? 0) + toCount(row.count))
  }
  return sortBySize([...totals].map(([key, count]) => ({ key, count })))
}

export function sectionsOpened(events: readonly ProductEventRow[]): Slice[] {
  return groupBy(events, 'screen_open', 'section')
}

export function printing(events: readonly ProductEventRow[]): PrintSummary {
  let labels = 0
  let printed = 0
  let failed = 0
  let cancelled = 0

  for (const row of rowsNamed(events, 'label_print')) {
    const runs = toCount(row.count)
    const outcome = String(row.props?.outcome ?? '')
    if (outcome === 'printed') {
      printed += runs
      labels += toCount(row.props?.count) * runs
    } else if (outcome === 'failed') {
      failed += runs
    } else if (outcome === 'cancelled') {
      cancelled += runs
    }
  }

  const attempts = printed + failed
  return {
    labels,
    printed,
    failed,
    cancelled,
    failureRate: attempts === 0 ? 0 : failed / attempts,
  }
}

export function stockWrites(events: readonly ProductEventRow[]): StockSummary {
  const bySource = groupBy(events, 'stock_write', 'source')
  let saved = 0
  let failed = 0

  for (const row of rowsNamed(events, 'stock_write')) {
    const runs = toCount(row.count)
    if (String(row.props?.outcome ?? '') === 'saved') saved += runs
    else failed += runs
  }

  return { bySource, saved, failed, total: saved + failed }
}

export function searching(events: readonly ProductEventRow[]): SearchSummary {
  let searches = 0
  let found = 0

  for (const row of rowsNamed(events, 'catalog_search')) {
    const runs = toCount(row.count)
    searches += runs
    if (String(row.props?.found ?? '') === 'yes') found += runs
  }

  return { searches, found, hitRate: searches === 0 ? 0 : found / searches }
}

export function errors(events: readonly ProductEventRow[]): Slice[] {
  return groupBy(events, 'app_error', 'area')
}

export function friction(audit: Record<string, number> | null | undefined): FrictionSummary {
  const at = (key: string) => toCount(audit?.[key])
  const writes = at('stock.adjust')
  const refused = at('stock.adjust.rejected')
  const clamped = at('stock.adjust.clamped')
  const unknown = at('stock.adjust.unknown')
  const rough = writes + refused + unknown

  return {
    writes,
    refused,
    clamped,
    unknown,
    frictionRate: rough === 0 ? 0 : (refused + unknown) / rough,
  }
}

export function tally(counts: Record<string, number> | null | undefined): Slice[] {
  if (!counts) return []
  return sortBySize(Object.entries(counts).map(([key, count]) => ({ key, count: toCount(count) })))
}

export function percent(ratio: number): string {
  if (!Number.isFinite(ratio) || ratio <= 0) return '0%'
  return `${Math.round(ratio * 100)}%`
}
