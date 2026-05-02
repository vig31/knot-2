'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useChatStore } from '@/stores/chatStore'
import { ChatPanel } from '@/components/chat/ChatPanel'

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatPageContent />
    </Suspense>
  )
}

function ChatPageContent() {
  const searchParams = useSearchParams()
  const channelId = searchParams.get('channelId')
  const setActiveChannel = useChatStore((s) => s.setActiveChannel)

  useEffect(() => {
    if (channelId) setActiveChannel(channelId)
  }, [channelId, setActiveChannel])

  if (!channelId) return null

  return <ChatPanel channelId={channelId} />
}
