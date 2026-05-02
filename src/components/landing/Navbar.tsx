'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const el = document.querySelector(href)
      el?.scrollIntoView({ behavior: 'smooth' })
      setMobileOpen(false)
    }
  }

  return (
    <nav aria-label="Main" className="fixed top-0 left-0 right-0 z-50 border-b border-[#2A2A2A] bg-[#0F0F0F]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-[#F5F5F5]">
          <span className="text-[#F97316]">K</span>not
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className="text-sm text-[#6B7280] transition-colors hover:text-[#F5F5F5]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm text-[#F5F5F5] transition-colors hover:bg-[#1A1A1A]"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-[#F97316] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#EA580C]"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="text-[#F5F5F5] md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-menu"
        >
          {mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-nav-menu" className="border-t border-[#2A2A2A] bg-[#0F0F0F] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="text-sm text-[#6B7280] transition-colors hover:text-[#F5F5F5]"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 border-t border-[#2A2A2A] pt-4">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-center text-sm text-[#F5F5F5] transition-colors hover:bg-[#1A1A1A]"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-[#F97316] px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-[#EA580C]"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
