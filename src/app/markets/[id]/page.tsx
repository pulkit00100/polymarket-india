import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { BetForm } from '@/components/BetForm'
import { NewsFeed } from '@/components/NewsFeed'
import { PriceChart } from '@/components/PriceChart'

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
  const daysLeft = Math.ceil((new Date(market.resolve_at).getTime() - Date.now()) / 86_400_000)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ color: catColor, background: `${catColor}18` }}
          >
            {market.category}
          </span>
          {daysLeft >= 0 && (
            <span className="text-[11px] px-2.5 py-1 rounded-full font-mono" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
              {daysLeft === 0 ? 'Resolves today' : `${daysLeft} days left`}
            </span>
          )}
          {market.status === 'resolved' && (
            <span
              className="text-[11px] px-2.5 py-1 rounded-full font-semibold"
              style={{
                background: market.outcome ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                color: market.outcome ? 'var(--green)' : 'var(--red)',
              }}
            >
              Resolved {market.outcome ? '✓ YES' : '✗ NO'}
            </span>
          )}
        </div>
        <h1 className="text-xl sm:text-2xl font-bold leading-snug mb-2" style={{ color: 'var(--text)' }}>
          {market.title}
        </h1>
        <p className="text-sm leading-relaxed max-w-2xl" style={{ color: 'var(--text-muted)' }}>
          {market.description}
        </p>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left 2/3 */}
        <div className="lg:col-span-2 space-y-5">

          {/* Price chart */}
          <PriceChart marketId={market.id} currentPrice={yesPrice} />

          {/* Quick stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'YES', value: `${pct}¢`, color: positive ? 'var(--green)' : undefined },
              { label: 'NO', value: `${100 - pct}¢`, color: !positive ? 'var(--red)' : undefined },
              { label: 'Resolves', value: new Date(market.resolve_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-3 border text-center" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <p className="text-lg font-bold font-mono" style={{ color: s.color ?? 'var(--text)' }}>{s.value}</p>
                <p className="text-[10px] mt-0.5 font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Bet form */}
          {isOpen && (
            <BetForm marketId={market.id} yesPrice={yesPrice} userPoints={session?.user.points ?? 0} />
          )}

          {!session && isOpen && (
            <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              <a href="/api/auth/signin" style={{ color: 'var(--primary)' }}>Sign in</a> to place a bet
            </p>
          )}
        </div>

        {/* Right 1/3 */}
        <div className="space-y-5">
          {/* Market info card */}
          <div className="rounded-2xl border p-4 space-y-3" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Market Info</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Status</span>
                <span className="font-medium capitalize" style={{ color: 'var(--text)' }}>{market.status}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Category</span>
                <span className="font-medium capitalize" style={{ color: catColor }}>{market.category}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Resolves</span>
                <span className="font-medium font-mono text-xs" style={{ color: 'var(--text)' }}>
                  {new Date(market.resolve_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                </span>
              </div>
            </div>

            {/* Probability bar */}
            <div className="pt-2">
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span style={{ color: 'var(--green)' }}>YES {pct}%</span>
                <span style={{ color: 'var(--red)' }}>NO {100 - pct}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: positive ? 'var(--green)' : 'var(--red)' }}
                />
              </div>
            </div>
          </div>

          {/* News feed */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Related News</p>
            <NewsFeed marketId={market.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
