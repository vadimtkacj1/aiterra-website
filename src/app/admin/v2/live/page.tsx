'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, RotateCcw, TextCursorInput, X } from 'lucide-react'
import AdminHeader from '@/components/admin/AdminHeader'
import type { V2Content, V2ContentKey } from '@/app/v2/content'
import { mergeV2, type V2Overrides } from '@/app/v2/contentMerge'
import ChangesPanel, { type PendingChange } from './ChangesPanel'
import LiveToolbar from './LiveToolbar'
import TextPopover, { type PopoverField } from './TextPopover'
import { DEVICES, EDITOR_CSS, EDITOR_STYLE_ID, type DeviceId, type EditorMode } from './config'
import { idsOf, markDirty, scanFrame, type Hit } from './scanner'
import {
  collectEntries,
  entryLabel,
  normalizeText,
  sectionLabel,
  setAtPath,
  type TextEntry,
} from './textIndex'

type Payload = { defaults: V2Content; overrides: V2Overrides; updatedAt: string | null }

type Edit = {
  key: V2ContentKey
  path: string[]
  pathId: string
  label: string
  original: string
  value: string
}

type Rect = { top: number; left: number; width: number; height: number }

export default function AdminV2LivePage() {
  const [payload, setPayload] = useState<Payload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [page, setPage] = useState('/v2')
  const [device, setDevice] = useState<DeviceId>('desktop')
  const [mode, setMode] = useState<EditorMode>('edit')
  const [edits, setEdits] = useState<Record<string, Edit>>({})
  const [selected, setSelected] = useState<Hit[] | null>(null)
  const [rect, setRect] = useState<Rect | null>(null)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)
  const [hitCount, setHitCount] = useState(0)

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const resolvedRef = useRef<Record<string, unknown> | null>(null)
  const entriesRef = useRef<TextEntry[]>([])
  const editsRef = useRef<Record<string, Edit>>({})
  const hitsRef = useRef<Map<number, Hit>>(new Map())
  const modeRef = useRef<EditorMode>('edit')
  const activeRef = useRef<{ hit: Hit; before: string } | null>(null)
  const activeElRef = useRef<HTMLElement | null>(null)
  const attachedDocRef = useRef<Document | null>(null)
  const observerRef = useRef<MutationObserver | null>(null)
  const inlineTimerRef = useRef(0)
  const scanTimerRef = useRef(0)
  const verifyRef = useRef<Edit[] | null>(null)
  const restoreScrollRef = useRef<number | null>(null)
  const attachRef = useRef<() => void>(() => {})
  const saveRef = useRef<() => void>(() => {})

  const writeEntry = useCallback(
    (pathId: string, value: string, dirty: boolean, skipEl?: HTMLElement) => {
      for (const hit of hitsRef.current.values()) {
        if (hit.entry.pathId !== pathId) continue
        markDirty(hit.el, dirty)
        if (skipEl && hit.el === skipEl) continue
        if (hit.kind === 'placeholder') hit.el.setAttribute('placeholder', value)
        else if (hit.node) hit.node.nodeValue = value
      }
    },
    [],
  )

  const applyEdit = useCallback(
    (entry: TextEntry, value: string, skipEl?: HTMLElement) => {
      const dirty = normalizeText(value) !== normalizeText(entry.value)
      const next = { ...editsRef.current }
      if (dirty) {
        next[entry.pathId] = {
          key: entry.key,
          path: entry.path,
          pathId: entry.pathId,
          label: entryLabel(entry),
          original: entry.value,
          value,
        }
      } else {
        delete next[entry.pathId]
      }
      editsRef.current = next
      setEdits(next)
      writeEntry(entry.pathId, value, dirty, skipEl)
    },
    [writeEntry],
  )

  const commitActive = useCallback(() => {
    const active = activeRef.current
    if (!active) return
    activeRef.current = null
    window.clearTimeout(inlineTimerRef.current)
    const el = active.hit.el
    el.removeAttribute('contenteditable')
    el.removeAttribute('spellcheck')
    const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim()
    if (!text) {
      applyEdit(active.hit.entry, active.hit.entry.value)
      return
    }
    applyEdit(active.hit.entry, text, el)
  }, [applyEdit])

  const clearSelection = useCallback(() => {
    commitActive()
    activeElRef.current?.removeAttribute('data-v2edit-active')
    activeElRef.current = null
    setSelected(null)
    setRect(null)
    setPopoverOpen(false)
  }, [commitActive])

  const beginInline = useCallback((hit: Hit, point?: { x: number; y: number }) => {
    const el = hit.el
    el.setAttribute('contenteditable', 'plaintext-only')
    if (el.contentEditable !== 'plaintext-only') el.setAttribute('contenteditable', 'true')
    el.setAttribute('spellcheck', 'false')
    activeRef.current = { hit, before: el.textContent ?? '' }
    el.focus({ preventScroll: true })
    const doc = el.ownerDocument
    const win = doc.defaultView
    if (!point || !win) return
    try {
      const range = doc.caretRangeFromPoint?.(point.x, point.y)
      if (!range) return
      const selection = win.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
    } catch {
      el.focus({ preventScroll: true })
    }
  }, [])

  const updateRect = useCallback(() => {
    const iframe = iframeRef.current
    const el = activeElRef.current
    if (!iframe || !el) return
    const frame = iframe.getBoundingClientRect()
    const box = el.getBoundingClientRect()
    const next: Rect = {
      top: frame.top + box.top,
      left: frame.left + box.left,
      width: box.width,
      height: box.height,
    }
    setRect((prev) =>
      prev &&
      Math.abs(prev.top - next.top) < 0.5 &&
      Math.abs(prev.left - next.left) < 0.5 &&
      Math.abs(prev.width - next.width) < 0.5 &&
      Math.abs(prev.height - next.height) < 0.5
        ? prev
        : next,
    )
  }, [])

  const select = useCallback(
    (hits: Hit[], point?: { x: number; y: number }) => {
      commitActive()
      activeElRef.current?.removeAttribute('data-v2edit-active')
      const first = hits[0]
      first.el.setAttribute('data-v2edit-active', '')
      activeElRef.current = first.el
      setSelected(hits)
      updateRect()
      const editable = hits.length === 1 && first.kind === 'text' && first.inline
      setPopoverOpen(!editable)
      if (editable) beginInline(first, point)
    },
    [beginInline, commitActive, updateRect],
  )

  const scanDocument = useCallback((doc: Document) => {
    const hits = scanFrame(doc, entriesRef.current, editsRef.current)
    if (!hits) return
    hitsRef.current = hits
    setHitCount(hits.size)

    const verifying = verifyRef.current
    if (!verifying) return
    verifyRef.current = null
    const live = new Set(Array.from(hits.values(), (hit) => hit.entry.pathId))
    const missing = verifying.filter((edit) => !live.has(edit.pathId))
    setWarning(
      missing.length === 0
        ? null
        : `${missing.length} טקסטים נשמרו אך הדף עדיין מציג את הגרסה הקודמת: ${missing
            .map((edit) => edit.label)
            .join(' · ')}. סביר שהקומפוננטה קוראת את הטקסט מהקוד ולא מהניהול.`,
    )
  }, [])

  const scheduleScan = useCallback(() => {
    if (activeRef.current) return
    window.clearTimeout(scanTimerRef.current)
    scanTimerRef.current = window.setTimeout(() => {
      const doc = iframeRef.current?.contentDocument
      if (doc) scanDocument(doc)
    }, 250)
  }, [scanDocument])

  const onFrameClick = useCallback(
    (event: MouseEvent) => {
      if (modeRef.current !== 'edit') return
      const target = event.target as Element | null
      const el = target?.closest?.('[data-v2edit],[data-v2edit-ph]') as HTMLElement | null
      if (!el) {
        clearSelection()
        return
      }
      if (activeRef.current?.hit.el === el) return
      const hits = idsOf(el)
        .map((id) => hitsRef.current.get(id))
        .filter((hit): hit is Hit => Boolean(hit))
      if (!hits.length) return
      event.preventDefault()
      event.stopPropagation()
      select(hits, { x: event.clientX, y: event.clientY })
    },
    [clearSelection, select],
  )

  const onFrameKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        saveRef.current()
        return
      }
      const active = activeRef.current
      if (!active) return
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        active.hit.el.blur()
        return
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        const before = active.before.replace(/\s+/g, ' ').trim()
        const hit = active.hit
        activeRef.current = null
        window.clearTimeout(inlineTimerRef.current)
        hit.el.removeAttribute('contenteditable')
        hit.el.blur()
        applyEdit(hit.entry, before || hit.entry.value)
      }
    },
    [applyEdit],
  )

  const onFrameInput = useCallback(() => {
    const active = activeRef.current
    if (!active) return
    window.clearTimeout(inlineTimerRef.current)
    inlineTimerRef.current = window.setTimeout(() => {
      if (activeRef.current !== active) return
      const text = (active.hit.el.textContent ?? '').replace(/\s+/g, ' ').trim()
      if (text) applyEdit(active.hit.entry, text, active.hit.el)
    }, 220)
  }, [applyEdit])

  const onFrameFocusOut = useCallback(() => {
    window.setTimeout(() => {
      const active = activeRef.current
      if (!active) return
      if (active.hit.el.ownerDocument.activeElement === active.hit.el) return
      commitActive()
    }, 0)
  }, [commitActive])

  const attach = useCallback(() => {
    const iframe = iframeRef.current
    const doc = iframe?.contentDocument
    if (!iframe || !doc || !doc.body) return
    if (!iframe.contentWindow?.location.pathname.startsWith('/')) return

    if (attachedDocRef.current !== doc) {
      attachedDocRef.current = doc
      activeRef.current = null
      activeElRef.current = null
      setSelected(null)
      setPopoverOpen(false)

      if (!doc.getElementById(EDITOR_STYLE_ID)) {
        const style = doc.createElement('style')
        style.id = EDITOR_STYLE_ID
        style.textContent = EDITOR_CSS
        doc.head.appendChild(style)
      }

      doc.addEventListener('click', onFrameClick, true)
      doc.addEventListener('keydown', onFrameKeyDown, true)
      doc.addEventListener('input', onFrameInput, true)
      doc.addEventListener('focusout', onFrameFocusOut, true)

      observerRef.current?.disconnect()
      const observer = new MutationObserver(scheduleScan)
      observer.observe(doc.body, { childList: true, subtree: true })
      observerRef.current = observer

      const path = iframe.contentWindow?.location.pathname
      if (path && path.startsWith('/')) setPage(path)
    }

    doc.documentElement.setAttribute('data-v2edit-mode', modeRef.current)
    scanDocument(doc)
  }, [onFrameClick, onFrameFocusOut, onFrameInput, onFrameKeyDown, scanDocument, scheduleScan])

  useEffect(() => {
    attachRef.current = attach
  }, [attach])

  const applyPayload = useCallback((data: Payload) => {
    const resolved: Record<string, unknown> = {}
    const defaults = data.defaults as unknown as Record<string, unknown>
    for (const key of Object.keys(defaults)) {
      resolved[key] = mergeV2(defaults[key], data.overrides[key as V2ContentKey])
    }
    resolvedRef.current = resolved
    entriesRef.current = collectEntries(resolved)
    setPayload(data)
  }, [])

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/v2-content')
      if (res.status === 401) {
        setError('פג תוקף החיבור. יש להתחבר מחדש ל-/admin/login.')
        return
      }
      if (!res.ok) {
        setError(`שגיאת שרת (${res.status}). נסו לרענן את הדף.`)
        return
      }
      const data = (await res.json()) as Partial<Payload>
      if (!data?.defaults) {
        setError('התקבלה תשובה לא תקינה מהשרת.')
        return
      }
      applyPayload({
        defaults: data.defaults,
        overrides: data.overrides ?? {},
        updatedAt: data.updatedAt ?? null,
      })
    } catch {
      setError('לא הצלחנו לטעון את התוכן. בדקו את החיבור ונסו שוב.')
    }
  }, [applyPayload])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (payload) attachRef.current()
  }, [payload])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    let retry = 0
    const onLoad = () => {
      attachRef.current()
      const top = restoreScrollRef.current
      if (top === null) return
      restoreScrollRef.current = null
      const apply = () => iframe.contentWindow?.scrollTo({ top, behavior: 'instant' })
      apply()
      window.clearTimeout(retry)
      retry = window.setTimeout(apply, 300)
    }
    iframe.addEventListener('load', onLoad)
    return () => {
      window.clearTimeout(retry)
      iframe.removeEventListener('load', onLoad)
    }
  }, [])

  useEffect(
    () => () => {
      observerRef.current?.disconnect()
      const doc = attachedDocRef.current
      if (!doc) return
      doc.removeEventListener('click', onFrameClick, true)
      doc.removeEventListener('keydown', onFrameKeyDown, true)
      doc.removeEventListener('input', onFrameInput, true)
      doc.removeEventListener('focusout', onFrameFocusOut, true)
    },
    [onFrameClick, onFrameFocusOut, onFrameInput, onFrameKeyDown],
  )

  useEffect(() => {
    modeRef.current = mode
    attachedDocRef.current?.documentElement.setAttribute('data-v2edit-mode', mode)
    if (mode === 'browse') clearSelection()
  }, [clearSelection, mode])

  useEffect(() => {
    if (!selected) return
    let frame = 0
    const tick = () => {
      updateRect()
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [selected, updateRect])

  const changeCount = Object.keys(edits).length

  useEffect(() => {
    if (changeCount === 0) return
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [changeCount])

  const save = useCallback(async () => {
    commitActive()
    const pending = Object.values(editsRef.current)
    const resolved = resolvedRef.current
    if (!pending.length || !resolved) return
    setSaving(true)
    setWarning(null)
    try {
      const byKey = new Map<V2ContentKey, unknown>()
      for (const edit of pending) {
        const base = byKey.has(edit.key) ? byKey.get(edit.key) : resolved[edit.key]
        byKey.set(edit.key, setAtPath(base, edit.path.slice(1), edit.value))
      }
      for (const [key, value] of byKey) {
        const res = await fetch('/api/admin/v2-content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value }),
        })
        if (res.status === 401) {
          setError('פג תוקף החיבור. יש להתחבר מחדש ל-/admin/login.')
          return
        }
        if (!res.ok) {
          setError(`השמירה של "${sectionLabel(key)}" נכשלה (${res.status}).`)
          return
        }
      }
      const onPage = new Set(Array.from(hitsRef.current.values(), (hit) => hit.entry.pathId))
      verifyRef.current = pending.filter((edit) => onPage.has(edit.pathId))
      editsRef.current = {}
      setEdits({})
      clearSelection()
      setPanelOpen(false)
      await load()
      restoreScrollRef.current = iframeRef.current?.contentWindow?.scrollY ?? 0
      iframeRef.current?.contentWindow?.location.reload()
      setJustSaved(true)
      window.setTimeout(() => setJustSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }, [clearSelection, commitActive, load])

  useEffect(() => {
    saveRef.current = () => void save()
  }, [save])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        saveRef.current()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const revert = useCallback(
    (pathId: string) => {
      const edit = editsRef.current[pathId]
      if (!edit) return
      const next = { ...editsRef.current }
      delete next[pathId]
      editsRef.current = next
      setEdits(next)
      writeEntry(pathId, edit.original, false)
    },
    [writeEntry],
  )

  const discardAll = useCallback(() => {
    commitActive()
    for (const edit of Object.values(editsRef.current)) writeEntry(edit.pathId, edit.original, false)
    editsRef.current = {}
    setEdits({})
    clearSelection()
    setPanelOpen(false)
  }, [clearSelection, commitActive, writeEntry])

  const jump = useCallback(
    (pathId: string) => {
      const hit = Array.from(hitsRef.current.values()).find((entry) => entry.entry.pathId === pathId)
      if (!hit) {
        setWarning('הטקסט הזה נערך בדף אחר. עברו לדף שלו כדי לראות אותו מסומן.')
        return
      }
      hit.el.scrollIntoView({ block: 'center', behavior: 'smooth' })
      select([hit])
    },
    [select],
  )

  const goto = useCallback(
    (path: string) => {
      clearSelection()
      setPage(path)
      const win = iframeRef.current?.contentWindow
      if (win) win.location.href = path
    },
    [clearSelection],
  )

  const popoverFields = useMemo<PopoverField[]>(() => {
    if (!selected) return []
    const seen = new Set<string>()
    const fields: PopoverField[] = []
    for (const hit of selected) {
      if (seen.has(hit.entry.pathId)) continue
      seen.add(hit.entry.pathId)
      fields.push({
        pathId: hit.entry.pathId,
        label: entryLabel(hit.entry),
        value: edits[hit.entry.pathId]?.value ?? hit.entry.value,
        original: hit.entry.value,
      })
    }
    return fields
  }, [edits, selected])

  const changes = useMemo<PendingChange[]>(
    () =>
      Object.values(edits).map((edit) => ({
        pathId: edit.pathId,
        label: edit.label,
        original: edit.original,
        value: edit.value,
      })),
    [edits],
  )

  const width = DEVICES.find((entry) => entry.id === device)?.width ?? null
  const selectedDirty = selected ? Boolean(edits[selected[0].entry.pathId]) : false

  if (error) {
    return (
      <div>
        <AdminHeader title="עריכה חזותית" subtitle="שגיאה" />
        <div className="p-4 md:p-8" dir="rtl">
          <div className="max-w-lg rounded-xl border border-red-100 bg-red-50 p-5">
            <p className="text-[14px] font-semibold text-[#b91c1c]">{error}</p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => window.location.reload()}
                style={{ background: 'linear-gradient(92.63deg, #2447D6 14.57%, #3E96F9 99.27%)' }}
                className="rounded-lg px-4 py-2 text-[13px] font-semibold text-white"
              >
                רענון
              </button>
              <a
                href="/admin/login"
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-[13px] text-[#6b7280] hover:border-[#2447D6] hover:text-[#2447D6]"
              >
                מסך התחברות
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      <AdminHeader
        title="עריכה חזותית"
        subtitle={
          payload ? `${hitCount} טקסטים ניתנים לעריכה בדף · לחצו על טקסט כדי לשנות` : 'טוען...'
        }
      />

      <LiveToolbar
        page={page}
        onPage={goto}
        device={device}
        onDevice={setDevice}
        mode={mode}
        onMode={setMode}
        changeCount={changeCount}
        panelOpen={panelOpen}
        onPanel={() => setPanelOpen((open) => !open)}
        onSave={() => void save()}
        onDiscard={discardAll}
        saving={saving}
        justSaved={justSaved}
      />

      {warning ? (
        <div
          dir="rtl"
          className="flex items-start gap-2 bg-amber-50 px-4 py-2 text-[12px] text-amber-700"
        >
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span className="flex-1">{warning}</span>
          <button onClick={() => setWarning(null)} className="text-amber-500 hover:text-amber-800">
            <X size={14} />
          </button>
        </div>
      ) : null}

      <div className="relative flex-1 overflow-auto bg-[#e9eaee] p-3">
        <iframe
          ref={iframeRef}
          src="/v2"
          title="תצוגה מקדימה של האתר"
          className="mx-auto block h-full rounded-lg border border-gray-300 bg-white shadow-sm"
          style={{ width: width ? `${width}px` : '100%', maxWidth: '100%' }}
        />

        {panelOpen ? (
          <ChangesPanel
            changes={changes}
            onJump={jump}
            onRevert={revert}
            onClose={() => setPanelOpen(false)}
          />
        ) : null}
      </div>

      {selected && rect && mode === 'edit' ? (
        <div
          dir="rtl"
          style={{
            top: Math.max(64, rect.top - 34),
            left: Math.min(Math.max(8, rect.left), window.innerWidth - 260),
          }}
          className="fixed z-40 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-1 shadow-lg"
        >
          <span className="max-w-[150px] truncate text-[11px] text-[#9ca3af]">
            {entryLabel(selected[0].entry)}
          </span>
          <button
            onClick={() => setPopoverOpen((open) => !open)}
            title="עריכה בחלון (טקסט ארוך)"
            className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] text-[#6b7280] hover:bg-[#eef2ff] hover:text-[#2447D6]"
          >
            <TextCursorInput size={13} /> עורך
          </button>
          <button
            onClick={() => revert(selected[0].entry.pathId)}
            disabled={!selectedDirty}
            title="ביטול השינוי"
            className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] text-[#6b7280] hover:bg-red-50 hover:text-[#ef4444] disabled:opacity-30"
          >
            <RotateCcw size={13} />
          </button>
          <button
            onClick={clearSelection}
            title="סגירה"
            className="rounded-md px-1 py-1 text-[#9ca3af] hover:text-[#111827]"
          >
            <X size={13} />
          </button>
        </div>
      ) : null}

      {popoverOpen && rect && popoverFields.length > 0 ? (
        <TextPopover
          fields={popoverFields}
          top={Math.min(rect.top + rect.height + 10, window.innerHeight - 300)}
          left={Math.min(Math.max(8, rect.left), window.innerWidth - 356)}
          onChange={(pathId, value) => {
            const hit = selected?.find((entry) => entry.entry.pathId === pathId)
            if (hit) applyEdit(hit.entry, value)
          }}
          onRevert={revert}
          onClose={() => setPopoverOpen(false)}
        />
      ) : null}
    </div>
  )
}
