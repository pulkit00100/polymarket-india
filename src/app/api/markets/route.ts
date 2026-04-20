import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const status = searchParams.get('status') ?? 'open'

  let query = db
    .from('markets')
    .select('*, market_state(yes_probability)')
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (category) query = query.eq('category', category)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, description, category, resolve_at, news_keywords } = body

  if (!title || !description || !category || !resolve_at) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (new Date(resolve_at) <= new Date()) {
    return NextResponse.json({ error: 'resolve_at must be in the future' }, { status: 400 })
  }

  const { data: market, error } = await db
    .from('markets')
    .insert({
      title,
      description,
      category,
      resolve_at,
      news_keywords: news_keywords ?? [],
      created_by: session.user.id,
      status: 'pending',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await db.from('market_state').insert({
    market_id: market.id,
    q_yes: 0,
    q_no: 0,
    b: 100,
    yes_probability: 0.5,
  })

  return NextResponse.json(market, { status: 201 })
}
