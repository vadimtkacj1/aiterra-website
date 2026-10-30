import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import { BodyFatCalculator } from '../../components/tools/BodyCalculators'

const PATH = '/tools/body-fat-calculator'
const TITLE = 'מחשבון אחוזי שומן לפי היקפים'
const META_TITLE = 'מחשבון אחוזי שומן לפי היקפים: הערכה בשיטת הצי האמריקאי'
const DESCRIPTION =
  'מחשבון אחוזי שומן: מכניסים גובה והיקפי צוואר, מותניים וירכיים ומקבלים הערכת אחוז שומן בגוף בלי קליפר.'

const faq: ToolFaqEntry[] = [
  {
    id: 'body-fat-calculator-0',
    question: 'איך מודדים היקפים?',
    answer: 'צוואר מודדים מתחת לגרוגרת. מותניים מודדים בגובה הטבור אצל גברים ובנקודה הצרה ביותר אצל נשים. ירכיים מודדים בנקודה הרחבה ביותר. מודדים בלי לכווץ ובלי להדק את הסרט.',
  },
  {
    id: 'body-fat-calculator-1',
    question: 'כמה אחוזי שומן נחשבים תקינים?',
    answer: 'לפי טבלת המועצה האמריקאית לכושר, טווח ממוצע הוא 25% עד 31% לנשים ו-18% עד 24% לגברים. הטווחים הם הנחיה כללית ולא אבחנה.',
  },
  {
    id: 'body-fat-calculator-2',
    question: 'כמה השיטה מדויקת?',
    answer: 'מדובר בהערכה, והיא עלולה לסטות בכמה נקודות אחוז. מעקב אחרי שינוי לאורך זמן שימושי יותר מהמספר הבודד.',
  },
  {
    id: 'body-fat-calculator-3',
    question: 'מה עדיף, אחוזי שומן או BMI?',
    answer: 'BMI לא מבחין בין שריר לשומן, ולכן אחוזי שומן מוסיפים מידע, בעיקר למי שמתאמן. אפשר להשתמש בשניהם.',
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
      lede="שיטת הצי האמריקאי מעריכה אחוז שומן מגובה ומהיקפים שמודדים בסרט מדידה, בלי ציוד נוסף."
      tool={<BodyFatCalculator />}
      faq={faq}
      cta={{
        text: 'אנחנו בונים אתרים ומחשבונים לקליניקות, לדיאטניות ולמכוני כושר.',
        label: 'פיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>איך זה מחושב</h2>
      <p>מקור החישוב: נוסחת ההיקפים של הצי האמריקאי. התוצאה היא הערכה כללית ואינה מחליפה ייעוץ רפואי או תזונתי.</p>
    </ToolLayout>
  )
}
