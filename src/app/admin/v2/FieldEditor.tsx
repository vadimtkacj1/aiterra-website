'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, ImageUp, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { deepEqual } from '@/app/v2/contentMerge'
import { ADVANCED_KEYS, FIELD_LABELS, IMAGE_KEYS, LONG_TEXT_KEYS } from './sections'

type Json = unknown

const isPlainObject = (value: Json): value is Record<string, Json> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const IMAGE_PATTERN = /^\/?[\w./-]+\.(png|jpe?g|webp|svg|avif|gif)$/i
const LTR_PATTERN = /^(https?:|mailto:|tel:|\/|#|[A-Za-z0-9_-]+$)/

const labelFor = (key: string) => FIELD_LABELS[key] ?? key

const isImageValue = (key: string, value: Json) =>
  IMAGE_KEYS.has(key) || (typeof value === 'string' && IMAGE_PATTERN.test(value))

const isLtr = (key: string, value: string) =>
  key === 'href' || key === 'src' || key === 'id' || LTR_PATTERN.test(value.trim())

const summarize = (value: Json, index: number): string => {
  if (typeof value === 'string') return value.slice(0, 70) || `פריט ${index + 1}`
  if (isPlainObject(value)) {
    for (const key of ['title', 'label', 'name', 'question', 'heading', 'text', 'author', 'crumb', 'id']) {
      const candidate = value[key]
      if (typeof candidate === 'string' && candidate.trim()) return candidate.slice(0, 70)
      if (Array.isArray(candidate) && typeof candidate[0] === 'string') return String(candidate[0]).slice(0, 70)
    }
  }
  return `פריט ${index + 1}`
}

const onHighlightPath = (highlight: string | undefined, path: string) =>
  highlight !== undefined && (highlight === path || highlight.startsWith(`${path}.`))

const blankLike = (sample: Json): Json => {
  if (typeof sample === 'string') return ''
  if (typeof sample === 'number') return 0
  if (typeof sample === 'boolean') return false
  if (Array.isArray(sample)) return []
  if (isPlainObject(sample)) {
    return Object.fromEntries(Object.entries(sample).map(([key, value]) => [key, blankLike(value)]))
  }
  return ''
}

function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="החזרה לברירת המחדל"
      className="shrink-0 rounded-md border border-amber-300 bg-amber-50 p-1 text-amber-600 hover:bg-amber-100"
    >
      <RotateCcw size={12} />
    </button>
  )
}

function TextValue({
  value,
  defaultValue,
  fieldKey,
  onChange,
}: {
  value: string
  defaultValue: Json
  fieldKey: string
  onChange: (next: Json) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const image = isImageValue(fieldKey, value)
  const ltr = image || isLtr(fieldKey, value)
  const long = !ltr && (LONG_TEXT_KEYS.has(fieldKey) || value.length > 90)
  const changed = defaultValue !== undefined && !deepEqual(value, defaultValue)

  const upload = async (file: File) => {
    setUploading(true)
    try {
      const body = new FormData()
      body.append('file', file)
      body.append('dest', 'blog')
      const res = await fetch('/api/admin/upload', { method: 'POST', body })
      const data = (await res.json()) as { url?: string; error?: string }
      if (data.url) onChange(data.url)
      else if (data.error) alert(data.error)
    } finally {
      setUploading(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] text-[#111827] outline-none focus:border-[#2447D6] focus:ring-2 focus:ring-[#2447D6]/10'

  return (
    <div className="flex items-start gap-2">
      {image ? (
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value || '/icons/aiterra-blog-v2.svg'}
              alt=""
              className="h-11 w-11 shrink-0 rounded-lg border border-gray-200 bg-gray-50 object-contain"
            />
            <input
              value={value}
              dir="ltr"
              onChange={(event) => onChange(event.target.value)}
              className={`${inputClass} font-mono text-[12px]`}
            />
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) void upload(file)
                event.target.value = ''
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              title="העלאת קובץ"
              className="shrink-0 rounded-lg border border-gray-200 p-2 text-[#6b7280] hover:border-[#2447D6] hover:text-[#2447D6] disabled:opacity-50"
            >
              <ImageUp size={14} />
            </button>
          </div>
        </div>
      ) : long ? (
        <textarea
          value={value}
          rows={Math.min(10, Math.max(3, Math.ceil(value.length / 70)))}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClass} leading-relaxed`}
        />
      ) : (
        <input
          value={value}
          dir={ltr ? 'ltr' : 'rtl'}
          onChange={(event) => onChange(event.target.value)}
          className={ltr ? `${inputClass} font-mono text-[12px]` : inputClass}
        />
      )}
      {changed ? <ResetButton onClick={() => onChange(defaultValue)} /> : null}
    </div>
  )
}

function ArrayEditor({
  value,
  defaultValue,
  fieldKey,
  path,
  showAdvanced,
  highlight,
  onChange,
}: {
  value: Json[]
  defaultValue: Json
  fieldKey: string
  path: string
  showAdvanced: boolean
  highlight?: string
  onChange: (next: Json) => void
}) {
  const defaults = useMemo(
    () => (Array.isArray(defaultValue) ? defaultValue : []),
    [defaultValue],
  )
  const sample = value[0] ?? defaults[0] ?? ''
  const objectItems = isPlainObject(sample)
  const [open, setOpen] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {}
    value.forEach((_, i) => {
      if (value.length <= 2 || onHighlightPath(highlight, `${path}.${i}`)) initial[i] = true
    })
    return initial
  })

  useEffect(() => {
    if (!highlight) return
    setOpen((prev) => {
      const next = { ...prev }
      let touched = false
      value.forEach((_, i) => {
        if (!next[i] && onHighlightPath(highlight, `${path}.${i}`)) {
          next[i] = true
          touched = true
        }
      })
      return touched ? next : prev
    })
  }, [highlight, path, value])

  const unionKeys = useMemo(() => {
    if (!objectItems) return []
    const keys: string[] = []
    for (const item of [...value, ...defaults]) {
      if (!isPlainObject(item)) continue
      for (const key of Object.keys(item)) if (!keys.includes(key)) keys.push(key)
    }
    return keys
  }, [value, defaults, objectItems])

  const sampleFor = (key: string): Json => {
    for (const item of [...value, ...defaults]) {
      if (isPlainObject(item) && item[key] !== undefined) return item[key]
    }
    return ''
  }

  const replace = (index: number, next: Json) => {
    const copy = [...value]
    copy[index] = next
    onChange(copy)
  }

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const move = (index: number, delta: number) => {
    const target = index + delta
    if (target < 0 || target >= value.length) return
    const copy = [...value]
    const [item] = copy.splice(index, 1)
    copy.splice(target, 0, item)
    onChange(copy)
  }

  const add = () => {
    const item = blankLike(sample)
    if (isPlainObject(item) && 'id' in item) {
      item.id = `${fieldKey}-${Date.now().toString(36)}`
    }
    const next = [...value, item]
    onChange(next)
    setOpen((prev) => ({ ...prev, [next.length - 1]: true }))
  }

  if (!objectItems) {
    return (
      <div className="flex flex-col gap-2">
        {value.map((item, index) => (
          <div key={`${path}-${index}`} className="flex items-center gap-2">
            <span className="w-5 shrink-0 text-center text-[11px] text-[#9ca3af]">{index + 1}</span>
            <div className="min-w-0 flex-1">
              <TextValue
                value={typeof item === 'string' ? item : String(item ?? '')}
                defaultValue={defaults[index]}
                fieldKey={fieldKey}
                onChange={(next) => replace(index, next)}
              />
            </div>
            <div className="flex shrink-0 gap-1">
              <button type="button" onClick={() => move(index, -1)} className="rounded-md border border-gray-200 px-1.5 text-[11px] text-[#6b7280] hover:border-[#2447D6]">↑</button>
              <button type="button" onClick={() => move(index, 1)} className="rounded-md border border-gray-200 px-1.5 text-[11px] text-[#6b7280] hover:border-[#2447D6]">↓</button>
              <button type="button" onClick={() => remove(index)} className="rounded-md border border-gray-200 p-1 text-[#ef4444] hover:border-[#ef4444]">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="flex w-fit items-center gap-1 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-[12px] text-[#6b7280] hover:border-[#2447D6] hover:text-[#2447D6]"
        >
          <Plus size={12} /> הוספת שורה
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {value.map((item, index) => {
        const expanded = open[index] ?? false
        const record = isPlainObject(item) ? item : {}
        const itemDefault = defaults[index]
        const defaultRecord = isPlainObject(itemDefault) ? itemDefault : {}
        return (
          <div key={`${path}-${index}`} className="rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center gap-2 px-3 py-2">
              <button
                type="button"
                onClick={() => setOpen((prev) => ({ ...prev, [index]: !expanded }))}
                className="flex min-w-0 flex-1 items-center gap-2 text-right"
              >
                <ChevronDown
                  size={14}
                  className={`shrink-0 text-[#9ca3af] transition-transform ${expanded ? '' : 'rotate-90'}`}
                />
                <span className="truncate text-[13px] font-medium text-[#111827]">
                  {summarize(item, index)}
                </span>
              </button>
              <div className="flex shrink-0 gap-1">
                <button type="button" onClick={() => move(index, -1)} className="rounded-md border border-gray-200 px-1.5 text-[11px] text-[#6b7280] hover:border-[#2447D6]">↑</button>
                <button type="button" onClick={() => move(index, 1)} className="rounded-md border border-gray-200 px-1.5 text-[11px] text-[#6b7280] hover:border-[#2447D6]">↓</button>
                <button type="button" onClick={() => remove(index)} className="rounded-md border border-gray-200 p-1 text-[#ef4444] hover:border-[#ef4444]">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {expanded ? (
              <div className="flex flex-col gap-3 border-t border-gray-100 px-3 py-3">
                {unionKeys.map((key) => (
                  <Field
                    key={key}
                    fieldKey={key}
                    path={`${path}.${index}.${key}`}
                    value={record[key] ?? blankLike(sampleFor(key))}
                    defaultValue={defaultRecord[key]}
                    showAdvanced={showAdvanced}
                    highlight={highlight}
                    onChange={(next) => replace(index, { ...record, [key]: next })}
                  />
                ))}
              </div>
            ) : null}
          </div>
        )
      })}
      <button
        type="button"
        onClick={add}
        className="flex w-fit items-center gap-1 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-[12px] text-[#6b7280] hover:border-[#2447D6] hover:text-[#2447D6]"
      >
        <Plus size={12} /> הוספת פריט
      </button>
    </div>
  )
}

export default function Field({
  fieldKey,
  path,
  value,
  defaultValue,
  showAdvanced,
  highlight,
  bare = false,
  onChange,
}: {
  fieldKey: string
  path: string
  value: Json
  defaultValue: Json
  showAdvanced: boolean
  highlight?: string
  bare?: boolean
  onChange: (next: Json) => void
}) {
  const anchorRef = useRef<HTMLDivElement>(null)
  const isTarget = highlight === path

  useEffect(() => {
    if (!isTarget) return
    const node = anchorRef.current
    if (!node) return
    const timer = setTimeout(() => {
      node.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 120)
    return () => clearTimeout(timer)
  }, [isTarget])

  const advanced = ADVANCED_KEYS.has(fieldKey)
  if (advanced && !showAdvanced) return null

  const changed = defaultValue !== undefined && !deepEqual(value, defaultValue)
  const targetClass = isTarget
    ? 'rounded-lg ring-2 ring-[#2447D6] ring-offset-4 ring-offset-white'
    : ''

  const head = bare ? null : (
    <div className="mb-1.5 flex items-center gap-2">
      <span className="text-[12px] font-semibold text-[#374151]">{labelFor(fieldKey)}</span>
      <span className="font-mono text-[10px] text-[#c3c8d1]" dir="ltr">{fieldKey}</span>
      {advanced ? (
        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-[#9ca3af]">טכני</span>
      ) : null}
      {changed ? (
        <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-600">שונה</span>
      ) : null}
    </div>
  )

  if (typeof value === 'boolean') {
    return (
      <div ref={anchorRef} className={targetClass}>
        {head}
        <label className="flex items-center gap-2 text-[13px] text-[#374151]">
          <input
            type="checkbox"
            checked={value}
            onChange={(event) => onChange(event.target.checked)}
            className="h-4 w-4 accent-[#2447D6]"
          />
          {value ? 'פעיל' : 'כבוי'}
        </label>
      </div>
    )
  }

  if (typeof value === 'number') {
    return (
      <div ref={anchorRef} className={targetClass}>
        {head}
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={value}
            step="any"
            onChange={(event) => onChange(Number(event.target.value))}
            className="w-32 rounded-lg border border-gray-200 px-3 py-2 text-[13px] outline-none focus:border-[#2447D6]"
            dir="ltr"
          />
          {changed ? <ResetButton onClick={() => onChange(defaultValue)} /> : null}
        </div>
      </div>
    )
  }

  if (Array.isArray(value)) {
    return (
      <div ref={anchorRef} className={targetClass}>
        {head}
        <ArrayEditor
          value={value}
          defaultValue={defaultValue}
          fieldKey={fieldKey}
          path={path}
          showAdvanced={showAdvanced}
          highlight={highlight}
          onChange={onChange}
        />
      </div>
    )
  }

  if (isPlainObject(value)) {
    const defaults = isPlainObject(defaultValue) ? defaultValue : {}
    return (
      <div
        ref={anchorRef}
        className={bare ? targetClass : `rounded-xl border border-gray-200 bg-gray-50/50 p-3 ${targetClass}`}
      >
        {head}
        {splitsIntoPanels(value, showAdvanced) ? (
          <ObjectPanels
            path={path}
            value={value}
            defaultValue={defaultValue}
            showAdvanced={showAdvanced}
            highlight={highlight}
            onChange={onChange}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {Object.keys(value).map((key) => (
              <Field
                key={key}
                fieldKey={key}
                path={`${path}.${key}`}
                value={value[key]}
                defaultValue={defaults[key]}
                showAdvanced={showAdvanced}
                highlight={highlight}
                onChange={(next) => onChange({ ...value, [key]: next })}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={anchorRef} className={targetClass}>
      {head}
      <TextValue
        value={typeof value === 'string' ? value : ''}
        defaultValue={defaultValue}
        fieldKey={fieldKey}
        onChange={onChange}
      />
    </div>
  )
}

const PANEL_WEIGHT = 5
const SPLIT_WEIGHT = 20

const weigh = (value: Json): number => {
  if (value === null || value === undefined) return 0
  if (Array.isArray(value)) return value.reduce<number>((sum, item) => sum + weigh(item), 0)
  if (isPlainObject(value)) return Object.values(value).reduce<number>((sum, item) => sum + weigh(item), 0)
  return 1
}

const isPanel = (value: Json) =>
  (isPlainObject(value) || Array.isArray(value)) && weigh(value) >= PANEL_WEIGHT

const visible = (key: string, showAdvanced: boolean) => showAdvanced || !ADVANCED_KEYS.has(key)

const panelKeysOf = (value: Record<string, Json>, showAdvanced: boolean) =>
  Object.keys(value).filter((key) => visible(key, showAdvanced) && isPanel(value[key]))

function splitsIntoPanels(value: Json, showAdvanced: boolean): boolean {
  return (
    isPlainObject(value) &&
    weigh(value) >= SPLIT_WEIGHT &&
    panelKeysOf(value, showAdvanced).length >= 2
  )
}

function ObjectPanels({
  path,
  value,
  defaultValue,
  showAdvanced,
  highlight,
  onChange,
}: {
  path: string
  value: Record<string, Json>
  defaultValue: Json
  showAdvanced: boolean
  highlight?: string
  onChange: (next: Json) => void
}) {
  const panelKeys = useMemo(() => panelKeysOf(value, showAdvanced), [value, showAdvanced])

  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    for (const key of panelKeys) {
      if (onHighlightPath(highlight, `${path}.${key}`)) initial[key] = true
    }
    return initial
  })

  useEffect(() => {
    if (!highlight) return
    setOpen((prev) => {
      const next = { ...prev }
      let touched = false
      for (const key of panelKeys) {
        if (!next[key] && onHighlightPath(highlight, `${path}.${key}`)) {
          next[key] = true
          touched = true
        }
      }
      return touched ? next : prev
    })
  }, [highlight, panelKeys, path])

  const defaults = isPlainObject(defaultValue) ? defaultValue : {}
  const simpleKeys = Object.keys(value).filter(
    (key) => visible(key, showAdvanced) && !panelKeys.includes(key),
  )
  const allOpen = panelKeys.every((key) => open[key])

  return (
    <div className="flex flex-col gap-3">
      {panelKeys.length >= 3 ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() =>
              setOpen(allOpen ? {} : Object.fromEntries(panelKeys.map((key) => [key, true])))
            }
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[12px] text-[#6b7280] hover:border-[#2447D6] hover:text-[#2447D6]"
          >
            {allOpen ? 'סגירת כל הבלוקים' : 'פתיחת כל הבלוקים'}
          </button>
        </div>
      ) : null}

      {simpleKeys.length > 0 ? (
        <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          {simpleKeys.map((key) => (
            <Field
              key={key}
              fieldKey={key}
              path={`${path}.${key}`}
              value={value[key]}
              defaultValue={defaults[key]}
              showAdvanced={showAdvanced}
              highlight={highlight}
              onChange={(next) => onChange({ ...value, [key]: next })}
            />
          ))}
        </div>
      ) : null}

      {panelKeys.map((key) => {
        const expanded = open[key] ?? false
        const item = value[key]
        const items = Array.isArray(item) ? item.length : 0
        const changed = defaults[key] !== undefined && !deepEqual(item, defaults[key])
        return (
          <div key={key} className="rounded-xl border border-gray-100 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setOpen((prev) => ({ ...prev, [key]: !expanded }))}
              className="flex w-full items-center gap-2 px-4 py-3 text-right"
            >
              <ChevronDown
                size={15}
                className={`shrink-0 text-[#9ca3af] transition-transform ${expanded ? '' : 'rotate-90'}`}
              />
              <span className="text-[14px] font-semibold text-[#111827]">{labelFor(key)}</span>
              {items > 0 ? (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-[#6b7280]">
                  {items}
                </span>
              ) : null}
              {changed ? (
                <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-600">שונה</span>
              ) : null}
              <span className="mr-auto font-mono text-[10px] text-[#c3c8d1]" dir="ltr">
                {key}
              </span>
            </button>

            {expanded ? (
              <div className="border-t border-gray-100 px-4 py-4">
                <Field
                  fieldKey={key}
                  path={`${path}.${key}`}
                  value={item}
                  defaultValue={defaults[key]}
                  showAdvanced={showAdvanced}
                  highlight={highlight}
                  onChange={(next) => onChange({ ...value, [key]: next })}
                  bare
                />
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

export function SectionFields({
  fieldKey,
  path,
  value,
  defaultValue,
  showAdvanced,
  highlight,
  onChange,
}: {
  fieldKey: string
  path: string
  value: Json
  defaultValue: Json
  showAdvanced: boolean
  highlight?: string
  onChange: (next: Json) => void
}) {
  if (isPlainObject(value) && splitsIntoPanels(value, showAdvanced)) {
    return (
      <ObjectPanels
        path={path}
        value={value}
        defaultValue={defaultValue}
        showAdvanced={showAdvanced}
        highlight={highlight}
        onChange={onChange}
      />
    )
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <Field
        fieldKey={fieldKey}
        path={path}
        value={value}
        defaultValue={defaultValue}
        showAdvanced={showAdvanced}
        highlight={highlight}
        onChange={onChange}
        bare
      />
    </div>
  )
}
