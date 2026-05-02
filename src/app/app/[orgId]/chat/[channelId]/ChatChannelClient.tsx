'use client'

import { useEffect } from 'react'
import { useChatStore } from '@/stores/chatStore'
import { ChatPanel } from '@/components/chat/ChatPanel'

export default function ChatChannelClient({ channelId }: { channelId: string }) {
  const setActiveChannel = useChatStore((s) => s.setActiveChannel)

  useEffect(() => {
    setActiveChannel(channelId)
  }, [channelId, setActiveChannel])

  return <ChatPanel channelId={channelId} />
}
