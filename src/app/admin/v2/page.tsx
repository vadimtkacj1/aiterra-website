'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Check, CornerDownLeft, ExternalLink, RotateCcw, Save, Search } from 'lucide-react'
import AdminHeader from '@/components/admin/AdminHeader'
import type { V2Content, V2ContentKey } from '@/app/v2/content'
import { deepEqual, mergeV2, type V2Overrides } from '@/app/v2/contentMerge'
import Field from './FieldEditor'
import { FIELD_LABELS, SECTION_GROUPS, SECTION_INDEX } from './sections'

type Hit = { key: V2ContentKey; path: string; field: string; value: string }

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

function collectText(value: unknown, path: string, field: string, out: Omit<Hit, 'key'>[]) {
  if (typeof value === 'string') {
    if (value.trim()) out.push({ path, field, value })
    return
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      if (isPlainObject(item)) {
        for (const key of Object.keys(item)) {
          collectText(item[key], `${path}.${index}.${key}`, key, out)
        }
      } else {
        collectText(item, path, field, out)
      }
    })
    return
  }
  if (isPlainObject(value)) {
    for (const key of Object.keys(value)) collectText(value[key], `${path}.${key}`, key, out)
  }
}

const gradient = 'linear-gradient(92.63deg, #2447D6 14.57%, #3E96F9 99.27%)'

type Payload = {
  defaults: V2Content
  overrides: V2Overrides
  updatedAt: string | null
}

export default function AdminV2ContentPage() {
  const [payload, setPayload] = useState<Payload | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [active, setActive] = useState<V2ContentKey | null>(null)
  const [draft, setDraft] = useState<unknown>(null)
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState<string | undefined>(undefined)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const res = await fetch('/api/admin/v2-content')
        if (res.status === 401) {
          if (!cancelled) setLoadError('פג תוקף החיבור. יש להתחבר מחדש ל-/admin/login.')
          return
        }
        if (!res.ok) {
          if (!cancelled) setLoadError(`שגיאת שרת (${res.status}). נסו לרענן את הדף.`)
          return
        }
        const data = (await res.json()) as Partial<Payload>
        if (!data || typeof data !== 'object' || !data.defaults) {
          if (!cancelled) setLoadError('התקבלה תשובה לא תקינה מהשרת.')
          return
        }
        if (!cancelled) {
          setPayload({
            defaults: data.defaults,
            overrides: data.overrides ?? {},
            updatedAt: data.updatedAt ?? null,
          })
        }
      } catch {
        if (!cancelled) setLoadError('לא הצלחנו לטעון את התוכן. בדקו את החיבור ונסו שוב.')
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const resolved = useMemo(() => {
    if (!payload || !active) return null
    return mergeV2(payload.defaults[active], payload.overrides[active])
  }, [payload, active])

  const open = (key: V2ContentKey, path?: string) => {
    if (!payload) return
    setActive(key)
    setDraft(mergeV2(payload.defaults[key], payload.overrides[key]))
    setHighlight(path)
    setSaved(false)
  }

  const back = () => {
    if (dirty && !confirm('יש שינויים שלא נשמרו. לצאת בלי לשמור?')) return
    setActive(null)
    setDraft(null)
    setHighlight(undefined)
  }

  const dirty = active !== null && !deepEqual(draft, resolved)

  const save = async () => {
    if (!active) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/v2-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: active, value: draft }),
      })
      if (res.status === 401) {
        setLoadError('פג תוקף החיבור. יש להתחבר מחדש ל-/admin/login.')
        return
      }
      if (!res.ok) {
        alert(`השמירה נכשלה (${res.status}).`)
        return
      }
      const data = (await res.json()) as { overrides?: V2Overrides; updatedAt?: string; error?: string }
      if (data.error) {
        alert(data.error)
        return
      }
      setPayload((prev) =>
        prev && data.overrides
          ? { ...prev, overrides: data.overrides, updatedAt: data.updatedAt ?? prev.updatedAt }
          : prev,
      )
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  const resetSection = async () => {
    if (!active || !payload) return
    if (!confirm('להחזיר את כל הסקשן לטקסט המקורי מהקוד?')) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/v2-content?key=${encodeURIComponent(active)}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        alert(`האיפוס נכשל (${res.status}).`)
        return
      }
      const data = (await res.json()) as { overrides?: V2Overrides; updatedAt?: string }
      if (data.overrides) {
        setPayload((prev) =>
          prev ? { ...prev, overrides: data.overrides!, updatedAt: data.updatedAt ?? prev.updatedAt } : prev,
        )
        setDraft(payload.defaults[active])
      }
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        if (dirty && !saving) void save()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (loadError) {
    return (
      <div>
        <AdminHeader title="תוכן האתר" subtitle="שגיאה בטעינה" />
        <div className="p-4 md:p-8" dir="rtl">
          <div className="max-w-lg rounded-xl border border-red-100 bg-red-50 p-5">
            <p className="text-[14px] font-semibold text-[#b91c1c]">{loadError}</p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => window.location.reload()}
                style={{ background: gradient }}
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

  if (!payload) {
    return (
      <div>
        <AdminHeader title="תוכן האתר" subtitle="טוען..." />
        <div className="p-8 text-[14px] text-[#9ca3af]">טוען...</div>
      </div>
    )
  }

  const meta = active ? SECTION_INDEX[active] : null
  const edited = (key: V2ContentKey) => payload.overrides[key] !== undefined

  if (active && meta) {
    return (
      <div>
        <AdminHeader title="תוכן האתר" subtitle={`עורך: ${meta.label}`} />

        <div className="p-4 md:p-8" dir="rtl">
          <div className="mx-auto max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={back}
                className="flex items-center gap-1.5 text-[13px] text-[#6b7280] transition-colors hover:text-[#2447D6]"
              >
                <ArrowRight size={14} /> חזרה לרשימת הסקשנים
              </button>
              <a
                href={meta.preview}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[13px] text-[#6b7280] transition-colors hover:text-[#2447D6]"
              >
                <ExternalLink size={14} /> תצוגה באתר
              </a>
            </div>

            <div className="mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <h2 className="text-[15px] font-bold text-[#111827]">{meta.label}</h2>
              <p className="mt-1 text-[12px] text-[#9ca3af]">{meta.hint}</p>
              <label className="mt-3 flex w-fit items-center gap-2 text-[12px] text-[#6b7280]">
                <input
                  type="checkbox"
                  checked={showAdvanced}
                  onChange={(event) => setShowAdvanced(event.target.checked)}
                  className="h-4 w-4 accent-[#2447D6]"
                />
                הצגת שדות טכניים (מיקומים, צבעים, מזהים)
              </label>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <Field
                fieldKey={active}
                path={active}
                value={draft}
                defaultValue={payload.defaults[active]}
                showAdvanced={showAdvanced}
                highlight={highlight}
                onChange={setDraft}
              />
            </div>

            <div className="sticky bottom-0 mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-gray-100 bg-white/95 p-3 shadow-sm backdrop-blur">
              <button
                onClick={save}
                disabled={saving || !dirty}
                style={{ background: dirty ? gradient : '#d1d5db' }}
                className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-semibold text-white disabled:cursor-not-allowed"
              >
                <Save size={14} />
                {saving ? 'שומר...' : 'שמירה ופרסום'}
              </button>

              {saved ? (
                <span className="flex items-center gap-1.5 text-[13px] text-emerald-600">
                  <Check size={14} /> נשמר ופורסם באתר
                </span>
              ) : dirty ? (
                <span className="text-[13px] text-amber-600">יש שינויים שלא נשמרו</span>
              ) : null}

              <button
                onClick={resetSection}
                disabled={saving || !edited(active)}
                className="mr-auto flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-[12px] text-[#6b7280] hover:border-[#ef4444] hover:text-[#ef4444] disabled:opacity-40"
              >
                <RotateCcw size={13} /> איפוס הסקשן
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const needle = query.trim().toLowerCase()
  const hits: Hit[] = []
  if (needle.length >= 2) {
    for (const section of SECTION_GROUPS.flatMap((group) => group.sections)) {
      const merged = mergeV2(payload.defaults[section.key], payload.overrides[section.key])
      const found: Omit<Hit, 'key'>[] = []
      collectText(merged, section.key, section.key, found)
      for (const entry of found) {
        if (entry.value.toLowerCase().includes(needle)) {
          hits.push({ ...entry, key: section.key })
          if (hits.length >= 60) break
        }
      }
      if (hits.length >= 60) break
    }
  }

  const groups = SECTION_GROUPS.map((group) => ({
    ...group,
    sections: group.sections.filter(
      (section) =>
        !needle ||
        section.label.toLowerCase().includes(needle) ||
        section.hint.toLowerCase().includes(needle) ||
        section.key.toLowerCase().includes(needle),
    ),
  })).filter((group) => group.sections.length > 0)

  const editedCount = Object.keys(payload.overrides).length

  return (
    <div>
      <AdminHeader
        title="תוכן האתר"
        subtitle={
          editedCount > 0
            ? `${editedCount} סקשנים נערכו${payload.updatedAt ? ` · עודכן ${new Date(payload.updatedAt).toLocaleDateString('he-IL')}` : ''}`
            : 'עריכת כל הטקסטים באתר'
        }
      />

      <div className="p-4 md:p-8" dir="rtl">
        <div className="relative mb-6 max-w-md">
          <Search size={15} className="absolute top-1/2 right-3 -translate-y-1/2 text-[#9ca3af]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="חיפוש לפי שם סקשן או לפי טקסט שמופיע באתר..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-9 pl-3 text-[13px] outline-none focus:border-[#2447D6] focus:ring-2 focus:ring-[#2447D6]/10"
          />
        </div>

        {hits.length > 0 ? (
          <div className="mb-8">
            <h2 className="mb-3 text-[13px] font-bold tracking-wide text-[#6b7280]">
              טקסטים תואמים ({hits.length}
              {hits.length >= 60 ? '+' : ''})
            </h2>
            <div className="flex flex-col gap-1.5">
              {hits.map((hit, index) => (
                <button
                  key={`${hit.path}|${index}`}
                  onClick={() => open(hit.key, hit.path)}
                  className="group flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-3 text-right shadow-sm transition-all hover:border-[#2447D6]/40 hover:shadow-md"
                >
                  <CornerDownLeft
                    size={14}
                    className="mt-0.5 shrink-0 text-[#c3c8d1] group-hover:text-[#2447D6]"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] text-[#111827]">{hit.value}</span>
                    <span className="mt-0.5 block text-[11px] text-[#9ca3af]">
                      {SECTION_INDEX[hit.key]?.label ?? hit.key}
                      {' · '}
                      {FIELD_LABELS[hit.field] ?? hit.field}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-8">
          {groups.map((group) => (
            <section key={group.id}>
              <h2 className="mb-3 text-[13px] font-bold tracking-wide text-[#6b7280]">{group.label}</h2>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {group.sections.map((section) => (
                  <button
                    key={section.key}
                    onClick={() => open(section.key)}
                    className="group rounded-xl border border-gray-100 bg-white p-4 text-right shadow-sm transition-all hover:border-[#2447D6]/40 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[14px] font-semibold text-[#111827] group-hover:text-[#2447D6]">
                        {section.label}
                      </span>
                      {edited(section.key) ? (
                        <span className="shrink-0 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-600">
                          נערך
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-[#9ca3af]">{section.hint}</p>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
