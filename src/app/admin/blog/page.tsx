import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'
import { getAllPosts } from '@/lib/blog-server'
import AdminBlogActions from './AdminBlogActions'

export const dynamic = 'force-dynamic'

const gradient = 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)'

export default function AdminBlogPage() {
  const posts = getAllPosts()

  return (
    <div>
      <AdminHeader title="ניהול פוסטים" subtitle={`${posts.length} פוסטים`} />

      <div className="p-4 md:p-8">
        {/* New post button */}
        <div className="flex justify-end mb-5">
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-[14px] font-bold hover:opacity-90 transition-opacity"
            style={{ background: gradient }}
          >
            + פוסט חדש
          </Link>
        </div>

        {posts.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 py-16 text-center text-[#9ca3af] text-[14px]">
            אין פוסטים עדיין
          </div>
        )}

        {/* Mobile: cards */}
        <div className="flex flex-col gap-3 md:hidden">
          {posts.map((post) => (
            <div key={post.slug} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              {/* Cover image */}
              {post.images?.[0] && (
                <div className="w-full h-32 rounded-lg overflow-hidden mb-3 bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.images[0]} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="font-semibold text-[14px] text-[#111827] leading-snug mb-1">{post.title}</div>
              <div className="text-[11px] text-[#9ca3af] mb-2">{post.slug}</div>
              <div className="flex gap-1.5 flex-wrap mb-3">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-[#eff6ff] text-[#1B1BB3] text-[11px] font-medium rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[#9ca3af]">{post.datePublished}</span>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/blog/${post.slug}`}
                    className="px-3 py-1.5 text-[12px] font-medium text-[#1B1BB3] border border-[#1B1BB3]/30 rounded-lg hover:bg-[#1B1BB3]/5 transition-colors"
                  >
                    עריכה
                  </Link>
                  <AdminBlogActions slug={post.slug} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-right px-6 py-3.5 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide">כותרת</th>
                <th className="text-right px-4 py-3.5 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide">תגיות</th>
                <th className="text-right px-4 py-3.5 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide">תאריך</th>
                <th className="text-right px-6 py-3.5 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map((post) => (
                <tr key={post.slug} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {post.images?.[0] && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={post.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-[14px] text-[#111827] max-w-xs truncate">{post.title}</div>
                        <div className="text-[12px] text-[#9ca3af] mt-0.5">{post.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-[#eff6ff] text-[#1B1BB3] text-[11px] font-medium rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[13px] text-[#6b7280] whitespace-nowrap">{post.datePublished}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/blog/${post.slug}`}
                        className="px-3 py-1.5 text-[12px] font-medium text-[#1B1BB3] border border-[#1B1BB3]/30 rounded-lg hover:bg-[#1B1BB3]/5 transition-colors"
                      >
                        עריכה
                      </Link>
                      <AdminBlogActions slug={post.slug} />
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
