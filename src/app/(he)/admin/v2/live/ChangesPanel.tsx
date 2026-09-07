'use client'

import { Crosshair, RotateCcw, X } from 'lucide-react'

export type PendingChange = {
  pathId: string
  label: string
  original: string
  value: string
}

export default function ChangesPanel({
  changes,
  onJump,
  onRevert,
  onClose,
}: {
  changes: PendingChange[]
  onJump: (pathId: string) => void
  onRevert: (pathId: string) => void
  onClose: () => void
}) {
  return (
    <aside
      dir="rtl"
      className="absolute bottom-4 left-4 z-30 flex max-h-[60%] w-[330px] flex-col rounded-xl border border-gray-200 bg-white shadow-xl"
    >
      <header className="flex items-center justify-between border-b border-gray-100 px-3.5 py-2.5">
        <span className="text-[13px] font-bold text-[#111827]">שינויים שלא נשמרו ({changes.length})</span>
        <button onClick={onClose} className="text-[#9ca3af] hover:text-[#111827]">
          <X size={15} />
        </button>
      </header>

      <div className="flex-1 overflow-auto p-2">
        {changes.length === 0 ? (
          <p className="p-3 text-[12px] text-[#9ca3af]">אין שינויים ממתינים.</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {changes.map((change) => (
              <li key={change.pathId} className="rounded-lg border border-gray-100 bg-[#fafafa] p-2.5">
                <p className="text-[11px] text-[#9ca3af]">{change.label}</p>
                <p className="mt-1 truncate text-[12px] text-[#9ca3af] line-through">{change.original}</p>
                <p className="truncate text-[12.5px] text-[#111827]">{change.value}</p>
                <div className="mt-1.5 flex gap-3">
                  <button
                    onClick={() => onJump(change.pathId)}
                    className="flex items-center gap-1 text-[11px] text-[#6b7280] hover:text-[#2447D6]"
                  >
                    <Crosshair size={12} /> הצגה בדף
                  </button>
                  <button
                    onClick={() => onRevert(change.pathId)}
                    className="flex items-center gap-1 text-[11px] text-[#6b7280] hover:text-[#ef4444]"
                  >
                    <RotateCcw size={12} /> ביטול
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}
