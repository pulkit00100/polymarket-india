# ADR-0002: Next.js Monolith over Microservices

**Date**: 2026-04-18
**Status**: accepted
**Deciders**: Pulkit

## Context

Polymarket India needs a web frontend, REST API, authentication, cron-based market resolution, and a news feed. The team is a single developer building an MVP targeting ~100 initial users.

## Decision

We use a single Next.js 16 App Router monolith deployed on Vercel. Frontend pages, API routes, auth, and cron handlers all live in one codebase.

## Alternatives Considered

### Alternative 1: Microservices (separate API + frontend)
- **Pros**: Independent scaling, technology flexibility per service
- **Cons**: Operational overhead, inter-service networking, multiple deployments
- **Why not**: Massive overkill for a single developer MVP with 100 users

### Alternative 2: Next.js + Separate Express API
- **Pros**: Clear separation of concerns
- **Cons**: Two repos, two deployments, CORS configuration
- **Why not**: Next.js API routes handle everything we need without the overhead

## Consequences

### Positive
- One repo, one deployment, one set of env vars
- Vercel cron jobs handle market resolution natively
- Shared TypeScript types between frontend and API

### Negative
- Harder to scale API independently from frontend if traffic spikes
- All-or-nothing deployment (can't deploy API fix without redeploying frontend)

### Risks
- If app grows significantly, extraction to separate services is possible but requires refactoring
