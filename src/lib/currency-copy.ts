import type { ToolFaqEntry } from '@/app/(he)/(site)/components/tools/ToolLayout'
import {
  LEV_PER_EURO,
  currencyPages,
  formatIsoDate,
  formatMoney,
  headlineAmount,
  pluralName,
  roundedShekels,
  shortName,
  type CurrencyPage,
  type RatesHistory,
  type RatesSnapshot,
} from './currency-pages'

export const ECB_LEV_URL = 'https://www.ecb.europa.eu/euro/changeover/bulgaria/html/index.en.html'
export const MIN_HISTORY_POINTS = 6
export const NO_HISTORY: RatesHistory = { monthAgo: null, yearAgo: null, months: [] }

export const amountText = (page: CurrencyPage, amount: number) =>
  `${amount.toLocaleString('he-IL')} ${amount === 1 ? shortName(page) : pluralName(page)}`

export const amountLabel = (page: CurrencyPage) => {
  const amount = headlineAmount(page)
  return amount === 1 ? shortName(page) : `${amount} ${shortName(page)}`
}

export const historyAmount = (page: CurrencyPage) => (headlineAmount(page) === 1 ? 100 : headlineAmount(page))

export const metaTitleOf = (page: CurrencyPage, shekels: number | null) =>
  shekels === null
    ? `כמה זה ${page.name} בשקלים היום? מחשבון המרה`
    : `${amountLabel(page)} לשקל: כ-${roundedShekels(headlineAmount(page) * shekels)} ₪ היום`

export const descriptionOf = (page: CurrencyPage, shekels: number | null) => {
  if (shekels === null) {
    return `כמה שווה ${page.name} (${page.code}) בשקלים: מחשבון המרה בשני הכיוונים וטבלה לסכומים נפוצים, לפי שער אמצע שוק.`
  }
  const amount = headlineAmount(page)
  const what = amount === 1 ? page.name : `${amount.toLocaleString('he-IL')} ${page.name}`
  return `היום מקבלים כ-${roundedShekels(amount * shekels)} ₪ תמורת ${what}, ושקל אחד קונה ${formatMoney(1 / shekels)} ${page.code}. זה שער אמצע שוק: בבנק או בצ׳יינג׳ תקבלו קצת פחות. מחשבון בשני הכיוונים וטבלת סכומים.`
}

export const shekelsAt = (snapshot: RatesSnapshot | null, page: CurrencyPage, amount: number) => {
  const perShekel = snapshot?.rates[page.code]
  return perShekel ? amount / perShekel : null
}

export const percentText = (now: number, past: number) =>
  new Intl.NumberFormat('he-IL', { maximumFractionDigits: 1 }).format(Math.abs((now / past - 1) * 100))

export const isFlat = (now: number, past: number) => Math.abs(now / past - 1) < 0.005

export const moreOrLess = (now: number, past: number) => (now > past ? 'יותר' : 'פחות')

export const monthLabel = (iso: string) =>
  new Intl.DateTimeFormat('he-IL', { timeZone: 'UTC', month: 'long', year: 'numeric' }).format(new Date(`${iso}T00:00:00Z`))

export const monthSentence = (page: CurrencyPage, shekels: number, history: RatesHistory) => {
  const amount = historyAmount(page)
  const now = amount * shekels
  const past = shekelsAt(history.monthAgo, page, amount)
  if (past === null) return ''
  if (isFlat(now, past)) return ` לפני חודש ${amountText(page, amount)} עלו כמעט אותו דבר, ${roundedShekels(past)} ₪.`
  return ` לפני חודש ${amountText(page, amount)} עלו ${roundedShekels(past)} ₪, והיום ${roundedShekels(now)} ₪: ${percentText(now, past)}% ${moreOrLess(now, past)}.`
}

export const levNote = `מאז 1 בפברואר 2026 משלמים בבולגריה רק ביורו, והלב כבר לא הילך חוקי. השער שלו קבוע: ${LEV_PER_EURO} לב ליורו. `

export const ledeOf = (page: CurrencyPage, shekels: number | null, history: RatesHistory) => {
  const lev = page.code === 'BGN' ? levNote : ''
  if (shekels === null) return `${lev}מקלידים סכום ב${page.name} ומקבלים את ההמרה לשקלים, בשני הכיוונים.`
  const amount = headlineAmount(page)
  return `${lev}תמורת ${amountText(page, amount)} מקבלים היום כ-${roundedShekels(amount * shekels)} ₪, ותמורת 100 ₪ כ-${roundedShekels(100 / shekels)} ${pluralName(page)}.${monthSentence(page, shekels, history)}`
}

export type HistoryRow = { date: string; shekels: number }

export const historyRows = (page: CurrencyPage, history: RatesHistory) =>
  history.months
    .map((snapshot) => ({ date: snapshot.date, shekels: shekelsAt(snapshot, page, historyAmount(page)) }))
    .filter((row): row is HistoryRow => row.shekels !== null)

export const extremes = (rows: HistoryRow[]) =>
  rows.reduce(
    (found, row) => ({
      high: row.shekels > found.high.shekels ? row : found.high,
      low: row.shekels < found.low.shekels ? row : found.low,
    }),
    { high: rows[0], low: rows[0] },
  )

export const yearAnswer = (page: CurrencyPage, shekels: number | null, history: RatesHistory) => {
  const amount = historyAmount(page)
  const past = shekelsAt(history.yearAgo, page, amount)
  if (shekels === null || past === null || !history.yearAgo) return null
  const now = amount * shekels
  const when = formatIsoDate(history.yearAgo.date)
  if (isFlat(now, past)) return `ב-${when} ${amountText(page, amount)} עלו ${roundedShekels(past)} ₪, כמעט כמו היום.`
  return `ב-${when} ${amountText(page, amount)} עלו ${roundedShekels(past)} ₪, והיום ${roundedShekels(now)} ₪: ${roundedShekels(Math.abs(now - past))} ₪ ${moreOrLess(now, past)}, ${percentText(now, past)}%.`
}

export const representativeAnswer = (page: CurrencyPage) => {
  if (page.code === 'BGN') {
    return 'לא. בנק ישראל מפרסם שער יציג ל-14 מטבעות, והלב לא ביניהם. מאז שבולגריה עברה ליורו, עסקאות שם נעשות ביורו, ולו יש שער יציג.'
  }
  if (page.representative) {
    const units = page.representativeUnits ? `, והוא מחושב ל-${page.representativeUnits} ${shortName(page)}` : ''
    return `כן. בנק ישראל מפרסם שער יציג ל${page.name} בכל יום עסקים${units}. זה השער שמשמש לחשבוניות ולדיווח למס. השער בעמוד הוא שער אמצע שוק ממקור אחר, ולכן הוא יכול להיות שונה ממנו בכמה אגורות.`
  }
  return `לא. בנק ישראל מפרסם שער יציג ל-14 מטבעות בלבד, ו${page.name} לא ביניהם. אם צריך שער רשמי לחשבונית או לדוח, כדאי לשאול את רואה החשבון באיזה שער להשתמש.`
}

export const levExchangeEntry: ToolFaqEntry = {
  id: 'currency-bgn-exchange',
  question: 'מה עושים עם שטרות לב שנשארו?',
  answer:
    'הבנק הלאומי של בולגריה מחליף שטרות ומטבעות לב ליורו בלי הגבלת זמן ובלי עמלה, במשרד הראשי בסופיה ובסניפים של חברת השירות שלו. בבנקים מסחריים ובחלק מסניפי הדואר בבולגריה ההחלפה בחינם עד 30 ביוני 2026, ואחר כך מותר להם לגבות עמלה.',
}

export const relatedPages = (page: CurrencyPage) =>
  currencyPages.filter(
    (other) => other.slug !== page.slug && (other.region === page.region || other.slug === 'usd' || other.slug === 'eur'),
  )
