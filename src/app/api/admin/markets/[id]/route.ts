import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// PATCH /api/admin/markets/:id — approve, reject, or set outcome
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { action, outcome } = await req.json()

  if (action === 'approve') {
    const { error } = await db
      .from('markets')
      .update({ status: 'open' })
      .eq('id', params.id)
      .eq('status', 'pending')

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ status: 'approved' })
  }

  if (action === 'reject') {
    const { error } = await db
      .from('markets')
      .update({ status: 'closed' })
      .eq('id', params.id)
      .eq('status', 'pending')

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ status: 'rejected' })
  }

  if (action === 'set_outcome' && typeof outcome === 'boolean') {
    const { error } = await db
      .from('markets')
      .update({ outcome })
      .eq('id', params.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ status: 'outcome_set', outcome })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
