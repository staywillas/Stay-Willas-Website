# Stay Willas Website

Stay Willas is a villa discovery and booking website for homes in Maharashtra. The application uses Next.js 16 App Router, React 19, TypeScript, Prisma 7, PostgreSQL, Clerk, and Stripe.

## Start locally

### Requirements

- Node.js 20.9 or newer
- npm
- Access to a **development** PostgreSQL database, plus the service keys needed for the feature being worked on

### Setup

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env` if you do not already have a local environment file. Never overwrite an existing `.env`.
3. Fill in the required values using a development database and test service keys. Do not connect local development to production data.
4. Start the website with `npm run dev` and open [http://localhost:3000](http://localhost:3000).

The public catalogue and booking routes read the configured database. Starting the local server does not create an isolated database. Do not run a seed or maintenance script against production.

## Project map

| Path | Purpose |
| --- | --- |
| `src/app/` | Next.js routes, layouts, route handlers, and server actions. Route folder names define public URLs. |
| `src/components/` | Reusable UI grouped by product area, such as `villa/`, `areas/`, `booking/`, and `layout/`. |
| `src/data/` | Reviewed editorial copy, static guide/FAQ content, and fallback presentation data. It is not the source of truth for live prices or availability. |
| `src/lib/` | Shared server utilities, authentication/session helpers, database access, pricing, notifications, and schema helpers. |
| `prisma/` | Database schema, seed script, and one-off database setup utilities. Read the data guide before changing this area. |
| `public/assets/` | Files served by the website. Their public URLs are part of the site, so keep existing paths stable. |
| `assets/` | Brand and campaign source assets that are not served directly by Next.js. Some source collections are intentionally local-only. |
| `scripts/` | Explicitly invoked asset, SEO, report, and database maintenance scripts. Database writes have safeguards; see `scripts/README.md`. |
| `docs/` | Internal project notes, developer guidance, business facts, research, plans, and visual previews. |
| `.github/` | GitHub pull request guidance. |

For the current code map and operating cautions, see [`docs/agent/project-map.md`](docs/agent/project-map.md). Start with [`docs/development/architecture.md`](docs/development/architecture.md) and [`docs/development/data-management.md`](docs/development/data-management.md) when onboarding.

## Common commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run build` | Generate the Prisma client and build the production app. |
| `npm run start` | Serve a previously built production app. |
| `npm run lint` | Run ESLint. |
| `npx tsc --noEmit` | Check TypeScript types. |

Database migrations, seeds, and maintenance scripts are not routine setup commands. Review their documented safeguards and target database before using them.

## Data and security rules

- Use a dedicated local or development database branch. Never paste real guest data into issues, examples, logs, or screenshots.
- Keep credentials in an ignored local environment file or an approved secret manager. `.env.example` contains names only, never credentials.
- Do not store raw identity documents or image payloads in public assets. See the data guide for the current schema and the migration work still needed.
- Verify live prices, availability, reviews, and property claims from their current source before editing public copy.
- Preserve existing uncommitted changes. Review `git status` and the diff before committing or opening a pull request.
