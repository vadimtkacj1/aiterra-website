import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import { ResignationLetterGenerator } from '../../components/tools/LeavingWorkTools'

const PATH = '/tools/resignation-letter-generator'
const TITLE = 'מחולל מכתב התפטרות'
const META_TITLE = 'מחולל מכתב התפטרות: נוסח מוכן עם חישוב הודעה מוקדמת'
const DESCRIPTION =
  'מחולל מכתב התפטרות חינם: ממלאים שם, מעסיק ותאריך, רואים כמה הודעה מוקדמת נדרשת ומעתיקים מכתב מוכן.'

const faq: ToolFaqEntry[] = [
  {
    id: 'resignation-letter-generator-0',
    question: 'מה צריך לכתוב במכתב התפטרות?',
    answer: 'תאריך, שם המעסיק, הודעה על ההתפטרות ויום העבודה האחרון. אין חובה לפרט סיבה.',
  },
  {
    id: 'resignation-letter-generator-1',
    question: 'כמה הודעה מוקדמת צריך לתת?',
    answer: 'לעובד במשכורת חודשית: יום לכל חודש בחצי השנה הראשונה, 2.5 ימים לכל חודש עד סוף השנה, וחודש מלא אחרי שנה.',
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
      lede="ממלאים כמה פרטים ומקבלים מכתב קצר ומכובד, יחד עם אורך ההודעה המוקדמת לעובד במשכורת חודשית."
      tool={<ResignationLetterGenerator />}
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
