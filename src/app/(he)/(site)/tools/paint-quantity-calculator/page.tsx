import type { ReactNode } from 'react'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import PaintQuantityCalculator from '../../components/tools/PaintQuantityCalculator'
import { COVERAGE_CHECKED, COVERAGE_CHECKED_LABEL, paintSources } from '@/lib/paint-quantity-calculator'
import styles from './page.module.css'

const PATH = '/tools/paint-quantity-calculator'
const TITLE = 'כמה צבע צריך'
const META_TITLE = 'כמה צבע צריך: מחשבון ליטרים לחדר, קירות ותקרה'
const DESCRIPTION =
  'כמה צבע צריך לחדר? מזינים אורך, רוחב וגובה, דלתות וחלונות ושכבות, ומקבלים ליטרים ואריזות. כושר הכיסוי לפי מפרט תמבור, וניתן לעריכה.'

const External = ({ id, children }: { id: keyof typeof paintSources; children: ReactNode }) => (
  <a href={paintSources[id].href} rel="noopener" target="_blank">
    {children}
  </a>
)

const faq: ToolFaqEntry[] = [
  {
    id: 'paint-faq-how',
    question: 'איך מחשבים כמה צבע צריך לחדר?',
    answer:
      'מחשבים את שטח הקירות כהיקף החדר כפול הגובה, מורידים את שטח הדלתות והחלונות שלא צובעים, מכפילים במספר השכבות ומחלקים בכושר הכיסוי של הצבע במטרים רבועים לליטר. לתוצאה מוסיפים פחת, ומעגלים למעלה. זו אותה שיטה שנירלט מתארת במדריך שלה: שטח החדר פחות פתחים, ולפי כושר הכיסוי שמופיע על האריזה.',
  },
  {
    id: 'paint-faq-coverage',
    question: 'מה כושר הכיסוי של צבע לקיר?',
    answer:
      'בעמודי המוצר של תמבור כושר הכיסוי המחושב של אמולסין הוא 9 עד 10 מטרים רבועים לליטר, ושל סופרקריל מט 12 עד 16 מטרים רבועים לליטר. העמודים לא מציינים אם המספר לשכבה אחת, ולכן הנחנו שכן, ולקחנו את הערך הנמוך. המספר בפועל תלוי בצבע, במשטח ובשיטת הצביעה, ולכן אפשר לשנות אותו בטופס.',
  },
  {
    id: 'paint-faq-coats',
    question: 'כמה שכבות צבע צריך לצבוע?',
    answer:
      'נירלט מתארת שתי שכבות בתהליך הצביעה, עם המתנה של שעתיים לייבוש ביניהן. בתמבור מצוין לאמולסין זמן המתנה של שעתיים בין שכבות. מעבר מצבע כהה לבהיר או קיר חשוף לפעמים דורשים שכבה נוספת או שכבת יסוד, ולכן אפשר לבחור עד ארבע שכבות בטופס. כדאי לבדוק את ההוראות על אריזת הצבע שלכם.',
  },
  {
    id: 'paint-faq-ceiling',
    question: 'האם לחשב גם את התקרה?',
    answer:
      'אם מתכוונים לצבוע את התקרה, מסמנים את האפשרות והמחשבון מוסיף את שטח התקרה, אורך כפול רוחב. התקרה נספרת בנפרד כדי שתוכלו לראות כמה ליטרים היא דורשת, כי לרוב צובעים אותה בצבע אחר, לבן. התוצאה הכוללת היא סכום של שני החלקים, ואם התקרה בצבע אחר, קנו כל צבע לפי החלק שלו.',
  },
  {
    id: 'paint-faq-waste',
    question: 'למה מוסיפים פחת?',
    answer:
      'צבע נשאר על המגלגל, על המברשת ובמגש, ולפעמים צריך תיקון קטן אחרי הצביעה. ברירת המחדל כאן היא עשרה אחוזים, והיא הנחה שלנו ולא נתון של יצרן. אפשר להפחית אותה לאפס אם אתם רוצים את הכמות הנטו, או להעלות אותה כשהקיר מחוספס וסופג הרבה. קנייה של כמות מעט גדולה עדיפה על חוסר בצבע באותו גוון באמצע העבודה.',
  },
  {
    id: 'paint-faq-rooms',
    question: 'איך מחשבים דירה שלמה?',
    answer:
      'אפשר להזין חדר אחד ולהגדיל את מספר החדרים הזהים, או לחשב כל חדר בנפרד ולסכם את התוצאות. החלופה השנייה מדויקת יותר כשהחדרים שונים בגודלם. אל תשכחו להוריד פתחים גדולים כמו חלונות פנורמיים ודלתות הזזה. במעברים ובחדרי מדרגות שמידותיהם לא סדירות, חשבו כל קיר בנפרד.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function PaintQuantityCalculatorPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="כמות הצבע שווה לשטח הקירות בלי הפתחים, כפול מספר השכבות, מחולק בכושר הכיסוי של הצבע במטרים רבועים לליטר. כאן מזינים את מידות החדר, הדלתות והחלונות, וכושר הכיסוי ממפרט תמבור שאפשר לשנות, ומקבלים ליטרים ואריזות."
      chips={['קירות ותקרה', 'כושר כיסוי לפי מפרט תמבור', 'שכבות ופחת לעריכה', 'בלי הרשמה']}
      tool={<PaintQuantityCalculator />}
      faq={faq}
      cta={{
        text: 'קבלן צביעה או חנות צבעים? אנחנו בונים אתרים ומערכות הצעות מחיר מותאמות.',
        label: 'לפיתוח אתרים ומערכות',
        href: '/services/development',
      }}
    >
      <h2>איך מחשבים כמה צבע צריך</h2>
      <ol>
        <li>
          <strong>שטח הקירות.</strong> היקף החדר כפול הגובה. בחדר של 4 על 3.5 מטר ובגובה 2.5 מטר זה 37.5 מ״ר.
        </li>
        <li>
          <strong>פתחים.</strong> מורידים את שטח הדלתות והחלונות שלא צובעים, כפי שמדריך{' '}
          <External id="nirlat">נירלט</External> ממליץ.
        </li>
        <li>
          <strong>שכבות.</strong> מכפילים במספר השכבות. שתיים הן המקובלות, עם שעתיים המתנה ביניהן.
        </li>
        <li>
          <strong>כושר כיסוי.</strong> מחלקים בכושר הכיסוי שמופיע על האריזה, במטרים רבועים לליטר.
        </li>
        <li>
          <strong>פחת.</strong> מוסיפים כמה אחוזים, ומעגלים למעלה לחצי ליטר.
        </li>
      </ol>

      <h2>כושר כיסוי לפי מפרט</h2>
      <p>
        בדף המוצר של <External id="emulsin">אמולסין של תמבור</External> כושר הכיסוי המחושב הוא 9 עד 10 מ״ר לליטר,
        והאריזה היא 18 ליטר. בדף של <External id="supercryl">סופרקריל מט</External> הוא 12 עד 16 מ״ר לליטר. נבדק ב-
        <time dateTime={COVERAGE_CHECKED}>{COVERAGE_CHECKED_LABEL}</time>. הדפים לא מפרטים אם המספר מתייחס לשכבה אחת, ולכן
        הנחנו שכן, ולקחנו את הקצה הנמוך של הטווח. אם יש לכם צבע אחר, הזינו את המספר מהאריזה שלו.
      </p>

      <h2>טיפים כדי לא להיגמר באמצע</h2>
      <ul>
        <li>קנו את כל הכמות בבת אחת, כדי שהגוון יהיה זהה בין הפחים.</li>
        <li>ערבבו את הפחים יחד לפני הצביעה, אם קניתם כמה.</li>
        <li>קיר מתקלף או חדש סופג יותר, ולכן העלו את הפחת או הוסיפו שכבת יסוד.</li>
        <li>שמרו קצת צבע לתיקונים אחרי הצביעה.</li>
      </ul>

      <h2>מקורות</h2>
      <ul className={styles.sources}>
        {(Object.keys(paintSources) as (keyof typeof paintSources)[]).map((id) => (
          <li key={id}>
            <a href={paintSources[id].href} rel="noopener" target="_blank" lang={id === 'nirlat' ? 'he' : 'en'} dir={id === 'nirlat' ? 'rtl' : 'ltr'}>
              {paintSources[id].label}
            </a>
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        נבדק מול המקורות ב-<time dateTime={COVERAGE_CHECKED}>{COVERAGE_CHECKED_LABEL}</time>. כושר הכיסוי המפורסם הוא
        מחושב ולא מדוד, והאחריות על הכמות הסופית היא של הקונה.
      </p>
    </ToolLayout>
  )
}
