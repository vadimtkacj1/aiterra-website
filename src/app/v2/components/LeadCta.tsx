import ActionButton from './ActionButton'
import GridRule from './GridRule'
import { getV2Content } from '@/lib/v2-content-server'
import styles from './LeadCta.module.css'

type LeadCtaProps = {
  text?: string
  action?: { label: string; href: string }
}

export default function LeadCta(props: LeadCtaProps) {
  const { services } = getV2Content()
  const { text = services.lead.text, action = services.lead.action } = props

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
