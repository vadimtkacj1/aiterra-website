import Link from 'next/link'
import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import { enHebrewDate } from '../_components/hebrew-date-en'
import { enLongDate } from '../_components/en-format'
import { HEBREW_YEAR, calendarYear, holidayTable, type CalendarEvent, type EventKind } from '@/lib/hebrew-calendar'
import { isLeapYear, toHebrew } from '@/lib/hebrew-date'
import styles from '../../../../(he)/(site)/tools/maternity-leave-calculator/page.module.css'

const SLUG = 'hebrew-calendar-2027'
const META_TITLE = 'Jewish Holidays 2026–2027 (5787): Dates in Israel'
const DESCRIPTION =
  'Every Jewish and Israeli holiday of the Hebrew year 5787, September 2026 to September 2027, with the Gregorian date, weekday, Hebrew date and whether it is a day off in Israel.'

const englishNames: Record<string, string> = {
  'ראש השנה': 'Rosh Hashanah, day 1',
  'ראש השנה, יום שני': 'Rosh Hashanah, day 2',
  'צום גדליה': 'Fast of Gedaliah',
  'ערב יום כיפור': 'Yom Kippur eve',
  'יום כיפור': 'Yom Kippur',
  'ערב סוכות': 'Sukkot eve',
  סוכות: 'Sukkot',
  'שמיני עצרת ושמחת תורה': 'Shemini Atzeret and Simchat Torah',
  סיגד: 'Sigd',
  'חנוכה (נר ראשון)': 'Hanukkah, first candle',
  'צום עשרה בטבת': 'Fast of 10 Tevet',
  'ט״ו בשבט': 'Tu BiShvat',
  'תענית אסתר': 'Fast of Esther',
  פורים: 'Purim',
  'שושן פורים': 'Shushan Purim (Jerusalem)',
  'ערב פסח': 'Passover eve',
  פסח: 'Passover',
  'שביעי של פסח': 'Seventh day of Passover',
  'יום הזיכרון לשואה ולגבורה': 'Holocaust Remembrance Day (Yom HaShoah)',
  'יום הזיכרון, ערב יום העצמאות': 'Memorial Day (Yom HaZikaron)',
  'יום העצמאות': 'Independence Day (Yom HaAtzmaut)',
  'ל״ג בעומר': 'Lag BaOmer',
  'יום ירושלים': 'Jerusalem Day',
  'ערב שבועות': 'Shavuot eve',
  שבועות: 'Shavuot',
  'צום י״ז בתמוז': 'Fast of 17 Tammuz',
  'תשעה באב': 'Tisha B\'Av',
  'ט״ו באב': 'Tu B\'Av',
  'ערב ראש השנה': 'Rosh Hashanah eve',
}

const kindNames: Record<EventKind, string> = {
  rest: 'Day off in Israel',
  eve: 'Eve, holiday starts at sunset',
  fast: 'Fast day',
  memorial: 'Memorial day',
  minor: 'Not a day off',
  cholHamoed: 'Intermediate days',
  roshChodesh: 'New month',
}

type Row = CalendarEvent & { english: string }

const calendar = calendarYear(String(HEBREW_YEAR) as '5787')
const rows: Row[] = calendar
  ? holidayTable(calendar.events).flatMap((event) =>
      englishNames[event.name] ? [{ ...event, english: englishNames[event.name] }] : [],
    )
  : []

const dayOf = (hebrewName: string) => rows.find((row) => row.name === hebrewName)?.day
const dateText = (hebrewName: string) => {
  const day = dayOf(hebrewName)
  return day === undefined ? '' : enLongDate(day)
}
const restDays = rows.filter((row) => row.kind === 'rest').length
const nextYear = HEBREW_YEAR + 1

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-cal-faq-rosh',
    question: `When is Rosh Hashanah ${HEBREW_YEAR}?`,
    answer: `Rosh Hashanah ${HEBREW_YEAR} is on ${dateText('ראש השנה')} and ${dateText('ראש השנה, יום שני')}. It starts at sunset the evening before. The next one, Rosh Hashanah ${nextYear}, starts at sunset on ${dateText('ערב ראש השנה')}.`,
  },
  {
    id: 'en-cal-faq-passover',
    question: 'When is Passover 2027?',
    answer: `Passover 2027 starts at sunset on ${dateText('ערב פסח')}. The first day is ${dateText('פסח')} and the seventh day, also a day off in Israel, is ${dateText('שביעי של פסח')}. In Israel Passover lasts seven days, one day less than outside Israel.`,
  },
  {
    id: 'en-cal-faq-sunset',
    question: 'Why do Jewish holidays start the evening before?',
    answer:
      'In the Hebrew calendar a day begins at sunset, not at midnight. So a holiday dated 22 April starts at sunset on 21 April and ends at nightfall on 22 April. Shops and offices in Israel usually close early on the eve.',
  },
  {
    id: 'en-cal-faq-leap',
    question: `Is ${HEBREW_YEAR} a leap year?`,
    answer: isLeapYear(HEBREW_YEAR)
      ? `Yes. ${HEBREW_YEAR} has 13 months, with Adar I and Adar II, so Purim falls in Adar II and the spring holidays come later in the Gregorian calendar than in a regular year.`
      : `No. ${HEBREW_YEAR} is a regular year of 12 months.`,
  },
  {
    id: 'en-cal-faq-off',
    question: 'Which holidays are days off in Israel?',
    answer: `In ${HEBREW_YEAR} there are ${restDays} days marked as days off in the table: the two days of Rosh Hashanah, Yom Kippur, the first day of Sukkot, Shemini Atzeret, the first and seventh days of Passover, Independence Day and Shavuot. On these days government offices, banks and most businesses are closed and public transport is limited. Purim, Hanukkah and Lag BaOmer are not days off.`,
  },
]

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

function HolidayTable() {
  return (
    <div className={styles.tableWrap} role="region" aria-label={`Jewish holidays ${HEBREW_YEAR}`} tabIndex={0}>
      <table className={styles.table}>
        <caption>
          Jewish and Israeli holidays, Hebrew year {HEBREW_YEAR}
        </caption>
        <thead>
          <tr>
            <th scope="col">Holiday</th>
            <th scope="col">Date</th>
            <th scope="col">Hebrew date</th>
            <th scope="col">In Israel</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.day}-${row.name}`}>
              <th scope="row">{row.english}</th>
              <td>{enLongDate(row.day)}</td>
              <td>{enHebrewDate(toHebrew(row.day))}</td>
              <td>{kindNames[row.kind]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function EnHebrewCalendarPage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede={`The Hebrew year ${HEBREW_YEAR} begins with Rosh Hashanah on ${dateText('ראש השנה')}. Yom Kippur is on ${dateText('יום כיפור')}, Passover 2027 begins on ${dateText('פסח')} and Shavuot is on ${dateText('שבועות')}. Every holiday starts at sunset the evening before the date shown.`}
      chips={[`Hebrew year ${HEBREW_YEAR}`, `${restDays} days off in Israel`, isLeapYear(HEBREW_YEAR) ? 'Leap year, Adar I and II' : 'Regular year']}
      tool={<HolidayTable />}
      faq={faq}
      cta={{
        text: 'Holiday closures, opening hours and customer reminders can update automatically on your site and in WhatsApp.',
        label: 'Business automation',
        href: '/en/services/automation',
      }}
    >
      <h2>How to read the table</h2>
      <ul>
        <li>
          <strong>Date</strong> is the Gregorian day of the holiday. It starts at sunset the evening before and ends at
          nightfall on that day.
        </li>
        <li>
          <strong>Day off in Israel</strong> means government offices, banks and most businesses are closed. On an eve,
          they usually close early in the afternoon.
        </li>
        <li>
          <strong>Fast days</strong> and <strong>memorial days</strong> are regular working days for most businesses.
        </li>
        <li>
          Dates are for Israel. Outside Israel, Sukkot, Passover and Shavuot have an extra day.
        </li>
      </ul>

      <h2>Converting a single date</h2>
      <p>
        To find the Hebrew date of a birthday, an anniversary or a yahrzeit, use the{' '}
        <Link href="/en/tools/hebrew-date-converter">Hebrew date converter</Link>. It converts both ways and handles
        dates after sunset and Adar I and II.
      </p>

      <h2>Sources</h2>
      <ul className={styles.sources}>
        <li>
          <a href="https://en.wikipedia.org/wiki/Hebrew_calendar" rel="noopener" target="_blank">
            Wikipedia: Hebrew calendar
          </a>
        </li>
        <li>
          <a href="https://en.wikipedia.org/wiki/Public_holidays_in_Israel" rel="noopener" target="_blank">
            Wikipedia: Public holidays in Israel
          </a>
        </li>
      </ul>
      <p className={styles.caveat}>
        Dates are calculated with the rules of the fixed Hebrew calendar, including the rules that move a fast or a
        memorial day when it would fall on Shabbat or next to it.
      </p>
    </EnToolLayout>
  )
}
