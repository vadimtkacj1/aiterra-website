import Link from 'next/link'
import EnToolLayout, { enToolMetadata, type EnToolFaqEntry } from '../_components/EnToolLayout'
import VehicleLookupEn from '../_components/VehicleLookupEn'
import {
  INACTIVE_DATASET_URL,
  INACTIVE_NO_MODEL_DATASET_URL,
  MOTORCYCLES_DATASET_URL,
  REMOVED_DATASET_URL,
  VEHICLES_DATASET_URL,
} from '@/lib/vehicle-lookup'
import {
  HISTORY_DATASET_URL,
  LICENCE_FEE_URL,
  MODELS_DATASET_URL,
  OPEN_RECALLS_DATASET_URL,
  OWNERSHIP_FROM_YEAR,
} from '@/lib/vehicle-extras'
import { LICENCE_FEE_DATE_EN } from '@/lib/vehicle-lookup-en'
import styles from '../../../../(he)/(site)/tools/vehicle-lookup/page.module.css'

const SLUG = 'vehicle-lookup'
const META_TITLE = 'Israel Car Check by Number Plate: Test, Mileage, Recalls'
const DESCRIPTION =
  'Free Israeli vehicle check by licence plate number: make, model, year, annual test expiry, mileage, leasing or rental history, open recalls and licence fee, from Ministry of Transport data.'

const DATA_DATE = '25 November 2026'
const REVIEWED_DATE = '26 November 2026'

const fieldRows: { field: string; meaning: string }[] = [
  {
    field: 'Manufacturer and country',
    meaning: 'The maker as registered with the Ministry of Transport, with the country of manufacture, for example Toyota, made in the UK.',
  },
  {
    field: 'Commercial name and model code',
    meaning: "The name the vehicle is sold under, and the manufacturer's model code.",
  },
  {
    field: 'Year of manufacture and first on the road',
    meaning: 'The model year, and the month the vehicle first went on the road in Israel, which can be later than the year of manufacture.',
  },
  {
    field: 'Colour and fuel',
    meaning: 'The registered colour, and the fuel: petrol, diesel, electric, hybrid and others.',
  },
  {
    field: 'Ownership',
    meaning: "The registered ownership type, for example private, company, rental or leasing. Not the owner's name.",
  },
  {
    field: 'Last annual test and licence expiry',
    meaning: 'The date of the last annual test, and the date the vehicle licence expires. The tool counts the days left.',
  },
  {
    field: 'Air pollution group',
    meaning: 'From 1 to 15: the lower the number, the less the vehicle pollutes.',
  },
  {
    field: 'Chassis number and tyres',
    meaning: 'The chassis number (VIN) and the front and rear tyre sizes.',
  },
  {
    field: 'Mileage at the last annual test',
    meaning: 'What the test centre read from the odometer at the last annual test. Private vehicles only.',
  },
  {
    field: 'Origin',
    meaning: 'Whether the vehicle came from leasing, from rental or from a personal import of a used vehicle, or was private from the start.',
  },
  {
    field: 'Recorded changes',
    meaning: 'A structural change, an LPG conversion, a colour change or a tyre size change, if registered with the Ministry of Transport.',
  },
  {
    field: 'Open recalls',
    meaning: "Importer recalls the vehicle has not yet had done, with the fault description in Hebrew and the importer's phone number. The repair is free.",
  },
  {
    field: 'Annual licence fee',
    meaning: `By the model's fee group and the year of manufacture, at the Ministry of Transport tariff from ${LICENCE_FEE_DATE_EN}, before discounts.`,
  },
  {
    field: 'Model data',
    meaning: 'Horsepower, engine capacity, gearbox, body, seats, gross weight and a safety equipment level from 0 to 8.',
  },
]

const datasetRows: { kind: string; scope: string; href: string }[] = [
  {
    kind: 'Active private or commercial vehicle',
    scope: 'About 4.2 million vehicles: private cars from model year 1996 onwards, and commercial vehicles up to 3,500 kg from 1998 onwards',
    href: VEHICLES_DATASET_URL,
  },
  {
    kind: 'Motorcycle or two-wheeler',
    scope: 'About 194,000 active two-wheeled vehicles',
    href: MOTORCYCLES_DATASET_URL,
  },
  {
    kind: 'Inactive vehicle',
    scope: 'About 2.05 million vehicles with no valid licence that were not stolen or permanently cancelled, in two files: with and without a model code',
    href: INACTIVE_DATASET_URL,
  },
  {
    kind: 'Vehicle taken off the road',
    scope: 'Permanently cancelled vehicles: more than 1.2 million from 2010 onwards, and further files for 2000 to 2016',
    href: REMOVED_DATASET_URL,
  },
]

const sources: { href: string; label: string; note: string }[] = [
  {
    href: VEHICLES_DATASET_URL,
    label: 'data.gov.il: Licence numbers of private and commercial vehicles, Ministry of Transport and Road Safety (Hebrew)',
    note: `the file the tool searches first. It was last updated on ${DATA_DATE} and held 4,204,611 records`,
  },
  {
    href: MOTORCYCLES_DATASET_URL,
    label: 'data.gov.il: Licence numbers of two-wheeled vehicles (Hebrew)',
    note: 'active motorcycles and two-wheelers, without a test date. 194,046 records',
  },
  {
    href: INACTIVE_DATASET_URL,
    label: 'data.gov.il: Licence numbers of inactive vehicles with a model code (Hebrew)',
    note: 'according to the dataset description, vehicles with no valid licence going back 13 months, not stolen and not permanently cancelled, updated every day. 612,493 records',
  },
  {
    href: INACTIVE_NO_MODEL_DATASET_URL,
    label: 'data.gov.il: Licence numbers of inactive vehicles without a model code (Hebrew)',
    note: 'the same principle, for vehicles that have no model code. 1,441,777 records',
  },
  {
    href: REMOVED_DATASET_URL,
    label: 'data.gov.il: Vehicles taken off the road with permanent cancellation status (Hebrew)',
    note: 'vehicles taken off the road from 2010 onwards, with the cancellation date. 1,237,256 records. The files for 2000 to 2016 are in the same dataset',
  },
  {
    href: HISTORY_DATASET_URL,
    label: 'data.gov.il: Private vehicle history (Hebrew)',
    note: `mileage at the last test, origin and recorded changes for 2,516,178 vehicles, and ownership records from ${OWNERSHIP_FROM_YEAR} onwards`,
  },
  {
    href: OPEN_RECALLS_DATASET_URL,
    label: 'data.gov.il: Vehicles that have not carried out a recall (Hebrew)',
    note: "open recalls by plate number, together with the manufacturers' notices about each recall",
  },
  {
    href: MODELS_DATASET_URL,
    label: 'data.gov.il: Makes and models of private and commercial vehicles (Hebrew)',
    note: 'the model data and the fee group',
  },
  {
    href: LICENCE_FEE_URL,
    label: 'gov.il: Driving and vehicle licence fees, Ministry of Transport (Hebrew)',
    note: `the fee table by group and year of manufacture, in force from ${LICENCE_FEE_DATE_EN}`,
  },
]

const faq: EnToolFaqEntry[] = [
  {
    id: 'en-vehicle-faq-how',
    question: 'How do I check a car in Israel by its number plate?',
    answer:
      'Enter the licence plate number, 7 or 8 digits with or without dashes, in the tool at the top of the page and press Search. The tool looks the number up in the open files of the Israeli Ministry of Transport on data.gov.il and shows the make, model, year, colour, fuel, ownership type and the date the vehicle licence expires. For an active private car it also loads the mileage recorded at the last annual test, ownership records, open recalls and the annual licence fee. It is free and needs no sign-up.',
  },
  {
    id: 'en-vehicle-faq-test',
    question: 'How do I check when the annual test (test) of an Israeli car expires?',
    answer:
      'Search for the plate number and look at the status at the top of the result. In Israel the vehicle licence is renewed once the car passes its annual roadworthiness test, known simply as the test, so the licence expiry date is the test expiry date. The tool shows that date, the date of the last test and how many days are left. If 30 days or fewer remain, or the licence has already expired, the result is marked in a different colour. A test passed this morning may only appear the next day.',
  },
  {
    id: 'en-vehicle-faq-mileage',
    question: 'Can I see the mileage of an Israeli car, and whether it was a leasing or rental car?',
    answer:
      'For a private car, yes. The Ministry of Transport publishes the mileage that the test centre recorded at the last annual test, and the origin of the vehicle: leasing, rental or a personal import of a used vehicle. It is the mileage on the day of the test, not today, so compare it with the odometer and with the test date. A large gap in the seller\'s favour is a reason to have the car inspected.',
  },
  {
    id: 'en-vehicle-faq-hands',
    question: 'How do I check how many owners (yad) an Israeli car has had?',
    answer: `In Israel the number of previous owners is called yad, hand: a yad rishona car has had one owner. For an active private car the tool shows the ownership records the Ministry of Transport publishes from ${OWNERSHIP_FROM_YEAR}: the month of each transfer and the type of owner, such as private, car dealer, leasing, rental or company. Every transfer is recorded separately, including one dealer to another, so the number of records can be higher than the number of hands on the vehicle licence. Ownership before ${OWNERSHIP_FROM_YEAR} and owner names are not in the file.`,
  },
  {
    id: 'en-vehicle-faq-recall',
    question: 'How do I check whether an Israeli car has an open recall?',
    answer:
      'Search for the plate number and wait for the Open recalls section to load under the result. The tool checks the Ministry of Transport database of vehicles that have not carried out a recall, and for each open recall shows the type of fault, when it was opened and the phone number and website of the importer. The fault description appears in Hebrew, as the ministry publishes it. The importer does the recall repair free of charge.',
  },
  {
    id: 'en-vehicle-faq-owner',
    question: 'Can I find out who owns an Israeli car from its plate number?',
    answer:
      'No. The open files of the Ministry of Transport do not include the owner\'s name, ID number, address or phone number, only the ownership type: private, company, rental, leasing or dealer. The tool does not try to obtain such details, and the number you type goes straight from your browser to the government database and is not stored by us.',
  },
  {
    id: 'en-vehicle-faq-fee',
    question: 'How much is the annual vehicle licence fee in Israel?',
    answer: `The tool finds the fee group of the model, from 1 to 7, and works out the annual fee by year of manufacture from the Ministry of Transport table in force from ${LICENCE_FEE_DATE_EN}. For example, in group 1 the fee is ₪1,266 for a car from 2024 to 2026 and ₪849 for a car from 2016 or earlier, and in group 7 it is ₪5,364 and ₪1,840. That is the amount before discounts, such as those for reservists or people with disabilities, and only for a private or commercial vehicle up to 3,500 kg.`,
  },
  {
    id: 'en-vehicle-faq-english',
    question: 'Is the vehicle data available in English?',
    answer:
      'The Ministry of Transport publishes the files in Hebrew. This page translates the fixed values into English: manufacturer and country, colour, fuel, ownership type, origin, recall type and model data. Model names and trim levels are already recorded in Latin letters. Free-text fields, mainly recall fault descriptions and importer names, and a few rare manufacturer names are shown in Hebrew as published.',
  },
  {
    id: 'en-vehicle-faq-missing',
    question: 'Why was the vehicle I searched for not found?',
    answer:
      'There are a few common reasons. One wrong digit. A vehicle registered in the last few days, because the files are updated once a day. A very old private car, because the active file covers private cars from model year 1996 and light commercial vehicles from 1998. A heavy vehicle over 3,500 kg. A security, police or diplomatic vehicle. Or a vehicle taken off the road before 2000. The tool checks the active file first, then motorcycles, inactive vehicles and vehicles taken off the road.',
  },
  {
    id: 'en-vehicle-faq-inactive',
    question: 'What is an inactive vehicle, and what is a vehicle taken off the road?',
    answer:
      'An inactive vehicle has no valid licence, and is neither stolen nor permanently cancelled. It can return to the road after an annual test and a licence renewal. A vehicle taken off the road with permanent cancellation has been removed from the vehicle register, so its licence cannot be renewed. The date in the result is the cancellation date. If you are offered such a vehicle, find out why it was taken off the road before you buy.',
  },
]

export const metadata = enToolMetadata({ slug: SLUG, metaTitle: META_TITLE, description: DESCRIPTION })

export default function EnVehicleLookupPage() {
  return (
    <EnToolLayout
      slug={SLUG}
      metaTitle={META_TITLE}
      description={DESCRIPTION}
      lede="To check a car in Israel, enter its licence plate number: the tool searches about 4.2 million private and commercial vehicles on the road, plus two-wheelers and vehicles taken off the road. You see the make, model, year and annual test expiry, and also the mileage at the last test, whether the car was leased or rented, open recalls and the annual licence fee. Everything comes from the open files of the Ministry of Transport, with no owner name and no sign-up."
      chips={['Annual test expiry', 'Mileage and leasing history', 'Open recalls', 'Licence fee', 'No owner name, no sign-up']}
      tool={<VehicleLookupEn />}
      faq={faq}
      cta={{
        text: 'We connect government databases and APIs to automated processes: test expiry checks for a vehicle fleet, alerts before expiry and CRM updates.',
        label: 'Business automation',
        href: '/en/services/automation',
      }}
    >
      <h2 id="how" className={styles.anchor}>
        How to check an Israeli car by number plate
      </h2>
      <ol>
        <li>Enter the plate number as it appears on the plate or on the vehicle licence. Dashes and spaces do not matter.</li>
        <li>
          Press Search. The tool checks the file of active vehicles first, and if the vehicle is not there, also
          motorcycles, inactive vehicles and vehicles taken off the road.
        </li>
        <li>
          The result shows the status, the technical details and the annual test date. You can copy the details with one
          click.
        </li>
        <li>
          Compare the details with the car in front of you: make, colour and year. A difference in colour or model is a
          reason to ask questions before you buy.
        </li>
      </ol>

      <h2 id="fields" className={styles.anchor}>
        What the result shows
      </h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>The fields the tool shows, when they exist in the database</caption>
          <thead>
            <tr>
              <th scope="col">Field</th>
              <th scope="col">What it means</th>
            </tr>
          </thead>
          <tbody>
            {fieldRows.map((row) => (
              <tr key={row.field}>
                <th scope="row">{row.field}</th>
                <td>{row.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Some fields are missing at times, mainly for old vehicles and motorcycles, and the tool shows only what exists.
        The motorcycle file has no test date, and the file of vehicles taken off the road shows the cancellation date
        instead of the licence expiry.
      </p>

      <h2 id="terms" className={styles.anchor}>
        Israeli car terms you will meet
      </h2>
      <ul>
        <li>
          <strong>Test.</strong> The annual roadworthiness test. Passing it renews the vehicle licence (rishayon rechev),
          so &quot;test until&quot; in a car ad means the licence expiry date.
        </li>
        <li>
          <strong>Yad.</strong> Hand, the number of owners so far. Yad rishona is a first-hand car, and yad shniya a
          second-hand one.
        </li>
        <li>
          <strong>Leasing or rental origin.</strong> A car first registered to a leasing or rental company. The tool
          shows this as the origin, even when the car is privately owned today.
        </li>
        <li>
          <strong>Agra.</strong> The annual licence fee, set by the model&apos;s fee group and the year of manufacture.
        </li>
      </ul>

      <h2 id="datasets" className={styles.anchor}>
        Where the data comes from and which vehicles are covered
      </h2>
      <p>
        The tool searches the open files that the Ministry of Transport and Road Safety publishes on data.gov.il, the
        Israeli government open data portal. The data is fetched from your browser at the moment of the search, so it is
        as current as the file itself:
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>The files the tool checks, in order</caption>
          <thead>
            <tr>
              <th scope="col">Type</th>
              <th scope="col">What the file holds</th>
            </tr>
          </thead>
          <tbody>
            {datasetRows.map((row) => (
              <tr key={row.kind}>
                <th scope="row">
                  <a href={row.href} rel="noopener" target="_blank">
                    {row.kind}
                  </a>
                </th>
                <td>{row.scope}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        The counts are rounded and based on the number of records in each file on {REVIEWED_DATE}. An active heavy
        vehicle over 3,500 kg and security, police and diplomatic vehicles are not in the files the tool checks.
      </p>

      <h2 id="privacy" className={styles.anchor}>
        Privacy: what is not shown and what happens to the number you type
      </h2>
      <ul>
        <li>
          The files do not include the owner&apos;s name, ID number, address or phone number, only an ownership type
          such as private, company or rental.
        </li>
        <li>
          The search goes from your browser straight to data.gov.il. The Aiterra server does not see the plate number
          and does not store it.
        </li>
        <li>The chassis number and tyre sizes are technical data of the vehicle, and part of the public file.</li>
        <li>The tool is meant for checking a vehicle you are buying, selling or managing. Do not use it to trace a person.</li>
      </ul>

      <h2 id="used" className={styles.anchor}>
        How to use the check before buying a used car in Israel
      </h2>
      <ul>
        <li>
          <strong>Match the details to the seller.</strong> The make, year and colour in the file should match the car
          and the licence you are shown.
        </li>
        <li>
          <strong>Check the status.</strong> A vehicle that is inactive or was taken off the road is a sign to find out
          what happened to it and what state it is in now.
        </li>
        <li>
          <strong>Look at the ownership.</strong> A car registered as rental or leasing has usually seen intensive use.
        </li>
        <li>
          <strong>Compare the mileage.</strong> The odometer today should be higher than the mileage recorded at the
          last test, at a pace that fits the time since.
        </li>
        <li>
          <strong>Check open recalls.</strong> A recall that was not carried out is a known fault the importer repairs
          for free. Ask the seller to have it done before the transfer.
        </li>
        <li>
          <strong>Do not rely on the files alone.</strong> They have no accidents, liens or names of previous owners, so
          an inspection at a garage or a test centre is still needed.
        </li>
        <li>
          <strong>Check a company seller.</strong> If the seller is a dealership or another company, look it up in our{' '}
          <Link href="/en/tools/company-lookup">Israeli company lookup</Link>.
        </li>
      </ul>

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
        The field names, record counts and dataset descriptions were checked on {REVIEWED_DATE} against the data.gov.il
        API. The explanations on this page are general information, and if the tool and the vehicle licence disagree,
        the licence decides.
      </p>
    </EnToolLayout>
  )
}
