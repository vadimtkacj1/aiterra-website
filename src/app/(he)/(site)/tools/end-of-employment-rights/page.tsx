import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import { LeavingWorkWizard } from '../../components/tools/LeavingWorkTools'

const PATH = '/tools/end-of-employment-rights'
const TITLE = 'מה מגיע לי בסיום עבודה'
const META_TITLE = 'מה מגיע לי אם התפטרתי או פוטרתי: בדיקה מהירה'
const DESCRIPTION =
  'האם מגיע לי פיצויים או אבטלה אם התפטרתי? עונים על שלוש שאלות ורואים מה כנראה מגיע לכם בסיום עבודה.'

const faq: ToolFaqEntry[] = [
  {
    id: 'end-of-employment-rights-0',
    question: 'מגיע לי אבטלה אם התפטרתי?',
    answer: 'ייתכן. בהתפטרות בלי סיבה מוצדקת יש בדרך כלל המתנה של 90 יום, ובהתפטרות מוצדקת ייתכן שלא תהיה המתנה.',
  },
  {
    id: 'end-of-employment-rights-1',
    question: 'מגיע לי פיצויים אם התפטרתי?',
    answer: 'בדרך כלל לא, אבל יש מקרים שהחוק מכיר בהם, כמו סיבות בריאות או הרעת תנאים.',
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
      lede="שלוש שאלות על סיום העבודה מראות אילו זכויות כדאי לבדוק: פיצויים, אבטלה, חופשה, הבראה והודעה מוקדמת."
      tool={<LeavingWorkWizard />}
      faq={faq}
      cta={{
        text: 'רוצים לבנות כלי כזה לעסק שלכם? אנחנו מפתחים מערכות לעסקים.',
        label: 'פיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>חשוב לדעת</h2>
      <p>המידע כללי ואינו ייעוץ משפטי. כדאי לבדוק גם את הסכם העבודה ואת צו ההרחבה שחל עליכם.</p>
    </ToolLayout>
  )
}
