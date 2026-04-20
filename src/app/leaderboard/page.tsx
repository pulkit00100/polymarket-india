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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text)' }}>Leaderboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Top predictors this season</p>
      </div>

      {/* Two column on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top 3 podium on desktop — full width */}
        {users.length > 0 && (
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
            {users.slice(0, 3).map((user: any, i: number) => (
              <div
                key={user.id}
                className="rounded-2xl p-5 border text-center"
                style={{
                  background: i === 0 ? 'linear-gradient(135deg, rgba(245,158,11,0.15), var(--bg-elevated))' : 'var(--bg-elevated)',
                  borderColor: i === 0 ? 'rgba(245,158,11,0.4)' : 'var(--border)',
                  order: i === 1 ? 2 : i === 0 ? 1 : 3,
                }}
              >
                <div className="text-3xl mb-2">{MEDAL[i]}</div>
                {user.image ? (
                  <Image src={user.image} alt={user.name ?? ''} width={48} height={48} className="rounded-full mx-auto mb-2" />
                ) : (
                  <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-bold" style={{ background: 'var(--primary)', color: '#09090b' }}>
                    {user.name?.[0] ?? '?'}
                  </div>
                )}
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{user.name ?? 'Anonymous'}</p>
                <p className="font-mono text-lg font-bold mt-1" style={{ color: 'var(--primary)' }}>{user.points?.toLocaleString()}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>pts</p>
              </div>
            ))}
          </div>
        )}

        {/* Rest of the list */}
        {users.length === 0 ? (
          <div className="lg:col-span-2 rounded-2xl p-12 text-center border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No users yet. Sign in and start predicting!</p>
          </div>
        ) : (
          users.slice(3).map((user: any, i: number) => (
            <div
              key={user.id}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 border"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <span className="w-7 text-center font-mono text-sm" style={{ color: 'var(--text-muted)' }}>{i + 4}</span>
              {user.image ? (
                <Image src={user.image} alt={user.name ?? ''} width={36} height={36} className="rounded-full" />
              ) : (
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: 'var(--bg-elevated)', color: 'var(--text)' }}>
                  {user.name?.[0] ?? '?'}
                </div>
              )}
              <span className="flex-1 text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{user.name ?? 'Anonymous'}</span>
              <div className="text-right">
                <p className="font-mono text-sm font-bold" style={{ color: 'var(--primary)' }}>{user.points?.toLocaleString()} pts</p>
                <p className="font-mono text-xs" style={{ color: 'var(--accent)' }}>{user.coins?.toLocaleString()} coins</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
