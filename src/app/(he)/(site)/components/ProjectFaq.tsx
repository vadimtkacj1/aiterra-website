import type { ProjectFaqEntry } from '@/lib/project-summary'
import styles from './ProjectFaq.module.css'

export default function ProjectFaq({ entries, heading }: { entries: ProjectFaqEntry[]; heading: string }) {
  if (!entries.length) return null
  return (
    <section className={styles.section} aria-labelledby="project-faq-heading">
      <h2 id="project-faq-heading" className={styles.heading}>
        {heading}
      </h2>
      {entries.map(({ question, answer }) => (
        <details key={question} className={styles.item}>
          <summary className={styles.question}>{question}</summary>
          <p className={styles.answer}>{answer}</p>
        </details>
      ))}
    </section>
  )
}
