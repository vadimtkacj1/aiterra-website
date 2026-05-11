'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { RouteSeoPayload } from '@/lib/site-seo-config'
import { EDITABLE_SEO_ROUTES } from '@/lib/site-seo-config'
import SchemaLdBuilder from './SchemaLdBuilder'

const inputCls =
  'w-full px-3 py-2 border border-[#d9d9d9] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1B1BB3]/20 focus:border-[#1B1BB3] bg-white transition-all text-right'

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
  const [error, setError] = useState('')

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

  return (
    <div className="flex flex-col gap-8">
      <p className="text-[13px] text-[#6b7280] max-w-3xl leading-relaxed">
        <strong>בסיס:</strong> כותרת ותיאור. <strong>טבלה:</strong> Open Graph, Twitter, מילות מפתח.
        <strong> JSON-LD:</strong> בוחרים סוג (WebPage / Service) או JSON גולמי. הנתונים ב־
        <code className="mx-1 rounded bg-gray-100 px-1" dir="ltr">data/site-seo.json</code>.
      </p>

      {EDITABLE_SEO_ROUTES.map(({ path, label }) => (
        <div
          key={path}
          className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-[15px] font-bold text-[#111827]">{label}</h3>
            <span className="text-[12px] text-[#9ca3af] font-mono" dir="ltr">
              {path}
            </span>
          </div>

          <div className="mb-5 flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-[#374151]">כותרת (title)</label>
              <input
                className={inputCls}
                value={routes[path]?.title ?? ''}
                onChange={(e) => setRow(path, 'title', e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-[#374151]">תיאור (meta description)</label>
              <textarea
                className={`${inputCls} min-h-[88px]`}
                rows={3}
                value={routes[path]?.description ?? ''}
                onChange={(e) => setRow(path, 'description', e.target.value)}
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
                          value={routes[path]?.ogTitle ?? ''}
                          onChange={(e) => setRow(path, 'ogTitle', e.target.value)}
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
                          value={routes[path]?.ogDescription ?? ''}
                          onChange={(e) => setRow(path, 'ogDescription', e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th className={thCls}>Twitter — כותרת</th>
                      <td className={tdCls}>
                        <p className="mb-1.5 text-[11px] text-[#6b7280]">ריק = כמו OG</p>
                        <input
                          className={inputCls}
                          value={routes[path]?.twitterTitle ?? ''}
                          onChange={(e) => setRow(path, 'twitterTitle', e.target.value)}
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
                          value={routes[path]?.twitterDescription ?? ''}
                          onChange={(e) => setRow(path, 'twitterDescription', e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th className={thCls}>מילות מפתח</th>
                      <td className={tdCls}>
                        <p className="mb-1.5 text-[11px] text-[#6b7280]">מופרדות בפסיק</p>
                        <input
                          className={inputCls}
                          value={routes[path]?.keywords ?? ''}
                          onChange={(e) => setRow(path, 'keywords', e.target.value)}
                          placeholder="SEO, בניית אתרים"
                          dir="ltr"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <SchemaLdBuilder
                routePath={path}
                pageTitle={routes[path]?.title ?? ''}
                pageDescription={routes[path]?.description ?? ''}
                jsonLd={routes[path]?.jsonLd ?? ''}
                onChange={(v) => setRow(path, 'jsonLd', v)}
              />
            </div>
          </details>
        </div>
      ))}

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">{error}</div>
      ) : null}

      <button
        type="button"
        onClick={() => void handleSave()}
        disabled={saving}
        className="self-start rounded-lg bg-gradient-to-l from-[#530FAD] to-[#1B1BB3] px-6 py-2.5 text-[14px] font-bold text-white hover:opacity-90 disabled:opacity-60"
      >
        {saving ? 'שומר…' : 'שמור את כל השינויים'}
      </button>
    </div>
  )
}
