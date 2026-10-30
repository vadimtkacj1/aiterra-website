import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import ImageMlTool from '../../components/tools/ImageMlTool'

const PATH = '/tools/face-blur'
const TITLE = 'טשטוש פנים בתמונה'
const META_TITLE = 'טשטוש פנים בתמונה אונליין בחינם, בלי העלאה לשרת'
const DESCRIPTION =
  'טשטוש פנים בתמונה בחינם: הכלי מזהה פנים ומטשטש אותן בדפדפן שלכם, ואפשר להוסיף או להסיר טשטוש בלחיצה. התמונה לא נשלחת לשרת.'

const faq: ToolFaqEntry[] = [
  {
    id: 'face-blur-0',
    question: 'איך מטשטשים פנים בתמונה?',
    answer: 'בוחרים תמונה, והכלי מסמן את הפנים שמצא. לוחצים על פנים שפוספסו כדי להוסיף טשטוש, או על טשטוש כדי להסיר אותו.',
  },
  {
    id: 'face-blur-1',
    question: 'האם הכלי מוצא את כל הפנים?',
    answer: 'לא תמיד. פנים קטנות, מטושטשות או בזווית עלולות להתפספס, ולכן צריך לבדוק את התמונה לפני שמשתפים אותה.',
  },
  {
    id: 'face-blur-2',
    question: 'למה להשתמש בפיקסלים ולא בטשטוש עדין?',
    answer: 'טשטוש עדין אפשר לעיתים לשחזר חלקית. כאן הפנים מוחלפות ב-9 על 9 ריבועים גסים, כך שנשארים הרבה פחות פרטים.',
  },
  {
    id: 'face-blur-3',
    question: 'מתי צריך לטשטש פנים?',
    answer: 'למשל לפני פרסום תמונה של אנשים שלא נתנו הסכמה, או תמונה של ילדים. טשטוש לא מחליף בדיקה משפטית של המקרה.',
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
      lede="הכלי מזהה פנים בתמונה ומכסה אותן בפיקסלים גסים, ובלחיצה אפשר להוסיף או להסיר אזור. מודל הזיהוי שוקל כ-230 קילו-בייט ורץ במכשיר שלכם."
      tool={<ImageMlTool mode="faces" />}
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
        <a href="https://github.com/opencv/opencv_zoo/tree/main/models/face_detection_yunet" rel="noopener" target="_blank">
          YuNet
        </a>{' '}
        (רישיון MIT) באמצעות ONNX Runtime Web. פרטי הרישיונות נמצאים{' '}
        <a href="/models/LICENSES.txt">בקובץ הרישיונות</a>.
      </p>
    </ToolLayout>
  )
}
