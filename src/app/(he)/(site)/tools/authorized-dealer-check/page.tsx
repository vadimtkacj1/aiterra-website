import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import { DealerNumberCheck } from '../../components/tools/BusinessCalculators'

const PATH = '/tools/authorized-dealer-check'
const TITLE = 'בדיקת עוסק מורשה לפי מספר'
const META_TITLE = 'בדיקת עוסק מורשה לפי מספר: ספרת ביקורת וקישור לרשות המסים'
const DESCRIPTION =
  'בדיקת עוסק מורשה: בודקים אם המספר תקין לפי ספרת הביקורת, ועוברים לאתר רשות המסים לאימות העוסק.'

const faq: ToolFaqEntry[] = [
  {
    id: 'authorized-dealer-check-0',
    question: 'איך בודקים עוסק מורשה?',
    answer: 'מזינים את מספר העוסק בשירות של רשות המסים ומקבלים את פרטי העוסק.',
  },
  {
    id: 'authorized-dealer-check-1',
    question: 'מה ספרת ביקורת מוכיחה?',
    answer: 'רק שהמספר בנוי נכון. היא לא מוכיחה שהעוסק קיים או פעיל.',
  },
  {
    id: 'authorized-dealer-check-2',
    question: 'למה חשוב לבדוק ספק?',
    answer: 'כדי לוודא שהחשבונית שקיבלתם שייכת לעוסק אמיתי לפני תשלום או ניכוי מע״מ.',
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
      lede="הכלי בודק אם המספר בנוי נכון. אימות שם העוסק וסטטוס פעיל נעשה רק באתר רשות המסים."
      tool={<DealerNumberCheck />}
      faq={faq}
      cta={{
        text: 'צריכים מחשבון או מערכת כזו לעסק שלכם? אנחנו בונים אותם.',
        label: 'פיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>מקור</h2>
      <p>
        <a href="https://www.gov.il/he/service/vat-apply-online" rel="noopener" target="_blank">
          רשות המסים: פרטי עוסק
        </a>
        . המידע כללי ואינו מחליף ייעוץ מקצועי.
      </p>
    </ToolLayout>
  )
}
