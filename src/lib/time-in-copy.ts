import { ISRAEL_TIME_ZONE, differenceFromIsrael, meetingOverlap, offsetMinutes } from './time-difference'
import type { TimeInPage } from './time-in-cities'

export const ISRAEL_TIME_PATH = '/tools/time-in/israel'

const DAY_MS = 86_400_000
const ISRAEL_SUMMER_OFFSET = 180
const LONG_PERIOD_DAYS = 14

const longDate = new Intl.DateTimeFormat('he-IL', { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' })
const israelToday = new Intl.DateTimeFormat('he-IL', {
  timeZone: ISRAEL_TIME_ZONE,
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const weekday = new Intl.DateTimeFormat('he-IL', { timeZone: 'UTC', weekday: 'long' })
const dayMonth = new Intl.DateTimeFormat('he-IL', { timeZone: 'UTC', day: 'numeric', month: 'long' })

export const formatPeriodDate = (date: Date) => longDate.format(date)
export const formatIsraelToday = (date: Date) => israelToday.format(date)

const pad = (value: number) => String(value).padStart(2, '0')

export function hoursAmount(minutes: number) {
  const absolute = Math.abs(minutes)
  const hours = Math.floor(absolute / 60)
  const rest = absolute % 60
  if (absolute === 60) return 'שעה'
  if (absolute === 90) return 'שעה וחצי'
  if (absolute === 120) return 'שעתיים'
  if (rest === 0) return `${hours} שעות`
  if (rest === 30) return `${hours} וחצי שעות`
  return `${hours}:${pad(rest)} שעות`
}

const byAmount = (minutes: number) => {
  const amount = hoursAmount(minutes)
  return amount === 'שעה' || amount === 'שעתיים' || amount === 'שעה וחצי' ? `ב${amount}` : `ב-${amount}`
}

export function direction(minutes: number) {
  if (minutes === 0) return 'מראה אותה שעה כמו בישראל'
  return minutes > 0 ? `מקדים את ישראל ${byAmount(minutes)}` : `מאחר אחרי ישראל ${byAmount(minutes)}`
}

export function differenceLabel(minutes: number) {
  if (minutes === 0) return 'אותה שעה'
  return minutes > 0 ? `מקדים ${byAmount(minutes)}` : `מאחר ${byAmount(minutes)}`
}

export function gapShort(minutes: number) {
  if (minutes === 0) return 'אותה שעה כמו בישראל'
  return `${hoursAmount(minutes)} ${minutes > 0 ? 'לפני' : 'אחרי'} ישראל`
}

export function clockAt(minutes: number, israelHour = 12) {
  const total = (((israelHour * 60 + minutes) % 1440) + 1440) % 1440
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`
}

export function utcLabel(offset: number) {
  const sign = offset < 0 ? '−' : '+'
  const absolute = Math.abs(offset)
  const rest = absolute % 60
  return `UTC${sign}${Math.floor(absolute / 60)}${rest ? `:${pad(rest)}` : ''}`
}

export type Period = { from: Date; to: Date; minutes: number; israelSummer: boolean }

const noonOf = (date: Date) => Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12)

export function periodsAhead(zone: string, from: Date, until: Date): Period[] {
  const periods: Period[] = []
  for (let time = noonOf(from); time <= until.getTime(); time += DAY_MS) {
    const at = new Date(time)
    const minutes = differenceFromIsrael(zone, at)
    const israelSummer = offsetMinutes(ISRAEL_TIME_ZONE, at) === ISRAEL_SUMMER_OFFSET
    const last = periods[periods.length - 1]
    if (last && last.minutes === minutes && last.israelSummer === israelSummer) last.to = at
    else periods.push({ from: at, to: at, minutes, israelSummer })
  }
  return periods
}

type Run = { from: Date; to: Date; minutes: number }

const runsByDifference = (periods: Period[]): Run[] =>
  periods.reduce<Run[]>((runs, period) => {
    const last = runs[runs.length - 1]
    if (last && last.minutes === period.minutes) last.to = period.to
    else runs.push({ from: period.from, to: period.to, minutes: period.minutes })
    return runs
  }, [])

const runDays = (run: Run) => Math.round((run.to.getTime() - run.from.getTime()) / DAY_MS) + 1

export type Deviation = { from: Date; to: Date; minutes: number; long: boolean; cause: string }

function shifts(zone: string, at: Date) {
  const before = new Date(at.getTime() - DAY_MS)
  return {
    israel: offsetMinutes(ISRAEL_TIME_ZONE, at) - offsetMinutes(ISRAEL_TIME_ZONE, before),
    place: offsetMinutes(zone, at) - offsetMinutes(zone, before),
  }
}

const seasonName = (shift: number) => (shift > 0 ? 'קיץ' : 'חורף')

function longCause(zone: string, place: string, at: Date) {
  const { israel, place: placeShift } = shifts(zone, at)
  if (israel && placeShift) return `כי ${place} וישראל מזיזות את השעון בכיוונים הפוכים`
  if (israel) return `כי ישראל עוברת לשעון ${seasonName(israel)}`
  return `כי ${place} עוברת לשעון ${seasonName(placeShift)}`
}

function blipCause(zone: string, place: string, at: Date) {
  const { israel, place: placeShift } = shifts(zone, at)
  if (israel && !placeShift) return `כי ישראל עוברת לשעון ${seasonName(israel)} לפני ${place}`
  if (placeShift && !israel) return `כי ${place} עוברת לשעון ${seasonName(placeShift)} לפני ישראל`
  return longCause(zone, place, at)
}

export function nextDeviation(zone: string, place: string, periods: Period[]): Deviation | null {
  const runs = runsByDifference(periods)
  const next = runs[1]
  if (!next) return null
  const long = runDays(next) >= LONG_PERIOD_DAYS
  return {
    from: next.from,
    to: next.to,
    minutes: next.minutes,
    long,
    cause: long ? longCause(zone, place, next.from) : blipCause(zone, place, next.from),
  }
}

export function dateRange(from: Date, to: Date) {
  if (from.getTime() === to.getTime()) return `ב-${formatPeriodDate(from)}`
  const sameMonth = from.getUTCMonth() === to.getUTCMonth() && from.getUTCFullYear() === to.getUTCFullYear()
  return `מ-${sameMonth ? from.getUTCDate() : formatPeriodDate(from)} עד ${formatPeriodDate(to)}`
}

function shiftPhrase(minutes: number, current: number) {
  if (minutes === 0) return 'השעה שם תהיה זהה לשעה בישראל'
  const hours = hoursAmount(minutes)
  if (current === 0) return `השעון שם ${minutes > 0 ? 'יקדים את' : 'יאחר אחרי'} ישראל ${byAmount(minutes)}`
  if (Math.sign(current) !== Math.sign(minutes)) return `ההפרש יהיה ${hours}`
  const target = /^\d/.test(hours) ? `ל-${hours}` : `ל${hours}`
  return `ההפרש ${Math.abs(minutes) < Math.abs(current) ? 'יורד' : 'גדל'} ${target}`
}

export function deviationSentence(deviation: Deviation | null, current: number) {
  if (!deviation) return 'ההפרש לא משתנה במשך השנה.'
  if (deviation.long) {
    return `ב-${formatPeriodDate(deviation.from)} ${shiftPhrase(deviation.minutes, current)}, ${deviation.cause}.`
  }
  return `כך רוב השנה. החריגה הקרובה: ${dateRange(deviation.from, deviation.to)} ${shiftPhrase(deviation.minutes, current)}, ${deviation.cause}.`
}

function deviationShort(deviation: Deviation | null, current: number) {
  if (!deviation) return 'ההפרש קבוע כל השנה.'
  if (deviation.long) return `מ-${formatPeriodDate(deviation.from)} ${shiftPhrase(deviation.minutes, current)}.`
  return current === 0
    ? 'כך כמעט כל השנה, חוץ מכמה ימים במעברי השעון.'
    : 'ההפרש קבוע רוב השנה, חוץ מכמה ימים במעברי השעון.'
}

export type TimeInExtras = { flightMinutes?: number; flightDirect?: boolean; dialingDigits?: string }

export type TimeInCopy = {
  today: number
  title: string
  metaTitle: string
  description: string
  lede: string
  deviation: Deviation | null
  periods: Period[]
  nextYear: number
}

function factsLine(extras: TimeInExtras) {
  const facts = [
    ...(extras.flightMinutes
      ? [`טיסה ${extras.flightDirect ? 'ישירה' : 'עם עצירה'} מנתב״ג כ-${flightLength(extras.flightMinutes)}`]
      : []),
    ...(extras.dialingDigits ? [`קידומת ‎+${extras.dialingDigits}`] : []),
  ]
  return facts.length ? `${facts.join(', ')}.` : ''
}

function flightLength(minutes: number) {
  const hours = Math.round(minutes / 30) / 2
  if (hours < 1) return `${minutes} דקות`
  if (hours === 1) return 'שעה'
  if (hours === 1.5) return 'שעה וחצי'
  if (hours === 2) return 'שעתיים'
  return Number.isInteger(hours) ? `${hours} שעות` : `${Math.floor(hours)} וחצי שעות`
}

export function timeInCopy(page: TimeInPage, zone: string, now: Date, extras: TimeInExtras): TimeInCopy {
  const today = differenceFromIsrael(zone, now)
  const nextYear = Number(new Intl.DateTimeFormat('en-US', { timeZone: ISRAEL_TIME_ZONE, year: 'numeric' }).format(now)) + 1
  const periods = periodsAhead(zone, now, new Date(Date.UTC(nextYear, 11, 31, 12)))
  const deviation = nextDeviation(zone, page.place, periods)
  const nowLine =
    today === 0
      ? `שעון חי ${page.inPlace}: השעה שם זהה לשעה בישראל.`
      : `שעון חי ${page.inPlace} מול ישראל: כשאצלנו 12:00, שם ${clockAt(today)}.`
  return {
    today,
    nextYear,
    periods,
    deviation,
    title: `מה השעה ${page.inPlace} עכשיו: ${gapShort(today)}`,
    metaTitle: `מה השעה ${page.inPlace} עכשיו? ${gapShort(today)}`,
    description: [nowLine, deviationShort(deviation, today), factsLine(extras)].filter(Boolean).join(' '),
    lede: `${
      today === 0
        ? `היום, ${formatIsraelToday(now)}, השעה ${page.inPlace} זהה לשעה בישראל.`
        : `היום, ${formatIsraelToday(now)}, השעון ${page.inPlace} ${direction(today)}: כשאצלנו 12:00 בצהריים, שם ${clockAt(today)}.`
    } ${deviationSentence(deviation, today)}`,
  }
}

export function callAdvice(today: number, inPlace: string) {
  const overlap = meetingOverlap(today, { start: 9, end: 18 }, { start: 9, end: 18 })
  const hour = (value: number) => `${pad(Math.floor(value))}:${pad(Math.round((value % 1) * 60))}`
  if (overlap.totalHours === 9) return 'יום העבודה זהה בשני הצדדים, אז אפשר להתקשר בכל שעה שנוחה לכם.'
  if (overlap.totalHours >= 8) {
    return `כמעט כל יום העבודה משותף. אם בשני הצדדים עובדים מ-09:00 עד 18:00, ${overlap.totalHours} מתוך 9 שעות העבודה חופפות.`
  }
  if (overlap.totalHours > 0) {
    const range = overlap.ranges[0]
    return `אם בשני הצדדים עובדים מ-09:00 עד 18:00, החלון המשותף הוא ${hoursAmount(overlap.totalHours * 60)}, מ-${hour(range.israelStart)} עד ${hour(range.israelEnd)} בשעון ישראל. ${today < 0 ? 'אחרי השעה הזאת שם עוד עובדים, ואצלנו כבר ערב.' : 'אחרי השעה הזאת שם כבר סוגרים את היום.'}`
  }
  return `אין שעה שבה שני הצדדים במשרד. כשהשעה ${inPlace} 09:00, בישראל ${clockAt(-today, 9)}, ולכן שיחה כזאת נקבעת מוקדם בבוקר או מאוחר בערב אצל אחד הצדדים.`
}

export type IsraelTransition = { at: Date; fromOffset: number; toOffset: number; wallBefore: string; wallAfter: string }

const wallClock = (instant: number, offset: number) => {
  const date = new Date(instant + offset * 60_000)
  return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`
}

export function israelTransitions(from: Date, until: Date): IsraelTransition[] {
  const transitions: IsraelTransition[] = []
  let previous = offsetMinutes(ISRAEL_TIME_ZONE, from)
  for (let time = noonOf(from) + DAY_MS; time <= until.getTime(); time += DAY_MS) {
    const offset = offsetMinutes(ISRAEL_TIME_ZONE, new Date(time))
    if (offset === previous) continue
    let instant = time - DAY_MS
    while (offsetMinutes(ISRAEL_TIME_ZONE, new Date(instant)) === previous) instant += 15 * 60_000
    transitions.push({
      at: new Date(instant),
      fromOffset: previous,
      toOffset: offset,
      wallBefore: wallClock(instant, previous),
      wallAfter: wallClock(instant, offset),
    })
    previous = offset
  }
  return transitions
}

export const transitionDay = (transition: IsraelTransition) => {
  const local = new Date(transition.at.getTime() + transition.toOffset * 60_000)
  const date = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), 12))
  return {
    weekday: weekday.format(date),
    date: formatPeriodDate(date),
    dayMonth: dayMonth.format(date),
    day: local.getUTCDate(),
    year: local.getUTCFullYear(),
  }
}

export const isSummerOffset = (offset: number) => offset === ISRAEL_SUMMER_OFFSET

export function lastFridayOfMarch(year: number) {
  const date = new Date(Date.UTC(year, 2, 31, 12))
  while (date.getUTCDay() !== 5) date.setUTCDate(date.getUTCDate() - 1)
  return date.getUTCDate()
}

export type IsraelYearRow = { year: number; spring: string; autumn: string }

export function israelCopy(now: Date, placesCount: number) {
  const offset = offsetMinutes(ISRAEL_TIME_ZONE, now)
  const summer = isSummerOffset(offset)
  const season = summer ? 'קיץ' : 'חורף'
  const utc = utcLabel(offset)
  const year = Number(new Intl.DateTimeFormat('en-US', { timeZone: ISRAEL_TIME_ZONE, year: 'numeric' }).format(now))
  const transitions = israelTransitions(new Date(Date.UTC(year, 0, 1, 12)), new Date(Date.UTC(year + 2, 11, 31, 12)))
  const upcoming = transitions.filter((transition) => transition.at.getTime() > now.getTime())
  const nextSpring = upcoming.find((transition) => isSummerOffset(transition.toOffset))
  const nextAutumn = upcoming.find((transition) => !isSummerOffset(transition.toOffset))
  const next = upcoming[0]
  const rows: IsraelYearRow[] = [year, year + 1, year + 2].map((rowYear) => {
    const inYear = transitions.filter((transition) => transitionDay(transition).year === rowYear)
    const spring = inYear.find((transition) => isSummerOffset(transition.toOffset))
    const autumn = inYear.find((transition) => !isSummerOffset(transition.toOffset))
    const cell = (transition?: IsraelTransition) =>
      transition ? `${transitionDay(transition).weekday}, ${transitionDay(transition).dayMonth}` : ''
    return { year: rowYear, spring: cell(spring), autumn: cell(autumn) }
  })
  const exception = transitions
    .filter((transition) => isSummerOffset(transition.toOffset))
    .map((transition) => ({
      at: transition.at.getTime(),
      day: transitionDay(transition),
      lastFriday: lastFridayOfMarch(transitionDay(transition).year),
    }))
    .find((item) => item.day.day !== item.lastFriday && item.at > now.getTime())

  const nextLine = (transition: IsraelTransition) => {
    const day = transitionDay(transition)
    return isSummerOffset(transition.toOffset)
      ? `שעון הקיץ יתחיל ב${day.weekday}, ${day.date}: ב-${transition.wallBefore} בלילה השעון יקפוץ ל-${transition.wallAfter}, והלילה הזה יהיה קצר בשעה.`
      : `שעון החורף יתחיל ב${day.weekday}, ${day.date}: ב-${transition.wallBefore} בלילה השעון יחזור ל-${transition.wallAfter}, ובאותו לילה ישנים שעה יותר.`
  }

  const others = Math.max(placesCount - 2, 0)
  return {
    year,
    summer,
    season,
    utc,
    rows,
    nextSpring,
    nextAutumn,
    title: 'מה השעה בישראל עכשיו',
    metaTitle: `מה השעה בישראל עכשיו? שעון ${season}, ${utc}`,
    description: `שעון חי של ישראל. עכשיו שעון ${season}, ${utc}${
      next ? `, עד ${transitionDay(next).date}, ואז השעון ${summer ? 'חוזר שעה אחורה' : 'זז שעה קדימה'}` : ''
    }. ולידו: מה השעה עכשיו בניו יורק, בלונדון ובעוד ${others} מקומות.`,
    lede: `היום, ${formatIsraelToday(now)}, ישראל בשעון ${season}: ${utc}. ${next ? nextLine(next) : ''}`.trim(),
    nowAnswer: `עכשיו שעון ${season}, ${utc}. ${next ? nextLine(next) : ''}`.trim(),
    springAnswer: nextSpring
      ? `ב${transitionDay(nextSpring).weekday}, ${transitionDay(nextSpring).date}. ב-${nextSpring.wallBefore} בלילה השעון קופץ ישר ל-${nextSpring.wallAfter}, כך שבאותו לילה ישנים שעה פחות. טלפונים ומחשבים מתעדכנים לבד, את השעון בתנור וברכב מזיזים ביד.`
      : '',
    autumnAnswer: nextAutumn
      ? `ב${transitionDay(nextAutumn).weekday}, ${transitionDay(nextAutumn).date}. ב-${nextAutumn.wallBefore} בלילה השעון חוזר ל-${nextAutumn.wallAfter}. מאותו יום מחשיך שעה מוקדם יותר, וההפרש מול יפן, תאילנד והודו, שלא מזיזות את השעון, גדל בשעה.`
      : '',
    ruleText: `לפי חוק קביעת הזמן, שעון הקיץ מתחיל ביום שישי שלפני יום ראשון האחרון של מרץ, ונגמר ביום ראשון האחרון של אוקטובר.${
      exception
        ? ` ברוב השנים זה יוצא יום שישי האחרון של מרץ, אבל לא ב-${exception.day.year}: יום שישי האחרון של מרץ ${exception.day.year} נופל ב-${exception.lastFriday} בחודש, ושעון הקיץ יתחיל שבוע קודם, ב-${exception.day.dayMonth}.`
        : ''
    }`,
  }
}
