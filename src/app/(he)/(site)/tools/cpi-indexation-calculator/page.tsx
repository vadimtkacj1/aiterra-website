import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import CpiIndexationCalculator from '../../components/tools/CpiIndexationCalculator'
import {
  CBS_CALCULATOR_URL,
  CBS_SCHEDULE_URL,
  DATA_CHECKED,
  DATA_SOURCE_URL,
  changeText,
  embeddedData,
  exampleResult,
  formatCoefficient,
  formatIndex,
  formatMoney,
  formatMonth,
  formatShortDay,
  linkRows,
  publicationDay,
  recentRows,
  type CpiResult,
} from '@/lib/cpi-indexation'
import styles from './page.module.css'

const PATH = '/tools/cpi-indexation-calculator'
const TITLE = 'מחשבון הצמדה למדד'
const META_TITLE = 'מחשבון הצמדה למדד: שכר דירה, מדד ידוע ובגין'
const DESCRIPTION =
  'מחשבון הצמדה למדד המחירים לצרכן לפי נתוני הלמ״ס: שכר דירה צמוד למדד וכל סכום, לפי מדד ידוע או מדד בגין, עם שרשור בסיסים, רצפה והודעה מוכנה.'

const INTEREST_LAW =
  'https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%A4%D7%A1%D7%99%D7%A7%D7%AA_%D7%A8%D7%99%D7%91%D7%99%D7%AA_%D7%95%D7%94%D7%A6%D7%9E%D7%93%D7%94'

const blank = { fromMonth: '', fromYear: '', toMonth: '', toYear: '' }

const example = (amount: string, fromDate: string, toDate: string): CpiResult => {
  const result = exampleResult({ method: 'known', amount, fromDate, toDate, ...blank })
  if (!result) throw new Error(`CPI example ${fromDate} -> ${toDate} has no data`)
  return result
}

const rentExample = example('5000', '2025-11-10', '2026-11-01')
const chainExample = example('10000', '2023-01-01', '2026-11-01')
const fallExample = example('6000', '2026-09-20', '2026-11-01')

const data = embeddedData()
const latestPoint = data.points.get(data.latest)
const rows = recentRows(13)
const tableBase = rows[0]?.base ?? ''
const links = linkRows()

const sources = [
  {
    href: CBS_SCHEDULE_URL,
    label: 'הלשכה המרכזית לסטטיסטיקה: תחזית פרסום של הודעות לתקשורת',
    note: 'מדדי המחירים מתפרסמים ב-15 בחודש בשעה 18:30. כשה-15 חל ביום שישי, בערב חג, בשבת או בחג, הם מתפרסמים ביום שישי או בערב החג בשעה 14:00',
  },
  {
    href: DATA_SOURCE_URL,
    label: 'ה-API של הלמ״ס: סדרת מדד המחירים לצרכן הכללי (קוד 120010) עם מקדמי הקשר',
    note: `ממנו לקחנו את ערכי המדד מינואר 2000 עד ${formatMonth(data.latest)} ואת מקדמי הקשר בין הבסיסים. מדדים חדשים יותר המחשבון טוען מאותו API`,
  },
  {
    href: CBS_CALCULATOR_URL,
    label: 'הלשכה המרכזית לסטטיסטיקה: מחשבון הצמדה למדדים',
    note: 'השווינו אליו 10 חישובים בין 2000 ל-2026, והתוצאות זהות עד האגורה',
  },
  {
    href: INTEREST_LAW,
    label: 'חוק פסיקת ריבית והצמדה, התשכ״א-1961, סעיף 1 (ויקיטקסט)',
    note: 'הגדרת הפרשי הצמדה: הסכום כפול המדד החדש וחלקי המדד היסודי, כשהמדד החדש הוא המדד הידוע בעת העדכון',
  },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'cpi-faq-known',
    question: 'מה זה מדד ידוע?',
    answer:
      'המדד הידוע ביום מסוים הוא המדד האחרון שהלשכה המרכזית לסטטיסטיקה פרסמה לפני אותו יום. המדד של כל חודש מתפרסם ב-15 בחודש שאחריו, ולכן ב-1 בנובמבר המדד הידוע הוא מדד ספטמבר. מ-16 בנובמבר המדד הידוע הוא מדד אוקטובר. חוזה שכירות יכול לקבוע, למשל, שמדד הבסיס הוא המדד הידוע ביום החתימה, ושכל תשלום מתעדכן לפי המדד הידוע ביום התשלום.',
  },
  {
    id: 'cpi-faq-difference',
    question: 'מה ההבדל בין מדד ידוע למדד בגין?',
    answer:
      'מדד בגין הוא המדד של החודש עצמו: מדד בגין אוקטובר הוא המדד שמודד את המחירים באוקטובר, והוא מתפרסם רק ב-15 בנובמבר. מדד ידוע הוא המדד שכבר פורסם ביום התשלום. ההבדל הוא בדרך כלל חודש או חודשיים, ולכן אותו חוזה נותן סכום אחר לפי השיטה. בחוזה צריך להיות כתוב באיזו שיטה מחשבים, ובמחשבון בוחרים את אותה שיטה.',
  },
  {
    id: 'cpi-faq-rent',
    question: 'איך מחשבים שכר דירה צמוד למדד?',
    answer:
      'מכפילים את שכר הדירה שבחוזה במדד החדש ומחלקים במדד הבסיס. למשל, שכר דירה של 5,000 ₪ עם מדד בסיס של 103.6 נקודות ומדד חדש של 105.3 נקודות הוא 5,000 כפול 105.3 חלקי 103.6, כלומר 5,082.05 ₪. מדד הבסיס ומועד העדכון כתובים בסעיף ההצמדה בחוזה. במחשבון מזינים את שכר הדירה, את תאריך הבסיס ואת תאריך התשלום.',
  },
  {
    id: 'cpi-faq-publish',
    question: 'מתי מתפרסם מדד המחירים לצרכן?',
    answer:
      'ב-15 בכל חודש בשעה 18:30, והוא מודד את המחירים בחודש הקודם. כשה-15 חל ביום שישי או בערב חג, המדד מתפרסם באותו יום בשעה 14:00, וכשה-15 חל בשבת או בחג, הוא מתפרסם ביום שישי או בערב החג שלפניו בשעה 14:00. כך כתוב בלוח הפרסומים של הלשכה המרכזית לסטטיסטיקה. המחשבון מעדכן את המדד האחרון ישירות מהלמ״ס.',
  },
  {
    id: 'cpi-faq-negative',
    question: 'מה קורה לשכר הדירה כשהמדד יורד?',
    answer:
      'אם החוזה לא אומר אחרת, הצמדה פועלת בשני הכיוונים, ושכר הדירה יורד יחד עם המדד. יש חוזים שקובעים רצפה: שכר הדירה לא יורד מתחת לסכום שבחוזה גם כשהמדד נמוך ממדד הבסיס. לכן כשהמדד יורד, המחשבון מציג שני סכומים, בלי רצפה ועם רצפה, ובוחרים לפי מה שכתוב בסעיף ההצמדה.',
  },
  {
    id: 'cpi-faq-diff',
    question: 'למה קיבלתי תוצאה שונה במחשבון אחר?',
    answer:
      'בדרך כלל בגלל מדד בסיס אחר: מדד ידוע במקום מדד בגין, או חודש אחר. סיבה שנייה היא שרשור: כשהבסיס של המדד משתנה, צריך להכפיל במקדם הקשר של הלמ״ס, ומחשבונים פשוטים מדלגים על זה. גם המחשבון של הלמ״ס מניח שהמדד מתפרסם תמיד ב-15 בחודש, ולכן בחודשים שבהם ה-15 חל בשבת הוא יכול לבחור מדד אחר ליום ה-14 או ה-15.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

const knownLine = (result: CpiResult) =>
  `${formatMonth(result.from.key)}, ${formatIndex(result.from.point.value)} נקודות`

export default function CpiIndexationCalculatorPage() {
  const monthlyChange = latestPoint
    ? `${latestPoint.percent < 0 ? 'ירידה' : 'עלייה'} של ${Math.abs(latestPoint.percent).toFixed(1)}% מהחודש הקודם`
    : ''
  const latestText = latestPoint
    ? `המדד האחרון שפורסם, מדד ${formatMonth(data.latest)}, עומד על ${formatIndex(latestPoint.value)} נקודות (בסיס ${latestPoint.base}), ${monthlyChange}.`
    : ''

  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede={`סכום צמוד למדד שווה לסכום הבסיס כפול המדד החדש וחלקי מדד הבסיס, לפי נתוני הלשכה המרכזית לסטטיסטיקה. ${latestText}`}
      chips={['שכר דירה וכל סכום', 'מדד ידוע או מדד בגין', 'שרשור בסיסים ורצפה', 'הודעה מוכנה למשכיר']}
      tool={<CpiIndexationCalculator />}
      faq={faq}
      cta={{
        text: 'מחירונים, חוזים ותשלומים שמתעדכנים לבד לפי המדד: אנחנו בונים מערכות CRM שמצמידות אותם אוטומטית.',
        label: 'פיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2 id="rent" className={styles.anchor}>
        שכר דירה צמוד למדד: איך מחשבים
      </h2>
      <p>
        שכר דירה צמוד למדד רק אם החוזה קובע זאת, והחוזה הוא גם מה שקובע איך מחשבים. לפני החישוב מוצאים בסעיף ההצמדה
        ארבעה דברים:
      </p>
      <ul>
        <li>
          <strong>מדד הבסיס.</strong> לרוב ״המדד הידוע ביום חתימת החוזה״, ולפעמים מדד של חודש מסוים, למשל ״מדד חודש
          ינואר 2026״.
        </li>
        <li>
          <strong>המדד לעדכון.</strong> המדד הידוע ביום התשלום, או המדד בגין החודש שעליו משלמים.
        </li>
        <li>
          <strong>כל כמה זמן מעדכנים.</strong> יש חוזים שמעדכנים כל חודש, ויש שמעדכנים פעם בשנה או רק בתקופת
          האופציה.
        </li>
        <li>
          <strong>האם יש רצפה.</strong> כלומר אם שכר הדירה יכול לרדת מתחת לסכום שבחוזה כשהמדד יורד.
        </li>
      </ul>
      <p>
        הנוסחה זהה בכל מקרה: שכר הדירה החדש הוא שכר הדירה שבחוזה, כפול המדד החדש, חלקי מדד הבסיס. זו גם ההגדרה של
        הפרשי הצמדה ב
        <a href={INTEREST_LAW} rel="noopener" target="_blank">
          סעיף 1 לחוק פסיקת ריבית והצמדה
        </a>
        , שבו ״המדד החדש״ הוא המדד הידוע בעת העדכון.
      </p>
      <h3>דוגמה: שכר דירה של 5,000 ₪</h3>
      <p>
        החוזה נחתם ב-10 בנובמבר 2025, ושכר הדירה צמוד למדד הידוע ביום החתימה. באותו יום המדד הידוע היה מדד{' '}
        {knownLine(rentExample)}, שפורסם ב-{formatShortDay(rentExample.from.published)}. לתשלום של 1 בנובמבר 2026
        המדד הידוע הוא מדד {formatMonth(rentExample.to.key)}, {formatIndex(rentExample.to.point.value)} נקודות. החישוב:
      </p>
      <p className={styles.formula} dir="ltr">
        5,000 × {formatIndex(rentExample.to.point.value)} ÷ {formatIndex(rentExample.from.point.value)} ={' '}
        {formatMoney(rentExample.indexed)}
      </p>
      <p>
        המדד {changeText(rentExample.changePercent)}, ושכר הדירה לנובמבר 2026 הוא {formatMoney(rentExample.indexed)},{' '}
        {formatMoney(rentExample.indexed - rentExample.amount)} יותר מהסכום שבחוזה. המחשבון נותן את אותה תוצאה, וגם
        הודעה מוכנה עם המדדים והסכום, להעתקה לשוכר או למשכיר.
      </p>

      <h2 id="known" className={styles.anchor}>
        מדד ידוע ומדד בגין
      </h2>
      <p>
        <strong>מדד בגין</strong> חודש מסוים הוא המדד שמודד את המחירים באותו חודש. מדד בגין אוקטובר 2026, למשל, מודד
        את אוקטובר ומתפרסם רק ב-15 בנובמבר 2026.
      </p>
      <p>
        <strong>מדד ידוע</strong> ביום מסוים הוא המדד האחרון שפורסם לפני אותו יום. מכיוון שמדד מתפרסם ב-15 בחודש
        שאחרי, בימים 1 עד 15 בחודש המדד הידוע הוא המדד של לפני חודשיים, ומ-16 בחודש הוא המדד של החודש הקודם. למשל:
      </p>
      <ul>
        <li>ב-1 בנובמבר 2026 המדד הידוע הוא מדד ספטמבר 2026, שפורסם ב-15 באוקטובר.</li>
        <li>ב-15 בנובמבר 2026 המדד הידוע עדיין מדד ספטמבר, כי מדד אוקטובר מתפרסם רק בערב.</li>
        <li>מ-16 בנובמבר 2026 המדד הידוע הוא מדד אוקטובר 2026.</li>
      </ul>
      <p>
        לפי לוח הפרסומים של הלמ״ס, מדדי המחירים מתפרסמים ב-15 בחודש בשעה 18:30. כשה-15 חל ביום שישי או בערב חג,
        הם מתפרסמים באותו יום בשעה 14:00, וכשה-15 חל בשבת או בחג, הם מתפרסמים ביום שישי או בערב החג שלפניו בשעה
        14:00. למשל, מדד אוקטובר 2025 פורסם ביום שישי, 14 בנובמבר 2025, כי ה-15 חל בשבת. המחשבון מחשב את יום הפרסום
        לפי הכלל הזה, ובימים כאלה הוא משתמש במדד שכבר פורסם, בעוד שהמחשבון של הלמ״ס מניח פרסום ב-15.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>
            מדד המחירים לצרכן ב-13 החודשים האחרונים, בסיס {tableBase} = 100
          </caption>
          <thead>
            <tr>
              <th scope="col">חודש המדד</th>
              <th scope="col">המדד</th>
              <th scope="col">שינוי מהחודש הקודם</th>
              <th scope="col">פורסם ב-</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <th scope="row">{row.month}</th>
                <td>
                  <span className={styles.nowrap}>{row.value}</span>
                  {row.base !== tableBase ? <span className={styles.law}>בסיס {row.base}</span> : null}
                </td>
                <td dir="ltr" className={styles.numberCell}>
                  {row.percent}
                </td>
                <td className={styles.nowrap}>{row.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.reviewed}>
        השינוי החודשי הוא השיעור שהלמ״ס מפרסמת. כל מדד הוא המדד הידוע מהיום שאחרי הפרסום שלו ועד הפרסום הבא. הטבלה
        נכונה ל-{DATA_CHECKED}, והמחשבון עצמו טוען מדדים חדשים יותר מהלמ״ס.
      </p>

      <h2 id="negative" className={styles.anchor}>
        מדד שלילי: מה קורה כשהמדד יורד
      </h2>
      <p>
        המדד יכול לרדת, ובחודשים האחרונים זה קרה כמה פעמים, כפי שרואים בטבלה. אם החוזה לא אומר אחרת, ההצמדה פועלת
        בשני הכיוונים, והסכום יורד יחד עם המדד. יש חוזים שקובעים רצפה: הסכום לא יורד מתחת לסכום הבסיס, גם כשהמדד
        החדש נמוך ממדד הבסיס.
      </p>
      <p>
        דוגמה: שכר דירה של 6,000 ₪, ומדד הבסיס הוא מדד {knownLine(fallExample)}. לתשלום של 1 בנובמבר 2026 המדד הידוע
        הוא מדד {formatMonth(fallExample.to.key)}, {formatIndex(fallExample.to.point.value)} נקודות. המדד{' '}
        {changeText(fallExample.changePercent)}, ולכן בלי רצפה שכר הדירה הוא {formatMoney(fallExample.indexed)}, ועם
        רצפה הוא נשאר {formatMoney(fallExample.floored)}. כשהמדד יורד, המחשבון מציג את שני הסכומים.
      </p>

      <h2 id="chain" className={styles.anchor}>
        שרשור מדדים: כשהבסיס משתנה
      </h2>
      <p>
        מדי כמה שנים, ובשנים האחרונות כל שנתיים, הלמ״ס מחליפה את בסיס המדד: הממוצע של שנה מסוימת נקבע ל-100 נקודות.
        מינואר 2025 המדד מתפרסם בבסיס 2024 ממוצע, ובשנתיים שלפני כן הוא פורסם בבסיס 2022 ממוצע. כדי להשוות מדדים מבסיסים שונים, מכפילים את המדד החדש במקדם
        הקשר שהלמ״ס מפרסמת לכל החלפת בסיס, ואם עברו כמה החלפות, במכפלה של המקדמים.
      </p>
      <p>
        דוגמה: 10,000 ₪ צמודים למדד הידוע ב-1 בינואר 2023, מדד {formatMonth(chainExample.from.key)},{' '}
        {formatIndex(chainExample.from.point.value)} נקודות בבסיס {chainExample.from.point.base}. ב-1 בנובמבר 2026 המדד
        הידוע הוא מדד {formatMonth(chainExample.to.key)}, {formatIndex(chainExample.to.point.value)} נקודות בבסיס{' '}
        {chainExample.to.point.base}. מקדם הקשר בין שני הבסיסים הוא {formatCoefficient(chainExample.coefficient)}, ולכן:
      </p>
      <p className={styles.formula} dir="ltr">
        10,000 × {formatIndex(chainExample.to.point.value)} × {formatCoefficient(chainExample.coefficient)} ÷{' '}
        {formatIndex(chainExample.from.point.value)} = {formatMoney(chainExample.indexed)}
      </p>
      <p>
        בלי השרשור, החלוקה של {formatIndex(chainExample.to.point.value)} ב-{formatIndex(chainExample.from.point.value)}{' '}
        הייתה מראה ירידה, בעוד שבפועל המדד {changeText(chainExample.changePercent)}. המחשבון משרשר לבד, לפי המקדמים
        בטבלה:
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>מקדמי הקשר בין בסיסי מדד המחירים לצרכן, לפי הלמ״ס</caption>
          <thead>
            <tr>
              <th scope="col">מבסיס</th>
              <th scope="col">לבסיס</th>
              <th scope="col">מקדם קשר</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.base}>
                <th scope="row">{link.base}</th>
                <td>{link.previous}</td>
                <td>{link.coefficient}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="how" className={styles.anchor}>
        איך המחשבון עובד
      </h2>
      <ul>
        <li>
          <strong>הנתונים.</strong> ערכי מדד המחירים לצרכן הכללי מינואר 2000 שמורים בכלי, כפי שפורסמו ב-API של
          הלמ״ס. בכל כניסה הכלי בודק ב-API אם פורסם מדד חדש יותר מ{formatMonth(data.latest)}.
        </li>
        <li>
          <strong>מדד ידוע.</strong> לכל תאריך הכלי מוצא את המדד האחרון שפורסם לפני אותו יום, לפי לוח הפרסומים של
          הלמ״ס, כולל ימי שישי, שבתות וחגים.
        </li>
        <li>
          <strong>עיגול.</strong> המדדים הם הערכים המפורסמים, עם ספרה אחת אחרי הנקודה. הסכום מעוגל לאגורות רק בסוף.
          השווינו 10 חישובים למחשבון של הלמ״ס, והתוצאות זהות עד האגורה.
        </li>
        <li>
          <strong>מה הכלי לא עושה.</strong> הוא לא מחשב ריבית, ולא עדכון שנתי או חלקי לפי תנאים מיוחדים בחוזה. מדד
          תשומות הבנייה ומדדים אחרים לא כלולים. לחובות שבית משפט פסק יש כללים נוספים בחוק פסיקת ריבית והצמדה.
        </li>
      </ul>
      <p>
        החישוב משתמש בנתוני הלשכה המרכזית לסטטיסטיקה ובשיטת השרשור שלה. אופן ההצמדה, כלומר מדד הבסיס, מדד ידוע או מדד
        של חודש מסוים, ואם מותרת הפחתה כשהמדד יורד, נקבע בחוזה שלכם. בדקו את סעיף ההצמדה לפני תשלום או דרישה. זה מידע
        כללי ולא ייעוץ משפטי. לחישוב ימים ותאריכי תשלום אפשר להיעזר גם ב
        <Link href="/tools/work-days-calculator">מחשבון ימי העבודה</Link>.
      </p>

      <h2>מקורות</h2>
      <ul className={styles.sources}>
        {sources.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noopener" target="_blank">
              {source.label}
            </a>
            : {source.note}.
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        הנתונים והכללים נבדקו מול הלשכה המרכזית לסטטיסטיקה ב-{DATA_CHECKED}. המדד של {formatMonth(data.latest)}{' '}
        פורסם ב-{formatShortDay(publicationDay(data.latest))}.
      </p>
    </ToolLayout>
  )
}
