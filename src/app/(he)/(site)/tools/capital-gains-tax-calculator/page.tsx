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
      lede="מי שקנה מניות ב-100,000 ₪, מכר ב-150,000 ₪ ובתקופה הזו המדד עלה ב-10%, הרוויח 40,000 ₪ ריאלית וישלם כ-10,000 ₪ מס לפי שיעור של 25%."
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
        <a href="https://www.hilan.co.il/%D7%9E%D7%A8%D7%9B%D7%96-%D7%99%D7%93%D7%A2/%D7%97%D7%A7%D7%99%D7%A7%D7%94/%D7%93%D7%99%D7%A0%D7%99-%D7%9E%D7%99%D7%A1%D7%99%D7%9D/%D7%A4%D7%A7%D7%95%D7%93%D7%AA-%D7%9E%D7%A1-%D7%94%D7%9B%D7%A0%D7%A1%D7%94-%D7%A0%D7%95%D7%A1%D7%97-%D7%97%D7%93%D7%A9-%D7%AA%D7%A9%D7%9B%D7%90-1961/%D7%97%D7%9C%D7%A7-%D7%94-%D7%A8%D7%95%D7%95%D7%97%D7%99-%D7%94%D7%95%D7%9F/" rel="noopener" target="_blank">
          פקודת מס הכנסה, חלק ה׳: רווחי הון
        </a>
        . המידע כללי ואינו מחליף ייעוץ מקצועי.
      </p>
    </ToolLayout>
  )
}
