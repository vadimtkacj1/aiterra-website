import type { Metadata } from 'next'
import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import StickyPageFooter from '@/components/layout/StickyPageFooter'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { CONTACT_EMAIL, OFFICE_ADDRESS_HE } from '@/lib/contact'

export const metadata: Metadata = {
  title: 'מדיניות פרטיות',
  description:
    'מדיניות הפרטיות של AITERRA: איזה מידע נאסף באתר, כיצד הוא נשמר ומשמש, שימוש בעוגיות וכלי אנליטיקה, וזכויותיכם לפי חוק הגנת הפרטיות.',
  alternates: { canonical: '/privacy-policy' },
}

const LAST_UPDATED = '13.06.2026'

export default function PrivacyPolicyPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <HeaderAlt />
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <main className="relative z-20 flex-1 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <div className="max-w-4xl mx-auto px-6 pt-8 pb-2" dir="rtl">
            <Breadcrumb items={[{ label: 'מדיניות פרטיות' }]} />
          </div>
          <article className="max-w-4xl mx-auto px-6 pt-4 pb-20 prose-blog" dir="rtl">
            <h1 className="text-[28px] md:text-[40px] font-bold text-[#111827] mb-2">מדיניות פרטיות</h1>
            <p className="text-[14px] text-[#6b7280] mb-8">עודכן לאחרונה: {LAST_UPDATED}</p>

            <h2>כללי</h2>
            <p>
              AITERRA (להלן: &quot;החברה&quot;, &quot;אנחנו&quot;) מכבדת את פרטיות המשתמשים באתר www.aiterra.co.il
              (להלן: &quot;האתר&quot;). מדיניות זו מפרטת איזה מידע נאסף במסגרת השימוש באתר, כיצד הוא נשמר
              ולאילו מטרות הוא משמש, בהתאם להוראות חוק הגנת הפרטיות, התשמ&quot;א-1981.
            </p>

            <h2>איזה מידע אנחנו אוספים</h2>
            <p>
              <strong>מידע שאתם מוסרים לנו:</strong> בעת מילוי טופס יצירת קשר או השארת פרטים באתר אנו אוספים
              את הפרטים שמסרתם — שם, מספר טלפון, כתובת דוא&quot;ל ותוכן הפנייה. מסירת המידע תלויה ברצונכם
              ובהסכמתכם, ואינה חובה על פי דין.
            </p>
            <p>
              <strong>מידע שנאסף אוטומטית:</strong> האתר עושה שימוש בכלי אנליטיקה (Microsoft Clarity) לצורך
              הבנת אופן השימוש באתר ושיפור חוויית המשתמש — לרבות נתוני גלישה, סוג דפדפן ומכשיר, עמודים שנצפו
              ומפות חום. מידע זה נאסף באופן מצרפי ואינו מזהה אתכם אישית.
            </p>

            <h2>שימוש בעוגיות (Cookies)</h2>
            <p>
              האתר משתמש בעוגיות לצורך תפעולו השוטף, מדידת ביצועים ושיפור השירות. בעת הביקור הראשון באתר
              מוצגת הודעת הסכמה לשימוש בעוגיות. ניתן לחסום או למחוק עוגיות בכל עת דרך הגדרות הדפדפן —
              ייתכן שחלק מתכונות האתר לא יפעלו באופן מלא ללא עוגיות.
            </p>

            <h2>למה משמש המידע</h2>
            <p>המידע שנמסר לנו משמש אך ורק למטרות הבאות:</p>
            <ul>
              <li>מענה לפניות ויצירת קשר בנוגע לשירותים שביקשתם</li>
              <li>שיפור האתר, השירותים וחוויית המשתמש</li>
              <li>עמידה בדרישות הדין</li>
            </ul>
            <p>
              איננו מוכרים, משכירים או מעבירים את פרטיכם האישיים לצדדים שלישיים, למעט ספקי שירות הפועלים
              מטעמנו לצורך תפעול האתר (כגון שירותי אחסון ואנליטיקה) או כאשר הדבר נדרש על פי דין.
            </p>

            <h2>אבטחת מידע</h2>
            <p>
              אנו מיישמים אמצעי אבטחה מקובלים להגנה על המידע, לרבות תעבורה מוצפנת (HTTPS). עם זאת, אין
              באפשרותנו להבטיח חסינות מוחלטת מפני גישה בלתי מורשית.
            </p>

            <h2>זכויותיכם</h2>
            <p>
              על פי חוק הגנת הפרטיות, כל אדם זכאי לעיין במידע שנשמר עליו, לבקש את תיקונו או את מחיקתו.
              לבקשות בנושא ניתן לפנות אלינו בדוא&quot;ל:{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} dir="ltr">{CONTACT_EMAIL}</a>.
            </p>

            <h2>יצירת קשר</h2>
            <p>
              לשאלות בנוגע למדיניות זו ניתן לפנות אלינו בדוא&quot;ל{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} dir="ltr">{CONTACT_EMAIL}</a> או בכתובת: {OFFICE_ADDRESS_HE}.
            </p>
            <p>
              החברה רשאית לעדכן מדיניות זו מעת לעת. הנוסח המעודכן יפורסם בעמוד זה.
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
