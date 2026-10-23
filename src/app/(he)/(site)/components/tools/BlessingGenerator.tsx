'use client'

import { useId, useState } from 'react'
import { buildWhatsAppLink } from '@/lib/whatsapp-link'
import {
  DEFAULT_RELATION,
  DEFAULT_TONE,
  buildBlessings,
  cleanAge,
  combineBlessings,
  countWords,
  joinNames,
  tones,
  type GenderId,
  type OccasionId,
  type RelationId,
  type ToneId,
} from '@/lib/blessings'
import { Field, TileGroup, type TileOption } from './FunTiles'
import ui from './toolUi.module.css'
import fun from './FunTool.module.css'

type CopyTarget = number | 'card' | 'all'
type Status = { target: CopyTarget; text: string } | null

type OccasionConfig = {
  label: string
  genderLegend?: string
  genders?: TileOption<GenderId>[]
  relations: TileOption<RelationId>[]
  nameLabel: (gender: GenderId) => string
  coupleNames?: boolean
  withAge?: boolean
  defaultGender: GenderId
}

const OCCASIONS: Record<OccasionId, OccasionConfig> = {
  wedding: {
    label: 'מחולל ברכות לחתונה',
    relations: [
      { id: 'friend', label: 'חבר או חברה', hint: 'של הזוג' },
      { id: 'family', label: 'משפחה', hint: 'קרובים' },
      { id: 'colleague', label: 'עמית', hint: 'לעבודה' },
    ],
    nameLabel: () => 'שמות הזוג',
    coupleNames: true,
    defaultGender: 'm',
  },
  'bar-mitzvah': {
    label: 'מחולל ברכות לבר מצווה ולבת מצווה',
    genderLegend: 'בר מצווה או בת מצווה',
    genders: [
      { id: 'm', label: 'בר מצווה' },
      { id: 'f', label: 'בת מצווה' },
    ],
    relations: [
      { id: 'friend', label: 'חבר או חברה', hint: 'של החוגג' },
      { id: 'family', label: 'משפחה', hint: 'סבים, דודים, הורים' },
      { id: 'colleague', label: 'עמית', hint: 'של ההורים' },
    ],
    nameLabel: (gender) => (gender === 'm' ? 'שם בר המצווה' : 'שם בת המצווה'),
    defaultGender: 'm',
  },
  birthday: {
    label: 'מחולל ברכות ליום הולדת',
    genderLegend: 'למי הברכה',
    genders: [
      { id: 'm', label: 'לגבר' },
      { id: 'f', label: 'לאישה' },
    ],
    relations: [
      { id: 'friend', label: 'חבר או חברה', hint: 'ידידים' },
      { id: 'family', label: 'משפחה', hint: 'קרובים' },
      { id: 'colleague', label: 'עמית', hint: 'לעבודה' },
    ],
    nameLabel: () => 'שם החוגג או החוגגת',
    withAge: true,
    defaultGender: 'f',
  },
}

const COPY_FAILED = 'ההעתקה נכשלה. סמנו את הטקסט והעתיקו ידנית.'
const PRIVACY_NOTE = 'השמות והטקסטים נשארים בדפדפן שלכם ולא נשלחים לשום מקום.'
const AGE_HINT = 'אפשר להשאיר ריק. נכתב רק אם הוזן מספר בין 1 ל-120.'
const COUPLE_HINT = 'כתבו את שני השמות כדי שיופיעו בברכה, או השאירו ריק.'

export default function BlessingGenerator({ occasion }: { occasion: OccasionId }) {
  const config = OCCASIONS[occasion]
  const genderName = useId()
  const relationName = useId()
  const toneName = useId()
  const nameId = useId()
  const brideId = useId()
  const groomId = useId()
  const coupleHintId = useId()
  const ageId = useId()
  const ageHintId = useId()
  const senderId = useId()

  const [gender, setGender] = useState<GenderId>(config.defaultGender)
  const [relation, setRelation] = useState<RelationId>(DEFAULT_RELATION)
  const [tone, setTone] = useState<ToneId>(DEFAULT_TONE)
  const [name, setName] = useState('')
  const [bride, setBride] = useState('')
  const [groom, setGroom] = useState('')
  const [age, setAge] = useState('')
  const [sender, setSender] = useState('')
  const [round, setRound] = useState(0)
  const [status, setStatus] = useState<Status>(null)

  const addressedName = config.coupleNames ? joinNames(bride, groom) : name
  const { blessings, card } = buildBlessings({
    occasion,
    tone,
    relation,
    gender,
    name: addressedName,
    age: config.withAge ? cleanAge(age) : '',
    sender,
    round,
  })

  const change =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value)
      setStatus(null)
    }

  const track = (action: string) => window.gtag?.('event', 'blessing_copy', { occasion, tone, relation, action })

  const copy = async (target: CopyTarget) => {
    const text =
      target === 'all' ? combineBlessings(blessings, card) : target === 'card' ? card : blessings[target]
    try {
      await navigator.clipboard.writeText(text)
      setStatus({ target, text: target === 'all' ? 'כל הברכות הועתקו' : 'הברכה הועתקה' })
      track(target === 'all' ? 'copy_all' : 'copy')
    } catch {
      setStatus({ target, text: COPY_FAILED })
    }
  }

  const statusFor = (target: CopyTarget) => (status?.target === target ? status.text : '')

  const shareLink = (text: string) => (
    <a
      href={buildWhatsAppLink('', text)}
      target="_blank"
      rel="noopener noreferrer"
      className={`${ui.secondary} ${fun.linkButton}`}
      onClick={() => track('whatsapp')}
    >
      שליחה בוואטסאפ
      <span className={fun.srOnly}> (נפתח בחלון חדש)</span>
    </a>
  )

  return (
    <section className={ui.tool} aria-label={config.label}>
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          {config.genders ? (
            <TileGroup
              legend={config.genderLegend ?? ''}
              name={genderName}
              options={config.genders}
              value={gender}
              onChange={change(setGender)}
              columns="two"
            />
          ) : null}

          <fieldset className={ui.group}>
            <legend className={ui.legend}>מי אתם ומה הסגנון</legend>
            <TileGroup
              legend="הקשר שלכם"
              name={relationName}
              options={config.relations}
              value={relation}
              onChange={change(setRelation)}
            />
            <TileGroup legend="סגנון" name={toneName} options={tones} value={tone} onChange={change(setTone)} columns="wide" />
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>פרטים לברכה</legend>
            {config.coupleNames ? (
              <div className={fun.pair}>
                <Field id={brideId} label="שם הכלה" hintId={coupleHintId} hint={COUPLE_HINT}>
                  <input
                    id={brideId}
                    className={ui.input}
                    autoComplete="off"
                    aria-describedby={coupleHintId}
                    value={bride}
                    onChange={(event) => change(setBride)(event.target.value)}
                  />
                </Field>
                <Field id={groomId} label="שם החתן">
                  <input
                    id={groomId}
                    className={ui.input}
                    autoComplete="off"
                    aria-describedby={coupleHintId}
                    value={groom}
                    onChange={(event) => change(setGroom)(event.target.value)}
                  />
                </Field>
              </div>
            ) : (
              <Field id={nameId} label={`${config.nameLabel(gender)} (לא חובה)`}>
                <input
                  id={nameId}
                  className={ui.input}
                  autoComplete="off"
                  value={name}
                  onChange={(event) => change(setName)(event.target.value)}
                />
              </Field>
            )}
            {config.withAge ? (
              <Field id={ageId} label="גיל (לא חובה)" hintId={ageHintId} hint={AGE_HINT}>
                <input
                  id={ageId}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={120}
                  className={`${ui.input} ${ui.ltr}`}
                  aria-describedby={ageHintId}
                  value={age}
                  onChange={(event) => change(setAge)(event.target.value)}
                />
              </Field>
            ) : null}
            <Field id={senderId} label="החתימה שלכם (לא חובה)">
              <input
                id={senderId}
                className={ui.input}
                autoComplete="name"
                value={sender}
                onChange={(event) => change(setSender)(event.target.value)}
              />
            </Field>
          </fieldset>
        </form>

        <div className={ui.output}>
          <h2 className={ui.outputTitle}>שלוש ברכות מוכנות</h2>
          <div className={`${ui.actions} ${fun.flush}`}>
            <button
              type="button"
              className={ui.primary}
              onClick={() => {
                setRound((current) => current + 1)
                setStatus(null)
              }}
            >
              ברכות חדשות
            </button>
            <button type="button" className={ui.secondary} onClick={() => copy('all')}>
              העתקת הכול
            </button>
          </div>
          <p className={`${ui.status} ${fun.statusLine}`} role="status" aria-live="polite">
            {statusFor('all')}
          </p>

          <ol className={fun.list}>
            {blessings.map((text, index) => (
              <li key={`${round}-${index}`} className={fun.card}>
                <p className={fun.text}>{text}</p>
                <div className={ui.actions}>
                  <button type="button" className={ui.primary} onClick={() => copy(index)}>
                    העתקה<span className={fun.srOnly}> של ברכה {index + 1}</span>
                  </button>
                  {shareLink(text)}
                </div>
                <p className={`${ui.status} ${fun.statusLine}`} role="status" aria-live="polite">
                  {statusFor(index)}
                </p>
              </li>
            ))}
          </ol>

          <div className={`${fun.card} ${fun.gapTop}`}>
            <h3 className={fun.cardLabel}>ברכה קצרה לכרטיס ({countWords(card)} מילים)</h3>
            <p className={fun.text}>{card}</p>
            <div className={ui.actions}>
              <button type="button" className={ui.primary} onClick={() => copy('card')}>
                העתקה<span className={fun.srOnly}> של הברכה לכרטיס</span>
              </button>
              {shareLink(card)}
            </div>
            <p className={`${ui.status} ${fun.statusLine}`} role="status" aria-live="polite">
              {statusFor('card')}
            </p>
          </div>

          <p className={`${ui.note} ${fun.flush} ${fun.gapTopLarge}`}>
            {PRIVACY_NOTE}
          </p>
        </div>
      </div>
    </section>
  )
}
