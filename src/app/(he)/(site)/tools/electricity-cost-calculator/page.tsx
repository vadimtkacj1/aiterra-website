import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import ElectricityCostCalculator from '../../components/tools/ElectricityCostCalculator'
import {
  TARIFF_AGOROT_EXCL_VAT,
  TARIFF_AGOROT_INCL_VAT,
  TARIFF_CHECKED,
  TARIFF_CHECKED_LABEL,
  TARIFF_EFFECTIVE_LABEL,
  electricitySources,
} from '@/lib/electricity-cost-calculator'
import styles from './page.module.css'

const PATH = '/tools/electricity-cost-calculator'
const TITLE = 'מחשבון צריכת חשמל'
const META_TITLE = 'מחשבון צריכת חשמל: עלות לפי מכשיר ולפי חודש'
const DESCRIPTION =
  'מחשבון צריכת חשמל לפי מכשיר: הספק בוואט, שעות ביום ומחיר קוט״ש לפי תעריף משק הבית העדכני. מחשב עלות חודשית ודו־חודשית ומראה מה הכי יקר.'

const faq: ToolFaqEntry[] = [
  {
    id: 'electricity-faq-formula',
    question: 'איך מחשבים כמה עולה להפעיל מכשיר חשמלי?',
    answer:
      'מכפילים את ההספק בוואט בשעות ההפעלה ומחלקים ב־1,000, וכך מקבלים קוט״ש. את הקוט״ש מכפילים במחיר הקוט״ש. לדוגמה, מזגן של 1,200 וואט שפועל 8 שעות ביום צורך 9.6 קוט״ש ביום, ובמחיר של 63.52 אגורות עולה כ־6.1 שקלים ביום, ובחודש בערך 183 שקלים.',
  },
  {
    id: 'electricity-faq-price',
    question: 'כמה עולה קוט״ש בישראל?',
    answer: `לפי ספר לוחות התעריפים של רשות החשמל (מהדורת יולי 2026, לוח 5.3-1), תעריף משק הבית מ־${TARIFF_EFFECTIVE_LABEL} הוא ${TARIFF_AGOROT_EXCL_VAT} אגורות לקוט״ש לפני מע״מ, ו־${TARIFF_AGOROT_INCL_VAT} אגורות כולל מע״מ. התעריף אחיד לכל שעות היממה ולכל עונות השנה. הרשות מעדכנת אותו מדי פעם, ולכן אפשר לשנות את המחיר בשדה לפי החשבון שלכם.`,
  },
  {
    id: 'electricity-faq-expensive',
    question: 'אילו מכשירים צורכים הכי הרבה חשמל בבית?',
    answer:
      'בדרך כלל אלה מכשירי חימום וקירור: מזגן, דוד חשמלי, תנור חימום ומייבש כביסה. הם עובדים בהספק של אלפי וואט ופועלים שעות. מקרר צורך הספק קטן, אבל פועל כל היממה ולכן גם הוא מופיע גבוה ברשימה. נורות LED וטעינת מכשירים הם בדרך כלל חלק קטן מהחשבון.',
  },
  {
    id: 'electricity-faq-bimonthly',
    question: 'למה החשבון בפועל גבוה מהחישוב כאן?',
    answer:
      'מהסיבה שהחשבון כולל גם תשלום קבוע על החיבור, בנוסף לתשלום לפי קוט״ש, ולפעמים מכשירים שלא הוספתם לחישוב. כלי שמודד צריכה אמיתית נותן תוצאה מדויקת יותר. הכלי נותן הערכה לפי מה שמקלידים, ולכן הוא עוזר להשוות בין מכשירים ולא להחליף את החשבון.',
  },
  {
    id: 'electricity-faq-watts',
    question: 'איפה מוצאים את ההספק של המכשיר?',
    answer:
      'ההספק בוואט כתוב על מדבקת הנתונים של המכשיר, בדרך כלל מאחור או מתחת, ובחוברת ההוראות. הרשימה בכלי כוללת ערכים אופייניים בלבד, ומכשירים שונים יכולים לסטות מהם. במזגן, במקרר ובמכונת כביסה ההספק משתנה לפי השלב, ולכן הערכים ברשימה הם ממוצעים לשימוש רגיל.',
  },
  {
    id: 'electricity-faq-save',
    question: 'איך מקטינים את חשבון החשמל?',
    answer:
      'הכי יעיל לפעול במכשירים הגדולים: להגדיר מזגן על 24 עד 25 מעלות, לכבות דוד חשמלי כשלא צריך ולהפעיל אותו לפי שעון, ולהשתמש במייבש כביסה פחות. החלפה לנורות LED חוסכת הרבה פחות. כדאי להזין בכלי את המכשירים שלכם ולראות איזה שורה גדולה ביותר לפני שמחליטים במה להתחיל.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function ElectricityCostCalculatorPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede={`עלות הפעלה של מכשיר חשמלי היא ההספק בוואט כפול שעות ההפעלה, חלקי 1,000, כפול מחיר הקוט״ש, שהוא ${TARIFF_AGOROT_INCL_VAT} אגורות כולל מע״מ מאז ${TARIFF_EFFECTIVE_LABEL}. מוסיפים את המכשירים שלכם ורואים צריכה ועלות חודשית, דו־חודשית ושנתית.`}
      chips={['תעריף משק הבית', 'מחיר שאפשר לשנות', 'עלות לפי מכשיר', 'בלי הרשמה']}
      tool={<ElectricityCostCalculator />}
      faq={faq}
      cta={{
        text: 'מנהלים עסק עם הרבה ציוד וצריכים דוחות ומעקב אוטומטיים? אנחנו בונים מערכות ניהול מותאמות.',
        label: 'לפיתוח מערכות מותאמות',
        href: '/services/development',
      }}
    >
      <h2>איך משתמשים במחשבון</h2>
      <p>
        בוחרים מכשיר מהרשימה או מקלידים הספק משלכם, מציינים כמה שעות ביום ובכמה ימים בחודש הוא פועל, והכלי מחשב צריכה
        בקוט״ש ועלות. כל מכשיר מוצג בנפרד, ולמטה או בצד מופיע הסכום. כך רואים מה הכי יקר ואפשר להשוות לפני שמחליפים
        הרגל או מכשיר.
      </p>
      <ul>
        <li>
          <strong>הספק.</strong> ההספק ברשימה הוא ערך אופייני בלבד. מכשירים שונים נבדלים, והמספר המדויק כתוב על המדבקה.
        </li>
        <li>
          <strong>שעות.</strong> במזגן ובמקרר המדחס עובד רק חלק מהזמן שהמכשיר דלוק, ולכן ההספק ברשימה הוא
          ממוצע לשעת שימוש.
        </li>
        <li>
          <strong>מחיר.</strong> ברירת המחדל היא {TARIFF_AGOROT_INCL_VAT} אגורות לקוט״ש כולל מע״מ. אפשר להקליד מחיר אחר.
        </li>
      </ul>

      <h2>תעריף החשמל לבית</h2>
      <p>
        משקי בית בישראל משלמים תעריף אחיד: אותו מחיר לקוט״ש בכל שעות היממה ובכל עונות השנה. מאז {TARIFF_EFFECTIVE_LABEL}
        המחיר הוא {TARIFF_AGOROT_EXCL_VAT} אגורות לפני מע״מ ו־{TARIFF_AGOROT_INCL_VAT} אגורות כולל מע״מ. רשות החשמל
        עוברת לעדכון אוטומטי כל חצי שנה לפי מדד המחירים לצרכן ושער הדולר, ולכן המחיר עשוי להשתנות.
      </p>
      <p>
        החשבון הדו־חודשי כולל גם תשלום קבוע על החיבור. לחישוב מע״מ על סכום אפשר להשתמש ב
        <Link href="/tools/vat-calculator">מחשבון המע״מ</Link>.
      </p>

      <h2>איך לחסוך בחשבון</h2>
      <ul>
        <li>מזגן: הגדרה של 24 עד 25 מעלות ושימוש בשעון מקטינים את הצריכה.</li>
        <li>דוד חשמלי: מפעילים לפי הצורך ולא כל היום.</li>
        <li>מכשירי חימום: קומקום, תנור ומייבש כביסה הם בין הצרכנים הגדולים כשהם פועלים שעות.</li>
      </ul>

      <h2>מקורות</h2>
      <ul className={styles.sources}>
        {electricitySources.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noopener" target="_blank" dir="auto">
              {source.label}
            </a>
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        התעריף נבדק ב־<time dateTime={TARIFF_CHECKED}>{TARIFF_CHECKED_LABEL}</time> מול ספר לוחות התעריפים של רשות
        החשמל. ההספקים הם ערכים אופייניים והחישוב הוא הערכה, לא תחליף לחשבון החשמל.
      </p>
    </ToolLayout>
  )
}
