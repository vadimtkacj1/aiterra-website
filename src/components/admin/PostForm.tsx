'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus, Trash2, ImageIcon, Star, X, Upload,
  Bold, Italic, List, ListOrdered, Quote, Minus, Code,
  Heading2, Heading3, Eye, PenLine, User,
} from 'lucide-react'
import { marked } from 'marked'
import type { AdminPost, PostFaq, FaqItem } from '@/lib/blog-server'
import type { AuthorProfile } from '@/lib/authors-server'

marked.setOptions({ breaks: true, gfm: true })

const PRESET_TAGS = ['ביצועים', 'SEO', 'Core Web Vitals', 'תוכן', 'קידום אורגני', 'Next.js', 'WordPress', 'פיתוח', 'מיתוג', 'עיצוב', 'דיגיטל']
const emptyFaq: PostFaq = { title: 'שאלות נפוצות', items: [] }

const empty: AdminPost = {
  slug: '', title: '', excerpt: '', content: '',
  datePublished: '',
  author: '', authorId: '', authorImage: '', tags: [], images: [''],
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

export default function PostForm({ initial }: { initial?: AdminPost }) {
  const isEdit = !!initial
  const [form, setForm] = useState<AdminPost>(() => ({
    ...(initial ?? empty),
    images: initial?.images?.length ? initial.images : [''],
  }))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [uploading, setUploading] = useState<number | null>(null)
  const [uploadingAuthorImage, setUploadingAuthorImage] = useState(false)
  const [contentTab, setContentTab] = useState<'edit' | 'preview'>('edit')
  const [authors, setAuthors] = useState<AuthorProfile[]>([])
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const fileRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  const set = <K extends keyof AdminPost>(k: K, v: AdminPost[K]) =>
    setForm((p) => ({ ...p, [k]: v }))

  useEffect(() => {
    fetch('/api/admin/authors')
      .then((r) => r.json())
      .then((list: AuthorProfile[]) => setAuthors(Array.isArray(list) ? list : []))
      .catch(() => setAuthors([]))
  }, [])

  // ── Markdown toolbar helpers ──────────────────────────────────────────────
  const wrapSel = (before: string, after = before) => {
    const ta = contentRef.current
    if (!ta) return
    const s = ta.selectionStart, e = ta.selectionEnd
    const sel = form.content.slice(s, e)
    const next = form.content.slice(0, s) + before + sel + after + form.content.slice(e)
    set('content', next)
    setTimeout(() => { ta.focus(); ta.selectionStart = s + before.length; ta.selectionEnd = s + before.length + sel.length }, 0)
  }

  const prefixLine = (prefix: string) => {
    const ta = contentRef.current
    if (!ta) return
    const pos = ta.selectionStart
    const lineStart = form.content.slice(0, pos).lastIndexOf('\n') + 1
    // toggle: if line already starts with prefix, remove it
    const hasPrefix = form.content.slice(lineStart).startsWith(prefix)
    const next = hasPrefix
      ? form.content.slice(0, lineStart) + form.content.slice(lineStart + prefix.length)
      : form.content.slice(0, lineStart) + prefix + form.content.slice(lineStart)
    const delta = hasPrefix ? -prefix.length : prefix.length
    set('content', next)
    setTimeout(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = pos + delta }, 0)
  }

  const insertBlock = (text: string) => {
    const ta = contentRef.current
    if (!ta) return
    const pos = ta.selectionStart
    const next = form.content.slice(0, pos) + text + form.content.slice(pos)
    set('content', next)
    setTimeout(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = pos + text.length }, 0)
  }

  const insertImageIntoContent = (src: string) => {
    const ta = contentRef.current
    if (!ta) return
    const pos = ta.selectionStart
    const insert = `\n![](${src})\n`
    set('content', form.content.slice(0, pos) + insert + form.content.slice(pos))
    setTimeout(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = pos + insert.length }, 0)
  }

  // ── Tags ──────────────────────────────────────────────────────────────────
  const toggleTag = (tag: string) =>
    set('tags', form.tags.includes(tag) ? form.tags.filter((t) => t !== tag) : [...form.tags, tag])

  const addCustomTag = () => {
    const t = tagInput.trim()
    if (!t || form.tags.includes(t)) { setTagInput(''); return }
    set('tags', [...form.tags, t])
    setTagInput('')
  }

  // ── FAQ ───────────────────────────────────────────────────────────────────
  const faq = form.faq ?? null

  const enableFaq = () => set('faq', { ...emptyFaq, items: [{ q: '', a: '' }] })
  const disableFaq = () => set('faq', undefined)

  const setFaqTitle = (title: string) =>
    set('faq', { ...(faq ?? emptyFaq), title })

  const setFaqItem = (i: number, field: keyof FaqItem, value: string) => {
    if (!faq) return
    const items = faq.items.map((item, idx) => idx === i ? { ...item, [field]: value } : item)
    set('faq', { ...faq, items })
  }

  const addFaqItem = () => {
    if (!faq) return
    set('faq', { ...faq, items: [...faq.items, { q: '', a: '' }] })
  }

  const removeFaqItem = (i: number) => {
    if (!faq) return
    set('faq', { ...faq, items: faq.items.filter((_, idx) => idx !== i) })
  }

  // ── Images ────────────────────────────────────────────────────────────────
  const setImage = (i: number, val: string) =>
    set('images', form.images.map((img, idx) => (idx === i ? val : img)))

  const addImage = () => set('images', [...form.images, ''])

  const removeImage = (i: number) =>
    set('images', form.images.length > 1 ? form.images.filter((_, idx) => idx !== i) : [''])

  const setCover = (i: number) => {
    if (i === 0) return
    const imgs = [...form.images]
    const [picked] = imgs.splice(i, 1)
    imgs.unshift(picked)
    set('images', imgs)
  }

  const uploadFile = async (i: number, file: File) => {
    setUploading(i)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (res.ok) setImage(i, data.url)
    else setError(data.error || 'שגיאת העלאה')
    setUploading(null)
  }

  const uploadAuthorImage = async (file: File) => {
    setUploadingAuthorImage(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (res.ok) set('authorImage', data.url)
    else setError(data.error || 'שגיאת העלאה')
    setUploadingAuthorImage(false)
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = { ...form, images: form.images.filter(Boolean) }
    const url = isEdit ? `/api/admin/blog/${initial!.slug}` : '/api/admin/blog'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) { router.push('/admin/blog'); router.refresh() }
    else { const data = await res.json(); setError(data.error || 'שגיאה'); setSaving(false) }
  }

  const filledImages = form.images.filter(Boolean)
  const customSelectedTags = form.tags.filter((t) => !PRESET_TAGS.includes(t))
  const previewHtml = marked.parse(form.content || '') as string
  const selectedAuthor = authors.find((a) => a.id === (form.authorId ?? ''))

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      <Field label="כותרת">
        <input value={form.title}
          onChange={(e) => { set('title', e.target.value); if (!isEdit) set('slug', slugify(e.target.value)) }}
          required placeholder="כותרת הפוסט" className={inputCls} />
      </Field>

      <Field label="Slug (URL)" hint="אנגלית, מקפים במקום רווחים">
        <input value={form.slug} onChange={(e) => set('slug', e.target.value)}
          required placeholder="my-post-slug" disabled={isEdit}
          className={`${inputCls} ${isEdit ? 'opacity-50 cursor-not-allowed' : ''}`} dir="ltr" />
      </Field>

      <Field label="תקציר">
        <textarea value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)}
          rows={3} required placeholder="תיאור קצר של הפוסט..." className={inputCls} />
      </Field>

      {/* ── Content editor ─────────────────────────────────────────────────── */}
      <Field label="תוכן">
        <div className="border border-[#d9d9d9] rounded-xl overflow-hidden transition-all focus-within:border-[#1B1BB3] focus-within:ring-2 focus-within:ring-[#1B1BB3]/15">

          {/* Tab bar + image inserts */}
          <div className="flex items-center justify-between gap-2 px-3 py-2 bg-[#f9fafb] border-b border-[#e5e7eb]">
            {/* Tabs */}
            <div className="flex gap-1">
              <button type="button" onClick={() => setContentTab('edit')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${contentTab === 'edit' ? 'bg-white shadow-sm text-[#111827]' : 'text-[#6b7280] hover:text-[#374151]'}`}>
                <PenLine size={13} />
                עריכה
              </button>
              <button type="button" onClick={() => setContentTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${contentTab === 'preview' ? 'bg-white shadow-sm text-[#111827]' : 'text-[#6b7280] hover:text-[#374151]'}`}>
                <Eye size={13} />
                תצוגה מקדימה
              </button>
            </div>

            {/* Image insert thumbnails */}
            {filledImages.length > 0 && contentTab === 'edit' && (
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <ImageIcon size={12} className="text-[#9ca3af] shrink-0" />
                <span className="text-[10px] text-[#9ca3af] shrink-0">הכנס תמונה:</span>
                {filledImages.map((src, i) => (
                  <button key={i} type="button" title={src} onClick={() => insertImageIntoContent(src)}
                    className="shrink-0 w-8 h-8 rounded overflow-hidden border-2 border-transparent hover:border-[#1B1BB3] transition-all relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#1B1BB3]/0 group-hover:bg-[#1B1BB3]/30 flex items-center justify-center transition-all">
                      <Plus size={12} className="text-white opacity-0 group-hover:opacity-100" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Formatting toolbar */}
          {contentTab === 'edit' && (
            <div className="flex items-center flex-wrap gap-0.5 px-3 py-2 bg-white border-b border-[#f3f4f6]">
              <ToolBtn title="כותרת H2" onClick={() => prefixLine('## ')}><Heading2 size={15} /></ToolBtn>
              <ToolBtn title="כותרת H3" onClick={() => prefixLine('### ')}><Heading3 size={15} /></ToolBtn>
              <Sep />
              <ToolBtn title="מודגש" onClick={() => wrapSel('**')}><Bold size={15} /></ToolBtn>
              <ToolBtn title="נטוי" onClick={() => wrapSel('*')}><Italic size={15} /></ToolBtn>
              <ToolBtn title="קוד" onClick={() => wrapSel('`')}><Code size={15} /></ToolBtn>
              <Sep />
              <ToolBtn title="רשימה" onClick={() => prefixLine('- ')}><List size={15} /></ToolBtn>
              <ToolBtn title="רשימה ממוספרת" onClick={() => prefixLine('1. ')}><ListOrdered size={15} /></ToolBtn>
              <ToolBtn title="ציטוט" onClick={() => prefixLine('> ')}><Quote size={15} /></ToolBtn>
              <Sep />
              <ToolBtn title="קו מפריד" onClick={() => insertBlock('\n\n---\n\n')}><Minus size={15} /></ToolBtn>
            </div>
          )}

          {/* Edit textarea */}
          {contentTab === 'edit' && (
            <textarea
              ref={contentRef}
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              rows={16}
              placeholder={'כתוב כאן...\n\nלדוגמה:\n## כותרת\n\nפסקת טקסט עם **מודגש** ו*נטוי*.\n\n- פריט ברשימה\n- פריט נוסף\n\n> ציטוט מעניין'}
              className="w-full px-4 py-3 font-mono text-[13px] leading-relaxed bg-white focus:outline-none resize-y"
              dir="rtl"
              style={{ minHeight: 280 }}
            />
          )}

          {/* Preview */}
          {contentTab === 'preview' && (
            <div
              className="prose-blog px-6 py-6 min-h-64 bg-white"
              dir="rtl"
              dangerouslySetInnerHTML={{ __html: previewHtml || '<p style="color:#9ca3af">אין תוכן להצגה</p>' }}
            />
          )}
        </div>
      </Field>

      {/* ── Date + Author ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field label="מחבר" hint="אופציונלי">
          <select
            value={form.authorId ?? ''}
            onChange={(e) => {
              const id = e.target.value
              set('authorId', id)
              const author = authors.find((item) => item.id === id)
              if (author) {
                set('author', author.name)
                set('authorImage', author.image)
              }
            }}
            className={inputCls}
          >
            <option value="">בחירה ידנית</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name} {author.role ? `(${author.role})` : ''}
              </option>
            ))}
          </select>
          <input
            value={form.author}
            onChange={(e) => {
              set('author', e.target.value)
              if (form.authorId) set('authorId', '')
            }}
            placeholder="למשל: צוות Aiterra"
            className={`${inputCls} mt-2`}
          />
          <p className="text-[11px] text-[#9ca3af] mt-1.5">
            {authors.length > 0 ? 'בחר מחבר מהרשימה או הזן שם ידנית' : 'אין מחברים מוגדרים. הוסף ב-Admin → מחברים'}
          </p>
        </Field>
        <Field label="תמונת מחבר" hint="מוצגת בסוף הפוסט">
          <div className="flex items-center gap-2">
            {form.authorImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.authorImage} alt="" className="w-11 h-11 rounded-full object-cover border border-gray-200 shrink-0" />
            ) : (
              <div className="w-11 h-11 rounded-full border-2 border-dashed border-gray-200 shrink-0 flex items-center justify-center">
                <User size={14} className="text-gray-300" />
              </div>
            )}
            <input
              value={form.authorImage ?? ''}
              onChange={(e) => set('authorImage', e.target.value)}
              placeholder="URL לתמונת מחבר"
              className={`${inputCls} flex-1`}
              dir="ltr"
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="author-image-upload"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAuthorImage(f) }}
            />
            <button
              type="button"
              onClick={() => document.getElementById('author-image-upload')?.click()}
              disabled={uploadingAuthorImage}
              className="shrink-0 px-3 py-2.5 rounded-lg border border-[#1B1BB3]/30 text-[#1B1BB3] hover:bg-[#1B1BB3]/5 transition-colors disabled:opacity-50 flex items-center gap-1.5 text-[12px] font-medium"
            >
              {uploadingAuthorImage
                ? <span className="w-4 h-4 border-2 border-[#1B1BB3]/30 border-t-[#1B1BB3] rounded-full animate-spin" />
                : <Upload size={14} />}
              העלה
            </button>
          </div>
          {selectedAuthor && (
            <p className="text-[11px] text-[#9ca3af] mt-1.5">
              תמונה זו תדרוס זמנית את תמונת הפרופיל של {selectedAuthor.name} עבור הפוסט הנוכחי.
            </p>
          )}
        </Field>
        <Field label="תאריך פרסום" hint="ריק = היום (אוטומטי)">
          <input
            type="date"
            value={form.datePublished}
            onChange={(e) => set('datePublished', e.target.value)}
            className={inputCls}
            dir="ltr"
          />
        </Field>
      </div>

      {/* ── Images ───────────────────────────────────────────────────────── */}
      <Field label="תמונות" hint="לחץ ★ להגדרת תמונת עטיפה">
        <div className="flex flex-col gap-2 mt-1">
          {form.images.map((img, i) => (
            <div key={i} className="flex gap-2 items-center">
              <button type="button" onClick={() => setCover(i)} title={i === 0 ? 'תמונת עטיפה' : 'הגדר כעטיפה'}
                className="shrink-0 p-1.5 transition-colors" style={{ color: i === 0 ? '#f59e0b' : '#d1d5db' }}>
                <Star size={16} fill={i === 0 ? '#f59e0b' : 'none'} />
              </button>

              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-200 shrink-0 flex items-center justify-center">
                  <ImageIcon size={16} className="text-gray-300" />
                </div>
              )}

              <div className="relative flex-1">
                <input value={img} onChange={(e) => setImage(i, e.target.value)}
                  placeholder="העלה קובץ או הדבק URL..."
                  className={`${inputCls} ${i === 0 ? 'pr-20' : ''}`} dir="ltr" />
                {i === 0 && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    עטיפה
                  </span>
                )}
              </div>

              <input ref={(el) => { fileRefs.current[i] = el }} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(i, f) }} />
              <button type="button" onClick={() => fileRefs.current[i]?.click()} disabled={uploading === i}
                className="shrink-0 px-3 py-2.5 rounded-lg border border-[#1B1BB3]/30 text-[#1B1BB3] hover:bg-[#1B1BB3]/5 transition-colors disabled:opacity-50 flex items-center gap-1.5 text-[12px] font-medium">
                {uploading === i
                  ? <span className="w-4 h-4 border-2 border-[#1B1BB3]/30 border-t-[#1B1BB3] rounded-full animate-spin" />
                  : <Upload size={14} />}
                העלה
              </button>

              <button type="button" onClick={() => removeImage(i)}
                className="p-2 text-gray-300 hover:text-red-500 transition-colors shrink-0">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button type="button" onClick={addImage}
            className="flex items-center gap-2 text-[13px] text-[#1B1BB3] font-medium hover:opacity-70 transition-opacity w-fit mt-1">
            <Plus size={15} /> הוסף תמונה
          </button>
        </div>
      </Field>

      {/* ── Tags ─────────────────────────────────────────────────────────── */}
      <Field label="תגיות">
        <div className="flex flex-wrap gap-2 mt-1">
          {PRESET_TAGS.map((tag) => (
            <button key={tag} type="button" onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-[13px] font-medium border transition-all ${form.tags.includes(tag) ? 'text-white border-transparent' : 'text-[#1B1BB3] border-[#1B1BB3]/30 hover:border-[#1B1BB3]'}`}
              style={form.tags.includes(tag) ? { background: 'linear-gradient(92.63deg,#1B1BB3 14.57%,#530FAD 99.27%)' } : {}}>
              {tag}
            </button>
          ))}
          {customSelectedTags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 pl-1 pr-3 py-1 rounded-full text-[13px] font-medium text-white"
              style={{ background: 'linear-gradient(92.63deg,#1B1BB3 14.57%,#530FAD 99.27%)' }}>
              {tag}
              <button type="button" onClick={() => toggleTag(tag)}
                className="w-4 h-4 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors">
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomTag() } }}
            placeholder="תגית חדשה..." className={`${inputCls} flex-1`} />
          <button type="button" onClick={addCustomTag} disabled={!tagInput.trim()}
            className="px-4 py-2.5 rounded-lg text-[13px] font-medium text-white disabled:opacity-40 hover:opacity-90 transition-opacity shrink-0"
            style={{ background: 'linear-gradient(92.63deg,#1B1BB3 14.57%,#530FAD 99.27%)' }}>
            + הוסף
          </button>
        </div>
      </Field>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <Field label="FAQ – שאלות נפוצות" hint="מוצג מתחת לתוכן הפוסט">
        {!faq ? (
          <button type="button" onClick={enableFaq}
            className="flex items-center gap-2 text-[13px] text-[#1B1BB3] font-medium border border-[#1B1BB3]/30 px-4 py-2.5 rounded-lg hover:bg-[#1B1BB3]/5 transition-colors">
            <Plus size={15} /> הוספת סקשן FAQ
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <input
                value={faq.title}
                onChange={(e) => setFaqTitle(e.target.value)}
                placeholder="כותרת הסקשן"
                className={`${inputCls} flex-1`}
              />
              <button type="button" onClick={disableFaq}
                className="shrink-0 p-2.5 text-gray-300 hover:text-red-500 transition-colors border border-gray-200 rounded-lg"
                title="הסרת סקשן FAQ">
                <Trash2 size={16} />
              </button>
            </div>

            {faq.items.map((item, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 flex flex-col gap-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wide">שאלה {i + 1}</span>
                  <button type="button" onClick={() => removeFaqItem(i)}
                    className="text-[12px] text-red-400 hover:text-red-600 transition-colors">
                    הסרה
                  </button>
                </div>
                <input
                  value={item.q}
                  onChange={(e) => setFaqItem(i, 'q', e.target.value)}
                  placeholder="שאלה..."
                  className={inputCls}
                />
                <textarea
                  value={item.a}
                  onChange={(e) => setFaqItem(i, 'a', e.target.value)}
                  placeholder="תשובה..."
                  rows={2}
                  className={`${inputCls} resize-y`}
                />
              </div>
            ))}

            <button type="button" onClick={addFaqItem}
              className="flex items-center gap-2 text-[13px] text-[#1B1BB3] font-medium hover:opacity-70 transition-opacity w-fit">
              <Plus size={15} /> הוסף שאלה
            </button>
          </div>
        )}
      </Field>

      {error && <p className="text-red-500 text-[13px]">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="px-6 py-2.5 rounded-lg text-white text-[14px] font-bold disabled:opacity-60 hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(92.63deg,#1B1BB3 14.57%,#530FAD 99.27%)' }}>
          {saving ? 'שומר...' : isEdit ? 'שמירת שינויים' : 'פרסום פוסט'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-2.5 rounded-lg text-[14px] font-medium text-[#374151] border border-gray-200 hover:bg-gray-50 transition-colors">
          ביטול
        </button>
      </div>
    </form>
  )
}

function ToolBtn({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="p-1.5 rounded text-[#6b7280] hover:text-[#1B1BB3] hover:bg-[#1B1BB3]/8 transition-all"
    >
      {children}
    </button>
  )
}

function Sep() {
  return <span className="w-px h-4 bg-[#e5e7eb] mx-1 shrink-0" />
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">
        {label}
        {hint && <span className="font-normal text-[#9ca3af] mr-1.5">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = 'w-full px-4 py-2.5 border border-[#d9d9d9] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1B1BB3]/20 focus:border-[#1B1BB3] bg-white transition-all text-right'
