import type { ReactNode } from 'react'
import Reveal from '@/components/ecomerce/ui/Reveal'

type SectionHeadProps = {
  /** ledger index — "01", "02"… set in the accent as a functional marker */
  index: string
  /** tracked uppercase kicker */
  label: string
  title: ReactNode
  lede?: ReactNode
  /** trailing slot on the rule row — a stat, a count, a link */
  meta?: ReactNode
  className?: string
}

/**
 * The ledger row that opens every section: a hairline that runs the full
 * width of the well, carrying an accent index and a tracked label, with the
 * headline hanging beneath it.
 *
 * This is the page's spine. It replaces the glass "badge pill + centred
 * headline" that every section used to repeat — hierarchy now comes from
 * the rule and the tracking, not from a floating chip.
 */
export default function SectionHead({
  index,
  label,
  title,
  lede,
  meta,
  className = '',
}: SectionHeadProps) {
  return (
    <Reveal className={className}>
      {/* the spine of the page, drawn rather than faded: the hairline pulls out
          from the RTL start edge as the head arrives */}
      <div className="rule-draw flex items-baseline gap-4 pt-4 max-md:flex-wrap">
        <span className="mark t-accent text-[13px] font-bold">{index}</span>
        <span className="label t-dim">{label}</span>
        {/* the slot is where a section states its one number — the team's head
            count, the portfolio's project count — so it cannot be a desktop-only
            flourish. At 360 there is no room for it beside the kicker, and left
            to shrink it would break its own text mid-phrase; `w-full` forces the
            whole slot onto its own ledger line instead of letting it wrap
            unpredictably. */}
        {meta ? <span className="ms-auto max-md:w-full">{meta}</span> : null}
      </div>

      <h2 className="mt-8 max-w-4xl text-[30px] leading-[1.02] sm:text-[40px] md:text-[52px]">
        {title}
      </h2>

      {lede ? (
        <p className="t-muted mt-6 max-w-2xl text-[16px] leading-relaxed md:text-[17px]">
          {lede}
        </p>
      ) : null}
    </Reveal>
  )
}
