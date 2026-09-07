'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminBlogActions({ slug }: { slug: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    await fetch(`/api/admin/blog/${slug}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="px-3 py-1.5 text-[12px] font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-60 flex items-center gap-1.5"
    >
      {deleting && (
        <span className="w-3 h-3 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
      )}
      מחיקה
    </button>
  )
}
