'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Copy } from 'lucide-react'
import ui from '../../../../(he)/(site)/components/tools/toolUi.module.css'
import { COPY_FAILED } from './en-format'

const ANNOUNCE_DELAY_MS = 900

type CalcStyles = Record<string, string>

export function useAnnouncement(spoken: string) {
  const [announcement, setAnnouncement] = useState('')
  const lastSpoken = useRef(spoken)

  useEffect(() => {
    if (spoken === lastSpoken.current) return
    const timer = window.setTimeout(() => {
      lastSpoken.current = spoken
      setAnnouncement(spoken)
    }, ANNOUNCE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [spoken])

  return announcement
}

export function useCopyResult(eventName: string) {
  const [status, setStatus] = useState('')

  const copy = async (text: string | null) => {
    if (text === null) {
      setStatus('Fill in the details first to copy a result.')
      return
    }
    try {
      await navigator.clipboard.writeText(text)
      setStatus('Result copied')
      window.gtag?.('event', eventName, { locale: 'en' })
    } catch {
      setStatus(COPY_FAILED)
    }
  }

  return { status, setStatus, copy }
}

export function EnField({
  id,
  label,
  hint,
  error,
  value,
  styles,
  type = 'text',
  onChange,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  value: string
  styles: CalcStyles
  type?: 'text' | 'date'
  onChange: (value: string) => void
}) {
  const described = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ')
  const isDate = type === 'date'
  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        className={`${ui.input} ${isDate ? `${ui.date} ${styles.date ?? ''}` : `${ui.ltr} ${styles.number}`}`}
        inputMode={isDate ? undefined : 'decimal'}
        min={isDate ? '1950-01-01' : undefined}
        max={isDate ? '2099-12-31' : undefined}
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="done"
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={described || undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint ? (
        <p id={`${id}-hint`} className={ui.hint}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function EnOutput({
  title = 'Result',
  styles,
  status,
  announcement,
  note,
  onCopy,
  children,
}: {
  title?: string
  styles: CalcStyles
  status: string
  announcement: string
  note: string
  onCopy: () => void
  children: ReactNode
}) {
  return (
    <div className={ui.output}>
      <div className={ui.sticky}>
        <h2 className={ui.outputTitle}>{title}</h2>
        {children}
        <div className={ui.actions}>
          <button type="button" className={`${ui.primary} ${styles.copyMain ?? ''}`} onClick={onCopy}>
            <Copy aria-hidden="true" />
            Copy the result
          </button>
        </div>
        <p className={ui.status} role="status" aria-live="polite">
          {status}
        </p>
        <p className={styles.srOnly} role="status" aria-live="polite">
          {announcement}
        </p>
        <p className={ui.note}>{note}</p>
      </div>
    </div>
  )
}
