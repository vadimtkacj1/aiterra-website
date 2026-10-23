import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import SickDaysCalculatorEn from '../_components/SickDaysCalculatorEn'
import { MAX_BALANCE_DAYS, accrue, dayRate, payForSpell } from '@/lib/sick-days'
import styles from '../../../../(he)/(site)/tools/sick-days-calculator/page.module.css'

const SLUG = 'sick-days-calculator'
const META_TITLE = 'Israel Sick Days Calculator: Accrual and Sick Pay'
const DESCRIPTION =
  'Free Israel sick leave calculator under the Sick Pay Law: how many sick days you have accrued (1.5 a month, up to 90), what each sick day pays, with examples for salaried and hourly employees.'

const UNIT = 100
const dayFormat = new Intl.NumberFormat('en-IL', { maximumFractionDigits: 2 })
const moneyFormat = new Intl.NumberFormat('en-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 2 })
const formatDays = (hundredths: number) => dayFormat.format(Math.round(hundredths) / UNIT)
const daysLabel = (hundredths: number) => (Math.round(hundredths) === UNIT ? '1 day' : `${formatDays(hundredths)} days`)
const formatShekels = (agorot: number) => moneyFormat.format(Math.round(agorot) / 100)

const accrualRows = [1, 3, 6, 12, 24, 36, 48, 60, 72].map((months) => {
  const accrual = accrue(months, 0, 'five', 0)
  return {
    months: months === 1 ? '1 month' : `${months} months`,
    days: accrual.overCap ? `${MAX_BALANCE_DAYS} (the cap)` : formatDays(accrual.earned),
  }
})

const partialRows = [5, 10, 15, 20].map((days) => ({
  days: `${days} working days`,
  five: formatDays(accrue(0, days, 'five', 0).earned),
  six: formatDays(accrue(0, days, 'six', 0).earned),
}))

const EXAMPLE_MONTHS = 10
const EXAMPLE_USED = 2
const EXAMPLE_SPELL = 6
const EXAMPLE_WAGE = 40_000
const exampleAccrual = accrue(EXAMPLE_MONTHS, 0, 'five', EXAMPLE_USED * UNIT)
const exampleSpell = payForSpell(EXAMPLE_SPELL, exampleAccrual.balance, false, EXAMPLE_WAGE)
const exampleRows = Array.from({ length: EXAMPLE_SPELL }, (_, index) => {
  const rate = dayRate(index + 1, false)
  return { day: `Day ${index + 1}`, rate: `${rate}%`, pay: formatShekels((EXAMPLE_WAGE * rate) / 100) }
})

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-sick-faq-per-year',
    question: 'How many sick days do you get per year in Israel?',
    answer:
      '18 days a year. Under section 4 of the Sick Pay Law you accrue one and a half days for every full month of work with the same employer, up to a maximum of 90 days. Someone who is not sick for five years reaches the cap. A month in which you did not work every working day gives a proportional share. A collective agreement, extension order or personal contract can give more.',
  },
  {
    id: 'en-sick-faq-first-day',
    question: 'Is the first sick day paid in Israel?',
    answer:
      'Not under the law. The first day of absence is unpaid, the second and third days are paid at half, and from the fourth day you get full pay, as long as you have a balance. There is one exception in the law: absence for treatment or tests because of cancer or dialysis is paid from the first day, with a medical certificate. An employment agreement can also pay for the first day.',
  },
  {
    id: 'en-sick-faq-hourly',
    question: 'How are sick days calculated for an hourly employee?',
    answer:
      'Accrual is the same: one and a half days for every full month. The difference is in how sick days are counted. For a salaried employee every sick day counts, including Shabbat and holidays. For a full-time employee paid by the hour or day, weekly rest days and holidays are not counted. Sick pay is based on the pay for a normal working day. For intermittent workers the law sets a special ratio formula.',
  },
  {
    id: 'en-sick-faq-leaving',
    question: 'Do I get paid for unused sick days when I leave?',
    answer:
      'Not under the law. The Ministry of Labor notes that, unlike vacation days, there is no statutory right to be paid for unused sick days. Some collective agreements and personal contracts do pay for them, in full or in part, so check the agreement that applies to you. Statutory accrual counts with the same employer or at the same workplace.',
  },
  {
    id: 'en-sick-faq-dismissal',
    question: 'Can an employee on sick leave be dismissed?',
    answer:
      'Not while they are absent because of illness and have accrued sick days, up to 90 days, under section 4a of the law. The ban does not apply if notice of dismissal was given before the employee fell ill, or if the workplace closed permanently, the employer was declared bankrupt or a winding-up order was issued against it.',
  },
]

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

export default function EnSickDaysCalculatorPage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="Under Israel's Sick Pay Law you accrue one and a half sick days for every full month of work, up to 90 days. The first day of illness is unpaid, the second and third are paid at half pay, and from the fourth day you get full pay."
      chips={['Based on the text of the law', 'Accrual and pay for a spell', 'Salaried and hourly employees']}
      tool={<SickDaysCalculatorEn />}
      faq={faq}
      cta={{
        text: 'Payroll and employee entitlements, such as sick days, notice periods and recuperation pay, can be calculated automatically in a CRM.',
        label: 'Business automation',
        href: '/en/services/automation',
      }}
    >
      <h2>How many sick days you get under Israeli law</h2>
      <p>
        Section 4(a) of the Sick Pay Law, 1976 gives one and a half days for every full month of work with the same
        employer or at the same workplace, up to 90 days, minus the days already paid as sick pay. In a full year that
        is 18 days, and someone who is never sick reaches the cap after 60 months. The law covers every employee in
        Israel, including olim and foreign workers, unless sick pay is regulated by a collective agreement.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>Sick days accrued by length of service, with none used</caption>
          <thead>
            <tr>
              <th scope="col">Full months worked</th>
              <th scope="col">Sick days accrued</th>
            </tr>
          </thead>
          <tbody>
            {accrualRows.map((row) => (
              <tr key={row.months}>
                <th scope="row">{row.months}</th>
                <td>{row.days}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3>A month in which you did not work every working day</h3>
      <p>
        Under section 4(b), in such a month 25 working days count as a full month, and at a workplace with a five-day
        week, 21⅔ working days. Part of a month gives a proportional share of one and a half days. The Ministry of Labor
        gives an example: an employee who worked half the working days in a month accrues 0.75 of a day.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>Sick days for a partial month</caption>
          <thead>
            <tr>
              <th scope="col">Days actually worked in the month</th>
              <th scope="col">5-day week</th>
              <th scope="col">6-day week</th>
            </tr>
          </thead>
          <tbody>
            {partialRows.map((row) => (
              <tr key={row.days}>
                <th scope="row">{row.days}</th>
                <td>{row.five}</td>
                <td>{row.six}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>How much sick days pay</h2>
      <p>
        Under section 2(a) of the law, the first day of absence is unpaid, the second and third days are paid at half
        sick pay, and from the fourth day full sick pay applies. Full sick pay equals the wage the employee would have
        received had they kept working (section 5), based on the components in section 6: base pay, seniority,
        cost-of-living, family and departmental or professional supplements. Overtime is not on the list.
      </p>
      <h3>
        Example: {EXAMPLE_SPELL} sick days at {formatShekels(EXAMPLE_WAGE)} a day
      </h3>
      <p>
        An employee with {EXAMPLE_MONTHS} full months of work has accrued {daysLabel(exampleAccrual.earned)}. They have
        already been paid sick pay for {daysLabel(EXAMPLE_USED * UNIT)}, so {daysLabel(exampleAccrual.balance)} remain.
        Now they are sick for {EXAMPLE_SPELL} days:
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>Sick pay for each day of the spell</caption>
          <thead>
            <tr>
              <th scope="col">Sick day</th>
              <th scope="col">Rate under the law</th>
              <th scope="col">Pay</th>
            </tr>
          </thead>
          <tbody>
            {exampleRows.map((row) => (
              <tr key={row.day}>
                <th scope="row">{row.day}</th>
                <td>{row.rate}</td>
                <td>{row.pay}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Total</th>
              <td>{daysLabel(exampleSpell.paidDays)} of pay</td>
              <td>{exampleSpell.amount === null ? '' : formatShekels(exampleSpell.amount)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p>
        After the spell, {daysLabel(exampleSpell.balanceAfter)} remain. The law deducts from the balance &quot;the period
        for which the employee received sick pay&quot;, so the calculator deducts the days that were paid, in full or at
        half, and not the unpaid first day. When the balance runs out in the middle of an illness, the law does not
        require pay for the days after it.
      </p>
      <h3>Cancer and dialysis</h3>
      <p>
        An employee with cancer or an illness that needs regular dialysis, who is absent for periodic treatment or tests,
        even after recovering, gets sick pay from the first day of absence as long as they have a balance. The condition
        is a written medical certificate that the treatment or test is connected to that illness (section 2(a1)).
      </p>

      <h2>Hourly and salaried employees</h2>
      <p>
        The law distinguishes between a salaried employee, whose pay is mainly monthly or longer, and an employee paid
        by the hour or day. Accrual is the same for both. The difference is in how sick days are counted (section 2(b)):
      </p>
      <ul>
        <li>
          <strong>Salaried:</strong> every sick day, including weekly rest days and holidays.
        </li>
        <li>
          <strong>Paid by the hour or day, full-time:</strong> every sick day, without weekly rest days and holidays.
        </li>
        <li>
          <strong>Paid by the hour or day, not working every working day (intermittent):</strong> the sick days
          multiplied by the ratio between the days worked in the fullest quarter of the year before the illness and the
          working days in that quarter. The calculator does not handle this case.
        </li>
      </ul>
      <p>
        For example, illness from Thursday to Sunday is four sick days for a salaried employee. For an hourly employee
        working six days a week, Shabbat is not counted and Sunday is the third day of illness. For an hourly employee,
        the daily pay is the pay for a normal working day.
      </p>

      <h2>Notifying the employer, the sick note and when it is paid</h2>
      <ul>
        <li>Tell the employer about the absence and its expected length within 3 days of the first day.</li>
        <li>
          To get sick pay, hand in a sick note signed by a doctor. If you are insured with a kupat holim (health fund),
          hand in a note from the fund or one it approved.
        </li>
        <li>
          Sick pay is paid on the day the wage would have been paid, if the note was handed in 7 days before. If it was
          handed in later, it is paid on the next payday.
        </li>
        <li>Sick pay counts as wages for every purpose (section 7), and late payment may entitle the employee to compensation for delayed wages.</li>
      </ul>

      <h2>Dismissal and leaving the job</h2>
      <p>
        An employer may not dismiss an employee who is absent because of illness while they have accrued sick days, up
        to 90 days (section 4a). The ban does not apply if notice of dismissal was given before the absence, or if the
        workplace closed permanently, the employer was declared bankrupt or a winding-up order was issued.
      </p>
      <p>
        When you leave, there is no statutory right to be paid for unused sick days, unlike vacation days. A collective
        agreement or contract can provide for payment.
      </p>

      <h2>What the calculator does not cover</h2>
      <ul>
        <li>
          Employees whose sick pay is regulated by a collective agreement or extension order, for example in agriculture
          and transport. The law applies only to those whose sick pay is not regulated by such an agreement (section 1).
          Someone entitled both under the law and under terms agreed with the employer chooses which to receive (section
          12).
        </li>
        <li>An employer that insured its employees for sick pay in a provident fund: payment follows the policy terms (sections 8 and 4(c)).</li>
        <li>Absence because of the illness of a child, spouse or parent, which other laws regulate.</li>
        <li>Work accidents: no sick pay for a period paid as work injury benefit under the National Insurance Law (section 11).</li>
        <li>Partial incapacity, when the employer offers other suitable work (section 3).</li>
      </ul>
      <blockquote>
        The calculation is based only on the Sick Pay Law, 1976 and is a general estimate. A collective agreement,
        sector extension order or personal contract can give better rights. The calculator does not cover absence for a
        child&apos;s, spouse&apos;s or parent&apos;s illness, and does not replace legal advice or a check with payroll.
      </blockquote>

      <h2>Sources</h2>
      <ul className={styles.sources}>
        <li>
          <a href="https://www.gov.il/he/Departments/Guides/paid-sick-leave" rel="noopener" target="_blank">
            Ministry of Labor: absence from work due to illness (Hebrew)
          </a>
        </li>
        <li>
          <a href="https://www.gov.il/he/pages/notice-of-dismissal-and-resignation" rel="noopener" target="_blank">
            Ministry of Labor: notice of dismissal and resignation, section on unused sick days (Hebrew)
          </a>
        </li>
        <li>Sick Pay Law, 1976: sections 1 to 6, 8, 11 and 12</li>
      </ul>
    </EnToolLayout>
  )
}
