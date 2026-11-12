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
- `RESEND_API_KEY` (without it nothing is sent, and the contact form reports the failure instead of faking success)
- Calendly URLs used by scheduling components

Inquiries and internal notices go to the contact address in `src/lib/contact.ts`; `CORRESPONDENCE_EMAIL` overrides it per deployment. `EMAIL_DRY_RUN=1` logs messages instead of sending them in local development and is always reported as not delivered. Executives can check a deployment's email configuration at `/api/executive/email-status`.

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
npm test
npm run build
npm run verify
```

`npm run lint` is scoped to `src`, `prisma`, and `tests` so generated build artifacts are not linted. `npm test` runs the vitest suite in `tests/` (email delivery outcomes, address validation, the contact route, the alert signup, and the executive email routes).

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
