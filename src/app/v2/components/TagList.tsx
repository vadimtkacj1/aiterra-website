import styles from './TagList.module.css'

type TagListProps = {
  tags: string[]
  align?: 'start' | 'center'
  className?: string
}

export default function TagList({ tags, align = 'start', className }: TagListProps) {
  return (
    <p
      className={[styles.tags, align === 'center' ? styles.center : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      {tags.map((tag, index) => (
        <span key={tag} className={styles.group}>
          {index > 0 ? <span className={styles.mark} aria-hidden="true" /> : null}
          {tag}
        </span>
      ))}
    </p>
  )
}
