'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { RouteSeoPayload } from '@/lib/site-seo-config'
import { EDITABLE_SEO_ROUTES } from '@/lib/site-seo-config'
import SchemaLdBuilder from './SchemaLdBuilder'

const gradient = 'linear-gradient(92.63deg, #2447D6 14.57%, #3E96F9 99.27%)'

const inputCls =
  'w-full px-3 py-2 border border-[#d9d9d9] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#2447D6]/20 focus:border-[#2447D6] bg-white transition-all text-right'

const tableWrap = 'overflow-x-auto rounded-lg border border-[#e5e7eb] bg-white'
const tableCls = 'w-full min-w-[520px] border-collapse text-[13px]'
const thCls =
  'w-[min(240px,38%)] align-top py-2.5 px-3 text-right text-[12px] font-semibold text-[#374151] border-b border-gray-100 bg-[#fafafa]'
const tdCls = 'py-2.5 px-3 border-b border-gray-100 align-top'

export default function SiteSeoForm() {
  const router = useRouter()
  const [routes, setRoutes] = useState<Record<string, RouteSeoPayload>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [selectedPath, setSelectedPath] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/site-seo')
      .then((r) => r.json())
      .then((d: Record<string, RouteSeoPayload>) => setRoutes(d))
      .catch(() => setError('טעינה נכשלה'))
      .finally(() => setLoading(false))
  }, [])

  const setRow = (path: string, field: keyof RouteSeoPayload, value: string) => {
    setRoutes((prev) => ({
      ...prev,
      [path]: { ...prev[path], [field]: value },
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    const res = await fetch('/api/admin/site-seo', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(routes),
    })
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      router.refresh()
    } else {
      const d = await res.json()
      setError(d.error || 'שגיאה')
    }
    setSaving(false)
  }

  if (loading) {
    return <div className="text-[14px] text-[#6b7280] p-8">טוען…</div>
  }

  const selectedRoute = selectedPath
    ? EDITABLE_SEO_ROUTES.find((r) => r.path === selectedPath) ?? null
    : null

  return (
    <div dir="rtl">
      {!selectedPath ? (
        /* ── Routes table ── */
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-[700px] w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="text-right px-4 py-3 text-[12px] font-semibold text-[#6b7280]">דף</th>
                <th className="text-right px-4 py-3 text-[12px] font-semibold text-[#6b7280]">כתובת</th>
                <th className="text-right px-4 py-3 text-[12px] font-semibold text-[#6b7280]">כותרת</th>
                <th className="text-right px-4 py-3 text-[12px] font-semibold text-[#6b7280]">תיאור</th>
                <th className="text-right px-4 py-3 text-[12px] font-semibold text-[#6b7280]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {EDITABLE_SEO_ROUTES.map(({ path, label }) => {
                const data = routes[path]
                return (
                  <tr key={path} className="align-top">
                    <td className="px-4 py-3 text-[13px] font-medium text-[#111827] min-w-[140px]">{label}</td>
                    <td className="px-4 py-3 text-[13px] text-[#6b7280] font-mono min-w-[160px]" dir="ltr">{path}</td>
                    <td className="px-4 py-3 text-[12px] text-[#6b7280] min-w-[200px]">
                      {data?.title ? `${data.title.slice(0, 50)}${data.title.length > 50 ? '…' : ''}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#6b7280] min-w-[220px]">
                      {data?.description ? `${data.description.slice(0, 70)}${data.description.length > 70 ? '…' : ''}` : '-'}
                    </td>
                    <td className="px-4 py-3 min-w-[100px]">
                      <button
                        onClick={() => setSelectedPath(path)}
                        className="px-3 py-1.5 text-[12px] rounded-lg border border-[#2447D6]/30 text-[#2447D6] hover:bg-[#2447D6]/5 transition-colors"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : selectedRoute ? (
        /* ── Route editor ── */
        <div className="max-w-3xl">
          <button
            onClick={() => setSelectedPath(null)}
            className="flex items-center gap-1.5 text-[13px] text-[#6b7280] hover:text-[#2447D6] mb-6 transition-colors"
          >
            ← חזרה לרשימת הדפים
          </button>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm mb-6">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-[15px] font-bold text-[#111827]">{selectedRoute.label}</h3>
              <span className="text-[12px] text-[#9ca3af] font-mono" dir="ltr">{selectedRoute.path}</span>
            </div>

            <div className="flex flex-col gap-3 mb-5">
              <div>
                <label className="mb-1 block text-[12px] font-semibold text-[#374151]">כותרת (title)</label>
                <input
                  className={inputCls}
                  value={routes[selectedRoute.path]?.title ?? ''}
                  onChange={(e) => setRow(selectedRoute.path, 'title', e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-semibold text-[#374151]">תיאור (meta description)</label>
                <textarea
                  className={`${inputCls} min-h-[88px]`}
                  rows={3}
                  value={routes[selectedRoute.path]?.description ?? ''}
                  onChange={(e) => setRow(selectedRoute.path, 'description', e.target.value)}
                />
              </div>
            </div>

            <details className="rounded-lg border border-[#e5e7eb] bg-[#fafafa] p-3">
              <summary className="cursor-pointer text-[13px] font-semibold text-[#374151]">
                הרחבות SEO — טבלה (OG, Twitter, מילות מפתח) + JSON-LD
              </summary>
              <div className="mt-4 space-y-6 border-t border-[#e5e7eb] pt-4">
                <div className={tableWrap}>
                  <table className={tableCls}>
                    <tbody>
                      <tr>
                        <th className={thCls}>Open Graph — כותרת</th>
                        <td className={tdCls}>
                          <p className="mb-1.5 text-[11px] text-[#6b7280]">ריק = אוטומטי מהכותרת</p>
                          <input
                            className={inputCls}
                            value={routes[selectedRoute.path]?.ogTitle ?? ''}
                            onChange={(e) => setRow(selectedRoute.path, 'ogTitle', e.target.value)}
                            dir="ltr"
                          />
                        </td>
                      </tr>
                      <tr>
                        <th className={thCls}>Open Graph — תיאור</th>
                        <td className={tdCls}>
                          <p className="mb-1.5 text-[11px] text-[#6b7280]">ריק = כמו meta description</p>
                          <textarea
                            className={`${inputCls} min-h-[72px]`}
                            rows={2}
                            value={routes[selectedRoute.path]?.ogDescription ?? ''}
                            onChange={(e) => setRow(selectedRoute.path, 'ogDescription', e.target.value)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th className={thCls}>Twitter — כותרת</th>
                        <td className={tdCls}>
                          <p className="mb-1.5 text-[11px] text-[#6b7280]">ריק = כמו OG</p>
                          <input
                            className={inputCls}
                            value={routes[selectedRoute.path]?.twitterTitle ?? ''}
                            onChange={(e) => setRow(selectedRoute.path, 'twitterTitle', e.target.value)}
                            dir="ltr"
                          />
                        </td>
                      </tr>
                      <tr>
                        <th className={thCls}>Twitter — תיאור</th>
                        <td className={tdCls}>
                          <p className="mb-1.5 text-[11px] text-[#6b7280]">ריק = כמו meta</p>
                          <textarea
                            className={`${inputCls} min-h-[72px]`}
                            rows={2}
                            value={routes[selectedRoute.path]?.twitterDescription ?? ''}
                            onChange={(e) => setRow(selectedRoute.path, 'twitterDescription', e.target.value)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th className={thCls}>מילות מפתח</th>
                        <td className={tdCls}>
                          <p className="mb-1.5 text-[11px] text-[#6b7280]">מופרדות בפסיק</p>
                          <input
                            className={inputCls}
                            value={routes[selectedRoute.path]?.keywords ?? ''}
                            onChange={(e) => setRow(selectedRoute.path, 'keywords', e.target.value)}
                            placeholder="SEO, בניית אתרים"
                            dir="ltr"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <SchemaLdBuilder
                  routePath={selectedRoute.path}
                  pageTitle={routes[selectedRoute.path]?.title ?? ''}
                  pageDescription={routes[selectedRoute.path]?.description ?? ''}
                  jsonLd={routes[selectedRoute.path]?.jsonLd ?? ''}
                  onChange={(v) => setRow(selectedRoute.path, 'jsonLd', v)}
                />
              </div>
            </details>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700 mb-4">{error}</div>
          ) : null}

          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="rounded-lg px-6 py-2.5 text-[14px] font-bold text-white hover:opacity-90 disabled:opacity-60"
            style={{ background: gradient }}
          >
            {saving ? 'שומר…' : saved ? 'נשמר ✓' : 'שמור את כל השינויים'}
          </button>
        </div>
      ) : null}
    </div>
  )
}
