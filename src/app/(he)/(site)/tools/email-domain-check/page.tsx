import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import { EmailDomainCheck } from '../../components/tools/BusinessCalculators'

const PATH = '/tools/email-domain-check'
const TITLE = 'בדיקת SPF, DKIM ו-DMARC לדומיין'
const META_TITLE = 'בדיקת SPF, DKIM ו-DMARC: האם אפשר לזייף מייל בשם הדומיין שלכם'
const DESCRIPTION =
  'בדיקת SPF, DKIM ו-DMARC בחינם: מכניסים דומיין ורואים אם מיילים ממנו מוגנים מהתחזות ואם הם עלולים ליפול לספאם.'

const faq: ToolFaqEntry[] = [
  {
    id: 'email-domain-check-0',
    question: 'מה זה SPF?',
    answer: 'רשומה שקובעת אילו שרתים רשאים לשלוח מייל בשם הדומיין.',
  },
  {
    id: 'email-domain-check-1',
    question: 'מה זה DMARC?',
    answer: 'מדיניות שאומרת לשרת המקבל מה לעשות במייל שנכשל בבדיקות. p=none רק מנטר, ו-quarantine או reject מגנים בפועל.',
  },
  {
    id: 'email-domain-check-2',
    question: 'למה DKIM לא זוהה?',
    answer: 'הבדיקה מנסה סלקטורים נפוצים בלבד. ייתכן שהדומיין משתמש בסלקטור אחר, ואז בודקים בכותרות של מייל אמיתי.',
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
      lede="הכלי קורא את רשומות ה-DNS הציבוריות של הדומיין ומראה אם הוגדרו בו הגנות מפני התחזות במייל."
      tool={<EmailDomainCheck />}
      faq={faq}
      cta={{
        text: 'צריכים מחשבון או מערכת כזו לעסק שלכם? אנחנו בונים אותם.',
        label: 'פיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>מקור</h2>
      <p>
        <a href="https://www.gov.il/he/pages/dmarc_pmi" rel="noopener" target="_blank">
          מערך הסייבר הלאומי: DMARC
        </a>
        . המידע כללי ואינו מחליף ייעוץ מקצועי.
      </p>
    </ToolLayout>
  )
}
