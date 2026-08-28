import ActionButton from './ActionButton'
import GridRule from './GridRule'
import { services } from '../content'
import styles from './LeadCta.module.css'

type LeadCtaProps = {
  text?: string
  action?: { label: string; href: string }
}

export default function LeadCta({ text = services.lead.text, action = services.lead.action }: LeadCtaProps) {
  return (
    <section className={styles.section} aria-label={text}>
      <div className={styles.lead} data-reveal-item>
        <div className={styles.rules} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className={styles.text}>{text}</p>
        <ActionButton href={action.href} label={action.label} />
      </div>
      <GridRule />
    </section>
  )
}
