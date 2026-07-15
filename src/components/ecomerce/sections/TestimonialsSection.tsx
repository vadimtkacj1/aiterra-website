import { Star } from 'lucide-react'
import Reveal from '@/components/ecomerce/ui/Reveal'
import NumberTicker from '@/components/ecomerce/ui/number-ticker'
import SectionHead from '@/components/ecomerce/ui/section-head'

type Testimonial = {
  quote: string
  name: string
  business: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'מאז שעברנו למערכת של Aiterra, האתר טס, חווית המשתמש השתפרה פלאים, וראינו זינוק מיידי בהמרות מהקמפיינים שלנו.',
    name: 'רועי לוינסון',
    business: 'מנכ״ל, Urban Cosmetics',
  },
  {
    quote:
      'הפסקנו להילחם בתבניות מוגבלות. קיבלנו חנות שבנויה בדיוק סביב המותג שלנו, והמעבר לתשלום הפך לחלק ומהיר. אחוזי הנטישה בעגלה צנחו והמכירות עלו כבר בחודש הראשון.',
    name: 'נועה שגב',
    business: 'מייסדת, Léa Studio · אופנה',
  },
  {
    quote:
      'הליווי הצמוד עשה את כל ההבדל. הצוות היה זמין לכל שאלה, האתר עומד בעומסים של מבצעים גדולים, וההחזר על ההשקעה הורגש כמעט מיד. סוף סוף פלטפורמה שגדלה איתנו.',
    name: 'איתי ברקוביץ׳',
    business: 'בעלים, VitaPeak · תוספי תזונה',
  },
]

type TrustStat = {
  value: number
  prefix?: string
  suffix?: string
  decimalPlaces?: number
  label: string
}

const TRUST_STATS: TrustStat[] = [
  { value: 4.9, decimalPlaces: 1, label: 'דירוג ממוצע מלקוחות' },
  { value: 96, suffix: '%', label: 'ממליצים לחבר' },
  { value: 40, prefix: '+', suffix: '%', label: 'עלייה ממוצעת בהמרות' },
]

function Stars() {
  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label="דירוג של חמישה כוכבים מתוך חמישה"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} aria-hidden className="h-3.5 w-3.5 fill-current" />
      ))}
    </div>
  )
}

/**
 * Ink band. The quotes stand in three ruled columns instead of scrolling past
 * in a marquee — a testimonial you cannot finish reading is not social proof.
 * Below them, the trust numbers close the section as a ledger row.
 */
export default function TestimonialsSection() {
  return (
    <section id="testimonials" dir="rtl" className="band-ink">
      <div className="col-rules mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="relative z-10">
          <SectionHead
            index="05"
            label="סיפורי הצלחה"
            title="מה אומרים בעלי העסקים שבחרו לעלות שלב?"
            lede="מותגים שעברו ל-Aiterra מדברים על אותו הדבר: חנות מהירה, חוויית קנייה שמוכרת, וצוות שנמצא לצידם בכל שלב."
          />

          <ul className="rule-t mt-16 grid grid-cols-1 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal
                key={t.name}
                as="li"
                delay={i * 90}
                className={[
                  'rule-b flex flex-col gap-7 py-10 lg:pe-8 lg:py-12',
                  i > 0 && 'lg:rule-s lg:ps-8',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <figure className="flex h-full flex-col gap-7">
                  <Stars />

                  <blockquote className="flex-1">
                    <p className="text-[16px] leading-relaxed md:text-[17px]">
                      {t.quote}
                    </p>
                  </blockquote>

                  <figcaption className="rule-t flex flex-col gap-1 pt-5">
                    <span className="font-brutalist text-[15px] font-bold">
                      {t.name}
                    </span>
                    <span className="t-dim text-[13px]">{t.business}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>

          {/* trust ledger */}
          <dl className="rule-b grid grid-cols-1 sm:grid-cols-3">
            {TRUST_STATS.map((s, i) => (
              <div
                key={s.label}
                className={[
                  'flex items-baseline gap-4 py-7 sm:flex-col sm:items-start sm:gap-2 sm:pe-6',
                  i > 0 && 'rule-t sm:border-t-0 sm:rule-s sm:ps-6',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <dt className="font-brutalist text-[30px] font-bold tracking-[-0.03em] md:text-[40px]">
                  <NumberTicker
                    value={s.value}
                    prefix={s.prefix}
                    suffix={s.suffix}
                    decimalPlaces={s.decimalPlaces}
                  />
                </dt>
                {/* Single column, so the row is a ledger line and must answer at
                    both ends of its measure — the number at the start, the caption
                    pushed to the far end. Above sm the row becomes a column and the
                    auto margin must not apply. */}
                <dd className="t-dim text-[12.5px] leading-tight max-sm:ms-auto">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
