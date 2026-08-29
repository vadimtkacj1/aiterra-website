'use client'

import { useState } from 'react'
import Eyebrow from './Eyebrow'
import SectionHeading from './SectionHeading'
import WideCta from './WideCta'
import GridRule from './GridRule'
import { AnalyticsIcon, CatalogIcon, ClubIcon, OrdersIcon, SalesIcon } from './icons'
import type { ServicePage } from '../content'
import styles from './ManagementSystem.module.css'

const ICONS = {
  orders: OrdersIcon,
  club: ClubIcon,
  sales: SalesIcon,
  catalog: CatalogIcon,
  analytics: AnalyticsIcon,
}

type ServiceSystem = NonNullable<ServicePage['system']>

export default function ManagementSystem({
  system,
  headingId,
}: {
  system: ServiceSystem
  headingId: string
}) {
  const [activeId, setActiveId] = useState(system.features[0].id)

  return (
    <section className={styles.system} aria-labelledby={headingId}>
      <div className={styles.inner}>
        <GridRule />

        <div className={styles.body}>
          <span className={styles.centerLine} aria-hidden="true" />

          <div className={styles.content} data-reveal-item>
            <Eyebrow label={system.eyebrow} dot="rtl" />

            <SectionHeading
              id={headingId}
              lines={system.heading}
              align="start"
              className={styles.heading}
            />

            <ul className={styles.features}>
              {system.features.map((feature) => {
                const Icon = ICONS[feature.icon]
                const open = feature.id === activeId

                return (
                  <li
                    key={feature.id}
                    className={styles.feature}
                    data-active={open || undefined}
                  >
                    <button
                      type="button"
                      className={styles.featureHead}
                      aria-expanded={open}
                      aria-controls={`${headingId}-${feature.id}`}
                      onClick={() => setActiveId(feature.id)}
                    >
                      <Icon className={styles.featureIcon} />
                      {feature.title}
                    </button>

                    <div
                      id={`${headingId}-${feature.id}`}
                      className={styles.featureReveal}
                      role="region"
                    >
                      <div className={styles.featureRevealInner}>
                        <p className={styles.featureText}>{feature.text}</p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <WideCta
              href={system.action.href}
              label={system.action.label}
              className={styles.cta}
            />
          </div>

          <figure className={styles.art} data-reveal-item>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={system.art} alt="" className={styles.artImage} />
          </figure>
        </div>

        <GridRule />
      </div>
    </section>
  )
}
