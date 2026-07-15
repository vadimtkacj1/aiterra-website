import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CONTACT } from '@/lib/ecomerce/contact'
import Logo from '@/components/ecomerce/ui/Logo'

type FooterLink = { label: string; href: string }

// Anchors are absolute to the landing's own route (/landings/ecomerce#…) so
// they land on the landing sections rather than the main site home.
const BASE = '/landings/ecomerce'
const NAV_LINKS: FooterLink[] = [
  { label: 'מי אנחנו', href: `${BASE}#about` },
  { label: 'היתרונות', href: `${BASE}#advantages` },
  { label: 'תיק עבודות', href: `${BASE}#portfolio` },
  { label: 'המלצות', href: `${BASE}#testimonials` },
  { label: 'צור קשר', href: `${BASE}#lead-form` },
]

// The main site's real legal pages — shared, so the landing points at them.
const LEGAL_LINKS: FooterLink[] = [
  { label: 'מדיניות פרטיות', href: '/privacy-policy' },
  { label: 'תקנון האתר', href: '/terms-of-use' },
  { label: 'הצהרת נגישות', href: '/accessibility-statement' },
]

/**
 * Paper footer — the page opens and closes on the same surface. The phone
 * number is set at display scale: at the bottom of a landing page the single
 * most useful thing on screen is the way to call someone.
 */
export default function Footer() {
  return (
    <footer dir="rtl" className="band-paper rule-t">
      <div className="col-rules mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="relative z-10">
          {/* the call line */}
          <a
            href={CONTACT.phoneHref}
            aria-label={`חייגו עכשיו ${CONTACT.phone}`}
            className="group rule-b flex flex-wrap items-baseline justify-between gap-4 pb-10"
          >
            <span
              dir="ltr"
              className="display transition-colors group-hover:text-accent-ink"
              style={{ fontSize: 'clamp(min(32px, 8.9vw), 5.4vw, 68px)' }}
            >
              {CONTACT.phone}
            </span>
            <span className="label t-dim flex items-center gap-2">
              חייגו עכשיו
              <ArrowLeft
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
                strokeWidth={2.4}
              />
            </span>
          </a>

          {/* Below md every text link in this block becomes a touch row: a 15px line
              of type is a 17px target, under half the 44px minimum. The padding that
              buys the height IS the separation, so the lists drop their flex gap and
              each block claws the new padding back out of its own top margin — the
              column keeps the rhythm it was drawn with, and becomes tappable. */}
          <div className="grid grid-cols-2 gap-10 pt-12 lg:grid-cols-12">
            <div className="col-span-2 lg:col-span-5">
              <span className="flex items-center gap-3">
                <Logo className="h-7 w-auto" />
                <span className="font-brutalist text-[28px] font-bold lowercase leading-none tracking-[-0.03em]">
                  aiterra
                </span>
              </span>
              <p className="t-muted mt-5 max-w-sm text-[15px] leading-relaxed">
                פיתוח חנויות איקומרס פרימיום שמייצרות מכירות. בונים לכם מנוע צמיחה
                דיגיטלי.
              </p>
              <a
                href={`mailto:${CONTACT.email}`}
                dir="ltr"
                className="mark t-muted mt-6 inline-block text-[13px] underline underline-offset-4 transition-colors hover:text-accent-ink max-md:mt-2 max-md:py-3.5"
              >
                {CONTACT.email}
              </a>
            </div>

            <nav aria-label="ניווט" className="lg:col-span-3 lg:col-start-8">
              <h2 className="label t-dim">ניווט</h2>
              <ul className="mt-6 flex flex-col gap-3.5 max-md:mt-3 max-md:gap-0">
                {NAV_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="t-muted text-[15px] transition-colors hover:text-accent-ink max-md:block max-md:py-3.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="מידע" className="lg:col-span-2">
              <h2 className="label t-dim">מידע</h2>
              <ul className="mt-6 flex flex-col gap-3.5 max-md:mt-3 max-md:gap-0">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="t-muted text-[15px] transition-colors hover:text-accent-ink max-md:block max-md:py-3.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="rule-t mt-16 flex flex-col justify-between gap-2 pt-6 sm:flex-row">
            <p className="label t-dim">© 2026 Aiterra · כל הזכויות שמורות</p>
            {/* Stacked below sm, this line would pull to the opposite edge from the
                copyright above it: `dir=ltr` resolves its start to the LEFT, and the
                row's justify-between does nothing on the cross axis. Pinning the box
                to the container's own inline start puts both lines on one edge; the
                row turns horizontal at sm, where the split is the point. */}
            <p className="label t-dim max-sm:self-start" dir="ltr">
              Built by Aiterra
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
