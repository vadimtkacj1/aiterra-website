import Link from 'next/link'
import { SERVICE_GUIDES } from '@/lib/service-guides'
import styles from './RelatedServices.module.css'

const KIND_LABEL = { guide: 'מדריך', tool: 'כלי חינמי' } as const

export default function ServiceGuides({ slug }: { slug: string }) {
  const links = SERVICE_GUIDES[slug]
  if (!links?.length) return null

  return (
    <section className={styles.related} aria-labelledby={`service-guides-${slug}`}>
      <h2 id={`service-guides-${slug}`} className={styles.heading}>
        מדריכים וכלים חינמיים בנושא
      </h2>
      <ul className={styles.list}>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={styles.card}>
              <span className={styles.label}>{link.label}</span>
              <span className={styles.blurb}>{KIND_LABEL[link.kind]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
