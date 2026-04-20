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

export default async function LeaderboardPage() {
  const users = await getLeaderboard()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Leaderboard</h1>

      <div className="space-y-2">
        {users.map((user: any, i: number) => (
          <div
            key={user.id}
            className="flex items-center gap-4 bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3"
          >
            <span className={`font-mono text-sm w-6 text-center ${
              i === 0 ? 'text-amber-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-orange-400' : 'text-slate-500'
            }`}>
              {i + 1}
            </span>

            {user.image ? (
              <Image
                src={user.image}
                alt={user.name ?? ''}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-400">
                {user.name?.[0] ?? '?'}
              </div>
            )}

            <span className="flex-1 text-sm text-slate-200 truncate">{user.name ?? 'Anonymous'}</span>

            <div className="text-right">
              <p className="font-mono text-sm text-amber-400 font-semibold">
                {user.points?.toLocaleString()} pts
              </p>
              <p className="font-mono text-xs text-violet-400">
                {user.coins?.toLocaleString()} coins
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
