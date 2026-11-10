import Link from 'next/link'
import { notFound } from 'next/navigation'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../../components/tools/ToolLayout'
import {
  HOLIDAYS_HUB_PATH,
  answerOf,
  dayLine,
  dayTypeOf,
  daysUntilText,
  gregorianYearOf,
  hebrewDateText,
  holidayBySlug,
  holidayPath,
  holidays,
  occurrencesOf,
  todayInIsrael,
  weekdayText,
  shortDate,
  type Holiday,
  type Occurrence,
} from '@/lib/holiday-dates'
import styles from '../../word-counter/page.module.css'

export const dynamicParams = false
export const revalidate = 3600

export const generateStaticParams = () => holidays.map(({ slug }) => ({ slug }))

type Params = { params: Promise<{ slug: string }> }

const CALENDAR_PATH = '/tools/hebrew-calendar-2027'
const GREETINGS_PATH = '/tools/holiday-greetings'
const WORK_DAYS_PATH = '/tools/work-days-calculator'

const nextOf = (holiday: Holiday) => {
  const today = todayInIsrael()
  return { today, occurrences: occurrencesOf(holiday, today) }
}

const metaTitleOf = (holiday: Holiday, year: number) =>
  `מתי ${holiday.short} ${year}? עוד כמה ימים, תאריך ותאריך עברי`

const countdownOf = (holiday: Holiday, occurrence: Occurrence, today: number) => {
  const days = occurrence.start - today
  if (days <= 0) return ''
  if (days === 1) return `${holiday.short} מתחיל מחר.`
  return `עד ${holiday.short} נשארו עוד ${days.toLocaleString('he-IL')} ימים.`
}

const descriptionOf = (holiday: Holiday, occurrence: Occurrence) =>
  `${holiday.short} ${gregorianYearOf(occurrence.start)}: ${
    occurrence.end === occurrence.start
      ? dayLine(occurrence.start)
      : `${dayLine(occurrence.start)} עד ${dayLine(occurrence.end)}`
  }, ${hebrewDateText(occurrence.start)}. הערב שלפני, יום שבתון או לא, והתאריכים בשנים הבאות.`

const rangeText = (occurrence: Occurrence) =>
  occurrence.end === occurrence.start ? shortDate(occurrence.start) : `${shortDate(occurrence.start)} עד ${shortDate(occurrence.end)}`

export async function generateMetadata({ params }: Params) {
  const holiday = holidayBySlug((await params).slug)
  if (!holiday) return {}
  const [next] = nextOf(holiday).occurrences
  if (!next) return {}
  return toolMetadata({
    path: holidayPath(holiday.slug),
    metaTitle: metaTitleOf(holiday, gregorianYearOf(next.start)),
    description: descriptionOf(holiday, next),
  })
}

export default async function HolidayPage({ params }: Params) {
  const holiday = holidayBySlug((await params).slug)
  if (!holiday) notFound()
  const { today, occurrences } = nextOf(holiday)
  const [next, ...later] = occurrences
  if (!next) notFound()
  const year = gregorianYearOf(next.start)
  const following = later[0]
  const others = holidays.filter((item) => item.slug !== holiday.slug)
  const countdown = countdownOf(holiday, next, today)

  const facts: [string, string][] = [
    ['תאריך', next.end === next.start ? dayLine(next.start) : `${dayLine(next.start)} עד ${dayLine(next.end)}`],
    ['תאריך עברי', hebrewDateText(next.start)],
    [holiday.slug === 'hanukkah' ? 'הדלקת נר ראשון' : 'מתחיל בערב', dayLine(next.eve)],
    ['כמה זמן נשאר', next.start <= today ? 'החג חל עכשיו' : daysUntilText(next.start - today)],
    ['יום חופש?', dayTypeOf(holiday)],
    ['בלוח העברי', holiday.hebrewDate],
  ]

  const faq: ToolFaqEntry[] = [
    {
      id: `holiday-${holiday.slug}-when`,
      question: `מתי ${holiday.short} ${year}?`,
      answer: answerOf(holiday, next, today),
    },
    ...(countdown
      ? [
          {
            id: `holiday-${holiday.slug}-countdown`,
            question: `עוד כמה ימים ${holiday.short}?`,
            answer: `${countdown} ${holiday.short} ${year} מתחיל ב${dayLine(next.start)}, והספירה כאן מתעדכנת כל שעה לפי שעון ישראל.`,
          },
        ]
      : []),
    {
      id: `holiday-${holiday.slug}-off`,
      question: `האם ${holiday.short} הוא יום חופש?`,
      answer: `${dayTypeOf(holiday)} ${
        holiday.day === 'rest'
          ? 'גם הערב שלפניו הוא בדרך כלל יום עבודה מקוצר, לפי ההסכם במקום העבודה.'
          : 'מקומות עבודה ובתי ספר יכולים לקבוע סדר יום משלהם.'
      }`,
    },
    ...(following
      ? [
          {
            id: `holiday-${holiday.slug}-next`,
            question: `מתי ${holiday.short} ${gregorianYearOf(following.start)}?`,
            answer: `${holiday.short} ${gregorianYearOf(following.start)} יחול ${
              following.end === following.start
                ? `ב${dayLine(following.start)}`
                : `מ${dayLine(following.start)} עד ${dayLine(following.end)}`
            }, ${hebrewDateText(following.start)}.`,
          },
        ]
      : []),
  ]

  return (
    <ToolLayout
      path={holidayPath(holiday.slug)}
      title={`מתי ${holiday.short} ${year}?`}
      metaTitle={metaTitleOf(holiday, year)}
      description={descriptionOf(holiday, next)}
      lede={countdown ? `${answerOf(holiday, next, today)} ${countdown}` : answerOf(holiday, next, today)}
      tool={
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption>
              {holiday.name} {year}
            </caption>
            <tbody>
              {facts.map(([label, value]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
      faq={faq}
      cta={{
        text: 'צריכים לוח זמנים, תזכורות או הודעות ללקוחות שמתחשבים בחגים? אנחנו בונים אוטומציות כאלה לעסקים.',
        label: 'אוטומציה לעסקים',
        href: '/services/automation',
      }}
    >
      <h2>מה זה {holiday.name}</h2>
      <p>{holiday.about}</p>

      <h2>{holiday.short} בשנים הבאות</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>תאריכי {holiday.short} לפי שנה</caption>
          <thead>
            <tr>
              <th scope="col">שנה</th>
              <th scope="col">תאריך</th>
              <th scope="col">יום בשבוע</th>
              <th scope="col">תאריך עברי</th>
            </tr>
          </thead>
          <tbody>
            {occurrences.map((occurrence) => (
              <tr key={occurrence.start}>
                <th scope="row">{gregorianYearOf(occurrence.start)}</th>
                <td>{rangeText(occurrence)}</td>
                <td>{weekdayText(occurrence.start)}</td>
                <td>{hebrewDateText(occurrence.start)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        התאריכים מחושבים לפי הלוח העברי, עם כללי ההקדמה והדחייה שנהוגים בישראל. כל החגים, הצומות וראשי החודשים מופיעים
        ב<Link href={CALENDAR_PATH}>לוח השנה העברי-לועזי להדפסה</Link>, ואת מספר ימי העבודה בחודש עם החגים אפשר לחשב ב
        <Link href={WORK_DAYS_PATH}>מחשבון ימי עבודה</Link>. לברכה מוכנה לחג יש{' '}
        <Link href={GREETINGS_PATH}>מחולל ברכות לחגים</Link>.
      </p>

      <h2>מתי שאר החגים</h2>
      <ul>
        {others.map((item) => (
          <li key={item.slug}>
            <Link href={holidayPath(item.slug)}>מתי {item.short}</Link>
          </li>
        ))}
      </ul>
      <p>
        <Link href={HOLIDAYS_HUB_PATH}>כל חגי ישראל בטבלה אחת</Link>
      </p>
    </ToolLayout>
  )
}
