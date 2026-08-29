import { getV2Content } from '@/lib/v2-content-server'
import styles from './Partners.module.css'

export default function Partners() {
  const { partners } = getV2Content()

  return (
    <section className={styles.partners} aria-label={partners.caption}>
      <div className={styles.inner}>
        <p className={styles.caption} data-reveal-item>{partners.caption}</p>
        <ul className={styles.logos} data-reveal-stagger>
          {partners.logos.map((logo) => (
            <li key={logo.src} data-reveal-item>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={logo.name}
                className={styles.logo}
                style={{ height: `calc(var(--partner-logo-h) * ${logo.scale ?? 1})` }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
