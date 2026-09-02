# Ari Integrated Holdings Inc. - Project Context

## Overview
Corporate website and investor dashboard for Ari Integrated Holdings Inc., a digital-asset treasury company holding BTC / ETH / SOL exposure through ETF positions (ARKB, FETH, FSOL) with a 50 / 30 / 20 target allocation.

## Tech Stack
- **Framework:** Next.js 16 with App Router (React 19, TypeScript strict)
- **Database:** Neon PostgreSQL via Prisma 7 (`@prisma/adapter-pg`)
- **Auth:** NextAuth.js v4 (credentials, JWT sessions); route protection in `src/proxy.ts` (Next 16 "proxy", formerly middleware)
- **Styling:** CSS Modules + design tokens in `src/app/globals.css` (no Tailwind)
- **Fonts:** Sora (display), Inter (body), JetBrains Mono (financial figures) via `next/font/google`
- **Email:** Resend (`src/lib/email.ts`)
- **Scheduling:** Calendly embeds
- **Deployment:** Vercel (auto-deploy on push to main)

## Correspondence Routing (important)
All inbound correspondence is routed to the CTO: **Mitchel Carson <mitchelcarson@ariintegratedholdings.com>**.
- Single source of truth: `CONTACT` in `src/lib/site.ts`. Never hard-code another address.
- `src/lib/email.ts` exports `CORRESPONDENCE_EMAIL` (env `CORRESPONDENCE_EMAIL` override, defaults to the CTO).
- Contact form → CTO (reply-to sender). Alert signups → subscriber confirmation + CTO notice. Meeting notifications → all executives + CTO.
- Do not reintroduce `ariholdings.com`, `investor-relations@…`, or `contact@…` anywhere.

## Project Structure
```
src/
├── app/                          # App Router pages
│   ├── api/                      # Route handlers (contact, disclosures, treasury, executive/*)
│   ├── executive/                # Executive dashboard, settings, subscribers (protected)
│   ├── investor/dashboard/       # Investor dashboard (protected)
│   ├── login/                    # Sign-in
│   ├── (public pages)            # thesis, harmony, team, investors, disclosures, contact, privacy, terms, disclaimer
│   ├── layout.tsx                # Fonts, metadata defaults, SiteBackground, Navbar, Footer
│   ├── globals.css               # Design tokens + utilities (.eyebrow, .mono, .glass-1/2/3, .hairline)
│   ├── sitemap.ts / robots.ts / manifest.ts / opengraph-image.tsx / not-found.tsx
├── components/
│   ├── brand/                    # Logo, AssetChip, AllocationRing, AllocationBar
│   ├── ui/                       # Button, Card, Input/Textarea/Select, SectionHeader, StatTile, Reveal, Toast, Sheet, Container
│   ├── layout/                   # Navbar, Footer, SiteBackground, PageHero, Section, DocumentPage
│   ├── dashboard/                # Dashboard primitives + Recharts wrappers
│   ├── scheduling/               # CalendlyEmbed, MeetingTypeSelector, ExecMeetingBooking
│   ├── investor/                 # AlertSignupForm
│   └── auth/                     # LoginForm, AuthSessionProvider
└── lib/
    ├── site.ts                   # SITE, CONTACT (CTO), ALLOCATION, PRIMARY_NAV, getSiteUrl()
    ├── email.ts                  # Resend wrapper, templates, escapeHtml, CORRESPONDENCE_EMAIL
    ├── treasury/snapshot.ts      # ETF holdings, cash, share count (manual CFO data)
    └── investor/disclosures.ts   # Disclosures, documents, events (static data)
```

## Design System ("institutional glass")
- Flat navy ground (`--bg-0/1/2`), three glass tiers (`Card` variants `subtle` / `glass` / `elevated`, or `.glass-1/2/3`).
- Gold (`--gold-300/500/700`) and silver are the only chrome accents. Eyebrows use `.eyebrow` (solid gold). At most one gradient-text element per page (`.text-gradient-silver` on the Home hero h1).
- BTC / ETH / SOL colors (`--btc`, `--eth`, `--sol` + `-text/-a15/-a40`) are **data-only**: `AssetChip`, `AllocationRing`, `AllocationBar`, card `accent` rails, chart series. Never in backgrounds, buttons, headings, or glows.
- All financial numbers use `--font-mono` with `tabular-nums`; show an "as of · source" line and the freshness state (`getTreasuryFreshness`) under live figures. No abbreviated values, no count-ups, no fabricated data.
- Interior pages start with `PageHero`; sections use `Section`; long-form legal/disclosure pages use `DocumentPage`.
- Motion: `Reveal` for entrance, `--dur-*` / `--ease-*` tokens; everything respects `prefers-reduced-motion`.

## Key Files
- `src/lib/treasury/snapshot.ts` — holdings and cash (as of 1 Mar 2026: $4,671.14 total assets, 300,008.7 shares outstanding). Update here when a new CFO report arrives.
- `src/lib/site.ts` — brand strings, CTO contact, allocation targets, primary nav.
- `src/lib/email.ts` — all email templates (user input must go through `escapeHtml`).
- `src/app/api/contact/route.ts` — validated, rate-limited (5/hour/IP), honeypot field `website`.

## CSS Stacking Context Rules
- `SiteBackground`: fixed, `z-index: var(--z-ambient)` (0), pointer-events none
- Navbar: sticky, `z-index: var(--z-nav)` (70)
- Sheet overlay / content: fixed, `var(--z-sheet)` (80 / 81)
- Toasts: `var(--z-toast)` (90)
- Do NOT add `z-index` to `.layout-wrapper` in `globals.css` — it creates a stacking context that traps the Sheet.

## Calendly Sizing
- `ExecMeetingBooking.module.css` `.embedContainer`: 900px desktop / 700px tablet / 550px mobile (explicit heights)
- `MeetingTypeSelector.module.css` `.embedWrapper`: min-height 700px desktop / 500px tablet / clamp on mobile

## Environment Variables
```
NEXT_PUBLIC_SITE_URL=                 # https://ariintegratedholdings.com
DATABASE_URL=                         # Neon PostgreSQL connection string
NEXTAUTH_SECRET= / NEXTAUTH_URL=
RESEND_API_KEY= / RESEND_FROM_EMAIL= / RESEND_FROM_NAME=
CORRESPONDENCE_EMAIL=                 # optional override; defaults to the CTO
NEXT_PUBLIC_CALENDLY_EXEC_ZOOM_URL=   # + EXEC_INTRO / INVESTOR_BRIEFING / PARTNERSHIP
```

## Common Issues
- **Mobile menu content bleeding through:** check `.layout-wrapper` has no z-index.
- **Calendly appears too small:** check the heights listed above.
- **Login 401 errors:** usually `DATABASE_URL` misconfiguration or a Neon connection issue.
- **Emails not delivered:** `RESEND_API_KEY` unset (emails are logged to the console instead) or the from-domain is not verified in Resend.
- **ESLint React Compiler rules:** no `setState` directly inside `useEffect` bodies; no reassigning variables during render (use `reduce`/`map`).

## Commands
```bash
npm run dev        # Start dev server
npm run typecheck  # tsc --noEmit
npm run lint:src   # ESLint on src + prisma
npm run build      # prisma generate && next build
npm run verify     # typecheck + lint + build
```

## Git Workflow
- Main branch: `main`; auto-deploys to Vercel on push
- Commit message format: `type: description` (`feat`, `fix`, `chore`, `docs`)
