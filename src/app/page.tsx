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
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-3">
          Predict the <span className="text-amber-400">future.</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          India&apos;s first prediction market. Bet virtual coins on real-world events and climb the leaderboard.
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <Link
            href="/markets/propose"
            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg text-sm transition-colors"
          >
            Propose a Market
          </Link>
          <Link
            href="/leaderboard"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-sm transition-colors"
          >
            Leaderboard
          </Link>
        </div>
      </div>

      {/* Markets grid */}
      <h2 className="text-lg font-semibold text-slate-200 mb-4">Open Markets</h2>
      {markets.length === 0 ? (
        <p className="text-slate-500 text-sm">No open markets yet. Be the first to propose one!</p>
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
