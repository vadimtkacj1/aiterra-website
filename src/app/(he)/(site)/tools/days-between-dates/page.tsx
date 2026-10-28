import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import DaysBetweenCalculator from '../../components/tools/DaysBetweenCalculator'
import {
  HEBREW_DATE_PATH,
  WORK_DAYS_PATH,
  addMonths,
  countText,
  difference,
  hebrewDateOf,
  holidaysBetween,
  parseDay,
  weeksText,
  workDaysIn,
} from '@/lib/days-between'
import { formatDate, formatLongDate, formatShortDate } from '@/lib/work-days'
import styles from './page.module.css'

const PATH = '/tools/days-between-dates'
const TITLE = 'מחשבון ימים בין תאריכים'
const META_TITLE = 'מחשבון ימים בין תאריכים: כולל ימי עבודה ותאריך עברי'
const DESCRIPTION =
  'כמה ימים יש בין שני תאריכים, גם בשבועות, בחודשים ובשנים. כמה ימים עברו מתאריך או נשארו עד חג, והוספת ימים או חודשים לתאריך, עם ימי עבודה ותאריך עברי.'

const INTERPRETATION_LAW = `https://he.wikisource.org/wiki/${encodeURIComponent('חוק_הפרשנות')}#${encodeURIComponent('סעיף_10')}`

const day = (iso: string) => {
  const parsed = parseDay(iso)
  if (!parsed.ok) throw new Error(`Bad example date ${iso}`)
  return parsed.day
}

const REFERENCE = day('2026-11-01')
const TABLE_END = day('2027-12-31')

function loadExamples() {
  const holidays = holidaysBetween(REFERENCE, TABLE_END)
  const year = difference(day('2026-01-01'), day('2026-12-31'), false)
  const yearInclusive = difference(day('2026-01-01'), day('2026-12-31'), true)
  const workYear = workDaysIn(day('2026-01-01'), day('2026-12-31'))
  const january = addMonths(day('2026-01-31'), 1)
  const januaryLeap = addMonths(day('2028-01-31'), 1)
  const leapDay = addMonths(day('2028-02-29'), 12)
  const project = difference(day('2026-11-01'), day('2027-02-15'), false)
  const pesach = holidays.find((holiday) => holiday.id === 'pesach')
  if (holidays.length < 9 || workYear === null || !pesach) throw new Error('Hebrew calendar data is unavailable')
  return { holidays, year, yearInclusive, workYear, january, januaryLeap, leapDay, project, pesach }
}

const data = loadExamples()
const pesachDays = data.pesach.day - REFERENCE

const faq: ToolFaqEntry[] = [
  {
    id: 'days-faq-passed',
    question: 'איך מחשבים כמה ימים עברו מתאריך מסוים?',
    answer:
      'מחסרים את התאריך המוקדם מהמאוחר. במחשבון בוחרים ״ימים בין תאריכים״, מקלידים את התאריך שממנו סופרים ומשאירים את תאריך הסיום על היום. התוצאה מופיעה בימים, וגם בשבועות ובחודשים. ההפרש לא כולל את אחד משני הקצוות: מ-1 בינואר עד 2 בינואר עבר יום אחד. אם צריך לספור גם את היום האחרון, מסמנים ״לספור גם את יום הסיום״.',
  },
  {
    id: 'days-faq-year',
    question: 'כמה ימים יש בשנה?',
    answer:
      'בשנה רגילה יש 365 ימים, ובשנה מעוברת 366, כי לפברואר נוסף 29 בפברואר. שנה מעוברת היא שנה שמתחלקת ב-4, חוץ משנות מאה שלא מתחלקות ב-400. לכן 2000 הייתה מעוברת ו-1900 לא. 2026 ו-2027 הן שנים רגילות, והשנה המעוברת הבאה היא 2028. בין 1 בינואר ל-31 בדצמבר של שנה רגילה יש 364 ימים, ו-365 כשסופרים גם את 31 בדצמבר.',
  },
  {
    id: 'days-faq-ends',
    question: 'האם סופרים את היום הראשון והאחרון?',
    answer:
      'בחישוב רגיל של הפרש סופרים רק אחד מהם, ולכן מיום שני עד יום שלישי עבר יום אחד. כשסופרים תקופה שכוללת את שני הקצוות, כמו חופשה מ-1 עד 10 בחודש, יש 10 ימים, ואז מסמנים ״לספור גם את יום הסיום״. בתקופות שנקבעו בחוק, סעיף 10 לחוק הפרשנות קובע שהיום שממנו מתחילים לספור לא נכלל בתקופה.',
  },
  {
    id: 'days-faq-month',
    question: 'מה יוצא 31 בינואר ועוד חודש?',
    answer: `${formatDate(data.january.day)}, כי בפברואר 2026 אין 31 ימים. כשמוסיפים חודשים, המחשבון שומר על אותו מספר יום בחודש, וכשאין יום כזה הוא עובר ליום האחרון של החודש. בשנה מעוברת התוצאה היא ${formatDate(
      data.januaryLeap.day,
    )}. חודש הוא לא 30 ימים: 31 בינואר ועוד 30 ימים הוא 2 במרץ. אם בחוזה כתוב מספר ימים, בוחרים ימים, ואם כתוב חודשים, בוחרים חודשים.`,
  },
  {
    id: 'days-faq-pesach',
    question: 'כמה ימים נשארו עד פסח?',
    answer: `פסח תשפ״ז חל ב${formatLongDate(data.pesach.day)}, והחג מתחיל בערב שלפני. מ-1 בנובמבר 2026 נשארו עד אז ${countText(
      pesachDays,
      'days',
    )}. כדי לראות כמה ימים נשארו נכון להיום, בוחרים במחשבון ״כמה ימים נשארו עד״ ואת פסח מהרשימה. אפשר להעתיק קישור לספירה ולשלוח אותו, ומי שיפתח אותו יראה את הספירה נכונה ליום שבו הוא פותח.`,
  },
  {
    id: 'days-faq-work',
    question: 'מה ההבדל בין ימים קלנדריים לימי עבודה?',
    answer: `ימים קלנדריים הם כל הימים, כולל סופי שבוע וחגים. ימי עבודה הם רק הימים שעובדים בהם, בישראל בדרך כלל ראשון עד חמישי בלי חגים. ב-2026 יש 365 ימים קלנדריים ו-${data.workYear} ימי עבודה. המחשבון כאן מציג את ימי העבודה בטווח, ולמועדי יעד בימי עסקים ולשוטף פלוס יש מחשבון ימי עבודה נפרד.`,
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function DaysBetweenDatesPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="בהפרש בין תאריכים סופרים רק אחד מהקצוות: מ-1 בינואר עד 2 בינואר עבר יום אחד. כאן בוחרים שני תאריכים ומקבלים את ההפרש בימים, בשבועות, בחודשים ובשנים, עם התאריך העברי ומספר ימי העבודה."
      chips={['ימים, שבועות, חודשים ושנים', 'הוספה והפחתה של ימים', 'ספירה לאחור לחגים', 'קישור לשיתוף']}
      tool={<DaysBetweenCalculator />}
      faq={faq}
      cta={{
        text: 'אנחנו בונים לעסקים מערכות תורים, חוזים ותזכורות שמחשבות מועדים לבד, גם לפי הלוח העברי.',
        label: 'פיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2 id="how" className={styles.anchor}>
        איך מחשבים כמה ימים יש בין שני תאריכים
      </h2>
      <p>
        מחסרים את התאריך המוקדם מהמאוחר. בין 1 בינואר 2026 ל-31 בדצמבר 2026 יש {countText(data.year.days, 'days')},
        ואם סופרים גם את 31 בדצמבר, {countText(data.yearInclusive.days, 'days')}. כשהטווח עובר דרך פברואר, צריך לדעת
        אם השנה מעוברת, ובטווח ארוך צריך לספור כמה שנים מעוברות יש בו. המחשבון עושה את זה לבד ומציג את התוצאה בכמה
        צורות:
      </p>
      <ul>
        <li>בימים, למשל מ-1 בנובמבר 2026 עד 15 בפברואר 2027: {countText(data.project.days, 'days')}.</li>
        <li>בשבועות וימים: {weeksText(data.project)}.</li>
        <li>
          בחודשים וימים: {countText(data.project.months, 'months')} ו-{countText(data.project.monthDays, 'days')}. חודש
          נספר כשמגיעים לאותו מספר יום בחודש הבא.
        </li>
        <li>בשנים, חודשים וימים, כשהטווח ארוך משנה, למשל לחישוב גיל או ותק.</li>
      </ul>
      <p>
        החישוב נעשה לפי ימים שלמים בלוח, כך שמעבר לשעון קיץ או לשעון חורף לא משנה את התוצאה. המחשבון עובד לפי הלוח
        הגרגוריאני, ואפשר לבחור בו תאריכים מ-1583, השנה הראשונה המלאה אחרי שהלוח הזה נכנס לשימוש, ועד 9999.
      </p>

      <h2 id="end-date" className={styles.anchor}>
        לספור את יום הסיום או לא
      </h2>
      <p>
        הפרש בין תאריכים כולל רק אחד משני הקצוות. מיום שני ליום שלישי עבר יום אחד, ולא יומיים. כשסופרים ימים של
        תקופה, כמו חופשה, אשפוז או אירוע מ-1 עד 10 בחודש, שני הקצוות בפנים ויש 10 ימים. לשם כך מסמנים ״לספור גם את
        יום הסיום״, והמחשבון מוסיף יום אחד.
      </p>
      <p>
        בתקופות שנקבעו בחוק יש כלל משלהן.{' '}
        <a href={INTERPRETATION_LAW} rel="noopener" target="_blank">
          סעיף 10 לחוק הפרשנות
        </a>{' '}
        קובע שבתקופה של ימים או שבועות היום שממנו מתחילים לספור לא נכלל, ושימי מנוחה נכללים בה, חוץ ממקרה שבו הם
        הימים האחרונים של התקופה. לכן ״תוך 30 ימים מ-1 במרץ״ מסתיים ב-31 במרץ, וכשהימים האחרונים הם שבת או חג, הם לא
        נספרים והמועד עובר ליום שאחריהם.
      </p>

      <h2 id="add-days" className={styles.anchor}>
        הוספת ימים, שבועות וחודשים לתאריך
      </h2>
      <p>
        בלשונית ״הוספת ימים לתאריך״ בוחרים תאריך, מספר ויחידה, ומקבלים את התאריך שיוצא, עם היום בשבוע והתאריך העברי.
        אם הוא חל בשבת או בחג, המחשבון כותב את זה. הפחתה עובדת באותה דרך, למשל כדי לדעת מה היה התאריך לפני 90 יום.
      </p>
      <ul>
        <li>ימים ושבועות מוסיפים כמו שהם: שבוע הוא 7 ימים בדיוק.</li>
        <li>
          חודשים שומרים על אותו מספר יום בחודש. כשאין יום כזה, התוצאה היא היום האחרון בחודש: 31 בינואר 2026 ועוד חודש
          הוא {formatDate(data.january.day)}, וב-2028 {formatDate(data.januaryLeap.day)}. כך קובע גם סעיף 10(ב) לחוק
          הפרשנות לתקופות של חודשים ושנים.
        </li>
        <li>
          שנים הן 12 חודשים. 29 בפברואר 2028 ועוד שנה הוא {formatDate(data.leapDay.day)}, כי ב-2029 אין 29 בפברואר.
        </li>
        <li>
          חודש הוא לא 30 ימים. ב-2026 ״30 ימים מ-31 בינואר״ הוא 2 במרץ, ו״חודש מ-31 בינואר״ הוא סוף פברואר. כדאי לבחור את
          היחידה שכתובה בחוזה או בהודעה.
        </li>
      </ul>

      <h2 id="holidays" className={styles.anchor}>
        כמה ימים נשארו עד החגים ב-2026 וב-2027
      </h2>
      <p>
        הטבלה סופרת את הימים מ-1 בנובמבר 2026 עד היום הראשון של כל חג. החגים מתחילים בערב שלפני, ולכן ערב החג הוא יום
        אחד קודם. כדי לראות כמה ימים נשארו נכון להיום, בוחרים במחשבון ״כמה ימים נשארו עד״ ואת החג מהרשימה.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>ימים מ-1 בנובמבר 2026 עד החגים</caption>
          <thead>
            <tr>
              <th scope="col">חג</th>
              <th scope="col">תאריך</th>
              <th scope="col">תאריך עברי</th>
              <th scope="col">ימים</th>
            </tr>
          </thead>
          <tbody>
            {data.holidays.map((holiday) => (
              <tr key={`${holiday.id}-${holiday.day}`}>
                <th scope="row">{holiday.name}</th>
                <td>
                  <span className={styles.date}>{formatShortDate(holiday.day)}</span>
                  <span className={styles.weekday}>{formatLongDate(holiday.day).split(',')[0]}</span>
                </td>
                <td>{hebrewDateOf(holiday.day)}</td>
                <td className={styles.count}>{(holiday.day - REFERENCE).toLocaleString('he-IL')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        התאריכים העבריים מתחלפים בשקיעה, ולכן ערב חג הוא כבר התאריך העברי של החג. להמרה של כל תאריך, כולל לידה אחרי
        השקיעה, יש <Link href={HEBREW_DATE_PATH}>המרת תאריך עברי ללועזי</Link>.
      </p>

      <h2 id="work-days" className={styles.anchor}>
        ימים קלנדריים מול ימי עבודה
      </h2>
      <p>
        המחשבון סופר ימים קלנדריים, כלומר את כל הימים כולל שבתות וחגים. מתחת לתוצאה מופיע גם כמה מהם ימי עבודה, לפי
        שבוע של ראשון עד חמישי ובלי ימי המנוחה שבחוק. ב-2026 יש 365 ימים ו-{data.workYear} ימי עבודה.
      </p>
      <p>
        כשצריך מועד יעד בימי עסקים, שבוע עבודה עם שישי, ספירה בלי ערבי חג וחול המועד, או מועד תשלום בשוטף פלוס,
        עוברים ל<Link href={WORK_DAYS_PATH}>מחשבון ימי עבודה</Link>. הוא מפרט גם אילו ימים בטווח לא נספרו ולמה.
      </p>
    </ToolLayout>
  )
}
