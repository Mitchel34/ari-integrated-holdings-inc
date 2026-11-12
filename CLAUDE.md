# Ari Integrated Holdings Inc. - Project Context

## Overview
Corporate website and investor dashboard for Ari Integrated Holdings Inc., a treasury management company holding ETF positions (ARKB, FSOL, FETH).

## Tech Stack
- **Framework:** Next.js 16 with App Router
- **Database:** Neon PostgreSQL (migrated from Supabase)
- **Auth:** NextAuth.js
- **Styling:** CSS Modules
- **Deployment:** Vercel (auto-deploy on push to main)
- **Scheduling:** Calendly integration for executive meetings

## Project Structure
```
web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── assets/            # Target assets page (BTC/ETH/SOL)
│   │   ├── executive/         # Executive dashboard (protected)
│   │   ├── investor/          # Investor dashboard (protected)
│   │   └── login/             # Authentication
│   ├── components/
│   │   ├── layout/            # Navbar, Footer
│   │   ├── scheduling/        # Calendly embeds
│   │   └── ui/                # Button, Card, Sheet, etc.
│   └── lib/
│       └── treasury/          # Financial data (snapshot.ts, prices.ts)
```

## Key Files

### Financial Data
- `src/lib/treasury/snapshot.ts` - ETF holdings (ARKB/FSOL/FETH), cash positions, share count
- Current holdings: $4,671.14 total assets, 300,008.7 shares outstanding

### Domain and Contact Email
- `ariintegratedholdings.com` is the only active business domain, for the website and for email. The old `ariholdings.com` domain is not in use; do not add addresses or links on it.
- `src/lib/contact.ts` holds them all: `SITE_DOMAIN`, `SITE_URL` (canonical `www` address), `CONTACT_EMAIL` (the one address shown on the site and the default destination for contact form inquiries), and `NO_REPLY_EMAIL` (default sender).
- Render the contact address with `components/ui/ContactEmail.tsx`, which lets the long address wrap after the "@".
- Outgoing mail needs `RESEND_API_KEY` and a sender domain verified in Resend; `RESEND_FROM_EMAIL` / `RESEND_FROM_NAME` override the default sender.

### Email Delivery
- `src/lib/email.ts` - Resend wrapper and all email templates. User input must go through `escapeHtml`. Every send returns a `SendOutcome` (`accepted` / `dry-run` / `failed`), never a bare boolean; a missing `RESEND_API_KEY` is a `failed` outcome, not a logged "success". `accepted` means the provider queued the message, not that it reached an inbox.
- `CORRESPONDENCE_EMAIL` (exported from `email.ts`) is where inquiries and internal notices go: env `CORRESPONDENCE_EMAIL`, else the older `RESEND_IR_EMAIL`, else `CONTACT_EMAIL`.
- Contact form → correspondence inbox with Reply-To set to the sender. Alert signup → confirmation to the subscriber plus a notice to the correspondence inbox. Meeting notifications → all executives plus the correspondence inbox (the request fails if the executive list cannot be loaded). Investor broadcasts → one email per subscriber, so addresses are never shared.
- Broadcasts go out in batches of 100 with permissive validation, so one address the provider refuses is counted as failed without sinking the batch. A batch the provider did not answer, throttled, or failed on is retried once with the same idempotency key; there is no per-recipient fallback. Counts reported and logged are provider acceptances.
- `src/lib/email-address.ts` - the one address check for the contact form, the alert signup, and Reply-To. It refuses characters that mean something in an address list or a `mailto:` link.
- `src/app/api/contact/route.ts` - validated, honeypot field `website`, per-inquiry reference `ARI-YYYYMMDD-XXXXXX`, rate-limited to 5 per hour per client. Only submissions about to be handed to the provider count against the limit (not typos, honeypot hits, or a deployment with no delivery configured). Responds 503 (delivery not configured) or 502 (provider refused), never `ok: true`, when the message was not accepted; `ContactForm.tsx` shows success only for `delivery: accepted` or `dry-run`, keeps the visitor's text otherwise, and offers a direct-email link with the reference.
- `src/app/api/executive/email-status/route.ts` - executive-only, presence-only view of the email configuration and the deployed commit.
- `EMAIL_DRY_RUN=1` logs instead of sending and is reported everywhere as not delivered; it is ignored in production builds.
- `src/app/investors/actions.ts` - alert signup: 5 valid signups per client per 15 minutes (in memory), 30 new or reactivated subscriptions per hour site-wide (counted in the database), one confirmation per address. Every successful signup gets the same answer, so the form cannot be used to test who is on the list; a failed confirmation is in the server log. `source` is limited to `ALERT_SIGNUP_SOURCES`.
- Tests (vitest, `tests/`): `email`, `email-address`, `contact-route`, `alert-signup`, `executive-routes`.

### Authentication
- NextAuth configured with Neon PostgreSQL
- Executive accounts: mitchel@ariintegratedholdings.com, judy@..., curtis@...
- Protected routes: /executive/*, /investor/*

### Scheduling Components
- `src/lib/scheduling.ts` - Contact-page Zoom meeting link and duration
- `CalendlyEmbed.tsx` - Inline Calendly widget, created with `Calendly.initInlineWidget` so it works in modals and when the URL changes
- `ZoomMeetingScheduler.tsx` + `ZoomMeetingModal.tsx` - Contact page: topic cards open a native `<dialog>` with the Calendly scheduler (Zoom link created on booking)
- `ExecMeetingBooking.tsx` - Executive Zoom meeting scheduler
- `MeetingTypeSelector.tsx` - Inline meeting type selection on the investor and executive dashboards

### Brand
- `public/brand/ari-mark.svg` - The lion mark: one vector file for every size. No text, filters, or external references inside it.
- `components/brand/AriLogo.tsx` - `AriMark` (the lion alone) and `AriLogo` (the lockup: mark, "ARI" in Cinzel capitals with a metallic gradient, and "Integrated Holdings" behind a hairline). The lockup scales from one number, the mark's height: pass `markSize`, or set `--ari-logo-size` on an ancestor so it can change per breakpoint. `--ari-logo-descriptor: none` hides "Integrated Holdings" where space is short.
- The lettering is `aria-hidden`; give the link or element around the logo its accessible name.
- `src/app/icon.svg`, `apple-icon.png`, and `favicon.ico` are the mark on a navy tile. They are generated from the mark, so regenerate all three if the mark changes.
- Used in: the header and mobile menu, the home hero (`AriMark`), the footer, and the sign-in card.

### Layout Components
- `Sheet.tsx/module.css` - Mobile slide-out menu (z-index: 80-81)
- `Navbar.tsx/module.css` - Sticky header (z-index: 70). Its height is fixed at 75px, and 88px from 768px up; sticky elements on the thesis and assets pages are offset against those numbers, so change them together. Links and account controls appear from 900px; below that they live in the menu. The full lockup shows from 1140px, and the links sit on the page's centre line from 1280px. `data-scrolled` (set once the page has moved 8px) fades in a near-solid backing plate.

## Interactive Components (Nov 2026)

### Target allocation
- `src/lib/allocation.ts` - Single source for the BTC/ETH/SOL target (weights, roles, copy, illustrative CAGR). Feeds the ring, mixer, thesis, and `/assets`.
- `components/allocation/AllocationRing.tsx` - Interactive 50/30/20 ring (Home hero, Thesis 01, `/assets`). Shows the **target**, not current holdings.
- `components/allocation/AssetsNav.tsx` - Ring as scroll-tracking navigation on `/assets`.

### Thesis guided read
- `app/thesis/page.tsx` + `thesis.module.css` - Seven chapters in one column; `components/thesis/ThesisRail.tsx` is the sticky chapter rail (desktop) / progress bar (mobile, z-index 60, below the navbar).
- `components/thesis/BasketMixer.tsx` - Weight sliders in section 06. Shows hypothetical performance; keep the disclosure text beside it.
- `src/lib/useScrollSpy.ts` - Shared scroll tracking for the rail and `/assets`.

### Other
- `components/harmony/HarmonyLoop.tsx` - Four-step loop on the Harmony page.
- `components/ui/Card.tsx` - Client component; pointer-following spotlight via `--spot-x/--spot-y`.
- Team cards use CSS subgrid so rows line up; bios are native `<details>`.

### Page transitions
- `components/layout/PageTransitions.tsx` intercepts internal link clicks (capture phase on `window`) and replays them through `router.push` inside `document.startViewTransition`. Styles are the `::view-transition-*` rules in `globals.css`.
- Skipped for: same-page hash links, `/api/*`, modified clicks, `prefers-reduced-motion`, and browsers without the View Transitions API.
- The ring's SVG has `view-transition-name: allocation-ring`. Render at most one `AllocationRing` per page or the transition is skipped.

## Recent Fixes (Mar 2026)

### Mobile Menu Stacking
- **Root cause:** `layout-wrapper` in `globals.css` had `z-index: 1` creating a stacking context that trapped Sheet
- **Fix:** Removed z-index from layout-wrapper

### Calendly Sizing
- **Root cause:** Desktop min-height was only 300px
- **Fix:** Increased to 600px (ExecMeetingBooking) and 700px (MeetingTypeSelector)

### CSS Stacking Context Rules
- Sheet overlay: z-index 80, position fixed
- Sheet content: z-index 81, position fixed
- Navbar: z-index 70, position sticky
- Do NOT add z-index to layout-wrapper - it breaks Sheet isolation

## Environment Variables
```
DATABASE_URL=           # Neon PostgreSQL connection string
NEXTAUTH_SECRET=        # NextAuth secret
RESEND_API_KEY=         # Required for any email delivery
RESEND_FROM_EMAIL=      # Optional sender override (defaults to no-reply@ariintegratedholdings.com)
RESEND_FROM_NAME=       # Optional sender name override
CORRESPONDENCE_EMAIL=   # Optional: where inquiries and notices go (defaults to CONTACT_EMAIL; RESEND_IR_EMAIL still works)
EMAIL_DRY_RUN=          # Local only: log instead of send, reported as not delivered
NEXT_PUBLIC_CALENDLY_EXEC_ZOOM_URL=  # Calendly executive meeting link
NEXT_PUBLIC_CALENDLY_ZOOM_MEETING_URL=  # Optional: contact page Zoom modal (defaults to calendly.com/mitchel-carson/30min)
```

## Common Issues

### Mobile menu content bleeding through
Check that `layout-wrapper` in `globals.css` does NOT have z-index set.

### Calendly appears too small
Check min-height values in:
- `ExecMeetingBooking.module.css` (.embedContainer)
- `MeetingTypeSelector.module.css` (.embedWrapper)

### Login 401 errors
Usually indicates DATABASE_URL misconfiguration or Neon connection issue.

### Emails not delivered
Sign in as an executive and open `/api/executive/email-status`. `apiKeyConfigured: false` means `RESEND_API_KEY` is unset on that deployment (the contact form then returns 503 and shows an error). A 502 means the provider refused the message, usually because the sender domain is not verified in Resend. Search the runtime logs for `[email]` lines by `ref=`; an `accepted` line carries the provider message id to look up in Resend's delivery events.

## Commands
```bash
cd web
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run ESLint (src, prisma, tests)
npm test         # Run the vitest suite (tests/)
npm run verify   # typecheck + lint + test + build
```

## Git Workflow
- Main branch: `main`
- Auto-deploys to Vercel on push
- Commit message format: `type: description`
  - fix: Bug fixes
  - feat: New features
  - chore: Maintenance
