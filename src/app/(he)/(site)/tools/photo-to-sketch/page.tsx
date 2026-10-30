import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import ImageMlTool from '../../components/tools/ImageMlTool'

const PATH = '/tools/photo-to-sketch'
const TITLE = 'הפיכת תמונה לציור'
const META_TITLE = 'הפיכת תמונה לציור ולדף צביעה אונליין בחינם'
const DESCRIPTION =
  'הפיכת תמונה לציור בעיפרון או לדף צביעה להדפסה: בוחרים תמונה ומורידים את התוצאה. בחינם, בלי הרשמה, והתמונה נשארת במכשיר שלכם.'

const faq: ToolFaqEntry[] = [
  {
    id: 'photo-to-sketch-0',
    question: 'איך הופכים תמונה לציור?',
    answer: 'בוחרים תמונה וסגנון. הכלי מדגיש את הקווים ומבהיר את המשטחים, ומתקבל ציור בסגנון עיפרון.',
  },
  {
    id: 'photo-to-sketch-1',
    question: 'איך מכינים דף צביעה מתמונה?',
    answer: 'בוחרים בסגנון דף צביעה. כדאי להשתמש בתמונה חדה עם נושא אחד ורקע פשוט, כדי שהקווים ייצאו נקיים.',
  },
  {
    id: 'photo-to-sketch-2',
    question: 'האם זה בינה מלאכותית?',
    answer: 'לא. זה עיבוד תמונה רגיל, ולכן הוא מהיר ועובד גם בטלפון ישן.',
  },
  {
    id: 'photo-to-sketch-3',
    question: 'אפשר להדפיס את התוצאה?',
    answer: 'כן. מורידים קובץ PNG ומדפיסים אותו כמו כל תמונה.',
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
      lede="הכלי הופך תמונה לציור בעיפרון או לדף צביעה בשחור-לבן תוך שנייה או שתיים. הכול נעשה במכשיר שלכם, בלי הרשמה."
      tool={<ImageMlTool mode="sketch" />}
      faq={faq}
      cta={{
        text: 'רוצים בינה מלאכותית שרצה בתוך המערכת שלכם? אנחנו בונים פתרונות כאלה.',
        label: 'פתרונות AI לעסקים',
        href: '/services/development',
      }}
    >
      <h2>איך זה עובד</h2>
      <p>הכלי הופך את התמונה לגווני אפור, מטשטש עותק הפוך שלה ומשלב בין השניים, כך שנשארים בעיקר הקווים.</p>
    </ToolLayout>
  )
}
