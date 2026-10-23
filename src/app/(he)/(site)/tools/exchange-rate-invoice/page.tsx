import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import ExchangeRateConverter from '../../components/tools/ExchangeRateConverter'
import {
  BOI_API_GUIDE_PDF,
  BOI_DATES_PDF,
  BOI_RATES_PAGE,
  BOI_REPRATE_PAGE,
  convert,
  currencies,
  formatDots,
  formatForeign,
  formatRate,
  formatShekels,
  invoiceLine,
  parseRateMicros,
} from '@/lib/exchange-rate'
import { STANDARD_VAT_RATE } from '@/lib/vat-calculator'
import styles from './page.module.css'

const PATH = '/tools/exchange-rate-invoice'
const TITLE = 'שער יציג לחשבונית: המרה לשקלים לפי תאריך'
const META_TITLE = 'שער יציג היום ולפי תאריך: המרת דולר ויורו לשקלים'
const DESCRIPTION =
  'שער יציג של בנק ישראל לפי תאריך לדולר, לאירו ול-12 מטבעות נוספים: המרה לשקלים ובחזרה, עם מע״מ או בלי, 30 ימי מסחר אחרונים ושורה מוכנה לחשבונית.'

const wikisource = (title: string, section?: string) =>
  `https://he.wikisource.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}${
    section ? `#${encodeURIComponent(`סעיף_${section}`)}` : ''
  }`

const BOOKKEEPING_RULES = wikisource('הוראות מס הכנסה (ניהול פנקסי חשבונות)', '22')
const VAT_LAW = wikisource('חוק מס ערך מוסף', '30')

const sample = {
  amount: 250_000,
  iso: '2026-10-22',
  rate: '3.107',
  previousIso: '2026-10-21',
  previousRate: '3.091',
  sundayIso: '2026-10-18',
  fridayIso: '2026-10-16',
  fridayRate: '3.089',
}

const micros = (text: string) => {
  const value = parseRateMicros(text)
  if (!value) throw new Error(`Bad sample rate ${text}`)
  return value
}

const example = convert({
  amount: sample.amount,
  direction: 'to-ils',
  micros: micros(sample.rate),
  unit: 1,
  withVat: true,
  code: 'USD',
})

const morning = convert({
  amount: sample.amount,
  direction: 'to-ils',
  micros: micros(sample.previousRate),
  unit: 1,
  withVat: false,
  code: 'USD',
})

const amountText = formatForeign(sample.amount, 'USD')
const rateText = formatRate(example.micros)
const morningGap = formatShekels(example.shekels.net - morning.shekels.net)

const exampleRows: { step: string; formula: string; result: string }[] = [
  { step: 'סכום החשבונית לפני מע״מ', formula: '', result: amountText },
  { step: `השער היציג מ-${formatDots(sample.iso)}`, formula: '', result: `${rateText} ₪ ל-1 USD` },
  {
    step: 'סכום בשקלים לפני מע״מ',
    formula: `2,500 × ${rateText}`,
    result: formatShekels(example.shekels.net),
  },
  {
    step: `מע״מ ${STANDARD_VAT_RATE}%`,
    formula: `${formatShekels(example.shekels.net)} × ${STANDARD_VAT_RATE}%`,
    result: formatShekels(example.shekels.vat),
  },
  {
    step: 'סה״כ לתשלום כולל מע״מ',
    formula: `${formatShekels(example.shekels.net)} + ${formatShekels(example.shekels.vat)}`,
    result: formatShekels(example.shekels.gross),
  },
]

const sources: { href: string; title: string; note: string }[] = [
  {
    href: BOI_REPRATE_PAGE,
    title: 'בנק ישראל: מהו שער חליפין יציג',
    note: 'איך השער מחושב, שעות הדגימה והפרסום, ימים בלי שער, ושהשער אינו מחייב על פי דין. הדף עודכן ב-17.7.2024',
  },
  {
    href: BOI_RATES_PAGE,
    title: 'בנק ישראל: שערי חליפין יציגים',
    note: 'השערים העדכניים של 14 המטבעות, ובהם ין יפני ל-100 יחידות ולירה לבנונית ל-10 יחידות',
  },
  {
    href: BOI_DATES_PDF,
    title: 'בנק ישראל: רשימת מועדים המשפיעים על פעילות בנק ישראל לשנים 2026-2027',
    note: 'הימים שבהם הבנק לא יפרסם שערים יציגים, מלבד שבת וראשון',
  },
  {
    href: BOI_API_GUIDE_PDF,
    title: 'Bank of Israel: Extracting representative exchange rates from the new series database',
    note: 'הממשק של מאגר הסדרות, שממנו המחשבון טוען את השערים',
  },
  {
    href: BOOKKEEPING_RULES,
    title: 'הוראות מס הכנסה (ניהול פנקסי חשבונות), התשל״ג-1973',
    note: 'סעיף 22: הרישום נעשה במטבע ישראלי, ובתקבול במטבע אחר מציינים גם את המטבע והסכום',
  },
  {
    href: VAT_LAW,
    title: 'חוק מס ערך מוסף, התשל״ו-1975',
    note: 'סעיף 30(א)(5): מע״מ בשיעור אפס על מתן שירות לתושב חוץ, והחריגים',
  },
]

const faq: ToolFaqEntry[] = [
  {
    id: 'fx-faq-what',
    question: 'מה זה שער יציג?',
    answer:
      'שער יציג הוא שער החליפין של מטבע חוץ מול השקל, שבנק ישראל מחשב ומפרסם פעם ביום בימי מסחר. הוא מבוסס על ממוצע שערי האמצע שהבנקים מציגים במסחר ביניהם, ולא על עסקה מסוימת. בנק ישראל מפרסם שער יציג ל-14 מטבעות, בהם דולר, אירו, לירה שטרלינג, פרנק שווצרי וין יפני. לשער אין מעמד מחייב על פי דין, ומשתמשים בו בעיקר בחוזים, בחשבוניות ובשיערוך.',
  },
  {
    id: 'fx-faq-when',
    question: 'מתי מתפרסם השער היציג?',
    answer:
      'ביום מסחר רגיל, זמן קצר אחרי 15:15. בימי שישי, בחול המועד ובערבי חג, זמן קצר אחרי 12:15. בנק ישראל מציין שהשעה לא מובטחת, ושייתכנו ימים שבהם השער ייקבע ויתפרסם בשעה אחרת. בשבת, ביום ראשון, בימי שבתון בישראל ובחלק מהחגים בחו״ל אין שער יציג חדש, ולכן משתמשים בשער האחרון שפורסם לפני אותו יום.',
  },
  {
    id: 'fx-faq-weekend',
    question: 'מה השער היציג בשבת או בחג?',
    answer: `בשבת, ביום ראשון ובימי שבתון בישראל בנק ישראל לא מפרסם שער יציג. גם ביום כיפור, בערב ראש השנה, בפורים, בתשעה באב ובחגים בחו״ל כמו חג המולד ו-1 בינואר אין שער. ביום כזה תקף השער האחרון שפורסם לפניו. למשל, לשבת 17 באוקטובר 2026 השער של הדולר הוא ${formatRate(
      micros(sample.fridayRate),
    )} ₪, השער מיום שישי, 16 באוקטובר.`,
  },
  {
    id: 'fx-faq-invoice',
    question: 'איזה שער יציג רושמים בחשבונית?',
    answer:
      'לשער היציג אין מעמד מחייב בחוק, ובנק ישראל ממליץ שהצדדים יסכימו מראש איזה שער חל: של יום העסקה, האחרון שפורסם לפניו או של יום אחר. בחשבונית עצמה רושמים את השער ואת התאריך שלו, ונוהגים באותה שיטה בכל החשבוניות. חשבונית שיוצאת לפני 15:15 יכולה להשתמש רק בשער שכבר פורסם, כלומר של יום המסחר הקודם.',
  },
  {
    id: 'fx-faq-bank',
    question: 'מה ההבדל בין שער יציג לשער של הבנק?',
    answer:
      'השער היציג הוא ממוצע של שערי האמצע, בין קנייה למכירה, במסחר בין הבנקים. כשאתם ממירים כסף, הבנק משתמש בשערים שלו ללקוחות: שער קנייה נמוך מהיציג כשהוא קונה מכם מטבע, ושער מכירה גבוה ממנו כשהוא מוכר לכם, ולפעמים מוסיף עמלה. לכן הסכום שנכנס לחשבון כשלקוח משלם בדולרים יכול להיות שונה מהסכום בשקלים שבחשבונית.',
  },
  {
    id: 'fx-faq-vat',
    question: 'איך מחשבים מע״מ על חשבונית בדולרים?',
    answer: `ממירים לשקלים את הסכום לפני מע״מ לפי השער, ומחשבים עליו ${STANDARD_VAT_RATE}%. למשל, 2,500 דולר בשער ${rateText} הם ${formatShekels(
      example.shekels.net,
    )}, המע״מ ${formatShekels(example.shekels.vat)} והסה״כ ${formatShekels(
      example.shekels.gross,
    )}. על שירות לתושב חוץ יכול לחול מע״מ בשיעור אפס, לפי סעיף 30(א)(5) לחוק מע״מ, חוץ ממקרים שהחוק מחריג. אז החשבונית יוצאת בלי מע״מ.`,
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function ExchangeRateInvoicePage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="שער יציג הוא שער החליפין של מטבע חוץ מול השקל, שבנק ישראל מפרסם פעם ביום בימי מסחר, זמן קצר אחרי 15:15. בוחרים מטבע ותאריך ומקבלים את השער שהיה בתוקף, את הסכום בשקלים עם מע״מ או בלי, ושורה מוכנה לחשבונית."
      chips={['14 המטבעות של בנק ישראל', 'לפי תאריך, גם בשבת ובחג', 'עם מע״מ או בלי', 'שורה מוכנה לחשבונית']}
      tool={<ExchangeRateConverter />}
      faq={faq}
      cta={{
        text: 'אנחנו מחברים CRM שמפיק חשבוניות במטבע חוץ וממיר אותן לשקלים לפי השער היציג של בנק ישראל בלי הקלדה.',
        label: 'אוטומציה לעסקים',
        href: '/services/automation',
      }}
    >
      <h2 id="what" className={styles.anchor}>
        מהו שער יציג ומתי הוא מתפרסם
      </h2>
      <p>
        השער היציג הוא אינדיקטור לשער החליפין של מטבע בשוק. בנק ישראל מחשב את השער של הדולר מדגימה של שערי האמצע
        שהבנקים מציגים במסחר ביניהם, ברגע אקראי בין 13:15 ל-15:15, ומוציא מהחישוב שערים שחורגים מהממוצע. השערים של
        שאר המטבעות מחושבים לפי השער של הדולר ולפי השערים שלהם מול הדולר בשווקים בעולם באותו רגע.
      </p>
      <p>
        השער מתפרסם זמן קצר אחרי 15:15. בימי שישי, בחול המועד ובערבי חג הדגימה היא בין 10:15 ל-12:15, והשער מתפרסם
        זמן קצר אחרי 12:15. בנק ישראל מציין שהשעה לא מובטחת. בנק ישראל מפרסם שער יציג ל-14 מטבעות:
      </p>
      <ul className={styles.currencyList}>
        {currencies.map((currency) => (
          <li key={currency.code}>
            <span className={styles.code}>{currency.code}</span> {currency.name}
            {currency.unit > 1 ? `, השער ל-${currency.unit} יחידות` : ''}
          </li>
        ))}
      </ul>
      <h3>ימים בלי שער יציג</h3>
      <p>
        בשבת, ביום ראשון ובימי שבתון בישראל אין שער יציג. גם בחג המולד, ב-1 בינואר ובחג הפסחא אין, כי שוקי מטבע החוץ
        ברוב העולם סגורים. ברשימה של בנק ישראל ל-2026 מופיעים גם פורים ושושן פורים, ערב פסח, תשעה באב, ערב ראש השנה,
        יום כיפור ויום הבחירות לכנסת ב-27 באוקטובר. ביום כזה תקף השער האחרון שפורסם לפניו, ולכן המחשבון מציג אותו
        וכותב מאיזה יום הוא.
      </p>

      <h2 id="invoice" className={styles.anchor}>
        איזה שער לרשום בחשבונית במטבע חוץ
      </h2>
      <p>
        לפי סעיף 22 להוראות מס הכנסה (ניהול פנקסי חשבונות), הרישום בספרים נעשה במטבע ישראלי, וכשהתקבול במטבע אחר
        מציינים גם את סוג המטבע ואת הסכום בו. לכן עסק שמוציא חשבונית בדולרים או באירו צריך גם את הסכום בשקלים, ולשם כך
        צריך שער.
      </p>
      <p>
        לשער היציג אין מעמד מחייב על פי דין, והצדדים לעסקה יכולים להסכים על כל שער. בנק ישראל ממליץ לקבוע מראש איזה
        שער יציג חל על העסקה: השער שנקבע ביום העסקה, השער שנקבע לאחרונה לפני יום העסקה, או השער של יום אחר. בחשבונית
        עצמה כדאי לכתוב את השער ואת התאריך שלו, ולנהוג באותה שיטה בכל החשבוניות. בשאלה איזה יום מחייב אתכם, ובהפרשי
        שער כשהתשלום מגיע אחרי שהשער השתנה, שואלים את רואה החשבון.
      </p>
      <h3>חשבונית שיוצאת לפני 15:15</h3>
      <p>
        ביום מסחר רגיל השער של היום מתפרסם רק אחר הצהריים. חשבונית שיוצאת בבוקר יכולה להשתמש רק בשער שכבר ידוע,
        כלומר של יום המסחר הקודם. כשבוחרים במחשבון את התאריך של היום לפני שהשער פורסם, מוצג השער האחרון שפורסם, עם
        התאריך שלו.
      </p>

      <h2 id="vat" className={styles.anchor}>
        מע״מ על חשבונית במטבע חוץ
      </h2>
      <p>
        המע״מ מחושב על הסכום בשקלים: ממירים את הסכום לפני מע״מ לפי השער, ועליו מוסיפים {STANDARD_VAT_RATE}%. כך
        מחשב הכלי כשמסמנים ״להוסיף מע״מ״, ומציג גם את הסה״כ במטבע החוץ.
      </p>
      <p>
        לפי סעיף 30(א)(5) לחוק מע״מ, על מתן שירות לתושב חוץ חל מע״מ בשיעור אפס, חוץ ממקרים שהחוק מחריג, למשל כשהשירות
        ניתן בפועל גם לתושב ישראל בישראל. עסקה כזו מדווחים, אבל המע״מ בה הוא אפס, ולכן בחשבונית ללקוח בחו״ל משאירים
        את סימון המע״מ כבוי. אם לא ברור שהעסקה עומדת בתנאים, בודקים עם רואה החשבון.
      </p>

      <h2 id="example" className={styles.anchor}>
        דוגמה: חשבונית של 2,500 דולר
      </h2>
      <p>
        עסק מוציא ב-22 באוקטובר 2026 חשבונית ללקוח בישראל על {amountText} לפני מע״מ. השער היציג של הדולר באותו יום
        היה {rateText} ₪. כך מחשבים את הסכום בשקלים:
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>חשבונית של 2,500 דולר לפי השער היציג מ-22.10.2026</caption>
          <thead>
            <tr>
              <th scope="col">שלב</th>
              <th scope="col">חישוב</th>
              <th scope="col">סכום</th>
            </tr>
          </thead>
          <tbody>
            {exampleRows.map((row) => (
              <tr key={row.step}>
                <th scope="row">{row.step}</th>
                <td className={styles.formula}>{row.formula}</td>
                <td className={styles.amount}>{row.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        בחשבונית כותבים: <q>{invoiceLine(example.micros, 1, 'USD', sample.iso)}</q>.
      </p>
      <p>
        אם אותה חשבונית יוצאת ב-22 באוקטובר בבוקר, לפני שהשער של היום פורסם, השער הידוע הוא של 21 באוקטובר,{' '}
        {formatRate(morning.micros)} ₪. אז הסכום לפני מע״מ הוא {formatShekels(morning.shekels.net)}, {morningGap}{' '}
        פחות. חשבונית מיום ראשון, 18 באוקטובר 2026, מקבלת את השער של יום שישי, 16 באוקטובר:{' '}
        {formatRate(micros(sample.fridayRate))} ₪.
      </p>

      <h2 id="bank-rate" className={styles.anchor}>
        שער יציג מול השער של הבנק
      </h2>
      <p>
        השער היציג מבוסס על ממוצע של שערי הקנייה והמכירה, ולא משקף בהכרח עסקאות שבוצעו. כשממירים כסף בפועל, הבנק
        משתמש בשערים שהוא נותן ללקוחות: שער קנייה כשהוא קונה מכם מטבע חוץ, ושער מכירה כשהוא מוכר לכם, ולפעמים מוסיף
        עמלת המרה. גם השערים של שטרות כסף שונים מהשערים של העברות.
      </p>
      <p>
        לכן כשלקוח בחו״ל משלם {amountText}, הסכום שנכנס לחשבון בשקלים תלוי בשער שהבנק נתן ביום ההמרה, ולא בשער
        שבחשבונית. ההפרש בין הסכום שבחשבונית לסכום שהתקבל הוא הפרש שער, ורושמים אותו בספרים לפי ההנחיות של רואה
        החשבון.
      </p>

      <h2>מקורות</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noopener" target="_blank">
              {source.title}
            </a>
            : {source.note}
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        השערים בדוגמאות נלקחו ממאגר הסדרות של בנק ישראל, והמועדים והכללים נבדקו מול אתר בנק ישראל ונוסח החוקים
        בוויקיטקסט ב-23 באוקטובר 2026. ההסברים בדף הם מידע כללי ולא ייעוץ מס.
      </p>
    </ToolLayout>
  )
}
