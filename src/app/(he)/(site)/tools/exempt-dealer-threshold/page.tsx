import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import ExemptDealerChecker from '../../components/tools/ExemptDealerChecker'
import { THRESHOLD, computeExemptDealer, formatShekels, monthName, paceTable } from '@/lib/exempt-dealer'
import styles from './page.module.css'

const PATH = '/tools/exempt-dealer-threshold'
const TITLE = 'תקרת עוסק פטור 2026'
const META_TITLE = 'תקרת עוסק פטור 2026: 122,833 ₪ – בדיקה ותחזית'
const DESCRIPTION =
  'תקרת עוסק פטור 2026 היא 122,833 ₪ לשנה לפי רשות המסים. בדקו כמה נשאר לכם עד התקרה, באיזה חודש תעברו אותה ומה קורה כשעוברים לעוסק מורשה.'

const sources = [
  {
    href: 'https://www.gov.il/he/departments/general/vat-rate-amount-new',
    label: 'רשות המסים: סכומים ושיעורים במע״מ (עודכן 01.07.2026), עוסק פטור 122,833 ₪ מ-1.1.2026',
  },
  {
    href: 'https://www.gov.il/he/service/request-open-exempt-dealer-via-internet',
    label: 'רשות המסים: בקשה לפתיחת תיק עוסק פטור באמצעות האינטרנט (עודכן 18.01.2026)',
  },
  {
    href: 'https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%9E%D7%A1_%D7%A2%D7%A8%D7%9A_%D7%9E%D7%95%D7%A1%D7%A3',
    label: 'חוק מס ערך מוסף, התשל״ו–1975: סעיפים 1, 31, 59 ו-126 (ויקיטקסט)',
  },
  {
    href: 'https://he.wikisource.org/wiki/%D7%AA%D7%A7%D7%A0%D7%95%D7%AA_%D7%9E%D7%A1_%D7%A2%D7%A8%D7%9A_%D7%9E%D7%95%D7%A1%D7%A3_(%D7%A8%D7%99%D7%A9%D7%95%D7%9D)',
    label: 'תקנות מס ערך מוסף (רישום), התשל״ו–1976: תקנות 8, 13 ו-15 (ויקיטקסט)',
  },
  {
    href: 'https://www.gov.il/he/service/vat-declarationisexempt',
    label: 'רשות המסים: הצהרת עוסק פטור',
  },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'exempt-dealer-faq-threshold',
    question: 'מה תקרת עוסק פטור 2026?',
    answer:
      '122,833 ₪ מחזור עסקאות בשנה, מ-1 בינואר 2026, לפי דף הסכומים במע״מ של רשות המסים. בשנים 2024 ו-2025 התקרה הייתה 120,000 ₪. מחזור הוא סך ההכנסות מכל העסקים שלכם לפני הוצאות, ולא הרווח. מי שהמחזור שלו לא עולה על התקרה, ואינו במקצוע שחייב להירשם כעוסק מורשה, יכול להיות עוסק פטור.',
  },
  {
    id: 'exempt-dealer-faq-crossing',
    question: 'מה קורה אם עברתי את תקרת עוסק פטור?',
    answer:
      'לפי סעיף 1 לחוק מע״מ, עוסק פטור הוא מי שהמחזור שלו לא עולה על התקרה. מי שעבר אותה כבר לא עומד בהגדרה וצריך לעבור לעוסק מורשה, לגבות מע״מ ולדווח עליו. תקנה 8 לתקנות הרישום מחייבת להודיע למע״מ תוך 15 יום על אירוע שמצריך שינוי ברישום. ממתי בדיוק חל המע״מ כדאי לברר מול משרד מע״מ או רואה חשבון.',
  },
  {
    id: 'exempt-dealer-faq-professions',
    question: 'אילו מקצועות לא יכולים להיות עוסק פטור?',
    answer:
      'תקנה 13 לתקנות מע״מ (רישום) מחייבת רישום כעוסק מורשה בלי קשר למחזור. ביניהם: עורכי דין, רואי חשבון, יועצי מס, מנהלי חשבונות, מהנדסים, אדריכלים, הנדסאים, טכנאים, כלכלנים, יועצים לניהול, מתורגמנים, שמאים, סוכני ביטוח, רופאים, פסיכולוגים, פיזיותרפיסטים, וטרינרים, בתי ספר לנהיגה, מתווכי מקרקעין ורכב, וחברות בע״מ.',
  },
  {
    id: 'exempt-dealer-faq-2027',
    question: 'מתי תתעדכן התקרה לשנת 2027?',
    answer:
      'לפי סעיף 126 לחוק מע״מ, התקרה מתעדכנת ב-1 בינואר של כל שנה לפי עליית מדד המחירים לצרכן שפורסם עד 15 בדצמבר שלפני כן, ומעוגלת לשקל. התקרה לשנת 2027 תתפרסם לכן בתחילת ינואר 2027 בדף הסכומים של רשות המסים. נעדכן את הדף הזה כשהיא תפורסם.',
  },
  {
    id: 'exempt-dealer-faq-declaration',
    question: 'מה זו הצהרת עוסק פטור ומתי מגישים אותה?',
    answer:
      'לפי תקנה 15 לתקנות מע״מ (רישום), עוסק פטור מצהיר עד 31 בינואר בכל שנה על מחזור העסקאות שלו בשנה שחלפה. ההצהרה מוגשת באופן מקוון באתר רשות המסים, על ידי העוסק או מי שמייצג אותו, והשירות ניתן בלי עלות. ההצהרה היא גם הזדמנות לבדוק אם המחזור עדיין מתחת לתקרה.',
  },
  {
    id: 'exempt-dealer-faq-back',
    question: 'אפשר לחזור מעוסק מורשה לעוסק פטור?',
    answer:
      'כן. לפי סעיף 59 לחוק מע״מ, עוסק מורשה שהמחזור שלו ירד ונשאר שנתיים רצופות מתחת לסכום שמחייב רישום כעוסק מורשה יירשם כעוסק פטור, ביוזמת המנהל או לבקשתו. מי שבשנה הראשונה לפעילות היה עם מחזור נמוך מהתקרה יכול להירשם כעוסק פטור ביוזמת המנהל. זה לא חל על המקצועות שבתקנה 13.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function ExemptDealerThresholdPage() {
  const pace = paceTable()
  const example = computeExemptDealer(90_000, 8, null)

  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="תקרת עוסק פטור לשנת 2026 היא 122,833 ₪ מחזור בשנה, לפי רשות המסים, לעומת 120,000 ₪ ב-2024 וב-2025. הקלידו את המחזור מתחילת השנה, ותראו כמה נשאר לכם עד התקרה ובאיזה חודש תעברו אותה בקצב הנוכחי."
      chips={['122,833 ₪ מ-1.1.2026', 'תחזית חודש החצייה', 'מקצועות שחייבים במורשה']}
      tool={<ExemptDealerChecker />}
      faq={faq}
      cta={{
        text: 'עסק שגדל מעבר לתקרה צריך חשבוניות, דיווחים ומעקב הכנסות מסודר. את רוב זה אפשר להפוך לאוטומטי.',
        label: 'אוטומציה לעסקים',
        href: '/services/automation',
      }}
    >
      <h2>מה תקרת עוסק פטור 2026</h2>
      <p>
        122,833 ₪. סעיף 1 לחוק מע״מ מגדיר עוסק פטור כ״עוסק שמחזור העסקאות שלו בכל עסקיו אינו עולה על״ הסכום הזה בשנה.
        הסכום מתעדכן כל שנה לפי המדד, ולפי דף הסכומים של רשות המסים הוא חל מ-1 בינואר 2026. מחזור הוא סך כל ההכנסות לפני
        הוצאות, מכל העסקים של אותו אדם יחד.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>תקרת עוסק פטור לפי שנה</caption>
          <thead>
            <tr>
              <th scope="col">שנה</th>
              <th scope="col">תקרה שנתית</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">2024</th>
              <td>120,000 ₪</td>
            </tr>
            <tr>
              <th scope="row">2025</th>
              <td>120,000 ₪</td>
            </tr>
            <tr>
              <th scope="row">2026</th>
              <td>122,833 ₪</td>
            </tr>
            <tr>
              <th scope="row">2027</th>
              <td>יתפרסם בינואר 2027</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>איך יודעים מתי תעברו את התקרה: דוגמה</h2>
      <p>
        מעצבת גרפית עצמאית הכניסה {formatShekels(example.turnover)} מינואר עד סוף {monthName(example.month)}, ממוצע של{' '}
        {formatShekels(example.monthly)} בחודש. עד התקרה נשארו לה {formatShekels(example.remaining)}, כלומר בארבעת החודשים
        שנותרו היא יכולה להכניס בממוצע עד {formatShekels(example.allowedPerMonth ?? 0)} בחודש.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>דוגמה: מחזור מצטבר בקצב של {formatShekels(example.monthly)} בחודש</caption>
          <thead>
            <tr>
              <th scope="col">סוף חודש</th>
              <th scope="col">מחזור מצטבר</th>
              <th scope="col">מול התקרה</th>
            </tr>
          </thead>
          <tbody>
            {example.projection.map((row) => (
              <tr key={row.month}>
                <th scope="row">{monthName(row.month)}</th>
                <td>{formatShekels(row.cumulative)}</td>
                <td>{row.cumulative > THRESHOLD ? 'מעל התקרה' : 'מתחת לתקרה'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        בקצב הזה המחזור יעבור את התקרה ב{monthName(example.crossingMonth ?? 12)}. זה הזמן להתכונן למעבר לעוסק מורשה, ולא
        לגלות אותו בהצהרה השנתית.
      </p>

      <h2>קצב מקסימלי כדי להישאר עוסק פטור</h2>
      <p>
        כדי לסיים את 2026 מתחת לתקרה, הממוצע החודשי לאורך השנה צריך להיות עד {formatShekels(pace[0].average)}. כך נראה
        המחזור המצטבר המקסימלי בכל רבעון:
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>מחזור מצטבר מקסימלי בקצב אחיד, 2026</caption>
          <thead>
            <tr>
              <th scope="col">עד סוף</th>
              <th scope="col">מחזור מצטבר</th>
            </tr>
          </thead>
          <tbody>
            {pace.map((row) => (
              <tr key={row.month}>
                <th scope="row">{monthName(row.month)}</th>
                <td>{formatShekels(row.cumulative)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>מה קורה כשעוברים את התקרה</h2>
      <ul>
        <li>
          מי שהמחזור שלו עולה על התקרה כבר לא עומד בהגדרה של עוסק פטור, וצריך להירשם כעוסק מורשה: לגבות מע״מ מהלקוחות,
          להוציא חשבוניות מס ולהגיש דוחות מע״מ.
        </li>
        <li>תקנה 8 לתקנות הרישום מחייבת להודיע למנהל מע״מ בכתב תוך 15 יום על אירוע שמצריך שינוי ברישום.</li>
        <li>ממתי בדיוק חל המע״מ ועל אילו עסקאות, כדאי לברר מול משרד מע״מ או רואה חשבון לפני שמוציאים את החשבונית הבאה.</li>
        <li>
          לפי סעיף 59 לחוק, עוסק מורשה שהמחזור שלו נשאר שנתיים רצופות מתחת לתקרה יכול לחזור להיות עוסק פטור.
        </li>
      </ul>
      <p>
        את המע״מ על כל סכום אפשר לחשב ב<Link href="/tools/vat-calculator">מחשבון מע״מ</Link>, ואת המס על ההכנסה כעצמאי
        ב<Link href="/tools/self-employed-tax-calculator">מחשבון מס הכנסה לעצמאי</Link>.
      </p>

      <h2>מי לא יכול להיות עוסק פטור</h2>
      <p>
        לפי רשות המסים, אפשר לפתוח תיק עוסק פטור רק אם העסק לא נמנה על העיסוקים בתקנה 13 לתקנות מע״מ (רישום). העיסוקים
        האלה נרשמים כעוסק מורשה גם כשהמחזור נמוך:
      </p>
      <ul>
        <li>
          מקצועות חופשיים: אגרונום, אדריכל, הנדסאי, חוקר פרטי, טוען רבני, טכנאי, טכנאי שיניים, יועץ לארגון, יועץ לניהול,
          יועץ מדעי, יועץ מס, כלכלן, מהנדס, מודד, מנהל חשבונות, מתורגמן, סוכן ביטוח, עורך דין, רואה חשבון, שמאי ובעל מעבדה
          כימית או רפואית.
        </li>
        <li>רופא, כולל פסיכולוג, פיזיותרפיסט, וטרינר, רופא שיניים ומרפא שיניים.</li>
        <li>בעל בית ספר לנהיגה, ובעל בית ספר או גן ילדים שאינו מלכ״ר, לפי התנאים בתקנה.</li>
        <li>סוחר או מתווך מקרקעין, וסוחר או מתווך רכב.</li>
        <li>חברה רשומה ואגודה שיתופית.</li>
      </ul>

      <blockquote>
        מידע כללי ולא ייעוץ מס או ייעוץ משפטי. התקרה לפי רשות המסים לשנת 2026. המחשבון לא בודק עסקאות מיוחדות, כמו מכירת
        מקרקעין או ציוד, ולא קובע את מועד החיוב במע״מ. לפני מעבר לעוסק מורשה התייעצו עם רואה חשבון או משרד מע״מ.
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
        הנתונים נבדקו מול אתר רשות המסים ונוסח החוק והתקנות ב-23 באוקטובר 2026. בינואר 2027 נעדכן את התקרה לשנה החדשה.
      </p>
    </ToolLayout>
  )
}
