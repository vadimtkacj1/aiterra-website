'use client'

import { useEffect, useState } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'
import type { FaqData, FaqItem } from '@/lib/faq-server'

const gradient = 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)'

export default function AdminFaqPage() {
  const [data, setData] = useState<FaqData | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/faq')
      .then((r) => r.json())
      .then(setData)
  }, [])

  if (!data) {
    return (
      <div>
        <AdminHeader title="FAQ – צור קשר" subtitle="טעינה..." />
        <div className="p-8 text-[#9ca3af] text-[14px]">טוען...</div>
      </div>
    )
  }

  const updateItem = (i: number, field: keyof FaqItem, value: string) => {
    setData((prev) => {
      if (!prev) return prev
      const items = [...prev.items]
      items[i] = { ...items[i], [field]: value }
      return { ...prev, items }
    })
  }

  const addItem = () => {
    setData((prev) => prev ? { ...prev, items: [...prev.items, { q: '', a: '' }] } : prev)
  }

  const removeItem = (i: number) => {
    setData((prev) => prev ? { ...prev, items: prev.items.filter((_, idx) => idx !== i) } : prev)
  }

  const save = async () => {
    setSaving(true)
    await fetch('/api/admin/faq', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <AdminHeader title="FAQ – צור קשר" subtitle="שאלות נפוצות מתחת לטופס יצירת קשר" />

      <div className="p-4 md:p-8 max-w-3xl" dir="rtl">
        {/* Section title */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6 shadow-sm">
          <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">כותרת הסקשן</label>
          <input
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] text-[#111827] focus:outline-none focus:border-[#1B1BB3]"
          />
        </div>

        {/* FAQ items */}
        <div className="flex flex-col gap-4 mb-6">
          {data.items.map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-semibold text-[#9ca3af] uppercase tracking-wide">שאלה {i + 1}</span>
                <button
                  onClick={() => removeItem(i)}
                  className="text-[12px] text-red-400 hover:text-red-600 transition-colors"
                >
                  הסרה
                </button>
              </div>
              <label className="block text-[12px] font-medium text-[#6b7280] mb-1">שאלה</label>
              <input
                value={item.q}
                onChange={(e) => updateItem(i, 'q', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] text-[#111827] focus:outline-none focus:border-[#1B1BB3] mb-3"
              />
              <label className="block text-[12px] font-medium text-[#6b7280] mb-1">תשובה</label>
              <textarea
                value={item.a}
                onChange={(e) => updateItem(i, 'a', e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] text-[#111827] focus:outline-none focus:border-[#1B1BB3] resize-y"
              />
            </div>
          ))}
        </div>

        {/* Add + Save */}
        <div className="flex gap-3">
          <button
            onClick={addItem}
            className="px-4 py-2 text-[13px] font-semibold text-[#1B1BB3] border border-[#1B1BB3]/40 rounded-lg hover:bg-[#1B1BB3]/5 transition-colors"
          >
            + הוספת שאלה
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-2 text-[13px] font-bold text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
            style={{ background: gradient }}
          >
            {saving ? 'שומר...' : saved ? 'נשמר ✓' : 'שמירת שינויים'}
          </button>
        </div>
      </div>
    </div>
  )
}
