# Maintenance scripts

Scripts are run explicitly from the repository root. They are not part of `npm run dev` or the production build.

| Folder | Purpose |
| --- | --- |
| `assets/` | Image export, logo generation, and asset validation. Some tools need local source media. |
| `database/maintenance/` | One-off database updates for property records and image references. These write to PostgreSQL. |
| `database/destructive/` | Data cleanup that deletes records. Read the script and safeguards before use. |
| `reports/` | Report generation. |
| `seo/` | SEO maintenance utilities. |

## Database write safeguards

Database mutation tools require all of the following:

- `DATABASE_URL` points to the intended development database.
- `ALLOW_DATABASE_MUTATIONS=YES` is set deliberately.
- `CONFIRM_DATABASE_NAME` matches the database name in `DATABASE_URL` exactly.
- The operation-specific flag is set when the script asks for one.
- Production environments also require `ALLOW_PRODUCTION_DATABASE_WRITES=YES`.

For inquiry cleanup, use the default dry run first. Applying changes requires both `--apply` and `ALLOW_INQUIRY_PURGE=YES`. The Prisma seed additionally requires `ALLOW_DESTRUCTIVE_SEED=YES`; it deletes all current villa, booking, inquiry, and review rows before reseeding.

These flags prevent accidental execution; they do not make production data disposable. Confirm the target, scope, and backup before enabling a write.
