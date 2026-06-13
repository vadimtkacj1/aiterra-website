/**
 * Full-bleed hero video. The poster frame paints immediately (no spinner —
 * a full-screen loader over the poster made every page feel broken on slow
 * networks) and the browser swaps in the video once its first frame is ready.
 */
export default function HeroVideoBackdrop({ src = '/videos/gradient.mp4' }: { src?: string }) {
  return (
    <div className="absolute inset-0 z-0 bg-[#080112]">
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        poster="/videos/gradient-poster.webp"
      />
    </div>
  )
}
