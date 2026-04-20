import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { calcPayout } from '@/lib/resolution'

// Called by Vercel cron every 5 minutes
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: markets } = await db
    .from('markets')
    .select('id, outcome')
    .eq('status', 'open')
    .lt('resolve_at', new Date().toISOString())

  if (!markets || markets.length === 0) {
    return NextResponse.json({ resolved: 0 })
  }

  let resolved = 0

  for (const market of markets) {
    if (market.outcome === null || market.outcome === undefined) continue

    const { data: bets } = await db
      .from('bets')
      .select('id, user_id, position, points_wagered, odds_at_bet')
      .eq('market_id', market.id)
      .is('payout', null)

    if (!bets) continue

    for (const bet of bets) {
      const { points, coins } = calcPayout(
        {
          position: bet.position,
          pointsWagered: bet.points_wagered,
          oddsAtBet: bet.odds_at_bet,
          outcome: market.outcome,
        },
        true
      )

      await db.from('bets').update({ payout: points }).eq('id', bet.id)

      if (points > 0) {
        const { data: user } = await db
          .from('users')
          .select('points, coins')
          .eq('id', bet.user_id)
          .single()

        if (user) {
          await db
            .from('users')
            .update({ points: user.points + points, coins: user.coins + coins })
            .eq('id', bet.user_id)
        }
      }
    }

    await db.from('markets').update({ status: 'resolved' }).eq('id', market.id)
    resolved++
  }

  return NextResponse.json({ resolved })
}
