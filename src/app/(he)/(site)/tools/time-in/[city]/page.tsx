import Link from 'next/link'
import { notFound } from 'next/navigation'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../../components/tools/ToolLayout'
import CityTime from '../../../components/tools/CityTime'
import styles from '../../../components/tools/TimeDifference.module.css'
import {
  ISRAEL_TIME_ZONE,
  SUMMER_REFERENCE,
  TIME_DIFFERENCE_PATH,
  WINTER_REFERENCE,
  differenceFromIsrael,
  offsetMinutes,
} from '@/lib/time-difference'
import { timeInCity, timeInPage, timeInPages, timeInPath } from '@/lib/time-in-cities'
import { dialingCountryByTimeIn, dialingCountryPath, withPreposition } from '@/lib/dialing-country-pages'
import { FLIGHT_TIMES_PATH, destinationById, durationText } from '@/lib/flight-times'

export const revalidate = 60
export const dynamicParams = false

export const generateStaticParams = () => timeInPages.map((page) => ({ city: page.slug }))

type Params = { params: Promise<{ city: string }> }

const DAY_MS = 86_400_000
const ISRAEL_SUMMER_OFFSET = 180

const todayFormat = new Intl.DateTimeFormat('he-IL', {
  timeZone: ISRAEL_TIME_ZONE,
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const periodFormat = new Intl.DateTimeFormat('he-IL', { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' })

function hoursPhrase(minutes: number) {
  const absolute = Math.abs(minutes)
  const hours = Math.floor(absolute / 60)
  const rest = absolute % 60
  if (absolute === 60) return 'בשעה'
  if (absolute === 120) return 'בשעתיים'
  if (rest === 0) return `ב-${hours} שעות`
  if (rest === 30) return `ב-${hours} וחצי שעות`
  return `ב-${hours}:${String(rest).padStart(2, '0')} שעות`
}

function direction(minutes: number) {
  if (minutes === 0) return 'מראה אותה שעה כמו בישראל'
  return minutes > 0 ? `מקדים את ישראל ${hoursPhrase(minutes)}` : `מאחר אחרי ישראל ${hoursPhrase(minutes)}`
}

function differenceLabel(minutes: number) {
  if (minutes === 0) return 'אותה שעה'
  return minutes > 0 ? `מקדים ${hoursPhrase(minutes)}` : `מאחר ${hoursPhrase(minutes)}`
}

function clockAt(minutes: number, israelHour = 12) {
  const total = (((israelHour * 60 + minutes) % 1440) + 1440) % 1440
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

type Period = { from: Date; to: Date; minutes: number; israelSummer: boolean }

function periodsAhead(zone: string, from: Date, until: Date): Period[] {
  const periods: Period[] = []
  const start = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate(), 12)
  for (let time = start; time <= until.getTime(); time += DAY_MS) {
    const at = new Date(time)
    const minutes = differenceFromIsrael(zone, at)
    const israelSummer = offsetMinutes(ISRAEL_TIME_ZONE, at) === ISRAEL_SUMMER_OFFSET
    const last = periods[periods.length - 1]
    if (last && last.minutes === minutes && last.israelSummer === israelSummer) last.to = at
    else periods.push({ from: at, to: at, minutes, israelSummer })
  }
  return periods
}

function describe(slug: string) {
  const page = timeInPage(slug)
  if (!page) return null
  const city = timeInCity(page)
  const winter = differenceFromIsrael(city.zone, WINTER_REFERENCE)
  const summer = differenceFromIsrael(city.zone, SUMMER_REFERENCE)
  const title = `מה השעה ${page.inPlace} עכשיו`
  const metaTitle = `מה השעה ${page.inPlace} עכשיו? שעון חי והפרש מישראל`
  const description = `השעה ${page.inPlace} עכשיו בשעון חי, מול השעה בישראל. בחורף השעון ${page.inPlace} ${direction(winter)}, ובקיץ ${direction(summer)}.`
  return { page, city, winter, summer, title, metaTitle, description }
}

export async function generateMetadata({ params }: Params) {
  const info = describe((await params).city)
  if (!info) return {}
  return toolMetadata({ path: timeInPath(info.page.slug), metaTitle: info.metaTitle, description: info.description })
}

export default async function TimeInPage({ params }: Params) {
  const info = describe((await params).city)
  if (!info) notFound()
  const { page, city, winter, summer, title, metaTitle, description } = info
  const path = timeInPath(page.slug)
  const sameAllYear = winter === summer
  const now = new Date()
  const today = differenceFromIsrael(city.zone, now)
  const nextYear = Number(new Intl.DateTimeFormat('en-US', { timeZone: ISRAEL_TIME_ZONE, year: 'numeric' }).format(now)) + 1
  const periods = periodsAhead(city.zone, now, new Date(Date.UTC(nextYear, 11, 31, 12)))
  const dialing = dialingCountryByTimeIn(page.slug)
  const flight = destinationById(page.cityId)
  const flightMinutes = flight ? (flight.directMinutes ?? flight.viaMinutes) : null

  const todayLine =
    today === 0
      ? `היום, ${todayFormat.format(now)}, השעה ${page.inPlace} זהה לשעה בישראל.`
      : `היום, ${todayFormat.format(now)}, השעון ${page.inPlace} ${direction(today)}.`

  const faq: ToolFaqEntry[] = [
    {
      id: `time-in-${page.slug}-difference`,
      question: `מה הפרש השעות בין ישראל ל${page.place}?`,
      answer: sameAllYear
        ? `רוב השנה השעון ${page.inPlace} ${direction(winter)}. אם בישראל השעה 12:00, ${page.inPlace} היא ${clockAt(winter)}. בכמה שבועות בשנה ההפרש זז בשעה, כשמדינה אחת עוברת לשעון קיץ או חורף לפני השנייה, ולכן לפגישה בתאריך מסוים כדאי לבדוק בטבלת התאריכים למעלה.`
        : `בחורף השעון ${page.inPlace} ${direction(winter)}, ובקיץ ${direction(summer)}. ההפרש משתנה כי ישראל ו${page.place} לא עוברות לשעון קיץ באותו אופן. כשבישראל 12:00 בחורף, ${page.inPlace} השעה ${clockAt(winter)}, ובקיץ ${clockAt(summer)}. בטבלת התאריכים למעלה מופיע מתי בדיוק ההפרש משתנה.`,
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
      lede={`${todayLine} ${sameAllYear ? `רוב השנה השעון ${page.inPlace} ${direction(winter)}.` : `בחורף בישראל השעון ${page.inPlace} ${direction(winter)}, ובקיץ ${direction(summer)}.`} השעה המדויקת מופיעה בשעון החי למטה.`}
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
        בשעון חורף בישראל השעון {page.inPlace} {direction(winter)}, ובשעון קיץ {direction(summer)}. כשבישראל 09:00
        בבוקר, {page.inPlace} השעה {clockAt(winter, 9)} בחורף ו-{clockAt(summer, 9)} בקיץ.
        {page.areaNote ? ` ${page.areaNote}` : ''}
      </p>

      <h2>מתי ההפרש מול {page.place} משתנה</h2>
      <p>
        התקופות מהיום ועד סוף {nextYear}, לפי כללי שעון הקיץ של ישראל ושל {page.place}. בכל שורה מופיע אם בישראל
        שעון חורף או שעון קיץ, ומה ההפרש באותה תקופה.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>
            הפרש השעות בין ישראל ל{page.place} עד סוף {nextYear}
          </caption>
          <thead>
            <tr>
              <th scope="col">מתאריך</th>
              <th scope="col">עד תאריך</th>
              <th scope="col">בישראל</th>
              <th scope="col">השעון {page.inPlace}</th>
            </tr>
          </thead>
          <tbody>
            {periods.map((period, index) => (
              <tr key={period.from.getTime()}>
                <td>{index === 0 ? 'היום' : periodFormat.format(period.from)}</td>
                <td>{periodFormat.format(period.to)}</td>
                <td>{period.israelSummer ? 'שעון קיץ' : 'שעון חורף'}</td>
                <td>{differenceLabel(period.minutes)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        בטבלה המלאה של <Link href={TIME_DIFFERENCE_PATH}>הפרש השעות מישראל</Link> יש עוד 60 ערים ומתכנן פגישות.
      </p>

      {dialing || flightMinutes ? <h2>טיסה ושיחות ל{page.place}</h2> : null}
      {flight && flightMinutes ? (
        <p>
          טיסה מנתב״ג ל{flight.name} נמשכת כ-{durationText(flightMinutes)}
          {flight.directMinutes ? ' בטיסה ישירה' : ' עם עצירת ביניים'}. זמני טיסה ליעדים נוספים במחשבון{' '}
          <Link href={FLIGHT_TIMES_PATH}>זמן טיסה מישראל</Link>.
        </p>
      ) : null}
      {dialing ? (
        <p>
          הקידומת הבינלאומית של {dialing.country.name} היא <span dir="ltr">+{dialing.country.digits}</span>. איך מחייגים
          מישראל, באיזו קידומת יציאה ומה עושים עם האפס שבתחילת המספר:{' '}
          <Link href={dialingCountryPath(dialing.slug)}>איך להתקשר {withPreposition('ל', dialing.country.name)}</Link>.
        </p>
      ) : null}

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
