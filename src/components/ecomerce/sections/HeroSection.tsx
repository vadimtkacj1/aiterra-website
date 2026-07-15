import { ArrowLeft } from 'lucide-react'
import NumberTicker from '@/components/ecomerce/ui/number-ticker'
import IntegrationsTicker from '@/components/ecomerce/ui/integrations-ticker'
import Storefront3D from '@/components/ecomerce/ui/storefront-3d'

const STATS: { value: number | string; suffix?: string; label: string }[] = [
  { value: '2–8', label: 'שבועות להשקה' },
  { value: 12, label: 'חודשי ליווי צמוד' },
  { value: 100, suffix: '%', label: 'מערכת בהתאמה אישית' },
  { value: 5, label: 'מומחים בצוות שלכם' },
]

/**
 * Asymmetric hero on the paper band. The headline hangs off the RTL start
 * edge instead of floating centred; the pitch and the actions sit in a ruled
 * rail beside it. Below, the stats are set as a ledger row — hairline-divided
 * cells, not four numbers drifting in space — and the integrations run as a
 * ticker strip banded top and bottom by rules.
 */
export default function HeroSection() {
  return (
    <section id="hero" dir="rtl" className="band-paper relative overflow-hidden">
      {/* On a phone the hero shares its first paint with two fixed overlays — the
          consent bar across the foot and the a11y launcher lifted above it — and
          both land exactly where the actions do. The vertical budget above the
          CTAs is therefore spent, not decorative: every gap here is sized so the
          buttons clear both overlays before either has been dismissed. */}
      <div className="col-rules mx-auto max-w-7xl px-5 pt-24 pb-16 md:px-8 md:pt-40 md:pb-20">
        <div className="relative z-10">
          {/* meta rail — `dir` stays off the auto-margin element: setting it
              here would flip that element's own inline axis and send ms-auto
              the wrong way. */}
          <div className="rule-draw-b rule-draw-load flex items-center gap-4 pb-4">
            <span className="mark t-accent text-[13px] font-bold">00</span>
            <span className="label t-dim">E-Commerce Studio</span>
            <span className="ms-auto hidden sm:block">
              <span dir="ltr" className="label t-dim">
                Tel Aviv · Est. 2024
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 gap-y-8 pt-6 md:gap-y-10 md:pt-10 lg:grid-cols-12 lg:gap-x-12 lg:pt-14">
            {/* headline column. `dir="ltr"` keeps the Latin sentence and its
                period in the right order; `items-end` still hangs the block off
                the page's RTL start edge, so it lines up with everything else. */}
            <div className="lg:col-span-7">
              {/* Each line rises into a clipped box, the second a beat behind
                  the first — the sheet pulled off a drawing. On load, not on
                  scroll: the hero is already on screen, so a line waiting for an
                  observer would never move at all.

                  The clamp floor is measured, not chosen: 32px is the largest
                  size at which BOTH lines still fit unwrapped in a 360px column.
                  Anything larger wraps them into four ragged lines, and the
                  couplet — the solid line answered by the hollow one — is only a
                  gesture while it is two lines. The floor binds below ~645px, so
                  the desktop ramp is untouched.

                  A flat floor holds that measurement at 360px and then keeps it
                  on screens NARROWER than the column it was measured in, where it
                  is no longer the largest size that fits — it is simply too big,
                  and the couplet breaks apart one word per line. So the floor is
                  itself fluid below 360 (8.9vw = 32px at exactly 360), which is
                  the same measurement expressed as a ratio instead of a number. */}
              <h1 dir="ltr" className="display flex flex-col items-end text-end">
                <span
                  className="line-mask"
                  style={{ fontSize: 'clamp(min(32px, 8.9vw), 6.2vw, 88px)' }}
                >
                  <span>Built to Sell.</span>
                </span>
                <span
                  className="line-mask"
                  style={{ fontSize: 'clamp(min(32px, 8.9vw), 6.2vw, 88px)' }}
                >
                  <span className="display-outline" style={{ animationDelay: '120ms' }}>
                    Made to Scale.
                  </span>
                </span>
              </h1>

              <h2 className="mt-6 max-w-2xl text-[26px] leading-[1.08] sm:text-[34px] md:mt-10 md:text-[44px]">
                רוצים חנות אינטרנטית שבאמת מייצרת מכירות?
              </h2>
              <p className="t-muted mt-4 max-w-xl text-[17px] md:text-[20px]">
                אל תתפשרו על פלטפורמות גנריות.
              </p>

              {/* The actions belong directly under the promise, not down in the
                  rail: the primary CTA reads best the moment the headline has
                  finished making its claim. */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-10">
                <a href="#lead-form" className="btn btn-primary">
                  אני רוצה חנות פרימיום
                  <ArrowLeft className="btn-arrow h-[1.05em] w-[1.05em]" strokeWidth={2.4} />
                </a>
                <a href="#advantages" className="btn btn-outline">
                  למה דווקא Aiterra?
                </a>
              </div>
            </div>

            {/* The rail is the object's own field. Sharing a column with body
                copy and two buttons made the drawing read as an afterthought;
                given the space opposite the display type, it becomes the
                headline's counterweight. The pitch drops below it as detail. */}
            <div className="lg:col-span-5 lg:rule-s lg:ps-12">
              <Storefront3D />

              <p className="t-muted mt-8 max-w-xl text-[15px] leading-relaxed md:mt-10 md:text-[16px]">
                ב-Aiterra אנחנו לא משתמשים בתבניות. אנחנו מפתחים עבורכם מערכת
                איקומרס עצמאית ומתקדמת – ללא מגבלות של וורדפרס או שופיפיי. החל
                מעיצוב מותאם אישית, דרך פיתוח טכנולוגי מתקדם, ועד ליווי צמוד לשנה
                שלמה כדי להבטיח שהחנות שלכם תהפוך למכונת מכירות.
              </p>
            </div>
          </div>

          {/* ---- stats ledger ----
              Kept inside the ruled container so the column grid runs the full
              height of the hero and terminates on the ledger's own rule, rather
              than stopping in mid-air. */}
          <dl className="rule-t rule-b mt-16 grid grid-cols-2 sm:grid-cols-4 md:mt-28">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                // Two columns on mobile, four on sm+. The dividing rules have to
                // follow the reflow: the second cell of each mobile row takes a
                // start rule, the second row takes a top rule, and both are
                // recomputed once every cell sits on one line.
                className={[
                  'flex flex-col gap-2 px-4 py-7 md:px-6 md:py-9',
                  i % 2 === 1 && 'rule-s',
                  i > 0 && 'sm:rule-s',
                  i >= 2 && 'rule-t sm:border-t-0',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <dt className="font-brutalist text-[32px] font-bold tracking-[-0.03em] md:text-[44px]">
                  {typeof s.value === 'number' ? (
                    <NumberTicker value={s.value} suffix={s.suffix} />
                  ) : (
                    s.value
                  )}
                </dt>
                <dd className="t-dim text-[13px] leading-tight md:text-[12.5px]">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ---- integration ticker strip ----
          The last thing on the paper band before the manifesto inverts to ink:
          the claim gets its proof — every system already wired in — at the exact
          point the reader decides whether to keep scrolling. */}
      <IntegrationsTicker />
    </section>
  )
}
