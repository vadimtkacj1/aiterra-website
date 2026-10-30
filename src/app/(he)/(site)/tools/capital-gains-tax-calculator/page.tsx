import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import { CapitalGainsCalculator } from '../../components/tools/BusinessCalculators'

const PATH = '/tools/capital-gains-tax-calculator'
const TITLE = 'מחשבון מס רווח הון על מניות'
const META_TITLE = 'מחשבון מס רווח הון על מניות: 25% על הרווח הריאלי'
const DESCRIPTION =
  'מחשבון מס רווח הון: מכניסים קנייה, מכירה ועליית מדד ומקבלים רווח ריאלי ומס משוער על מכירת מניות.'

const faq: ToolFaqEntry[] = [
  {
    id: 'capital-gains-tax-calculator-0',
    question: 'כמה מס משלמים על רווח ממניות?',
    answer: 'בדרך כלל 25% מהרווח הריאלי, ו-30% לבעל מניות מהותי שמחזיק 10% ומעלה.',
  },
  {
    id: 'capital-gains-tax-calculator-1',
    question: 'מה זה רווח ריאלי?',
    answer: 'הרווח שנשאר אחרי הצמדת סכום הקנייה למדד. עליית מדד אינה נחשבת רווח ריאלי.',
  },
  {
    id: 'capital-gains-tax-calculator-2',
    question: 'האם יש מס נוסף?',
    answer: 'בעלי הכנסות גבוהות עשויים לשלם גם מס יסף, והוא לא כלול במחשבון.',
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
      lede="מס רווח הון מחושב על הרווח הריאלי, אחרי נטרול עליית המדד: 25%, ו-30% לבעל מניות מהותי."
      tool={<CapitalGainsCalculator />}
      faq={faq}
      cta={{
        text: 'צריכים מחשבון או מערכת כזו לעסק שלכם? אנחנו בונים אותם.',
        label: 'פיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>מקור</h2>
      <p>
        <a href="https://www.gov.il/he/departments/israel_tax_authority" rel="noopener" target="_blank">
          רשות המסים
        </a>
        . המידע כללי ואינו מחליף ייעוץ מקצועי.
      </p>
    </ToolLayout>
  )
}
