'use client'

import { useId, useMemo, useState } from 'react'
import { banks, buildIban, formatIban, validateIban, type IbanCheck, type IbanParts } from '@/lib/iban'
import { englishBankName } from '@/lib/iban-en'
import { BizNumberField, BizResults } from '../../../../(he)/(site)/components/tools/BizCalcField'
import ui from '../../../../(he)/(site)/components/tools/toolUi.module.css'
import styles from '../../../../(he)/(site)/components/tools/BizCalc.module.css'

const invalidMessage: Record<Extract<IbanCheck, { kind: 'invalid' }>['reason'], string> = {
  country: 'This is not an Israeli IBAN: an Israeli IBAN starts with IL.',
  length: 'An Israeli IBAN has exactly 23 characters: IL plus 21 digits.',
  characters: 'After IL, only digits are allowed.',
  checksum: 'The check digits do not match. Probably one digit is wrong or two digits are swapped.',
}

const digitsError = (value: string, max: number) =>
  value && !new RegExp(`^\\d{1,${max}}$`).test(value.replace(/[\s-]/g, '')) ? `Up to ${max} digits, no letters.` : ''

const ibanText = (iban: string, parts: IbanParts, name: string | null) =>
  [
    `IBAN: ${iban}`,
    `Bank: ${parts.bank}${name ? ` (${name})` : ''}`,
    `Branch: ${parts.branch}`,
    `Account: ${parts.account}`,
  ].join('\n')

async function copyText(text: string, setStatus: (status: string) => void, done: string) {
  try {
    await navigator.clipboard.writeText(text)
    setStatus(done)
  } catch {
    setStatus('Copying failed. Select the text and copy it manually.')
  }
}

const sortedBanks = [...banks].sort((first, second) => first.code - second.code)

export default function IbanCalculatorEn() {
  const [bank, setBank] = useState('12')
  const [branch, setBranch] = useState('')
  const [account, setAccount] = useState('')
  const [check, setCheck] = useState('')
  const [status, setStatus] = useState('')
  const bankId = useId()

  const built = useMemo(() => buildIban(bank, branch, account), [bank, branch, account])
  const checked = useMemo(() => validateIban(check), [check])
  const builtName = built.kind === 'result' ? englishBankName(Number(built.parts.bank)) : null
  const checkedName = checked.kind === 'valid' ? englishBankName(Number(checked.parts.bank)) : null

  return (
    <section className={ui.tool} aria-label="Calculate and validate an Israeli IBAN">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>Calculate an IBAN from account details</legend>
            <div className={ui.field}>
              <label htmlFor={bankId} className={ui.label}>
                Bank
              </label>
              <select
                id={bankId}
                className={`${ui.input} ${styles.select}`}
                value={bank}
                onChange={(event) => setBank(event.target.value)}
              >
                {sortedBanks.map((item) => (
                  <option key={item.code} value={String(item.code)}>
                    {item.code} · {englishBankName(item.code) ?? item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.grid}>
              <BizNumberField
                label="Branch number"
                hint="Up to 3 digits"
                inputMode="numeric"
                maxLength={5}
                value={branch}
                error={digitsError(branch, 3)}
                onChange={setBranch}
              />
              <BizNumberField
                label="Account number"
                hint="Up to 13 digits, without the bank and branch"
                inputMode="numeric"
                maxLength={17}
                value={account}
                error={digitsError(account, 13)}
                onChange={setAccount}
              />
            </div>
          </fieldset>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>Validate an existing IBAN</legend>
            <BizNumberField
              label="IBAN"
              hint="For example IL62 0108 0000 0009 9999 999"
              inputMode="text"
              maxLength={40}
              value={check}
              error={checked.kind === 'invalid' ? invalidMessage[checked.reason] : ''}
              onChange={setCheck}
            />
            {checked.kind === 'valid' ? (
              <p className={`${styles.notice} ${styles.valid}`} role="status">
                The IBAN is valid in structure and check digits. Bank {checked.parts.bank}
                {checkedName ? ` (${checkedName})` : ''}, branch {checked.parts.branch}, account {checked.parts.account}.
              </p>
            ) : null}
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>Your IBAN</h2>
            {built.kind === 'result' ? (
              <>
                <BizResults
                  rows={[
                    { term: 'IBAN', value: formatIban(built.iban), main: true, ltr: true },
                    { term: 'Country code and check digits', value: `IL${built.parts.check}` },
                    { term: 'Bank', value: built.parts.bank },
                    { term: 'Branch', value: built.parts.branch },
                    { term: 'Account (13 digits)', value: built.parts.account },
                  ]}
                />
                <div className={styles.subActions}>
                  <button
                    type="button"
                    className={ui.primary}
                    onClick={() => copyText(built.iban, setStatus, `IBAN ${built.iban} copied`)}
                  >
                    Copy IBAN
                  </button>
                  <button
                    type="button"
                    className={ui.secondary}
                    onClick={() => copyText(ibanText(built.iban, built.parts, builtName), setStatus, 'Details copied')}
                  >
                    Copy with details
                  </button>
                </div>
              </>
            ) : (
              <p className={styles.message}>
                {built.kind === 'invalid'
                  ? 'Fix the field with the error message below it.'
                  : 'Choose a bank and type a branch and account number to get the IBAN.'}
              </p>
            )}
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={ui.note}>
              Calculated with the Bank of Israel formula, in your browser. Only your bank can confirm the exact IBAN of
              your account.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
