import { db } from '@/lib/db'
import { MarketCard } from '@/components/MarketCard'
import Link from 'next/link'

export const revalidate = 60

async function getFeaturedMarkets() {
  const { data } = await db
    .from('markets')
    .select('id, title, category, resolve_at, status, market_state(yes_probability)')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(12)
  return data ?? []
}

export default async function HomePage() {
  const markets = await getFeaturedMarkets()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--primary)' }}>
          India&apos;s first prediction market
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-3" style={{ color: 'var(--text)' }}>
          Predict the future,<br className="hidden sm:block" /> earn real rewards.
        </h1>
        <p className="text-sm sm:text-base leading-relaxed mb-6 max-w-lg" style={{ color: 'var(--text-muted)' }}>
          Bet virtual coins on real-world events. Best predictions climb the leaderboard.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/markets/propose"
            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all active:scale-95 hover:opacity-90"
            style={{ background: 'var(--primary)', color: '#09090b' }}
          >
            + Propose a market
          </Link>
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:opacity-80"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text)', border: '1px solid var(--border)' }}
          >
            Leaderboard →
          </Link>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 mb-10">
        {[
          { label: 'Open Markets', value: markets.length.toString() },
          { label: 'Avg Pool', value: '₹10k' },
          { label: 'Active Users', value: '—' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 text-center border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <p className="text-xl sm:text-2xl font-bold font-mono" style={{ color: 'var(--primary)' }}>{s.value}</p>
            <p className="text-[10px] sm:text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Markets grid */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-semibold" style={{ color: 'var(--text)' }}>Open Markets</h2>
        <Link href="/markets" className="text-xs sm:text-sm font-medium" style={{ color: 'var(--primary)' }}>See all →</Link>
      </div>

      {markets.length === 0 ? (
        <div className="rounded-2xl p-12 text-center border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No open markets yet.</p>
          <Link href="/markets/propose" className="text-sm font-semibold mt-2 block" style={{ color: 'var(--primary)' }}>
            Be the first to propose one →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {markets.map((m: any) => (
            <MarketCard
              key={m.id}
              id={m.id}
              title={m.title}
              category={m.category}
              yesPrice={m.market_state?.yes_probability ?? 0.5}
              endDate={m.resolve_at}
              status={m.status}
            />
          ))}
        </div>
      )}
    </div>
  )
}
