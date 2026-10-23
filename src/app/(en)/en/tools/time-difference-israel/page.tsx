import Link from 'next/link'
import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import TimeDifferenceEn from '../_components/TimeDifferenceEn'
import { enCity, enFormatDifference, enGapZones } from '../_components/time-difference-en'
import { TIME_DIFFERENCE_CHECKED, cityDifferences, gapRuns } from '@/lib/time-difference'
import styles from '../../../../(he)/(site)/components/tools/TimeDifference.module.css'

const SLUG = 'time-difference-israel'
const META_TITLE = 'Time Difference with Israel: What Time Is It in Israel Now?'
const DESCRIPTION =
  'Time difference between Israel and 62 cities: live clocks, the gap in winter and summer, the weeks when daylight saving time changes it, and a meeting planner for working hours.'

const cityRows = cityDifferences().map((row) => ({ ...row, city: enCity(row.city) }))

const shortDate = (date: Date) =>
  date.toLocaleDateString('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' })

const shiftRows = enGapZones.flatMap((item) =>
  gapRuns(item.zone, 2026, 2027)
    .filter((run) => run.days <= 30)
    .map((run) => ({
      key: `${item.zone}-${run.from.getTime()}`,
      label: item.label,
      range: run.days === 1 ? shortDate(run.from) : `${shortDate(run.from)} to ${shortDate(run.to)}`,
      days: run.days,
      minutes: run.minutes,
    })),
)

const SOURCES = {
  kan: { label: 'Kan News: when the clocks change in 2026 (Hebrew)', href: 'https://www.kan.org.il/content/kan-news/local/1018268/' },
  protocol: { label: 'Israel summer time 2026-2027 (Hebrew)', href: 'https://protocol.co.il/summer-time/' },
  iana: { label: 'IANA Time Zone Database', href: 'https://www.iana.org/time-zones' },
  mdn: {
    label: 'MDN: Intl.DateTimeFormat',
    href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat',
  },
}

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-time-difference-faq-usa',
    question: 'What is the time difference between Israel and New York?',
    answer:
      'For most of the year New York is 7 hours behind Israel: when it is 15:00 in Israel, it is 08:00 in New York. For a few weeks a year the gap shrinks to 6 hours, because the United States moves to daylight saving time in March, weeks before Israel, and returns to standard time in November, a week after Israel. Los Angeles is 3 hours further behind, Chicago 1 hour.',
  },
  {
    id: 'en-time-difference-faq-europe',
    question: 'What is the time difference between Israel and Europe?',
    answer:
      'Israel is 2 hours ahead of London and 1 hour ahead of Paris, Berlin, Rome and Madrid. The gap hardly changes during the year, because Europe also switches between summer and winter time, and in October Israel changes on the same weekend. The exception is the March weekend: Israel switches two days before Europe, so the gap grows by an hour for just two nights.',
  },
  {
    id: 'en-time-difference-faq-summer',
    question: 'When does daylight saving time start and end in Israel?',
    answer:
      'By law, summer time in Israel starts on the last Friday of March and ends on the last Sunday of October. In 2026 it started on 27 March and ends on 25 October; in 2027 it starts on 26 March and ends on 31 October. Clocks go forward an hour in the night before Friday and back an hour in the night between Saturday and Sunday. In summer Israel is UTC+3, in winter UTC+2.',
  },
  {
    id: 'en-time-difference-faq-asia',
    question: 'Why does the gap with Thailand or Japan change?',
    answer:
      'Because Thailand, Japan, China and India do not change their clocks, while Israel does. In winter Bangkok is 5 hours ahead and Tokyo 7; in summer, when Israel moves its clocks forward, the gap is an hour smaller: 4 and 6. India is 3:30 ahead in winter and 2:30 in summer. The same happens with Dubai, which is 2 hours ahead in winter and 1 hour in summer.',
  },
  {
    id: 'en-time-difference-faq-australia',
    question: 'How does the time difference with Australia work?',
    answer:
      'Australia and New Zealand are in the southern hemisphere, so their summer time runs during the Israeli winter, the opposite of Israel. Sydney is 9 hours ahead during the Israeli winter and 7 hours ahead during the Israeli summer. Perth has no daylight saving time and is 6 hours ahead in winter and 5 in summer. For a meeting with Sydney, check the gap for the actual date.',
  },
]

const externalLink = (href: string, label: string) => (
  <a href={href} rel="noopener" target="_blank">
    {label}
  </a>
)

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

export default function EnTimeDifferencePage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="Israel is 7 hours ahead of New York for most of the year and 2 hours ahead of London, but the gap changes when one side switches to daylight saving time. Choose a city to see a live clock on both sides, today's difference and the difference in six months, and find a time that suits both of you."
      tool={<TimeDifferenceEn />}
      faq={faq}
      chips={[`${cityRows.length} cities`, 'Adjusts for daylight saving', `Checked ${TIME_DIFFERENCE_CHECKED}`]}
      cta={{
        text: 'Need a custom calculator or internal system for your business?',
        label: 'Custom software development',
        href: '/en/services/development',
      }}
    >
      <h2>How the calculator works out the difference</h2>
      <p>
        The tool uses the time zones of the international IANA database, which your browser already knows, so the
        difference is correct for the date you open it and follows each country&apos;s daylight saving rules. Nothing
        is sent to a server, and the time comes from your device clock; if that clock is wrong, the result will be too.
      </p>

      <h2>Daylight saving time in Israel</h2>
      <p>
        Summer time in Israel starts on the last Friday of March and ends on the last Sunday of October. In 2026 it
        started on 27 March and ends on 25 October; in 2027 it starts on 26 March and ends on 31 October. In summer
        Israel is on UTC+3, in winter UTC+2. Anyone who plans with a fixed gap can get it wrong in the weeks when the
        two countries do not switch on the same day.
      </p>

      <h2 id="shifts" className={styles.anchor}>
        Weeks when the difference changes
      </h2>
      <p>
        The gap with the United States and Europe is not constant, because the switch dates differ. The table shows
        the short periods in 2026 and 2027 when the gap differs from usual, as calculated from the time zones.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>Unusual periods in the difference from Israel, 2026 and 2027</caption>
          <thead>
            <tr>
              <th scope="col">Destination</th>
              <th scope="col">Period</th>
              <th scope="col">Days</th>
              <th scope="col">Difference</th>
            </tr>
          </thead>
          <tbody>
            {shiftRows.map((row) => (
              <tr key={row.key}>
                <th scope="row">{row.label}</th>
                <td>{row.range}</td>
                <td>{row.days}</td>
                <td className={styles.value}>{enFormatDifference(row.minutes)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="table" className={styles.anchor}>
        Time difference from Israel to {cityRows.length} cities
      </h2>
      <p>
        A positive number means the destination is ahead of Israel, a negative one that it is behind. The columns show
        the gap in winter (January) and summer (July) under each country&apos;s current daylight saving rules; the
        current time in each city is in the calculator above.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>Time difference from Israel, winter and summer 2027</caption>
          <thead>
            <tr>
              <th scope="col">City</th>
              <th scope="col">Country</th>
              <th scope="col">Winter</th>
              <th scope="col">Summer</th>
            </tr>
          </thead>
          <tbody>
            {cityRows.map((row) => (
              <tr key={row.city.id}>
                <th scope="row">{row.city.name}</th>
                <td>{row.city.country}</td>
                <td className={styles.value}>{enFormatDifference(row.winter)}</td>
                <td className={styles.value}>{enFormatDifference(row.summer)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.caveat}>
        Daylight saving rules are set by each country&apos;s law. Morocco, for example, turns its clocks back an hour
        during Ramadan, and Iran and Egypt have changed their rules in recent years. For an important meeting, check
        the exact date in the calculator.
      </p>

      <h2>Planning a meeting across time zones</h2>
      <p>
        Set working hours for Israel and for the destination, and the blue bar shows which hours of the day, in Israel
        time, suit both sides. With New York and 9:00 to 18:00 on both sides, the overlap is two hours, 16:00 to 18:00
        in Israel. With Europe almost the whole working day overlaps; with the United States 2 to 4 hours remain in the
        afternoon; with East Asia and Australia the overlap is small, so Israelis usually meet early in the morning.
        Write the time for both sides in the invitation.
      </p>
      <p>
        For flights to the same destinations there is a{' '}
        <Link href="/en/tools/flight-time-from-israel">table of flight times from Israel</Link>, which also shows the
        time difference for each destination.
      </p>

      <h2>Sources</h2>
      <ul>
        <li>{externalLink(SOURCES.kan.href, SOURCES.kan.label)}: summer time dates for 2026</li>
        <li>
          {externalLink(SOURCES.protocol.href, SOURCES.protocol.label)}: the rule of the last Friday of March and the
          last Sunday of October
        </li>
        <li>{externalLink(SOURCES.iana.href, SOURCES.iana.label)}: time zones and rules</li>
        <li>{externalLink(SOURCES.mdn.href, SOURCES.mdn.label)}: the browser interface used for the calculation</li>
      </ul>
      <p className={styles.reviewed}>
        Sources checked on {TIME_DIFFERENCE_CHECKED}. Verify the text of the Time Determination Law on gov.il before
        relying on it legally.
      </p>
    </EnToolLayout>
  )
}
