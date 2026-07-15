import { ArrowLeft } from 'lucide-react'
import Reveal from '@/components/ecomerce/ui/Reveal'
import SalesPanel3D from '@/components/ecomerce/ui/sales-panel-3d'

/**
 * The manifesto — the page's first inversion. A full ink band carrying a ledger
 * row, one very large statement, and a single action. After the hero's density
 * the reader hits a black page that says one thing, and the statement is given
 * the whole top of the band to say it in.
 *
 * The prose makes a claim the display type cannot: anyone can build the store,
 * few can make it sell. So the pocket beside it — the one column the paragraph
 * leaves open under the headline — holds the drawing of exactly that: the
 * corridor from a visit to a purchase. The silence is kept where it matters (the
 * statement still stands alone); the argument gets its object.
 */
export default function StatementSection() {
  return (
    <section id="about" dir="rtl" className="band-ink">
      <div className="col-rules mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-40">
        <div className="relative z-10">
          <Reveal>
            <div className="rule-draw-b flex items-center gap-4 pb-4">
              <span className="mark t-accent text-[13px] font-bold">01</span>
              <span className="label t-dim">הפילוסופיה שלנו</span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            {/* The clamp floors at 34px on every phone (6.2vw only overtakes it
                above a 548px viewport), and at that size the statement stacks
                five lines deep — the one place on the page where the brutalist
                face's ~1.09em body is taller than the leading it is given, so a
                descender lands inside the line beneath it. 1.08 buys back exactly
                that overhang and nothing more. */}
            <h2
              className="display mt-12 max-w-5xl max-md:leading-[1.08] md:mt-16"
              style={{ fontSize: 'clamp(min(34px, 9.4vw), 6.2vw, 84px)' }}
            >
              אנחנו לא רק בונים אתרים.
              <span className="t-muted block">
                אנחנו השותפים שלכם להצלחה בדיגיטל.
              </span>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-10 md:mt-20 lg:grid-cols-12 lg:items-center">
            {/* The claim, drawn: the store selling. It sits in the columns the
                paragraph vacates, directly under the statement — so the reader
                meets it on the way from the headline to the prose. */}
            <Reveal delay={120} className="lg:col-span-5">
              <SalesPanel3D />
            </Reveal>

            <Reveal delay={160} className="lg:col-span-7 lg:col-start-6">
              <p className="t-muted text-[16px] leading-relaxed md:text-[19px]">
                הרבה חברות יכולות להקים לכם חנות. מעטות יודעות איך לגרום לה למכור.
                ב-Aiterra, בנינו וניהלנו בהצלחה פרויקטים במגוון תחומים, כולל שיווק
                ממומן בפייסבוק ואינסטגרם. אנחנו מבינים שמערכת טובה חייבת להיות
                מהירה, נוחה וממוקדת המרה.
              </p>

              <div className="mt-10">
                <a href="#lead-form" className="btn btn-primary">
                  בואו נתחיל
                  <ArrowLeft className="btn-arrow h-[1.05em] w-[1.05em]" strokeWidth={2.4} />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
