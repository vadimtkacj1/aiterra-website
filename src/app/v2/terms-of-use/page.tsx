import type { Metadata } from 'next'
import LegalPage from '../components/LegalPage'
import TermsBody, { LAST_UPDATED } from '@/components/legal/TermsBody'
import { pageMetadata } from '@/lib/metadata'

const TITLE = 'תקנון ותנאי שימוש'

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description:
    'תקנון ותנאי השימוש באתר AITERRA: זכויות יוצרים, שימוש בתכנים, אחריות, מדיניות תשלומים והדין החל.',
  path: '/terms-of-use',
})

export default function V2TermsPage() {
  return (
    <LegalPage title={TITLE} lastUpdated={LAST_UPDATED}>
      <TermsBody />
    </LegalPage>
  )
}
