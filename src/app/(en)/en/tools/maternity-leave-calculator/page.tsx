import Link from 'next/link'
import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import MaternityLeaveCalculatorEn from '../_components/MaternityLeaveCalculatorEn'
import { MAX_DAILY_PAY_AGOROT, calculateMaternity, defaultInput, scenarioTable } from '@/lib/maternity-leave'
import styles from '../../../../(he)/(site)/tools/maternity-leave-calculator/page.module.css'

const SLUG = 'maternity-leave-calculator'
const META_TITLE = 'Israel Maternity Leave Calculator: 26 or 15 Weeks'
const DESCRIPTION =
  'Free Israel maternity leave calculator under the Women\'s Employment Law: 26 weeks, or 15 with under a year of service, your return date, weeks paid by Bituach Leumi and dismissal protection.'

const DAY_MS = 86_400_000
const dateFormat = new Intl.DateTimeFormat('en-IL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
const weekdayFormat = new Intl.DateTimeFormat('en-IL', { weekday: 'long', timeZone: 'UTC' })
const moneyFormat = new Intl.NumberFormat('en-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 2 })

const formatDate = (day: number) => dateFormat.format(new Date(day * DAY_MS))
const formatMoney = (agorot: number) => moneyFormat.format(agorot / 100)
const weeksText = (days: number) => {
  const weeks = Math.floor(days / 7)
  const rest = days % 7
  const weekPart = `${weeks} week${weeks === 1 ? '' : 's'}`
  return rest ? `${weekPart} and ${rest} day${rest === 1 ? '' : 's'}` : weekPart
}

const scenarioLabels = [
  '12 months or more with the employer, full maternity pay',
  '12 months or more with the employer, partial maternity pay',
  'Less than 12 months with the employer, full maternity pay',
  'Less than 12 months with the employer, partial maternity pay',
  'Twins, 12 months or more, full maternity pay',
  'Triplets, 12 months or more, full maternity pay',
  'Twins, less than 12 months, partial maternity pay',
]

const scenarios = scenarioTable().map((row, index) => ({ ...row, label: scenarioLabels[index] }))
const example = calculateMaternity({
  ...defaultInput,
  expected: '2027-02-15',
  start: '2027-02-01',
  months: '24',
  qualification: 'full',
})
const maxDailyPay = formatMoney(MAX_DAILY_PAY_AGOROT)
const maxFullPay = formatMoney(MAX_DAILY_PAY_AGOROT * 105)

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-mat-faq-length',
    question: 'How long is maternity leave in Israel?',
    answer:
      'Under section 6 of the Women\'s Employment Law, maternity leave (called birth and parenting leave in the law) is 26 weeks for an employee who has worked 12 months or more for the same employer or at the same workplace. With less service it is 15 weeks. Each additional baby from the same birth adds 3 weeks, and there are extensions when the mother or the baby is hospitalised.',
  },
  {
    id: 'en-mat-faq-paid',
    question: 'How many weeks of maternity leave are paid?',
    answer:
      `Bituach Leumi (National Insurance) pays maternity pay for 15 weeks if contributions were paid for 10 of the 14 months before you stopped working, or 15 of 22. With 6 of 14 months it pays for 8 weeks. So in a 26-week leave, usually 11 weeks are unpaid. The daily amount follows your salary, up to ${maxDailyPay} from 1 January 2026.`,
  },
  {
    id: 'en-mat-faq-twins',
    question: 'What happens with twins?',
    answer:
      'Each additional baby from the same birth extends the leave by 3 weeks, so with 12 months or more of service it is 29 weeks for twins and 32 for triplets. Maternity pay is extended by 3 weeks per additional baby for full maternity pay, so 18 weeks for twins, and by 2 weeks for partial maternity pay. Bituach Leumi pays the extra without a separate claim.',
  },
  {
    id: 'en-mat-faq-shorten',
    question: 'Can I shorten my maternity leave?',
    answer:
      'Yes. An employee with 12 months or more of service can shorten the leave, but not below 15 weeks plus extensions such as 3 weeks per additional baby. Once she gives notice that she wants to return, the employer cannot delay her return by more than three weeks. An employee with less than 12 months is entitled to 15 weeks, and the statutory right to shorten does not apply to her.',
  },
  {
    id: 'en-mat-faq-dismissal',
    question: 'When can an employer dismiss someone after maternity leave?',
    answer:
      'During maternity leave an employer may not dismiss an employee or give her notice. In the 60 days after the leave ends, dismissal needs a Ministry of Labor permit, granted only if the business stopped operating or went bankrupt. If she takes statutory unpaid leave after the maternity leave, the protection covers that too and 60 days after it. These days do not count towards the notice period.',
  },
]

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

export default function EnMaternityLeavePage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="Maternity leave in Israel is 26 weeks for an employee with 12 months or more with the same employer, and 15 weeks with less. Bituach Leumi pays maternity pay for 15 or 8 of those weeks. The calculator gives you the last day of leave, your return-to-work date and how long protection from dismissal lasts."
      chips={['Section 6, Women\'s Employment Law', 'Paid and unpaid weeks', 'Twins and multiple births']}
      tool={<MaternityLeaveCalculatorEn />}
      faq={faq}
      cta={{
        text: 'Maternity leave dates, return dates and payroll reminders can update automatically in your business CRM.',
        label: 'Business automation',
        href: '/en/services/automation',
      }}
    >
      <h2>How long is maternity leave in Israel</h2>
      <p>
        In the Women&apos;s Employment Law, 1954, maternity leave is called birth and parenting leave. It is 26 weeks for
        an employee who worked at least 12 months for the same employer or at the same workplace before the leave, and
        15 weeks with less service (section 6(b)). Each additional baby from the same birth adds 3 weeks (section
        6(c)). During this period the employer may not employ her (section 6(a)). The rules apply to every employee in
        Israel, including olim and foreign residents working for an Israeli employer.
      </p>
      <p>
        Bituach Leumi (the National Insurance Institute) pays maternity pay for only part of the leave, based on the
        qualifying period: the months in which contributions were paid before you stopped working. In the common cases:
      </p>
      <div className={styles.tableWrap} role="region" aria-label="Maternity leave and maternity pay" tabIndex={0}>
        <table className={styles.table}>
          <caption>Maternity leave and maternity pay, in weeks</caption>
          <thead>
            <tr>
              <th scope="col">Situation</th>
              <th scope="col">Leave</th>
              <th scope="col">Paid</th>
              <th scope="col">Unpaid</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td>{row.leaveWeeks}</td>
                <td>{row.paidWeeks}</td>
                <td>{row.unpaidWeeks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Full maternity pay is 15 weeks if contributions were paid for 10 of the last 14 months or 15 of 22. Partial is
        8 weeks with 6 of 14 months. The table assumes the leave starts on the birth date.
      </p>

      <h2>When the leave starts and when you go back</h2>
      <p>
        The employee chooses whether to start the leave up to 7 weeks before the due date, or on the birth date. Weeks
        before the birth count inside the leave, and the rest are after the birth (section 6(b)(1)). With 12 months or
        more of service she can shorten the leave, but not below 15 weeks plus her extensions, and after she gives
        notice the employer cannot delay her return by more than three weeks (section 6(b)(2) and (3)).
      </p>
      {example.kind === 'result' && example.paid ? (
        <>
          <h3>Example</h3>
          <p>
            The due date is {formatDate(example.birth)}. The employee has two years with the employer and full
            maternity pay, and starts her leave two weeks early, on {formatDate(example.start)}:
          </p>
          <ul>
            <li>
              The leave, {weeksText(example.totalDays)}, runs until {formatDate(example.lastDay)}.
            </li>
            <li>
              She is back at work on {weekdayFormat.format(new Date(example.returnDay * DAY_MS))},{' '}
              {formatDate(example.returnDay)}.
            </li>
            <li>
              Bituach Leumi pays {weeksText(example.paid.days)}, from {formatDate(example.paid.from)} to{' '}
              {formatDate(example.paid.to)}. {weeksText(example.unpaidDays)} are unpaid.
            </li>
            <li>Protection from dismissal lasts until {formatDate(example.protectedUntil)}.</li>
          </ul>
          <p>If the baby was born on a different date from the due date, enter the actual birth date too.</p>
        </>
      ) : null}

      <h2>Maternity pay: how many weeks and how much</h2>
      <ul>
        <li>
          <strong>How many weeks.</strong> 15 weeks (105 days) or 8 weeks (56 days), depending on the qualifying period
          (section 50 of the National Insurance Law). Each additional baby adds 3 weeks to full maternity pay and 2
          weeks to partial (section 51).
        </li>
        <li>
          <strong>From when.</strong> From the day you stopped working, but full maternity pay not earlier than 53 days
          before the birth, and partial not earlier than 28 days before it (section 52 and the Bituach Leumi website).
          So with partial maternity pay, if you start the leave more than four weeks before the birth, the first days
          are unpaid. The calculator takes this into account.
        </li>
        <li>
          <strong>How much.</strong> The daily amount is the higher of two calculations: your salary in the three full
          months before you stopped working divided by 90, or your salary in the six months divided by 180. From 1
          January 2026 the maximum is {maxDailyPay} a day, up to {maxFullPay} for 105 days, before income tax and
          National Insurance deductions.
        </li>
      </ul>
      <p>
        A self-employed woman is also entitled to maternity pay from Bituach Leumi, based on the income she paid
        contributions on, but she has no employer granting leave, so the dates in the calculator are mainly relevant
        to employees.
      </p>

      <h2>Protection from dismissal before and after the birth</h2>
      <ul>
        <li>
          <strong>During pregnancy.</strong> A pregnant employee with at least 6 months with the same employer may not be
          dismissed without a Ministry of Labor permit, and no permit is given if the dismissal is connected to the
          pregnancy (section 9(a)).
        </li>
        <li>
          <strong>During the leave.</strong> No dismissal, and no notice that takes effect during the leave (section
          9(c)(1)).
        </li>
        <li>
          <strong>60 days after the leave.</strong> Dismissal only with a permit, given only if it is unrelated to the
          birth and the business stopped operating or the employer went bankrupt (section 9(c)(1a)).
        </li>
        <li>
          <strong>Unpaid leave after maternity leave.</strong> The employee may stay away for up to a quarter of the
          number of months she has worked, and no more than 12 months from the birth, minus the weeks by which her
          maternity leave exceeded 15 weeks (section 7(d)(1)). During that time and 60 days after it, dismissal also
          needs a permit (section 9(c)(2)).
        </li>
      </ul>
      <p>
        These periods do not count towards the notice period (section 9(c)(3)), and not renewing a fixed-term contract
        of 12 months or more counts as dismissal (section 9(g)). Under a temporary provision in force until 31 March
        2027, unpaid leave the employer put her on during a period set in the law, of at least 10 consecutive days, or
        5 consecutive days starting on 28 February or 1 March 2026, does not count towards the 60 days (section
        9(c)(2c)).
      </p>

      <h2>Extensions the calculator does not include</h2>
      <ul>
        <li>
          <strong>Mother hospitalised</strong> for more than two weeks during the leave: extended by the days in
          hospital, up to 4 weeks (section 6(b1)).
        </li>
        <li>
          <strong>Baby hospitalised</strong> for more than two weeks: extended by the days in hospital, up to 20 weeks,
          and the leave can be split (section 6(d)).
        </li>
        <li>
          <strong>Toddler with a complex disability</strong> recognised during the leave: 5 more weeks (section 6(d3)).
          Bituach Leumi pays for them from 1 April 2026.
        </li>
        <li>All these extensions together are capped at 20 weeks (section 6(d2)), and depend on notice to the employer and approvals.</li>
        <li>
          <strong>The partner.</strong> Under the conditions in section 6(h), the partner can take part of the leave
          after the first six weeks, or one week inside the mother&apos;s leave if she gives up maternity pay for the
          last week. The calculator works out the mother&apos;s leave only.
        </li>
      </ul>
      <p>
        After the leave, a full-time employee is entitled to a parenting hour every day for four months, with no pay
        deduction (section 7(c)(3)). Leave days do not harm rights that depend on seniority (section 6(i)), and they
        do not count as annual vacation days (section 5 of the Annual Leave Law). To work out annual leave, use the{' '}
        <Link href="/en/tools/vacation-days-calculator">vacation days calculator</Link>.
      </p>
      <p className={styles.caveat}>
        The dates are calculated under section 6 of the Women&apos;s Employment Law, 1954, and the paid period under
        the National Insurance Law and Bituach Leumi publications. Extensions for hospitalisation or a child&apos;s
        disability depend on approvals and notice to the employer and to Bituach Leumi. Only Bituach Leumi decides
        entitlement to maternity pay, and the calculator does not replace an eligibility check. A collective agreement
        or personal contract can give more. This is general information, not legal advice.
      </p>

      <h2>Sources</h2>
      <ul className={styles.sources}>
        <li>
          <a href="https://www.btl.gov.il/English%20Homepage/Benefits/Maternity%20Insurance/Pages/default.aspx" rel="noopener" target="_blank">
            Bituach Leumi (National Insurance Institute): maternity insurance
          </a>
        </li>
        <li>
          <a href="https://www.btl.gov.il/benefits/maternity/Childbirth_Allowance/Pages/ShiureyLeda.aspx" rel="noopener" target="_blank">
            Bituach Leumi: maternity pay amounts, including the maximum from 1 January 2026 (Hebrew)
          </a>
        </li>
        <li>Women&apos;s Employment Law, 1954: sections 6, 7 and 9</li>
        <li>National Insurance Law: sections 48 and 50 to 54 (maternity pay)</li>
        <li>Annual Leave Law, 1951: section 5</li>
      </ul>
    </EnToolLayout>
  )
}
