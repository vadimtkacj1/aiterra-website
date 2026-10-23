'use client'

import { useId, useMemo, useState } from 'react'
import {
  banks,
  buildIban,
  formatIban,
  ibanToText,
  validateIban,
  type IbanCheck,
} from '@/lib/iban'
import { BizNumberField, BizResults, copyText } from './BizCalcField'
import ui from './toolUi.module.css'
import styles from './BizCalc.module.css'

const invalidMessage: Record<Extract<IbanCheck, { kind: 'invalid' }>['reason'], string> = {
  country: 'זה לא IBAN ישראלי: IBAN ישראלי מתחיל ב-IL.',
  length: 'ל-IBAN ישראלי יש 23 תווים בדיוק: IL ועוד 21 ספרות.',
  characters: 'אחרי IL מותר להקליד רק ספרות.',
  checksum: 'ספרות הביקורת לא מתאימות. כנראה שיש ספרה שגויה או שתי ספרות שהתחלפו.',
}

const digitsError = (value: string, max: number) =>
  value && !new RegExp(`^\\d{1,${max}}$`).test(value.replace(/[\s-]/g, '')) ? `עד ${max} ספרות, בלי אותיות.` : ''

export default function IbanCalculator() {
  const [bank, setBank] = useState('12')
  const [branch, setBranch] = useState('')
  const [account, setAccount] = useState('')
  const [check, setCheck] = useState('')
  const [status, setStatus] = useState('')
  const bankId = useId()

  const built = useMemo(() => buildIban(bank, branch, account), [bank, branch, account])
  const checked = useMemo(() => validateIban(check), [check])

  return (
    <section className={ui.tool} aria-label="חישוב ובדיקת IBAN">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>חישוב IBAN מפרטי החשבון</legend>
            <div className={ui.field}>
              <label htmlFor={bankId} className={ui.label}>
                בנק
              </label>
              <select
                id={bankId}
                className={`${ui.input} ${styles.select}`}
                value={bank}
                onChange={(event) => setBank(event.target.value)}
              >
                {banks.map((item) => (
                  <option key={item.code} value={String(item.code)}>
                    {item.code} · {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.grid}>
              <BizNumberField
                label="מספר סניף"
                hint="עד 3 ספרות"
                inputMode="numeric"
                maxLength={5}
                value={branch}
                error={digitsError(branch, 3)}
                onChange={setBranch}
              />
              <BizNumberField
                label="מספר חשבון"
                hint="עד 13 ספרות, בלי מספר הבנק והסניף"
                inputMode="numeric"
                maxLength={17}
                value={account}
                error={digitsError(account, 13)}
                onChange={setAccount}
              />
            </div>
          </fieldset>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>בדיקת IBAN קיים</legend>
            <BizNumberField
              label="מספר IBAN"
              hint="למשל IL62 0108 0000 0009 9999 999"
              inputMode="text"
              maxLength={40}
              value={check}
              error={checked.kind === 'invalid' ? invalidMessage[checked.reason] : ''}
              onChange={setCheck}
            />
            {checked.kind === 'valid' ? (
              <p className={`${styles.notice} ${styles.valid}`} role="status">
                ה-IBAN תקין מבחינת המבנה וספרות הביקורת. בנק {checked.parts.bank}
                {checked.bankName ? ` (${checked.bankName})` : ''}, סניף {checked.parts.branch}, חשבון{' '}
                {checked.parts.account}.
              </p>
            ) : null}
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>ה-IBAN שלכם</h2>
            {built.kind === 'result' ? (
              <>
                <BizResults
                  rows={[
                    { term: 'IBAN', value: formatIban(built.iban), main: true, ltr: true },
                    { term: 'קוד מדינה וספרות ביקורת', value: `IL${built.parts.check}` },
                    { term: 'בנק', value: built.parts.bank },
                    { term: 'סניף', value: built.parts.branch },
                    { term: 'חשבון (13 ספרות)', value: built.parts.account },
                  ]}
                />
                <div className={styles.subActions}>
                  <button
                    type="button"
                    className={ui.primary}
                    onClick={() => copyText(built.iban, setStatus, `ה-IBAN ${built.iban} הועתק`)}
                  >
                    העתקת IBAN
                  </button>
                  <button
                    type="button"
                    className={ui.secondary}
                    onClick={() =>
                      copyText(ibanToText(built.iban, built.parts, built.bankName), setStatus, 'הפרטים הועתקו')
                    }
                  >
                    העתקה עם הפרטים
                  </button>
                </div>
              </>
            ) : (
              <p className={styles.message}>
                {built.kind === 'invalid'
                  ? 'תקנו את השדה שמתחתיו הודעת שגיאה.'
                  : 'בחרו בנק והקלידו מספר סניף ומספר חשבון כדי לקבל IBAN.'}
              </p>
            )}
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>
              החישוב לפי הנוסחה של בנק ישראל ונעשה בדפדפן. רק הבנק שלכם יכול לאשר את ה-IBAN המדויק של החשבון.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
