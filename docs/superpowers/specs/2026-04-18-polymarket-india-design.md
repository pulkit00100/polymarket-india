# Polymarket India — Design Spec
**Date:** 2026-04-18  
**Status:** Approved  
**Type:** Paper Trading MVP (no real money)

---

## Overview

A prediction market platform for India where users forecast outcomes of real-world events across politics, sports, finance, and general topics. No real money is involved — users trade virtual points and coins, making it fully legal as a paper trading / skill-based game.

---

## Goals

- Let Indian users bet on real-world events using virtual currency
- Keep markets feeling alive from day one using LMSR AMM odds
- React to breaking news via a live news feed + email notifications
- Validate product-market fit before considering real-money operations

---

## Architecture

**Next.js 14 monolith** deployed on Vercel.

- **Frontend:** Next.js App Router (pages + components)
- **API:** Next.js API routes (`/api/*`)
- **Database:** PostgreSQL via Supabase
- **Auth:** NextAuth.js with Google provider
- **Cron:** Vercel cron jobs for market auto-resolution
- **News:** NewsAPI for fetching headlines by keyword
- **Email:** Resend for notification emails
- **Styling:** Tailwind CSS

---

## Data Model

### Users
| Field | Type | Notes |
|-------|------|-------|
| id | uuid PK | |
| name | text | |
| email | text | unique |
| points | int | starts at 1000 |
| coins | int | starts at 100 |
| role | enum | user / admin |
| created_at | timestamp | |

### Markets
| Field | Type | Notes |
|-------|------|-------|
| id | uuid PK | |
| title | text | |
| description | text | |
| category | enum | politics / sports / finance / other |
| status | enum | pending / open / closed / resolved |
| resolve_at | timestamp | deadline for auto-resolution |
| outcome | boolean | null until resolved |
| news_keywords | text[] | used for news feed + notification matching |
| created_by | uuid FK→users | |

### Bets
| Field | Type | Notes |
|-------|------|-------|
| id | uuid PK | |
| user_id | uuid FK→users | |
| market_id | uuid FK→markets | |
| position | enum | yes / no |
| points_wagered | int | |
| odds_at_bet | decimal | snapshot of probability at time of bet |
| payout | int | null until resolved |
| created_at | timestamp | |

### Market State (LMSR)
| Field | Type | Notes |
|-------|------|-------|
| market_id | uuid FK→markets | |
| q_yes | decimal | cumulative YES shares |
| q_no | decimal | cumulative NO shares |
| b | decimal | liquidity constant, set at market creation |
| yes_probability | decimal | recalculated on every bet |
| updated_at | timestamp | |

---

## Odds: LMSR AMM

Markets use the **Logarithmic Market Scoring Rule (LMSR)** instead of a parimutuel pool.

**Probability formula:**
```
P(yes) = e^(q_yes/b) / (e^(q_yes/b) + e^(q_no/b))
```

- `q_yes` / `q_no` — cumulative shares bet on each side
- `b` — liquidity constant (default: 100). Higher = more stable odds, lower = more sensitive
- Odds update on every single bet, even with one user active
- No counterparty needed — users always bet against the formula

**Why LMSR over parimutuel:** Parimutuel odds only move when users bet against each other. With low initial traffic, markets feel static. LMSR makes every bet immediately shift the probability, keeping markets alive from day one.

---

## Market Lifecycle

```
propose → pending → (admin approves) → open → (resolve_at reached) → closed → (cron resolves) → resolved
```

1. Any user proposes a market with title, description, category, deadline, and news keywords
2. Admin reviews and approves → status moves to `open`
3. Users bet YES or NO, odds shift via LMSR on each bet
4. At `resolve_at`, Vercel cron closes the market
5. Cron fetches resolution data (or admin confirms outcome manually as fallback)
6. Winners receive points + coins proportional to their position and odds

---

## Rewards

- **Points:** Primary currency for betting. Winners earn back their wager × payout multiplier based on odds at bet time.
- **Coins:** Earned alongside points on correct predictions. Used to unlock cosmetic features or boost market visibility (post-MVP).
- **Leaderboard:** Ranked by total points. Weekly reset + all-time leaderboard.

---

## News Reactivity

### Live News Feed
- Each market has `news_keywords` (e.g. `["RBI", "interest rate", "repo rate"]`)
- NewsAPI is polled every 15 minutes, results cached in Supabase
- Market detail page shows relevant headlines in a sidebar feed
- Users read news → decide to bet → AMM odds shift naturally

### Email Notifications
- When a new headline matches a market's `news_keywords`, subscribed users receive an email via Resend
- Email links directly to the market
- Users can subscribe/unsubscribe per market

---

## MVP Feature Scope

| Feature | Description |
|---------|-------------|
| Browse markets | List with filters by category and status |
| Market detail | Odds chart, news feed, bet form |
| Place bet | YES / NO, choose points amount, see projected odds |
| Propose market | Form → pending queue |
| Admin dashboard | Approve / reject proposed markets |
| Auto-resolution | Vercel cron at market deadline |
| Points + coins | Distributed to winners on resolution |
| Leaderboard | Weekly + all-time, points-based |
| Google login | Via NextAuth.js |
| News feed | Per-market news sidebar via NewsAPI |
| Email notifications | On keyword-matched news via Resend |

---

## Post-MVP (Out of Scope for Now)

- Mobile app (iOS / Android)
- Real money markets (pending legal review)
- AI oracle for automated resolution
- Market comments and discussion threads
- Referral system
- Coins marketplace (spend coins on features)

---

## Open Questions

- Who acts as admin initially? (Likely the founder)
- What happens if auto-resolution data is unavailable at deadline? → Admin manual fallback
- **Payout formula:** `payout = points_wagered × (1 / odds_at_bet)` — inverse-odds multiplier based on probability at time of bet
