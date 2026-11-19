# Application architecture

This document describes the code that exists today and the boundaries to follow when adding or refactoring features. It intentionally keeps Next.js route files in place: route folders are part of the website's URL contract.

## Current structure

```text
src/
  app/                 Next.js routes, route layouts, API handlers, and server actions
  components/           Shared UI grouped by product area
  data/                 Editorial content and static property presentation data
  lib/                  Cross-feature utilities and server integrations
prisma/                 PostgreSQL schema and explicit database utilities
public/assets/          Publicly served website media
assets/                 Brand, source, and campaign files that are not public URLs
scripts/
  assets/               Asset processing and validation
  database/
    maintenance/        Explicit database updates
    destructive/        High-impact data cleanup utilities
  reports/              Report generation
  seo/                  SEO maintenance
docs/                   Internal project and developer documentation
```

## Where code belongs

- Keep `src/app/<route>/page.tsx`, `layout.tsx`, `route.ts`, and framework loading/error files as thin route entry points. They define URLs and connect a route to application code.
- Keep reusable UI in the existing domain folders under `src/components/`. Put a component next to its feature when it is used only there; use `common/`, `ui/`, or `layout/` only for genuinely shared pieces.
- Keep cross-cutting, server-only utilities in `src/lib/`. Database queries that are reused or contain business rules should move into named domain functions instead of being repeated in page components.
- Keep editorial copy and static navigation data in `src/data/`. Do not put current rates, availability, customer records, or unverified reviews there.
- Put schema changes in `prisma/schema.prisma` and create a reviewed migration for them. Do not edit a production database by hand from an application page or script.
- Put one-off tools under the matching `scripts/` domain folder. Give each tool one purpose, document whether it reads or writes data, and require explicit safeguards for database mutations.
- Keep served media in `public/assets/` with property-specific, descriptive names. Moving a served file changes its public URL; update references and redirects deliberately.
- Keep source and campaign media in `assets/`. Do not use that folder for website URLs or guest documents.

## Change boundaries

For a small change, follow the existing structure. For larger feature work, split it into reviewable steps:

1. Define the owner and source of truth for the data.
2. Put business rules behind one server-side domain function.
3. Keep route components focused on access control, data loading, and page composition.
4. Update the project map and user-facing copy when behavior or confirmed facts change.
5. For a database change, prepare a migration and a rollback/restore plan before touching shared data.

Avoid moving entire route trees or changing public URLs as a formatting exercise. A phased refactor is easier to review and keeps the deployed site stable between changes.
