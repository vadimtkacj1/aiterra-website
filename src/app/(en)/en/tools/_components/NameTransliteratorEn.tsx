'use client'

import { useId, useMemo, useState } from 'react'
import { Copy } from 'lucide-react'
import { passportStyle, transliterateName, type WordResult } from '@/lib/name-transliteration'
import ui from '../../../../(he)/(site)/components/tools/toolUi.module.css'
import styles from '../../../../(he)/(site)/components/tools/NameTransliterator.module.css'

function WordChoice({
  result,
  selected,
  onSelect,
}: {
  result: WordResult
  selected: string
  onSelect: (value: string) => void
}) {
  const name = useId()
  return (
    <fieldset className={styles.word}>
      <legend className={styles.wordLegend}>
        <span lang="he">{result.word}</span>
        <span className={styles.source}>
          {result.source === 'list' ? 'From the list' : 'Rule-based guess, check and correct'}
        </span>
      </legend>
      <div className={styles.variants}>
        {result.variants.map((variant) => (
          <label key={variant} className={styles.variant}>
            <input type="radio" name={name} checked={selected === variant} onChange={() => onSelect(variant)} />
            <span>{variant}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default function NameTransliteratorEn() {
  const inputId = useId()
  const [text, setText] = useState('יונתן לוי')
  const [choices, setChoices] = useState<Record<string, string>>({})
  const [passport, setPassport] = useState(false)
  const [status, setStatus] = useState('')

  const results = useMemo(() => transliterateName(text), [text])

  const chosen = results.map((result, index) => {
    const picked = choices[`${index}:${result.word}`]
    return picked && result.variants.includes(picked) ? picked : result.variants[0]
  })
  const joined = chosen.join(' ')
  const output = passport ? passportStyle(joined) : joined

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setStatus('Copied')
    } catch {
      setStatus('Your browser blocked copying. Select the text and copy it manually.')
    }
  }

  return (
    <section className={ui.tool} aria-label="Hebrew name to English converter" dir="ltr">
      <div className={ui.inner}>
        <form className={ui.form} onSubmit={(event) => event.preventDefault()}>
          <fieldset className={ui.group}>
            <legend className={ui.legend}>Type a name in Hebrew</legend>
            <div className={ui.field}>
              <label htmlFor={inputId} className={ui.label}>
                First name, surname or both
              </label>
              <input
                id={inputId}
                className={ui.input}
                value={text}
                lang="he"
                dir="rtl"
                autoComplete="off"
                placeholder="e.g. משה כהן"
                onChange={(event) => {
                  setText(event.target.value)
                  setStatus('')
                }}
              />
              <p className={ui.hint}>Without vowel points. You can type several words; each word is checked separately.</p>
            </div>
            <label className={styles.passport}>
              <input type="checkbox" checked={passport} onChange={(event) => setPassport(event.target.checked)} />
              <span>Capital letters without punctuation, as in a passport</span>
            </label>
          </fieldset>
          {results.length ? (
            <fieldset className={ui.group}>
              <legend className={ui.legend}>Choose a spelling for each word</legend>
              {results.map((result, index) => (
                <WordChoice
                  key={`${index}:${result.word}`}
                  result={result}
                  selected={chosen[index]}
                  onSelect={(value) => setChoices((current) => ({ ...current, [`${index}:${result.word}`]: value }))}
                />
              ))}
            </fieldset>
          ) : null}
        </form>
        <div className={ui.output}>
          <div className={ui.sticky}>
            <h2 className={ui.outputTitle}>The name in English</h2>
            <p className={styles.result} aria-live="polite">
              {output || '—'}
            </p>
            <div className={ui.actions}>
              <button type="button" className={ui.primary} onClick={copy} disabled={!output}>
                <Copy aria-hidden="true" />
                Copy
              </button>
            </div>
            <p className={ui.status} role="status">
              {status}
            </p>
            <p className={ui.note}>
              On a passport, ID card or bank account, the spelling already registered there is what counts, even if it
              differs from the suggestion here. Words not on the list are guessed by rules, and Hebrew without vowel
              points does not show the vowels for certain.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
