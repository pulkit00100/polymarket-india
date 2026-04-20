type Position = 'yes' | 'no'

// C(q_yes, q_no) = b * ln(e^(q_yes/b) + e^(q_no/b))
function marketCost(qYes: number, qNo: number, b: number): number {
  return b * Math.log(Math.exp(qYes / b) + Math.exp(qNo / b))
}

// P(yes) = e^(q_yes/b) / (e^(q_yes/b) + e^(q_no/b))
export function probability(qYes: number, qNo: number, b: number): number {
  const expYes = Math.exp(qYes / b)
  const expNo = Math.exp(qNo / b)
  return expYes / (expYes + expNo)
}

// Points required to buy `shares` on `position`
export function cost(
  qYes: number,
  qNo: number,
  b: number,
  position: Position,
  shares: number
): number {
  const before = marketCost(qYes, qNo, b)
  const after = position === 'yes'
    ? marketCost(qYes + shares, qNo, b)
    : marketCost(qYes, qNo + shares, b)
  return after - before
}

// Shares received for spending `points` on `position` (binary search)
export function sharesForCost(
  qYes: number,
  qNo: number,
  b: number,
  position: Position,
  points: number
): number {
  let lo = 0
  let hi = points * 10
  for (let i = 0; i < 64; i++) {
    const mid = (lo + hi) / 2
    if (cost(qYes, qNo, b, position, mid) < points) {
      lo = mid
    } else {
      hi = mid
    }
  }
  return (lo + hi) / 2
}
