import Eyebrow from './Eyebrow'
import SectionHeading from './SectionHeading'
import type { ServicePage } from '../content'
import styles from './HowItWorks.module.css'

type ServiceHowItWorks = NonNullable<ServicePage['howItWorks']>

export default function HowItWorks({
  howItWorks,
  headingId,
}: {
  howItWorks: ServiceHowItWorks
  headingId: string
}) {
  return (
    <section className={styles.how} aria-labelledby={headingId}>
      <div className={styles.inner}>
        <div className={styles.head} data-reveal-item>
          <Eyebrow label={howItWorks.eyebrow} />

          <SectionHeading id={headingId} lines={howItWorks.heading} className={styles.heading} />

          <p className={styles.lede}>{howItWorks.lede}</p>
        </div>

        <ol className={styles.steps}>
          {howItWorks.steps.map((step, index) => (
            <li key={step.id} className={styles.step} data-reveal-item>
              <div className={styles.stepText}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepBody}>{step.text}</p>
              </div>

              <span className={styles.badgeCell} aria-hidden="true">
                <span className={styles.badge}>{index + 1}</span>
              </span>

              <figure className={styles.stepArt}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={step.art} alt="" className={styles.stepArtImage} />
              </figure>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
