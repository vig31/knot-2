'use client'

import Link from 'next/link'
import { MessageSquare, CheckSquare, GitBranch } from 'lucide-react'

export default function AppHomePage() {
  return (
    <div className="flex items-center justify-center h-full bg-[#0F0F0F]">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-[#F5F5F5] mb-2">Welcome to Knot</h1>
        <p className="text-[#6B7280] mb-8">
          Your unified hub for team communication, task tracking, and visual workflow planning.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/app/org1/chat/c1"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#F97316] text-white rounded-lg hover:bg-[#EA6C0E] transition-colors font-medium"
          >
            <MessageSquare size={18} />
            Open Chat
          </Link>
          <Link
            href="/app/org1/tasks/p1"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F5] rounded-lg hover:bg-[#2A2A2A] transition-colors font-medium"
          >
            <CheckSquare size={18} />
            View Tasks
          </Link>
          <Link
            href="/app/org1/mindmap/mm1"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F5] rounded-lg hover:bg-[#2A2A2A] transition-colors font-medium"
          >
            <GitBranch size={18} />
            Explore Mind Maps
          </Link>
        </div>
      </div>
    </div>
  )
}
