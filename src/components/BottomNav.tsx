'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const MarketsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
)
const LeaderboardIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="18" y="3" width="4" height="18"/><rect x="10" y="8" width="4" height="13"/><rect x="2" y="13" width="4" height="8"/>
  </svg>
)
const ProfileIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

export function BottomNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const links = [
    { href: '/', label: 'Home', icon: <HomeIcon /> },
    { href: '/markets', label: 'Markets', icon: <MarketsIcon /> },
    { href: '/leaderboard', label: 'Ranks', icon: <LeaderboardIcon /> },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-md"
      style={{
        background: 'color-mix(in srgb, var(--bg) 92%, transparent)',
        borderColor: 'var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="max-w-2xl mx-auto flex items-center justify-around px-2 h-16">
        {links.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-5 py-2 rounded-xl transition-all"
              style={{ color: active ? 'var(--primary)' : 'var(--text-muted)' }}
            >
              {icon}
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}

        {/* Profile / Sign in */}
        {session ? (
          <Link
            href="/profile"
            className="flex flex-col items-center gap-0.5 px-5 py-2 rounded-xl transition-all"
            style={{ color: pathname === '/profile' ? 'var(--primary)' : 'var(--text-muted)' }}
          >
            <ProfileIcon />
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        ) : (
          <button
            onClick={() => signIn('google')}
            className="flex flex-col items-center gap-0.5 px-5 py-2 rounded-xl transition-all"
            style={{ color: 'var(--text-muted)' }}
          >
            <ProfileIcon />
            <span className="text-[10px] font-medium">Sign in</span>
          </button>
        )}
      </div>
    </nav>
  )
}
