import {
  errors,
  friction,
  percent,
  printing,
  searching,
  sectionsOpened,
  stockWrites,
  tally,
} from '../src/components/admin/product/summarize.ts'

const events = [
  { name: 'screen_open', props: { section: 'scan' }, count: 40 },
  { name: 'screen_open', props: { section: 'receiving' }, count: 3 },
  { name: 'label_print', props: { outcome: 'printed', count: 4 }, count: 5 },
  { name: 'label_print', props: { outcome: 'failed' }, count: 1 },
  { name: 'label_print', props: { outcome: 'cancelled' }, count: 2 },
  { name: 'stock_write', props: { source: 'scan', outcome: 'saved' }, count: 12 },
  { name: 'stock_write', props: { source: 'receiving', outcome: 'saved' }, count: 3 },
  { name: 'stock_write', props: { source: 'scan', outcome: 'failed' }, count: 1 },
  { name: 'catalog_search', props: { found: 'yes' }, count: 7 },
  { name: 'catalog_search', props: { found: 'no' }, count: 3 },
  { name: 'app_error', props: { area: 'print' }, count: 2 },
]

const audit = {
  'stock.adjust': 90,
  'stock.adjust.rejected': 6,
  'stock.adjust.clamped': 4,
  'stock.adjust.unknown': 4,
  'invite.issue': 2,
}

const fail = []
const is = (label, actual, expected) => {
  const a = JSON.stringify(actual)
  const b = JSON.stringify(expected)
  if (a !== b) fail.push(`${label}: got ${a}, wanted ${b}`)
}

is('sections', sectionsOpened(events), [{ key: 'scan', count: 40 }, { key: 'receiving', count: 3 }])
is('print', printing(events), { labels: 20, printed: 5, failed: 1, cancelled: 2, failureRate: 1 / 6 })
is('stock sources', stockWrites(events).bySource, [{ key: 'scan', count: 13 }, { key: 'receiving', count: 3 }])
is('stock totals', { saved: stockWrites(events).saved, failed: stockWrites(events).failed }, { saved: 15, failed: 1 })
is('search', searching(events), { searches: 10, found: 7, hitRate: 0.7 })
is('errors', errors(events), [{ key: 'print', count: 2 }])
is('friction', friction(audit).frictionRate, 10 / 100)
is('percent', [percent(0.7), percent(0), percent(NaN)], ['70%', '0%', '0%'])
is('tally sorts', tally({ a: 1, b: 9 }), [{ key: 'b', count: 9 }, { key: 'a', count: 1 }])
is('empty is safe', [printing([]).failureRate, searching([]).hitRate, friction(null).frictionRate, tally(null)], [0, 0, 0, []])

if (fail.length) {
  console.error('FAILED:\n' + fail.join('\n'))
  process.exit(1)
}
console.log('summarize: all 10 checks passed')
