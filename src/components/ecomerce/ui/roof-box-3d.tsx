import type { CSSProperties } from 'react'
import WireScene from '@/components/ecomerce/ui/wire-scene'

/**
 * The advantages section's object: a wireframe volume the integrations gather
 * into.
 *
 * The section's whole claim is "הכל תחת קורת גג אחת" — everything under one
 * roof — so the drawing states it literally. Scattered module plates (payments,
 * shipping, CRM, pixels, inventory) fly home into a single open box as the
 * reader scrolls. Nothing is left outside it.
 *
 * Deliberately a different solid from the hero's storefront: that one is a
 * stack of planes, this one is a volume. Repeating the same exploded-stack
 * trick twice would turn a device into a mannerism.
 */

type Module = { label: string; x: number; y: number; z: number }

/**
 * Where each module lands — every one of them inside the volume. `--explode`
 * throws it back out along the same vector, so scrolling pulls it home.
 *
 * The offsets are FRACTIONS of the box's own edges, never fixed pixels: the box
 * shrinks on small screens, and pixel offsets would keep hurling the modules
 * just as far, straight out of the scene and off the side of the page.
 */
const MODULES: Module[] = [
  { label: 'סליקה', x: -0.32, y: -0.27, z: 0.28 },
  { label: 'שילוח', x: 0.31, y: -0.23, z: 0.05 },
  { label: 'CRM', x: -0.28, y: 0.24, z: -0.16 },
  { label: 'פיקסלים', x: 0.29, y: 0.27, z: 0.25 },
  { label: 'מלאי', x: 0, y: 0.02, z: -0.3 },
]

const at = ({ x, y, z }: Module) =>
  ({
    '--mx': `calc(var(--bw) * ${x})`,
    '--my': `calc(var(--bh) * ${y})`,
    '--mz': `calc(var(--bd) * ${z})`,
  }) as CSSProperties

export default function RoofBox3D({ className = '' }: { className?: string }) {
  return (
    <WireScene ratio="16 / 10" className={className}>
      {/* the roof — an open wireframe volume. One step up the contrast ramp
          from the faintest tone: on the ink band the hairline colour nearly
          vanishes, and the container still has to be legible as a container. */}
      <div className="wire-box wire-mid">
        <span className="wire-face wire-f-back" />
        <span className="wire-face wire-f-left" />
        <span className="wire-face wire-f-right" />
        <span className="wire-face wire-f-top" />
        <span className="wire-face wire-f-bottom" />
        {/* no front face: the box stays open, so the modules read as going *in* */}
      </div>

      {/* the integrations, coming home */}
      <div className="wire-box wire-near">
        {MODULES.map((m) => (
          <span key={m.label} className="wire-module" style={at(m)}>
            <span className="label text-[8px] leading-none">{m.label}</span>
          </span>
        ))}
      </div>
    </WireScene>
  )
}
