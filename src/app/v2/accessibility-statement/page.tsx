import type { Metadata } from 'next'
import LegalPage from '../components/LegalPage'
import AccessibilityBody, { LAST_UPDATED } from '@/components/legal/AccessibilityBody'

const TITLE = 'הצהרת נגישות'

export const metadata: Metadata = {
  title: TITLE,
  description: 'הצהרת הנגישות של אתר AITERRA.',
}

export default function V2AccessibilityPage() {
  return (
    <LegalPage title={TITLE} lastUpdated={LAST_UPDATED}>
      <AccessibilityBody />
    </LegalPage>
  )
}
