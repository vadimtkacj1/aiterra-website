import { formatIsoDate } from '@/lib/vehicle-lookup'
import {
  HISTORY_DATASET_URL,
  LICENCE_FEE_DATE,
  LICENCE_FEE_URL,
  MODELS_DATASET_URL,
  OPEN_RECALLS_DATASET_URL,
  licenceFeeOf,
  originText,
  type OpenRecall,
  type VehicleExtras,
  type VehicleHistory,
} from '@/lib/vehicle-extras'
import styles from './CompanyLookup.module.css'
import extra from './VehicleLookup.module.css'

type Fact = { label: string; value: string; note?: string }

const numberText = (value: number) => value.toLocaleString('he-IL')

function Facts({ facts }: { facts: Fact[] }) {
  return (
    <dl className={styles.facts}>
      {facts
        .filter((fact) => fact.value)
        .map((fact) => (
          <div key={fact.label} className={styles.fact}>
            <dt>{fact.label}</dt>
            <dd>
              {fact.value}
              {fact.note ? <span className={styles.factNote}>{fact.note}</span> : null}
            </dd>
          </div>
        ))}
    </dl>
  )
}

const changesOf = (history: VehicleHistory) =>
  [
    history.structureChanged ? 'שינוי מבנה' : '',
    history.gasConversion ? 'הסבה לגפ״מ' : '',
    history.colorChanged ? 'שינוי צבע' : '',
    history.tiresChanged ? 'שינוי מידת צמיגים' : '',
  ].filter(Boolean)

function HistorySection({ history }: { history: VehicleHistory }) {
  const changes = changesOf(history)
  return (
    <section className={extra.extraSection} aria-labelledby="vehicle-history-title">
      <h3 id="vehicle-history-title" className={extra.extraTitle}>
        היסטוריה ומקוריות
      </h3>
      <Facts
        facts={[
          {
            label: 'קילומטראז׳ בטסט האחרון',
            value: history.mileage ? `${numberText(history.mileage)} ק״מ` : '',
            note: 'מה שנרשם במכון הרישוי בטסט השנתי האחרון.',
          },
          { label: 'מקוריות', value: originText(history.origin) },
          { label: 'רישום ראשון', value: history.firstRegistration ? formatIsoDate(history.firstRegistration) : '' },
          { label: 'שינויים שנרשמו', value: changes.length ? changes.join(', ') : 'לא נרשמו שינויים' },
        ]}
      />
      <p className={styles.source}>
        מקור: <a href={HISTORY_DATASET_URL} target="_blank" rel="noopener">היסטוריית כלי רכב פרטיים</a> של משרד התחבורה.
      </p>
    </section>
  )
}

function RecallItem({ recall }: { recall: OpenRecall }) {
  const href = recall.website ? (recall.website.startsWith('http') ? recall.website : `https://${recall.website}`) : ''
  return (
    <li className={extra.recall}>
      <p className={extra.recallType}>
        {recall.type}
        {recall.area ? ` · ${recall.area}` : ''}
      </p>
      {recall.description ? <p>{recall.description}</p> : null}
      <p className={extra.recallMeta}>
        {recall.opened ? `נפתח ב-${formatIsoDate(recall.opened)}` : null}
        {recall.importer ? ` · היבואן: ${recall.importer}` : null}
        {recall.phone ? (
          <>
            {' · '}
            <a href={`tel:${recall.phone.replace(/[^\d+]/g, '')}`} dir="ltr">
              {recall.phone}
            </a>
          </>
        ) : null}
        {href ? (
          <>
            {' · '}
            <a href={href} target="_blank" rel="noopener nofollow">
              אתר היבואן
            </a>
          </>
        ) : null}
      </p>
    </li>
  )
}

function RecallsSection({ recalls }: { recalls: OpenRecall[] }) {
  return (
    <section className={extra.extraSection} aria-labelledby="vehicle-recalls-title">
      <h3 id="vehicle-recalls-title" className={extra.extraTitle}>
        ריקולים פתוחים
      </h3>
      {recalls.length ? (
        <>
          <p className={extra.recallWarning}>
            לרכב יש {recalls.length === 1 ? 'קריאת שירות פתוחה אחת' : `${recalls.length} קריאות שירות פתוחות`}. התיקון
            נעשה אצל היבואן בלי תשלום.
          </p>
          <ul className={extra.recalls}>
            {recalls.map((recall) => (
              <RecallItem key={recall.id} recall={recall} />
            ))}
          </ul>
        </>
      ) : (
        <p>לא נמצאה קריאת שירות (ריקול) פתוחה לרכב הזה במאגר של משרד התחבורה.</p>
      )}
      <p className={styles.source}>
        מקור: <a href={OPEN_RECALLS_DATASET_URL} target="_blank" rel="noopener">כלי רכב שלא ביצעו ריקול</a> של משרד
        התחבורה.
      </p>
    </section>
  )
}

function ModelSection({ extras, year }: { extras: VehicleExtras; year: number | null }) {
  const model = extras.model
  if (!model) return null
  const fee = licenceFeeOf(model, year)
  return (
    <section className={extra.extraSection} aria-labelledby="vehicle-model-title">
      <h3 id="vehicle-model-title" className={extra.extraTitle}>
        נתוני הדגם ואגרת רישוי
      </h3>
      <Facts
        facts={[
          {
            label: 'אגרת רישוי שנתית',
            value: fee ? `${numberText(fee)} ₪` : '',
            note: `לפי תעריף משרד התחבורה מ-${LICENCE_FEE_DATE}, לפני הנחות כמו לחיילי מילואים או לנכים.`,
          },
          { label: 'קבוצת אגרה', value: model.feeGroup ? String(model.feeGroup) : '' },
          { label: 'כוח סוס', value: model.horsepower ? numberText(model.horsepower) : '' },
          { label: 'נפח מנוע', value: model.engineCc ? `${numberText(model.engineCc)} סמ״ק` : '' },
          { label: 'תיבת הילוכים', value: model.gearbox },
          { label: 'מרכב', value: model.body },
          { label: 'מקומות ישיבה', value: model.seats ? String(model.seats) : '' },
          { label: 'דלתות', value: model.doors ? String(model.doors) : '' },
          { label: 'משקל כולל', value: model.totalWeight ? `${numberText(model.totalWeight)} ק״ג` : '' },
          {
            label: 'רמת אבזור בטיחותי',
            value: model.safetyLevel === null ? '' : `${model.safetyLevel} מתוך 8`,
            note: 'דירוג מערכות הבטיחות של משרד התחבורה, מ-0 עד 8.',
          },
          { label: 'ארץ ייצור', value: model.country },
        ]}
      />
      <p className={styles.source}>
        מקור: <a href={MODELS_DATASET_URL} target="_blank" rel="noopener">תוצרים ודגמים של כלי רכב</a> ו
        <a href={LICENCE_FEE_URL} target="_blank" rel="noopener">
          טבלת אגרות הרישוי
        </a>{' '}
        של משרד התחבורה.
      </p>
    </section>
  )
}

export default function VehicleExtrasPanel({
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
        <p className={styles.loadingTitle}>טוען קילומטראז׳, ריקולים ונתוני דגם</p>
      </div>
    )
  }
  if (!extras) return null
  const nothing = !extras.history && !extras.recalls && !extras.model
  if (nothing) {
    return (
      <p className={styles.source}>
        לרכב הזה אין נתוני היסטוריה, ריקולים או דגם במאגרים הנוספים של משרד התחבורה.
      </p>
    )
  }
  return (
    <div className={extra.extras}>
      {extras.history ? <HistorySection history={extras.history} /> : null}
      {extras.recalls ? <RecallsSection recalls={extras.recalls} /> : null}
      <ModelSection extras={extras} year={year} />
    </div>
  )
}
