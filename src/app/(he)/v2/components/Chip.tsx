import type { ReactNode } from 'react'
import styles from './Chip.module.css'

export default function Chip({
  children,
  tone = 'dark',
  className,
}: {
  children: ReactNode
  tone?: 'dark' | 'light'
  className?: string
}) {
  return (
    <span className={[styles.chip, styles[tone], className].filter(Boolean).join(' ')}>
      {children}
    </span>
  )
}
