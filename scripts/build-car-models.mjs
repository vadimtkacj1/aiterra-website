import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'
import { brandKeyOf, familyKeyOf } from '../src/lib/car-model-key.ts'

const dataDir = process.argv[2]
if (!dataDir) {
  console.error('usage: node --experimental-strip-types --max-old-space-size=1024 scripts/build-car-models.mjs <data-dir> [YYYY-MM-DD]')
  process.exit(1)
}
const DATA_DATE = process.argv[3] || '2026-11-06'
const OUT_FILE = path.resolve('src/data/car-models.json')
const SLUGS_FILE = path.resolve('src/data/car-model-slugs.json')

const PAGE_COUNT = 20
const MIN_ACTIVE = 1000
const MIN_MILEAGE_SHARE = 0.5
const CANDIDATES = 300
const NEIGHBOUR_SPAN = 2
const MIN_NEIGHBOUR = 100
const MAX_KM = 1000000
const MAX_PLATE = 100000000
const DAY_MS = 86400000
const EPOCH = Date.UTC(1990, 0, 1)

const RESOURCES = {
  vehicles: '053cea08-09bc-40ec-8f7a-156f0677aff3',
  history: '56063a99-8a3e-4ff4-912e-5966c0279bad',
  openRecalls: '36bf1404-0be4-49d2-82dc-2f1ead4a8b93',
  recallNotices: '2c33523f-87aa-44ec-a736-edbb0a82975e',
  models: '142afde2-6228-49f9-8a29-9b6c3a0cbe40',
  prices: '39f455bf-6db0-4926-859d-017f34eacbcb',
}

const SPEC_FIELDS = [
  'kinuy_mishari',
  'ramat_gimur',
  'merkav',
  'nefah_manoa',
  'koah_sus',
  'delek_nm',
  'technologiat_hanaa_nm',
  'automatic_ind',
  'CO2_WLTP',
  'kamut_CO2',
  'kvutzat_zihum',
]
const MIN_TRIM_SHARE = 0.02
const MAX_TRIMS = 10
const CO2_GRAMS_PER_LITRE = { 'בנזין': 2392, 'דיזל': 2640 }
const SPECS_CACHE = 'car-specs-cache.json'
const REQUEST_GAP_MS = 400

const BRANDS = {
  'טויוטה': ['טויוטה', 'Toyota'],
  'מזדה': ['מאזדה', 'Mazda'],
  'קיה': ['קיה', 'Kia'],
  'יונדאי': ['יונדאי', 'Hyundai'],
  'מיצובישי': ['מיצובישי', 'Mitsubishi'],
  'סקודה': ['סקודה', 'Skoda'],
  'בי ווי די': ['BYD', 'BYD'],
  "ג'אקו": ['ג׳אקו', 'Jaecoo'],
  "צ'רי": ['צ׳רי', 'Chery'],
  'סוזוקי': ['סוזוקי', 'Suzuki'],
  'סיאט': ['סיאט', 'Seat'],
  'הונדה': ['הונדה', 'Honda'],
  'ניסאן': ['ניסאן', 'Nissan'],
  'סובארו': ['סובארו', 'Subaru'],
}

const MODELS = {
  'טויוטה|COROLLA': ['קורולה', 'Corolla'],
  'טויוטה|COROLLA CROSS': ['קורולה קרוס', 'Corolla Cross'],
  'טויוטה|YARIS': ['יאריס', 'Yaris'],
  'טויוטה|YARIS CROSS': ['יאריס קרוס', 'Yaris Cross'],
  'מזדה|MAZDA 3': ['3', '3'],
  'מזדה|MAZDA 2': ['2', '2'],
  'קיה|PICANTO': ['פיקנטו', 'Picanto'],
  'קיה|SPORTAGE': ['ספורטז׳', 'Sportage'],
  'קיה|NIRO': ['נירו', 'Niro'],
  'יונדאי|KONA': ['קונה', 'Kona'],
  'יונדאי|IONIQ': ['איוניק', 'Ioniq'],
  'יונדאי|TUCSON': ['טוסון', 'Tucson'],
  'יונדאי|I10': ['i10', 'i10'],
  'יונדאי|I20': ['i20', 'i20'],
  'יונדאי|ELANTRA': ['אלנטרה', 'Elantra'],
  'מיצובישי|OUTLANDER': ['אאוטלנדר', 'Outlander'],
  'סקודה|OCTAVIA': ['אוקטביה', 'Octavia'],
  'בי ווי די|ATTO 3': ['אטו 3', 'Atto 3'],
  "ג'אקו|JAECOO 7": ['7', '7'],
  "ג'אקו|JAECOO 5": ['5', '5'],
  "צ'רי|TIGGO 8": ['טיגו 8', 'Tiggo 8'],
}

const COUNTRIES = [
  ['ד. קור', 'דרום קוריאה'],
  ['ד.קור', 'דרום קוריאה'],
  ['תאילנ', 'תאילנד'],
  ['גרמנ', 'גרמניה'],
  ['ארהב', 'ארה״ב'],
  ['סלובק', 'סלובקיה'],
  ['מקסי', 'מקסיקו'],
  ['הונג', 'הונגריה'],
  ['פורטוג', 'פורטוגל'],
  ['פולי', 'פולין'],
  ["צ'כיה", 'צ׳כיה'],
]

const ORIGINS = { '': 'private', 'החכר': 'leasing', 'השכרה': 'rental' }

const FUELS = { 'חשמל/בנזין': 'היברידי (חשמל ובנזין)', 'חשמל/דיזל': 'היברידי (חשמל ודיזל)' }

async function each(file, handle) {
  const lines = readline.createInterface({ input: fs.createReadStream(path.join(dataDir, file)), crlfDelay: Infinity })
  for await (const line of lines) if (line) handle(JSON.parse(line))
}

const text = (value) => String(value ?? '').trim().replace(/\s+/g, ' ')
const bump = (map, key, by = 1) => map.set(key, (map.get(key) || 0) + by)
const share = (part, whole) => (whole ? Math.round((part / whole) * 1000) / 10 : null)
const dayOf = (iso) => {
  const time = Date.parse(iso)
  return Number.isFinite(time) ? Math.round((time - EPOCH) / DAY_MS) : null
}
const quantile = (sorted, q) => (sorted.length ? sorted[Math.floor(q * (sorted.length - 1))] : null)
const median = (values) => quantile([...values].sort((a, b) => a - b), 0.5)
const topShares = (map, total, limit, rename = (key) => key) =>
  [...map]
    .filter(([key]) => key)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => ({ name: rename(key), share: share(count, total) }))

const countryOf = (manufacturer, brand) => {
  const rest = manufacturer.startsWith('מרוטי סוזוקי') ? 'הודו' : manufacturer.slice(brand.length).replace(/^[\s-]+/, '').trim()
  const known = COUNTRIES.find(([prefix]) => rest.startsWith(prefix))
  return known ? known[1] : rest
}

const todayDay = dayOf(DATA_DATE)
const yearCode = new Uint8Array(MAX_PLATE)
const groups = new Map()
const fleet = new Map()

const fleetYear = (year) => {
  if (!fleet.has(year)) {
    fleet.set(year, { activeCars: 0, expired: 0, km: [], historyCars: 0, origins: new Map(), recallCars: 0 })
  }
  return fleet.get(year)
}

await each('vehicles.jsonl', (record) => {
  const plate = Number(record.mispar_rechev)
  const year = Number(record.shnat_yitzur)
  if (!Number.isInteger(plate) || plate <= 0 || plate >= MAX_PLATE || !year) return
  const manufacturer = text(record.tozeret_nm)
  const brand = brandKeyOf(manufacturer)
  const family = familyKeyOf(text(record.kinuy_mishari))
  yearCode[plate] = year - 1900
  const expiredDays = record.tokef_dt ? todayDay - dayOf(record.tokef_dt) : null
  const expired = expiredDays !== null && expiredDays > 0
  const national = fleetYear(year)
  national.activeCars += 1
  if (expired) national.expired += 1
  if (!brand || !family) return
  const key = `${brand}|${family}|${year}`
  if (!groups.has(key)) {
    groups.set(key, {
      key,
      brand,
      family,
      year,
      activeCars: 0,
      expired: 0,
      expiredOverYear: 0,
      fuels: new Map(),
      colours: new Map(),
      ownership: new Map(),
      countries: new Map(),
      trims: new Map(),
    })
  }
  const group = groups.get(key)
  group.activeCars += 1
  bump(group.trims, `${Number(record.tozeret_cd)}|${Number(record.degem_cd)}`)
  if (expired) group.expired += 1
  if (expired && expiredDays > 365) group.expiredOverYear += 1
  bump(group.fuels, text(record.sug_delek_nm))
  bump(group.colours, text(record.tzeva_rechev))
  bump(group.ownership, text(record.baalut))
  bump(group.countries, countryOf(manufacturer, brand))
})

const ranked = [...groups.values()].sort((a, b) => b.activeCars - a.activeCars)
const candidates = ranked.filter((group) => group.activeCars >= MIN_ACTIVE).slice(0, CANDIDATES)
const relevant = new Map()
for (const candidate of candidates) {
  for (let year = candidate.year - NEIGHBOUR_SPAN; year <= candidate.year + NEIGHBOUR_SPAN; year += 1) {
    const group = groups.get(`${candidate.brand}|${candidate.family}|${year}`)
    if (group && !relevant.has(group.key)) relevant.set(group.key, group)
  }
}
const relevantList = [...relevant.values()]
relevantList.forEach((group, index) => {
  group.index = index
  group.km = []
  group.kmByOrigin = { private: [], leasing: [], rental: [] }
  group.annual = []
  group.historyCars = 0
  group.origins = new Map()
  group.recallPlates = new Set()
  group.recalls = new Map()
})

const PACK = 100000
const platePack = new Map()
await each('vehicles.jsonl', (record) => {
  const plate = Number(record.mispar_rechev)
  if (!Number.isInteger(plate) || plate <= 0 || plate >= MAX_PLATE) return
  const key = `${brandKeyOf(text(record.tozeret_nm))}|${familyKeyOf(text(record.kinuy_mishari))}|${Number(record.shnat_yitzur)}`
  const group = relevant.get(key)
  if (!group) return
  const testDay = record.mivchan_acharon_dt ? dayOf(record.mivchan_acharon_dt) : null
  platePack.set(plate, group.index * PACK + (testDay && testDay > 0 && testDay < PACK ? testDay : 0))
})

await each('history.jsonl', (record) => {
  const plate = Number(record.mispar_rechev)
  if (!Number.isInteger(plate) || plate <= 0 || plate >= MAX_PLATE) return
  const code = yearCode[plate]
  if (!code) return
  const km = Number(record.kilometer_test_aharon)
  const validKm = km > 0 && km < MAX_KM
  const origin = ORIGINS[text(record.mkoriut_nm)] || 'other'
  const national = fleetYear(code + 1900)
  national.historyCars += 1
  bump(national.origins, origin)
  if (validKm) national.km.push(km)
  const packed = platePack.get(plate)
  if (packed === undefined) return
  const group = relevantList[Math.floor(packed / PACK)]
  const testDay = packed % PACK
  group.historyCars += 1
  bump(group.origins, origin)
  if (!validKm) return
  group.km.push(km)
  if (group.kmByOrigin[origin]) group.kmByOrigin[origin].push(km)
  const firstDay = record.rishum_rishon_dt ? dayOf(record.rishum_rishon_dt) : null
  if (testDay && firstDay && testDay - firstDay >= 365) group.annual.push(km / ((testDay - firstDay) / 365.25))
})

const recallPlates = new Set()
await each('open_recalls.jsonl', (record) => {
  const plate = Number(record.MISPAR_RECHEV)
  if (!Number.isInteger(plate) || plate <= 0 || plate >= MAX_PLATE) return
  const code = yearCode[plate]
  if (!code) return
  if (!recallPlates.has(plate)) {
    recallPlates.add(plate)
    fleetYear(code + 1900).recallCars += 1
  }
  const packed = platePack.get(plate)
  if (packed === undefined) return
  const group = relevantList[Math.floor(packed / PACK)]
  group.recallPlates.add(plate)
  const id = Number(record.RECALL_ID)
  const entry = group.recalls.get(id) || { id, cars: 0, opened: text(record.TAARICH_PTICHA), category: text(record.SUG_TAKALA), type: text(record.SUG_RECALL) }
  entry.cars += 1
  if (text(record.TAARICH_PTICHA) && text(record.TAARICH_PTICHA) < entry.opened) entry.opened = text(record.TAARICH_PTICHA)
  group.recalls.set(id, entry)
})

const notices = new Map()
await each('recall_notices.jsonl', (record) => notices.set(Number(record.RECALL_ID), record))

const KM_STEPS = [10000, 15000, 20000, 25000, 30000, 40000, 50000]
const BIN_COUNT = 8

function mileageOf(group) {
  const sorted = [...group.km].sort((a, b) => a - b)
  if (!sorted.length) return null
  const p95 = quantile(sorted, 0.95)
  const width = KM_STEPS.find((step) => step * BIN_COUNT >= p95) || KM_STEPS[KM_STEPS.length - 1]
  const bins = Array.from({ length: BIN_COUNT }, (_, index) => ({
    from: index * width,
    to: index === BIN_COUNT - 1 ? null : (index + 1) * width,
    cars: 0,
  }))
  for (const km of sorted) bins[Math.min(BIN_COUNT - 1, Math.floor(km / width))].cars += 1
  const overShare = (limit) => share(sorted.filter((km) => km > limit).length, sorted.length)
  const byOrigin = Object.fromEntries(
    Object.entries(group.kmByOrigin)
      .filter(([, values]) => values.length >= 30)
      .map(([origin, values]) => [origin, { cars: values.length, median: median(values) }]),
  )
  return {
    cars: sorted.length,
    p10: quantile(sorted, 0.1),
    p25: quantile(sorted, 0.25),
    median: quantile(sorted, 0.5),
    p75: quantile(sorted, 0.75),
    p90: quantile(sorted, 0.9),
    max: sorted[sorted.length - 1],
    over100k: overShare(100000),
    over150k: overShare(150000),
    over200k: overShare(200000),
    under50k: share(sorted.filter((km) => km < 50000).length, sorted.length),
    annualMedian: group.annual.length >= 30 ? Math.round(median(group.annual)) : null,
    annualCars: group.annual.length,
    binWidth: width,
    bins,
    byOrigin,
  }
}

function originsOf(origins, total) {
  return {
    cars: total,
    private: share(origins.get('private') || 0, total),
    leasing: share(origins.get('leasing') || 0, total),
    rental: share(origins.get('rental') || 0, total),
    other: share(origins.get('other') || 0, total),
  }
}

function brief(group) {
  const km = [...group.km].sort((a, b) => a - b)
  return {
    year: group.year,
    activeCars: group.activeCars,
    medianKm: km.length >= group.activeCars * MIN_MILEAGE_SHARE ? quantile(km, 0.5) : null,
    mileageCars: km.length,
    leasing: share(group.origins.get('leasing') || 0, group.historyCars),
    rental: share(group.origins.get('rental') || 0, group.historyCars),
    recallShare: share(group.recallPlates.size, group.activeCars),
    expiredShare: share(group.expired, group.activeCars),
  }
}

function fleetOf(year) {
  const national = fleet.get(year)
  const km = national.km.sort((a, b) => a - b)
  return {
    year,
    activeCars: national.activeCars,
    medianKm: quantile(km, 0.5),
    p25Km: quantile(km, 0.25),
    p75Km: quantile(km, 0.75),
    mileageCars: km.length,
    origins: originsOf(national.origins, national.historyCars),
    expiredShare: share(national.expired, national.activeCars),
    recallShare: share(national.recallCars, national.activeCars),
  }
}

const allActive = [...fleet.values()].reduce((sum, item) => sum + item.activeCars, 0)
const allExpired = [...fleet.values()].reduce((sum, item) => sum + item.expired, 0)
const allRecall = [...fleet.values()].reduce((sum, item) => sum + item.recallCars, 0)

const eligible = []
const skipped = []
for (const candidate of candidates) {
  if (eligible.length === PAGE_COUNT) break
  const covered = candidate.km.length / candidate.activeCars
  if (covered < MIN_MILEAGE_SHARE) {
    skipped.push({ key: candidate.key, activeCars: candidate.activeCars, mileageCars: candidate.km.length })
    continue
  }
  eligible.push(candidate)
}

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

for (const group of eligible) {
  const brand = BRANDS[group.brand]
  const model = MODELS[`${group.brand}|${group.family}`]
  if (!brand || !model) throw new Error(`missing Hebrew or English name for ${group.brand}|${group.family}`)
  group.slug = slugify(`${brand[1]} ${model[1]} ${group.year}`)
}
const slugByKey = new Map(eligible.map((group) => [group.key, group.slug]))

const cachePath = path.join(dataDir, SPECS_CACHE)
const specCache = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, 'utf8')) : {}

async function datastore(resource, filters, fields) {
  const cacheKey = `${resource}|${JSON.stringify(filters)}|${fields ? fields.join(",") : "*"}`
  if (specCache[cacheKey]) return specCache[cacheKey]
  const query = new URLSearchParams({ resource_id: resource, filters: JSON.stringify(filters), limit: '50' })
  if (fields) query.set('fields', fields.join(','))
  for (let attempt = 1; ; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, REQUEST_GAP_MS))
    const response = await fetch(`https://data.gov.il/api/3/action/datastore_search?${query}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
    if (response.ok) {
      const records = (await response.json()).result.records
      specCache[cacheKey] = records
      fs.writeFileSync(cachePath, JSON.stringify(specCache))
      return records
    }
    if (attempt === 6) throw new Error(`data.gov.il ${response.status} for ${cacheKey}`)
    await new Promise((resolve) => setTimeout(resolve, attempt * 15000))
  }
}

const litresPer100 = (co2, fuel) => {
  const grams = CO2_GRAMS_PER_LITRE[fuel]
  return grams && co2 > 0 ? Math.round(((co2 * 100) / grams) * 10) / 10 : null
}

async function specsOf(group) {
  const trims = [...group.trims]
    .filter(([, cars]) => cars / group.activeCars >= MIN_TRIM_SHARE)
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_TRIMS)
  const rows = []
  for (const [code, cars] of trims) {
    const [manufacturer, model] = code.split('|').map(Number)
    const filters = { tozeret_cd: manufacturer, degem_cd: model, shnat_yitzur: group.year }
    const [spec] = await datastore(RESOURCES.models, filters, SPEC_FIELDS)
    const prices = (await datastore(RESOURCES.prices, filters)).map((row) => Number(row.mehir)).filter((price) => price > 0)
    if (!spec) continue
    const fuel = text(spec.delek_nm)
    const drive = text(spec.technologiat_hanaa_nm)
    const plugIn = /פלאג|נטען/.test(drive)
    const electric = fuel === 'חשמל'
    const wltp = Number(spec.CO2_WLTP) || null
    const nedc = Number(spec.kamut_CO2) || null
    const co2 = wltp || nedc
    const litres = plugIn || electric || !co2 ? null : litresPer100(co2, fuel)
    rows.push({
      name: text(spec.kinuy_mishari),
      finish: text(spec.ramat_gimur),
      body: text(spec.merkav),
      engineCc: Number(spec.nefah_manoa) || null,
      hp: Number(spec.koah_sus) || null,
      fuel,
      drive,
      automatic: Number(spec.automatic_ind) === 1,
      co2,
      co2Standard: wltp ? 'WLTP' : nedc ? 'NEDC' : null,
      litresPer100: litres,
      kmPerLitre: litres ? Math.round((100 / litres) * 10) / 10 : null,
      electric,
      plugIn,
      pollutionGroup: Number(spec.kvutzat_zihum) || null,
      priceMin: prices.length ? Math.min(...prices) : null,
      priceMax: prices.length ? Math.max(...prices) : null,
      cars,
      share: share(cars, group.activeCars),
    })
  }
  const covered = rows.reduce((sum, row) => sum + row.cars, 0)
  const weighted = rows.filter((row) => row.kmPerLitre).flatMap((row) => Array(row.cars).fill(row.kmPerLitre))
  const kmPerLitre = rows.map((row) => row.kmPerLitre).filter(Boolean)
  const prices = rows.flatMap((row) => [row.priceMin, row.priceMax]).filter(Boolean)
  const pollution = rows.map((row) => row.pollutionGroup).filter(Boolean)
  return {
    trims: rows,
    coveredShare: share(covered, group.activeCars),
    kmPerLitre: kmPerLitre.length
      ? { min: Math.min(...kmPerLitre), max: Math.max(...kmPerLitre), typical: median(weighted) }
      : null,
    priceNew: prices.length ? { min: Math.min(...prices), max: Math.max(...prices) } : null,
    nedcOnly: rows.some((row) => row.kmPerLitre) && rows.filter((row) => row.kmPerLitre).every((row) => row.co2Standard === 'NEDC'),
    pollution: pollution.length ? { min: Math.min(...pollution), max: Math.max(...pollution) } : null,
    electricShare: share(rows.filter((row) => row.electric).reduce((sum, row) => sum + row.cars, 0), group.activeCars),
    plugInShare: share(rows.filter((row) => row.plugIn).reduce((sum, row) => sum + row.cars, 0), group.activeCars),
  }
}

const specsByKey = new Map()
for (const group of eligible) specsByKey.set(group.key, await specsOf(group))
fs.writeFileSync(cachePath, JSON.stringify(specCache))

const familyTotals = new Map()
for (const group of groups.values()) bump(familyTotals, `${group.brand}|${group.family}`, group.activeCars)

const pages = eligible.map((group, index) => {
  const [makeHe, makeEn] = BRANDS[group.brand]
  const [modelHe, modelEn] = MODELS[`${group.brand}|${group.family}`]
  const familyYears = [...groups.values()]
    .filter((item) => item.brand === group.brand && item.family === group.family)
    .sort((a, b) => b.activeCars - a.activeCars)
  const neighbours = []
  for (let year = group.year - NEIGHBOUR_SPAN; year <= group.year + NEIGHBOUR_SPAN; year += 1) {
    if (year === group.year) continue
    const item = relevant.get(`${group.brand}|${group.family}|${year}`)
    if (!item || item.activeCars < MIN_NEIGHBOUR) continue
    neighbours.push({ ...brief(item), slug: slugByKey.get(item.key) || null })
  }
  const recalls = [...group.recalls.values()]
    .sort((a, b) => b.cars - a.cars)
    .map((entry) => {
      const notice = notices.get(entry.id) || {}
      return {
        id: entry.id,
        cars: entry.cars,
        opened: entry.opened,
        type: text(notice.SUG_RECALL) || entry.type,
        category: text(notice.SUG_TAKALA) || entry.category,
        description: text(notice.TEUR_TAKALA),
        fix: text(notice.OFEN_TIKUN),
        importer: text(notice.YEVUAN_TEUR),
        phone: text(notice.TELEPHONE),
        website: text(notice.WEBSITE).toLowerCase(),
        buildFrom: text(notice.BUILD_BEGIN_A),
        buildTo: text(notice.BUILD_END_A),
      }
    })
  return {
    slug: group.slug,
    key: group.key,
    rank: index + 1,
    makeHe,
    makeEn,
    modelHe,
    modelEn,
    family: group.family,
    year: group.year,
    activeCars: group.activeCars,
    familyActiveCars: familyTotals.get(`${group.brand}|${group.family}`),
    familyYearRank: familyYears.findIndex((item) => item.key === group.key) + 1,
    familyYears: familyYears.length,
    mileage: mileageOf(group),
    origins: originsOf(group.origins, group.historyCars),
    recalls: {
      cars: group.recallPlates.size,
      share: share(group.recallPlates.size, group.activeCars),
      items: recalls,
    },
    licence: {
      expired: group.expired,
      expiredShare: share(group.expired, group.activeCars),
      expiredOverYear: group.expiredOverYear,
    },
    fuels: topShares(group.fuels, group.activeCars, 3, (key) => FUELS[key] || key),
    colours: topShares(group.colours, group.activeCars, 3),
    ownership: topShares(group.ownership, group.activeCars, 5),
    countries: topShares(group.countries, group.activeCars, 3),
    fleet: fleetOf(group.year),
    neighbours,
    specs: specsByKey.get(group.key),
  }
})

const output = {
  dataDate: DATA_DATE,
  resources: RESOURCES,
  fleet: {
    activeCars: allActive,
    expiredShare: share(allExpired, allActive),
    recallShare: share(allRecall, allActive),
  },
  pages,
}

fs.writeFileSync(OUT_FILE, `${JSON.stringify(output, null, 2)}\n`)
fs.writeFileSync(SLUGS_FILE, `${JSON.stringify(Object.fromEntries(slugByKey), null, 2)}\n`)
console.log(`pages: ${pages.length}`)
for (const page of pages) {
  const { specs } = page
  console.log(
    `${page.rank}. ${page.slug} active=${page.activeCars} medianKm=${page.mileage?.median} leasing=${page.origins.leasing}% recalls=${page.recalls.cars} specsCovered=${specs.coveredShare}% kmPerLitre=${JSON.stringify(specs.kmPerLitre)} priceNew=${JSON.stringify(specs.priceNew)} electric=${specs.electricShare}% plugIn=${specs.plugInShare}%`,
  )
}
if (skipped.length) console.log('skipped (too few mileage readings):', JSON.stringify(skipped))
