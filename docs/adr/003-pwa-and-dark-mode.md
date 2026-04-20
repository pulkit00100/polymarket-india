# ADR 003: Progressive Web App + Dark/Light Mode

**Date:** 2026-04-21  
**Status:** Accepted

## Context

User requested the app be installable on mobile phones and have a dark/light mode toggle.

## Decisions

### PWA: next-pwa over React Native / Expo

**Chosen:** `next-pwa` wrapping the existing Next.js app.

**Why:** Zero rewrite cost. The existing Next.js frontend becomes installable on Android and iOS via "Add to Home Screen". React Native / Expo would require rebuilding the entire UI — months of work vs. hours.

**Trade-offs:**
- PWA cannot access some native APIs (Bluetooth, NFC) — not needed here
- iOS PWA support is limited (no push notifications on Safari < 16.4) — acceptable for MVP
- Service worker is disabled in development (`disable: process.env.NODE_ENV === 'development'`) to avoid cache issues during local dev

**Files:**
- `public/manifest.json` — app name, icons, theme color
- `public/icon-192.png`, `public/icon-512.png` — installable icons
- `next.config.ts` — `withPWA()` wrapper

### Dark/Light Mode: next-themes over manual CSS

**Chosen:** `next-themes` with `attribute="class"` strategy.

**Why:** Next.js App Router renders `<html>` as a Server Component — you cannot toggle a class on it from a Client Component without hydration mismatch errors. `next-themes` handles this via `suppressHydrationWarning` + `ThemeProvider`, storing preference in `localStorage`.

**Trade-offs:**
- Requires `suppressHydrationWarning` on `<html>` — acceptable, it only suppresses the class attribute mismatch
- `enableSystem: false` — we default to dark (matches our fintech design), not the OS preference

**Files:**
- `src/app/providers.tsx` — `ThemeProvider` wrapping `SessionProvider`
- `src/app/layout.tsx` — `suppressHydrationWarning` on `<html>`
- `src/app/globals.css` — CSS variables for `--background`, `--foreground` per theme
- `src/components/Navbar.tsx` — `ThemeToggle` component (sun/moon SVG icons)
- `tailwind.config.ts` — `darkMode: 'class'`

## Palette (from ui-ux-pro-max, Fintech/Crypto profile)

| Token | Dark | Light |
|-------|------|-------|
| Background | `#0F172A` | `#F8FAFC` |
| Foreground | `#F1F5F9` | `#0F172A` |
| Card | `#1E293B` | `#FFFFFF` |
| Border | `#334155` | `#E2E8F0` |
| Primary | `#F59E0B` | `#F59E0B` |
| Accent | `#8B5CF6` | `#8B5CF6` |
