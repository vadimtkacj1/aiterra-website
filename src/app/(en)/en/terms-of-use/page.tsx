import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/metadata'
import LegalPage from '../../../(he)/v2/components/LegalPage'
import TermsBodyEn, { LAST_UPDATED } from '@/components/legal/en/TermsBodyEn'

const TITLE = 'Terms of use'

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description:
    'The terms of use for the AITERRA website: intellectual property, limitation of liability, permitted use, governing law and how to contact us.',
  path: '/en/terms-of-use',
  locale: 'en',
  altPath: '/terms-of-use',
})

export default function EnTermsPage() {
  return (
    <LegalPage title={TITLE} lastUpdated={LAST_UPDATED} locale="en">
      <TermsBodyEn />
    </LegalPage>
  )
}
