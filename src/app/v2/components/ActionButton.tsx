import Link from 'next/link'
import type { MouseEvent, ReactNode } from 'react'
import { ChevronPrevIcon } from './icons'
import styles from './ActionButton.module.css'

type ActionButtonProps = {
  href: string
  label: string
  variant?: 'primary' | 'outline' | 'paper'
  glyph?: 'plus' | 'prev' | 'swap'
  className?: string
  labelClassName?: string
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
}

export default function ActionButton({
  href,
  label,
  variant = 'primary',
  glyph = 'plus',
  className,
  labelClassName,
  onClick,
}: ActionButtonProps) {
  const classNames = [styles.action, variant === 'primary' ? '' : styles[variant], className]
    .filter(Boolean)
    .join(' ')

  const content: ReactNode = (
    <>
      <span className={labelClassName}>{label}</span>
      <span className={styles.icon}>
        {glyph === 'prev' || glyph === 'swap' ? (
          <ChevronPrevIcon
            className={[styles.iconGlyph, glyph === 'swap' ? styles.glyphWide : ''].filter(Boolean).join(' ')}
          />
        ) : null}
        {glyph === 'plus' || glyph === 'swap' ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src="/images/plus.svg"
            alt=""
            width={14}
            height={14}
            className={[styles.iconGlyph, glyph === 'swap' ? styles.glyphNarrow : ''].filter(Boolean).join(' ')}
          />
        ) : null}
      </span>
    </>
  )

  if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http') || href.includes('#')) {
    return (
      <a href={href} className={classNames} onClick={onClick}>
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={classNames} onClick={onClick}>
      {content}
    </Link>
  )
}
