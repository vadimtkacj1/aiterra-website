import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import FinalSettlementCalculator from '../../components/tools/FinalSettlementCalculator'

const PATH = '/tools/final-settlement-calculator'
const TITLE = 'מחשבון גמר חשבון'
const META_TITLE = 'מחשבון גמר חשבון לעובד: כל מה שמגיע בסיום עבודה'
const DESCRIPTION =
  'מחשבון גמר חשבון: מכניסים תאריכים ושכר ומקבלים פיצויים, פדיון חופשה, דמי הבראה והודעה מוקדמת בסכום אחד.'

const faq: ToolFaqEntry[] = [
  {
    id: 'settlement-what',
    question: 'מה כולל גמר חשבון?',
    answer: 'בדרך כלל שכר אחרון, פדיון ימי חופשה, דמי הבראה, פיצויי פיטורים אם מגיעים, וחלף הודעה מוקדמת אם לא עבדתם בתקופה הזו.',
  },
  {
    id: 'settlement-resign',
    question: 'מה מגיע למי שהתפטר?',
    answer: 'התפטרות רגילה לא מזכה בדרך כלל בפיצויים, אבל פדיון חופשה ודמי הבראה עדיין נבדקים. יש מקרים של התפטרות שמזכה בפיצויים, וכדאי לבדוק אותם.',
  },
  {
    id: 'settlement-14',
    question: 'מה עושה סעיף 14?',
    answer: 'כשחל סעיף 14 מלא, ההפרשות החודשיות לפיצויים באות במקום תשלום פיצויים בסיום העבודה, ולכן המחשבון לא מוסיף אותם.',
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
      lede="במקום לחשב כל זכות בנפרד, כאן מקבלים את כל הרכיבים העיקריים של סיום העבודה בתוצאה אחת."
      tool={<FinalSettlementCalculator />}
      faq={faq}
      cta={{
        text: 'רוצים אוטומציה לתהליכי משאבי אנוש בעסק? אנחנו בונים מערכות כאלה.',
        label: 'פיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>איך זה מחושב</h2>
      <p>פיצויים: שכר אחרון כפול שנות ותק. פדיון חופשה: שכר חלקי 22 כפול הימים. הבראה: ימי הזכאות כפול 451.50 ₪, יחסית לשנה האחרונה.</p>
      <p>המחשבון אינו ייעוץ משפטי. לפני חתימה על גמר חשבון מומלץ לבדוק את הסכום מול הסכם העבודה.</p>
    </ToolLayout>
  )
}
