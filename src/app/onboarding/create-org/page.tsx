'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Upload } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

export default function CreateOrgPage() {
  const router = useRouter()
  const setOrg = useAuthStore((s) => s.setOrg)

  const [orgName, setOrgName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!orgName.trim()) {
      setError('Please enter an organization name.')
      return
    }
    setOrg('org1')
    router.push('/app/org1/chat/c1')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F0F0F] px-4">
      <div className="w-full max-w-md rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-8">
        {/* Brand */}
        <div className="mb-8 text-center">
          <Link href="/" className="text-3xl font-bold text-[#F5F5F5]">
            <span className="text-[#F97316]">K</span>not
          </Link>
          <h2 className="mt-4 text-xl font-semibold text-[#F5F5F5]">
            Set up your workspace
          </h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            Give your team a home
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="orgName" className="text-sm text-[#6B7280]">
              Organization Name
            </label>
            <input
              id="orgName"
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Acme Inc."
              className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-3 text-[#F5F5F5] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            />
          </div>

          {/* Logo upload placeholder */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#6B7280]">
              Logo <span className="text-[#6B7280]/60">(optional)</span>
            </label>
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#2A2A2A] px-6 py-8 text-[#6B7280] transition-colors hover:border-[#F97316]/40">
              <Upload size={24} />
              <span className="text-sm">Click or drag to upload</span>
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 rounded-lg bg-[#F97316] px-6 py-3 font-medium text-white transition-colors hover:bg-[#EA580C]"
          >
            Create Workspace
          </button>
        </form>
      </div>
    </div>
  )
}
