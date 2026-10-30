import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import { WaterCalculator } from '../../components/tools/BodyCalculators'

const PATH = '/tools/water-intake-calculator'
const TITLE = 'כמה מים לשתות ביום'
const META_TITLE = 'כמה מים לשתות ביום: מחשבון לפי משקל ופעילות'
const DESCRIPTION =
  'כמה מים צריך לשתות ביום? מכניסים מין, משקל ודקות אימון ומקבלים הערכה בליטרים ובכוסות.'

const faq: ToolFaqEntry[] = [
  {
    id: 'water-intake-calculator-0',
    question: 'כמה מים צריך לשתות ביום?',
    answer: 'האקדמיות הלאומיות בארה״ב קבעו צריכה מספקת של כ-2.7 ליטר נוזלים ביום לנשים ו-3.7 ליטר לגברים, כולל נוזלים מהמזון. רוב הכמות מגיעה משתייה: כ-2.2 ליטר לנשים ו-3 ליטר לגברים.',
  },
  {
    id: 'water-intake-calculator-1',
    question: 'איך מחשבים שתייה לפי משקל?',
    answer: 'כלל אצבע נפוץ הוא 30 מ״ל לכל ק״ג משקל גוף. זה לא מדד רפואי מדויק, ולכן המחשבון לא יורד מתחת ל-80% מנקודת הייחוס לפי מין.',
  },
  {
    id: 'water-intake-calculator-2',
    question: 'האם קפה ותה נחשבים?',
    answer: 'כן, גם הם נוזלים. לרוב האנשים צריכה מתונה של קפה לא גורמת להתייבשות.',
  },
  {
    id: 'water-intake-calculator-3',
    question: 'האם אפשר לשתות יותר מדי מים?',
    answer: 'כן, שתייה מופרזת בזמן קצר עלולה להוריד את רמת הנתרן בדם. עדיף לפזר את השתייה על פני היום.',
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
      lede="המחשבון מעריך כמות שתייה לפי כלל מקובל של 30 מ״ל לק״ג, ומוסיף כ-12 מ״ל לכל דקת אימון."
      tool={<WaterCalculator />}
      faq={faq}
      cta={{
        text: 'אנחנו בונים אתרים ומחשבונים לקליניקות, לדיאטניות ולמכוני כושר.',
        label: 'פיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>איך זה מחושב</h2>
      <p>
        מקור החישוב:{' '}
        <a href="https://nap.nationalacademies.org/catalog/10925" rel="noopener" target="_blank">
          האקדמיות הלאומיות בארה״ב: צריכת מים
        </a>
        . התוצאה היא הערכה כללית ואינה מחליפה ייעוץ רפואי או תזונתי.
      </p>
    </ToolLayout>
  )
}
