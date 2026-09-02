import Eyebrow from './Eyebrow'
import SectionHeading from './SectionHeading'
import GridRule from './GridRule'
import ProjectsCarousel from './ProjectsCarousel'
import type { ServicePage } from '../content'
import styles from './ServiceCases.module.css'

type ServiceCasesProps = {
  cases: NonNullable<ServicePage['cases']>
  headingId: string
}

export default function ServiceCases({ cases, headingId }: ServiceCasesProps) {
  return (
    <section className={styles.cases} aria-labelledby={headingId}>
      <div className={styles.inner}>
        <div className={styles.head} data-reveal-item>
          <Eyebrow label={cases.eyebrow} />

          <SectionHeading id={headingId} lines={cases.heading} className={styles.heading} />
        </div>

        <GridRule columns={[1, 2, 1]} />

        <ProjectsCarousel
          items={cases.items}
          action={cases.cardAction}
          prevLabel={cases.prev}
          nextLabel={cases.next}
          showAction={false}
          fit="contain"
          zoomable
        />

        <div className={styles.below} />
      </div>
    </section>
  )
}
