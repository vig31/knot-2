'use client'

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { useChatStore } from '@/stores/chatStore'
import { useAuthStore } from '@/stores/authStore'
import type { Message } from '@/types'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function shouldGroup(prev: Message | undefined, curr: Message) {
  if (!prev) return false
  if (prev.senderId !== curr.senderId) return false
  const diff = new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime()
  return diff < 5 * 60 * 1000
}

export function ChatPanel({ channelId }: { channelId: string }) {
  const channel = useChatStore((s) => s.channels[channelId])
  const messages = useChatStore((s) => s.messages[channelId] ?? [])
  const sendMessage = useChatStore((s) => s.sendMessage)
  const user = useAuthStore((s) => s.user)
  const members = useAuthStore((s) => s.members)

  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  function getChannelDisplayName() {
    if (!channel) return ''
    if (channel.type === 'group') return `# ${channel.name}`
    const otherId = channel.members.find((id) => id !== user?.uid)
    const other = members.find((m) => m.uid === otherId)
    return other?.name ?? 'Direct Message'
  }

  function handleSend() {
    const trimmed = input.trim()
    if (!trimmed) return
    sendMessage(channelId, trimmed)
    setInput('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#0F0F0F]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#2A2A2A] shrink-0">
        <h2 className="text-lg font-semibold text-[#F5F5F5]">{getChannelDisplayName()}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
        {messages.map((msg, i) => {
          const grouped = shouldGroup(messages[i - 1], msg)
          return (
            <div key={msg.id} className={grouped ? 'pl-12' : 'flex gap-3 mt-4 first:mt-0'}>
              {!grouped && (
                <div className="w-9 h-9 rounded-full bg-[#2A2A2A] flex items-center justify-center text-xs font-bold text-[#F5F5F5] shrink-0 mt-0.5">
                  {getInitials(msg.senderName)}
                </div>
              )}
              <div className="min-w-0">
                {!grouped && (
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#F5F5F5]">{msg.senderName}</span>
                    <span className="text-xs text-[#6B7280]">{formatTime(msg.timestamp)}</span>
                  </div>
                )}
                <p className="text-sm text-[#F5F5F5] leading-relaxed break-words">{msg.content}</p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-[#2A2A2A] shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${getChannelDisplayName()}`}
            className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-sm text-[#F5F5F5] placeholder-[#6B7280] outline-none focus:border-[#F97316] transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-3 rounded-lg bg-[#F97316] text-white hover:bg-[#EA6C0E] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
