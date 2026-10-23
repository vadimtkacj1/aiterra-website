import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import BakingConverter from '../../components/tools/BakingConverter'
import {
  BAKING_CHECKED,
  BAKING_CHECKED_LABEL,
  bakingSources,
  cupSystems,
  fahrenheitToCelsius,
  ingredients,
  nearestGasMark,
  roundGrams,
  volumeToGrams,
} from '@/lib/baking-converter'
import styles from './page.module.css'

const PATH = '/tools/baking-converter'
const TITLE = 'המרת כוסות לגרמים'
const META_TITLE = 'המרת כוסות לגרמים: קמח, סוכר, חמאה ועוד'
const DESCRIPTION =
  'המרת כוסות לגרמים וגרמים לכוסות לקמח, סוכר, חמאה, שמן ועוד, עם כוס ישראלית וכוס אמריקאית. כולל המרת פרנהייט לצלזיוס וסימוני גז לתנור.'

const faq: ToolFaqEntry[] = [
  {
    id: 'baking-faq-flour',
    question: 'כמה גרם יש בכוס קמח?',
    answer:
      'לפי טבלת המשקלים של King Arthur Baking, כוס אמריקאית של קמח לבן רגיל שוקלת 120 גרם. בכוס של 240 מ״ל מקבלים כ־122 גרם. ההבדל בין כוסות קטן, אבל אופן המדידה משנה יותר: קמח שנדחס בכוס יכול לשקול 140 גרם ויותר, ולכן כף שמעבירים לכוס ומיישרים בסכין נותנת תוצאה עקבית.',
  },
  {
    id: 'baking-faq-cup-size',
    question: 'מה גודל כוס בישראל?',
    answer:
      'אין תקן ישראלי אחד לכוס מדידה. במתכונים ישראליים נפוצות כוס של 240 מ״ל וכוס של 250 מ״ל, ואילו הכוס האמריקאית היא 236.6 מ״ל. ההבדל קטן, פחות מ־6 אחוזים, אבל במתכון רגיש כמו עוגה או בצק שמרים כדאי להשתמש באותה כוס לאורך כל המתכון. בכלי אפשר לבחור את הכוס הרצויה.',
  },
  {
    id: 'baking-faq-butter',
    question: 'כמה חמאה יש בכוס?',
    answer:
      'כוס חמאה אמריקאית שוקלת 227 גרם, שהם 2 מקלות חמאה אמריקאיים של 113 גרם כל אחד, לפי טבלת King Arthur Baking. בכוס של 240 מ״ל זה כ־230 גרם. מכיוון שחמאה נמכרת בישראל בחבילות במשקל קבוע, הכי פשוט לשקול אותה בגרמים ולא למדוד אותה בכוס, וכך הכמות מדויקת יותר גם כשהחמאה קשה.',
  },
  {
    id: 'baking-faq-oil-butter',
    question: 'איך מחליפים חמאה בשמן?',
    answer:
      'כוס חמאה היא כ־227 גרם וכוס שמן היא כ־198 גרם, לפי הטבלה של King Arthur Baking, כך שהמשקל שונה. כלל אצבע נפוץ הוא להחליף חמאה בשמן בכמות קצת קטנה יותר, כי בחמאה יש גם מים וחלבונים. לכן התוצאה תהיה שונה בטעם ובמרקם, ובעוגיות כדאי להיזהר מהחלפה.',
  },
  {
    id: 'baking-faq-temp',
    question: 'איך ממירים פרנהייט לצלזיוס?',
    answer:
      'מחסירים 32 מהמספר בפרנהייט, כופלים ב־5 ומחלקים ב־9. לדוגמה, 350 מעלות פרנהייט הן 177 מעלות צלזיוס, ובמתכונים מעגלים ל־180. בכלי מקלידים טמפרטורה באחד השדות והשני מתעדכן. בטבלת סימוני הגז רואים גם את הסימון המקביל, כמו גז 4 שהוא 180 מעלות.',
  },
  {
    id: 'baking-faq-accuracy',
    question: 'עד כמה ההמרה מדויקת?',
    answer:
      'הערכים הם ממוצעים לפי טבלת משקלים אמריקאית. משקל כוס תלוי בסוג החומר, בתוצרת, בלחות ובאופן המדידה, לכן הסטייה יכולה להגיע לכמה אחוזים, ובקמח ליותר. במתכון מדויק, כמו לחם או מאפה עדין, שקילה במשקל מטבח היא הדרך הבטוחה. להמרה יומיומית של עוגה או עוגיות הכלי מספיק.',
  },
  {
    id: 'baking-faq-sugar',
    question: 'כמה גרם יש בכוס סוכר?',
    answer:
      'לפי טבלת King Arthur Baking, כוס אמריקאית של סוכר לבן שוקלת 198 גרם. בכוס של 240 מ״ל זה כ-200 גרם, ובכוס של 250 מ״ל כ-210. סוכר חום דחוס כבד יותר, כ-213 גרם לכוס אמריקאית, ואבקת סוכר קלה בהרבה, כ-113 גרם, ולכן אי אפשר להחליף ביניהם לפי נפח.',
  },
  {
    id: 'baking-faq-spoons',
    question: 'כמה גרם יש בכף קמח, סוכר או חמאה?',
    answer:
      'לפי הנפח של כף ישראלית של 15 מ״ל, כף קמח שוקלת כ-7.6 גרם, כף סוכר כ-12.6 גרם וכף חמאה כ-14.4 גרם. אלה חישובים מהמשקל לכוס, ולא מדידה בפועל, ולכן הם הערכה. בכפות גדושות או מיושרות התוצאה משתנה, ובכמויות קטנות מאוד הסטייה פחות מורגשת.',
  },
]

const il240 = cupSystems[0]
const tableIds = ['flour', 'sugar', 'brown-sugar', 'powdered-sugar', 'butter', 'oil', 'honey', 'cocoa', 'oats']
const tableIngredients = ingredients.filter((item) => tableIds.includes(item.id))
const ovenRows = [325, 350, 375, 400, 425].map((fahrenheit) => {
  const celsius = Math.round(fahrenheitToCelsius(fahrenheit))
  return { fahrenheit, celsius, mark: nearestGasMark(celsius).mark }
})

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function BakingConverterPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="כוס של 240 מ״ל קמח לבן שוקלת כ־120 גרם, כוס סוכר כ־200 גרם וכוס חמאה כ־230 גרם. בוחרים חומר גלם וגודל כוס, ממירים בשני הכיוונים ורואים גם טבלה ומעלות תנור."
      chips={[`${ingredients.length} חומרי גלם`, 'כוס ישראלית ואמריקאית', 'פרנהייט וסימוני גז', 'בלי הרשמה']}
      tool={<BakingConverter />}
      faq={faq}
      cta={{
        text: 'מנהלים מאפייה או מוכרים מוצרי אפייה אונליין? אנחנו בונים אתרים וכלים מותאמים שמביאים לקוחות.',
        label: 'לפיתוח מערכות מותאמות',
        href: '/services/development',
      }}
    >
      <h2>איך ממירים כוסות לגרמים</h2>
      <p>
        בוחרים חומר גלם, מקלידים כמות ובוחרים כוס, כף או כפית. הכלי מכפיל את הנפח במשקל של מיליליטר מאותו חומר, ומחזיר
        גרמים ומיליליטרים. הכיוון ההפוך מחשב כמה כוסות, כפות וכפיות יש בכמות בגרמים.
      </p>
      <ul>
        <li>
          <strong>גודל הכוס.</strong> כוס אמריקאית היא 236.6 מ״ל, וכוס ישראלית מקובלת היא 240 מ״ל. יש גם אפשרות של 250
          מ״ל.
        </li>
        <li>
          <strong>כף וכפית.</strong> בכלי כף ישראלית היא 15 מ״ל וכפית 5 מ״ל. בכוס אמריקאית כף היא 14.8 מ״ל וכפית 4.9
          מ״ל.
        </li>
        <li>
          <strong>משקל לפי חומר.</strong> לכל חומר צפיפות אחרת, ולכן אין מספר אחד לכל הכוסות. כוס דבש שוקלת 336 גרם, וכוס
          קמח 120 גרם.
        </li>
      </ul>

      <h2>איך מודדים נכון</h2>
      <ul>
        <li>קמח: מפוררים בכף, מעבירים לכוס בלי ללחוץ ומיישרים בסכין, כדי לא לדחוס.</li>
        <li>סוכר חום: דוחסים לכוס עד שהוא מחזיק צורה, כך נמדד בטבלה.</li>
        <li>נוזלים: מודדים בכוס מדידה שקופה בגובה העיניים, לא בכוס יבשה.</li>
        <li>דבש ושמן: מורחים מעט שמן על הכוס, והדבש מחליק החוצה.</li>
      </ul>

      <h2>כמה גרם בכוס: טבלה לפי חומר</h2>
      <p>
        הטבלה מחושבת בכלי עצמו לכוס ישראלית של 240 מ״ל. כוס של 250 מ״ל מוסיפה בערך 4 אחוזים לכל ערך, וכוס אמריקאית של
        236.6 מ״ל מקטינה אותו מעט. כף היא 15 מ״ל, וכפית 5 מ״ל.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>משקל של כוס, כף וכפית בגרמים</caption>
          <thead>
            <tr>
              <th scope="col">חומר</th>
              <th scope="col">כוס (גרם)</th>
              <th scope="col">כף (גרם)</th>
              <th scope="col">כפית (גרם)</th>
            </tr>
          </thead>
          <tbody>
            {tableIngredients.map((item) => (
              <tr key={item.id}>
                <th scope="row">{item.name}</th>
                <td className={styles.value}>{roundGrams(volumeToGrams(item, 1, 'cup', il240))}</td>
                <td className={styles.value}>{volumeToGrams(item, 1, 'tbsp', il240).toFixed(1)}</td>
                <td className={styles.value}>{volumeToGrams(item, 1, 'tsp', il240).toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>המרת כוסות קמח לגרמים: דוגמאות</h2>
      <p>
        שתי כוסות וחצי קמח, בכוס של 240 מ״ל, הן כ-305 גרם. בכיוון ההפוך, 250 גרם קמח הם קצת יותר משתי כוסות. מתכון
        שמבקש 200 גרם סוכר דורש כוס אחת בדיוק של 240 מ״ל, וחצי כוס חמאה היא כ-115 גרם, שהם מקל חמאה אמריקאי אחד.
        כשמתכון כתוב בכוסות ובשברים, אפשר לחשב את השבר ב<Link href="/tools/fractions-calculator">מחשבון השברים</Link>.
      </p>

      <h2>חצאי כוסות ושברים</h2>
      <p>
        מתכונים מבקשים לעיתים רבע כוס, שליש או חצי. בכוס של 240 מ״ל רבע כוס קמח הוא כ-30 גרם, שליש כוס סוכר כ-67 גרם
        וחצי כוס דבש כ-170 גרם. בכיוון ההפוך, מגרמים לכוסות, הכלי מציג את התוצאה בשברים כמו ¼ ו-⅓. בכמויות קטנות
        כאלה, ומתחת לכמה עשרות גרמים, עדיף למדוד בכפות מאשר בכוס מלאה למחצה, כי פני החומר בכוס אינם שטוחים. אם המתכון מבקש כוס שלמה ואתם רוצים להכפיל אותו או לחצות אותו, חשבו קודם את הכמות בגרמים ורק אחר כך חלקו, כדי שהעיגול לא יצטבר.
      </p>

      <h2>למה אותה כוס שוקלת אחרת</h2>
      <p>
        כוס מודדת נפח ולא משקל, ולכל חומר צפיפות אחרת: כוס מים שוקלת 227 גרם לפי הטבלה, כוס קמח 120 ודבש 336. גם
        אותו חומר שוקל אחרת לפי אופן המילוי, ולכן בטבלה קמח נמדד בלי דחיסה. ההפרש בין כוס ישראלית לאמריקאית קטן
        מההפרש בין כוס מיושרת לכוס דחוסה, ולכן הקפידו על אותה שיטת מדידה לאורך כל המתכון.
      </p>

      <h2>טמפרטורת תנור: טבלת המרה</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>פרנהייט, צלזיוס וסימון גז</caption>
          <thead>
            <tr>
              <th scope="col">פרנהייט</th>
              <th scope="col">צלזיוס</th>
              <th scope="col">סימון גז קרוב</th>
            </tr>
          </thead>
          <tbody>
            {ovenRows.map((row) => (
              <tr key={row.fahrenheit}>
                <th scope="row">{row.fahrenheit}</th>
                <td className={styles.value}>{row.celsius}</td>
                <td className={styles.value}>{row.mark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        הערכים בצלזיוס מעוגלים למעלה שלמה, ובמתכון מעגלים בדרך כלל ל-5 או ל-10 הקרובים. זמני אפייה וטמפרטורות למאכלים
        שונים מופיעים ב<Link href="/tools/cooking-times-chart">טבלת זמני הבישול</Link>, ואת האופן שבו לשמור את התוצר
        אחרי האפייה תמצאו ב<Link href="/tools/fridge-storage-times">טבלת זמני האחסון במקרר</Link>.
      </p>

      <h2>תנור: מעלות, פרנהייט וגז</h2>
      <p>
        מתכונים אמריקאיים כותבים טמפרטורה בפרנהייט ומתכונים בריטיים בסימוני גז. הנוסחה היא מעלות פרנהייט פחות 32, כפול
        5, חלקי 9. בתנור עם מפוח אוויר חם מקובל להוריד כ־10 עד 20 מעלות, אבל כדאי לבדוק בהוראות היצרן.
      </p>
      <p>
        אם צריך להכפיל או להקטין מתכון, <Link href="/tools/percentage-calculator">מחשבון האחוזים</Link> עוזר לחשב את
        השינוי.
      </p>

      <h2>מקורות</h2>
      <ul className={styles.sources}>
        {bakingSources.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noopener" target="_blank" lang="en" dir="ltr">
              {source.label}
            </a>
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        משקלי חומרי הגלם נלקחו מטבלת King Arthur Baking ונבדקו ב־
        <time dateTime={BAKING_CHECKED}>{BAKING_CHECKED_LABEL}</time>. בטבלה מופיע משקל לכוס, וחלק מהערכים, כמו כפות,
        חושבו מהם לפי הנפח. סימוני הגז הם המקובלים. הערכים הם הערכה ולא תחליף לשקילה.
      </p>
    </ToolLayout>
  )
}
