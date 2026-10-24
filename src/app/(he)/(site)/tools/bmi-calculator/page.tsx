import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import BmiCalculator from '../../components/tools/BmiCalculator'
import { BMI_CATEGORIES, calculate, formatBmi, formatKg, healthyWeightRange } from '@/lib/bmi'
import styles from '../../components/tools/FunTable.module.css'

const PATH = '/tools/bmi-calculator'
const TITLE = 'מחשבון BMI'
const META_TITLE = 'מחשבון BMI: מדד מסת גוף וטווח משקל תקין לפי גובה'
const DESCRIPTION =
  'מחשבון BMI: מכניסים גובה ומשקל ומקבלים מדד מסת גוף, הסיווג לפי ארגון הבריאות העולמי וטווח המשקל התקין לגובה שלכם. כולל מגבלות המדד, הערכה כללית ולא רפואית.'

const WHO_FACT_SHEET_URL = 'https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight'
const WHO_NLIS_URL = 'https://www.who.int/data/nutrition/nlis/info/malnutrition-in-women'
const CDC_FAQ_URL = 'https://www.cdc.gov/bmi/faq/index.html'
const LANCET_URL = 'https://pubmed.ncbi.nlm.nih.gov/14726171/'
const REVIEWED = '24.10.2026'

const example = calculate({ heightCm: 170, weightKg: 70 })
const heavier = calculate({ heightCm: 170, weightKg: 85 })
const lighter = calculate({ heightCm: 170, weightKg: 50 })
const heightRows = [150, 160, 170, 180, 190].map((height) => {
  const range = healthyWeightRange(height)
  return { height, min: formatKg(range.minKg), max: formatKg(range.maxKg) }
})

const faq: ToolFaqEntry[] = [
  {
    id: 'bmi-faq-formula',
    question: 'איך מחשבים BMI?',
    answer: `מחלקים את המשקל בקילוגרמים בריבוע הגובה במטרים. לפי ארגון הבריאות העולמי, זו הנוסחה: משקל (ק״ג) חלקי גובה (מ׳) בריבוע. אדם בגובה 170 ס״מ ו-70 ק״ג: 70 חלקי 1.7 בריבוע (2.89) הם ${formatBmi(example.bmi)}, בטווח התקין.`,
  },
  {
    id: 'bmi-faq-categories',
    question: 'מה הסיווג של BMI למבוגרים?',
    answer:
      'לפי ארגון הבריאות העולמי: מתחת ל-18.5 תת משקל, 18.5 עד 24.9 משקל תקין, 25 ומעלה עודף משקל, ו-30 ומעלה השמנה. השמנה מחולקת לדרגה 1 (30 עד 34.9), דרגה 2 (35 עד 39.9) ודרגה 3 (40 ומעלה). הערכים זהים לגברים ולנשים.',
  },
  {
    id: 'bmi-faq-athletes',
    question: 'האם BMI מתאים לספורטאים ולמי שבנוי שריר?',
    answer:
      'לא תמיד. לפי ה-CDC, BMI לא מבחין בין שומן, שריר ועצם, ולכן מי שיש לו הרבה שריר עלול להיופיע בטווח של עודף משקל או השמנה בלי שיש לו עודף שומן. במצב כזה כדאי להסתכל גם על היקף מותניים או על מדידת הרכב גוף.',
  },
  {
    id: 'bmi-faq-elderly',
    question: 'האם הסיווג זהה לקשישים?',
    answer:
      'הטווחים של ארגון הבריאות העולמי כתובים למבוגרים בלי הבדל גיל, אבל המשמעות משתנה. לפי ה-CDC, אצל מבוגרים מבוגרים יש בממוצע יותר שומן באותו BMI, והמסה השרירית משפיעה על הקשר. אצל קשישים גם ירידה לא מכוונת במשקל היא סיבה לפנות לרופא, ולכן עדיף לפרש את המספר יחד עם הרופא.',
  },
  {
    id: 'bmi-faq-children',
    question: 'האם אפשר להשתמש במחשבון לילדים?',
    answer:
      'לא לפי טבלת המבוגרים. אצל ילדים ובני נוער מעריכים BMI לפי אחוזונים לגיל ולמין, ולפי ה-CDC עודף משקל הוא אחוזון 85 עד 95 והשמנה היא אחוזון 95 ומעלה. ארגון הבריאות העולמי משתמש בסטיות תקן מחציון התייחסות לגילאי 5 עד 19. לכן בשאלה על משקל של ילד פנו לרופא הילדים או לאחות בטיפת חלב.',
  },
  {
    id: 'bmi-faq-asian',
    question: 'האם הטווחים שונים לפי מוצא?',
    answer:
      'ארגון הבריאות העולמי שמר את הטווחים הבינלאומיים, אבל ועדה שלו מ-2004 מצאה שאצל אנשים ממוצא אסייתי הסיכון לסוכרת מסוג 2 ולמחלות לב עולה כבר ב-BMI נמוך מ-25, והציעה נקודות פעולה של 23 ו-27.5. בנוסף, לפי הארגון BMI לא בהכרח משקף אותה כמות שומן באוכלוסיות שונות. אם יש לכם שאלה, שאלו רופא.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function BmiCalculatorPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede={`BMI הוא המשקל בקילוגרמים חלקי הגובה במטרים בריבוע. אדם בגובה 170 ס״מ ו-70 ק״ג עומד על ${formatBmi(example.bmi)}, משקל תקין לפי ארגון הבריאות העולמי (18.5 עד 24.9). כאן מכניסים גובה ומשקל ומקבלים את המדד, הסיווג וטווח המשקל התקין לגובה שלכם.`}
      chips={['סיווג ארגון הבריאות העולמי', 'טווח משקל תקין לפי גובה', 'מגבלות המדד', 'הערכה כללית, לא רפואית']}
      tool={<BmiCalculator />}
      faq={faq}
      cta={{
        text: 'אנחנו בונים אתרים בעברית לקליניקות, דיאטניות ומכוני כושר: קביעת תורים, עמודי שירות ומחשבונים למטופלים.',
        label: 'בניית אתר לקליניקה',
        href: '/services/development',
      }}
    >
      <h2>איך המחשבון מחשב BMI</h2>
      <p>
        לפי{' '}
        <a href={WHO_FACT_SHEET_URL} rel="noopener" target="_blank">
          ארגון הבריאות העולמי
        </a>
        , BMI הוא משקל בק״ג חלקי גובה במטרים בריבוע. הטווח התקין מחושב הפוך: מכפילים את ריבוע הגובה ב-18.5 וב-24.9.
      </p>
      <ul>
        <li>
          <strong>דוגמה:</strong> 170 ס״מ ו-70 ק״ג. 70 חלקי 2.89 הם {formatBmi(example.bmi)}, {example.category.label}.
        </li>
        <li>
          <strong>טווח תקין לגובה 170:</strong> {formatKg(example.healthyMinKg)} עד {formatKg(example.healthyMaxKg)} ק״ג.
        </li>
        <li>
          <strong>אותו גובה, 85 ק״ג:</strong> BMI {formatBmi(heavier.bmi)}, {heavier.category.label}. כדי להגיע לתקרת הטווח
          חסרים {formatKg(-heavier.kgToHealthy)} ק״ג.
        </li>
        <li>
          <strong>אותו גובה, 50 ק״ג:</strong> BMI {formatBmi(lighter.bmi)}, {lighter.category.label}.
        </li>
      </ul>

      <h2>סיווג BMI למבוגרים</h2>
      <p>
        הסיווג לפי{' '}
        <a href={WHO_NLIS_URL} rel="noopener" target="_blank">
          ארגון הבריאות העולמי
        </a>
        , זהה לגברים ולנשים:
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>סיווג BMI למבוגרים</caption>
          <thead>
            <tr>
              <th scope="col">סיווג</th>
              <th scope="col">BMI</th>
            </tr>
          </thead>
          <tbody>
            {BMI_CATEGORIES.map((category) => (
              <tr key={category.id}>
                <th scope="row">{category.label}</th>
                <td>{category.rangeLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>טווח משקל תקין לפי גובה</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>משקל תקין (BMI 18.5 עד 24.9) לפי גובה</caption>
          <thead>
            <tr>
              <th scope="col">גובה (ס״מ)</th>
              <th scope="col">משקל תקין (ק״ג)</th>
            </tr>
          </thead>
          <tbody>
            {heightRows.map((row) => (
              <tr key={row.height}>
                <th scope="row">{row.height}</th>
                <td>
                  {row.min} עד {row.max}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>מגבלות של BMI</h2>
      <ul>
        <li>
          <strong>שריר לא נספר.</strong> לפי{' '}
          <a href={CDC_FAQ_URL} rel="noopener" target="_blank">
            ה-CDC
          </a>
          , BMI לא מבחין בין שומן, שריר ועצם, ולכן ספורטאים ומי שבנוי שריר עשויים להיות בטווח של עודף משקל בלי עודף
          שומן.
        </li>
        <li>
          <strong>גיל.</strong> אצל מבוגרים מבוגרים יש בממוצע יותר שומן באותו BMI, ולכן הפירוש משתנה.
        </li>
        <li>
          <strong>ילדים ונוער.</strong> לא משתמשים בטבלת המבוגרים. BMI מוערך לפי אחוזונים לגיל ולמין, והמחשבון במצב
          ״מתחת לגיל 18״ מציג רק את המספר ומפנה לרופא הילדים.
        </li>
        <li>
          <strong>הריון.</strong> המדד לא מיועד לנשים בהריון.
        </li>
        <li>
          <strong>מוצא.</strong> ועדה של ארגון הבריאות העולמי מ-2004 מצאה שאצל אנשים ממוצא אסייתי הסיכון עולה ב-BMI נמוך
          יותר (
          <a href={LANCET_URL} rel="noopener" target="_blank">
            Lancet 2004
          </a>
          ).
        </li>
        <li>
          <strong>זה מספר אחד.</strong> היקף מותניים, בדיקות דם והיסטוריה רפואית משלימים את התמונה, ורק רופא יכול לפרש אותה.
        </li>
      </ul>

      <h2>מקורות</h2>
      <ul>
        <li>
          <a href={WHO_FACT_SHEET_URL} rel="noopener" target="_blank">
            WHO: Obesity and overweight
          </a>
          : נוסחה, ספי 25 ו-30, ילדים לפי התייחסות גיל (נבדק ב-{REVIEWED})
        </li>
        <li>
          <a href={WHO_NLIS_URL} rel="noopener" target="_blank">
            WHO NLiS: BMI classification in adults
          </a>
          : תת משקל מתחת ל-18.5, תקין 18.5 עד 24.9 (נבדק ב-{REVIEWED})
        </li>
        <li>
          <a href={CDC_FAQ_URL} rel="noopener" target="_blank">
            CDC: BMI Frequently Asked Questions
          </a>
          : מגבלות, שריר, אחוזונים לילדים (נבדק ב-{REVIEWED})
        </li>
        <li>
          <a href={LANCET_URL} rel="noopener" target="_blank">
            WHO Expert Consultation, Lancet 2004;363:157-163
          </a>
          : BMI באוכלוסיות אסייתיות (נבדק ב-{REVIEWED})
        </li>
      </ul>
    </ToolLayout>
  )
}
