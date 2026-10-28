import Link from 'next/link'
import { notFound } from 'next/navigation'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../../components/tools/ToolLayout'
import CityTime from '../../../components/tools/CityTime'
import {
  SUMMER_REFERENCE,
  TIME_DIFFERENCE_PATH,
  WINTER_REFERENCE,
  differenceFromIsrael,
  formatDifference,
} from '@/lib/time-difference'
import { timeInCity, timeInPage, timeInPages, timeInPath } from '@/lib/time-in-cities'

export const revalidate = 60
export const dynamicParams = false

export const generateStaticParams = () => timeInPages.map((page) => ({ city: page.slug }))

type Params = { params: Promise<{ city: string }> }

const amount = (minutes: number) => formatDifference(minutes).replace(/^[+−]/, '')

function describe(slug: string) {
  const page = timeInPage(slug)
  if (!page) return null
  const city = timeInCity(page)
  const winter = differenceFromIsrael(city.zone, WINTER_REFERENCE)
  const summer = differenceFromIsrael(city.zone, SUMMER_REFERENCE)
  const direction = (minutes: number) =>
    minutes === 0 ? 'אותה שעה כמו בישראל' : minutes > 0 ? `מקדים את ישראל ב-${amount(minutes)}` : `מאחר אחרי ישראל ב-${amount(minutes)}`
  const title = `מה השעה ${page.inPlace} עכשיו`
  const metaTitle = `מה השעה ${page.inPlace} עכשיו? שעון חי והפרש מישראל`
  const description = `השעה ${page.inPlace} עכשיו בשעון חי, מול השעה בישראל. בחורף השעון ${page.inPlace} ${direction(winter)}, ובקיץ ${direction(summer)}.`
  return { page, city, winter, summer, direction, title, metaTitle, description }
}

export async function generateMetadata({ params }: Params) {
  const info = describe((await params).city)
  if (!info) return {}
  return toolMetadata({ path: timeInPath(info.page.slug), metaTitle: info.metaTitle, description: info.description })
}

export default async function TimeInPage({ params }: Params) {
  const info = describe((await params).city)
  if (!info) notFound()
  const { page, city, winter, summer, direction, title, metaTitle, description } = info
  const path = timeInPath(page.slug)
  const sameAllYear = winter === summer

  const faq: ToolFaqEntry[] = [
    {
      id: `time-in-${page.slug}-difference`,
      question: `מה הפרש השעות בין ישראל ל${page.place}?`,
      answer: sameAllYear
        ? `רוב השנה השעון ${page.inPlace} ${direction(winter)}. אם בישראל השעה 12:00, ${page.inPlace} היא ${clockAt(winter)}. בכמה שבועות בשנה ההפרש זז בשעה, כשמדינה אחת עוברת לשעון קיץ או חורף לפני השנייה, ולכן לפגישה בתאריך מסוים כדאי לבדוק בשעון למעלה.`
        : `בחורף השעון ${page.inPlace} ${direction(winter)}, ובקיץ ${direction(summer)}. ההפרש משתנה כי ישראל ו${page.place} לא עוברות לשעון קיץ באותו אופן. כשבישראל 12:00 בחורף, ${page.inPlace} השעה ${clockAt(winter)}, ובקיץ ${clockAt(summer)}. השעון למעלה מראה את ההפרש הנכון להיום.`,
    },
    {
      id: `time-in-${page.slug}-zone`,
      question: `באיזה אזור זמן נמצאת ${page.place}?`,
      answer: `השעון ${page.inPlace} מחושב לפי אזור הזמן ${city.zone.replace(/_/g, ' ')} של מסד הנתונים הבינלאומי IANA, אותו מסד שמחשבים, טלפונים ודפדפנים משתמשים בו. העמוד מחשב את השעה לפי שעון המכשיר שלכם וכללי שעון הקיץ של שתי המדינות, כך שהשעה מתעדכנת לבד גם בשבועות המעבר בין שעון חורף לשעון קיץ.`,
    },
    {
      id: `time-in-${page.slug}-call`,
      question: `מתי הכי נוח להתקשר מישראל ל${page.place}?`,
      answer: `מחשבים את שעות העבודה בשני הצדדים לפי ההפרש. ${winter < -240 ? `כש${page.place} מאחרת בכמה שעות, השעות הנוחות הן אחר הצהריים והערב בישראל, שהם הבוקר ${page.inPlace}.` : winter > 120 ? `כש${page.place} מקדימה בכמה שעות, השעות הנוחות הן הבוקר בישראל, שהוא הצהריים או אחר הצהריים ${page.inPlace}.` : `ההפרש קטן, ולכן רוב יום העבודה בישראל חופף ליום העבודה ${page.inPlace}.`} במחשבון הפרש השעות המלא אפשר להגדיר שעות עבודה לכל צד ולראות את החפיפה המדויקת.`,
    },
  ]

  return (
    <ToolLayout
      path={path}
      title={title}
      metaTitle={metaTitle}
      description={description}
      lede={`השעה ${page.inPlace} עכשיו מופיעה בשעון החי למטה, ליד השעה בישראל. ${sameAllYear ? `רוב השנה השעון ${page.inPlace} ${direction(winter)}.` : `בחורף השעון ${page.inPlace} ${direction(winter)}, ובקיץ ${direction(summer)}.`}`}
      chips={['שעון חי', 'מתעדכן לבד לפי שעון קיץ']}
      tool={<CityTime place={page.place} zone={city.zone} renderedAt={Date.now()} />}
      faq={faq}
      cta={{
        text: `עובדים עם לקוחות ${page.inPlace}? אתר דו-לשוני ומענה אוטומטי בוואטסאפ עונים להם גם כשאצלכם לילה.`,
        label: 'אוטומציה לעסקים',
        href: '/services/automation',
      }}
    >
      <h2>הפרש השעות בין ישראל ל{page.place}</h2>
      <p>
        בחורף (ינואר) השעון {page.inPlace} {direction(winter)}, ובקיץ (יולי) {direction(summer)}. כשבישראל 09:00 בבוקר,{' '}
        {page.inPlace} השעה {clockAt(winter, 9)} בחורף ו-{clockAt(summer, 9)} בקיץ. בטבלה המלאה של{' '}
        <Link href={TIME_DIFFERENCE_PATH}>הפרש השעות מישראל</Link> יש עוד 60 ערים, השבועות שבהם ההפרש חריג ומתכנן
        פגישות.
      </p>

      <h2>שעון חי במקומות נוספים</h2>
      <ul>
        {timeInPages
          .filter((other) => other.slug !== page.slug)
          .map((other) => (
            <li key={other.slug}>
              <Link href={timeInPath(other.slug)}>מה השעה {other.inPlace}</Link>
            </li>
          ))}
      </ul>
    </ToolLayout>
  )
}

function clockAt(minutes: number, israelHour = 12) {
  const total = (((israelHour * 60 + minutes) % 1440) + 1440) % 1440
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}
