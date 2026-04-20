# Graph Report - .  (2026-04-21)

## Corpus Check
- Corpus is ~19,215 words - fits in a single context window. You may not need a graph.

## Summary
- 121 nodes · 110 edges · 34 communities detected
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_LMSR & ADR Design|LMSR & ADR Design]]
- [[_COMMUNITY_LMSR Math Core|LMSR Math Core]]
- [[_COMMUNITY_Agent Skills & Docs|Agent Skills & Docs]]
- [[_COMMUNITY_ClaudeCodex Routing|Claude/Codex Routing]]
- [[_COMMUNITY_Architecture Decisions|Architecture Decisions]]
- [[_COMMUNITY_Market Proposal Flow|Market Proposal Flow]]
- [[_COMMUNITY_Home Page Markets|Home Page Markets]]
- [[_COMMUNITY_Session Providers|Session Providers]]
- [[_COMMUNITY_Admin Market Row|Admin Market Row]]
- [[_COMMUNITY_Leaderboard|Leaderboard]]
- [[_COMMUNITY_Market Detail Page|Market Detail Page]]
- [[_COMMUNITY_Bet Form Component|Bet Form Component]]
- [[_COMMUNITY_Market Card Component|Market Card Component]]
- [[_COMMUNITY_Cron & Secrets|Cron & Secrets]]
- [[_COMMUNITY_Env Config|Env Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Next Env Types|Next Env Types]]
- [[_COMMUNITY_Vitest Config|Vitest Config]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next Config|Next Config]]
- [[_COMMUNITY_NextAuth Types|NextAuth Types]]
- [[_COMMUNITY_App Layout|App Layout]]
- [[_COMMUNITY_Admin Page|Admin Page]]
- [[_COMMUNITY_Auth Route|Auth Route]]
- [[_COMMUNITY_Resolution Tests|Resolution Tests]]
- [[_COMMUNITY_LMSR Tests|LMSR Tests]]
- [[_COMMUNITY_Navbar|Navbar]]
- [[_COMMUNITY_News Feed|News Feed]]
- [[_COMMUNITY_Supabase DB Client|Supabase DB Client]]
- [[_COMMUNITY_Auth Library|Auth Library]]
- [[_COMMUNITY_SVG File Icon|SVG File Icon]]
- [[_COMMUNITY_SVG Globe Icon|SVG Globe Icon]]
- [[_COMMUNITY_SVG Window Icon|SVG Window Icon]]
- [[_COMMUNITY_Coding Standards|Coding Standards]]

## God Nodes (most connected - your core abstractions)
1. `CODEX.md (Codex/Cursor skill routing)` - 17 edges
2. `Polymarket India — shared agent rules` - 13 edges
3. `POST()` - 10 edges
4. `Polymarket India Design Spec` - 10 edges
5. `Polymarket India` - 7 edges
6. `Polymarket India Implementation Plan` - 7 edges
7. `GET()` - 6 edges
8. `LMSR (Logarithmic Market Scoring Rule) AMM` - 6 edges
9. `ADR-0001: LMSR AMM over Parimutuel` - 5 edges
10. `ADR Index` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Vercel Logo SVG` --conceptually_related_to--> `Polymarket India`  [INFERRED]
  public/vercel.svg → README.md
- `Next.js Logo SVG` --conceptually_related_to--> `Polymarket India`  [INFERRED]
  public/next.svg → README.md
- `POST()` --calls--> `update()`  [INFERRED]
  /Users/pulkitji/Desktop/polymarket-india/src/app/api/cron/resolve/route.ts → src/app/markets/propose/page.tsx
- `CODEX.md (Codex/Cursor skill routing)` --routes_to--> `$architecture-decision-records skill`  [EXTRACTED]
  AGENTS.md → CODEX.md
- `CODEX.md (Codex/Cursor skill routing)` --routes_to--> `$tdd-workflow skill`  [EXTRACTED]
  AGENTS.md → CODEX.md

## Communities

### Community 0 - "LMSR & ADR Design"
Cohesion: 0.16
Nodes (20): ADR-0001: LMSR AMM over Parimutuel, CLAUDE.md — Claude Rules, LMSR (Logarithmic Market Scoring Rule) AMM, Market Lifecycle (propose→pending→open→resolved), NewsAPI Integration, NextAuth.js with Google Provider, Next.js 16 Monolith Architecture, Orderbook Market (rejected alternative) (+12 more)

### Community 1 - "LMSR Math Core"
Cohesion: 0.14
Nodes (8): cost(), marketCost(), probability(), sharesForCost(), fetchNewsByKeywords(), calcPayout(), GET(), POST()

### Community 2 - "Agent Skills & Docs"
Cohesion: 0.12
Nodes (17): .agents/skills/api-design/SKILL.md, docs/adr/ (Architecture Decision Records), Next.js 16.2.4 (App Router), Polymarket India — shared agent rules, React 19.2.4, src/app/ (App Router directory), src/components/ (reusable UI), src/lib/ (shared code) (+9 more)

### Community 3 - "Claude/Codex Routing"
Cohesion: 0.12
Nodes (17): CLAUDE.md (Claude skill routing), CODEX.md (Codex/Cursor skill routing), src/app/api/**/route.ts (API route handlers), $api-design skill, $backend-patterns skill, $code-reviewer skill, $codebase-onboarding skill, $database-migrations skill (+9 more)

### Community 4 - "Architecture Decisions"
Cohesion: 0.29
Nodes (7): ADR-0002: Next.js Monolith over Microservices, ADR-0003: Supabase over Custom PostgreSQL, ADR-0004: Virtual Coins over Real Money, ADR Index, Rationale: Monolith chosen for single-developer MVP, Rationale: Supabase for managed DB with dashboard, Rationale: Virtual coins to avoid Indian gambling regulation

### Community 5 - "Market Proposal Flow"
Cohesion: 0.4
Nodes (2): update(), PATCH()

### Community 6 - "Home Page Markets"
Cohesion: 1.0
Nodes (0): 

### Community 7 - "Session Providers"
Cohesion: 1.0
Nodes (0): 

### Community 8 - "Admin Market Row"
Cohesion: 1.0
Nodes (0): 

### Community 9 - "Leaderboard"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "Market Detail Page"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "Bet Form Component"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Market Card Component"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Cron & Secrets"
Cohesion: 1.0
Nodes (2): src/app/api/cron/resolve/route.ts (cron endpoint), CRON_SECRET (cron auth token)

### Community 14 - "Env Config"
Cohesion: 1.0
Nodes (2): .env.local (local secrets), .env.local.example (secrets template)

### Community 15 - "PostCSS Config"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Next Env Types"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Vitest Config"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "ESLint Config"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Next Config"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "NextAuth Types"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "App Layout"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Admin Page"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Auth Route"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Resolution Tests"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "LMSR Tests"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Navbar"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "News Feed"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Supabase DB Client"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Auth Library"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "SVG File Icon"
Cohesion: 1.0
Nodes (1): File Icon SVG

### Community 31 - "SVG Globe Icon"
Cohesion: 1.0
Nodes (1): Globe Icon SVG

### Community 32 - "SVG Window Icon"
Cohesion: 1.0
Nodes (1): Window Icon SVG

### Community 33 - "Coding Standards"
Cohesion: 1.0
Nodes (1): $coding-standards skill

## Knowledge Gaps
- **40 isolated node(s):** `Next.js Project README`, `Orderbook Market (rejected alternative)`, `Rationale: LMSR chosen for live odds engagement`, `Rationale: Virtual coins to avoid Indian gambling regulation`, `Rationale: Supabase for managed DB with dashboard` (+35 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Home Page Markets`** (2 nodes): `getFeaturedMarkets()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Session Providers`** (2 nodes): `Providers()`, `providers.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Admin Market Row`** (2 nodes): `AdminMarketRow()`, `AdminMarketRow.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Leaderboard`** (2 nodes): `getLeaderboard()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Market Detail Page`** (2 nodes): `getMarket()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Bet Form Component`** (2 nodes): `BetForm()`, `BetForm.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Market Card Component`** (2 nodes): `MarketCard()`, `MarketCard.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cron & Secrets`** (2 nodes): `src/app/api/cron/resolve/route.ts (cron endpoint)`, `CRON_SECRET (cron auth token)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Env Config`** (2 nodes): `.env.local (local secrets)`, `.env.local.example (secrets template)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PostCSS Config`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next Env Types`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vitest Config`** (1 nodes): `vitest.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ESLint Config`** (1 nodes): `eslint.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next Config`** (1 nodes): `next.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `NextAuth Types`** (1 nodes): `next-auth.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Layout`** (1 nodes): `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Admin Page`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auth Route`** (1 nodes): `route.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Resolution Tests`** (1 nodes): `resolution.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `LMSR Tests`** (1 nodes): `lmsr.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Navbar`** (1 nodes): `Navbar.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `News Feed`** (1 nodes): `NewsFeed.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Supabase DB Client`** (1 nodes): `db.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auth Library`** (1 nodes): `auth.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `SVG File Icon`** (1 nodes): `File Icon SVG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `SVG Globe Icon`** (1 nodes): `Globe Icon SVG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `SVG Window Icon`** (1 nodes): `Window Icon SVG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Coding Standards`** (1 nodes): `$coding-standards skill`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CODEX.md (Codex/Cursor skill routing)` connect `Claude/Codex Routing` to `Agent Skills & Docs`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `Polymarket India — shared agent rules` connect `Agent Skills & Docs` to `Claude/Codex Routing`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `POST()` connect `LMSR Math Core` to `Market Proposal Flow`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `POST()` (e.g. with `probability()` and `sharesForCost()`) actually correct?**
  _`POST()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Polymarket India` (e.g. with `Vercel Logo SVG` and `Next.js Logo SVG`) actually correct?**
  _`Polymarket India` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Next.js Project README`, `Orderbook Market (rejected alternative)`, `Rationale: LMSR chosen for live odds engagement` to the rest of the system?**
  _40 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `LMSR Math Core` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._