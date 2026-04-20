import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { OddsBar } from '@/components/MarketCard'
import { BetForm } from '@/components/BetForm'
import { NewsFeed } from '@/components/NewsFeed'

export const revalidate = 30

interface Props {
  params: Promise<{ id: string }>
}

async function getMarket(id: string) {
  const { data } = await db
    .from('markets')
    .select('*, market_state(*)')
    .eq('id', id)
    .single()
  return data
}

export default async function MarketPage({ params }: Props) {
  const { id } = await params
  const [market, session] = await Promise.all([
    getMarket(id),
    getServerSession(authOptions),
  ])

  if (!market) notFound()

  const yesPrice = market.market_state?.yes_probability ?? 0.5
  const isOpen = market.status === 'open'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <span className="text-xs font-medium text-violet-400 bg-violet-400/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
          {market.category}
        </span>
        <h1 className="text-2xl font-bold text-white mt-2 mb-1">{market.title}</h1>
        <p className="text-slate-400 text-sm">{market.description}</p>
        <p className="text-xs text-slate-500 mt-2 font-mono">
          Resolves {new Date(market.resolve_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: odds + bet form */}
        <div className="md:col-span-2 space-y-4">
          {/* Odds display */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-slate-400">Current probability</span>
              <span className="font-mono text-2xl font-bold text-amber-400">
                {Math.round(yesPrice * 100)}%
              </span>
            </div>
            <OddsBar yesPrice={yesPrice} />
            <div className="flex justify-between mt-2 text-xs font-mono text-slate-400">
              <span className="text-emerald-400">{Math.round(yesPrice * 100)}¢ YES</span>
              <span className="text-rose-400">{Math.round((1 - yesPrice) * 100)}¢ NO</span>
            </div>
          </div>

          {/* Bet form */}
          {isOpen && (
            <BetForm
              marketId={market.id}
              yesPrice={yesPrice}
              userPoints={session?.user.points ?? 0}
            />
          )}

          {market.status === 'resolved' && (
            <div className={`p-4 rounded-xl border text-sm font-semibold ${
              market.outcome
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}>
              Resolved: {market.outcome ? 'YES' : 'NO'}
            </div>
          )}
        </div>

        {/* Right: news feed */}
        <div>
          <h2 className="text-sm font-semibold text-slate-300 mb-3">Related News</h2>
          <NewsFeed marketId={market.id} />
        </div>
      </div>
    </div>
  )
}
