import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import RandomWheelPicker from '../../components/tools/RandomWheelPicker'
import { MAX_NAMES, WHEEL_REVIEWED, WHEEL_REVIEWED_LABEL } from '@/lib/wheel-picker'
import styles from '../word-counter/page.module.css'

const PATH = '/tools/random-wheel-picker'
const TITLE = 'גלגל מזל להגרלת שמות'
const META_TITLE = 'גלגל מזל להגרלת שמות אונליין, בחירה אקראית'
const DESCRIPTION =
  'גלגל מזל להגרלת שמות: מדביקים רשימה, מסובבים ומקבלים זוכה אקראי. אפשר להסיר את הזוכה, לשתף את הרשימה בקישור ולהפעיל מהמקלדת. בחינם ובלי הרשמה.'

const sources = [
  {
    label: 'MDN: Crypto.getRandomValues()',
    href: 'https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues',
  },
  {
    label: 'MDN: prefers-reduced-motion',
    href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion',
  },
  {
    label: 'W3C: Understanding WCAG 2.2, Animation from Interactions',
    href: 'https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html',
  },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'wheel-faq-fair',
    question: 'האם הגרלה בגלגל מזל הוגנת?',
    answer:
      'כן, כל שם ברשימה מקבל סיכוי שווה. הזוכה נבחר לפני שהגלגל מתחיל להסתובב, באמצעות מחולל מספרים אקראיים של הדפדפן שמיועד גם להצפנה, ולא באמצעות Math.random. הסיבוב עצמו הוא אנימציה שנעצרת בדיוק על השם שנבחר. אותו שם שמופיע פעמיים ברשימה מקבל פי שניים סיכוי, וזה נעשה בכוונה.',
  },
  {
    id: 'wheel-faq-names',
    question: 'כמה שמות אפשר להכניס לגלגל?',
    answer: `עד ${MAX_NAMES} שמות, שם בכל שורה. מעבר לזה הכלי לוקח את ${MAX_NAMES} הראשונים. כשיש יותר מ-24 שמות הכתב על הגלגל קטן יותר, ושמות ארוכים מ-14 תווים נחתכים בתצוגה, אבל הזוכה תמיד מוצג בשמו המלא מתחת לגלגל. לרשימות ארוכות מאוד עדיף לחלק אותן לכמה הגרלות.`,
  },
  {
    id: 'wheel-faq-remove',
    question: 'איך מגרילים כמה זוכים בלי שאותו אדם יזכה פעמיים?',
    answer:
      'אחרי כל סיבוב לוחצים על הסרת הזוכה מהרשימה, והשם נמחק מהתיבה. הסיבוב הבא כבר לא כולל אותו, וככה מקבלים זוכה שני, שלישי וכן הלאה. אם טעיתם, אפשר להקליד את השם בחזרה בתיבה. אפשר גם להשתמש בזה כדי לקבוע סדר תורות בכיתה או בצוות.',
  },
  {
    id: 'wheel-faq-share',
    question: 'איך משתפים רשימה עם אחרים?',
    answer:
      'לוחצים על קישור לרשימה, והכלי מעתיק כתובת שהשמות כלולים בה. מי שפותח אותה רואה את אותה רשימה ומסובב בעצמו. הרשימה לא נשמרת בשרת שלנו, אלא רק בכתובת, ולכן אל תכניסו לרשימה פרטים רגישים אם אתם עומדים לשתף את הקישור בקבוצה ציבורית.',
  },
  {
    id: 'wheel-faq-motion',
    question: 'מה קורה אם הפעלתי הפחתת תנועה במכשיר?',
    answer:
      'הגלגל לא מסתובב. כשבהגדרות המכשיר מופעלת הפחתת תנועה, הכלי מדלג על האנימציה, מציג מיד את הגלגל במצבו הסופי ומכריז על הזוכה. התוצאה נבחרת באותה דרך בדיוק. את הכלי אפשר להפעיל גם בלי עכבר, עם Tab ו-Enter או עם Ctrl+Enter בתיבת השמות.',
  },
  {
    id: 'wheel-faq-giveaway',
    question: 'אפשר להשתמש בגלגל להגרלה ציבורית של עסק?',
    answer:
      'הכלי מתאים להגרלות קטנות וללא עלות, כמו כיתה, צוות או קבוצה. הגרלה ציבורית של עסק, למשל ברשתות החברתיות, עשויה להיות כפופה לכללים נוספים, ולכן כדאי לבדוק אותה מול איש מקצוע משפטי לפני הפרסום. אנחנו לא מספקים ייעוץ משפטי, והכלי רק בוחר שם אקראי.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function RandomWheelPickerPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="גלגל מזל להגרלת שמות בוחר זוכה אחד באקראי, וכל שם ברשימה מקבל סיכוי שווה. מדביקים את השמות, מסובבים את הגלגל וקובעים אם להסיר את הזוכה לסיבוב הבא."
      chips={['סיכוי שווה לכל שם', 'שיתוף ברשימה בקישור', 'עובד מהמקלדת', 'מכבד הפחתת תנועה']}
      tool={<RandomWheelPicker />}
      faq={faq}
      cta={{
        text: 'צריכים כלי מותאם לעסק, כמו הגרלה בתוך אפליקציה או מערכת פנימית? אנחנו מפתחים תוכנה לפי הצורך.',
        label: 'לפיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>איך מגרילים שם בגלגל מזל</h2>
      <ol>
        <li>כותבים או מדביקים את השמות בתיבה, שם בכל שורה. אפשר גם ללחוץ על כן או לא, או על רשימת דוגמה.</li>
        <li>לוחצים על סובבו את הגלגל, או על Ctrl+Enter כשהסמן בתיבה.</li>
        <li>הזוכה מופיע מתחת לגלגל. כדי להגריל זוכה נוסף בלי לחזור על אותו שם, לוחצים על הסרת הזוכה מהרשימה.</li>
        <li>כדי לשלוח את הרשימה למישהו אחר, לוחצים על קישור לרשימה ומדביקים אותו בהודעה.</li>
      </ol>

      <h2>איך הבחירה נעשית</h2>
      <p>
        הכלי בוחר את הזוכה לפני שהאנימציה מתחילה. הבחירה משתמשת ב-<span dir="ltr">crypto.getRandomValues</span>, המחולל
        האקראי של הדפדפן, ובשיטה שמונעת הטיה כשמספר השמות לא מתחלק בדיוק במספר האפשרויות. אחר כך הגלגל מסתובב כמה
        סיבובים ונעצר על הזוכה, עם סטייה קטנה בתוך הפרוסה כדי שהעצירה תיראה טבעית. מי שמעדיף לא לראות אנימציה, או
        שמגדיר הפחתת תנועה במכשיר, מקבל את אותה תוצאה בלי סיבוב.
      </p>

      <h2>מתי גלגל מזל שימושי</h2>
      <ul>
        <li>בחירת מי עונה ראשון בכיתה או בהדרכה, בלי תחושה שהמורה מעדיף מישהו.</li>
        <li>סדר תורות בישיבת צוות, בחירת מי מביא עוגה או מי מסכם את הפגישה.</li>
        <li>החלטה קטנה בין כמה אפשרויות, למשל איפה אוכלים. כן או לא נותן הכרעה בין שתיים.</li>
        <li>הגרלה קטנה בין חברים, ללא הימור וללא תשלום.</li>
      </ul>
      <p>
        הגרלה ציבורית של עסק, למשל פרס ללקוחות ברשתות, עשויה להיות כפופה לכללים נוספים. לפני שמפרסמים אותה כדאי לבדוק
        אותה מול איש מקצוע משפטי. הכלי כאן רק בוחר שם אקראי ואינו מהווה ייעוץ משפטי.
      </p>

      <h2>מקורות</h2>
      <ul className={styles.sources}>
        {sources.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noopener" target="_blank" lang="en" dir="ltr">
              {source.label}
            </a>
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        נבדק מול המקורות ב-<time dateTime={WHEEL_REVIEWED}>{WHEEL_REVIEWED_LABEL}</time>.
      </p>
    </ToolLayout>
  )
}
