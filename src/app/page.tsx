import Link from 'next/link'
import { MessageSquare, CheckSquare, GitBranch, ArrowRight, Quote } from 'lucide-react'
import Navbar from '@/components/landing/Navbar'

const features = [
  {
    icon: MessageSquare,
    title: 'Real-Time Chat',
    description:
      'Channels, threads, and DMs — everything your team needs to stay in sync without switching tabs.',
  },
  {
    icon: CheckSquare,
    title: 'Task Management',
    description:
      'Kanban boards, list views, and sprint tracking. Assign, prioritise, and ship with clarity.',
  },
  {
    icon: GitBranch,
    title: 'Mind Maps',
    description:
      'Brainstorm visually, then convert nodes into actionable tasks with a single click.',
  },
]

const steps = [
  { number: '1', title: 'Create your workspace', description: 'Set up your organisation in seconds — no credit card required.' },
  { number: '2', title: 'Invite your team', description: 'Share a link or send email invites. Everyone gets onboarded instantly.' },
  { number: '3', title: 'Start collaborating', description: 'Chat, plan, and brainstorm — all in one connected workspace.' },
]

const testimonials = [
  {
    name: 'Riya Menon',
    role: 'Product Manager @ Zuri Labs',
    avatar: 'RM',
    review:
      'Finally one place for our standups, tasks, and roadmap planning. The mind map to task link is a game changer.',
  },
  {
    name: 'Arjun Pillai',
    role: 'Engineering Lead @ Stackd',
    avatar: 'AP',
    review:
      'The Kanban + list hybrid view is exactly what our sprint reviews needed. Onboarded the team in under 20 minutes.',
  },
  {
    name: 'Sneha Krishnan',
    role: 'Founder @ Pebble Studio',
    avatar: 'SK',
    review:
      "As a small team we needed something that didn't feel like Jira. This hits the right balance of power and simplicity.",
  },
  {
    name: 'Vikram Anand',
    role: 'Ops Lead @ Flux Co',
    avatar: 'VA',
    review:
      'Group channels + task assignments in one sidebar changed how we run our weekly syncs.',
  },
]

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Docs', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
  ],
  Legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ],
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#F5F5F5]">
      <Navbar />

      <main id="main-content">
      {/* ─── Hero ─── */}
      <section className="relative flex flex-col items-center px-6 pt-36 pb-24 text-center">
        {/* Subtle radial glow */}
        <div aria-hidden="true" className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[#F97316]/5 blur-[120px]" />

        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Where teams think, talk, and build —{' '}
          <span className="text-[#F97316]">together</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-[#6B7280]">
          Chat, tasks, and mind maps in one place. Stop switching tools and start shipping faster.
        </p>
        <Link
          href="/register"
          className="mt-10 inline-flex items-center gap-2 rounded-lg bg-[#F97316] px-8 py-3.5 font-medium text-white transition-colors hover:bg-[#EA580C]"
        >
          Get Started Free <ArrowRight size={18} aria-hidden="true" />
        </Link>

        {/* Screenshot mockup placeholder */}
        <div aria-hidden="true" className="mt-16 w-full max-w-4xl overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-1">
          <div className="rounded-xl bg-[#0F0F0F] p-6">
            {/* Fake window chrome */}
            <div className="mb-6 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#EF4444]/60" />
              <div className="h-3 w-3 rounded-full bg-[#EAB308]/60" />
              <div className="h-3 w-3 rounded-full bg-[#22C55E]/60" />
              <div className="ml-4 h-5 w-48 rounded bg-[#2A2A2A]" />
            </div>
            {/* Fake UI skeleton */}
            <div className="flex gap-4">
              {/* Sidebar */}
              <div className="hidden w-48 flex-col gap-3 rounded-lg bg-[#1A1A1A] p-4 sm:flex">
                <div className="h-4 w-24 rounded bg-[#2A2A2A]" />
                <div className="h-3 w-32 rounded bg-[#2A2A2A]/60" />
                <div className="h-3 w-28 rounded bg-[#2A2A2A]/60" />
                <div className="h-3 w-36 rounded bg-[#F97316]/30" />
                <div className="h-3 w-20 rounded bg-[#2A2A2A]/60" />
                <div className="mt-4 h-4 w-20 rounded bg-[#2A2A2A]" />
                <div className="h-3 w-24 rounded bg-[#2A2A2A]/60" />
                <div className="h-3 w-28 rounded bg-[#2A2A2A]/60" />
              </div>
              {/* Main content */}
              <div className="flex flex-1 flex-col gap-3 rounded-lg bg-[#1A1A1A] p-4">
                <div className="h-4 w-40 rounded bg-[#2A2A2A]" />
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 flex-shrink-0 rounded-full bg-[#F97316]/20" />
                    <div className="flex flex-col gap-1">
                      <div className="h-3 w-20 rounded bg-[#2A2A2A]" />
                      <div className="h-3 w-64 rounded bg-[#2A2A2A]/50" />
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 flex-shrink-0 rounded-full bg-[#22C55E]/20" />
                    <div className="flex flex-col gap-1">
                      <div className="h-3 w-24 rounded bg-[#2A2A2A]" />
                      <div className="h-3 w-72 rounded bg-[#2A2A2A]/50" />
                      <div className="h-3 w-48 rounded bg-[#2A2A2A]/50" />
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 flex-shrink-0 rounded-full bg-[#F97316]/20" />
                    <div className="flex flex-col gap-1">
                      <div className="h-3 w-20 rounded bg-[#2A2A2A]" />
                      <div className="h-3 w-56 rounded bg-[#2A2A2A]/50" />
                    </div>
                  </div>
                </div>
                <div className="mt-auto h-10 rounded-lg border border-[#2A2A2A] bg-[#0F0F0F]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          Everything your team needs
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-center text-[#6B7280]">
          Three powerful tools, one seamless workspace.
        </p>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-6 transition-colors hover:border-[#F97316]/40"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#F97316]/10 text-[#F97316]">
                <f.icon size={24} aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-[#F5F5F5]">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="border-t border-[#2A2A2A] bg-[#0F0F0F]">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            Up and running in minutes
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-[#6B7280]">
            Three steps to transform how your team works.
          </p>
          <div className="mt-16 grid gap-10 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.number} className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F97316] text-xl font-bold text-white">
                  {s.number}
                </div>
                <h3 className="mt-6 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-[#6B7280]">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="border-t border-[#2A2A2A]">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            Loved by teams everywhere
          </h2>
          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-6"
              >
                <Quote size={20} aria-hidden="true" className="mb-3 text-[#F97316]/50" />
                <p className="text-sm leading-relaxed text-[#F5F5F5]/80">
                  &ldquo;{t.review}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2A2A2A] text-xs font-bold text-[#F97316]">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#F5F5F5]">{t.name}</p>
                    <p className="text-xs text-[#6B7280]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="border-t border-[#2A2A2A]">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <div className="rounded-2xl border border-[#F97316]/30 bg-gradient-to-b from-[#F97316]/5 to-transparent p-12">
            <span className="inline-block rounded-full bg-[#F97316]/10 px-4 py-1.5 text-sm font-medium text-[#F97316]">
              Early Access
            </span>
            <h2 className="mt-6 text-3xl font-bold sm:text-4xl">
              Free during beta
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[#6B7280]">
              Get full access to every feature while we&apos;re in beta. No limits, no credit card.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#F97316] px-8 py-3.5 font-medium text-white transition-colors hover:bg-[#EA580C]"
            >
              Get Started Free <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      </main>

      {/* ─── Footer ─── */}
      <footer aria-label="Site footer" className="border-t border-[#2A2A2A]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand column */}
            <div>
              <Link href="/" className="text-2xl font-bold">
                <span className="text-[#F97316]">K</span>not
              </Link>
              <p className="mt-3 text-sm text-[#6B7280]">
                Where teams think, talk, and build — together.
              </p>
            </div>
            {/* Link columns */}
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading}>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-[#6B7280]">
                  {heading}
                </h4>
                <ul className="mt-4 flex flex-col gap-3">
                  {links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-sm text-[#F5F5F5]/70 transition-colors hover:text-[#F5F5F5]"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 border-t border-[#2A2A2A] pt-8 text-center text-sm text-[#6B7280]">
            &copy; {new Date().getFullYear()} Knot. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
