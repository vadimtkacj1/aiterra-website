import { redirect } from 'next/navigation'
import { SECTION_GROUPS } from './sections'

export default function AdminV2ContentIndex() {
  redirect(`/admin/v2/${SECTION_GROUPS[0].id}`)
}
