import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import { ProteinCalculator } from '../../components/tools/BodyCalculators'

const PATH = '/tools/protein-calculator'
const TITLE = 'מחשבון חלבון יומי'
const META_TITLE = 'מחשבון חלבון יומי: כמה חלבון צריך ביום לפי משקל'
const DESCRIPTION =
  'מחשבון חלבון יומי: מכניסים משקל ומטרה ומקבלים כמה גרם חלבון צריך ביום לבריאות, לספורט או לבניית שריר.'

const faq: ToolFaqEntry[] = [
  {
    id: 'protein-calculator-0',
    question: 'כמה חלבון צריך ביום?',
    answer: 'ההמלצה הבסיסית למבוגרים היא 0.8 גרם לכל ק״ג משקל גוף. אדם במשקל 70 ק״ג צריך לפי זה כ-56 גרם ביום. מי שמתאמן באופן סדיר צריך בדרך כלל יותר.',
  },
  {
    id: 'protein-calculator-1',
    question: 'כמה חלבון צריך לבניית שריר?',
    answer: 'לפי עמדת האגודה הבינלאומית לתזונת ספורט, 1.4 עד 2 גרם לק״ג מספיקים לרוב המתאמנים. המחשבון מציג 1.6 עד 2 גרם לק״ג.',
  },
  {
    id: 'protein-calculator-2',
    question: 'איך לחלק את החלבון במהלך היום?',
    answer: 'נוח לחלק אותו ל-3 או 4 ארוחות, במקום לאכול את רוב הכמות בבת אחת.',
  },
  {
    id: 'protein-calculator-3',
    question: 'האם עודף חלבון מזיק?',
    answer: 'לאנשים בריאים כמויות גבוהות נחשבות בדרך כלל בטוחות, אבל במחלת כליות צריך לקבוע את הכמות עם רופא.',
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
      lede="אדם במשקל 70 ק״ג צריך כ-56 גרם חלבון ביום לבריאות כללית, ו-112 עד 140 גרם לבניית שריר. הכמות נגזרת מהמשקל ומהמטרה."
      tool={<ProteinCalculator />}
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
        <a href="https://pubmed.ncbi.nlm.nih.gov/28642676/" rel="noopener" target="_blank">
          עמדת האגודה הבינלאומית לתזונת ספורט
        </a>
        . התוצאה היא הערכה כללית ואינה מחליפה ייעוץ רפואי או תזונתי.
      </p>
    </ToolLayout>
  )
}
