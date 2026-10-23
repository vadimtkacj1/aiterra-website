'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Copy, Hash } from 'lucide-react'
import {
  BASE_LENGTH,
  DEFAULT_MODE,
  ID_LENGTH,
  corporatePrefixes,
  evaluate,
  fullNumber,
  modeFromHash,
  nextTen,
  type IdMode,
  type IdOutcome,
  type Step,
} from '@/lib/id-number'
import ui from '../../../../(he)/(site)/components/tools/toolUi.module.css'
import styles from '../../../../(he)/(site)/components/tools/IdNumberChecker.module.css'

type CopyTarget = 'text' | 'number'
type EnError = { message: string; switchToValidate: boolean }

const ANNOUNCE_DELAY_MS = 900
const SEPARATORS = /[\s\-‐-―־./‎‏‪-‮]/g

const prefixArticlesEn: Record<string, string> = {
  '51': 'an Israeli company',
  '52': 'an Israeli company',
  '53': 'a foreign partnership registered in Israel',
  '54': 'an Israeli partnership',
  '55': 'an Israeli partnership',
  '56': 'a foreign company registered in Israel',
  '58': 'a non-profit (amuta)',
}

const modesEn: { id: IdMode; label: string; hint: string; field: string; fieldHint: string; length: number }[] = [
  {
    id: 'validate',
    label: 'Check an ID number',
    hint: '9 digits, valid or not',
    field: 'Teudat zehut number',
    fieldHint: '9 digits, including the check digit at the end. You can leave out leading zeros.',
    length: ID_LENGTH,
  },
  {
    id: 'check-digit',
    label: 'Calculate the check digit',
    hint: 'From the first 8 digits',
    field: 'The first 8 digits',
    fieldHint: 'Without the check digit. We calculate the ninth digit.',
    length: BASE_LENGTH,
  },
  {
    id: 'company',
    label: 'Company or VAT dealer number',
    hint: 'Company, partnership, non-profit',
    field: 'Company (H.P.), osek murshe or amuta number',
    fieldHint: '9 digits. Company, partnership and non-profit numbers start with 5.',
    length: ID_LENGTH,
  },
]

const prompts: Record<IdMode, string> = {
  validate: 'Enter a teudat zehut number to check its check digit and see the calculation.',
  'check-digit': 'Enter the first 8 digits to get the check digit.',
  company: 'Enter a company, VAT dealer or non-profit number to check its check digit.',
}

const englishError = (mode: IdMode, raw: string): EnError | null => {
  const digits = raw.replace(SEPARATORS, '')
  if (!digits) return null
  if (!/^\d+$/.test(digits)) return { message: 'Digits only. Spaces and dashes are ignored.', switchToValidate: false }
  if (mode === 'check-digit' && digits.length === ID_LENGTH) {
    return {
      message: 'You typed 9 digits, a full number with its check digit. To check it, switch to ID number check.',
      switchToValidate: true,
    }
  }
  const length = mode === 'check-digit' ? BASE_LENGTH : ID_LENGTH
  if (digits.length > length) {
    return {
      message: `That is ${digits.length} digits. ${mode === 'check-digit' ? 'Enter 8 digits at most.' : 'The number has 9 digits at most.'}`,
      switchToValidate: false,
    }
  }
  if (/^0+$/.test(digits)) return { message: 'All zeros is not an ID or company number.', switchToValidate: false }
  return null
}

const entityForEn = (number: string) => {
  const match = corporatePrefixes.find((item) => number.startsWith(item.prefix))
  if (match) return `By the prefix ${match.prefix}, this is the number of ${prefixArticlesEn[match.prefix]}.`
  if (number.startsWith('5')) {
    return 'The number starts with 5 like corporate numbers, but this prefix did not appear in the registries we checked.'
  }
  return 'The number does not start with 5, so it is not a company, partnership or non-profit number. A VAT dealer who is a private person is usually registered under their teudat zehut number.'
}

const zerosText = (count: number) => (count === 1 ? 'one 0' : `${count} zeros`)

const paddingNoteEn = (outcome: IdOutcome) => {
  if (outcome.kind !== 'checked' && outcome.kind !== 'computed') return ''
  if (!outcome.zerosAdded) return ''
  const shown = outcome.kind === 'checked' ? outcome.number : outcome.base
  return `You typed ${outcome.typedLength} digits, so we added ${zerosText(outcome.zerosAdded)} on the left: ${shown}.`
}

const verdictEn = (outcome: IdOutcome) => {
  if (outcome.kind === 'computed') {
    const gap = outcome.checkDigit
      ? `${outcome.checkDigit} is missing to reach ${nextTen(outcome.sum)}`
      : 'the sum is already divisible by 10'
    return {
      headline: `The check digit is ${outcome.checkDigit}`,
      reason: `The sum of the 8 digits is ${outcome.sum}; ${gap}, so the full number is ${outcome.number}. This is only a calculation and does not mean the number was issued to anyone.`,
    }
  }
  if (outcome.kind !== 'checked') return null
  if (outcome.valid) {
    return {
      headline: 'The number is valid',
      reason: `The sum is ${outcome.sum}, which is divisible by 10, so the check digit matches. This means the number is well formed, not that it belongs to anyone, exists or is current.`,
    }
  }
  return {
    headline: 'The number is not valid',
    reason: `The sum is ${outcome.sum}, which is not divisible by 10. If the first 8 digits are right, the check digit should be ${outcome.expectedCheckDigit}, but the mistake can be in another digit too. Check against the card or document.`,
  }
}

const resultToTextEn = (outcome: IdOutcome, mode: IdMode) => {
  if (outcome.kind === 'computed') {
    return `The check digit of ${outcome.base} is ${outcome.checkDigit}. Full number: ${outcome.number}`
  }
  if (outcome.kind !== 'checked') return ''
  const verdict = outcome.valid ? 'check digit is valid' : 'check digit is not valid'
  const lines = [`${outcome.number}: ${verdict} (sum ${outcome.sum}).`]
  if (mode === 'company') lines.push(entityForEn(outcome.number))
  lines.push('This checks the structure only, not that the number exists or is current.')
  return lines.join('\n')
}

const verdictTone = (outcome: IdOutcome) => {
  if (outcome.kind === 'computed') return styles.computed
  if (outcome.kind === 'checked') return outcome.valid ? styles.valid : styles.invalid
  return ''
}

function StepsTable({ steps, withCheckDigit }: { steps: Step[]; withCheckDigit: boolean }) {
  const sum = steps.reduce((total, step) => total + step.added, 0)
  const cellClass = (step: Step) => (withCheckDigit && step.position === steps.length ? styles.checkCell : undefined)
  const rows: { label: string; value: (step: Step) => string }[] = [
    { label: 'Digit', value: (step) => String(step.digit) },
    { label: 'Times', value: (step) => `×${step.weight}` },
    { label: 'Product', value: (step) => String(step.product) },
    { label: 'Added', value: (step) => String(step.added) },
  ]

  return (
    <div className={styles.steps}>
      <table className={styles.table}>
        <caption className={styles.caption}>The calculation, digit by digit</caption>
        <thead>
          <tr>
            <th scope="row" className={styles.rowHead}>
              Position
            </th>
            {steps.map((step) => (
              <th key={step.position} scope="col" className={cellClass(step)}>
                {step.position}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row" className={styles.rowHead}>
                {row.label}
              </th>
              {steps.map((step) => (
                <td key={step.position} className={cellClass(step)}>
                  {row.value(step)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.sum}>Sum: {`${steps.map((step) => step.added).join(' + ')} = ${sum}`}</p>
      <p className={styles.rule}>
        A product of 10 or more counts as the sum of its digits, so 16 counts as 7.
        {withCheckDigit
          ? ' The number is valid when the sum is divisible by 10.'
          : ' The check digit brings the sum up to the next multiple of 10.'}
      </p>
    </div>
  )
}

function ResultCard({ outcome, mode, hasError }: { outcome: IdOutcome; mode: IdMode; hasError: boolean }) {
  const verdict = verdictEn(outcome)
  if (hasError || !verdict) {
    const message = hasError ? 'To see the result, fix the number in the field.' : prompts[mode]
    return <p className={styles.empty}>{message}</p>
  }

  const number = fullNumber(outcome)
  const padding = paddingNoteEn(outcome)

  return (
    <div className={`${styles.verdict} ${verdictTone(outcome)}`}>
      <p className={styles.headline}>{verdict.headline}</p>
      <p className={styles.number}>
        {number.slice(0, -1)}
        <span className={styles.checkDigit}>{number.slice(-1)}</span>
      </p>
      <p className={styles.reason}>{verdict.reason}</p>
      {padding ? <p className={styles.insight}>{padding}</p> : null}
      {outcome.kind === 'checked' && mode === 'company' ? (
        <p className={styles.insight}>{entityForEn(outcome.number)}</p>
      ) : null}
    </div>
  )
}

export default function IdNumberCheckerEn() {
  const [mode, setMode] = useState<IdMode>(DEFAULT_MODE)
  const [inputs, setInputs] = useState<Record<IdMode, string>>({ validate: '', 'check-digit': '', company: '' })
  const [status, setStatus] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const sectionRef = useRef<HTMLElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const name = useId()
  const fieldId = useId()
  const hintId = `${fieldId}-hint`
  const errorId = `${fieldId}-error`
  const spec = modesEn.find((item) => item.id === mode) ?? modesEn[0]
  const value = inputs[mode]
  const outcome = useMemo(() => evaluate(mode, value), [mode, value])
  const error = englishError(mode, value)

  const spoken = (() => {
    if (error) return error.message
    if (outcome.kind === 'computed') return `The check digit is ${outcome.checkDigit}`
    if (outcome.kind === 'checked') return outcome.valid ? 'The number is valid' : 'The number is not valid'
    return ''
  })()
  const lastSpoken = useRef(spoken)

  useEffect(() => {
    const initial = modeFromHash(window.location.hash)
    if (initial) setMode(initial)

    const onHashChange = () => {
      const next = modeFromHash(window.location.hash)
      if (!next) return
      setMode(next)
      setStatus('')
      sectionRef.current?.scrollIntoView({ block: 'start' })
      sectionRef.current?.querySelector<HTMLInputElement>(`input[value="${next}"]`)?.focus({ preventScroll: true })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    if (spoken === lastSpoken.current) return
    const timer = window.setTimeout(() => {
      lastSpoken.current = spoken
      setAnnouncement(spoken)
    }, ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  const selectMode = (next: IdMode) => {
    setMode(next)
    setStatus('')
    window.history.replaceState(null, '', `#${next}`)
  }

  const setValue = (next: string) => setInputs((current) => ({ ...current, [mode]: next }))

  const checkFullNumber = () => {
    setInputs((current) => ({ ...current, validate: current['check-digit'] }))
    selectMode('validate')
    inputRef.current?.focus()
  }

  const copy = async (target: CopyTarget) => {
    const text = error ? '' : target === 'text' ? resultToTextEn(outcome, mode) : fullNumber(outcome)
    if (!text) {
      setStatus('Enter a number to get a result to copy.')
      return
    }
    try {
      await navigator.clipboard.writeText(text)
      setStatus(target === 'text' ? 'Result copied' : 'Number copied, with its leading zeros')
      window.gtag?.('event', 'id_check_copy', { mode, locale: 'en' })
    } catch {
      setStatus('Copying failed. Select the result and copy it manually.')
    }
  }

  const steps = !error && (outcome.kind === 'checked' || outcome.kind === 'computed') ? outcome.steps : null

  return (
    <section ref={sectionRef} className={`${ui.tool} ${styles.checker}`} aria-label="Israeli ID number check">
      <div className={`${ui.inner} ${styles.layout}`}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>What are you checking?</legend>
            <div className={styles.modes}>
              {modesEn.map((item) => (
                <label key={item.id} className={styles.mode}>
                  <input
                    type="radio"
                    name={name}
                    value={item.id}
                    checked={mode === item.id}
                    onChange={() => selectMode(item.id)}
                  />
                  <span className={styles.modeLabel}>{item.label}</span>
                  <span className={styles.modeHint}>{item.hint}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={ui.group}>
            <legend className={ui.legend}>The number</legend>
            <div className={ui.field}>
              <label htmlFor={fieldId} className={ui.label}>
                {spec.field}
              </label>
              <p id={hintId} className={ui.hint}>
                {spec.fieldHint}
              </p>
              <input
                ref={inputRef}
                id={fieldId}
                className={`${ui.input} ${ui.ltr} ${styles.digits}`}
                inputMode="numeric"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="done"
                maxLength={24}
                data-lpignore="true"
                data-1p-ignore=""
                value={value}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${hintId} ${errorId}` : hintId}
                onChange={(event) => setValue(event.target.value)}
              />
              {error ? (
                <div id={errorId} className={styles.error}>
                  <p>{error.message}</p>
                  {error.switchToValidate ? (
                    <button type="button" className={styles.inlineAction} onClick={checkFullNumber}>
                      Check the full number
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </fieldset>
        </form>

        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>Result</h2>
            <ResultCard outcome={outcome} mode={mode} hasError={Boolean(error)} />
            {steps ? <StepsTable steps={steps} withCheckDigit={outcome.kind === 'checked'} /> : null}
            <div className={ui.actions}>
              <button type="button" className={`${ui.primary} ${styles.copyMain}`} onClick={() => copy('text')}>
                <Copy aria-hidden="true" />
                Copy the result
              </button>
              <button type="button" className={ui.secondary} onClick={() => copy('number')}>
                <Hash aria-hidden="true" />
                Copy the number
              </button>
            </div>
            <p className={ui.status} role="status" aria-live="polite">
              {status}
            </p>
            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>
            <p className={ui.note}>
              The check runs in your browser. The number is not sent anywhere, not stored and not added to the page
              address.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function CodeSnippetEn({
  code,
  copyLabel,
  copiedMessage,
  mode,
}: {
  code: string
  copyLabel: string
  copiedMessage: string
  mode: string
}) {
  const [status, setStatus] = useState('')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setStatus(copiedMessage)
      window.gtag?.('event', 'id_check_copy', { mode, locale: 'en' })
    } catch {
      setStatus('Copying failed. Select the text and copy it manually.')
    }
  }

  return (
    <div className={styles.snippet}>
      <pre className={styles.code}>
        <code className={styles.codeText}>{code}</code>
      </pre>
      <div className={styles.snippetActions}>
        <button type="button" className={ui.secondary} onClick={copy}>
          <Copy aria-hidden="true" />
          {copyLabel}
        </button>
        <p className={styles.snippetStatus} role="status" aria-live="polite">
          {status}
        </p>
      </div>
    </div>
  )
}
