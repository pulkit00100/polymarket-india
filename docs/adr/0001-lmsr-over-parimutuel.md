# ADR-0001: LMSR AMM over Parimutuel Pool for Odds

**Date**: 2026-04-18
**Status**: accepted
**Deciders**: Pulkit

## Context

Prediction markets need a mechanism to set and update odds as users place bets. With a small initial userbase (~100 users), traditional orderbook markets fail due to thin liquidity — no counterparty means no trade. Parimutuel pools only settle odds at market close, meaning odds are static until resolution.

## Decision

We use Logarithmic Market Scoring Rule (LMSR) as an Automated Market Maker. Odds update mathematically on every single bet using `P(yes) = e^(q_yes/b) / (e^(q_yes/b) + e^(q_no/b))`, with the platform acting as the house/counterparty.

## Alternatives Considered

### Alternative 1: Parimutuel Pool
- **Pros**: Simple to implement, no house risk on individual bets
- **Cons**: Odds only known at resolution, no live price signal, boring UX
- **Why not**: Users can't see live probability movement — kills engagement

### Alternative 2: Orderbook
- **Pros**: No house risk, pure market discovery
- **Cons**: Requires counterparty for every trade, fails completely with <100 users
- **Why not**: Cold-start problem is fatal for an MVP

## Consequences

### Positive
- Odds move from day 1 even with 1 user
- Live probability creates engagement and news reactivity
- No counterparty needed — platform works at any scale

### Negative
- House takes on risk — if everyone bets YES and YES wins, platform pays out
- Requires seeding each market with initial `b` parameter (set to 100)

### Risks
- House bankroll depletion if markets are heavily one-sided — mitigated by virtual coins only (no real money)
