import Link from 'next/link'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import UnitConverter from '../../components/tools/UnitConverter'
import { UNIT_CONVERTER_PATH, pairPages, pairPath, quantityLabels, units, type Quantity } from '@/lib/unit-converter'

const TITLE = 'ממיר יחידות: דונם, אינץ׳, גלון, אונקיה ועוד'
const META_TITLE = 'ממיר יחידות מידה: דונם למטרים, אינץ׳ לס״מ, גלון לליטר, אונקיה לגרם'
const DESCRIPTION =
  'ממיר יחידות אורך, שטח, נפח ומשקל: דונם למ״ר, הקטר ואקר לדונם, אינץ׳ ורגל לס״מ ומטרים, גלון לליטר, אונקיה ופאונד לגרם וקילו. לפי ההגדרות הרשמיות.'

const faq: ToolFaqEntry[] = [
  {
    id: 'units-faq-dunam',
    question: 'כמה זה דונם במטרים?',
    answer:
      'דונם בישראל הוא 1,000 מטר רבוע, הדונם המטרי שהונהג בתקופת המנדט הבריטי. כלומר חצי דונם הוא 500 מ״ר, 10 דונם הם 10,000 מ״ר, שהם הקטר אחד. הדונם העות׳מאני הישן היה כ-919 מ״ר, ולכן במסמכים ישנים מאוד כדאי לבדוק לאיזה דונם הכוונה.',
  },
  {
    id: 'units-faq-inch',
    question: 'כמה סנטימטר זה אינץ׳?',
    answer:
      'אינץ׳ אחד הוא בדיוק 2.54 ס״מ, לפי ההסכם הבינלאומי משנת 1959. גודל מסך נמדד באלכסון, ולכן טלוויזיה של 55 אינץ׳ היא כ-139.7 ס״מ באלכסון, לא ברוחב.',
  },
  {
    id: 'units-faq-gallon',
    question: 'כמה ליטר זה גלון?',
    answer:
      'גלון אמריקאי הוא 3.785411784 ליטר, וגלון בריטי (אימפריאלי) הוא 4.54609 ליטר. כשהמקור אמריקאי, כמו מחירי דלק בארה״ב או מתכון אמריקאי, מדובר בגלון האמריקאי.',
  },
  {
    id: 'units-faq-ounce',
    question: 'כמה גרם זה אונקיה?',
    answer:
      'אונקיה רגילה היא 28.349523125 גרם, והיא משמשת למזון ולמשלוחים. מחיר זהב וכסף נמדד באונקיית טרוי, שהיא 31.1034768 גרם, כ-10% יותר. אונקיית נוזל אמריקאית היא יחידת נפח, כ-29.57 מ״ל.',
  },
]

export const metadata = toolMetadata({ path: UNIT_CONVERTER_PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function UnitConverterPage() {
  const quantities = Object.keys(quantityLabels) as Quantity[]
  return (
    <ToolLayout
      path={UNIT_CONVERTER_PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="בוחרים אורך, שטח, נפח או משקל, מקלידים כמות ובוחרים יחידות. ההמרה מתעדכנת תוך כדי הקלדה, כולל דונם, אינץ׳, גלון, אונקיה ואונקיית זהב."
      chips={['26 יחידות', 'דונם ישראלי של 1,000 מ״ר', 'גלון אמריקאי ובריטי', 'אונקיה ואונקיית טרוי']}
      tool={<UnitConverter />}
      faq={faq}
      cta={{
        text: 'צריכים מחשבון כזה באתר שלכם, עם המוצרים והמידות שלכם? אנחנו בונים כלים ומחשבונים לאתרים של עסקים.',
        label: 'בניית אתרים',
        href: '/services/brochure',
      }}
    >
      <h2>המרות נפוצות</h2>
      <ul>
        {pairPages.map((page) => (
          <li key={page.slug}>
            <Link href={pairPath(page.slug)}>{page.question}</Link>
          </li>
        ))}
      </ul>

      <h2>היחידות והערך שלהן</h2>
      {quantities.map((quantity) => (
        <div key={quantity}>
          <h3>{quantityLabels[quantity]}</h3>
          <ul>
            {units
              .filter((unit) => unit.quantity === quantity)
              .map((unit) => (
                <li key={unit.id}>
                  {unit.name} ({unit.symbol})
                </li>
              ))}
          </ul>
        </div>
      ))}
      <p>
        הערכים לפי ההגדרות הבינלאומיות: אינץ׳, רגל, יארד, מייל, פאונד ואונקיה לפי ההסכם הבינלאומי משנת 1959, גלון
        אמריקאי כ-231 אינץ׳ מעוקב, וגלון בריטי 4.54609 ליטר בדיוק.
      </p>
    </ToolLayout>
  )
}
