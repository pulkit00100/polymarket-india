'use client'

interface PriceChartProps {
  marketId: string
  currentPrice: number
}

function seededRng(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = Math.imul(31, h) + seed.charCodeAt(i) | 0
  return () => {
    h ^= h >>> 16
    h = Math.imul(h, 0x45d9f3b)
    h ^= h >>> 16
    return (h >>> 0) / 0xffffffff
  }
}

function generateHistory(id: string, endValue: number, points = 30): number[] {
  const rand = seededRng(id)
  const start = 0.4 + rand() * 0.2
  const arr = [start]
  for (let i = 1; i < points - 1; i++) {
    const prev = arr[i - 1]
    const drift = (endValue - prev) / (points - i) * 0.6
    const noise = (rand() - 0.45) * 0.06
    arr.push(Math.min(0.97, Math.max(0.03, prev + drift + noise)))
  }
  arr.push(endValue)
  return arr
}

export function PriceChart({ marketId, currentPrice }: PriceChartProps) {
  const data = generateHistory(marketId, currentPrice)
  const W = 600, H = 200, PAD = { top: 16, right: 16, bottom: 32, left: 40 }
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom

  const toX = (i: number) => PAD.left + (i / (data.length - 1)) * innerW
  const toY = (v: number) => PAD.top + (1 - v) * innerH

  const linePath = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L${toX(data.length - 1).toFixed(1)},${(PAD.top + innerH).toFixed(1)} L${PAD.left},${(PAD.top + innerH).toFixed(1)} Z`

  const isUp = currentPrice >= 0.5
  const color = isUp ? '#22c55e' : '#ef4444'
  const pct = Math.round(currentPrice * 100)

  // Y-axis ticks
  const yTicks = [0, 25, 50, 75, 100]
  // X-axis labels
  const xLabels = ['30d ago', '20d ago', '10d ago', 'Today']

  return (
    <div className="w-full rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Price History</p>
          <p className="text-2xl font-bold font-mono mt-0.5" style={{ color }}>
            {pct}% <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>YES</span>
          </p>
        </div>
        <div
          className="text-xs font-semibold px-3 py-1 rounded-full font-mono"
          style={{ background: isUp ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', color }}
        >
          {isUp ? '▲' : '▼'} {Math.abs(Math.round((currentPrice - 0.5) * 100))}pp from 50%
        </div>
      </div>

      {/* SVG Chart */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: '180px' }}
        aria-label={`Price chart showing ${pct}% YES probability`}
      >
        <defs>
          <linearGradient id={`area-${marketId.slice(0, 8)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map(tick => {
          const y = toY(tick / 100)
          return (
            <g key={tick}>
              <line
                x1={PAD.left} y1={y} x2={PAD.left + innerW} y2={y}
                stroke="var(--border)" strokeWidth="1" strokeDasharray={tick === 50 ? '4 3' : '0'}
              />
              <text
                x={PAD.left - 6} y={y + 4}
                textAnchor="end" fontSize="10"
                fill="var(--text-subtle)"
              >
                {tick}%
              </text>
            </g>
          )
        })}

        {/* X labels */}
        {xLabels.map((label, i) => {
          const x = toX(Math.round((i / (xLabels.length - 1)) * (data.length - 1)))
          return (
            <text
              key={label}
              x={x} y={H - 6}
              textAnchor="middle" fontSize="9"
              fill="var(--text-subtle)"
            >
              {label}
            </text>
          )
        })}

        {/* Area fill */}
        <path d={areaPath} fill={`url(#area-${marketId.slice(0, 8)})`} />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Current price dot */}
        <circle
          cx={toX(data.length - 1)}
          cy={toY(currentPrice)}
          r="4"
          fill={color}
          stroke="var(--bg-card)"
          strokeWidth="2"
        />
      </svg>
    </div>
  )
}
