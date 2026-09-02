# Ari Integrated Holdings — Corporate Website & Investor Portal

Next.js 16 (App Router) site for Ari Integrated Holdings Inc.: public corporate pages, investor relations and disclosures, an email-alert list, and password-protected investor and executive dashboards.

## Correspondence routing

All inbound correspondence from the site is routed to the CTO, **Mitchel Carson — mitchelcarson@ariintegratedholdings.com**:

| Source | What happens |
| --- | --- |
| Contact form (`/contact` → `POST /api/contact`) | Emailed to the CTO with `Reply-To` set to the sender. Rate-limited and honeypot-protected. |
| Investor alert signup (`/investors#alerts`) | Subscriber gets a confirmation; the CTO gets a "new subscriber" notice. Rate-limited and honeypot-protected; addresses an executive deactivated are not silently re-enabled. |
| Investor broadcasts (executive dashboard) | Sent as one email per subscriber (addresses are never shared), reply-to the CTO. |
| Executive meeting notification (`POST /api/executive/meeting-notify`) | Sent to every executive in the database, with the CTO always included. |
| Every displayed email address and `mailto:` link | `CONTACT.email` from `src/lib/site.ts`. |

The destination can be overridden per deployment with `CORRESPONDENCE_EMAIL`; leave it unset to keep the CTO default. The old `RESEND_IR_EMAIL` variable is no longer read.

## Local setup

Use Node 22 (`.nvmrc`).

```bash
nvm use
npm install
cp env.local.example .env.local   # fill in values
npm run dev
```

Open `http://localhost:3000`.

## Environment

`env.local.example` is the canonical template. Production needs:

- `NEXT_PUBLIC_SITE_URL` — absolute public URL (used for email links, sitemap, Open Graph)
- `DATABASE_URL` — Neon PostgreSQL connection string
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (domain must be verified in Resend), `RESEND_FROM_NAME`
- `NEXT_PUBLIC_CALENDLY_*` — Calendly event URLs used by the scheduling components
- `CORRESPONDENCE_EMAIL` — optional override of the CTO routing default

Database helpers:

```bash
npm run db:migrate
npm run db:seed      # reads SEED_EXECUTIVES / SEED_PASSWORD; refuses to run in production
npm run db:studio
```

## Verification

```bash
npm run typecheck
npm run lint:src
npm run build
npm run verify     # all three
```

## Design system

The site follows an "institutional glass" direction: flat navy ground, three glass tiers, gold and silver (from the lion emblem) as the only chrome accents, and BTC / ETH / SOL brand colors used strictly for data encoding (chips, allocation ring, bars, chart series).

- Tokens and utilities: `src/app/globals.css`
- Fonts: Sora (display), Inter (body), JetBrains Mono (all financial figures)
- Site constants (name, tagline, CTO contact, 50 / 30 / 20 allocation): `src/lib/site.ts`
- UI primitives: `src/components/ui/` — `Button`, `Card`, `Input`/`Textarea`/`Select`, `SectionHeader`, `StatTile`, `Reveal`, `Toast`, `Sheet`, `Container`
- Brand primitives: `src/components/brand/` — `Logo`, `AssetChip`, `AllocationRing`, `AllocationBar`
- Layout: `src/components/layout/` — `Navbar`, `Footer`, `SiteBackground`, `PageHero`, `Section`, `DocumentPage`
- Dashboard primitives: `src/components/dashboard/` — `DashboardShell`, `DashboardHeader`, `DashboardPanel`, `MetricCard`, `MetricGrid`, `DataTable`, badges, empty/error states, Recharts wrappers

Brand assets live in `public/brand/` (cropped emblem marks) and `src/app/icon.png` / `apple-icon.png`. Open Graph and Twitter images are generated at `src/app/opengraph-image.tsx`.

## Treasury data

Treasury figures are manual and CFO-report sourced (`src/lib/treasury/snapshot.ts`). Every surface shows the as-of date, the source label, and the freshness state (stale after 14 days) until a live data pipeline exists.

## Trading backend contract

The trading system is intentionally separate from this repository. The executive dashboard includes a read-only placeholder only; no execution controls exist here. Future read-only endpoints expected from the backend:

- `/api/trading/status`
- `/api/trading/risk`
- `/api/trading/performance`
- `/api/trading/model-runs`
- `/api/trading/alerts`

Backend integration should start with status, risk, model-run, and alert summaries before any execution-related UI is considered.
