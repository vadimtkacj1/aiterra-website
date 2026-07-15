import type { ComponentType, CSSProperties, SVGProps } from 'react'
import { Boxes, Mail, Truck, Users } from 'lucide-react'
import Marquee from '@/components/ecomerce/ui/marquee'
import {
  BRAND_HEX,
  GoogleAnalyticsIcon,
  MastercardIcon,
  MetaIcon,
  MicrosoftIcon,
  VisaIcon,
} from '@/components/ecomerce/ui/brand-icons'

type Mark = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  /** Brand colour, revealed on hover. Omitted where the item is a capability
      rather than a vendor — those marks light up in the band's own accent. */
  hex?: string
  /** Brand marks are drawn to the edge of their box; lucide's are stroked on a
      24px grid with built-in padding, so they need the extra size to sit at the
      same optical weight. */
  lucide?: boolean
}

type Integration = { name: string; marks: Mark[] }

const INTEGRATIONS: Integration[] = [
  {
    name: 'סליקת אשראי',
    marks: [
      { Icon: VisaIcon, hex: BRAND_HEX.visa },
      { Icon: MastercardIcon, hex: BRAND_HEX.mastercard },
    ],
  },
  { name: 'Meta Pixel', marks: [{ Icon: MetaIcon, hex: BRAND_HEX.meta }] },
  {
    name: 'Google Analytics',
    marks: [{ Icon: GoogleAnalyticsIcon, hex: BRAND_HEX.googleAnalytics }],
  },
  {
    name: 'Microsoft Clarity',
    marks: [{ Icon: MicrosoftIcon, hex: BRAND_HEX.microsoft }],
  },
  { name: 'חברות שילוח', marks: [{ Icon: Truck, lucide: true }] },
  { name: 'מועדון לקוחות', marks: [{ Icon: Users, lucide: true }] },
  { name: 'דיוור SMS ומייל', marks: [{ Icon: Mail, lucide: true }] },
  { name: 'מלאי חכם', marks: [{ Icon: Boxes, lucide: true }] },
]

/**
 * The integration strip — the hero's closing line, banded top and bottom by
 * rules so it reads as its own register rather than as a caption under the
 * ledger.
 *
 * Every vendor shows its actual mark, drawn in ink like the rest of the band;
 * hover is what spends the brand colour. Capabilities with no vendor behind them
 * (shipping, inventory, the loyalty club) keep a lucide glyph and light up in the
 * accent instead, so the row never pretends a logo exists where it doesn't.
 *
 * The ticker repeats its children, so the visible copy is hidden from assistive
 * tech and the names are exposed once, in order, as a visually-hidden list.
 */
export default function IntegrationsTicker() {
  return (
    <div dir="rtl" className="rule-t rule-b">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 pt-6 md:px-8">
        <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-accent" />
        <p className="label t-dim">הכל מובנה מראש · אינטגרציה מקצה לקצה</p>
        <span dir="ltr" className="mark t-dim ms-auto hidden text-[12px] sm:block">
          {INTEGRATIONS.length} integrations
        </span>
      </div>

      <ul className="sr-only">
        {INTEGRATIONS.map(({ name }) => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      <Marquee
        pauseOnHover
        aria-hidden
        // The edge fade is a percentage of the strip, so it shrinks with the
        // viewport: 6% of 360px is 22px — shorter than one character, which
        // lands the leading chip against the edge at near-full opacity and
        // reads as a crop rather than a bleed. Below md the ramp is widened to
        // ~50px, still leaving a clear zone wider than the ~234px chip pitch.
        className="py-5 [--duration:44s] [--gap:0px] [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)] max-md:[mask-image:linear-gradient(to_right,transparent,#000_14%,#000_86%,transparent)]"
      >
        {INTEGRATIONS.map(({ name, marks }) => (
          <span
            key={name}
            className="group/chip rule-e flex items-center gap-3 whitespace-nowrap px-7"
          >
            <span className="flex shrink-0 items-center gap-1.5">
              {marks.map(({ Icon, hex, lucide }, i) => (
                <span
                  key={i}
                  // The brand colour rides a custom property so a single hover
                  // rule serves every chip. Without a vendor there is nothing to
                  // reveal, so the mark falls back to the band's accent.
                  style={{ '--brand': hex ?? 'var(--accent)' } as CSSProperties}
                  className="rule-all grid h-9 w-9 place-items-center transition-colors duration-200 group-hover/chip:border-[var(--brand)] group-hover/chip:text-[var(--brand)]"
                >
                  <Icon
                    className={lucide ? 'h-[18px] w-[18px]' : 'h-[15px] w-[15px]'}
                    {...(lucide ? { strokeWidth: 1.7 } : {})}
                    aria-hidden
                  />
                </span>
              ))}
            </span>
            <span className="text-[14px] md:text-[15px]">{name}</span>
          </span>
        ))}
      </Marquee>
    </div>
  )
}
