import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data, error } = await db
    .from('markets')
    .select('*, market_state(*), users!created_by(name)')
    .eq('id', id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Market not found' }, { status: 404 })

  return NextResponse.json(data)
}
