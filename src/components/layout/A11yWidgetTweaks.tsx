'use client'

import { useEffect } from 'react'

const COPY = {
  he: { open: 'פתיחת תפריט נגישות', statement: 'הצהרת נגישות', statementPath: '/accessibility-statement' },
  en: { open: 'Open accessibility menu', statement: 'Accessibility statement', statementPath: '/en/accessibility-statement' },
}

export default function A11yWidgetTweaks({ locale = 'he' }: { locale?: 'he' | 'en' }) {
  useEffect(() => {
    const copy = COPY[locale]

    const patch = () => {
      const launcher = document.querySelector<HTMLAnchorElement>('.asw-menu-btn')
      if (launcher && launcher.getAttribute('aria-label') !== copy.open) {
        launcher.setAttribute('aria-label', copy.open)
        launcher.setAttribute('title', copy.open)
      }
      const statement = document.querySelector<HTMLAnchorElement>('#asw-statement-link')
      if (statement && statement.getAttribute('href') !== copy.statementPath) {
        statement.setAttribute('href', copy.statementPath)
        statement.removeAttribute('target')
        statement.textContent = copy.statement
        statement.style.display = ''
      }
      return Boolean(launcher && statement)
    }

    if (patch()) return
    const observer = new MutationObserver(() => {
      if (patch()) observer.disconnect()
    })
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [locale])

  return null
}
