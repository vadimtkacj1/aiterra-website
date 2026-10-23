import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import ProfitMarginCalculator from '../../components/tools/ProfitMarginCalculator'
import {
  STANDARD_VAT_RATE,
  breakEven,
  formatPercent,
  formatShekels,
  formatUnits,
  marginTable,
  priceFromMargin,
} from '@/lib/profit-margin'
import styles from './page.module.css'

const PATH = '/tools/profit-margin-calculator'
const TITLE = 'מחשבון רווח גולמי ותמחור מוצר'
const META_TITLE = 'מחשבון רווח גולמי ותמחור מוצר: מרווח, תוספת ומע״מ'
const DESCRIPTION =
  'מחשבון רווח גולמי ותמחור: מקלידים עלות ומקבלים מחיר מכירה לפי מרווח או תוספת, לפני ואחרי מע״מ, ונקודת איזון בחודש. כולל ההבדל בין margin ל-markup.'

const EXAMPLE_COST = 6_000
const EXAMPLE_MARGIN = 40
const EXAMPLE_FIXED = 1_200_000
const examplePrice = priceFromMargin(EXAMPLE_COST, EXAMPLE_MARGIN * 100)
const exampleProfit = examplePrice - EXAMPLE_COST
const exampleWithVat = Math.round((examplePrice * (100 + STANDARD_VAT_RATE)) / 100)
const exampleBreakEven = breakEven(EXAMPLE_FIXED, exampleProfit) ?? 0
const rows = marginTable(10_000, [10, 20, 25, 30, 40, 50, 60])

const sources = [
  {
    href: 'https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%9E%D7%A1_%D7%A2%D7%A8%D7%9A_%D7%9E%D7%95%D7%A1%D7%A3',
    label: 'חוק מס ערך מוסף, התשל״ו-1975 (ויקיטקסט)',
  },
  {
    href: 'https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%94%D7%92%D7%A0%D7%AA_%D7%94%D7%A6%D7%A8%D7%9B%D7%9F',
    label: 'חוק הגנת הצרכן, התשמ״א-1981: סעיפים 17א ו-17ב, הצגת המחיר הכולל לצרכן, כולל מע״מ (ויקיטקסט)',
  },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'margin-faq-gross',
    question: 'איך מחשבים רווח גולמי?',
    answer:
      'רווח גולמי ליחידה הוא מחיר המכירה לפני מע״מ פחות העלות הישירה של היחידה, כלומר קנייה או ייצור. אחוז הרווח הגולמי הוא הרווח הזה חלקי מחיר המכירה, כפול 100. מוצר שעולה 60 ₪ ונמכר ב-100 ₪ לפני מע״מ מרוויח 40 ₪, ואחוז הרווח הגולמי שלו הוא 40%. הוצאות קבועות כמו שכירות לא נכנסות לחישוב הזה.',
  },
  {
    id: 'margin-faq-difference',
    question: 'מה ההבדל בין מרווח (margin) לתוספת (markup)?',
    answer:
      'מרווח הוא הרווח כאחוז ממחיר המכירה, ותוספת היא הרווח כאחוז מהעלות. אותו מוצר שעולה 100 ₪ ונמכר ב-125 ₪ מרוויח 25 ₪: זו תוספת של 25% ומרווח של 20%. המרווח תמיד קטן מהתוספת ולא יכול להגיע ל-100%. כשספק או רואה חשבון מדברים על ״אחוז רווח״, כדאי לברר לאיזה מהשניים הם מתכוונים.',
  },
  {
    id: 'margin-faq-price',
    question: 'איך מחשבים מחיר מכירה לפי אחוז רווח רצוי?',
    answer:
      'מחלקים את העלות ב-(1 פחות המרווח). כדי לקבל מרווח של 30% על מוצר שעולה 100 ₪, מחלקים 100 ב-0.7 ומקבלים 142.86 ₪ לפני מע״מ. הטעות הנפוצה היא להוסיף 30% לעלות ולמכור ב-130 ₪, ואז המרווח בפועל הוא רק 23.08%. כדי לקבל מחיר לצרכן מכפילים בסוף ב-1.18.',
  },
  {
    id: 'margin-faq-vat',
    question: 'מחשבים רווח לפני מע״מ או אחרי?',
    answer:
      'לפני מע״מ. עוסק מורשה גובה את המע״מ מהלקוח ומעביר אותו לרשות המסים, אחרי שהוא מקזז את המע״מ ששילם לספקים, ולכן המע״מ לא שייך לו. אם מחשבים רווח על מחיר כולל מע״מ, הרווח נראה גדול ממה שהוא באמת. אם הספק נתן לכם מחיר כולל מע״מ, בחרו במחשבון ״כולל מע״מ״ והוא יוריד את המע״מ מהעלות.',
  },
  {
    id: 'margin-faq-break-even',
    question: 'מה זו נקודת איזון וכמה יחידות צריך למכור?',
    answer:
      'נקודת איזון היא מספר היחידות שצריך למכור בחודש כדי שהרווח הגולמי יכסה את ההוצאות הקבועות, כמו שכירות, שכר ופרסום. מחלקים את ההוצאות הקבועות ברווח הגולמי ליחידה ומעגלים כלפי מעלה. עם 12,000 ₪ הוצאות קבועות ורווח של 40 ₪ ליחידה צריך למכור 300 יחידות בחודש. כל יחידה מעבר לזה היא רווח.',
  },
  {
    id: 'margin-faq-good',
    question: 'מה נחשב אחוז רווח גולמי טוב?',
    answer:
      'אין מספר אחד, כי זה תלוי בענף. בקמעונאות מזון המרווחים נמוכים והמחזור גבוה, ובשירותים ובמוצרים דיגיטליים המרווח יכול להיות גבוה בהרבה. השאלה הנכונה היא אם הרווח הגולמי, כפול כמות המכירות הצפויה, מכסה את ההוצאות הקבועות ומשאיר רווח. לכן כדאי למלא במחשבון גם את שדה ההוצאות הקבועות ולבדוק אם נקודת האיזון ריאלית.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function ProfitMarginCalculatorPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede={`רווח גולמי הוא מחיר המכירה לפני מע״מ פחות עלות המוצר, ואחוז הרווח הגולמי הוא הרווח הזה חלקי המחיר. מקלידים עלות ואחוז רצוי ומקבלים מחיר לפני מע״מ ואחרי ${STANDARD_VAT_RATE}% מע״מ, ואם תרצו גם כמה יחידות צריך למכור כדי לכסות את ההוצאות.`}
      chips={['מרווח ותוספת', 'עם מע״מ', 'נקודת איזון']}
      tool={<ProfitMarginCalculator />}
      faq={faq}
      cta={{
        text: 'מעדכנים מחירים בכמה מקומות ידנית? אנחנו מחברים קטלוג, חנות וחשבוניות כך שמחיר אחד מתעדכן בכל המערכות.',
        label: 'אוטומציה לעסקים',
        href: '/services/automation',
      }}
    >
      <h2>איך מתמחרים מוצר לפי אחוז רווח</h2>
      <p>תמחור לפי רווח גולמי מתחיל מהעלות הישירה של יחידה אחת, וממנה יש שתי דרכים להגיע למחיר:</p>
      <ul>
        <li>
          לפי מרווח (margin): מחיר = עלות ÷ (1 − מרווח). מרווח של 40% על עלות של 60 ₪:{' '}
          <span className={styles.math}>60 ÷ 0.6 = 100 ₪</span>.
        </li>
        <li>
          לפי תוספת (markup): מחיר = עלות × (1 + תוספת). תוספת של 40% על 60 ₪:{' '}
          <span className={styles.math}>60 × 1.4 = 84 ₪</span>, והמרווח בפועל הוא 28.57%.
        </li>
      </ul>
      <p>
        שני המחירים האלה הם לפני מע״מ. מחיר לצרכן פרטי חייב להיות מוצג כולל מע״מ, ולכן בסוף מכפילים ב-1.18.
      </p>

      <h3>דוגמה: חנות שמוכרת מוצר שעולה {formatShekels(EXAMPLE_COST)}</h3>
      <ul>
        <li>עלות ליחידה לפני מע״מ: {formatShekels(EXAMPLE_COST)}</li>
        <li>
          מרווח רצוי {EXAMPLE_MARGIN}%: <span className={styles.math}>60 ÷ 0.6 = {formatShekels(examplePrice)}</span>{' '}
          לפני מע״מ
        </li>
        <li>מחיר לצרכן כולל מע״מ: {formatShekels(exampleWithVat)}</li>
        <li>רווח גולמי ליחידה: {formatShekels(exampleProfit)}</li>
        <li>
          הוצאות קבועות של {formatShekels(EXAMPLE_FIXED)} בחודש: נקודת איזון ב-
          {formatUnits(exampleBreakEven)} יחידות בחודש
        </li>
      </ul>

      <h2>טבלה: מרווח, תוספת ומחיר למוצר שעולה 100 ₪</h2>
      <p>
        העמודה האחרונה מראה מה קורה כשמוסיפים לעלות את אותו אחוז במקום לחשב מרווח: המרווח בפועל יוצא נמוך מהמתוכנן.
      </p>
      <div className={styles.tableWrap} role="region" aria-label="טבלת מרווח ותוספת" tabIndex={0}>
        <table className={styles.table}>
          <caption>עלות 100 ₪ לפני מע״מ</caption>
          <thead>
            <tr>
              <th scope="col">מרווח רצוי</th>
              <th scope="col">תוספת נדרשת</th>
              <th scope="col">מחיר לפני מע״מ</th>
              <th scope="col">כולל מע״מ</th>
              <th scope="col">אם מוסיפים את האחוז לעלות</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.margin}>
                <th scope="row">{row.margin}%</th>
                <td>{formatPercent(row.markupBasisPoints)}</td>
                <td>{formatShekels(row.price)}</td>
                <td>{formatShekels(row.priceWithVat)}</td>
                <td>
                  {formatShekels(row.naivePrice)}, מרווח {formatPercent(row.naiveMarginBasisPoints)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>מרווח מול תוספת: למה זה משנה</h2>
      <p>
        מרווח מודד את הרווח ביחס למחיר המכירה, ותוספת ביחס לעלות. מרווח לא יכול להגיע ל-100%, כי הרווח הוא חלק מהמחיר.
        תוספת יכולה להיות 200% ויותר. כשמשווים מוצרים או ספקים, או כשרואה החשבון מדווח על אחוז רווח גולמי בדוח, מדברים
        כמעט תמיד על מרווח. כשמתמחרים ״עלות ועוד אחוז״, מדברים על תוספת.
      </p>
      <p>
        המעבר בין השניים: תוספת = מרווח ÷ (1 − מרווח), ומרווח = תוספת ÷ (1 + תוספת). לחישובי אחוזים אחרים יש{' '}
        <Link href="/tools/percentage-calculator">מחשבון אחוזים</Link>, ולהוספה והורדה של מע״מ{' '}
        <Link href="/tools/vat-calculator">מחשבון מע״מ</Link>.
      </p>

      <h2>נקודת איזון</h2>
      <p>
        רווח גולמי חיובי לא אומר שהעסק מרוויח. ההוצאות הקבועות, כמו שכירות, שכר, פרסום ותוכנות, צריכות להיות מכוסות
        מהרווח הגולמי של כל המכירות. נקודת האיזון היא ההוצאות הקבועות חלקי הרווח הגולמי ליחידה, מעוגל כלפי מעלה. אם
        המספר שיוצא גבוה ממה שאתם מוכרים היום, יש שלוש דרכים: להעלות מחיר, להוריד עלות ליחידה או להוריד הוצאות קבועות.
      </p>

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
      <p className={styles.reviewed}>שיעור המע״מ והנוסחאות נבדקו ב-23 באוקטובר 2026.</p>
    </ToolLayout>
  )
}
