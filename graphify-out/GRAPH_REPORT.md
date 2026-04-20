# Graph Report - .  (2026-04-21)

## Corpus Check
- Corpus is ~27,798 words - fits in a single context window. You may not need a graph.

## Summary
- 272 nodes · 377 edges · 41 communities detected
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Agent & Skill Routing|Agent & Skill Routing]]
- [[_COMMUNITY_Workbox Cache Layer A|Workbox Cache Layer A]]
- [[_COMMUNITY_API Routes|API Routes]]
- [[_COMMUNITY_Architecture Decisions|Architecture Decisions]]
- [[_COMMUNITY_LMSR Pricing Engine|LMSR Pricing Engine]]
- [[_COMMUNITY_Project Config & Design System|Project Config & Design System]]
- [[_COMMUNITY_Workbox Cache Layer B|Workbox Cache Layer B]]
- [[_COMMUNITY_PWA & Dark Mode|PWA & Dark Mode]]
- [[_COMMUNITY_Workbox Cache Layer C|Workbox Cache Layer C]]
- [[_COMMUNITY_Workbox Cache Layer D|Workbox Cache Layer D]]
- [[_COMMUNITY_Bottom Navigation|Bottom Navigation]]
- [[_COMMUNITY_Market Card & Sparkline|Market Card & Sparkline]]
- [[_COMMUNITY_Service Worker|Service Worker]]
- [[_COMMUNITY_Root Layout|Root Layout]]
- [[_COMMUNITY_Home Page|Home Page]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]

## God Nodes (most connected - your core abstractions)
1. `GET()` - 23 edges
2. `CLAUDE.md — Claude skill routing rules` - 22 edges
3. `a` - 18 edges
4. `CODEX.md (Codex/Cursor skill routing)` - 17 edges
5. `v` - 15 edges
6. `z()` - 15 edges
7. `Polymarket India — shared agent rules` - 13 edges
8. `POST()` - 12 edges
9. `Polymarket India Design Spec` - 10 edges
10. `f()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Polymarket India` --conceptually_related_to--> `Vercel Logo SVG`  [INFERRED]
  README.md → public/vercel.svg
- `Polymarket India` --conceptually_related_to--> `Next.js Logo SVG`  [INFERRED]
  README.md → public/next.svg
- `App Icon SVG — rising prediction chart with amber (#F59E0B) line on dark background, PM watermark` --conceptually_related_to--> `Design System: Dark fintech palette — bg #0F172A, primary #F59E0B, accent #8B5CF6`  [INFERRED]
  public/icon.svg → CLAUDE.md
- `App Icon 192x192 PNG — installable PWA icon` --references--> `next-pwa library`  [EXTRACTED]
  public/icon-192.png → docs/adr/003-pwa-and-dark-mode.md
- `App Icon 512x512 PNG — installable PWA icon` --references--> `next-pwa library`  [EXTRACTED]
  public/icon-512.png → docs/adr/003-pwa-and-dark-mode.md

## Communities

### Community 0 - "Agent & Skill Routing"
Cohesion: 0.07
Nodes (34): .agents/skills/api-design/SKILL.md, CLAUDE.md (Claude skill routing), CODEX.md (Codex/Cursor skill routing), docs/adr/ (Architecture Decision Records), Next.js 16.2.4 (App Router), Polymarket India — shared agent rules, React 19.2.4, src/app/ (App Router directory) (+26 more)

### Community 1 - "Workbox Cache Layer A"
Cohesion: 0.1
Nodes (13): b(), d(), deleteCacheAndMetadata(), e(), et, f(), G, i (+5 more)

### Community 2 - "API Routes"
Cohesion: 0.12
Nodes (5): GET(), a, c(), h(), k()

### Community 3 - "Architecture Decisions"
Cohesion: 0.11
Nodes (26): ADR-0001: LMSR AMM over Parimutuel, ADR-0002: Next.js Monolith over Microservices, ADR-0003: Supabase over Custom PostgreSQL, ADR-0004: Virtual Coins over Real Money, ADR Index, LMSR (Logarithmic Market Scoring Rule) AMM, Market Lifecycle (propose→pending→open→resolved), NewsAPI Integration (+18 more)

### Community 4 - "LMSR Pricing Engine"
Cohesion: 0.1
Nodes (9): cost(), marketCost(), probability(), sharesForCost(), fetchNewsByKeywords(), update(), calcPayout(), PATCH() (+1 more)

### Community 5 - "Project Config & Design System"
Cohesion: 0.09
Nodes (22): AGENTS.md — Next.js breaking changes warning, CLAUDE.md — Claude skill routing rules, Design System: Dark fintech palette — bg #0F172A, primary #F59E0B, accent #8B5CF6, Graphify Graph Report — 121 nodes, 110 edges, App Icon SVG — rising prediction chart with amber (#F59E0B) line on dark background, PM watermark, $architecture-decision-records skill, $api-design skill, $backend-patterns skill (+14 more)

### Community 6 - "Workbox Cache Layer B"
Cohesion: 0.26
Nodes (6): m(), st(), T(), U(), v, y

### Community 7 - "PWA & Dark Mode"
Cohesion: 0.12
Nodes (14): ADR-003: PWA + Dark/Light Mode, Dark/Light Mode toggle feature, src/app/globals.css — CSS variables per theme, App Icon 192x192 PNG — installable PWA icon, App Icon 512x512 PNG — installable PWA icon, src/app/layout.tsx — suppressHydrationWarning on html, public/manifest.json — PWA manifest, src/components/Navbar.tsx — ThemeToggle component (+6 more)

### Community 8 - "Workbox Cache Layer C"
Cohesion: 0.21
Nodes (2): $(), z()

### Community 9 - "Workbox Cache Layer D"
Cohesion: 0.27
Nodes (3): j(), q(), r

### Community 10 - "Bottom Navigation"
Cohesion: 0.4
Nodes (0): 

### Community 11 - "Market Card & Sparkline"
Cohesion: 0.67
Nodes (2): generateSparkPoints(), Sparkline()

### Community 12 - "Service Worker"
Cohesion: 1.0
Nodes (2): a(), r()

### Community 13 - "Root Layout"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Home Page"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Community 16"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Community 18"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (2): src/app/api/cron/resolve/route.ts (cron endpoint), CRON_SECRET (cron auth token)

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (2): .env.local (local secrets), .env.local.example (secrets template)

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Community 23"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Community 25"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Community 31"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Community 32"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Community 33"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Community 34"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Community 35"
Cohesion: 1.0
Nodes (1): File Icon SVG

### Community 36 - "Community 36"
Cohesion: 1.0
Nodes (1): Globe Icon SVG

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (1): Window Icon SVG

### Community 38 - "Community 38"
Cohesion: 1.0
Nodes (1): $coding-standards skill

### Community 39 - "Community 39"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "Community 40"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **67 isolated node(s):** `Next.js Project README`, `Orderbook Market (rejected alternative)`, `Rationale: LMSR chosen for live odds engagement`, `Rationale: Virtual coins to avoid Indian gambling regulation`, `Rationale: Supabase for managed DB with dashboard` (+62 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Root Layout`** (2 nodes): `RootLayout()`, `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Home Page`** (2 nodes): `getFeaturedMarkets()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (2 nodes): `AdminMarketRow()`, `AdminMarketRow.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (2 nodes): `getLeaderboard()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (2 nodes): `getMarket()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (2 nodes): `BetForm()`, `BetForm.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (2 nodes): `src/app/api/cron/resolve/route.ts (cron endpoint)`, `CRON_SECRET (cron auth token)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (2 nodes): `.env.local (local secrets)`, `.env.local.example (secrets template)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (2 nodes): `getUserBets()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (1 nodes): `vitest.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (1 nodes): `eslint.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (1 nodes): `next.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (1 nodes): `next-auth.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (1 nodes): `route.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (1 nodes): `resolution.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (1 nodes): `lmsr.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (1 nodes): `NewsFeed.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (1 nodes): `db.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (1 nodes): `auth.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (1 nodes): `File Icon SVG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (1 nodes): `Globe Icon SVG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (1 nodes): `Window Icon SVG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (1 nodes): `$coding-standards skill`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (1 nodes): `seed-markets.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `GET()` connect `API Routes` to `Workbox Cache Layer A`, `LMSR Pricing Engine`, `Workbox Cache Layer B`, `Workbox Cache Layer C`, `Workbox Cache Layer D`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `POST()` connect `LMSR Pricing Engine` to `API Routes`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `CLAUDE.md — Claude skill routing rules` connect `Project Config & Design System` to `Architecture Decisions`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Are the 17 inferred relationships involving `GET()` (e.g. with `fetchNewsByKeywords()` and `POST()`) actually correct?**
  _`GET()` has 17 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Next.js Project README`, `Orderbook Market (rejected alternative)`, `Rationale: LMSR chosen for live odds engagement` to the rest of the system?**
  _67 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Agent & Skill Routing` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Workbox Cache Layer A` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._