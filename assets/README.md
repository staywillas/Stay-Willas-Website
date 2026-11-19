# Asset storage

- `brand/` contains approved source brand files used to generate web-ready versions.
- `marketing/` contains campaign exports organized by property and output format.
- `source/` contains non-public source media. The local-only sources are excluded from Git because they are large working files; see `source/local-only/README.md`.
- Website URLs must reference files under `public/`, not this directory. Keep private guest documents out of both `assets/` and `public/`.
