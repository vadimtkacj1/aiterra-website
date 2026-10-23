import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import GematriaCalculator from '../../components/tools/GematriaCalculator'
import { calculate, famousPairs, methods, valueOf } from '@/lib/gematria'
import styles from './page.module.css'

const PATH = '/tools/gematria-calculator'
const TITLE = 'מחשבון גימטריה'
const META_TITLE = 'מחשבון גימטריה: ערך מילה, שם או משפט בכל השיטות'
const DESCRIPTION =
  'מחשבון גימטריה אונליין: מקלידים מילה, שם או משפט ומקבלים את הערך במספר הכרחי, גדול, קטן וסידורי, באתב״ש ובאלב״ם, עם פירוט לכל אות ומילים בעלות אותו ערך.'

const wiki = (title: string) => `https://he.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`

const SOURCES = {
  gematria: wiki('גימטריה'),
  atbash: wiki('אתב"ש'),
  avot: `https://he.wikisource.org/wiki/${encodeURIComponent('משנה_אבות_ג_יח')}`,
  jeremiah: `https://he.wikisource.org/wiki/${encodeURIComponent('ירמיהו_כה_כו')}`,
}

const shalom = calculate('שלום').totals
const ahava = valueOf('אהבה')
const yayin = valueOf('יין')
const sheshach = calculate('ששך')

const faq: ToolFaqEntry[] = [
  {
    id: 'gematria-faq-what',
    question: 'מה זה גימטריה?',
    answer:
      'גימטריה היא חישוב הערך המספרי של מילה לפי ערכי האותיות העבריות: א׳ שווה 1, י׳ שווה 10, ק׳ שווה 100 ות׳ שווה 400. מחברים את ערכי כל האותיות ומקבלים מספר. בפרשנות, בדרש ובקבלה משווים בין מילים עם אותו ערך, ובחיי היום-יום משתמשים באותה שיטה כדי לכתוב מספרים באותיות, כמו בתאריך העברי ובמספור פרקים.',
  },
  {
    id: 'gematria-faq-calc',
    question: 'איך מחשבים גימטריה של שם?',
    answer: `כותבים את השם במחשבון ומקבלים את הסכום מיד. ידנית מחברים את ערכי האותיות: ״שלום״ הוא ש׳ 300, ל׳ 30, ו׳ 6 ומ׳ 40, ובסך הכול ${shalom.standard}. ניקוד לא משנה את החישוב, וגם לא רווחים, ולכן שם פרטי ושם משפחה אפשר לחשב יחד או בנפרד. כתיב מלא וכתיב חסר נותנים תוצאות שונות, כי כל י׳ או ו׳ מוסיפה לסכום.`,
  },
  {
    id: 'gematria-faq-finals',
    question: 'כמה שוות האותיות הסופיות?',
    answer: `בגימטריה הרגילה, ״מספר הכרחי״, האותיות הסופיות שוות לרגילות: ם׳ שווה 40 כמו מ׳. בשיטת ״מספר גדול״ הן ממשיכות את הספירה אחרי ת׳: ך׳ 500, ם׳ 600, ן׳ 700, ף׳ 800 ו-ץ׳ 900. לכן ״שלום״ שווה ${shalom.standard} בשיטה הרגילה ו-${shalom.gadol} במספר גדול. כשאומרים ״בגימטריה״ בלי לציין שיטה, הכוונה כמעט תמיד לשיטה הרגילה.`,
  },
  {
    id: 'gematria-faq-katan',
    question: 'מה זה גימטריה קטנה?',
    answer: `גימטריה קטנה, או ״מספר קטן״, מורידה את האפסים מערך כל אות, כך שכל אות שווה בין 1 ל-9: י׳ שווה 1, כ׳ 2, ק׳ 1 ות׳ 4. ״שלום״ שווה בה ${shalom.katan}. יש שממשיכים ומחברים את הספרות של התוצאה עד שנשארת ספרה אחת, ויש שקוראים לשיטה הזו ״מספר קטן מספרי״. המחשבון מציג את הסכום לפני הצמצום.`,
  },
  {
    id: 'gematria-faq-atbash',
    question: 'מה זה אתב״ש?',
    answer: `אתב״ש היא שיטה שמחליפה כל אות באות שמולה כשהופכים את סדר האלף-בית: א׳ בת׳, ב׳ בש׳, ג׳ בר׳ וכן הלאה. הדוגמה המוכרת היא בירמיהו כ״ה, כ״ו, שם ״ששך״ נקראת באתב״ש ״${sheshach.atbashText}״. המחשבון מציג את המילה אחרי ההחלפה ואת ערכה בגימטריה. אלב״ם עובדת באותה דרך, אבל מחליפה בין שני חצאי האלף-בית: א׳ בל׳ וב׳ במ׳.`,
  },
  {
    id: 'gematria-faq-same',
    question: 'אילו מילים שוות באותו ערך?',
    answer: `הצירופים המוכרים: ״אהבה״ ו״אחד״ שוות ${ahava}, ״יין״ ו״סוד״ שוות ${yayin}, ומכאן הביטוי ״נכנס יין יצא סוד״. גם ״אלהים״ ו״הטבע״ שוות 86, ו״נחש״ ו״משיח״ 358. המחשבון מציג מילים שוות ערך מתוך רשימה קצרה של כ-80 מילים מוכרות שבחרנו, ולא מכל המילון, כך שאם לא מופיעה מילה, זה לא אומר שאין כזו.`,
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function GematriaCalculatorPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede={`גימטריה היא סכום ערכי האותיות של מילה: ״שלום״ שווה ${shalom.standard}, כי ש׳ 300, ל׳ 30, ו׳ 6 ומ׳ 40. כאן מקלידים מילה, שם או משפט ומקבלים את הערך בשש שיטות, עם פירוט לכל אות ומילים מוכרות עם אותו ערך.`}
      chips={['6 שיטות חישוב', 'פירוט לכל אות', 'אותיות סופיות וניקוד', 'מילים שוות ערך']}
      tool={<GematriaCalculator />}
      faq={faq}
      cta={{
        text: 'אנחנו מפתחים לעסקים כלים ומערכות בעברית שעובדים נכון עם אותיות, ניקוד וכיווניות.',
        label: 'פיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2 id="values" className={styles.anchor}>
        טבלת ערכי האותיות בגימטריה
      </h2>
      <p>
        22 האותיות מתחלקות לשלוש קבוצות: יחידות, עשרות ומאות. בגימטריה הרגילה חמש האותיות הסופיות שוות לאותיות הרגילות,
        ובשיטת המספר הגדול הן ממשיכות מ-500 עד 900.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>ערכי האותיות במספר הכרחי</caption>
          <thead>
            <tr>
              <th scope="col">קבוצה</th>
              <th scope="col">אותיות וערכים</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">יחידות</th>
              <td>א׳ 1, ב׳ 2, ג׳ 3, ד׳ 4, ה׳ 5, ו׳ 6, ז׳ 7, ח׳ 8, ט׳ 9</td>
            </tr>
            <tr>
              <th scope="row">עשרות</th>
              <td>י׳ 10, כ׳ 20, ל׳ 30, מ׳ 40, נ׳ 50, ס׳ 60, ע׳ 70, פ׳ 80, צ׳ 90</td>
            </tr>
            <tr>
              <th scope="row">מאות</th>
              <td>ק׳ 100, ר׳ 200, ש׳ 300, ת׳ 400</td>
            </tr>
            <tr>
              <th scope="row">סופיות (מספר גדול)</th>
              <td>ך׳ 500, ם׳ 600, ן׳ 700, ף׳ 800, ץ׳ 900</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="methods" className={styles.anchor}>
        שיטות החישוב במחשבון
      </h2>
      <p>
        ל
        <a href={SOURCES.gematria} rel="noopener" target="_blank">
          גימטריה
        </a>{' '}
        יש כמה שיטות, ובמסורת היהודית משתמשים ביותר מאחת. המחשבון מחשב את כולן יחד:
      </p>
      <ul>
        {methods.map((method) => (
          <li key={method.id}>
            <strong>{method.name}:</strong> {method.description}
          </li>
        ))}
      </ul>
      <p>
        ״שלום״, לדוגמה, שווה {shalom.standard} במספר הכרחי, {shalom.gadol} במספר גדול, {shalom.katan} במספר קטן ו-
        {shalom.ordinal} במספר סידורי.
      </p>

      <h2 id="how" className={styles.anchor}>
        איך מחשבים גימטריה בלי מחשבון
      </h2>
      <p>
        עוברים על המילה אות אחר אות, רושמים ליד כל אות את ערכה ומחברים. ״אהבה״ היא 1 ועוד 5 ועוד 2 ועוד 5, כלומר {ahava}.
        כמה דברים שכדאי לשים לב אליהם:
      </p>
      <ul>
        <li>ניקוד, גרש וגרשיים לא נספרים. ״שָׁלוֹם״ ו״שלום״ שוות אותו דבר.</li>
        <li>כתיב מלא מוסיף: ״שולחן״ גדולה ב-6 מ״שלחן״ בגלל הו׳.</li>
        <li>רווחים לא משנים, ולכן משפט מחושב כסכום כל המילים שבו.</li>
        <li>המחשבון מתעלם ממספרים ומאותיות לועזיות ומציין אילו תווים לא נספרו.</li>
      </ul>

      <h2 id="sources" className={styles.anchor}>
        מאיפה באה הגימטריה
      </h2>
      <p>
        לפי{' '}
        <a href={SOURCES.gematria} rel="noopener" target="_blank">
          הערך ״גימטריה״ בוויקיפדיה העברית
        </a>
        , המילה באה מהיוונית, והשימוש בערכים המספריים של האותיות מופיע כבר בספרות חז״ל. במשנה, ב
        <a href={SOURCES.avot} rel="noopener" target="_blank">
          פרקי אבות ג׳, י״ח
        </a>
        , נאמר ״תקופות וגימטריאות פרפראות לחכמה״, כלומר תוספת לחכמה ולא עיקרה. ב
        <a href={SOURCES.jeremiah} rel="noopener" target="_blank">
          ירמיהו כ״ה, כ״ו
        </a>{' '}
        ״ששך״ היא {sheshach.atbashText} ב
        <a href={SOURCES.atbash} rel="noopener" target="_blank">
          אתב״ש
        </a>
        . הערכים שהמחשבון מחשב הם חשבון בלבד, ומה שמסיקים מהם הוא עניין של פרשנות.
      </p>

      <h2 id="pairs" className={styles.anchor}>
        מילים מוכרות עם אותו ערך
      </h2>
      <p>הצירופים האלה יצאו מתוך הרשימה הקצרה שבמחשבון, וכל ערך חושב כאן בשיטה הרגילה:</p>
      <ul>
        {famousPairs.map((pair) => (
          <li key={pair.value}>
            {pair.words.map((word) => `״${word}״`).join(' ו')}: {pair.value}
          </li>
        ))}
      </ul>
    </ToolLayout>
  )
}
