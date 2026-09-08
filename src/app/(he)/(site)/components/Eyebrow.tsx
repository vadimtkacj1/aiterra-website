import styles from './Eyebrow.module.css'

export default function Eyebrow({
  label,
  dot = 'ltr',
  className,
}: {
  label: string
  dot?: 'ltr' | 'rtl'
  className?: string
}) {
  return (
    <p className={[styles.eyebrow, styles[dot], className].filter(Boolean).join(' ')}>
      <span className={styles.dot} aria-hidden="true" />
      {label}
    </p>
  )
}
