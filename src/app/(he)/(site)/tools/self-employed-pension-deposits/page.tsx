import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import SelfEmployedDeposits from '../../components/tools/SelfEmployedDeposits'
import {
  DEFAULT_CREDIT_POINTS,
  MONTHS_IN_YEAR,
  formatBasisPoints,
  formatNumber,
  formatPoints,
} from '@/lib/self-employed-tax'
import {
  AVERAGE_WAGE_ANNUAL,
  AVERAGE_WAGE_MONTHLY,
  BENEFICIARY_MIN_DEPOSIT,
  HISHTALMUT_BENEFICIAL_DEPOSIT,
  HISHTALMUT_INCOME_CEILING,
  HISHTALMUT_MAX_DEDUCTIBLE,
  MANDATORY_LOWER_LIMIT,
  MANDATORY_MAX_DEPOSIT,
  PENSION_CREDIT_BASE_WITH_DISABILITY_BASIS_POINTS,
  PENSION_INCOME_CEILING,
  PENSION_INCOME_CEILING_MONTHLY,
  PENSION_MAX_CREDIT,
  PENSION_MAX_CREDIT_BASE,
  PENSION_MAX_DEDUCTION,
  PENSION_MAX_DEPOSIT,
  depositsForIncome,
} from '@/lib/self-employed-deposits'
import styles from './page.module.css'

const PATH = '/tools/self-employed-pension-deposits'
const TITLE = 'מחשבון קרן השתלמות ופנסיה לעצמאי 2026'
const META_TITLE = 'מחשבון קרן השתלמות לעצמאי 2026: כמה להפקיד'
const SOURCES_CHECKED = '23.10.2026'

const n = formatNumber
const points = DEFAULT_CREDIT_POINTS.man
const mandatoryMonthly = Math.round(MANDATORY_MAX_DEPOSIT / MONTHS_IN_YEAR)
const disabilityFullDeposit =
  PENSION_MAX_DEDUCTION +
  Math.round((PENSION_INCOME_CEILING * PENSION_CREDIT_BASE_WITH_DISABILITY_BASIS_POINTS) / 10_000)

const DESCRIPTION = `עצמאי ב-2026 מנכה עד ${n(HISHTALMUT_MAX_DEDUCTIBLE)} ₪ על קרן השתלמות (4.5% מהכנסה עד ${n(
  HISHTALMUT_INCOME_CEILING,
)} ₪) ומקבל הטבת מס על פנסיה עד ${n(PENSION_MAX_DEPOSIT)} ₪. מחשבון הפקדות סוף שנה.`

const LEDE = `ב-2026 עצמאי מנכה ממס הפקדה לקרן השתלמות של עד ${n(HISHTALMUT_MAX_DEDUCTIBLE)} ₪, 4.5% מהכנסה של עד ${n(
  HISHTALMUT_INCOME_CEILING,
)} ₪, ויכול להפקיד עד ${n(HISHTALMUT_BENEFICIAL_DEPOSIT)} ₪ עם פטור ממס רווחי הון. לפנסיה, הפקדת החובה היא עד ${n(
  MANDATORY_MAX_DEPOSIT,
)} ₪, והטבת המס המלאה ניתנת על עד ${n(PENSION_MAX_DEPOSIT)} ₪, 16.5% מהכנסה של עד ${n(
  PENSION_INCOME_CEILING,
)} ₪. ההפקדות נספרות לשנה שבה שולמו, ולכן מפקידים עד 31 בדצמבר.`

const tableIncomes = [120_000, 180_000, 240_000, HISHTALMUT_INCOME_CEILING, 400_000]
const tableRows = tableIncomes.map((income) => ({ income, result: depositsForIncome(income, points) }))

const low = depositsForIncome(180_000, points)
const high = depositsForIncome(350_000, points)
const lowBtlDeduction = low.income - low.taxable
const lowPensionDeductionSaving = low.pension.saving - low.pension.credit
const highPensionDeductionSaving = high.pension.saving - high.pension.credit
const totalDeposit = (result: typeof low) => result.hishtalmut.deductible + result.pension.fullDeposit

const wikisource = (title: string) => `https://he.wikisource.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`

const sources: { href: string; label: string; note: string }[] = [
  {
    href: wikisource('פקודת מס הכנסה'),
    label: 'פקודת מס הכנסה, בנוסח המעודכן בוויקיטקסט',
    note: `סעיף 17(5א): 4.5% מהכנסה קובעת של עד ${n(HISHTALMUT_INCOME_CEILING)} ₪ בשנים 2024 עד 2027. סעיף 9(16ב): הפקדה מוטבת של ${n(
      HISHTALMUT_BENEFICIAL_DEPOSIT,
    )} ₪ בשנים 2025 ו-2026 ומשיכה אחרי 6 או 3 שנים. סעיף 3(ה2). סעיפים 47 ו-45א: ניכוי וזיכוי על הפקדה לקופת גמל לקצבה, עמית מוטב ותקרת ${n(
      PENSION_INCOME_CEILING / 2,
    )} ₪ בשנים 2024 עד 2027`,
  },
  {
    href: wikisource('חוק ההתייעלות הכלכלית (תיקוני חקיקה להשגת יעדי התקציב לשנות התקציב 2017 ו-2018)'),
    label: 'חוק ההתייעלות הכלכלית (תיקוני חקיקה להשגת יעדי התקציב לשנות התקציב 2017 ו-2018), פרק ב׳',
    note: 'חובת ההפקדה לקופת גמל לקצבה לעצמאי: הגדרת ההכנסה החייבת בהפקדה, 4.45% ו-12.55%, הפקדה עד תום שנת המס, החריגים, מרכיב החיסכון למצב אבטלה, התראה וקנס (סעיפים 2 עד 9)',
  },
  {
    href: wikisource('חוק הביטוח הלאומי'),
    label: 'חוק הביטוח הלאומי [נוסח משולב], בוויקיטקסט',
    note: 'סעיף 345: ההכנסה של עובד עצמאי לדמי ביטוח והסכומים שמופחתים ממנה',
  },
  {
    href: wikisource('חוק גיל פרישה'),
    label: 'חוק גיל פרישה, בוויקיטקסט',
    note: 'סעיף 5: גיל הפרישה המוקדמת הוא 60',
  },
  {
    href: 'https://www.btl.gov.il/Mediniyut/GeneralData/Pages/%D7%A9%D7%9B%D7%A8%20%D7%9E%D7%9E%D7%95%D7%A6%D7%A2.aspx',
    label: 'הביטוח הלאומי: שכר ממוצע לפי סעיפים 1 ו-2 לחוק',
    note: `השכר הממוצע לפי סעיף 2 מ-1 בינואר 2026: ${n(AVERAGE_WAGE_MONTHLY)} ₪`,
  },
  {
    href: 'https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/hishov.dmey.bituach.aspx',
    label: 'הביטוח הלאומי: דוגמה לחישוב דמי ביטוח לעובד עצמאי',
    note: 'ההכנסה לדמי ביטוח לפני הניכויים לפי הפקודה, בהפחתת 52% מדמי הביטוח הלאומי וחלק מההפקדה לקופת גמל',
  },
  {
    href: 'https://www.capitax.co.il/Attachments/15042026.pdf',
    label: 'רשות המסים: לוח עזר לחישוב מס הכנסה לחודש ינואר 2026 ואילך, פרק ג׳',
    note: `סכומים מתואמים לשנת 2026: ${n(HISHTALMUT_INCOME_CEILING)} ₪, הפקדה מוטבת ${n(
      HISHTALMUT_BENEFICIAL_DEPOSIT,
    )} ₪, שכר ממוצע ${n(AVERAGE_WAGE_MONTHLY)} ₪, עמית מוטב ${n(BENEFICIARY_MIN_DEPOSIT)} ₪ ותקרת ${n(
      PENSION_INCOME_CEILING_MONTHLY,
    )} ₪ לחודש לפי סעיף 45א(ה)(2) (עותק של חוברת רשות המסים)`,
  },
  {
    href: 'https://media.harel-group.co.il/media/smegncwi/%D7%AA%D7%A7%D7%A8%D7%95%D7%AA-%D7%94%D7%A4%D7%A7%D7%93%D7%94-%D7%91%D7%A7%D7%95%D7%A4%D7%95%D7%AA-%D7%94%D7%92%D7%9E%D7%9C-%D7%95%D7%91%D7%A7%D7%A8%D7%A0%D7%95%D7%AA-%D7%94%D7%A9%D7%AA%D7%9C%D7%9E%D7%95%D7%AA-2026.pdf',
    label: 'הראל: תקרות וסכומים לשנת 2026',
    note: `אישור משני: ניכוי 11% וזיכוי 5.5% עד ${n(PENSION_INCOME_CEILING)} ₪, ${n(PENSION_MAX_DEPOSIT)} ₪ או ${n(
      disabilityFullDeposit,
    )} ₪ עם ביטוח אובדן כושר עבודה, ו-7% בקרן השתלמות לעצמאי`,
  },
  {
    href: 'https://www.supermarker.themarker.com/Pension/TaxBenefitsPensionFunds2017.aspx',
    label: 'סופרמרקר, TheMarker: הטבות המס ותקרות ההפרשה לפנסיה ב-2026',
    note: 'אישור משני לסכומים, והמלצה להעביר את ההפקדה האחרונה כשבוע לפני סוף השנה',
  },
  {
    href: 'https://www.fnx.co.il/calculators/end-year/',
    label: 'הפניקס: מחשבון הטבות מס לעצמאים לשנת 2026',
    note: 'אישור המס השנתי על ההפקדות מצורף לדוח השנתי לעמיתים ומוגש עם הדוח השנתי למס הכנסה',
  },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'sepd-faq-hishtalmut',
    question: 'כמה מותר להפקיד לקרן השתלמות כעצמאי ב-2026?',
    answer: `עצמאי מנכה מההכנסה החייבת הפקדה של עד 4.5% מההכנסה מהעסק, עד הכנסה של ${n(
      HISHTALMUT_INCOME_CEILING,
    )} ₪ בשנה, ולכן ב-2026 הניכוי המרבי הוא ${n(HISHTALMUT_MAX_DEDUCTIBLE)} ₪. אפשר להפקיד יותר, עד ${n(
      HISHTALMUT_BENEFICIAL_DEPOSIT,
    )} ₪, ולקבל פטור ממס רווחי הון על הרווחים, אבל בלי ניכוי על החלק שמעל 4.5%. התקרה קבועה בפקודה לשנים 2024 עד 2027, וההפקדה צריכה להגיע לקרן עד 31 בדצמבר.`,
  },
  {
    id: 'sepd-faq-percent',
    question: 'מה ההבדל בין 4.5% ל-7% בקרן השתלמות לעצמאי?',
    answer: `4.5% מההכנסה, עד ${n(
      HISHTALMUT_MAX_DEDUCTIBLE,
    )} ₪, הם החלק שמוכר בניכוי ומקטין את מס ההכנסה. 7% הם הדרך שבה חברות מנהלות מתארות את ההפקדה המוטבת, הסכום שהרווחים עליו פטורים ממס רווחי הון. בפקודת מס הכנסה זה סכום קבוע, ${n(
      HISHTALMUT_BENEFICIAL_DEPOSIT,
    )} ₪ לשנה ב-2026, קרוב ל-7% מתקרת ההכנסה. על ההפרש בין שני הסכומים אין ניכוי, אבל הרווחים פטורים כשמושכים אחרי 6 שנים.`,
  },
  {
    id: 'sepd-faq-mandatory',
    question: 'האם עצמאי חייב להפקיד לפנסיה, וכמה?',
    answer: `כן. מגיל 21 ועד גיל 60, ואחרי חצי שנה מהרישום כעוסק, עצמאי חייב להפקיד לקופת גמל לקצבה: 4.45% על ההכנסה עד ${n(
      MANDATORY_LOWER_LIMIT,
    )} ₪ בשנה, ו-12.55% על החלק שבין ${n(MANDATORY_LOWER_LIMIT)} ל-${n(
      AVERAGE_WAGE_ANNUAL,
    )} ₪. ההפקדה המרבית לפי החוק ב-2026 היא ${n(MANDATORY_MAX_DEPOSIT)} ₪, כ-${n(
      mandatoryMonthly,
    )} ₪ בחודש. הסכומים נגזרים מהשכר הממוצע במשק, ${n(AVERAGE_WAGE_MONTHLY)} ₪ בחודש, שמתעדכן בכל ינואר.`,
  },
  {
    id: 'sepd-faq-deadline',
    question: 'עד מתי צריך להפקיד כדי שההפקדה תיחשב ל-2026?',
    answer:
      'עד 31 בדצמבר 2026. הניכוי והזיכוי ניתנים על סכומים ששולמו בשנת המס, וחוק פנסיית החובה דורש להפקיד עד תום שנת המס. הפקדה של הרגע האחרון עלולה להירשם בקרן רק בינואר, ולכן כדאי להעביר כמה ימים לפני סוף השנה ולשאול את הקרן מה המועד האחרון שלה. את אישור המס השנתי שהקרן שולחת מגישים עם הדוח השנתי.',
  },
  {
    id: 'sepd-faq-pension-saving',
    question: 'כמה מס חוסכת הפקדה לפנסיה לעצמאי?',
    answer: `על הפקדה של 16.5% מההכנסה, עד הכנסה של ${n(
      PENSION_INCOME_CEILING,
    )} ₪, עצמאי מקבל ניכוי של 11% מההכנסה וזיכוי של 35% על עוד 5.5%. בהכנסה של ${n(
      PENSION_INCOME_CEILING,
    )} ₪ ומעלה זו הפקדה של ${n(PENSION_MAX_DEPOSIT)} ₪: ניכוי של ${n(
      PENSION_MAX_DEDUCTION,
    )} ₪, שחוסך לפי מדרגת המס, וזיכוי של ${n(PENSION_MAX_CREDIT)} ₪. עצמאי עם הכנסה של 180,000 ₪ ו-2.25 נקודות זיכוי חוסך כ-${n(
      low.pension.saving,
    )} ₪ במס הכנסה על הפקדה של ${n(low.pension.fullDeposit)} ₪.`,
  },
  {
    id: 'sepd-faq-over-ceiling',
    question: 'מה קורה אם מפקידים יותר מהתקרה?',
    answer: `ההפקדה מותרת, אבל ההטבה נעצרת בתקרה. בקרן השתלמות, מה שמעל 4.5% מההכנסה לא מוכר בניכוי, ועל הרווחים מהחלק שמעל ${n(
      HISHTALMUT_BENEFICIAL_DEPOSIT,
    )} ₪ משלמים מס כשמושכים. בפנסיה, הפקדה מעל 16.5% מההכנסה או מעל ${n(
      PENSION_MAX_DEPOSIT,
    )} ₪ לא מוסיפה ניכוי או זיכוי, אבל הכסף נשאר חיסכון לפנסיה. הפקדה גדולה בסוף השנה כדאי לתאם עם רואה החשבון.`,
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function SelfEmployedPensionDepositsPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede={LEDE}
      chips={['תקרות 2026 מפקודת מס הכנסה', 'פנסיה חובה לפי החוק', 'חיסכון לפי מדרגת המס שלכם', 'הסכומים לא נשלחים לשום מקום']}
      tool={<SelfEmployedDeposits />}
      faq={faq}
      cta={{
        text: 'תזכורת להפקדה של סוף השנה, חשבוניות ודוח הכנסות שמתעדכן לבד: אנחנו בונים לעצמאים אוטומציה שחוסכת את העבודה הידנית מול רואה החשבון.',
        label: 'אוטומציה לעסקים',
        href: '/services/automation',
      }}
    >
      <h2>כמה מותר להפקיד לקרן השתלמות כעצמאי ב-2026</h2>
      <p>
        לפי סעיף 17(5א) לפקודת מס הכנסה, עצמאי מנכה מההכנסה החייבת הפקדה לקרן השתלמות לעצמאים של עד 4.5% מההכנסה
        הקובעת: ההכנסה החייבת מהעסק, עד {n(HISHTALMUT_INCOME_CEILING)} ₪ בשנה. הסכום הזה קבוע בפקודה לשנים 2024 עד
        2027, ולכן ב-2026 הניכוי המרבי הוא {n(HISHTALMUT_MAX_DEDUCTIBLE)} ₪. מי שמרוויח פחות מנכה 4.5% מההכנסה שלו:
        על 180,000 ₪ זה {n(low.hishtalmut.deductible)} ₪.
      </p>
      <p>
        הניכוי מקטין את ההכנסה שעליה מחושב מס ההכנסה, ולכן החיסכון שווה בערך לסכום כפול מדרגת המס השולית שלכם. דמי
        הביטוח הלאומי לא יורדים: סעיף 345 לחוק הביטוח הלאומי קובע שההכנסה לדמי ביטוח נמדדת לפני הניכויים לפי
        הפקודה, ומפחית ממנה רק 52% מדמי הביטוח הלאומי וחלק מההפקדה לפנסיה.
      </p>
      <p>
        את הכסף אפשר למשוך בלי מס אחרי 6 שנים מההפקדה הראשונה, אחרי 3 שנים למי שהגיע לגיל פרישה, או אחרי 3 שנים
        כשמשתמשים בו להשתלמות מקצועית (סעיף 9(16ב)).
      </p>

      <h2>מה ההבדל בין 4.5% ל-7%</h2>
      <p>
        4.5% הם החלק שמוכר בניכוי. מעבר לזה אפשר להפקיד עוד, בלי ניכוי, ועדיין ליהנות מפטור ממס על הרווחים: סעיף
        9(16ב) פוטר את הרווחים שמקורם בהפקדה המוטבת, שהיא {n(HISHTALMUT_BENEFICIAL_DEPOSIT)} ₪ לשנה ב-2025 וב-2026.
        חברות מנהלות מציגות את זה כ-7% מההכנסה ועד התקרה, ו-7% מ-{n(HISHTALMUT_INCOME_CEILING)} ₪ הם{' '}
        {n(high.hishtalmut.fundShare)} ₪, קרוב לסכום שבפקודה. בפקודה עצמה ההפקדה המוטבת היא סכום קבוע ולא אחוז, ולכן
        מי שהכנסתו נמוכה ורוצה להפקיד הרבה כדאי שיבדוק עם הקרן כמה היא מקבלת.
      </p>
      <ul>
        <li>
          עד {n(HISHTALMUT_MAX_DEDUCTIBLE)} ₪, או 4.5% מההכנסה אם היא נמוכה מהתקרה: ניכוי ממס הכנסה וגם פטור על
          הרווחים.
        </li>
        <li>מעל זה ועד {n(HISHTALMUT_BENEFICIAL_DEPOSIT)} ₪: רק פטור על הרווחים.</li>
        <li>מעל {n(HISHTALMUT_BENEFICIAL_DEPOSIT)} ₪: בלי ניכוי ובלי פטור על הרווחים מהחלק הזה.</li>
      </ul>

      <h2>האם חובה להפקיד לפנסיה כעצמאי, וכמה</h2>
      <p>
        כן. פרק ב׳ של חוק ההתייעלות הכלכלית לשנות התקציב 2017 ו-2018 מחייב עצמאי להפקיד לקופת גמל לקצבה, כמו קרן
        פנסיה, לפי ההכנסה החייבת מהעסק לפני הניכויים על פנסיה, קרן השתלמות וביטוח לאומי:
      </p>
      <ul>
        <li>
          4.45% על החלק של ההכנסה עד מחצית השכר הממוצע במשק: עד {n(MANDATORY_LOWER_LIMIT)} ₪ בשנה ב-2026.
        </li>
        <li>
          12.55% על החלק שבין מחצית השכר הממוצע לשכר הממוצע: מ-{n(MANDATORY_LOWER_LIMIT)} ועד{' '}
          {n(AVERAGE_WAGE_ANNUAL)} ₪ בשנה.
        </li>
        <li>
          על הכנסה מעל {n(AVERAGE_WAGE_ANNUAL)} ₪ אין חובה נוספת. ההפקדה המרבית לפי החוק היא{' '}
          {n(MANDATORY_MAX_DEPOSIT)} ₪ בשנה, כ-{n(mandatoryMonthly)} ₪ בחודש.
        </li>
      </ul>
      <p>
        השכר הממוצע שהחוק משתמש בו הוא השכר הממוצע לפי סעיף 2(ב) לחוק הביטוח הלאומי, {n(AVERAGE_WAGE_MONTHLY)} ₪
        בחודש מ-1 בינואר 2026, והוא מתעדכן בכל ינואר. החובה לא חלה על מי שטרם מלאו לו 21, על מי שהגיע לגיל הפרישה
        המוקדמת, 60, ובחצי השנה הראשונה אחרי הרישום כעוסק במע״מ. שליש מכל הפקדה, עד תקרה, נזקף למרכיב חיסכון למצב
        אבטלה, כסף שמיועד למשיכה כשמפסיקים לעבוד כעצמאי או סוגרים את העסק.
      </p>
      <p>
        מי שלא הפקיד והכנסתו מעל 12 פעמים שכר המינימום עלול לקבל התראה. אם לא ישלים את ההפקדה בתוך 90 יום, יוטל עליו
        קנס, שבנוסח החוק הוא 500 ₪ ומתעדכן לפי המדד.
      </p>

      <h2>כמה מס חוסכת הפקדה לפנסיה לעצמאי</h2>
      <p>
        סעיפים 47 ו-45א לפקודה נותנים לעצמאי שתי הטבות על הפקדה לקופת גמל לקצבה: ניכוי של עד 11% מההכנסה, שמקטין את
        ההכנסה החייבת, וזיכוי של 35% על הפקדה של עוד 5.5% מההכנסה, שיורד ישירות מהמס. שתיהן חלות על הכנסה של עד{' '}
        {n(PENSION_INCOME_CEILING)} ₪ בשנה ב-2026, {n(PENSION_INCOME_CEILING_MONTHLY)} ₪ בחודש. לכן ההפקדה שמנצלת את
        ההטבה כולה היא 16.5% מההכנסה ועד {n(PENSION_MAX_DEPOSIT)} ₪: {n(PENSION_MAX_DEDUCTION)} ₪ בניכוי ו-
        {n(PENSION_MAX_CREDIT_BASE)} ₪ בזיכוי ששווה {n(PENSION_MAX_CREDIT)} ₪.
      </p>
      <p>
        הזיכוי שווה 35% מהסכום לכל אחד, והניכוי שווה לפי מדרגת המס השולית, מ-10% ועד 47%. את ה-0.5% האחרונים בזיכוי
        מקבל רק מי שלא מנכה ביטוח אובדן כושר עבודה כהוצאה. למי שמנכה, ההפקדה המלאה היא 16% ועד{' '}
        {n(disabilityFullDeposit)} ₪. הפקדת החובה היא חלק מהסכום הזה ולא תוספת עליו.
      </p>
      <p>
        כשמפקידים פחות מהסכום המלא, החלוקה בין ניכוי לזיכוי תלויה בתנאים נוספים בסעיפים 47 ו-45א, למשל אם ההפקדות
        בשנה הגיעו ל-16% מהשכר הממוצע, {n(BENEFICIARY_MIN_DEPOSIT)} ₪ (עמית מוטב). לכן המחשבון מראה את החיסכון
        בהפקדה המלאה, ואת החלוקה של סכום חלקי עושה רואה החשבון בדוח השנתי. חלק מההפקדה לפנסיה מופחת גם מההכנסה לדמי
        ביטוח לאומי לפי סעיף 345, והחלק הזה לא נכלל בחישוב.
      </p>

      <h2>עד מתי מפקידים כדי שייחשב ל-2026</h2>
      <p>
        הניכוי והזיכוי ניתנים על סכומים ששולמו בשנת המס, ושנת המס נגמרת ב-31 בדצמבר. גם חוק פנסיית החובה קובע שמפקידים
        עד תום שנת המס, והפקדה מאוחרת נחשבת להפקדה ביום שבו בוצעה בפועל. הפקדה של הרגע האחרון עלולה להירשם בקרן רק
        בינואר, ולכן כדאי להעביר את הכסף כמה ימים לפני סוף השנה ולשאול את הקרן מה המועד האחרון שלה.
      </p>
      <p>
        אחרי סוף השנה הקרן שולחת אישור מס שנתי על ההפקדות. מגישים אותו עם הדוח השנתי למס הכנסה, ושם מקבלים את הניכוי
        ואת הזיכוי. מי שמגיש דרך רואה חשבון מעביר לו את האישור.
      </p>

      <h2>מה קורה אם מפקידים יותר מהתקרה</h2>
      <ul>
        <li>
          קרן השתלמות: מה שמעל 4.5% מההכנסה לא מוכר בניכוי. עד {n(HISHTALMUT_BENEFICIAL_DEPOSIT)} ₪ הרווחים פטורים
          ממס, ועל הרווחים מהחלק שמעל ההפקדה המוטבת משלמים מס כשמושכים.
        </li>
        <li>
          פנסיה: הפקדה מעל 16.5% מההכנסה, או מעל {n(PENSION_MAX_DEPOSIT)} ₪, לא מוסיפה ניכוי או זיכוי. הכסף נשאר
          חיסכון לפנסיה.
        </li>
        <li>
          הפקדה לפנסיה מעל החובה ועד 16.5% מההכנסה היא לא עודף: היא מקבלת את אותה הטבת מס, כי ההטבה מחושבת על כל
          ההפקדה ולא רק על החובה.
        </li>
      </ul>

      <h2>כמה חוסכים בכל רמת הכנסה</h2>
      <p>
        חישבנו את הסכומים לעצמאי עם {formatPoints(points)} נקודות זיכוי, שעוד לא הפקיד השנה ושהעסק הוא מקור ההכנסה
        היחיד שלו. החיסכון הוא במס הכנסה בלבד, בהפקדה המלאה לקרן ההשתלמות ולפנסיה.
      </p>
      <div className={styles.tableWrap} role="region" aria-label="הפקדות וחיסכון במס לפי הכנסה" tabIndex={0}>
        <table className={styles.table}>
          <caption>הפקדות 2026 וחיסכון משוער במס הכנסה, בשקלים לשנה</caption>
          <thead>
            <tr>
              <th scope="col">הכנסה חייבת</th>
              <th scope="col">מדרגה שולית</th>
              <th scope="col">קרן השתלמות בניכוי</th>
              <th scope="col">חיסכון מהקרן</th>
              <th scope="col">פנסיה חובה</th>
              <th scope="col">פנסיה להטבה מלאה</th>
              <th scope="col">חיסכון מהפנסיה</th>
              <th scope="col">סך החיסכון</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map(({ income, result }) => (
              <tr key={income}>
                <th scope="row">{n(income)}</th>
                <td>{formatBasisPoints(result.marginalRateBasisPoints)}</td>
                <td>{n(result.hishtalmut.deductible)}</td>
                <td>{n(result.hishtalmut.saving)}</td>
                <td>{n(result.mandatory.total)}</td>
                <td>{n(result.pension.fullDeposit)}</td>
                <td>{n(result.pension.saving)}</td>
                <td className={styles.total}>{n(result.totalSaving)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        ככל שההכנסה עולה, כל שקל בניכוי שווה יותר, כי הוא יורד מהמדרגה הגבוהה. הזיכוי על הפנסיה שווה 35% בכל רמת
        הכנסה, ולכן במדרגות של עד 31% כל שקל בפנסיה חוסך יותר מכל שקל בקרן ההשתלמות.
      </p>

      <h2>דוגמה: הכנסה חייבת של 180,000 ₪</h2>
      <p>עצמאי, גבר, עם {formatPoints(points)} נקודות זיכוי, שעוד לא הפקיד השנה:</p>
      <ol>
        <li>
          52% מדמי הביטוח הלאומי, {n(lowBtlDeduction)} ₪, יורדים מההכנסה, ונשארת הכנסה חייבת של {n(low.taxable)} ₪. מס
          ההכנסה בלי הפקדות: {n(low.taxBefore)} ₪, ומדרגת המס השולית {formatBasisPoints(low.marginalRateBasisPoints)}.
        </li>
        <li>
          קרן השתלמות: 4.5% מ-180,000 ₪ הם {n(low.hishtalmut.deductible)} ₪. הניכוי חוסך {n(low.hishtalmut.saving)} ₪.
        </li>
        <li>
          פנסיה חובה: 4.45% על {n(low.mandatory.lowerIncome)} ₪ הם {n(low.mandatory.lowerDeposit)} ₪, ו-12.55% על{' '}
          {n(low.mandatory.upperIncome)} ₪ הם {n(low.mandatory.upperDeposit)} ₪. ביחד {n(low.mandatory.total)} ₪.
        </li>
        <li>
          פנסיה להטבה מלאה: 16.5% מ-180,000 ₪ הם {n(low.pension.fullDeposit)} ₪. הניכוי של {n(low.pension.deduction)} ₪
          חוסך {n(lowPensionDeductionSaving)} ₪, והזיכוי של 35% על {n(low.pension.creditBase)} ₪ שווה{' '}
          {n(low.pension.credit)} ₪. ביחד {n(low.pension.saving)} ₪.
        </li>
      </ol>
      <p>
        הפקדות של {n(totalDeposit(low))} ₪ מורידות את מס ההכנסה מ-{n(low.taxBefore)} ל-{n(low.taxAfter)} ₪, חיסכון של{' '}
        {n(low.totalSaving)} ₪. {n(low.mandatory.total)} ₪ מתוכם הם הפקדת החובה, שצריך להפקיד בכל מקרה.
      </p>

      <h2>דוגמה: הכנסה חייבת של 350,000 ₪</h2>
      <ol>
        <li>
          אחרי ניכוי 52% מדמי הביטוח הלאומי נשארת הכנסה חייבת של {n(high.taxable)} ₪. מס ההכנסה בלי הפקדות:{' '}
          {n(high.taxBefore)} ₪, ומדרגת המס השולית {formatBasisPoints(high.marginalRateBasisPoints)}.
        </li>
        <li>
          קרן השתלמות: ההכנסה מעל התקרה, ולכן הניכוי הוא המרבי, {n(high.hishtalmut.deductible)} ₪. הוא חוסך{' '}
          {n(high.hishtalmut.saving)} ₪.
        </li>
        <li>פנסיה חובה: ההכנסה מעל השכר הממוצע, ולכן החובה היא המרבית, {n(high.mandatory.total)} ₪.</li>
        <li>
          פנסיה להטבה מלאה: {n(high.pension.fullDeposit)} ₪, 16.5% מ-{n(PENSION_INCOME_CEILING)} ₪. הניכוי של{' '}
          {n(high.pension.deduction)} ₪ חוסך {n(highPensionDeductionSaving)} ₪, והזיכוי שווה {n(high.pension.credit)} ₪.
          ביחד {n(high.pension.saving)} ₪.
        </li>
      </ol>
      <p>
        הפקדות של {n(totalDeposit(high))} ₪ מורידות את מס ההכנסה מ-{n(high.taxBefore)} ל-{n(high.taxAfter)} ₪, חיסכון
        של {n(high.totalSaving)} ₪. ההכנסה שמעל התקרות לא מגדילה את הסכומים שמקבלים עליהם הטבה, ולכן ההפקדות זהות
        לאלה של מי שמרוויח {n(HISHTALMUT_INCOME_CEILING)} ₪.
      </p>

      <h2>מה המחשבון לא כולל, ומתי לדבר עם רואה חשבון</h2>
      <ul>
        <li>
          מי שגם שכיר: הכנסה מבוטחת ממשכורת מקטינה את חובת ההפקדה ומשנה את תקרות ההטבה, ולכן החישוב כאן לא יתאים.
        </li>
        <li>החלוקה המדויקת בין ניכוי לזיכוי כשמפקידים לפנסיה פחות מהסכום המלא.</li>
        <li>ההפחתה בדמי הביטוח הלאומי בגלל ההפקדה לפנסיה.</li>
        <li>ניכוי ביטוח אובדן כושר עבודה כהוצאה, שמקטין את הזיכוי ל-5%.</li>
        <li>הפקדות בעד בן או בת זוג וילדים, וחישוב משותף לבני זוג.</li>
        <li>
          מס ההכנסה המלא, עם ביטוח לאומי ונקודות זיכוי: לזה יש לנו{' '}
          <Link href="/tools/self-employed-tax-calculator">מחשבון מס הכנסה לעצמאי</Link>.
        </li>
      </ul>
      <p>
        כדאי לדבר עם רואה חשבון או יועץ מס לפני הפקדה גדולה בסוף השנה, כשההכנסה השנה שונה מאוד מהמקדמות, וכשיש גם
        משכורת. את בחירת הקרן, מסלול ההשקעה והכיסוי הביטוחי בפנסיה בודקים עם יועץ פנסיוני.
      </p>

      <h2>מקורות</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noopener" target="_blank">
              {source.label}
            </a>
            : {source.note}. נבדק ב-{SOURCES_CHECKED}.
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        זו הערכה ולא ייעוץ מס או ייעוץ פנסיוני, והיא לא מחליפה רואה חשבון, יועץ מס או את הדוח השנתי. השכר הממוצע,
        ואיתו הפקדת החובה, מתעדכן בכל ינואר. התקרות לקרן השתלמות ולהטבות על פנסיה קבועות בפקודה לשנים 2024 עד 2027,
        וכדאי לבדוק אותן שוב בתחילת כל שנה.
      </p>
    </ToolLayout>
  )
}
