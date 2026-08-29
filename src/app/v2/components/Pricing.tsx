import Link from 'next/link'
import ActionButton from './ActionButton'
import Eyebrow from './Eyebrow'
import SectionHeading from './SectionHeading'
import {
  AlertsIcon,
  ApiIcon,
  AutomationIcon,
  CatalogIcon,
  CrossMark,
  InventoryIcon,
  ManagerIcon,
  ProductsIcon,
  ReportIcon,
  ShippingIcon,
  StorefrontIcon,
  StoresIcon,
  SupportIcon,
  TailorIcon,
  TrainingIcon,
} from './icons'
import type { ServicePage } from '../content'
import styles from './Pricing.module.css'

const ICONS = {
  storefront: StorefrontIcon,
  products: ProductsIcon,
  inventory: InventoryIcon,
  dashboard: CatalogIcon,
  automation: AutomationIcon,
  report: ReportIcon,
  shipping: ShippingIcon,
  alerts: AlertsIcon,
  support: SupportIcon,
  stores: StoresIcon,
  tailor: TailorIcon,
  api: ApiIcon,
  manager: ManagerIcon,
  training: TrainingIcon,
}

type ServicePricing = NonNullable<ServicePage['pricing']>

export default function Pricing({
  pricing,
  headingId,
}: {
  pricing: ServicePricing
  headingId: string
}) {
  return (
    <section className={styles.pricing} aria-labelledby={headingId}>
      <div className={styles.inner}>
        <div className={styles.head} data-reveal-item>
          <Eyebrow label={pricing.eyebrow} />

          <SectionHeading id={headingId} lines={pricing.heading} className={styles.heading} />

          <p className={styles.lede}>{pricing.lede}</p>
        </div>

        <div className={styles.board} data-reveal-stagger>
          <CrossMark className={[styles.cross, styles.crossTopStart].join(' ')} />
          <CrossMark className={[styles.cross, styles.crossTopEnd].join(' ')} />
          <CrossMark className={[styles.cross, styles.crossBottomStart].join(' ')} />
          <CrossMark className={[styles.cross, styles.crossBottomEnd].join(' ')} />

          {pricing.plans.map((plan) => (
            <article
              key={plan.id}
              className={[styles.plan, plan.featured ? styles.featured : ''].filter(Boolean).join(' ')}
              data-reveal-item
            >
              {plan.badge ? <p className={styles.badge}>{plan.badge}</p> : null}

              <div className={styles.planBody}>
                <h3 className={styles.name}>{plan.name}</h3>

                <p className={styles.audience}>{plan.audience}</p>

                <p className={styles.priceRow}>
                  <span className={plan.priceNote ? styles.price : styles.priceText}>{plan.price}</span>
                  {plan.priceNote ? <span className={styles.priceNote}>{plan.priceNote}</span> : null}
                </p>

                <p className={styles.term}>{plan.term}</p>

                <ActionButton
                  href={plan.action.href}
                  label={plan.action.label}
                  glyph="swap"
                  className={styles.cta}
                />

                <h4 className={styles.featuresTitle}>{plan.featuresTitle}</h4>

                <ul className={styles.features} role="list">
                  {plan.features.map((feature) => {
                    const Icon = ICONS[feature.icon]

                    return (
                      <li key={feature.label} className={styles.feature}>
                        <Icon className={styles.featureIcon} />
                        <span>{feature.label}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <p className={styles.footnote}>
          {pricing.footnote.text}{' '}
          <Link href={pricing.footnote.link.href} className={styles.footnoteLink}>
            {pricing.footnote.link.label}
          </Link>
        </p>
      </div>
    </section>
  )
}
