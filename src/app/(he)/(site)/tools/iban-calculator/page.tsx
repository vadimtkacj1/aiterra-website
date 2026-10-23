import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import IbanCalculator from '../../components/tools/IbanCalculator'
import { IL_IBAN_LENGTH, banks, buildIban, formatIban, mod97 } from '@/lib/iban'
import styles from './page.module.css'

const PATH = '/tools/iban-calculator'
const TITLE = 'מחשבון IBAN ישראלי'
const META_TITLE = 'מחשבון IBAN: חישוב ובדיקת IBAN לכל בנק בישראל'
const DESCRIPTION =
  'מחשבון IBAN ישראלי: בוחרים בנק, מקלידים סניף וחשבון ומקבלים IBAN תקין לפי נוסחת בנק ישראל. אפשר גם לבדוק IBAN קיים ולפרק אותו לבנק, סניף וחשבון.'

const EXAMPLE = { bank: '12', branch: '600', account: '123456' }
const example = buildIban(EXAMPLE.bank, EXAMPLE.branch, EXAMPLE.account)
const exampleIban = example.kind === 'result' ? example.iban : ''
const exampleBban = exampleIban.slice(4)
const exampleRemainder = mod97(`IL00${exampleBban}`)

const bankRows = [...banks].sort((first, second) => first.code - second.code)

const sources = [
  {
    href: 'https://www.boi.org.il/information/%D7%9E%D7%97%D7%A9%D7%91%D7%95%D7%A0%D7%99%D7%9D-%D7%95%D7%9B%D7%9C%D7%99%D7%9D/iban/',
    label: 'בנק ישראל: סימולטור IBAN, מבנה המספר, השלמת החשבון ל-13 ספרות ורשימת קודי הבנקים',
  },
  {
    href: 'https://www.boi.org.il/roles/supervisionregulation/bank-sup/banklist/',
    label: 'בנק ישראל: רשימת התאגידים הבנקאיים במערכת הבנקאות בישראל',
  },
  {
    href: 'https://www.iso.org/standard/81090.html',
    label: 'ISO 13616-1:2020, Financial services, International bank account number (IBAN)',
  },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'iban-faq-what',
    question: 'מה זה מספר IBAN?',
    answer:
      'IBAN הוא מספר חשבון בנק בפורמט בינלאומי לפי תקן ISO 13616. בישראל הוא בנוי מ-IL, שתי ספרות ביקורת, קוד בנק בן 3 ספרות, מספר סניף בן 3 ספרות ומספר חשבון בן 13 ספרות, ובסך הכול 23 תווים. משתמשים בו בעיקר כדי לקבל העברה מחו״ל, וגם גופים בארץ מבקשים אותו לפעמים בטופס פרטי בנק.',
  },
  {
    id: 'iban-faq-find',
    question: 'איפה מוצאים את ה-IBAN של החשבון שלי?',
    answer:
      'באפליקציה או באתר של הבנק, בדרך כלל במסך פרטי החשבון או באישור ניהול חשבון. אפשר גם לחשב אותו כאן מקוד הבנק, מספר הסניף ומספר החשבון. בנק ישראל מדגיש שרק הבנק שמנהל את החשבון יכול לאשר את ה-IBAN המדויק שלו, ולכן לפני העברה גדולה כדאי להשוות את התוצאה למה שמופיע בבנק.',
  },
  {
    id: 'iban-faq-check',
    question: 'איך בודקים אם IBAN תקין?',
    answer:
      'מעבירים את ארבעת התווים הראשונים לסוף, מחליפים כל אות במספר (A=10 ועד Z=35) ומחשבים שארית חלוקה ב-97. ב-IBAN תקין השארית היא 1. הבדיקה תופסת כמעט כל טעות הקלדה של ספרה אחת וכל החלפה של שתי ספרות סמוכות. היא לא בודקת שהחשבון קיים, אלא רק שהמספר בנוי נכון.',
  },
  {
    id: 'iban-faq-zeros',
    question: 'למה יש כל כך הרבה אפסים ב-IBAN ישראלי?',
    answer:
      'כי מספר החשבון ב-IBAN הוא תמיד בן 13 ספרות, ורוב מספרי החשבון בישראל קצרים יותר. לפי בנק ישראל משלימים אפסים בתחילת מספר החשבון עד 13 ספרות. באותו אופן משלימים את קוד הבנק ואת מספר הסניף לשלוש ספרות: בנק הפועלים, קוד 12, נכתב ב-IBAN כ-012.',
  },
  {
    id: 'iban-faq-swift',
    question: 'מה ההבדל בין IBAN לקוד SWIFT?',
    answer:
      'IBAN מזהה חשבון מסוים, וקוד SWIFT, שנקרא גם BIC, מזהה את הבנק עצמו. בהעברה בינלאומית השולח צריך לרוב את שניהם. את ה-IBAN אפשר לחשב כאן, אבל את קוד ה-SWIFT של הבנק שלכם קחו מאתר הבנק או מהסניף, כי יש בנקים עם כמה קודים לפי סוג ההעברה.',
  },
  {
    id: 'iban-faq-safe',
    question: 'האם בטוח לתת את מספר ה-IBAN שלי?',
    answer:
      'IBAN מאפשר להעביר אליכם כסף, ולא למשוך מהחשבון, כך שמותר לתת אותו למי שצריך לשלם לכם. עם זאת, הוא חושף את הבנק, הסניף ומספר החשבון, ולכן כדאי לשלוח אותו רק למי שאתם מכירים. המחשבון כאן לא שומר ולא שולח את הפרטים שאתם מקלידים, והחישוב נעשה בדפדפן בלבד.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function IbanCalculatorPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="IBAN ישראלי בנוי מ-IL, שתי ספרות ביקורת, קוד בנק, מספר סניף ומספר חשבון בן 13 ספרות. בוחרים בנק, מקלידים סניף וחשבון, ומקבלים את ה-IBAN לפי נוסחת בנק ישראל, או מדביקים IBAN קיים ובודקים אם הוא תקין."
      chips={['כל הבנקים', 'בדיקת תקינות', 'בלי שליחת נתונים']}
      tool={<IbanCalculator />}
      faq={faq}
      cta={{
        text: 'אוספים פרטי בנק מספקים או מלקוחות? אנחנו בונים טפסים ומערכות שמאמתים IBAN ומספרי חשבון כבר בהקלדה.',
        label: 'פיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>מבנה IBAN ישראלי</h2>
      <p>
        IBAN ישראלי תמיד בן {IL_IBAN_LENGTH} תווים. בדפוס נהוג לחלק אותו לקבוצות של ארבעה, אבל במערכות ובטפסים מקלידים
        אותו ברצף:
      </p>
      <ul>
        <li>תווים 1 עד 2: קוד המדינה, IL</li>
        <li>תווים 3 עד 4: שתי ספרות ביקורת שמחושבות מכל השאר</li>
        <li>תווים 5 עד 7: קוד הבנק, משלימים באפסים לשלוש ספרות</li>
        <li>תווים 8 עד 10: מספר הסניף, שלוש ספרות</li>
        <li>תווים 11 עד 23: מספר החשבון, משלימים באפסים בתחילתו עד 13 ספרות</li>
      </ul>

      <h3>
        דוגמה: בנק {EXAMPLE.bank}, סניף {EXAMPLE.branch}, חשבון {EXAMPLE.account}
      </h3>
      <ol>
        <li>
          משלימים: בנק <span className={styles.ltr}>012</span>, סניף <span className={styles.ltr}>600</span>, חשבון{' '}
          <span className={styles.ltr}>0000000123456</span>
        </li>
        <li>
          מחברים עם IL ושני אפסים במקום ספרות הביקורת: <span className={styles.ltr}>IL00{exampleBban}</span>
        </li>
        <li>
          מעבירים את IL00 לסוף, מחליפים I ב-18 ו-L ב-21, ומחשבים שארית חלוקה ב-97: יוצא {exampleRemainder}
        </li>
        <li>
          ספרות הביקורת הן 98 פחות השארית: <span className={styles.math}>98 − {exampleRemainder} = {exampleIban.slice(2, 4)}</span>
        </li>
        <li>
          התוצאה: <span className={styles.ltr}>{formatIban(exampleIban)}</span>
        </li>
      </ol>
      <p>
        בבדיקה עושים את אותו חישוב על ה-IBAN המלא, עם ספרות הביקורת: אם השארית היא 1, המספר תקין. כך עובדים גם
        הסימולטור של בנק ישראל וגם המחשבון שבדף.
      </p>

      <h2>קודי הבנקים בישראל</h2>
      <p>
        קוד הבנק הוא המספר שמופיע גם בשיק ובאישור ניהול חשבון. הרשימה לפי סימולטור ה-IBAN של בנק ישראל:
      </p>
      <div className={styles.tableWrap} role="region" aria-label="קודי בנקים" tabIndex={0}>
        <table className={styles.table}>
          <caption>קוד בנק ואיך הוא נכתב ב-IBAN</caption>
          <thead>
            <tr>
              <th scope="col">קוד</th>
              <th scope="col">ב-IBAN</th>
              <th scope="col">בנק</th>
            </tr>
          </thead>
          <tbody>
            {bankRows.map((bank) => (
              <tr key={bank.code}>
                <th scope="row">{bank.code}</th>
                <td>
                  <span className={styles.ltr}>{String(bank.code).padStart(3, '0')}</span>
                </td>
                <td>{bank.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>טעויות נפוצות</h2>
      <h3>מספר חשבון עם קוד הסניף בתוכו</h3>
      <p>
        באפליקציות של חלק מהבנקים מספר החשבון מוצג יחד עם הסניף, למשל 600-123456. במחשבון מקלידים כל אחד בשדה שלו.
        אם מקלידים את שניהם בשדה החשבון, יוצא IBAN תקין מבחינת ספרות הביקורת, אבל של חשבון אחר.
      </p>
      <h3>בדיקה תקינה לא אומרת שהחשבון קיים</h3>
      <p>
        ספרות הביקורת מוודאות שהמספר הוקלד נכון, לא שהחשבון פתוח ושייך למי שמסר אותו. לפני העברה ראשונה לספק חדש כדאי
        לאמת את הפרטים מול אישור ניהול חשבון.
      </p>

      <h2>מקורות</h2>
      <ul className={styles.sources}>
        {sources.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noopener" target="_blank">
              {source.label}
            </a>
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        המבנה, הנוסחה ורשימת הבנקים נבדקו מול הסימולטור של בנק ישראל ב-23 באוקטובר 2026.
      </p>
    </ToolLayout>
  )
}
