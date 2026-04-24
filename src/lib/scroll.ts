/** Distance from the bottom of the document (px) to treat as "end of page". */
export const PAGE_BOTTOM_THRESHOLD_PX = 80

export function isAtPageBottom(thresholdPx: number = PAGE_BOTTOM_THRESHOLD_PX): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false
  const doc = document.documentElement
  const bottomGap = doc.scrollHeight - (window.scrollY + window.innerHeight)
  return bottomGap <= thresholdPx
}
