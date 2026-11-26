import Link from 'next/link'
import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import BrokerLookupEn from '../_components/BrokerLookupEn'
import {
  BROKERS_COUNT,
  BROKERS_DATASET_URL,
  BROKERS_DISTINCT_NAMES,
  BROKERS_LAW_URL,
  BROKERS_ORDER_REGULATIONS_URL,
  BROKERS_REGISTER_URL,
  BROKER_RESULTS_LIMIT,
  LICENSE_MAX_DIGITS,
  LICENSE_MIN_DIGITS,
  SAME_NAME_EXAMPLE,
  SAME_NAME_EXAMPLE_COUNT,
  SAME_NAME_SEARCH_ROWS,
  SEVEN_DIGIT_LICENSES,
} from '@/lib/broker-registry'
import styles from '../../../../(he)/(site)/tools/bingo-card-generator/page.module.css'

const SLUG = 'broker-license-check'
const META_TITLE = 'Israel Real Estate Agent Licence Check by Name or Number'
const DATA_DATE = '25 November 2026'
const REVIEWED_DATE = '26 November 2026'

const count = (value: number) => value.toLocaleString('en-IL')

const DESCRIPTION = `Check whether an Israeli real estate agent holds a brokerage licence: search the Ministry of Justice list of ${count(BROKERS_COUNT)} licensed agents by licence number or Hebrew name. Free.`

const orderDetails = [
  'the names, addresses and ID numbers of the agent and the client',
  'the type of deal, for example rental or sale',
  'a description of the property',
  'the approximate price of the deal',
  'the agreed brokerage fee, as an amount or as a share of the price, and whether it includes VAT',
]

const exclusivityRows = [
  { property: 'Apartment', longest: '6 months', unset: '30 days' },
  { property: 'Other real estate', longest: '1 year', unset: '9 months' },
]

const sources: { href: string; label: string; note: string }[] = [
  {
    href: BROKERS_DATASET_URL,
    label: 'data.gov.il: Active brokers database, Ministry of Justice (Hebrew)',
    note: `the list of licensed agents the tool searches. Checked through the API on ${REVIEWED_DATE}: ${count(BROKERS_COUNT)} records, file updated on ${DATA_DATE}. The dataset page says it is updated every three months`,
  },
  {
    href: BROKERS_REGISTER_URL,
    label: 'gov.il: Register of licensed brokers, Ministry of Justice (Hebrew)',
    note: 'the official search for an agent with a valid licence',
  },
  {
    href: BROKERS_LAW_URL,
    label: 'Real Estate Brokers Law, 1996, on Hebrew Wikisource',
    note: 'sections 2, 3, 9, 12, 13, 14, 15 and 18',
  },
  {
    href: BROKERS_ORDER_REGULATIONS_URL,
    label: 'Real Estate Brokers Regulations (Details of a Written Order), 1997, on Hebrew Wikisource',
    note: 'the details a written brokerage order must include',
  },
]

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-broker-faq-how',
    question: 'How do I check whether a real estate agent in Israel is licensed?',
    answer: `Ask the agent for their brokerage licence number, enter it in the tool at the top of the page and press Search. The tool searches the list of licensed agents that the Ministry of Justice publishes on data.gov.il, which held ${count(BROKERS_COUNT)} agents in the file updated on ${DATA_DATE}. If the agent is in the list, you see the name and licence number as registered. You can also search by name, but only in Hebrew, because the list has no English names.`,
  },
  {
    id: 'en-broker-faq-english',
    question: 'Can I search for an agent by their name in English?',
    answer: `No. Names in the list are written in Hebrew only, family name first. If you do not read Hebrew, search by licence number: it has ${LICENSE_MIN_DIGITS} to ${LICENSE_MAX_DIGITS} digits and appears in the list only once. If you have the name in Hebrew, for example from a business card or a WhatsApp profile, paste it into the search field. The word order does not matter.`,
  },
  {
    id: 'en-broker-faq-required',
    question: 'Is a licence required to work as a real estate agent in Israel?',
    answer:
      'Yes. Section 2 of the Real Estate Brokers Law, 1996, says a person may not engage in real estate brokerage, or present themselves as a real estate broker, without a valid licence. Section 13 forbids employing an unlicensed person in brokerage, except in an administrative role. Under section 15, breaking section 2 or 13 carries one year of imprisonment and a fine of four times the amount set in section 61(a)(4) of the Penal Law. The law does not apply to someone who only publishes property listings and does not present themselves as a broker.',
  },
  {
    id: 'en-broker-faq-fee',
    question: 'Do I have to pay the brokerage fee if the agent has no licence?',
    answer:
      'Under section 14 of the Real Estate Brokers Law, a broker is entitled to a brokerage fee when three conditions are all met: they held a licence at the time they did the brokerage, the client signed a written order under section 9, and they were the effective cause of the parties signing a binding agreement. Someone who had no licence at that time does not meet the first condition. This is general information, not legal advice, so take a fee dispute to a lawyer.',
  },
  {
    id: 'en-broker-faq-order',
    question: 'What must an Israeli brokerage order form include?',
    answer: `Under the Real Estate Brokers Regulations (Details of a Written Order), 1997, the written order includes at least five details: ${orderDetails.join('; ')}. Under section 9 of the law, a broker is not entitled to a fee unless the client signed a written order with these details. The agent's licence number is not on that list, so ask for it and check it here.`,
  },
  {
    id: 'en-broker-faq-exclusivity',
    question: 'How long can an exclusivity agreement with an Israeli agent last?',
    answer:
      'Under section 9 of the Real Estate Brokers Law, exclusivity and its period are approved by the client signing a separate document. When a seller who is not selling in the course of business offers an apartment for sale, exclusivity may not exceed six months from the day of the order. If no period was set, exclusivity on an apartment ends 30 days after the client signed the order. For real estate that is not an apartment the cap is one year, and without a set period exclusivity ends after nine months.',
  },
  {
    id: 'en-broker-faq-missing',
    question: 'The agent is not in the list. What does that mean?',
    answer:
      'First check the digits of the licence number, or try the family name alone in Hebrew. The list holds people, not agencies, so search for the agent personally and not for the office or franchise name. If a search by licence number still returns nothing, the agent is not in the file the Ministry of Justice published. The file is updated from time to time, not daily, so before concluding there is no licence, also check the register of licensed brokers on gov.il.',
  },
]

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

export default function EnBrokerLicenseCheckPage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="To check an Israeli real estate agent (metavech), enter their brokerage licence number, or their name in Hebrew: you see whether they appear in the list of licensed agents published by the Ministry of Justice, and which licence number is registered to that name."
      chips={[`${count(BROKERS_COUNT)} licensed agents`, 'By licence number or Hebrew name', 'Ministry of Justice data', 'Free, no sign-up']}
      tool={<BrokerLookupEn />}
      faq={faq}
      cta={{
        text: 'We build websites and systems for Israeli businesses that work with English-speaking clients, in Hebrew and English.',
        label: 'Custom software development',
        href: '/en/services/development',
      }}
    >
      <h2>What this check covers</h2>
      <p>
        In Israel, a real estate agent is called a metavech, and brokerage is tivuch. Under section 3 of the Real Estate
        Brokers Law, 1996, the Registrar of Brokers at the Ministry of Justice issues the licences and keeps a register
        of licence holders. The ministry publishes an open file on data.gov.il called &quot;List of licensed
        brokers&quot;, inside the{' '}
        <a href={BROKERS_DATASET_URL} rel="noopener" target="_blank">
          Active brokers database
        </a>
        . The file updated on {DATA_DATE} holds {count(BROKERS_COUNT)} agents.
      </p>
      <p>
        The tool shows each agent&apos;s name and licence number. The file also lists the agent&apos;s town of
        residence, which we do not show. A brokerage licence number has {LICENSE_MIN_DIGITS} to {LICENSE_MAX_DIGITS}{' '}
        digits, and for {count(SEVEN_DIGIT_LICENSES)} of the agents in the file it has 7 digits.
      </p>

      <h2>How to check an agent if you do not read Hebrew</h2>
      <ol>
        <li>Ask the agent for their brokerage licence number. A licensed agent has one.</li>
        <li>Enter the number in the tool and press Search. Spaces and dashes do not matter.</li>
        <li>
          Compare the Hebrew name in the result with the agent&apos;s name. If you cannot read it, copy it and ask the
          agent, or someone you trust, to confirm it is the same person.
        </li>
        <li>
          Before you sign, open the{' '}
          <a href={BROKERS_REGISTER_URL} rel="noopener" target="_blank">
            official register of licensed brokers on gov.il
          </a>{' '}
          as well. The page is in Hebrew.
        </li>
      </ol>

      <h3>Why the name alone is not enough</h3>
      <p>
        The file has {count(BROKERS_COUNT)} licences but only {count(BROKERS_DISTINCT_NAMES)} different names. In the
        file updated on {DATA_DATE}, a search for &quot;{SAME_NAME_EXAMPLE}&quot; (Cohen David) finds{' '}
        {SAME_NAME_SEARCH_ROWS} agents, and the tool shows {BROKER_RESULTS_LIMIT} of them: {SAME_NAME_EXAMPLE_COUNT} are
        registered under exactly that name, and the rest have an additional name. Each has a different licence number,
        so the number is what identifies the agent in front of you.
      </p>

      <h2>What the law says about a brokerage licence</h2>
      <ul>
        <li>
          Section 2: a person may not engage in real estate brokerage, or present themselves as a broker, without a
          valid licence.
        </li>
        <li>Section 13: nobody may employ an unlicensed person in brokerage, except in an administrative role.</li>
        <li>
          Section 14: a broker is entitled to a fee when they held a licence at the time of the brokerage, the client
          signed a written order under section 9, and they were the effective cause of the binding agreement.
        </li>
        <li>
          Section 18: a licence holder who has not paid a fee on time may not act as a broker until they pay it with
          interest.
        </li>
        <li>
          Section 12: a broker may not draft documents of a legal nature for the deal, or represent a client in legal
          negotiations over them. The sale or rental contract is a lawyer&apos;s job.
        </li>
      </ul>

      <h2>What a brokerage order form must include</h2>
      <p>
        A broker cannot claim a fee unless the client signed a written brokerage order. Under the{' '}
        <a href={BROKERS_ORDER_REGULATIONS_URL} rel="noopener" target="_blank">
          Real Estate Brokers Regulations (Details of a Written Order), 1997
        </a>
        , the written order includes at least:
      </p>
      <ol>
        {orderDetails.map((detail) => (
          <li key={detail}>{detail}</li>
        ))}
      </ol>
      <p>
        The licence number is not one of the details the regulations require. If it is not on the form, ask the agent
        for it and check it here before you sign.
      </p>

      <h2>Exclusivity periods under section 9</h2>
      <p>
        Exclusivity and its period are approved by the client signing a separate document, and during the exclusivity
        period the agent carries out marketing actions. The maximum periods in the table apply when a seller who is not
        selling in the course of business offers the property for sale.
      </p>
      <div className={styles.tableWrap} role="region" aria-label="Exclusivity period by property type" tabIndex={0}>
        <table className={styles.table}>
          <caption>Exclusivity period under section 9 of the Real Estate Brokers Law, from the day of the order</caption>
          <thead>
            <tr>
              <th scope="col">Property</th>
              <th scope="col">Maximum period</th>
              <th scope="col">If no period was set</th>
            </tr>
          </thead>
          <tbody>
            {exclusivityRows.map((row) => (
              <tr key={row.property}>
                <th scope="row">{row.property}</th>
                <td>{row.longest}</td>
                <td>{row.unset}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Under section 9(b2), exclusivity ends after a third of the period if by then the agent has not carried out the
        marketing actions set under the law.
      </p>

      <h2>Before you sign with an agent</h2>
      <ul>
        <li>Check that the agent personally, not only the agency, is in the list.</li>
        <li>Check that the name and licence number they gave you match the record.</li>
        <li>Check that the written order has the five required details, including the fee and whether it includes VAT.</li>
        <li>Check that any exclusivity is in a separate document with a period.</li>
        <li>
          If the seller or the agency is a company, look it up in our{' '}
          <Link href="/en/tools/company-lookup">Israeli company lookup</Link>.
        </li>
      </ul>
      <p>
        The tool shows information from the public record. It does not check the quality of the agent&apos;s service,
        complaints against them or disciplinary proceedings.
      </p>

      <h2>Sources</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.href}>
            <a href={source.href} rel="noopener" target="_blank">
              {source.label}
            </a>
            : {source.note}
          </li>
        ))}
      </ul>
      <p className={styles.reviewed}>
        The data, sections and sources were checked on {REVIEWED_DATE}. The explanations on this page are general
        information, not legal advice.
      </p>
    </EnToolLayout>
  )
}
