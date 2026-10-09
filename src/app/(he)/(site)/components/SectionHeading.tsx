import styles from './SectionHeading.module.css'

type SectionHeadingProps = {
  lines: string[]
  as?: 'h1' | 'h2' | 'h3'
  size?: 'hero' | 'section'
  align?: 'center' | 'start'
  id?: string
  className?: string
}

export default function SectionHeading({
  lines,
  as = 'h2',
  size = 'section',
  align = 'center',
  id,
  className,
}: SectionHeadingProps) {
  const Tag = as as 'h2'

  return (
    <Tag id={id} className={[styles.heading, styles[size], align === 'start' ? styles.alignStart : '', className]
        .filter(Boolean)
        .join(' ')}>
      {lines.map((line, index) => (
        <span key={line} className={styles.line}>
          {index > 0 ? ' ' : null}
          {line}
        </span>
      ))}
    </Tag>
  )
}
