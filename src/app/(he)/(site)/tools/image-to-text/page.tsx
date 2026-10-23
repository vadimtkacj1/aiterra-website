import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import ImageToText from '../../components/tools/ImageToText'
import styles from './page.module.css'

const PATH = '/tools/image-to-text'
const TITLE = 'המרת תמונה לטקסט בעברית'
const META_TITLE = 'המרת תמונה לטקסט בעברית חינם, OCR בדפדפן'
const DESCRIPTION =
  'ממירים תמונה או צילום מסך לטקסט בעברית ובאנגלית, בחינם: זיהוי טקסט (OCR) בדפדפן, עריכה, העתקה ופתיחה ב-Word. התמונה לא עולה לשום שרת.'

const sources: { href: string; label: string; note?: string }[] = [
  {
    href: 'https://github.com/naptha/tesseract.js',
    label: 'tesseract.js on GitHub',
    note: 'ספריית הזיהוי שהכלי משתמש בה, בגרסה 6, ברישיון Apache-2.0',
  },
  {
    href: 'https://github.com/tesseract-ocr/tessdata_best',
    label: 'tesseract-ocr/tessdata_best',
    note: 'המקור של מודל העברית והאנגלית, ברישיון Apache-2.0',
  },
  {
    href: 'https://github.com/tesseract-ocr/tessdata',
    label: 'tesseract-ocr/tessdata',
    note: 'מאגר המודלים הרשמי של Tesseract, ברישיון Apache-2.0',
  },
  {
    href: 'https://github.com/naptha/tessdata',
    label: 'naptha/tessdata',
    note: 'הגרסה ש-tesseract.js מוריד כברירת מחדל דרך jsDelivr: המודלים של tessdata_best בגרסה מוקטנת',
  },
  {
    href: 'https://tesseract-ocr.github.io/tessdoc/ImproveQuality.html',
    label: 'Tesseract documentation: Improving the quality of the output',
  },
  {
    href: 'https://tesseract-ocr.github.io/tessdoc/tess3/FAQ-Old.html',
    label: 'Tesseract FAQ: Is there a minimum / maximum text size?',
  },
  {
    href: 'https://tesseract-ocr.github.io/tessdoc/FAQ.html',
    label: 'Tesseract FAQ: Can I use Tesseract for handwriting recognition?',
  },
  {
    href: 'https://support.google.com/drive/answer/176692',
    label: 'Google Drive Help: Convert PDF and photo files to text',
  },
  {
    href: 'https://support.google.com/docs/answer/65166',
    label: 'Google Docs Editors Help: Edit & view text from right to left',
  },
  {
    href: 'https://support.microsoft.com/en-us/office/languages/using-right-to-left-languages-in-office',
    label: 'Microsoft Support: Using right-to-left languages in Office',
  },
  {
    href: 'https://support.microsoft.com/en-us/office/copy-text-from-pictures-and-file-printouts-using-ocr-in-onenote-93a70a2f-ebcd-42dc-9f0b-19b09fd775b4',
    label: 'Microsoft Support: Copy text from pictures using OCR in OneNote',
  },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'ocr-faq-privacy',
    question: 'התמונה שלי עולה לשרת?',
    answer:
      'לא. הזיהוי רץ בתוך הדפדפן שלכם, והתמונה לא נשלחת לשום מקום. בפעם הראשונה הדפדפן מוריד מ-jsDelivr את מנוע הזיהוי Tesseract ואת מודל השפה. אלה קבצים כלליים שזהים לכל המשתמשים, וההורדה שלהם לא כוללת שום מידע על התמונה. המודל נשמר בדפדפן, כך שבפעם הבאה הזיהוי מתחיל מהר יותר.',
  },
  {
    id: 'ocr-faq-handwriting',
    question: 'הכלי מזהה כתב יד?',
    answer:
      'רק בצורה חלשה. לפי התיעוד של Tesseract, המנוע נבנה לטקסט מודפס, ואפשר לנסות אותו על כתב יד, אבל זה לא יעבוד טוב. אותיות דפוס ברורות ומופרדות מזוהות לפעמים בחלקן, וכתב יד רהוט בעברית כמעט לא. אם אתם מקבלים הרבה טפסים בכתב יד, כדאי לבדוק שירות זיהוי מסמכים שמיועד לכתב יד.',
  },
  {
    id: 'ocr-faq-pdf',
    question: 'אפשר להמיר PDF לטקסט?',
    answer:
      'לא ישירות. אם ה-PDF נוצר מ-Word או ממערכת חשבוניות, בדרך כלל אפשר פשוט לסמן בו את הטקסט ולהעתיק. אם זה מסמך סרוק, פתחו אותו, הגדילו את התצוגה, צלמו מסך של העמוד (ב-Windows עם Win+Shift+S) והדביקו כאן עם Ctrl+V. ל-PDF של כמה עמודים אפשר גם לפתוח את הקובץ ב-Google Docs דרך Google Drive.',
  },
  {
    id: 'ocr-faq-word',
    question: 'העברית יצאה הפוכה ב-Word. מה עושים?',
    answer:
      'הכפתור "פתיחה ב-Word" מוריד קובץ שבו כל פסקה בעברית כבר מוגדרת מימין לשמאל. אם הדבקתם את הטקסט למסמך קיים והכיוון השתבש, סמנו את הפסקאות ולחצו על כפתור הכיוון מימין לשמאל בקבוצה "פסקה" בלשונית "בית". לפי Microsoft, הכפתור מופיע רק כששפה מימין לשמאל מופעלת בהגדרות השפה של Office.',
  },
  {
    id: 'ocr-faq-accuracy',
    question: 'כמה מדויק הזיהוי בעברית?',
    answer:
      'זה תלוי בעיקר בתמונה. טקסט מודפס בגופן רגיל, שצולם ישר ובאור טוב, מזוהה ברובו נכון. צילום באלכסון, אותיות קטנות, גופן מעוצב או רקע צבעוני מורידים את הדיוק. אחרי כל זיהוי הכלי מציג רמת ביטחון, וכשהיא נמוכה מופיעים טיפים לצילום טוב יותר. בכל מקרה כדאי לבדוק מספרים, שמות וסכומים לפני שמשתמשים בטקסט.',
  },
  {
    id: 'ocr-faq-phone',
    question: 'זה עובד גם בטלפון?',
    answer:
      'כן, בדפדפנים עדכניים באנדרואיד ובאייפון. לוחצים על בחירת תמונה, ואז בוחרים תמונה מהגלריה או מצלמים מסמך חדש. בפעם הראשונה הדפדפן מוריד עד כ-8 מגה-בייט, אז עדיף להיות מחוברים ל-Wi-Fi. בטלפון ישן הזיהוי עצמו יכול לקחת יותר זמן מאשר במחשב, במיוחד בתמונה גדולה עם הרבה טקסט.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function ImageToTextPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="טקסט מודפס בעברית ובאנגלית, שצולם ישר ובאור טוב, מזוהה ברובו נכון, וכתב יד רהוט כמעט לא. כאן בוחרים תמונה או צילום מסך ומקבלים את הטקסט להעתקה, והתמונה לא עוזבת את המחשב."
      chips={['עברית ואנגלית', 'התמונה לא עולה לשרת', 'העתקה או פתיחה ב-Word', 'בלי הרשמה']}
      tool={<ImageToText />}
      faq={faq}
      cta={{
        text: 'מקלידים חשבוניות וטפסים ידנית? אנחנו בונים אוטומציה שקוראת מסמכים ומכניסה אותם ל-CRM.',
        label: 'אוטומציה לעסקים',
        href: '/services/automation',
      }}
    >
      <h2>איך מקבלים זיהוי טוב יותר בעברית</h2>
      <p>
        הכלי משתמש ב-Tesseract, מנוע קוד פתוח לזיהוי תווים (OCR), עם מודלים לעברית ולאנגלית. הוא עובד הכי טוב על
        טקסט מודפס, ישר וברור. אלה הדברים שהכי משפיעים על התוצאה, לפי התיעוד של Tesseract:
      </p>
      <ul>
        <li>
          <strong>גודל האותיות</strong>: לפי התיעוד, אות קטנה בגובה של כ-20 פיקסלים נקראת טוב, ומתחת ל-10
          פיקסלים הסיכוי לתוצאה מדויקת קטן מאוד. לכן הכלי מגדיל פי שניים תמונות קטנות, כמו צילום מסך של כמה שורות.
          בצילום מסך של אתר, הגדילו את התצוגה לפני שמצלמים.
        </li>
        <li>
          <strong>רזולוציה</strong>: התיעוד ממליץ על 300 DPI לפחות. בסורק, בחרו 300 DPI. בטלפון, קרבו את המצלמה כך
          שהדף ימלא את המסך.
        </li>
        <li>
          <strong>צילום ישר</strong>: כשהדף מצולם באלכסון, Tesseract מתקשה להפריד בין השורות. הכלי מיישר בעצמו הטיה
          קלה, אבל צילום ישר מעל הדף עדיף.
        </li>
        <li>
          <strong>שוליים</strong>: חתכו את התמונה לאזור הטקסט עם שוליים קטנים. לפי התיעוד, שוליים גדולים מדי סביב
          מעט טקסט עלולים להחזיר תוצאה ריקה.
        </li>
        <li>
          <strong>אור וניגודיות</strong>: צל של היד, השתקפות של מנורה או נייר מקומט יוצרים רעש שפוגע בזיהוי. Google
          ממליצה באותו הקשר על תמונה חדה, תאורה אחידה וניגודיות ברורה.
        </li>
      </ul>
      <p>
        קובצי PDF הכלי לא פותח. צלמו מסך של העמוד והדביקו אותו, או פתחו את ה-PDF ב-Google Docs, כמו שמוסבר בהמשך.
      </p>

      <h2>כתב יד, טבלאות ועמודות: איפה הזיהוי נחלש</h2>
      <p>
        בשאלות הנפוצות של Tesseract כתוב במפורש שאפשר לנסות אותו על כתב יד, אבל זה לא יעבוד טוב, כי הוא נבנה לטקסט
        מודפס. בפועל, אותיות דפוס ברורות ומופרדות מזוהות לפעמים בחלקן, וכתב יד רהוט כמעט לא. אם זה מה שיש לכם,
        עדיף להקליד, או להשתמש בשירות שמיועד לכתב יד.
      </p>
      <p>
        גם מבנה של מסמך לא תמיד עובר. טבלה הופכת לשורות של טקסט בלי עמודות, ובעמוד עם כמה עמודות הסדר יכול
        להתבלבל. Google כותבת דבר דומה על ההמרה של Google Drive: רשימות, טבלאות ועמודות כנראה לא יזוהו. גופנים
        מעוצבים, טקסט על תמונה וכיתוב קטן מאוד בתחתית של חשבונית הם עוד מקומות שבהם כדאי לבדוק את התוצאה בעיון.
      </p>

      <h2>איך מעבירים את הטקסט ל-Word או ל-Google Docs</h2>
      <ul>
        <li>
          <strong>העתקה והדבקה</strong>: הכפתור &quot;העתקת הטקסט&quot; מעתיק את מה שבתיבה, כולל התיקונים שעשיתם.
        </li>
        <li>
          <strong>פתיחה ב-Word</strong>: הכפתור מוריד קובץ DOC שבו כל פסקה בעברית מוגדרת מימין לשמאל, וכל פסקה
          באנגלית משמאל לימין. אם Word פותח אותו בתצוגה מוגנת, אשרו עריכה בפס שבראש המסמך.
        </li>
        <li>
          <strong>כשהכיוון ב-Word השתבש</strong>: לפי Microsoft, כפתור הפסקה מימין לשמאל נמצא בלשונית
          &quot;בית&quot;, בקבוצה &quot;פסקה&quot;, והוא מופיע רק כששפה מימין לשמאל מופעלת בהגדרות השפה (קובץ,
          אפשרויות, שפה).
        </li>
        <li>
          <strong>ב-Google Docs</strong>: לפי Google, כפתורי הכיוון מופיעים לבד כשיש במסמך טקסט בעברית. אם הם לא
          מופיעים, סמנו בהגדרות של Google Docs את האפשרות להציג תמיד פקדים של כתיבה מימין לשמאל, ואז השתמשו בכפתור
          כיוון הפסקה בסרגל הכלים.
        </li>
        <li>
          <strong>דרך נוספת בלי הכלי</strong>: ב-Google Drive אפשר ללחוץ על תמונה או PDF בכפתור הימני ולבחור
          לפתוח אותם ב-Google Docs. לפי Google, ההמרה תומכת בעברית, הקובץ צריך להיות עד 2 מגה-בייט, והטקסט בגובה של
          10 פיקסלים לפחות. גם OneNote של Microsoft יודע להעתיק טקסט מתמונה.
        </li>
      </ul>

      <h2>מתי כדאי לעסק להפוך קריאת מסמכים לאוטומטית</h2>
      <p>
        הכלי הזה מתאים לעמוד פה ושם. אבל אם מישהו בעסק מקליד כל יום חשבוניות ספקים, תעודות משלוח, קבלות או טפסים
        למערכת הנהלת החשבונות או ל-CRM, זו עבודה שחוזרת על עצמה, ואפשר להעביר אותה למערכת:
      </p>
      <ul>
        <li>המסמך מגיע במייל, בוואטסאפ או מסורק, והמערכת קוראת אותו בלי שמישהו צריך לפתוח אותו.</li>
        <li>השדות החשובים נשלפים לבד: שם הספק, תאריך, סכום, מע״מ, מספר חשבונית או מספר לקוח.</li>
        <li>
          המערכת בודקת את הנתונים, למשל שהסכום תואם להזמנה, ומכניסה אותם ל-CRM או לתוכנת הנהלת החשבונות.
        </li>
        <li>מסמך שהזיהוי שלו לא ודאי עובר לאישור של אדם, במקום להיכנס למערכת עם טעות.</li>
      </ul>
      <p>
        מערכות כאלה משתמשות בדרך כלל במנועי זיהוי חזקים יותר מ-Tesseract, כולל מודלים של בינה מלאכותית שמבינים את
        המבנה של המסמך ומתמודדים טוב יותר עם טבלאות ועם כתב יד. אנחנו בונים חיבורים כאלה לעסקים קטנים ובינוניים, על
        המערכות שכבר יש לכם. פרטים בעמוד <Link href="/services/automation">אוטומציה לעסקים</Link>.
      </p>

      <h2>מקורות</h2>
      <ul className={styles.sources}>
        {sources.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noopener" target="_blank" lang="en" dir="ltr">
              {source.label}
            </a>
            {source.note ? <span className={styles.sourceNote}>{source.note}</span> : null}
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>הנוסח נבדק מול המקורות באוקטובר 2026.</p>
    </ToolLayout>
  )
}
