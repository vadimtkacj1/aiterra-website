import Link from 'next/link'
import OnModelPromoButton from './OnModelPromoButton'
import styles from './OnModelPromo.module.css'

const STORE_TAGS = ['איקומרס', 'חנות אונליין', 'Shopify', 'WooCommerce']

const FRAME_WIDTH = 720
const FRAME_HEIGHT = 1166

type Frame = { src: string; alt: string }
type Pair = { id: string; before: Frame; after: Frame }

const PAIRS: Pair[] = [
  {
    id: 'dress',
    before: {
      src: '/images/promo/onmodel-dress-before.webp',
      alt: 'שמלה מכופתרת מפשתן בגוון ירוק מרווה, תלויה על קולב עץ על רקע קיר בהיר',
    },
    after: {
      src: '/images/promo/onmodel-dress-after.webp',
      alt: 'אותה שמלה מפשתן בגוון ירוק מרווה על דוגמנית דיגיטלית שעומדת ליד קיר בהיר',
    },
  },
  {
    id: 'overshirt',
    before: {
      src: '/images/promo/onmodel-overshirt-before.webp',
      alt: 'אוברשירט כחול כהה עם שני כיסי חזה, תלוי על קולב עץ על רקע קיר בהיר',
    },
    after: {
      src: '/images/promo/onmodel-overshirt-after.webp',
      alt: 'אותו אוברשירט כחול כהה על דוגמן דיגיטלי, מעל חולצת טי לבנה',
    },
  },
]

function PromoFrame({ frame, label }: { frame: Frame; label: string }) {
  return (
    <div className={styles.frame}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={frame.src}
        alt={frame.alt}
        width={FRAME_WIDTH}
        height={FRAME_HEIGHT}
        loading="lazy"
        decoding="async"
        className={styles.image}
      />
      <span className={styles.label}>{label}</span>
    </div>
  )
}

export default function OnModelPromo({ tags }: { tags: string[] }) {
  if (!tags.some((tag) => STORE_TAGS.includes(tag))) return null

  return (
    <section className={styles.block} aria-labelledby="onmodel-promo-heading">
      <h2 id="onmodel-promo-heading" className={styles.heading}>
        יש לכם תמונה של הבגד על קולב? נחזיר אותו על דוגמנית
      </h2>
      <p className={styles.text}>
        שולחים לנו תמונות של הפריט, ואנחנו מחזירים תמונות של אותו פריט על דוגמן או דוגמנית דיגיטליים, מוכנות
        לעמוד המוצר בחנות. בלי יום צילום.
      </p>
      <div className={styles.pairs}>
        {PAIRS.map((pair) => (
          <div key={pair.id} className={styles.pair}>
            <PromoFrame frame={pair.before} label="לפני" />
            <PromoFrame frame={pair.after} label="אחרי" />
          </div>
        ))}
      </div>
      <p className={styles.caption}>דוגמה שהכנו בעצמנו בבינה מלאכותית, לא פריטים של לקוח.</p>
      <div className={styles.actions}>
        <OnModelPromoButton href="/contact" label="שלחו לנו תמונה של פריט אחד" className={styles.button} />
        <Link href="/services/ecommerce" className={styles.quietLink}>
          בניית חנות אונליין
        </Link>
      </div>
    </section>
  )
}
