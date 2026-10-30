import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import { HeartRateCalculator } from '../../components/tools/BodyCalculators'

const PATH = '/tools/heart-rate-zones-calculator'
const TITLE = 'מחשבון דופק מטרה'
const META_TITLE = 'מחשבון דופק מטרה: דופק מרבי ואזורי דופק לפי גיל'
const DESCRIPTION =
  'מחשבון דופק מטרה: מכניסים גיל ומקבלים דופק מרבי משוער וחמישה אזורי דופק לאימון, כולל אזור שריפת שומן.'

const faq: ToolFaqEntry[] = [
  {
    id: 'heart-rate-zones-calculator-0',
    question: 'איך מחשבים דופק מרבי?',
    answer: 'נוסחת Tanaka היא 208 פחות 0.7 כפול הגיל. בגיל 40 מתקבל 180 פעימות בדקה. הנוסחה הפשוטה 220 פחות הגיל נותנת שם את אותה תוצאה, אבל הפער ביניהן גדל בגיל מבוגר.',
  },
  {
    id: 'heart-rate-zones-calculator-1',
    question: 'מה דופק שריפת שומן?',
    answer: 'מקובל לכנות כך את הטווח של 60% עד 70% מהדופק המרבי. בטווח הזה חלק גדול יותר מהאנרגיה מגיע משומן, אבל ירידה במשקל תלויה בסך הקלוריות.',
  },
  {
    id: 'heart-rate-zones-calculator-2',
    question: 'מה דופק מטרה בריצה?',
    answer: 'לריצה קלה מתאים בדרך כלל 70% עד 80% מהדופק המרבי. אם אפשר לדבר במשפטים קצרים, העומס בדרך כלל מתאים.',
  },
  {
    id: 'heart-rate-zones-calculator-3',
    question: 'למה הדופק שלי שונה מהמחשבון?',
    answer: 'הנוסחה היא ממוצע אוכלוסייה. הפיזור בין אנשים גדול, ותרופות, חום ועייפות משנים את הדופק.',
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
      lede="בגיל 40 הדופק המרבי המשוער הוא 180 פעימות בדקה, ואזור שריפת השומן הוא 108 עד 126 פעימות. החישוב לפי נוסחת Tanaka: 208 פחות 0.7 כפול הגיל."
      tool={<HeartRateCalculator />}
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
        <a href="https://pubmed.ncbi.nlm.nih.gov/11153730/" rel="noopener" target="_blank">
          Tanaka ועמיתים (2001)
        </a>
        . התוצאה היא הערכה כללית ואינה מחליפה ייעוץ רפואי או תזונתי.
      </p>
    </ToolLayout>
  )
}
