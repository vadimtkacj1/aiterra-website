'use client'

import { Printer } from 'lucide-react'
import { PRINT_MONTHS_EVENT } from './HebrewCalendar'
import ui from './toolUi.module.css'

const printMonths = () => {
  const unhandled = window.dispatchEvent(new Event(PRINT_MONTHS_EVENT, { cancelable: true }))
  if (unhandled) window.print()
}

export default function CalendarPrintButton() {
  return (
    <div className={ui.actions}>
      <button type="button" className={ui.primary} onClick={printMonths}>
        <Printer aria-hidden="true" />
        הדפסה: חודש בעמוד
      </button>
    </div>
  )
}
