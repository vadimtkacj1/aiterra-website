import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import AcSizeCalculator from '../../components/tools/AcSizeCalculator'
import {
  BTU_PER_HORSEPOWER,
  BTU_PER_PERSON,
  BTU_PER_SQUARE_METER,
  FLOOR_PERCENT,
  KITCHEN_BTU,
  RATINGS,
  REFERENCE_CEILING_METERS,
  REGION_PERCENT,
  REVIEWED_LABEL,
  SOURCES,
  SUN_PERCENT,
  calculateAc,
  formatBtu,
  formatHorsepower,
  formatNumber,
} from '@/lib/ac-size'
import styles from './page.module.css'

const PATH = '/tools/ac-size-calculator'
const TITLE = 'מחשבון מזגן לפי גודל חדר'
const META_TITLE = 'מחשבון מזגן: כמה כוח סוס ו-BTU צריך לחדר'
const DESCRIPTION =
  'מחשבון BTU למזגן: מקלידים שטח חדר, גובה תקרה, שמש, קומה, אנשים ואזור בארץ, ומקבלים כמה BTU צריך ואיזה מזגן מתאים, 1, 1.5, 2 או 3 כוח סוס.'

const TADIRAN_RANGES: Record<number, string> = {
  1: 'כ-9,000',
  1.25: 'כ-12,000 עד 13,500',
  2: 'כ-17,000 עד 18,000',
  2.5: 'כ-23,000 עד 24,000',
  3.5: 'כ-27,000 עד 30,000',
}

const bedroom = calculateAc({
  areaSquareMeters: 15,
  ceilingMeters: 2.6,
  people: 2,
  sun: 'normal',
  floor: 'middle',
  kitchen: false,
  region: 'coastal',
})

const livingRoom = calculateAc({
  areaSquareMeters: 30,
  ceilingMeters: 2.6,
  people: 4,
  sun: 'strong',
  floor: 'top',
  kitchen: true,
  region: 'inland',
})

const ratingText = (result: ReturnType<typeof calculateAc>) =>
  result.rating ? formatHorsepower(result.rating.horsepower) : 'יותר מ-5 כ"ס'

const faq: ToolFaqEntry[] = [
  {
    id: 'ac-faq-hp',
    question: 'כמה כוח סוס מזגן צריך לחדר?',
    answer:
      'לפי כלל האצבע של תדיראן, כל מטר רבוע צריך כ-650 BTU לשעה, ולכל אדם שנמצא בחדר באופן קבוע מוסיפים כ-500 BTU. בשוק הישראלי נהוג לחשב כוח סוס אחד ככ-9,000 BTU. לכן חדר שינה של 12 מ"ר עם אדם אחד צריך כ-8,300 BTU, ומזגן 1 כ"ס מספיק לו. חדר של 15 מ"ר עם שני אנשים כבר עובר את 9,000 BTU ומתאים לו 1.25 כ"ס. סלון של 25 עד 30 מ"ר מגיע לרוב ל-2 עד 3 כ"ס, תלוי בשמש, בקומה ובמספר האנשים. המחשבון מוסיף את כל הגורמים האלה ומראה את החישוב שורה אחרי שורה.',
  },
  {
    id: 'ac-faq-btu',
    question: 'מה ההבדל בין BTU לכוח סוס במזגן?',
    answer:
      'BTU/h הוא כמות החום שהמזגן מסלק מהחדר בשעה, וזה הנתון שמופיע במפרט תחת Cooling Capacity. כוח סוס הוא יחידה ישנה שנשארה בשפה של השוק הישראלי, והיחס המקובל הוא כ-9,000 BTU לכוח סוס. תדיראן מדגישה שזה לא יחס הנדסי מדויק: שני מזגנים שנמכרים כ-2 כ"ס יכולים לספק תפוקה שונה. לכן כשמשווים דגמים, כדאי להסתכל על ה-BTU/h הנומינלי ולא על הכותרת. המחשבון מחזיר את שני הנתונים, כדי שיהיה לכם קל לדבר עם המוכר וגם לבדוק את המפרט עצמו לפני התשלום.',
  },
  {
    id: 'ac-faq-big',
    question: 'מה קורה אם קונים מזגן גדול מדי?',
    answer:
      'מזגן גדול מדי לא מקרר טוב יותר. הוא מוריד את הטמפרטורה מהר, נכבה או מאט, ולא מספיק לייבש את הלחות, כך שהחדר נשאר דביק, בעיקר במישור החוף. הוא גם עולה יותר בקנייה. מזגן קטן מדי, לעומת זאת, עובד בעוצמה מלאה שעות ארוכות בימי שרב ולא מגיע לטמפרטורה שביקשתם. לכן המחשבון בוחר את הדירוג הקטן ביותר שמכסה את התפוקה הנדרשת, ולא מעגל למעלה בנדיבות. אם התוצאה יוצאת ממש על הגבול בין שני דירוגים, וחדר פונה למערב, עדיף לשקול את הדירוג הגבוה יותר ולבדוק את טווח האינוורטר.',
  },
  {
    id: 'ac-faq-inverter',
    question: 'האם כדאי לבחור מזגן אינוורטר?',
    answer:
      'היום כמעט אין ברירה אחרת. לפי תדיראן, ישראל אימצה את דרישות הנצילות העונתית האירופיות, SEER לקירור ו-SCOP לחימום, ומאמצע 2025 מזגני האינוורטר שולטים בשוק כי מזגני הפעלה וכיבוי מהדור הקודם לא עומדים ברף. במזגן אינוורטר המדחס משנה מהירות לפי העומס, ולכן במפרט מופיע BTU נומינלי ולצידו מינימום ומקסימום. את הגודל מתאימים לפי הנומינלי. טווח רחב עוזר לקרר מהר ביום חם ולחסוך חשמל כשהחדר כבר קר. כדאי גם להסתכל על דירוג האנרגיה בתווית ולהשוות בין דגמים באותה תפוקה.',
  },
  {
    id: 'ac-faq-roof',
    question: 'למה בקומה עליונה או בחדר מערבי צריך מזגן חזק יותר?',
    answer:
      'גג חשוף לשמש מתחמם במשך כל היום ומעביר חום לחדר שמתחתיו, וחלונות גדולים שפונים לדרום או למערב מכניסים קרינה ישירה בשעות החמות. תדיראן וטורנדו שואלים על שני הגורמים האלה לפני שהם ממליצים על מזגן, אבל לא מפרסמים אחוז קבוע. במחשבון הוספנו 10% על קומה עליונה ו-10% על שמש חזקה, והורדנו 10% לחדר מוצל. אלה הנחות שלנו, שקופות בטבלת הפירוט, ולא נתון של יצרן. תריס חיצוני, סוכך או בניין סמוך שמצל יכולים להוריד את העומס בפועל, ולכן כדאי לבחור באפשרות שמתארת את רוב שעות היום.',
  },
  {
    id: 'ac-faq-region',
    question: 'האם האזור בארץ משנה את גודל המזגן?',
    answer:
      'כן. תדיראן כותבת שבאזורים הקרים יותר אפשר להסתפק בתפוקה נמוכה יותר, והמקצוענים מזכירים שבמישור החוף הלחות גבוהה ולא כדאי לבחור מזגן גבולי. טורנדו מבקשת לבחור אזור, ומפרידה את עמק הירדן, אילת והערבה משאר הארץ. היצרנים לא מפרסמים מקדם מספרי, ולכן במחשבון יש הנחות שלנו: מינוס 10% באזור הררי, פלוס 5% במישור החוף, ופלוס 15% בבקעה, בערבה ובאילת. אם אתם גרים קרוב מאוד לים או בבית צמוד קרקע בלי בידוד, כדאי לבקש מטכנאי חישוב עומס חום מסודר לפני הקנייה.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function AcSizeCalculatorPage() {
  const sources = Object.values(SOURCES)

  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede={`כל מטר רבוע צריך כ-${formatNumber(BTU_PER_SQUARE_METER)} BTU, כל אדם בחדר מוסיף כ-${formatNumber(BTU_PER_PERSON)} BTU, וכוח סוס אחד הוא כ-${formatNumber(BTU_PER_HORSEPOWER)} BTU. כך חדר שינה של 12 מ"ר מסתפק ב-1 כ"ס, וסלון של 30 מ"ר צריך 2.5 עד 3 כ"ס. הקלידו את מידות החדר, והמחשבון יוסיף שמש, קומה, תקרה ואזור.`}
      chips={['BTU וכוח סוס', 'לפי כללי אצבע של יצרנים', 'פירוט שורה אחרי שורה', 'שום נתון לא נשלח']}
      tool={<AcSizeCalculator />}
      faq={faq}
      cta={{
        text: 'יש לכם עסק של מיזוג אוויר? לקוחות מחפשים "מזגן לחדר" בגוגל לפני שהם מתקשרים. אתר עם מחירון התקנה, אזורי שירות וטופס הצעת מחיר מביא את השיחות האלה אליכם.',
        label: 'אתר לעסק',
        href: '/services/brochure',
      }}
    >
      <h2>איך המחשבון מחשב</h2>
      <ol>
        <li>
          שטח החדר כפול {formatNumber(BTU_PER_SQUARE_METER)} BTU/h, לפי כלל האצבע של תדיראן ושל המקצוענים.
        </li>
        <li>
          תקרה גבוהה מ-{formatNumber(REFERENCE_CEILING_METERS, 1)} מ&apos; מגדילה את התוצאה באותו יחס, כי היצרנים
          מדגישים שהגודל נקבע לפי נפח החלל. תקרה נמוכה יותר לא מקטינה את החישוב.
        </li>
        <li>
          חשיפה לשמש: {SUN_PERCENT.shaded}% לחדר מוצל, +{SUN_PERCENT.strong}% לחלונות גדולים לדרום או למערב.
        </li>
        <li>קומה עליונה או גג: +{FLOOR_PERCENT.top}%.</li>
        <li>
          אזור: {REGION_PERCENT.mountain}% בהרים, +{REGION_PERCENT.coastal}% במישור החוף, +{REGION_PERCENT.hot}% בבקעה,
          בערבה ובאילת.
        </li>
        <li>
          {formatNumber(BTU_PER_PERSON)} BTU/h לכל אדם, ועוד {formatNumber(KITCHEN_BTU)} BTU/h למטבח פתוח.
        </li>
        <li>מעגלים למאה הקרובה ובוחרים את הדירוג הקטן ביותר שתפוקתו המקובלת מכסה את התוצאה.</li>
      </ol>
      <p>
        שלבים 1 ו-6 לקוחים מהמקורות. אחוזי השמש, הקומה והאזור, גובה התקרה הבסיסי והתוספת למטבח הם הנחות שלנו: היצרנים
        מציינים שהגורמים האלה מגדילים את התפוקה הנדרשת, אבל לא מפרסמים מספר.
      </p>

      <h2>טבלת כוח סוס מול BTU</h2>
      <div className={styles.tableWrap} role="region" aria-label="טבלת כוח סוס מול BTU" tabIndex={0}>
        <table className={styles.table}>
          <caption>תפוקת קירור לפי דירוג, BTU/h</caption>
          <thead>
            <tr>
              <th scope="col">דירוג</th>
              <th scope="col">לפי 9,000 BTU לכ&quot;ס</th>
              <th scope="col">בטבלת תדיראן</th>
            </tr>
          </thead>
          <tbody>
            {RATINGS.map((rating) => (
              <tr key={rating.horsepower}>
                <th scope="row">{formatHorsepower(rating.horsepower)}</th>
                <td>{formatBtu(rating.btu)}</td>
                <td>{TADIRAN_RANGES[rating.horsepower] ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        המחשבון משתמש ביחס של 9,000 BTU לכוח סוס, שמופיע אצל המקצוענים ובשאלות הנפוצות של תדיראן כיחס המקובל בשוק.
        הטבלה של תדיראן נותנת טווחים, ובחלק מהדירוגים גבוהים יותר. לכן במזגן מסוים תמיד בודקים את תפוקת הקירור במפרט.
      </p>

      <h2>דוגמה: חדר שינה וסלון</h2>
      <p>
        <strong>חדר שינה בתל אביב:</strong> 15 מ&quot;ר, תקרה 2.6 מ&apos;, קומת ביניים, שמש רגילה, שני אנשים. 15 ×{' '}
        {formatNumber(BTU_PER_SQUARE_METER)} = {formatBtu(15 * BTU_PER_SQUARE_METER)}, ועוד 5% למישור החוף ו-
        {formatBtu(2 * BTU_PER_PERSON)} לשני אנשים. סך הכול {formatBtu(bedroom.requiredBtu)}, ולכן{' '}
        {ratingText(bedroom)}. מזגן 1 כ&quot;ס של 9,000 BTU יעבוד כאן קשה מדי בימי שרב.
      </p>
      <p>
        <strong>סלון בבאר שבע:</strong> 30 מ&quot;ר בקומה עליונה, חלון גדול למערב, מטבח פתוח וארבעה אנשים. הבסיס הוא{' '}
        {formatBtu(30 * BTU_PER_SQUARE_METER)}, השמש והגג מוסיפים 10% כל אחד, האנשים {formatBtu(4 * BTU_PER_PERSON)}{' '}
        והמטבח {formatBtu(KITCHEN_BTU)}. סך הכול {formatBtu(livingRoom.requiredBtu)}, ולכן {ratingText(livingRoom)}.
        אותו סלון בקומת ביניים ובצל היה מסתפק בפחות.
      </p>

      <h2>מה לבדוק בחנות</h2>
      <ul>
        <li>תפוקת קירור נומינלית ב-BTU/h, ולא רק &quot;כוח סוס&quot; בכותרת.</li>
        <li>טווח האינוורטר: מינימום ומקסימום. טווח רחב מקרר מהר ושומר על חדר יציב בלי הדלקות חוזרות.</li>
        <li>דירוג האנרגיה בתווית וצריכת החשמל, במיוחד אם המזגן עובד שעות רבות ביום.</li>
        <li>רמת רעש של היחידה הפנימית, בחדר שינה.</li>
        <li>חיבור חשמל: מזגנים גדולים יכולים לדרוש קו נפרד או חיבור תלת פאזי.</li>
      </ul>

      <h2>מקורות</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noopener" target="_blank">
              {source.label}
            </a>
            : {source.note}
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        הכללים נבדקו מול המקורות ב-{REVIEWED_LABEL}. זו הערכה ראשונית בלבד ולא חישוב עומס חום. בידוד, חלונות, צורת
        החלל ומעבר אוויר בין חדרים משנים את התוצאה, ולכן לפני קנייה כדאי להתייעץ עם טכנאי מיזוג.
      </p>
    </ToolLayout>
  )
}
