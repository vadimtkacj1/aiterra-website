'use client'

import { useEffect, useRef, useState } from 'react'
import Eyebrow from './Eyebrow'
import SectionHeading from './SectionHeading'
import GridRule from './GridRule'
import { ChevronPrevIcon } from './icons'
import { aboutPage } from '../content'
import styles from './AboutTeam.module.css'

export type TeamCard = {
  id: string
  name: string
  role: string
  bio: string
  image: string
  href: string
}

const stripParens = (value: string) => value.replace(/\s*\([^)]*\)\s*/g, ' ').trim() || value

export default function AboutTeam({ members }: { members: TeamCard[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const active = members.find((member) => member.id === openId) ?? null

  useEffect(() => {
    if (!active) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenId(null)
    }
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [active])

  if (members.length === 0) return null

  return (
    <section className={styles.team} aria-labelledby="v2-team-heading">
      <div className={styles.inner}>
        <div className={styles.head} data-reveal-item>
          <div className={styles.rules} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <Eyebrow label={aboutPage.teamEyebrow} />
          <SectionHeading id="v2-team-heading" lines={aboutPage.teamHeading} className={styles.heading} />
          <p className={styles.lede}>{aboutPage.teamLede}</p>
        </div>

        <GridRule columns={[1, 1, 1, 1]} />

        <ul className={styles.grid} data-reveal-stagger>
          {members.map((member) => (
            <li key={member.id} className={styles.cell} data-reveal-item>
              <article className={styles.card}>
                <button
                  type="button"
                  className={styles.photo}
                  onClick={() => setOpenId(member.id)}
                  aria-label={`${aboutPage.teamMore} ${stripParens(member.name)}`}
                >
                  {member.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.image} alt={member.name} className={styles.photoImage} loading="lazy" />
                  ) : null}
                </button>
                <div className={styles.body}>
                  <h3 className={styles.name}>{stripParens(member.name)}</h3>
                  <p className={styles.role}>{stripParens(member.role)}</p>
                  {member.bio ? <p className={styles.bio}>{member.bio}</p> : null}
                </div>
                <button type="button" className={styles.more} onClick={() => setOpenId(member.id)}>
                  <span>
                    {aboutPage.teamMore} {stripParens(member.name)}
                  </span>
                  <span className={styles.moreIcon} aria-hidden="true">
                    <ChevronPrevIcon className={styles.moreGlyph} />
                  </span>
                </button>
              </article>
            </li>
          ))}
        </ul>

        <GridRule columns={[1, 1, 1, 1]} />
      </div>

      {active ? (
        <div className={styles.overlay} role="presentation" onClick={() => setOpenId(null)}>
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="v2-team-modal-name"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              className={styles.close}
              aria-label={aboutPage.teamClose}
              onClick={() => setOpenId(null)}
            >
              <span className={styles.closeGlyph} aria-hidden="true" />
            </button>

            <figure className={styles.modalPhoto}>
              {active.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={active.image} alt={active.name} className={styles.modalImage} />
              ) : null}
            </figure>

            <div className={styles.modalBody}>
              <h3 id="v2-team-modal-name" className={styles.modalName}>
                {stripParens(active.name)}
              </h3>
              <p className={styles.modalRole}>{active.role}</p>
              {active.bio ? <p className={styles.modalBio}>{active.bio}</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
