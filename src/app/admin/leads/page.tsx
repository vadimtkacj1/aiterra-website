'use client'

import { useEffect, useMemo, useState } from 'react'
import { Download, Mail, Phone, RefreshCw } from 'lucide-react'
import AdminHeader from '@/components/admin/AdminHeader'
import type { SiteLead } from '@/lib/leads-server'

const SOURCE_LABELS: Record<string, string> = {
  'cta-section': 'בלוק CTA',
  'contact-page': 'דף צור קשר',
  'ecommerce-landing': 'לנדינג איקומרס',
  'v2-home': 'דף הבית',
  'v2-contact': 'דף צור קשר',
  'v2-services': 'דף שירותים',
  'v2-projects': 'דף פרויקטים',
  'v2-about': 'דף אודות',
  'v2-blog': 'בלוג',
}

const CRM_LABELS: Record<string, string> = {
  sent: 'נשלח',
  failed: 'נכשל',
  skipped: 'לא מחובר',
}

const CRM_CLASSES: Record<string, string> = {
  sent: 'text-[#047857] bg-[#047857]/10',
  failed: 'text-[#b91c1c] bg-[#b91c1c]/10',
  skipped: 'text-[#6b7280] bg-gray-100',
}

function CrmBadge({ status }: { status?: string }) {
  if (!status) return <span className="text-[#9ca3af]">-</span>
  return (
    <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${CRM_CLASSES[status] || CRM_CLASSES.skipped}`}>
      {CRM_LABELS[status] || status}
    </span>
  )
}

const DAY_MS = 24 * 60 * 60 * 1000

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jerusalem',
  }).format(date)
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<SiteLead[] | null>(null)
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const loadLeads = () => {
    setRefreshing(true)
    fetch('/api/admin/leads')
      .then((r) => (r.ok ? r.json() : []))
      .then(setLeads)
      .finally(() => setRefreshing(false))
  }

  useEffect(() => {
    loadLeads()
  }, [])

  const filtered = useMemo(() => {
    if (!leads) return []
    const q = query.trim().toLowerCase()
    if (!q) return leads
    return leads.filter((lead) =>
      [lead.name, lead.phone, lead.email, lead.message, lead.treatment, lead.source]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q))
    )
  }, [leads, query])

  const freshCount = useMemo(() => {
    if (!leads) return 0
    const cutoff = Date.now() - DAY_MS
    return leads.filter((lead) => new Date(lead.createdAt).getTime() > cutoff).length
  }, [leads])

  if (!leads) {
    return (
      <div>
        <AdminHeader title="לידים" subtitle="טעינה..." />
        <div className="p-8 text-[#9ca3af] text-[14px]">טוען...</div>
      </div>
    )
  }

  return (
    <div>
      <AdminHeader
        title="לידים"
        subtitle={`${leads.length} פניות מהאתר${freshCount ? ` · ${freshCount} חדשות ב-24 שעות` : ''}`}
      />

      <div className="p-4 md:p-8" dir="rtl">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חיפוש לפי שם, טלפון, מייל או תוכן..."
            className="flex-1 min-w-[220px] px-3 py-2 text-[13px] rounded-lg border border-gray-200 outline-none focus:border-[#2447D6]/40"
          />
          <button
            onClick={loadLeads}
            className="flex items-center gap-2 px-3 py-2 text-[13px] rounded-lg border border-gray-200 text-[#6b7280] hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : undefined} />
            רענון
          </button>
          <a
            href="/api/admin/leads?format=csv"
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white rounded-lg hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(92.63deg, #2447D6 14.57%, #3E96F9 99.27%)' }}
          >
            <Download size={14} />
            ייצוא CSV
          </a>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center text-[14px] text-[#9ca3af]">
            {leads.length === 0 ? 'עדיין לא התקבלו פניות מהאתר.' : 'אין תוצאות לחיפוש הזה.'}
          </div>
        ) : (
          <>
          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map((lead) => {
              const isFresh = Date.now() - new Date(lead.createdAt).getTime() < DAY_MS
              const isOpen = expanded === lead.id
              const message = lead.message || ''
              const isLong = message.length > 120
              return (
                <div key={lead.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span dir="ltr" className="text-[12px] text-[#9ca3af]">{formatDate(lead.createdAt)}</span>
                    {isFresh && (
                      <span className="rounded bg-[#2447D6]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#2447D6]">
                        חדש
                      </span>
                    )}
                  </div>

                  <p className="mt-1.5 text-[15px] font-semibold text-[#111827]">{lead.name}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[12px] text-[#9ca3af]">
                    {lead.source ? <span>{SOURCE_LABELS[lead.source] || lead.source}</span> : null}
                    {lead.treatment ? <span className="text-[#6b7280]">· {lead.treatment}</span> : null}
                    {lead.crm === 'failed' ? <CrmBadge status={lead.crm} /> : null}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {lead.phone ? (
                      <a
                        href={`tel:${lead.phone.replace(/[^\d+]/g, '')}`}
                        dir="ltr"
                        className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-[#2447D6]/25 px-3 text-[13px] font-medium text-[#2447D6]"
                      >
                        <Phone size={14} />
                        {lead.phone}
                      </a>
                    ) : null}
                    {lead.email ? (
                      <a
                        href={`mailto:${lead.email}`}
                        dir="ltr"
                        className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 text-[13px] text-[#374151]"
                      >
                        <Mail size={14} />
                        <span className="truncate">{lead.email}</span>
                      </a>
                    ) : null}
                  </div>

                  {message ? (
                    <p className="mt-3 text-[13px] leading-relaxed text-[#6b7280]">
                      {isLong && !isOpen ? `${message.slice(0, 120)}…` : message}
                      {isLong ? (
                        <button
                          onClick={() => setExpanded(isOpen ? null : lead.id)}
                          className="ms-1.5 text-[12px] font-medium text-[#2447D6]"
                        >
                          {isOpen ? 'הצג פחות' : 'הצג הכל'}
                        </button>
                      ) : null}
                    </p>
                  ) : null}
                </div>
              )
            })}
          </div>

          <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
            <table className="min-w-[1080px] w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="text-right px-3 py-3 text-[12px] font-semibold text-[#6b7280]">Date</th>
                  <th className="text-right px-3 py-3 text-[12px] font-semibold text-[#6b7280]">Name</th>
                  <th className="text-right px-3 py-3 text-[12px] font-semibold text-[#6b7280]">Phone</th>
                  <th className="text-right px-3 py-3 text-[12px] font-semibold text-[#6b7280]">Email</th>
                  <th className="text-right px-3 py-3 text-[12px] font-semibold text-[#6b7280]">Service</th>
                  <th className="text-right px-3 py-3 text-[12px] font-semibold text-[#6b7280]">Source</th>
                  <th className="text-right px-3 py-3 text-[12px] font-semibold text-[#6b7280]">CRM</th>
                  <th className="text-right px-3 py-3 text-[12px] font-semibold text-[#6b7280]">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((lead) => {
                  const isFresh = Date.now() - new Date(lead.createdAt).getTime() < DAY_MS
                  const isOpen = expanded === lead.id
                  const message = lead.message || ''
                  const isLong = message.length > 120

                  return (
                    <tr key={lead.id} className="align-top">
                      <td className="px-3 py-3 min-w-[150px] text-[13px] text-[#6b7280] whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span dir="ltr">{formatDate(lead.createdAt)}</span>
                          {isFresh && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded text-[#2447D6] bg-[#2447D6]/10">
                              חדש
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 min-w-[140px] text-[13px] font-medium text-[#111827]">{lead.name}</td>
                      <td className="px-3 py-3 min-w-[140px] text-[13px]">
                        {lead.phone ? (
                          <a
                            href={`tel:${lead.phone.replace(/[^\d+]/g, '')}`}
                            dir="ltr"
                            className="inline-flex items-center gap-1.5 text-[#2447D6] hover:underline"
                          >
                            <Phone size={13} />
                            {lead.phone}
                          </a>
                        ) : (
                          <span className="text-[#9ca3af]">-</span>
                        )}
                      </td>
                      <td className="px-3 py-3 min-w-[200px] text-[13px]">
                        {lead.email ? (
                          <a
                            href={`mailto:${lead.email}`}
                            dir="ltr"
                            className="inline-flex items-center gap-1.5 text-[#2447D6] hover:underline"
                          >
                            <Mail size={13} />
                            {lead.email}
                          </a>
                        ) : (
                          <span className="text-[#9ca3af]">-</span>
                        )}
                      </td>
                      <td className="px-3 py-3 min-w-[130px] text-[12px] text-[#374151]">
                        {lead.treatment || <span className="text-[#9ca3af]">-</span>}
                      </td>
                      <td className="px-3 py-3 min-w-[130px] text-[12px] text-[#6b7280]">
                        {lead.source ? SOURCE_LABELS[lead.source] || lead.source : '-'}
                      </td>
                      <td className="px-3 py-3 min-w-[90px] text-[12px] whitespace-nowrap">
                        <CrmBadge status={lead.crm} />
                      </td>
                      <td className="px-3 py-3 min-w-[300px] text-[12px] text-[#6b7280]">
                        {message ? (
                          <>
                            <div className={isOpen ? 'whitespace-pre-wrap' : undefined}>
                              {isOpen || !isLong ? message : `${message.slice(0, 120)}...`}
                            </div>
                            {isLong && (
                              <button
                                onClick={() => setExpanded(isOpen ? null : lead.id)}
                                className="mt-1 text-[12px] text-[#2447D6] hover:underline"
                              >
                                {isOpen ? 'הסתר' : 'הצג הכל'}
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="text-[#9ca3af]">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>
    </div>
  )
}
