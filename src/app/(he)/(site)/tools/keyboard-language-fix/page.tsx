import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import KeyboardFix from '../../components/tools/KeyboardFix'
import { keyPairs } from '@/lib/keyboard-fix'
import styles from './page.module.css'

const PATH = '/tools/keyboard-language-fix'
const TITLE = 'כתבתי באנגלית במקום בעברית'
const META_TITLE = 'כתבתי באנגלית במקום בעברית: תיקון מיידי'
const DESCRIPTION =
  'הקלדתם בשפה הלא נכונה ויצא akuo במקום שלום? מדביקים את הטקסט ומקבלים אותו מתוקן לעברית או לאנגלית לפי המקלדת. חינם ובלי הרשמה.'

const faq: ToolFaqEntry[] = [
  {
    id: 'kb-faq-how',
    question: 'איך הכלי יודע מה רציתי לכתוב?',
    answer:
      'כל מקש במקלדת מייצר אות אחת באנגלית ואות אחת בעברית. כשהמקלדת הייתה על השפה הלא נכונה, הכלי מחליף כל תו בתו שהיה יוצא מאותו מקש בשפה השנייה, לפי הפריסה הישראלית הסטנדרטית. לכן akuo הופך לשלום, ו-יקךךם הופך ל-hello.',
  },
  {
    id: 'kb-faq-auto',
    question: 'מה עושה הזיהוי האוטומטי?',
    answer:
      'הוא סופר כמה אותיות לטיניות וכמה אותיות עבריות יש בטקסט. אם רוב האותיות לטיניות, הוא מניח שרציתם לכתוב בעברית, ולהפך. אם הטקסט מעורב, בחרו את כיוון ההמרה בעצמכם.',
  },
  {
    id: 'kb-faq-switch',
    question: 'איך מחליפים שפת מקלדת במחשב?',
    answer:
      'ב-Windows לוחצים על מקש Windows יחד עם מקש הרווח, או על Alt השמאלי יחד עם Shift. ב-Mac לוחצים בדרך כלל על Control יחד עם מקש הרווח. בטלפון מחליפים שפה בלחיצה על סמל הגלובוס במקלדת.',
  },
  {
    id: 'kb-faq-privacy',
    question: 'הטקסט שלי נשמר או נשלח לאנשהו?',
    answer:
      'לא. ההמרה נעשית בדפדפן שלכם, בלי שרת ובלי שמירה. אפשר להדביק גם טקסט אישי או סיסמה שהוקלדה בשפה הלא נכונה, ואחרי סגירת העמוד שום דבר לא נשאר.',
  },
  {
    id: 'kb-faq-caps',
    question: 'הטקסט יצא באותיות גדולות באנגלית. זה עובד?',
    answer:
      'כן. אם Caps Lock היה דלוק בזמן ההקלדה, יוצאות אותיות לטיניות גדולות. הכלי מתייחס אליהן כמו לאותיות קטנות ומחזיר את העברית הנכונה.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function KeyboardLanguageFixPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="הקלדתם בשפה הלא נכונה ויצא akuo במקום שלום? הדביקו את הטקסט ותקבלו אותו בשפה הנכונה, בעברית או באנגלית."
      chips={['מתקן עברית ואנגלית', 'זיהוי כיוון אוטומטי', 'בלי שליחה לשרת']}
      tool={<KeyboardFix />}
      faq={faq}
      cta={{
        text: 'מקלידים את אותם טקסטים ללקוחות שוב ושוב? אנחנו בונים תבניות ואוטומציה שחוסכות את ההקלדה.',
        label: 'אוטומציה לעסקים',
        href: '/services/automation',
      }}
    >
      <h2>למה יוצא akuo במקום שלום</h2>
      <p>
        במקלדת אחת יש שתי שפות. כשהמחשב חושב שאתם כותבים באנגלית ואתם מקלידים מילה בעברית, כל מקש מוציא את האות
        האנגלית שעליו. המילה לא אבדה: אותו רצף מקשים, בשפה הנכונה, הוא בדיוק מה שרציתם לכתוב. לכן אפשר לתקן את הטקסט
        אוטומטית בלי להקליד אותו מחדש.
      </p>

      <h2>טבלת המקשים: אנגלית ועברית</h2>
      <p>כך כל מקש במקלדת הישראלית הסטנדרטית מתורגם בין השפות.</p>
      <div className={styles.keys}>
        {keyPairs.map((pair) => (
          <span key={pair.latin} className={styles.key}>
            <span className={styles.keyLatin} dir="ltr">
              {pair.latin}
            </span>
            <span className={styles.keyHebrew}>{pair.hebrew}</span>
          </span>
        ))}
      </div>

      <h2>איך נמנעים מזה מראש</h2>
      <ul>
        <li>ב-Windows: מקש Windows יחד עם רווח מחליף שפה, ואפשר גם Alt השמאלי יחד עם Shift.</li>
        <li>ב-Mac: בדרך כלל Control יחד עם רווח.</li>
        <li>הסתכלו על סמל השפה בשורת המשימות לפני שמתחילים להקליד הודעה ארוכה.</li>
        <li>בוואטסאפ ובמייל, כדאי לקרוא את המילה הראשונה לפני שממשיכים.</li>
      </ul>
    </ToolLayout>
  )
}
