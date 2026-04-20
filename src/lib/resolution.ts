interface PayoutInput {
  position: 'yes' | 'no'
  pointsWagered: number
  oddsAtBet: number  // probability at time of bet (0–1)
  outcome: boolean   // true = YES won
}

interface PayoutResult {
  points: number
  coins: number
}

export function calcPayout(
  { position, pointsWagered, oddsAtBet, outcome }: PayoutInput,
  includeCoins = false
): PayoutResult {
  const won = (position === 'yes' && outcome) || (position === 'no' && !outcome)

  if (!won) return { points: 0, coins: 0 }

  const effectiveOdds = position === 'yes' ? oddsAtBet : 1 - oddsAtBet
  const points = Math.round(pointsWagered / effectiveOdds)
  const coins = includeCoins ? Math.round(points * 0.1) : 0

  return { points, coins }
}
