import Link from 'next/link'
import { notFound } from 'next/navigation'
import ToolLayout, { toolMetadata, type ToolFaqEntry } from '../../../components/tools/ToolLayout'
import CityTime from '../../../components/tools/CityTime'
import styles from '../../../components/tools/TimeDifference.module.css'
import {
  SUMMER_REFERENCE,
  TIME_DIFFERENCE_PATH,
  WINTER_REFERENCE,
  differenceFromIsrael,
  offsetMinutes,
} from '@/lib/time-difference'
import { timeInCity, timeInPage, timeInPages, timeInPath, type TimeInPage } from '@/lib/time-in-cities'
import {
  ISRAEL_TIME_PATH,
  callAdvice,
  clockAt,
  differenceLabel,
  direction,
  formatPeriodDate,
  timeInCopy,
  utcLabel,
} from '@/lib/time-in-copy'
import { dialingCountryByTimeIn, dialingCountryPath, withPreposition } from '@/lib/dialing-country-pages'
import { FLIGHT_TIMES_PATH, destinationById, durationText } from '@/lib/flight-times'

export const revalidate = 60
export const dynamicParams = false

export const generateStaticParams = () => timeInPages.map((page) => ({ city: page.slug }))

type Params = { params: Promise<{ city: string }> }

function describe(page: TimeInPage, now: Date) {
  const city = timeInCity(page)
  const dialing = dialingCountryByTimeIn(page.slug)
  const flight = destinationById(page.cityId)
  const flightMinutes = flight ? (flight.directMinutes ?? flight.viaMinutes ?? undefined) : undefined
  const copy = timeInCopy(page, city.zone, now, {
    flightMinutes,
    flightDirect: Boolean(flight?.directMinutes),
    dialingDigits: dialing?.country.digits,
  })
  return { city, dialing, flight, flightMinutes, copy }
}

export async function generateMetadata({ params }: Params) {
  const page = timeInPage((await params).city)
  if (!page) return {}
  const { copy } = describe(page, new Date())
  return toolMetadata({ path: timeInPath(page.slug), metaTitle: copy.metaTitle, description: copy.description })
}

function differenceAnswer(page: TimeInPage, zone: string, winter: number, summer: number) {
  if (winter === summer) {
    return `השעון ${page.inPlace} ${direction(winter)} כמעט כל השנה, בחורף ובקיץ, כי ${page.place} וישראל מזיזות את השעון כמעט באותם ימים. ההפרש זז רק לתקופות קצרות באביב ובסתיו, כשאחת מהן עוברת לפני השנייה. כשבישראל 12:00, ${page.inPlace} ${clockAt(winter)}.`
  }
  const placeHasDst = offsetMinutes(zone, WINTER_REFERENCE) !== offsetMinutes(zone, SUMMER_REFERENCE)
  const reason = placeHasDst
    ? `${page.place} בחצי הכדור הדרומי, ושעון הקיץ שלה פועל בחודשי החורף שלנו, ולכן הפער בחורף גדול יותר.`
    : `${page.place} לא עוברת לשעון קיץ, וכשישראל מזיזה את השעון, ההפרש זז איתה בשעה.`
  return `בחורף השעון ${page.inPlace} ${direction(winter)}, ובקיץ ${direction(summer)}. ${reason} כשבישראל 12:00 בחורף, ${page.inPlace} ${clockAt(winter)}, ובקיץ ${clockAt(summer)}.`
}

function zoneAnswer(page: TimeInPage, zone: string) {
  const winterOffset = offsetMinutes(zone, WINTER_REFERENCE)
  const summerOffset = offsetMinutes(zone, SUMMER_REFERENCE)
  const offsets =
    winterOffset === summerOffset
      ? `${utcLabel(winterOffset)} כל השנה, בלי שעון קיץ`
      : `${utcLabel(winterOffset)} בינואר ו-${utcLabel(summerOffset)} ביולי`
  return `השעון ${page.inPlace} עובד לפי ${offsets}. בהגדרות של טלפון או מחשב אזור הזמן הזה מופיע בשם ${zone.replace(/_/g, ' ')}.${page.areaNote ? ` ${page.areaNote}` : ''}`
}

export default async function TimeInCityPage({ params }: Params) {
  const page = timeInPage((await params).city)
  if (!page) notFound()
  const now = new Date()
  const { city, dialing, flight, flightMinutes, copy } = describe(page, now)
  const path = timeInPath(page.slug)
  const winter = differenceFromIsrael(city.zone, WINTER_REFERENCE)
  const summer = differenceFromIsrael(city.zone, SUMMER_REFERENCE)

  const faq: ToolFaqEntry[] = [
    {
      id: `time-in-${page.slug}-difference`,
      question: `מה הפרש השעות בין ישראל ל${page.place}?`,
      answer: differenceAnswer(page, city.zone, winter, summer),
    },
    {
      id: `time-in-${page.slug}-zone`,
      question: `באיזה אזור זמן נמצאת ${page.place}?`,
      answer: zoneAnswer(page, city.zone),
    },
    {
      id: `time-in-${page.slug}-call`,
      question: `מתי נוח להתקשר מישראל ל${page.place}?`,
      answer: `${callAdvice(copy.today, page.inPlace)} במחשבון הפרש השעות אפשר לשנות את שעות העבודה של כל צד.`,
    },
  ]

  return (
    <ToolLayout
      path={path}
      title={copy.title}
      metaTitle={copy.metaTitle}
      description={copy.description}
      lede={copy.lede}
      chips={['שעון חי', utcLabel(offsetMinutes(city.zone, now))]}
      tool={<CityTime place={page.place} zone={city.zone} renderedAt={now.getTime()} />}
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
        מהיום ועד סוף {copy.nextYear}. כל שורה היא תקופה שבה ההפרש לא זז. התאריכים מחושבים מכללי שעון הקיץ של ישראל
        ושל {page.place}, אותם כללים שהטלפון שלכם עובד לפיהם.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>
            הפרש השעות בין ישראל ל{page.place} עד סוף {copy.nextYear}
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
            {copy.periods.map((period, index) => (
              <tr key={period.from.getTime()}>
                <td>{index === 0 ? 'היום' : formatPeriodDate(period.from)}</td>
                <td>{formatPeriodDate(period.to)}</td>
                <td>{period.israelSummer ? 'שעון קיץ' : 'שעון חורף'}</td>
                <td>{differenceLabel(period.minutes)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        בעמוד <Link href={TIME_DIFFERENCE_PATH}>הפרש השעות מישראל</Link> יש 62 ערים ומתכנן פגישות, ובעמוד{' '}
        <Link href={ISRAEL_TIME_PATH}>מה השעה בישראל</Link> מועדי שעון הקיץ והחורף שלנו עד 2028.
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
        <li>
          <Link href={ISRAEL_TIME_PATH}>מה השעה בישראל</Link>
        </li>
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
