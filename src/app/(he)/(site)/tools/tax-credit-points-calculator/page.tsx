import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import TaxCreditPointsCalculator from '../../components/tools/TaxCreditPointsCalculator'
import {
  CHILD_BANDS,
  CHILD_POINTS_TWELFTHS,
  OLEH_FIRST_ALIYAH_YEAR,
  POINT_VALUE_ANNUAL,
  POINT_VALUE_MONTHLY,
  REVIEWED_LABEL,
  TAX_YEAR,
  calculateCredits,
  childBandLabel,
  formatPoints,
  formatShekels,
  olehTwelfthsInYear,
  soldierTwelfthsInYear,
  type ChildBand,
} from '@/lib/tax-credit-points'
import styles from './page.module.css'

const PATH = '/tools/tax-credit-points-calculator'
const TITLE = 'מחשבון נקודות זיכוי במס הכנסה 2026'
const META_TITLE = 'מחשבון נקודות זיכוי 2026: כמה נקודות מגיעות לכם וכמה הן שוות'
const DESCRIPTION =
  'מחשבון נקודות זיכוי במס הכנסה ל-2026: תושב, אישה, ילדים לפי שנת לידה, עולה חדש, חייל משוחרר ותואר אקדמי. סך הנקודות ושווין בשקלים לחודש ולשנה.'

const noChildren: Record<ChildBand, number> = { birth: 0, toTwo: 0, three: 0, fourFive: 0, sixSeventeen: 0, eighteen: 0 }
const exampleChildren: Record<ChildBand, number> = { ...noChildren, toTwo: 1, sixSeventeen: 1 }
const example = calculateCredits({ gender: 'woman', children: exampleChildren, degree: 'first', oleh: null, soldier: null })
const man = calculateCredits({ gender: 'man', children: noChildren, degree: 'none', oleh: null, soldier: null })
const woman = calculateCredits({ gender: 'woman', children: noChildren, degree: 'none', oleh: null, soldier: null })
const olehYearOne = olehTwelfthsInYear({ month: 1, year: TAX_YEAR })
const olehMidYear = olehTwelfthsInYear({ month: 1, year: TAX_YEAR - 1 })

const sources: { href: string; label: string; note: string }[] = [
  {
    href: 'https://he.wikisource.org/wiki/%D7%A4%D7%A7%D7%95%D7%93%D7%AA_%D7%9E%D7%A1_%D7%94%D7%9B%D7%A0%D7%A1%D7%94',
    label: 'פקודת מס הכנסה, בנוסח המעודכן בוויקיטקסט',
    note: 'סעיפים 34 ו-36 (תושב ונסיעה), 35 (עולה), 36א (אישה), 39א (חייל משוחרר), 40ג (תואר אקדמי) ו-66 (ילדים)',
  },
  {
    href: 'https://www.kolzchut.org.il/he/%D7%A0%D7%A7%D7%95%D7%93%D7%95%D7%AA_%D7%96%D7%99%D7%9B%D7%95%D7%99_%D7%9E%D7%9E%D7%A1_%D7%94%D7%9B%D7%A0%D7%A1%D7%94_%D7%9C%D7%AA%D7%95%D7%A9%D7%91_%D7%99%D7%A9%D7%A8%D7%90%D7%9C',
    label: 'כל זכות: נקודות זיכוי ממס הכנסה לתושב ישראל',
    note: '2.25 נקודות לתושב, 2.75 לתושבת, ושווי נקודה של 242 ₪ לחודש',
  },
  {
    href: 'https://www.kolzchut.org.il/he/%D7%A0%D7%A7%D7%95%D7%93%D7%95%D7%AA_%D7%96%D7%99%D7%9B%D7%95%D7%99_%D7%9E%D7%9E%D7%A1_%D7%94%D7%9B%D7%A0%D7%A1%D7%94_%D7%9C%D7%94%D7%95%D7%A8%D7%94_%D7%9C%D7%99%D7%9C%D7%93_%D7%A2%D7%93_%D7%92%D7%99%D7%9C_5',
    label: 'כל זכות: נקודות זיכוי להורה לילד עד גיל 5',
    note: 'הנקודות בשנת הלידה ובגילאים 1 עד 5, לאם ולאב',
  },
  {
    href: 'https://www.kolzchut.org.il/he/%D7%A0%D7%A7%D7%95%D7%93%D7%95%D7%AA_%D7%96%D7%99%D7%9B%D7%95%D7%99_%D7%9E%D7%9E%D7%A1_%D7%94%D7%9B%D7%A0%D7%A1%D7%94_%D7%9C%D7%94%D7%95%D7%A8%D7%99%D7%9D_%D7%9C%D7%99%D7%9C%D7%93%D7%99%D7%9D_%D7%91%D7%92%D7%99%D7%9C_17-6',
    label: 'כל זכות: נקודות זיכוי להורים לילדים בגיל 6 עד 17',
    note: 'שתי נקודות לאם ונקודה לאב',
  },
  {
    href: 'https://www.kolzchut.org.il/he/%D7%A0%D7%A7%D7%95%D7%93%D7%95%D7%AA_%D7%96%D7%99%D7%9B%D7%95%D7%99_%D7%9E%D7%9E%D7%A1_%D7%94%D7%9B%D7%A0%D7%A1%D7%94_%D7%9C%D7%97%D7%99%D7%99%D7%9C%D7%99%D7%9D_%D7%9E%D7%A9%D7%95%D7%97%D7%A8%D7%A8%D7%99%D7%9D_%D7%95%D7%9E%D7%A1%D7%99%D7%99%D7%9E%D7%99_%D7%A9%D7%99%D7%A8%D7%95%D7%AA_%D7%9C%D7%90%D7%95%D7%9E%D7%99-%D7%90%D7%96%D7%A8%D7%97%D7%99',
    label: 'כל זכות: נקודות זיכוי לחיילים משוחררים ולמסיימי שירות לאומי-אזרחי',
    note: '36 חודשים מהשחרור, ושתי נקודות לשנה לשירות מלא',
  },
  {
    href: 'https://www.kolzchut.org.il/he/%D7%A0%D7%A7%D7%95%D7%93%D7%95%D7%AA_%D7%96%D7%99%D7%9B%D7%95%D7%99_%D7%9E%D7%9E%D7%A1_%D7%94%D7%9B%D7%A0%D7%A1%D7%94_%D7%91%D7%92%D7%99%D7%9F_%D7%AA%D7%95%D7%90%D7%A8_%D7%A8%D7%90%D7%A9%D7%95%D7%9F',
    label: 'כל זכות: נקודות זיכוי ממס הכנסה בגין תואר ראשון',
    note: 'נקודה לשנה למשך עד שלוש שנות מס',
  },
  {
    href: 'https://www.gov.il/he/service/itc119',
    label: 'רשות המסים: בקשה להטבה במס לזכאים לתואר אקדמי או לתעודת מקצוע (טופס 119)',
    note: 'איך מבקשים את הנקודות לתואר',
  },
]

const childRows = CHILD_BANDS.map((band) => ({
  band,
  label: childBandLabel(band),
  mother: CHILD_POINTS_TWELFTHS.woman[band],
  father: CHILD_POINTS_TWELFTHS.man[band],
}))

const faq: ToolFaqEntry[] = [
  {
    id: 'tcp-faq-value',
    question: 'כמה שווה נקודת זיכוי ב-2026?',
    answer: `נקודת זיכוי שווה ${formatShekels(POINT_VALUE_MONTHLY)} לחודש, ${formatShekels(POINT_VALUE_ANNUAL)} לשנה. הסכום זהה לשנים הקודמות, כי עדכון הסכומים לפי המדד הוקפא. הנקודות מורידות את המס עצמו שקל מול שקל ולא את ההכנסה, ולכן הן שוות את הסכום המלא רק למי שהמס שלו גבוה מהן.`,
  },
  {
    id: 'tcp-faq-base',
    question: 'כמה נקודות זיכוי מגיעות לכל תושב ישראל?',
    answer: `גבר תושב ישראל מקבל ${formatPoints(man.twelfths)} נקודות: שתיים כתושב ורבע נקודה כזיכוי נסיעה לעבודה. אישה מקבלת ${formatPoints(woman.twelfths)}, כי היא מקבלת עוד חצי נקודה. זה שווה ${formatShekels(man.yearly)} ו-${formatShekels(woman.yearly)} לשנה.`,
  },
  {
    id: 'tcp-faq-children',
    question: 'כמה נקודות זיכוי מקבלים על ילדים?',
    answer:
      'זה תלוי בגיל הילד בשנת המס ובהורה. בשנת הלידה 2.5 נקודות, בשנים שבהן הילד בגיל 1 עד 2 מקבלים 4.5, בגיל 3 מקבלים 3.5 ובגיל 4 עד 5 מקבלים 2.5. מגיל 6 עד 17 אישה מקבלת 2 נקודות ואיש נקודה אחת, ובשנה שבה הילד בן 18 אישה מקבלת חצי נקודה. הורה יחיד והורים גרושים מקבלים נקודות נוספות, והמחשבון לא כולל אותן.',
  },
  {
    id: 'tcp-faq-oleh',
    question: 'כמה נקודות זיכוי מקבל עולה חדש?',
    answer: `עולה שעלה בשנת ${OLEH_FIRST_ALIYAH_YEAR} או אחריה מקבל נקודות לפי חודשי העלייה: 1/12 נקודה לחודש ב-12 החודשים הראשונים, רבע נקודה לחודש ב-18 החודשים שאחריהם, 1/6 ב-12 החודשים הבאים ו-1/12 ב-12 האחרונים, ביחד 54 חודשים. עולה שעלה בינואר ${TAX_YEAR} מקבל ב-${TAX_YEAR} ${formatPoints(olehYearOne)} נקודה נוספת, ומי שעלה בינואר ${TAX_YEAR - 1} מקבל ${formatPoints(olehMidYear)}. הנקודות באות בנוסף לנקודות של כל תושב.`,
  },
  {
    id: 'tcp-faq-soldier',
    question: 'כמה נקודות זיכוי מגיעות לחייל משוחרר?',
    answer: `חייל ששירת לפחות 23 חודשים (חיילת, 22 חודשים) מקבל שתי נקודות לשנה במשך 36 החודשים שאחרי השחרור, כלומר 1/6 נקודה לחודש. מי ששירת פחות מקבל נקודה אחת לשנה. בשנת ${TAX_YEAR} חייל שהשתחרר ביולי ${TAX_YEAR - 1} משירות מלא מקבל ${formatPoints(soldierTwelfthsInYear({ month: 7, year: TAX_YEAR - 1 }, true))} נקודות. ההטבה חלה על הכנסה מיגיעה אישית.`,
  },
  {
    id: 'tcp-faq-claim',
    question: 'איך מממשים נקודות זיכוי?',
    answer:
      'שכירים ממלאים טופס 101 בתחילת השנה ומוסרים אותו למעסיק, עם האישורים הרלוונטיים: תעודת עולה, תעודת שחרור או אישור זכאות לתואר. עצמאים מדווחים בדוח השנתי. נקודות שלא נתבעו אפשר לתבוע בדיעבד כהחזר מס, עד שש שנים אחורה. נקודות שלא נוצלו מחוסר מס לא מוחזרות.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function TaxCreditPointsCalculatorPage() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede={`מסמנים מין, ילדים לפי שנת לידה, תואר, עלייה ושחרור מצה״ל, ומקבלים את סך נקודות הזיכוי לשנת ${TAX_YEAR} ואת שוויין: ${formatShekels(POINT_VALUE_MONTHLY)} לחודש לכל נקודה.`}
      chips={['שווי נקודה 2026: 242 ₪ לחודש', 'ילדים לפי שנת לידה', 'עולה חדש וחייל משוחרר', 'הנתונים לא נשלחים לשום מקום']}
      tool={<TaxCreditPointsCalculator />}
      faq={faq}
      cta={{
        text: 'מנהלים עסק ומחשבים משכורות והטבות ידנית? אנחנו מחברים נתוני עובדים, בנק ו-CRM כדי שהחישובים יתעדכנו לבד.',
        label: 'אוטומציה לעסקים',
        href: '/services/automation',
      }}
    >
      <h2>מה זו נקודת זיכוי ואיך היא מחושבת</h2>
      <p>
        נקודת זיכוי היא סכום קבוע שמורידים ממס ההכנסה שמחושב לפי המדרגות. ב-{TAX_YEAR} נקודה אחת שווה{' '}
        {formatShekels(POINT_VALUE_MONTHLY)} לחודש ו-{formatShekels(POINT_VALUE_ANNUAL)} לשנה. אם המס נמוך מהשווי של
        הנקודות, המס הוא אפס והיתרה לא מוחזרת. המחשבון סוכם את הנקודות לפי הכללים שבפקודת מס הכנסה, ומכפיל אותן
        בשווי הנקודה.
      </p>

      <h3>נקודות לתושב ולתושבת</h3>
      <p>
        כל תושב ישראל מקבל שתי נקודות, ועוד רבע נקודה כזיכוי נסיעה לעבודה: {formatPoints(man.twelfths)} נקודות, שהן{' '}
        {formatShekels(man.yearly)} בשנה. אישה מקבלת עוד חצי נקודה, ביחד {formatPoints(woman.twelfths)} נקודות,
        שהן {formatShekels(woman.yearly)} בשנה.
      </p>

      <h3>נקודות על ילדים</h3>
      <p>הנקודות על ילד תלויות בגיל שלו בשנת המס, כלומר בשנת הלידה, וגם בהורה:</p>
      <div className={styles.tableWrap} role="region" aria-label="נקודות זיכוי על ילדים" tabIndex={0}>
        <table className={styles.table}>
          <caption>נקודות זיכוי לכל ילד בשנת {TAX_YEAR}</caption>
          <thead>
            <tr>
              <th scope="col">שנת לידה</th>
              <th scope="col">אם</th>
              <th scope="col">אב</th>
            </tr>
          </thead>
          <tbody>
            {childRows.map((row) => (
              <tr key={row.band}>
                <th scope="row">{row.label}</th>
                <td>{formatPoints(row.mother)}</td>
                <td>{formatPoints(row.father)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        הטבלה מתאימה להורים שמגדלים את הילדים יחד. הורה יחיד מקבל נקודה נוספת, ולהורים גרושים ופרודים יש כללי חלוקה
        משלהם, לכן המחשבון לא מכסה אותם. ילד עם מוגבלות מקנה שתי נקודות נוספות.
      </p>

      <h3>עולה חדש</h3>
      <p>
        עולה שעלה מ-{OLEH_FIRST_ALIYAH_YEAR} מקבל נקודות לחודש במשך 54 חודשים: 1/12 נקודה לחודש בשנה הראשונה, רבע
        נקודה ב-18 החודשים שאחריה, 1/6 ב-12 החודשים הבאים ו-1/12 ב-12 האחרונים. המחשבון סופר את חודש העלייה כחודש
        הראשון, ומחשב כמה נקודות נופלות בתוך {TAX_YEAR}.
      </p>

      <h3>חייל משוחרר, תואר אקדמי</h3>
      <p>
        חייל משוחרר מקבל במשך 36 החודשים שאחרי השחרור 1/6 נקודה לחודש אם שירת לפחות 23 חודשים (חיילת, 22), ו-1/12
        נקודה לחודש אם שירת פחות. תואר ראשון מקנה נקודה אחת בשנה, ותואר שני חצי נקודה, בשנות המס שאחרי סיום הלימודים:
        עד שלוש שנים לתואר ראשון ושנתיים לתואר שני. המחשבון מחשב את הנקודה כשנת {TAX_YEAR} נמצאת בתוך התקופה, אז סמנו
        תואר רק אם זה המצב.
      </p>

      <h2>דוגמה: אישה, שני ילדים ותואר ראשון</h2>
      <p>
        אישה שיש לה ילד שנולד ב-{TAX_YEAR - 1}, ילד בן 8 ותואר ראשון שסיימה לאחרונה, בשנת {TAX_YEAR}:
      </p>
      <ol>
        {example.lines.map((line) => (
          <li key={line.key}>
            {line.label}: {formatPoints(line.twelfths)} נקודות.
          </li>
        ))}
      </ol>
      <p>
        סך הכול {formatPoints(example.twelfths)} נקודות, שהן {formatShekels(example.yearly)} בשנה, או {formatShekels(example.monthly)} בחודש, מופחתים ממס ההכנסה.
      </p>

      <h2>מה המחשבון לא כולל</h2>
      <ul>
        <li>נקודות להורה יחיד, להורים גרושים או פרודים, ולילד עם מוגבלות.</li>
        <li>נקודות לבן או בת זוג וקבוצות נוספות, וגם נקודה לתעודת מקצוע.</li>
        <li>תושבי יישובים מוטבים וזיכויים אחרים, כמו תרומות והפקדות לפנסיה.</li>
        <li>תושב חוזר, שיש לו כללים משלו.</li>
      </ul>
      <p>
        אם אתם עצמאים, חשבו את המס עצמו ב<Link href="/tools/self-employed-tax-calculator">מחשבון מס הכנסה לעצמאי</Link>,
        שמקבל סך נקודות כמספר. כדי לדעת מה מגיע לכם בפועל, בדקו את הטופס 101 שמסרתם למעסיק ואת
        האישור השנתי של רשות המסים.
      </p>

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
        הנתונים בדף ובמחשבון הם לשנת המס {TAX_YEAR} ומבוססים על המקורות שלמעלה, נכון ל-{REVIEWED_LABEL}. זו הערכה ולא ייעוץ מס, והיא לא
        מחליפה את הדוח השנתי או רואה חשבון.
      </p>
    </ToolLayout>
  )
}
