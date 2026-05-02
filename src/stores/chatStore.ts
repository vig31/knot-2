import { create } from 'zustand'
import type { Channel, Message } from '@/types'
import { mockChannels, mockMessages } from '@/data/mockData'

interface ChatStore {
  channels: Record<string, Channel>
  messages: Record<string, Message[]>
  activeChannelId: string | null
  sendMessage: (channelId: string, content: string) => void
  setActiveChannel: (id: string) => void
  createGroup: (name: string, members: string[]) => void
  markAsRead: (channelId: string) => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  channels: Object.fromEntries(mockChannels.map((c) => [c.id, c])),
  messages: mockMessages,
  activeChannelId: null,

  sendMessage: (channelId, content) => {
    const msg: Message = {
      id: `m-${Date.now()}`,
      senderId: 'u1',
      senderName: 'Vignesh K',
      content,
      timestamp: new Date(),
      channelId,
      type: 'text',
    }
    set((s) => ({
      messages: {
        ...s.messages,
        [channelId]: [...(s.messages[channelId] || []), msg],
      },
    }))
  },

  setActiveChannel: (id) => {
    set({ activeChannelId: id })
    get().markAsRead(id)
  },

  createGroup: (name, members) => {
    const id = `c-${Date.now()}`
    const channel: Channel = { id, type: 'group', name, members, unreadCount: 0 }
    set((s) => ({
      channels: { ...s.channels, [id]: channel },
      messages: { ...s.messages, [id]: [] },
    }))
  },

  markAsRead: (channelId) => {
    set((s) => ({
      channels: {
        ...s.channels,
        [channelId]: { ...s.channels[channelId], unreadCount: 0 },
      },
    }))
  },
}))
