import AdminHeader from '@/components/admin/AdminHeader'
import SiteSeoForm from './SiteSeoForm'

export const dynamic = 'force-dynamic'

export default function AdminSeoPage() {
  return (
    <div>
      <AdminHeader
        title="SEO — דפים סטטיים"
        subtitle="Title, description, Open Graph, Twitter, מילות מפתח, JSON-LD"
      />
      <div className="p-4 md:p-8 max-w-5xl">
        <SiteSeoForm />
      </div>
    </div>
  )
}
