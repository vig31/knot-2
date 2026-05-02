'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/stores/authStore'

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)
  const storeError = useAuthStore((s) => s.error)
  const user = useAuthStore((s) => s.user)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')

  const error = localError || storeError || ''

  useEffect(() => {
    if (user) {
      router.push('/app/org1/chat/c1')
    }
  }, [user, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')
    if (!email || !password) {
      setLocalError('Please fill in all fields.')
      return
    }
    login(email, password)
  }

  return (
    <main id="main-content" className="flex min-h-screen items-center justify-center bg-[#0F0F0F] px-4">
      <div className="w-full max-w-md rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-8">
        {/* Brand */}
        <div className="mb-8 text-center">
          <Link href="/" className="text-3xl font-bold text-[#F5F5F5]">
            <span className="text-[#F97316]">K</span>not
          </Link>
          <p className="mt-2 text-sm text-[#6B7280]">Welcome back</p>
        </div>

        <form onSubmit={handleSubmit} aria-label="Login" className="flex flex-col gap-4">
          {error && (
            <p role="alert" className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm text-[#6B7280]">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-3 text-[#F5F5F5] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm text-[#6B7280]">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-3 text-[#F5F5F5] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            />
          </div>

          <button
            type="submit"
            className="mt-2 rounded-lg bg-[#F97316] px-6 py-3 font-medium text-white transition-colors hover:bg-[#EA580C]"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6B7280]">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[#F97316] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  )
}
