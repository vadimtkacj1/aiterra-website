import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import PurchaseTaxCalculator from '../../components/tools/PurchaseTaxCalculator'
import {
  ADDITIONAL_BRACKETS,
  BRACKETS_VALID_UNTIL,
  OLEH_VALUE_CEILING,
  REVIEWED_LABEL,
  SINGLE_BRACKETS,
  bracketLabel,
  calculatePurchaseTax,
  formatBasisPoints,
  formatNumber,
  formatRatio,
  formatShekels,
  type Bracket,
} from '@/lib/purchase-tax'
import styles from './page.module.css'

const PATH = '/tools/purchase-tax-calculator'
const TITLE = 'מחשבון מס רכישה לדירה 2026'
const META_TITLE = 'מחשבון מס רכישה 2026: דירה יחידה, דירה נוספת ועולה חדש'
const DESCRIPTION =
  'מחשבון מס רכישה לפי המדרגות של 2026: דירה יחידה, דירה נוספת ועולה חדש, עם פירוט לפי מדרגות, שיעור אפקטיבי וחיסכון לעולים. המדרגות בתוקף עד 15.1.2028.'

const EXAMPLE_VALUE = 2_500_000
const exampleSingle = calculatePurchaseTax(EXAMPLE_VALUE * 100, 'single')
const exampleAdditional = calculatePurchaseTax(EXAMPLE_VALUE * 100, 'additional')
const exampleOleh = calculatePurchaseTax(EXAMPLE_VALUE * 100, 'oleh')
const singleRows = exampleSingle.rows.filter((row) => row.amount > 0)

const tableRows = (brackets: Bracket[]) => {
  let lower = 0
  return brackets.map((bracket) => {
    const row = { from: lower === 0 ? 0 : lower + 1, to: bracket.upTo, rateBasisPoints: bracket.rateBasisPoints, amount: 0, tax: 0 }
    lower = bracket.upTo ?? lower
    return row
  })
}

const singleTable = tableRows(SINGLE_BRACKETS)
const additionalTable = tableRows(ADDITIONAL_BRACKETS)

const sources: { href: string; label: string; note: string }[] = [
  {
    href: 'https://www.gov.il/he/service/real_eatate_taxsimulator',
    label: 'רשות המסים: סימולטור לחישוב מס ברכישת מקרקעין',
    note: 'חישוב רשמי של מס רכישה לפי סוג הרכישה',
  },
  {
    href: 'https://www.kolzchut.org.il/he/%D7%97%D7%99%D7%A9%D7%95%D7%91_%D7%9E%D7%A1_%D7%A8%D7%9B%D7%99%D7%A9%D7%94',
    label: 'כל זכות: חישוב מס רכישה',
    note: 'מדרגות דירה יחידה ותקופת התוקף, 16.1.2024 עד 15.1.2028',
  },
  {
    href: 'https://www.kolzchut.org.il/he/%D7%94%D7%A0%D7%97%D7%94_%D7%91%D7%9E%D7%A1_%D7%A8%D7%9B%D7%99%D7%A9%D7%94_%D7%9C%D7%A2%D7%95%D7%9C%D7%99%D7%9D',
    label: 'כל זכות: הנחה במס רכישה לעולים',
    note: 'מי נחשב עולה, התקופה שבה אפשר לממש את ההטבה ואיך מבקשים אותה',
  },
  {
    href: 'https://www.gov.il/BlobFolder/policy/inst-01-2025-3/he/realestate_inst-01-2025-3.pdf',
    label: 'רשות המסים: הוראת ביצוע מיסוי מקרקעין 1/2025',
    note: 'מדרגות מס הרכישה שפורסמו ב-16 בינואר 2025',
  },
  {
    href: 'https://www.melnik.org.il/purchase-tax-relief-olim-regulation-12a',
    label: 'עו״ד דוד מלניק: הטבת מס הרכישה לעולה, תקנה 12א',
    note: 'מדרגות העולה, תקרת השווי והתקופה',
  },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'ptc-faq-how-much',
    question: 'כמה מס רכישה משלמים על דירה ב-2026?',
    answer: `זה תלוי בשווי הדירה ובסוג הרכישה. על דירה יחידה אין מס עד ${formatNumber(SINGLE_BRACKETS[0].upTo ?? 0)} ₪, ומעל זה המדרגות הן 3.5%, 5%, 8% ו-10%. על דירה נוספת משלמים 8% מהשקל הראשון. בדירה ששווה ${formatNumber(EXAMPLE_VALUE)} ₪ דירה יחידה משלמת ${formatShekels(exampleSingle.tax)} ודירה נוספת ${formatShekels(exampleAdditional.tax)}.`,
  },
  {
    id: 'ptc-faq-single',
    question: 'מתי דירה נחשבת דירה יחידה?',
    answer:
      'דירה יחידה היא דירה שהרוכש, ובן או בת זוגו, אינם בעלים של דירת מגורים אחרת, או שהם מתחייבים למכור את הדירה הקודמת בתוך פרק זמן שהחוק קובע. יש הבחנות לגבי דירה בחו״ל, חלק מדירה וירושה, והן משתנות מעסקה לעסקה. לכן כדאי לוודא עם עורך הדין שמבצע את העסקה אם אתם עומדים בהגדרה, כי טעות עולה בעשרות אלפי שקלים.',
  },
  {
    id: 'ptc-faq-update',
    question: 'מתי מתעדכנות מדרגות מס הרכישה?',
    answer: `בדרך כלל ב-16 בינואר של כל שנה, לפי שינוי במדד מחירי הדירות. בשנים האחרונות העדכון הוקפא בחוק, ולכן הסכומים בדף זהים למדרגות שפורסמו בינואר 2024, והן בתוקף עד ${BRACKETS_VALID_UNTIL}. אם החוק ישתנה, נעדכן את הדף. הנתונים נכונים ל-${REVIEWED_LABEL}; את המדרגות העדכניות מפרסמת רשות המסים.`,
  },
  {
    id: 'ptc-faq-oleh',
    question: 'כמה מס רכישה משלם עולה חדש?',
    answer: `עולה שרוכש דירה יחידה בין שנה לפני העלייה ל-7 שנים אחריה משלם 0% עד ${formatNumber(SINGLE_BRACKETS[0].upTo ?? 0)} ₪, ו-0.5% על החלק עד ${formatNumber(SINGLE_BRACKETS[2].upTo ?? 0)} ₪. מעל זה חלים השיעורים הרגילים של דירה יחידה. בדירה של ${formatNumber(EXAMPLE_VALUE)} ₪ זה ${formatShekels(exampleOleh.tax)} במקום ${formatShekels(exampleSingle.tax)}. ההטבה לא ניתנת כשהשווי מעל ${formatNumber(OLEH_VALUE_CEILING)} ₪. את ההטבה מבקשים בטופס 2973, והיא לא מוענקת אוטומטית.`,
  },
  {
    id: 'ptc-faq-when-pay',
    question: 'מתי צריך לשלם מס רכישה?',
    answer:
      'ההצהרה על הרכישה מוגשת לרשות המסים תוך 30 יום מיום המכירה, בדרך כלל על ידי עורך הדין שמלווה את העסקה, ובה משלמים את המס. תשלום באיחור מצטבר בריבית והצמדה וקנסות. גם כשאין מס לתשלום, כמו בדירה יחידה בשווי נמוך, צריך להגיש הצהרה.',
  },
  {
    id: 'ptc-faq-effective',
    question: 'למה השיעור האפקטיבי נמוך מהשיעור במדרגה האחרונה?',
    answer: `כל שיעור חל רק על החלק של השווי שנמצא בתוך המדרגה שלו. בדירה יחידה של ${formatNumber(EXAMPLE_VALUE)} ₪ החלק הגדול הראשון פטור, ולכן המס הכולל הוא ${formatRatio(exampleSingle.effectiveRate)} משווי הדירה ולא 5%, שהוא השיעור במדרגה האחרונה שנגעתם בה.`,
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function PurchaseTaxCalculatorPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede={`מקלידים את שווי הדירה ובוחרים דירה יחידה, דירה נוספת או עולה חדש, ומקבלים את מס הרכישה לפי מדרגות 2026, עם פירוט לכל מדרגה. המדרגות בתוקף עד ${BRACKETS_VALID_UNTIL}.`}
      chips={['מדרגות בתוקף עד 15.1.2028', 'דירה יחידה, נוספת ועולה חדש', 'פירוט לפי מדרגות', 'הסכומים לא נשלחים לשום מקום']}
      tool={<PurchaseTaxCalculator />}
      faq={faq}
      cta={{
        text: 'מוכרים או משכירים דירות ומנהלים לידים ומסמכים בגיליונות? אנחנו בונים מערכת CRM וזרימות אוטומטיות שמרכזות הכול במקום אחד.',
        label: 'אוטומציה לעסקים',
        href: '/services/automation',
      }}
    >
      <h2>איך מחושב מס רכישה</h2>
      <p>
        מס רכישה הוא מס שהקונה משלם על רכישת זכות במקרקעין. הוא מחושב במדרגות, כמו מס הכנסה: כל שיעור חל רק על החלק
        של שווי הדירה שנמצא בתוך המדרגה. לכן קפיצה למדרגה הבאה לא מייקרת את כל הדירה, אלא רק את החלק שמעל הסף.
      </p>

      <h3>מדרגות לדירה יחידה</h3>
      <p>
        הסכומים הבאים בתוקף מ-16 בינואר 2024 ועד {BRACKETS_VALID_UNTIL}. העדכון השנתי לפי המדד הוקפא בחוק, ולכן
        הסכומים לא השתנו בינואר 2025 ובינואר 2026.
      </p>
      <div className={styles.tableWrap} role="region" aria-label="מדרגות מס רכישה לדירה יחידה" tabIndex={0}>
        <table className={styles.table}>
          <caption>מדרגות מס רכישה לדירה יחידה, בשקלים</caption>
          <thead>
            <tr>
              <th scope="col">שווי הדירה</th>
              <th scope="col">שיעור</th>
            </tr>
          </thead>
          <tbody>
            {singleTable.map((row) => (
              <tr key={row.from}>
                <th scope="row">{bracketLabel(row)}</th>
                <td>{row.rateBasisPoints === 0 ? 'פטור' : formatBasisPoints(row.rateBasisPoints)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>מדרגות לדירה נוספת</h3>
      <p>מי שכבר בעלים של דירת מגורים ורוכש דירה נוספת משלם מהשקל הראשון, בלי מדרגה פטורה:</p>
      <div className={styles.tableWrap} role="region" aria-label="מדרגות מס רכישה לדירה נוספת" tabIndex={0}>
        <table className={styles.table}>
          <caption>מדרגות מס רכישה לדירה נוספת, בשקלים</caption>
          <thead>
            <tr>
              <th scope="col">שווי הדירה</th>
              <th scope="col">שיעור</th>
            </tr>
          </thead>
          <tbody>
            {additionalTable.map((row) => (
              <tr key={row.from}>
                <th scope="row">{bracketLabel(row)}</th>
                <td>{formatBasisPoints(row.rateBasisPoints)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>עולה חדש</h3>
      <p>
        עולה חדש שרוכש דירה יחידה משלם 0% על החלק עד {formatNumber(SINGLE_BRACKETS[0].upTo ?? 0)} ₪, ו-0.5% על החלק
        עד {formatNumber(SINGLE_BRACKETS[2].upTo ?? 0)} ₪. מעל זה חלים השיעורים הרגילים של דירה יחידה, 8% ואז 10%.
        ההטבה חלה על רכישה בין שנה לפני העלייה לבין שבע שנים אחריה, פעם אחת, ולא ניתנת כשהשווי מעל{' '}
        {formatNumber(OLEH_VALUE_CEILING)} ₪. צריך לבקש אותה בהצהרה לרשות המסים. עולים שעלו לפני אוגוסט 2024 יכולים
        לבחור בנוסח הישן של התקנה, והמחשבון לא מחשב אותו. מי שרוכש דירה נוספת משלם כמו כל קונה.
      </p>

      <h2>דוגמה: דירה ב-{formatNumber(EXAMPLE_VALUE)} ₪</h2>
      <p>דירה יחידה ששוויה {formatNumber(EXAMPLE_VALUE)} ₪:</p>
      <ol>
        {singleRows.map((row) => (
          <li key={row.from}>
            {bracketLabel(row)}: {formatNumber(row.amount)} ₪ כפול {formatBasisPoints(row.rateBasisPoints)} ={' '}
            {formatNumber(row.tax)} ₪.
          </li>
        ))}
      </ol>
      <p>
        סך הכול {formatShekels(exampleSingle.tax)}, שהם {formatRatio(exampleSingle.effectiveRate)} משווי הדירה. על אותה
        דירה כדירה נוספת המס הוא {formatShekels(exampleAdditional.tax)}, ועולה חדש משלם {formatShekels(exampleOleh.tax)}.
      </p>

      <h2>מה המחשבון לא כולל</h2>
      <ul>
        <li>מס שבח על המוכר, וגם מס רכישה על מקרקעין שאינם דירת מגורים, כמו מגרש, משרד או חנות.</li>
        <li>
          הנחות לקבוצות מיוחדות, כמו נכים, עיוורים ובני משפחה של חללים. הן מפורטות באתר כל זכות ובסימולטור של רשות
          המסים.
        </li>
        <li>רכישת חלק מדירה, רכישה מקבלן, זכויות חכירה, אגב מכירה של דירה קודמת ועסקאות בין קרובים.</li>
        <li>הוצאות נוספות: שכר טרחת עורך דין, תיווך, היטל השבחה ומע״מ.</li>
      </ul>
      <p>
        לפני חתימה כדאי להריץ את הנתונים בסימולטור של רשות המסים ולבדוק עם עורך הדין אם הרכישה נחשבת דירה יחידה.
        אם אתם עובדים בנדל״ן, יש לנו גם <Link href="/tools/vat-calculator">מחשבון מע״מ</Link> להצעות מחיר ולחשבוניות.
      </p>

      <h2>מקורות</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noopener" target="_blank">
              {source.label}
            </a>
            : {source.note}
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        המדרגות בדף ובמחשבון מבוססות על המקורות שלמעלה, נכון ל-{REVIEWED_LABEL}, והן בתוקף עד {BRACKETS_VALID_UNTIL}. זו הערכה ולא ייעוץ
        משפטי או מס, והיא לא מחליפה עורך דין או את החישוב של רשות המסים.
      </p>
    </ToolLayout>
  )
}
