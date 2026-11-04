import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import {
  HOLIDAYS_HUB_PATH,
  daysUntilText,
  gregorianYearOf,
  hebrewDateText,
  holidayPath,
  holidays,
  isRestDay,
  occurrencesOf,
  shortDate,
  todayInIsrael,
  weekdayText,
} from '@/lib/holiday-dates'
import styles from '../word-counter/page.module.css'

export const revalidate = 21600

const TITLE = 'מתי החגים? כל חגי ישראל בטבלה'
const META_TITLE = 'חגי ישראל 2026–2027: מתי כל חג, תאריך ויום בשבוע'
const DESCRIPTION =
  'טבלה של כל החגים והמועדים בישראל עם התאריך הבא של כל אחד: יום בשבוע, תאריך עברי, כמה ימים נשארו ואם זה יום שבתון. מחושב לפי הלוח העברי.'

export const metadata = toolMetadata({ path: HOLIDAYS_HUB_PATH, metaTitle: META_TITLE, description: DESCRIPTION })

const faq: ToolFaqEntry[] = [
  {
    id: 'holidays-hub-rest',
    question: 'אילו חגים הם ימי שבתון בישראל?',
    answer:
      'ימי השבתון הם ראש השנה (יומיים), יום כיפור, היום הראשון של סוכות, שמיני עצרת ושמחת תורה, היום הראשון של פסח, שביעי של פסח, שבועות ויום העצמאות. חנוכה, פורים, ט״ו בשבט ול״ג בעומר הם ימי עבודה רגילים.',
  },
  {
    id: 'holidays-hub-eve',
    question: 'למה החג מתחיל בערב שלפני?',
    answer:
      'בלוח העברי היום מתחיל בשקיעה, ולכן כל חג ומועד מתחילים בערב שלפני התאריך שמופיע בלוח הלועזי. ליל הסדר, הדלקת הנר הראשון בחנוכה ותחילת הצום ביום כיפור נעשים כולם בערב הזה.',
  },
  {
    id: 'holidays-hub-change',
    question: 'למה החגים חלים בתאריך אחר בכל שנה?',
    answer:
      'החגים קבועים בלוח העברי, שהוא לוח ירחי-שמשי. שנה עברית רגילה קצרה מהשנה הלועזית בכ-11 ימים, ופעם בשנתיים או שלוש מוסיפים חודש אדר ב׳. לכן החגים זזים בלוח הלועזי, אבל נשארים באותה עונה.',
  },
]

export default function HolidaysHubPage() {
  const today = todayInIsrael()
  const rows = holidays
    .map((holiday) => ({ holiday, next: occurrencesOf(holiday, today, 1)[0] }))
    .filter((row) => row.next)
    .sort((a, b) => a.next.start - b.next.start)

  return (
    <ToolLayout
      path={HOLIDAYS_HUB_PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="כל החגים והמועדים בישראל לפי הסדר שבו הם מגיעים, מהקרוב לרחוק. לכל חג יש דף עם התאריכים בשנים הבאות."
      tool={
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption>החגים הקרובים</caption>
            <thead>
              <tr>
                <th scope="col">חג</th>
                <th scope="col">תאריך</th>
                <th scope="col">יום</th>
                <th scope="col">תאריך עברי</th>
                <th scope="col">עוד</th>
                <th scope="col">שבתון</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ holiday, next }) => (
                <tr key={holiday.slug}>
                  <th scope="row">
                    <Link href={holidayPath(holiday.slug)}>{holiday.short}</Link>
                  </th>
                  <td>
                    {next.end === next.start
                      ? shortDate(next.start)
                      : `${shortDate(next.start)} עד ${shortDate(next.end)}`}
                  </td>
                  <td>{weekdayText(next.start)}</td>
                  <td>{hebrewDateText(next.start)}</td>
                  <td>{next.start <= today ? 'עכשיו' : daysUntilText(next.start - today)}</td>
                  <td>{isRestDay(holiday) ? 'כן' : 'לא'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
      faq={faq}
      cta={{
        text: 'צריכים לוח זמנים או תזכורות ללקוחות שמתחשבים בחגים? אנחנו בונים אוטומציות כאלה לעסקים.',
        label: 'אוטומציה לעסקים',
        href: '/services/automation',
      }}
    >
      <h2>החגים לפי שנה</h2>
      <ul>
        {holidays.map((holiday) => {
          const next = occurrencesOf(holiday, today, 1)[0]
          return (
            <li key={holiday.slug}>
              <Link href={holidayPath(holiday.slug)}>
                מתי {holiday.short} {next ? gregorianYearOf(next.start) : ''}
              </Link>
            </li>
          )
        })}
      </ul>
      <p>
        ללוח מלא עם ראשי חודשים וצומות, להדפסה, יש <Link href="/tools/hebrew-calendar-2027">לוח שנה עברי-לועזי</Link>.
      </p>
    </ToolLayout>
  )
}
