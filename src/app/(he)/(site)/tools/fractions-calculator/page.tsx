import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import FractionsCalculator from '../../components/tools/FractionsCalculator'
import {
  FRACTIONS_REVIEWED,
  formatFraction,
  formatMixed,
  lcm,
  simplify,
  toDecimal,
  type Fraction,
} from '@/lib/fractions-calculator'
import styles from './page.module.css'

const PATH = '/tools/fractions-calculator'
const TITLE = 'מחשבון שברים עם שלבים'
const META_TITLE = 'מחשבון שברים עם שלבי פתרון: חיבור, חיסור, כפל וחילוק'
const DESCRIPTION =
  'מחשבון שברים פשוטים ומספרים מעורבים: חיבור, חיסור, כפל, חילוק וצמצום, עם פתרון שלב אחר שלב בעברית, והתוצאה גם כמספר מעורב וכעשרוני.'

type Exercise = { left: Fraction; right: Fraction; symbol: '+' | '-' | '×' | '÷'; leftText: string; rightText: string }

const exercises: Exercise[] = [
  { left: { n: 1, d: 2 }, right: { n: 1, d: 3 }, symbol: '+', leftText: '1/2', rightText: '1/3' },
  { left: { n: 3, d: 4 }, right: { n: 1, d: 6 }, symbol: '-', leftText: '3/4', rightText: '1/6' },
  { left: { n: 2, d: 3 }, right: { n: 3, d: 4 }, symbol: '×', leftText: '2/3', rightText: '3/4' },
  { left: { n: 2, d: 5 }, right: { n: 3, d: 10 }, symbol: '÷', leftText: '2/5', rightText: '3/10' },
  { left: { n: 11, d: 4 }, right: { n: 5, d: 3 }, symbol: '+', leftText: '2 3/4', rightText: '1 2/3' },
]

const solve = ({ left, right, symbol }: Exercise): Fraction => {
  if (symbol === '×') return simplify({ n: left.n * right.n, d: left.d * right.d })
  if (symbol === '÷') return simplify({ n: left.n * right.d, d: left.d * right.n })
  const common = lcm(left.d, right.d)
  const leftN = left.n * (common / left.d)
  const rightN = right.n * (common / right.d)
  return simplify({ n: symbol === '+' ? leftN + rightN : leftN - rightN, d: common })
}

const commonFractions: Fraction[] = [
  { n: 1, d: 2 },
  { n: 1, d: 3 },
  { n: 1, d: 4 },
  { n: 3, d: 4 },
  { n: 1, d: 5 },
  { n: 1, d: 6 },
  { n: 1, d: 8 },
  { n: 2, d: 3 },
]

const percentText = (fraction: Fraction) => String(Number(((fraction.n / fraction.d) * 100).toFixed(1)))

const decimalToFraction: { decimal: string; fraction: Fraction }[] = [
  { decimal: '0.75', fraction: { n: 75, d: 100 } },
  { decimal: '0.6', fraction: { n: 6, d: 10 } },
  { decimal: '0.125', fraction: { n: 125, d: 1000 } },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'frac-faq-add',
    question: 'איך מחברים שברים עם מכנים שונים?',
    answer:
      'מוצאים מכנה משותף, בדרך כלל המכפלה המשותפת הקטנה ביותר של שני המכנים, ומרחיבים כל שבר אליו: מכפילים את המונה באותו מספר שבו הכפלנו את המכנה. אחר כך מחברים את המונים ומשאירים את המכנה. 1/2 ועוד 1/3 הם 3/6 ועוד 2/6, כלומר 5/6. הכלי מראה את כל השלבים האלה בתוצאה.',
  },
  {
    id: 'frac-faq-multiply',
    question: 'איך מכפילים ומחלקים שברים?',
    answer:
      'בכפל מכפילים מונה במונה ומכנה במכנה, ואז מצמצמים. 2/3 כפול 3/4 הוא 6/12, כלומר 1/2. בחילוק הופכים את השבר השני, מחליפים בין המונה למכנה, וכופלים. 1/2 חלקי 3/4 הוא 1/2 כפול 4/3, כלומר 2/3. אי אפשר לחלק בשבר שהמונה שלו אפס, והכלי מודיע על כך.',
  },
  {
    id: 'frac-faq-simplify',
    question: 'איך מצמצמים שבר?',
    answer:
      'מחפשים את הגורם המשותף הגדול ביותר של המונה והמכנה, ומחלקים בו את שניהם. 63/462 מצטמצם ב-21 ל-3/22. אם הגורם הוא 1, השבר כבר בצורתו הפשוטה ביותר. הכלי מצמצם אוטומטית כל תוצאה ואומר באיזה מספר חילק, ובמצב צמצום אפשר להקליד שבר ולראות רק את הצמצום שלו.',
  },
  {
    id: 'frac-faq-mixed',
    question: 'איך מקלידים מספר מעורב, כמו 2 ושלושה רבעים?',
    answer:
      'בשדה שלם מקלידים 2, במונה 3 ובמכנה 4. הכלי ממיר את המספר המעורב לשבר 11/4, באמצעות הכפלת השלם במכנה וחיבור המונה, ורק אז מבצע את החישוב. מספר שלילי כותבים עם מינוס בשדה השלם. את התוצאה הוא מציג גם כשבר רגיל, גם כמספר מעורב וגם כעשרוני.',
  },
  {
    id: 'frac-faq-decimal',
    question: 'איך הופכים שבר למספר עשרוני?',
    answer:
      'מחלקים את המונה במכנה: 3/4 הוא 0.75. כשהמכנה אחרי הצמצום מורכב רק מ-2 ו-5, התוצאה עשרונית סופית, כמו 0.75 או 0.125. בשאר המקרים היא מחזורית, כמו 1/3 שהוא 0.333, והכלי מציג אותה בקירוב של שש ספרות עם המילה בערך. הערך המדויק הוא תמיד השבר.',
  },
  {
    id: 'frac-faq-limits',
    question: 'עד כמה גדולים יכולים להיות המספרים?',
    answer:
      'אפשר להקליד מונה, מכנה ושלם של עד ארבע ספרות כל אחד, ומכנה שגדול מאפס. הגבלה הזאת שומרת שהחישוב יהיה מדויק ויישאר בטווח המספרים השלמים של הדפדפן. החישוב נעשה בדפדפן שלכם, ושום ערך לא נשלח לשרת או נשמר אחרי שסוגרים את העמוד.',
  },
  {
    id: 'frac-faq-whole',
    question: 'איך מכפילים שבר במספר שלם?',
    answer:
      'כותבים את המספר השלם כשבר עם מכנה 1, ואז מכפילים מונה במונה ומכנה במכנה. 3 כפול 2/5 הוא 3/1 כפול 2/5, כלומר 6/5, שהוא 1 ו-1/5. אפשר גם להכפיל את המונה בלבד ולהשאיר את המכנה. בכלי מקלידים 3 בשדה המונה ו-1 במכנה, בוחרים כפל ומקבלים את הפתרון.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function FractionsCalculatorPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="בשברים מחברים אחרי שמביאים למכנה משותף, מכפילים מונה במונה ומכנה במכנה, ומחלקים בהפיכת השבר השני. מקלידים כאן שני שברים או מספרים מעורבים ומקבלים את התוצאה המצומצמת עם כל שלבי הפתרון בעברית."
      chips={['חיבור, חיסור, כפל וחילוק', 'מספרים מעורבים', 'צמצום שבר', 'שלבי פתרון']}
      tool={<FractionsCalculator />}
      faq={faq}
      cta={{
        text: 'צריכים מחשבון או כלי לימוד מותאם לעסק שלכם? אנחנו מפתחים כלים כאלה.',
        label: 'לפיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>איך פותרים תרגילי שברים</h2>
      <p>
        לכל פעולה יש כלל קבוע, והכלי למעלה מדגים אותו על המספרים שהקלדתם:
      </p>
      <ul>
        <li>
          <strong>חיבור וחיסור:</strong> מביאים את שני השברים לאותו מכנה, ואז מחברים או מחסרים את המונים. את המכנה
          משאירים. 2/4 ועוד 3/4 הם 5/4.
        </li>
        <li>
          <strong>כפל:</strong> מכפילים מונה במונה ומכנה במכנה. 2/3 כפול 3/4 הוא 6/12.
        </li>
        <li>
          <strong>חילוק:</strong> כופלים בשבר ההפוך. 1/2 חלקי 3/4 הוא 1/2 כפול 4/3, כלומר 2/3.
        </li>
        <li>
          <strong>צמצום:</strong> מחלקים את המונה ואת המכנה בגורם המשותף הגדול ביותר שלהם.
        </li>
        <li>
          <strong>מספר מעורב לשבר:</strong> מכפילים את השלם במכנה ומוסיפים את המונה. 2 ושלושה רבעים הם 11/4.
        </li>
      </ul>

      <h2>איך בודקים תרגיל שפתרתם</h2>
      <p>
        פותרים את התרגיל בדף, מקלידים את אותו תרגיל בכלי ומשווים את התוצאה ואת השלבים. אם התוצאה שונה, השוו שלב אחרי
        שלב ובדקו איפה הדרכים נפרדות, בדרך כלל במכנה המשותף או בצמצום.
      </p>

      <h2>שברים פשוטים, מדומים ומעורבים</h2>
      <p>
        שבר פשוט הוא שבר שהמונה שלו קטן מהמכנה, כמו 3/4, וערכו קטן מ-1. שבר מדומה הוא שבר שהמונה שלו גדול מהמכנה או
        שווה לו, כמו 11/4. מספר מעורב הוא שלם ושבר פשוט יחד, כמו 2 ו-3/4, והוא אותו ערך כמו 11/4. מחשבון השברים
        למעלה מקבל את שלושת הסוגים, והתוצאה חוזרת גם כשבר, גם כמספר מעורב וגם כמספר עשרוני.
      </p>

      <h2>חמישה תרגילים פתורים</h2>
      <p>
        התוצאות בטבלה מחושבות באותן פעולות שהכלי מבצע: מכנה משותף לחיבור וחיסור, כפל ישיר, חילוק בשבר ההפוך
        וצמצום בסוף.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>תרגילים ותוצאותיהם</caption>
          <thead>
            <tr>
              <th scope="col">תרגיל</th>
              <th scope="col">תוצאה</th>
              <th scope="col">מספר מעורב</th>
              <th scope="col">עשרוני</th>
            </tr>
          </thead>
          <tbody>
            {exercises.map((exercise) => {
              const result = solve(exercise)
              return (
                <tr key={exercise.leftText + exercise.symbol + exercise.rightText}>
                  <th scope="row" dir="ltr" className={styles.code}>
                    {exercise.leftText} {exercise.symbol} {exercise.rightText}
                  </th>
                  <td dir="ltr" className={styles.code}>
                    {formatFraction(result)}
                  </td>
                  <td dir="ltr" className={styles.code}>
                    {formatMixed(result) ?? '-'}
                  </td>
                  <td dir="ltr" className={styles.code}>
                    {toDecimal(result).text}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p>
        בתרגיל האחרון הפכנו את המספרים המעורבים לשברים מדומים: 2 ו-3/4 הוא 11/4, ו-1 ו-2/3 הוא 5/3. המכנה המשותף
        הוא 12, ולכן מקבלים 33/12 ועוד 20/12, כלומר 53/12.
      </p>

      <h2>שבר לעשרוני ועשרוני לשבר</h2>
      <p>
        מעבירים שבר למספר עשרוני בחילוק המונה במכנה. הטבלה מראה שברים נפוצים עם הערך העשרוני והאחוזים שלהם, כפי
        שהכלי מחשב אותם. כשהתוצאה מחזורית, הכלי מציג קירוב של שש ספרות.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>שברים נפוצים כמספרים עשרוניים ואחוזים</caption>
          <thead>
            <tr>
              <th scope="col">שבר</th>
              <th scope="col">עשרוני</th>
              <th scope="col">אחוזים</th>
            </tr>
          </thead>
          <tbody>
            {commonFractions.map((fraction) => {
              const decimal = toDecimal(fraction)
              return (
                <tr key={formatFraction(fraction)}>
                  <th scope="row" dir="ltr" className={styles.code}>
                    {formatFraction(fraction)}
                  </th>
                  <td dir="ltr" className={styles.code}>
                    {decimal.exact ? decimal.text : decimal.text + ' (בערך)'}
                  </td>
                  <td dir="ltr" className={styles.code}>
                    {percentText(fraction)}%
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p>
        הכלי לא מקבל מספר עשרוני כקלט. כדי להפוך עשרוני לשבר, כותבים אותו כשבר עם מכנה 10, 100 או 1000 לפי מספר
        הספרות אחרי הנקודה, ומצמצמים:
      </p>
      <ul>
        {decimalToFraction.map((item) => (
          <li key={item.decimal}>
            <span dir="ltr">
              {item.decimal} = {formatFraction(item.fraction)} = {formatFraction(simplify(item.fraction))}
            </span>
          </li>
        ))}
      </ul>
      <p>
        להמרה בין שברים לאחוזים בחישובי מחירים והנחות יש גם <Link href="/tools/percentage-calculator">מחשבון אחוזים</Link>.
      </p>

      <h2>שברים עם נעלמים ושברים אלגבריים</h2>
      <p>
        שבר אלגברי הוא שבר שיש בו נעלם, כמו x/2. הכללים זהים לשברים של מספרים: מביאים למכנה משותף, מחברים את המונים
        ומצמצמים בגורם משותף. x/2 ועוד x/3 הם 3x/6 ועוד 2x/6, כלומר 5x/6. הכלי עצמו לא מקבל נעלמים, אבל אפשר
        להציב בו מספר במקום x ולבדוק שהתוצאה מתאימה לנוסחה שקיבלתם.
      </p>

      <h2>איך בודקים תוצאה בעזרת מספרים עשרוניים</h2>
      <p>
        דרך מהירה לבדוק חישוב היא להפוך כל שבר לעשרוני ולחשב אותו מחדש. 1/2 ועוד 1/3 הם{' '}
        {toDecimal({ n: 1, d: 2 }).text} ועוד {toDecimal({ n: 1, d: 3 }).text}, כלומר בערך 0.833, וזה אכן 5/6 בעשרוני:{' '}
        {toDecimal({ n: 5, d: 6 }).text}. הבדיקה מתאימה לקירוב בלבד, ולכן את התשובה הסופית משאירים כשבר.
      </p>

      <h2>שברים שווי ערך וכפל במספר שלם</h2>
      <p>
        שברים שונים יכולים להיות אותו מספר: 1/2 שווה ל-2/4, ל-3/6 ול-4/8. כופלים או מחלקים את המונה והמכנה באותו
        מספר, והערך לא משתנה. כך מגיעים למכנה משותף וכך מצמצמים. כדי להכפיל מספר שלם בשבר, כותבים אותו כשבר עם מכנה
        1: 3 כפול 2/5 הוא {formatFraction(solve({ left: { n: 3, d: 1 }, right: { n: 2, d: 5 }, symbol: '×', leftText: '', rightText: '' }))},
        כלומר {formatMixed(solve({ left: { n: 3, d: 1 }, right: { n: 2, d: 5 }, symbol: '×', leftText: '', rightText: '' }))}.
      </p>

      <h2>איך משווים בין שני שברים</h2>
      <p>
        כדי לדעת איזה שבר גדול יותר, מביאים אותם למכנה משותף ומשווים את המונים, או מכפילים במאונך: את המונה של
        הראשון במכנה של השני, ולהפך. 3/4 מול 5/7: 3 כפול 7 הוא 21, ו-5 כפול 4 הוא 20, ולכן 3/4 גדול יותר. בעשרוני זה{' '}
        {toDecimal({ n: 3, d: 4 }).text} מול {toDecimal({ n: 5, d: 7 }).text}.
      </p>

      <h2>מתי משאירים שבר ומתי מספר מעורב</h2>
      <p>
        בחישוב ממשיכים לעבוד עם שבר מדומה, כי הוא נוח לכפל וחילוק. בתשובה סופית, ובמצבים יומיומיים כמו מידות
        ומתכונים, מספר מעורב נקרא בקלות רבה יותר: 53/12 הוא {formatMixed({ n: 53, d: 12 })}. הכלי מציג את שתי הצורות
        כדי שתוכלו לבחור.
      </p>

      <h2>טעויות נפוצות בשברים</h2>
      <ul>
        <li>
          <strong>חיבור מונים ומכנים:</strong> 1/2 ועוד 1/3 הם לא 2/5. התשובה הנכונה היא 5/6, כי רק המונים מתחברים,
          אחרי שהמכנים זהים. 2/5 הוא 0.4, ו-5/6 הוא בערך 0.83.
        </li>
        <li>
          <strong>חילוק בלי להפוך:</strong> בחילוק הופכים רק את השבר השני, ואז כופלים.
        </li>
        <li>
          <strong>שכחו לצמצם:</strong> 6/12 נכון, אבל התשובה הסופית היא 1/2.
        </li>
        <li>
          <strong>מספר מעורב ככפל:</strong> 2 ו-3/4 הוא 2 ועוד 3/4, ולא 2 כפול 3/4. מחשבים רק אחרי שהופכים את
          המספר המעורב לשבר מדומה.
        </li>
      </ul>
      <p>
        שברים נפגשים גם מחוץ לשיעור: במתכונים, בהמרת כוסות וכפות ב<Link href="/tools/baking-converter">ממיר מידות אפייה</Link>,
        ובחישוב כמויות צבע לפי שטח ב<Link href="/tools/paint-quantity-calculator">מחשבון כמות צבע</Link>.
      </p>

      <h2>מקורות</h2>
      <ul className={styles.sources}>
        <li>
          <a href="https://en.wikipedia.org/wiki/Fraction" rel="noopener" target="_blank" lang="en" dir="ltr">
            Wikipedia: Fraction (addition, multiplication, division, simplification, mixed numbers)
          </a>
        </li>
      </ul>
      <p className={styles.reviewed}>
        הכללים נבדקו מול המקור ב-<time dateTime={FRACTIONS_REVIEWED}>23.10.2026</time>. בעמוד נבדקו גם ההשוואה בין שברים, הכפלת שבר במספר שלם והמרה בין שברים לעשרוניים.
      </p>
    </ToolLayout>
  )
}
