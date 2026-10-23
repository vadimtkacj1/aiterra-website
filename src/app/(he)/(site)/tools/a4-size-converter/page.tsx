import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import A4SizeConverter from '../../components/tools/A4SizeConverter'
import {
  DPI_PRESETS,
  PAPER_REVIEWED,
  aPapers,
  bPapers,
  formatNumber,
  findPaper,
  mmToInches,
  mmToPixels,
  orient,
  usPapers,
} from '@/lib/a4-size-converter'
import styles from './page.module.css'

const PATH = '/tools/a4-size-converter'
const TITLE = 'גודל A4 בסנטימטר ובפיקסלים'
const META_TITLE = 'גודל A4 בסנטימטר ובפיקסלים: טבלת מידות A0 עד A10'
const DESCRIPTION =
  'גודל A4 הוא 21 על 29.7 ס״מ, ו-2480 על 3508 פיקסלים ב-300 DPI. טבלת מידות נייר A0 עד A10 ו-B0 עד B10 לפי ISO 216, במילימטר ובפיקסלים.'

const MM_PER_INCH = 25.4
const comparedPaperIds = ['a3', 'a4', 'a5', 'a6']
const a4PerSheetIds = ['a0', 'a1', 'a2', 'a3', 'a4']
const printDpis = [150, 300, 600]

const a4 = findPaper('a4')
const a4Landscape = orient(a4, true)

const megapixels = (dpi: number) => (mmToPixels(a4.widthMm, dpi) * mmToPixels(a4.heightMm, dpi)) / 1_000_000

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
  {
    id: 'a4-faq-landscape',
    question: 'מה הגודל של A4 לרוחב?',
    answer:
      'דף A4 לרוחב הוא 29.7 סנטימטרים ברוחב ו-21 סנטימטרים בגובה, כלומר אותן מידות בסדר הפוך. ב-300 DPI זה 3508 על 2480 פיקסלים. במדפסות ובתוכנות עיצוב בוחרים בין לאורך ולרוחב בהגדרות הדף, ובכלי מסמנים לרוחב ורואים את המספרים מתחלפים.',
  },
  {
    id: 'a4-faq-megapixels',
    question: 'כמה מגה-פיקסלים צריך כדי להדפיס תמונה על דף A4?',
    answer:
      'לדף מלא ב-300 DPI צריך 2480 על 3508 פיקסלים, כלומר בערך 8.7 מגה-פיקסלים. ב-150 DPI מספיקים 1240 על 1754, בערך 2.2 מגה-פיקסלים, אבל ההדפסה פחות חדה. אם התמונה קטנה מזה, אפשר להדפיס אותה, אבל היא תיראה מטושטשת מקרוב. לפני שמעלים תמונה כבדה לאתר, כדאי לדחוס אותה בנפרד מהקובץ להדפסה.',
  },
  {
    id: 'a4-faq-printer-dpi',
    question: 'האם ה-DPI של המדפסת הוא אותו דבר כמו ה-DPI של התמונה?',
    answer:
      'לא בדיוק. DPI של מדפסת הוא מספר הנקודות שהיא מדפיסה בכל אינץ׳. לפי ויקיפדיה מדפסת הזרקת דיו מגיעה בדרך כלל ל-300 עד 720 DPI, ומדפסת לייזר ל-600 עד 2,400. בתמונה סופרים פיקסלים לאינץ׳, ולכן המדפסת צריכה DPI גבוה מזה של המסך כדי להגיע לאיכות דומה.',
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

      <h2>גודל A4 בסנטימטר, במילימטר ובאינצ׳ים</h2>
      <p>
        A4 הוא {cm(a4.widthMm)} על {cm(a4.heightMm)} סנטימטרים, כלומר {a4.widthMm} על {a4.heightMm} מילימטרים.
        באינצ׳ים זה {formatNumber(mmToInches(a4.widthMm), 2)} על {formatNumber(mmToInches(a4.heightMm), 2)}, כי אינץ׳
        הוא {MM_PER_INCH} מילימטרים. הטבלה משווה בין A4 לגדלים הסמוכים לו, שבהם משתמשים הכי הרבה בהדפסה משרדית.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>A3 עד A6 בסנטימטרים ובאינצ׳ים</caption>
          <thead>
            <tr>
              <th scope="col">גודל</th>
              <th scope="col">ס״מ</th>
              <th scope="col">אינצ׳ים</th>
            </tr>
          </thead>
          <tbody>
            {comparedPaperIds.map((id) => {
              const paper = findPaper(id)
              return (
                <tr key={id}>
                  <th scope="row" dir="ltr" className={styles.code}>
                    {paper.label}
                  </th>
                  <td dir="ltr" className={styles.num}>
                    {cm(paper.widthMm)} × {cm(paper.heightMm)}
                  </td>
                  <td dir="ltr" className={styles.num}>
                    {formatNumber(mmToInches(paper.widthMm), 2)} × {formatNumber(mmToInches(paper.heightMm), 2)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <h2>גודל A4 לרוחב</h2>
      <p>
        בדף לרוחב הצלע הארוכה היא הרוחב: {cm(a4Landscape.widthMm)} על {cm(a4Landscape.heightMm)} סנטימטרים, וב-300 DPI{' '}
        {mmToPixels(a4Landscape.widthMm, 300)} על {mmToPixels(a4Landscape.heightMm, 300)} פיקסלים. מצגות וטבלאות רחבות
        מודפסות בדרך כלל לרוחב. תמונות לרשתות חברתיות כמעט אף פעם לא בגודל של דף, ולכן כדאי להתחיל מגודל הפרסום ולא
        מגודל הנייר, בעזרת ה<Link href="/tools/social-image-resizer">כלי לשינוי גודל תמונה לרשתות חברתיות</Link>.
      </p>

      <h2>כמה פיקסלים צריך לתמונה על A4</h2>
      <p>
        ככל שה-DPI גבוה יותר, צריך יותר פיקסלים כדי למלא אותו דף. הטבלה מחשבת את מספר הפיקסלים ואת המגה-פיקסלים
        לדף A4 מלא בשלוש רזולוציות.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>פיקסלים ומגה-פיקסלים לדף A4 מלא</caption>
          <thead>
            <tr>
              <th scope="col">DPI</th>
              <th scope="col">פיקסלים</th>
              <th scope="col">מגה-פיקסלים</th>
            </tr>
          </thead>
          <tbody>
            {printDpis.map((dpi) => (
              <tr key={dpi}>
                <th scope="row" dir="ltr" className={styles.code}>
                  {dpi}
                </th>
                <td dir="ltr" className={styles.num}>
                  {mmToPixels(a4.widthMm, dpi)} × {mmToPixels(a4.heightMm, dpi)}
                </td>
                <td dir="ltr" className={styles.num}>
                  {formatNumber(megapixels(dpi), 1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        קובץ שנועד לפרסום באתר לא צריך להיות בגודל הזה. אחרי שהכנתם גרסה להדפסה, אפשר להקטין את הגרסה לאתר
        ב<Link href="/tools/image-compressor">כלי לדחיסת תמונות</Link>.
      </p>

      <h2>גודל A4 במסך</h2>
      <p>
        בתוכנה שמציגה דף A4 ב-96 DPI, הדף תופס {mmToPixels(a4.widthMm, 96)} על {mmToPixels(a4.heightMm, 96)} פיקסלים.
        זה הגודל שבו נוח לתכנן מסמך שיוצג על מסך, למשל קובץ PDF או דף שנפתח בדפדפן. להדפסה אותו דף צריך הרבה יותר
        פיקסלים, כמו שמראה הטבלה של מידות סדרה A בראש העמוד.
      </p>

      <h2>איך מחשבים פיקסלים לכל גודל נייר</h2>
      <p>
        הנוסחה היא מילימטרים חלקי {MM_PER_INCH}, כפול ה-DPI. עבור הרוחב של A5, שהוא {findPaper('a5').widthMm} מילימטרים,
        ב-300 DPI מקבלים {mmToPixels(findPaper('a5').widthMm, 300)} פיקסלים, ועבור הגובה {findPaper('a5').heightMm}{' '}
        מילימטרים מקבלים {mmToPixels(findPaper('a5').heightMm, 300)}. המספר מעוגל למספר שלם, ולכן שתי תוכנות יכולות
        להבדיל בפיקסל אחד.
      </p>

      <h2>כמה דפי A4 יוצאים מגודל גדול יותר</h2>
      <p>
        כל מספר בסדרה A הוא חצי מהגודל שלפניו, ולכן מ-A3 יוצאים שני דפי A4. כך אפשר לדעת כמה דפים יש בכרזה או בתוכנית
        בניין לפי הגודל שלה.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>כמה דפי A4 מכיל כל גודל</caption>
          <thead>
            <tr>
              <th scope="col">גודל</th>
              <th scope="col">ס״מ</th>
              <th scope="col">דפי A4</th>
            </tr>
          </thead>
          <tbody>
            {a4PerSheetIds.map((id, index) => {
              const paper = findPaper(id)
              return (
                <tr key={id}>
                  <th scope="row" dir="ltr" className={styles.code}>
                    {paper.label}
                  </th>
                  <td dir="ltr" className={styles.num}>
                    {cm(paper.widthMm)} × {cm(paper.heightMm)}
                  </td>
                  <td dir="ltr" className={styles.num}>
                    {2 ** (a4PerSheetIds.length - 1 - index)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p>
        כשמדפיסים על A4 דף עם קוד QR שמוביל לאתר, יוצרים את הקוד
        ב<Link href="/tools/qr-code-generator">כלי ליצירת קוד QR</Link>.
      </p>

      <h2>עד איזה גודל אפשר להדפיס תמונה שיש לכם</h2>
      <p>
        אפשר גם לחשב הפוך: מהפיקסלים של התמונה לגודל ההדפסה. תמונה של 1920 על 1080 פיקסלים מודפסת ב-300 DPI בגודל
        של {formatNumber((1920 / 300) * 2.54, 1)} על {formatNumber((1080 / 300) * 2.54, 1)} סנטימטרים, ובפחות מזה אין
        לה תחליף. ב-150 DPI היא מגיעה ל-{formatNumber((1920 / 150) * 2.54, 1)} על {formatNumber((1080 / 150) * 2.54, 1)}{' '}
        סנטימטרים, שזה פחות מגובה דף A4 לרוחב, והחדות נמוכה יותר. אם צריך דף מלא, חפשו תמונה גדולה יותר.
      </p>

      <h2>הגדלה והקטנה בין גדלי A</h2>
      <p>
        היחס בין צלע ארוכה לקצרה בסדרה A הוא שורש 2, בערך 1.414, ולכן מעבר לגודל הבא מכפיל או מחצה את השטח. הגדלה
        מ-A4 ל-A3 בצילום היא בערך 141 אחוז, והקטנה מ-A3 ל-A4 היא בערך 71 אחוז. במעבר כזה התוכן נכנס בדיוק לדף, בלי
        שוליים מיותרים.
      </p>

      <h2>A4 מול Letter בפועל</h2>
      <p>
        US Letter הוא {cm(usPapers[0].widthMm)} על {cm(usPapers[0].heightMm)} סנטימטרים. הוא רחב מ-A4 ב-
        {formatNumber(usPapers[0].widthMm - a4.widthMm, 1)} מילימטרים וקצר ממנו ב-
        {formatNumber(a4.heightMm - usPapers[0].heightMm, 1)} מילימטרים. מסמך שעוצב בגודל אחד ומודפס על השני נחתך או
        מצטמצם, ולכן בהגדרות ההדפסה כדאי לבחור בהתאמה לגודל הדף.
      </p>

      <h2>מקורות</h2>
      <ul className={styles.sources}>
        <li>
          <a href="https://en.wikipedia.org/wiki/ISO_216" rel="noopener" target="_blank" lang="en" dir="ltr">
            Wikipedia: ISO 216 (A and B series dimensions, US Letter)
          </a>
        </li>
        <li>
          <a href="https://en.wikipedia.org/wiki/Dots_per_inch" rel="noopener" target="_blank" lang="en" dir="ltr">
            Wikipedia: Dots per inch (printer resolutions)
          </a>
        </li>
      </ul>
      <p className={styles.reviewed}>
        המידות נבדקו מול המקור ב-<time dateTime={PAPER_REVIEWED}>23.10.2026</time>. מספר הפיקסלים מחושב על ידינו
        מהמידות במילימטרים. מ-ISO 216 לקוחים גם היחס שורש 2 וחצי השטח בין גדלים סמוכים, ומעמוד ה-DPI טווחי הרזולוציה של מדפסות.
      </p>
    </ToolLayout>
  )
}
