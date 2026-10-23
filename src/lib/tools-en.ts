import type { ToolCategory, ToolIconName } from './tools'

export type EnToolEntry = {
  slug: string
  title: string
  description: string
  category: ToolCategory
  icon: ToolIconName
  reviewed?: string
}

export const EN_TOOLS_HUB_PATH = '/en/tools'

export const EN_TOOLS_HUB_TITLE = 'Free tools for businesses in Israel'

export const EN_TOOLS_REVIEWED = '2026-10-23'

export const enTools: EnToolEntry[] = [
  {
    slug: 'vat-calculator',
    title: 'Israel VAT calculator',
    description:
      'Add 18% Israeli VAT to a net amount or extract it from a gross total, for one amount or several, with an Eilat 0% option.',
    category: 'money',
    icon: 'receipt',
  },
  {
    slug: 'minimum-wage-2026',
    title: 'Israel minimum wage 2026',
    description:
      'The Israeli minimum wage from 1 April 2026, monthly, hourly and daily, for adults, youth and apprentices, with a check of whether your pay meets it.',
    category: 'work',
    icon: 'calculator',
  },
  {
    slug: 'self-employed-tax-calculator',
    title: 'Israel self-employed tax calculator 2026',
    description:
      'Estimate income tax, Bituach Leumi and health insurance for a self-employed person in Israel at 2026 rates, with net income and estimated advances.',
    category: 'money',
    icon: 'landmark',
  },
  {
    slug: 'exchange-rate-invoice',
    title: 'Bank of Israel representative rate for invoices',
    description:
      'The Bank of Israel representative exchange rate by date for 14 currencies, converted to shekels with or without VAT, with a ready invoice line.',
    category: 'money',
    icon: 'landmark',
  },
  {
    slug: 'iban-calculator',
    title: 'Israeli IBAN calculator',
    description:
      'Calculate an Israeli IBAN from bank, branch and account number with the Bank of Israel formula, or validate an existing IBAN.',
    category: 'money',
    icon: 'landmark',
  },
  {
    slug: 'vacation-days-calculator',
    title: 'Israel vacation days calculator',
    description:
      'Annual leave days by seniority under the Israeli Annual Leave Law and the extension order, for a 5-day or 6-day week, prorated for a partial year.',
    category: 'work',
    icon: 'calendarRange',
  },
  {
    slug: 'hebrew-date-converter',
    title: 'Hebrew date converter',
    description:
      'Convert a Hebrew date to the Gregorian calendar and back, including after sunset and Adar I and II, with Hebrew age and bar and bat mitzvah dates.',
    category: 'dates',
    icon: 'calendarRange',
  },
  {
    slug: 'hebrew-name-to-english',
    title: 'Hebrew name to English',
    description:
      '380 Hebrew first names and surnames with their common English spellings, transliteration for other names and passport-style capitals.',
    category: 'home',
    icon: 'type',
    reviewed: '2026-10-23',
  },
  {
    slug: 'gematria-calculator',
    title: 'Gematria calculator',
    description:
      'The value of a Hebrew word, name or phrase in standard gematria, mispar gadol, katan and ordinal, Atbash and Albam, letter by letter.',
    category: 'home',
    icon: 'calculator',
    reviewed: '2026-10-23',
  },
  {
    slug: 'time-difference-israel',
    title: 'Time difference with Israel',
    description:
      'What time it is now in Israel and 62 cities, the gap in winter and summer with daylight saving time, and a meeting planner.',
    category: 'home',
    icon: 'clock',
    reviewed: '2026-10-23',
  },
  {
    slug: 'flight-time-from-israel',
    title: 'Flight time from Israel',
    description:
      'Estimated flight times from Ben Gurion to 70 destinations, direct or with a stop, with distance, time difference and a flight time estimate by distance.',
    category: 'home',
    icon: 'calendarRange',
    reviewed: '2026-10-23',
  },
  {
    slug: 'maternity-leave-calculator',
    title: 'Israel maternity leave calculator',
    description:
      'Maternity leave of 26 or 15 weeks under the Women\'s Employment Law, your return-to-work date, weeks paid by Bituach Leumi and dismissal protection.',
    category: 'work',
    icon: 'calendar',
  },
  {
    slug: 'sick-days-calculator',
    title: 'Israel sick days calculator',
    description:
      'Sick days accrued under the Sick Pay Law (1.5 a month, up to 90) and what each sick day pays, for salaried and hourly employees.',
    category: 'work',
    icon: 'calculator',
  },
  {
    slug: 'id-number-check',
    title: 'Israeli ID number check',
    description:
      'Validate a teudat zehut number by its check digit, calculate a check digit, check a company or VAT dealer number, with an Excel formula.',
    category: 'money',
    icon: 'shield',
  },
  {
    slug: 'israeli-phone-format',
    title: 'Israel +972 phone number formatter',
    description:
      'Convert an Israeli number to +972 international format for WhatsApp, calls from abroad and CRMs, or clean a whole list into a CSV file.',
    category: 'marketing',
    icon: 'message',
  },
  {
    slug: 'company-lookup',
    title: 'Israeli company lookup',
    description:
      'Look up an Israeli company by number or name in the Registrar of Companies database: active, struck off, in liquidation or a violator.',
    category: 'money',
    icon: 'search',
  },
]

export const EN_TOOL_SLUGS = enTools.map((tool) => tool.slug)

export const enToolPath = (slug: string) => `${EN_TOOLS_HUB_PATH}/${slug}`

export const enToolBySlug = (slug: string) => enTools.find((tool) => tool.slug === slug)

export const enToolReviewed = (slug: string) => enToolBySlug(slug)?.reviewed ?? EN_TOOLS_REVIEWED

export const hasEnTool = (hePath: string) => {
  const match = /^\/tools\/([^/]+)$/.exec(hePath)
  return Boolean(match && EN_TOOL_SLUGS.includes(match[1]))
}

export const otherEnTools = (slug: string) => {
  const current = enToolBySlug(slug)
  const rest = enTools.filter((tool) => tool.slug !== slug)
  if (!current) return rest
  return [
    ...rest.filter((tool) => tool.category === current.category),
    ...rest.filter((tool) => tool.category !== current.category),
  ]
}
