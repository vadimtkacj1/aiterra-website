import type { Metadata } from 'next'
import LegalPage from '../components/LegalPage'
import TermsBody, { LAST_UPDATED } from '@/components/legal/TermsBody'

const TITLE = 'תקנון ותנאי שימוש'

export const metadata: Metadata = {
  title: TITLE,
  description: 'תקנון ותנאי השימוש באתר AITERRA.',
}

export default function V2TermsPage() {
  return (
    <LegalPage title={TITLE} lastUpdated={LAST_UPDATED}>
      <TermsBody />
    </LegalPage>
  )
}
