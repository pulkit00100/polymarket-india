'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9" />
  const isDark = theme === 'dark'
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
      style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
    >
      {isDark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  )
}

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const navLinks = [
    { href: '/markets', label: 'Markets' },
    { href: '/leaderboard', label: 'Leaderboard' },
  ]

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        background: 'color-mix(in srgb, var(--bg) 85%, transparent)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'var(--primary)', color: '#09090b' }}>
            P
          </div>
          <span className="font-semibold text-base tracking-tight" style={{ color: 'var(--text)' }}>
            Poly<span style={{ color: 'var(--primary)' }}>market</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>.in</span>
          </span>
        </Link>

        {/* Desktop nav links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: active ? 'var(--primary)' : 'var(--text-muted)',
                  background: active ? 'var(--primary-dim)' : 'transparent',
                }}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {session ? (
            <div className="flex items-center gap-3">
              {/* Points — desktop only */}
              <span className="hidden md:block text-xs font-mono font-semibold" style={{ color: 'var(--primary)' }}>
                {session.user.points?.toLocaleString()} pts
              </span>
              <Link href="/profile" className="flex items-center gap-2">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? ''}
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-amber-400"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: 'var(--primary)', color: '#09090b' }}>
                    {session.user.name?.[0] ?? '?'}
                  </div>
                )}
              </Link>
              <button
                onClick={() => signOut()}
                className="hidden md:block text-xs transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="text-sm font-semibold px-4 py-2 rounded-xl transition-all active:scale-95"
              style={{ background: 'var(--primary)', color: '#09090b' }}
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
