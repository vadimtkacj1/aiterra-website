import type { ReactNode } from 'react'
import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import BarcodeGenerator from '../../components/tools/BarcodeGenerator'
import { checkDigitSteps } from '@/lib/barcode'
import styles from './page.module.css'

const PATH = '/tools/barcode-generator'
const TITLE = 'יצירת ברקוד למוצר'
const META_TITLE = 'יצירת ברקוד למוצר בחינם: EAN-13, Code 128 ומדבקות'
const DESCRIPTION =
  'יוצרים ברקוד למוצר בחינם: EAN-13 עם ספרת ביקורת שמחושבת לבד, UPC-A, EAN-8 ו-Code 128 למק״ט. מורידים SVG או PNG להדפסה, או דף מדבקות A4 מלא.'

const EXAMPLE_BODY = '400638133393'
const example = checkDigitSteps(EXAMPLE_BODY)

const GENSPECS = 'https://ref.gs1.org/standards/genspecs/'
const GS1_PREFIXES = 'https://www.gs1.org/standards/id-keys/company-prefix'
const GS1IL_JOIN = 'https://www.gs1il.org/join-us2/'
const GS1IL_WHY = 'https://www.gs1il.org/join-us/'
const GS1IL_GCP = 'https://www.gs1il.org/global-company-prefix-gcp/'
const GS1IL_TYPES = 'https://www.gs1il.org/types-of-barcodes'
const GS1IL_FAQ = 'https://www.gs1il.org/faq/'
const GS1IL_CALCULATOR = 'https://www.gs1il.org/calculator/'
const GS1IL_VERIFIED = 'https://www.gs1il.org/verified-by-gs1/'
const AMAZON_UPC = 'https://sellercentral.amazon.com/help/hub/reference/external/GLE2KYT2UVPMTYGS'
const GS1US_PRINTING = 'https://www.gs1us.org/upcs-barcodes-prefixes/how-to-use-your-upc-barcodes/place-barcodes-on-products'

const sources: { href: string; label: string; note: string; lang?: string }[] = [
  {
    href: GENSPECS,
    label: 'GS1 General Specifications Standard, Release 26.0, January 2026',
    lang: 'en',
    note: 'סעיף 5.2: קבוצות A, B ו-C, טבלת הזוגיות לפי הספרה הראשונה, פסי השמירה, השוליים והמידות של EAN-13, EAN-8 ו-UPC-A. סעיף 5.4: טבלת התווים של Code 128, תו הביקורת מודולו 103 ושוליים של 10X. טבלה 1 בסעיף 5.12.3.1: רוחב פס בין 0.264 ל-0.66 מ״מ. סעיף 7.9.1: ספרת הביקורת',
  },
  {
    href: GS1_PREFIXES,
    label: 'GS1: GS1 Company Prefix',
    lang: 'en',
    note: 'הקידומת 729 שייכת ל-GS1 ישראל, הקידומת לא מעידה על ארץ הייצור, ו-040 עד 049 שמורות למספרים פנימיים בתוך חברה',
  },
  {
    href: GS1IL_JOIN,
    label: 'GS1 ישראל: הצטרפות',
    note: 'ארבעת השלבים, חבילות של 100 ו-1,000 מוצרים, תשלום בהעברה בנקאית ומשלוח המספרים במייל',
  },
  {
    href: GS1IL_GCP,
    label: 'GS1 ישראל: מספר ספק (GCP)',
    note: 'מספר ספק בן 10, 9 או 7 ספרות לפי מספר המוצרים',
  },
  {
    href: GS1IL_WHY,
    label: 'GS1 ישראל: למה להצטרף',
    note: 'שותפי הסחר דורשים מוצרים עם מזהה מוצר',
  },
  {
    href: GS1IL_TYPES,
    label: 'GS1 ישראל: סוגי ברקודים',
    note: 'EAN-13 ו-UPC לנקודת מכירה, GS1-128 לא לנקודת מכירה',
  },
  {
    href: GS1IL_FAQ,
    label: 'GS1 ישראל: שאלות נפוצות',
    note: 'חידוש הרישיון כל שנה, EAN-13 למוצרים בקמעונאות ו-UPC למפיצים לארה״ב ולקנדה',
  },
  {
    href: AMAZON_UPC,
    label: 'Amazon Seller Central: Valid UPCs',
    lang: 'en',
    note: 'אמזון בודקת כל UPC מול המאגר של GS1 וממליצה לקבל אותו ישירות מ-GS1',
  },
  {
    href: GS1US_PRINTING,
    label: 'GS1 US: Barcode Placement & Printing Guidelines',
    lang: 'en',
    note: 'פסים כהים על רקע בהיר, בלי פסים אדומים או חומים, שוליים ריקים והדפסה בגובה מלא',
  },
  {
    href: 'https://en.wikipedia.org/wiki/International_Article_Number',
    label: 'Wikipedia: International Article Number',
    lang: 'en',
    note: 'הדוגמה 4006381333931 שבחישוב ספרת הביקורת',
  },
  {
    href: 'https://en.wikipedia.org/wiki/Code_128',
    label: 'Wikipedia: Code 128',
    lang: 'en',
    note: 'התקן ISO/IEC 15417 ודוגמה לחישוב תו הביקורת',
  },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'barcode-faq-how',
    question: 'איך עושים ברקוד למוצר?',
    answer:
      'בוחרים מספר למוצר, בוחרים סוג ברקוד ומורידים קובץ. למוצר שיימכר דרך רשתות, מפיצים או אמזון מקבלים מספר רשום מ-GS1 ישראל ומקלידים אותו כאן כ-EAN-13. למוצר שנמכר רק אצלכם אפשר להשתמש במק״ט פנימי ב-Code 128. המחולל מחשב את ספרת הביקורת, ומוריד SVG, PNG או דף מדבקות A4 להדפסה.',
  },
  {
    id: 'barcode-faq-invent',
    question: 'אפשר להמציא מספר ברקוד למוצר?',
    answer:
      'לשימוש בתוך העסק, כן: למלאי, למדף או למחסן. GS1 שומרת את הקידומות 040 עד 049 בדיוק למספרים פנימיים כאלה, כדי שלא יתנגשו במספר של מוצר אמיתי. למכירה דרך שותפי סחר זה לא מספיק. אמזון בארה״ב, למשל, בודקת כל UPC מול המאגר של GS1 ומסירה מוצרים שהמספר שלהם לא מתאים לנתונים שם.',
  },
  {
    id: 'barcode-faq-cost',
    question: 'כמה עולה ברקוד מ-GS1 ישראל?',
    answer:
      'GS1 ישראל גובה דמי הצטרפות חד-פעמיים ותשלום שנתי לחידוש הרישיון, לפי חבילה של 100 או 1,000 מוצרים. המחירון המעודכן מופיע בדף ההצטרפות באתר שלהם. המספרים לא נקנים לתמיד: מקבלים רישיון שימוש ומחדשים אותו כל שנה. אחרי ההעברה הבנקאית, מספר הספק ומספרי הברקוד נשלחים במייל תוך שני ימי עסקים.',
  },
  {
    id: 'barcode-faq-upc',
    question: 'מה ההבדל בין EAN-13 ל-UPC-A?',
    answer:
      'EAN-13 מקודד 13 ספרות, והוא הברקוד הרגיל למוצרים בישראל וברוב העולם. UPC-A מקודד 12 ספרות ונפוץ בארה״ב ובקנדה. לפי GS1, אפשר לקרוא UPC-A כמספר בן 13 ספרות שמתחיל ב-0. לפי GS1 ישראל, יצרן שמפיץ לארה״ב ולקנדה עשוי להידרש ל-UPC בן 12 ספרות. אם לא ביקשו מכם UPC, בחרו EAN-13.',
  },
  {
    id: 'barcode-faq-size',
    question: 'באיזה גודל להדפיס ברקוד?',
    answer:
      'לפי GS1, הפס הדק בברקוד של מוצר צריך להיות ברוחב 0.264 עד 0.66 מ״מ, והגודל הרגיל הוא 0.33 מ״מ. בגודל הזה EAN-13 רחב 37.29 מ״מ עם השוליים, והפסים גבוהים 22.85 מ״מ. בגודל המינימלי הוא רחב כ-29.8 מ״מ. לא מקצרים את הפסים אם יש דרך אחרת, כי ברקוד מקוצר כבר לא נסרק מכל זווית.',
  },
  {
    id: 'barcode-faq-labels',
    question: 'איך מדפיסים ברקודים על מדבקות?',
    answer:
      'פותחים את ״דף מדבקות A4 להדפסה״, בוחרים את הסידור, למשל 3 על 8 או 4 על 10, ומתאימים את השוליים למידות שעל האריזה של המדבקות. אפשר להדפיס אותו ברקוד בכל המדבקות או רצף, שבו כל מדבקה מקבלת את המספר הבא. מדפיסים קודם דף ניסיון על נייר רגיל עם קווי מתאר, ובחלון ההדפסה בוחרים גודל בפועל, 100%.',
  },
]

const comparison: { name: string; encodes: string; use: ReactNode }[] = [
  {
    name: 'EAN-13',
    encodes: '13 ספרות',
    use: 'מוצר שנמכר בקופה, בישראל וברוב העולם. המספר מ-GS1 ישראל, או מספר פנימי שמתחיל ב-040 עד 049.',
  },
  {
    name: 'UPC-A',
    encodes: '12 ספרות',
    use: 'מוצר שנמכר בארה״ב ובקנדה, כשהמפיץ או הקמעונאי מבקשים UPC.',
  },
  {
    name: 'EAN-8',
    encodes: '8 ספרות',
    use: 'אריזה קטנה מאוד: לפי GS1, כששטח ההדפסה קטן מ-80 סמ״ר, התווית קטנה מ-40 סמ״ר או שהמוצר גלילי בקוטר מתחת ל-30 מ״מ.',
  },
  {
    name: 'Code 128',
    encodes: 'אותיות לועזיות, ספרות וסימנים',
    use: 'מק״ט פנימי, מיקום במחסן, מספר הזמנה או משלוח. אתם קובעים את המספר.',
  },
  {
    name: 'QR',
    encodes: 'קישור או טקסט ארוך',
    use: (
      <>
        שלט, תפריט, וואטסאפ או ביקורת בגוגל, ב<Link href="/tools/qr-code-generator">מחולל קוד QR</Link> שלנו.
      </>
    ),
  },
]

function Ltr({ children }: { children: ReactNode }) {
  return (
    <span dir="ltr" className={styles.ltr}>
      {children}
    </span>
  )
}

function External({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} rel="noopener" target="_blank">
      {children}
    </a>
  )
}

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function BarcodeGeneratorPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="מקלידים את מספר המוצר ומקבלים ברקוד EAN-13, UPC-A, EAN-8 או Code 128 עם ספרת ביקורת שמחושבת לבד, להורדה ב-SVG, ב-PNG או כדף מדבקות A4. ברקוד עם מספר שהמצאתם מתאים לשימוש בתוך העסק, וכדי למכור ברשתות או באמזון צריך מספר רשום מ-GS1 ישראל."
      chips={['ספרת ביקורת מחושבת לבד', 'SVG ו-PNG ב-300 DPI', 'דף מדבקות A4', 'בלי הרשמה, בלי שרת']}
      tool={<BarcodeGenerator />}
      faq={faq}
      cta={{
        text: 'אנחנו בונים חנויות אונליין שבהן הקטלוג, הברקודים והמלאי מסונכרנים במקום אחד.',
        label: 'לבניית חנות אונליין',
        href: '/services/ecommerce',
      }}
    >
      <h2>איך יוצרים ברקוד למוצר בשלושה צעדים</h2>
      <ol>
        <li>
          <strong>מחליטים על המספר.</strong> מוצר שיימכר דרך רשתות, מפיצים או זירות מסחר צריך מספר GTIN רשום מ-GS1
          ישראל. למוצר שנמכר רק אצלכם, למדף או למחסן, מספיק מק״ט פנימי או מספר פנימי שמתחיל ב-040 עד 049.
        </li>
        <li>
          <strong>בוחרים סוג ומקלידים.</strong> ל-EAN-13 מקלידים 12 ספרות, והמחולל מוסיף את ספרת הביקורת. מי שמקליד 13
          ספרות מקבל בדיקה שהאחרונה נכונה, ומספר עם טעות הקלדה לא יהפוך לברקוד.
        </li>
        <li>
          <strong>מורידים ומדפיסים.</strong> SVG לבית דפוס ולמעצב, PNG ב-300 DPI לתוכנת מדבקות או למסמך, או דף מדבקות
          A4 עם אותו ברקוד או עם רצף מספרים. לפני הדפסה גדולה סורקים עותק מודפס אחד.
        </li>
      </ol>
      <p>
        הקבצים יוצאים בגודל ההדפסה האמיתי: ה-SVG שומר את המידות במילימטרים, וב-PNG רשומה הרזולוציה, כך שתוכנה שמכבדת
        אותה תדפיס אותו בגודל שבחרתם. הכול נוצר בדפדפן שלכם, בלי שרת ובלי הרשמה.
      </p>

      <h2>EAN-13, UPC או Code 128: מה לבחור</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>סוגי הברקוד במחולל, ומתי משתמשים בכל אחד</caption>
          <thead>
            <tr>
              <th scope="col">סוג</th>
              <th scope="col">מה מקודדים</th>
              <th scope="col">מתי משתמשים</th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((row) => (
              <tr key={row.name}>
                <th scope="row">
                  <Ltr>{row.name}</Ltr>
                </th>
                <td>{row.encodes}</td>
                <td>{row.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        לפי <External href={GS1IL_TYPES}>GS1 ישראל</External>, EAN-13 ו-UPC נועדו לנקודת מכירה בקמעונאות, ו-GS1-128
        לא. ב-Code 128 של המחולל אין את התו המיוחד שבתחילת GS1-128, ולכן הוא Code 128 רגיל לשימוש בתוך העסק. המחולל בוחר
        לבד בין קידוד B, לאותיות, לבין קידוד C, שמכניס שתי ספרות בכל תו, כך שמק״ט עם הרבה ספרות יוצא קצר יותר. Code 128
        לא מקודד עברית.
      </p>

      <h2>מתי חייבים ברקוד רשמי מ-GS1 ישראל (729)</h2>
      <p>
        GS1 ישראל היא הנציגות של ארגון GS1 העולמי והגוף שמנפיק בישראל מספרי ברקוד למוצרים, שנקראים GTIN. לפי{' '}
        <External href={GS1_PREFIXES}>רשימת הקידומות של GS1</External>, הקידומת של GS1 ישראל היא 729. הקידומת מראה איזה
        ארגון GS1 הנפיק את המספר, ולא באיזו ארץ המוצר יוצר.
      </p>
      <p>
        <strong>צריך מספר רשום</strong> כשמוכרים דרך מישהו אחר: רשת, מפיץ או זירת מסחר.{' '}
        <External href={GS1IL_WHY}>GS1 ישראל כותבת</External> ששותפי הסחר דורשים מוצרים עם מזהה מוצר. באמזון בארה״ב,
        לפי <External href={AMAZON_UPC}>מרכז העזרה למוכרים</External>, כל UPC נבדק מול המאגר של GS1. קוד שלא תואם לנתונים שם נחשב לא תקין, המוצר יורד מהאתר, ואמזון ממליצה לקבל את המספר ישירות
        מ-GS1 ולא ממוכרים אחרים של רישיונות UPC.
      </p>
      <p>
        <strong>לא צריך מספר רשום</strong> כשהברקוד נשאר אצלכם: מוצר שנמכר רק בחנות או באתר שלכם, מדף, מחסן ומלאי. אז
        עדיף מק״ט ב-Code 128, או EAN-13 שמתחיל ב-040 עד 049. GS1 שומרת את הקידומות האלה למספרים פנימיים בתוך חברה, ולכן
        הם לא יתנגשו במספר של מוצר אמיתי. מספר אקראי אחר יכול להיות בדיוק המספר של מוצר של מישהו אחר. אם תעברו בהמשך
        למכירה ברשתות, תצטרכו להחליף את הברקוד.
      </p>
      <h3>איך מקבלים מספר מ-GS1 ישראל</h3>
      <p>
        לפי <External href={GS1IL_JOIN}>דף ההצטרפות</External>, התהליך הוא ארבעה שלבים:
      </p>
      <ol>
        <li>בוחרים חבילה, למשל ל-100 או ל-1,000 מוצרים.</li>
        <li>ממלאים את הסכם ההצטרפות ושולחים אותו במייל. אישור על ההסכם מגיע תוך יום עסקים.</li>
        <li>משלמים בהעברה בנקאית.</li>
        <li>מספר הספק ומספרי הברקוד נשלחים במייל תוך שני ימי עסקים מהתשלום.</li>
      </ol>
      <p>
        מספר הספק הוא בן 10 ספרות לחבילה של 100 מוצרים, 9 ספרות ל-1,000 ו-7 ספרות ל-100,000. המספרים לא נקנים לתמיד:
        לפי <External href={GS1IL_FAQ}>השאלות הנפוצות של GS1 ישראל</External>, מקבלים רישיון שימוש ומחדשים אותו כל שנה.
        את המחיר המעודכן בודקים במחירון שבדף ההצטרפות. כדי לבדוק למי שייך ברקוד קיים, יש את{' '}
        <External href={GS1IL_VERIFIED}>Verified by GS1</External>.
      </p>

      <h2>איך מחשבים ספרת ביקורת של EAN-13</h2>
      <p>
        הספרה האחרונה בברקוד היא ספרת ביקורת. היא מחושבת מהספרות שלפניה, כדי שסורק יזהה קריאה שגויה וכדי שטעות הקלדה
        תתגלה מיד. לפי סעיף 7.9.1 של <External href={GENSPECS}>המפרט של GS1</External>:
      </p>
      <ol>
        <li>מכפילים את 12 הספרות לסירוגין ב-1 וב-3, החל מ-1 בספרה הראשונה משמאל.</li>
        <li>מחברים את כל המכפלות.</li>
        <li>ספרת הביקורת היא מה שחסר עד הכפולה הבאה של 10. אם הסכום כבר כפולה של 10, ספרת הביקורת היא 0.</li>
      </ol>
      <h3>
        דוגמה: <Ltr>{EXAMPLE_BODY}</Ltr>
      </h3>
      <div className={styles.tableWrap}>
        <table className={`${styles.table} ${styles.digitsTable}`} dir="ltr">
          <caption dir="rtl">חישוב ספרת הביקורת של {EXAMPLE_BODY}</caption>
          <tbody>
            <tr>
              <th scope="row" dir="rtl">
                ספרה
              </th>
              {example.steps.map((step, index) => (
                <td key={index}>{step.digit}</td>
              ))}
            </tr>
            <tr>
              <th scope="row" dir="rtl">
                כפול
              </th>
              {example.steps.map((step, index) => (
                <td key={index}>{step.weight}</td>
              ))}
            </tr>
            <tr>
              <th scope="row" dir="rtl">
                מכפלה
              </th>
              {example.steps.map((step, index) => (
                <td key={index}>{step.product}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        הסכום הוא <Ltr>{example.steps.map((step) => step.product).join(' + ')} = {example.sum}</Ltr>. עד {example.next},
        הכפולה הבאה של 10, חסר {example.checkDigit}, ולכן הברקוד המלא הוא <Ltr>{`${EXAMPLE_BODY}${example.checkDigit}`}</Ltr>
        . זו הדוגמה מהערך על EAN בוויקיפדיה, הברקוד של עט Stabilo.
      </p>
      <p>
        ב-UPC-A וב-EAN-8 החישוב זהה: הספרה שצמודה לספרת הביקורת מוכפלת תמיד ב-3, ומשם לסירוגין. המחולל מחשב את זה לבד,
        ול-GS1 ישראל יש גם <External href={GS1IL_CALCULATOR}>מחשבון ספרת ביקורת</External>. מי שבודק מספרי זהות או ח.פ.
        ימצא שיטה דומה, עם משקלים 1 ו-2, ב<Link href="/tools/id-number-check">בדיקת ספרת ביקורת לתעודת זהות</Link>.
      </p>

      <h2>הדפסה על מדבקות: גודל מינימלי, צבעים ושוליים</h2>
      <h3>גודל</h3>
      <p>
        בברקוד של מוצר, הגודל נקבע לפי הרוחב של הפס הדק ביותר, שנקרא X. לפי טבלה 1 במפרט של GS1, לברקוד שנסרק בקופה X
        צריך להיות בין 0.264 ל-0.66 מ״מ, והיעד הוא 0.33 מ״מ. כל הברקוד גדל וקטן ביחד:
      </p>
      <ul>
        <li>
          <strong>EAN-13 ו-UPC-A ב-0.33 מ״מ:</strong> רוחב <Ltr>37.29</Ltr> מ״מ עם השוליים, ופסים בגובה{' '}
          <Ltr>22.85</Ltr> מ״מ, בלי הספרות שמתחת.
        </li>
        <li>
          <strong>EAN-13 בגודל המינימלי, 0.264 מ״מ:</strong> רוחב <Ltr>29.83</Ltr> מ״מ ופסים בגובה <Ltr>18.28</Ltr>{' '}
          מ״מ.
        </li>
        <li>
          <strong>EAN-8 ב-0.33 מ״מ:</strong> רוחב <Ltr>26.73</Ltr> מ״מ ופסים בגובה <Ltr>18.23</Ltr> מ״מ.
        </li>
      </ul>
      <p>
        לפי המפרט, ברקוד מקוצר, באורך רגיל ובגובה נמוך, מותר רק כשאין שום אפשרות להדפיס ברקוד בגודל מלא. הקיצור מבטל את
        היכולת לסרוק אותו מכל זווית, וברקוד מקוצר מדי לא שימושי בכלל. אם אין מקום, עדיף להקטין את כל הברקוד עד 0.264 מ״מ
        מאשר לקצר את הפסים. המחולל מתריע כשהגובה נמוך מהמלא.
      </p>
      <h3>שוליים ריקים</h3>
      <p>
        משני צדי הברקוד צריך שטח ריק, כדי שהסורק ימצא איפה הברקוד מתחיל ונגמר. לפי GS1, ב-EAN-13 זה 11 פעמים X משמאל
        ו-7 מימין, כ-3.6 ו-2.3 מ״מ בגודל הרגיל. ב-UPC-A זה 9 מכל צד, ב-EAN-8 7 מכל צד, וב-Code 128 עשרה. המחולל משאיר
        את השוליים האלה בתוך הקובץ, ולכן לא חותכים את הלבן סביב הברקוד ולא מצמידים אליו טקסט או מסגרת.
      </p>
      <h3>צבעים</h3>
      <p>
        לפי <External href={GS1US_PRINTING}>ההנחיות של GS1 US</External>, הפסים כהים, למשל שחור, כחול כהה או ירוק כהה,
        והרקע בהיר. לא מדפיסים פסים באדום או בגוון אדמדם כמו חום, כי האור של הסורק אדום והוא לא רואה אותם. מאותה סיבה
        רקע אדמדם דווקא עובד. ההפך, פסים בהירים על רקע כהה, לא עומד בדרישה. כשבוחרים צבעים במחולל, הוא מתריע על שילוב
        שעלול לא להיסרק.
      </p>
      <h3>דף מדבקות</h3>
      <ul>
        <li>בוחרים את הסידור שעל האריזה של המדבקות, ומתאימים את השוליים והרווחים אם המידות שונות.</li>
        <li>אם הברקוד גדול מהמדבקה, המחולל מקטין אותו ומתריע כשהוא יורד מתחת לגודל המינימלי.</li>
        <li>בחלון ההדפסה בוחרים נייר A4 וגודל בפועל, 100%. התאמה לדף מזיזה את כל המדבקות.</li>
        <li>מדפיסים דף ניסיון על נייר רגיל עם קווי מתאר, ומניחים אותו על דף המדבקות מול האור.</li>
        <li>סורקים מדבקה מודפסת אחת לפני שמדפיסים את כל הכמות.</li>
      </ul>
      <p>
        לפי המפרט, ב-EAN ו-UPC חייבים להדפיס את הספרות מתחת לפסים. הגופן המומלץ להן הוא OCR-B, וכל גופן קריא מתאים. GS1
        US ממליצה גם לשים את הברקוד בחלק הימני התחתון של הגב של האריזה.
      </p>

      <h2>מקורות</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noopener" target="_blank" lang={source.lang}>
              {source.label}
            </a>
            : {source.note}
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        המידע נבדק מול המקורות ב-23 באוקטובר 2026. המקודדים נבדקו מול הטבלאות במפרט של GS1, ויותר מ-1,200 ברקודים
        שנוצרו בהם פוענחו בהצלחה בספריית הסריקה ZXing.
      </p>
    </ToolLayout>
  )
}
