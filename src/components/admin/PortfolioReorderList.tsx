'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ChevronDown, ChevronUp, GripVertical, Trash2 } from 'lucide-react'
import type { PortfolioProject } from '@/types'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

function move<T>(list: T[], from: number, to: number): T[] {
  if (from === to || to < 0 || to >= list.length) return list
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export default function PortfolioReorderList({ projects }: { projects: PortfolioProject[] }) {
  const router = useRouter()
  const [items, setItems] = useState(projects)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [armed, setArmed] = useState<number | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const itemsRef = useRef(items)

  // Re-sync after router.refresh() (save, delete, edit) — the server is the
  // source of truth. Keyed on the slug order so it can't loop on array identity.
  const signature = projects.map((p) => p.slug).join('|')
  useEffect(() => {
    setItems(projects)
    itemsRef.current = projects
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature])

  useEffect(() => {
    if (saveState !== 'saved') return
    const id = setTimeout(() => setSaveState('idle'), 2000)
    return () => clearTimeout(id)
  }, [saveState])

  const save = useCallback(
    async (list: PortfolioProject[]) => {
      setSaveState('saving')
      try {
        const res = await fetch('/api/admin/portfolio/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slugs: list.map((p) => p.slug) }),
        })
        if (!res.ok) throw new Error('save failed')
        setSaveState('saved')
        router.refresh()
      } catch {
        setSaveState('error')
      }
    },
    [router],
  )

  const apply = useCallback((next: PortfolioProject[]) => {
    itemsRef.current = next
    setItems(next)
  }, [])

  const shift = (from: number, to: number) => {
    const next = move(itemsRef.current, from, to)
    if (next === itemsRef.current) return
    apply(next)
    void save(next)
  }

  const handleDelete = async (slug: string) => {
    setDeleting(slug)
    await fetch(`/api/admin/portfolio/${slug}`, { method: 'DELETE' })
    setDeleting(null)
    router.refresh()
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 py-16 text-center text-[#9ca3af] text-[14px]">
        אין פרויקטים
      </div>
    )
  }

  return (
    <div dir="rtl">
      <div className="mb-3 flex items-center gap-2 text-[12px] text-[#9ca3af]">
        <GripVertical size={14} />
        גררו את הידית כדי לשנות את סדר הפרויקטים באתר — השינוי נשמר אוטומטית
        {saveState === 'saving' && (
          <span className="flex items-center gap-1.5 text-[#2447D6]">
            <span className="w-3 h-3 border-2 border-[#2447D6]/30 border-t-[#2447D6] rounded-full animate-spin" />
            שומר…
          </span>
        )}
        {saveState === 'saved' && (
          <span className="flex items-center gap-1 text-green-600 font-medium">
            <CheckCircle2 size={13} />
            הסדר נשמר
          </span>
        )}
        {saveState === 'error' && (
          <span className="font-medium text-red-500">שמירת הסדר נכשלה — רעננו ונסו שוב</span>
        )}
      </div>

      <ul className="flex flex-col gap-2">
        {items.map((project, index) => (
          <li
            key={project.slug}
            draggable={armed === index}
            onDragStart={(e) => {
              setDragIndex(index)
              e.dataTransfer.effectAllowed = 'move'
              e.dataTransfer.setData('text/plain', project.slug)
            }}
            onDragOver={(e) => {
              if (dragIndex === null) return
              e.preventDefault()
              e.dataTransfer.dropEffect = 'move'
              if (dragIndex === index) return
              apply(move(itemsRef.current, dragIndex, index))
              setDragIndex(index)
            }}
            onDrop={(e) => e.preventDefault()}
            onDragEnd={() => {
              setDragIndex(null)
              setArmed(null)
              void save(itemsRef.current)
            }}
            className={`flex items-center gap-3 rounded-xl border bg-white p-3 shadow-sm transition-[opacity,box-shadow] ${
              dragIndex === index ? 'opacity-50 border-[#2447D6]' : 'border-gray-100'
            }`}
          >
            <button
              type="button"
              aria-label="גרירה לשינוי סדר"
              onMouseDown={() => setArmed(index)}
              onMouseUp={() => setArmed(null)}
              onTouchStart={() => setArmed(index)}
              onTouchEnd={() => setArmed(null)}
              className="shrink-0 cursor-grab rounded-lg p-1.5 text-[#c4c4cf] hover:bg-gray-50 hover:text-[#2447D6] active:cursor-grabbing"
            >
              <GripVertical size={18} />
            </button>

            <span className="w-6 shrink-0 text-center text-[12px] font-bold tabular-nums text-[#c4c4cf]">
              {index + 1}
            </span>

            {project.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.image}
                alt=""
                className="h-11 w-11 shrink-0 rounded-lg bg-gray-100 object-cover"
              />
            )}

            <div className="min-w-0 flex-1">
              <div className="truncate text-[14px] font-medium text-[#111827]">{project.title}</div>
              <div className="truncate text-[12px] text-[#9ca3af]">
                {project.slug} · {project.category}
              </div>
            </div>

            <div className="flex shrink-0 flex-col">
              <button
                type="button"
                onClick={() => shift(index, index - 1)}
                disabled={index === 0}
                aria-label="העברה למעלה"
                className="rounded p-0.5 text-[#9ca3af] hover:bg-gray-50 hover:text-[#2447D6] disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronUp size={16} />
              </button>
              <button
                type="button"
                onClick={() => shift(index, index + 1)}
                disabled={index === items.length - 1}
                aria-label="העברה למטה"
                className="rounded p-0.5 text-[#9ca3af] hover:bg-gray-50 hover:text-[#2447D6] disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronDown size={16} />
              </button>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/admin/portfolio/${project.slug}`}
                className="rounded-lg border border-[#2447D6]/30 px-3 py-1.5 text-[12px] font-medium text-[#2447D6] transition-colors hover:bg-[#2447D6]/5"
              >
                עריכה
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(project.slug)}
                disabled={deleting === project.slug}
                aria-label="מחיקה"
                className="rounded-lg border border-red-200 p-1.5 text-red-400 transition-colors hover:bg-red-50 disabled:opacity-60"
              >
                {deleting === project.slug ? (
                  <span className="block h-[15px] w-[15px] animate-spin rounded-full border-2 border-red-200 border-t-red-500" />
                ) : (
                  <Trash2 size={15} />
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
