import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import ContractorLookup from '../../components/tools/ContractorLookup'
import {
  CLASSIFICATION_URL,
  COMPANIES_COUNT,
  CONTRACTORS_COUNT,
  CONTRACTORS_DATASET_URL,
  CONTRACTORS_DATA_LABEL,
  CONTRACTORS_REVIEWED_LABEL,
  DATASET_A1_SCOPE,
  LICENSES_COUNT,
  MAIN_BRANCH_THRESHOLD,
  RECOGNIZED_COUNT,
  REGISTRAR_URL,
  SUB_BRANCH_THRESHOLD,
  SCOPE_TABLE_FROM_LABEL,
  SCOPE_TABLE_UNTIL_LABEL,
  THRESHOLD_REGULATIONS_URL,
  branches,
  formatCount,
  formatShekels,
  scopeTable,
} from '@/lib/contractor-registry'
import styles from '../bingo-card-generator/page.module.css'

const PATH = '/tools/contractor-registry-check'
const TITLE = 'בדיקת קבלן רשום בפנקס הקבלנים'
const META_TITLE = 'בדיקת קבלן רשום: חיפוש בפנקס הקבלנים לפי שם, מספר או ח.פ.'
const DESCRIPTION = `בודקים אם קבלן רשום בפנקס הקבלנים של משרד הבינוי והשיכון: חיפוש לפי שם, מספר קבלן או ח.פ., עם הענפים, הסיווג וההיקף הכספי המותר. ${formatCount(CONTRACTORS_COUNT)} קבלנים, בחינם.`

const mainThreshold = formatShekels(MAIN_BRANCH_THRESHOLD)
const subThreshold = formatShekels(SUB_BRANCH_THRESHOLD)
const scopeCell = (thousands: number | null) => (thousands ? formatShekels(thousands * 1000) : '')
const scopeAmount = (thousands: number | null) => (thousands ? formatCount(thousands * 1000) : '')

const faq: ToolFaqEntry[] = [
  {
    id: 'contractor-faq-how',
    question: 'איך בודקים אם קבלן רשום בפנקס הקבלנים?',
    answer: `מקלידים את שם הקבלן, את מספר הקבלן שלו או את מספר הח.פ. של החברה, ולוחצים על חיפוש. הכלי מחפש במאגר הפתוח ״פנקס הקבלנים הרשומים״ של משרד הבינוי והשיכון ב-data.gov.il, שכולל ${formatCount(CONTRACTORS_COUNT)} קבלנים. אם הקבלן נמצא, מוצגים הענפים שבהם הוא רשום, הסיווג שלו בכל ענף, ההיקף הכספי המרבי לאתר אחד, והערות כמו רישיון מותלה. מכל תוצאה יש קישור לרישום הרשמי באתר רשם הקבלנים.`,
  },
  {
    id: 'contractor-faq-grade',
    question: 'מה אומר הסיווג של קבלן, למשל ג1 או ג5?',
    answer: `הסיווג בנוי מאות ומספר. האות, א׳, ב׳ או ג׳, היא קבוצת הענף: ענף בניה (100) שייך לקבוצה ג׳, וענף שיפוצים (131) לקבוצה א׳. המספר, 1 עד 5, קובע את ההיקף הכספי המרבי שהקבלן רשאי לבצע באתר בנייה אחד. לפי טבלת הסיווג שבתוקף עד ${SCOPE_TABLE_UNTIL_LABEL}, קבלן ג1 מוגבל ל-${scopeCell(scopeTable[1].c)} וקבלן ג4 ל-${scopeCell(scopeTable[4].c)}, וקבלן בסוג 5 אינו מוגבל בהיקף. הסכומים לא כוללים מע״מ, ולפי התקנות הם מתעדכנים ב-1 באפריל וב-1 באוקטובר בכל שנה.`,
  },
  {
    id: 'contractor-faq-required',
    question: 'מתי חובה לעבוד עם קבלן רשום?',
    answer: `לפי תקנות רישום קבלנים לעבודות הנדסה בנאיות (היקף כספי ומהות מקצועית), עבודה באתר בנייה אחד שהיקפה עולה על הסכום שבתקנות מותרת רק לקבלן רשום. בנוסח התקנות באתר נבו, שבדקנו ב-${CONTRACTORS_REVIEWED_LABEL}, הסכומים הם ${mainThreshold} בענף עבודה ו-${subThreshold} בענף משנה, כמו שיפוצים. עבודות שנוגעות לשלד של מבנה מבוצעות רק בידי קבלן רשום, גם בהיקף קטן יותר. הסכומים מתעדכנים ב-1 בינואר בכל שנה, ולכן כדאי לוודא את הסכום העדכני מול רשם הקבלנים.`,
  },
  {
    id: 'contractor-faq-recognized',
    question: 'מה ההבדל בין קבלן רשום לקבלן מוכר?',
    answer: `קבלן רשום הוא כל מי שמופיע בפנקס הקבלנים. קבלן מוכר הוא קבלן רשום שהוכר גם לביצוע עבודות עבור משרדי הממשלה, והוא מסומן במאגר במילים ״מוכר בסיווג״ עם מספר הסוג. נכון ל-${CONTRACTORS_DATA_LABEL}, ${formatCount(RECOGNIZED_COUNT)} קבלנים מתוך ${formatCount(CONTRACTORS_COUNT)} מסומנים כמוכרים בענף אחד לפחות. מי שמזמין שיפוץ או בנייה פרטית צריך קבלן רשום בענף ובסיווג המתאימים. ההכרה לעבודות ממשלתיות חשובה בעיקר למכרזים.`,
  },
  {
    id: 'contractor-faq-id',
    question: 'אפשר לבדוק קבלן רשום לפי תעודת זהות?',
    answer: `לא במאגר הפתוח. אצל חברות מופיע מספר הח.פ., ולכן אפשר לחפש לפיו. אצל קבלן שהוא אדם פרטי המאגר לא כולל מספר זהות, ולכן מחפשים לפי שם או לפי מספר הקבלן שמופיע ברישיון שלו. נכון ל-${CONTRACTORS_DATA_LABEL}, ל-${formatCount(COMPANIES_COUNT)} מהקבלנים במאגר יש מספר ח.פ., והשאר רשומים בשמם בלבד.`,
  },
  {
    id: 'contractor-faq-missing',
    question: 'הקבלן לא מופיע בחיפוש. מה זה אומר?',
    answer:
      'קודם בודקים את הכתיב: קבלן פרטי רשום לפי שם משפחה ואחריו שם פרטי, וחברה רשומה בשם המשפטי שלה, שלא תמיד זהה לשם המותג. אם גם חיפוש של מילה אחת מהשם ושל מספר הקבלן לא מחזיר תוצאה, הקבלן לא מופיע בקובץ שהמשרד פרסם. ייתכן שהוא נרשם בימים האחרונים, ולכן בודקים גם באתר רשם הקבלנים, שמתעדכן מדי יום. מי שלא מופיע בפנקס אינו קבלן רשום, גם אם הוא מציג תעודה אחרת.',
  },
  {
    id: 'contractor-faq-fresh',
    question: 'עד כמה הנתונים עדכניים?',
    answer: `הכלי שולף את הנתונים בכל חיפוש ישירות מ-data.gov.il ומציג את תאריך העדכון של הקובץ. כשבדקנו ב-${CONTRACTORS_REVIEWED_LABEL}, הקובץ עודכן ב-${CONTRACTORS_DATA_LABEL}. הפנקס הרשמי באתר רשם הקבלנים מתעדכן מדי יום, ולכן לפני חתימה על הסכם פותחים גם את הרישום הרשמי, דרך הקישור שמופיע מתחת לתוצאה.`,
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function ContractorRegistryCheckPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="מקלידים שם, מספר קבלן או ח.פ. ורואים אם הקבלן רשום בפנקס הקבלנים של משרד הבינוי והשיכון, באילו ענפים, באיזה סיווג ועד איזה היקף כספי מותר לו לעבוד."
      chips={[`${formatCount(CONTRACTORS_COUNT)} קבלנים רשומים`, 'ענפים וסיווג', 'היקף כספי מותר', 'בלי הרשמה']}
      tool={<ContractorLookup />}
      faq={faq}
      cta={{
        text: 'קבלנים ובעלי מקצוע: אתר עם הפרויקטים, ההמלצות ומספר הקבלן שלכם נותן ללקוח לבדוק אתכם ולפנות בלי לחפש בפנקס.',
        label: 'בניית אתר תדמית',
        href: '/services/brochure',
      }}
    >
      <h2>מה הכלי בודק</h2>
      <p>
        רשם הקבלנים במשרד הבינוי והשיכון מנהל את פנקס הקבלנים לפי חוק רישום קבלנים לעבודות הנדסה בנאיות, התשכ״ט-1969.
        המשרד מפרסם את הפנקס כקובץ פתוח ב-data.gov.il, בשם{' '}
        <a href={CONTRACTORS_DATASET_URL} rel="noopener" target="_blank">
          פנקס הקבלנים הרשומים
        </a>
        . נכון ל-{CONTRACTORS_DATA_LABEL} יש בו {formatCount(CONTRACTORS_COUNT)} קבלנים ו-{formatCount(LICENSES_COUNT)}{' '}
        רישומים, רישום אחד לכל ענף שבו הקבלן רשאי לעבוד.
      </p>
      <p>
        הכלי מציג לכל קבלן את השם, מספר הקבלן, היישוב, תאריך הרישום, הענפים והסיווג. הקובץ כולל גם טלפון, מייל ושמות
        של עובדים מקצועיים, ואותם אנחנו לא מציגים.
      </p>

      <h2>דוגמה לחיפוש</h2>
      <p>
        חיפוש של ״דניה סיבוס״ מחזיר את קבלן מספר 20836. נכון ל-{CONTRACTORS_DATA_LABEL} הוא רשום בארבעה ענפים: בניה
        (100) בסיווג ג5, כבישים תשתית ופיתוח (200) בסיווג ג5, קווי מים, ביוב וניקוז (260) בסיווג ב5 וגשרים (300)
        בסיווג ג5. סוג 5 אומר שאין הגבלה על ההיקף הכספי.
      </p>
      <p>
        אצל קבלן שיפוצים קטן התמונה אחרת: ענף אחד, שיפוצים (131), בסיווג א-ק או א1, עם תקרה של{' '}
        {scopeCell(scopeTable[0].a)} או {scopeCell(scopeTable[1].a)} לאתר אחד.
      </p>

      <h2>ההיקף הכספי המרבי לפי סיווג</h2>
      <p>
        הסכומים הם ההיקף שקבלן רשאי לבצע באתר בנייה אחד, בלי מע״מ, לפי טבלת הסיווג שבתוקף מ-{SCOPE_TABLE_FROM_LABEL}{' '}
        עד {SCOPE_TABLE_UNTIL_LABEL} ב
        <a href={CLASSIFICATION_URL} rel="noopener" target="_blank">
          עמוד סיווג הקבלנים של משרד הבינוי והשיכון
        </a>
        . לפי אותו עמוד, הסכומים משתנים ב-1 באפריל וב-1 באוקטובר בכל שנה לפי מדד תשומות הבנייה למגורים, ובבנייה
        למגורים יש גם תקרה במ״ר.
      </p>
      <p>
        במאגר הפתוח, נכון ל-{CONTRACTORS_DATA_LABEL}, עדיין רשומים הסכומים של התקופה הקודמת, למשל{' '}
        {formatShekels(DATASET_A1_SCOPE)} לסוג א1 במקום {scopeCell(scopeTable[1].a)}. לכן בתוצאת החיפוש מוצג הסכום
        מהטבלה שבתוקף, לפי הקבוצה והסוג של הקבלן.
      </p>
      <div className={styles.tableWrap} role="region" aria-label="היקף כספי מרבי לפי קבוצה וסוג" tabIndex={0}>
        <table className={styles.table}>
          <caption>
            היקף כספי מרבי לאתר אחד בשקלים, בתוקף מ-{SCOPE_TABLE_FROM_LABEL} עד {SCOPE_TABLE_UNTIL_LABEL}
          </caption>
          <thead>
            <tr>
              <th scope="col">סוג</th>
              <th scope="col">קבוצה א׳</th>
              <th scope="col">קבוצה ב׳</th>
              <th scope="col">קבוצה ג׳</th>
            </tr>
          </thead>
          <tbody>
            {scopeTable.map((row) => (
              <tr key={row.grade}>
                <th scope="row">{row.grade}</th>
                <td>{scopeAmount(row.a)}</td>
                <td>{scopeAmount(row.b)}</td>
                <td>{scopeAmount(row.c)}</td>
              </tr>
            ))}
            <tr>
              <th scope="row">5</th>
              <td>ללא הגבלה</td>
              <td>ללא הגבלה</td>
              <td>ללא הגבלה</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>סוג ק קיים רק בענף שיפוצים (131), בקבוצה א׳.</p>

      <h2>הענפים בפנקס הקבלנים</h2>
      <p>
        בפנקס יש {branches.length} ענפים. לכל ענף קוד בן שלוש ספרות וקבוצת סיווג קבועה. בעמודה האחרונה מופיע מספר
        הרישומים בענף נכון ל-{CONTRACTORS_DATA_LABEL}.
      </p>
      <div className={styles.tableWrap} role="region" aria-label="הענפים בפנקס הקבלנים" tabIndex={0}>
        <table className={styles.table}>
          <caption>ענפי הרישום, קבוצת הסיווג ומספר הרישומים</caption>
          <thead>
            <tr>
              <th scope="col">קוד</th>
              <th scope="col">ענף</th>
              <th scope="col">קבוצה</th>
              <th scope="col">רישומים</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch) => (
              <tr key={branch.code}>
                <th scope="row">{branch.code}</th>
                <td>{branch.name}</td>
                <td>{branch.group}׳</td>
                <td>{formatCount(branch.count)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>מה בודקים לפני שחותמים עם קבלן</h2>
      <ul>
        <li>שהקבלן רשום בענף של העבודה: שיפוץ דירה הוא ענף 131, ובניית בית היא ענף 100.</li>
        <li>שההיקף הכספי של העבודה לא עולה על התקרה של הסיווג שלו.</li>
        <li>שאין ליד הענף הערה כמו ״רישיון מותלה״ או ״אינה רשאית לבצע עבודות חדשות״.</li>
        <li>
          שהשם ומספר הקבלן בהצעת המחיר זהים לרישום. את החברה עצמה אפשר לבדוק גם ב
          <Link href="/tools/company-lookup">בדיקת חברה לפי ח.פ.</Link>
        </li>
      </ul>
      <p>הכלי מציג מידע מהמרשם הציבורי. הוא לא בודק את איכות העבודה, ביטוחים או חובות של הקבלן.</p>

      <h2>מקורות</h2>
      <ul>
        <li>
          <a href={CONTRACTORS_DATASET_URL} rel="noopener" target="_blank">
            data.gov.il: פנקס הקבלנים הרשומים, משרד הבינוי והשיכון
          </a>
          : שמות, ענפים, סיווג והיקף. נבדק מול ה-API ב-{CONTRACTORS_REVIEWED_LABEL}, {formatCount(LICENSES_COUNT)}{' '}
          רשומות, הקובץ עודכן ב-{CONTRACTORS_DATA_LABEL}.
        </li>
        <li>
          <a href={REGISTRAR_URL} rel="noopener" target="_blank">
            אתר פנקס הקבלנים של רשם הקבלנים
          </a>
          : הרישום הרשמי של כל קבלן, מתעדכן מדי יום.
        </li>
        <li>
          <a href={CLASSIFICATION_URL} rel="noopener" target="_blank">
            משרד הבינוי והשיכון: סיווג קבלנים
          </a>
          : טבלת הסיווג שבתוקף, משמעות הסוגים, מועדי העדכון של הסכומים וסוג ק בענף 131.
        </li>
        <li>
          <a href={THRESHOLD_REGULATIONS_URL} rel="noopener" target="_blank">
            תקנות רישום קבלנים לעבודות הנדסה בנאיות (היקף כספי ומהות מקצועית), התשמ״ד-1984, באתר נבו
          </a>
          : הסכומים שמעליהם נדרש קבלן רשום ועבודות שלד.
        </li>
      </ul>
      <p className={styles.reviewed}>הנתונים והמקורות נבדקו ב-{CONTRACTORS_REVIEWED_LABEL}.</p>
    </ToolLayout>
  )
}
