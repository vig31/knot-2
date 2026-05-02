import TaskProjectClient from './TaskProjectClient'
import { mockProjects, mockOrg } from '@/data/mockData'

export function generateStaticParams() {
  return mockProjects.map((p) => ({
    orgId: mockOrg.id,
    projectId: p.id,
  }))
}

export default async function TaskProjectPage({
  params,
}: {
  params: Promise<{ orgId: string; projectId: string }>
}) {
  const { projectId } = await params
  return <TaskProjectClient projectId={projectId} />
}
