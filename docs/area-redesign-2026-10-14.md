# Destination page redesign

Scope: `/areas/lonavala`, `/areas/panchgani` and `/areas/khopoli`. Existing URLs, canonical URLs, property links, collection anchor IDs and the Khopoli signature-property anchor are retained. The dynamic area fallback shares the same implementation and uses Next.js `notFound()` for unknown destinations. Streamed not-found responses can have HTTP 200 with a noindex tag rather than an HTTP 404.

## Audit and design

The previous pages mixed dark photographic heroes, oversized promotional cards, repeated CTAs and long keyword-heavy articles. The Lonavala page contained approximately 1,940 words in its main content. The homepage and redesigned property pages already establish ivory `#f5f2ea`, navy `#1b3564`, gold accents, Cormorant display typography and Outfit body text.

The redesign preserves that brand and uses a shared server component with destination-specific copy. Design/motion/density: 6/3/3. Photography leads; secondary images are lazy-loaded. Native FAQ disclosures require no new client component or animation library. The new mobile call/stays bar replaces the overlapping global bottom nav only on these pages at the mobile breakpoint. Booking and availability remain in the existing property flow.

Lonavala distinguishes The Angle House's private waterfall pool from Willow Peak's three private-Jacuzzi cottages. Each cottage retains its own link and guest limit. Panchgani features Casa De Reva in Kaswand. Khopoli features Canopy Crest, with four bedrooms, five bathrooms and a maximum of sixteen guests. Pool imagery is drawn from actual property assets. Displayed rates come from database values and preserve the existing Willow whole-estate starting-rate cap used by the property page.

## SEO approach

There is no artificial keyword-density target. Copy answers booking questions and uses relevant location terms naturally in distinct titles, introductory copy, property information, FAQs and internal links. Search-volume and competition claims are not inferred from these changes.

| Destination | Main search intent | Related content covered |
| --- | --- | --- |
| Lonavala | Villas in Lonavala with private pool | Kamshet pool villa, Kurwande Jacuzzi cottages, couple stays, private group stays |
| Panchgani | Villas in Panchgani with private pool | Kaswand villa, family/group stays, Casa De Reva, Mapro Garden/Table Land route planning |
| Khopoli | Villas in Khopoli with private pool | Canopy Crest, four-bedroom villa, sixteen-guest groups, Imagicaa trip planning, small team offsites |

Every page has a single H1, unique title/description, canonical, Open Graph and Twitter metadata, descriptive image alt text, crawlable property/guide/destination links, and CollectionPage, ItemList, BreadcrumbList and FAQPage JSON-LD. The eight schema FAQs on each page use the same question/answer data as the visible native disclosures. Structured data describes both villas and cottages accurately; it does not promise Google rich-result eligibility.

No fixed travel times, guaranteed cheapest rates, response-time promises or fabricated reviews were added. All pages state standard check-in from 2 PM and check-out by 11 AM.

References: [Google SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [Google keyword-stuffing policy](https://developers.google.com/search/docs/essentials/spam-policies#keyword-stuffing). Next.js implementation followed the installed 16.2.6 metadata and image guides; hero images use `preload` rather than deprecated `priority`.

## Verification

TypeScript and focused ESLint pass. Desktop previews at 1280px and mobile previews at 390px show the three redesigned pages with the correct properties and loaded images. At 320px, Panchgani's hero actions fit inside the viewport. The Lonavala collection link lands at 89px below the fixed header. FAQ mouse and keyboard expansion work, including the standard stay-time answer. At 390px the content fits the viewport and the global bottom nav is hidden while the new call/stays bar is visible.

The Webpack production build passed with all 84 static pages. Generated HTML for each of the three area routes confirms one H1, the correct title/canonical, eight schema FAQs and standard stay times. Lonavala's schema lists five actual booking options; Panchgani and Khopoli each list their one current villa. The routes remain prerendered with 60-second revalidation. Tablet checks at 768px also fit the viewport. Case-insensitive handling in the dynamic destination fallback is preserved.

Screenshots are saved under `docs/previews/` as `lonavala-area-mobile.png`, `lonavala-area-mobile-stays.png`, `panchgani-area-mobile.png`, `panchgani-area-desktop.png`, `khopoli-area-mobile.png` and `khopoli-area-desktop.png`.

Shared global analytics, authentication and navigation scripts remain; no site-wide Lighthouse performance score or ranking outcome is claimed.

## Weekday offer and CTA refinement

All three pages now feature a 26% off Monday–Thursday badge in the hero, the Stayw26 code beside the primary action, and a larger destination-specific offer section before the property listings. Its actions lead to the stay collection, the booking team's phone number and a destination-specific WhatsApp quote request mentioning the offer and code. Property cards link to weekday rates in the existing booking flow. The mobile bar keeps the 26% offer and a call/date action available while scrolling.

Unique meta descriptions, social sharing titles and destination FAQ questions mention the offer while the main search titles retain their property/location focus. Discounted prices are not fabricated or calculated from a generic base price; the booking flow still determines the eligible final quote.

The updated Webpack production build, TypeScript and focused ESLint passed. Built HTML checks confirm the hero badge, offer section, date/call CTAs, offer-aware description and matching weekday FAQ on Lonavala, Panchgani and Khopoli. Lonavala's offer-date link lands at 108px below the desktop header. At 320px, Panchgani's hero and offer actions fit within the viewport with no horizontal overflow. Telephone and WhatsApp destinations were inspected without placing a call or sending a message.
