# ADR-0004: Virtual Coins over Real Money

**Date**: 2026-04-18
**Status**: accepted
**Deciders**: Pulkit

## Context

Prediction markets in India involving real money fall under gambling regulation and require RBI approval. The app targets Indian users betting on Indian events (politics, cricket, finance). Legal risk is the primary constraint.

## Decision

All betting uses virtual points (1000 on signup) and coins (100 on signup). No real money, no withdrawals, no deposits. Platform is purely for entertainment and forecasting accuracy.

## Alternatives Considered

### Alternative 1: Real money with RBI compliance
- **Pros**: Monetization, real skin in the game improves forecast quality
- **Cons**: Requires regulatory approval, legal fees, KYC/AML compliance
- **Why not**: Months of legal work before shipping a single line of code

### Alternative 2: Crypto/stablecoins
- **Pros**: Bypasses INR regulation
- **Cons**: Legally grey in India, wallet UX friction, drives away casual users
- **Why not**: Adds complexity without solving the core product hypothesis

## Consequences

### Positive
- Zero legal risk — purely a game/entertainment platform
- Can ship immediately without compliance overhead
- LMSR house risk is irrelevant since coins have no real value

### Negative
- Lower user incentive — virtual coins matter less than real money
- No direct monetization path from betting

### Risks
- If virtual coins become tradeable for real value (gifting, etc.), legal grey area emerges — keep coins non-transferable
