import { getV2Content } from '@/lib/v2-content-server'
import type { PartnerLogo } from '@/app/v2/content'
import styles from './Partners.module.css'

function Row({ logos, clone = false }: { logos: PartnerLogo[]; clone?: boolean }) {
  return (
    <ul className={styles.row} aria-hidden={clone || undefined}>
      {logos.map((logo) => (
        <li key={logo.src}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo.src}
            alt={clone ? '' : logo.name}
            className={styles.logo}
            style={{ height: `calc(var(--partner-logo-h) * ${logo.scale ?? 1})` }}
            decoding="async"
          />
          {!logo.hideName && <span className={styles.name}>{logo.name}</span>}
        </li>
      ))}
    </ul>
  )
}

export default function Partners() {
  const { partners } = getV2Content()

  return (
    <section className={styles.partners} aria-label={partners.caption}>
      <div className={styles.inner}>
        <p className={styles.caption} data-reveal-item>{partners.caption}</p>
        <div className={styles.viewport} dir="ltr" data-reveal-item>
          <div className={styles.track}>
            <Row logos={partners.logos} />
            <Row logos={partners.logos} clone />
          </div>
        </div>
      </div>
    </section>
  )
}
