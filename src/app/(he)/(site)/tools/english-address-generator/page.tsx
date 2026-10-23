import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import EnglishAddressGenerator from '../../components/tools/EnglishAddressGenerator'
import { ADDRESS_REVIEWED, ADDRESS_REVIEWED_LABEL, ZIP_LOOKUP_URL } from '@/lib/english-address'
import styles from '../word-counter/page.module.css'

const PATH = '/tools/english-address-generator'
const TITLE = 'איך כותבים כתובת באנגלית'
const META_TITLE = 'איך כותבים כתובת באנגלית: מחולל כתובת ישראלית'
const DESCRIPTION =
  'איך כותבים כתובת באנגלית? מקלידים כתובת בעברית ומקבלים אותה בסדר הנכון לטפסים ולמשלוחים לחו״ל, עם שם העיר באנגלית מהרשימה הממשלתית, קומה ודירה.'

const sources = [
  {
    label: 'data.gov.il: רשימת יישובים (הלשכה המרכזית לסטטיסטיקה)',
    href: 'https://data.gov.il/dataset/citiesandsettelments',
  },
  { label: 'דואר ישראל: איתור מיקוד', href: ZIP_LOOKUP_URL },
  { label: 'ויקיפדיה: Postal codes in Israel', href: 'https://en.wikipedia.org/wiki/Postal_codes_in_Israel' },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'address-faq-order',
    question: 'באיזה סדר כותבים כתובת ישראלית באנגלית?',
    answer:
      'מתחילים בשם הנמען, אחר כך מספר הבית ושם הרחוב, בשורה הבאה קומה ודירה, אחריהן העיר והמיקוד, ובשורה האחרונה ISRAEL באותיות גדולות. בניגוד לעברית, מספר הבית בא לפני שם הרחוב. מקורות שונים מציגים את המיקוד לפני העיר או אחריה, ולכן בכלי אפשר לבחור, ובמשלוח חשוב כדאי לבדוק מול החברה.',
  },
  {
    id: 'address-faq-street',
    question: 'איך כותבים את שם הרחוב באנגלית?',
    answer:
      'לשמות רחוב מוכרים, כמו הרצל או רוטשילד, הכלי נותן את האיות הנפוץ. לשמות אחרים הוא מתעתק אוטומטית, והתוצאה היא הצעה בלבד. הכלל הבטוח הוא להעתיק את האיות כפי שהוא מופיע בשלט הרחוב או בחשבון של הרשות המקומית, כי אין איות אחיד חוקי לכל הרחובות בארץ.',
  },
  {
    id: 'address-faq-zip',
    question: 'איך מוצאים את המיקוד?',
    answer:
      'המיקוד בישראל מורכב משבע ספרות ונקבע לפי הכתובת המדויקת. הכלי לא ממציא מיקוד ולא מנחש אותו. את המיקוד של הכתובת אפשר לחפש בשירות האיתור של דואר ישראל, ולהקליד אותו בשדה המיקוד. אם אין לכם מיקוד, אפשר להשאיר את השדה ריק, אבל חלק מהטפסים לחו״ל מחייבים אותו.',
  },
  {
    id: 'address-faq-apartment',
    question: 'איך כותבים דירה וקומה באנגלית?',
    answer:
      'דירה כותבים Apt. ואחריה המספר, וקומה כותבים Floor ואחריה המספר. כניסה כותבים Entrance ואחריה האות או המספר. בכלי הפרטים האלה מופיעים בשורה נפרדת מתחת לרחוב, כך שהם לא נחתכים בטפסים עם שדה מוגבל. בטפסים שיש בהם שדה אחד לכתובת אפשר לחבר את השורות בפסיקים.',
  },
  {
    id: 'address-faq-city',
    question: 'מאיפה מגיע שם העיר באנגלית?',
    answer:
      'השמות מגיעים מרשימת היישובים שבמאגר הנתונים הממשלתי data.gov.il, שהלשכה המרכזית לסטטיסטיקה מפרסמת. הרשימה נטענת בזמן שהעמוד נפתח. אם היא לא זמינה, מוצגות הערים הגדולות בלבד, ואפשר להקליד את השם באנגלית ידנית. לפעמים לעיר יש כמה איותים מקובלים, ולכן אפשר לערוך את השדה.',
  },
  {
    id: 'address-faq-privacy',
    question: 'הכתובת שלי נשמרת או נשלחת?',
    answer:
      'לא. הכתובת שאתם מקלידים נשארת בדפדפן, וההמרה נעשית שם. הדבר היחיד שהעמוד מבקש מהרשת הוא רשימת היישובים הציבורית מהמאגר הממשלתי, ובקשה זו אינה כוללת את הכתובת שלכם. כשסוגרים את העמוד הנתונים נמחקים, ואין צורך בהרשמה או בהזנת פרטי קשר כדי להשתמש בכלי.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function EnglishAddressGeneratorPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="כתובת ישראלית באנגלית נכתבת כך: מספר הבית לפני שם הרחוב, אחר כך קומה ודירה, העיר והמיקוד, ובסוף ISRAEL. מקלידים את הכתובת בעברית ומקבלים אותה מוכנה להעתקה לטפסים ולמשלוחים לחו״ל."
      chips={['שם העיר מהרשימה הממשלתית', 'קומה, דירה וכניסה', 'בלי המצאת מיקוד', 'הכתובת נשארת בדפדפן']}
      tool={<EnglishAddressGenerator />}
      faq={faq}
      cta={{
        text: 'צריכים טופס הזמנה או משלוח באתר שמטפל בכתובות לישראל ולחו״ל? אנחנו מפתחים טפסים ומערכות מותאמים.',
        label: 'לפיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>איך כותבים כתובת באנגלית: מבנה הכתובת</h2>
      <p>דוגמה לכתובת, עם נתונים לדוגמה בלבד:</p>
      <pre className={styles.ltr} dir="ltr" lang="en">
        {'Dana Cohen\n12 Herzl St.\nFloor 3, Apt. 7\nTel Aviv-Yafo\nISRAEL'}
      </pre>
      <ul>
        <li>
          <strong>שורה ראשונה:</strong> שם הנמען, באותיות לועזיות כפי שמופיע בדרכון.
        </li>
        <li>
          <strong>רחוב:</strong> מספר הבית, ואחריו שם הרחוב והסוג: St. לרחוב, Blvd. לשדרות, Rd. לדרך.
        </li>
        <li>
          <strong>קומה ודירה:</strong> Floor ו-Apt. בשורה נפרדת. כניסה כותבים Entrance.
        </li>
        <li>
          <strong>עיר ומיקוד:</strong> שם העיר באנגלית ואחריו או לפניו מיקוד בן שבע ספרות.
        </li>
        <li>
          <strong>מדינה:</strong> ISRAEL באותיות גדולות, בשורה האחרונה של משלוח בינלאומי.
        </li>
      </ul>

      <h2>על המיקוד</h2>
      <p>
        מיקוד ישראלי כולל שבע ספרות. אנחנו לא ממציאים מיקודים: לכל כתובת מיקוד משלה, והוא נקבע לפי הרחוב והמספר.
        חפשו אותו ב<a href={ZIP_LOOKUP_URL} rel="noopener" target="_blank">שירות איתור המיקוד של דואר ישראל</a> והקלידו
        אותו בכלי. מקורות שונים מציגים את המיקוד לפני העיר או אחריה, ולכן אפשר לבחור את הסדר.
      </p>

      <h2>על איות שמות רחובות</h2>
      <p>
        אין איות רשמי אחד לכל שמות הרחובות בעברית. השלט ברחוב, החשבון של הרשות המקומית ושירות המשלוחים עשויים להשתמש
        באיות שונה. לשמות מוכרים הכלי נותן איות נפוץ, ולשאר השמות הוא מתעתק לפי כללים פשוטים. התוצאה טובה בדרך כלל
        לטפסים, אבל במשלוח חשוב, בדקו את האיות מול השלט.
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
        נבדק מול המקורות ב-<time dateTime={ADDRESS_REVIEWED}>{ADDRESS_REVIEWED_LABEL}</time>.
      </p>
    </ToolLayout>
  )
}
