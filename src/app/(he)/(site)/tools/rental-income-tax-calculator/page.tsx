import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import RentalIncomeTaxCalculator from '../../components/tools/RentalIncomeTaxCalculator'
import { ceilingTable, computeRental, formatShekels, trackLabel } from '@/lib/rental-income-tax'
import styles from './page.module.css'

const PATH = '/tools/rental-income-tax-calculator'
const TITLE = 'מחשבון מס על שכר דירה'
const META_TITLE = 'מחשבון מס על שכר דירה 2026: פטור עד 5,654 ₪'
const DESCRIPTION =
  'מחשבון מס על שכר דירה 2026: תקרת פטור 5,654 ₪ בחודש, הפחתה שקל מול שקל מעליה, מסלול 10% ומסלול רגיל. השוו את שלושת המסלולים ומצאו את הזול.'

const sources = [
  {
    href: 'https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%9E%D7%A1_%D7%94%D7%9B%D7%A0%D7%A1%D7%94_(%D7%A4%D7%98%D7%95%D7%A8_%D7%9E%D7%9E%D7%A1_%D7%A2%D7%9C_%D7%94%D7%9B%D7%A0%D7%A1%D7%94_%D7%9E%D7%94%D7%A9%D7%9B%D7%A8%D7%AA_%D7%93%D7%99%D7%A8%D7%AA_%D7%9E%D7%92%D7%95%D7%A8%D7%99%D7%9D)',
    label: 'חוק מס הכנסה (פטור ממס על הכנסה מהשכרת דירת מגורים), התש״ן–1990: סעיפים 2 ו-3 (ויקיטקסט)',
  },
  {
    href: 'https://he.wikisource.org/wiki/%D7%A4%D7%A7%D7%95%D7%93%D7%AA_%D7%9E%D7%A1_%D7%94%D7%9B%D7%A0%D7%A1%D7%94',
    label: 'פקודת מס הכנסה: סעיפים 121, 121ב ו-122 (ויקיטקסט)',
  },
  {
    href: 'https://www.gov.il/BlobFolder/generalpage/income-tax-monthly-deductions-booklet/he/generalInformation_income-tax-monthly-deductions-booklet_monthly-deductions-booklet-2026.pdf',
    label: 'רשות המסים: לוח ניכויים חודשיים 2026, תקרת הכנסה משכר דירה ומדרגות המס (PDF)',
  },
  {
    href: 'https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%9E%D7%A1_%D7%A2%D7%A8%D7%9A_%D7%9E%D7%95%D7%A1%D7%A3',
    label: 'חוק מס ערך מוסף: סעיף 31(1), פטור ממע״מ להשכרה למגורים (ויקיטקסט)',
  },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'rental-tax-faq-ceiling',
    question: 'מה תקרת הפטור משכר דירה ב-2026?',
    answer:
      '5,654 ₪ בחודש. הסכום קבוע בסעיף 2 לחוק הפטור ממס על השכרת דירת מגורים, והוא הוקפא לשנים 2024 עד 2027, כך שגם ב-2027 הוא לא ישתנה. הוא מופיע גם בלוח הניכויים של רשות המסים לשנת 2026. התקרה היא לכל דירות המגורים שלכם, של בן או בת הזוג ושל ילדים עד גיל 18 יחד.',
  },
  {
    id: 'rental-tax-faq-over',
    question: 'מה קורה אם שכר הדירה מעל 5,654 ₪?',
    answer:
      'הפטור קטן שקל מול שקל. מכל שקל מעל התקרה מורידים שקל מהחלק הפטור, ומה שנשאר חייב במס. למשל, בשכר דירה של 6,500 ₪ בחודש חורגים ב-846 ₪, ולכן הפטור יורד ל-4,808 ₪ ו-1,692 ₪ בחודש חייבים במס. משכר דירה של 11,308 ₪ בחודש ומעלה לא נשאר פטור בכלל.',
  },
  {
    id: 'rental-tax-faq-ten',
    question: 'איך עובד מסלול 10%?',
    answer:
      'לפי סעיף 122 לפקודת מס הכנסה משלמים 10% מכל שכר הדירה, מהשקל הראשון, בלי לנכות הוצאות, פחת או נקודות זיכוי. את המס משלמים תוך 30 יום מסוף שנת המס, אלא אם שילמתם מקדמות במהלך השנה. המסלול מתאים בדרך כלל למי ששכר הדירה שלו גבוה בהרבה מהתקרה ושההכנסה האחרת שלו גבוהה.',
  },
  {
    id: 'rental-tax-faq-regular',
    question: 'מתי המסלול הרגיל משתלם?',
    answer:
      'במסלול הרגיל שכר הדירה מצטרף להכנסה ונמס לפי המדרגות, אבל אפשר לנכות הוצאות ופחת. עד גיל 60, לפי סעיף 121, שיעור המס על הכנסה כזו הוא לפחות 31%. מגיל 60 חלות המדרגות הרגילות מ-10%. לכן הוא משתלם בעיקר כשההוצאות גבוהות, למשל ריבית משכנתא, או כשמלאו לכם 60 וההכנסה האחרת נמוכה.',
  },
  {
    id: 'rental-tax-faq-condition',
    question: 'מה צריך כדי לקבל את הפטור?',
    answer:
      'לפי סעיף 3 לחוק הפטור, צריך שיהיה בידיכם מסמך חתום על ידי השוכר שמאשר שהדירה משמשת לו למגורים בלבד. הפטור חל על השכרה ליחיד למגורים, ולא על דירה שרשומה בספרי עסק. מי שבוחר בפטור לא יכול לנכות פחת על הדירה, ובשכירות של יותר מדירה אחת סוכמים את כל שכר הדירה יחד.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function RentalIncomeTaxCalculatorPage() {
  const table = ceilingTable()
  const example = computeRental(6_500, 12, 20_000, 150_000, false)

  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="שכר דירה ממגורים פטור ממס עד 5,654 ₪ בחודש בשנת 2026, תקרה שהוקפאה לשנים 2024 עד 2027. מעל התקרה אפשר לבחור בין פטור מופחת, מס של 10% מכל הסכום או מס לפי המדרגות עם ניכוי הוצאות, והמחשבון משווה את שלושתם."
      chips={['תקרה 5,654 ₪ בחודש', 'פטור, 10% או רגיל', 'מדרגות מס 2026']}
      tool={<RentalIncomeTaxCalculator />}
      faq={faq}
      cta={{
        text: 'משכירים כמה דירות? גבייה, קבלות, תזכורות לשוכרים ומעקב הוצאות אפשר להפוך לתהליך אוטומטי.',
        label: 'אוטומציה לעסקים',
        href: '/services/automation',
      }}
    >
      <h2>שלושת המסלולים למס על שכר דירה</h2>
      <ul>
        <li>
          <strong>מסלול פטור:</strong> שכר דירה עד 5,654 ₪ בחודש פטור לגמרי. מעל התקרה הפטור קטן שקל מול שקל, והחלק
          החייב נמס לפי המדרגות, בלי ניכוי הוצאות (סעיף 2 לחוק הפטור).
        </li>
        <li>
          <strong>מסלול 10%:</strong> מס של 10% מכל שכר הדירה, בלי הוצאות, פחת, זיכויים או קיזוזים, שמשולם תוך 30 יום
          מסוף השנה (סעיף 122 לפקודה).
        </li>
        <li>
          <strong>מסלול רגיל:</strong> שכר הדירה פחות הוצאות ופחת מצטרף להכנסה ונמס לפי המדרגות. עד גיל 60 השיעור הוא
          לפחות 31%, מגיל 60 לפי המדרגות הרגילות מ-10% (סעיף 121 לפקודה).
        </li>
      </ul>
      <p>
        התקרה של 5,654 ₪ קבועה בסעיף 2 לחוק מס הכנסה (פטור ממס על הכנסה מהשכרת דירת מגורים), עם הערת עדכון ״בשנים
        2024–2027, 5,654 ש״ח״, ומופיעה בלוח הניכויים של רשות המסים לשנת 2026 כ״תקרת הכנסה משכר דירה – פטור ממס״.
      </p>

      <h2>טבלת הפטור לפי שכר דירה חודשי</h2>
      <p>הסכומים בחודש. הפטור = 5,654 פחות הסכום שבו שכר הדירה עולה על 5,654, ולא פחות מאפס.</p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>מסלול פטור מול מסלול 10%, לחודש, 2026</caption>
          <thead>
            <tr>
              <th scope="col">שכר דירה</th>
              <th scope="col">פטור</th>
              <th scope="col">חייב במס</th>
              <th scope="col">מס 10%</th>
            </tr>
          </thead>
          <tbody>
            {table.map((row) => (
              <tr key={row.rent}>
                <th scope="row">{formatShekels(row.rent)}</th>
                <td>{formatShekels(row.exempt)}</td>
                <td>{formatShekels(row.taxable)}</td>
                <td>{formatShekels(row.flat)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>דוגמה: איזה מסלול זול יותר</h2>
      <p>
        שכיר בן 45 עם הכנסה חייבת של 150,000 ₪ בשנה משכיר דירה ב-6,500 ₪ בחודש לאורך כל השנה, ויש לו 20,000 ₪ הוצאות
        ופחת בשנה. שכר הדירה בשנה: {formatShekels(example.gross)}.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>דוגמה: 6,500 ₪ בחודש, הכנסה אחרת 150,000 ₪, גיל 45</caption>
          <thead>
            <tr>
              <th scope="col">מסלול</th>
              <th scope="col">חייב במס בשנה</th>
              <th scope="col">מס בשנה</th>
            </tr>
          </thead>
          <tbody>
            {example.tracks.map((track) => (
              <tr key={track.id}>
                <th scope="row">{track.label}</th>
                <td>{formatShekels(track.taxable)}</td>
                <td>{formatShekels(track.tax)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        במסלול הפטור חייבים במס רק 1,692 ₪ בחודש, ובשיעור 31% זה {formatShekels(example.tracks[0].tax)} בשנה. לכן{' '}
        {trackLabel(example.best)} הוא הזול כאן. ככל ששכר הדירה מתקרב ל-11,308 ₪ בחודש, הפטור נעלם ומסלול 10% הופך
        למשתלם יותר.
      </p>

      <h2>מה המחשבון לא מחשב</h2>
      <ul>
        <li>נקודות זיכוי, שמקטינות את המס הכולל ועלולות לשנות את התוצאה במסלול הרגיל ובמסלול הפטור.</li>
        <li>מס יסף של 3% על הכנסה חייבת מעל 721,560 ₪ בשנה (סעיף 121ב), ומסים נוספים על הכנסות הוניות.</li>
        <li>השכרה למטרה שאינה מגורים, השכרה בחו״ל, ודירה שרשומה בספרי עסק.</li>
        <li>שכר דירה שמשתנה מחודש לחודש: התקרה נבדקת לכל חודש השכרה בנפרד, והמחשבון מניח סכום קבוע.</li>
      </ul>
      <p>
        השכרה למגורים פטורה גם ממע״מ. מי שגם עוסק פטור יכול לבדוק את התקרה ב
        <Link href="/tools/exempt-dealer-threshold">בדיקת תקרת עוסק פטור 2026</Link>, ואת הצמדת שכר הדירה למדד ב
        <Link href="/tools/cpi-indexation-calculator">מחשבון הצמדה למדד</Link>.
      </p>

      <blockquote>
        מידע כללי ולא ייעוץ מס או ייעוץ משפטי. החישוב לפי החוק והפקודה ולוח הניכויים של 2026, בלי נקודות זיכוי ומס יסף.
        לפני בחירת מסלול, ובמיוחד כשיש כמה דירות או הכנסות נוספות, התייעצו עם רואה חשבון או יועץ מס.
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
      <p className={styles.reviewed}>
        הנתונים נבדקו מול נוסח החוק, הפקודה ולוח הניכויים של רשות המסים ב-23 באוקטובר 2026.
      </p>
    </ToolLayout>
  )
}
