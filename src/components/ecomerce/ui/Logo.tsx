/**
 * The Aiterra mark. Inlined rather than an <img> so it takes currentColor and
 * stays legible on both band surfaces — ink on paper, white on the dark bands.
 * The viewBox is cropped to the glyph's own bounds (the source artboard is a
 * padded 112 square) so the mark sits on the wordmark's cap height instead of
 * floating above its own baseline. Source: /public/icons/logo.svg.
 */
export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="11.31 5.92 87.96 82.83"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M55.03 5.92L88.17 68.07L73.41 67.96L54.82 33.88L32.67 75.40L47.28 75.45L55.92 88.59L11.31 88.70Z" />
      <path d="M57.49 75.50L92.21 75.45L99.27 88.70L66.86 88.75Z" />
    </svg>
  )
}
