import type { Metadata } from 'next'
import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import StickyPageFooter from '@/components/layout/StickyPageFooter'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/contact'

export const metadata: Metadata = {
  title: 'הצהרת נגישות',
  description:
    'הצהרת הנגישות של אתר AITERRA: התאמות הנגישות שבוצעו באתר בהתאם לתקן הישראלי 5568 ולהנחיות WCAG 2.1 ברמה AA, ודרכי פנייה לרכז הנגישות.',
  alternates: { canonical: '/accessibility-statement' },
}

const LAST_UPDATED = '13.06.2026'

export default function AccessibilityStatementPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <HeaderAlt />
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <main id="main-content" className="relative z-20 flex-1 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <div className="max-w-4xl mx-auto px-6 pt-8 pb-2" dir="rtl">
            <Breadcrumb items={[{ label: 'הצהרת נגישות' }]} />
          </div>
          <article className="max-w-4xl mx-auto px-6 pt-4 pb-20 prose-blog" dir="rtl">
            <h1 className="text-[28px] md:text-[40px] font-bold text-[#111827] mb-2">הצהרת נגישות</h1>
            <p className="text-[14px] text-[#6b7280] mb-8">עודכן לאחרונה: {LAST_UPDATED}</p>

            <h2>מחויבות לנגישות</h2>
            <p>
              AITERRA רואה חשיבות רבה במתן שירות שוויוני לכלל הגולשים ובהנגשת האתר לאנשים עם מוגבלות.
              אנו פועלים להתאמת אתר www.aiterra.co.il לדרישות תקנות שוויון זכויות לאנשים עם מוגבלות
              (התאמות נגישות לשירות), התשע&quot;ג-2013, לתקן הישראלי ת&quot;י 5568 ולהנחיות הנגישות
              הבינלאומיות WCAG 2.1 ברמה AA.
            </p>

            <h2>התאמות הנגישות באתר</h2>
            <ul>
              <li>מבנה עמודים סמנטי עם כותרות מדורגות וניווט עקבי</li>
              <li>קישור &quot;דלגו לתוכן הראשי&quot; בראש כל עמוד</li>
              <li>תמיכה בניווט מלא באמצעות מקלדת, כולל סימון מוקד (Focus) נראה</li>
              <li>טקסט חלופי (Alt) לתמונות מהותיות</li>
              <li>ניגודיות צבעים העומדת בדרישות התקן בתכנים המרכזיים</li>
              <li>תצוגה מותאמת (רספונסיבית) למחשב, טאבלט ונייד ותמיכה בהגדלת טקסט בדפדפן</li>
            </ul>

            <h2>חריגות ומגבלות</h2>
            <p>
              אנו פועלים באופן שוטף לשיפור נגישות האתר, אולם ייתכן שחלקים מסוימים — לרבות תכנים מוטמעים
              מצדדים שלישיים או רכיבים גרפיים מורכבים — טרם הונגשו במלואם. אם נתקלתם בקושי או ברכיב שאינו
              נגיש, נשמח שתיידעו אותנו ונפעל לתקנו בהקדם.
            </p>

            <h2>פנייה לרכז הנגישות</h2>
            <p>לפניות בנושא נגישות, בקשות להתאמות או דיווח על ליקוי ניתן לפנות אלינו:</p>
            <ul>
              <li>
                דוא&quot;ל: <a href={`mailto:${CONTACT_EMAIL}`} dir="ltr">{CONTACT_EMAIL}</a>
              </li>
              <li>
                טלפון: <a href={`tel:+972${CONTACT_PHONE.replace(/-/g, '').slice(1)}`} dir="ltr">{CONTACT_PHONE}</a>
              </li>
            </ul>
            <p>
              כדי שנוכל לטפל בפנייה ביעילות, מומלץ לציין את כתובת העמוד שבו נתקלתם בבעיה, תיאור הבעיה
              והטכנולוגיה המסייעת שבה אתם משתמשים (אם רלוונטי).
            </p>
          </article>
        </main>
        <StickyPageFooter className="z-10">
          <Footer />
        </StickyPageFooter>
      </div>
    </div>
  )
}
