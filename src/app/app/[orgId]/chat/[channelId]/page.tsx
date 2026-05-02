import ChatChannelClient from './ChatChannelClient'
import { mockChannels, mockOrg } from '@/data/mockData'

export function generateStaticParams() {
  return mockChannels.map((ch) => ({
    orgId: mockOrg.id,
    channelId: ch.id,
  }))
}

export default async function ChatChannelPage({
  params,
}: {
  params: Promise<{ orgId: string; channelId: string }>
}) {
  const { channelId } = await params
  return <ChatChannelClient channelId={channelId} />
}
