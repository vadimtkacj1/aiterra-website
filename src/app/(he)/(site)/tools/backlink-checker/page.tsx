import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import BacklinkChecker from '../../components/tools/BacklinkChecker'
import { LINK_INDEX_UPDATED_LABEL } from '@/lib/link-index'

const PATH = '/tools/backlink-checker'
const TITLE = 'בדיקת קישורים נכנסים לאתר'
const META_TITLE = 'בדיקת קישורים נכנסים: מי מקשר לאתר שלכם בישראל'
const DESCRIPTION =
  'בדיקת קישורים נכנסים חינם לאתרים ישראליים: ציון סמכות, אתרים מקשרים, טקסטי קישור והשוואה למתחרה, ממאגר עצמאי של אתרי .il.'

const faq: ToolFaqEntry[] = [
  {
    id: 'links-faq-source',
    question: 'מאיפה מגיעים הנתונים?',
    answer:
      'מסריקה עצמאית של עשרות אלפי אתרים ישראליים בסיומת <span dir="ltr">.il</span>. הבדיקה מציגה רק קישורים שנמצאו בסריקה הזאת, ולכן היא לא כוללת את כל הקישורים שקיימים ברשת.',
  },
  {
    id: 'links-faq-score',
    question: 'מה זה ציון הסמכות?',
    answer:
      'ציון מ-0 עד 100 שמחושב מקישורים בין אתרים ישראליים, בדומה לעיקרון של PageRank. קישורים חוזרים בחתימות ובכותרות תחתונות מקבלים משקל נמוך. זה מדד שלנו, לא נתון של Google או של כלי SEO אחר, והוא לא קובע מיקום בחיפוש.',
  },
  {
    id: 'links-faq-empty',
    question: 'למה האתר שלי מופיע עם מעט קישורים?',
    answer:
      'הסריקה לא רואה קישורים מאתרים מחוץ ל-<span dir="ltr">.il</span>, קישורים שנטענים רק ב-JavaScript ודפים שלא נסרקו. לתמונה מלאה של האתר שלכם השתמשו גם ב-Google Search Console.',
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
      lede="מקלידים דומיין ישראלי ורואים מי מקשר אליו, מה ציון הסמכות שלו ומה חסר לעומת מתחרה."
      chips={[`עודכן ${LINK_INDEX_UPDATED_LABEL}`, 'בלי הרשמה', 'אתרי \u200E.il']}
      tool={<BacklinkChecker />}
      faq={faq}
      cta={{
        text: 'רוצים להבין מה הקישורים אומרים על האתר שלכם? אנחנו בונים אתרים ומקדמים אותם בגוגל.',
        label: 'קידום אתרים',
        href: '/services/marketing',
      }}
    >
      <h2>איך לקרוא את התוצאה</h2>
      <p>
        אתר מקשר הוא דומיין ישראלי שנמצא בו לפחות קישור אחד לאתר שלכם. בלי nofollow הם קישורים שלא סומנו כחסרי
        המלצה. ההשוואה למתחרה מציגה אתרים מבין 20 החזקים שמקשרים אליו ולא נמצאו אצלכם, ואפשר לבדוק אם הם רלוונטיים גם לכם.
      </p>
      <h2>מה הכלי לא בודק</h2>
      <p>
        הנתונים הם תמונת מצב של סריקה עצמאית מתאריך {LINK_INDEX_UPDATED_LABEL}. אין בהם קישורים מאתרים זרים, והם לא
        מחליפים את דוח הקישורים ב-Google Search Console. אפשר לבקש הסרה של אתר מהמאגר דרך עמוד יצירת הקשר.
      </p>
    </ToolLayout>
  )
}
