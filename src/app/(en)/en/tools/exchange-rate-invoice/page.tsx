import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import ExchangeRateConverterEn from '../_components/ExchangeRateConverterEn'
import {
  BOI_DATES_PDF,
  BOI_RATES_PAGE,
  BOI_REPRATE_PAGE,
  convert,
  currencies,
  parseRateMicros,
} from '@/lib/exchange-rate'
import { currencyNamesEn, enForeign, enInvoiceLine, enRate, enShekels } from '@/lib/exchange-rate-en'
import { STANDARD_VAT_RATE } from '@/lib/vat-calculator'
import styles from '../../../../(he)/(site)/tools/exchange-rate-invoice/page.module.css'

const SLUG = 'exchange-rate-invoice'
const META_TITLE = 'Bank of Israel Representative Rate by Date: Convert USD and EUR to Shekels'
const DESCRIPTION =
  'The Bank of Israel representative exchange rate (shaar yatzig) by date for the dollar, euro and 12 other currencies: convert to and from shekels, with or without VAT, see the last 30 trading days and copy a ready invoice line.'

const sample = { amount: 250_000, iso: '2026-10-22', rate: '3.107', previousRate: '3.091', fridayRate: '3.089' }

const micros = (text: string) => {
  const value = parseRateMicros(text)
  if (!value) throw new Error(`Bad sample rate ${text}`)
  return value
}

const example = convert({ amount: sample.amount, direction: 'to-ils', micros: micros(sample.rate), unit: 1, withVat: true, code: 'USD' })
const morning = convert({
  amount: sample.amount,
  direction: 'to-ils',
  micros: micros(sample.previousRate),
  unit: 1,
  withVat: false,
  code: 'USD',
})

const amountText = enForeign(sample.amount, 'USD')
const rateText = enRate(example.micros)

const exampleRows: { step: string; formula: string; result: string }[] = [
  { step: 'Invoice amount before VAT', formula: '', result: amountText },
  { step: 'Representative rate of 22.10.2026', formula: '', result: `₪${rateText} per 1 USD` },
  { step: 'Amount in shekels before VAT', formula: `2,500 × ${rateText}`, result: enShekels(example.shekels.net) },
  {
    step: `VAT ${STANDARD_VAT_RATE}%`,
    formula: `${enShekels(example.shekels.net)} × ${STANDARD_VAT_RATE}%`,
    result: enShekels(example.shekels.vat),
  },
  {
    step: 'Total including VAT',
    formula: `${enShekels(example.shekels.net)} + ${enShekels(example.shekels.vat)}`,
    result: enShekels(example.shekels.gross),
  },
]

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-fx-faq-what',
    question: 'What is the Bank of Israel representative rate?',
    answer:
      'The representative rate (shaar yatzig) is the exchange rate of a foreign currency against the shekel that the Bank of Israel calculates and publishes once a day on trading days. It is based on the average of the mid rates banks quote in interbank trading, not on any specific transaction. The Bank of Israel publishes it for 14 currencies, including the dollar, euro, pound sterling, Swiss franc and Japanese yen. It has no binding legal status and is used mainly in contracts, invoices and revaluation.',
  },
  {
    id: 'en-fx-faq-when',
    question: 'When is the representative rate published?',
    answer:
      'On a regular trading day, shortly after 15:15 Israel time. On Fridays, during Chol Hamoed and on holiday eves, shortly after 12:15. The Bank of Israel notes that the time is not guaranteed. On Saturday, Sunday, Israeli public holidays and some holidays abroad there is no new rate, so the last rate published before that day applies.',
  },
  {
    id: 'en-fx-faq-weekend',
    question: 'What is the representative rate on a weekend or holiday?',
    answer: `The Bank of Israel does not publish a rate on Saturday, Sunday or Israeli public holidays, nor on days such as Yom Kippur, Rosh Hashanah eve, Purim, Tisha B’Av and holidays abroad like Christmas and 1 January. On such a day the last rate published before it applies. For example, for Saturday 17 October 2026 the dollar rate is ₪${enRate(
      micros(sample.fridayRate),
    )}, the rate of Friday 16 October.`,
  },
  {
    id: 'en-fx-faq-invoice',
    question: 'Which representative rate goes on an invoice?',
    answer:
      'The representative rate has no binding legal status, and the Bank of Israel recommends that the parties agree in advance which rate applies: that of the transaction day, the last one published before it, or that of another day. On the invoice itself, write the rate and its date, and use the same method on all invoices. An invoice issued before 15:15 can only use a rate already published, that is, the previous trading day’s.',
  },
  {
    id: 'en-fx-faq-vat',
    question: 'How do I calculate VAT on an invoice in dollars?',
    answer: `Convert the amount before VAT to shekels at the rate and add ${STANDARD_VAT_RATE}%. For example, $2,500 at ${rateText} is ${enShekels(
      example.shekels.net,
    )}, VAT is ${enShekels(example.shekels.vat)} and the total is ${enShekels(
      example.shekels.gross,
    )}. A service to a foreign resident may be zero-rated under section 30(a)(5) of the VAT Law, except in cases the law excludes, and then the invoice carries no VAT.`,
  },
]

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

export default function EnExchangeRateInvoicePage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="The representative rate (shaar yatzig) is the exchange rate of a foreign currency against the shekel that the Bank of Israel publishes once a day on trading days, shortly after 15:15. Choose a currency and date to get the rate that applied, the amount in shekels with or without VAT, and a line ready to paste into your invoice."
      tool={<ExchangeRateConverterEn />}
      faq={faq}
      chips={['All 14 Bank of Israel currencies', 'By date, weekends included', 'With or without VAT']}
      cta={{
        text: 'We connect CRMs that issue foreign-currency invoices and convert them to shekels at the Bank of Israel rate without manual typing.',
        label: 'Business automation',
        href: '/en/services/automation',
      }}
    >
      <h2>What the representative rate is and when it is published</h2>
      <p>
        The representative rate is an indicator of a currency’s market exchange rate. The Bank of Israel calculates the
        dollar rate from a sample of the mid rates banks quote in interbank trading, taken at a random moment between
        13:15 and 15:15, excluding outliers. The other currencies are calculated from the dollar rate and their rates
        against the dollar on world markets at that moment.
      </p>
      <p>
        The rate is published shortly after 15:15. On Fridays, during Chol Hamoed and on holiday eves the sample is taken
        between 10:15 and 12:15 and the rate is published shortly after 12:15. The Bank of Israel publishes a
        representative rate for 14 currencies:
      </p>
      <ul className={styles.currencyList}>
        {currencies.map((currency) => (
          <li key={currency.code}>
            <span className={styles.code}>{currency.code}</span> {currencyNamesEn[currency.code]}
            {currency.unit > 1 ? `, rate per ${currency.unit} units` : ''}
          </li>
        ))}
      </ul>
      <h3>Days without a representative rate</h3>
      <p>
        There is no rate on Saturday, Sunday or Israeli public holidays, nor on Christmas, 1 January and Easter, when
        most foreign exchange markets are closed. The Bank of Israel list for 2026 also includes Purim and Shushan Purim,
        Passover eve, Tisha B’Av, Rosh Hashanah eve, Yom Kippur and the Knesset election day on 27 October. On such a day
        the last rate published before it applies, and the calculator shows that rate and the day it is from.
      </p>

      <h2>Which rate to use on a foreign-currency invoice</h2>
      <p>
        Under section 22 of the Income Tax (Bookkeeping) Regulations, books are kept in Israeli currency, and for a
        receipt in another currency you also record the currency and the amount in it. So a business invoicing in
        dollars or euros also needs the shekel amount, and for that it needs a rate.
      </p>
      <p>
        The representative rate has no binding legal status, and the parties can agree on any rate. The Bank of Israel
        recommends deciding in advance which representative rate applies: the rate set on the transaction day, the last
        rate set before it, or the rate of another day. Write the rate and its date on the invoice and use the same
        method throughout. Which day binds you, and how to book exchange differences when payment arrives after the rate
        has moved, are questions for your accountant.
      </p>

      <h2 id="vat" className={styles.anchor}>
        VAT on a foreign-currency invoice
      </h2>
      <p>
        VAT is calculated on the shekel amount: convert the amount before VAT at the rate and add {STANDARD_VAT_RATE}%.
        That is what the tool does when you tick Add VAT, and it also shows the total in the foreign currency.
      </p>
      <p>
        Under section 30(a)(5) of the VAT Law, a service supplied to a foreign resident is zero-rated, except in cases the
        law excludes, for example when the service is in practice also given to an Israeli resident in Israel. You still
        report the transaction, but at 0% VAT, so for a client abroad leave the VAT box unticked. If it is unclear whether
        the transaction qualifies, check with your accountant.
      </p>

      <h2>Worked example: a $2,500 invoice</h2>
      <p>
        On 22 October 2026 a business invoices an Israeli client {amountText} before VAT. The dollar representative rate
        that day was ₪{rateText}. The shekel amounts:
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>A $2,500 invoice at the representative rate of 22.10.2026</caption>
          <thead>
            <tr>
              <th scope="col">Step</th>
              <th scope="col">Calculation</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            {exampleRows.map((row) => (
              <tr key={row.step}>
                <th scope="row">{row.step}</th>
                <td className={styles.formula}>{row.formula}</td>
                <td className={styles.amount}>{row.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        On the invoice: <q>{enInvoiceLine(example.micros, 1, 'USD', sample.iso)}</q>.
      </p>
      <p>
        If the same invoice is issued on the morning of 22 October, before that day’s rate is out, the known rate is the
        one of 21 October, ₪{enRate(morning.micros)}, and the amount before VAT is {enShekels(morning.shekels.net)},{' '}
        {enShekels(example.shekels.net - morning.shekels.net)} less. An invoice dated Sunday 18 October 2026 gets the
        Friday 16 October rate: ₪{enRate(micros(sample.fridayRate))}.
      </p>

      <h2>Representative rate versus your bank’s rate</h2>
      <p>
        The representative rate is based on an average of buying and selling rates and does not necessarily reflect
        actual deals. When you actually convert money, your bank uses its own customer rates: a buying rate when it buys
        foreign currency from you and a selling rate when it sells to you, sometimes with a conversion fee. So when a
        client abroad pays {amountText}, the shekels that reach your account depend on your bank’s rate on the
        conversion day, not on the invoice rate. The difference is an exchange difference, booked as your accountant
        instructs.
      </p>

      <h2>Sources</h2>
      <ul>
        <li>
          <a href={BOI_REPRATE_PAGE} rel="noopener" target="_blank">
            Bank of Israel: what the representative rate is
          </a>
          : how it is calculated, sampling and publication times, days without a rate, and its non-binding status
        </li>
        <li>
          <a href={BOI_RATES_PAGE} rel="noopener" target="_blank">
            Bank of Israel: representative exchange rates
          </a>
          : current rates for the 14 currencies
        </li>
        <li>
          <a href={BOI_DATES_PDF} rel="noopener" target="_blank">
            Bank of Israel: dates affecting Bank of Israel activity, 2026–2027
          </a>
          : the days without a representative rate besides Saturday and Sunday
        </li>
        <li>Income Tax (Bookkeeping) Regulations, 1973, section 22, and the Value Added Tax Law, 1975, section 30(a)(5)</li>
      </ul>
    </EnToolLayout>
  )
}
