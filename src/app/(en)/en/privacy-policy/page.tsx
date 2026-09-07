import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/metadata'
import LegalPage from '../../../(he)/v2/components/LegalPage'
import PrivacyBodyEn, { LAST_UPDATED } from '@/components/legal/en/PrivacyBodyEn'

const TITLE = 'Privacy policy'

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description:
    'The AITERRA privacy policy: what data we collect on the site, what it is used for, how long it is kept and how you can exercise your rights.',
  path: '/en/privacy-policy',
  locale: 'en',
  altPath: '/privacy-policy',
})

export default function EnPrivacyPage() {
  return (
    <LegalPage title={TITLE} lastUpdated={LAST_UPDATED} locale="en">
      <PrivacyBodyEn />
    </LegalPage>
  )
}
