import type { CSSProperties } from 'react'
import ActionButton from './ActionButton'
import Eyebrow from './Eyebrow'
import SectionHeading from './SectionHeading'
import { servicesStack } from '../content'
import styles from './ServicesStack.module.css'

export default function ServicesStack() {
  return (
    <section id="v2-services" className={styles.section} aria-labelledby="v2-services-stack-heading">
      <div className={styles.inner}>
        <div className={styles.head}>
          <Eyebrow label={servicesStack.eyebrow} />
          <SectionHeading
            id="v2-services-stack-heading"
            lines={servicesStack.heading}
            className={styles.heading}
          />
          <p className={styles.lede}>{servicesStack.lede}</p>
        </div>

        <ol className={styles.list}>
          {servicesStack.items.map((item, index) => (
            <li
              key={item.id}
              id={`v2-service-${item.id}`}
              className={styles.item}
              style={{ '--index': index } as CSSProperties}
            >
              <article className={styles.card}>
                <div className={styles.body}>
                  <h3 className={styles.title}>{item.title}</h3>

                  <ul className={styles.tags}>
                    {item.tags.map((tag) => (
                      <li key={tag} className={styles.tag}>
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <p className={styles.text}>{item.text}</p>

                  <ActionButton
                    href={item.action.href}
                    label={item.action.label}
                    className={styles.action}
                  />
                </div>

                <figure className={styles.art}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" className={styles.artImage} loading="lazy" />
                </figure>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
