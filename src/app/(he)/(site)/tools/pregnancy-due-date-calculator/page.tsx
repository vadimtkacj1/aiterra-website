import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import PregnancyDueDateCalculator from '../../components/tools/PregnancyDueDateCalculator'
import {
  calculate,
  formatLong,
  formatShort,
  parseDay,
  trimesterLabels,
  weeksLabel,
} from '@/lib/pregnancy-due-date'
import styles from '../../components/tools/FunTable.module.css'

const PATH = '/tools/pregnancy-due-date-calculator'
const TITLE = 'מחשבון תאריך לידה משוער ושבוע הריון'
const META_TITLE = 'מחשבון תאריך לידה משוער ושבוע הריון לפי וסת אחרונה'
const DESCRIPTION =
  'מחשבון תאריך לידה משוער: מכניסים את תאריך הווסת האחרונה או ההתעברות ומקבלים תאריך לידה, שבוע הריון נוכחי, שליש ולוח בדיקות מקובל. הערכה כללית, לא תחליף לרופא.'

const MACCABI_TESTS_URL = 'https://www.maccabi4u.co.il/maccabi_circles/pregnancy-and-birth/pregnancy_birth/tests/'
const MACCABI_NUCHAL_URL =
  'https://www.maccabi4u.co.il/maccabi_circles/pregnancy-and-birth/pregnancy_birth/tests/nuchal_translucency_screening/'
const MACCABI_GLUCOSE_URL =
  'https://www.maccabi4u.co.il/maccabi_circles/pregnancy-and-birth/pregnancy_birth/tests/glucose-challenge-test/'
const ACOG_DATING_URL = 'https://publications.smfm.org/publications/239-acog-committee-opinion-700-methods-for-estimating-the/'
const REVIEWED = '24.10.2026'

const day = (iso: string) => {
  const parsed = parseDay(iso)
  if (parsed === null) throw new Error(`Bad example date ${iso}`)
  return parsed
}

const LMP_EXAMPLE = day('2026-01-15')
const TODAY_EXAMPLE = day('2026-04-23')
const example = calculate({ mode: 'lmp', day: LMP_EXAMPLE, cycleDays: 28 }, TODAY_EXAMPLE)
const longCycle = calculate({ mode: 'lmp', day: LMP_EXAMPLE, cycleDays: 35 }, null)
const conception = calculate({ mode: 'conception', day: day('2026-01-29'), cycleDays: 28 }, null)

const exampleWeek =
  example.weeks !== null && example.extraDays !== null ? weeksLabel(example.weeks, example.extraDays) : ''
const exampleTrimester = example.trimester !== null ? trimesterLabels[example.trimester] : ''

const faq: ToolFaqEntry[] = [
  {
    id: 'pregnancy-faq-how',
    question: 'איך מחשבים תאריך לידה משוער?',
    answer:
      'לפי כלל נגלה מוסיפים 280 ימים, כלומר 40 שבועות, ליום הראשון של הווסת האחרונה. אפשר גם להוסיף שנה, להחסיר שלושה חודשים ולהוסיף שבעה ימים. הכלל מניח מחזור של 28 ימים ביוץ ביום ה-14. אם המחזור שלכם ארוך או קצר יותר, המחשבון מוסיף או מחסיר את ההפרש מ-28 ימים.',
  },
  {
    id: 'pregnancy-faq-sure',
    question: 'כמה התאריך מדויק?',
    answer:
      'הוא הערכה. רק מיעוט מהתינוקות נולדים בתאריך עצמו, והלידה מתרחשת בדרך כלל בטווח של שבועות סביבו. כשיש אולטרסאונד מוקדם, הרופאים מתבססים עליו, ולפי ההנחיה של ACOG מדידה בשליש הראשון היא השיטה המדויקת ביותר לקביעת גיל ההריון. אם הרופא שינה את התאריך, הוא קובע ולא המחשבון.',
  },
  {
    id: 'pregnancy-faq-conception',
    question: 'מה עושים אם ידוע תאריך ההתעברות?',
    answer:
      'במצב הזה בוחרים ״לפי תאריך התעברות״. המחשבון מחסיר 14 ימים כדי לחזור לווסת האחרונה המקבילה ומוסיף 280 ימים, כלומר תאריך הלידה הוא 266 ימים אחרי ההתעברות. זה מתאים במיוחד להפריה חוץ גופית, שבה התאריך ידוע בדיוק.',
  },
  {
    id: 'pregnancy-faq-irregular',
    question: 'מה אם המחזור לא סדיר או שאני לא זוכרת מתי הייתה הווסת?',
    answer:
      'ללא מחזור סדיר או תאריך ודאי, החישוב לפי וסת פחות אמין. במצב כזה הרופא קובע את גיל ההריון לפי אולטרסאונד, ובדרך כלל מדידה בשליש הראשון נותנת את התמונה המדויקת ביותר. הזינו את התאריך המשוער לצורך התמצאות, וחכו לאישור בבדיקה.',
  },
  {
    id: 'pregnancy-faq-tests',
    question: 'מתי עושים את הבדיקות בהריון?',
    answer:
      'לפי מכבי שירותי בריאות: אולטרסאונד הריון צעיר בשבועות 6 עד 7, שקיפות עורפית משבוע 11 עד שבוע 13 ושישה ימים, סקירת מערכות מוקדמת בשבועות 14 עד 16, תבחין משולש בשבועות 16 עד 19, סקירת מערכות מאוחרת בשבועות 21 עד 24 והעמסת סוכר של 50 גרם בשבועות 24 עד 28. הטווחים כלליים, והרופא או הקופה שלכם קובעים את התזמון המדויק לפי מצבכם.',
  },
  {
    id: 'pregnancy-faq-medical',
    question: 'האם המחשבון מחליף רופא?',
    answer:
      'לא. הוא נותן הערכה על בסיס נוסחה כללית, לא מעקב. תאריך הלידה, התזמון של הבדיקות והחלטות על הריון בסיכון נקבעים במעקב אצל רופא או מיילדת. כאבים, דימום, ירידה בתנועות העובר או כל דאגה אחרת הן סיבה לפנות מיד לרופא או למיון.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function PregnancyDueDateCalculatorPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede={`תאריך הלידה המשוער הוא 280 ימים (40 שבועות) מהיום הראשון של הווסת האחרונה. מי שהווסת האחרונה שלה התחילה ב-15 בינואר 2026 צפויה ללדת סביב ${formatLong(example.dueDay)}. כאן מכניסים את התאריך, ומקבלים שבוע הריון נוכחי, שליש ולוח בדיקות מקובל.`}
      chips={['לפי וסת אחרונה או התעברות', 'אורך מחזור מתכוונן', 'שבוע, שליש ובדיקות', 'הערכה כללית, לא רפואית']}
      tool={<PregnancyDueDateCalculator />}
      faq={faq}
      cta={{
        text: 'אנחנו בונים אתרים בעברית לקליניקות ולרופאים: קביעת תורים, עמודי טיפולים ומחשבונים שמסבירים למטופלים.',
        label: 'בניית אתר לקליניקה',
        href: '/services/development',
      }}
    >
      <h2>איך המחשבון מחשב</h2>
      <p>
        החישוב מבוסס על כלל נגלה, השיטה הוותיקה לאמידת תאריך לידה לפי הווסת האחרונה. ההנחות מפורשות:
      </p>
      <ul>
        <li>
          <strong>לפי וסת אחרונה:</strong> תאריך הווסת האחרונה ועוד 280 ימים. הכלל מניח מחזור של 28 ימים, ולכן עבור
          מחזור אחר מוסיפים או מחסירים את ההפרש.
        </li>
        <li>
          <strong>לפי התעברות:</strong> מחסירים 14 ימים מתאריך ההתעברות כדי לקבל את הווסת המקבילה, ומוסיפים 280. כלומר
          266 ימים אחרי ההתעברות.
        </li>
        <li>
          <strong>שבוע הריון:</strong> מספר הימים מתאריך ההתחלה עד היום, מחולק ל-7. ״שבוע 16 ויומיים״ הוא 16 שבועות
          מלאים ועוד יומיים.
        </li>
        <li>
          <strong>שליש:</strong> ראשון עד שבוע 13 ושישה ימים, שני משבוע 14 עד שבוע 27 ושישה ימים, ושלישי משבוע 28.
        </li>
      </ul>

      <h2>דוגמה מחושבת</h2>
      <p>
        ווסת אחרונה שהתחילה ב-{formatLong(LMP_EXAMPLE)}, מחזור של 28 ימים, ובדיקה ב-{formatLong(TODAY_EXAMPLE)}:
      </p>
      <ul>
        <li>
          תאריך לידה משוער: <strong>{formatLong(example.dueDay)}</strong>
        </li>
        <li>
          שבוע הריון: <strong>{exampleWeek}</strong>, {exampleTrimester}
        </li>
        <li>
          אם המחזור היה 35 ימים, התאריך זז שבוע קדימה ל-<strong>{formatLong(longCycle.dueDay)}</strong>
        </li>
        <li>
          התעברות ב-{formatLong(day('2026-01-29'))} נותנת <strong>{formatLong(conception.dueDay)}</strong>, אותו תאריך
          כמו וסת שהתחילה ב-15 בינואר
        </li>
      </ul>

      <h2>בדיקות מקובלות לפי שבוע הריון</h2>
      <p>
        הטבלה מבוססת על{' '}
        <a href={MACCABI_TESTS_URL} rel="noopener" target="_blank">
          לוח הבדיקות של מכבי שירותי בריאות
        </a>
        , עם התאריכים שמתקבלים בדוגמה. התזמון המדויק נקבע אצל הרופא, ובקופות אחרות הוא עשוי להיות מעט שונה.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>בדיקות בהריון לפי שבוע, עם התאריכים בדוגמה</caption>
          <thead>
            <tr>
              <th scope="col">בדיקה</th>
              <th scope="col">שבועות</th>
              <th scope="col">תאריכים בדוגמה</th>
            </tr>
          </thead>
          <tbody>
            {example.milestones.map((milestone) => (
              <tr key={milestone.id}>
                <th scope="row">{milestone.title}</th>
                <td>
                  {milestone.fromWeek} עד {milestone.toWeek}
                </td>
                <td>
                  {formatShort(milestone.startDay)} עד {formatShort(milestone.endDay)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul>
        <li>
          <strong>סקירת מערכות מוקדמת</strong> היא בדיקה פרטית ואינה כלולה בסל הבריאות, לפי אתר כמזה. הסקירה המאוחרת
          היא הבדיקה המרכזית.
        </li>
        <li>
          <strong>שקיפות עורפית</strong> נעשית משבוע 11 ועד שבוע 13 ושישה ימים, ומשלבת אולטרסאונד ובדיקת דם (
          <a href={MACCABI_NUCHAL_URL} rel="noopener" target="_blank">
            מכבי
          </a>
          ).
        </li>
        <li>
          <strong>העמסת סוכר</strong> של 50 גרם נהוג לבצע בין שבוע 24 ל-28, בלי צום (
          <a href={MACCABI_GLUCOSE_URL} rel="noopener" target="_blank">
            מכבי
          </a>
          ). מי שנמצאת בסיכון מוגבר לסוכרת הריון עשויה להיבדק מוקדם יותר, לפי הרופא.
        </li>
      </ul>

      <h2>מה לזכור</h2>
      <ul>
        <li>
          <strong>אולטרסאונד מכריע.</strong> לפי{' '}
          <a href={ACOG_DATING_URL} rel="noopener" target="_blank">
            ACOG
          </a>
          , מדידה בשליש הראשון היא השיטה המדויקת ביותר לקביעת גיל ההריון, והתאריך שנקבע במעקב הוא הקובע.
        </li>
        <li>
          <strong>תאריך הוא נקודה בטווח.</strong> לידה בשלב מלא מתרחשת סביב שבועות 39 עד 40 ושישה ימים, והמחשבון מציג
          את הטווח הזה.
        </li>
        <li>
          <strong>זה לא ייעוץ רפואי.</strong> שאלות על התקדמות ההריון הן לרופא או למיילדת.
        </li>
      </ul>

      <h2>מקורות</h2>
      <ul>
        <li>
          <a href={MACCABI_TESTS_URL} rel="noopener" target="_blank">
            מכבי שירותי בריאות: בדיקות בהריון
          </a>
          : טווחי שבועות לאולטרסאונד, סקירות ותבחין משולש (נבדק ב-{REVIEWED})
        </li>
        <li>
          <a href={MACCABI_NUCHAL_URL} rel="noopener" target="_blank">
            מכבי: שקיפות עורפית
          </a>
          : שבוע 11 עד 13 ושישה ימים (נבדק ב-{REVIEWED})
        </li>
        <li>
          <a href={MACCABI_GLUCOSE_URL} rel="noopener" target="_blank">
            מכבי: בדיקת העמסת סוכר בהריון
          </a>
          : שבועות 24 עד 28 (נבדק ב-{REVIEWED})
        </li>
        <li>
          <a href={ACOG_DATING_URL} rel="noopener" target="_blank">
            ACOG Committee Opinion 700: Methods for Estimating the Due Date
          </a>
          : קביעת תאריך לידה לפי וסת ואולטרסאונד (נבדק ב-{REVIEWED})
        </li>
      </ul>
    </ToolLayout>
  )
}
