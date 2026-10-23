import Link from 'next/link'
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

const tensToHundred = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
const notableYears = [1948, 1967, 1973, 1990, 2000, 2026]
const decompositionNumbers = [444, 1994, 2026, 3888]

const decompose = (value: number) =>
  String(value)
    .split('')
    .map((digit, index, digits) => Number(digit) * 10 ** (digits.length - 1 - index))
    .filter((part) => part > 0)

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
  {
    id: 'roman-faq-1900s',
    question: 'איך כותבים שנה מהמאה ה-20, כמו 1912?',
    answer:
      'MCM הוא 1000 ועוד 1000 פחות 100, כלומר 1900, ולכן 1912 נכתב MCMXII. שנה מהמאה ה-21 מתחילה ב-MM, ולכן 2026 היא MMXXVI. הטעות הנפוצה היא לכתוב MDCCCCXII, שהוא כתיב ארוך ולא תקני. מקלידים את השנה בכלי ומקבלים את הכתיב הקצר והנכון.',
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

      <h2>מספרים רומיים עד 10, עד 20 ועד 100</h2>
      <p>
        עד 10 מספיקות שלוש אותיות: I, V ו-X. מ-11 עד 20 מוסיפים אחרי X את הספרה: XI, XII ועד XX. מ-20 עד 100 כותבים
        קודם את העשרות ואחריהן את האחדות, למשל 47 הוא XLVII, כלומר XL ועוד VII. הטבלה מציגה את העשרות עד 100,
        ואחריה אפשר לחבר כל ספרה בסוף.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>עשרות במספרים רומיים עד 100</caption>
          <thead>
            <tr>
              <th scope="col">מספר</th>
              <th scope="col">רומי</th>
            </tr>
          </thead>
          <tbody>
            {tensToHundred.map((value) => (
              <tr key={value}>
                <th scope="row">{value}</th>
                <td dir="ltr" className={styles.code}>
                  {toRoman(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        מאה היא C, ו-1000 היא M. אחרי 100 ממשיכים באותו עיקרון: מאות, ואז עשרות, ואז אחדות. 144 הוא <span dir="ltr">{toRoman(144)}</span>, כלומר
        C ועוד XL ועוד IV.
      </p>

      <h2>איך מפרקים מספר לרומית צעד אחר צעד</h2>
      <p>
        הדרך הבטוחה היא לפרק את המספר לפי מקומות ולכתוב כל חלק בנפרד. הטבלה מראה את הפירוק של ארבעה מספרים, כולל
        3888, המספר שנכתב בהכי הרבה אותיות בטווח 1 עד 3999.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>פירוק מספרים לפי מקומות</caption>
          <thead>
            <tr>
              <th scope="col">מספר</th>
              <th scope="col">פירוק</th>
              <th scope="col">רומי</th>
            </tr>
          </thead>
          <tbody>
            {decompositionNumbers.map((value) => (
              <tr key={value}>
                <th scope="row">{value.toLocaleString('he-IL')}</th>
                <td dir="ltr" className={styles.code}>
                  {decompose(value)
                    .map((part) => toRoman(part))
                    .join(' + ')}
                </td>
                <td dir="ltr" className={styles.code}>
                  {toRoman(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>שנים ותאריכים במספרים רומיים</h2>
      <p>
        שנה נכתבת כמו כל מספר. אלה כמה שנים מוכרות, כפי שהכלי כותב אותן:
      </p>
      <ul>
        {notableYears.map((year) => (
          <li key={year}>
            <strong>{year}:</strong> <span dir="ltr">{toRoman(year)}</span>
          </li>
        ))}
      </ul>
      <p>
        בתאריך שלם כותבים כל חלק בנפרד, ולכן 23.10.2026 הוא <span dir="ltr">{toRoman(23)}.{toRoman(10)}.{toRoman(2026)}</span>.
        כדי לדעת כמה ימים עברו בין שני תאריכים כאלה, ממירים אותם חזרה למספרים ומשתמשים ב<Link href="/tools/days-between-dates">חישוב ימים בין שני תאריכים</Link>.
        לתאריך עברי של אותו יום יש <Link href="/tools/hebrew-date-converter">ממיר תאריך עברי</Link>.
      </p>

      <h2>מספרים רומיים להעתקה, בקעקוע ובעיצוב</h2>
      <p>
        מי שכותב מספר רומי לקעקוע, לחריטה או להדפסה בדרך כלל לא יכול לתקן אחר כך. הטעויות הנפוצות הן IIII במקום IV,
        IC במקום XCIX ו-IL במקום XLIX, וכולן לא תקניות. הקלידו את המספר בכלי, העתיקו את התוצאה והשוו אותה לתוכנית
        שלכם אות אחרי אות. אם אתם מחפשים חישוב דומה בעולם האותיות העבריות, כל אות עברית היא גם מספר, וה<Link href="/tools/gematria-calculator">מחשבון גימטריה</Link> מחשב את ערך המילה.
      </p>

      <h2>איך קוראים מספר רומי</h2>
      <p>
        קוראים משמאל לימין ובודקים כל אות מול האות שאחריה. אם האות הבאה גדולה יותר, מחסירים את הנוכחית. אחרת מוסיפים
        אותה. ב-<span dir="ltr">{toRoman(1994)}</span> האות M נותנת 1000, ואחריה CM שנותנת 900, אחריה XC שנותנת 90 ובסוף
        IV שנותנת 4. הסכום הוא 1994. אם יצא לכם רצף שלא תואם את הכללים, הדביקו אותו בכלי, והוא יסביר מה לא תקין.
      </p>

      <h2>איך בודקים שמספר רומי תקין</h2>
      <p>
        בכתיב התקני לא כותבים יותר משלוש אותיות זהות ברצף, והאותיות V, L ו-D לא חוזרות בתוך אותו חלק של המספר. אות
        קטנה לפני גדולה מותרת רק בשש הצורות שפירטנו למעלה, ולכן IIX אינו 8 (הכתיב הנכון הוא VIII), VX אינו 5 ו-MMMM אינו 4000, כי
        הכתיב הסטנדרטי מסתיים ב-3999. הכלי בודק את כל אלה ומציין מה הכתיב הנכון.
      </p>

      <h2>מאות ואלפים</h2>
      <p>
        אחרי 100 האותיות C, D ו-M נותנות את המאות והאלפים: 200 הוא <span dir="ltr">{toRoman(200)}</span>, 400 הוא{' '}
        <span dir="ltr">{toRoman(400)}</span>, 500 הוא <span dir="ltr">{toRoman(500)}</span>, 900 הוא{' '}
        <span dir="ltr">{toRoman(900)}</span>, ו-2000 הוא <span dir="ltr">{toRoman(2000)}</span>. עד 1000 כותבים M אחת,
        ואחריה אפשר להוסיף עוד שתיים בלבד, ולכן 3999 הוא הגבול העליון.
      </p>

      <h2>כמה ארוך כתיב רומי</h2>
      <p>
        הכתיב הרומי מתארך מהר: 888 נכתב <span dir="ltr">{toRoman(888)}</span>, כלומר {toRoman(888).length} אותיות, ו-3888
        נכתב <span dir="ltr">{toRoman(3888)}</span>, כלומר {toRoman(3888).length} אותיות, והוא הארוך ביותר בטווח. לכן
        בכותרות ובמספור פרקים מקובל להשתמש בו למספרים קטנים, שקל לקרוא במבט אחד.
      </p>

      <h2>למה עדיין רואים מספרים רומיים</h2>
      <p>
        ספרות רגילות החליפו את המערכת הרומית בהדרגה, אבל היא נשארה בשימוש בהקשרים מסוימים. לפי ויקיפדיה, אלה למשל
        לוחות שעון, שנים על אנדרטאות ובניינים ותאריכי זכויות יוצרים. בשעון של ביג בן, שתוכנן ב-1852, השעות מ-1 עד 12
        כתובות I עד XII.
      </p>
      <p>
        כדי לחשב כמה זמן עבר בין שתי שנים שכתובות ברומית, ממירים אותן חזרה למספרים ומחסרים. 2026 פחות 1994 הוא 32
        שנים.
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
        הכללים נבדקו מול המקור ב-<time dateTime={CHECKED}>23.10.2026</time>. מאותו עמוד לקוחות גם שעון ביג בן שתוכנן ב-1852, תאריכי זכויות יוצרים בסרטים, חישוב MCM כ-1900, מילת nulla לאפס מימי הביניים ופונקציית ROMAN באקסל.
      </p>
    </ToolLayout>
  )
}
