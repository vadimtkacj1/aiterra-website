import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import ChildAllowanceCalculator from '../../components/tools/ChildAllowanceCalculator'
import { allowanceTable, computeAllowance, formatShekels, positionLabel } from '@/lib/child-allowance'
import styles from './page.module.css'

const PATH = '/tools/child-allowance-calculator-2026'
const TITLE = 'מחשבון קצבת ילדים 2026'
const META_TITLE = 'מחשבון קצבת ילדים 2026: 173 ו-219 ₪ לילד'
const DESCRIPTION =
  'מחשבון קצבת ילדים 2026 לפי הביטוח הלאומי: 173 ₪ לילד הראשון, 219 ₪ לשני עד הרביעי, תוספת 113 ₪ למקבלי קצבת קיום ו-58 ₪ לחיסכון לכל ילד.'

const sources = [
  {
    href: 'https://www.btl.gov.il/benefits/children/Pages/%D7%A9%D7%99%D7%A2%D7%95%D7%A8%D7%99%20%D7%94%D7%A7%D7%A6%D7%91%D7%94.aspx',
    label: 'הביטוח הלאומי: סכום קצבת הילדים, החל מ-01.01.2026',
  },
  {
    href: 'https://www.btl.gov.il/benefits/children/HisahoLayeled/Pages/HisahonKupot.aspx',
    label: 'הביטוח הלאומי: הכפלת סכום החיסכון, 58 ₪ החל מ-01.01.2026',
  },
  {
    href: 'https://www.btl.gov.il/benefits/children/HisahoLayeled/Pages/sum.aspx',
    label: 'הביטוח הלאומי: סכום החיסכון ומענקי החיסכון',
  },
  {
    href: 'https://www.btl.gov.il/benefits/children/Pages/%d7%aa%d7%a0%d7%90%d7%99%20%d7%96%d7%9b%d7%90%d7%95%d7%aa.aspx',
    label: 'הביטוח הלאומי: תנאי הזכאות לקצבת ילדים',
  },
  {
    href: 'https://www.btl.gov.il/benefits/children/Pages/%d7%aa%d7%a7%d7%95%d7%a4%d7%aa%20%d7%94%d7%96%d7%9b%d7%90%d7%95%d7%aa.aspx',
    label: 'הביטוח הלאומי: תקופת הזכאות לקצבת ילדים',
  },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'child-allowance-faq-amount',
    question: 'כמה היא קצבת ילדים 2026?',
    answer:
      'לפי הביטוח הלאומי, מ-1 בינואר 2026: 173 ₪ בחודש עבור הילד הראשון, 219 ₪ עבור הילד השני, השלישי והרביעי, ו-173 ₪ עבור כל ילד מהחמישי ואילך. משפחה עם שני ילדים מקבלת 392 ₪ בחודש, ומשפחה עם ארבעה ילדים 830 ₪. הקצבה משולמת בלי קשר להכנסות המשפחה.',
  },
  {
    id: 'child-allowance-faq-supplement',
    question: 'מי מקבל תוספת לקצבת הילדים?',
    answer:
      'הורה שמקבל הבטחת הכנסה, מזונות מהביטוח הלאומי, קצבת אזרח ותיק עם תוספת השלמת הכנסה או קצבת שאירים עם תוספת השלמת הכנסה. התוספת היא 113 ₪ לחודש, והיא משולמת רק עבור הילד השלישי והילד הרביעי במשפחה. משפחה עם ארבעה ילדים או יותר מקבלת לכן 226 ₪ תוספת בחודש.',
  },
  {
    id: 'child-allowance-faq-savings',
    question: 'מה זה חיסכון לכל ילד וכמה מופקד?',
    answer:
      'הביטוח הלאומי מפקיד 58 ₪ בחודש לחיסכון של כל ילד שזכאי לקצבת ילדים, עד גיל 18, בנוסף לקצבה. ההורים יכולים להוסיף עוד 58 ₪ מקצבת הילדים, וכך החיסכון מוכפל ל-116 ₪ בחודש. הסכום הנוסף יורד מהקצבה שמגיעה לחשבון הבנק, ואפשר לבטל את ההכפלה בכל שלב.',
  },
  {
    id: 'child-allowance-faq-when',
    question: 'מתי משולמת קצבת הילדים?',
    answer:
      'בכל 20 בחודש. ברוב המקרים הקצבה מתחילה אוטומטית כחודש אחרי הלידה, לפי מידע שבית החולים מעביר לביטוח הלאומי. ילד שנולד עד ה-15 בחודש מזכה בקצבה מה-1 באותו חודש, וילד שנולד מה-16 מזכה בה מה-1 בחודש שאחרי. הקצבה משולמת עד סוף החודש שבו הילד בן 18.',
  },
  {
    id: 'child-allowance-faq-order',
    question: 'איך נקבע הסדר של הילדים?',
    answer:
      'לפי הביטוח הלאומי, סכום הקצבה מחושב לפי מספר הילדים במשפחה, תאריכי הלידה שלהם וזכאות של אחד ההורים לקצבת קיום. המחשבון מסדר את הילדים מהבכור לצעיר ומניח שכולם זכאים: עוד לא מלאו להם 18, הם לא נשואים והם שוהים בישראל. במשפחה עם מצב מורכב יותר כדאי לבדוק גם במחשבון של הביטוח הלאומי.',
  },
  {
    id: 'child-allowance-faq-tax',
    question: 'האם מקזזים משהו מקצבת הילדים?',
    answer:
      'לפי הביטוח הלאומי, הוא רשאי לנכות מקצבת הילדים כל חוב שיש לאחד ההורים לביטוח הלאומי. מלבד זה, אם בחרתם להכפיל את החיסכון לכל ילד, 58 ₪ לכל ילד יורדים מהקצבה ועוברים לחיסכון. במצב כזה מה שמגיע לחשבון הבנק נמוך מהסכום בטבלה, אבל הכסף נשאר של הילד.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function ChildAllowanceCalculatorPage() {
  const table = allowanceTable()
  const example = computeAllowance(4, true, false)

  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="קצבת ילדים 2026 היא 173 ₪ בחודש לילד הראשון ו-219 ₪ לכל אחד מהילדים השני עד הרביעי, לפי הביטוח הלאומי מ-1 בינואר 2026. בנוסף מופקדים 58 ₪ בחודש לחיסכון של כל ילד, ומשפחות שמקבלות קצבת קיום מקבלות 113 ₪ תוספת לילד השלישי והרביעי."
      chips={['סכומים מ-1.1.2026', 'תוספת לקצבת קיום', 'חיסכון לכל ילד']}
      tool={<ChildAllowanceCalculator />}
      faq={faq}
      cta={{
        text: 'חישובים חודשיים שחוזרים על עצמם, כמו קצבאות, תשלומים ותזכורות, אפשר להעביר לאוטומציה במקום לעשות אותם ידנית.',
        label: 'אוטומציה לעסקים',
        href: '/services/automation',
      }}
    >
      <h2>כמה היא קצבת ילדים 2026</h2>
      <p>
        הסכום נקבע לפי מיקום הילד במשפחה. לפי דף סכום קצבת הילדים של הביטוח הלאומי, החל מ-1 בינואר 2026:
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>קצבת ילדים לפי מיקום הילד, החל מ-1.1.2026</caption>
          <thead>
            <tr>
              <th scope="col">מיקום הילד</th>
              <th scope="col">קצבה בחודש</th>
              <th scope="col">תוספת לקצבת קיום</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">ראשון</th>
              <td>173 ₪</td>
              <td>—</td>
            </tr>
            <tr>
              <th scope="row">שני</th>
              <td>219 ₪</td>
              <td>—</td>
            </tr>
            <tr>
              <th scope="row">שלישי ורביעי</th>
              <td>219 ₪ כל אחד</td>
              <td>113 ₪ כל אחד</td>
            </tr>
            <tr>
              <th scope="row">חמישי ואילך</th>
              <td>173 ₪ כל אחד</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        הקצבה משולמת לכל משפחה שחיה בישראל ויש בה ילדים עד גיל 18, בלי קשר להכנסות, בכל 20 בחודש. בנוסף לה, הביטוח
        הלאומי מפקיד 58 ₪ בחודש לתוכנית החיסכון לכל ילד.
      </p>

      <h2>טבלת קצבת ילדים לפי מספר הילדים</h2>
      <p>הסכום הכולל שמגיע לחשבון הבנק בחודש, בלי הכפלת חיסכון, וסך ההפקדה של הביטוח הלאומי לחיסכון של הילדים.</p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>קצבת ילדים 2026 לפי מספר הילדים, בחודש</caption>
          <thead>
            <tr>
              <th scope="col">ילדים</th>
              <th scope="col">קצבה</th>
              <th scope="col">עם תוספת קצבת קיום</th>
              <th scope="col">לחיסכון</th>
            </tr>
          </thead>
          <tbody>
            {table.map((row) => (
              <tr key={row.children}>
                <th scope="row">{row.children}</th>
                <td>{formatShekels(row.allowance)}</td>
                <td>{formatShekels(row.withSupplement)}</td>
                <td>{formatShekels(row.savings)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>איך מחשבים קצבת ילדים: דוגמה</h2>
      <p>
        משפחה עם ארבעה ילדים מתחת לגיל 18, שאחד ההורים בה מקבל הבטחת הכנסה. כל ילד מקבל את הסכום לפי מקומו, והתוספת
        של 113 ₪ מתווספת לילד השלישי והרביעי:
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>דוגמה: ארבעה ילדים ותוספת להורה שמקבל קצבת קיום</caption>
          <thead>
            <tr>
              <th scope="col">ילד</th>
              <th scope="col">קצבה</th>
              <th scope="col">תוספת</th>
            </tr>
          </thead>
          <tbody>
            {example.lines.map((line) => (
              <tr key={line.position}>
                <th scope="row">{positionLabel(line.position)}</th>
                <td>{formatShekels(line.allowance)}</td>
                <td>{line.supplement ? formatShekels(line.supplement) : '—'}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">סך הכול בחודש</th>
              <td>{formatShekels(example.allowance)}</td>
              <td>{formatShekels(example.supplement)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p>
        יחד: {formatShekels(example.paid)} בחודש לחשבון הבנק. בנוסף מופקדים {formatShekels(example.savings)} בחודש
        לחיסכון של ארבעת הילדים (58 ₪ לכל ילד).
      </p>

      <h2>חיסכון לכל ילד</h2>
      <p>
        לפי הביטוח הלאומי, לכל ילד שזכאי לקצבת ילדים מופקדים 58 ₪ בחודש עד גיל 18. ההורים יכולים להוסיף עוד 58 ₪ מקצבת
        הילדים, כך שהחיסכון מוכפל ל-116 ₪ בחודש. הסכום הנוסף יורד מהקצבה החל מהחודש שאחרי הבחירה, ואפשר לבטל אותו בכל
        שלב. המחשבון מראה כמה נשאר בחשבון הבנק אחרי ההכפלה.
      </p>
      <p>
        לפי דף סכום החיסכון של הביטוח הלאומי, ילדים שנולדו מ-1 בינואר 2017 מקבלים לחיסכון מענק של 291 ₪ בגיל 3, מענק של
        291 ₪ בגיל בר או בת מצווה, ומענק של 582 ₪ בגיל 21 אם לא משכו את הכסף עד אז.
      </p>

      <h2>מתי הקצבה מתחילה ומתי היא נגמרת</h2>
      <ul>
        <li>ילד שנולד, עלה לארץ או אומץ עד ה-15 בחודש: הקצבה מתחילה ב-1 באותו חודש.</li>
        <li>ילד שנולד, עלה או אומץ מה-16 בחודש: הקצבה מתחילה ב-1 בחודש שאחרי.</li>
        <li>הקצבה משולמת עד סוף החודש שבו מלאו לילד 18.</li>
        <li>ילד נשוי לא מזכה בקצבה, וגם ילד שלא שוהה בישראל.</li>
      </ul>
      <p>
        עובדים במשרה חלקית ומתכננים את התקציב המשפחתי? את שכר המינימום לפי גיל אפשר לבדוק ב
        <Link href="/tools/minimum-wage-2026">מחשבון שכר מינימום 2026</Link>, ואת דמי ההבראה ב
        <Link href="/tools/recuperation-pay-calculator">מחשבון דמי הבראה</Link>.
      </p>

      <blockquote>
        מידע כללי ולא ייעוץ משפטי. הסכומים לפי הביטוח הלאומי מ-1 בינואר 2026. הזכאות בפועל, כולל ילדים במשמורת,
        אפוטרופסות ושהייה בחו״ל, נקבעת בביטוח הלאומי, והוא רשאי לקזז מהקצבה חובות.
      </blockquote>

      <h2>מקורות</h2>
      <ul className={styles.sources}>
        {sources.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noopener" target="_blank">
              {source.label}
            </a>
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>הסכומים נבדקו מול אתר הביטוח הלאומי ב-23 באוקטובר 2026.</p>
    </ToolLayout>
  )
}
