import AdminHeader from '@/components/admin/AdminHeader'
import PortfolioForm from '@/components/admin/PortfolioForm'

export default function NewPortfolioPage() {
  return (
    <div>
      <AdminHeader title="פרויקט חדש" subtitle="הוספה לתיק עבודות" />
      <div className="p-8 max-w-3xl">
        <PortfolioForm />
      </div>
    </div>
  )
}
