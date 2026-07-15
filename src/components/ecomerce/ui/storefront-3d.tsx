import type { CSSProperties } from 'react'
import WireScene from '@/components/ecomerce/ui/wire-scene'

/**
 * The hero's object: a storefront pulled apart into its parts, which assemble
 * back into a whole store as the reader scrolls.
 *
 * The read is an exploded assembly drawing. The empty window sits furthest
 * back; its contents — banner, product grid, cart — are lifted out of it toward
 * the viewer, each at its own depth but still at its natural position within
 * the screen. Scroll, and they settle back into place. The headline says "Built
 * to Sell"; the drawing builds the store while you read it.
 *
 * Depth is spelled with contrast, not shadow: near parts are drawn in ink, far
 * ones fade to the hairline colour.
 *
 * The single accent chip is the storefront's own buy button, which keeps the
 * blue where it belongs: on a call to action.
 */

/* The throw is absolute px; the scene is not. In the phone's single column the
   scene is barely half the width the desktop grid gives it, so the same 160px of
   depth flings the parts clear of the window they belong to: the cart bar lands
   outside the store it is part of and the drawing reads as loose rectangles.
   `--zs` cuts the throw on a narrow scene, exactly as .wire-box cuts its own
   --spread there. It binds below 640px only — the column does not narrow again
   until `lg`, so between 640 and 1024 the scene is the widest it ever gets and
   the tuned throw stands. */
const z = (v: number) => ({ '--z': `calc(${v}px * var(--zs, 1))` }) as CSSProperties

export default function Storefront3D({ className = '' }: { className?: string }) {
  return (
    <WireScene ratio="4 / 3" mode="page" className={`max-sm:[--zs:0.45] ${className}`}>
      {/* ---- furthest back: the empty window ---- */}
      <div className="wire-plane wire-far" style={z(-78)}>
        <div className="absolute inset-0 border border-current">
          <div className="flex h-[13%] items-center border-b border-current px-2">
            <span dir="ltr" className="mark text-[8px]">
              brand-x.co.il
            </span>
          </div>
        </div>
      </div>

      {/* ---- the banner ---- */}
      <div className="wire-plane wire-mid" style={z(-26)}>
        <div className="absolute inset-x-[7%] top-[19%] flex h-[28%] items-end justify-between border border-current p-2">
          <span className="flex flex-col gap-1">
            <span className="block h-1.5 w-14 bg-current opacity-50" />
            <span className="block h-1 w-8 bg-current opacity-25" />
          </span>
          {/* the store's own CTA — the one place colour is allowed */}
          <span className="bg-accent px-1.5 py-0.75 text-[7px] font-bold leading-none text-white">
            קנו עכשיו
          </span>
        </div>
      </div>

      {/* ---- the product grid ---- */}
      <div className="wire-plane wire-mid" style={z(30)}>
        <div className="absolute inset-x-[7%] top-[52%] grid h-[26%] grid-cols-3 gap-1.5">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="border border-current" />
          ))}
        </div>
      </div>

      {/* ---- nearest: the cart bar ---- */}
      <div className="wire-plane wire-near" style={z(82)}>
        <div className="absolute inset-x-[7%] bottom-[2%] flex h-[13%] items-center justify-between border border-current px-2">
          <span dir="ltr" className="mark text-[10px] font-bold">
            ₪249
          </span>
          <span className="border border-current px-1.5 py-0.75 text-[7px] leading-none">
            הוספה לסל
          </span>
        </div>
      </div>
    </WireScene>
  )
}
