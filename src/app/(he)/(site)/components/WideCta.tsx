import Link from 'next/link'
import CircleButton from './CircleButton'
import styles from './WideCta.module.css'

type WideCtaProps = {
  href: string
  label: string
  tone?: 'accent' | 'soft'
  className?: string
}

export default function WideCta({ href, label, tone = 'accent', className }: WideCtaProps) {
  return (
    <Link href={href} className={[styles.cta, styles[tone], className].filter(Boolean).join(' ')}>
      <span>{label}</span>
      <CircleButton label={label} tone={tone === 'accent' ? 'onAccent' : 'onSoft'} as="span" />
    </Link>
  )
}
