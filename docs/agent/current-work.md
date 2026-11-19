# Current handoff

Snapshot: 2026-11-20. This describes the working checkout only. Check Git state, environment configuration, database target, and deployment state before continuing.

## Objective

Prepare the repository for a new developer with clearer structure, data ownership guidance, and safer local operations.

## Implemented in the working tree

- Grouped campaign/source media under `assets/` and maintenance scripts under `scripts/assets/` and `scripts/database/`. Updated known script and documentation paths. Local-only raw media remains excluded from Git.
- Replaced the starter README with project onboarding; added architecture, data-management, script-safety, and pull request guidance plus a secret-free `.env.example`.
- Removed hardcoded admin, partner, care PIN, and session-signing fallbacks. These sign-in paths now fail closed until unique environment values are configured; session secrets must be at least 32 characters.
- Database maintenance scripts now require explicit operation flags and an exact database-name confirmation. Inquiry cleanup defaults to a count-only dry run and no longer prints guest details. The Prisma seed and Slatewood upsert are gated as well.

## Checks and deployment

- No database schema migration or database write was performed. No real bookings, inquiry rows, rates, or guest files were changed.
- `npx tsc --noEmit`, focused ESLint for changed application and maintenance files, `node --check` for moved scripts, and `git diff --check` passed. No tests or production build were run in this structural pass.
- The local dev server remained available at `http://localhost:3000`; `/` and `/login?role=admin` returned HTTP 200. The login page no longer displays the old default credentials.
- The handoff work is isolated on `codex/developer-handoff-organization` for review; it has not been deployed. Existing unrelated working-tree changes were preserved and excluded.

## Follow-up

- Set unique development credentials and `SESSION_SECRET` in a local `.env` before using admin, partner, or care sign-in. Do not reuse production keys.
- Plan a separate, reviewed storage migration for exact currency types and private KYC/care-photo object storage; current schema stores floating-point prices and can store base64 care images.
- Existing unverified Google-review copy in the working tree still needs source verification before publication.
