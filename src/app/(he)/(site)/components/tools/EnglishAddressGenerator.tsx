'use client'

import { useEffect, useId, useState } from 'react'
import { Copy } from 'lucide-react'
import {
  SETTLEMENTS_API,
  ZIP_LOOKUP_URL,
  buildAddress,
  fallbackSettlements,
  findSettlement,
  parseSettlements,
  streetTypes,
  type AddressInput,
  type Settlement,
  type SpellingStyle,
  type StreetType,
} from '@/lib/english-address'
import ui from './toolUi.module.css'
import styles from './EnglishAddressGenerator.module.css'

type Source = 'loading' | 'official' | 'fallback'

export default function EnglishAddressGenerator() {
  const [settlements, setSettlements] = useState<Settlement[]>(fallbackSettlements)
  const [source, setSource] = useState<Source>('loading')
  const [hebrewCity, setHebrewCity] = useState('')
  const [englishCity, setEnglishCity] = useState('')
  const [street, setStreet] = useState('')
  const [type, setType] = useState<StreetType>('street')
  const [number, setNumber] = useState('')
  const [entrance, setEntrance] = useState('')
  const [floor, setFloor] = useState('')
  const [apartment, setApartment] = useState('')
  const [zip, setZip] = useState('')
  const [recipient, setRecipient] = useState('')
  const [style, setStyle] = useState<SpellingStyle>('standard')
  const [zipFirst, setZipFirst] = useState(false)
  const [status, setStatus] = useState('')
  const ids = {
    city: useId(),
    englishCity: useId(),
    street: useId(),
    type: useId(),
    number: useId(),
    entrance: useId(),
    floor: useId(),
    apartment: useId(),
    zip: useId(),
    recipient: useId(),
    list: useId(),
  }

  useEffect(() => {
    const controller = new AbortController()
    fetch(SETTLEMENTS_API, { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => {
        const list = parseSettlements(data?.result?.records ?? [])
        if (list.length) {
          setSettlements(list)
          setSource('official')
        } else {
          setSource('fallback')
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setSource('fallback')
      })
    return () => controller.abort()
  }, [])

  const onCity = (value: string) => {
    setHebrewCity(value)
    const match = findSettlement(settlements, value)
    if (match) setEnglishCity(match.english)
  }

  const input: AddressInput = {
    street,
    type,
    number,
    entrance,
    apartment,
    floor,
    city: englishCity,
    zip,
    recipient,
    style,
    zipFirst,
  }
  const result = buildAddress(input)
  const text = result.lines.join('\n')
  const unmatched = hebrewCity.trim() !== '' && !findSettlement(settlements, hebrewCity)

  const copy = async () => {
    if (!text) {
      setStatus('אין כתובת להעתקה.')
      return
    }
    try {
      await navigator.clipboard.writeText(text)
      setStatus('הכתובת הועתקה.')
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את הכתובת והעתיקו ידנית.')
    }
  }

  return (
    <section className={ui.tool} aria-label="כתובת באנגלית">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>הכתובת בעברית</legend>
            <div className={ui.field}>
              <label htmlFor={ids.recipient} className={ui.label}>
                שם הנמען באנגלית (לא חובה)
              </label>
              <input
                id={ids.recipient}
                className={`${ui.input} ${ui.ltr}`}
                value={recipient}
                onChange={(event) => setRecipient(event.target.value)}
                autoComplete="off"
              />
            </div>
            <div className={ui.row}>
              <div className={ui.field}>
                <label htmlFor={ids.street} className={ui.label}>
                  שם הרחוב
                </label>
                <input
                  id={ids.street}
                  className={ui.input}
                  value={street}
                  onChange={(event) => setStreet(event.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className={ui.field}>
                <label htmlFor={ids.type} className={ui.label}>
                  סוג
                </label>
                <select
                  id={ids.type}
                  className={ui.input}
                  value={type}
                  onChange={(event) => setType(event.target.value as StreetType)}
                >
                  {streetTypes.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.hebrew}
                    </option>
                  ))}
                </select>
              </div>
              <div className={ui.field}>
                <label htmlFor={ids.number} className={ui.label}>
                  מספר בית
                </label>
                <input
                  id={ids.number}
                  className={`${ui.input} ${ui.ltr}`}
                  value={number}
                  onChange={(event) => setNumber(event.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>
            <div className={ui.row}>
              <div className={ui.field}>
                <label htmlFor={ids.entrance} className={ui.label}>
                  כניסה
                </label>
                <input
                  id={ids.entrance}
                  className={`${ui.input} ${ui.ltr}`}
                  value={entrance}
                  onChange={(event) => setEntrance(event.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className={ui.field}>
                <label htmlFor={ids.floor} className={ui.label}>
                  קומה
                </label>
                <input
                  id={ids.floor}
                  className={`${ui.input} ${ui.ltr}`}
                  value={floor}
                  onChange={(event) => setFloor(event.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className={ui.field}>
                <label htmlFor={ids.apartment} className={ui.label}>
                  דירה
                </label>
                <input
                  id={ids.apartment}
                  className={`${ui.input} ${ui.ltr}`}
                  value={apartment}
                  onChange={(event) => setApartment(event.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>
            <div className={ui.row}>
              <div className={ui.field}>
                <label htmlFor={ids.city} className={ui.label}>
                  עיר או יישוב בעברית
                </label>
                <input
                  id={ids.city}
                  className={ui.input}
                  list={ids.list}
                  value={hebrewCity}
                  onChange={(event) => onCity(event.target.value)}
                  autoComplete="off"
                />
                <datalist id={ids.list}>
                  {settlements.map((entry) => (
                    <option key={entry.hebrew} value={entry.hebrew} />
                  ))}
                </datalist>
              </div>
              <div className={ui.field}>
                <label htmlFor={ids.englishCity} className={ui.label}>
                  העיר באנגלית
                </label>
                <input
                  id={ids.englishCity}
                  className={`${ui.input} ${ui.ltr}`}
                  value={englishCity}
                  onChange={(event) => setEnglishCity(event.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className={ui.field}>
                <label htmlFor={ids.zip} className={ui.label}>
                  מיקוד (7 ספרות)
                </label>
                <input
                  id={ids.zip}
                  className={`${ui.input} ${ui.ltr}`}
                  inputMode="numeric"
                  maxLength={7}
                  value={zip}
                  onChange={(event) => setZip(event.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>
            <p className={ui.hint}>
              {source === 'official'
                ? `רשימת היישובים נטענה ממאגר הנתונים הממשלתי (${settlements.length} יישובים עם שם לועזי).`
                : source === 'fallback'
                  ? 'מאגר היישובים הממשלתי לא זמין כרגע, ולכן ברשימה הערים הגדולות בלבד. אפשר להקליד את שם העיר באנגלית ידנית.'
                  : 'טוענים את רשימת היישובים.'}
              {unmatched ? ' לא נמצא יישוב בשם הזה, הקלידו את השם באנגלית בשדה הבא.' : ''}
            </p>
            <p className={ui.hint}>
              לא מכירים את המיקוד?{' '}
              <a href={ZIP_LOOKUP_URL} rel="noopener" target="_blank">
                אפשר לחפש אותו באתר דואר ישראל
              </a>
              .
            </p>
          </fieldset>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>אפשרויות</legend>
            <div className={ui.options}>
              <label className={ui.option}>
                <input
                  type="checkbox"
                  className={ui.checkbox}
                  checked={style === 'simple'}
                  onChange={(event) => setStyle(event.target.checked ? 'simple' : 'standard')}
                />
                <span>איות פשוט לשם הרחוב (בלי kh ו-ch)</span>
              </label>
              <label className={ui.option}>
                <input
                  type="checkbox"
                  className={ui.checkbox}
                  checked={zipFirst}
                  onChange={(event) => setZipFirst(event.target.checked)}
                />
                <span>מיקוד לפני שם העיר</span>
              </label>
            </div>
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>הכתובת באנגלית</h2>
            <div className={ui.paper} tabIndex={0} aria-label="הכתובת באנגלית">
              <pre className={styles.address} dir="ltr" lang="en">
                {text || 'Fill in the address'}
              </pre>
            </div>
            <p className={ui.note}>
              {street.trim() && !result.streetKnown
                ? 'שם הרחוב הותעתק אוטומטית. השוו אותו לשלט ברחוב או לכתובת בדואר ישראל לפני שליחה.'
                : 'שם הרחוב ברשימת השמות המוכרים. עדיין כדאי להשוות לשלט ברחוב.'}
            </p>
            <div className={ui.actions}>
              <button type="button" className={ui.primary} onClick={copy}>
                <Copy aria-hidden="true" />
                העתקת הכתובת
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
