'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface BetFormProps {
  marketId: string
  yesPrice: number
  userPoints: number
  onSuccess?: () => void
}

const QUICK_AMOUNTS = [50, 100, 250, 500]

export function BetForm({ marketId, yesPrice, userPoints, onSuccess }: BetFormProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [position, setPosition] = useState<'yes' | 'no'>('yes')
  const [points, setPoints] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const price = position === 'yes' ? yesPrice : 1 - yesPrice
  const amount = parseFloat(points) || 0
  const estimatedShares = amount > 0 ? (amount / price).toFixed(1) : '—'
  const potentialPayout = amount > 0 ? (amount / price).toFixed(0) : '—'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!session) { router.push('/api/auth/signin'); return }

    const amt = parseInt(points, 10)
    if (isNaN(amt) || amt < 10) { setError('Minimum bet is 10 points'); return }
    if (amt > userPoints) { setError('Not enough points'); return }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/markets/${marketId}/bet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position, points: amt }),
      })

      if (!res.ok) {
        const json = await res.json()
        setError(json.error ?? 'Bet failed')
        return
      }

      setSuccess(true)
      setPoints('')
      setTimeout(() => setSuccess(false), 2000)
      onSuccess?.()
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Place a Bet</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Balance: <span className="font-mono font-semibold" style={{ color: 'var(--primary)' }}>{userPoints.toLocaleString()} pts</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {/* YES / NO toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl" style={{ background: 'var(--bg-elevated)' }}>
          {(['yes', 'no'] as const).map((pos) => {
            const p = pos === 'yes' ? yesPrice : 1 - yesPrice
            const active = position === pos
            const col = pos === 'yes' ? 'var(--green)' : 'var(--red)'
            return (
              <button
                key={pos}
                type="button"
                onClick={() => setPosition(pos)}
                className="py-3 rounded-lg text-sm font-bold transition-all"
                style={{
                  background: active ? col : 'transparent',
                  color: active ? '#fff' : 'var(--text-muted)',
                  boxShadow: active ? '0 2px 8px rgba(0,0,0,0.25)' : 'none',
                }}
              >
                {pos.toUpperCase()}
                <span className="ml-1.5 text-xs font-mono opacity-80">{Math.round(p * 100)}¢</span>
              </button>
            )
          })}
        </div>

        {/* Quick amounts */}
        <div>
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Quick select</p>
          <div className="grid grid-cols-4 gap-2">
            {QUICK_AMOUNTS.map(q => (
              <button
                key={q}
                type="button"
                onClick={() => setPoints(String(q))}
                className="py-1.5 rounded-lg text-xs font-mono font-medium transition-colors"
                style={{
                  background: points === String(q) ? 'var(--primary-dim)' : 'var(--bg-elevated)',
                  color: points === String(q) ? 'var(--primary)' : 'var(--text-muted)',
                  border: `1px solid ${points === String(q) ? 'var(--primary)' : 'var(--border)'}`,
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Amount input */}
        <div>
          <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>Or enter amount</p>
          <input
            type="number"
            inputMode="numeric"
            min={10}
            max={userPoints}
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            placeholder="Min 10 pts"
            className="w-full rounded-xl px-4 py-3 text-sm font-mono transition-colors focus:outline-none"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          />
        </div>

        {/* Payout estimate */}
        {amount > 0 && (
          <div className="rounded-xl p-3 space-y-1.5" style={{ background: 'var(--bg-elevated)' }}>
            <div className="flex justify-between text-xs">
              <span style={{ color: 'var(--text-muted)' }}>Est. shares</span>
              <span className="font-mono" style={{ color: 'var(--text)' }}>{estimatedShares}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: 'var(--text-muted)' }}>If {position.toUpperCase()} wins</span>
              <span className="font-mono font-semibold" style={{ color: position === 'yes' ? 'var(--green)' : 'var(--red)' }}>
                +{potentialPayout} pts
              </span>
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red)' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !points || success}
          className="w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-50"
          style={{
            background: success ? 'var(--green)' : 'var(--primary)',
            color: '#09090b',
          }}
        >
          {success ? '✓ Bet placed!' : loading ? 'Placing…' : `Bet ${amount > 0 ? `${amount} pts` : '—'} on ${position.toUpperCase()}`}
        </button>
      </form>
    </div>
  )
}
