import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import ColorConverter from '../../components/tools/ColorConverter'
import {
  BLACK,
  WHITE,
  contrastRatio,
  formatRatio,
  hslToRgb,
  parseHex,
  toHex,
  type Rgb,
} from '@/lib/color-convert'
import styles from './page.module.css'

const PATH = '/tools/color-code-converter'
const TITLE = 'ממיר קודי צבע HEX, RGB, HSL'
const META_TITLE = 'ממיר קודי צבע HEX, RGB, HSL עם בדיקת ניגודיות'
const DESCRIPTION =
  'ממיר קודי צבע בין HEX, RGB ו-HSL עם בוחר צבעים, בדיקת ניגודיות מול לבן ושחור לפי WCAG והעתקת קוד CSS בלחיצה. הכול בדפדפן, בלי הרשמה.'
const CHECKED = '2026-10-23'

const samples = [
  { name: 'אדום', hex: '#FF0000', rgb: 'rgb(255, 0, 0)', hsl: 'hsl(0, 100%, 50%)' },
  { name: 'ירוק', hex: '#00FF00', rgb: 'rgb(0, 255, 0)', hsl: 'hsl(120, 100%, 50%)' },
  { name: 'כחול', hex: '#0000FF', rgb: 'rgb(0, 0, 255)', hsl: 'hsl(240, 100%, 50%)' },
  { name: 'אפור בינוני', hex: '#808080', rgb: 'rgb(128, 128, 128)', hsl: 'hsl(0, 0%, 50%)' },
]

const ratioOf = (hex: string, background: Rgb) => formatRatio(contrastRatio(parseHex(hex) as Rgb, background))

const alphaRows = [100, 75, 50, 25, 0].map((percent) => {
  const decimal = Math.round((percent / 100) * 255)
  return { percent, decimal, hex: decimal.toString(16).toUpperCase().padStart(2, '0') }
})

const lightnessRows = [20, 35, 50, 65, 80].map((lightness) => {
  const rgb = hslToRgb({ h: 220, s: 70, l: lightness })
  return {
    lightness,
    hex: toHex(rgb),
    onWhite: formatRatio(contrastRatio(rgb, WHITE)),
    onBlack: formatRatio(contrastRatio(rgb, BLACK)),
  }
})

const nearEdge = { pass: ratioOf('#767676', WHITE), fail: ratioOf('#777777', WHITE) }
const orange = { onWhite: ratioOf('#FF8800', WHITE), onBlack: ratioOf('#FF8800', BLACK) }
const yellow = ratioOf('#FFFF00', WHITE)
const brandBlue = { onWhite: ratioOf('#2447D6', WHITE) }
const lightBlue = { onWhite: ratioOf('#3E96F9', WHITE) }

const faq: ToolFaqEntry[] = [
  {
    id: 'color-faq-hex',
    question: 'איך ממירים קוד צבע HEX ל-RGB?',
    answer:
      'קוד HEX הוא שלושה זוגות של ספרות הקסדצימליות אחרי סולמית: הזוג הראשון הוא אדום, השני ירוק והשלישי כחול. ממירים כל זוג למספר בין 0 ל-255. למשל #2447D6 הוא 24 שווה 36, 47 שווה 71 ו-D6 שווה 214, כלומר rgb(36, 71, 214). בכלי מקלידים את ה-HEX וה-RGB מתעדכן מיד.',
  },
  {
    id: 'color-faq-short',
    question: 'מה זה קוד צבע של שלוש ספרות, כמו #FFF?',
    answer:
      'זה קיצור של קוד בן שש ספרות, שבו כל ספרה מוכפלת: #FFF הוא #FFFFFF, כלומר לבן, ו-#F80 הוא #FF8800. הקיצור עובד רק כשבכל זוג שתי הספרות זהות. הכלי מקבל גם קוד קצר וגם קוד ארוך, עם סולמית או בלעדיה, ומציג את הקוד המלא באותיות גדולות.',
  },
  {
    id: 'color-faq-hsl',
    question: 'מתי כדאי להשתמש ב-HSL במקום ב-HEX?',
    answer:
      'כשרוצים לשנות צבע בצורה צפויה. ב-HSL הגוון נמדד במעלות מ-0 עד 359, והרוויה והבהירות באחוזים. כדי ליצור גרסה בהירה או כהה של אותו צבע, משנים רק את הבהירות ומשאירים את הגוון. ב-HEX אין דרך לראות מהקוד כמה הצבע בהיר. לכן פלטות צבעים למערכות עיצוב נבנות הרבה פעמים ב-HSL.',
  },
  {
    id: 'color-faq-contrast',
    question: 'איזה יחס ניגודיות נדרש לטקסט באתר?',
    answer:
      'לפי תקן WCAG ברמה AA נדרש יחס של 4.5 ל-1 לפחות לטקסט רגיל, ו-3 ל-1 לטקסט גדול, שהוא 18 נקודות ומעלה או 14 נקודות מודגש. ברמה AAA נדרש 7 ל-1 לטקסט רגיל ו-4.5 ל-1 לטקסט גדול. הכלי מראה את היחס של הצבע מול לבן ומול שחור ואם הוא עובר כל רמה.',
  },
  {
    id: 'color-faq-calc',
    question: 'איך מחשבים את יחס הניגודיות בין שני צבעים?',
    answer:
      'מחשבים לכל צבע בהירות יחסית מערכי האדום, הירוק והכחול, ואז מחלקים: הבהירות הגבוהה ועוד 0.05, חלקי הבהירות הנמוכה ועוד 0.05. התוצאה נעה מ-1 ל-1, כששני הצבעים זהים, ועד 21 ל-1, שחור על לבן. הכלי מקצץ את התוצאה כלפי מטה בשתי ספרות, כדי לא להציג עמידה בתקן שלא קיימת.',
  },
  {
    id: 'color-faq-alpha',
    question: 'איך כותבים קוד צבע עם שקיפות?',
    answer:
      'ב-CSS אפשר להוסיף לקוד HEX שתי ספרות בסוף, כך ש-#FF880080 הוא כתום בשקיפות של כחצי. 00 הוא שקוף לגמרי ו-FF אטום לגמרי. הכלי כאן מקבל רק קוד בן שלוש או שש ספרות, ולכן מקלידים בו את הצבע בלי השקיפות.',
  },
  {
    id: 'color-faq-cmyk',
    question: 'אפשר להמיר קוד צבע HEX ל-CMYK?',
    answer:
      'הכלי לא עושה זאת. CMYK הוא מודל של הדפסה, והתוצאה תלויה בפרופיל הצבע של הנייר והמדפסת, ולכן אין המרה אחת נכונה. אם מדפיסים לוגו או חומר שיווקי, מבקשים מבית הדפוס את ערכי ה-CMYK המתאימים לצבע המותג, ושומרים אותם יחד עם קודי ה-HEX של האתר.',
  },
  {
    id: 'color-faq-rounding',
    question: 'למה המרה מ-HSL ל-RGB לפעמים נותנת צבע קצת שונה?',
    answer:
      'כי HSL בכלי מוצג במספרים שלמים, ולכן לא כל צבע RGB אפשר לכתוב בו במדויק. כשממירים צבע ל-HSL וחוזרים, יכול להיות הפרש קטן של כמה יחידות בערוץ אחד. אם צריך דיוק מלא, עבדו עם HEX או RGB, והשתמשו ב-HSL רק כדי להבין את הגוון, הרוויה והבהירות.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function ColorConverterPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="קוד HEX הוא שלושה זוגות ספרות של אדום, ירוק וכחול, ואותו צבע נכתב גם כ-RGB וגם כ-HSL. בוחרים צבע או מקלידים קוד אחד, ורואים את שלושת הקודים, את הניגודיות מול לבן ושחור לפי WCAG וכפתור שמעתיק את ה-CSS."
      chips={['HEX, RGB ו-HSL מסונכרנים', 'בוחר צבעים', 'ניגודיות לפי WCAG', 'העתקת CSS']}
      tool={<ColorConverter />}
      faq={faq}
      cta={{
        text: 'צריכים אתר שהצבעים והנגישות בו נבנו נכון מההתחלה? זה חלק מפיתוח האתרים שלנו.',
        label: 'לפיתוח אתרים ותוכנה',
        href: '/services/development',
      }}
    >
      <h2>איך קודי הצבע עובדים</h2>
      <p>
        כל צבע על המסך הוא שילוב של שלושה ערוצי אור: אדום, ירוק וכחול, כל אחד בעוצמה בין 0 ל-255. שלושת הקודים
        מתארים את אותו צבע בדרכים שונות:
      </p>
      <ul>
        <li>
          <strong>HEX:</strong> סולמית ושישה תווים, בבסיס 16. כל ערוץ הוא זוג תווים בין 00 ל-FF.
        </li>
        <li>
          <strong>RGB:</strong> שלושה מספרים עשרוניים בין 0 ל-255, בתוך <span dir="ltr">rgb(...)</span>.
        </li>
        <li>
          <strong>HSL:</strong> גוון במעלות על גלגל הצבעים, רוויה ובהירות באחוזים. נוח כשרוצים לבנות גוונים
          של אותו צבע.
        </li>
      </ul>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>אותו צבע בשלוש כתיבות</caption>
          <thead>
            <tr>
              <th scope="col">צבע</th>
              <th scope="col">HEX</th>
              <th scope="col">RGB</th>
              <th scope="col">HSL</th>
            </tr>
          </thead>
          <tbody>
            {samples.map((row) => (
              <tr key={row.hex}>
                <th scope="row">{row.name}</th>
                <td dir="ltr" className={styles.code}>
                  {row.hex}
                </td>
                <td dir="ltr" className={styles.code}>
                  {row.rgb}
                </td>
                <td dir="ltr" className={styles.code}>
                  {row.hsl}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>בדיקת ניגודיות צבעים לפי WCAG</h2>
      <p>
        תקן הנגישות WCAG קובע יחס ניגודיות מינימלי בין צבע הטקסט לצבע הרקע. היחס מחושב מהבהירות היחסית של שני
        הצבעים: הבהירה בתוספת 0.05 חלקי הכהה בתוספת 0.05. בטבלה שבכלי מופיעה הבדיקה של הצבע שבחרתם כרקע, עם
        טקסט לבן ועם טקסט שחור.
      </p>
      <ul>
        <li>
          <strong>AA, טקסט רגיל:</strong> 4.5 ל-1 לפחות.
        </li>
        <li>
          <strong>AA, טקסט גדול:</strong> 3 ל-1 לפחות. טקסט גדול הוא 18 נקודות ומעלה או 14 נקודות מודגש.
        </li>
        <li>
          <strong>AAA:</strong> 7 ל-1 לטקסט רגיל, ו-4.5 ל-1 לטקסט גדול.
        </li>
      </ul>
      <p>
        אם הצבע לא עובר עם לבן ולא עם שחור, אפשר להכהות או להבהיר אותו: ב-HSL משנים את הבהירות ובודקים שוב.
        הכלי בודק צבע מול לבן ושחור בלבד, ולא שני צבעים כלליים.
      </p>

      <h2>קוד צבע HEX עם שקיפות: ארבע, שש ושמונה ספרות</h2>
      <p>
        לפי MDN, ב-CSS קוד HEX יכול להיכתב בשלוש, ארבע, שש או שמונה ספרות. שתי הספרות האחרונות בקוד הארוך, או הספרה
        האחרונה בקוד בן ארבע ספרות, קובעות שקיפות: 00 הוא שקוף לגמרי ו-FF אטום לגמרי. הכלי עצמו מקבל קוד בן שלוש או
        שש ספרות בלבד, ולכן קוד בן שמונה ספרות, כמו #FF880080, ייפסל. כדי לבדוק צבע עם שקיפות, המירו קודם את הצבע
        עצמו, ואת השקיפות הוסיפו אחר כך ידנית.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>שקיפות באחוזים וערך HEX משוער</caption>
          <thead>
            <tr>
              <th scope="col">אטימות</th>
              <th scope="col">ערך HEX</th>
              <th scope="col">ערך עשרוני</th>
            </tr>
          </thead>
          <tbody>
            {alphaRows.map((row) => (
              <tr key={row.percent}>
                <th scope="row">{row.percent}%</th>
                <td dir="ltr" className={styles.code}>
                  {row.hex}
                </td>
                <td dir="ltr" className={styles.code}>
                  {row.decimal}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>הערכים מעוגלים למספר השלם הקרוב, כי ערוץ HEX הוא מספר שלם בין 0 ל-255.</p>

      <h2>איך כמה גוונים של אותו צבע נבדקים בניגודיות</h2>
      <p>
        כדי לראות איך הבהירות משפיעה על הקריאות, הנה חמש בהירויות של אותו גוון (220 מעלות) באותה רוויה (70 אחוז),
        עם הניגודיות של כל אחת מול לבן ומול שחור, כפי שהכלי מחשב אותה. ככל שהצבע בהיר יותר, הוא מתאים לטקסט כהה, וככל
        שהוא כהה יותר, לטקסט לבן.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>גוון 220, רוויה 70%, חמש בהירויות</caption>
          <thead>
            <tr>
              <th scope="col">בהירות</th>
              <th scope="col">HEX</th>
              <th scope="col">מול לבן</th>
              <th scope="col">מול שחור</th>
            </tr>
          </thead>
          <tbody>
            {lightnessRows.map((row) => (
              <tr key={row.lightness}>
                <th scope="row">{row.lightness}%</th>
                <td dir="ltr" className={styles.code}>
                  {row.hex}
                </td>
                <td dir="ltr" className={styles.code}>
                  {row.onWhite}
                </td>
                <td dir="ltr" className={styles.code}>
                  {row.onBlack}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        שימו לב שצבע בבהירות 50 אחוז, שנראה ברור וחזק, עובר עם טקסט לבן ברמת AA לטקסט רגיל, אבל לא ברמת AAA. צבע
        בבהירות 65 אחוז עובר רק לטקסט גדול. מי שבוחר פלטה לאתר יכול להחליט לפי זה מראש איזה גוון משמש כרקע ואיזה לטקסט, ובחירת
        הצבעים משלימה את הבחירה ב<Link href="/tools/hebrew-fonts">פונטים בעברית</Link>.
      </p>

      <h2>דוגמאות לצבעים שקרובים לגבול הניגודיות</h2>
      <p>
        ההפרש בין עובר לנכשל יכול להיות קטן מאוד. אפור #767676 מול לבן מקבל {nearEdge.pass}, ואפור #777777, שנראה זהה
        לעין, מקבל {nearEdge.fail} ונכשל ברמת AA לטקסט רגיל. כתום #FF8800 מקבל מול לבן {orange.onWhite}, ולכן
        הטקסט עליו צריך להיות שחור, שמקבל {orange.onBlack}. צהוב #FFFF00 מול לבן מקבל רק {yellow}.
      </p>
      <p>
        לצבעי המותג של אתר, כמו כחול #2447D6, בדקו תמיד את שני הכיוונים. הכחול הזה מקבל מול לבן {brandBlue.onWhite},
        כלומר טקסט לבן עליו עובר גם את רמת AAA, ואילו כחול בהיר #3E96F9 מקבל מול לבן {lightBlue.onWhite}, ולכן מתאים
        לטקסט לבן רק בגודל גדול. מי שבונה הצהרת נגישות לאתר יכול לתעד את הבדיקות האלה ב
        <Link href="/tools/accessibility-statement-generator">מחולל הצהרת הנגישות</Link>.
      </p>

      <h2>המרה ל-CMYK וקוד צבע לרכב: מה הכלי לא עושה</h2>
      <p>
        הכלי ממיר בין HEX, RGB ו-HSL, שהם קודים של מסך. הוא לא ממיר ל-CMYK, שהוא מודל של הדפסה: ההמרה תלויה בפרופיל
        הצבע של הנייר והמדפסת, ולכן אין לה תוצאה אחת נכונה. לצורך הדפסה, מקבלים את ערכי ה-CMYK ממדפיס. גם קוד צבע של
        רכב הוא קוד של היצרן ולא קוד של מסך, ולא ניתן להמיר אותו כאן. אם אתם מכינים תמונה לרשתות חברתיות, גודל הקובץ
        חשוב לא פחות מהצבע, ואפשר לבדוק אותו ב<Link href="/tools/social-image-resizer">כלי לשינוי גודל תמונות</Link>.
      </p>

      <h2>מקורות</h2>
      <ul className={styles.sources}>
        <li>
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/CSS/hex-color"
            rel="noopener"
            target="_blank"
            lang="en"
            dir="ltr"
          >
            MDN: &lt;hex-color&gt; CSS type
          </a>
        </li>
        <li>
          <a
            href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html"
            rel="noopener"
            target="_blank"
            lang="en"
            dir="ltr"
          >
            W3C: Understanding Success Criterion 1.4.3, Contrast (Minimum)
          </a>
        </li>
        <li>
          <a href="https://www.w3.org/TR/WCAG22/" rel="noopener" target="_blank" lang="en" dir="ltr">
            W3C: Web Content Accessibility Guidelines (WCAG) 2.2
          </a>
        </li>
      </ul>
      <p className={styles.reviewed}>
        הספים והנוסחה נבדקו מול המקורות ב-<time dateTime={CHECKED}>23.10.2026</time>.
      </p>
    </ToolLayout>
  )
}
