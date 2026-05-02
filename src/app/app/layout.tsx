'use client'

import { Sidebar } from '@/components/sidebar/Sidebar'

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0F0F0F]">
      <Sidebar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  )
}
