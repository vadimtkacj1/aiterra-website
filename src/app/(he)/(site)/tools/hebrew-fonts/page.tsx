import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import HebrewFontPicker from '../../components/tools/HebrewFontPicker'
import { FONTS_CHECKED_ON, hebrewFonts, nikudCount } from '@/lib/hebrew-fonts'
import styles from './page.module.css'

const PATH = '/tools/hebrew-fonts'
const TITLE = 'פונטים בעברית'
const META_TITLE = 'פונטים בעברית חינם מגוגל, עם תצוגה אונליין'
const TOTAL = hebrewFonts.length
const DESCRIPTION = `פונטים בעברית חינם מ-Google Fonts: מקלידים את שם העסק, משווים ${TOTAL} פונטים בגדלים ובמשקלים ומעתיקים קוד לאתר. כולם ברישיון OFL שמתיר שימוש מסחרי.`

const handwritingFonts = hebrewFonts.filter((font) => font.category === 'handwriting').map((font) => font.family)
const handwritingList = `${handwritingFonts.slice(0, -1).join(', ')} ו-${handwritingFonts.at(-1)}`

const OFL_URL = 'https://openfontlicense.org'
const GOOGLE_FONTS_URL = 'https://fonts.google.com'
const CSS2_DOCS_URL = 'https://developers.google.com/fonts/docs/css2'
const SHOPIFY_FONTS_URL = 'https://shopify.dev/docs/storefronts/themes/architecture/settings/fonts'
const WIX_LANGUAGES_URL = 'https://support.wix.com/en/article/wix-editor-adding-language-fonts'
const WIX_UPLOAD_URL = 'https://support.wix.com/en/article/uploading-and-using-your-own-fonts'
const WORDPRESS_65_URL = 'https://wordpress.org/news/2024/04/regina/'

const faq: ToolFaqEntry[] = [
  {
    id: 'fonts-faq-commercial',
    question: 'הפונטים כאן באמת חינמיים לשימוש מסחרי?',
    answer: `כן. כל ${TOTAL} הפונטים ברשימה מופיעים ב-Google Fonts תחת רישיון SIL Open Font License 1.1, ובדקנו את זה מול הנתונים של Google Fonts ומול קובץ הרישיון של כל פונט. הרישיון מתיר להשתמש בפונט בלי תשלום, גם באתר, בלוגו ובחומר מודפס של עסק. מה שאסור הוא למכור את הפונט עצמו כמוצר בפני עצמו.`,
  },
  {
    id: 'fonts-faq-download',
    question: 'איך מורידים פונט עברי ומשתמשים בו בוורד?',
    answer:
      'לוחצים בכרטיס של הפונט על Google Fonts ומורידים אותו מהדף שלו שם. מקבלים קובץ ZIP, מחלצים אותו, ובחלונות לוחצים על קובץ הפונט בלחצן הימני ובוחרים בהתקנה. בפעם הבאה שתפתחו את Word, הפונט יופיע ברשימת הפונטים. לאתר לא צריך להוריד כלום: מספיק הקוד שהכלי מעתיק.',
  },
  {
    id: 'fonts-faq-handwriting',
    question: 'יש פונטים בעברית בכתב יד?',
    answer: `כן. ב-Google Fonts יש ${handwritingFonts.length} פונטים עם עברית שמסווגים ככתב יד: ${handwritingList}. בכלי בוחרים ״כתב יד״ בסינון ורואים את כולם עם הטקסט שלכם. פונטים כאלה מתאימים לכותרות, להזמנות ולחומר שיווקי, ופחות לטקסט ארוך. אם צריך עוד אפשרויות לכותרות, כדאי להסתכל גם על פונטי התצוגה.`,
  },
  {
    id: 'fonts-faq-popular',
    question: 'מה הפונטים העבריים הפופולריים ב-Google Fonts?',
    answer: `לפי דירוג הפופולריות של Google Fonts, מבין הפונטים שתומכים בעברית מובילים Open Sans, Google Sans, Arimo ו-Rubik. בכולם העברית היא אחד מכמה כתבים. מבין הפונטים שהעברית היא הכתב הראשי שלהם, Heebo ו-Assistant מדורגים הכי גבוה. הכלי מסדר את כל הרשימה לפי הדירוג הזה, נכון ל${FONTS_CHECKED_ON}.`,
  },
  {
    id: 'fonts-faq-logo',
    question: 'אפשר לעצב לוגו עם פונט מהרשימה?',
    answer:
      'כן. לפי רישיון OFL, החובה להישאר תחת הרישיון לא חלה על מסמכים שנוצרו עם הפונט, ולוגו שעיצבתם הוא עבודה כזו. חשוב לזכור שהרישיון לא נותן בלעדיות, וכל עסק אחר יכול להשתמש באותו פונט. לוגו שהוא רק שם העסק מוקלד בפונט חינמי עלול להיראות כמו לוגואים אחרים, ולכן כדאי לעבד את צורות האותיות בלוגו עצמו.',
  },
  {
    id: 'fonts-faq-nikud',
    question: 'איך מוצאים פונט עברי עם ניקוד?',
    answer: `מסמנים בכלי ״רק פונטים עם ניקוד״. הסינון מבוסס על רשימת התווים ש-Google Fonts מפרסמת לכל פונט, ולפיה ${nikudCount} מתוך ${TOTAL} הפונטים כוללים את כל סימני הניקוד הבסיסיים. כדאי להקליד בתיבה מילה מנוקדת ולבדוק בתצוגה, כי המיקום של הסימנים מתחת לאותיות ומעליהן משתנה מפונט לפונט.`,
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function HebrewFontsPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede={`מקלידים את שם העסק ורואים אותו בכל ${TOTAL} הפונטים עם עברית ב-Google Fonts. משווים גדלים ומשקלים, מסננים לפי סגנון ומעתיקים קוד מוכן לאתר. כל הפונטים חינמיים, גם לשימוש מסחרי.`}
      chips={[`${TOTAL} פונטים עם עברית`, 'רישיון OFL, מותר גם לעסקים', 'קוד מוכן ל-HTML ול-CSS', 'בלי הרשמה']}
      tool={<HebrewFontPicker />}
      faq={faq}
      cta={{
        text: 'רוצים זהות מותגית עם פונט, לוגו וצבעים שעובדים יחד?',
        label: 'לשירותי המיתוג',
        href: '/services/branding',
      }}
    >
      <h2>איך בוחרים פונט עברי לאתר של עסק</h2>
      <p>הכלי למעלה עוזר לצמצם את הרשימה. כמה דברים שכדאי לבדוק לפני שמחליטים:</p>
      <ul>
        <li>
          <strong>קריאות בגודל קטן.</strong> בעברית יש אותיות דומות, כמו ב ו-כ, ד ו-ר, ה ו-ח, ו ו-ז. הקטינו את
          הגודל ל-16 פיקסלים ובדקו שהן עדיין נבדלות. לטקסט רץ מתאימים בדרך כלל פונטים ללא סריפים כמו Heebo,
          Assistant או Rubik. פונט עם סריפים כמו Frank Ruhl Libre נותן מראה קלאסי יותר.
        </li>
        <li>
          <strong>משקלים לכותרות ולטקסט.</strong> בעברית אין אותיות גדולות, ולכן ההבדל בין כותרת לטקסט נשען על
          גודל ועל משקל. לטקסט רץ צריך משקל רגיל (400) ובדרך כלל גם מודגש (700). לכותרות אפשר לבחור פונט אחר, גם
          פונט תצוגה, ובמצב ״כותרת וטקסט יחד״ רואים איך השניים נראים ביחד.
        </li>
        <li>
          <strong>מספרים, סימני פיסוק ומילים באנגלית.</strong> בשורה בעברית, מספרים ומילים באנגלית נכתבים משמאל
          לימין. בדקו טלפון, מחיר עם ₪ ושעה. ודאו גם שהדף מוגדר כ-<code>dir=&quot;rtl&quot;</code>, אחרת נקודה או
          סוגריים בסוף שורה מעורבת יכולים לקפוץ לצד הלא נכון.
        </li>
        <li>
          <strong>אותיות לטיניות.</strong> כל הפונטים ברשימה כוללים גם אותיות לטיניות, אבל לא בכולם הן נראות טוב
          ליד העברית. אם שם המותג באנגלית, הקלידו אותו בתיבה ובדקו את השילוב.
        </li>
      </ul>
      <p>
        הפונט הוא חלק מהזהות של העסק, לצד הלוגו והצבעים. כתבנו על זה עוד במדריך{' '}
        <Link href="/blog/digital-branding-guide">מיתוג דיגיטלי לעסקים</Link>.
      </p>

      <h2>איך מוסיפים פונט מ-Google Fonts לאתר</h2>
      <p>בוחרים בכלי פונט ומשקל, מעתיקים את הקוד, ואז ממשיכים לפי המערכת שעליה בנוי האתר.</p>
      <h3>Wix</h3>
      <p>
        בעורך של Wix פותחים את רשימת הפונטים של רכיב טקסט ומוסיפים שם עברית כשפה. אחרי זה הפונטים שתומכים בעברית
        מופיעים בכל רשימות הפונטים באתר. אם הפונט שבחרתם לא שם, אפשר להעלות אותו בקובץ TTF, OTF, WOFF או WOFF2.
        פונט שהעליתם לא יעבוד בבלוג של Wix ובחלק מהאפליקציות.
      </p>
      <h3>WordPress</h3>
      <p>
        בתבנית בלוקים, מגרסה 6.5, יש בעורך האתר ספריית פונטים שמתקינה פונטים מ-Google Fonts בלי קוד. בתבנית
        קלאסית, בהרבה תבניות בוחרים פונט בהגדרות. אם הפונט לא שם, מוסיפים את הקוד שהעתקתם ל-head דרך תבנית בת או
        תוסף להוספת קוד.
      </p>
      <h3>Shopify</h3>
      <p>
        ספריית הפונטים של Shopify כוללת רק תווים לטיניים וסימני מטבע, כך שאותיות עבריות לא מגיעות ממנה. מעתיקים
        בכלי את הקוד בפורמט HTML, מדביקים את תגי ה-link בקובץ <code>theme.liquid</code> בתוך ה-head, ואת שורת{' '}
        <code className={styles.term}>font-family</code> בקובץ ה-CSS של התבנית. כדאי לשכפל את התבנית לפני
        שעורכים את הקוד שלה.
      </p>
      <h3>אתר שנבנה בקוד</h3>
      <p>
        מדביקים את תגי ה-link בתוך ה-head, או את שורת ה-<code>@import</code> בראש קובץ ה-CSS. בפרויקט Next.js
        אפשר להשתמש ב-<code>next/font/google</code>, שמגיש את קובצי הפונט מהאתר עצמו.
      </p>

      <h2>מה מותר לעשות עם פונט ברישיון OFL</h2>
      <p>
        כל הפונטים בכלי מופיעים ב-Google Fonts תחת SIL Open Font License, גרסה 1.1. בדקנו את זה בנתונים ש-Google
        Fonts מפרסמת על כל פונט ובקובץ הרישיון שמגיע עם הפונט. לפי לשון הרישיון:
      </p>
      <ul>
        <li>מותר להשתמש בפונט, להעתיק אותו, להטמיע אותו באתר או בתוכנה ולשנות אותו, בלי תשלום.</li>
        <li>
          אסור למכור את הפונט עצמו כמוצר בפני עצמו. מותר לצרף אותו לתוכנה, גם לתוכנה שנמכרת, כל עוד מצורפות אליו
          הודעת זכויות היוצרים והרישיון.
        </li>
        <li>
          מי שמשנה את הפונט ומפיץ את הגרסה שלו לא יכול לקרוא לה בשם השמור של הפונט המקורי בלי אישור בכתב, וחייב
          להפיץ אותה תחת אותו רישיון.
        </li>
        <li>
          החובה להישאר תחת הרישיון לא חלה על מסמכים שנוצרו עם הפונט. אתר, לוגו, מצגת או עלון שעיצבתם בו לא צריכים
          להיות תחת OFL.
        </li>
      </ul>
      <p>
        הרישיון לא נותן בלעדיות: כל אחד יכול להשתמש באותו פונט. הנוסח המלא נמצא באתר{' '}
        <a href={OFL_URL} rel="noopener" target="_blank" lang="en">
          openfontlicense.org
        </a>
        .
      </p>

      <h2>אתר מהיר: טוענים רק את מה שמשתמשים בו</h2>
      <p>
        לפי התיעוד של Google Fonts, בקשה של סגנונות שלא משתמשים בהם עלולה לגרום לגולשים להוריד יותר נתוני פונט
        ממה שצריך, ולהאט את הטעינה. לכן הקוד שהכלי מעתיק כולל רק את המשקל שבחרתם. אם צריך גם מודגש, מוסיפים אותו
        לכתובת, למשל <code>wght@400;700</code>.
      </p>
      <p>
        הפרמטר <code>display=swap</code>, שכבר נמצא בקוד, מציג את הטקסט בפונט חלופי עד שהפונט נטען, כך שהגולש לא
        מחכה מול טקסט ריק. אם הפונט משמש רק ללוגו או לכותרת אחת, אפשר להוסיף לכתובת את הפרמטר <code>text=</code>{' '}
        עם האותיות שצריך. לפי Google, זה יכול להקטין את קובץ הפונט בעד 90%.
      </p>
      <p>כך עובד גם הכלי הזה: כל פונט נטען רק כשהכרטיס שלו מתקרב למסך.</p>

      <div className={styles.sources}>
        <p>
          <strong>מקורות</strong>
        </p>
        <ul>
          <li>
            הנתונים ש-
            <a href={GOOGLE_FONTS_URL} rel="noopener" target="_blank" lang="en">
              Google Fonts
            </a>{' '}
            מפרסמת על כל פונט: סגנון, משקלים, רישיון ורשימת התווים
          </li>
          <li>
            <a href={CSS2_DOCS_URL} rel="noopener" target="_blank">
              התיעוד של Google Fonts CSS2 API
            </a>
            : בקשת משקלים, display ו-text
          </li>
          <li>
            <a href={SHOPIFY_FONTS_URL} rel="noopener" target="_blank">
              התיעוד של Shopify על ספריית הפונטים
            </a>
          </li>
          <li>
            העזרה של Wix:{' '}
            <a href={WIX_LANGUAGES_URL} rel="noopener" target="_blank">
              הוספת שפות
            </a>{' '}
            ו
            <a href={WIX_UPLOAD_URL} rel="noopener" target="_blank">
              העלאת פונטים
            </a>
          </li>
          <li>
            <a href={WORDPRESS_65_URL} rel="noopener" target="_blank">
              ההכרזה על WordPress 6.5
            </a>
            : ספריית הפונטים
          </li>
        </ul>
        <p>הרשימה נבדקה מול Google Fonts ב{FONTS_CHECKED_ON}.</p>
      </div>
    </ToolLayout>
  )
}
