import type { ReactNode } from 'react'
import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import IdNumberChecker, { CodeSnippet } from '../../components/tools/IdNumberChecker'
import {
  EXCEL_CHECK_DIGIT_FORMULA,
  EXCEL_PAD_FORMULA,
  EXCEL_VALIDATE_FORMULA,
  JS_SNIPPET,
  checkDigitFor,
  corporatePrefixes,
  steps,
  stepsSum,
} from '@/lib/id-number'
import styles from './page.module.css'

const PATH = '/tools/id-number-check'
const TITLE = 'בדיקת תעודת זהות: ספרת ביקורת ותקינות'
const META_TITLE = 'בדיקת תעודת זהות תקינה וחישוב ספרת ביקורת'
const DESCRIPTION =
  'בודקים אם מספר תעודת זהות תקין לפי ספרת הביקורת ורואים את החישוב. גם חישוב ספרת ביקורת, בדיקת ח.פ. ועוסק מורשה, ונוסחה מוכנה לאקסל.'

const EXAMPLE_BASE = '12345678'
const exampleSteps = steps(EXAMPLE_BASE)
const exampleSum = stepsSum(exampleSteps)
const exampleCheckDigit = checkDigitFor(EXAMPLE_BASE)

const prefixRows = corporatePrefixes.reduce<{ prefixes: string[]; label: string }[]>((rows, item) => {
  const existing = rows.find((row) => row.label === item.label)
  if (existing) existing.prefixes.push(item.prefix)
  else rows.push({ prefixes: [item.prefix], label: item.label })
  return rows
}, [])

const WIKIPEDIA_CHECK_DIGIT = 'https://he.wikipedia.org/wiki/%D7%A1%D7%A4%D7%A8%D7%AA_%D7%91%D7%99%D7%A7%D7%95%D7%A8%D7%AA'
const WIKIPEDIA_ID = 'https://he.wikipedia.org/wiki/%D7%9E%D7%A1%D7%A4%D7%A8_%D7%96%D7%94%D7%95%D7%AA_(%D7%99%D7%A9%D7%A8%D7%90%D7%9C)'
const PRIVACY_LAW =
  'https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%94%D7%92%D7%A0%D7%AA_%D7%94%D7%A4%D7%A8%D7%98%D7%99%D7%95%D7%AA'
const PRIVACY_AUTHORITY_ID = 'https://www.gov.il/he/pages/id_collecting'
const KOLZCHUT_ID =
  'https://www.kolzchut.org.il/he/%D7%94%D7%95%D7%A6%D7%90%D7%94_%D7%95%D7%97%D7%99%D7%93%D7%95%D7%A9_%D7%A9%D7%9C_%D7%AA%D7%A2%D7%95%D7%93%D7%AA_%D7%96%D7%94%D7%95%D7%AA'
const ICA_SEARCH = 'https://ica.justice.gov.il/GenericCorporarionInfo/SearchCorporation?unit=8'
const VAT_DEALER_LOOKUP = 'https://www.gov.il/he/service/vat-apply-online'

const sources: { href: string; label: string; note: string }[] = [
  {
    href: WIKIPEDIA_CHECK_DIGIT,
    label: 'ויקיפדיה: ספרת ביקורת',
    note: 'המשקלים 1 ו-2 לסירוגין, סכום הספרות של מכפלה דו-ספרתית והשלמה לכפולה של 10, עם דוגמה',
  },
  {
    href: WIKIPEDIA_ID,
    label: 'ויקיפדיה: מספר זהות (ישראל)',
    note: '9 ספרות, הספרה הימנית היא ספרת הביקורת, אפסים שנוספו משמאל, והמספר ניתן במרשם האוכלוסין',
  },
  {
    href: 'https://arthurdejong.org/python-stdnum/doc/stdnum.il.idnr',
    label: 'python-stdnum: מספר זהות ישראלי',
    note: 'ספריית קוד פתוח לבדיקת מספרים מזהים, עם דוגמאות למספר תקין ולספרת ביקורת שגויה. ובאותה ספרייה גם מספר חברה (stdnum.il.hp)',
  },
  {
    href: 'https://data.gov.il/he/dataset/ica_companies',
    label: 'data.gov.il: מאגר חברות של רשם החברות',
    note: 'הבדיקה שלנו: 732,514 מתוך 732,515 מספרי חברות עוברים את אותה ספרת ביקורת',
  },
  {
    href: 'https://data.gov.il/he/dataset/ica_partnerships',
    label: 'data.gov.il: מאגר שותפויות של רשם החברות',
    note: 'הבדיקה שלנו: כל 29,074 מספרי השותפויות עוברים',
  },
  {
    href: 'https://data.gov.il/he/dataset/moj-amutot',
    label: 'data.gov.il: מאגר עמותות וחברות לתועלת הציבור',
    note: 'הבדיקה שלנו: כל 73,899 מספרי העמותות שמתחילים ב-58 עוברים',
  },
  {
    href: 'https://www.oecd.org/content/dam/oecd/en/topics/policy-issue-focus/aeoi/israel-tin.pdf',
    label: 'רשות המסים, דרך פורטל ה-OECD: Information on Tax Identification Numbers, Israel',
    note: 'המזהה לצורכי מס של יחיד הוא מספר הזהות שלו, ושל חברה מספר בן 9 ספרות',
  },
  {
    href: PRIVACY_LAW,
    label: 'חוק הגנת הפרטיות, התשמ״א-1981, בנוסח המעודכן בוויקיטקסט',
    note: 'סעיף 3 אחרי תיקון 13: מספר זהות הוא פרט מזהה בהגדרת מידע אישי. סעיף 11: חובת היידוע',
  },
  {
    href: PRIVACY_AUTHORITY_ID,
    label: 'הרשות להגנת הפרטיות: איסוף מספרי תעודות זהות וצילום תעודת זהות',
    note: 'מספר זהות הוא מידע מוגן, ואוספים אותו או מצלמים תעודה רק כשיש בכך צורך',
  },
  {
    href: KOLZCHUT_ID,
    label: 'כל זכות: הוצאה וחידוש של תעודת זהות',
    note: 'תעודה חדשה במקום תעודה שאבדה או נגנבה',
  },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'id-faq-valid',
    question: 'איך יודעים אם מספר תעודת זהות תקין?',
    answer:
      'בודקים את ספרת הביקורת, הספרה התשיעית. משלימים את המספר ל-9 ספרות עם אפסים משמאל, מכפילים את הספרות לסירוגין ב-1 וב-2, ומכפלה של 10 ומעלה מחליפים בסכום הספרות שלה. אם סכום כל התוצאות מתחלק ב-10, המספר תקין. בכלי שלמעלה מקלידים את המספר ורואים את החישוב המלא. מספר תקין הוא מספר שבנוי נכון, לא בהכרח מספר שקיים.',
  },
  {
    id: 'id-faq-check-digit',
    question: 'איך מחשבים ספרת ביקורת לתעודת זהות?',
    answer:
      'לוקחים את 8 הספרות הראשונות ומכפילים אותן לסירוגין ב-1 וב-2, החל מ-1. מכפלה דו-ספרתית מחליפים בסכום הספרות שלה, ומחברים הכול. ספרת הביקורת היא מה שחסר עד הכפולה הבאה של 10. ל-12345678 הסכום הוא 38, עד 40 חסרים 2, ולכן המספר המלא הוא 123456782. כשהסכום כבר מתחלק ב-10, ספרת הביקורת היא 0.',
  },
  {
    id: 'id-faq-eight',
    question: 'למה למספר הזהות שלי יש רק 8 ספרות?',
    answer:
      'כי חסר לו 0 בהתחלה. מספרי זהות הם תמיד 9 ספרות, ולמספרים ישנים נוספו אפסים משמאל. אקסל, טפסים וחלק מהמערכות מוחקים את האפסים האלה, ואז נשארות 8 ספרות או פחות. מוסיפים אפסים משמאל עד 9 ספרות, והבדיקה עובדת כרגיל. הכלי שלמעלה עושה את זה לבד ומראה איזה מספר נבדק.',
  },
  {
    id: 'id-faq-exists',
    question: 'מספר תקין אומר שתעודת הזהות קיימת ובתוקף?',
    answer:
      'לא. ספרת הביקורת בודקת רק שהמספר בנוי נכון. אחד מכל עשרה מספרים בני 9 ספרות עובר את הבדיקה, גם אם לא ניתן לאף אחד. היא לא אומרת למי שייך המספר, אם התעודה בתוקף או אם דווחה כאבודה. כדי לזהות אדם צריך לראות את התעודה עצמה, ומי שאיבד תעודה מבקש חדשה ברשות האוכלוסין וההגירה.',
  },
  {
    id: 'id-faq-excel',
    question: 'איך בודקים תעודת זהות באקסל?',
    answer:
      'מדביקים בעמודה ריקה את הנוסחה שבדף, כשהמספר הראשון נמצא בתא A2, וגוררים אותה למטה. הנוסחה מחזירה TRUE למספר תקין ו-FALSE למספר לא תקין, ומשלימה בעצמה אפסים שאקסל מחק. היא עובדת גם ב-Google Sheets ובלי מאקרו. מקפים ורווחים בתא יחזירו FALSE, ולכן כדאי להסיר אותם קודם בחיפוש והחלפה.',
  },
  {
    id: 'id-faq-company',
    question: 'אפשר לבדוק באותה דרך ח.פ. ועוסק מורשה?',
    answer:
      'כן. מספר חברה, שותפות ועמותה הוא 9 ספרות עם ספרת ביקורת באותה שיטה. בדקנו את זה על המאגרים הפתוחים של רשם התאגידים: מתוך יותר מ-835 אלף מספרים, רק מספר חברה אחד לא עבר. לעוסק מורשה יחיד מספר העוסק הוא בדרך כלל מספר הזהות שלו, ולחברה מספר החברה. בכלי בחרו ״ח.פ. או עוסק מורשה״.',
  },
]

function Digits({ children }: { children: ReactNode }) {
  return (
    <span dir="ltr" className={styles.digits}>
      {children}
    </span>
  )
}

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function IdNumberCheckPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="מקלידים מספר ומקבלים מיד תשובה: ספרת הביקורת מתאימה או לא, עם החישוב המלא. אפשר גם לחשב ספרת ביקורת מ-8 ספרות ולבדוק ח.פ. של חברה, שותפות או עמותה."
      chips={['בדיקה וחישוב של ספרת ביקורת', 'גם ח.פ., עוסק מורשה ועמותה', 'נוסחה לאקסל וקוד לטופס', 'המספר לא נשלח לשום מקום']}
      tool={<IdNumberChecker />}
      faq={faq}
      cta={{
        text: 'צריכים טופס או CRM שבודקים ת.ז, ח.פ. וטלפון כבר בהקלדה? אנחנו בונים את זה.',
        label: 'פיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2 id="how" className={styles.anchor}>
        איך מחשבים ספרת ביקורת בתעודת זהות
      </h2>
      <p>
        מספר זהות בישראל הוא 9 ספרות, והאחרונה, הימנית, היא ספרת ביקורת. היא מחושבת מ-8 הספרות שלפניה, כדי שטעות
        הקלדה תתגלה מיד. השיטה היא גרסה של אלגוריתם Luhn, אותה שיטה שבודקת מספרי כרטיסי אשראי:
      </p>
      <ol>
        <li>משלימים את המספר ל-9 ספרות עם אפסים משמאל.</li>
        <li>
          מכפילים כל ספרה במשקל לפי המיקום שלה: הראשונה ב-1, השנייה ב-2, השלישית ב-1, וכך הלאה לסירוגין. ספרת
          הביקורת, התשיעית, מוכפלת ב-1.
        </li>
        <li>
          מכפלה של 10 ומעלה מחליפים בסכום הספרות שלה: 12 נספר כ-3, ו-16 נספר כ-7. זה כמו להחסיר ממנה 9.
        </li>
        <li>מחברים את כל התוצאות. המספר תקין אם הסכום מתחלק ב-10.</li>
      </ol>

      <h3>דוגמה: ספרת הביקורת של {EXAMPLE_BASE}</h3>
      <div className={styles.tableWrap}>
        <table className={styles.table} dir="ltr">
          <caption dir="rtl">חישוב ספרת הביקורת של {EXAMPLE_BASE}</caption>
          <tbody>
            <tr>
              <th scope="row" dir="rtl">
                ספרה
              </th>
              {exampleSteps.map((step) => (
                <td key={step.position}>{step.digit}</td>
              ))}
            </tr>
            <tr>
              <th scope="row" dir="rtl">
                כפול
              </th>
              {exampleSteps.map((step) => (
                <td key={step.position}>{step.weight}</td>
              ))}
            </tr>
            <tr>
              <th scope="row" dir="rtl">
                לסכום
              </th>
              {exampleSteps.map((step) => (
                <td key={step.position}>{step.added}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        הסכום הוא <Digits>{exampleSteps.map((step) => step.added).join(' + ')} = {exampleSum}</Digits>. ה-6 וה-8
        הוכפלו ל-12 ול-16, ולכן נספרו כ-3 וכ-7. עד 40, הכפולה הבאה של 10, חסרים {exampleCheckDigit}, ולכן ספרת
        הביקורת היא {exampleCheckDigit} והמספר המלא הוא <Digits>{`${EXAMPLE_BASE}${exampleCheckDigit}`}</Digits>. בכלי
        שלמעלה אפשר לבחור <a href="#check-digit">חישוב ספרת ביקורת</a> ולראות את אותה טבלה לכל מספר.
      </p>
      <p>
        {EXAMPLE_BASE}
        {exampleCheckDigit} הוא רצף להדגמה. אנחנו לא מציגים בדף מספרים של אנשים, והכלי לא מייצר מספרים אקראיים, כי
        מספר תקין שנוצר באקראי יכול להיות מספר של אדם אמיתי.
      </p>

      <h3>תקין לא אומר קיים</h3>
      <p>
        ספרת הביקורת בודקת רק שהמספר בנוי נכון. בדיוק אחד מכל עשרה מספרים בני 9 ספרות עובר את הבדיקה, גם אם לא ניתן
        לאף אחד. היא תופסת כל טעות בספרה אחת, וכל החלפה בין שתי ספרות סמוכות חוץ מ-09 שהפך ל-90 או להפך. היא לא
        אומרת למי שייך המספר, אם התעודה בתוקף, או אם דווחה כאבודה או גנובה.
      </p>
      <p>
        כדי לדעת שאדם הוא מי שהוא אומר, צריך לראות את התעודה עצמה או להשתמש בשירות זיהוי רשמי. מי שאיבד תעודת זהות או
        שהיא נגנבה מבקש תעודה חדשה ברשות האוכלוסין וההגירה, כמו שמוסבר ב<a href={KOLZCHUT_ID} rel="noopener" target="_blank">
          כל זכות
        </a>
        . חברה, שותפות או עמותה מחפשים לפי המספר ב<a href={ICA_SEARCH} rel="noopener" target="_blank">
          איתור תאגיד של רשם התאגידים
        </a>
        , ועוסק מורשה בודקים ב<a href={VAT_DEALER_LOOKUP} rel="noopener" target="_blank">
          שירות של רשות המסים לפרטי עוסק
        </a>
        .
      </p>

      <h3 id="company-numbers" className={styles.anchor}>
        ח.פ., עוסק מורשה ועמותה: אותה ספרת ביקורת
      </h3>
      <p>
        מספר חברה (ח.פ.), מספר שותפות ומספר עמותה הם גם 9 ספרות, והאחרונה היא ספרת ביקורת באותה שיטה. רשם התאגידים
        לא מפרסם את הנוסחה, ולכן בדקנו אותה בעצמנו על המאגרים הפתוחים שלו ב-data.gov.il, באוקטובר 2026:
      </p>
      <ul>
        <li>חברות: 732,514 מתוך 732,515 מספרים עוברים את הבדיקה. רק מספר אחד במאגר לא עובר.</li>
        <li>שותפויות: כל 29,074 המספרים עוברים.</li>
        <li>עמותות: כל 73,899 המספרים שמתחילים ב-58 עוברים.</li>
      </ul>
      <p>מספרי התאגידים מתחילים ב-5, ושתי הספרות הראשונות מראות את סוג התאגיד:</p>
      <div className={styles.tableWrap}>
        <table className={`${styles.table} ${styles.prefixTable}`}>
          <caption>קידומות של מספרי תאגידים, לפי המאגרים של רשם התאגידים</caption>
          <thead>
            <tr>
              <th scope="col">קידומת</th>
              <th scope="col">סוג</th>
            </tr>
          </thead>
          <tbody>
            {prefixRows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.prefixes.join(', ')}</th>
                <td>{row.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        עוסק מורשה הוא לא סוג נפרד של מספר. לפי רשות המסים, המזהה לצורכי מס של אדם פרטי הוא מספר הזהות שלו, ולכן
        עוסק יחיד רשום בדרך כלל לפי מספר תעודת הזהות, וחברה לפי מספר החברה. כך או כך, אותה ספרת ביקורת בודקת גם מספר
        עוסק. בכלי בחרו <a href="#company">ח.פ. או עוסק מורשה</a>, והוא יראה גם את סוג התאגיד לפי הקידומת.
      </p>

      <h2 id="excel" className={styles.anchor}>
        בדיקת תעודת זהות באקסל, ב-Google Sheets ובקוד
      </h2>
      <p>
        כשמייבאים רשימת לקוחות ל-CRM או בודקים קובץ של עובדים, נוח לבדוק עמודה שלמה בבת אחת. הנוסחאות עובדות באקסל
        2010 ואילך וב-Google Sheets, בלי מאקרו ובלי תוסף.
      </p>
      <h3>נוסחה לבדיקת תעודת זהות באקסל</h3>
      <p>
        המספר הראשון נמצא בתא A2. מדביקים את הנוסחה בתא ריק באותה שורה וגוררים למטה. התוצאה היא TRUE למספר תקין
        ו-FALSE למספר לא תקין, ואפסים שאקסל מחק מההתחלה מושלמים לבד.
      </p>
      <CodeSnippet
        code={EXCEL_VALIDATE_FORMULA}
        copyLabel="העתקת נוסחת הבדיקה"
        copiedMessage="נוסחת הבדיקה הועתקה"
        mode="excel-validate"
      />
      <p>
        תא עם מקף או רווח, כמו <Digits>12345678-2</Digits>, יחזיר FALSE. מנקים אותם קודם: מסמנים את העמודה, Ctrl+H,
        ומחליפים מקף בכלום.
      </p>
      <h3>נוסחה לחישוב ספרת ביקורת</h3>
      <p>
        כש-8 הספרות נמצאות בתא A2, הנוסחה מחזירה את הספרה התשיעית. אם הנוסחה בתא B2, המספר המלא הוא{' '}
        <code dir="ltr">=TEXT(A2,&quot;00000000&quot;)&amp;B2</code>.
      </p>
      <CodeSnippet
        code={EXCEL_CHECK_DIGIT_FORMULA}
        copyLabel="העתקת נוסחת ספרת הביקורת"
        copiedMessage="נוסחת ספרת הביקורת הועתקה"
        mode="excel-check-digit"
      />
      <h3>פונקציית JavaScript לטופס באתר</h3>
      <p>
        הפונקציה מקבלת מחרוזת או מספר, מוחקת רווחים ומקפים, משלימה אפסים ומחזירה true או false. היא מתאימה לבדיקה
        בזמן ההקלדה בטופס. בצד השרת חוזרים על אותה בדיקה, כי בדיקה בדפדפן אפשר לעקוף.
      </p>
      <CodeSnippet
        code={JS_SNIPPET}
        copyLabel="העתקת הפונקציה"
        copiedMessage="הפונקציה הועתקה"
        mode="javascript"
      />

      <h2>מספרי זהות בטפסים, ב-CRM ובחשבוניות</h2>
      <p>
        עסקים מבקשים מספר זהות או ח.פ. בטופס הרשמה, בהזמנה, בחוזה, בתלוש שכר ובחשבונית מס ללקוח עסקי, שבה רושמים את
        מספר העוסק שלו. בדיקת ספרת ביקורת כבר בזמן ההקלדה עוצרת טעות לפני שהיא נשמרת ב-CRM, ולפני שחשבונית יוצאת עם
        מספר עוסק שגוי. בחשבונית מעל הסף זה חשוב במיוחד, כי{' '}
        <Link href="/tools/allocation-number">מספר ההקצאה</Link> מתבקש לפי מספר העוסק של הלקוח.
      </p>
      <h3>פרטיות: מספר זהות הוא מידע אישי</h3>
      <p>
        מאז תיקון 13 לחוק הגנת הפרטיות, שנכנס לתוקף ב-14 באוגוסט 2025, סעיף 3 לחוק מגדיר מידע אישי כנתון על אדם מזוהה
        או שאפשר לזהות אותו, ומונה את מספר הזהות בין הפרטים המזהים. גם הרשות להגנת הפרטיות קבעה שמספר זהות הוא מידע
        מוגן, ושאוספים אותו או מצלמים תעודה רק כשבאמת צריך. בפועל:
      </p>
      <ul>
        <li>מבקשים מספר זהות רק כשיש בו צורך, ואומרים בטופס למה הוא נדרש ומה יקרה אם לא ימסרו אותו (סעיף 11).</li>
        <li>לא שולחים אותו במייל פתוח, לא מכניסים אותו לכתובת הדף ולא שולחים אותו לכלי אנליטיקס או פרסום.</li>
        <li>שומרים אותו רק כל עוד צריך, ונותנים גישה רק למי שעובד איתו.</li>
        <li>
          מעדכנים את מדיניות הפרטיות של האתר. אפשר להיעזר ב<Link href="/tools/privacy-policy-generator">
            מחולל מדיניות הפרטיות
          </Link>{' '}
          שלנו.
        </li>
      </ul>
      <p>הכלי בדף הזה בודק את המספר בדפדפן בלבד. המספר לא נשלח לשרת, לא נשמר ולא נכנס לכתובת הדף.</p>
      <h3>טעויות נפוצות</h3>
      <ul>
        <li>
          <strong>אפסים שנמחקו.</strong> אקסל שומר מספר זהות כמספר, ו-<Digits>012345674</Digits> הופך ל-
          <Digits>12345674</Digits>. מחזירים את האפסים בעיצוב תאים, בתבנית מותאמת 000000000, או בנוסחה{' '}
          <code dir="ltr">{EXCEL_PAD_FORMULA}</code>. בייבוא CSV מגדירים את העמודה כטקסט.
        </li>
        <li>
          <strong>ספרת ביקורת שנשמטה.</strong> במסמכים ישנים ספרת הביקורת כתובה לפעמים אחרי מקף, ואנשים מקלידים רק את
          8 הספרות שלפניה. מספר כזה ייראה לא תקין.
        </li>
        <li>
          <strong>שדה מספרי בטופס.</strong> שדה מסוג number מוחק אפסים מההתחלה ומקבל גם את האות e. עדיף שדה טקסט עם
          מקלדת ספרות, inputmode=&quot;numeric&quot;, ובדיקה של ספרת הביקורת.
        </li>
        <li>
          <strong>בדיקה של אורך בלבד.</strong> טופס שבודק רק שיש 9 ספרות יעביר כל טעות הקלדה, וטופס שדורש בדיוק 9
          ספרות יחסום מספרים שהאפס שלהם נמחק.
        </li>
        <li>
          <strong>להסיק שהמספר שייך ללקוח.</strong> מספר תקין יכול להיות של כל אחד, או של אף אחד.
        </li>
      </ul>

      <h2>מקורות</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noopener" target="_blank">
              {source.label}
            </a>
            : {source.note}
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        האלגוריתם, הנוסחאות והקוד נבדקו ב-23 באוקטובר 2026 מול המקורות, ועל כל מספרי התאגידים במאגרים הפתוחים.
        רשות האוכלוסין ורשם התאגידים לא מפרסמים את הנוסחה בעצמם.
      </p>
    </ToolLayout>
  )
}
