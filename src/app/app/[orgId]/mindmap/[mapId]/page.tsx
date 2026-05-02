import MindMapClient from './MindMapClient'
import { mockMindMaps, mockOrg } from '@/data/mockData'

export function generateStaticParams() {
  return mockMindMaps.map((m) => ({
    orgId: mockOrg.id,
    mapId: m.id,
  }))
}

export default async function MindMapPage({
  params,
}: {
  params: Promise<{ orgId: string; mapId: string }>
}) {
  const { mapId } = await params
  return <MindMapClient mapId={mapId} />
}
