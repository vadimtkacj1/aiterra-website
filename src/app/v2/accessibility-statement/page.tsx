import type { Metadata } from 'next'
import LegalPage from '../components/LegalPage'
import AccessibilityBody, { LAST_UPDATED } from '@/components/legal/AccessibilityBody'
import { pageMetadata } from '@/lib/metadata'

const TITLE = 'הצהרת נגישות'

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description:
    'הצהרת הנגישות של אתר AITERRA לפי תקן ישראלי 5568 ו-WCAG 2.1: התאמות שבוצעו, רכיב הנגישות באתר ודרכי פנייה לרכז הנגישות.',
  path: '/accessibility-statement',
})

export default function V2AccessibilityPage() {
  return (
    <LegalPage title={TITLE} lastUpdated={LAST_UPDATED}>
      <AccessibilityBody />
    </LegalPage>
  )
}
