import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import ImageCompressor from '../../components/tools/ImageCompressor'
import styles from './page.module.css'

const PATH = '/tools/image-compressor'
const TITLE = 'הקטנת תמונות והמרה ל-WebP'
const META_TITLE = 'הקטנת תמונה, דחיסה והמרה ל-WebP בחינם'
const DESCRIPTION =
  'מקטינים תמונות לאתר בתוך הדפדפן: דחיסה, המרה ל-WebP, JPEG או PNG ושינוי גודל, עם השוואה של לפני ואחרי. כמה תמונות יחד, בחינם ובלי להעלות לשרת.'

const sources = [
  {
    href: 'https://developers.google.com/search/docs/appearance/google-images',
    label: 'Google Search Central: Image SEO best practices',
  },
  {
    href: 'https://developers.google.com/search/docs/appearance/core-web-vitals',
    label: 'Google Search Central: Core Web Vitals',
  },
  { href: 'https://web.dev/articles/lcp', label: 'web.dev: Largest Contentful Paint (LCP)' },
  { href: 'https://web.dev/articles/optimize-lcp', label: 'web.dev: Optimize LCP' },
  { href: 'https://developers.google.com/speed/webp', label: 'Google: WebP' },
  { href: 'https://web.dev/articles/choose-the-right-image-format', label: 'web.dev: Choose the right image format' },
  { href: 'https://web.dev/articles/compress-images', label: 'web.dev: Compress images' },
  {
    href: 'https://web.dev/articles/serve-images-with-correct-dimensions',
    label: 'web.dev: Serve images with correct dimensions',
  },
  {
    href: 'https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types',
    label: 'MDN: Image file type and format guide',
  },
  {
    href: 'https://support.wix.com/en/article/site-performance-designing-a-performance-focused-website',
    label: 'Wix: Designing a performance-focused website',
  },
  {
    href: 'https://developer.wordpress.org/reference/hooks/big_image_size_threshold/',
    label: 'WordPress: big_image_size_threshold',
  },
  {
    href: 'https://help.shopify.com/en/manual/online-store/images/theme-images',
    label: 'Shopify Help Center: Theme images',
  },
  { href: 'https://support.apple.com/en-us/116944', label: 'Apple: Using HEIF or HEVC media on Apple devices' },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'img-faq-privacy',
    question: 'התמונות שלי עולות לשרת?',
    answer:
      'לא. הדחיסה וההמרה נעשות בתוך הדפדפן שלכם, והקבצים לא נשלחים לשום מקום. אפשר לבדוק את זה בעצמכם: אחרי שהעמוד נטען, נתקו את המחשב מהאינטרנט ונסו להקטין תמונה. זה ימשיך לעבוד, כי אין בתהליך שום שלב שצריך שרת. גם הקבצים המוכנים נשמרים ישירות מהדפדפן למחשב.',
  },
  {
    id: 'img-faq-resize',
    question: 'מה ההבדל בין הקטנת תמונה לדחיסה?',
    answer:
      'הקטנה משנה את הממדים, כלומר את מספר הפיקסלים ברוחב ובגובה. דחיסה משאירה את הממדים ושומרת את התמונה ביעילות רבה יותר, לפעמים במחיר של קצת פרטים. תמונה ברוחב 4000 פיקסלים שמוצגת באתר ברוחב 1200 שוקלת הרבה יותר ממה שצריך, גם כשהיא דחוסה היטב. לכן כדאי לשלב: קודם רוחב מקסימלי, ואחר כך איכות.',
  },
  {
    id: 'img-faq-quality',
    question: 'איזו איכות כדאי לבחור?',
    answer:
      'אין מספר אחד שמתאים לכל תמונה. מתחילים מ-80, פותחים את ההשוואה בגודל אמיתי ומחפשים כתמים או קצוות מטושטשים, בעיקר בשמיים, בעור ובטקסט. אם לא רואים הבדל, אפשר לנסות 70 ולבדוק שוב. לפי web.dev, מספרי האיכות של פורמטים שונים לא שקולים זה לזה, כך ש-80 ב-WebP אינו בדיוק 80 ב-JPEG.',
  },
  {
    id: 'img-faq-bigger',
    question: 'למה הקובץ החדש יצא גדול מהמקור?',
    answer:
      'זה קורה כשהמקור כבר דחוס היטב, או כשממירים צילום ל-PNG, ששומר כל פיקסל בלי איבוד. במקרה כזה הכלי מסמן את הקובץ ומציין בכמה אחוזים הוא גדל. נסו WebP, איכות נמוכה יותר או רוחב מקסימלי קטן יותר. אם גם זה לא עוזר, השאירו את הקובץ המקורי: הוא כנראה כבר בגודל טוב.',
  },
  {
    id: 'img-faq-heic',
    question: 'אפשר להמיר תמונות HEIC מאייפון?',
    answer:
      'זה תלוי בדפדפן. אם הדפדפן שלכם לא יודע לפתוח קובצי HEIC, הכלי יכתוב את זה ליד הקובץ במקום להיתקע. כדי שהאייפון ישמור תמונות חדשות כ-JPEG, היכנסו בהגדרות למצלמה, ואז לפורמטים (Formats), ובחרו Most Compatible. לפי Apple, מכאן והלאה תמונות חדשות יישמרו כ-JPEG, וכל כלי יוכל לפתוח אותן.',
  },
  {
    id: 'img-faq-metadata',
    question: 'מה קורה למידע שבתוך התמונה, כמו מיקום ופרטי המצלמה?',
    answer:
      'הוא לא עובר לקובץ החדש. הכלי מצייר את התמונה מחדש ושומר רק את הפיקסלים, ולכן נתוני EXIF כמו מיקום GPS, דגם המצלמה ותאריך הצילום לא נשמרים בקובץ שתורידו. זה טוב לפרטיות, וגם חוסך עוד כמה בייטים. כיוון הצילום כן נשמר: תמונה שצולמה לאורך תישאר לאורך גם בקובץ החדש.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function ImageCompressorPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="תמונה ברוחב 4000 פיקסלים שמוצגת באתר ברוחב 1200 שוקלת הרבה יותר מהנדרש: קודם מגבילים רוחב, ואחר כך דוחסים, למשל באיכות 80. כאן ממירים ל-WebP, דוחסים ומשווים לפני ואחרי, הכול בדפדפן."
      chips={['התמונות לא עוזבות את המחשב', 'כמה תמונות יחד', 'WebP, JPEG ו-PNG', 'בלי הרשמה ובלי סימן מים']}
      tool={<ImageCompressor />}
      faq={faq}
      cta={{
        text: 'האתר שלכם איטי? אנחנו בודקים ומאיצים אתרים קיימים, כולל תמונות, קוד ואחסון.',
        label: 'לשירות תחזוקת אתרים',
        href: '/services/maintenance',
      }}
    >
      <h2>למה גודל התמונות משנה למהירות האתר</h2>
      <p>
        לפי Google, תמונות הן לעתים קרובות החלק הגדול ביותר במשקל של עמוד, והן יכולות להפוך אותו לאיטי ויקר
        לטעינה. כל קילובייט מיותר בתמונה הוא עוד זמן שהגולש מחכה עד שהעמוד מופיע.
      </p>
      <p>
        אחד ממדדי Core Web Vitals של Google הוא LCP (Largest Contentful Paint): הזמן עד שהתמונה, בלוק הטקסט או
        הסרטון הגדולים ביותר במסך הראשון מוצגים. לפי web.dev, ערך טוב הוא 2.5 שניות או פחות. כשהאלמנט הגדול ביותר
        הוא תמונה, למשל באנר בראש העמוד, הזמן שלוקח להוריד אותה הוא חלק מה-LCP.
      </p>
      <p>
        Google ממליצה לבעלי אתרים להגיע לערכים טובים ב-Core Web Vitals כדי להצליח בחיפוש, וכותבת שזה תואם את מה
        שמערכות הדירוג שלה מבקשות לתגמל.
      </p>
      <p>
        תמונה קלה היא לא כל הסיפור. לפי web.dev, ברוב האתרים זמן ההורדה עצמו הוא לא החלק האיטי ב-LCP, ולכן כדאי
        לבדוק גם מתי התמונה מתחילה להיטען וכמה זמן לוקח לשרת לענות. נקודת התחלה טובה היא בדיקה ב-PageSpeed
        Insights, הכלי ש-Google מפנה אליו לניתוח מהירות.
      </p>

      <h2>איזה פורמט לבחור: WebP, JPEG או PNG</h2>
      <ul>
        <li>
          <strong>WebP</strong>: לפי Google, תמונת WebP עם איבוד נתונים קטנה ב-25% עד 34% מתמונת JPEG באיכות
          דומה, ותמונת WebP בלי איבוד נתונים קטנה ב-26% מ-PNG. הפורמט תומך גם בשקיפות, ולפי MDN כל הדפדפנים
          המרכזיים מציגים אותו: Chrome, Edge, Firefox, Safari ו-Opera. זו הבחירה שלנו לרוב התמונות באתר.
        </li>
        <li>
          <strong>JPEG</strong>: מתאים לצילומים, אבל אין בו שקיפות. כדאי לבחור בו כשהקובץ יוצא מהאתר: נשלח במייל,
          עולה למערכת ישנה או נשלח לבית דפוס.
        </li>
        <li>
          <strong>PNG</strong>: שומר כל פיקסל בלי איבוד, ולכן מתאים לצילומי מסך, לתרשימים ולגרפיקה עם קווים חדים.
          לצילומים web.dev ממליץ על JPEG או WebP.
        </li>
        <li>
          <strong>לוגו ואייקונים</strong>: אם יש לכם אותם כקובץ SVG, עדיף להשתמש בו, וכך גם ממליצה MDN. הכלי הזה
          לא ממיר ל-SVG.
        </li>
      </ul>
      <p>
        ומה עם האיכות? לפי web.dev אין מספר קסם: כדאי לנסות כמה ערכים לכל תמונה, ולא לדחוס יותר מדי. בשביל זה
        יש בכלי השוואה של לפני ואחרי, גם בגודל אמיתי.
      </p>

      <h2>באיזה גודל לשמור תמונות לאתר</h2>
      <p>
        web.dev ממליץ להקטין תמונה לגודל שבו היא מוצגת בפועל, ולהכין כמה גרסאות אם רוצים שהיא תיראה חדה גם במסכים
        עם צפיפות פיקסלים גבוהה. אלה נקודות התחלה שאנחנו עובדים איתן, לא כללים:
      </p>
      <ul>
        <li>תמונה ברוחב מלא של המסך, כמו באנר ראשי: 1920 עד 2560 פיקסלים ברוחב.</li>
        <li>תמונה בתוך עמוד או מאמר: 1200 עד 1600 פיקסלים.</li>
        <li>תמונת מוצר בחנות: 1000 עד 2000 פיקסלים, בדרך כלל ריבועית.</li>
        <li>תמונה קטנה בכרטיס או ברשימה: 600 עד 800 פיקסלים.</li>
        <li>לוגו: SVG אם אפשר. אחרת PNG או WebP ברוחב כפול מהגודל שבו הוא מוצג.</li>
      </ul>
      <p>
        בכלי אפשר לבחור רוחב נפוץ בלחיצה. התמונה לא מוגדלת אף פעם, כך שתמונה שקטנה מהרוחב שבחרתם נשארת בגודלה.
      </p>

      <h2>איך מעלים תמונות ל-Wix, ל-WordPress ול-Shopify</h2>
      <p>כל מערכת מטפלת בתמונות קצת אחרת. זה מה שהמערכות עצמן כותבות בתיעוד שלהן:</p>
      <h3>Wix</h3>
      <p>
        במדריך המהירות של Wix ממליצים לדחוס קבצים לפני שמעלים אותם, להשתמש בפורמטים קלים כמו WebP או JPEG,
        ולטפל במיוחד בתמונה או בסרטון הגדולים ביותר בעמוד, בגלל ה-LCP.
      </p>
      <h3>WordPress</h3>
      <p>
        WordPress מקטין אוטומטית, החל מגרסה 5.3, תמונה שהרוחב או הגובה שלה עולים על 2560 פיקסלים, ומשתמש בגרסה
        המוקטנת כגודל הגדול ביותר. כשמעלים תמונה שכבר מוקטנת ל-2560 או פחות ודחוסה כמו שרציתם, אתם אלה שקובעים איך
        היא נראית. אם מותקן תוסף שדוחס תמונות, בדקו באיזו איכות הוא שומר, כדי שלא יוריד עוד פרטים מתמונה שכבר
        דחסתם.
      </p>
      <h3>Shopify</h3>
      <p>
        לפי מרכז העזרה של Shopify, תמונות לא נדחסות כשמעלים אותן לניהול החנות, אבל כשהן מוצגות דרך התבנית הן
        עשויות לעבור דחיסה, ו-Shopify בוחרת לבד את הפורמט ומגישה WebP או AVIF לדפדפנים שתומכים בהם. לכן אין צורך
        להמיר ל-WebP לפני ההעלאה. מה שכן חשוב: Shopify לא מקבלת תמונה שעוברת 20 מגה-פיקסל או 20 מגה-בייט. תמונה
        של 5000 על 4000 פיקסלים כבר מגיעה ל-20 מגה-פיקסל, אז כדאי להקטין קודם.
      </p>
      <h3>אתר שנבנה בקוד</h3>
      <p>
        Google מסבירה שבעזרת <code>srcset</code> או <code>picture</code> אפשר להגדיר גרסאות שונות של אותה תמונה
        לגדלי מסך שונים, וממליצה תמיד להשאיר כתובת חלופית ב-<code>src</code>. בפועל: כמה גרסאות WebP ברוחב שונה,
        והדפדפן בוחר את המתאימה.
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
      <p className={styles.reviewed}>הנוסח נבדק מול המקורות באוקטובר 2026.</p>
    </ToolLayout>
  )
}
