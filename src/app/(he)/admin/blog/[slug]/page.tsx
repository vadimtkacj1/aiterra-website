import { notFound } from 'next/navigation'
import AdminHeader from '@/components/admin/AdminHeader'
import PostForm from '@/components/admin/PostForm'
import { getPostBySlug } from '@/lib/blog-server'

export const dynamic = 'force-dynamic'

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <div>
      <AdminHeader title="עריכת פוסט" subtitle={post.title} />
      <div className="p-8 max-w-3xl">
        <PostForm initial={post} />
      </div>
    </div>
  )
}
