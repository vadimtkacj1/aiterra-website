import Link from 'next/link'
import type { ReactNode } from 'react'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import HebrewWordsInEnglish from '../../components/tools/HebrewWordsInEnglish'
import {
  CITY_NAMES_CHECKED,
  CITY_NAMES_CHECKED_LABEL,
  CITY_NAMES_PATH,
  cityNameSources,
  cityNames,
  isTruncatedInRegister,
  type CityName,
} from '@/lib/hebrew-words-in-english'
import styles from './page.module.css'

const TITLE = 'שמות ערים בישראל באנגלית'
const META_TITLE = 'שמות ערים בישראל באנגלית: איות רשמי ואיות מקובל'
const DESCRIPTION =
  'איך כותבים באנגלית את שמות הערים בישראל: חיפוש בין 131 ערים ויישובים, האיות הרשמי ברשם של רשות האוכלוסין וההגירה והאיות המקובל, למשל באר שבע, פתח תקווה וראשון לציון.'

const exampleHebrew = ['באר שבע', 'פתח תקווה', 'ראשון לציון', 'אילת', 'צפת', 'עכו', 'בני ברק', 'קרית שמונה']
const examples = exampleHebrew
  .map((hebrew) => cityNames.find((city) => city.hebrew === hebrew))
  .filter((city): city is CityName => Boolean(city))
const truncated = cityNames.filter(isTruncatedInRegister)

const Latin = ({ children }: { children: ReactNode }) => (
  <span dir="ltr" className={styles.ltr}>
    {children}
  </span>
)

const faq: ToolFaqEntry[] = [
  {
    id: 'cities-faq-beersheba',
    question: 'איך כותבים באר שבע באנגלית?',
    answer:
      'באנגלית נפוצים Beersheba ו-Be’er Sheva, ובדפי מידע גם Beer Sheva. הרשם של רשות האוכלוסין וההגירה רושם את היישוב BE’ER SHEVA. אין איות אחד שחל על כל מסמך, ולכן בטפסים רשמיים ובכרטיסי טיסה משתמשים באיות שמופיע בטופס או בהזמנה עצמה.',
  },
  {
    id: 'cities-faq-official',
    question: 'מה האיות הרשמי של שם עיר באנגלית?',
    answer:
      'המקור שבדקנו הוא רשם היישובים של רשות האוכלוסין וההגירה, שמתפרסם ב-data.gov.il ומכיל לכל יישוב שם בעברית ושם באותיות לטיניות. האיות שם עקבי אך שונה לעיתים ממה שרואים בשילוט, באתרים ובחדשות, למשל RISHON LEZIYYON לראשון לציון ו-PETAH TIQWA לפתח תקווה. לא מצאנו כלל שמחייב לכתוב כך בכל מסמך.',
  },
  {
    id: 'cities-faq-differ',
    question: 'למה האיות ברשם שונה מהאיות שאני מכיר?',
    answer:
      'הרשם משתמש בתעתיק עקבי, למשל Q לאות ק ו-Z לאות צ, בעוד שבשימוש היומיומי כותבים K ו-TZ. בשמות רבים ההבדל הוא אות אחת, ובאחרים כמו אילת (ELAT מול Eilat) או עכו (AKKO מול Acre) השמות שונים יותר.',
  },
  {
    id: 'cities-faq-truncated',
    question: 'למה חלק מהשמות ברשם נחתכים באמצע?',
    answer:
      'בשדה השם הלועזי ברשם נראה שיש מגבלה של 20 תווים: מודיעין-מכבים-רעות מופיעה שם כ-MODI’IN-MAKKABBIM-RE. בטבלה סימנו כל שם כזה. במסמכים כותבים את השם המלא באיות מקובל.',
  },
  {
    id: 'cities-faq-address',
    question: 'איזה איות לבחור בכתובת למשלוח לחו״ל?',
    answer:
      'בכתובת לחו״ל מקובל האיות שרואים באתר חברת השילוח או בטופס, ובמקרה של ספק האיות המקובל באנגלית עדיף על פני האיות הרשמי. בכל מקרה כדאי לצרף מיקוד וטלפון. לבניית כתובת שלמה אפשר להשתמש בכלי כתובת באנגלית שבאתר.',
  },
  {
    id: 'cities-faq-missing',
    question: 'העיר או היישוב שלי לא ברשימה. מה עושים?',
    answer:
      'הטבלה כוללת 131 ערים ויישובים נבחרים מתוך כ-1,300 ברשם. את האיות הרשמי של יישוב אחר אפשר לבדוק ברשם עצמו ב-data.gov.il. אם לא צריך איות רשמי, כותבים את האיות שמופיע באתר העירייה או המועצה.',
  },
]

export const metadata = toolMetadata({ path: CITY_NAMES_PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function HebrewWordsInEnglishPage() {
  return (
    <ToolLayout
      path={CITY_NAMES_PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="באר שבע באנגלית היא Beersheba או Be’er Sheva, ואילו ברשם היישובים של רשות האוכלוסין וההגירה היא BE’ER SHEVA. כאן מחפשים עיר בעברית או באנגלית ורואים לכל אחת את האיות הרשמי ברשם ואת האיות המקובל, בין 131 ערים ויישובים."
      chips={['131 ערים ויישובים', 'איות רשמי ומקובל', 'חיפוש בעברית ובאנגלית', 'בלי הרשמה']}
      tool={<HebrewWordsInEnglish />}
      faq={faq}
      cta={{
        text: 'בונים אתר או חנות ללקוחות שקוראים אנגלית? אנחנו מקימים חנויות אינטרנט עם כתובות, שמות ותוכן שמתאימים ללקוחות מחו״ל.',
        label: 'לבניית חנות אינטרנטית',
        href: '/services/ecommerce',
      }}
    >
      <h2>איות רשמי ואיות מקובל</h2>
      <p>
        לכל יישוב בישראל יש שני איותים באותיות לטיניות. הראשון רשום ברשם היישובים של רשות האוכלוסין וההגירה, שמתפרסם
        כמאגר פתוח ב-
        <a href={cityNameSources.register.href} rel="noopener" target="_blank">
          data.gov.il
        </a>
        . השני הוא האיות שמופיע בעיתונות, בחברות התעופה ובאתרי תיירות, והוא אינו אחיד. הטבלה מציגה את שניהם זה לצד זה.
      </p>
      <p>
        האיות הרשמי נבדק מול הרשם ב-<time dateTime={CITY_NAMES_CHECKED}>{CITY_NAMES_CHECKED_LABEL}</time>. האיות המקובל
        נבחר על ידינו לפי השימוש הנפוץ, ואינו רשמי.
      </p>

      <h2>דוגמאות להבדלים</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>איות רשמי מול איות מקובל במספר ערים</caption>
          <thead>
            <tr>
              <th scope="col">בעברית</th>
              <th scope="col">איות מקובל</th>
              <th scope="col">איות רשמי ברשם</th>
            </tr>
          </thead>
          <tbody>
            {examples.map((city) => (
              <tr key={city.hebrew}>
                <th scope="row">{city.hebrew}</th>
                <td>
                  <Latin>{city.common}</Latin>
                </td>
                <td>
                  <Latin>{city.official}</Latin>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>איך נוצרים ההבדלים</h2>
      <p>
        הרשם משתמש בתעתיק עקבי: האות ק נכתבת Q והאות צ נכתבת Z. בשימוש היומיומי כותבים K ו-TZ, ולכן קרית שמונה היא
        QIRYAT SHEMONA ברשם ו-Kiryat Shmona בעיתונות. בכמה ערים השם שונה יותר, כמו אילת (ELAT ברשם, Eilat באנגלית) ועכו
        (AKKO ברשם, Acre בתיירות ובהיסטוריה).
      </p>
      <p>
        בשדה הלועזי של הרשם נראה שיש גבול של 20 תווים, ולכן שם ארוך נחתך באמצע:{' '}
        {truncated.map((city) => (
          <Latin key={city.hebrew}>{city.official}</Latin>
        ))}
        .
      </p>

      <h2>איזה איות להשתמש</h2>
      <ul>
        <li>בטופס או בהזמנה שמבקשים בהם איות מסוים, משתמשים בו.</li>
        <li>בכתובת למשלוח לחו״ל האיות המקובל עדיף, כי הוא זה שמופיע לרוב באתרי קניות ובחברות שילוח.</li>
        <li>במסמך שמגיש גוף ממשלתי בודקים בטופס עצמו איזה איות נדרש.</li>
      </ul>
      <p>
        לבניית כתובת שלמה תעזור <Link href="/tools/english-address-generator">כתובת באנגלית</Link>, ולשם פרטי או
        משפחה יש <Link href="/tools/hebrew-name-to-english">איך כותבים שם באנגלית</Link>.
      </p>

      <h2>מקורות</h2>
      <ul className={styles.sources}>
        <li>
          <a href={cityNameSources.register.href} rel="noopener" target="_blank" lang="en" dir="ltr">
            {cityNameSources.register.label}
          </a>
          <span> (מקור רשמי לאיות הרשמי בלבד)</span>
        </li>
      </ul>
      <p className={styles.reviewed}>
        האיות המקובל אינו מקור רשמי. נבדק מול הרשם ב-<time dateTime={CITY_NAMES_CHECKED}>{CITY_NAMES_CHECKED_LABEL}</time>.
      </p>
    </ToolLayout>
  )
}
