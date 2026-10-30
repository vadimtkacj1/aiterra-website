import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import ImageMlTool from '../../components/tools/ImageMlTool'

const PATH = '/tools/image-upscaler'
const TITLE = 'שיפור איכות תמונה'
const META_TITLE = 'שיפור איכות תמונה ב-AI בחינם: הגדלה פי 4 בלי העלאה לשרת'
const DESCRIPTION =
  'שיפור איכות תמונה בחינם: מגדילים תמונה פי 4 עם בינה מלאכותית שרצה בדפדפן שלכם, בלי הרשמה ובלי להעלות את התמונה לשרת.'

const faq: ToolFaqEntry[] = [
  {
    id: 'image-upscaler-0',
    question: 'איך משפרים איכות של תמונה?',
    answer: 'בוחרים תמונה, והמודל מחשב אותה מחדש בגודל פי 4. הוא משלים פרטים לפי מה שלמד מתמונות אחרות, ולכן התוצאה חדה יותר מהגדלה רגילה.',
  },
  {
    id: 'image-upscaler-1',
    question: 'האם התמונה עולה לשרת?',
    answer: 'לא. המודל יורד פעם אחת לדפדפן, והעיבוד נעשה במכשיר שלכם. התמונה עצמה לא נשלחת אלינו.',
  },
  {
    id: 'image-upscaler-2',
    question: 'למה זה לוקח זמן?',
    answer: 'החישוב נעשה על המעבד או על המעבד הגרפי של המכשיר. במחשב עם WebGPU זה מהיר יותר, ובטלפון ישן זה יכול לקחת כמה דקות.',
  },
  {
    id: 'image-upscaler-3',
    question: 'האם המודל מחזיר פרטים שבאמת היו בתמונה?',
    answer: 'לא תמיד. הוא משער פרטים, ולכן טקסט קטן, לוחיות רישוי ופנים עלולים לצאת שונים מהמקור. לא משתמשים בתוצאה כהוכחה.',
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
      lede="תמונה של 500 על 500 פיקסלים יוצאת ב-2,000 על 2,000 פיקסלים: המודל מגדיל פי 4 ומחדד פרטים. הכול רץ במכשיר שלכם, בלי הרשמה."
      tool={<ImageMlTool mode="upscale" />}
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
        <a href="https://github.com/xinntao/Real-ESRGAN" rel="noopener" target="_blank">
          Real-ESRGAN
        </a>{' '}
        (רישיון BSD-3-Clause) באמצעות ONNX Runtime Web. פרטי הרישיונות נמצאים{' '}
        <a href="/models/LICENSES.txt">בקובץ הרישיונות</a>.
      </p>
    </ToolLayout>
  )
}
