import type { CSSProperties } from 'react'
import WireScene from '@/components/ecomerce/ui/wire-scene'

/**
 * The manifesto's object: the panel that proves the store sells.
 *
 * The section's argument is a gap — anyone can build you a shop, few can make it
 * sell — so the drawing is the evidence side of it: a sales panel, read against
 * its own gridlines, with the bars rising out of the baseline as the reader
 * arrives at the claim. The last bar is the only filled mass on the page. It is
 * the sale.
 *
 * Deliberately a third *device*, not merely a third solid. The storefront
 * explodes and the roof box gathers; both spend `--p` on assembly, and a third
 * assembly would have turned the trick into a tic. This one spends `--p` on
 * growth and never comes apart — which is also why it survives the
 * reduced-motion pose, where WireScene parks `--p` at 0.35: a shorter chart is
 * still a chart, where a half-assembled machine reads as broken.
 *
 * It has to be legible as a *thing*, the way the storefront is. That is what the
 * frame, the header row and the gridlines buy: without them a chart is six
 * rectangles at slightly different heights, which is what the first pass of this
 * object actually looked like.
 */

const z = (v: string) => ({ '--z': v }) as CSSProperties
const barHeight = (v: number) => ({ '--bar-h': `${v}%` }) as CSSProperties

/** A climb with one dip in it. A monotonic ramp reads as a decoration. */
const BARS = [30, 44, 37, 58, 74, 96]

export default function SalesPanel3D({ className = '' }: { className?: string }) {
  return (
    <WireScene ratio="4 / 3" className={className}>
      {/* ---- the panel itself ---- */}
      <div className="wire-layer wire-step" style={z('-30px')}>
        <div className="absolute inset-0 border border-current">
          <div className="flex h-[15%] items-center justify-between border-b border-current px-2.5">
            <span className="label text-[8px]">מכירות</span>
            <span dir="ltr" className="mark text-[8px]">
              30d
            </span>
          </div>
        </div>
      </div>

      {/* ---- what the bars are read against ---- */}
      <div className="wire-layer wire-mid" style={z('0px')}>
        <span className="wire-grid absolute inset-x-[8%] top-[27%] bottom-[23%]" />
      </div>

      {/* ---- the claim, drawn: it sells ----
          `dir="ltr"` on the plot, and it is not a detail. The band is RTL, so
          the bars laid themselves out right-to-left: the tall filled bar landed
          on the LEFT and the series fell away to the right, which is a chart of
          a store going under — the exact opposite of the argument the section is
          making. Time runs left-to-right on every analytics panel a client has
          ever seen, including the Hebrew ones. */}
      <div className="wire-layer wire-near" style={z('40px')}>
        <div dir="ltr" className="wire-chart absolute inset-x-[8%] top-[27%] bottom-[23%]">
          {BARS.map((v, i) => (
            <span
              key={i}
              className={`wire-bar ${i === BARS.length - 1 ? 'wire-bar-lead' : ''}`}
              style={barHeight(v)}
            />
          ))}
        </div>
      </div>

      {/* ---- the readout, nearest the reader ---- */}
      <div className="wire-layer wire-near" style={z('90px')}>
        <div className="absolute inset-x-[8%] bottom-[6%] flex h-[12%] items-center justify-between border border-current px-2.5">
          <span className="mark text-[11px] font-bold">₪</span>
          <span className="label text-[7px]">המרה</span>
        </div>
      </div>
    </WireScene>
  )
}
