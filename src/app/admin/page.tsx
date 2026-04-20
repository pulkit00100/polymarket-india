import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminMarketRow } from './AdminMarketRow'

export const revalidate = 0

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') redirect('/')

  const { data: pending } = await db
    .from('markets')
    .select('id, title, category, created_at, resolve_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  const { data: open } = await db
    .from('markets')
    .select('id, title, category, resolve_at, outcome')
    .eq('status', 'open')
    .order('resolve_at', { ascending: true })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <h1 className="text-2xl font-bold text-white">Admin Panel</h1>

      {/* Pending markets */}
      <section>
        <h2 className="text-lg font-semibold text-amber-400 mb-3">
          Pending Approval ({pending?.length ?? 0})
        </h2>
        {!pending?.length ? (
          <p className="text-slate-500 text-sm">No markets pending review.</p>
        ) : (
          <div className="space-y-2">
            {pending.map((m: any) => (
              <AdminMarketRow key={m.id} market={m} mode="pending" />
            ))}
          </div>
        )}
      </section>

      {/* Open markets — set outcome */}
      <section>
        <h2 className="text-lg font-semibold text-violet-400 mb-3">
          Open Markets — Set Outcome ({open?.length ?? 0})
        </h2>
        {!open?.length ? (
          <p className="text-slate-500 text-sm">No open markets.</p>
        ) : (
          <div className="space-y-2">
            {open.map((m: any) => (
              <AdminMarketRow key={m.id} market={m} mode="open" />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
