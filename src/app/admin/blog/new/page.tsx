import AdminHeader from '@/components/admin/AdminHeader'
import PostForm from '@/components/admin/PostForm'

export default function NewPostPage() {
  return (
    <div>
      <AdminHeader title="פוסט חדש" subtitle="יצירת פוסט בלוג חדש" />
      <div className="p-8 max-w-3xl">
        <PostForm />
      </div>
    </div>
  )
}
