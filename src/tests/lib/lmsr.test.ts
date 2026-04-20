import { describe, it, expect } from 'vitest'
import { probability, cost, sharesForCost } from '@/lib/lmsr'

describe('LMSR AMM', () => {
  describe('probability()', () => {
    it('returns 0.5 when q_yes and q_no are equal', () => {
      expect(probability(0, 0, 100)).toBeCloseTo(0.5)
    })

    it('returns higher probability when q_yes > q_no', () => {
      expect(probability(50, 0, 100)).toBeGreaterThan(0.5)
    })

    it('returns lower probability when q_yes < q_no', () => {
      expect(probability(0, 50, 100)).toBeLessThan(0.5)
    })

    it('probability is always between 0 and 1', () => {
      const p = probability(200, 10, 100)
      expect(p).toBeGreaterThan(0)
      expect(p).toBeLessThan(1)
    })
  })

  describe('cost()', () => {
    it('returns positive cost for buying yes shares', () => {
      const c = cost(0, 0, 100, 'yes', 10)
      expect(c).toBeGreaterThan(0)
    })

    it('buying more shares costs more', () => {
      const small = cost(0, 0, 100, 'yes', 10)
      const large = cost(0, 0, 100, 'yes', 50)
      expect(large).toBeGreaterThan(small)
    })

    it('cost increases as market moves in your direction (slippage)', () => {
      const first = cost(0, 0, 100, 'yes', 10)
      const second = cost(10, 0, 100, 'yes', 10)
      expect(second).toBeGreaterThan(first)
    })
  })

  describe('sharesForCost()', () => {
    it('returns positive shares for positive cost', () => {
      const shares = sharesForCost(0, 0, 100, 'yes', 50)
      expect(shares).toBeGreaterThan(0)
    })

    it('more points buys more shares', () => {
      const small = sharesForCost(0, 0, 100, 'yes', 50)
      const large = sharesForCost(0, 0, 100, 'yes', 200)
      expect(large).toBeGreaterThan(small)
    })
  })
})
