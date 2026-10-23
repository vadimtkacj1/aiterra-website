import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import FreelancerRateCalculator from '../../components/tools/FreelancerRateCalculator'
import {
  EXEMPT_CEILING_2026,
  STANDARD_VAT_RATE,
  calculateRate,
  defaultRateInput,
  formatMoney,
  formatWhole,
  type RateResult,
} from '@/lib/freelancer-rate'
import styles from './page.module.css'

const PATH = '/tools/freelancer-hourly-rate'
const TITLE = 'מחשבון תעריף שעתי לפרילנסר'
const META_TITLE = 'מחשבון תעריף שעתי לפרילנסר: תמחור שעת עבודה 2026'
const DESCRIPTION =
  'כמה לגבות לשעה כעצמאי? מקלידים נטו רצוי, הוצאות ושעות, ומקבלים תעריף שעתי לפני ואחרי מע״מ, כולל מס הכנסה וביטוח לאומי 2026.'

const resultFor = (overrides: Partial<typeof defaultRateInput>) =>
  calculateRate({ ...defaultRateInput, ...overrides }) as RateResult

const example = resultFor({})
const naiveHourly = Math.round((Number(defaultRateInput.targetNet) * 12) / (52 * Number(defaultRateInput.weeklyHours)))

const targetRows = ['8000', '10000', '12000', '15000', '20000', '25000'].map((targetNet) => ({
  targetNet: Number(targetNet),
  result: resultFor({ targetNet }),
}))

const shareRows = ['40', '50', '60', '75'].map((billableShare) => ({
  share: billableShare,
  result: resultFor({ billableShare }),
}))

const sources = [
  {
    href: 'https://www.capitax.co.il/Attachments/15042026.pdf',
    label: 'רשות המסים: לוח עזר לחישוב מס הכנסה לחודש ינואר 2026 ואילך (מדרגות ונקודות זיכוי)',
  },
  {
    href: 'https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/rates.aspx',
    label: 'הביטוח הלאומי: שיעורי דמי הביטוח לעובד עצמאי',
  },
  {
    href: 'https://www.kolzchut.org.il/he/%D7%A2%D7%95%D7%A1%D7%A7_%D7%A4%D7%98%D7%95%D7%A8',
    label: 'כל זכות: עוסק פטור, תקרת מחזור 122,833 ₪ ב-2026',
  },
  {
    href: 'https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%9E%D7%A1_%D7%A2%D7%A8%D7%9A_%D7%9E%D7%95%D7%A1%D7%A3',
    label: 'חוק מס ערך מוסף, התשל״ו-1975: סעיף 1 (עוסק פטור) וסעיף 31 (ויקיטקסט)',
  },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'rate-faq-how',
    question: 'איך מחשבים תעריף שעתי לפרילנסר?',
    answer:
      'מתחילים מהנטו שרוצים לחודש, מוסיפים מס הכנסה, ביטוח לאומי והוצאות העסק, ומקבלים את ההכנסה השנתית שצריך לגבות. אחר כך סופרים כמה שעות בשנה באמת אפשר לחייב לקוח, אחרי חופש, מחלה, חגים וזמן שלא מחייבים. מחלקים את ההכנסה הנדרשת בשעות האלה, וזה התעריף המינימלי לפני מע״מ.',
  },
  {
    id: 'rate-faq-salary',
    question: 'למה אי אפשר פשוט לחלק את המשכורת הרצויה בשעות?',
    answer: `כי שכיר מקבל תשלום גם על חופש, מחלה וחגים, והמעסיק משלם חלק מהביטוח הלאומי. פרילנסר מרוויח רק בשעות שהוא מחייב. בדוגמה שבדף, ${formatMoney(Number(defaultRateInput.targetNet))} נטו לחודש מחולקים ב-40 שעות לשבוע נותנים כ-${formatMoney(naiveHourly)} לשעה, אבל התעריף שמכסה מס, הוצאות ושעות לא מחויבות הוא ${formatMoney(example.hourly)}.`,
  },
  {
    id: 'rate-faq-billable',
    question: 'כמה שעות בחודש פרילנסר יכול לחייב?',
    answer:
      'פחות ממה שנדמה. חלק מהיום הולך לשיווק, הצעות מחיר, מיילים, הנהלת חשבונות ולמידה, ואת השעות האלה אף לקוח לא משלם. הנחה של 50% עד 70% שעות לחיוב היא נקודת התחלה סבירה, ואת המספר המדויק שלכם אפשר לגלות אם רושמים חודש שלם על מה הלך כל יום. במחשבון רואים כמה התעריף משתנה כשהאחוז משתנה.',
  },
  {
    id: 'rate-faq-vat',
    question: 'עוסק מורשה צריך להוסיף מע״מ לתעריף?',
    answer: `כן. עוסק מורשה גובה מהלקוח את התעריף ועוד ${STANDARD_VAT_RATE}% מע״מ ומעביר את המע״מ לרשות המסים, ולכן ההכנסה שלו היא התעריף לפני מע״מ. כשנותנים הצעת מחיר ללקוח עסקי, נהוג לכתוב מחיר לפני מע״מ ולציין זאת. ללקוח פרטי עדיף לכתוב מחיר כולל מע״מ, כי זה מה שהוא ישלם בפועל.`,
  },
  {
    id: 'rate-faq-exempt',
    question: 'עד כמה מותר לעוסק פטור להרוויח ב-2026?',
    answer: `תקרת המחזור לעוסק פטור ב-2026 היא ${formatMoney(EXEMPT_CEILING_2026)} בשנה, והיא נמדדת לפי ההכנסות ולא לפי הרווח. עוסק פטור לא מוסיף מע״מ לחשבונית. אם התעריף ושעות החיוב שלכם מביאים הכנסה שנתית מעל התקרה, המחשבון מתריע, כי מעליה צריך לעבור לעוסק מורשה ולהוסיף מע״מ.`,
  },
  {
    id: 'rate-faq-raise',
    question: 'מתי כדאי להעלות את התעריף?',
    answer:
      'כשהיומן מלא לאורך חודשים, כשרוב הלקוחות מסכימים להצעה בלי משא ומתן, או כשההוצאות והמס עלו. את התעריף שבמחשבון כדאי לראות כרצפה: מתחתיו אתם עובדים בהפסד ביחס ליעד. מעליו קובעים לפי השוק, הניסיון והערך ללקוח, ולעתים קרובות עדיף לתמחר פרויקט במחיר קבוע ולא לפי שעה.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function FreelancerHourlyRatePage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="התעריף השעתי המינימלי הוא ההכנסה השנתית שאתם צריכים, נטו ועוד מס, ביטוח לאומי והוצאות, חלקי השעות שאפשר באמת לחייב בשנה. המחשבון עושה את החישוב לפי מדרגות 2026 ומראה את המחיר לפני מע״מ ואחריו."
      chips={['מס 2026', 'מורשה או פטור', 'בלי הרשמה']}
      tool={<FreelancerRateCalculator />}
      faq={faq}
      cta={{
        text: 'רוצים לחייב יותר שעות? אנחנו מאוטמטים הצעות מחיר, חשבוניות ומעקב לקוחות כדי שהזמן ילך לעבודה עצמה.',
        label: 'אוטומציה לעסקים',
        href: '/services/automation',
      }}
    >
      <h2>איך מחשבים תעריף שעתי: שלושה שלבים</h2>
      <p>
        תעריף שעתי של פרילנסר הוא לא משכורת חלקי שעות. שכיר מקבל תשלום על חופש, מחלה וחגים, והמעסיק משלם חלק מהביטוח
        הלאומי. עצמאי משלם את הכול לבד ומרוויח רק בשעות שהוא מחייב. לכן החישוב נעשה בשלושה שלבים:
      </p>
      <ol>
        <li>ההכנסה הנדרשת: הנטו השנתי שרוצים, ועוד מס הכנסה, ביטוח לאומי, דמי בריאות והוצאות העסק.</li>
        <li>השעות לחיוב: ימי עבודה בשנה, פחות חופש, מחלה וחגים, כפול שעות ביום, כפול אחוז השעות שמחייבים.</li>
        <li>התעריף: ההכנסה הנדרשת חלקי השעות לחיוב. לעוסק מורשה מוסיפים עליו {STANDARD_VAT_RATE}% מע״מ.</li>
      </ol>

      <h3>דוגמה: {formatMoney(Number(defaultRateInput.targetNet))} נטו לחודש</h3>
      <p>
        מעצבת עצמאית רוצה {formatMoney(Number(defaultRateInput.targetNet))} נטו לחודש, יש לה{' '}
        {formatMoney(Number(defaultRateInput.expenses))} הוצאות בחודש, והיא עובדת {defaultRateInput.weeklyHours} שעות
        בשבוע, מתוכן {defaultRateInput.billableShare}% מחויבות. היא לוקחת {defaultRateInput.vacationDays} ימי חופש,{' '}
        {defaultRateInput.sickDays} ימי מחלה ו-{defaultRateInput.holidayDays} ימי חג, ויש לה 2.25 נקודות זיכוי.
      </p>
      <ul>
        <li>
          ימי עבודה: <span className={styles.math}>260 − {defaultRateInput.vacationDays} − {defaultRateInput.sickDays} − {defaultRateInput.holidayDays} = {example.workingDays}</span>
        </li>
        <li>
          שעות לחיוב בשנה: {example.workingDays} ימים × 8 שעות × {defaultRateInput.billableShare}% ={' '}
          {formatWhole(example.billableHours)} שעות, כ-{formatWhole(example.billableHoursMonthly)} בחודש
        </li>
        <li>
          מס הכנסה, ביטוח לאומי ודמי בריאות בשנה: {formatMoney(example.annualTax)}
        </li>
        <li>
          הכנסה שנתית נדרשת: {formatMoney(example.annualNet)} נטו + {formatMoney(example.annualTax)} מס +{' '}
          {formatMoney(example.annualExpenses)} הוצאות = {formatMoney(example.annualRevenue)}
        </li>
        <li>
          תעריף: {formatMoney(example.annualRevenue)} ÷ {formatWhole(example.billableHours)} ={' '}
          <strong>{formatMoney(example.hourly)} לשעה לפני מע״מ</strong>, {formatMoney(example.hourlyWithVat)} כולל מע״מ
        </li>
      </ul>
      <p>
        אילו הייתה מחלקת את המשכורת הרצויה ב-40 שעות לשבוע, הייתה מגיעה לכ-{formatMoney(naiveHourly)} לשעה, פחות
        ממחצית התעריף שמכסה את היעד שלה.
      </p>

      <h2>טבלה: תעריף שעתי לפי נטו רצוי</h2>
      <p>
        אותן הנחות כמו בדוגמה ({defaultRateInput.weeklyHours} שעות בשבוע, {defaultRateInput.billableShare}% לחיוב,{' '}
        {formatMoney(Number(defaultRateInput.expenses))} הוצאות בחודש), לעוסק מורשה, לפי מדרגות המס של 2026:
      </p>
      <div className={styles.tableWrap} role="region" aria-label="תעריף שעתי לפי נטו רצוי" tabIndex={0}>
        <table className={styles.table}>
          <caption>תעריף שעתי מינימלי לפי נטו לחודש</caption>
          <thead>
            <tr>
              <th scope="col">נטו לחודש</th>
              <th scope="col">לשעה לפני מע״מ</th>
              <th scope="col">לשעה כולל מע״מ</th>
              <th scope="col">הכנסה לחודש</th>
            </tr>
          </thead>
          <tbody>
            {targetRows.map((row) => (
              <tr key={row.targetNet}>
                <th scope="row">{formatMoney(row.targetNet)}</th>
                <td>{formatMoney(row.result.hourly)}</td>
                <td>{formatMoney(row.result.hourlyWithVat)}</td>
                <td>{formatMoney(row.result.monthlyRevenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>השעות שלא מחייבים קובעות את התעריף</h2>
      <p>
        המשתנה שהכי משפיע על התעריף הוא אחוז השעות שמחייבים. אותו נטו של{' '}
        {formatMoney(Number(defaultRateInput.targetNet))} בחודש דורש תעריף שונה מאוד לפי כמה מהשבוע הולך לעבודה בתשלום:
      </p>
      <ul>
        {shareRows.map((row) => (
          <li key={row.share}>
            {row.share}% שעות לחיוב ({formatWhole(row.result.billableHoursMonthly)} שעות בחודש):{' '}
            {formatMoney(row.result.hourly)} לשעה לפני מע״מ
          </li>
        ))}
      </ul>
      <p>
        כל שעה שחוסכים על עבודה שחוזרת על עצמה, כמו הצעות מחיר, חשבוניות ותזכורות ללקוחות, היא שעה שאפשר לחייב או
        לנוח בה. את המס עצמו אפשר לבדוק לעומק ב<Link href="/tools/self-employed-tax-calculator">מחשבון מס הכנסה לעצמאי</Link>,
        ואת המע״מ ב<Link href="/tools/vat-calculator">מחשבון מע״מ</Link>.
      </p>

      <h2>עוסק מורשה או עוסק פטור</h2>
      <p>
        עוסק מורשה מוסיף {STANDARD_VAT_RATE}% מע״מ לכל חשבונית ומעביר אותו לרשות המסים. המע״מ לא נכנס להכנסה שלו, ולכן
        התעריף במחשבון מחושב לפני מע״מ, והמחיר כולל המע״מ מוצג בנפרד. עוסק פטור לא גובה מע״מ, אבל ההכנסות השנתיות שלו
        מוגבלות: ב-2026 התקרה היא {formatMoney(EXEMPT_CEILING_2026)}. כשבוחרים במחשבון ״עוסק פטור״ והתעריף מביא הכנסה
        שנתית מעל התקרה, מופיעה התראה.
      </p>
      <p>
        המחשבון לא כולל הפקדות לפנסיה ולקרן השתלמות, שמקטינות את המס אבל גם את הנטו הזמין. הוא גם לא כולל זיכויים
        אישיים מעבר לנקודות הזיכוי. לתכנון מדויק כדאי לשבת עם רואה חשבון.
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
      <p className={styles.reviewed}>
        המדרגות, שיעורי הביטוח הלאומי ותקרת העוסק הפטור נבדקו מול המקורות ב-23 באוקטובר 2026.
      </p>
    </ToolLayout>
  )
}
