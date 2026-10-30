import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import ImageMlTool from '../../components/tools/ImageMlTool'

const PATH = '/tools/background-remover'
const TITLE = 'הסרת רקע מתמונה'
const META_TITLE = 'הסרת רקע מתמונה בחינם: PNG שקוף בלי העלאה לשרת'
const DESCRIPTION =
  'הסרת רקע מתמונה בחינם ואונליין: בוחרים תמונה ומקבלים PNG שקוף. הבינה המלאכותית רצה בדפדפן, בלי הרשמה ובלי להעלות את התמונה.'

const faq: ToolFaqEntry[] = [
  {
    id: 'background-remover-0',
    question: 'איך מסירים רקע מתמונה?',
    answer: 'בוחרים תמונה, והמודל מסמן אילו פיקסלים שייכים לנושא המרכזי. כל השאר הופך לשקוף, ומורידים קובץ PNG.',
  },
  {
    id: 'background-remover-1',
    question: 'באילו תמונות זה עובד הכי טוב?',
    answer: 'בתמונה של מוצר או אדם אחד, עם הפרדה ברורה מהרקע. שיער דק, חפצים שקופים וכמה נושאים באותה תמונה יוצאים פחות מדויק.',
  },
  {
    id: 'background-remover-2',
    question: 'למה הקובץ יוצא PNG?',
    answer: 'רק פורמט עם שקיפות שומר את הרקע החסר. JPG היה ממלא אותו בצבע.',
  },
  {
    id: 'background-remover-3',
    question: 'האם זה מתאים לתמונות מוצר?',
    answer: 'כן, לרוב תמונות המוצר. לתמונות קטלוג בולטות כדאי לבדוק את הקצוות לפני פרסום.',
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
      lede="המודל מזהה את הנושא המרכזי בתמונה, מסיר את הרקע ושומר PNG שקוף. המודל שוקל כ-5 מגה-בייט ורץ במכשיר שלכם, בלי הרשמה."
      tool={<ImageMlTool mode="background" />}
      faq={faq}
      cta={{
        text: 'רוצים בינה מלאכותית שרצה בתוך המערכת שלכם? אנחנו בונים פתרונות כאלה.',
        label: 'פתרונות AI לעסקים',
        href: '/services/development',
      }}
    >
      <h2>על מה זה מבוסס</h2>
      <p>
        הכלי מריץ את המודל הפתוח{' '}
        <a href="https://github.com/xuebinqin/U-2-Net" rel="noopener" target="_blank">
          U²-Net
        </a>{' '}
        (רישיון Apache-2.0) באמצעות ONNX Runtime Web. פרטי הרישיונות נמצאים{' '}
        <a href="/models/LICENSES.txt">בקובץ הרישיונות</a>.
      </p>
    </ToolLayout>
  )
}
