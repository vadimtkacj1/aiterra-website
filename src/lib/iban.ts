export type Bank = { code: number; name: string }

export type IbanParts = { bank: string; branch: string; account: string; check: string }

export type IbanCheck =
  | { kind: 'empty' }
  | { kind: 'valid'; iban: string; parts: IbanParts; bankName: string | null }
  | { kind: 'invalid'; reason: 'country' | 'length' | 'characters' | 'checksum'; length: number }

export type BuildOutcome =
  | { kind: 'result'; iban: string; parts: IbanParts; bankName: string | null }
  | { kind: 'incomplete' }
  | { kind: 'invalid'; field: 'bank' | 'branch' | 'account' }

export const IL_IBAN_LENGTH = 23
export const BANK_DIGITS = 3
export const BRANCH_DIGITS = 3
export const ACCOUNT_DIGITS = 13
export const BANKS_REVIEWED = '2026-10-23'

export const banks: Bank[] = [
  { code: 10, name: 'בנק לאומי לישראל' },
  { code: 12, name: 'בנק הפועלים' },
  { code: 11, name: 'בנק דיסקונט לישראל' },
  { code: 20, name: 'בנק מזרחי טפחות' },
  { code: 31, name: 'הבנק הבינלאומי הראשון לישראל' },
  { code: 17, name: 'בנק מרכנתיל דיסקונט' },
  { code: 14, name: 'בנק אוצר החייל' },
  { code: 4, name: 'בנק יהב לעובדי המדינה' },
  { code: 46, name: 'בנק מסד' },
  { code: 52, name: 'בנק פועלי אגודת ישראל' },
  { code: 54, name: 'בנק ירושלים' },
  { code: 18, name: 'וואן זירו הבנק הדיגיטלי' },
  { code: 3, name: 'בנק אש ישראל' },
  { code: 26, name: 'יו-בנק' },
  { code: 99, name: 'בנק ישראל' },
  { code: 1, name: 'ישראכרט' },
  { code: 6, name: 'מקס איט פיננסים' },
  { code: 50, name: 'מרכז סליקה בנקאי' },
  { code: 59, name: 'שירותי בנק אוטומטיים' },
  { code: 22, name: 'Citibank' },
  { code: 23, name: 'HSBC' },
  { code: 39, name: 'SBI State Bank of India' },
]

const bankNames = new Map(banks.map((bank) => [bank.code, bank.name]))

export const bankName = (code: number) => bankNames.get(code) ?? null

const SEPARATORS = /[\s\-‎‏]/g

const digitsOnly = (value: string) => value.replace(SEPARATORS, '')

const letterValue = (char: string) => String(char.charCodeAt(0) - 55)

export function mod97(iban: string) {
  const rearranged = (iban.slice(4) + iban.slice(0, 4)).replace(/[A-Z]/g, letterValue)
  let remainder = 0
  for (let index = 0; index < rearranged.length; index += 7) {
    remainder = Number(String(remainder) + rearranged.slice(index, index + 7)) % 97
  }
  return remainder
}

export function checkDigits(country: string, bban: string) {
  return String(98 - mod97(`${country}00${bban}`)).padStart(2, '0')
}

export const splitParts = (iban: string): IbanParts => ({
  check: iban.slice(2, 4),
  bank: iban.slice(4, 7),
  branch: iban.slice(7, 10),
  account: iban.slice(10),
})

export function buildIban(bank: string, branch: string, account: string): BuildOutcome {
  const cleanBranch = digitsOnly(branch)
  const cleanAccount = digitsOnly(account)
  if (!bank || !cleanBranch || !cleanAccount) return { kind: 'incomplete' }
  if (!/^\d{1,3}$/.test(bank)) return { kind: 'invalid', field: 'bank' }
  if (!/^\d{1,3}$/.test(cleanBranch)) return { kind: 'invalid', field: 'branch' }
  if (!/^\d{1,13}$/.test(cleanAccount)) return { kind: 'invalid', field: 'account' }

  const bban =
    bank.padStart(BANK_DIGITS, '0') + cleanBranch.padStart(BRANCH_DIGITS, '0') + cleanAccount.padStart(ACCOUNT_DIGITS, '0')
  const iban = `IL${checkDigits('IL', bban)}${bban}`
  return { kind: 'result', iban, parts: splitParts(iban), bankName: bankName(Number(bank)) }
}

export const normalizeIban = (value: string) => value.replace(SEPARATORS, '').toUpperCase()

export function validateIban(value: string): IbanCheck {
  const iban = normalizeIban(value)
  if (!iban) return { kind: 'empty' }
  if (!/^[A-Z0-9]+$/.test(iban)) return { kind: 'invalid', reason: 'characters', length: iban.length }
  if (!iban.startsWith('IL')) return { kind: 'invalid', reason: 'country', length: iban.length }
  if (iban.length !== IL_IBAN_LENGTH) return { kind: 'invalid', reason: 'length', length: iban.length }
  if (!/^IL\d{21}$/.test(iban)) return { kind: 'invalid', reason: 'characters', length: iban.length }
  if (mod97(iban) !== 1) return { kind: 'invalid', reason: 'checksum', length: iban.length }
  const parts = splitParts(iban)
  return { kind: 'valid', iban, parts, bankName: bankName(Number(parts.bank)) }
}

export const formatIban = (iban: string) => iban.replace(/(.{4})/g, '$1 ').trim()

export function ibanToText(iban: string, parts: IbanParts, name: string | null) {
  return [
    `IBAN: ${iban}`,
    `בנק: ${parts.bank}${name ? ` (${name})` : ''}`,
    `סניף: ${parts.branch}`,
    `חשבון: ${parts.account}`,
  ].join('\n')
}
