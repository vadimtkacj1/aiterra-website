'use client'

import { OPEN_COOKIE_SETTINGS_EVENT } from '@/lib/cookie-consent'

const LABELS = { he: 'הגדרות עוגיות', en: 'Cookie settings' }

export default function CookieSettingsButton({
  locale = 'he',
  className,
}: {
  locale?: 'he' | 'en'
  className?: string
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
    >
      {LABELS[locale]}
    </button>
  )
}
