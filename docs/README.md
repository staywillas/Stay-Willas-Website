# Stay Willas documentation

Use this folder for internal notes and research. Public files that guests need belong under `public/assets/`; keep the food menu PDFs in `public/assets/menus/` so the site links remain stable.

## Folder guide

- `development/` — application architecture, data ownership, and database safety for developers joining the project.
- `agent/` — concise project map, confirmed business facts, and current handoff for future chats. Start with `agent/current-work.md` for active work.
- `lonavala-property-facts.md` — confirmed Lonavala property comparison and outstanding checks.
- `site/analysis/` — site audits and technical analysis.
- `site/design/` — page, layout, and visual implementation plans.
- `seo/angle-house/`, `seo/canopy-crest/`, `seo/willow-peak/` — property search plans and keyword notes.
- `seo/keyword-exports/` — dated keyword planner CSV exports.
- `research/angle-house/` — property-specific research data.
- `research/site-audits/` — site-wide exports and audit data.
- `drafts/` — unpublished editorial drafts.
- `previews/` — screenshots and local review artifacts.

For repository setup and the high-level code map, start at the root [README](../README.md). Maintenance script behavior and database safeguards are documented in [`scripts/README.md`](../scripts/README.md).

## Adding documents

Put future keyword exports in `seo/keyword-exports/`, property research in the matching `research/<property>/` folder, and site plans in `site/design/` or `site/analysis/`. Use descriptive filenames with a date in `YYYY-MM-DD` format when a document is tied to a specific review or campaign.
