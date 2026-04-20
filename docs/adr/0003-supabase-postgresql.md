# ADR-0003: Supabase over Custom PostgreSQL

**Date**: 2026-04-18
**Status**: accepted
**Deciders**: Pulkit

## Context

The app needs a relational database for users, markets, bets, and market state. Bet placement requires atomic transactions. We need auth user creation on first Google login.

## Decision

We use Supabase as a managed PostgreSQL host. Direct Supabase JS client used server-side with service role key. No Supabase Auth — NextAuth.js handles authentication separately.

## Alternatives Considered

### Alternative 1: Raw PostgreSQL on Railway/Render
- **Pros**: Full control, cheaper at scale
- **Cons**: Manual backups, connection pooling, no dashboard UI
- **Why not**: Supabase gives dashboard, SQL editor, and backups for free

### Alternative 2: PlanetScale (MySQL)
- **Pros**: Branching, serverless connections
- **Cons**: MySQL not PostgreSQL, no array types (needed for `news_keywords[]`)
- **Why not**: PostgreSQL arrays and enums are core to our schema

### Alternative 3: MongoDB
- **Pros**: Flexible schema
- **Cons**: ACID transactions harder, no native enum types, poor fit for financial data
- **Why not**: Bet placement needs strict transactions — relational is the right fit

## Consequences

### Positive
- Free tier covers MVP comfortably
- SQL editor in dashboard for quick queries
- Automatic backups and point-in-time recovery

### Negative
- Supabase service role key must never reach the browser — enforced in `db.ts`
- Free tier has connection limits — may need pgBouncer at scale
