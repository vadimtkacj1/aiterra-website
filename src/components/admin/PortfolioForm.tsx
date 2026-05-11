'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImageIcon, Plus, Trash2, Upload } from 'lucide-react'
import type { PortfolioProject } from '@/types'

const empty: PortfolioProject = {
  slug: '',
  title: '',
  category: '',
  heroTitle: '',
  heroDescription: '',
  image: '',
  tags: [],
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export default function PortfolioForm({ initial }: { initial?: PortfolioProject }) {
  const isEdit = !!initial
  const [form, setForm] = useState<PortfolioProject>(() => ({
    ...(initial ?? empty),
    tags: initial?.tags?.length ? [...initial.tags] : [],
    caseStudy: initial?.caseStudy?.length ? [...initial.caseStudy] : undefined,
    galleryImages:
      initial?.galleryImages?.length ? [...initial.galleryImages] : [''],
  }))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState<number | null>(null)
  const router = useRouter()

  const set = <K extends keyof PortfolioProject>(k: K, v: PortfolioProject[K]) =>
    setForm((p) => ({ ...p, [k]: v }))

  const addTag = () => {
    const t = tagInput.trim()
    if (!t || form.tags.includes(t)) {
      setTagInput('')
      return
    }
    set('tags', [...form.tags, t])
    setTagInput('')
  }

  const removeTag = (t: string) => set('tags', form.tags.filter((x) => x !== t))

  const caseParas = form.caseStudy ?? []

  const setCasePara = (i: number, val: string) => {
    const next = [...caseParas]
    next[i] = val
    set('caseStudy', next)
  }

  const addCasePara = () => set('caseStudy', [...caseParas, ''])

  const removeCasePara = (i: number) => {
    const next = caseParas.filter((_, idx) => idx !== i)
    set('caseStudy', next.length ? next : undefined)
  }

  const uploadCover = async (file: File) => {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('dest', 'portfolio')
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (res.ok) set('image', data.url)
    else setError(data.error || 'שגיאת העלאה')
    setUploading(false)
  }

  const galleryRows = form.galleryImages ?? ['']

  const setGalleryUrl = (i: number, val: string) => {
    const next = galleryRows.map((u, idx) => (idx === i ? val : u))
    set('galleryImages', next)
  }

  const addGalleryRow = () => set('galleryImages', [...galleryRows, ''])

  const removeGalleryRow = (i: number) =>
    set('galleryImages', galleryRows.length > 1 ? galleryRows.filter((_, idx) => idx !== i) : [''])

  const uploadGallery = async (i: number, file: File) => {
    setUploadingGallery(i)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('dest', 'portfolio')
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (res.ok) setGalleryUrl(i, data.url)
    else setError(data.error || 'שגיאת העלאה')
    setUploadingGallery(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const trimmedCase = form.caseStudy?.map((s) => s.trim()).filter(Boolean)
    const galleryUrls = galleryRows.map((s) => s.trim()).filter(Boolean)

    const payload: PortfolioProject = {
      ...form,
      ...(trimmedCase?.length ? { caseStudy: trimmedCase } : { caseStudy: undefined }),
      galleryImages: galleryUrls,
    }

    const url = isEdit ? `/api/admin/portfolio/${initial!.slug}` : '/api/admin/portfolio'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      router.push('/admin/portfolio')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'שגיאה')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Field label="כותרת">
        <input
          value={form.title}
          onChange={(e) => {
            set('title', e.target.value)
            if (!isEdit) set('slug', slugify(e.target.value))
          }}
          required
          placeholder="שם הפרויקט"
          className={inputCls}
        />
      </Field>

      <Field label="Slug (URL)" hint="אנגלית, מקפים — לדוגמה olie-6">
        <input
          value={form.slug}
          onChange={(e) => set('slug', e.target.value)}
          required
          placeholder="project-slug"
          disabled={isEdit}
          className={`${inputCls} ${isEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
          dir="ltr"
        />
      </Field>

      <Field label="סדר בתצוגה" hint="מספר נמוך יותר = מופיע קודם ברשימה ובגריד (ברירת מחדל 0)">
        <input
          type="number"
          value={form.sortOrder === undefined || form.sortOrder === null ? '' : String(form.sortOrder)}
          onChange={(e) => {
            const v = e.target.value.trim()
            if (v === '') set('sortOrder', undefined)
            else {
              const n = Number.parseInt(v, 10)
              set('sortOrder', Number.isFinite(n) ? n : undefined)
            }
          }}
          placeholder="0"
          className={`${inputCls} max-w-[200px]`}
          dir="ltr"
        />
      </Field>

      <Field label="קטגוריה">
        <input
          value={form.category}
          onChange={(e) => set('category', e.target.value)}
          required
          placeholder="בניית אתרים"
          className={inputCls}
        />
      </Field>

      <Field label="כותרת גיבור (Hero)">
        <input
          value={form.heroTitle}
          onChange={(e) => set('heroTitle', e.target.value)}
          required
          className={inputCls}
        />
      </Field>

      <Field label="תיאור גיבור">
        <textarea
          value={form.heroDescription}
          onChange={(e) => set('heroDescription', e.target.value)}
          rows={4}
          required
          className={inputCls}
        />
      </Field>

      <Field label="תמונה ראשית" hint="נתיב או העלאה">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            value={form.image}
            onChange={(e) => set('image', e.target.value)}
            required
            placeholder="/images/portfolio/..."
            className={`${inputCls} sm:flex-1`}
            dir="ltr"
          />
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#d9d9d9] px-4 py-2.5 text-[13px] font-medium text-[#374151] hover:bg-gray-50">
            <Upload size={16} />
            {uploading ? 'מעלה…' : 'העלאה'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0]
                e.target.value = ''
                if (f) void uploadCover(f)
              }}
            />
          </label>
        </div>
        {form.image ? (
          <div className="mt-2 flex items-center gap-2 text-[12px] text-[#6b7280]">
            <ImageIcon size={14} />
            <span className="truncate" dir="ltr">
              {form.image}
            </span>
          </div>
        ) : null}
      </Field>

      <Field label="טקסט חלופי לתמונה (Alt)" hint="לנגישות ו-SEO; אם ריק — ישתמש בכותרת הפרויקט">
        <input
          value={form.imageAlt ?? ''}
          onChange={(e) => set('imageAlt', e.target.value || undefined)}
          placeholder={form.title || 'תיאור קצר של התמונה'}
          className={inputCls}
        />
      </Field>

      <Field label="תגיות">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {form.tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-full bg-[#eff6ff] px-2.5 py-1 text-[12px] font-medium text-[#1B1BB3]"
            >
              {t}
              <button type="button" onClick={() => removeTag(t)} className="text-[#1B1BB3]/70 hover:text-[#1B1BB3]">
                <Trash2 size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addTag()
              }
            }}
            placeholder="תגית + Enter"
            className={`${inputCls} flex-1`}
          />
          <button type="button" onClick={addTag} className="shrink-0 rounded-lg border border-[#1B1BB3]/30 px-4 py-2.5 text-[13px] font-medium text-[#1B1BB3] hover:bg-[#1B1BB3]/5">
            הוסף
          </button>
        </div>
      </Field>

      <Field label="קישור לאתר חי (אופציונלי)" hint="מופיע כקישור על התמונה בדף הפרויקט">
        <input
          value={form.liveSiteUrl ?? ''}
          onChange={(e) => set('liveSiteUrl', e.target.value || undefined)}
          placeholder="https://"
          className={inputCls}
          dir="ltr"
        />
      </Field>

      <Field label="כתובת חיצונית (אופציונלי)" hint="אם מלא — הרשת מפנה ישירות לכאן במקום דף פנימי">
        <input
          value={form.externalUrl ?? ''}
          onChange={(e) => set('externalUrl', e.target.value || undefined)}
          placeholder="https://"
          className={inputCls}
          dir="ltr"
        />
      </Field>

      <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-[15px] font-bold text-[#111827]">SEO (אופציונלי)</h3>
        <div className="flex flex-col gap-4">
          <Field label="כותרת דף (Meta title)" hint="אם ריק — נבנה אוטומטית מכותרת הפרויקט">
            <input
              value={form.metaTitle ?? ''}
              onChange={(e) => set('metaTitle', e.target.value || undefined)}
              className={inputCls}
            />
          </Field>
          <Field label="תיאור מטא (Meta description)" hint="אם ריק — ישתמש בתיאור הגיבור">
            <textarea
              value={form.metaDescription ?? ''}
              onChange={(e) => set('metaDescription', e.target.value || undefined)}
              rows={3}
              className={inputCls}
            />
          </Field>
        </div>
      </div>

      <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-[15px] font-bold text-[#111827]">כפתורים בגיבור הפרויקט</h3>
        <p className="mb-4 text-[12px] text-[#6b7280]">
          נתיב פנימי (למשל /contact) או קישור מלא (https://). ריק = ברירת מחדל.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="כפתור ראשי — טקסט">
            <input
              value={form.heroCtaPrimaryLabel ?? ''}
              onChange={(e) => set('heroCtaPrimaryLabel', e.target.value || undefined)}
              placeholder="התחילו פרויקט דומה"
              className={inputCls}
            />
          </Field>
          <Field label="כפתור ראשי — קישור">
            <input
              value={form.heroCtaPrimaryHref ?? ''}
              onChange={(e) => set('heroCtaPrimaryHref', e.target.value || undefined)}
              placeholder="/contact"
              className={inputCls}
              dir="ltr"
            />
          </Field>
          <Field label="כפתור משני — טקסט">
            <input
              value={form.heroCtaSecondaryLabel ?? ''}
              onChange={(e) => set('heroCtaSecondaryLabel', e.target.value || undefined)}
              placeholder="כל הפרויקטים"
              className={inputCls}
            />
          </Field>
          <Field label="כפתור משני — קישור">
            <input
              value={form.heroCtaSecondaryHref ?? ''}
              onChange={(e) => set('heroCtaSecondaryHref', e.target.value || undefined)}
              placeholder="/portfolio"
              className={inputCls}
              dir="ltr"
            />
          </Field>
        </div>
      </div>

      <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[14px] font-semibold text-[#111827]">מקרה בוחן (פסקאות)</span>
          <button
            type="button"
            onClick={addCasePara}
            className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-[12px] font-medium text-[#1B1BB3] shadow-sm ring-1 ring-[#e5e7eb] hover:bg-gray-50"
          >
            <Plus size={14} />
            פסקה
          </button>
        </div>
        {caseParas.length === 0 ? (
          <p className="text-[13px] text-[#9ca3af]">אין פסקאות — אפשר להוסיף או להשאיר ריק</p>
        ) : (
          <div className="flex flex-col gap-3">
            {caseParas.map((para, i) => (
              <div key={i} className="flex gap-2">
                <textarea
                  value={para}
                  onChange={(e) => setCasePara(i, e.target.value)}
                  rows={4}
                  className={`${inputCls} flex-1`}
                  placeholder={`פסקה ${i + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeCasePara(i)}
                  className="h-10 shrink-0 self-start rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"
                  aria-label="מחק פסקה"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-bold text-[#111827]">גלריית תמונות</h3>
            <p className="mt-1 text-[12px] text-[#6b7280]">מוצגות מתחת לבלוק הטקסט בדף הפרויקט (אופציונלי)</p>
          </div>
          <button
            type="button"
            onClick={addGalleryRow}
            className="inline-flex items-center gap-1 rounded-lg border border-[#1B1BB3]/30 px-3 py-1.5 text-[12px] font-medium text-[#1B1BB3] hover:bg-[#1B1BB3]/5"
          >
            <Plus size={14} />
            תמונה
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {galleryRows.map((url, i) => (
            <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                value={url}
                onChange={(e) => setGalleryUrl(i, e.target.value)}
                placeholder="/images/portfolio/..."
                className={`${inputCls} sm:flex-1`}
                dir="ltr"
              />
              <div className="flex shrink-0 gap-2">
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#d9d9d9] px-3 py-2 text-[12px] font-medium text-[#374151] hover:bg-gray-50">
                  <Upload size={14} />
                  {uploadingGallery === i ? '…' : 'העלאה'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingGallery !== null}
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      e.target.value = ''
                      if (f) void uploadGallery(i, f)
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeGalleryRow(i)}
                  className="rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"
                  aria-label="מחק"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">{error}</div> : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-gradient-to-l from-[#530FAD] to-[#1B1BB3] px-6 py-2.5 text-[14px] font-bold text-white hover:opacity-90 disabled:opacity-60"
        >
          {saving ? 'שומר…' : 'שמירה'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/portfolio')}
          className="rounded-lg border border-gray-200 px-6 py-2.5 text-[14px] font-medium text-[#374151] hover:bg-gray-50"
        >
          ביטול
        </button>
      </div>
    </form>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-[#374151]">{label}</label>
      {hint ? <span className="text-[12px] text-[#9ca3af] -mt-0.5">{hint}</span> : null}
      {children}
    </div>
  )
}

const inputCls =
  'w-full px-4 py-2.5 border border-[#d9d9d9] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1B1BB3]/20 focus:border-[#1B1BB3] bg-white transition-all text-right'
