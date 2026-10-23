import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import SleepCycleCalculator from '../../components/tools/SleepCycleCalculator'
import {
  DEFAULT_CYCLE_MINUTES,
  DEFAULT_FALL_ASLEEP_MINUTES,
  bedtimesForWake,
  parseTime,
} from '@/lib/sleep-cycles'
import styles from '../../components/tools/FunTable.module.css'

const PATH = '/tools/sleep-cycle-calculator'
const TITLE = 'מחשבון מחזורי שינה'
const META_TITLE = 'מחשבון מחזורי שינה: מתי ללכת לישון ומתי לקום'
const DESCRIPTION =
  'מחשבון מחזורי שינה: מכניסים שעת קימה ומקבלים שעות שינה לפי מחזורים של 90 דקות ועוד זמן הירדמות, או להפך. אפשר לשנות אורך מחזור. הערכה כללית, לא רפואית.'

const SLEEP_FOUNDATION_URL = 'https://www.sleepfoundation.org/stages-of-sleep'
const NHLBI_STAGES_URL = 'https://www.nhlbi.nih.gov/health/sleep/stages-of-sleep'
const NHLBI_AMOUNT_URL = 'https://www.nhlbi.nih.gov/health/sleep/how-much-sleep'
const REVIEWED = '23.10.2026'

const wakeExamples = ['06:00', '06:30', '07:00', '08:00'].map((wake) => {
  const clock = parseTime(wake) ?? 0
  const options = bedtimesForWake({
    clock,
    cycleMinutes: DEFAULT_CYCLE_MINUTES,
    fallAsleepMinutes: DEFAULT_FALL_ASLEEP_MINUTES,
  })
  return { wake, times: options.map((option) => option.time) }
})

const faq: ToolFaqEntry[] = [
  {
    id: 'sleep-faq-length',
    question: 'כמה זמן נמשך מחזור שינה?',
    answer:
      'לפי Sleep Foundation, מחזור שינה נמשך בממוצע כ-90 דקות. המחזור הראשון קצר יותר, בין 70 ל-100 דקות, ומחזורים מאוחרים יותר נמשכים בין 90 ל-120 דקות. לפי המכון הלאומי ללב, לריאות ולדם בארצות הברית, המחזור חוזר כל 80 עד 100 דקות. לכן המחשבון מאפשר לשנות את אורך המחזור.',
  },
  {
    id: 'sleep-faq-cycles',
    question: 'כמה מחזורי שינה יש בלילה?',
    answer:
      'בלילה רגיל עוברים בין ארבעה לשישה מחזורי שינה, לפי Sleep Foundation והמכון הלאומי ללב, לריאות ולדם. שישה מחזורים של 90 דקות הם תשע שעות, חמישה הם שבע שעות וחצי וארבעה הם שש שעות. המחשבון מציג את שלוש האפשרויות האלה, ולצדן אם סך השינה נמצא בטווח המומלץ לבוגרים.',
  },
  {
    id: 'sleep-faq-latency',
    question: 'למה מוסיפים זמן הירדמות?',
    answer:
      'המחזורים נספרים מהרגע שנרדמים ולא מהרגע שנכנסים למיטה. המחשבון מוסיף 15 דקות כברירת מחדל, אבל זה ערך שנבחר כהנחה נפוצה במחשבונים כאלה ולא נתון קבוע. מי שנרדם תוך חמש דקות או מתהפך חצי שעה יכול לשנות אותו, והשעות יתעדכנו מיד.',
  },
  {
    id: 'sleep-faq-hours',
    question: 'כמה שעות שינה צריך בוגר?',
    answer:
      'לפי המכון הלאומי ללב, לריאות ולדם בארצות הברית, מומלץ שבוגרים ישנו בין 7 ל-9 שעות בלילה. מי שישן פחות מ-7 שעות עלול לסבול מיותר בעיות בריאות, ושינה של יותר מ-9 שעות לא בהכרח מזיקה. הצרכים משתנים בין אנשים, ולילדים ולנוער הם גבוהים יותר, ולכן המחשבון מסמן רק אם סך השינה בטווח של בוגרים.',
  },
  {
    id: 'sleep-faq-wake',
    question: 'האם להתעורר בסוף מחזור באמת עוזר?',
    answer:
      'זו הנחה נפוצה ולא כלל מוכח. מחזורים משתנים באורכם בין אנשים ובין לילות, וכפי שמציין המכון הלאומי ללב, לריאות ולדם, אפשר להתעורר לרגע בין מחזורים. לכן שעת קימה שמחושבת לפי מחזורים היא הערכה, ולא הבטחה להתעורר רענן. מה שבטוח הוא שסך שעות השינה חשוב, ושעות קבועות מקלות על הגוף.',
  },
  {
    id: 'sleep-faq-medical',
    question: 'האם המחשבון מחליף ייעוץ רפואי?',
    answer:
      'לא. המחשבון מבוסס על ממוצעים ומיועד לתכנון יום רגיל, לא לאבחון. אם אתם ישנים מספיק שעות ובכל זאת מתעוררים עייפים, נרדמים במהלך היום, נוחרים חזק, או סובלים מקשיי הירדמות לאורך זמן, פנו לרופא המשפחה. הרופא יכול לברר אם מדובר בהפרעת שינה כמו דום נשימה בשינה או נדודי שינה.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function SleepCycleCalculatorPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="מחזור שינה נמשך בממוצע כ-90 דקות, ולכן מי שקם בשבע בבוקר ורוצה חמישה מחזורים צריך להיכנס למיטה ב-23:15, עם 15 דקות להירדם. כאן מכניסים שעת קימה או שעת כניסה למיטה ומקבלים את השעות לפי ארבעה עד שישה מחזורים."
      chips={['שעת שינה ושעת קימה', 'מחזורים של 90 דקות', 'אורך מחזור והירדמות מתכווננים', 'הערכה כללית, לא רפואית']}
      tool={<SleepCycleCalculator />}
      faq={faq}
      cta={{
        text: 'אנחנו בונים לעסקים מחשבונים ותזכורות בעברית שמחשבים נכון זמנים ושעות.',
        label: 'פיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>איך המחשבון מחשב מחזורי שינה</h2>
      <p>
        לפי{' '}
        <a href={SLEEP_FOUNDATION_URL} rel="noopener" target="_blank">
          Sleep Foundation
        </a>
        , מחזור שינה מורכב מארבעה שלבים, והוא נמשך בממוצע כ-90 דקות. בלילה רגיל עוברים בין ארבעה לשישה מחזורים.
        החישוב פשוט:
      </p>
      <ul>
        <li>
          <strong>מתי ללכת לישון:</strong> שעת הקימה פחות מספר המחזורים כפול אורך המחזור, פחות זמן ההירדמות.
        </li>
        <li>
          <strong>מתי לקום:</strong> שעת הכניסה למיטה ועוד זמן ההירדמות ועוד מספר המחזורים כפול אורך המחזור.
        </li>
        <li>
          <strong>מה שאפשר לשנות:</strong> אורך המחזור (70 עד 120 דקות) וזמן ההירדמות (0 עד 60 דקות).
        </li>
      </ul>

      <h2>שעות שינה לפי שעת קימה</h2>
      <p>
        הטבלה מראה, עם 90 דקות למחזור ו-15 דקות הירדמות, באיזו שעה להיכנס למיטה כדי לקום בשעה מסוימת.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>שעות כניסה למיטה לפי שעת קימה ומספר מחזורים</caption>
          <thead>
            <tr>
              <th scope="col">שעת קימה</th>
              <th scope="col">6 מחזורים (9 שעות)</th>
              <th scope="col">5 מחזורים (7:30)</th>
              <th scope="col">4 מחזורים (6 שעות)</th>
            </tr>
          </thead>
          <tbody>
            {wakeExamples.map((row) => (
              <tr key={row.wake}>
                <th scope="row">{row.wake}</th>
                {row.times.map((time, index) => (
                  <td key={index}>{time}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>כמה לישון ומה המחזורים לא אומרים</h2>
      <p>
        לפי{' '}
        <a href={NHLBI_AMOUNT_URL} rel="noopener" target="_blank">
          המכון הלאומי ללב, לריאות ולדם בארצות הברית
        </a>
        , מומלץ שבוגרים ישנו בין 7 ל-9 שעות בלילה. ארבעה מחזורים של 90 דקות הם שש שעות בלבד, ולכן המחשבון מסמן אותם
        כמתחת לטווח. חמישה מחזורים (7:30) ושישה (9 שעות) נופלים בטווח.
      </p>
      <ul>
        <li>
          <strong>הממוצע לא נוגע בכולם.</strong> לפי{' '}
          <a href={NHLBI_STAGES_URL} rel="noopener" target="_blank">
            המכון הלאומי ללב, לריאות ולדם
          </a>
          , המחזור חוזר כל 80 עד 100 דקות, ואפשר להתעורר לרגע בין מחזורים.
        </li>
        <li>
          <strong>המחזור הראשון קצר.</strong> לפי Sleep Foundation הוא נמשך 70 עד 100 דקות, ומחזורים מאוחרים 90 עד
          120.
        </li>
        <li>
          <strong>שעות קבועות חשובות.</strong> שעת קימה קבועה מועילה יותר מחישוב מדויק של מחזור אחד.
        </li>
        <li>
          <strong>זה לא ייעוץ רפואי.</strong> עייפות מתמשכת למרות שינה מספקת היא סיבה לפנות לרופא.
        </li>
      </ul>

      <h2>מקורות</h2>
      <ul>
        <li>
          <a href={SLEEP_FOUNDATION_URL} rel="noopener" target="_blank">
            Sleep Foundation: Stages of Sleep
          </a>
          : ארבעה שלבים, מחזור של כ-90 דקות, ארבעה עד שישה מחזורים בלילה (נבדק ב-{REVIEWED})
        </li>
        <li>
          <a href={NHLBI_STAGES_URL} rel="noopener" target="_blank">
            NHLBI (NIH): Sleep Phases and Stages
          </a>
          : מחזור כל 80 עד 100 דקות, ארבעה עד שישה מחזורים (נבדק ב-{REVIEWED})
        </li>
        <li>
          <a href={NHLBI_AMOUNT_URL} rel="noopener" target="_blank">
            NHLBI (NIH): How Much Sleep Is Enough
          </a>
          : 7 עד 9 שעות לבוגרים (נבדק ב-{REVIEWED})
        </li>
      </ul>
    </ToolLayout>
  )
}
