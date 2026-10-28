import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import WebsiteSecurityCheck from '../../components/tools/WebsiteSecurityCheck'
import styles from './page.module.css'

const PATH = '/tools/website-security-check'
const TITLE = 'בדיקת אבטחת אתר'
const META_TITLE = 'בדיקת אבטחת אתר בחינם: SSL, כותרות אבטחה ו-DMARC'
const DESCRIPTION =
  'בדיקת אבטחת אתר לבעלי אתרים: תעודת SSL ותוקף, הפניה ל-HTTPS, HSTS ו-CSP, עוגיות, קבצים חשופים כמו .git ו-xmlrpc, ורשומות SPF ו-DMARC. ציון A עד F עם הסבר מה לתקן.'

const checkRows: { check: string; why: string }[] = [
  {
    check: 'תעודת SSL וגרסת TLS',
    why: 'האם התעודה תקפה, תואמת לדומיין ולא עומדת לפוג, והאם השרת מדבר TLS 1.2 או 1.3 ולא גרסאות ישנות.',
  },
  {
    check: 'הפניה ל-HTTPS ו-HSTS',
    why: 'מי שמקליד http:// צריך לעבור אוטומטית לגרסה המוצפנת, ו-HSTS מורה לדפדפן לא לחזור לגרסה הפתוחה.',
  },
  {
    check: 'כותרות אבטחה',
    why: 'CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy ו-Permissions-Policy חוסמות XSS, clickjacking ודליפות.',
  },
  {
    check: 'מידע חשוף',
    why: 'מספרי גרסה בכותרות Server ו-X-Powered-By, גרסת וורדפרס בקוד הדף, ודגלי Secure, HttpOnly ו-SameSite בעוגיות.',
  },
  {
    check: 'קבצים ונקודות קצה פתוחים',
    why: '/.git/HEAD שמאפשר להוריד את כל הקוד, רשימת משתמשי וורדפרס ב-REST API, ו-xmlrpc.php שמשמש לניחוש סיסמאות.',
  },
  {
    check: 'אבטחת מייל',
    why: 'רשומות SPF ו-DMARC ומדיניות none, quarantine או reject, שקובעות אם אפשר לשלוח מייל מזויף בשם הדומיין.',
  },
]

const sources: { href: string; label: string; note: string }[] = [
  {
    href: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security',
    label: 'MDN: Strict-Transport-Security',
    note: 'התחביר של max-age, includeSubDomains ו-preload',
  },
  {
    href: 'https://owasp.org/www-project-secure-headers/',
    label: 'OWASP Secure Headers Project',
    note: 'רשימת כותרות האבטחה המומלצות וההסבר לכל אחת',
  },
  {
    href: 'https://support.google.com/a/answer/81126',
    label: 'Google: הנחיות לשולחי מייל',
    note: 'SPF או DKIM לכל שולח, ו-SPF, DKIM ו-DMARC למי ששולח 5,000 מיילים ביום ומעלה לחשבונות Gmail',
  },
  {
    href: 'https://support.google.com/a/answer/2466580',
    label: 'Google: הגדרת DMARC',
    note: 'מדיניות p=none, quarantine ו-reject ודוגמאות לרשומות',
  },
  {
    href: 'https://letsencrypt.org/docs/faq/',
    label: 'Let’s Encrypt: שאלות נפוצות',
    note: 'תעודות ברירת המחדל תקפות 90 יום',
  },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'security-faq-how',
    question: 'איך עושים בדיקת אבטחת אתר?',
    answer:
      'מקלידים את כתובת האתר ולוחצים על בדיקה. הכלי פותח חיבור מוצפן ובודק את תעודת ה-SSL וגרסת ה-TLS, שולח בקשה לגרסת http:// כדי לראות אם יש הפניה ל-HTTPS, קורא את כותרות האבטחה ואת העוגיות של דף הבית, בודק אם /.git/HEAD, רשימת המשתמשים של וורדפרס ו-xmlrpc.php פתוחים, ושולף מה-DNS את רשומות SPF, DMARC ו-MX. כל ממצא מקבל סטטוס והסבר בעברית מה לתקן, ובסוף מתקבל ציון A עד F. הבדיקה לוקחת כמה שניות ולא דורשת הרשמה או גישה לשרת.',
  },
  {
    id: 'security-faq-ssl',
    question: 'יש לי תעודת SSL. זה לא מספיק?',
    answer:
      'התעודה מצפינה את החיבור, אבל היא רק השכבה הראשונה. בלי הפניה מ-http ל-https חלק מהגולשים עדיין גולשים בלי הצפנה, ובלי HSTS תוקף ברשת ציבורית יכול להוריד אותם לגרסה הפתוחה. בלי CSP סקריפט שהוזרק דרך תוסף פגיע ירוץ בדף, ובלי X-Frame-Options אפשר לעטוף את האתר בדף זר ולגנוב לחיצות. גם תעודה תקינה פגה: תעודות Let’s Encrypt תקפות 90 יום, ואם החידוש האוטומטי נשבר, הגולשים יראו אזהרה מלאה. לכן הכלי מתריע כבר כשנשארו פחות מ-14 יום.',
  },
  {
    id: 'security-faq-dmarc',
    question: 'מה זה SPF ו-DMARC ולמה הם בבדיקת אבטחה של אתר?',
    answer:
      'אלה רשומות DNS שקובעות מי מורשה לשלוח מייל בשם הדומיין שלכם. SPF מפרט את השרתים המורשים, ו-DMARC אומר לשרת המקבל מה לעשות עם מייל שנכשל: p=none רק מדווח, p=quarantine שולח לספאם ו-p=reject חוסם. בלי DMARC נוכלים יכולים לשלוח ללקוחות שלכם חשבונית מזויפת מכתובת שנראית בדיוק כמו שלכם. גוגל דורשת SPF או DKIM מכל שולח לחשבונות Gmail, ומשולחים של 5,000 מיילים ביום ומעלה גם DMARC. זה חלק מהאבטחה של העסק, גם אם הוא לא בתוך קוד האתר.',
  },
  {
    id: 'security-faq-wordpress',
    question: 'האתר שלי בוורדפרס. מה הכי חשוב לבדוק?',
    answer:
      'שלושה דברים. הראשון הוא עדכונים: רוב הפריצות לאתרי וורדפרס מגיעות דרך תוסף או תבנית שלא עודכנו, ולכן גרסה שמופיעה בתגית generator היא רמז לתוקף מה לנסות. השני הוא xmlrpc.php, שמאפשר לנסות מאות סיסמאות בבקשה אחת, וכדאי לחסום אותו אם לא משתמשים באפליקציה או ב-Jetpack. השלישי הוא /wp-json/wp/v2/users, שחושף את שמות המשתמשים של המנהלים. אחרי שחוסמים את שניהם, מפעילים אימות דו-שלבי לכל מנהל, מגבילים ניסיונות התחברות ושומרים גיבוי יומי מחוץ לשרת.',
  },
  {
    id: 'security-faq-safe',
    question: 'האם מותר להריץ את הבדיקה ומה היא עושה לאתר?',
    answer:
      'הבדיקה פסיבית. היא שולחת לאתר כמה בקשות קריאה רגילות, בדיוק כמו דפדפן או מנוע חיפוש: דף הבית, גרסת http, ושלוש כתובות ידועות. היא לא מנסה סיסמאות, לא שולחת טפסים ולא מחפשת פרצות באופן אקטיבי, וקוראת רק עד 16KB מכל כתובת שנבדקת. ובכל זאת, הכלי נועד לבעלי אתרים ולמי שמנהל אתר עבורם, ולכן בודקים רק אתרים שיש לכם הרשאה לבדוק. אנחנו לא שומרים את הכתובת ואת התוצאות, ומגבילים כל משתמש לעשר בדיקות ב-10 דקות.',
  },
  {
    id: 'security-faq-grade',
    question: 'קיבלתי ציון A. האתר בטוח?',
    answer:
      'ציון A אומר שההגדרות שאפשר לראות מבחוץ תקינות: הצפנה, כותרות, עוגיות, קבצים חשופים ומייל. הוא לא רואה את מה שקורה בתוך השרת: תוספים שלא עודכנו, סיסמאות חלשות לפאנל הניהול, הרשאות קבצים, גיבויים ולוגים. אתר עם ציון A עדיין יכול להיפרץ דרך תוסף טפסים פגיע. מה שהציון כן עושה הוא לסגור את הפרצות הזולות ביותר לניצול, שבוטים סורקים אוטומטית בכל האינטרנט. כדאי להריץ את הבדיקה שוב אחרי כל שינוי בשרת, ב-Cloudflare או באחסון, ולשלב אותה בבדיקה חודשית קבועה.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function WebsiteSecurityCheckPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="בדיקת אבטחת אתר בחינם לבעלי אתרים: מקלידים כתובת ומקבלים תוך כמה שניות ציון A עד F על תעודת ה-SSL, ההפניה ל-HTTPS, כותרות האבטחה, העוגיות, קבצים חשופים כמו .git ו-xmlrpc.php, ורשומות SPF ו-DMARC של המייל. לכל ממצא יש הסבר בעברית מה בדיוק לתקן."
      chips={['SSL, תוקף וגרסת TLS', 'HSTS, CSP וכותרות אבטחה', 'קבצים חשופים ו-WordPress', 'SPF ו-DMARC, ציון A עד F']}
      tool={<WebsiteSecurityCheck />}
      faq={faq}
      cta={{
        text: 'קיבלתם C ומטה, או שאין לכם זמן לטפל בכותרות, ב-DMARC ובעדכוני וורדפרס? אנחנו מתקנים את הממצאים ומנטרים את האתר כל חודש.',
        label: 'תחזוקת אתרים ואבטחה',
        href: '/services/maintenance',
      }}
    >
      <h2 id="checks" className={styles.anchor}>
        מה הכלי בודק
      </h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>הבדיקות שמרכיבות את הציון</caption>
          <thead>
            <tr>
              <th scope="col">בדיקה</th>
              <th scope="col">מה זה אומר</th>
            </tr>
          </thead>
          <tbody>
            {checkRows.map((row) => (
              <tr key={row.check}>
                <th scope="row">{row.check}</th>
                <td>{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        כל בדיקה מקבלת משקל: תקין שווה נקודות מלאות, לבדוק חצי, ובעיה אפס. תעודה פגומה או תיקיית .git חשופה מורידות את
        הציון ל-F גם אם כל השאר תקין. 90 ומעלה הוא A, 80 הוא B, 65 הוא C ו-50 הוא D.
      </p>

      <h2 id="example" className={styles.anchor}>
        דוגמה: אתר וורדפרס של עסק קטן
      </h2>
      <p>
        אתר תדמית בוורדפרס עם תעודת Let’s Encrypt תקפה ל-60 יום נוספים והפניה מ-http ל-https. אין HSTS, אין CSP ואין
        X-Frame-Options, אבל X-Content-Type-Options מוגדר. השרת מחזיר X-Powered-By: PHP/7.4.33, xmlrpc.php פתוח, ורשימת
        המשתמשים חסומה ודף הבית לא שולח עוגיות. במייל יש SPF ו-DMARC עם p=none.
      </p>
      <ul>
        <li>תקין: תעודה (4), TLS (1), הפניה (2), nosniff (1), .git (2), משתמשים (1), SPF (2). סך הכול 13 נקודות.</li>
        <li>
          לבדוק, חצי נקודות: CSP (1 מתוך 2), Referrer-Policy ו-Permissions-Policy (0.5 כל אחת), גרסת PHP (0.5), xmlrpc
          (0.5), DMARC (1 מתוך 2). סך הכול 4.
        </li>
        <li>בעיה: HSTS (0 מתוך 2), X-Frame-Options (0 מתוך 1).</li>
      </ul>
      <p>
        17 נקודות מתוך 24 הן 71, כלומר ציון C. ארבע שורות בהגדרות השרת, HSTS, X-Frame-Options, Referrer-Policy
        ו-Permissions-Policy, מוסיפות 4 נקודות ומעלות את האתר ל-88 ול-B. CSP מלא ו-DMARC עם quarantine מוסיפים עוד 2
        ומביאים אותו ל-96 ול-A.
      </p>

      <h2 id="fix-order" className={styles.anchor}>
        באיזה סדר לתקן
      </h2>
      <ol>
        <li>
          <strong>בעיות אדומות של הצפנה וקבצים.</strong> תעודה שפגה או .git חשוף הם פרצה פתוחה עכשיו. מטפלים בהם באותו
          יום.
        </li>
        <li>
          <strong>הפניה ל-HTTPS ו-HSTS.</strong> שינוי של דקות בשרת או ב-Cloudflare שמבטיח שכל הגלישה מוצפנת.
        </li>
        <li>
          <strong>כותרות פשוטות.</strong> X-Frame-Options, X-Content-Type-Options, Referrer-Policy ו-Permissions-Policy
          לא שוברות כמעט אף אתר.
        </li>
        <li>
          <strong>DMARC בהדרגה.</strong> מתחילים ב-p=none עם כתובת לדוחות, מוודאים שכל שירותי הדיוור עוברים, ועוברים
          ל-quarantine ול-reject.
        </li>
        <li>
          <strong>CSP אחרון.</strong> מפעילים קודם במצב Report-Only, כי מדיניות שגויה יכולה לחסום אנליטיקס, צ׳אט וסליקה.
        </li>
      </ol>
      <p>
        רוצים לבדוק גם איך האתר נראה בעיני גולש זהיר? הריצו את{' '}
        <Link href="/tools/website-trust-check">בדיקת אתר אמין או מזויף</Link>. ואם אין לכם זמן לטפל בממצאים, זה חלק
        מ<Link href="/services/maintenance">תחזוקת אתרים</Link> אצלנו.
      </p>

      <h2>מקורות</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noopener" target="_blank">
              {source.label}
            </a>
            : {source.note}
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        המקורות נבדקו ב-28 באוקטובר 2026. הבדיקה חיצונית ואוטומטית, ואינה מחליפה בדיקת חדירות או ביקורת אבטחה מקצועית.
      </p>
    </ToolLayout>
  )
}
