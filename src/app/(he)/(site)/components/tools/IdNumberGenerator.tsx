'use client'

import { useState } from 'react'
import { Copy, RefreshCw } from 'lucide-react'
import { BASE_LENGTH, checkDigitFor } from '@/lib/id-number'
import ui from './toolUi.module.css'

const COUNT = 5

function randomBase() {
  const digits = new Uint8Array(BASE_LENGTH)
  crypto.getRandomValues(digits)
  const base = Array.from(digits, (value) => String(value % 10)).join('')
  return base.startsWith('0') ? `1${base.slice(1)}` : base
}

const generate = () => Array.from({ length: COUNT }, () => {
  const base = randomBase()
  return `${base}${checkDigitFor(base)}`
})

export default function IdNumberGenerator() {
  const [numbers, setNumbers] = useState<string[]>([])
  const [status, setStatus] = useState('')

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setStatus(`${value} הועתק`)
    } catch {
      setStatus('ההעתקה נכשלה. סמנו את המספר והעתיקו ידנית.')
    }
  }

  const create = () => {
    setNumbers(generate())
    setStatus('')
    window.gtag?.('event', 'id_generate')
  }

  return (
    <div className={ui.paper}>
      <div className={ui.actions}>
        <button type="button" className={ui.primary} onClick={create}>
          <RefreshCw aria-hidden="true" />
          {numbers.length ? 'עוד 5 מספרים' : 'יצירת 5 מספרים תקינים'}
        </button>
        {numbers.length ? (
          <button type="button" className={ui.secondary} onClick={() => copy(numbers.join('\n'))}>
            <Copy aria-hidden="true" />
            העתקת כולם
          </button>
        ) : null}
      </div>
      {numbers.length ? (
        <ul>
          {numbers.map((number) => (
            <li key={number}>
              <button type="button" className={ui.secondary} onClick={() => copy(number)} dir="ltr">
                {number}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <p className={ui.status} role="status" aria-live="polite">
        {status}
      </p>
    </div>
  )
}
