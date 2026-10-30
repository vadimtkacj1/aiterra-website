import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../components/tools/ToolLayout'
import { FamilyEventGames } from '../../components/tools/FamilyPrintTools'

const PATH = '/tools/family-event-games'
const TITLE = 'משחקים לשבת חתן ולאירועים משפחתיים'
const META_TITLE = 'משחקים לשבת חתן ושבת כלה: מחולל להדפסה לפי השמות'
const DESCRIPTION =
  'מחולל משחקים לשבת חתן, שבת כלה, שבע ברכות, בר מצווה ויום הולדת: מכניסים שמות ומקבלים שאלות וסבבים להדפסה. אפשר לבחור משחקים בלי כתיבה לשבת.'

const faq: ToolFaqEntry[] = [
  {
    id: 'family-event-games-0',
    question: 'אילו משחקים מתאימים לשבת חתן?',
    answer: 'משחקים בעל פה, כמו הצבעה בהרמת יד על מי מבני הזוג מתאים לכל שאלה, חידון על בעלי השמחה וסבב זיכרונות. הכלי מסנן משחקים שדורשים כתיבה.',
  },
  {
    id: 'family-event-games-1',
    question: 'האם אפשר להדפיס בשבת?',
    answer: 'לא. מדפיסים לפני כניסת השבת ומניחים את הדפים על השולחן. בכל שאלה הלכתית פנו לרב שלכם.',
  },
  {
    id: 'family-event-games-2',
    question: 'האם המשחקים מתאימים גם לבר מצווה וליום הולדת?',
    answer: 'כן. בוחרים את האירוע, והשאלות משתנות לאדם אחד. לבר מצווה ולבת מצווה הכלי מתאים את הלשון.',
  },
  {
    id: 'family-event-games-3',
    question: 'איך מקבלים שאלות אחרות?',
    answer: 'לוחצים על החלפת השאלות, והכלי בוחר שאלות אחרות מהמאגר.',
  },
]

export const metadata = toolMetadata({ path: PATH, metaTitle: META_TITLE, description: DESCRIPTION })

export default function Page() {
  return (
    <ToolLayout
      path={PATH}
      title={TITLE}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="מכניסים את השמות ומקבלים דף משחקים לאירוע: מי מהשניים, חידון על בעלי השמחה, ברכה לפי אותיות השם וסבבים לשולחן. בשבת הכלי משאיר רק משחקים בעל פה."
      tool={<FamilyEventGames />}
      faq={faq}
      cta={{
        text: 'רוצים כלי כזה באתר שלכם? אנחנו בונים כלים אינטראקטיביים לעסקים.',
        label: 'פיתוח תוכנה לעסקים',
        href: '/services/development',
      }}
    >
      <h2>איך מנהלים את המשחקים</h2>
      <ul>
        <li>מכינים דף אחד לכל שולחן לפני האירוע.</li>
        <li>בוחרים אדם אחד שמקריא את השאלות ושומר על קצב.</li>
        <li>עוצרים אחרי 10 עד 15 דקות, כשכולם עדיין נהנים.</li>
      </ul>
    </ToolLayout>
  )
}
