/** Shared loading ring for 3D hero (chunk + asset load). */
export function Hero3DSpin({ label = 'Loading 3D' }: { label?: string }) {
  return (
    <div
      className="flex h-full min-h-[180px] w-full items-center justify-center"
      role="status"
      aria-busy="true"
      aria-label={label}
    >
      <div
        className="h-11 w-11 shrink-0 rounded-full border-[3px] border-gray-200/90 border-t-[#530FAD] animate-spin shadow-sm"
        aria-hidden
      />
    </div>
  )
}
