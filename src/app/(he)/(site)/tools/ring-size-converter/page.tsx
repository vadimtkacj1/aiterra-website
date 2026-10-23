import type { ReactNode } from 'react'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import RingSizeConverter from '../../components/tools/RingSizeConverter'
import {
  RING_CHECKED,
  RING_CHECKED_LABEL,
  TABLE_FROM,
  TABLE_TO,
  formatUs,
  ringSources,
  tableRows,
} from '@/lib/ring-size-converter'
import styles from './page.module.css'

const PATH = '/tools/ring-size-converter'
const TITLE = 'מידת טבעת: טבלת המרה'
const META_TITLE = 'מידת טבעת: טבלת המרה לפי היקף וקוטר, ISO, ארה״ב ובריטניה'
const DESCRIPTION =
  'מידת טבעת: מזינים היקף אצבע או קוטר טבעת במ״מ ומקבלים את המידה לפי תקן ISO, ארה״ב, בריטניה ואיטליה, עם טבלת המרה והסבר איך למדוד.'

const Num = ({ children }: { children: ReactNode }) => (
  <span dir="ltr" className={styles.ltr}>
    {children}
  </span>
)

const External = ({ id, children }: { id: keyof typeof ringSources; children: ReactNode }) => (
  <a href={ringSources[id].href} rel="noopener" target="_blank">
    {children}
  </a>
)

const faq: ToolFaqEntry[] = [
  {
    id: 'ring-faq-measure',
    question: 'איך מודדים מידת טבעת בבית?',
    answer:
      'עוטפים את הבסיס של האצבע בחוט או ברצועת נייר צרה, מסמנים את המקום שבו הקצוות נפגשים, ומודדים בסרגל את האורך במילימטרים. זה היקף האצבע, והוא בעצם המידה לפי תקן ISO. אפשר למדוד גם טבעת שמתאימה לכם מבפנים בקוטר במילימטרים. מודדים כמה פעמים וממוצעים, כי המדידה משתנה מעט.',
  },
  {
    id: 'ring-faq-iso',
    question: 'מה זה תקן ISO 8653?',
    answer:
      'ISO 8653:2016 הוא תקן בינלאומי שמגדיר מידות טבעות לפי ההיקף הפנימי במילימטרים. לפי ויקיפדיה, שיטה זו נהוגה באוסטריה, צרפת, בלגיה, במדינות הנורדיות ובמדינות נוספות באירופה היבשתית. לכן מידה 54 במערכת זו פירושה היקף פנימי של 54 מ״מ. לא בדקנו אם שיטה אחת נהוגה בכל החנויות בישראל.',
  },
  {
    id: 'ring-faq-us',
    question: 'איך ממירים מידת טבעת אמריקאית למידה אירופית?',
    answer:
      'לפי הנוסחה בוויקיפדיה, ההיקף הפנימי הוא 2.55 כפול המידה האמריקאית ועוד 36.5 מילימטרים. למשל מידה 7 אמריקאית היא בערך 54.4 מילימטרים, כלומר מידה 54 לפי ISO. המחשבון מבצע את החישוב ההפוך ומעגל לרבעי מידה, כמו הסולם האמריקאי. יצרנים שונים מפרסמים טבלאות מעט שונות, ולכן ההמרה היא קירוב.',
  },
  {
    id: 'ring-faq-uk',
    question: 'איך נקבעת מידת טבעת בריטית?',
    answer:
      'בבריטניה, באירלנד ובאוסטרליה המידות הן אותיות, עם חצאי מידות. לפי ויקיפדיה, התקן הבריטי מ-1987 קובע שצעד של אות אחת הוא 1.25 מילימטר של היקף, ושמידה C היא היקף של 40 מילימטרים. מכאן אפשר להמיר כל היקף לאות. המחשבון מציג את התוצאה עם חצי מידה כשצריך.',
  },
  {
    id: 'ring-faq-between',
    question: 'מה עושים כשהמידה נופלת בין שתי מידות?',
    answer:
      'לרוב בוחרים במידה הגדולה יותר, במיוחד בטבעת רחבה שיושבת הדוק יותר על האצבע. האצבע גם משתנה בין שעות היום ובין מזג אוויר חם לקר, ולכן עדיף למדוד בשעות שונות. בטבעות מיוחדות כדאי להיעזר בצורף, שיכול למדוד אצבע בטבעות מדידה. אם הטבעת מתנה, שאלו על אפשרות להגדלה או הקטנה.',
  },
  {
    id: 'ring-faq-shop',
    question: 'האם הטבלה מתאימה לכל חנות?',
    answer:
      'לא תמיד. הטבלה כאן מחושבת לפי נוסחאות ותקנים, אבל חנויות ויצרנים מפרסמים טבלאות משלהם, שיכולות לסטות מעט. לא בדקנו איזו שיטה נהוגה בישראל, ויש חנויות שמשתמשות בשיטה אירופית ואחרות באמריקאית. לכן לפני קנייה אונליין בדקו מול הטבלה של החנות, ובקשו מידה במילימטרים אם אפשר.',
  },
]

const rows = tableRows(TABLE_FROM, TABLE_TO)

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function RingSizeConverterPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="מידת טבעת לפי תקן ISO 8653 היא ההיקף הפנימי של הטבעת במילימטרים, ולכן מי שמדד היקף אצבע של 54 מ״מ צריך מידה 54, שהיא בערך 6¾ בארה״ב ואות N בבריטניה. כאן מזינים היקף או קוטר ומקבלים את המידה בכל השיטות, עם טבלה מלאה והסבר איך למדוד."
      chips={['היקף וקוטר במ״מ', 'ISO, ארה״ב, בריטניה ואיטליה', 'טבלת המרה מלאה', 'בלי הרשמה']}
      tool={<RingSizeConverter />}
      faq={faq}
      cta={{
        text: 'מוכרים תכשיטים אונליין? אנחנו בונים חנויות עם בחירת מידה שמצמצמת החזרות.',
        label: 'לפיתוח אתרים ומערכות',
        href: '/services/development',
      }}
    >
      <h2>איך עובדת המרת מידות טבעת</h2>
      <p>
        <External id="iso">תקן ISO 8653</External> מגדיר מידת טבעת כהיקף הפנימי במילימטרים, והשיטה האמריקאית והבריטית
        הן סולמות אחרים לאותה מידה. לפי <External id="wikipedia">ויקיפדיה</External>, בארה״ב ההיקף הוא 2.55 כפול
        המידה ועוד 36.5 מ״מ. בבריטניה מידה C היא 40 מ״מ וכל אות מוסיפה 1.25 מ״מ, ובאיטליה, בספרד ובשווייץ המידה
        היא ההיקף פחות 40.
      </p>

      <h2>איך מודדים את האצבע</h2>
      <ol>
        <li>גזרו רצועת נייר צרה או קחו חוט דק.</li>
        <li>עטפו אותה סביב בסיס האצבע שהטבעת תהיה עליה, ללא מתיחה.</li>
        <li>סמנו בעט את הנקודה שבה הקצוות נפגשים.</li>
        <li>פרשו את הרצועה על סרגל ומדדו את האורך במילימטרים.</li>
        <li>חזרו על המדידה בשעות שונות ובחרו בערך שחוזר, כי האצבע משתנה במהלך היום.</li>
      </ol>
      <p>אפשר גם למדוד בתוך טבעת שמתאימה לכם: קוטר פנימי כפול π הוא ההיקף.</p>

      <h2>טבלת המרה: היקף, קוטר וכל השיטות</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>
            מחושב לפי נוסחאות מ-<a href={ringSources.wikipedia.href} rel="noopener" target="_blank" lang="en" dir="ltr">Wikipedia: Ring size</a>. נבדק
            לאחרונה: <time dateTime={RING_CHECKED}>{RING_CHECKED_LABEL}</time>
          </caption>
          <thead>
            <tr>
              <th scope="col">ISO והיקף (מ״מ)</th>
              <th scope="col">קוטר (מ״מ)</th>
              <th scope="col">ארה״ב</th>
              <th scope="col">בריטניה</th>
              <th scope="col">איטליה, ספרד, שווייץ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.iso}>
                <th scope="row">
                  <Num>{row.iso}</Num>
                </th>
                <td>
                  <Num>{row.diameter.toFixed(1)}</Num>
                </td>
                <td>
                  <Num>{formatUs(row.us)}</Num>
                </td>
                <td>
                  <Num>{row.uk ?? '-'}</Num>
                </td>
                <td>
                  <Num>{row.continental}</Num>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>לפני שקונים טבעת</h2>
      <p>
        טבעת רחבה יושבת הדוק יותר מטבעת צרה באותה מידה, ולכן כדאי לשקול מידה גדולה יותר. אם הטבעת מתנה, ודאו מראש
        אם אפשר להחליף או לשנות מידה. אבני חן ועיצובים מסוימים מגבילים את האפשרות לשנות את המידה אחר כך.
      </p>

      <h2>מקורות</h2>
      <ul className={styles.sources}>
        {(Object.keys(ringSources) as (keyof typeof ringSources)[]).map((id) => (
          <li key={id}>
            <a href={ringSources[id].href} rel="noopener" target="_blank" lang="en" dir="ltr">
              {ringSources[id].label}
            </a>
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        הנוסחאות נבדקו מול ויקיפדיה ב-<time dateTime={RING_CHECKED}>{RING_CHECKED_LABEL}</time>. את התקן עצמו (ISO)
        לא פתחנו, ולכן ההגדרה נלקחה מהתיאור שלו בוויקיפדיה ובאתר ISO.
      </p>
    </ToolLayout>
  )
}
