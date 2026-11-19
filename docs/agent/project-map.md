# Project map

Last checked: 2026-11-20. Paths and commands describe the checkout, not necessarily production.

## Stack and local development

- Next.js 16 App Router, React 19, TypeScript, Prisma 7 with PostgreSQL (`src/lib/db.ts`), Clerk and Stripe. Use Node.js 20.9 or newer. Read the installed Next.js documentation required by the root `AGENTS.md` before code changes.
- `npm run dev` starts development; default Next port is 3000. This workspace has also used `http://localhost:3001`; check the running process before starting another server.
- `npx tsc --noEmit` checks types. `npx eslint <changed files>` gives a focused lint check. `npm run build` generates Prisma client and builds; builds and local pages can connect to the configured database.
- Start from `README.md`, `docs/development/architecture.md`, and `docs/development/data-management.md`. `.env.example` lists required variable names without values.
- Environment files may point at real services. Never print secrets, seed/reset a real database, or treat a dev server as an isolated database. Back up and verify scope before authorized data changes.

## Where to work

| Task | Starting points |
| --- | --- |
| Villa routes and metadata | `src/app/villa/[slug]/page.tsx`, `src/app/villas/slatewood/page.tsx`, `src/components/villa/property-editorial-details.tsx` |
| Villa descriptions and images | `src/data/property-editorial.ts`, `src/data/*-villa.ts`, `src/data/*-images.ts`, `public/assets/villas/` |
| Booking, availability and rates | `src/app/actions/booking.ts`, `src/components/villa/booking-card.tsx`, `src/components/villa/booking-modal-flow.tsx`, `src/lib/willow-selection.ts` |
| Admin and data model | `src/app/admin/`, `src/app/actions/admin.ts`, `prisma/schema.prisma`, `prisma/seed.ts` |
| Destination pages | `src/app/areas/`, `src/data/area-editorial.ts`, `src/components/areas/` |
| Guides, FAQs and SEO | `src/data/blogs.ts`, `src/data/villa-travel-guides.ts`, `src/data/guide-navigation.ts`, `src/data/faqs.ts`, `src/app/sitemap.ts`, `src/lib/schema.ts`, `next.config.ts` |
| Reviews | `src/app/actions/review.ts`, `src/components/villa/review-section.tsx`, `src/components/layout/google-reviews-section.tsx` |
| Policies | `src/app/cancellation-policy/page.tsx`, `src/data/faqs.ts` |
| Data ownership and storage | `prisma/schema.prisma`, `docs/development/data-management.md` |
| Maintenance utilities | `scripts/assets/`, `scripts/database/`, `scripts/README.md` |
| Brand and campaign source files | `assets/`; served runtime files remain in `public/assets/` |

`docs/README.md` indexes developer notes, research, SEO plans and visual references. Public website assets go in `public/assets/`; generated reports belong in the ignored `output/` directory.

## Working safely

- Check `git status` and preserve unrelated changes and assets. Do not stage, commit, push or deploy unrelated work. Confirm the requested destination and inspect the diff before publishing; report what is actually live.
- Price, review, availability, admin and schema paths can disagree. Trace the full flow when changing them; keep dated overrides intact and test representative cases without creating real bookings or sending notifications.
- The local checkout must use a development database. `prisma/seed.ts` and database maintenance scripts are gated because they can overwrite or delete persistent records.
- `.env.example` is safe to share; `.env`, `.env.production`, and `.env.local` are not. Never copy production secrets or guest data into a developer environment.
- Some historical seeded reviews are unverified and intentionally hidden from public property review data.
- If a claim or operation depends on unconfirmed property details, ask the user rather than guessing. See `business-facts.md` and the linked property fact sheet.
