# Ari Integrated Holdings Frontend

Next.js 16 frontend for Ari Integrated Holdings investor relations, executive operations, treasury reporting, and future read-only trading-system status surfaces.

## Local Setup

Use Node 22 from `.nvmrc`.

```bash
nvm use
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Use `env.local.example` as the canonical template. Required production-style values include:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `RESEND_API_KEY`
- Calendly URLs used by scheduling components

Database helpers:

```bash
npm run db:migrate
npm run db:seed
npm run db:studio
```

## Verification

```bash
npm run typecheck
npm run lint:src
npm run build
npm run verify
```

`npm run lint` is scoped to `src` and `prisma` so generated build artifacts are not linted.

## Dashboard Architecture

Shared dashboard primitives live in `src/components/dashboard`:

- `DashboardShell`, `DashboardHeader`, `DashboardPanel`
- `MetricCard`, `MetricGrid`, `DataTable`
- `StatusBadge`, `FreshnessBadge`, `EmptyState`, `ErrorState`
- Recharts wrappers for allocation and value charts

Treasury data is currently manual and CFO-report sourced. UI surfaces must show source and freshness state until a live data pipeline is integrated.

## Trading Backend Contract

The trading system is intentionally separate from this repository. The executive dashboard includes a read-only placeholder only; no execution controls exist here.

Future read-only endpoints expected from the backend:

- `/api/trading/status`
- `/api/trading/risk`
- `/api/trading/performance`
- `/api/trading/model-runs`
- `/api/trading/alerts`

Backend integration should start with status, risk, model-run, and alert summaries before any execution-related UI is considered.
