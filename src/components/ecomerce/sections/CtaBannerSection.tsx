import { ArrowLeft } from 'lucide-react'
import Reveal from '@/components/ecomerce/ui/Reveal'
import { CONTACT } from '@/lib/ecomerce/contact'

/**
 * The paper breath between the black testimonial band and the black form.
 * No slab, no beam, no spotlight — the CTA earns its weight from scale and
 * from being the quietest surface on the page at the loudest moment.
 */
export default function CtaBannerSection() {
  return (
    <section dir="rtl" className="band-paper">
      <div className="col-rules mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="relative z-10">
          <Reveal>
            <div className="rule-draw-b flex items-center gap-4 pb-4">
              <span className="mark t-accent text-[13px] font-bold">06</span>
              <span className="label t-dim" dir="ltr">
                Ready to Scale?
              </span>
            </div>
          </Reveal>

          <div className="grid gap-12 pt-12 lg:grid-cols-12 lg:pt-16">
            <Reveal className="lg:col-span-7">
              {/* 5.6vw only overtakes the floor at a 643px viewport, so the MIN — not the
                  fluid term — is the size every phone actually renders. It has to out-scale
                  SectionHead's 30px h2: this is the page's loudest line, and at the old 32px
                  it was set no larger than an ordinary section head. */}
              <h2 className="display" style={{ fontSize: 'clamp(min(36px, 10vw), 5.6vw, 76px)' }}>
                מוכנים להפוך את החנות שלכם למכונת מכירות?
              </h2>
            </Reveal>

            <Reveal delay={120} className="lg:col-span-5 lg:rule-s lg:ps-12">
              <p className="t-muted text-[16px] leading-relaxed md:text-[17px]">
                תשתית איקומרס יוקרתית, אינטגרציה מלאה וליווי צמוד לשנה שלמה — הכל
                תחת קורת גג אחת. בואו נבנה יחד את מנוע הצמיחה הדיגיטלי של העסק
                שלכם.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href="#lead-form" className="btn btn-primary">
                  מתחילים כאן
                  <ArrowLeft className="btn-arrow h-[1.05em] w-[1.05em]" strokeWidth={2.4} />
                </a>
                <a href={CONTACT.phoneHref} className="btn btn-outline" dir="ltr">
                  {CONTACT.phone}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
