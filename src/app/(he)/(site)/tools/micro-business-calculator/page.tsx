import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import { MicroBusinessCalculator } from '../../components/tools/BusinessCalculators'

const PATH = '/tools/micro-business-calculator'
const TITLE = 'מחשבון עוסק זעיר 2026'
const META_TITLE = 'מחשבון עוסק זעיר 2026: כמה תחסכו מול דיווח רגיל'
const DESCRIPTION =
  'מחשבון עוסק זעיר 2026: מכניסים מחזור והוצאות ורואים מה משתלם יותר, ניכוי 30% במסלול עסק זעיר או דיווח רגיל.'

const faq: ToolFaqEntry[] = [
  {
    id: 'micro-business-calculator-0',
    question: 'מי יכול להיות בעל עסק זעיר?',
    answer: 'לפי רשות המסים, עוסק פטור או מורשה שמחזור העסקאות השנתי שלו עד התקרה לעוסק פטור, כ-122,833 ₪ בשנת 2026.',
  },
  {
    id: 'micro-business-calculator-1',
    question: 'מה ההטבה במסלול?',
    answer: 'ניכוי נורמטיבי של 30% מהמחזור בלי לפרט הוצאות, דיווח מקוצר בסוף השנה, ולמעט חריגים פטור מדוח שנתי ומתשלום מקדמות.',
  },
  {
    id: 'micro-business-calculator-2',
    question: 'מתי המסלול פחות משתלם?',
    answer: 'כשההוצאות האמיתיות גבוהות מ-30% מהמחזור. אז דיווח רגיל משאיר בדרך כלל יותר כסף.',
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
      lede="בעל עסק זעיר מנכה 30% מהמחזור בלי לפרט הוצאות. המחשבון משווה את המסלול הזה לדיווח על ההוצאות בפועל."
      tool={<MicroBusinessCalculator />}
      faq={faq}
      cta={{
        text: 'צריכים מחשבון או מערכת כזו לעסק שלכם? אנחנו בונים אותם.',
        label: 'פיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>מקור</h2>
      <p>
        <a href="https://www.gov.il/he/departments/topics/income-tax-small-business-owner-24" rel="noopener" target="_blank">
          רשות המסים: בעל עסק זעיר
        </a>
        . המידע כללי ואינו מחליף ייעוץ מקצועי.
      </p>
    </ToolLayout>
  )
}
