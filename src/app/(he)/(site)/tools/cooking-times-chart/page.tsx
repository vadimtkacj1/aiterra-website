import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import CookingTimesChart from '../../components/tools/CookingTimesChart'
import { COOKING_REVIEWED, COOKING_REVIEWED_LABEL, SAFE_SOURCES, cookingItems, safeTemps } from '@/lib/cooking-times'
import styles from '../word-counter/page.module.css'

const PATH = '/tools/cooking-times-chart'
const TITLE = 'כמה זמן לבשל? טבלת זמני בישול וטיימר'
const META_TITLE = 'כמה זמן לבשל? טבלת זמני בישול וטיימר'
const DESCRIPTION = `כמה זמן לבשל אורז, ביצה, פסטה, עדשים, ירקות, עוף ובשר? ${cookingItems.length} מאכלים עם שיטה וזמן, טמפרטורות בטוחות לפי USDA וטיימר מובנה לכמה סירים.`

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
