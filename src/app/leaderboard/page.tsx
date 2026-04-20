import { db } from '@/lib/db'
import Image from 'next/image'

export const revalidate = 120

async function getLeaderboard() {
  const { data } = await db
    .from('users')
    .select('id, name, image, points, coins')
    .order('points', { ascending: false })
    .limit(50)
  return data ?? []
}

const MEDAL = ['🥇', '🥈', '🥉']

export default async function LeaderboardPage() {
  const users = await getLeaderboard()

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>Leaderboard</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Top predictors this season</p>

      {users.length === 0 ? (
        <div className="rounded-2xl p-8 text-center border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No users yet. Sign in and start predicting!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((user: any, i: number) => (
            <div
              key={user.id}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 border transition-colors"
              style={{
                background: i < 3 ? 'var(--bg-elevated)' : 'var(--bg-card)',
                borderColor: i === 0 ? 'rgba(245,158,11,0.3)' : 'var(--border)',
              }}
            >
              <span className="w-7 text-center text-base">
                {i < 3 ? MEDAL[i] : <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{i + 1}</span>}
              </span>

              {user.image ? (
                <Image src={user.image} alt={user.name ?? ''} width={36} height={36} className="rounded-full" />
              ) : (
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: 'var(--primary)', color: '#09090b' }}>
                  {user.name?.[0] ?? '?'}
                </div>
              )}

              <span className="flex-1 text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                {user.name ?? 'Anonymous'}
              </span>

              <div className="text-right">
                <p className="font-mono text-sm font-bold" style={{ color: 'var(--primary)' }}>
                  {user.points?.toLocaleString()} pts
                </p>
                <p className="font-mono text-xs" style={{ color: 'var(--accent)' }}>
                  {user.coins?.toLocaleString()} coins
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
