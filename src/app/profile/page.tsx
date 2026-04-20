import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 30

async function getUserBets(userId: string) {
  const { data } = await db
    .from('bets')
    .select('id, position, points_wagered, odds_at_bet, payout, created_at, market_id, markets(id, title, status, outcome, category)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)
  return data ?? []
}

const CATEGORY_COLORS: Record<string, string> = {
  politics: '#f97316',
  sports: '#3b82f6',
  finance: '#22c55e',
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/api/auth/signin')

  const bets = await getUserBets(session.user.id)

  const totalWagered = bets.reduce((sum, b) => sum + b.points_wagered, 0)
  const totalPayout = bets.reduce((sum, b) => sum + (b.payout ?? 0), 0)
  const resolvedBets = bets.filter((b) => b.payout !== null)
  const wonBets = resolvedBets.filter((b) => b.payout! > 0)
  const winRate = resolvedBets.length > 0 ? Math.round((wonBets.length / resolvedBets.length) * 100) : null
  const pnl = totalPayout - totalWagered
  const pnlPositive = pnl >= 0

  const stats = [
    { label: 'Total Bets', value: bets.length.toString(), mono: true },
    { label: 'Win Rate', value: winRate !== null ? `${winRate}%` : '—', mono: true, color: winRate && winRate >= 50 ? 'var(--green)' : winRate ? 'var(--red)' : undefined },
    { label: 'Wagered', value: `${totalWagered.toLocaleString()}`, suffix: 'pts', mono: true },
    { label: 'Net P&L', value: `${pnlPositive ? '+' : ''}${pnl.toLocaleString()}`, suffix: 'pts', mono: true, color: pnlPositive ? 'var(--green)' : 'var(--red)' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

      {/* Hero / identity */}
      <div
        className="rounded-2xl border p-6 mb-6 relative overflow-hidden"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        {/* Decorative gradient blob */}
        <div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'var(--primary)' }}
        />

        <div className="flex items-center gap-5 relative">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name ?? ''}
              width={72}
              height={72}
              className="rounded-full ring-2 ring-amber-400 ring-offset-2"
              style={{ ringOffsetColor: 'var(--bg-card)' } as React.CSSProperties}
            />
          ) : (
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
              style={{ background: 'var(--primary)', color: '#09090b' }}
            >
              {session.user.name?.[0] ?? '?'}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold truncate" style={{ color: 'var(--text)' }}>
              {session.user.name}
            </h1>
            <p className="text-sm truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {session.user.email}
            </p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--primary-dim)', color: 'var(--primary)' }}>
                Predictor
              </span>
              {winRate !== null && winRate >= 60 && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(34,197,94,0.12)', color: 'var(--green)' }}>
                  🔥 Hot streak
                </span>
              )}
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <p className="text-3xl sm:text-4xl font-bold font-mono" style={{ color: 'var(--primary)' }}>
              {session.user.points?.toLocaleString()}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>points</p>
            {session.user.coins && (
              <p className="text-sm font-mono font-semibold mt-1" style={{ color: 'var(--accent)' }}>
                {session.user.coins.toLocaleString()} coins
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {stats.map(({ label, value, suffix, mono, color }) => (
          <div
            key={label}
            className="rounded-2xl border p-4 text-center"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <p
              className={`text-xl sm:text-2xl font-bold ${mono ? 'font-mono' : ''}`}
              style={{ color: color ?? 'var(--text)' }}
            >
              {value}
              {suffix && <span className="text-xs font-normal ml-1" style={{ color: 'var(--text-muted)' }}>{suffix}</span>}
            </p>
            <p className="text-[11px] mt-1 font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* P&L bar — only if resolved bets exist */}
      {resolvedBets.length > 0 && (
        <div
          className="rounded-2xl border p-4 mb-6"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Resolved Performance</p>
            <p
              className="font-mono text-lg font-bold"
              style={{ color: pnlPositive ? 'var(--green)' : 'var(--red)' }}
            >
              {pnlPositive ? '+' : ''}{pnl.toLocaleString()} pts
            </p>
          </div>
          <div className="flex gap-2 text-xs mb-2">
            <span style={{ color: 'var(--text-muted)' }}>{wonBets.length} won</span>
            <span style={{ color: 'var(--text-subtle)' }}>·</span>
            <span style={{ color: 'var(--text-muted)' }}>{resolvedBets.length - wonBets.length} lost</span>
            <span style={{ color: 'var(--text-subtle)' }}>·</span>
            <span style={{ color: 'var(--text-muted)' }}>{bets.length - resolvedBets.length} pending</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden flex" style={{ background: 'var(--bg-elevated)' }}>
            <div
              className="h-full transition-all duration-700"
              style={{
                width: resolvedBets.length > 0 ? `${Math.round((wonBets.length / resolvedBets.length) * 100)}%` : '0%',
                background: 'var(--green)',
                borderRadius: '9999px 0 0 9999px',
              }}
            />
          </div>
        </div>
      )}

      {/* Bet history */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold" style={{ color: 'var(--text)' }}>Bet History</h2>
        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{bets.length} bets</span>
      </div>

      {bets.length === 0 ? (
        <div
          className="rounded-2xl border p-16 text-center"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <p className="text-4xl mb-3">🎯</p>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>No bets yet</p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Browse markets and make your first prediction</p>
          <Link
            href="/markets"
            className="inline-flex text-sm font-semibold px-4 py-2 rounded-xl transition-all"
            style={{ background: 'var(--primary)', color: '#09090b' }}
          >
            Browse Markets →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {bets.map((bet: any) => {
            const market = bet.markets
            const isResolved = bet.payout !== null
            const won = isResolved && bet.payout > 0
            const pnl = isResolved ? bet.payout - bet.points_wagered : null
            const catColor = CATEGORY_COLORS[market?.category] ?? 'var(--accent)'

            return (
              <Link key={bet.id} href={`/markets/${bet.market_id}`} className="block group">
                <div
                  className="rounded-2xl border px-4 py-3.5 transition-colors flex items-center gap-3"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border)',
                  }}
                >
                  {/* Position badge */}
                  <span
                    className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg flex-shrink-0"
                    style={{
                      background: bet.position === 'yes' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                      color: bet.position === 'yes' ? 'var(--green)' : 'var(--red)',
                    }}
                  >
                    {bet.position.toUpperCase()}
                  </span>

                  {/* Category dot */}
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: catColor }} />

                  {/* Market title */}
                  <p className="flex-1 text-sm truncate font-medium" style={{ color: 'var(--text)' }}>
                    {market?.title ?? 'Unknown market'}
                  </p>

                  {/* Right side */}
                  <div className="text-right flex-shrink-0 space-y-0.5">
                    <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                      {bet.points_wagered} pts · {Math.round(bet.odds_at_bet * 100)}¢
                    </p>
                    {isResolved ? (
                      <p className="font-mono text-sm font-bold" style={{ color: won ? 'var(--green)' : 'var(--red)' }}>
                        {pnl! >= 0 ? '+' : ''}{pnl!.toLocaleString()} pts
                      </p>
                    ) : (
                      <p className="text-[11px] font-mono px-2 py-0.5 rounded-md inline-block" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                        pending
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
