import type { ReactNode } from 'react'
import DocumentEndSentinel from '@/components/layout/DocumentEndSentinel'

type Props = {
  children: ReactNode
  /** Appended to the sticky wrapper (e.g. z-index, extra margins). */
  className?: string
}

/**
 * Sticky footer + scroll marker **after** the sticky box so the marker only hits the viewport
 * at the real end of the document (not while the footer is stuck mid-page).
 */
export default function StickyPageFooter({ children, className = '' }: Props) {
  return (
    <>
      <div className={`sticky bottom-0 mt-auto w-full ${className}`.trim()}>{children}</div>
      <DocumentEndSentinel />
    </>
  )
}
