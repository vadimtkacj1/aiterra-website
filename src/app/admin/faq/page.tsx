'use client'

import { useEffect, useState } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'
import type { FaqData, FaqItem, FaqAllData } from '@/lib/faq-server'

const gradient = 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)'

const PAGE_LABELS: Record<string, string> = {
  '/': 'דף הבית',
  '/about': 'אודותינו',
  '/contact': 'צור קשר',
  '/portfolio': 'תיק עבודות',
  '/services': 'שירותים',
  '/services/web-development': 'פיתוח אתרים',
  '/services/seo': 'קידום אתרים (SEO)',
  '/services/automation': 'אוטומציה',
  '/services/adv': 'פרסום ממומן',
}

export default function AdminFaqPage() {
  const [allData, setAllData] = useState<FaqAllData | null>(null)
  const [selectedPage, setSelectedPage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/faq')
      .then((r) => r.json())
      .then(setAllData)
  }, [])

  if (!allData) {
    return (
      <div>
        <AdminHeader title="FAQ" subtitle="טוען..." />
        <div className="p-8 text-[#9ca3af] text-[14px]">טוען...</div>
      </div>
    )
  }

  const currentData: FaqData | null = selectedPage ? (allData[selectedPage] ?? null) : null

  const updateTitle = (value: string) => {
    if (!selectedPage) return
    setAllData((prev) => prev ? { ...prev, [selectedPage]: { ...prev[selectedPage], title: value } } : prev)
  }

  const updateItem = (i: number, field: keyof FaqItem, value: string) => {
    if (!selectedPage) return
    setAllData((prev) => {
      if (!prev) return prev
      const items = [...prev[selectedPage].items]
      items[i] = { ...items[i], [field]: value }
      return { ...prev, [selectedPage]: { ...prev[selectedPage], items } }
    })
  }

  const addItem = () => {
    if (!selectedPage) return
    setAllData((prev) => {
      if (!prev) return prev
      return { ...prev, [selectedPage]: { ...prev[selectedPage], items: [...prev[selectedPage].items, { q: '', a: '' }] } }
    })
  }

  const removeItem = (i: number) => {
    if (!selectedPage) return
    setAllData((prev) => {
      if (!prev) return prev
      return { ...prev, [selectedPage]: { ...prev[selectedPage], items: prev[selectedPage].items.filter((_, idx) => idx !== i) } }
    })
  }

  const save = async () => {
    if (!selectedPage || !currentData) return
    setSaving(true)
    await fetch(`/api/admin/faq?page=${encodeURIComponent(selectedPage)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentData),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <AdminHeader
        title="FAQ"
        subtitle={selectedPage ? `עורך: ${PAGE_LABELS[selectedPage] ?? selectedPage}` : 'שאלות נפוצות לפי דף'}
      />

      <div className="p-4 md:p-8" dir="rtl">
        {!selectedPage ? (
          /* Page table */
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
            <table className="min-w-[600px] w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="text-right px-4 py-3 text-[12px] font-semibold text-[#6b7280]">דף</th>
                  <th className="text-right px-4 py-3 text-[12px] font-semibold text-[#6b7280]">כתובת</th>
                  <th className="text-right px-4 py-3 text-[12px] font-semibold text-[#6b7280]">שאלות</th>
                  <th className="text-right px-4 py-3 text-[12px] font-semibold text-[#6b7280]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {Object.keys(allData).map((key) => (
                  <tr key={key} className="align-middle">
                    <td className="px-4 py-3 text-[13px] font-medium text-[#111827]">
                      {PAGE_LABELS[key] ?? key}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#6b7280] font-mono" dir="ltr">{key}</td>
                    <td className="px-4 py-3 text-[13px] text-[#6b7280]">
                      {allData[key].items.length}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedPage(key)}
                          className="px-3 py-1.5 text-[12px] rounded-lg border border-[#1B1BB3]/30 text-[#1B1BB3] hover:bg-[#1B1BB3]/5 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : currentData ? (
          /* Editor */
          <div className="max-w-3xl">
            <button
              onClick={() => setSelectedPage(null)}
              className="flex items-center gap-1.5 text-[13px] text-[#6b7280] hover:text-[#1B1BB3] mb-6 transition-colors"
            >
              ← חזרה לרשימת הדפים
            </button>

            {/* Section title */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6 shadow-sm">
              <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">כותרת הסקשן</label>
              <input
                value={currentData.title}
                onChange={(e) => updateTitle(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] text-[#111827] focus:outline-none focus:border-[#1B1BB3]"
              />
            </div>

            {/* FAQ items */}
            <div className="flex flex-col gap-4 mb-6">
              {currentData.items.length === 0 && (
                <p className="text-[13px] text-[#9ca3af] text-center py-6">אין שאלות עדיין. לחצו על &quot;+ הוספת שאלה&quot;.</p>
              )}
              {currentData.items.map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] font-semibold text-[#9ca3af] uppercase tracking-wide">שאלה {i + 1}</span>
                    <button
                      onClick={() => removeItem(i)}
                      className="px-3 py-1.5 text-[12px] rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Delete
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
        ) : null}
      </div>
    </div>
  )
}
