@AGENTS.md

# Codex Skill Router (keep consistent with Claude)

Use this file like `CLAUDE.md`, but for **Codex CLI + Cursor**. It maps common tasks to the repo-local skills in `.agents/skills/` so coding style stays consistent across tools.

## Backend / API work

Use:
- `$backend-patterns` for overall backend structure
- `$api-design` for endpoint design (resources, status codes, pagination, error envelopes)
- `$postgres-patterns` for query/index/perf patterns
- `$database-migrations` for schema + migration changes

Also run a silent-failure pass when you changed error handling:
- `$silent-failure-hunter`

## Frontend / Next.js

Use:
- `$frontend-patterns` for component structure and state patterns
- `$nextjs-turbopack` for Next.js 16 specifics and gotchas

For UI polish and design-system consistency:
- `$ui-ux-pro-max`

## Security

Use `$security-review` when touching:
- `src/app/api/**`
- auth/session logic
- bet placement / payouts / anything money-adjacent

## Docs & decisions

Use:
- `$documentation-lookup` before implementing unfamiliar library behavior
- `$architecture-decision-records` when choosing between real alternatives (write/update ADRs in `docs/adr/`)
- `$codebase-onboarding` at the start of a session or after major changes

## Testing & verification

Use:
- `$tdd-workflow` for new features/bug fixes (tests live in `src/tests/`; run `npm test`)
- `$verification-loop` before PRs / before you say “done”

## PR review

Use:
- `$code-reviewer` for general review against repo conventions
- `$silent-failure-hunter` for error-handling / fallback audits

## Claude name mapping (don’t edit CLAUDE.md)

If `CLAUDE.md` mentions these, use the Codex equivalents:
- `...:tdd-guide` → `$tdd-workflow`
- `...:docs-lookup` → `$documentation-lookup`
- `...:database-reviewer` → `$postgres-patterns` (+ `$database-migrations` if schemas change)
- `...:typescript-reviewer` → `$coding-standards`

## Knowledge graph

Use `$graphify` to build/update a repo graph when you’re lost or starting fresh.

