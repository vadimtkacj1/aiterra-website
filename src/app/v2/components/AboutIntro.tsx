import Eyebrow from './Eyebrow'
import SectionHeading from './SectionHeading'
import GridRule from './GridRule'
import { getV2Content } from '@/lib/v2-content-server'
import styles from './AboutIntro.module.css'

export default function AboutIntro() {
  const { aboutPage } = getV2Content()

  return (
    <section className={styles.intro} aria-label={aboutPage.title}>
      <div className={styles.inner}>
        <GridRule columns={[1, 1, 1, 1]} />

        {aboutPage.blocks.map((block, index) => (
          <div key={block.id}>
            {index > 0 ? <GridRule columns={[1, 1, 1, 1]} /> : null}

            <div className={styles.block} data-flip={index % 2 === 1 || undefined}>
              <div className={styles.copy} data-reveal-item>
                <Eyebrow label={block.eyebrow} dot="rtl" />
                <SectionHeading
                  id={`v2-about-${block.id}`}
                  lines={block.heading}
                  align="start"
                  className={styles.heading}
                />
                <p className={styles.text}>{block.text}</p>
              </div>

              <figure className={styles.visual} data-reveal-item>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={block.image} alt="" className={styles.visualImage} loading={index === 0 ? 'eager' : 'lazy'} />
              </figure>
            </div>
          </div>
        ))}

        <GridRule columns={[1, 1, 1, 1]} />
      </div>
    </section>
  )
}
