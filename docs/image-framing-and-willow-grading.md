# Image framing and Willow Peak grading

## Current framing plan and implementation

Updated 11 October 2026 to fill image cards with controlled cropping, following the revised visual direction.

- Use one sharp photo with object-fit cover in every shared card frame; remove the duplicate blurred backdrop and empty bands.
- Use 4:3 frames for the homepage collection, pool/Jacuzzi cards, guide thumbnails and featured-stay cards. Keep the weekday group photos at their near-native 4:3 ratio.
- Set photo-specific object positions around the villa, pool, people, bed, bath or furniture. The reviewed positions live in src/lib/photo-framing.ts and apply to database aliases as well as static sources.
- Use 1:1 article covers for portrait room photos, 4:3 for square Canopy Crest photos and 3:2 for landscape photos. This reduces aggressive crops in the larger article cover.
- Fill the homepage hero with the sharp Canopy Crest poolside photo. On phones the photo occupies a separate 360px upper section so the search form stays usable.
- Keep gallery navigation and full-screen zoom controls. Original photos and graded files remain available at their original dimensions.
- Position property-type badges and arrow buttons independently so they no longer overlap.

## Willow Peak assets

Final files: `public/assets/villas/willow-peak/graded-v1/wp-01.webp` through `wp-10.webp`, plus `chalets-night.webp`.

The ten portrait photos retain their original 1536 × 2048 dimensions. The existing night image retains its 800 × 560 dimensions. Original photographs remain available in the original folders for comparison and recovery.

The built-in image-generation tool produced eleven individual grading references. Generated scene content is never used in the final photographs: the first reference changed the sky, so all references were used only to derive restrained, monotonic colour curves. Those curves were applied to the original decoded pixels at their original positions and exported as high-quality WebP. This keeps the original buildings, roof lines, furniture, plants, reflections, fixtures, logos, camera framing and weather intact.

`src/lib/property-images.ts` maps all 22 legacy filename aliases to the new versioned URLs, including images loaded from the existing database. Static site references and article metadata use the new URLs as well. Database records were not modified. Versioned filenames avoid old immutable image caches.

## Grading prompt

Each image was supplied individually as the edit target to the built-in image-generation tool. The core preservation and grading prompt was:

Use case: lighting-weather. The supplied image is the EDIT TARGET: an existing documentary Willow Peak property photograph. ONLY COLOR GRADE this same photograph: subtly improve exposure, white balance, highlight recovery, shadow detail, natural restrained saturation and clean moderate contrast. Neutral whites, true charcoal metal, natural fresh greens, gently warm wood, natural hospitality photography. Preserve original lighting/time-of-day and weather; night photos must remain night photos, overcast photos must remain overcast. Keep the exact input dimensions/aspect ratio and FULL original frame without cropping. Preserve EVERY pixel geometry, architecture, roof shape, window, furniture item, plant, chair, table, bath fitting, lamp, ground detail, reflection, background, logo and existing text; no addition, deletion, reconstruction or retouching. Absolutely no sky replacement or new clouds; absolutely no scene changes. No new content, no cinematic teal/orange, no HDR, no extreme saturation. Return the same photograph with tonal/color corrections only. Retain the original portrait 3:4 frame for portrait inputs; retain the original landscape frame for landscape input.

## Validation

- All 44 blog pages and eight listing, area, destination and experience pages returned HTTP 200 and rendered no blurred frame backdrop (52 pages total).
- Visually reviewed the 26 unique blog/hero source crops at 4:3, plus all Willow Peak and Canopy Crest assets.
- Checked homepage collection frames and a blog featured-stay card at 345, 768 and 1440 pixels: cover fit and no horizontal page overflow. All homepage collection frames remain 4:3.
- All seven villa detail URLs also return HTTP 200 and render their gallery frames without a blurred backdrop.
- TypeScript, targeted ESLint and git diff whitespace checks pass.
- The separate Willow Peak pixel checks confirm that grading preserves the original image geometry.

Run the asset checks with `node scripts/verify-property-images.mjs`. To reproduce the grading exports from existing AI references, pass the local reference manifest to `node scripts/export-willow-grades.mjs <manifest.json>`.

The before/after contact sheet and responsive screenshots are saved under the ignored `scratch/` directory for review.
