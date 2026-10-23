import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import ColorConverter from '../../components/tools/ColorConverter'
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

      <h2>מקורות</h2>
      <ul className={styles.sources}>
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
