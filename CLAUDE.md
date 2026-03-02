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

### Authentication
- NextAuth configured with Neon PostgreSQL
- Executive accounts: mitchel@ariintegratedholdings.com, judy@..., curtis@...
- Protected routes: /executive/*, /investor/*

### Scheduling Components
- `CalendlyEmbed.tsx` - Responsive embed with clamp() heights
- `ExecMeetingBooking.tsx` - Executive Zoom meeting scheduler
- `MeetingTypeSelector.tsx` - Meeting type selection for investors

### Layout Components
- `Sheet.tsx/module.css` - Mobile slide-out menu (z-index: 80-81)
- `Navbar.tsx/module.css` - Sticky header (z-index: 70)

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
NEXT_PUBLIC_CALENDLY_EXEC_ZOOM_URL=  # Calendly executive meeting link
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

## Commands
```bash
cd web
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run ESLint
```

## Git Workflow
- Main branch: `main`
- Auto-deploys to Vercel on push
- Commit message format: `type: description`
  - fix: Bug fixes
  - feat: New features
  - chore: Maintenance
