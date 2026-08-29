'use client'

import { useEffect, useRef } from 'react'
import { RotateCcw, X } from 'lucide-react'

export type PopoverField = {
  pathId: string
  label: string
  value: string
  original: string
}

export default function TextPopover({
  fields,
  top,
  left,
  onChange,
  onRevert,
  onClose,
}: {
  fields: PopoverField[]
  top: number
  left: number
  onChange: (pathId: string, value: string) => void
  onRevert: (pathId: string) => void
  onClose: () => void
}) {
  const first = useRef<HTMLTextAreaElement>(null)
  const firstPathId = fields[0]?.pathId

  useEffect(() => {
    first.current?.focus()
    first.current?.setSelectionRange(first.current.value.length, first.current.value.length)
  }, [firstPathId])

  return (
    <div
      dir="rtl"
      style={{ top, left }}
      className="fixed z-40 w-[340px] rounded-xl border border-gray-200 bg-white p-3 shadow-2xl"
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose()
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[12px] font-bold text-[#111827]">עריכת טקסט</span>
        <button onClick={onClose} className="text-[#9ca3af] hover:text-[#111827]">
          <X size={15} />
        </button>
      </div>

      <div className="flex max-h-[50vh] flex-col gap-3 overflow-auto">
        {fields.map((field, index) => (
          <label key={field.pathId} className="block">
            <span className="mb-1 flex items-center justify-between text-[11px] text-[#9ca3af]">
              {field.label}
              {field.value !== field.original ? (
                <button
                  onClick={() => onRevert(field.pathId)}
                  className="flex items-center gap-1 text-[11px] text-[#9ca3af] hover:text-[#ef4444]"
                >
                  <RotateCcw size={11} /> איפוס
                </button>
              ) : null}
            </span>
            <textarea
              ref={index === 0 ? first : undefined}
              value={field.value}
              rows={Math.min(8, Math.max(2, Math.ceil(field.value.length / 42)))}
              onChange={(event) => onChange(field.pathId, event.target.value)}
              className="w-full resize-y rounded-lg border border-gray-200 p-2 text-[13px] leading-relaxed outline-none focus:border-[#2447D6] focus:ring-2 focus:ring-[#2447D6]/10"
            />
          </label>
        ))}
      </div>
    </div>
  )
}
