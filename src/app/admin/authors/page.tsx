'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'
import type { AuthorProfile } from '@/lib/authors-server'

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<AuthorProfile[] | null>(null)

  const loadAuthors = () => {
    fetch('/api/admin/authors')
      .then((r) => r.json())
      .then(setAuthors)
  }

  useEffect(() => {
    loadAuthors()
  }, [])

  if (!authors) {
    return (
      <div>
        <AdminHeader title="מחברים" subtitle="טעינה..." />
        <div className="p-8 text-[#9ca3af] text-[14px]">טוען...</div>
      </div>
    )
  }

  const removeAuthor = async (id: string) => {
    await fetch(`/api/admin/authors/${encodeURIComponent(id)}`, { method: 'DELETE' })
    loadAuthors()
  }

  return (
    <div>
      <AdminHeader title="מחברים" subtitle="ניהול משתתפי כתיבה + רשתות חברתיות" />

      <div className="p-4 md:p-8" dir="rtl">
        <div className="flex justify-end mb-4">
          <Link
            href="/admin/authors/new"
            className="px-4 py-2 text-[13px] font-semibold text-white rounded-lg hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)' }}
          >
            + Add user
          </Link>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="text-right px-3 py-3 text-[12px] font-semibold text-[#6b7280]">Name</th>
                <th className="text-right px-3 py-3 text-[12px] font-semibold text-[#6b7280]">ID</th>
                <th className="text-right px-3 py-3 text-[12px] font-semibold text-[#6b7280]">Role</th>
                <th className="text-right px-3 py-3 text-[12px] font-semibold text-[#6b7280]">Image</th>
                <th className="text-right px-3 py-3 text-[12px] font-semibold text-[#6b7280]">Text</th>
                <th className="text-right px-3 py-3 text-[12px] font-semibold text-[#6b7280]">Socials</th>
                <th className="text-right px-3 py-3 text-[12px] font-semibold text-[#6b7280]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {authors.map((author) => (
                <tr key={author.id} className="align-top">
                  <td className="px-3 py-3 min-w-[180px] text-[13px] text-[#111827]">{author.name}</td>
                  <td className="px-3 py-3 min-w-[150px] text-[13px] text-[#6b7280]" dir="ltr">{author.id}</td>
                  <td className="px-3 py-3 min-w-[140px] text-[13px] text-[#111827]">{author.role || '-'}</td>
                  <td className="px-3 py-3 min-w-[90px]">
                    {author.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={author.image} alt={author.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <span className="text-[12px] text-[#9ca3af]">-</span>
                    )}
                  </td>
                  <td className="px-3 py-3 min-w-[260px] text-[12px] text-[#6b7280]">
                    {author.bio ? `${author.bio.slice(0, 110)}${author.bio.length > 110 ? '...' : ''}` : '-'}
                  </td>
                  <td className="px-3 py-3 min-w-[200px] text-[13px] text-[#6b7280]">
                    {[author.socials.linkedin, author.socials.instagram, author.socials.whatsapp, author.socials.facebook].filter(Boolean).length}
                  </td>
                  <td className="px-3 py-3 min-w-[180px]">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/authors/${encodeURIComponent(author.id)}`}
                        className="px-3 py-2 text-[12px] rounded-lg border border-[#1B1BB3]/30 text-[#1B1BB3] hover:bg-[#1B1BB3]/5 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => removeAuthor(author.id)}
                        className="px-3 py-2 text-[12px] rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
