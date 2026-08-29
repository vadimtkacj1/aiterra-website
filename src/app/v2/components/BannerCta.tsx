import ActionButton from './ActionButton'
import type { ServicePage } from '../content'
import styles from './BannerCta.module.css'

type ServiceBanner = NonNullable<ServicePage['banner']>

export default function BannerCta({
  banner,
  headingId,
}: {
  banner: ServiceBanner
  headingId: string
}) {
  return (
    <section className={styles.banner} aria-labelledby={headingId}>
      <div className={styles.card} data-reveal-item>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={banner.art} alt="" className={styles.art} />

        <div className={styles.content}>
          <h2 id={headingId} className={styles.heading}>
            {banner.heading}
          </h2>

          <ActionButton
            href={banner.action.href}
            label={banner.action.label}
            variant="paper"
            glyph="prev"
            className={styles.action}
          />
        </div>
      </div>
    </section>
  )
}
