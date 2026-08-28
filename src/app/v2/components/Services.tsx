'use client'

import { useState } from 'react'
import ActionButton from './ActionButton'
import SectionHeading from './SectionHeading'
import Eyebrow from './Eyebrow'
import Chip from './Chip'
import TabList from './TabList'
import TabAnchors from './TabAnchors'
import WideCta from './WideCta'
import GridRule from './GridRule'
import { SparkIcon } from './icons'
import { serviceTabs, services } from '../content'
import styles from './Services.module.css'

export default function Services() {
  const [activeId, setActiveId] = useState(serviceTabs[0].id)
  const active = serviceTabs.find((tab) => tab.id === activeId) ?? serviceTabs[0]

  return (
    <section id="v2-services" className={styles.services} aria-labelledby="v2-services-heading">
      <TabAnchors prefix="v2-service" tabs={serviceTabs} onSelect={setActiveId} />
      <div className={styles.inner}>
        <div className={styles.lead} data-reveal-item>
          <div className={styles.rules} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <p className={styles.leadText}>{services.lead.text}</p>
          <ActionButton href={services.lead.action.href} label={services.lead.action.label} />
        </div>

        <GridRule />

        <div className={styles.body}>
          <span className={styles.centerLine} aria-hidden="true" />

          <div className={styles.content} data-reveal-item>
            <Eyebrow label={services.eyebrow} dot="rtl" />

            <SectionHeading
              id="v2-services-heading"
              lines={services.heading}
              align="start"
              className={styles.heading}
            />

            <p className={styles.lede}>{services.lede}</p>

            <TabList
              tabs={serviceTabs}
              activeId={activeId}
              onSelect={setActiveId}
              className={styles.tabs}
            />

            <div className={styles.panel}>
              <p className={styles.panelHead}>
                <SparkIcon className={styles.panelIcon} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/megaphone.svg" alt="" className={styles.panelIconMobile} />
                {active.label}
              </p>

              <div className={styles.panelTags}>
                {active.tags.map((tag) => (
                  <Chip key={tag} tone="light">
                    {tag}
                  </Chip>
                ))}
              </div>

              <h3 className={styles.panelQuestion}>{active.question}</h3>
              {active.paragraphs.map((text) => (
                <p key={text} className={styles.panelText}>
                  {text}
                </p>
              ))}
            </div>

            <WideCta
              href={active.action.href}
              label={active.action.label}
              className={styles.panelCta}
            />
          </div>

          <div className={styles.visualRule}>
            <GridRule />
          </div>

          <div className={styles.visual}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/services-view-bg.jpg" alt="" className={styles.visualImage} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/services-view.png" alt="" className={styles.visualCard} />
          </div>

          <ActionButton
            href={active.action.href}
            label={active.action.label}
            className={styles.panelCtaMobile}
          />
        </div>

        <GridRule />
      </div>
    </section>
  )
}
