import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { probability, sharesForCost } from '@/lib/lmsr'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { position, points_wagered } = await req.json()

  if (!['yes', 'no'].includes(position)) {
    return NextResponse.json({ error: 'position must be yes or no' }, { status: 400 })
  }
  if (!points_wagered || points_wagered < 10) {
    return NextResponse.json({ error: 'Minimum bet is 10 points' }, { status: 400 })
  }

  const { data: market } = await db
    .from('markets')
    .select('status')
    .eq('id', params.id)
    .single()

  if (!market || market.status !== 'open') {
    return NextResponse.json({ error: 'Market is not open for betting' }, { status: 400 })
  }

  const { data: state } = await db
    .from('market_state')
    .select('*')
    .eq('market_id', params.id)
    .single()

  if (!state) return NextResponse.json({ error: 'Market state not found' }, { status: 500 })

  const { data: user } = await db
    .from('users')
    .select('points')
    .eq('id', session.user.id)
    .single()

  if (!user || user.points < points_wagered) {
    return NextResponse.json({ error: 'Insufficient points' }, { status: 400 })
  }

  const oddsAtBet = probability(state.q_yes, state.q_no, state.b)
  const shares = sharesForCost(state.q_yes, state.q_no, state.b, position, points_wagered)

  const newQYes = position === 'yes' ? state.q_yes + shares : state.q_yes
  const newQNo = position === 'no' ? state.q_no + shares : state.q_no
  const newProbability = probability(newQYes, newQNo, state.b)

  await db
    .from('users')
    .update({ points: user.points - points_wagered })
    .eq('id', session.user.id)

  await db
    .from('market_state')
    .update({ q_yes: newQYes, q_no: newQNo, yes_probability: newProbability, updated_at: new Date().toISOString() })
    .eq('market_id', params.id)

  const { data: bet } = await db
    .from('bets')
    .insert({
      user_id: session.user.id,
      market_id: params.id,
      position,
      points_wagered,
      odds_at_bet: oddsAtBet,
    })
    .select()
    .single()

  return NextResponse.json({ bet, new_probability: newProbability }, { status: 201 })
}
