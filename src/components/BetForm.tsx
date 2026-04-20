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

export function BetForm({ marketId, yesPrice, userPoints, onSuccess }: BetFormProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [position, setPosition] = useState<'yes' | 'no'>('yes')
  const [points, setPoints] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const price = position === 'yes' ? yesPrice : 1 - yesPrice
  const estimatedShares = points ? (parseFloat(points) / price).toFixed(2) : '—'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!session) { router.push('/api/auth/signin'); return }

    const amount = parseInt(points, 10)
    if (isNaN(amount) || amount < 10) { setError('Minimum bet is 10 points'); return }
    if (amount > userPoints) { setError('Not enough points'); return }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/markets/${marketId}/bet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position, points: amount }),
      })

      if (!res.ok) {
        const json = await res.json()
        setError(json.error ?? 'Bet failed')
        return
      }

      setPoints('')
      onSuccess?.()
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-semibold text-slate-200">Place a bet</h3>

      {/* Position selector */}
      <div className="grid grid-cols-2 gap-2">
        {(['yes', 'no'] as const).map((pos) => {
          const p = pos === 'yes' ? yesPrice : 1 - yesPrice
          return (
            <button
              key={pos}
              type="button"
              onClick={() => setPosition(pos)}
              className={`py-2.5 rounded-lg text-sm font-semibold font-mono transition-all ${
                position === pos
                  ? pos === 'yes'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-rose-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {pos.toUpperCase()} · {Math.round(p * 100)}¢
            </button>
          )
        })}
      </div>

      {/* Amount input */}
      <div>
        <label className="text-xs text-slate-400 mb-1 block">Points to wager</label>
        <input
          type="number"
          min={10}
          max={userPoints}
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          placeholder="Min 10"
          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-sm font-mono text-slate-100 focus:outline-none focus:border-amber-500"
        />
        <p className="text-xs text-slate-500 mt-1">
          Balance: <span className="font-mono text-amber-400">{userPoints.toLocaleString()} pts</span>
          {' · '}Est. shares: <span className="font-mono">{estimatedShares}</span>
        </p>
      </div>

      {error && <p className="text-xs text-rose-400">{error}</p>}

      <button
        type="submit"
        disabled={loading || !points}
        className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Placing…' : `Bet ${points || '—'} pts on ${position.toUpperCase()}`}
      </button>
    </form>
  )
}
