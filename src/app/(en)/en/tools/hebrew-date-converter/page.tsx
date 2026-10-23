import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import HebrewDateConverterEn from '../_components/HebrewDateConverterEn'
import styles from '../../../../(he)/(site)/tools/hebrew-date-converter/page.module.css'

const SLUG = 'hebrew-date-converter'
const META_TITLE = 'Hebrew Date Converter: Hebrew to Gregorian and Back'
const DESCRIPTION =
  'Convert a Hebrew date to the Gregorian calendar and back, including births after sunset and Adar I and Adar II. Hebrew age, Hebrew birthday and bar and bat mitzvah dates, free.'

const monthRows = [
  { name: 'Tishrei', length: '30', start: 'September or October' },
  { name: 'Cheshvan', length: '29 or 30', start: 'October or November' },
  { name: 'Kislev', length: '29 or 30', start: 'November or December' },
  { name: 'Tevet', length: '29', start: 'December or January' },
  { name: 'Shevat', length: '30', start: 'January' },
  { name: 'Adar (regular year)', length: '29', start: 'February or March' },
  { name: 'Adar I (leap year)', length: '30', start: 'January or February' },
  { name: 'Adar II (leap year)', length: '29', start: 'March' },
  { name: 'Nisan', length: '30', start: 'March or April' },
  { name: 'Iyar', length: '29', start: 'April or May' },
  { name: 'Sivan', length: '30', start: 'May or June' },
  { name: 'Tammuz', length: '29', start: 'June or July' },
  { name: 'Av', length: '30', start: 'July or August' },
  { name: 'Elul', length: '29', start: 'August or September' },
]

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-hebrew-date-faq-birth',
    question: 'How do I find my Hebrew birthday from my date of birth?',
    answer:
      'Choose Gregorian to Hebrew above and enter your date of birth. If you were born in the evening, after sunset, tick the box, because the Hebrew date changes at nightfall. The result appears with the Hebrew month name, like 22 Tishrei 5787, and in Hebrew letters. To see your Hebrew age, your next Hebrew birthday and your bar or bat mitzvah date, choose Age and bar mitzvah.',
  },
  {
    id: 'en-hebrew-date-faq-drift',
    question: 'Why does my Hebrew birthday fall on a different date every year?',
    answer:
      'A regular Hebrew year is about 11 days shorter than a Gregorian year, and a leap year is about 19 days longer. The Hebrew date stays the same, but on the civil calendar it moves back and forth within about a month. After 19 years the two calendars almost line up again, so at 19, 38 and 57 the Hebrew birthday falls on the civil birthday or a day or two either side.',
  },
  {
    id: 'en-hebrew-date-faq-adar',
    question: 'What happens to a date in Adar in a leap year?',
    answer:
      'A leap year has two months of Adar, and Purim falls in Adar II. Someone born in Adar of a regular year celebrates a birthday and bar mitzvah in Adar II in a leap year. Someone born in Adar I or Adar II celebrates in the single Adar of a regular year. For the yahrzeit of someone who died in Adar customs differ, so ask a rabbi. The converter picks the right Adar for each year.',
  },
  {
    id: 'en-hebrew-date-faq-bar-mitzvah',
    question: 'How do I work out a bar or bat mitzvah date?',
    answer:
      'A boy becomes bar mitzvah on the day he turns 13 by the Hebrew calendar, and a girl becomes bat mitzvah at 12. Choose Age and bar mitzvah, enter the date of birth and you get both dates, Hebrew and civil. It is a calendar calculation only; the date of the aliyah to the Torah is set with the synagogue or rabbi. The Hebrew date already begins the evening before.',
  },
  {
    id: 'en-hebrew-date-faq-year',
    question: 'How do I convert a Gregorian year to a Hebrew year?',
    answer:
      'From January until Rosh Hashanah add 3760 to the Gregorian year, and from Rosh Hashanah to the end of December add 3761. October 2026 and March 2027 are both in 5787. In Hebrew letters 5787 is written ה׳תשפ״ז: ה is 5,000 and תשפ״ז is 787 (ת 400, ש 300, פ 80, ז 7). In everyday use it is shortened to תשפ״ז.',
  },
]

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

export default function EnHebrewDateConverterPage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="The Hebrew date changes in the evening, after sunset, and a regular Hebrew year is about 11 days shorter than a Gregorian year, so the same Hebrew date moves around the civil calendar. Enter a date below to get its equivalent, with the Hebrew month, the date in Hebrew letters and the day of the week."
      tool={<HebrewDateConverterEn />}
      faq={faq}
      chips={['Both directions', 'Handles after sunset', 'Age and bar mitzvah', 'No sign-up']}
      cta={{
        text: 'Need a website or system that shows Hebrew dates, appointments or events? We build that.',
        label: 'Custom software development',
        href: '/en/services/development',
      }}
    >
      <h2>The Hebrew calendar in two minutes</h2>
      <p>
        The Hebrew calendar follows both the moon and the sun. Its months are lunar months of 29 or 30 days, and a
        regular year of 12 months lasts 353 to 355 days, about 11 days less than a Gregorian year. To keep Passover in
        the spring, a whole month is added every few years.
      </p>
      <h3>Leap years: Adar I and Adar II</h3>
      <p>
        Every 19-year cycle has 7 leap years: years 3, 6, 8, 11, 14, 17 and 19 of the cycle. A leap year has 13 months
        and lasts 383 to 385 days. The extra month is Adar: a leap year has Adar I and Adar II, and Purim falls in Adar
        II. The year 5787, which began in September 2026, is a leap year, and 5788 after it is a regular year.
      </p>
      <h3>Cheshvan and Kislev change length</h3>
      <p>
        Most months are fixed, but Cheshvan and Kislev have 29 or 30 days depending on the year. So 30 Cheshvan and 30
        Kislev exist only in some years, and the converter tells you if the date you chose does not exist that year.
        Rosh Hashanah, 1 Tishrei, never falls on a Sunday, Wednesday or Friday, and between 1900 and 2099 it always
        falls between 5 September and 5 October.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>The Hebrew months and when they begin (years 2000 to 2099)</caption>
          <thead>
            <tr>
              <th scope="col">Month</th>
              <th scope="col">Days</th>
              <th scope="col">The 1st falls in</th>
            </tr>
          </thead>
          <tbody>
            {monthRows.map((row) => (
              <tr key={row.name}>
                <th scope="row">{row.name}</th>
                <td>{row.length}</td>
                <td>{row.start}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3>The Hebrew day starts in the evening</h3>
      <p>
        In the Hebrew calendar the day starts in the evening, not at midnight. Someone born on Tuesday evening, after
        sunset, was born on Wednesday&apos;s Hebrew date. That is why the converter has an after sunset box, which adds
        one day. The minutes between sunset and the appearance of the stars, called bein hashmashot, are a matter of
        doubt in Jewish law, so anyone born then who wants the exact date should ask a rabbi. The converter does not
        know when the sun set on the day and in the place you chose: in Israel sunset is roughly between 16:40 in winter
        and 19:50 in summer.
      </p>

      <h2>How to write a Hebrew date</h2>
      <p>
        A Hebrew date is written in letters, and every letter is a number: א is 1, י is 10, ק is 100 and ת is 400. The
        order is day, month, year, and the month takes the prefix ב: כ״ב בתשרי ה׳תשפ״ז (22 Tishrei 5787).
      </p>
      <ul>
        <li>A one-letter number takes a geresh after it: א׳ בניסן, ל׳ בשבט.</li>
        <li>A number of several letters takes gershayim before the last letter: י״ז באייר, תשפ״ז.</li>
        <li>15 and 16 are written ט״ו and ט״ז, not י״ה and י״ו, to avoid writing letters of the divine name.</li>
        <li>The ה before the year is 5,000. You can write ה׳תשפ״ז or simply תשפ״ז; both are correct.</li>
      </ul>

      <h2>Hebrew birthdays, yahrzeits and invitations</h2>
      <h3>Hebrew birthday</h3>
      <p>
        The Hebrew date comes round every year, but on the civil calendar it moves within about a month. To see when
        your Hebrew birthday falls in the coming years, choose <a href="#hebrew-to-gregorian">Hebrew to Gregorian</a>{' '}
        and enter your Hebrew date of birth: a table of the next five years appears under the result. The{' '}
        <a href="#hebrew-age">Age and bar mitzvah</a> tab also shows your Hebrew age and the bar and bat mitzvah dates.
      </p>
      <h3>Yahrzeit</h3>
      <p>
        A yahrzeit is set by the Hebrew date of death. When the death was in Adar, on 30 Cheshvan or on 30 Kislev, there
        are years when the date appears twice or not at all, and customs differ. The converter&apos;s table follows the
        custom for birthdays, so for a yahrzeit on such dates check with a rabbi.
      </p>
      <h3>Event invitations</h3>
      <p>
        Wedding, bar mitzvah and brit invitations often show both dates. For an evening event that starts after
        nightfall, the Hebrew date is already the next day&apos;s, so check it before sending to print: choose{' '}
        <a href="#gregorian-to-hebrew">Gregorian to Hebrew</a> and tick after sunset.
      </p>

      <h2>Hebrew dates in Israeli documents</h2>
      <p>
        In Israel the Hebrew date also appears in official documents. The names of laws include both the Hebrew and the
        Gregorian year, for example the Consumer Protection Law, 5741-1981, and letters from government offices often
        carry both dates. Businesses whose clients live by the Hebrew calendar, such as event halls, wedding and bar
        mitzvah photographers, schools and synagogues, often write both dates side by side.
      </p>
      <p>
        On a website or in a system you can show Hebrew dates without an external library: modern browsers include the
        Hebrew calendar, and this converter is built on it.
      </p>
    </EnToolLayout>
  )
}
