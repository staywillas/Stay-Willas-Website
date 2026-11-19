<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Stay Willas: quick context

- This is the Stay Willas villa booking website. Preserve existing uncommitted work; check `git status` before edits and never assume local changes are deployed.
- For ongoing work, read [current status](docs/agent/current-work.md). For code locations, commands and data cautions, see [project map](docs/agent/project-map.md). Read only the parts relevant to the request.
- For property copy, prices and review claims, consult [business facts](docs/agent/business-facts.md) and verify current database/admin values when relevant. Never invent amenities, guest reviews, tax invoices, or cancellation/refund terms.
- The configured database can contain real bookings and live prices. Inspect the environment and impact before writes; preserve date-specific rates and guest data.
- At the end of meaningful ongoing work, update `docs/agent/current-work.md` briefly with the date, actual state, checks, remaining work and whether it was deployed. Remove stale details instead of accumulating a transcript. Update business facts only when confirmed.
