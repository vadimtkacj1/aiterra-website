'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, User } from 'lucide-react'
import type { AuthorProfile } from '@/lib/authors-server'

const gradient = 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)'
const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] focus:outline-none focus:border-[#1B1BB3]'
const textAreaCls = `${inputCls} resize-y`

export default function AuthorEditorForm({ initial, initialId }: { initial: AuthorProfile; initialId: string }) {
  const [form, setForm] = useState<AuthorProfile>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()

  const set = <K extends keyof AuthorProfile>(key: K, value: AuthorProfile[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const setSocial = (key: keyof AuthorProfile['socials'], value: string) => {
    setForm((prev) => ({ ...prev, socials: { ...prev.socials, [key]: value } }))
  }

  const uploadAuthorImage = async (file: File) => {
    setUploading(true)
    setError('')
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) set('image', data.url)
      else setError(data.error || 'Upload failed')
    } catch {
      setError('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload: AuthorProfile = {
        id: form.id.trim().toLowerCase(),
        name: form.name.trim(),
        role: form.role.trim(),
        bio: form.bio?.trim() ?? '',
        image: form.image.trim(),
        socials: {
          linkedin: form.socials.linkedin?.trim() ?? '',
          instagram: form.socials.instagram?.trim() ?? '',
          whatsapp: form.socials.whatsapp?.trim() ?? '',
          facebook: form.socials.facebook?.trim() ?? '',
        },
      }
      const targetId = payload.id || initialId
      const res = await fetch(`/api/admin/authors/${encodeURIComponent(initialId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Save failed')
        return
      }
      if (targetId !== initialId) {
        await fetch(`/api/admin/authors/${encodeURIComponent(initialId)}`, { method: 'DELETE' })
      }
      router.replace(`/admin/authors/${encodeURIComponent(targetId)}`)
      router.refresh()
    } catch {
      setError('Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSave} className="p-4 md:p-8 max-w-3xl flex flex-col gap-4" dir="rtl">
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            value={form.name}
            onChange={(e) => {
              const value = e.target.value
              set('name', value)
              if (!form.id.trim()) {
                set('id', value)
              }
            }}
            placeholder="Name"
            className={inputCls}
          />
          <input value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="Role" className={inputCls} />
          <input value={form.id} onChange={(e) => set('id', e.target.value)} placeholder="ID (sean)" className={inputCls} dir="ltr" />
          <input value={form.image} onChange={(e) => set('image', e.target.value)} placeholder="Image URL" className={inputCls} dir="ltr" />
        </div>
        <textarea
          value={form.bio ?? ''}
          onChange={(e) => set('bio', e.target.value)}
          rows={5}
          placeholder="Bio / text"
          className={textAreaCls}
        />

        <div className="flex items-center gap-3">
          {form.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.image} alt="" className="w-12 h-12 rounded-full object-cover border border-gray-200 shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-200 shrink-0 flex items-center justify-center">
              <User size={14} className="text-gray-300" />
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAuthorImage(f) }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="shrink-0 px-3 py-2 rounded-lg border border-[#1B1BB3]/30 text-[#1B1BB3] hover:bg-[#1B1BB3]/5 transition-colors disabled:opacity-50 flex items-center gap-1.5 text-[12px] font-medium"
          >
            {uploading ? <span className="w-4 h-4 border-2 border-[#1B1BB3]/30 border-t-[#1B1BB3] rounded-full animate-spin" /> : <Upload size={14} />}
            Upload image
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-3">
        <SocialField label="LinkedIn">
          <input value={form.socials.linkedin ?? ''} onChange={(e) => setSocial('linkedin', e.target.value.toLowerCase())} placeholder="https://linkedin.com/in/..." className={`${inputCls} lowercase`} dir="ltr" />
        </SocialField>
        <SocialField label="Instagram">
          <input value={form.socials.instagram ?? ''} onChange={(e) => setSocial('instagram', e.target.value.toLowerCase())} placeholder="https://instagram.com/..." className={`${inputCls} lowercase`} dir="ltr" />
        </SocialField>
        <SocialField label="WhatsApp">
          <input value={form.socials.whatsapp ?? ''} onChange={(e) => setSocial('whatsapp', e.target.value.toLowerCase())} placeholder="https://wa.me/..." className={`${inputCls} lowercase`} dir="ltr" />
        </SocialField>
        <SocialField label="Facebook">
          <input value={form.socials.facebook ?? ''} onChange={(e) => setSocial('facebook', e.target.value.toLowerCase())} placeholder="https://facebook.com/..." className={`${inputCls} lowercase`} dir="ltr" />
        </SocialField>
      </div>

      {error ? <p className="text-red-500 text-[13px]">{error}</p> : null}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="px-5 py-2 text-[13px] font-bold text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60" style={{ background: gradient }}>
          {saving ? 'Saving...' : 'Save author'}
        </button>
        <button type="button" onClick={() => router.push('/admin/authors')} className="px-5 py-2 text-[13px] font-semibold text-[#1B1BB3] border border-[#1B1BB3]/40 rounded-lg hover:bg-[#1B1BB3]/5 transition-colors">
          Back
        </button>
      </div>
    </form>
  )
}

function SocialField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[12px] font-semibold text-[#6b7280]">{label}</span>
      {children}
    </label>
  )
}
