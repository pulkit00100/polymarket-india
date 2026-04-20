'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  market: { id: string; title: string; category: string; resolve_at: string; outcome?: boolean | null }
  mode: 'pending' | 'open'
}

export function AdminMarketRow({ market, mode }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function dispatch(action: string, outcome?: boolean) {
    setLoading(true)
    await fetch(`/api/admin/markets/${market.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...(outcome !== undefined ? { outcome } : {}) }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-4 bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-200 truncate">{market.title}</p>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          {market.category} · resolves {new Date(market.resolve_at).toLocaleDateString()}
        </p>
      </div>

      {mode === 'pending' && (
        <div className="flex gap-2">
          <button
            disabled={loading}
            onClick={() => dispatch('approve')}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg disabled:opacity-50"
          >
            Approve
          </button>
          <button
            disabled={loading}
            onClick={() => dispatch('reject')}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      )}

      {mode === 'open' && (
        <div className="flex gap-2">
          <button
            disabled={loading}
            onClick={() => dispatch('set_outcome', true)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg disabled:opacity-50"
          >
            YES
          </button>
          <button
            disabled={loading}
            onClick={() => dispatch('set_outcome', false)}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg disabled:opacity-50"
          >
            NO
          </button>
        </div>
      )}
    </div>
  )
}
