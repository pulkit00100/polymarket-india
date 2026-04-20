'use client'

import Link from 'next/link'

interface MarketCardProps {
  id: string
  title: string
  category: string
  yesPrice: number // 0-1
  endDate: string
  status: string
}

export function MarketCard({ id, title, category, yesPrice, endDate, status }: MarketCardProps) {
  const pct = Math.round(yesPrice * 100)
  const daysLeft = Math.ceil((new Date(endDate).getTime() - Date.now()) / 86_400_000)

  return (
    <Link href={`/markets/${id}`} className="block group">
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 hover:border-amber-500/50 hover:bg-slate-800 transition-all duration-200">
        <div className="flex items-start justify-between gap-3 mb-4">
          <span className="text-xs font-medium text-violet-400 bg-violet-400/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
            {category}
          </span>
          {status === 'open' && daysLeft >= 0 && (
            <span className="text-xs text-slate-400">{daysLeft}d left</span>
          )}
        </div>

        <h3 className="text-sm font-medium text-slate-100 leading-snug mb-4 line-clamp-2 group-hover:text-white">
          {title}
        </h3>

        <OddsBar yesPrice={yesPrice} />

        <div className="flex justify-between mt-3 text-xs font-mono text-slate-400">
          <span className="text-emerald-400">{pct}¢ YES</span>
          <span className="text-rose-400">{100 - pct}¢ NO</span>
        </div>
      </div>
    </Link>
  )
}

interface OddsBarProps {
  yesPrice: number
}

export function OddsBar({ yesPrice }: OddsBarProps) {
  const pct = Math.round(yesPrice * 100)
  return (
    <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
