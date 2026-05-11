'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { canonicalPath } from '@/lib/site-seo-config'

const inputCls =
  'w-full px-3 py-2 border border-[#d9d9d9] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1B1BB3]/20 focus:border-[#1B1BB3] bg-white text-right'

type SchemaMode = 'none' | 'webpage' | 'service' | 'raw'

const WEB_KEYS = new Set(['@context', '@type', 'name', 'description', 'url', 'inLanguage'])
const SVC_KEYS = new Set(['@context', '@type', 'name', 'description', 'url'])

function detectMode(raw: string): SchemaMode {
  const t = raw.trim()
  if (!t) return 'none'
  let v: unknown
  try {
    v = JSON.parse(t)
  } catch {
    return 'raw'
  }
  if (Array.isArray(v) || v === null || typeof v !== 'object') return 'raw'
  const o = v as Record<string, unknown>
  const type = o['@type']
  const keys = Object.keys(o)
  if (type === 'WebPage' && keys.every((k) => WEB_KEYS.has(k))) return 'webpage'
  if (type === 'Service' && keys.every((k) => SVC_KEYS.has(k))) return 'service'
  return 'raw'
}

function buildWebPage(name: string, description: string, url: string) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: name.trim(),
    description: description.trim(),
    url: url.trim(),
    inLanguage: 'he',
  })
}

function buildService(name: string, description: string, url: string) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: name.trim(),
    description: description.trim(),
    url: url.trim(),
  })
}

function parseWebPage(raw: string) {
  const o = JSON.parse(raw) as Record<string, unknown>
  return {
    name: String(o.name ?? ''),
    description: String(o.description ?? ''),
    url: String(o.url ?? ''),
  }
}

function parseService(raw: string) {
  const o = JSON.parse(raw) as Record<string, unknown>
  return {
    name: String(o.name ?? ''),
    description: String(o.description ?? ''),
    url: String(o.url ?? ''),
  }
}

function normJson(s: string): string {
  const t = (s ?? '').trim()
  if (!t) return ''
  try {
    return JSON.stringify(JSON.parse(t))
  } catch {
    return t
  }
}

interface Props {
  routePath: string
  pageTitle: string
  pageDescription: string
  jsonLd: string
  onChange: (jsonLd: string) => void
}

export default function SchemaLdBuilder({ routePath, pageTitle, pageDescription, jsonLd, onChange }: Props) {
  const defaultUrl = canonicalPath(routePath)
  const lastEmitted = useRef<string | null>(null)

  const [mode, setMode] = useState<SchemaMode>(() => detectMode(jsonLd))
  const [rawText, setRawText] = useState(() => {
    const m = detectMode(jsonLd)
    return m === 'raw' || m === 'none' ? jsonLd : ''
  })
  const [wpName, setWpName] = useState('')
  const [wpDesc, setWpDesc] = useState('')
  const [wpUrl, setWpUrl] = useState(defaultUrl)
  const [svName, setSvName] = useState('')
  const [svDesc, setSvDesc] = useState('')
  const [svUrl, setSvUrl] = useState(defaultUrl)

  const hydrate = useCallback(
    (raw: string) => {
      const m = detectMode(raw)
      setMode(m)
      if (m === 'webpage') {
        try {
          const p = parseWebPage(raw)
          setWpName(p.name || pageTitle)
          setWpDesc(p.description || pageDescription)
          setWpUrl(p.url || defaultUrl)
        } catch {
          setMode('raw')
          setRawText(raw)
        }
      } else if (m === 'service') {
        try {
          const p = parseService(raw)
          setSvName(p.name || pageTitle)
          setSvDesc(p.description || pageDescription)
          setSvUrl(p.url || defaultUrl)
        } catch {
          setMode('raw')
          setRawText(raw)
        }
      } else if (m === 'raw') {
        setRawText(raw)
      }
    },
    [defaultUrl, pageDescription, pageTitle],
  )

  useEffect(() => {
    if (jsonLd === lastEmitted.current) return
    lastEmitted.current = null
    hydrate(jsonLd)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync only when server value changes
  }, [jsonLd])

  useEffect(() => {
    let built = ''
    if (mode === 'none') built = ''
    else if (mode === 'webpage') built = buildWebPage(wpName, wpDesc, wpUrl)
    else if (mode === 'service') built = buildService(svName, svDesc, svUrl)
    else built = rawText

    if (normJson(built) === normJson(jsonLd)) {
      lastEmitted.current = built
      return
    }
    lastEmitted.current = built
    onChange(built)
  }, [mode, wpName, wpDesc, wpUrl, svName, svDesc, svUrl, rawText, jsonLd, onChange])

  const fillFromPage = () => {
    setWpName(pageTitle)
    setWpDesc(pageDescription)
    setWpUrl(defaultUrl)
    setSvName(pageTitle)
    setSvDesc(pageDescription)
    setSvUrl(defaultUrl)
  }

  const tableCls = 'w-full border-collapse text-[13px]'
  const thCls =
    'w-[min(220px,34%)] align-top py-2.5 pl-3 text-right text-[12px] font-semibold text-[#374151] border-b border-gray-100'
  const tdCls = 'py-2.5 border-b border-gray-100 align-top'

  return (
    <div className="rounded-lg border border-[#e5e7eb] bg-white p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-bold text-[#111827]">JSON-LD (מבנה)</span>
        <button type="button" onClick={fillFromPage} className="text-[12px] font-medium text-[#1B1BB3] hover:underline">
          מילוי שם ותיאור מהדף
        </button>
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-[12px] text-[#6b7280]">סוג סכימה</label>
        <select
          className={`${inputCls} max-w-md`}
          value={mode}
          onChange={(e) => {
            const next = e.target.value as SchemaMode
            if (next === 'raw') {
              try {
                if (mode === 'webpage') setRawText(buildWebPage(wpName, wpDesc, wpUrl))
                else if (mode === 'service') setRawText(buildService(svName, svDesc, svUrl))
                else setRawText(jsonLd)
              } catch {
                setRawText(jsonLd)
              }
            }
            if (next === 'webpage') {
              setWpName((n) => n || pageTitle)
              setWpDesc((d) => d || pageDescription)
              setWpUrl((u) => u || defaultUrl)
            }
            if (next === 'service') {
              setSvName((n) => n || pageTitle)
              setSvDesc((d) => d || pageDescription)
              setSvUrl((u) => u || defaultUrl)
            }
            setMode(next)
          }}
        >
          <option value="none">ללא JSON-LD</option>
          <option value="webpage">WebPage (דף מידע)</option>
          <option value="service">Service (שירות)</option>
          <option value="raw">JSON גולמי (מתקדם)</option>
        </select>
      </div>

      {mode === 'webpage' ? (
        <div className="overflow-x-auto">
          <table className={tableCls}>
            <tbody>
              <tr>
                <th className={thCls}>שם (name)</th>
                <td className={tdCls}>
                  <input className={inputCls} value={wpName} onChange={(e) => setWpName(e.target.value)} />
                </td>
              </tr>
              <tr>
                <th className={thCls}>תיאור (description)</th>
                <td className={tdCls}>
                  <textarea className={`${inputCls} min-h-[72px]`} rows={3} value={wpDesc} onChange={(e) => setWpDesc(e.target.value)} />
                </td>
              </tr>
              <tr>
                <th className={thCls}>כתובת (url)</th>
                <td className={tdCls}>
                  <input className={`${inputCls} font-mono text-[12px]`} dir="ltr" value={wpUrl} onChange={(e) => setWpUrl(e.target.value)} />
                </td>
              </tr>
              <tr>
                <th className={thCls}>שפה</th>
                <td className={tdCls}>
                  <span className="text-[#6b7280]">he (קבוע)</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}

      {mode === 'service' ? (
        <div className="overflow-x-auto">
          <table className={tableCls}>
            <tbody>
              <tr>
                <th className={thCls}>שם השירות</th>
                <td className={tdCls}>
                  <input className={inputCls} value={svName} onChange={(e) => setSvName(e.target.value)} />
                </td>
              </tr>
              <tr>
                <th className={thCls}>תיאור</th>
                <td className={tdCls}>
                  <textarea className={`${inputCls} min-h-[72px]`} rows={3} value={svDesc} onChange={(e) => setSvDesc(e.target.value)} />
                </td>
              </tr>
              <tr>
                <th className={thCls}>כתובת (url)</th>
                <td className={tdCls}>
                  <input className={`${inputCls} font-mono text-[12px]`} dir="ltr" value={svUrl} onChange={(e) => setSvUrl(e.target.value)} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}

      {mode === 'raw' ? (
        <div>
          <p className="mb-2 text-[12px] text-[#6b7280]">למבנים מורכבים או מערך אובייקטים. שגיאת JSON תיחסם בשמירה.</p>
          <textarea
            className={`${inputCls} min-h-[160px] font-mono text-[12px]`}
            dir="ltr"
            spellCheck={false}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
        </div>
      ) : null}

      {mode === 'none' ? <p className="text-[12px] text-[#9ca3af]">לא יישלח JSON-LD לדף זה.</p> : null}
    </div>
  )
}
