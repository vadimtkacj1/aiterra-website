import { notFound } from 'next/navigation'
import ContentManager from '../ContentManager'
import { SECTION_GROUPS } from '../sections'

export const dynamic = 'force-dynamic'

export default async function AdminV2GroupPage({ params }: { params: Promise<{ group: string }> }) {
  const { group } = await params
  if (!SECTION_GROUPS.some((item) => item.id === group)) notFound()

  return <ContentManager groupId={group} />
}
