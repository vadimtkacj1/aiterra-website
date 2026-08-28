import ActionButton from './ActionButton'
import SectionHeading from './SectionHeading'
import Eyebrow from './Eyebrow'
import GridRule from './GridRule'
import { about, aboutRoles } from '../content'
import type { AboutRole } from '../content'
import styles from './About.module.css'

type AboutProps = {
  eyebrow?: string
  heading?: string[]
  lede?: string
  roles?: AboutRole[]
  outro?: string
  action?: { label: string; href: string }
  headingId?: string
}

export default function About({
  eyebrow = about.eyebrow,
  heading = about.heading,
  lede = about.lede,
  roles = aboutRoles,
  outro = about.outro,
  action = about.action,
  headingId = 'v2-about-heading',
}: AboutProps) {
  return (
    <section className={styles.about} aria-labelledby={headingId}>
      <div className={styles.inner}>
        <div className={styles.intro}>
          <div className={styles.introRail} aria-hidden="true" />

          <div className={styles.introMain} data-reveal-item>
            <Eyebrow label={eyebrow} className={styles.eyebrow} />

            <SectionHeading id={headingId} lines={heading} className={styles.heading} />

            <p className={styles.lede}>{lede}</p>
          </div>

          <div className={styles.introRail} aria-hidden="true" />
        </div>

        <GridRule />

        <div className={styles.roles} data-reveal-stagger>
          {roles.map((role) => (
            <article key={role.id} className={styles.card} tabIndex={0} data-reveal-item>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/arrow-up-right.svg"
                alt=""
                width={54}
                height={54}
                className={styles.cardArrow}
              />

              <div className={styles.cardArt}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={role.art} alt="" className={styles.cardArtImage} />
              </div>

              <h3 className={styles.cardTitle}>{role.title}</h3>

              <div className={styles.cardReveal}>
                <div className={styles.cardRevealInner}>
                  <p className={styles.cardText}>{role.text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <GridRule />

        <div className={styles.outro} data-reveal-item>
          <p className={styles.outroText}>{outro}</p>
          <ActionButton href={action.href} label={action.label} className={styles.outroAction} />
        </div>
      </div>
    </section>
  )
}
