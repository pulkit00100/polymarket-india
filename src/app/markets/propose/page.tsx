'use client'

import { useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const CATEGORIES = ['politics', 'cricket', 'bollywood', 'tech', 'economy', 'sports']

export default function ProposePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'politics',
    resolve_at: '',
    news_keywords: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!session) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-slate-400 mb-4">Sign in to propose a market.</p>
        <button
          onClick={() => signIn('google')}
          className="px-5 py-2.5 bg-amber-500 text-slate-900 font-semibold rounded-lg text-sm"
        >
          Sign in with Google
        </button>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const keywords = form.news_keywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean)

    const res = await fetch('/api/markets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, news_keywords: keywords }),
    })

    setLoading(false)

    if (!res.ok) {
      const json = await res.json()
      setError(json.error ?? 'Failed to propose market')
      return
    }

    const market = await res.json()
    router.push(`/markets/${market.id}`)
  }

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Propose a Market</h1>
      <p className="text-sm text-slate-400 mb-6">
        Your market will be reviewed by an admin before going live.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Question (yes/no)</label>
          <input
            required
            maxLength={200}
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Will India win the next ICC Cricket World Cup?"
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Description</label>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Additional context or resolution criteria..."
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Category</label>
          <select
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Resolution date</label>
          <input
            required
            type="date"
            value={form.resolve_at}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => update('resolve_at', e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">
            News keywords <span className="text-slate-600">(comma-separated, optional)</span>
          </label>
          <input
            value={form.news_keywords}
            onChange={(e) => update('news_keywords', e.target.value)}
            placeholder="India cricket, ICC World Cup, BCCI"
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        {error && <p className="text-xs text-rose-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting…' : 'Submit for Review'}
        </button>
      </form>
    </div>
  )
}
