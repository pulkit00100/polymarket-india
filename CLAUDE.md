@AGENTS.md

## Backend Patterns

Use `/everything-claude-code:api-design` and `/everything-claude-code:backend-patterns` skills for all API/backend work:
- Resource-based URLs, correct HTTP status codes
- Repository pattern for Supabase data access
- Service layer for business logic (LMSR, resolution, news)
- Centralized error handler with `ApiError` class
- Structured logging on all API routes

## Frontend Patterns

Use `/everything-claude-code:frontend-patterns` skill for all React/Next.js component work:
- Composition over inheritance for components
- `useQuery` custom hook for data fetching
- `React.memo` + `useCallback` for performance
- Controlled forms with validation
- Error boundaries around page-level components

## Architecture Decisions

Use `/everything-claude-code:architecture-decision-records` to document WHY decisions were made:
- Triggered when choosing between significant alternatives (framework, pattern, DB design)
- ADRs live in `docs/adr/` — check there first when asking "why did we choose X?"
- Record decisions for: LMSR vs parimutuel, Next.js monolith, Supabase, auth strategy
- Already made decisions should be backfilled as ADRs in Phase 1

## Documentation

Use `/everything-claude-code:codebase-onboarding` when:
- Starting a new session to quickly understand current state
- After completing a phase to document what was built

Use `/everything-claude-code:documentation-lookup` to fetch live docs for any library before implementing.

## Testing

Use `/everything-claude-code:tdd-guide` for all new features — write failing tests first, then implement.
Test files live in `src/tests/`. Run with `npm test`.

## Database

Use `/everything-claude-code:database-reviewer` when writing SQL migrations or Supabase queries:
- Select only needed columns (never `select('*')`)
- Avoid N+1 queries — batch fetch with `in` filters
- Use Supabase RPC for transactions (bet placement must be atomic)

## TypeScript

Use `/everything-claude-code:typescript-reviewer` after writing new types or interfaces.

## Docs Lookup

Use `/everything-claude-code:docs-lookup` before implementing Next.js 16 App Router features —
AGENTS.md warns this version has breaking changes from training data.

## Knowledge Graph

Use `/graphify` skill to build/update the knowledge graph when:
- Starting a new session (run `/graphify . --update` to get context)
- After completing a phase (captures new files into graph)
- When lost in the codebase — query the graph instead of re-reading files

## Design Reference

Match styles from `/Users/pulkitji/Desktop/brainstorm-session/.superpowers/brainstorm/47173-1776523692/content/mockup-home-v2.html`:
- Background: `#0F172A`, Primary: `#F59E0B`, Accent: `#8B5CF6`
- Fonts: Fira Code (numbers/mono), Fira Sans (body)
- Dark fintech aesthetic
