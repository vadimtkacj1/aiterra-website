'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import extra from './VehicleLookup.module.css'

export type CopyAnnounce = (message: string) => void

const COPIED_FOR_MS = 2000

export default function CopyValue({
  text,
  label,
  onAnnounce,
  className = extra.copyValue,
  dir,
  children,
}: {
  text: string
  label: string
  onAnnounce: CopyAnnounce
  className?: string
  dir?: 'ltr' | 'rtl'
  children?: ReactNode
}) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const timerRef = useRef(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const selectValue = () => {
    const button = buttonRef.current
    const selection = window.getSelection()
    if (button && selection) selection.selectAllChildren(button)
    onAnnounce('ההעתקה נכשלה. הטקסט מסומן, אפשר להעתיק ידנית.')
  }

  const markCopied = () => {
    setCopied(true)
    onAnnounce(`הועתק: ${label}`)
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setCopied(false), COPIED_FOR_MS)
  }

  const copy = () => {
    if (!navigator.clipboard) {
      selectValue()
      return
    }
    navigator.clipboard.writeText(text).then(markCopied, selectValue)
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={className}
        dir={dir}
        aria-label={`${label}: ${text}, לחיצה להעתקה`}
        onClick={copy}
      >
        {children ?? text}
      </button>
      {copied ? (
        <span className={extra.copied} aria-hidden="true">
          הועתק
        </span>
      ) : null}
    </>
  )
}
