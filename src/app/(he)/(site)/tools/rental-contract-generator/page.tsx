import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import RentalContractGenerator from '../../components/tools/RentalContractGenerator'

const PATH = '/tools/rental-contract-generator'
const TITLE = 'מחולל הסכם שכירות לדירה'
const META_TITLE = 'מחולל חוזה שכירות לדירה: טיוטה לפי חוק השכירות'
const DESCRIPTION =
  'מחולל חוזה שכירות בחינם: ממלאים פרטים ומקבלים טיוטת הסכם שכירות למגורים לפי חוק השכירות והשאילה, עם בדיקת תקרת ערובה.'
const LAW_URL = 'https://www.nevo.co.il/law_html/law00/5149.htm'

const faq: ToolFaqEntry[] = [
  {
    id: 'rental-guarantee',
    question: 'מה הערובה המקסימלית בשכירות?',
    answer: 'ערובות שכרוכות בהוצאה כספית לשוכר מוגבלות בחוק לסכום הנמוך מבין שלושה חודשי שכירות לבין דמי השכירות של שליש מתקופת השכירות.',
  },
  {
    id: 'rental-repairs',
    question: 'תוך כמה זמן המשכיר צריך לתקן ליקוי?',
    answer: 'בזמן סביר ולא יאוחר מ-30 ימים מקבלת הדרישה, ובתיקון דחוף לא יאוחר משלושה ימים, אם הליקוי לא נגרם משימוש בלתי סביר ואינו קל ערך.',
  },
  {
    id: 'rental-notice',
    question: 'כמה זמן מראש מודיעים על ביטול או הארכה?',
    answer: 'בביטול לפי תניה בחוזה המשכיר מודיע 90 ימים מראש והשוכר 60 ימים מראש. גם באופציית הארכה המשכיר מודיע עד 90 ימים והשוכר עד 60 ימים לפני תום התקופה.',
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
      lede="טיוטת הסכם שכירות למגורים, שנכתבה לפי סעיפי החוק ונבנית תוך כדי מילוי הפרטים. הפרטים נשארים בדפדפן שלכם."
      tool={<RentalContractGenerator />}
      faq={faq}
      cta={{
        text: 'צריכים מערכת שמפיקה מסמכים ללקוחות שלכם? אנחנו בונים כאלה.',
        label: 'פיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>לפני שחותמים</h2>
      <p>
        הטיוטה מבוססת על{' '}
        <a href={LAW_URL} rel="noopener" target="_blank">
          חוק השכירות והשאילה
        </a>
        , אך לא נבדקה בידי עורך דין ואינה ייעוץ משפטי. החוק לא חל על כל סוגי השכירות. לפני חתימה כדאי להתאים אותה למקרה שלכם.
      </p>
    </ToolLayout>
  )
}
