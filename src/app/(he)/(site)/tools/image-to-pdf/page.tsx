import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import ImageToPdf from '../../components/tools/ImageToPdf'

const PATH = '/tools/image-to-pdf'
const TITLE = 'המרת תמונה ל-PDF'
const META_TITLE = 'המרת תמונה ל-PDF בחינם: JPG ו-PNG לקובץ PDF אחד'
const DESCRIPTION =
  'ממירים תמונות JPG, PNG או WebP לקובץ PDF אחד בתוך הדפדפן: כמה תמונות יחד, סידור העמודים, A4 או בגודל התמונה. בחינם, בלי הרשמה ובלי להעלות לשרת.'

const faq: ToolFaqEntry[] = [
  {
    id: 'pdf-faq-privacy',
    question: 'התמונות עולות לשרת?',
    answer:
      'לא. ההמרה נעשית בתוך הדפדפן שלכם, וקובץ ה-PDF נוצר במחשב או בטלפון עצמו. אף תמונה לא נשלחת לשום מקום, ולכן אפשר להמיר גם צילומי תעודות, חשבוניות ומסמכים אישיים.',
  },
  {
    id: 'pdf-faq-many',
    question: 'איך ממירים כמה תמונות ל-PDF אחד?',
    answer:
      'בוחרים את כל התמונות יחד, או מוסיפים אותן בכמה פעמים. כל תמונה הופכת לעמוד, לפי הסדר ברשימה, ואפשר להזיז תמונה למעלה או למטה לפני שיוצרים את הקובץ.',
  },
  {
    id: 'pdf-faq-phone',
    question: 'אפשר להמיר תמונה ל-PDF בטלפון?',
    answer:
      'כן. בטלפון לוחצים על ״בחירת תמונות״ ובוחרים מהגלריה או מצלמים. באייפון, תמונות שנשמרו בפורמט HEIC נפתחות בספארי. בדפדפן אחר, אם התמונה לא נקראת, שומרים אותה קודם כ-JPEG.',
  },
  {
    id: 'pdf-faq-size',
    question: 'כמה שוקל קובץ ה-PDF?',
    answer:
      'בערך כמו סך התמונות אחרי דחיסה כ-JPEG. תמונה גדולה מ-3,000 פיקסלים בצד הארוך מוקטנת ל-3,000, שמספיק להדפסה בגודל A4. כדי לקבל קובץ קטן יותר לשליחה במייל, אפשר להקטין קודם את התמונות.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function ImageToPdfPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="בוחרים תמונה אחת או כמה, מסדרים את העמודים ומקבלים קובץ PDF אחד. ההמרה נעשית בדפדפן, בלי הרשמה ובלי להעלות את התמונות לשרת."
      chips={['כמה תמונות לקובץ אחד', 'A4 או בגודל התמונה', 'בלי העלאה לשרת', 'בחינם']}
      tool={<ImageToPdf />}
      faq={faq}
      cta={{
        text: 'צריכים טפסים שמפיקים PDF לבד, כמו הצעות מחיר וחוזים? אנחנו בונים את זה לעסקים.',
        label: 'אוטומציה לעסקים',
        href: '/services/automation',
      }}
    >
      <h2>איך ממירים תמונה ל-PDF</h2>
      <ol>
        <li>לוחצים על ״בחירת תמונות״ או גוררים לכאן קובצי JPG, PNG או WebP.</li>
        <li>מסדרים את העמודים: כל תמונה היא עמוד, והסדר ברשימה הוא הסדר בקובץ.</li>
        <li>בוחרים גודל עמוד: A4 עם שוליים להדפסה, A4 בלי שוליים, או עמוד בגודל התמונה.</li>
        <li>לוחצים ״יצירת PDF״ ואחר כך ״הורדת הקובץ״.</li>
      </ol>
      <p>
        בדף A4 תמונה לרוחב מקבלת עמוד לרוחב, ותמונה לגובה עמוד לגובה. התמונה מוקטנת כדי להיכנס לדף ולא נחתכת.
      </p>

      <h2>מתי זה שימושי</h2>
      <ul>
        <li>לשלוח צילומי מסמכים, תעודות או קבלות כקובץ אחד, כמו שמבקשים בטפסים מקוונים.</li>
        <li>לאחד כמה צילומי מסך או דפים סרוקים בטלפון לקובץ אחד להדפסה.</li>
        <li>להגיש עבודה או דוח שצולמו בטלפון.</li>
      </ul>
      <p>
        כדי להקטין את התמונות לפני ההמרה, יש לנו <Link href="/tools/image-compressor">הקטנת תמונות והמרה ל-JPG ו-WebP</Link>.
        לחילוץ טקסט מתמונה יש <Link href="/tools/image-to-text">המרת תמונה לטקסט</Link>.
      </p>
    </ToolLayout>
  )
}
