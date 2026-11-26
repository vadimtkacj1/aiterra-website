import type { ReactNode } from 'react'
import {
  HISTORY_DATASET_URL,
  LICENCE_FEE_URL,
  MODELS_DATASET_URL,
  OPEN_RECALLS_DATASET_URL,
  OWNERSHIP_FROM_YEAR,
  licenceFeeOf,
  type OpenRecall,
  type OwnershipRecord,
  type VehicleExtras,
  type VehicleHistory,
} from '@/lib/vehicle-extras'
import {
  LICENCE_FEE_DATE_EN,
  bodyEn,
  changesEn,
  countryEn,
  formatDateEn,
  gearboxEn,
  numberEn,
  originEn,
  ownershipEn,
  ownershipSummaryEn,
  recallAreaEn,
  recallTypeEn,
  type Localised,
} from '@/lib/vehicle-lookup-en'
import styles from '../../../../(he)/(site)/components/tools/CompanyLookup.module.css'
import extra from '../../../../(he)/(site)/components/tools/VehicleLookup.module.css'

export type FactEn = { label: string; value: Localised; note?: string; digits?: boolean }

const plain = (text: string): Localised => ({ text, hebrew: false })

export function ValueEn({ value }: { value: Localised }) {
  if (!value.hebrew) return <>{value.text}</>
  return (
    <span lang="he" dir="rtl">
      {value.text}
    </span>
  )
}

export function FactsEn({ facts }: { facts: FactEn[] }) {
  return (
    <dl className={styles.facts}>
      {facts
        .filter((fact) => fact.value.text)
        .map((fact) => (
          <div key={fact.label} className={styles.fact}>
            <dt>{fact.label}</dt>
            <dd>
              {fact.digits ? <span className={styles.digits}>{fact.value.text}</span> : <ValueEn value={fact.value} />}
              {fact.note ? <span className={styles.factNote}>{fact.note}</span> : null}
            </dd>
          </div>
        ))}
    </dl>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className={`${styles.card} ${extra.extraSection}`} aria-labelledby={id}>
      <h3 id={id} className={extra.extraTitle}>
        {title}
      </h3>
      {children}
    </section>
  )
}

function HistorySection({ history }: { history: VehicleHistory }) {
  const changes = changesEn(history)
  return (
    <Section id="vehicle-history-title" title="History and origin">
      <FactsEn
        facts={[
          {
            label: 'Mileage at the last annual test',
            value: plain(history.mileage ? `${numberEn(history.mileage)} km` : ''),
            note: 'As recorded by the test centre at the last annual test.',
          },
          { label: 'Origin', value: originEn(history.origin) },
          { label: 'First registration', value: plain(history.firstRegistration ? formatDateEn(history.firstRegistration) : '') },
          { label: 'Recorded changes', value: plain(changes.length ? changes.join(', ') : 'No changes recorded') },
        ]}
      />
      <p className={styles.source}>
        Source:{' '}
        <a href={HISTORY_DATASET_URL} target="_blank" rel="noopener">
          Private vehicle history
        </a>
        , Ministry of Transport (Hebrew).
      </p>
    </Section>
  )
}

function OwnershipSection({ records }: { records: OwnershipRecord[] }) {
  const summary = ownershipSummaryEn(records)
  const latest = records[records.length - 1]
  return (
    <Section id="vehicle-ownership-title" title="Ownership history">
      <FactsEn
        facts={[
          {
            label: `Ownership records since ${OWNERSHIP_FROM_YEAR}`,
            value: plain(String(records.length)),
            note: 'Every transfer is recorded separately, including a transfer between two dealers, so the number can be higher than the actual number of owners.',
          },
          ...summary.map((item) => ({
            label: item.label.text,
            value: plain(`${item.count} ${item.count === 1 ? 'record' : 'records'}`),
          })),
          { label: 'Latest ownership', value: plain(`${ownershipEn(latest.type).text} since ${latest.month}`) },
        ]}
      />
      <ol className={extra.ownershipList}>
        {records.map((record, index) => (
          <li key={`${record.month}-${record.type}-${index}`}>
            <span className={extra.ownershipMonth}>{record.month}</span> <ValueEn value={ownershipEn(record.type)} />
          </li>
        ))}
      </ol>
      <p className={styles.source}>
        Source:{' '}
        <a href={HISTORY_DATASET_URL} target="_blank" rel="noopener">
          Private vehicle history
        </a>
        , Ministry of Transport (Hebrew). It covers active private vehicles and ownership records from{' '}
        {OWNERSHIP_FROM_YEAR} onwards, without owner names.
      </p>
    </Section>
  )
}

function RecallItem({ recall }: { recall: OpenRecall }) {
  const href = recall.website ? (recall.website.startsWith('http') ? recall.website : `https://${recall.website}`) : ''
  return (
    <li className={extra.recall}>
      <p className={extra.recallType}>
        <ValueEn value={recallTypeEn(recall.type)} />
        {recall.area ? (
          <>
            {' · '}
            <ValueEn value={recallAreaEn(recall.area)} />
          </>
        ) : null}
      </p>
      {recall.description ? (
        <p lang="he" dir="rtl">
          {recall.description}
        </p>
      ) : null}
      <p className={extra.recallMeta}>
        {recall.opened ? `Opened on ${formatDateEn(recall.opened)}` : null}
        {recall.importer ? (
          <>
            {' · Importer: '}
            <span lang="he" dir="rtl">
              {recall.importer}
            </span>
          </>
        ) : null}
        {recall.phone ? (
          <>
            {' · '}
            <a href={`tel:${recall.phone.replace(/[^\d+]/g, '')}`}>{recall.phone}</a>
          </>
        ) : null}
        {href ? (
          <>
            {' · '}
            <a href={href} target="_blank" rel="noopener nofollow">
              Importer website
            </a>
          </>
        ) : null}
      </p>
    </li>
  )
}

function RecallsSection({ recalls }: { recalls: OpenRecall[] }) {
  return (
    <Section id="vehicle-recalls-title" title="Open recalls">
      {recalls.length ? (
        <>
          <p className={extra.recallWarning}>
            This vehicle has {recalls.length === 1 ? 'one open recall' : `${recalls.length} open recalls`}. The importer
            carries out the repair free of charge. The fault descriptions are in Hebrew, as published.
          </p>
          <ul className={extra.recalls}>
            {recalls.map((recall) => (
              <RecallItem key={recall.id} recall={recall} />
            ))}
          </ul>
        </>
      ) : (
        <p>No open recall was found for this vehicle in the Ministry of Transport database.</p>
      )}
      <p className={styles.source}>
        Source:{' '}
        <a href={OPEN_RECALLS_DATASET_URL} target="_blank" rel="noopener">
          Vehicles that have not carried out a recall
        </a>
        , Ministry of Transport (Hebrew).
      </p>
    </Section>
  )
}

function ModelSection({ extras, year }: { extras: VehicleExtras; year: number | null }) {
  const model = extras.model
  if (!model) return null
  const fee = licenceFeeOf(model, year)
  return (
    <Section id="vehicle-model-title" title="Model data and licence fee">
      <FactsEn
        facts={[
          {
            label: 'Annual licence fee',
            value: plain(fee ? `₪${numberEn(fee)}` : ''),
            note: `Ministry of Transport tariff from ${LICENCE_FEE_DATE_EN}, before discounts such as those for reservists or people with disabilities.`,
          },
          { label: 'Fee group', value: plain(model.feeGroup ? String(model.feeGroup) : '') },
          { label: 'Horsepower', value: plain(model.horsepower ? numberEn(model.horsepower) : '') },
          { label: 'Engine capacity', value: plain(model.engineCc ? `${numberEn(model.engineCc)} cc` : '') },
          { label: 'Gearbox', value: gearboxEn(model.gearbox) },
          { label: 'Body', value: bodyEn(model.body) },
          { label: 'Seats', value: plain(model.seats ? String(model.seats) : '') },
          { label: 'Doors', value: plain(model.doors ? String(model.doors) : '') },
          { label: 'Gross weight', value: plain(model.totalWeight ? `${numberEn(model.totalWeight)} kg` : '') },
          {
            label: 'Safety equipment level',
            value: plain(model.safetyLevel === null ? '' : `${model.safetyLevel} out of 8`),
            note: 'The Ministry of Transport rating of safety systems, from 0 to 8.',
          },
          { label: 'Country of manufacture', value: countryEn(model.country) },
        ]}
      />
      <p className={styles.source}>
        Source:{' '}
        <a href={MODELS_DATASET_URL} target="_blank" rel="noopener">
          Makes and models of vehicles
        </a>{' '}
        and the{' '}
        <a href={LICENCE_FEE_URL} target="_blank" rel="noopener">
          licence fee table
        </a>
        , Ministry of Transport (Hebrew).
      </p>
    </Section>
  )
}

export default function VehicleExtrasEn({
  extras,
  loading,
  year,
}: {
  extras: VehicleExtras | null
  loading: boolean
  year: number | null
}) {
  if (loading) {
    return (
      <div className={styles.loading}>
        <span className={styles.spinner} aria-hidden="true" />
        <p className={styles.loadingTitle}>Loading mileage, ownership, recalls and model data</p>
      </div>
    )
  }
  if (!extras) return null
  const nothing = !extras.history && !extras.ownership && !extras.recalls && !extras.model
  if (nothing) {
    return (
      <p className={styles.source}>
        This vehicle has no history, recall or model data in the other Ministry of Transport databases.
      </p>
    )
  }
  return (
    <div className={extra.extras}>
      {extras.history ? <HistorySection history={extras.history} /> : null}
      {extras.ownership ? <OwnershipSection records={extras.ownership} /> : null}
      {extras.recalls ? <RecallsSection recalls={extras.recalls} /> : null}
      <ModelSection extras={extras} year={year} />
    </div>
  )
}
