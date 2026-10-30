import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import { CalorieCalculator } from '../../components/tools/BodyCalculators'

const PATH = '/tools/calorie-calculator'
const TITLE = 'מחשבון קלוריות יומי'
const META_TITLE = 'מחשבון קלוריות יומי: כמה קלוריות צריך ביום לירידה במשקל'
const DESCRIPTION =
  'מחשבון קלוריות יומי: מכניסים גיל, מין, גובה, משקל ופעילות ומקבלים BMR וכמה קלוריות צריך ביום לשמירה, לירידה או לעלייה במשקל.'

const faq: ToolFaqEntry[] = [
  {
    id: 'calorie-calculator-0',
    question: 'איך מחשבים קלוריות יומיות?',
    answer: 'קודם מחשבים BMR, קצב חילוף החומרים במנוחה. לפי נוסחת Mifflin-St Jeor: 10 כפול משקל בק״ג, ועוד 6.25 כפול גובה בס״מ, פחות 5 כפול גיל, ועוד 5 לגבר או פחות 161 לאישה. את התוצאה מכפילים במקדם פעילות, בין 1.2 ל-1.9.',
  },
  {
    id: 'calorie-calculator-1',
    question: 'כמה קלוריות צריך כדי לרדת במשקל?',
    answer: 'הכלל המקובל הוא גירעון של כ-500 קלוריות ביום, שמתאים לירידה של כחצי קילו בשבוע. בפועל הקצב שונה מאדם לאדם ומשתנה גם עם הזמן. המחשבון לא יורד מ-1,200 קלוריות לאישה ומ-1,500 לגבר.',
  },
  {
    id: 'calorie-calculator-2',
    question: 'מה ההבדל בין BMR לצריכה יומית?',
    answer: 'BMR הוא האנרגיה שהגוף צורך במנוחה מלאה. הצריכה היומית כוללת גם תנועה, אימונים ועיכול, ולכן היא גבוהה ממנו.',
  },
  {
    id: 'calorie-calculator-3',
    question: 'האם התוצאה מדויקת?',
    answer: 'זו הערכה סטטיסטית. שקילה שבועית למשך כמה שבועות תראה אם היעד מתאים לכם, ואז אפשר לכוון אותו.',
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
      lede="גבר בן 30, בגובה 180 ס״מ ובמשקל 80 ק״ג, עם פעילות בינונית, צורך כ-2,760 קלוריות ביום לפי נוסחת Mifflin-St Jeor. כאן מכניסים את הנתונים שלכם ומקבלים יעד לשמירה, לירידה ולעלייה במשקל."
      tool={<CalorieCalculator />}
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
        <a href="https://pubmed.ncbi.nlm.nih.gov/2305711/" rel="noopener" target="_blank">
          נוסחת Mifflin-St Jeor (1990)
        </a>
        . התוצאה היא הערכה כללית ואינה מחליפה ייעוץ רפואי או תזונתי.
      </p>
    </ToolLayout>
  )
}
