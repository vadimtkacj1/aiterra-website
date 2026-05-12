'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Plus, Trash2, Upload } from 'lucide-react'
import type { PortfolioProject } from '@/types'

const empty: PortfolioProject = {
  slug: '',
  title: '',
  category: '',
  heroTitle: '',
  heroDescription: '',
  image: '',
  tags: [],
  hasPage: undefined,
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
    galleryImages: initial?.galleryImages?.length ? [...initial.galleryImages] : [''],
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
    if (!t || form.tags.includes(t)) { setTagInput(''); return }
    set('tags', [...form.tags, t])
    setTagInput('')
  }
  const removeTag = (t: string) => set('tags', form.tags.filter((x) => x !== t))

  const caseParas = form.caseStudy ?? []
  const setCasePara = (i: number, val: string) => { const n = [...caseParas]; n[i] = val; set('caseStudy', n) }
  const addCasePara = () => set('caseStudy', [...caseParas, ''])
  const removeCasePara = (i: number) => { const n = caseParas.filter((_, idx) => idx !== i); set('caseStudy', n.length ? n : undefined) }

  const uploadCover = async (file: File) => {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('dest', 'portfolio')
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (res.ok) set('image', data.url)
    else setError(data.error || 'Помилка завантаження')
    setUploading(false)
  }

  const galleryRows = form.galleryImages ?? ['']
  const setGalleryUrl = (i: number, val: string) => { const n = galleryRows.map((u, idx) => idx === i ? val : u); set('galleryImages', n) }
  const addGalleryRow = () => set('galleryImages', [...galleryRows, ''])
  const removeGalleryRow = (i: number) => set('galleryImages', galleryRows.length > 1 ? galleryRows.filter((_, idx) => idx !== i) : [''])
  const uploadGallery = async (i: number, file: File) => {
    setUploadingGallery(i)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('dest', 'portfolio')
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (res.ok) setGalleryUrl(i, data.url)
    else setError(data.error || 'Помилка завантаження')
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
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) { router.push('/admin/portfolio'); router.refresh() }
    else { const data = await res.json(); setError(data.error || 'Помилка збереження'); setSaving(false) }
  }

  const hasPageEnabled = form.hasPage !== false

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* ── 1. Основна інформація ── */}
      <Section title="Основна інформація">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Назва проекту" required>
            <input
              value={form.title}
              onChange={(e) => { set('title', e.target.value); if (!isEdit) set('slug', slugify(e.target.value)) }}
              required
              placeholder="Назва проекту"
              className={inputCls}
            />
          </Field>
          <Field label="Категорія" required>
            <input
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              required
              placeholder="Бніят ататрім"
              className={inputCls}
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Slug (URL)" hint="Тільки латиниця та дефіси — напр. my-project" required>
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
          <Field label="Порядок відображення" hint="Менше = вище у списку (за замовч. 0)">
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
        <Field label="Теги">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {form.tags.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 rounded-full bg-[#eff6ff] px-2.5 py-1 text-[12px] font-medium text-[#1B1BB3]">
                {t}
                <button type="button" onClick={() => removeTag(t)} className="text-[#1B1BB3]/70 hover:text-[#1B1BB3]"><Trash2 size={12} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
              placeholder="Тег + Enter"
              className={`${inputCls} flex-1`}
            />
            <button type="button" onClick={addTag} className="shrink-0 rounded-lg border border-[#1B1BB3]/30 px-4 py-2.5 text-[13px] font-medium text-[#1B1BB3] hover:bg-[#1B1BB3]/5">
              Додати
            </button>
          </div>
        </Field>
      </Section>

      {/* ── 2. Налаштування сторінки ── */}
      <Section title="Сторінка проекту">
        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
          <div>
            <p className="text-[14px] font-semibold text-[#111827]">Окрема сторінка</p>
            <p className="text-[12px] text-[#6b7280] mt-0.5">
              {hasPageEnabled
                ? '✅ Буде окрема сторінка /portfolio/[slug]'
                : '⛔ Тільки в гріді — без внутрішньої сторінки'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => set('hasPage', hasPageEnabled ? false : undefined)}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${hasPageEnabled ? 'bg-[#1B1BB3]' : 'bg-gray-300'}`}
            role="switch"
            aria-checked={hasPageEnabled}
          >
            <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ${hasPageEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        {hasPageEnabled && (
          <div className="flex flex-col gap-4 pt-1">
            <Field label="Заголовок Hero" required>
              <input value={form.heroTitle} onChange={(e) => set('heroTitle', e.target.value)} required className={inputCls} />
            </Field>
            <Field label="Опис Hero" required>
              <textarea value={form.heroDescription} onChange={(e) => set('heroDescription', e.target.value)} rows={3} required className={inputCls} />
            </Field>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Кнопка 1 — текст">
                <input value={form.heroCtaPrimaryLabel ?? ''} onChange={(e) => set('heroCtaPrimaryLabel', e.target.value || undefined)} placeholder="Розпочати проект" className={inputCls} />
              </Field>
              <Field label="Кнопка 1 — посилання">
                <input value={form.heroCtaPrimaryHref ?? ''} onChange={(e) => set('heroCtaPrimaryHref', e.target.value || undefined)} placeholder="/contact" className={inputCls} dir="ltr" />
              </Field>
              <Field label="Кнопка 2 — текст">
                <input value={form.heroCtaSecondaryLabel ?? ''} onChange={(e) => set('heroCtaSecondaryLabel', e.target.value || undefined)} placeholder="Всі проекти" className={inputCls} />
              </Field>
              <Field label="Кнопка 2 — посилання">
                <input value={form.heroCtaSecondaryHref ?? ''} onChange={(e) => set('heroCtaSecondaryHref', e.target.value || undefined)} placeholder="/portfolio" className={inputCls} dir="ltr" />
              </Field>
            </div>
          </div>
        )}
      </Section>

      {/* ── 3. Зображення ── */}
      <Section title="Зображення">
        <Field label="Головне зображення" required>
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
              {uploading ? 'Завантаження…' : 'Завантажити'}
              <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void uploadCover(f) }} />
            </label>
          </div>
          {form.image && (
            <div className="mt-3 flex items-start gap-3">
              <img src={form.image} alt="preview" className="h-20 w-20 rounded-lg object-cover border border-[#e5e7eb] shrink-0 bg-gray-50" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              <div className="flex flex-col gap-1 min-w-0 pt-1">
                <span className="flex items-center gap-1 text-[12px] text-green-600 font-medium"><CheckCircle2 size={13} />Зображення завантажено</span>
                <span className="text-[11px] text-[#9ca3af] truncate" dir="ltr">{form.image}</span>
              </div>
            </div>
          )}
        </Field>
        <Field label="Alt-текст" hint="Для SEO та доступності. Якщо порожньо — використовується назва проекту">
          <input value={form.imageAlt ?? ''} onChange={(e) => set('imageAlt', e.target.value || undefined)} placeholder={form.title || 'Опис зображення'} className={inputCls} />
        </Field>

        <div className="border-t border-[#f0f0f0] pt-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold text-[#111827]">Галерея зображень</p>
              <p className="text-[12px] text-[#9ca3af]">Відображаються під основним контентом (необов'язково)</p>
            </div>
            <button type="button" onClick={addGalleryRow} className="inline-flex items-center gap-1 rounded-lg border border-[#1B1BB3]/30 px-3 py-1.5 text-[12px] font-medium text-[#1B1BB3] hover:bg-[#1B1BB3]/5">
              <Plus size={14} />Додати
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {galleryRows.map((url, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input value={url} onChange={(e) => setGalleryUrl(i, e.target.value)} placeholder="/images/portfolio/..." className={`${inputCls} flex-1`} dir="ltr" />
                <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#d9d9d9] px-3 py-2 text-[12px] font-medium text-[#374151] hover:bg-gray-50 whitespace-nowrap shrink-0">
                  <Upload size={13} />
                  {uploadingGallery === i ? '…' : 'Завантажити'}
                  <input type="file" accept="image/*" className="hidden" disabled={uploadingGallery !== null} onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void uploadGallery(i, f) }} />
                </label>
                <button type="button" onClick={() => removeGalleryRow(i)} className="rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50 shrink-0"><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── 4. Посилання ── */}
      <Section title="Посилання (необов'язково)">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Посилання на живий сайт" hint="З'являється як кнопка на сторінці проекту">
            <input value={form.liveSiteUrl ?? ''} onChange={(e) => set('liveSiteUrl', e.target.value || undefined)} placeholder="https://" className={inputCls} dir="ltr" />
          </Field>
          <Field label="Зовнішнє посилання" hint="Якщо заповнено — грід відкриває цей URL замість внутрішньої сторінки">
            <input value={form.externalUrl ?? ''} onChange={(e) => set('externalUrl', e.target.value || undefined)} placeholder="https://" className={inputCls} dir="ltr" />
          </Field>
        </div>
      </Section>

      {/* ── 5. Кейс-стаді ── */}
      {hasPageEnabled && (
        <Section title="Кейс-стаді (необов'язково)">
          <div className="flex flex-col gap-3">
            {caseParas.length === 0
              ? <p className="text-[13px] text-[#9ca3af]">Немає абзаців — можна додати або залишити порожнім</p>
              : caseParas.map((para, i) => (
                <div key={i} className="flex gap-2">
                  <textarea value={para} onChange={(e) => setCasePara(i, e.target.value)} rows={3} className={`${inputCls} flex-1`} placeholder={`Абзац ${i + 1}`} />
                  <button type="button" onClick={() => removeCasePara(i)} className="h-10 shrink-0 self-start rounded-lg border border-red-200 p-2 text-red-400 hover:bg-red-50"><Trash2 size={15} /></button>
                </div>
              ))
            }
            <button type="button" onClick={addCasePara} className="self-start inline-flex items-center gap-1 rounded-lg border border-[#1B1BB3]/30 px-3 py-1.5 text-[12px] font-medium text-[#1B1BB3] hover:bg-[#1B1BB3]/5">
              <Plus size={14} />Додати абзац
            </button>
          </div>
        </Section>
      )}

      {/* ── 6. SEO ── */}
      <Section title="SEO (необов'язково)">
        <Field label="Meta-заголовок" hint="Якщо порожньо — формується автоматично з назви проекту">
          <input value={form.metaTitle ?? ''} onChange={(e) => set('metaTitle', e.target.value || undefined)} className={inputCls} />
        </Field>
        <Field label="Meta-опис" hint="Якщо порожньо — використовується опис Hero">
          <textarea value={form.metaDescription ?? ''} onChange={(e) => set('metaDescription', e.target.value || undefined)} rows={3} className={inputCls} />
        </Field>
      </Section>

      {/* ── Помилка + кнопки ── */}
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">{error}</div>}

      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={saving} className="rounded-lg bg-linear-to-l from-[#530FAD] to-[#1B1BB3] px-8 py-2.5 text-[14px] font-bold text-white hover:opacity-90 disabled:opacity-60">
          {saving ? 'Збереження…' : 'Зберегти'}
        </button>
        <button type="button" onClick={() => router.push('/admin/portfolio')} className="rounded-lg border border-gray-200 px-6 py-2.5 text-[14px] font-medium text-[#374151] hover:bg-gray-50">
          Скасувати
        </button>
      </div>
    </form>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white shadow-sm overflow-hidden">
      <div className="border-b border-[#f0f0f0] bg-[#fafafa] px-5 py-3">
        <h3 className="text-[13px] font-bold text-[#374151] uppercase tracking-wide">{title}</h3>
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
  'w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1B1BB3]/20 focus:border-[#1B1BB3] bg-white transition-all text-right placeholder:text-[#d1d5db]'
