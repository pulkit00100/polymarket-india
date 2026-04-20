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

const CATEGORY_COLORS: Record<string, string> = {
  politics: '#f97316',
  sports: '#3b82f6',
  finance: '#22c55e',
}

export default async function MarketPage({ params }: Props) {
  const { id } = await params
  const [market, session] = await Promise.all([
    getMarket(id),
    getServerSession(authOptions),
  ])

  if (!market) notFound()

  const yesPrice = market.market_state?.yes_probability ?? 0.5
  const pct = Math.round(yesPrice * 100)
  const isOpen = market.status === 'open'
  const positive = yesPrice >= 0.5
  const catColor = CATEGORY_COLORS[market.category] ?? 'var(--accent)'

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-5">
        <span
          className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ color: catColor, background: `${catColor}18` }}
        >
          {market.category}
        </span>
        <h1 className="text-xl font-bold mt-2 mb-2 leading-snug" style={{ color: 'var(--text)' }}>
          {market.title}
        </h1>
        <p className="text-sm leading-relaxed mb-1" style={{ color: 'var(--text-muted)' }}>
          {market.description}
        </p>
        <p className="text-xs font-mono" style={{ color: 'var(--text-subtle)' }}>
          Resolves {new Date(market.resolve_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}
        </p>
      </div>

      {/* Probability card */}
      <div className="rounded-2xl p-5 mb-4 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Current probability</p>
            <p className="text-4xl font-bold font-mono" style={{ color: positive ? 'var(--green)' : 'var(--red)' }}>
              {pct}%
            </p>
          </div>
          <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>YES</p>
        </div>
        <OddsBar yesPrice={yesPrice} />
        <div className="flex justify-between mt-2 text-xs font-mono">
          <span style={{ color: 'var(--green)' }}>{pct}¢ YES</span>
          <span style={{ color: 'var(--red)' }}>{100 - pct}¢ NO</span>
        </div>
      </div>

      {/* Resolved banner */}
      {market.status === 'resolved' && (
        <div
          className="p-4 rounded-2xl border text-sm font-semibold mb-4"
          style={{
            background: market.outcome ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            borderColor: market.outcome ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
            color: market.outcome ? 'var(--green)' : 'var(--red)',
          }}
        >
          Resolved: {market.outcome ? '✓ YES' : '✗ NO'}
        </div>
      )}

      {/* Bet form */}
      {isOpen && (
        <div className="mb-6">
          <BetForm marketId={market.id} yesPrice={yesPrice} userPoints={session?.user.points ?? 0} />
        </div>
      )}

      {/* News */}
      <div>
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>Related News</h2>
        <NewsFeed marketId={market.id} />
      </div>
    </div>
  )
}
