'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Trash2, Upload } from 'lucide-react'
import type { PortfolioProject } from '@/types'

const empty: PortfolioProject = {
  slug: '',
  title: '',
  category: '',
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
  // Legacy case-page fields (caseStudy, meta*, hero*) ride along in state
  // untouched so saving a project never wipes copy the form no longer edits.
  const [form, setForm] = useState<PortfolioProject>(() => ({
    ...(initial ?? empty),
    tags: initial?.tags?.length ? [...initial.tags] : [],
  }))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const set = <K extends keyof PortfolioProject>(k: K, v: PortfolioProject[K]) =>
    setForm((p) => ({ ...p, [k]: v }))

  const addTag = () => {
    const t = tagInput.trim()
    if (!t || form.tags.includes(t)) { setTagInput(''); return }
    set('tags', [...form.tags, t])
    setTagInput('')
  }
  const removeTag = (t: string) => set('tags', form.tags.filter((x) => x !== t))

  const uploadCover = async (file: File) => {
    setUploading(true)
    setUploadError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('dest', 'portfolio')
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      let data: { url?: string; error?: string } = {}
      try { data = await res.json() } catch { data = { error: 'תגובת שרת לא תקינה' } }
      if (res.ok && data.url) set('image', data.url)
      else setUploadError(data.error || 'שגיאת העלאה')
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'שגיאת העלאה')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const url = isEdit ? `/api/admin/portfolio/${initial!.slug}` : '/api/admin/portfolio'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { router.push('/admin/portfolio'); router.refresh() }
    else { const data = await res.json(); setError(data.error || 'Помилка збереження'); setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* ── 1. Основна інформація ── */}
      <Section title="Основна інформація">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="כותרת" required>
            <input
              value={form.title}
              onChange={(e) => { set('title', e.target.value); if (!isEdit) set('slug', slugify(e.target.value)) }}
              required
              placeholder="שם הפרויקט"
              className={inputCls}
            />
          </Field>
          <Field label="קטגוריה" required>
            <input
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              required
              placeholder="בניית אתרים"
              className={inputCls}
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Slug (URL)" hint="אנגלית, מקפים — לדוגמה my-project" required>
            <input
              value={form.slug}
              onChange={(e) => set('slug', e.target.value)}
              required
              placeholder="my-project"
              disabled={isEdit}
              className={`${inputCls} ${isEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
              dir="ltr"
            />
          </Field>
          <Field label="סדר בתצוגה" hint="מספר נמוך יותר = מופיע קודם (ברירת מחדל 0)">
            <input
              type="number"
              value={form.sortOrder === undefined || form.sortOrder === null ? '' : String(form.sortOrder)}
              onChange={(e) => {
                const v = e.target.value.trim()
                if (v === '') set('sortOrder', undefined)
                else { const n = Number.parseInt(v, 10); set('sortOrder', Number.isFinite(n) ? n : undefined) }
              }}
              placeholder="0"
              className={inputCls}
              dir="ltr"
            />
          </Field>
        </div>
        <Field label="תגיות">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {form.tags.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 rounded-full bg-[#eff6ff] px-2.5 py-1 text-[12px] font-medium text-[#2447D6]">
                {t}
                <button type="button" onClick={() => removeTag(t)} className="text-[#2447D6]/70 hover:text-[#2447D6]"><Trash2 size={12} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
              placeholder="תגית + Enter"
              className={`${inputCls} flex-1`}
            />
            <button type="button" onClick={addTag} className="shrink-0 rounded-lg border border-[#2447D6]/30 px-4 py-2.5 text-[13px] font-medium text-[#2447D6] hover:bg-[#2447D6]/5">
              הוסף
            </button>
          </div>
        </Field>
      </Section>

      {/* ── 2. Зображення ── */}
      <Section title="תמונות">
        <Field label="תמונה ראשית" required>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              value={form.image}
              onChange={(e) => set('image', e.target.value)}
              required
              placeholder="/images/portfolio/..."
              className={`${inputCls} sm:flex-1`}
              dir="ltr"
            />
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#d9d9d9] px-4 py-2.5 text-[13px] font-medium text-[#374151] hover:bg-gray-50 whitespace-nowrap">
              <Upload size={16} />
              {uploading ? 'מעלה…' : 'העלאה'}
              <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void uploadCover(f) }} />
            </label>
          </div>
          {uploadError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">{uploadError}</div>
          )}
          {form.image && (
            <div className="mt-3 flex items-start gap-3">
              <img src={form.image} alt="preview" className="h-20 w-20 rounded-lg object-cover border border-[#e5e7eb] shrink-0 bg-gray-50" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              <div className="flex flex-col gap-1 min-w-0 pt-1">
                <span className="flex items-center gap-1 text-[12px] text-green-600 font-medium"><CheckCircle2 size={13} />התמונה הועלתה בהצלחה</span>
                <span className="text-[11px] text-[#9ca3af] truncate" dir="ltr">{form.image}</span>
              </div>
            </div>
          )}
        </Field>
        <Field label="טקסט חלופי (Alt)" hint="לנגישות ו-SEO; אם ריק — ישתמש בכותרת הפרויקט">
          <input value={form.imageAlt ?? ''} onChange={(e) => set('imageAlt', e.target.value || undefined)} placeholder={form.title || 'תיאור קצר של התמונה'} className={inputCls} />
        </Field>
        <Field
          label="צילום מסך מלא של האתר (רשימת הפרויקטים)"
          hint="לכידת עמוד מלא ברוחב 900px וגובה 1800px — נגללת בתוך חלון הדפדפן בכרטיס. אם ריק — תוצג התמונה הראשית ללא גלילה"
        >
          <input value={form.screenshot ?? ''} onChange={(e) => set('screenshot', e.target.value || undefined)} placeholder="/images/portfolio/shots/..." className={inputCls} dir="ltr" />
        </Field>
      </Section>

      {/* ── 3. Посилання ── */}
      <Section title="קישור לאתר הפרויקט">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="קישור לאתר חי" hint="לחיצה על הכרטיס בתיק העבודות פותחת את הכתובת הזו בלשונית חדשה">
            <input value={form.liveSiteUrl ?? ''} onChange={(e) => set('liveSiteUrl', e.target.value || undefined)} placeholder="https://" className={inputCls} dir="ltr" />
          </Field>
          <Field label="כתובת חיצונית" hint="גיבוי — משמש רק כשהשדה מימין ריק">
            <input value={form.externalUrl ?? ''} onChange={(e) => set('externalUrl', e.target.value || undefined)} placeholder="https://" className={inputCls} dir="ltr" />
          </Field>
        </div>
      </Section>

      {/* ── Помилка + кнопки ── */}
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">{error}</div>}

      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={saving || uploading} className="rounded-lg bg-linear-to-l from-[#3E96F9] to-[#2447D6] px-8 py-2.5 text-[14px] font-bold text-white hover:opacity-90 disabled:opacity-60">
          {saving ? 'שומר…' : 'שמירה'}
        </button>
        <button type="button" onClick={() => router.push('/admin/portfolio')} className="rounded-lg border border-gray-200 px-6 py-2.5 text-[14px] font-medium text-[#374151] hover:bg-gray-50">
          ביטול
        </button>
      </div>
    </form>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white shadow-sm overflow-hidden">
      <div className="border-b border-[#f0f0f0] bg-[#fafafa] px-5 py-3 text-right">
        <h3 className="text-[13px] font-bold text-[#374151] tracking-wide">{title}</h3>
      </div>
      <div className="flex flex-col gap-4 p-5">
        {children}
      </div>
    </div>
  )
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-[#374151]">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>
      {hint && <span className="text-[12px] text-[#9ca3af] -mt-0.5">{hint}</span>}
      {children}
    </div>
  )
}

const inputCls =
  'w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2447D6]/20 focus:border-[#2447D6] bg-white transition-all text-right placeholder:text-[#d1d5db]'
