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
    .select('id, position, points_wagered, odds_at_bet, payout, created_at, market_id, markets(id, title, status, outcome)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)
  return data ?? []
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* User card */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 mb-8 flex items-center gap-5">
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name ?? ''}
            width={56}
            height={56}
            className="rounded-full"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center text-xl text-slate-300">
            {session.user.name?.[0] ?? '?'}
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">{session.user.name}</h1>
          <p className="text-xs text-slate-400">{session.user.email}</p>
        </div>
        <div className="text-right space-y-1">
          <p className="font-mono text-xl font-bold text-amber-400">
            {session.user.points?.toLocaleString()} <span className="text-sm font-normal text-slate-400">pts</span>
          </p>
          <p className="font-mono text-sm text-violet-400">
            {session.user.coins?.toLocaleString()} <span className="text-xs font-normal text-slate-500">coins</span>
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Bets', value: bets.length },
          { label: 'Points Wagered', value: totalWagered.toLocaleString() },
          { label: 'Win Rate', value: winRate !== null ? `${winRate}%` : '—' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 text-center">
            <p className="font-mono text-xl font-semibold text-white">{value}</p>
            <p className="text-xs text-slate-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* P&L */}
      {resolvedBets.length > 0 && (
        <div className={`rounded-xl border px-5 py-3 mb-8 flex items-center justify-between text-sm ${
          totalPayout >= totalWagered
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : 'bg-rose-500/10 border-rose-500/30'
        }`}>
          <span className="text-slate-300">Resolved P&amp;L</span>
          <span className={`font-mono font-bold text-lg ${totalPayout >= totalWagered ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalPayout >= totalWagered ? '+' : ''}{(totalPayout - totalWagered).toLocaleString()} pts
          </span>
        </div>
      )}

      {/* Bet history */}
      <h2 className="text-sm font-semibold text-slate-300 mb-3">Bet History</h2>

      {bets.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="mb-3">No bets yet.</p>
          <Link href="/" className="text-amber-400 hover:text-amber-300 text-sm">Browse markets →</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {bets.map((bet: any) => {
            const market = bet.markets
            const isResolved = bet.payout !== null
            const won = isResolved && bet.payout > 0
            const pnl = isResolved ? bet.payout - bet.points_wagered : null

            return (
              <Link key={bet.id} href={`/markets/${bet.market_id}`} className="block group">
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 hover:border-amber-500/40 transition-colors flex items-center gap-4">
                  {/* Position badge */}
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                    bet.position === 'yes'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {bet.position.toUpperCase()}
                  </span>

                  {/* Market title */}
                  <p className="flex-1 text-sm text-slate-200 truncate group-hover:text-white">
                    {market?.title ?? 'Unknown market'}
                  </p>

                  {/* Wagered + odds */}
                  <div className="text-right shrink-0">
                    <p className="font-mono text-xs text-slate-400">
                      {bet.points_wagered} pts · {Math.round(bet.odds_at_bet * 100)}¢
                    </p>
                    {isResolved ? (
                      <p className={`font-mono text-sm font-semibold ${won ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {pnl! >= 0 ? '+' : ''}{pnl!.toLocaleString()} pts
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500 font-mono">pending</p>
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
