import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import { FamilyQuiz } from '../../components/tools/FamilyPrintTools'

const PATH = '/tools/family-quiz'
const TITLE = 'חידון משפחתי להדפסה'
const META_TITLE = 'טריוויה משפחתית להדפסה: חידון ידע כללי עם תשובות'
const DESCRIPTION =
  'חידון משפחתי להדפסה עם תשובות: בוחרים נושאים ואורך, ומקבלים טריוויה בידע כללי, ישראל, מדע, בעלי חיים ויהדות, עם דף תשובות נפרד.'

const faq: ToolFaqEntry[] = [
  {
    id: 'family-quiz-0',
    question: 'איך משחקים בחידון משפחתי?',
    answer: 'מתחלקים לקבוצות, אחד קורא שאלה וכל קבוצה עונה. מי שצודקת מקבלת נקודה, והתשובות נמצאות בדף נפרד.',
  },
  {
    id: 'family-quiz-1',
    question: 'אילו נושאים יש בחידון?',
    answer: 'ישראל, העולם, מדע, בעלי חיים, יהדות ותנ״ך וידע כללי. אפשר לבחור נושא אחד או כמה יחד.',
  },
  {
    id: 'family-quiz-2',
    question: 'למי החידון מתאים?',
    answer: 'למשפחות עם ילדים גדולים ומבוגרים. לילדים קטנים כדאי לבחור בעלי חיים וידע כללי.',
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
      lede="בוחרים נושאים ומספר שאלות, ומקבלים חידון של 10 עד 30 שאלות מתוך 72, עם דף תשובות נפרד להדפסה. אפשר גם לשחק מהטלפון."
      tool={<FamilyQuiz />}
      faq={faq}
      cta={{
        text: 'רוצים כלי כזה באתר שלכם? אנחנו בונים כלים אינטראקטיביים לעסקים.',
        label: 'פיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>איך מארגנים ערב חידון</h2>
      <ul>
        <li>מחלקים לקבוצות של 2 עד 4 משתתפים בגילים מעורבים.</li>
        <li>אחד קורא שאלה, וכל קבוצה עונה בסבב.</li>
        <li>דף התשובות נשאר אצל מי שמנהל את המשחק.</li>
      </ul>
    </ToolLayout>
  )
}
