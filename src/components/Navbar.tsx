'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-8 h-8" />

  const isDark = theme === 'dark'
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
    >
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  )
}

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="border-b border-slate-800 dark:border-slate-800 bg-slate-900/80 dark:bg-slate-900/80 light:bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-mono text-amber-400 font-semibold text-lg tracking-tight">
          Polymarket<span className="text-slate-400">.in</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/markets" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
            Markets
          </Link>
          <Link href="/leaderboard" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
            Leaderboard
          </Link>

          <ThemeToggle />

          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-amber-400">
                {session.user.points?.toLocaleString()} pts
              </span>
              <Link href="/profile">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? ''}
                    width={28}
                    height={28}
                    className="rounded-full hover:ring-2 hover:ring-amber-400 transition-all"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300 hover:ring-2 hover:ring-amber-400 transition-all">
                    {session.user.name?.[0] ?? '?'}
                  </div>
                )}
              </Link>
              <button
                onClick={() => signOut()}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="text-sm bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
