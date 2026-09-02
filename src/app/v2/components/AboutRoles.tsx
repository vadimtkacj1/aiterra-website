'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import type { AboutRole } from '../content'
import styles from './About.module.css'

type AboutRolesProps = {
  roles: AboutRole[]
  href?: string
}

export default function AboutRoles({ roles, href }: AboutRolesProps) {
  const id = useId()
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (roleId: string) => {
    setOpenId((current) => (current === roleId ? null : roleId))
  }

  return (
    <div className={styles.roles} data-reveal-stagger>
      {roles.map((role) => {
        const open = role.id === openId
        const triggerId = `${id}-${role.id}-trigger`
        const panelId = `${id}-${role.id}-panel`

        return (
          <article
            key={role.id}
            className={styles.card}
            data-open={open ? 'true' : undefined}
            data-reveal-item
          >
            {href ? (
              <Link href={href} className={styles.cardCover} aria-label={role.title} />
            ) : null}

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

            <h3 className={styles.cardTitle}>
              <button
                type="button"
                id={triggerId}
                className={styles.cardTrigger}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(role.id)}
              >
                {role.title}
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={styles.cardReveal}
            >
              <div className={styles.cardRevealInner}>
                <p className={styles.cardText}>{role.text}</p>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
