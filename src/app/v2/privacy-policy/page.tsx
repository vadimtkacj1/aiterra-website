import type { Metadata } from 'next'
import LegalPage from '../components/LegalPage'
import PrivacyBody, { LAST_UPDATED } from '@/components/legal/PrivacyBody'

const TITLE = 'מדיניות פרטיות'

export const metadata: Metadata = {
  title: TITLE,
  description: 'מדיניות הפרטיות של AITERRA.',
}

export default function V2PrivacyPage() {
  return (
    <LegalPage title={TITLE} lastUpdated={LAST_UPDATED}>
      <PrivacyBody />
    </LegalPage>
  )
}
