import Link from 'next/link'
import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import SeverancePayCalculatorEn from '../_components/SeverancePayCalculatorEn'
import { ils } from '../_components/en-format'
import { EXEMPTION_CEILING_PER_YEAR, EXEMPTION_CEILING_YEAR } from '@/lib/severance-pay'
import ToolSources from '../../../../(he)/(site)/components/tools/ToolSources'

const kolzchut = (title: string) => `https://www.kolzchut.org.il/he/${encodeURIComponent(title.replace(/ /g, '_'))}`

const sources = [
  {
    href: kolzchut('פיצויי פיטורים'),
    label: 'Kol Zchut: severance pay (Hebrew)',
  },
  {
    href: kolzchut('פיצויי פיטורים לעובד שהתפטר'),
    label: 'Kol Zchut: severance pay after resigning (Hebrew)',
  },
  {
    href: kolzchut('פיצויי פיטורים לעובד שהתפטר עקב הרעה מוחשית בתנאי העבודה'),
    label: 'Kol Zchut: resigning over a substantial worsening of conditions (Hebrew)',
  },
  {
    href: kolzchut('פיצויי פיטורים לעובד שהתפטר עקב בריאות לקויה שלו או של בן משפחתו'),
    label: 'Kol Zchut: resigning over the health of the employee or a family member (Hebrew)',
  },
  {
    href: kolzchut('פטור ממס הכנסה על פיצויי פיטורים וכספים אחרים המשולמים לעובד בסיום העסקתו'),
    label: 'Kol Zchut: income tax exemption on severance pay (Hebrew)',
  },
  {
    href: 'https://www.gov.il/BlobFolder/generalpage/income-tax-monthly-deductions-booklet/he/generalInformation_income-tax-monthly-deductions-booklet_monthly-deductions-booklet-2026.pdf',
    label: 'Israel Tax Authority: income tax guide for salaries, January 2026 onwards (PDF, Hebrew)',
  },
  {
    href: 'https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%A4%D7%99%D7%A6%D7%95%D7%99%D7%99_%D7%A4%D7%99%D7%98%D7%95%D7%A8%D7%99%D7%9D',
    label: 'Severance Pay Law, 1963, on Wikisource (Hebrew)',
  },
]

const SLUG = 'severance-pay-calculator'
const META_TITLE = 'Israel Severance Pay Calculator 2026 (Pitzuim)'
const DESCRIPTION =
  'Free Israel severance pay calculator: last salary times years of work, prorated for a partial year, with Section 14 and the 2026 tax exemption ceiling.'

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-sev-faq-formula',
    question: 'How is severance pay calculated in Israel?',
    answer:
      'Severance pay, or pitzuim, is the last monthly salary multiplied by the years worked for the same employer. Someone who worked six years and three months on a last salary of ₪12,000 receives 12,000 × 6.25, which is ₪75,000. A partial year counts proportionally, so each full month is one twelfth of a year.',
  },
  {
    id: 'en-sev-faq-resign',
    question: 'Do I get pitzuim if I resign?',
    answer:
      'Usually not, but in some situations the law treats a resignation as a dismissal. According to Kol Zchut, these include a substantial worsening of working conditions and poor health of the employee or a family member. Both require at least a year of work. For worsened conditions, warn the employer in writing and allow time to fix the problem before resigning.',
  },
  {
    id: 'en-sev-faq-year',
    question: 'What if I worked less than a year?',
    answer:
      'By law, severance pay usually goes to someone who worked at least a year for the same employer or at the same workplace. A collective agreement, personal contract or workplace custom can give it earlier, so check your contract.',
  },
  {
    id: 'en-sev-faq-section14',
    question: 'What is Section 14 and how does it affect severance?',
    answer:
      'Section 14 of the Severance Pay Law lets an employer deposit a monthly amount into a pension fund or provident fund in place of paying pitzuim at the end. With such an arrangement from day one on the full salary, no further payment is due on dismissal, and the accumulated money is yours. If it started midway or covered only part of the salary, a difference can remain.',
  },
  {
    id: 'en-sev-faq-tax',
    question: 'How much severance pay is tax-free?',
    answer: `In ${EXEMPTION_CEILING_YEAR} the exemption is up to ${ils(EXEMPTION_CEILING_PER_YEAR)} per year of work, and never more than the severance actually paid. For 10 years of work, that is up to ${ils(EXEMPTION_CEILING_PER_YEAR * 10)}. The amount above the ceiling is taxable, and you can apply to spread it or for relief from withholding. The ceiling changes every year.`,
  },
]

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

export default function EnSeverancePayPage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="Severance pay in Israel, or pitzuim, is one last monthly salary for each year with the same employer, prorated for a partial year. It usually goes to an employee dismissed after at least a year. The calculator counts your seniority and shows how much is tax-exempt in 2026."
      tool={<SeverancePayCalculatorEn />}
      faq={faq}
      chips={['Last salary × years', 'Section 14', `${EXEMPTION_CEILING_YEAR} tax exemption`]}
      cta={{
        text: 'Offboarding, payroll calculations and employee paperwork can run in one system, without copying data between files.',
        label: 'Business automation',
        href: '/en/services/automation',
      }}
    >
      <h2>How to calculate pitzuim</h2>
      <p>
        The Severance Pay Law, 1963, sets the rule: one last monthly salary for each year of work. Severance = last
        monthly salary × years of seniority. Full months count as twelfths of a year, and leftover days count as part of
        a month. Seniority is measured with the same employer or at the same workplace, including the first and last day.
      </p>

      <h2>When severance pay is due</h2>
      <ul>
        <li>
          <strong>Dismissal.</strong> An employee dismissed after at least a year is entitled, except in special cases
          where the law or a tribunal denies it.
        </li>
        <li>
          <strong>Resignation treated as dismissal.</strong> This includes a substantial worsening of conditions and poor
          health of the employee or a family member. If the employer fixed the problem and you resigned anyway, no
          severance is due.
        </li>
        <li>
          <strong>Other cases.</strong> The law lists further cases, including payment to the survivors of an employee who
          died. Check any special case with Kol Zchut or a lawyer.
        </li>
      </ul>

      <h2>Section 14: deposits in place of severance</h2>
      <p>
        The usual deposit is 8.33% of salary, one month out of twelve. Where the arrangement applies from day one on the
        full salary, there is no extra payment from the employer. Where it began midway, deposits were lower or did not
        cover the full salary, the law still applies to the uncovered part. Choosing Section 14 in the calculator changes
        the explanation, not the amount.
      </p>

      <h2>Part-time work and variable pay</h2>
      <p>
        If pay changed over the years, job size grew or shrank, or pay includes commission and variable hours, the answer
        depends on the details. The calculator gives an estimate from one salary. Enter a monthly average for variable
        pay, and check the result with legal advice before relying on it.
      </p>

      <h2>Tax on severance in {EXEMPTION_CEILING_YEAR}</h2>
      <p>
        The exemption is the lower of the severance paid and {ils(EXEMPTION_CEILING_PER_YEAR)} × years of seniority. The
        calculator does not compute the tax rate on the rest, because it depends on your other income. It shows the
        exemption only for an end date in {EXEMPTION_CEILING_YEAR}.
      </p>
      <p>
        Unused vacation is also paid out when a job ends: see the{' '}
        <Link href="/en/tools/vacation-days-calculator">vacation days calculator</Link>.
      </p>
      <p>
        This is general information, not legal advice. A collective agreement, personal contract or extension order can
        give more, and severance can be denied or reduced in special cases.
      </p>
      <ToolSources sources={sources} heading="Sources" />
    </EnToolLayout>
  )
}
