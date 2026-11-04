import { eventsBetween, hebrewDateText, shortDate, weekdayText, type EventKind } from './hebrew-calendar'
import { MONTH_NAMES, dayFromParts, isoFromDay } from './work-days'

export const HOLIDAYS_HUB_PATH = '/tools/holidays'
export const holidayPath = (slug: string) => `${HOLIDAYS_HUB_PATH}/${slug}`

const YEARS_AHEAD = 5
const MAX_SPAN_DAYS = 30
const ISRAEL_TIME_ZONE = 'Asia/Jerusalem'

export type HolidayDay = 'rest' | 'work' | 'memorial' | 'fast'

export type Holiday = {
  slug: string
  name: string
  short: string
  first: string
  last?: string
  hebrewDate: string
  day: HolidayDay
  about: string
}

export type Occurrence = {
  start: number
  end: number
  eve: number
}

export const holidays: Holiday[] = [
  {
    slug: 'rosh-hashanah',
    name: 'ראש השנה',
    short: 'ראש השנה',
    first: 'ראש השנה',
    last: 'ראש השנה, יום שני',
    hebrewDate: 'א׳ וב׳ בתשרי',
    day: 'rest',
    about:
      'ראש השנה פותח את השנה העברית החדשה ונמשך יומיים, בא׳ ובב׳ בתשרי. נוהגים לאכול תפוח בדבש ולשמוע תקיעת שופר בבית הכנסת.',
  },
  {
    slug: 'yom-kippur',
    name: 'יום כיפור',
    short: 'יום כיפור',
    first: 'יום כיפור',
    hebrewDate: 'י׳ בתשרי',
    day: 'rest',
    about:
      'יום הכיפורים הוא יום צום ותפילה, והקדוש בימות השנה. הצום נמשך כ-25 שעות, מלפני השקיעה בערב החג עד צאת הכוכבים, ובישראל התנועה בכבישים כמעט נעצרת.',
  },
  {
    slug: 'sukkot',
    name: 'סוכות',
    short: 'סוכות',
    first: 'סוכות',
    last: 'שמיני עצרת ושמחת תורה',
    hebrewDate: 'ט״ו עד כ״ב בתשרי',
    day: 'rest',
    about:
      'חג הסוכות מתחיל בט״ו בתשרי ונמשך שבוע, ובישראל הוא מסתיים בשמיני עצרת ושמחת תורה. יושבים בסוכה ומברכים על ארבעת המינים. היום הראשון והאחרון הם ימי שבתון, וביניהם חול המועד.',
  },
  {
    slug: 'simchat-torah',
    name: 'שמחת תורה',
    short: 'שמחת תורה',
    first: 'שמיני עצרת ושמחת תורה',
    hebrewDate: 'כ״ב בתשרי',
    day: 'rest',
    about:
      'בישראל שמחת תורה חל באותו יום עם שמיני עצרת, מיד אחרי שבעת ימי סוכות. מסיימים בו את קריאת התורה ומתחילים אותה מחדש, עם הקפות בבית הכנסת.',
  },
  {
    slug: 'hanukkah',
    name: 'חנוכה',
    short: 'חנוכה',
    first: 'חנוכה, נר א׳',
    last: 'חנוכה, נר ח׳',
    hebrewDate: 'כ״ה בכסלו, שמונה ימים',
    day: 'work',
    about:
      'חנוכה מתחיל בכ״ה בכסלו ונמשך שמונה ימים. את הנר הראשון מדליקים בערב שלפני היום הראשון, ובכל ערב מוסיפים נר אחד עד שמונה. בתי הספר בחופשה ברוב ימי החג, אבל לעובדים אלה ימי עבודה רגילים.',
  },
  {
    slug: 'tu-bishvat',
    name: 'ט״ו בשבט',
    short: 'ט״ו בשבט',
    first: 'ט״ו בשבט',
    hebrewDate: 'ט״ו בשבט',
    day: 'work',
    about: 'ט״ו בשבט הוא ראש השנה לאילנות. נוהגים לאכול פירות יבשים ופירות משבעת המינים ולנטוע עצים.',
  },
  {
    slug: 'purim',
    name: 'פורים',
    short: 'פורים',
    first: 'פורים',
    hebrewDate: 'י״ד באדר, ובשנה מעוברת באדר ב׳',
    day: 'work',
    about:
      'בפורים קוראים את מגילת אסתר, שולחים משלוחי מנות ומתחפשים. בירושלים חוגגים יום אחר כך, בשושן פורים. יום לפני פורים חל תענית אסתר.',
  },
  {
    slug: 'pesach',
    name: 'פסח',
    short: 'פסח',
    first: 'פסח',
    last: 'שביעי של פסח',
    hebrewDate: 'ט״ו עד כ״א בניסן',
    day: 'rest',
    about:
      'פסח מתחיל בט״ו בניסן ונמשך בישראל שבעה ימים. ליל הסדר נערך בערב שלפני היום הראשון, ובכל ימי החג לא אוכלים חמץ. היום הראשון ושביעי של פסח הם ימי שבתון, וביניהם חול המועד.',
  },
  {
    slug: 'yom-hashoah',
    name: 'יום הזיכרון לשואה ולגבורה',
    short: 'יום השואה',
    first: 'יום הזיכרון לשואה ולגבורה',
    hebrewDate: 'כ״ז בניסן',
    day: 'memorial',
    about:
      'יום הזיכרון לשואה ולגבורה חל בכ״ז בניסן. כשהתאריך נופל ביום שישי הוא מוקדם ליום חמישי, וכשהוא נופל ביום ראשון הוא נדחה ליום שני. בעשר בבוקר נשמעת צפירה של שתי דקות.',
  },
  {
    slug: 'yom-hazikaron',
    name: 'יום הזיכרון לחללי מערכות ישראל',
    short: 'יום הזיכרון',
    first: 'יום הזיכרון, ערב יום העצמאות',
    hebrewDate: 'ד׳ באייר, יום לפני יום העצמאות',
    day: 'memorial',
    about:
      'יום הזיכרון לחללי מערכות ישראל ולנפגעי פעולות האיבה חל יום לפני יום העצמאות. נשמעות שתי צפירות: דקה אחת בשמונה בערב ושתי דקות באחת עשרה בבוקר.',
  },
  {
    slug: 'yom-haatzmaut',
    name: 'יום העצמאות',
    short: 'יום העצמאות',
    first: 'יום העצמאות',
    hebrewDate: 'ה׳ באייר, לפעמים מוקדם או נדחה',
    day: 'rest',
    about:
      'יום העצמאות מציין את הכרזת המדינה בה׳ באייר תש״ח. כשהתאריך קרוב לשבת, היום מוקדם או נדחה כדי שיום הזיכרון שלפניו לא יחול בשבת או במוצאי שבת.',
  },
  {
    slug: 'lag-baomer',
    name: 'ל״ג בעומר',
    short: 'ל״ג בעומר',
    first: 'ל״ג בעומר',
    hebrewDate: 'י״ח באייר',
    day: 'work',
    about: 'ל״ג בעומר הוא היום ה-33 של ספירת העומר. בערב שלפניו מדליקים מדורות, ורבים עולים למירון.',
  },
  {
    slug: 'yom-yerushalayim',
    name: 'יום ירושלים',
    short: 'יום ירושלים',
    first: 'יום ירושלים',
    hebrewDate: 'כ״ח באייר',
    day: 'work',
    about: 'יום ירושלים מציין את איחוד העיר במלחמת ששת הימים ב-1967.',
  },
  {
    slug: 'shavuot',
    name: 'שבועות',
    short: 'שבועות',
    first: 'שבועות',
    hebrewDate: 'ו׳ בסיוון',
    day: 'rest',
    about:
      'שבועות חל שבעה שבועות אחרי פסח ומציין את מתן תורה ואת חג הביכורים. נוהגים לאכול מאכלי חלב וללמוד תורה בליל החג.',
  },
  {
    slug: 'tisha-bav',
    name: 'תשעה באב',
    short: 'תשעה באב',
    first: 'תשעה באב',
    hebrewDate: 'ט׳ באב, ובשבת נדחה ליום ראשון',
    day: 'fast',
    about:
      'תשעה באב הוא יום צום ואבל על חורבן בית המקדש. הצום מתחיל בשקיעה בערב שלפני ונמשך עד צאת הכוכבים, ובחוק אסור לפתוח בו מקומות בילוי.',
  },
  {
    slug: 'tu-bav',
    name: 'ט״ו באב',
    short: 'ט״ו באב',
    first: 'ט״ו באב',
    hebrewDate: 'ט״ו באב',
    day: 'work',
    about: 'ט״ו באב, שמכונה חג האהבה, חל שישה ימים אחרי תשעה באב.',
  },
]

export const holidayBySlug = (slug: string) => holidays.find((holiday) => holiday.slug === slug)

export const dayTypeText: Record<HolidayDay, string> = {
  rest: 'יום שבתון רשמי בישראל. משרדי הממשלה ורוב העסקים סגורים.',
  work: 'לא יום שבתון. זהו יום עבודה רגיל.',
  memorial: 'יום עבודה רגיל, עם צפירה וטקסי זיכרון.',
  fast: 'יום עבודה רגיל ויום צום.',
}

export const isRestDay = (holiday: Holiday) => holiday.day === 'rest'

export const dayTypeOf = (holiday: Holiday) => {
  if (holiday.slug === 'rosh-hashanah') return 'שני הימים הם ימי שבתון רשמיים בישראל. משרדי הממשלה ורוב העסקים סגורים.'
  if (holiday.day === 'rest' && holiday.last) {
    return 'היום הראשון והיום האחרון הם ימי שבתון רשמיים בישראל, וביניהם ימי חול המועד שבהם רוב העסקים פתוחים.'
  }
  return dayTypeText[holiday.day]
}

export function todayInIsrael(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: ISRAEL_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
  const [year, month, date] = parts.split('-').map(Number)
  return dayFromParts(year, month, date)
}

const rangeEvents = (from: number) => {
  const start = new Date(isoFromDay(from))
  const to = dayFromParts(start.getUTCFullYear() + YEARS_AHEAD + 1, 12, 31)
  return eventsBetween(from - MAX_SPAN_DAYS, to) ?? []
}

let cache: { from: number; events: { day: number; name: string; kind: EventKind }[] } | null = null

const eventsFrom = (from: number) => {
  if (!cache || cache.from !== from) cache = { from, events: rangeEvents(from) }
  return cache.events
}

export function occurrencesOf(holiday: Holiday, today: number, count = YEARS_AHEAD + 1): Occurrence[] {
  const events = eventsFrom(today)
  const occurrences: Occurrence[] = []
  for (const event of events) {
    if (event.name !== holiday.first) continue
    const lastName = holiday.last
    const end = lastName
      ? (events.find((item) => item.name === lastName && item.day >= event.day && item.day - event.day <= MAX_SPAN_DAYS)
          ?.day ?? event.day)
      : event.day
    if (end < today) continue
    occurrences.push({ start: event.day, end, eve: event.day - 1 })
    if (occurrences.length >= count) break
  }
  return occurrences
}

export const gregorianYearOf = (day: number) => Number(isoFromDay(day).slice(0, 4))

export const longDate = (day: number) => {
  const [year, month, date] = isoFromDay(day).split('-').map(Number)
  return `${date} ב${MONTH_NAMES[month - 1]} ${year}`
}

export const dayLine = (day: number) => `${weekdayText(day)}, ${longDate(day)}`

export { hebrewDateText, shortDate, weekdayText }

export const daysUntilText = (days: number) => {
  if (days === 0) return 'היום'
  if (days === 1) return 'מחר'
  return `בעוד ${days.toLocaleString('he-IL')} ימים`
}

export function answerOf(holiday: Holiday, occurrence: Occurrence, today: number) {
  const year = gregorianYearOf(occurrence.start)
  const multi = occurrence.end !== occurrence.start
  const range = multi
    ? `מ${dayLine(occurrence.start)} עד ${dayLine(occurrence.end)}`
    : `ב${dayLine(occurrence.start)}`
  const ongoing = occurrence.start <= today && today <= occurrence.end
  const lead = ongoing ? `${holiday.short} ${year} חל עכשיו` : `${holiday.short} ${year} חל`
  const start =
    holiday.slug === 'hanukkah'
      ? `את הנר הראשון מדליקים בערב ${dayLine(occurrence.eve)}`
      : `כמו כל מועד בלוח העברי, הוא מתחיל עם השקיעה בערב שלפני, ${dayLine(occurrence.eve)}`
  return `${lead} ${range}, ${hebrewDateText(occurrence.start)}. ${start}.`
}
