# Polymarket India Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a paper-trading prediction market platform for India where users bet virtual points on real-world events using LMSR AMM odds, with live news feeds and email notifications.

**Architecture:** Next.js 14 monolith with App Router — frontend pages + API routes in one codebase, deployed to Vercel. PostgreSQL via Supabase for persistence. Vercel cron for auto-resolution at market deadlines.

**Tech Stack:** Next.js 14, TypeScript, Supabase (PostgreSQL), NextAuth.js (Google), Tailwind CSS, NewsAPI, Resend (email), Vitest (tests), Vercel (hosting + cron)

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout, session provider
│   ├── page.tsx                      # Browse markets (home)
│   ├── markets/
│   │   ├── [id]/page.tsx             # Market detail: odds, news feed, bet form
│   │   └── new/page.tsx              # Propose a market form
│   ├── leaderboard/page.tsx          # Points leaderboard
│   ├── profile/page.tsx              # User portfolio + bet history
│   └── admin/page.tsx                # Admin: approve/reject pending markets
├── app/api/
│   ├── auth/[...nextauth]/route.ts   # NextAuth handler
│   ├── markets/
│   │   ├── route.ts                  # GET /markets (list), POST /markets (propose)
│   │   └── [id]/
│   │       ├── route.ts              # GET /markets/:id
│   │       └── bet/route.ts         # POST /markets/:id/bet
│   ├── leaderboard/route.ts          # GET /leaderboard
│   ├── news/[marketId]/route.ts      # GET /news/:marketId (cached headlines)
│   └── cron/resolve/route.ts        # POST /cron/resolve (Vercel cron)
├── lib/
│   ├── db.ts                         # Supabase client singleton
│   ├── auth.ts                       # NextAuth config (Google provider)
│   ├── lmsr.ts                       # LMSR AMM math: probability, cost, shares
│   ├── resolution.ts                 # Market resolution + payout calculation
│   └── news.ts                       # NewsAPI client + keyword matching
├── components/
│   ├── MarketCard.tsx                # Market list item
│   ├── BetForm.tsx                   # YES/NO bet form with projected odds preview
│   ├── OddsBar.tsx                   # Visual probability bar (yes% / no%)
│   ├── NewsFeed.tsx                  # Sidebar news headlines for a market
│   └── Leaderboard.tsx              # Ranked user table
└── tests/
    ├── lib/lmsr.test.ts              # Unit tests for LMSR math
    └── lib/resolution.test.ts        # Unit tests for payout calculation
```

---

## Phase 1: Project Setup + Database

### Task 1: Bootstrap Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `.env.local.example`

- [ ] **Step 1: Scaffold the project**

```bash
npx create-next-app@latest polymarket-india \
  --typescript --tailwind --app --src-dir --import-alias "@/*" --no-git
cd polymarket-india
```

- [ ] **Step 2: Install dependencies**

```bash
npm install @supabase/supabase-js next-auth @auth/supabase-adapter \
  resend vitest @vitejs/plugin-react @testing-library/react
```

- [ ] **Step 3: Create `.env.local.example`**

```bash
# Copy this to .env.local and fill in values
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEWSAPI_KEY=
RESEND_API_KEY=
CRON_SECRET=your-cron-secret-here
```

- [ ] **Step 4: Add vitest config to `package.json`**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "vitest": {
    "environment": "node"
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: bootstrap Next.js project with dependencies"
```

---

### Task 2: Supabase Schema

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`

- [ ] **Step 1: Create the migration file**

```sql
-- supabase/migrations/001_initial_schema.sql

create extension if not exists "uuid-ossp";

create type user_role as enum ('user', 'admin');
create type market_category as enum ('politics', 'sports', 'finance', 'other');
create type market_status as enum ('pending', 'open', 'closed', 'resolved');
create type bet_position as enum ('yes', 'no');

create table users (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text unique not null,
  image text,
  role user_role not null default 'user',
  points int not null default 1000,
  coins int not null default 100,
  created_at timestamptz not null default now()
);

create table markets (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  category market_category not null,
  status market_status not null default 'pending',
  resolve_at timestamptz not null,
  outcome boolean,
  news_keywords text[] not null default '{}',
  created_by uuid references users(id) not null,
  created_at timestamptz not null default now()
);

create table market_state (
  market_id uuid primary key references markets(id) on delete cascade,
  q_yes decimal not null default 0,
  q_no decimal not null default 0,
  b decimal not null default 100,
  yes_probability decimal not null default 0.5,
  updated_at timestamptz not null default now()
);

create table bets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) not null,
  market_id uuid references markets(id) not null,
  position bet_position not null,
  points_wagered int not null,
  odds_at_bet decimal not null,
  payout int,
  created_at timestamptz not null default now()
);

create table news_cache (
  id uuid primary key default uuid_generate_v4(),
  market_id uuid references markets(id) on delete cascade,
  headline text not null,
  url text not null,
  published_at timestamptz not null,
  fetched_at timestamptz not null default now()
);

-- Indexes
create index on bets(user_id);
create index on bets(market_id);
create index on news_cache(market_id);
create index on markets(status);
```

- [ ] **Step 2: Run the migration in Supabase dashboard**

Go to Supabase → SQL Editor → paste the migration → Run.

- [ ] **Step 3: Commit**

```bash
git add supabase/
git commit -m "chore: add initial database schema migration"
```

---

### Task 3: Supabase Client + Auth Config

**Files:**
- Create: `src/lib/db.ts`
- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`

- [ ] **Step 1: Write `src/lib/db.ts`**

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side client with full access (never expose to browser)
export const db = createClient(supabaseUrl, supabaseServiceKey)
```

- [ ] **Step 2: Write `src/lib/auth.ts`**

```typescript
import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { db } from './db'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const { data: existing } = await db
        .from('users')
        .select('id')
        .eq('email', user.email!)
        .single()

      if (!existing) {
        await db.from('users').insert({
          email: user.email!,
          name: user.name!,
          image: user.image,
        })
      }
      return true
    },
    async session({ session }) {
      const { data: dbUser } = await db
        .from('users')
        .select('id, role, points, coins')
        .eq('email', session.user.email!)
        .single()

      if (dbUser) {
        session.user.id = dbUser.id
        session.user.role = dbUser.role
        session.user.points = dbUser.points
        session.user.coins = dbUser.coins
      }
      return session
    },
  },
}
```

- [ ] **Step 3: Write `src/app/api/auth/[...nextauth]/route.ts`**

```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

- [ ] **Step 4: Extend NextAuth session types — create `src/types/next-auth.d.ts`**

```typescript
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      role: 'user' | 'admin'
      points: number
      coins: number
    }
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/db.ts src/lib/auth.ts src/app/api/auth/ src/types/
git commit -m "feat: add Supabase client and NextAuth Google auth"
```

---

## Phase 2: LMSR AMM Core Logic

### Task 4: LMSR Math Library (TDD)

**Files:**
- Create: `src/lib/lmsr.ts`
- Create: `src/tests/lib/lmsr.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// src/tests/lib/lmsr.test.ts
import { describe, it, expect } from 'vitest'
import { calcProbability, calcCost, calcShares } from '@/lib/lmsr'

describe('calcProbability', () => {
  it('returns 0.5 when q_yes and q_no are equal', () => {
    expect(calcProbability(0, 0, 100)).toBeCloseTo(0.5)
  })

  it('returns higher probability when q_yes > q_no', () => {
    const prob = calcProbability(50, 0, 100)
    expect(prob).toBeGreaterThan(0.5)
  })

  it('returns lower probability when q_yes < q_no', () => {
    const prob = calcProbability(0, 50, 100)
    expect(prob).toBeLessThan(0.5)
  })

  it('probability is always between 0 and 1', () => {
    const prob = calcProbability(1000, 0, 100)
    expect(prob).toBeGreaterThan(0)
    expect(prob).toBeLessThanOrEqual(1)
  })
})

describe('calcCost', () => {
  it('returns positive cost for buying yes shares', () => {
    const cost = calcCost(0, 0, 10, 'yes', 100)
    expect(cost).toBeGreaterThan(0)
  })

  it('returns positive cost for buying no shares', () => {
    const cost = calcCost(0, 0, 10, 'no', 100)
    expect(cost).toBeGreaterThan(0)
  })

  it('costs more as market becomes more one-sided', () => {
    const cheapCost = calcCost(0, 0, 10, 'yes', 100)
    const expensiveCost = calcCost(200, 0, 10, 'yes', 100)
    expect(expensiveCost).toBeGreaterThan(cheapCost)
  })
})

describe('calcShares', () => {
  it('returns positive shares for given points', () => {
    const shares = calcShares(0, 0, 100, 'yes', 100)
    expect(shares).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- src/tests/lib/lmsr.test.ts
```
Expected: FAIL — "Cannot find module '@/lib/lmsr'"

- [ ] **Step 3: Implement `src/lib/lmsr.ts`**

```typescript
// LMSR: P(yes) = e^(q_yes/b) / (e^(q_yes/b) + e^(q_no/b))
// Cost function: C(q) = b * ln(e^(q_yes/b) + e^(q_no/b))

export function calcProbability(qYes: number, qNo: number, b: number): number {
  const expYes = Math.exp(qYes / b)
  const expNo = Math.exp(qNo / b)
  return expYes / (expYes + expNo)
}

function costFunction(qYes: number, qNo: number, b: number): number {
  return b * Math.log(Math.exp(qYes / b) + Math.exp(qNo / b))
}

// Cost in points to buy `shares` on a given position
export function calcCost(
  qYes: number,
  qNo: number,
  shares: number,
  position: 'yes' | 'no',
  b: number
): number {
  const before = costFunction(qYes, qNo, b)
  const after =
    position === 'yes'
      ? costFunction(qYes + shares, qNo, b)
      : costFunction(qYes, qNo + shares, b)
  return Math.round((after - before) * 100) / 100
}

// How many shares you get for `points` on a given position (binary search)
export function calcShares(
  qYes: number,
  qNo: number,
  points: number,
  position: 'yes' | 'no',
  b: number
): number {
  let lo = 0
  let hi = points * 10
  for (let i = 0; i < 64; i++) {
    const mid = (lo + hi) / 2
    const cost = calcCost(qYes, qNo, mid, position, b)
    if (cost < points) lo = mid
    else hi = mid
  }
  return Math.floor(lo * 100) / 100
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- src/tests/lib/lmsr.test.ts
```
Expected: PASS — all 7 tests green

- [ ] **Step 5: Commit**

```bash
git add src/lib/lmsr.ts src/tests/lib/lmsr.test.ts
git commit -m "feat: add LMSR AMM math library with tests"
```

---

### Task 5: Resolution + Payout Logic (TDD)

**Files:**
- Create: `src/lib/resolution.ts`
- Create: `src/tests/lib/resolution.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// src/tests/lib/resolution.test.ts
import { describe, it, expect } from 'vitest'
import { calcPayout } from '@/lib/resolution'

describe('calcPayout', () => {
  it('returns 0 for losing position', () => {
    // bet YES, outcome is NO
    expect(calcPayout({ position: 'yes', pointsWagered: 100, oddsAtBet: 0.5, outcome: false })).toBe(0)
  })

  it('pays 2x for 50/50 odds on winning bet', () => {
    // bet YES at 50% odds, outcome is YES → payout = 100 / 0.5 = 200
    expect(calcPayout({ position: 'yes', pointsWagered: 100, oddsAtBet: 0.5, outcome: true })).toBe(200)
  })

  it('pays more for low-probability winning bet', () => {
    // bet YES at 20% odds → payout = 100 / 0.2 = 500
    expect(calcPayout({ position: 'yes', pointsWagered: 100, oddsAtBet: 0.2, outcome: true })).toBe(500)
  })

  it('pays less for high-probability winning bet', () => {
    // bet YES at 80% odds → payout = 100 / 0.8 = 125
    expect(calcPayout({ position: 'yes', pointsWagered: 100, oddsAtBet: 0.8, outcome: true })).toBe(125)
  })

  it('calculates correct coins reward (10% of payout)', () => {
    const { coins } = calcPayout({ position: 'yes', pointsWagered: 100, oddsAtBet: 0.5, outcome: true }, true)
    expect(coins).toBe(20) // 10% of 200
  })
})
```

- [ ] **Step 2: Run to confirm failure**

```bash
npm test -- src/tests/lib/resolution.test.ts
```
Expected: FAIL — "Cannot find module '@/lib/resolution'"

- [ ] **Step 3: Implement `src/lib/resolution.ts`**

```typescript
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
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test -- src/tests/lib/resolution.test.ts
```
Expected: PASS — all 5 tests green

- [ ] **Step 5: Commit**

```bash
git add src/lib/resolution.ts src/tests/lib/resolution.test.ts
git commit -m "feat: add market resolution and payout calculation with tests"
```

---

## Phase 3: Markets API

### Task 6: Markets List + Propose API

**Files:**
- Create: `src/app/api/markets/route.ts`

- [ ] **Step 1: Write `src/app/api/markets/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/markets?category=politics&status=open
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

// POST /api/markets — propose a new market
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

  // Seed initial LMSR state
  await db.from('market_state').insert({
    market_id: market.id,
    q_yes: 0,
    q_no: 0,
    b: 100,
    yes_probability: 0.5,
  })

  return NextResponse.json(market, { status: 201 })
}
```

- [ ] **Step 2: Manually test via curl**

```bash
# Start dev server first: npm run dev
curl http://localhost:3000/api/markets
# Expected: [] (empty array, no markets yet)
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/markets/route.ts
git commit -m "feat: add markets list and propose API"
```

---

### Task 7: Market Detail + Bet API

**Files:**
- Create: `src/app/api/markets/[id]/route.ts`
- Create: `src/app/api/markets/[id]/bet/route.ts`

- [ ] **Step 1: Write `src/app/api/markets/[id]/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await db
    .from('markets')
    .select('*, market_state(*), users!created_by(name)')
    .eq('id', params.id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Market not found' }, { status: 404 })

  return NextResponse.json(data)
}
```

- [ ] **Step 2: Write `src/app/api/markets/[id]/bet/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { calcProbability, calcShares } from '@/lib/lmsr'

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

  // Fetch market + state
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

  // Check user has enough points
  const { data: user } = await db
    .from('users')
    .select('points')
    .eq('id', session.user.id)
    .single()

  if (!user || user.points < points_wagered) {
    return NextResponse.json({ error: 'Insufficient points' }, { status: 400 })
  }

  // Snapshot odds before bet
  const oddsAtBet = calcProbability(state.q_yes, state.q_no, state.b)

  // Calculate shares bought
  const shares = calcShares(state.q_yes, state.q_no, points_wagered, position, state.b)

  // New q values
  const newQYes = position === 'yes' ? state.q_yes + shares : state.q_yes
  const newQNo = position === 'no' ? state.q_no + shares : state.q_no
  const newProbability = calcProbability(newQYes, newQNo, state.b)

  // Deduct points from user
  await db
    .from('users')
    .update({ points: user.points - points_wagered })
    .eq('id', session.user.id)

  // Update market state
  await db
    .from('market_state')
    .update({ q_yes: newQYes, q_no: newQNo, yes_probability: newProbability, updated_at: new Date().toISOString() })
    .eq('market_id', params.id)

  // Record bet
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
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/markets/[id]/
git commit -m "feat: add market detail and bet placement API"
```

---

## Phase 4: Auto-Resolution Cron

### Task 8: Cron Resolution Endpoint

**Files:**
- Create: `src/app/api/cron/resolve/route.ts`
- Create: `vercel.json`

- [ ] **Step 1: Write `src/app/api/cron/resolve/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { calcPayout } from '@/lib/resolution'

// Called by Vercel cron every 5 minutes
export async function POST(req: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Find markets past their deadline that are still open
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
    // Skip if outcome not yet set (admin needs to set it manually for now)
    if (market.outcome === null || market.outcome === undefined) continue

    // Fetch all bets for this market
    const { data: bets } = await db
      .from('bets')
      .select('id, user_id, position, points_wagered, odds_at_bet')
      .eq('market_id', market.id)
      .is('payout', null)

    if (!bets) continue

    // Resolve each bet
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

      // Update bet payout
      await db.from('bets').update({ payout: points }).eq('id', bet.id)

      // Credit user if they won
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

    // Mark market as resolved
    await db.from('markets').update({ status: 'resolved' }).eq('id', market.id)
    resolved++
  }

  return NextResponse.json({ resolved })
}
```

- [ ] **Step 2: Create `vercel.json` to configure cron**

```json
{
  "crons": [
    {
      "path": "/api/cron/resolve",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/cron/ vercel.json
git commit -m "feat: add auto-resolution cron endpoint"
```

---

## Phase 5: News Feed + Notifications

### Task 9: NewsAPI Client + Cache

**Files:**
- Create: `src/lib/news.ts`
- Create: `src/app/api/news/[marketId]/route.ts`

- [ ] **Step 1: Write `src/lib/news.ts`**

```typescript
interface NewsArticle {
  headline: string
  url: string
  published_at: string
}

export async function fetchNewsByKeywords(keywords: string[]): Promise<NewsArticle[]> {
  if (keywords.length === 0) return []

  const query = keywords.join(' OR ')
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${process.env.NEWSAPI_KEY}`

  const res = await fetch(url, { next: { revalidate: 900 } }) // 15-min cache
  if (!res.ok) return []

  const data = await res.json()
  return (data.articles ?? []).map((a: any) => ({
    headline: a.title,
    url: a.url,
    published_at: a.publishedAt,
  }))
}
```

- [ ] **Step 2: Write `src/app/api/news/[marketId]/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { fetchNewsByKeywords } from '@/lib/news'

export async function GET(req: NextRequest, { params }: { params: { marketId: string } }) {
  const { data: market } = await db
    .from('markets')
    .select('news_keywords')
    .eq('id', params.marketId)
    .single()

  if (!market) return NextResponse.json({ error: 'Market not found' }, { status: 404 })

  // Check cache first (within 15 min)
  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString()
  const { data: cached } = await db
    .from('news_cache')
    .select('headline, url, published_at')
    .eq('market_id', params.marketId)
    .gte('fetched_at', since)
    .order('published_at', { ascending: false })
    .limit(10)

  if (cached && cached.length > 0) return NextResponse.json(cached)

  // Fetch fresh from NewsAPI
  const articles = await fetchNewsByKeywords(market.news_keywords)

  if (articles.length > 0) {
    await db.from('news_cache').insert(
      articles.map((a) => ({ market_id: params.marketId, ...a }))
    )
  }

  return NextResponse.json(articles)
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/news.ts src/app/api/news/
git commit -m "feat: add NewsAPI client and cached news feed endpoint"
```

---

### Task 10: Email Notifications via Resend

**Files:**
- Create: `src/app/api/cron/notify/route.ts`

- [ ] **Step 1: Install Resend**

```bash
npm install resend
```

- [ ] **Step 2: Write `src/app/api/cron/notify/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { db } from '@/lib/db'
import { fetchNewsByKeywords } from '@/lib/news'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get all open markets with keywords
  const { data: markets } = await db
    .from('markets')
    .select('id, title, news_keywords')
    .eq('status', 'open')
    .not('news_keywords', 'eq', '{}')

  if (!markets) return NextResponse.json({ notified: 0 })

  let notified = 0

  for (const market of markets) {
    const articles = await fetchNewsByKeywords(market.news_keywords)
    if (articles.length === 0) continue

    // Check if we already sent a notification for this headline
    const { data: alreadySent } = await db
      .from('news_cache')
      .select('url')
      .eq('market_id', market.id)
      .in('url', articles.map((a) => a.url))

    const sentUrls = new Set((alreadySent ?? []).map((r) => r.url))
    const newArticles = articles.filter((a) => !sentUrls.has(a.url))
    if (newArticles.length === 0) continue

    // Get users who have bet on this market (opted in via betting)
    const { data: bettors } = await db
      .from('bets')
      .select('users!user_id(email, name)')
      .eq('market_id', market.id)

    const emails = [...new Set((bettors ?? []).map((b: any) => b.users.email))]
    if (emails.length === 0) continue

    const latestArticle = newArticles[0]

    await resend.emails.send({
      from: 'Polymarket India <noreply@yourdomain.com>',
      to: emails,
      subject: `Breaking: News on "${market.title}"`,
      html: `
        <h2>News update on a market you're in</h2>
        <p><strong>${market.title}</strong></p>
        <p>${latestArticle.headline}</p>
        <a href="${latestArticle.url}">Read full story</a>
        <br/><br/>
        <a href="${process.env.NEXTAUTH_URL}/markets/${market.id}">View market & place bet →</a>
      `,
    })

    notified++
  }

  return NextResponse.json({ notified })
}
```

- [ ] **Step 3: Add notify cron to `vercel.json`**

```json
{
  "crons": [
    {
      "path": "/api/cron/resolve",
      "schedule": "*/5 * * * *"
    },
    {
      "path": "/api/cron/notify",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/cron/notify/ vercel.json
git commit -m "feat: add email notifications for breaking news via Resend"
```

---

## Phase 6: Admin Dashboard API

### Task 11: Admin Market Approval

**Files:**
- Create: `src/app/api/admin/markets/[id]/route.ts`

- [ ] **Step 1: Write `src/app/api/admin/markets/[id]/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// PATCH /api/admin/markets/:id — approve, reject, or set outcome
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { action, outcome } = await req.json()

  if (action === 'approve') {
    const { error } = await db
      .from('markets')
      .update({ status: 'open' })
      .eq('id', params.id)
      .eq('status', 'pending')

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ status: 'approved' })
  }

  if (action === 'reject') {
    const { error } = await db
      .from('markets')
      .update({ status: 'closed' })
      .eq('id', params.id)
      .eq('status', 'pending')

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ status: 'rejected' })
  }

  if (action === 'set_outcome' && typeof outcome === 'boolean') {
    const { error } = await db
      .from('markets')
      .update({ outcome })
      .eq('id', params.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ status: 'outcome_set', outcome })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/admin/
git commit -m "feat: add admin market approval and outcome API"
```

---

## Phase 7: Leaderboard API + Frontend

### Task 12: Leaderboard API

**Files:**
- Create: `src/app/api/leaderboard/route.ts`

- [ ] **Step 1: Write `src/app/api/leaderboard/route.ts`**

```typescript
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const { data, error } = await db
    .from('users')
    .select('id, name, image, points, coins')
    .order('points', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/leaderboard/route.ts
git commit -m "feat: add leaderboard API"
```

---

### Task 13: Core UI Components

**Files:**
- Create: `src/components/MarketCard.tsx`
- Create: `src/components/OddsBar.tsx`
- Create: `src/components/BetForm.tsx`
- Create: `src/components/NewsFeed.tsx`

- [ ] **Step 1: Write `src/components/OddsBar.tsx`**

```tsx
interface OddsBarProps {
  yesProbability: number // 0–1
}

export function OddsBar({ yesProbability }: OddsBarProps) {
  const yesPercent = Math.round(yesProbability * 100)
  const noPercent = 100 - yesPercent

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm font-medium mb-1">
        <span className="text-green-600">YES {yesPercent}%</span>
        <span className="text-red-500">NO {noPercent}%</span>
      </div>
      <div className="flex h-3 rounded-full overflow-hidden">
        <div className="bg-green-500 transition-all" style={{ width: `${yesPercent}%` }} />
        <div className="bg-red-400 flex-1" />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write `src/components/MarketCard.tsx`**

```tsx
import Link from 'next/link'
import { OddsBar } from './OddsBar'

interface Market {
  id: string
  title: string
  category: string
  resolve_at: string
  market_state: { yes_probability: number }[]
}

export function MarketCard({ market }: { market: Market }) {
  const prob = market.market_state?.[0]?.yes_probability ?? 0.5

  return (
    <Link href={`/markets/${market.id}`}>
      <div className="border rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs uppercase tracking-wide text-gray-400">{market.category}</span>
          <span className="text-xs text-gray-400">
            Closes {new Date(market.resolve_at).toLocaleDateString()}
          </span>
        </div>
        <h3 className="font-semibold text-gray-800 mb-3">{market.title}</h3>
        <OddsBar yesProbability={prob} />
      </div>
    </Link>
  )
}
```

- [ ] **Step 3: Write `src/components/BetForm.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { calcProbability, calcShares } from '@/lib/lmsr'

interface BetFormProps {
  marketId: string
  qYes: number
  qNo: number
  b: number
  userPoints: number
  onBetPlaced: () => void
}

export function BetForm({ marketId, qYes, qNo, b, userPoints, onBetPlaced }: BetFormProps) {
  const [position, setPosition] = useState<'yes' | 'no'>('yes')
  const [amount, setAmount] = useState(100)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const currentProb = calcProbability(qYes, qNo, b)
  const shares = calcShares(qYes, qNo, amount, position, b)
  const newQYes = position === 'yes' ? qYes + shares : qYes
  const newQNo = position === 'no' ? qNo + shares : qNo
  const projectedProb = calcProbability(newQYes, newQNo, b)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch(`/api/markets/${marketId}/bet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ position, points_wagered: amount }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error); return }
    onBetPlaced()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        {(['yes', 'no'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPosition(p)}
            className={`flex-1 py-2 rounded-lg font-semibold border transition-colors
              ${position === p
                ? p === 'yes' ? 'bg-green-500 text-white border-green-500' : 'bg-red-400 text-white border-red-400'
                : 'border-gray-300 text-gray-600'}`}
          >
            {p.toUpperCase()}
          </button>
        ))}
      </div>
      <input
        type="number"
        min={10}
        max={userPoints}
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full border rounded-lg px-3 py-2"
        placeholder="Points to wager"
      />
      <div className="text-sm text-gray-500">
        Current odds: {Math.round(currentProb * 100)}% YES →{' '}
        After your bet: {Math.round(projectedProb * 100)}% YES
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading || amount < 10}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold disabled:opacity-50"
      >
        {loading ? 'Placing bet...' : `Bet ${amount} points on ${position.toUpperCase()}`}
      </button>
    </form>
  )
}
```

- [ ] **Step 4: Write `src/components/NewsFeed.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'

interface Article {
  headline: string
  url: string
  published_at: string
}

export function NewsFeed({ marketId }: { marketId: string }) {
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    fetch(`/api/news/${marketId}`)
      .then((r) => r.json())
      .then(setArticles)
  }, [marketId])

  if (articles.length === 0) return <p className="text-sm text-gray-400">No recent news found.</p>

  return (
    <ul className="space-y-3">
      {articles.map((a) => (
        <li key={a.url}>
          <a href={a.url} target="_blank" rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline block">
            {a.headline}
          </a>
          <span className="text-xs text-gray-400">
            {new Date(a.published_at).toLocaleDateString()}
          </span>
        </li>
      ))}
    </ul>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/
git commit -m "feat: add core UI components (MarketCard, OddsBar, BetForm, NewsFeed)"
```

---

## Phase 8: Pages

### Task 14: Home, Market Detail, Leaderboard Pages

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/markets/[id]/page.tsx`
- Create: `src/app/leaderboard/page.tsx`
- Create: `src/app/markets/new/page.tsx`
- Create: `src/app/admin/page.tsx`

- [ ] **Step 1: Write `src/app/page.tsx` (Browse Markets)**

```tsx
import { MarketCard } from '@/components/MarketCard'

export default async function HomePage() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/markets?status=open`, {
    next: { revalidate: 60 },
  })
  const markets = await res.json()

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Prediction Markets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {markets.map((m: any) => <MarketCard key={m.id} market={m} />)}
        {markets.length === 0 && <p className="text-gray-400">No open markets yet.</p>}
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Write `src/app/markets/[id]/page.tsx`**

```tsx
import { BetForm } from '@/components/BetForm'
import { OddsBar } from '@/components/OddsBar'
import { NewsFeed } from '@/components/NewsFeed'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function MarketPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/markets/${params.id}`, {
    cache: 'no-store',
  })
  const market = await res.json()
  const state = market.market_state

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <span className="text-xs uppercase text-gray-400">{market.category}</span>
      <h1 className="text-2xl font-bold mt-1 mb-2">{market.title}</h1>
      <p className="text-gray-600 mb-6">{market.description}</p>

      <OddsBar yesProbability={state.yes_probability} />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-semibold mb-4">Place Your Bet</h2>
          {session ? (
            <BetForm
              marketId={params.id}
              qYes={state.q_yes}
              qNo={state.q_no}
              b={state.b}
              userPoints={session.user.points}
              onBetPlaced={() => window.location.reload()}
            />
          ) : (
            <p className="text-gray-500">Sign in to place a bet.</p>
          )}
        </div>
        <div>
          <h2 className="font-semibold mb-4">Latest News</h2>
          <NewsFeed marketId={params.id} />
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Write `src/app/leaderboard/page.tsx`**

```tsx
export default async function LeaderboardPage() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/leaderboard`, {
    next: { revalidate: 300 },
  })
  const users = await res.json()

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400 text-sm border-b">
            <th className="py-2">#</th>
            <th>Name</th>
            <th>Points</th>
            <th>Coins</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any, i: number) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="py-3 text-gray-400">{i + 1}</td>
              <td className="font-medium">{user.name}</td>
              <td className="text-green-600 font-semibold">{user.points.toLocaleString()}</td>
              <td className="text-yellow-500">{user.coins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
```

- [ ] **Step 4: Write `src/app/admin/page.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'

export default function AdminPage() {
  const [markets, setMarkets] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/markets?status=pending').then(r => r.json()).then(setMarkets)
  }, [])

  async function act(id: string, action: 'approve' | 'reject') {
    await fetch(`/api/admin/markets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    setMarkets(m => m.filter(x => x.id !== id))
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin — Pending Markets</h1>
      {markets.length === 0 && <p className="text-gray-400">No pending markets.</p>}
      {markets.map(m => (
        <div key={m.id} className="border rounded-xl p-4 mb-4">
          <h2 className="font-semibold">{m.title}</h2>
          <p className="text-sm text-gray-500 mb-3">{m.description}</p>
          <div className="flex gap-2">
            <button onClick={() => act(m.id, 'approve')}
              className="bg-green-500 text-white px-4 py-1 rounded-lg text-sm">Approve</button>
            <button onClick={() => act(m.id, 'reject')}
              className="bg-red-400 text-white px-4 py-1 rounded-lg text-sm">Reject</button>
          </div>
        </div>
      ))}
    </main>
  )
}
```

- [ ] **Step 5: Write `src/app/markets/new/page.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = ['politics', 'sports', 'finance', 'other']

export default function NewMarketPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '', description: '', category: 'politics',
    resolve_at: '', news_keywords: '',
  })
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/markets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        news_keywords: form.news_keywords.split(',').map(k => k.trim()).filter(Boolean),
      }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); return }
    router.push('/')
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Propose a Market</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Question title" value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          className="w-full border rounded-lg px-3 py-2" />
        <textarea required placeholder="Description" value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          className="w-full border rounded-lg px-3 py-2 h-24" />
        <select value={form.category}
          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
          className="w-full border rounded-lg px-3 py-2">
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input required type="datetime-local" value={form.resolve_at}
          onChange={e => setForm(f => ({ ...f, resolve_at: e.target.value }))}
          className="w-full border rounded-lg px-3 py-2" />
        <input placeholder="News keywords (comma separated, e.g. RBI, repo rate)"
          value={form.news_keywords}
          onChange={e => setForm(f => ({ ...f, news_keywords: e.target.value }))}
          className="w-full border rounded-lg px-3 py-2" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold">
          Submit for Review
        </button>
      </form>
    </main>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/app/
git commit -m "feat: add home, market detail, leaderboard, propose market, and admin pages"
```

---

## Phase 9: Deployment

### Task 15: Deploy to Vercel

- [ ] **Step 1: Push repo to GitHub**

```bash
git remote add origin https://github.com/YOUR_USERNAME/polymarket-india.git
git push -u origin main
```

- [ ] **Step 2: Connect to Vercel**

1. Go to vercel.com → New Project → Import from GitHub
2. Select `polymarket-india`
3. Add all env vars from `.env.local.example`

- [ ] **Step 3: Set up Supabase Google OAuth redirect**

In Google Cloud Console → OAuth credentials → Authorized redirect URIs:
```
https://your-vercel-url.vercel.app/api/auth/callback/google
```

- [ ] **Step 4: Verify cron jobs are active**

In Vercel dashboard → Project → Cron Jobs — confirm both `/api/cron/resolve` and `/api/cron/notify` appear.

- [ ] **Step 5: Smoke test**

1. Visit the deployed URL — home page loads
2. Sign in with Google — account created with 1000 points + 100 coins
3. Admin creates a market via Supabase dashboard directly (set status='open')
4. Place a bet — odds shift
5. Check leaderboard updates

- [ ] **Step 6: Final commit**

```bash
git add .
git commit -m "chore: deployment configuration and smoke test verified"
```

---

## Summary

| Phase | Tasks | Key Output |
|-------|-------|-----------|
| 1 | 1–3 | Project setup, DB schema, Auth |
| 2 | 4–5 | LMSR math + payout logic (tested) |
| 3 | 6–7 | Markets + Betting APIs |
| 4 | 8 | Auto-resolution cron |
| 5 | 9–10 | News feed + email notifications |
| 6 | 11 | Admin approval API |
| 7 | 12–13 | Leaderboard API + UI components |
| 8 | 14 | All pages |
| 9 | 15 | Vercel deployment |
