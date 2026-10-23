import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import RomanNumeralsConverter from '../../components/tools/RomanNumeralsConverter'
import { keyLetters, tableValues, toRoman } from '@/lib/roman-numerals'
import styles from './page.module.css'

const PATH = '/tools/roman-numerals-converter'
const TITLE = 'ממיר מספרים רומיים'
const META_TITLE = 'ממיר מספרים רומיים: מספר לרומי ורומי למספר'
const DESCRIPTION =
  'ממיר מספרים רומיים לשני הכיוונים, מ-1 עד 3999, עם בדיקת תקינות שאומרת מה הכתיב הנכון, וטבלה של מספרים רומיים מ-1 עד 20 ועד 3000.'
const CHECKED = '2026-10-23'

const faq: ToolFaqEntry[] = [
  {
    id: 'roman-faq-how',
    question: 'איך כותבים מספר ברומית?',
    answer:
      'מפרקים את המספר לאלפים, מאות, עשרות ואחדות, וכותבים כל חלק בנפרד משמאל לימין, מהגדול לקטן. 1994 הוא 1000 ועוד 900 ועוד 90 ועוד 4, כלומר M ו-CM ו-XC ו-IV, ויחד MCMXCIV. בכלי מקלידים את המספר ומקבלים את הכתיב התקני מיד.',
  },
  {
    id: 'roman-faq-zero',
    question: 'האם יש אפס במספרים רומיים?',
    answer:
      'לא. במערכת הרומית אין סימן לאפס, ולכן המספר הקטן ביותר הוא I, כלומר 1. בימי הביניים כתבו לפעמים את המילה nulla, ״כלום״ בלטינית, אבל זה לא חלק מהמערכת הרגילה. הכלי מציג הודעה כשמקלידים 0, ומבקש מספר מ-1. מי שרוצה לכתוב אפס בטקסט רומי בדרך כלל כותב אותו בספרה רגילה, 0.',
  },
  {
    id: 'roman-faq-max',
    question: 'מה המספר הרומי הגדול ביותר?',
    answer:
      'בכתיב הסטנדרטי המספר הגדול ביותר הוא 3999, שנכתב MMMCMXCIX, כי אין יותר משלוש M ברצף. יש מנהגים לכתוב מספרים גדולים יותר עם קו מעל האות, אבל הם לא אחידים, ולכן הכלי עובד בטווח של 1 עד 3999 בלבד, וממנו מקבלים תמיד כתיב תקני.',
  },
  {
    id: 'roman-faq-iiii',
    question: 'האם אפשר לכתוב 4 כ-IIII?',
    answer:
      'בכתיב המודרני התקני 4 הוא IV, ו-IIII נחשב שגוי. IIII נראה לפעמים על שעונים ובהם הוא מקובל מסיבות מסורת ועיצוב. הכלי מקבל רק כתיב תקני, וכשמקלידים IIII הוא מודיע שזה לא תקני ואומר ש-IV הוא הכתיב הנכון, כך שאפשר לתקן ולהמשיך מיד.',
  },
  {
    id: 'roman-faq-subtract',
    question: 'מתי אות קטנה לפני אות גדולה מחסירה?',
    answer:
      'רק בשישה צירופים: IV ו-IX, XL ו-XC, CD ו-CM, כלומר 4, 9, 40, 90, 400 ו-900. בכל צירוף האות הקטנה היא חזקה של עשר, ואפשר להחסיר אותה רק מהאות החמש או העשר הבאות אחריה. לכן 99 הוא XCIX ולא IC. כך גם 49 הוא XLIX ולא IL.',
  },
  {
    id: 'roman-faq-year',
    question: 'איך כותבים שנה ברומית, למשל 2026?',
    answer:
      'כותבים את השנה כמו כל מספר: 2000 הוא MM, 20 הוא XX ו-6 הוא VI, ויחד MMXXVI. נהוג לראות שנים בספרות רומיות על בניינים, על מצבות ובסוף סרטים. מקלידים את השנה בכלי, והכתיב התקני מופיע ואפשר להעתיק אותו בלחיצה, למשל להדבקה בכותרת או בהזמנה.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function RomanNumeralsConverterPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="במספרים רומיים כותבים 2026 כ-MMXXVI, ו-1994 כ-MCMXCIV. מקלידים כאן מספר רגיל ומקבלים את הכתיב הרומי, או מקלידים מספר רומי ומקבלים את הערך שלו, עם בדיקת תקינות שמסבירה מה לא נכון."
      chips={['שני כיוונים', '1 עד 3999', 'בדיקת תקינות', 'טבלת מספרים']}
      tool={<RomanNumeralsConverter />}
      faq={faq}
      cta={{
        text: 'צריכים כלי חישוב או המרה מותאם לעסק שלכם? אנחנו מפתחים כלים כאלה.',
        label: 'לפיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>איך קוראים וכותבים מספרים רומיים</h2>
      <p>
        המערכת הרומית משתמשת בשבע אותיות. מחברים אותן מהגדולה לקטנה, והערכים מצטרפים:
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>שבע האותיות הרומיות</caption>
          <thead>
            <tr>
              <th scope="col">אות</th>
              <th scope="col">ערך</th>
            </tr>
          </thead>
          <tbody>
            {keyLetters.map((row) => (
              <tr key={row.letter}>
                <th scope="row" dir="ltr" className={styles.code}>
                  {row.letter}
                </th>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul>
        <li>
          <strong>חיבור:</strong> VIII הוא 5 ועוד 3, כלומר 8. עד שלוש אותיות זהות ברצף: III הוא 3, ו-IIII לא נכתב.
        </li>
        <li>
          <strong>חיסור:</strong> אות קטנה לפני גדולה מחסירה. IV הוא 4, IX הוא 9, XL הוא 40, XC הוא 90, CD הוא 400
          ו-CM הוא 900. אלה שש צורות החיסור היחידות.
        </li>
        <li>
          <strong>אין אפס:</strong> המספר הקטן ביותר הוא I, והגדול בכתיב הסטנדרטי הוא MMMCMXCIX, כלומר 3999.
        </li>
      </ul>

      <h2>טבלת מספרים רומיים</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>מספרים רומיים מ-1 עד 20 ועד 3000</caption>
          <thead>
            <tr>
              <th scope="col">מספר</th>
              <th scope="col">רומי</th>
            </tr>
          </thead>
          <tbody>
            {tableValues.map((value) => (
              <tr key={value}>
                <th scope="row">{value.toLocaleString('he-IL')}</th>
                <td dir="ltr" className={styles.code}>
                  {toRoman(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>איפה משתמשים היום במספרים רומיים</h2>
      <p>
        על לוחות שעון, בשנות הפקה בסוף סרטים, בפרקים וכרכים של ספרים, בשמות מלכים כמו אליזבת השנייה, בסרטי המשך
        כמו Rocky II ובמספור של הסופר בול. כשצריך לכתוב שנה או מספר סידורי כזה, הכלי נותן את הכתיב התקני.
      </p>

      <h2>מקורות</h2>
      <ul className={styles.sources}>
        <li>
          <a href="https://en.wikipedia.org/wiki/Roman_numerals" rel="noopener" target="_blank" lang="en" dir="ltr">
            Wikipedia: Roman numerals
          </a>
        </li>
      </ul>
      <p className={styles.reviewed}>
        הכללים נבדקו מול המקור ב-<time dateTime={CHECKED}>23.10.2026</time>.
      </p>
    </ToolLayout>
  )
}
