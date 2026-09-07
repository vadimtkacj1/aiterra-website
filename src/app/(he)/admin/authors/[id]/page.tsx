import { notFound } from 'next/navigation'
import AdminHeader from '@/components/admin/AdminHeader'
import AuthorEditorForm from '@/components/admin/AuthorEditorForm'
import { getAuthorById } from '@/lib/authors-server'

export const dynamic = 'force-dynamic'

export default async function EditAuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const author = getAuthorById(id)
  if (!author) notFound()

  return (
    <div>
      <AdminHeader title="עריכת מחבר" subtitle={author.name || id} />
      <AuthorEditorForm initial={author} initialId={id} />
    </div>
  )
}
