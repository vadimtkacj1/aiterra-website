import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/metadata'
import LegalPage from '../../../(he)/(site)/components/LegalPage'
import AccessibilityBodyEn, { LAST_UPDATED } from '@/components/legal/en/AccessibilityBodyEn'

const TITLE = 'Accessibility statement'

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description:
    'The AITERRA accessibility statement: the standards we work to, the accessibility features on this site, known limitations and how to contact our accessibility coordinator.',
  path: '/en/accessibility-statement',
  locale: 'en',
  altPath: '/accessibility-statement',
})

export default function EnAccessibilityPage() {
  return (
    <LegalPage title={TITLE} lastUpdated={LAST_UPDATED} locale="en">
      <AccessibilityBodyEn />
    </LegalPage>
  )
}
