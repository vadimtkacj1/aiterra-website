import AdminHeader from '@/components/admin/AdminHeader'
import AuthorEditorForm from '@/components/admin/AuthorEditorForm'

export default function NewAuthorPage() {
  return (
    <div>
      <AdminHeader title="מחבר חדש" subtitle="יצירת פרופיל מחבר חדש" />
      <AuthorEditorForm
        initialId="new-author"
        initial={{
          id: '',
          name: '',
          role: '',
          bio: '',
          image: '',
          socials: {},
        }}
      />
    </div>
  )
}
