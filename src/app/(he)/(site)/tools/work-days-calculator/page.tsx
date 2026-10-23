import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import WorkDaysCalculator from '../../components/tools/WorkDaysCalculator'
import {
  DEFAULT_SETTINGS,
  MONTH_NAMES,
  STRICT_SETTINGS,
  countWorkDays,
  dateOf,
  dayFromParts,
  formatDayMonth,
  formatMonthDay,
  monthOf,
  paymentDue,
  specialDaysForYear,
  weekdayName,
  weekdayOf,
  yearSummary,
  type SpecialDay,
} from '@/lib/work-days'
import styles from './page.module.css'

const PATH = '/tools/work-days-calculator'
const TITLE = 'מחשבון ימי עבודה'
const META_TITLE = 'מחשבון ימי עבודה 2026: בין תאריכים, עם חגים'
const DESCRIPTION =
  'מחשבון ימי עבודה בין תאריכים לפי החגים בישראל, מועד יעד בימי עסקים ומועד תשלום בשוטף פלוס. וגם טבלה: כמה ימי עבודה יש בכל חודש ב-2026.'
const YEAR = 2026

const wikisource = (title: string) => `https://he.wikisource.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`
const wikipedia = (title: string) => `https://he.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`

const sources = [
  {
    title: 'פקודת סדרי השלטון והמשפט, התש״ח-1948',
    href: wikisource('פקודת סדרי השלטון והמשפט'),
    note: 'סעיף 18א, ימי המנוחה הקבועים',
  },
  {
    title: 'חוק יום העצמאות, התש״ט-1949',
    href: wikisource('חוק יום העצמאות'),
    note: 'סעיף 1, המועד של יום העצמאות ומתי הוא זז',
  },
  {
    title: 'חוק־יסוד: הכנסת',
    href: wikisource('חוק-יסוד: הכנסת'),
    note: 'סעיף 10, יום הבחירות הוא יום שבתון',
  },
  {
    title: 'חוק הרשויות המקומיות (בחירות), התשכ״ה-1965',
    href: wikisource('חוק הרשויות המקומיות (בחירות)'),
    note: 'סעיף 97ב, יום הבחירות לרשויות המקומיות',
  },
  {
    title: 'חוק מוסר תשלומים לספקים, התשע״ז-2017',
    href: wikisource('חוק מוסר תשלומים לספקים'),
    note: 'סעיפים 3 ו-4, מועדי תשלום לספקים וריבית על איחור',
  },
  {
    title: 'חוק הפרשנות, התשמ״א-1981',
    href: wikisource('חוק הפרשנות'),
    note: 'סעיף 10, איך סופרים תקופות',
  },
  {
    title: 'ויקיפדיה: הבחירות לכנסת העשרים ושש',
    href: wikipedia('הבחירות לכנסת העשרים ושש'),
    note: 'מועד הבחירות, 27 באוקטובר 2026',
  },
  {
    title: 'ויקיפדיה: אשראי',
    href: wikipedia('אשראי'),
    note: 'ההסבר על שוטף פלוס',
  },
]

function loadYear() {
  const first = dayFromParts(YEAR, 1, 1)
  const last = dayFromParts(YEAR, 12, 31)
  const summary = yearSummary(YEAR)
  const specials = specialDaysForYear(YEAR)
  const full = countWorkDays(first, last, DEFAULT_SETTINGS)
  const sixDays = countWorkDays(first, last, { ...DEFAULT_SETTINGS, week: 'sun-fri' })
  const twoWeeks = countWorkDays(dayFromParts(YEAR, 9, 13), dayFromParts(YEAR, 9, 24), DEFAULT_SETTINGS)
  const twoWeeksStrict = countWorkDays(dayFromParts(YEAR, 9, 13), dayFromParts(YEAR, 9, 24), STRICT_SETTINGS)
  const february = paymentDue(dayFromParts(YEAR, 2, 10), 30, 'month-end', DEFAULT_SETTINGS)
  const october45 = paymentDue(dayFromParts(YEAR, 10, 22), 45, 'month-end', DEFAULT_SETTINGS)
  const october90 = paymentDue(dayFromParts(YEAR, 10, 22), 90, 'month-end', DEFAULT_SETTINGS)
  const delivery = paymentDue(dayFromParts(YEAR, 9, 30), 60, 'month-end', DEFAULT_SETTINGS)
  if (
    !summary ||
    !specials ||
    !full ||
    !sixDays ||
    !twoWeeks ||
    !twoWeeksStrict ||
    !february ||
    !october45 ||
    !october90 ||
    !delivery
  ) {
    throw new Error('Hebrew calendar data is unavailable')
  }
  return {
    summary,
    specials,
    weekdays: full.workDays + full.offDays.length,
    sixDays: sixDays.workDays,
    twoWeeks: twoWeeks.workDays,
    twoWeeksStrict: twoWeeksStrict.workDays,
    february,
    october45,
    october90,
    delivery,
  }
}

const data = loadYear()
const september = data.summary.months[8]

const dayWithWeekday = (day: number) => `יום ${weekdayName(day)}, ${formatMonthDay(day)}`

const weekendNote = (day: number) => {
  const weekday = weekdayOf(day)
  if (weekday === 6) return ', בשבת'
  if (weekday === 5) return ', ביום שישי'
  return ''
}

const restDays = data.specials.filter((special) => special.kind === 'rest')
const eveDays = data.specials.filter((special) => special.kind === 'eve' || special.kind === 'chol-hamoed-eve')

const cholHamoedRanges = data.specials
  .filter((special) => special.kind === 'chol-hamoed' || special.kind === 'chol-hamoed-eve')
  .reduce<{ name: string; first: number; last: number }[]>((ranges, special) => {
    const current = ranges[ranges.length - 1]
    if (current && special.day === current.last + 1) {
      current.last = special.day
      return ranges
    }
    return [...ranges, { name: special.name, first: special.day, last: special.day }]
  }, [])

const rangeText = (first: number, last: number) =>
  monthOf(first) === monthOf(last)
    ? `${dateOf(first)} עד ${formatMonthDay(last)}`
    : `${formatMonthDay(first)} עד ${formatMonthDay(last)}`

const faq: ToolFaqEntry[] = [
  {
    id: 'work-days-faq-2026',
    question: 'כמה ימי עבודה יש ב-2026?',
    answer: `ב-2026 יש ${data.summary.workDays} ימי עבודה, כשעובדים מראשון עד חמישי וסופרים ערבי חג וחול המועד כימי עבודה. מתוך ${data.weekdays} ימים של ראשון עד חמישי בשנה, שישה ימי מנוחה חלים באמצע השבוע: פסח, שביעי של פסח, יום העצמאות, היום השני של ראש השנה, יום כיפור ויום הבחירות לכנסת. מי שלא עובד בערבי חג ובחול המועד מגיע ל-${data.summary.strictWorkDays} ימי עבודה.`,
  },
  {
    id: 'work-days-faq-september',
    question: 'כמה ימי עבודה יש בספטמבר 2026?',
    answer: `${september.workDays} ימי עבודה, בשבוע של ראשון עד חמישי. באמצע השבוע חלים היום השני של ראש השנה, ביום ראשון 13 בספטמבר, ויום כיפור, ביום שני 21 בספטמבר. היום הראשון של ראש השנה וסוכות חלים בשבת. מי שלא עובד בערב יום כיפור ובחול המועד סוכות, 27 עד 30 בספטמבר, נשאר עם ${september.strictWorkDays} ימי עבודה.`,
  },
  {
    id: 'work-days-faq-shotef',
    question: 'מה זה שוטף פלוס 30?',
    answer:
      'תנאי תשלום שבהם סופרים 30 ימים מסוף החודש שבו הוגשה החשבונית, ולא מיום החשבונית. חשבונית מ-10 בפברואר 2026 בשוטף + 30: סוף החודש הוא 28 בפברואר, ועוד 30 ימים יוצא 30 במרץ. גם חשבונית מ-1 בפברואר משולמת ב-30 במרץ, כלומר אחרי 57 ימים. בין עסקים, כשהחוזה לא קובע מועד אחר, חוק מוסר תשלומים לספקים מחייב לשלם תוך 45 ימים מתום החודש שבו הומצא החשבון.',
  },
  {
    id: 'work-days-faq-eve',
    question: 'ערב חג הוא יום עבודה?',
    answer:
      'לפי החוק כן. ימי המנוחה הקבועים בפקודת סדרי השלטון והמשפט הם שבת, שני ימי ראש השנה, יום כיפור, היום הראשון של סוכות, שמיני עצרת, היום הראשון והשביעי של פסח ושבועות, וערב חג לא נמצא ברשימה. כמה שעות עובדים בערב חג נקבע בהסכם העבודה, בהסכם קיבוצי או בצו הרחבה, ויש עסקים שסגורים בו. אם אצלכם לא עובדים בערבי חג, בטלו את הסימון ״ערבי חג״ במחשבון.',
  },
  {
    id: 'work-days-faq-chol-hamoed',
    question: 'חול המועד נחשב ימי עבודה?',
    answer:
      'מבחינת החוק כן. חול המועד של פסח ושל סוכות לא נמנה בין ימי המנוחה, ולכן הוא יום עבודה רגיל. בפועל יש עסקים שסוגרים בו או עובדים חלקית, ויש עובדים שלוקחים בו חופשה. במחשבון אפשר לבחור אם לספור אותו. ב-2026 חול המועד פסח חל ב-3 עד 7 באפריל, וחול המועד סוכות ב-27 בספטמבר עד 2 באוקטובר.',
  },
  {
    id: 'work-days-faq-election',
    question: 'יום הבחירות הוא יום חופש?',
    answer:
      'לפי סעיף 10 לחוק־יסוד: הכנסת, יום הבחירות לכנסת הוא יום שבתון, אבל התחבורה הציבורית ושאר השירותים הציבוריים פועלים כרגיל. הבחירות לכנסת ה-26 נקבעו ליום שלישי, 27 באוקטובר 2026, והמחשבון לא סופר את היום הזה כיום עבודה. גם יום הבחירות לרשויות המקומיות הוא יום שבתון ברשויות שבהן מתקיימות בחירות. בחירות שעוד לא נקבע להן תאריך לא נכללות בחישוב.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

function HolidayCell({ days }: { days: SpecialDay[] }) {
  if (!days.length) return <span className={styles.muted}>אין</span>
  return (
    <ul className={styles.cellList}>
      {days.map((special) => (
        <li key={special.day} className={weekendNote(special.day) ? styles.muted : undefined}>
          {formatDayMonth(special.day)} {special.name}
          {weekendNote(special.day)}
        </li>
      ))}
    </ul>
  )
}

export default function WorkDaysCalculatorPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede={`ב-2026 יש ${data.summary.workDays} ימי עבודה למי שעובד מראשון עד חמישי, כשערבי חג וחול המועד נספרים כימי עבודה. כאן בוחרים תאריכים ומקבלים ימי עבודה ביניהם, מועד יעד בימי עסקים ותאריך תשלום בשוטף פלוס.`}
      chips={['חגים ובחירות בחישוב', 'ראשון עד חמישי או שישי', 'שוטף + 30 עד 90', 'בלי הרשמה']}
      tool={<WorkDaysCalculator />}
      faq={faq}
      cta={{
        text: 'מחשבים מועדי תשלום ידנית? אנחנו מחברים CRM וחשבוניות שמזכירים ללקוח ולכם לבד.',
        label: 'אוטומציה לעסקים',
        href: '/services/automation',
      }}
    >
      <h2 id="how-work-days-count" className={styles.anchor}>
        איך סופרים ימי עבודה בישראל
      </h2>
      <p>
        יום עבודה הוא יום בשבוע העבודה שאינו יום מנוחה. רוב העסקים בישראל עובדים מראשון עד חמישי, ויש שעובדים גם
        בשישי. ימי המנוחה הקבועים בחוק מפורטים בסעיף 18א לפקודת סדרי השלטון והמשפט: שבת, שני ימי ראש השנה, יום כיפור,
        היום הראשון של סוכות, שמיני עצרת, היום הראשון והשביעי של פסח ושבועות. לפי אותו סעיף, מי שאינו יהודי רשאי
        לקיים את ימי המנוחה בחגי העדה שלו. המחשבון סופר לפי מועדי ישראל.
      </p>
      <p>
        לרשימה מצטרפים ימים מחוקים אחרים. יום העצמאות הוא יום שבתון לפי חוק יום העצמאות, והוא זז כשה׳ באייר חל ליד
        שבת: כשה׳ באייר חל בשבת, החג מוקדם לג׳ באייר, כשהוא חל בשישי, החג מוקדם לד׳ באייר, וכשהוא חל ביום שני, החג
        נדחה לו׳ באייר. גם יום הבחירות לכנסת הוא יום שבתון, לפי סעיף 10 לחוק־יסוד: הכנסת.
      </p>
      <p>
        ערבי חג, חול המועד, פורים, חנוכה, תשעה באב, יום השואה ויום הזיכרון הם ימי עבודה לפי החוק. יש עסקים שלא
        עובדים בהם או עובדים פחות שעות, ולכן במחשבון אפשר להוציא מהספירה את ערבי החג ואת חול המועד. יום הזיכרון נחשב
        במחשבון ערב חג, כי הוא ערב יום העצמאות.
      </p>
      <h3>סופרים את יום ההתחלה?</h3>
      <p>
        בחישוב בין תאריכים אתם בוחרים. ״מ-1 עד 30 בספטמבר״ כולל בדרך כלל את שני התאריכים. בתקופות שנקבעו בחוק, סעיף 10
        לחוק הפרשנות קובע שהיום שממנו מתחילים לספור לא נכלל, ושימי מנוחה נכללים בספירה, חוץ ממקרה שבו הם הימים
        האחרונים של התקופה. לכן כשמחשבים <a href="#deadline">מועד יעד בימי עבודה</a>, המחשבון מתחיל לספור מהיום
        שאחרי תאריך ההתחלה.
      </p>

      <h2 id="work-days-2026" className={styles.anchor}>
        ימי עבודה בכל חודש ב-2026
      </h2>
      <p>
        ב-2026 יש {data.summary.workDays} ימי עבודה למי שעובד מראשון עד חמישי. הטבלה סופרת ערבי חג וחול המועד כימי
        עבודה, והעמודה השלישית מראה כמה נשאר כשלא עובדים בהם. מי שעובד גם בשישי מגיע ל-{data.sixDays} ימי עבודה
        בשנה.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>ימי עבודה ב-2026, שבוע של ראשון עד חמישי</caption>
          <colgroup>
            <col className={styles.colMonth} />
            <col className={styles.colCount} />
            <col className={styles.colStrict} />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">חודש</th>
              <th scope="col">ימי עבודה</th>
              <th scope="col">בלי ערבי חג וחול המועד</th>
              <th scope="col">חגים וימי מנוחה</th>
            </tr>
          </thead>
          <tbody>
            {data.summary.months.map((item) => (
              <tr key={item.month}>
                <th scope="row">{MONTH_NAMES[item.month - 1]}</th>
                <td className={styles.count}>{item.workDays}</td>
                <td className={styles.count}>{item.strictWorkDays}</td>
                <td>
                  <HolidayCell days={item.restDays} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">כל השנה</th>
              <td className={styles.count}>{data.summary.workDays}</td>
              <td className={styles.count}>{data.summary.strictWorkDays}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
      <p>
        ב-2026 היום הראשון של ראש השנה, סוכות ושמיני עצרת חלים בשבת, ושבועות חל ביום שישי. לכן הם לא מורידים ימי
        עבודה ממי שעובד מראשון עד חמישי. אפריל, ספטמבר ואוקטובר הם החודשים עם הכי הרבה חגים.
      </p>
      <h3>ימי המנוחה ב-2026</h3>
      <ul>
        {restDays.map((special) => (
          <li key={special.day}>
            {special.name}: {dayWithWeekday(special.day)}
          </li>
        ))}
      </ul>
      <h3>ערבי חג וחול המועד ב-2026</h3>
      <ul>
        {eveDays.map((special) => (
          <li key={special.day}>
            {special.name}: {dayWithWeekday(special.day)}
          </li>
        ))}
        {cholHamoedRanges.map((range) => (
          <li key={range.first}>
            {range.name}: {rangeText(range.first, range.last)}
          </li>
        ))}
      </ul>

      <h2 id="shotef-plus" className={styles.anchor}>
        שוטף פלוס: איך מחשבים מועד תשלום
      </h2>
      <p>
        שוטף פלוס היא הדרך המקובלת בישראל לקבוע מתי משלמים לספק. ״שוטף״ הוא סוף החודש שבו הוגשה החשבונית, והמספר
        שאחרי הפלוס הוא מספר הימים שמוסיפים לו. כך מחשב גם <a href="#payment-terms">מחשבון מועד התשלום</a>: סוף החודש
        של החשבונית, ועוד מספר הימים.
      </p>
      <ul>
        <li>
          חשבונית מ-10 בפברואר 2026 בשוטף + 30: סוף החודש הוא {formatMonthDay(data.february.anchor)}, ועוד 30 ימים
          יוצא {dayWithWeekday(data.february.due)}.
        </li>
        <li>
          חשבונית מ-22 באוקטובר 2026 בשוטף + 45: סוף החודש הוא {formatMonthDay(data.october45.anchor)}, ועוד 45 ימים
          יוצא {dayWithWeekday(data.october45.due)}.
        </li>
        <li>
          אותה חשבונית בשוטף + 90: {formatMonthDay(data.october90.anchor)} ועוד 90 ימים יוצא{' '}
          {dayWithWeekday(data.october90.due)} 2027. מי שמשלם רק בימי עבודה יעביר את התשלום ל
          {dayWithWeekday(data.october90.nextWorkDay)}.
        </li>
      </ul>
      <p>
        שוטף + 30 הוא לא 30 ימים מהחשבונית. חשבונית מ-1 בפברואר וחשבונית מ-28 בפברואר משולמות באותו יום, 30 במרץ,
        כלומר אחרי 57 ימים או אחרי 30 ימים. כדי שלא יהיו אי הבנות, כדאי לכתוב בהסכם גם את דרך החישוב, למשל ״30 ימים
        מתום החודש שבו הומצאה החשבונית״. אם בהסכם כתוב ״30 ימים מיום החשבונית״, בחרו במחשבון ״מתאריך החשבונית״.
      </p>
      <h3>מה קובע החוק</h3>
      <p>
        חוק מוסר תשלומים לספקים קובע מועדי תשלום מקסימליים. עסק שהזמין מספק טובין, שירות או עבודה משלם לו לא יאוחר
        מ-45 ימים מתום החודש שבו הומצא לו החשבון, כלומר שוטף + 45, אלא אם כן נקבע בחוזה במפורש מועד אחר. מועד אחר
        מותר רק כשאופי ההתקשרות מחייב אותו, או כשהוא לא בלתי הוגן באופן חריג. לגופים ציבוריים יש בחוק מועדים משלהם,
        ועל תשלום באיחור מתווספת ריבית, ואחרי 30 יום גם דמי פיגורים.
      </p>
      <h3>המועד יוצא בשבת או בחג</h3>
      <p>
        ההסכם קובע. אם לא נכתב בו דבר, כדאי לדעת שבתקופות שנקבעו בחוק, לפי סעיף 10 לחוק הפרשנות, יום מנוחה שחל בסוף
        התקופה לא נספר, והמועד עובר ליום שאחריו. כשמועד התשלום במחשבון יוצא ביום שאינו יום עבודה, מופיע מתחתיו גם יום
        העבודה הבא.
      </p>

      <h2>טיפים לתכנון מועדים בפרויקטים</h2>
      <ul>
        <li>
          סופרים בימי עבודה, לא בימים קלנדריים. השבועיים שבין 13 ל-24 בספטמבר 2026 הם {data.twoWeeks} ימי עבודה ולא
          10, ו-{data.twoWeeksStrict} למי שלא עובד בערב יום כיפור.
        </li>
        <li>
          בודקים את הלוח לפני תשרי וניסן. בחודשים האלה חלים רוב החגים, ערבי החג וחול המועד. כדאי לסיים משימות גדולות
          לפני ערב ראש השנה או ערב פסח, ולא לקבוע מסירה בחול המועד.
        </li>
        <li>
          משאירים מרווח. מי שמתחייב ללקוח ל-20 ימי עבודה יכול לקבוע לעצמו יעד פנימי של 17, ולהשאיר שלושה ימים לתיקונים
          ולאישורים.
        </li>
        <li>
          כותבים תאריך, לא רק מספר ימים. ״תוך 10 ימי עבודה״ משאיר פתוחה את השאלה מאיזה יום סופרים ומה נחשב יום עבודה.
          תאריך מדויק בהצעת המחיר או בחוזה סוגר אותה. אפשר להכין הצעה כזו ב
          <Link href="/tools/price-quote-generator">מחולל הצעת מחיר</Link>.
        </li>
        <li>
          מתכננים את הכסף לפי מועד התשלום. פרויקט שנמסר ב-30 בספטמבר 2026 ללקוח שמשלם בשוטף + 60 יביא כסף רק ב
          {dayWithWeekday(data.delivery.due)}. את התזרים כדאי לתכנן לפי התאריך הזה ולא לפי יום המסירה.
        </li>
      </ul>

      <h2>מקורות</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noopener" target="_blank">
              {source.title}
            </a>
            : {source.note}
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        תאריכי החגים נבדקו מול לוח החגים של Hebcal לשנים 2020 עד 2040, והנוסח נבדק מול לשון החוקים באוקטובר 2026.
      </p>
    </ToolLayout>
  )
}
