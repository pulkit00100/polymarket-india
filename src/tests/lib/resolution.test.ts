import { describe, it, expect } from 'vitest'
import { calcPayout } from '@/lib/resolution'

describe('calcPayout', () => {
  it('returns 0 for losing position', () => {
    expect(calcPayout({ position: 'yes', pointsWagered: 100, oddsAtBet: 0.5, outcome: false })).toEqual({ points: 0, coins: 0 })
  })

  it('pays 2x for 50/50 odds on winning bet', () => {
    expect(calcPayout({ position: 'yes', pointsWagered: 100, oddsAtBet: 0.5, outcome: true })).toEqual({ points: 200, coins: 0 })
  })

  it('pays more for low-probability winning bet', () => {
    expect(calcPayout({ position: 'yes', pointsWagered: 100, oddsAtBet: 0.2, outcome: true })).toEqual({ points: 500, coins: 0 })
  })

  it('pays less for high-probability winning bet', () => {
    expect(calcPayout({ position: 'yes', pointsWagered: 100, oddsAtBet: 0.8, outcome: true })).toEqual({ points: 125, coins: 0 })
  })

  it('NO bet wins when outcome is false', () => {
    expect(calcPayout({ position: 'no', pointsWagered: 100, oddsAtBet: 0.5, outcome: false })).toEqual({ points: 200, coins: 0 })
  })

  it('calculates coins reward (10% of payout) when includeCoins=true', () => {
    expect(calcPayout({ position: 'yes', pointsWagered: 100, oddsAtBet: 0.5, outcome: true }, true)).toEqual({ points: 200, coins: 20 })
  })
})
