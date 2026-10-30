import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import HostingFoodCalculator from '../../components/tools/HostingFoodCalculator'

const PATH = '/tools/hosting-food-calculator'
const TITLE = 'מחשבון כמויות אוכל לאירוח'
const META_TITLE = 'מחשבון כמויות אוכל לאירוח: כמה אוכל לכל אורח ורשימת קניות'
const DESCRIPTION =
  'מחשבון כמויות אוכל לאירוח בבית: מכניסים מבוגרים, ילדים וסוג ארוחה ומקבלים כמה בשר, תוספות, סלטים ושתייה צריך, עם רשימת קניות לוואטסאפ.'

const faq: ToolFaqEntry[] = [
  {
    id: 'hosting-food-meat',
    question: 'כמה בשר צריך לאדם בארוחה?',
    answer: 'באירוח מלא מקובל לחשב כ-300 גרם בשר או עוף לפני בישול לכל מבוגר, כשיש גם תוספות וסלטים. במנגל שבו הבשר הוא העיקר צריך יותר.',
  },
  {
    id: 'hosting-food-kids',
    question: 'איך מחשבים ילדים?',
    answer: 'המחשבון סופר ילד עד גיל 12 כחצי מבוגר. אם הילדים גדולים או רעבים במיוחד, ספרו אותם כמבוגרים.',
  },
  {
    id: 'hosting-food-shabbat',
    question: 'כמה אוכל להכין לארוחת שישי ל-10 אנשים?',
    answer: 'ל-10 מבוגרים באירוח מלא המחשבון מציע כ-3.3 ק״ג בשר או עוף לפני בישול, 2.2 ק״ג תוספת ו-2.2 ק״ג סלטים, כולל מרווח של 10%.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function Page() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="ל-10 מבוגרים באירוח מלא צריך כ-3.3 ק״ג בשר או עוף לפני בישול, 2.2 ק״ג תוספת ו-2.2 ק״ג סלטים. המחשבון מתאים את הכמויות למספר האורחים ולמה שאתם מגישים."
      tool={<HostingFoodCalculator />}
      faq={faq}
      cta={{
        text: 'יש לכם קייטרינג או מסעדה? אנחנו בונים אתרים ומחשבונים שמביאים הזמנות.',
        label: 'בניית אתר לעסק',
        href: '/services/web-development',
      }}
    >
      <h2>איך זה מחושב</h2>
      <p>
        הכמויות הן מנות מקובלות בקייטרינג ובבישול ביתי, כפול מספר הסועדים, עם מרווח של 10%. התוצאה היא נקודת התחלה,
        ואפשר להתאים אותה לאורחים שלכם.
      </p>
    </ToolLayout>
  )
}
