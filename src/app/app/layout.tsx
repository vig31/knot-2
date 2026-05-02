'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { Sidebar } from '@/components/sidebar/Sidebar'

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    if (!user) {
      router.replace('/login')
    }
  }, [user, router])

  if (!user) return null

  return (
    <div className="flex h-screen bg-[#0F0F0F]">
      <Sidebar />
      <main id="main-content" className="flex-1 overflow-hidden">{children}</main>
    </div>
  )
}
