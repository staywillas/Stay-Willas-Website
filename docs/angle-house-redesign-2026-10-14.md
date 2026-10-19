# Angle House redesign

This records the initial Angle House pass. The later shared rollout and follow-up refinements are documented in `property-ui-rollout-2026-10-14.md`.

Scope: `/villa/the-angle-house`. Other property pages retain their existing layout.

The homepage establishes the brand: warm ivory, navy, gold accents, Cormorant headings and Outfit body text. The property page now follows that language with a prominent photo collage, concise copy, grouped amenities and native disclosures for longer information. Design dials: variance 6, motion 3, density 3. The existing brand overrides the skill's generic palette and typography defaults. Light styling follows the homepage; explicit site dark-theme tokens are supported.

The booking panel sticks on desktop. Mobile and tablet have a compact fixed price/date bar. Existing reservation fields, lead capture, pricing calculations, availability data, menus, review submission, wishlist, sharing, URLs and property metadata are retained. No reservation or review was submitted during testing.

Most content remains server-rendered. The photo viewer, dining dialog and full reviews load on request. Photos use Next Image with responsive sizes, an eager high-priority hero and lazy secondary images. The location panel links to the existing exact map pin without loading an embedded map.

Validation:

- TypeScript passed.
- ESLint passed for all three new TypeScript components. The shared booking component has five existing lint errors (explicit `any` and its mount effect), verified against HEAD.
- Browser checks covered desktop at 1440px, tablet at 768px, and mobile at 390px and 320px; no document-level horizontal overflow.
- Calendar opening, month navigation, Escape dismissal and focus return were verified. Reservation fields have associated labels. Menus, gallery grid, lightbox navigation and review expansion were checked.
- Desktop sticky panel was verified at 102px from the viewport top after scrolling to amenities.

The final production Lighthouse mobile audit reported performance 59, accessibility 100, best practices 73 and SEO 100, with CLS 0 and LCP 4.1s. The identified page-specific star-rating ARIA issue and inherited footer CTA contrast were corrected. Performance is still affected by shared Google/Facebook analytics and authentication scripts. Local production authentication calls also return 400 because the production Clerk domain is used on localhost. These shared services were preserved. See `previews/angle-house-lighthouse-final.json` for the final throttled mobile audit; it is not a deployed-site performance claim. The initial audit is retained separately for reference.

The first default production build passed. A repeated Turbopack build encountered an internal cached Google font resolver error; final `npm run build -- --webpack` passed using Next's documented Webpack build option, including all 84 static pages.
