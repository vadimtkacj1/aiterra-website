import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import { EmployerCostCalculator } from '../../components/tools/BusinessCalculators'

const PATH = '/tools/employer-cost-calculator'
const TITLE = 'מחשבון עלות מעסיק 2026'
const META_TITLE = 'מחשבון עלות מעסיק 2026: כמה עולה עובד לפי ברוטו'
const DESCRIPTION =
  'מחשבון עלות מעסיק 2026: מכניסים שכר ברוטו ומקבלים עלות חודשית ושנתית עם ביטוח לאומי, פנסיה, פיצויים וקרן השתלמות.'

const faq: ToolFaqEntry[] = [
  {
    id: 'employer-cost-calculator-0',
    question: 'כמה עולה עובד מעבר לברוטו?',
    answer: 'התוספת תלויה בגובה השכר ובהפרשות. המחשבון מציג אותה בשקלים לפי הברוטו שהזנתם, בלי הטבות נוספות.',
  },
  {
    id: 'employer-cost-calculator-1',
    question: 'מה לא כלול בחישוב?',
    answer: 'נסיעות, דמי הבראה, ימי חופשה ומחלה, ביגוד, ארוחות ורכב. אותם צריך להוסיף לתקציב בנפרד.',
  },
  {
    id: 'employer-cost-calculator-2',
    question: 'האם קרן השתלמות חובה?',
    answer: 'לא לפי החוק הכללי, אלא לפי הסכם או צו הרחבה שחל על העובד.',
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
      lede="עובד בשכר ברוטו של 15,000 ₪ עולה למעסיק כ-17,780 ₪ בחודש, לפני נסיעות, הבראה והטבות. התוספת מורכבת מביטוח לאומי, פנסיה ופיצויים."
      tool={<EmployerCostCalculator />}
      faq={faq}
      cta={{
        text: 'צריכים מחשבון או מערכת כזו לעסק שלכם? אנחנו בונים אותם.',
        label: 'פיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>מקור</h2>
      <p>
        <a href="https://www.btl.gov.il/Insurance/Rates/Pages/%D7%9C%D7%A2%D7%95%D7%91%D7%93%D7%99%D7%9D%20%D7%A9%D7%9B%D7%99%D7%A8%D7%99%D7%9D.aspx" rel="noopener" target="_blank">
          הביטוח הלאומי: שיעורי דמי ביטוח
        </a>
        . המידע כללי ואינו מחליף ייעוץ מקצועי.
      </p>
    </ToolLayout>
  )
}
