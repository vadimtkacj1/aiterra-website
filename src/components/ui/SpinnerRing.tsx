import type { ReactElement } from 'react'

const variants = {
  'on-light':
    'border-[3px] border-gray-200/90 border-t-[#3E96F9] shadow-sm [animation-duration:0.85s]',
  'on-dark':
    'border-2 border-white/15 border-l-[#3E96F9] border-t-transparent [animation-duration:0.85s]',
} as const

export type SpinnerRingVariant = keyof typeof variants

export function SpinnerRing({
  variant = 'on-light',
  className = 'h-14 w-14',
  'aria-label': ariaLabel,
}: {
  variant?: SpinnerRingVariant
  className?: string
  'aria-label'?: string
}): ReactElement {
  return (
    <div
      className={`shrink-0 rounded-full animate-spin ${variants[variant]} ${className}`}
      role={ariaLabel ? 'status' : 'presentation'}
      aria-label={ariaLabel}
    />
  )
}
