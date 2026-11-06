import data from '@/data/car-models.json'

export type MileageBin = { from: number; to: number | null; cars: number }

export type CarRecall = {
  id: number
  cars: number
  opened: string
  type: string
  category: string
  description: string
  fix: string
  importer: string
  phone: string
  website: string
  buildFrom: string
  buildTo: string
}

export type CarNeighbour = {
  year: number
  activeCars: number
  medianKm: number | null
  mileageCars: number
  leasing: number | null
  rental: number | null
  recallShare: number | null
  expiredShare: number | null
  slug: string | null
}

export type CarTrim = {
  name: string
  finish: string
  body: string
  engineCc: number | null
  hp: number | null
  fuel: string
  drive: string
  automatic: boolean
  co2: number | null
  co2Standard: 'WLTP' | 'NEDC' | null
  litresPer100: number | null
  kmPerLitre: number | null
  electric: boolean
  plugIn: boolean
  pollutionGroup: number | null
  priceMin: number | null
  priceMax: number | null
  cars: number
  share: number | null
}

export type CarSpecs = {
  trims: CarTrim[]
  coveredShare: number | null
  kmPerLitre: { min: number; max: number; typical: number } | null
  priceNew: { min: number; max: number } | null
  nedcOnly: boolean
  pollution: { min: number; max: number } | null
  electricShare: number | null
  plugInShare: number | null
}

type Origins = { cars: number; private: number | null; leasing: number | null; rental: number | null; other: number | null }
type Share = { name: string; share: number | null }

export type CarModelPage = {
  slug: string
  key: string
  rank: number
  makeHe: string
  makeEn: string
  modelHe: string
  modelEn: string
  family: string
  year: number
  activeCars: number
  familyActiveCars: number
  familyYearRank: number
  familyYears: number
  mileage: {
    cars: number
    p10: number
    p25: number
    median: number
    p75: number
    p90: number
    max: number
    over100k: number
    over150k: number
    over200k: number
    under50k: number
    annualMedian: number | null
    annualCars: number
    binWidth: number
    bins: MileageBin[]
    byOrigin: Partial<Record<'private' | 'leasing' | 'rental', { cars: number; median: number }>>
  }
  origins: Origins
  recalls: { cars: number; share: number; items: CarRecall[] }
  licence: { expired: number; expiredShare: number; expiredOverYear: number }
  fuels: Share[]
  colours: Share[]
  ownership: Share[]
  countries: Share[]
  fleet: {
    year: number
    activeCars: number
    medianKm: number
    p25Km: number
    p75Km: number
    mileageCars: number
    origins: Origins
    expiredShare: number
    recallShare: number
  }
  neighbours: CarNeighbour[]
  specs: CarSpecs
}

type CarModelsData = {
  dataDate: string
  resources: Record<'vehicles' | 'history' | 'openRecalls' | 'recallNotices' | 'models' | 'prices', string>
  fleet: { activeCars: number; expiredShare: number; recallShare: number }
  pages: CarModelPage[]
}

const carData = data as CarModelsData

export const CARS_HUB_PATH = '/cars'
export const CARS_HUB_TITLE = 'נתוני רכבים לפי דגם ושנה'
export const CAR_DATA_DATE = carData.dataDate
export const CAR_RESOURCES = carData.resources
export const NATIONAL_FLEET = carData.fleet
export const carPages = carData.pages

export const CAR_DATASETS = [
  {
    name: 'מספרי רישוי של רכבים פרטיים ומסחריים',
    url: 'https://data.gov.il/he/datasets/ministry_of_transport/private-and-commercial-vehicles',
    resource: carData.resources.vehicles,
  },
  {
    name: 'היסטוריית רכב: קילומטראז׳ בטסט האחרון ומקוריות',
    url: 'https://data.gov.il/he/datasets/ministry_of_transport/shinui_mivne',
    resource: carData.resources.history,
  },
  {
    name: 'רכבים עם ריקול פתוח',
    url: 'https://data.gov.il/he/datasets/ministry_of_transport/hagbalat_recall',
    resource: carData.resources.openRecalls,
  },
  {
    name: 'הודעות ריקול של היבואנים',
    url: 'https://data.gov.il/he/datasets/ministry_of_transport/recall',
    resource: carData.resources.recallNotices,
  },
  {
    name: 'תוצרים ודגמים של כלי רכב WLTP: פליטת CO2, כוח סוס וקבוצת זיהום',
    url: 'https://data.gov.il/he/datasets/ministry_of_transport/degem-rechev-wltp',
    resource: carData.resources.models,
  },
  {
    name: 'יבואנים ומחירוני רכב חדש',
    url: 'https://data.gov.il/he/datasets/ministry_of_transport/mehir_yevuan',
    resource: carData.resources.prices,
  },
]

export const carPagePath = (slug: string) => `${CARS_HUB_PATH}/${slug}`
export const carPageBySlug = (slug: string) => carPages.find((page) => page.slug === slug)

const isolateLatin = (word: string) => (/^[A-Za-z]/.test(word) ? `${word}‏` : word)

export const carName = (page: Pick<CarModelPage, 'makeHe' | 'modelHe' | 'year'>) =>
  `${page.makeHe} ${isolateLatin(page.modelHe)} ${page.year}`

export const carShortName = (page: Pick<CarModelPage, 'makeHe' | 'modelHe' | 'year'>) =>
  /^\d+$/.test(page.modelHe) ? carName(page) : `${isolateLatin(page.modelHe)} ${page.year}`

export const modelName = (page: Pick<CarModelPage, 'makeHe' | 'modelHe'>) =>
  /^\d+$/.test(page.modelHe) ? `${page.makeHe} ${page.modelHe}` : isolateLatin(page.modelHe)

export const isoToHebrewDate = (iso: string) => iso.split('-').reverse().join('.')

export const formatNumber = (value: number) => Math.round(value).toLocaleString('he-IL')
export const formatKm = (value: number) => `${formatNumber(value)} ק״מ`
export const formatThousands = (value: number) => `${Math.round(value / 1000).toLocaleString('he-IL')} אלף`
export const formatShare = (value: number | null) => {
  if (value === null) return ''
  return `${value >= 10 ? Math.round(value) : value.toLocaleString('he-IL', { maximumFractionDigits: 1 })}%`
}

export const attach = (prefix: string, word: string) => (/^[A-Za-z0-9]/.test(word) ? `${prefix}-${word}` : `${prefix}${word}`)
const ratio = (part: number, whole: number) => (whole ? part / whole : 0)
const percentGap = (value: number, base: number) => Math.round(Math.abs(ratio(value - base, base)) * 100)

export function kmVersusFleet(page: CarModelPage) {
  const { median } = page.mileage
  const base = page.fleet.medianKm
  const gap = percentGap(median, base)
  const baseText = `החציון של כל הרכבים הפעילים משנת ${page.year} (${formatKm(base)})`
  if (gap < 5) return `כמעט זהה ל${baseText}`
  return `${median > base ? 'גבוה' : 'נמוך'} ב-${gap}% מ${baseText}`
}

export function leasingSentence(page: CarModelPage) {
  const leasing = page.origins.leasing ?? 0
  const fleetLeasing = page.fleet.origins.leasing ?? 0
  const times = ratio(leasing, fleetLeasing)
  const versus =
    times >= 1.5
      ? `, פי ${times.toLocaleString('he-IL', { maximumFractionDigits: 1 })} מהשיעור בכל רכבי ${page.year} (${formatShare(fleetLeasing)})`
      : times <= 0.67
        ? `, פחות מהשיעור בכל רכבי ${page.year} (${formatShare(fleetLeasing)})`
        : `, בדומה לשיעור בכל רכבי ${page.year} (${formatShare(fleetLeasing)})`
  const short = carShortName(page)
  if (leasing >= 50) return `רוב ${attach('ה', short)}, ${formatShare(leasing)}, התחילו את דרכן בחברת ליסינג${versus}.`
  if (leasing >= 25) return `${formatShare(leasing)} ${attach('מה', short)} התחילו את דרכן בחברת ליסינג${versus}.`
  return `${times <= 0.67 ? 'רק ' : ''}${formatShare(leasing)} ${attach('מה', short)} הגיעו מליסינג${versus}, ו-${formatShare(page.origins.private)} נרשמו מההתחלה לבעלים פרטיים.`
}

export function recallSentence(page: CarModelPage) {
  const { cars, share, items } = page.recalls
  if (!cars) {
    return `ריקולים פתוחים: אין. בדקנו את כל ${formatNumber(page.activeCars)} הרכבים הפעילים, ואף אחד מהם לא רשום עם ריקול, לעומת ${formatShare(page.fleet.recallShare)} מכל רכבי ${page.year}.`
  }
  const [first] = items
  return `${formatNumber(cars)} רכבים (${formatShare(share)}) רשומים עם ריקול פתוח${
    items.length === 1 && first ? `, כולם באותה קריאה: ${first.description.replace(/\.$/, '')}` : ` ב-${items.length} קריאות שונות`
  }.`
}

type Standout = { weight: number; text: string }

export function standoutsOf(page: CarModelPage): string[] {
  const short = carShortName(page)
  const items: Standout[] = []
  const { fleet } = page
  const ownershipShare = (name: string) => page.ownership.find((item) => item.name === name)?.share ?? 0

  if (page.recalls.cars >= 20 && page.recalls.share >= fleet.recallShare * 2) {
    items.push({
      weight: ratio(page.recalls.share, fleet.recallShare || 0.1) / 3,
      text: `שיעור הריקולים הפתוחים, ${formatShare(page.recalls.share)}, גבוה מהשיעור בכל רכבי ${page.year} (${formatShare(fleet.recallShare)}).`,
    })
  }

  const rental = page.origins.rental ?? 0
  const fleetRental = fleet.origins.rental ?? 0
  if (rental >= 5 && rental >= fleetRental * 1.8) {
    items.push({
      weight: ratio(rental, fleetRental || 1) / 3,
      text: `${formatShare(rental)} התחילו את דרכן בחברת השכרה, פי ${ratio(rental, fleetRental).toLocaleString('he-IL', { maximumFractionDigits: 1 })} מהשיעור בכל רכבי ${page.year}. רכב השכרה עובר נהגים רבים בזמן קצר, ולכן שווה לשאול על כך את המוכר.`,
    })
  }

  const expiredGap = ratio(page.licence.expiredShare - fleet.expiredShare, fleet.expiredShare)
  if (Math.abs(expiredGap) >= 0.3) {
    items.push({
      weight: Math.abs(expiredGap) * 0.8,
      text: `${formatShare(page.licence.expiredShare)} מחזיקות רישיון שפג תוקפו, ${expiredGap > 0 ? 'יותר' : 'פחות'} מ-${formatShare(fleet.expiredShare)} בכל רכבי ${page.year}.`,
    })
  }

  const [topFuel] = page.fuels
  if (topFuel && topFuel.name !== 'בנזין' && (topFuel.share ?? 0) >= 50) {
    items.push({ weight: 0.4, text: `${formatShare(topFuel.share)} רשומות עם הנעה מסוג ${topFuel.name}.` })
  }

  const [mainCountry, secondCountry] = page.countries
  if (mainCountry && secondCountry && (secondCountry.share ?? 0) >= 10) {
    items.push({
      weight: 0.3,
      text: `${formatShare(mainCountry.share)} יוצרו ב${mainCountry.name} ו-${formatShare(secondCountry.share)} ב${secondCountry.name}. מדינת הייצור מופיעה בשדה היצרן ברישיון הרכב.`,
    })
  }

  if (page.familyYearRank === 1) {
    items.push({
      weight: 0.32,
      text: `זו שנת הייצור הנפוצה ביותר של ${modelName(page)} על הכביש: ${formatNumber(page.activeCars)} מתוך ${formatNumber(page.familyActiveCars)} רכבים פעילים מכל השנים.`,
    })
  }

  const stillLeased = ownershipShare('ליסינג')
  if (stillLeased >= 10) {
    items.push({
      weight: stillLeased / 50,
      text: `${formatShare(stillLeased)} עדיין רשומות היום בבעלות חברת ליסינג, כך שחלק גדול מהשנתון עוד לא הגיע לשוק היד השנייה.`,
    })
  }

  const company = ownershipShare('חברה')
  if (company >= 8) {
    items.push({ weight: company / 40, text: `${formatShare(company)} רשומות היום על שם חברה, לא על שם אדם פרטי.` })
  }

  const dealer = ownershipShare('סוחר')
  if (dealer >= 2.5) {
    items.push({ weight: dealer / 10, text: `${formatShare(dealer)} רשומות כרגע על שם סוחר רכב.` })
  }

  const [topColour] = page.colours
  if (topColour && (topColour.share ?? 0) >= 45) {
    items.push({ weight: 0.15, text: `${formatShare(topColour.share)} ${attach('מה', short)} בצבע ${topColour.name}.` })
  }

  return items.sort((a, b) => b.weight - a.weight).slice(0, 3).map((item) => item.text)
}

export function summaryOf(page: CarModelPage) {
  const { mileage } = page
  const name = carName(page)
  return [
    `${attach('ל', name)} טיפוסית נרשם בטסט האחרון קילומטראז׳ של ${formatKm(mileage.p25)} עד ${formatKm(mileage.p75)}. החציון הוא ${formatKm(mileage.median)}, ${kmVersusFleet(page)}.`,
    `חישבנו את זה מהטסט האחרון של ${formatNumber(mileage.cars)} רכבים.`,
    leasingSentence(page),
    page.recalls.cars ? recallSentence(page) : 'ריקולים פתוחים: אין.',
  ].join(' ')
}

export function originSentence(page: CarModelPage) {
  const { origins } = page
  return `המקור רשום אצל ${formatNumber(origins.cars)} מתוך ${formatNumber(page.activeCars)} הרכבים: ${formatShare(origins.leasing)} עברו קודם בליסינג, ${formatShare(origins.rental)} בחברת השכרה ו-${formatShare(origins.private)} היו פרטיות מהיום הראשון${
    origins.other ? `. השאר, ${formatShare(origins.other)}, הגיעו ממקור אחר כמו בית ספר לנהיגה או יבוא אישי` : ''
  }.`
}

export function mileageSentences(page: CarModelPage) {
  const { mileage } = page
  const short = carShortName(page)
  const sentences = [
    `חצי ${attach('מה', short)} שנבדקו נמצאים בין ${formatKm(mileage.p25)} ל-${formatKm(mileage.p75)}. עשירית עברו פחות מ-${formatKm(mileage.p10)}, ועשירית יותר מ-${formatKm(mileage.p90)}.`,
  ]
  if (mileage.over200k >= 5) {
    sentences.push(`${formatShare(mileage.over200k)} כבר עברו את ה-200 אלף ק״מ.`)
  } else if (mileage.over150k >= 5) {
    sentences.push(`${formatShare(mileage.over150k)} עברו את ה-150 אלף ק״מ, ורק ${formatShare(mileage.over200k)} עברו 200 אלף.`)
  } else if (mileage.over100k >= 5) {
    sentences.push(`${formatShare(mileage.over100k)} עברו את ה-100 אלף ק״מ.`)
  }
  if (mileage.under50k >= 10) {
    sentences.push(`מנגד, ${formatShare(mileage.under50k)} עדיין מתחת ל-50 אלף ק״מ.`)
  }
  if (mileage.annualMedian) {
    sentences.push(
      `בחלוקה לשנים מאז הרישום הראשון, ${short} חציונית עושה כ-${formatKm(Math.round(mileage.annualMedian / 100) * 100)} בשנה.`,
    )
  }
  return sentences.join(' ')
}

export function originMeaning(page: CarModelPage) {
  const short = carShortName(page)
  const fromLeasing = page.mileage.byOrigin.leasing
  const fromPrivate = page.mileage.byOrigin.private
  const leasing = page.origins.leasing ?? 0
  const sentences: string[] = []
  if (fromLeasing && fromPrivate) {
    const gap = fromLeasing.median - fromPrivate.median
    sentences.push(
      Math.abs(gap) < 5000
        ? `הקילומטראז׳ כמעט לא תלוי במקור: ${formatKm(fromLeasing.median)} בחציון ${attach('ל', short)} מליסינג ו-${formatKm(fromPrivate.median)} לרכב שהיה פרטי מההתחלה.`
        : `${short} מליסינג עברה בחציון ${formatKm(fromLeasing.median)}, ורכב שהיה פרטי מההתחלה ${formatKm(fromPrivate.median)}.${
            Math.abs(gap) >= fromPrivate.median * 0.3 ? ' זה פער גדול.' : ''
          } ההפרש, ${formatThousands(Math.abs(gap))} ק״מ, הוא מה שכדאי לצפות לו כשמודעה מציינת ״יד ראשונה מליסינג״.`,
    )
  }
  if (leasing >= 50) {
    sentences.push(
      `כשרוב השנתון עבר בליסינג, רוב המודעות של ${short} יד שנייה יהיו של רכבים כאלה. שאלו על היסטוריית הטיפולים ובדקו שהקילומטראז׳ במודעה לא נמוך מזה שנרשם בטסט.`,
    )
  } else if (leasing >= 25) {
    sentences.push(
      `בשנתון מעורב כזה כדאי לברר במפורש אם הרכב שמוצע לכם היה בליסינג, כי זה משנה גם את הקילומטראז׳ הצפוי וגם את מספר הבעלויות.`,
    )
  } else {
    sentences.push(
      `רוב ${attach('ה', short)} נקנו ישר לשימוש פרטי, ולכן רכב מליסינג בשנתון הזה הוא יוצא דופן. אם המודעה אומרת ״פרטי מההתחלה״, אפשר לאמת את זה בבדיקה לפי מספר הרישוי.`,
    )
  }
  return sentences.join(' ')
}

export function licenceSentence(page: CarModelPage) {
  const { licence, fleet } = page
  const base = `${formatNumber(licence.expired)} ${attach('מה', carShortName(page))} (${formatShare(licence.expiredShare)}) מחזיקות רישיון שתוקפו פג ב-${isoToHebrewDate(CAR_DATA_DATE)}, לעומת ${formatShare(fleet.expiredShare)} מכל רכבי ${page.year} ו-${formatShare(NATIONAL_FLEET.expiredShare)} מכל הרכבים הפעילים בישראל.`
  const longExpired = licence.expiredOverYear
    ? ` אצל ${formatNumber(licence.expiredOverYear)} מהן הרישיון פג לפני יותר משנה.`
    : ' אף אחת מהן לא מחזיקה רישיון שפג לפני יותר משנה.'
  return `${base}${longExpired}`
}

export function neighboursSentence(page: CarModelPage) {
  const short = carShortName(page)
  const sentences: string[] = []
  const older = page.neighbours.find((item) => item.year === page.year - 1 && item.medianKm)
  const newer = page.neighbours.find((item) => item.year === page.year + 1 && item.medianKm)
  if (older?.medianKm) {
    const gap = older.medianKm - page.mileage.median
    sentences.push(
      Math.abs(gap) < 5000
        ? `${modelName(page)} ${older.year} עברה בחציון ${formatKm(older.medianKm)}. כמעט אין הבדל.`
        : `${modelName(page)} ${older.year} עברה בחציון ${formatKm(older.medianKm)}, ${formatThousands(Math.abs(gap))} ק״מ ${gap >= 0 ? 'יותר' : 'פחות'} ${attach('מ', short)}.`,
    )
  }
  if (newer?.medianKm) {
    const gap = page.mileage.median - newer.medianKm
    sentences.push(
      `שנה אחרי, ${modelName(page)} ${newer.year} עומדת על ${formatKm(newer.medianKm)}${gap > 0 ? `, ${formatThousands(gap)} ק״מ פחות` : ''}.`,
    )
  }
  const leasingJump = page.neighbours
    .filter((item) => item.leasing !== null && Math.abs(item.year - page.year) === 1)
    .map((item) => ({ item, gap: (item.leasing ?? 0) - (page.origins.leasing ?? 0) }))
    .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))[0]
  if (leasingJump && Math.abs(leasingJump.gap) >= 8) {
    sentences.push(
      `שיעור הליסינג משתנה בין השנים: ${formatShare(leasingJump.item.leasing)} ב-${leasingJump.item.year} לעומת ${formatShare(page.origins.leasing)} ב-${page.year}.`,
    )
  }
  const early = page.neighbours.filter((item) => item.year < page.year && !item.medianKm)
  if (early.length) {
    sentences.push(
      `ל-${early.map((item) => item.year).join(' ול-')} אין קילומטראז׳ במאגר: היסטוריית הרכב של משרד התחבורה מתחילה ברכבים שעלו לכביש ב-2017.`,
    )
  }
  const fresh = page.neighbours.filter((item) => item.year > page.year && !item.medianKm)
  if (fresh.length) {
    sentences.push(
      `ל-${fresh.map((item) => item.year).join(' ול-')} אין עדיין חציון: רוב הרכבים משנים אלה לא עברו טסט שבו נרשם קילומטראז׳.`,
    )
  }
  return sentences.join(' ')
}

const formatDecimal = (value: number) => value.toLocaleString('he-IL', { maximumFractionDigits: 1 })
export const formatShekels = (value: number) => `${formatNumber(value)} ₪`

export const isElectric = (page: CarModelPage) => (page.specs.electricShare ?? 0) >= 90

export function fuelSentence(page: CarModelPage) {
  const short = carShortName(page)
  const { specs } = page
  const hp = [...new Set(specs.trims.map((trim) => trim.hp).filter((value): value is number => Boolean(value)))].sort((a, b) => a - b)
  const power = hp.length
    ? ` כוח המנוע: ${hp.length > 1 ? `${hp[0]} עד ${hp[hp.length - 1]}` : hp[0]} כוח סוס.`
    : ''
  if (isElectric(page)) {
    return `${short} היא רכב חשמלי, ולכן אין לה צריכת דלק ואין פליטת CO2 בנתוני הדגם.${power}`
  }
  const fuel = specs.kmPerLitre
  if (!fuel) {
    return `לגרסאות של ${short} אין במאגר משרד התחבורה נתון פליטה שממנו אפשר לחשב צריכת דלק.${power}`
  }
  const litres = Math.round((100 / fuel.typical) * 10) / 10
  const range =
    fuel.max - fuel.min >= 0.5 ? ` בין הגרסאות הטווח הוא ${formatDecimal(fuel.min)} עד ${formatDecimal(fuel.max)} ק״מ לליטר.` : ''
  const standard = specs.nedcOnly
    ? ' הערכים לשנתון הזה רשומים לפי תקן NEDC הישן, שנותן תוצאה אופטימית יותר מנסיעה אמיתית, ולכן בכביש הצריכה תהיה גבוהה יותר.'
    : ' זה נתון של בדיקת מעבדה בתקן WLTP. בנסיעה בעיר, בחום ועם מזגן הצריכה בדרך כלל גבוהה יותר.'
  return `לפי פליטת ה-CO2 שרשומה לכל גרסה, ${short} בגרסה הנפוצה צורכת כ-${formatDecimal(litres)} ליטר ל-100 ק״מ, כלומר כ-${formatDecimal(fuel.typical)} ק״מ לליטר.${range}${standard}${power}`
}

export function priceSentence(page: CarModelPage) {
  const short = carShortName(page)
  const price = page.specs.priceNew
  if (!price) return `למחירון היבואנים של משרד התחבורה אין מחיר ${attach('ל', short)}.`
  const amount =
    price.max - price.min >= 1000
      ? `בין ${formatShekels(price.min)} ל-${formatShekels(price.max)}, לפי רמת הגימור`
      : formatShekels(price.min)
  return `לפי מחירון היבואנים במאגר משרד התחבורה, ${short} חדשה עלתה ${amount}. זה מחיר המחירון של רכב חדש, לא השווי של רכב יד שנייה היום. את השווי קובעים מחירון רכב משומש, הקילומטראז׳, מספר הבעלויות והמצב של הרכב.`
}

export function carTitle(page: CarModelPage) {
  return `${carName(page)}: קילומטראז׳, ליסינג וריקולים`
}

export function carHeading(page: CarModelPage) {
  return `${carName(page)}: קילומטראז׳, ליסינג וריקולים לפי נתוני משרד התחבורה`
}

export function carDescription(page: CarModelPage) {
  const recalls = page.recalls.cars ? `${formatShare(page.recalls.share)} עם ריקול פתוח` : 'בלי ריקולים פתוחים'
  return `${carName(page)} יד שנייה: חציון ${formatKm(page.mileage.median)} בטסט, ${formatShare(page.origins.leasing)} מליסינג, ${recalls}. נתוני משרד התחבורה על ${formatNumber(page.activeCars)} רכבים.`
}

export function carFaq(page: CarModelPage) {
  const short = carShortName(page)
  const name = carName(page)
  const { mileage } = page
  const leasing = page.origins.leasing ?? 0
  const fromLeasing = mileage.byOrigin.leasing
  const fromPrivate = mileage.byOrigin.private
  return [
    {
      id: `car-${page.slug}-km`,
      question: `כמה קילומטר סביר ${attach('ל', name)}?`,
      answer: `טווח סביר הוא ${formatKm(mileage.p25)} עד ${formatKm(mileage.p75)}: זה מה שנרשם בטסט האחרון אצל חצי מ-${formatNumber(mileage.cars)} הרכבים שנבדקו${
        mileage.annualMedian ? `, בערך ${formatKm(Math.round(mileage.annualMedian / 100) * 100)} לשנה` : ''
      }. מתחת ל-${formatKm(mileage.p10)} או מעל ${formatKm(mileage.p90)} כבר חריג לשנתון הזה, עשירית מכל צד. מספר כזה הוא סיבה לבקש הסבר ולבדוק את הרכב לפי מספר הרישוי.`,
    },
    {
      id: `car-${page.slug}-leasing`,
      question: `כדאי לקנות ${short} יד שנייה אחרי ליסינג?`,
      answer: `${formatShare(leasing)} ${attach('מה', short)} התחילו בליסינג. ${
        fromLeasing && fromPrivate
          ? `הם עברו בחציון ${formatKm(fromLeasing.median)}, לעומת ${formatKm(fromPrivate.median)} לרכבים שהיו פרטיים מההתחלה. `
          : ''
      }רכב מליסינג הוא לא בהכרח בחירה גרועה, אבל המחיר צריך לשקף את הקילומטראז׳. בקשו את ספר הטיפולים ובדיקה במכון לפני הקנייה.`,
    },
    {
      id: `car-${page.slug}-recall`,
      question: `יש ${attach('ל', name)} ריקולים פתוחים?`,
      answer: page.recalls.cars
        ? `${formatNumber(page.recalls.cars)} מתוך ${formatNumber(page.activeCars)} הרכבים הפעילים רשומים עם ריקול פתוח${
            page.recalls.items[0] ? `, בעיקר: ${page.recalls.items[0].description.replace(/\.$/, '')}` : ''
          }. ריקול נרשם לפי רכב, ולכן בדקו את מספר הרישוי הספציפי. התיקון אצל היבואן ללא תשלום.`
        : `נכון ל-${isoToHebrewDate(CAR_DATA_DATE)}, אף ${short} פעילה לא רשומה עם ריקול פתוח במאגר משרד התחבורה. ריקול חדש יכול להיפתח בכל רגע, ולכן לפני קנייה כדאי לבדוק את מספר הרישוי הספציפי.`,
    },
    {
      id: `car-${page.slug}-fuel`,
      question: isElectric(page) ? `${name} היא חשמלית?` : `מה צריכת הדלק של ${name}?`,
      answer: fuelSentence(page),
    },
    {
      id: `car-${page.slug}-price`,
      question: `כמה עלתה ${name} חדשה?`,
      answer: priceSentence(page),
    },
    {
      id: `car-${page.slug}-count`,
      question: `כמה ${short} יש על הכביש בישראל?`,
      answer: `${formatNumber(page.activeCars)} רכבים פעילים עם שנת ייצור ${page.year}, מתוך ${formatNumber(page.familyActiveCars)} ${modelName(page)} מכל השנים. ${
        page.familyYearRank === 1
          ? 'זו השנה הנפוצה ביותר של הדגם.'
          : `זו השנה ה-${page.familyYearRank} בשכיחותה מתוך ${page.familyYears} שנות ייצור.`
      }`,
    },
  ]
}
