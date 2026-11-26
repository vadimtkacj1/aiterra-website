'use client'

import { BROKER_RESULTS_LIMIT, LICENSE_MAX_DIGITS, LICENSE_MIN_DIGITS } from '@/lib/broker-registry'
import BrokerLookupView, { type BrokerCopy } from '../../../../(he)/(site)/components/tools/BrokerLookupView'

const copy: BrokerCopy = {
  sectionLabel: 'Israeli real estate agent licence check',
  legend: 'The agent',
  fieldLabel: 'Licence number, or the name in Hebrew',
  fieldHint: 'Ask the agent for their licence number. Names in the register are in Hebrew only.',
  submit: 'Search',
  emptyError: 'Enter a licence number, or the agent\'s name in Hebrew.',
  invalidError: (problem, digits) => {
    if (problem === 'digits') {
      return `A brokerage licence number has ${LICENSE_MIN_DIGITS} to ${LICENSE_MAX_DIGITS} digits. You entered ${digits}.`
    }
    if (problem === 'latin') {
      return 'Names in the register are written in Hebrew. Enter the name in Hebrew, or search by licence number.'
    }
    return 'Enter at least 2 Hebrew letters of the name, or the licence number.'
  },
  resultTitle: 'Result',
  idle: 'Enter a licence number or a Hebrew name and press Search. You will see whether the agent appears in the list of licensed real estate agents published by the Ministry of Justice.',
  searching: 'Searching the list of licensed agents',
  slow: 'The government database is answering slowly right now. Waiting up to 15 seconds.',
  retry: 'Try again',
  failure: {
    network: 'We could not connect to the data.gov.il database. Check your internet connection and try again.',
    timeout: 'The government database did not respond within 15 seconds. This happens when it is busy. Try again in a moment.',
    blocked: 'The data.gov.il database temporarily blocked the search, probably because of many searches in a row. Wait a minute and try again.',
    server: 'The data.gov.il database is not available right now. Try again in a few minutes.',
    format: 'The database returned a response we could not read. Try again, and if it keeps happening, search the brokers register on gov.il.',
  },
  badge: 'In the list of licensed agents',
  licenseLabel: 'Licence number',
  source: (dataDate) =>
    `Source: Ministry of Justice list of licensed real estate agents on data.gov.il${dataDate ? `, file updated ${dataDate}` : ''}.`,
  compare: 'Compare the name and the licence number with what the agent gave you. The same name with a different number is a different agent.',
  registerLink: 'Official brokers register on gov.il (Hebrew)',
  choose: 'Choose an agent from the list. When several agents share a name, the licence number tells them apart.',
  listLabel: (count, more) =>
    more
      ? `More than ${BROKER_RESULTS_LIMIT} agents match, and ${BROKER_RESULTS_LIMIT} are shown. Add the first name or search by licence number.`
      : `${count} agents found`,
  showing: (name) => `Showing the details of ${name}`,
  announce: (brokers, more) => {
    if (!brokers.length) return 'No agent found in the list'
    if (brokers.length === 1) return `Agent found in the list: ${brokers[0].name}`
    return more ? `More than ${BROKER_RESULTS_LIMIT} agents found` : `${brokers.length} agents found`
  },
  notFoundName: {
    title: 'No agent with this name in the list',
    tips: [
      'Try the family name only.',
      'The list holds people, not agencies. Search for the agent\'s own name, not the office or franchise name.',
      'Ask the agent for the licence number and search by it.',
    ],
  },
  notFoundLicense: {
    title: 'No agent in the list with licence number',
    tips: ['Check the digits against the agent\'s licence certificate.'],
    registerTip: {
      before: 'The open list is updated from time to time, so also check the ',
      link: 'brokers register on gov.il',
      after: ' before concluding there is no licence.',
    },
  },
  privacy:
    'The search goes straight from your browser to the Ministry of Justice open database on data.gov.il. We do not store what you search for.',
}

export default function BrokerLookupEn() {
  return <BrokerLookupView copy={copy} />
}
