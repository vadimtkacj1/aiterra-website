import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import VatCalculatorEn from '../_components/VatCalculatorEn'
import calculatorStyles from '../../../../(he)/(site)/components/tools/VatCalculator.module.css'

const SLUG = 'vat-calculator'
const META_TITLE = 'Israel VAT Calculator (18%): Add or Remove VAT'
const DESCRIPTION =
  'Free Israel VAT calculator at the current 18% rate: add VAT to a net price or extract it from a VAT-inclusive total, for one amount or a list, with an Eilat 0% option.'

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-vat-faq-rate',
    question: 'What is the VAT rate in Israel?',
    answer:
      'The standard VAT rate in Israel (in Hebrew, maam) is 18%, in force since 1 January 2025. From October 2015 until the end of 2024 it was 17%. The rate is set by order of the Minister of Finance and can change again, so the calculator also lets you type a different rate. The Israel Tax Authority publishes the current rate on gov.il.',
  },
  {
    id: 'en-vat-faq-reverse',
    question: 'How do I remove VAT from a price that already includes it?',
    answer:
      'Divide the total by 1.18. A price of ₪590 including VAT is ₪500 before VAT, and the VAT is ₪90. Do not take 18% off the total: ₪590 minus 18% is ₪483.80, which is too low, because VAT is charged on the net amount, not on the total. In the calculator, choose Extract VAT.',
  },
  {
    id: 'en-vat-faq-export',
    question: 'Do I charge Israeli VAT on services to a client abroad?',
    answer:
      'Often not at 18%. Israeli VAT law sets a zero rate for many services supplied to a foreign resident, so the invoice shows VAT at 0%. The zero rate has conditions and exceptions, for example services connected to property or activity in Israel, so check your specific case with your accountant or the Israel Tax Authority before you invoice at 0%.',
  },
  {
    id: 'en-vat-faq-patur',
    question: 'Does an osek patur charge VAT?',
    answer:
      'No. An osek patur (exempt dealer) is a small business whose annual turnover stays under a ceiling set by law and updated every January. Its sales are exempt from VAT, so it does not add VAT to its prices and cannot issue a tax invoice. Once turnover passes the ceiling, the business must register as an osek murshe (licensed dealer) and charge VAT.',
  },
  {
    id: 'en-vat-faq-rounding',
    question: 'Why is my VAT one agora off from the invoice?',
    answer:
      'Because every amount is rounded to two decimal places. If you calculate VAT per line and add the lines up, the result can differ by an agora from the VAT on the total. Three items at ₪9.99: VAT per line is ₪1.80, ₪5.40 in total, but the VAT on ₪29.97 is ₪5.39. The difference comes from rounding, not from a mistake.',
  },
]

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

export default function EnVatCalculatorPage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="VAT in Israel is 18% since 1 January 2025. To add VAT, multiply the net amount by 1.18; to remove it, divide the total by 1.18. Enter an amount below to get the net amount, the VAT and the total, for one amount or several at once."
      tool={<VatCalculatorEn />}
      faq={faq}
      chips={['No sign-up', 'Runs in your browser', 'Rounded to the agora']}
      cta={{
        text: 'Still typing invoices by hand? We connect websites and CRMs to Israeli invoicing software so documents are issued automatically.',
        label: 'Custom software development',
        href: '/en/services/development',
      }}
    >
      <h2>How to calculate VAT in Israel: the formulas</h2>
      <p>
        Since 1 January 2025 the standard VAT rate in Israel is 18%. Until 31 December 2024 it was 17%; to work with
        the old rate, choose Other rate in the calculator. Three formulas cover almost every case:
      </p>
      <ul>
        <li>
          Adding VAT: total including VAT = net amount <span className={calculatorStyles.nowrap}>× 1.18</span>
        </li>
        <li>
          VAT inside a total: VAT = total <span className={calculatorStyles.nowrap}>× 18 ÷ 118</span>
        </li>
        <li>
          Removing VAT: net amount = total <span className={calculatorStyles.nowrap}>÷ 1.18</span>
        </li>
      </ul>
      <h3>Example: adding VAT to a ₪2,500 quote</h3>
      <ul>
        <li>VAT: 2,500 × 0.18 = ₪450</li>
        <li>Total including VAT: 2,500 × 1.18 = ₪2,950</li>
      </ul>
      <h3>Example: extracting VAT from a ₪1,000 payment</h3>
      <ul>
        <li>Net amount: 1,000 ÷ 1.18 = ₪847.46</li>
        <li>VAT: 1,000 × 18 ÷ 118 = ₪152.54</li>
        <li>Check: 847.46 + 152.54 = ₪1,000</li>
      </ul>
      <p>
        A common mistake is to take 18% off the total. ₪1,000 minus 18% is ₪820, but 820 × 1.18 = ₪967.60, not
        ₪1,000. VAT is charged on the net amount, so to reverse it you divide by 1.18.
      </p>

      <h2>Services to clients abroad: the 0% rate</h2>
      <p>
        If you are a freelancer or company registered for VAT in Israel and you invoice a client outside Israel, you
        usually do not charge 18%. Section 30 of the Value Added Tax Law, 1975 sets a zero rate for several kinds of
        transactions, including the export of goods and many services supplied to a foreign resident. A zero-rated
        invoice still goes through your VAT reporting; it simply shows VAT at 0%.
      </p>
      <p>
        The zero rate for services is not automatic. The law and its regulations exclude some services, for example
        services connected to an asset in Israel, and the client&apos;s status and where the service is used both
        matter. The rules are detailed and have exceptions, so treat this as a starting point: confirm your case with
        your accountant or with the Israel Tax Authority before you issue a 0% invoice. In the calculator, 0% gives you
        the same figures as a zero-rated invoice.
      </p>
      <p>
        The reverse applies when you work for Israeli clients: a VAT-registered business invoicing an Israeli client
        charges 18%, whether the client is a company or a private person.
      </p>

      <h2>Osek patur and osek murshe: who charges VAT</h2>
      <p>
        Israel has two main VAT statuses for self-employed people and small businesses. An osek murshe (licensed
        dealer) adds VAT to its prices, issues tax invoices and deducts the VAT it paid on business expenses. An osek
        patur (exempt dealer) does not charge VAT at all: under section 31 of the VAT Law its sales are exempt, and
        under section 47 only a licensed dealer may issue a tax invoice.
      </p>
      <p>
        You can be an osek patur only while your annual turnover stays under a ceiling set in the law and updated
        every 1 January in line with the consumer price index, and some professions must register as osek murshe
        whatever their turnover. Two exceptions apply even to an exempt dealer: selling real estate, and selling
        equipment on which input VAT was deducted, are subject to VAT. Many olim and freelancers start as osek patur;
        if you do, the calculator is still useful for working out what a supplier&apos;s net quote will cost you once
        VAT is added.
      </p>

      <h2 id="eilat" className={calculatorStyles.anchor}>
        VAT in Eilat: what is exempt
      </h2>
      <p>
        Eilat is a free trade zone. Under the Eilat Free Trade Zone (Tax Exemptions and Reductions) Law, 1985, some
        transactions there are VAT-exempt, and the exemption depends on who sells, not only on where:
      </p>
      <ul>
        <li>
          A sale of goods located in Eilat, by a business resident in Eilat, for consumption or use in Eilat, is
          exempt (section 5(c)).
        </li>
        <li>A service that an Eilat-resident business provides in Eilat is exempt (section 5(e)).</li>
        <li>
          A business that is not resident in Eilat and sells goods to an Eilat-resident business for its business in
          Eilat charges VAT at 0% (section 5(b)).
        </li>
      </ul>
      <p>
        The exemption does not cover the goods listed in the law&apos;s second schedule, including private cars,
        motorcycles, cigarettes and tobacco products, and jewellery or watches worth more than $200. A business that
        is not resident in Eilat charges normal VAT on work done in Eilat, apart from the zero-rate cases set in the
        law. Choose 0% only when the transaction itself is exempt, and if in doubt, ask your accountant.
      </p>

      <h2>Rounding and invoices</h2>
      <p>
        VAT is calculated to the agora, two decimal places. The calculator rounds half an agora and above up. With
        several lines you can calculate VAT per line and add it up, or calculate it once on the total, and the two
        results can differ by an agora. The calculator&apos;s total is calculated on the sum of the lines and shows a
        note when the two differ. When removing VAT, it first rounds the net amount and then subtracts it from the
        total, so the two parts always add up to exactly what was paid.
      </p>
      <p>
        One more invoicing rule: from June 2026, a business client can deduct the VAT on a tax invoice whose net amount
        exceeds ₪5,000 only if the invoice carries an allocation number from the Israel Tax Authority (section 38(a1)
        of the VAT Law). Invoicing software connected to your CRM can request the number without manual typing.
      </p>

      <h2>Sources</h2>
      <ul>
        <li>
          <a href="https://www.gov.il/en/departments/israel_tax_authority/govil-landing-page" rel="noopener" target="_blank">
            Israel Tax Authority
          </a>
          : current VAT rate, dealer registration and zero-rate guidance
        </li>
        <li>Value Added Tax Law, 1975: sections 30, 31, 38 and 47</li>
        <li>Eilat Free Trade Zone (Tax Exemptions and Reductions) Law, 1985: section 5 and the second schedule</li>
      </ul>
    </EnToolLayout>
  )
}
