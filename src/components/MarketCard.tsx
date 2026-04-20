'use client'

import Link from 'next/link'

interface MarketCardProps {
  id: string
  title: string
  category: string
  yesPrice: number
  endDate: string
  status: string
}

// Deterministic fake sparkline from market id + yesPrice
function generateSparkPoints(seed: string, endValue: number): number[] {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = Math.imul(31, h) + seed.charCodeAt(i) | 0
  const rand = (n: number) => { h = Math.imul(h ^ (h >>> 16), 0x45d9f3b); return ((h >>> 0) % n) / n }
  const points = [0.5]
  for (let i = 1; i < 8; i++) {
    const delta = (rand(40) - 0.2) * 0.12
    points.push(Math.min(0.95, Math.max(0.05, points[i - 1] + delta)))
  }
  points.push(endValue)
  return points
}

function Sparkline({ seed, value, positive }: { seed: string; value: number; positive: boolean }) {
  const pts = generateSparkPoints(seed, value)
  const w = 80, h = 32
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * w)
  const ys = pts.map(p => h - p * h)
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ')
  const color = positive ? 'var(--green)' : 'var(--red)'
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={`g-${seed.slice(0,8)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path
        d={`${d} L${w},${h} L0,${h} Z`}
        fill={`url(#g-${seed.slice(0,8)})`}
      />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

const CATEGORY_COLORS: Record<string, string> = {
  politics: '#f97316',
  sports: '#3b82f6',
  finance: '#22c55e',
}

export function MarketCard({ id, title, category, yesPrice, endDate, status }: MarketCardProps) {
  const pct = Math.round(yesPrice * 100)
  const daysLeft = Math.ceil((new Date(endDate).getTime() - Date.now()) / 86_400_000)
  const positive = yesPrice >= 0.5
  const catColor = CATEGORY_COLORS[category] ?? 'var(--accent)'

  return (
    <Link href={`/markets/${id}`} className="block active:scale-[0.98] transition-transform duration-100">
      <div
        className="rounded-2xl p-4 border"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        {/* Top row */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ color: catColor, background: `${catColor}18` }}
          >
            {category}
          </span>
          {daysLeft >= 0 && (
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {daysLeft === 0 ? 'Today' : `${daysLeft}d left`}
            </span>
          )}
        </div>

        {/* Title */}
        <p className="text-sm font-medium leading-snug line-clamp-2 mb-4" style={{ color: 'var(--text)' }}>
          {title}
        </p>

        {/* Sparkline + probability */}
        <div className="flex items-end justify-between gap-3">
          <Sparkline seed={id} value={yesPrice} positive={positive} />
          <div className="text-right flex-shrink-0">
            <p
              className="text-2xl font-bold font-mono leading-none"
              style={{ color: positive ? 'var(--green)' : 'var(--red)' }}
            >
              {pct}%
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>YES chance</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: positive ? 'var(--green)' : 'var(--red)' }}
          />
        </div>
      </div>
    </Link>
  )
}

// Re-export for market detail page
export function OddsBar({ yesPrice }: { yesPrice: number }) {
  const pct = Math.round(yesPrice * 100)
  const positive = yesPrice >= 0.5
  return (
    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: positive ? 'var(--green)' : 'var(--red)' }}
      />
    </div>
  )
}
