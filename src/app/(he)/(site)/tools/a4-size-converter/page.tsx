import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import A4SizeConverter from '../../components/tools/A4SizeConverter'
import {
  DPI_PRESETS,
  PAPER_REVIEWED,
  aPapers,
  bPapers,
  formatNumber,
  mmToPixels,
  usPapers,
} from '@/lib/a4-size-converter'
import styles from './page.module.css'

const PATH = '/tools/a4-size-converter'
const TITLE = 'גודל A4 בסנטימטר ובפיקסלים'
const META_TITLE = 'גודל A4 בסנטימטר ובפיקסלים: טבלת מידות A0 עד A10'
const DESCRIPTION =
  'גודל A4 הוא 21 על 29.7 ס״מ, ו-2480 על 3508 פיקסלים ב-300 DPI. טבלת מידות נייר A0 עד A10 ו-B0 עד B10 לפי ISO 216, במילימטר ובפיקסלים.'

const faq: ToolFaqEntry[] = [
  {
    id: 'a4-faq-size',
    question: 'מה הגודל של A4 בסנטימטרים?',
    answer:
      'דף A4 הוא 21 על 29.7 סנטימטרים, כלומר 210 על 297 מילימטרים. בכתיבה בדף לאורך הרוחב הוא 21 והגובה 29.7. בדף לרוחב המספרים מתחלפים. זה הגודל הרגיל של נייר למדפסת ושל מסמכים בישראל ובשאר העולם מחוץ לצפון אמריקה. התוצאה בכלי נתונה גם באינצ׳ים, 8.27 על 11.69.',
  },
  {
    id: 'a4-faq-pixels',
    question: 'כמה פיקסלים יש ב-A4?',
    answer:
      'זה תלוי ברזולוציה. ב-72 DPI דף A4 הוא 595 על 842 פיקסלים, ב-96 DPI הוא 794 על 1123, ב-150 DPI הוא 1240 על 1754, וב-300 DPI, הרזולוציה הרגילה להדפסה, הוא 2480 על 3508. החישוב הוא מילימטרים חלקי 25.4 כפול ה-DPI. בכלי אפשר להקליד גם ערך DPI אחר.',
  },
  {
    id: 'a4-faq-print-dpi',
    question: 'באיזה DPI לשמור קובץ להדפסה על A4?',
    answer:
      'להדפסה רגילה נהוג להשתמש ב-300 DPI, כלומר תמונה של 2480 על 3508 פיקסלים לדף מלא. אם התמונה קטנה יותר, ההדפסה תהיה פחות חדה. למסך אין משמעות ל-DPI, וחשוב רק מספר הפיקסלים. לכן עיצוב לפוסטר גדול ולדף A4 צריך לצאת מגודל פיקסלים שמתאים לגודל ההדפסה.',
  },
  {
    id: 'a4-faq-ratio',
    question: 'למה כל המידות בסדרה A באותו יחס?',
    answer:
      'בסדרת A אורך הצלע הארוכה חלקי הקצרה הוא שורש 2, בערך 1.414. לכן קיפול דף לשניים לאורך הצלע הארוכה נותן דף קטן בדיוק באותו יחס: קיפול של A4 נותן A5, קיפול של A3 נותן A4. שטח A0 הוא מטר רבוע אחד, וכל מספר גדול יותר הוא חצי מהשטח של הקודם. זה מאפשר הגדלה והקטנה בצילום בלי לחתוך שוליים.',
  },
  {
    id: 'a4-faq-letter',
    question: 'מה ההבדל בין A4 ל-Letter האמריקאי?',
    answer:
      'Letter הוא 8.5 על 11 אינצ׳ים, כלומר בערך 21.6 על 27.9 סנטימטרים. הוא רחב ב-6 מילימטרים בערך מ-A4 וקצר ב-18 מילימטרים. משתמשים בו בעיקר בארצות הברית ובקנדה. כשמדפיסים מסמך שנוצר לפי Letter על A4, או להפך, הדפסה עם התאמה לדף חוסכת חיתוך שוליים.',
  },
  {
    id: 'a4-faq-b-series',
    question: 'מה זה סדרת B ובמה משתמשים בה?',
    answer:
      'סדרת B מוגדרת לפי ISO 216 כגדלים שביניהם בגודל: B4 הוא 250 על 353 מילימטרים, בין A4 ל-A3. שטח B0 הוא בערך 1.41 מטר רבוע. אם אתם לא בטוחים איזה גודל להזמין או להדפיס, בדקו את המידות במילימטרים בטבלה ובחרו לפיהן. הכלי מציג גם את B0 עד B10 ואת מספר הפיקסלים של כל אחד.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

const cm = (mm: number) => formatNumber(mm / 10, 2)

export default function A4SizeConverterPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="דף A4 הוא 21 על 29.7 סנטימטרים, ובפיקסלים 2480 על 3508 ב-300 DPI, הרזולוציה הרגילה להדפסה. בוחרים כאן גודל נייר ורזולוציה ומקבלים את המידות בסנטימטרים, במילימטרים, באינצ׳ים ובפיקסלים."
      chips={['A0 עד A10', 'סדרה B ו-Letter', 'פיקסלים לפי DPI', 'לאורך ולרוחב']}
      tool={<A4SizeConverter />}
      faq={faq}
      cta={{
        text: 'צריכים כלי חישוב או המרה מותאם לעסק שלכם? אנחנו מפתחים כלים כאלה.',
        label: 'לפיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>גודל נייר A4 ושאר מידות A</h2>
      <p>
        תקן ISO 216 מגדיר את סדרת A: A0 הוא נייר ששטחו מטר רבוע אחד, וכל מספר גדול יותר מתקבל מחציית הנייר. המידות
        בטבלה במילימטרים, ובעמודות הימניות הן במספר הפיקסלים בכל רזולוציה.
      </p>
      <div className={styles.tableWrap}>
        <div className={styles.scroll} tabIndex={0} role="region" aria-label="טבלת מידות סדרה A בפיקסלים">
          <table className={styles.table}>
            <caption>מידות סדרה A במילימטרים ובפיקסלים לפי DPI</caption>
            <thead>
              <tr>
                <th scope="col">גודל</th>
                <th scope="col">מ״מ</th>
                {DPI_PRESETS.map((dpi) => (
                  <th key={dpi} scope="col">
                    {dpi} DPI
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {aPapers.map((paper) => (
                <tr key={paper.id}>
                  <th scope="row" dir="ltr" className={styles.code}>
                    {paper.label}
                  </th>
                  <td dir="ltr" className={styles.num}>
                    {paper.widthMm} × {paper.heightMm}
                  </td>
                  {DPI_PRESETS.map((dpi) => (
                    <td key={dpi} dir="ltr" className={styles.num}>
                      {mmToPixels(paper.widthMm, dpi)} × {mmToPixels(paper.heightMm, dpi)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h2>איך לבחור DPI</h2>
      <p>
        DPI הוא מספר הנקודות לאינץ׳ בהדפסה. מסמך שמיועד למסך אינו תלוי בו, ושם קובע רק מספר הפיקסלים. להדפסה על A4
        מכוונים בדרך כלל ל-300 DPI, כלומר 2480 על 3508 פיקסלים. 72 ו-96 נפוצים בתוכנות ובמסכים, ו-150 מתאים לטיוטה.
      </p>

      <h2>סדרת B ו-Letter האמריקאי</h2>
      <p>
        סדרת B היא סדרת הגדלים שבין גדלי A, למשל B4 בין A4 ל-A3. Letter הוא הגודל הרגיל בצפון אמריקה, 8.5 על 11
        אינצ׳ים.
      </p>
      <div className={styles.tableWrap}>
        <div className={styles.scroll} tabIndex={0} role="region" aria-label="טבלת מידות סדרה B ו-Letter">
          <table className={styles.table}>
            <caption>מידות סדרה B ו-US Letter בסנטימטרים ובפיקסלים ב-300 DPI</caption>
            <thead>
              <tr>
                <th scope="col">גודל</th>
                <th scope="col">ס״מ</th>
                <th scope="col">300 DPI</th>
              </tr>
            </thead>
            <tbody>
              {[...bPapers, ...usPapers].map((paper) => (
                <tr key={paper.id}>
                  <th scope="row" dir="ltr" className={styles.code}>
                    {paper.label}
                  </th>
                  <td dir="ltr" className={styles.num}>
                    {cm(paper.widthMm)} × {cm(paper.heightMm)}
                  </td>
                  <td dir="ltr" className={styles.num}>
                    {mmToPixels(paper.widthMm, 300)} × {mmToPixels(paper.heightMm, 300)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h2>מקורות</h2>
      <ul className={styles.sources}>
        <li>
          <a href="https://en.wikipedia.org/wiki/ISO_216" rel="noopener" target="_blank" lang="en" dir="ltr">
            Wikipedia: ISO 216 (A and B series dimensions, US Letter)
          </a>
        </li>
      </ul>
      <p className={styles.reviewed}>
        המידות נבדקו מול המקור ב-<time dateTime={PAPER_REVIEWED}>23.10.2026</time>. מספר הפיקסלים מחושב על ידינו
        מהמידות במילימטרים.
      </p>
    </ToolLayout>
  )
}
