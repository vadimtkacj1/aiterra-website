import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import CookingTimesChart from '../../components/tools/CookingTimesChart'
import {
  COOKING_REVIEWED,
  COOKING_REVIEWED_LABEL,
  SAFE_SOURCES,
  cookingItems,
  formatMinutes,
  safeTemps,
} from '@/lib/cooking-times'
import styles from '../word-counter/page.module.css'

const PATH = '/tools/cooking-times-chart'
const TITLE = 'כמה זמן לבשל? טבלת זמני בישול וטיימר'
const META_TITLE = 'כמה זמן לבשל? טבלת זמני בישול וטיימר'
const DESCRIPTION = `כמה זמן לבשל אורז, ביצה, פסטה, עדשים, ירקות, עוף ובשר? ${cookingItems.length} מאכלים עם שיטה וזמן, טמפרטורות בטוחות לפי USDA וטיימר מובנה לכמה סירים.`

const pick = (ids: string[]) => cookingItems.filter((entry) => ids.includes(entry.id))

function ItemsTable({ ids, caption }: { ids: string[]; caption: string }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">מאכל</th>
            <th scope="col">שיטה</th>
            <th scope="col">זמן</th>
          </tr>
        </thead>
        <tbody>
          {pick(ids).map((entry) => (
            <tr key={entry.id}>
              <th scope="row">{entry.name}</th>
              <td>{entry.method}</td>
              <td>{formatMinutes(entry.min, entry.max)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const faq: ToolFaqEntry[] = [
  {
    id: 'cook-faq-egg',
    question: 'כמה זמן מבשלים ביצה קשה וכמה ביצה רכה?',
    answer:
      'במים רותחים ביצה רכה עם חלמון נוזלי לוקחת 5 עד 6 דקות, ביצה חצי רכה 7 עד 8 דקות וביצה קשה 10 עד 12 דקות. הזמנים משוערים לביצה בגודל L שיוצאת מהמקרר, ומתחילים למדוד מרגע שהמים חוזרים לרתיחה. אחרי הבישול מקררים במים קרים כדי לעצור אותו.',
  },
  {
    id: 'cook-faq-rice',
    question: 'כמה זמן מבשלים אורז לבן?',
    answer:
      'אורז לבן רגיל, ביחס מים של 1:2 בסיר מכוסה, מוכן אחרי 15 עד 18 דקות. אורז בסמטי ויסמין לוקחים 10 עד 15 דקות וצריכים פחות מים. בסוף משאירים את הסיר מכוסה לעוד חמש דקות, ורק אז מפרקים את האורז במזלג. אורז מלא לוקח 40 עד 45 דקות.',
  },
  {
    id: 'cook-faq-chicken',
    question: 'באיזו טמפרטורה עוף מוכן?',
    answer: `לפי USDA, עוף והודו בטוחים לאכילה כשהטמפרטורה הפנימית ב${safeTemps.poultry.celsius} מעלות צלזיוס (${safeTemps.poultry.fahrenheit} מעלות פרנהייט), שנמדדת במדחום בחלק העבה ביותר ולא על העצם. הזמנים בטבלה הם הערכה בלבד. מדחום בישול הוא הדרך היחידה לוודא שהעוף מוכן, כי צבע הבשר לא מעיד על בטיחות.`,
  },
  {
    id: 'cook-faq-meat',
    question: 'באיזו טמפרטורה בשר טחון וסטייק מוכנים?',
    answer: `לפי USDA, בשר טחון, כמו המבורגר וקציצות, צריך להגיע ל-${safeTemps.ground.celsius} מעלות (${safeTemps.ground.fahrenheit} מעלות פרנהייט). סטייק, צלי וצלעות של בקר וכבש צריכים להגיע ל-${safeTemps.whole.celsius} מעלות (${safeTemps.whole.fahrenheit} מעלות פרנהייט), ואחר כך מנוחה של שלוש דקות לפחות. אלה טמפרטורות מינימום, ומותר לבשל יותר מזה.`,
  },
  {
    id: 'cook-faq-legumes',
    question: 'צריך להשרות קטניות לפני הבישול?',
    answer:
      'עדשים לא צריכות השריה, והן מוכנות תוך 10 עד 30 דקות. חומוס, שעועית ופול מושרים בדרך כלל לילה שלם, ואז מתבשלים 60 עד 90 דקות. בלי השריה הזמן ארוך הרבה יותר. את השעועית האדומה מתחילים לבשל ברתיחה חזקה של לפחות עשר דקות, ורק אחר כך מנמיכים את האש.',
  },
  {
    id: 'cook-faq-accuracy',
    question: 'עד כמה הזמנים בטבלה מדויקים?',
    answer:
      'הזמנים הם טווחים משוערים לפי טווחים נפוצים במטבח הביתי, והם משתנים לפי גודל הסיר, עוצמת האש, עובי החתיכה והגובה שבו אתם גרים. תמיד כדאי לטעום או למדוד. הטמפרטורות הבטוחות לעוף, בשר, דגים וביצים הן היחידות בטבלה שמגיעות ממקור רשמי, והמקורות מופיעים בסוף העמוד.',
  },
  {
    id: 'cook-faq-corn',
    question: 'כמה זמן מבשלים תירס בקלח?',
    answer:
      'קלח תירס במים רותחים מוכן אחרי 8 עד 10 דקות. מכניסים אותו למים שכבר רותחים, ובדרך כלל לא מוסיפים מלח בתחילת הבישול. כדאי לטעום גרעין אחד אחרי שמונה דקות ולהחליט אם להמשיך.',
  },
  {
    id: 'cook-faq-lentils-black',
    question: 'כמה זמן מבשלים עדשים שחורות וירוקות?',
    answer:
      'עדשים שחורות מתבשלות 20 עד 25 דקות ושומרות על צורתן. עדשים ירוקות לוקחות 25 עד 30 דקות. שתיהן לא צריכות השריה, ומוסיפים להן מלח לקראת הסוף. עדשים כתומות מוכנות כבר אחרי 10 עד 15 דקות ומתפרקות, ולכן הן מתאימות יותר למרק ולמחית מאשר לסלט.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function CookingTimesChartPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="ביצה קשה מתבשלת 10 עד 12 דקות, אורז לבן 15 עד 18 דקות ופסטה 9 עד 12 דקות. בטבלה יש עוד עשרות מאכלים עם שיטה וזמן, ולכל שורה כפתור טיימר שאפשר להפעיל בכמה סירים במקביל."
      chips={[`${cookingItems.length} מאכלים`, 'טיימרים מרובים', 'טמפרטורות בטוחות לפי USDA', 'חיפוש לפי מאכל']}
      tool={<CookingTimesChart />}
      faq={faq}
      cta={{
        text: 'צריכים מערכת או כלי חישוב מותאמים למסעדה או לעסק מזון? אנחנו מפתחים תוכנה לפי הצורך.',
        label: 'לפיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>איך משתמשים בטבלה</h2>
      <p>
        מחפשים את המאכל או בוחרים קטגוריה, ולוחצים על כפתור הטיימר בשורה. הטיימר מתחיל מהזמן הנמוך בטווח, כדי שתבדקו
        אם המאכל מוכן ותמשיכו אם צריך. אפשר להפעיל כמה טיימרים יחד, למשל לאורז ולעוף, ולהוסיף גם טיימר חופשי בשם
        ובדקות שתבחרו. כשהטיימר מסתיים נשמע צליל והשורה מסומנת. הצליל מופעל רק אחרי שלחצתם על טיימר.
      </p>

      <h2>טמפרטורות בטוחות לעוף, בשר, דגים וביצים</h2>
      <p>
        הזמן בטבלה הוא רק הערכה. בבשר ובעוף מה שקובע אם המנה בטוחה הוא הטמפרטורה בפנים, שנמדדת במדחום בישול. אלה
        הטמפרטורות המינימליות לפי USDA:
      </p>
      <ul>
        {(['poultry', 'ground', 'whole', 'fish', 'egg'] as const).map((id) => (
          <li key={id}>
            <strong>{safeTemps[id].label}:</strong> {safeTemps[id].celsius} מעלות צלזיוס ({safeTemps[id].fahrenheit}{' '}
            מעלות פרנהייט).
          </li>
        ))}
      </ul>
      <p>
        מנוחה לפני חיתוך חלה על בשר שלם. ביצה רכה עם חלמון נוזלי לא מגיעה לטמפרטורה שמופיעה כאן למנות ביצים.
      </p>

      <h2>למה הזמנים משתנים</h2>
      <ul>
        <li>גודל וחומר הסיר: סיר רחב ודק מבשל מהר יותר מסיר צר ועבה.</li>
        <li>טמפרטורת ההתחלה: ביצה או בשר שיוצאים ישר מהמקרר לוקחים יותר זמן.</li>
        <li>עובי החתיכה: חזה עוף עבה ושניצל דק אינם זהים, גם כשהמשקל דומה.</li>
        <li>סוג האריזה: מה שכתוב על אריזת הפסטה או האורז גובר על הטבלה.</li>
      </ul>

      <h2>כמה זמן לבשל תירס</h2>
      <p>
        קלח תירס מתבשל 8 עד 10 דקות במים רותחים. מכניסים אותו כשהמים כבר רותחים ובודקים בקצה סכין או בטעימה. מי שמבשל
        הרבה קלחים יכול להפעיל טיימר אחד ולבדוק בכל פעם קלח אחד, במקום להוציא את כולם.
      </p>

      <h2>כמה זמן לבשל ביצה קשה, רכה וחצי רכה</h2>
      <p>
        הזמן תלוי בעשייה שאתם רוצים, ולא רק בביצה. הטבלה מציגה את הזמנים מרגע שהמים חוזרים לרתיחה, עם ביצה שיוצאת
        מהמקרר.
      </p>
      <ItemsTable ids={['egg-soft', 'egg-medium', 'egg-hard', 'egg-poached', 'egg-fried', 'egg-scrambled']} caption="זמני בישול של ביצים" />
      <p>
        ביצה קשה שמתקררת מיד במים קרים נקלפת בקלות רבה יותר. מנות ביצים, כמו ביצה קשה ומקושקשת, צריכות להגיע ל-
        {safeTemps.egg.celsius} מעלות לפי USDA. ביצה רכה עם חלמון נוזלי אינה מגיעה לטמפרטורה הזאת, ולכן אכילתה היא בחירה של מי
        שאוכל אותה. עוד על שמירה של ביצים ושאריות אפשר לקרוא בטבלת{' '}
        <Link href="/tools/fridge-storage-times">זמני שמירה במקרר</Link>.
      </p>

      <h2>כמה זמן לבשל אורז, לפי סוג</h2>
      <p>
        סוג האורז קובע גם את הזמן וגם את כמות המים. ביחס שבטבלה האורז מבושל מכוסה, ובסוף הוא עומד בסיר כמה דקות.
      </p>
      <ItemsTable ids={['rice-white', 'rice-basmati', 'rice-jasmine', 'rice-brown', 'quinoa', 'ptitim']} caption="זמני בישול של אורז ודגנים" />
      <p>
        כדי למדוד כמות מים, השתמשו באותה כוסית לאורז ולמים. אם אתם מחלקים מתכון לחצי או מכפילים אותו, מחשבון{' '}
        <Link href="/tools/fractions-calculator">שברים</Link> עוזר לחשב כוסות וחצאי כוסות, ו<Link href="/tools/baking-converter">ממיר האפייה</Link>{' '}
        מתרגם כוסות לגרמים.
      </p>

      <h2>כמה זמן לבשל עדשים</h2>
      <p>עדשים לא צריכות השריה, אבל הזמן משתנה מאוד בין הסוגים.</p>
      <ItemsTable ids={['lentils-orange', 'lentils-black', 'lentils-green', 'split-peas']} caption="זמני בישול של עדשים ואפונה מפוצלת" />

      <h2>כמה זמן לבשל ירקות</h2>
      <p>
        ירקות ירוקים מתבשלים דקות ספורות, וירקות שורש לוקחים הרבה יותר. ירק שמתבשל יותר מדי נעשה רך מדי, ולכן בודקים
        אותו בסכין כבר בתחילת הטווח. בשעועית ירוקה, בברוקולי ובתרד מקררים או מוציאים מיד כדי לעצור את הבישול.
      </p>
      <ItemsTable ids={['potato-cubes', 'carrot', 'cauliflower', 'broccoli', 'green-beans', 'spinach']} caption="זמני בישול של ירקות נפוצים" />

      <h2>כמה זמן לבשל עוף, בשר ודג</h2>
      <p>
        בבשר ובעוף הזמן הוא רק כיוון. הטבלה מציגה כמה מהמנות הנפוצות, ולצידן הטמפרטורה הפנימית שצריך לוודא במדחום.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>זמנים וטמפרטורה פנימית מינימלית לפי USDA</caption>
          <thead>
            <tr>
              <th scope="col">מנה</th>
              <th scope="col">שיטה</th>
              <th scope="col">זמן</th>
              <th scope="col">טמפרטורה פנימית</th>
            </tr>
          </thead>
          <tbody>
            {pick(['chicken-breast-oven', 'chicken-thighs', 'chicken-drumsticks', 'hamburger', 'steak', 'salmon']).map((entry) => (
              <tr key={entry.id}>
                <th scope="row">{entry.name}</th>
                <td>{entry.method}</td>
                <td>{formatMinutes(entry.min, entry.max)}</td>
                <td>{entry.safe ? `${safeTemps[entry.safe].celsius} מעלות` : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>דוגמה: ארוחת ערב שמסתיימת בבת אחת</h2>
      <p>
        אתם מכינים ירכיים בלי עצם, אורז לבן וברוקולי. לפי הטבלה, הירכיים לוקחות עד 30 דקות, האורז עד 18 דקות ועוד
        חמש דקות מנוחה, והברוקולי עד 5 דקות. אם רוצים שהכול יהיה מוכן באותו רגע, מחשבים מהסוף אחורה:
      </p>
      <ul>
        <li>בדקה 0 מכניסים את הירכיים לתנור.</li>
        <li>בדקה 7 מתחילים לבשל את האורז, כי 18 דקות בישול ועוד 5 דקות מנוחה הן 23 דקות.</li>
        <li>בדקה 25 מכניסים את הברוקולי, כי הוא צריך עד 5 דקות.</li>
        <li>בדקה 30 מודדים את הירכיים במדחום, ומוציאים רק אם הגיעו ל-{safeTemps.poultry.celsius} מעלות.</li>
      </ul>
      <p>
        מפעילים שלושה טיימרים בטבלה, אחד לכל מנה, ולא מסתמכים על זיכרון.
      </p>

      <h2>מקורות</h2>
      <ul className={styles.sources}>
        {SAFE_SOURCES.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noopener" target="_blank" lang="en" dir="ltr">
              {source.label}
            </a>
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        הטמפרטורות נבדקו מול המקורות ב-<time dateTime={COOKING_REVIEWED}>{COOKING_REVIEWED_LABEL}</time>. זמני הבישול
        הם הערכה כללית ואינם ממקור רשמי.
      </p>
    </ToolLayout>
  )
}
