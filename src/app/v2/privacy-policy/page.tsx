import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/metadata'
import LegalPage from '../components/LegalPage'
import PrivacyBody, { LAST_UPDATED } from '@/components/legal/PrivacyBody'

const TITLE = 'מדיניות פרטיות'

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description:
    'מדיניות הפרטיות של AITERRA: אילו נתונים אנחנו אוספים באתר, למה הם משמשים, כמה זמן הם נשמרים ואיך תוכלו לממש את זכויותיכם.',
  path: '/privacy-policy',
})

export default function V2PrivacyPage() {
  return (
    <LegalPage title={TITLE} lastUpdated={LAST_UPDATED}>
      <PrivacyBody />
    </LegalPage>
  )
}
