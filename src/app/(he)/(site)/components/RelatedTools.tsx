import Link from 'next/link'
import { relatedTools } from '@/lib/tool-matches'
import styles from './RelatedServices.module.css'

type Props = {
  title: string
  tags?: string[]
  excerpt?: string
  seed: string
}

export default function RelatedTools({ title, tags = [], excerpt = '', seed }: Props) {
  const picks = relatedTools(`${title} ${tags.join(' ')} ${excerpt}`, seed)
  if (!picks.length) return null

  return (
    <section className={styles.related} aria-label="כלים חינמיים לנושא">
      <h2 className={styles.heading}>כלים חינמיים לנושא</h2>
      <ul className={styles.list}>
        {picks.map((tool) => (
          <li key={tool.path}>
            <Link href={tool.path} className={styles.card}>
              <span className={styles.label}>{tool.title}</span>
              <span className={styles.blurb}>{tool.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
