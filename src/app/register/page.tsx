'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/stores/authStore'

export default function RegisterPage() {
  const router = useRouter()
  const register = useAuthStore((s) => s.register)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    register(name, email, password)
    router.push('/onboarding/create-org')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F0F0F] px-4">
      <div className="w-full max-w-md rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-8">
        {/* Brand */}
        <div className="mb-8 text-center">
          <Link href="/" className="text-3xl font-bold text-[#F5F5F5]">
            <span className="text-[#F97316]">K</span>not
          </Link>
          <p className="mt-2 text-sm text-[#6B7280]">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm text-[#6B7280]">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-3 text-[#F5F5F5] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            />
          </div>

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

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className="text-sm text-[#6B7280]">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-3 text-[#F5F5F5] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            />
          </div>

          <button
            type="submit"
            className="mt-2 rounded-lg bg-[#F97316] px-6 py-3 font-medium text-white transition-colors hover:bg-[#EA580C]"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6B7280]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#F97316] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
