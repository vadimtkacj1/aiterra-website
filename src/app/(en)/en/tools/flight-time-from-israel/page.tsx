import Link from 'next/link'
import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import FlightTimesEn from '../_components/FlightTimesEn'
import { enDestinations, enDurationText } from '../_components/flight-times-en'
import { CRUISE_KMH, FIXED_MINUTES, FLIGHT_TIMES_CHECKED, clockDuration } from '@/lib/flight-times'
import styles from '../../../../(he)/(site)/components/tools/FlightTimes.module.css'

const SLUG = 'flight-time-from-israel'
const META_TITLE = 'Flight Time from Israel (Tel Aviv): Table for 70 Destinations'
const DESCRIPTION =
  'How long is the flight from Israel to more than 70 destinations: direct flight times from Ben Gurion, which routes need a stop, distance and time difference, plus a flight time estimate by distance.'

const direct = enDestinations.filter((item) => item.directMinutes).length

const minutesOf = (id: string) => {
  const found = enDestinations.find((item) => item.id === id)?.directMinutes
  if (!found) throw new Error(`Missing direct time for ${id}`)
  return found
}

const hoursOf = (id: string) => clockDuration(minutesOf(id))

const popular = [
  { id: 'bangkok', lead: 'Thailand (Bangkok)' },
  { id: 'phuket', lead: 'Phuket' },
  { id: 'tokyo', lead: 'Japan (Tokyo)' },
  { id: 'new-york', lead: 'New York' },
  { id: 'dubai', lead: 'Dubai' },
  { id: 'rhodes', lead: 'Rhodes' },
  { id: 'budapest', lead: 'Budapest' },
  { id: 'batumi', lead: 'Batumi' },
]

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-flight-faq-usa',
    question: 'How long is the flight from Tel Aviv to New York?',
    answer: `A direct flight from Israel to New York takes about ${hoursOf('new-york')} hours, to Boston about ${hoursOf('boston')}, to Miami about ${hoursOf('miami')} and to Los Angeles about ${hoursOf('los-angeles')} hours. The flight back is usually an hour to an hour and a half shorter, because high westerly winds push the plane east. The times in the table are from Israel to the destination, so work out the return separately.`,
  },
  {
    id: 'en-flight-faq-thailand',
    question: 'How long is the flight from Israel to Thailand?',
    answer: `A direct flight from Israel to Bangkok takes about ${hoursOf('bangkok')} hours, and to Phuket about ${hoursOf('phuket')} hours. A flight with a stop, for example through the Gulf or Europe, usually takes 13 to 18 hours including the layover. The time is longer when the route avoids closed airspace. Bangkok is 5 hours ahead of Israel in winter and 4 in summer, so you land the next morning.`,
  },
  {
    id: 'en-flight-faq-europe',
    question: 'How long are flights from Israel to Europe, Greece and Cyprus?',
    answer: `Cyprus is about an hour away (Larnaca and Paphos about ${hoursOf('larnaca')} hours), Rhodes about ${hoursOf('rhodes')}, Athens about ${hoursOf('athens')} and Thessaloniki about ${hoursOf('thessaloniki')} hours. Most of Europe is between two and six hours: Rome about ${hoursOf('rome')}, Paris about ${hoursOf('paris')} and London about ${hoursOf('london')} hours. Greece and Cyprus are on the same time as Israel all year.`,
  },
  {
    id: 'en-flight-faq-vary',
    question: 'Why is my flight time different from the table?',
    answer:
      'Several things matter: a route that avoids closed airspace, high-altitude winds that change with season and direction, the aircraft type and congestion at landing. A difference of 15 to 30 minutes between flights is normal, and on routes that go around Turkey, such as to Georgia, the difference is bigger. The table shows a typical rounded value, so the time on your ticket is what counts.',
  },
  {
    id: 'en-flight-faq-calc',
    question: 'How do you calculate flight time from distance?',
    answer: `Calculate the straight-line distance over the Earth with the haversine formula, divide it by an average speed of ${CRUISE_KMH} km/h and add ${FIXED_MINUTES} minutes for take-off and landing. For example, 1,000 km is about 1 hour ${Math.round(FIXED_MINUTES + (1000 / CRUISE_KMH) * 60) - 60} minutes. The calculator does this for any destination, including ones not on the list, and lets you add 10% or 20% for a detour.`,
  },
]

const SOURCES = [
  { label: 'El Al: flight schedule and destinations', href: 'https://www.elal.com/' },
  { label: 'Israir: destinations', href: 'https://www.israir.co.il/' },
  { label: 'Arkia: destinations', href: 'https://www.arkia.co.il/' },
  { label: 'Wizz Air: route map from Tel Aviv', href: 'https://wizzair.com/' },
  { label: 'Israel Airports Authority: Ben Gurion flight board', href: 'https://www.iaa.gov.il/' },
  { label: 'Wikipedia: haversine formula', href: 'https://en.wikipedia.org/wiki/Haversine_formula' },
]

const checkedLabel = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(
  new Date(`${FLIGHT_TIMES_CHECKED}T00:00:00Z`),
)

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

export default function EnFlightTimePage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede={`A direct flight from Israel to Cyprus takes about an hour, to Greece and most of Europe between two and six hours, to Dubai about ${hoursOf('dubai')} hours, to New York about ${hoursOf('new-york')} and to Bangkok about ${hoursOf('bangkok')}. The table lists ${enDestinations.length} destinations from Ben Gurion Airport (TLV) with direct or one-stop flight times, time difference and distance, searchable by name.`}
      tool={<FlightTimesEn />}
      faq={faq}
      chips={[`${enDestinations.length} destinations`, 'Estimated times', `Checked ${FLIGHT_TIMES_CHECKED}`]}
      cta={{
        text: 'Need a custom calculator or booking system for your business?',
        label: 'Custom software development',
        href: '/en/services/development',
      }}
    >
      <h2>How to read the table</h2>
      <p>
        The Direct flight column shows the typical time from Ben Gurion to the destination, rounded to 5 minutes, for
        destinations that have a direct flight in the schedules. Destinations without one are marked No direct flight,
        and the With a stop column shows a typical total time with one stop, including the wait at the airport. Of the{' '}
        {enDestinations.length} destinations, {direct} currently have a direct flight. Times are from Israel to the
        destination; the way back is usually shorter, especially from the west.
      </p>

      <h2>Flight times to popular destinations</h2>
      <ul>
        {popular.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>{item.lead}</a>: direct flight about {enDurationText(minutesOf(item.id))}.
          </li>
        ))}
      </ul>

      <h2>Why flight times vary</h2>
      <p>
        The time on your ticket depends on the route, not only the distance. Closed airspace makes flights longer, like
        the route to Georgia, which goes around Turkey and is longer than the straight line. High-altitude winds
        shorten flights going east and lengthen flights going west, and the difference between directions can reach an
        hour. That is why the table shows a typical value and is marked as an estimate.
      </p>

      <h2>Estimating flight time from distance</h2>
      <p>
        The calculator works out the distance between Ben Gurion and the destination with the haversine formula and
        estimates the time as{' '}
        <strong>
          time = {FIXED_MINUTES} minutes + (distance × route factor ÷ {CRUISE_KMH} km/h)
        </strong>
        . The constants were calibrated on the destinations in the table: for most direct flights the estimate is within
        about 15% of the table time. For routes with a detour, such as to Georgia, choose a route factor of 1.2.
      </p>

      <h2>Time difference at the destination</h2>
      <p>
        The last column shows the time difference in winter and summer. To see a live clock for each city and plan
        calls, use the <Link href="/en/tools/time-difference-israel">time difference with Israel</Link> tool.
      </p>
      <p className={styles.caveat}>
        Flight times are estimates, and the destinations with direct flights change with the season, the airline and the
        security situation. Check the airline&apos;s schedule before you book.
      </p>

      <h2>Sources</h2>
      <ul>
        {SOURCES.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noopener" target="_blank">
              {source.label}
            </a>
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        The times are typical rounded values collected from airline and Ben Gurion schedules up to {checkedLabel}, and do
        not reflect any specific flight. The table is not an offer to sell tickets.
      </p>
    </EnToolLayout>
  )
}
