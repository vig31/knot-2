'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  MessageSquare,
  Hash,
  CheckSquare,
  GitBranch,
  Settings,
  LogOut,
  Plus,
  Users,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { useChatStore } from '@/stores/chatStore'
import { useTaskStore } from '@/stores/taskStore'
import { useMindMapStore } from '@/stores/mindMapStore'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const user = useAuthStore((s) => s.user)
  const members = useAuthStore((s) => s.members)
  const logout = useAuthStore((s) => s.logout)
  const channels = useChatStore((s) => s.channels)
  const createGroup = useChatStore((s) => s.createGroup)
  const projects = useTaskStore((s) => s.projects)
  const maps = useMindMapStore((s) => s.maps)

  const [dmExpanded, setDmExpanded] = useState(true)

  const orgId = useAuthStore((s) => s.orgId) ?? 'org1'

  const channelList = Object.values(channels)
  const groupChannels = channelList.filter((c) => c.type === 'group')
  const dmChannels = channelList.filter((c) => c.type === 'dm')

  const isActive = (href: string) => {
    const basePath = href.split('?')[0]
    return pathname === basePath || pathname.startsWith(basePath + '/')
  }

  function getDmDisplayName(channel: { members: string[] }) {
    const otherId = channel.members.find((id) => id !== user?.uid)
    const other = members.find((m) => m.uid === otherId)
    return other?.name ?? 'Unknown'
  }

  function handleCreateGroup() {
    const name = prompt('Channel name:')
    if (name?.trim()) {
      createGroup(name.trim(), user ? [user.uid] : [])
    }
  }

  function handleLogout() {
    logout()
    router.push('/login')
  }

  if (!sidebarOpen) return null

  return (
    <aside aria-label="Application sidebar" className="w-[260px] shrink-0 bg-[#1A1A1A] border-r border-[#2A2A2A] flex flex-col h-full overflow-y-auto">
      {/* Org + User header */}
      <div className="px-4 py-4 border-b border-[#2A2A2A]">
        <h1 className="text-base font-bold text-[#F5F5F5]">Knot Labs</h1>
        {user && (
          <div className="flex items-center gap-2 mt-3">
            <div className="w-8 h-8 rounded-full bg-[#F97316] flex items-center justify-center text-xs font-bold text-white shrink-0">
              {getInitials(user.name)}
            </div>
            <span className="text-sm text-[#F5F5F5] truncate">{user.name}</span>
          </div>
        )}
      </div>

      {/* Scrollable nav */}
      <nav aria-label="Main navigation" className="flex-1 py-3 overflow-y-auto">
        {/* ── CHAT ── */}
        <SectionHeader label="Chat" icon={<MessageSquare size={14} aria-hidden="true" />} />

        {/* Group channels */}
        {groupChannels.map((ch) => {
          const href = `/app/${orgId}/chat/${ch.id}`
          return (
            <NavItem key={ch.id} href={href} active={isActive(href)}>
              <Hash size={16} aria-hidden="true" className="shrink-0 text-[#6B7280]" />
              <span className="truncate">{ch.name}</span>
              {ch.unreadCount > 0 && <UnreadBadge count={ch.unreadCount} />}
            </NavItem>
          )
        })}

        {/* DMs */}
        <button
          onClick={() => setDmExpanded((v) => !v)}
          aria-expanded={dmExpanded}
          aria-controls="dm-channel-list"
          className="flex items-center gap-1 px-4 py-1.5 text-xs text-[#6B7280] hover:text-[#F5F5F5] w-full transition-colors"
        >
          {dmExpanded ? <ChevronDown size={14} aria-hidden="true" /> : <ChevronRight size={14} aria-hidden="true" />}
          <Users size={14} aria-hidden="true" />
          <span>Direct Messages</span>
        </button>
        <div id="dm-channel-list">
          {dmExpanded &&
            dmChannels.map((ch) => {
              const href = `/app/${orgId}/chat/${ch.id}`
              return (
                <NavItem key={ch.id} href={href} active={isActive(href)}>
                  <div aria-hidden="true" className="w-5 h-5 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[10px] font-bold text-[#F5F5F5] shrink-0">
                    {getInitials(getDmDisplayName(ch))}
                  </div>
                  <span className="truncate">{getDmDisplayName(ch)}</span>
                  {ch.unreadCount > 0 && <UnreadBadge count={ch.unreadCount} />}
                </NavItem>
              )
            })}
        </div>

        {/* New Channel */}
        <button
          onClick={handleCreateGroup}
          className="flex items-center gap-2 px-4 py-2 mx-2 text-sm text-[#6B7280] hover:text-[#F97316] transition-colors cursor-pointer"
        >
          <Plus size={16} aria-hidden="true" />
          <span>New Channel</span>
        </button>

        {/* ── TASKS ── */}
        <SectionHeader label="Tasks" icon={<CheckSquare size={14} aria-hidden="true" />} />
        {Object.values(projects).map((p) => {
          const href = `/app/${orgId}/tasks/${p.id}`
          const isTaskActive = pathname.startsWith(`/app/${orgId}/tasks/${p.id}`)
          return (
            <NavItem key={p.id} href={href} active={isTaskActive}>
              <div aria-hidden="true" className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: p.color }} />
              <span className="truncate">{p.name}</span>
            </NavItem>
          )
        })}
        <button className="flex items-center gap-2 px-4 py-2 mx-2 text-sm text-[#6B7280] hover:text-[#F97316] transition-colors cursor-pointer">
          <Plus size={16} aria-hidden="true" />
          <span>New Project</span>
        </button>

        {/* ── MIND MAPS ── */}
        <SectionHeader label="Mind Maps" icon={<GitBranch size={14} aria-hidden="true" />} />
        {Object.values(maps).map((m) => {
          const href = `/app/${orgId}/mindmap/${m.id}`
          return (
            <NavItem key={m.id} href={href} active={isActive(href)}>
              <GitBranch size={16} aria-hidden="true" className="shrink-0 text-[#6B7280]" />
              <span className="truncate">{m.name}</span>
            </NavItem>
          )
        })}
        <button className="flex items-center gap-2 px-4 py-2 mx-2 text-sm text-[#6B7280] hover:text-[#F97316] transition-colors cursor-pointer">
          <Plus size={16} aria-hidden="true" />
          <span>New Map</span>
        </button>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-[#2A2A2A] py-2">
        <NavItem href="/app/settings?orgId=org1" active={isActive('/app/settings')}>
          <Settings size={16} aria-hidden="true" className="shrink-0 text-[#6B7280]" />
          <span>Settings</span>
        </NavItem>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 mx-2 text-sm text-[#6B7280] hover:text-red-400 w-full rounded-md transition-colors cursor-pointer"
        >
          <LogOut size={16} aria-hidden="true" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

/* ── Helpers ── */

function SectionHeader({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#6B7280] font-semibold px-4 py-2 mt-3 first:mt-0">
      {icon}
      {label}
    </div>
  )
}

function NavItem({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-4 py-2 text-sm mx-2 rounded-md transition-colors cursor-pointer ${
        active
          ? 'bg-[#2A2A2A] border-l-2 border-[#F97316] text-[#F97316]'
          : 'text-[#F5F5F5] hover:bg-[#2A2A2A]'
      }`}
    >
      {children}
    </Link>
  )
}

function UnreadBadge({ count }: { count: number }) {
  return (
    <span
      aria-label={`${count} unread`}
      className="ml-auto flex items-center justify-center min-w-[20px] h-5 rounded-full bg-[#F97316] text-white text-xs font-bold px-1.5"
    >
      {count}
    </span>
  )
}
