import Link from 'next/link'
import type { ReactNode } from 'react'
import styles from './ActionButton.module.css'

type ActionButtonProps = {
  href: string
  label: string
  variant?: 'primary' | 'outline'
  className?: string
  labelClassName?: string
}

export default function ActionButton({
  href,
  label,
  variant = 'primary',
  className,
  labelClassName,
}: ActionButtonProps) {
  const classNames = [styles.action, variant === 'outline' ? styles.outline : '', className]
    .filter(Boolean)
    .join(' ')

  const content: ReactNode = (
    <>
      <span className={labelClassName}>{label}</span>
      <span className={styles.icon}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/plus.svg" alt="" width={14} height={14} className={styles.iconGlyph} />
      </span>
    </>
  )

  if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http') || href.includes('#')) {
    return (
      <a href={href} className={classNames}>
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={classNames}>
      {content}
    </Link>
  )
}
