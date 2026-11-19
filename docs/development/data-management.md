# Data management and storage

Use this guide before changing Prisma models, pricing, booking flows, guest information, reviews, or files.

## Sources of truth

| Data | Current source of truth | Rule |
| --- | --- | --- |
| Villas, bookings, inquiries, operational reviews, dated rates | PostgreSQL through Prisma (`prisma/schema.prisma`) | Read current records when a task depends on live values. Never seed or reset production. |
| Daily and seasonal rate overrides | `DailyPrice` and `SeasonalPrice` rows | Preserve date-specific overrides; do not replace a property's rates with a single base rate. |
| Public editorial copy, FAQs, guides, fixed presentation fallbacks | `src/data/` | Keep only content that is intentionally source-controlled. Avoid duplicating live prices or availability here. |
| Public photos and PDFs | `public/assets/` | These files are web-accessible. Do not put private guest files here. |
| Brand and campaign source files | `assets/` | Not served by Next.js. Large working source collections may be excluded from GitHub. |
| Credentials and service keys | Local `.env` or an approved secret manager | Never commit values, expose them in logs, or copy production keys into a developer machine. |

## Database change process

1. Confirm the target database is a development branch and record its database name without exposing the connection URL.
2. Inspect the schema and migration history. Back up shared data before a destructive or type-changing operation.
3. Change the Prisma schema and add a migration that preserves existing rows.
4. Validate the migration on a disposable branch or restored backup before applying it elsewhere.
5. Update the domain query/write code and docs in the same change.
6. Do not run `prisma/seed.ts` on production. The seed deletes existing villa, booking, inquiry, and review rows before inserting fixture data.

The one-off database scripts under `scripts/database/` require explicit opt-in variables and the exact target database name. The inquiry cleanup also requires `--apply`. These safeguards are not a substitute for a backup or approval of a real-data change.

## Storage practices

- Store prices as exact decimal values or integer minor units in a future, reviewed migration. The current schema uses floating-point price columns; do not change their types without a conversion plan.
- Use constrained enums or validated constants for roles, inquiry types, and booking statuses when the existing values have been inventoried and migrated. Do not silently rename persisted status strings.
- Keep relational data relational. JSON columns are appropriate for small, versioned snapshots; avoid using them as an unbounded substitute for related records.
- Store uploaded identity documents and operational photos in private object storage with access controls and a retention policy. Store a private object key/reference in PostgreSQL, not a public URL or base64 payload.
- The current `CareLog.images` field can contain base64 strings, and booking KYC data is stored on the booking record. Plan a separate storage migration before expanding these flows; this refactor does not move or rewrite existing records.
- Log record counts and operation IDs, not guest names, contact details, identification data, message bodies, or uploaded content.
- Validate and authorize every write at the server boundary. Use transactions for multi-row operations whose records must succeed or fail together.

## Local environment

Copy `.env.example` to `.env`, then supply development-only values. The application currently has no configured admin, partner, care PIN, or session secret in this checkout; sign-in fails closed until these are configured. Generate a unique `SESSION_SECRET` with:

```powershell
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

Do not use the generated example secret in production or share it in chat or source control.
