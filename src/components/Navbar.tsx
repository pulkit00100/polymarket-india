'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
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
