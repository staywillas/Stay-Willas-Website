# Stay Willas website analysis

Reviewed 13 October 2026. This is a time-boxed repository analysis with local browser checks. Application code and database records were not changed. The review maps the complete source tree, traces the main business flows, and examines the highest-impact implementation risks. It is not an exhaustive security assessment or a production payment test.

## What the website is

Stay Willas markets and manages private pool villas and Jacuzzi cottages near Mumbai and Pune. Its public domain is `www.staywillas.com`. The working directory retains the older Bellisimo name, but the package, content, branding and URL configuration use Stay Willas.

The business combines direct guest inquiries, concierge-assisted reservations, online checkout, homeowner onboarding, internal reservation management, and staff operations. WhatsApp is a prominent conversion channel throughout the site.

The local collection contains seven listings, representing four property groups:

| Listing | Area | Capacity | Bedrooms | Base rate shown locally |
|---|---|---:|---:|---:|
| The Angle House | Kamshet, Lonavala | 12 | 3 | ₹13,000 |
| Canopy Crest | Khopoli | 16 | 4 | ₹15,000 |
| Casa De Reva | Panchgani | 16 | 4 | ₹16,000 |
| Willow Peak entire estate | Kurwande, Lonavala | 12 | 3 | ₹17,997 |
| Breeze, Cottage A | Kurwande, Lonavala | 4 | 1 | ₹4,999 |
| Crest, Cottage B | Kurwande, Lonavala | 4 | 1 | ₹4,999 |
| Heaven, Cottage C | Kurwande, Lonavala | 4 | 1 | ₹4,999 |

These are displayed base rates, not a promise about any selected dates. Daily overrides, seasonal prices, weekend rates, guest counts, extras and discounts affect quotes.

## Architecture and data ownership

- Next.js **16.2.6**, App Router, React **19.2.4**, TypeScript, Tailwind **4**.
- PostgreSQL through Prisma **7.8**, using the PostgreSQL driver adapter. `src/lib/db.ts` lazily initializes a globally reused client with a one-connection pool per process.
- Public pages mostly use server components to load data, with client components for filtering, booking, galleries, navigation and forms.
- Eight modules under `src/app/actions/` implement server actions for booking, admin, staff, login, inquiries, partner operations, reviews and recommendations.
- Clerk and a separate HMAC-signed custom cookie session both exist. Staff use a third PIN-based session.
- Stripe checkout, Resend/SMTP email, WhatsApp links and Telegram staff alerts are integrated. Google Analytics, Ahrefs analytics and Meta Pixel load from the root layout.
- Framer Motion, GSAP, Lenis, Swiper, Three.js and OGL are installed. Their presence does not mean every effect is active on the current homepage.

The Prisma schema contains `Villa`, `Booking`, `Review`, `Inquiry`, `SeasonalPrice`, `DailyPrice`, `User` and `CareLog`. Properties, rates, reservations, inquiries and staff proof logs are database-backed. Guides, FAQs, marketing facts, owner-property mappings and much property-specific content live in source files. Wishlists live in browser local storage and are shared across accounts using that browser.

`Booking.userId` has several incompatible meanings: an account identifier, serialized guest information, owner/maintenance block markers, and external-channel identifiers. This makes identity, reporting and reservation ownership harder to keep consistent.

## Page and feature map

| Area | Routes and purpose | Main implementation |
|---|---|---|
| Homepage | `/`: destination/date/group search, weekday offer, collection, pool/Jacuzzi sections, homeowner CTA, FAQs | `app/page.tsx`, `home/editorial/home-experience.tsx`, `home-content.tsx`, `weekday-carousel.tsx`, `home.module.css` |
| Collection | `/villas`: destination, budget, capacity, bedrooms, amenities, style and price sorting | `villas/page.tsx`, `villas-client.tsx`, `villas-browser.tsx`, `home/villa-card.tsx` |
| Property | `/villa/[slug]`: property facts, gallery/lightbox, rooms, facilities, menus, reviews, sharing, saving and reservation UI | `villa/[slug]/page.tsx`, `components/villa/` |
| Destinations | `/areas`, `/destinations`, explicit Lonavala/Khopoli/Panchgani pages and `[region]` fallback | `app/areas/`, `app/destinations/` |
| Group stays | `/escape`: a separate long client landing page for group planning | `escape/page.tsx`, `escape-client-page.tsx` |
| Experiences | `/experiences`: meals, celebrations and stay extras | `experiences/page.tsx` |
| Guides | `/blog`, `/blog/[slug]`: 44 source-backed travel/property articles, topic filters and booking links | `data/blogs.ts`, `guide-navigation.ts`, `components/blog/` |
| Help and trust | `/faq`, `/stories`, `/about`, `/contact`, `/privacy`, `/terms`, `/cancellation-policy` | FAQ data/browser, review/video components, callback form and static pages |
| Occasion acquisition | Birthday, anniversary, milestone birthday and Pune family pool-party landing pages | Four long descriptive route directories under `app/` |
| Guest account | `/login`, `/login/verify`, `/dashboard`, `/wishlist`, `/booking/success` | Login actions/form, dashboard client, wishlist client, success page |
| Administration | `/admin`: overview, properties, pricing, calendar, bookings, verification queue, leads, calculator and reports | Five large components under `components/admin/`, `actions/admin.ts` |
| Homeowners | `/partner` currently renders marketing and the property onboarding form | `partner/page.tsx`, `partner-form.tsx`; separate portal component exists but is not mounted |
| Staff operations | `/care`, also host rewrites for care subdomains: PIN login, caretaker/chef/admin views, photo proof logs | `proxy.ts`, `actions/care.ts`, `components/care/`, `care-translations.ts` |
| API/support | Health, two availability diagnostics and two iCal export variants | `app/api/`; diagnostics have admin session/API-key guards |

The root layout supplies fonts, SEO defaults, analytics, structured data, Clerk, smooth scrolling, public navigation and floating widgets. Navbar is hidden on admin/care routes. The preloader only runs in its explicit preview mode. The AI concierge component currently returns `null`; its server recommendation function performs database filtering rather than an LLM call.

## How reservations and pricing work

1. Homepage date search calls `checkAvailableVillasForDates`. It finds properties and active reservations, filters overlapping intervals, and calculates an average nightly rate. The homepage separately filters guest capacity.
2. A property page loads property/rate information and active bookings. Willow cottages check the entire estate; the estate checks its cottages as well.
3. `booking-card.tsx` computes the quote, extras, cottage choice and coupon discount in the browser. Guests can send a WhatsApp inquiry, submit a verification request, or start Stripe checkout.
4. Verification requests call `createAwaitingVerificationBooking`, creating `AWAITING_VERIFICATION` records with guest information encoded in `userId`. Admin approval changes the record to `CONFIRMED` and attempts a guest email.
5. Stripe checkout independently calculates room pricing, checks for overlapping confirmed/blocked/recently held reservations, creates a `HELD` record, and requests a Stripe session. Holds are treated as active for ten minutes.
6. `/booking/success` retrieves the supplied Stripe session and may change the supplied held booking to confirmed. There is no Stripe webhook route in the repository.

Server pricing precedence is **daily override → seasonal override → Friday/Saturday/Sunday override → legacy weekend price → base price**. Extra guests are charged separately. The current promoted coupon applies 26% to Monday–Thursday room/extra-guest charges. Four Stripe extras include chef service, vineyard tour, celebration decoration and airport transfer. Willow estate pricing can be scaled to one, two or three cottages according to guest count; the exact product rules need a single shared interpretation across search, booking and admin.

Admin tools also support manual bookings, payment updates, date blocks, daily/range rate editing, external channel feeds, invoice email/PDF work and monthly reporting. Partner actions enforce custom session roles and property ownership, although the portal UI is presently disconnected.

## Findings, ranked by impact

### P1 — Booking mutations lack caller and ownership checks

`src/app/actions/booking.ts:418` and `:443` update KYC or cancel a booking using only a supplied booking ID. They do not verify a session or that the caller owns the reservation. Protecting the dashboard page does not protect its server actions. `submitReview` similarly accepts caller-supplied identity and rating without server authentication or rating bounds. `getTodayCareLogs` and `getCareLogsHistory` read staff photos/notes without checking the care session.

**Fix:** enforce authentication and record-level authorization inside each action; validate inputs and restrict public return values. The installed Next.js authentication guide explicitly treats server actions as public-facing endpoints.

### P1 — Paid Stripe sessions are not tied to the booking being confirmed

`src/app/booking/success/page.tsx:53` accepts `payment_status === "paid"`, then confirms the independently supplied `booking_id`. It does not compare the session's booking metadata, expected amount/currency, or owner. A paid session could be supplied against another held booking. Confirmation also depends on the browser reaching this page, so successful payments with interrupted redirects may remain unconfirmed.

**Fix:** verify the exact session/booking association and amount; use an idempotent signed Stripe webhook for payment state changes.

### P1 — Reservation checks are not atomic, and admin approval skips a fresh check

Checkout performs a read for overlaps followed by a separate insert, despite a comment describing transaction checks. Concurrent requests can both pass. Verification requests check only the selected villa's confirmed/blocked bookings, not the full Willow estate/cottage relationship. `approveVerificationBooking` directly changes status without a new conflict check.

**Fix:** centralize resource conflicts, validate at approval, and enforce reservation creation/confirmation with database-level concurrency protection.

### P1 — Guest identities do not connect across login, bookings and dashboard

`login-actions.ts` creates custom cookie sessions, while `use-auth.ts`, the navbar, booking card and review components primarily read Clerk. The dashboard only accepts the custom session. It searches `Booking.userId` for the exact session ID, but online reservation actions store JSON in that field instead. Real reservations can therefore be absent from the guest dashboard even when login succeeds.

**Fix:** choose one guest identity contract and store account ownership in a dedicated field, separate from guest/contact metadata.

### P1 — Insecure credential/session fallbacks

`session.ts`, `login-actions.ts` and `care.ts` contain source-known fallback secrets, passwords or PINs. Exposure depends on whether deployment supplies the corresponding environment values; live secret configuration was not inspected. Main session verification checks the signature but does not enforce age/expiry. Partner authentication uses a shared password.

**Fix:** fail closed when production secrets are missing, enforce token expiry and use individual partner accounts. Avoid treating cookie expiry as server-enforced token expiry.

### P2 — Verification totals are trusted from the browser

`createAwaitingVerificationBooking` stores `data.totalPrice` directly, while its caller submits a client-computed total. Admin approval does not recalculate it. Modified requests can supply inaccurate prices. Date validity, guest limits and supported extras are also incompletely validated server-side.

**Fix:** calculate authoritative quotes on the server for every reservation path and approve the same stored quote contract.

### P2 — Success UI and Stripe failure handling can mislead guests

Checkout catches any Stripe error and returns a mock success URL, including in production. The success page always says payment was processed and dates are locked even when verification failed and the booking remains held. It also contains an `onClick` print handler in a server component, which can fail at render time; this path was not exercised because it can mutate a real reservation.

**Fix:** limit mocks to explicit development mode, show truthful pending/failure states, and move print interaction into a client component. The cancel URL uses a database ID where the public property route normally expects a slug.

### P2 — Homeowner login has no connected portal page

Partner login redirects to `/partner`. That route renders the onboarding/marketing page and never imports `PartnerPortal`; repository search found no mounted use of that component.

**Fix:** mount an authenticated homeowner view or give the portal its own route and redirect successful login there.

### P2 — New guest accounts receive a fictional confirmed stay

`src/app/dashboard/page.tsx:58` supplies a fabricated June 2026 confirmed booking when the account has no reservations. This can mislead guests and presents KYC/cancellation controls against an ID that is not a real booking.

**Fix:** use an honest empty state with a link to find a stay.

### P2 — Availability, pricing and calendar exports disagree

Search considers `PENDING` blocking; Stripe overlap checks omit it. Verification requests ignore recent holds and sibling cottage conflicts. The two iCal exports include different statuses; one omits `BLOCKED`. Estate/cottage relationships are not consistently represented in exports/search. Listing cards hardcode several prices instead of always displaying passed database prices. Coupon matching accepts arbitrary strings containing certain numbers. Date calculations mix host-local and UTC boundaries.

**Fix:** use a shared booking status policy, a shared pricing function, explicit coupons and a date-only business timezone contract.

### P2 — Email delivery failure can be reported as success

`src/lib/mail.ts` returns `{ success: true, devLogged: true }` after configured delivery fails or no transport exists, including production. Several notifications are started without being awaited, so completion is not guaranteed by the request lifecycle.

**Fix:** fail honestly in production and durably dispatch/await required notifications. Escape guest-provided values when constructing HTML email templates.

### P2/P3 — Usability and maintenance debt

- Listing cards label bedroom counts as “Beds”, which can misrepresent sleeping arrangements. Save buttons are nested inside property links. Login labels are not associated with their inputs through IDs.
- Listing metadata/status text often uses 8–10px sizes, making key details hard to read. The listing page repeats homeowner promotion in its content and footer.
- The current homepage has a clearer editorial layout and good focus/reduced-motion handling. Existing admin layout documentation identifies the still-dense admin header/tabs and offers a compact sidebar proposal.
- Large components concentrate unrelated responsibilities: admin dashboard 3,336 lines, availability calendar 2,296, bill calculator 1,898, escape client 1,551 and booking card 1,483.
- The README is still the starter template; no application test script is configured. Seed data retains legacy property IDs and demo records, so it should be reviewed before any reseed. Seeds were not executed.

## SEO, performance and assets

The project has canonical URLs, page metadata, Open Graph/Twitter images, sitemap, robots rules, organization/website/property/breadcrumb/FAQ structured data, Google verification, and `llms.txt`/`llms-full.txt`. Internal guide navigation connects articles, destinations and properties. Old destination/property URLs are redirected. Some redirects are duplicated. `/faq` is missing from the static sitemap list despite having a page. Robots rules and environment-level indexing headers should be kept consistent.

Images are centralized through `SiteImage`/`PhotoFrame`. Reviewed focal points live in `photo-framing.ts`; Willow legacy aliases resolve to versioned graded photos through `property-images.ts`. AVIF/WebP output and long-lived asset caching are configured. Public assets include 83 WebP, 67 JPEG, 26 PNG, eight MP4 and four PDF files, plus icons, verification HTML and text files. Original media directories and scratch artifacts are mostly ignored by Git.

Homepage is explicitly dynamic and depends on a database query per request. Several listing/detail pages use 60-second revalidation. This makes booking-time server checks essential even if a displayed calendar is cached. The database pool is deliberately small; its suitability under production concurrency was not measured. Several large screens load full datasets without pagination.

## Checks performed and limits

- **Passed:** `npx tsc --noEmit --incremental false`.
- **Failed baseline:** `npm run lint -- --quiet` reports **393 errors**. These include production source errors plus scratch/root scripts, because ESLint does not exclude the ignored scratch directory. Common categories include explicit `any`, React effect-state rules, unescaped entities and CommonJS imports.
- **Passed:** `node scripts/verify-property-images.mjs`: 44 article cover assets, 22 image aliases and 11 graded photos. Dimensions and pixel-position grading checks passed.
- **Browser:** homepage, collection and Canopy Crest detail page rendered against this repository on port 3001. Collection displayed seven listings; choosing Khopoli produced one result. The property page displayed its gallery, facilities, menus, booking controls and reviews. At a 390px viewport, document width and scroll width both measured 385px, so no horizontal document overflow was observed on that listing state.
- The pre-existing service on port 3000 was unrelated; it was left untouched.
- Local Next.js warned that Clerk uses development keys and that the homepage hero could use eager loading. These are local observations, not a production configuration audit or Core Web Vitals measurement.
- Did not submit reservations, send messages, change database records, log into private portals, run seed scripts or complete payments. No production build, full accessibility scan, deployment audit or exhaustive route walkthrough was performed.

## Recommended implementation order

1. Establish guest identity and enforce action/record permissions.
2. Make pricing and reservation conflict handling authoritative and consistent, including Willow resources.
3. Correct Stripe confirmation, webhook handling and failure states.
4. Connect the partner portal and remove fictional guest reservations.
5. Stabilize lint scope and source errors, then add meaningful reservation/identity regression coverage.
6. Improve information clarity, split large operational components, and measure production performance.

The following appendix inventories source files structurally. It records exports/import relationships for navigation, not a claim that every line or visual asset received equal-depth inspection.


## Source inventory

172 TypeScript, TSX, CSS and JSON files under `src/` were inventoried. Lines include comments and embedded content; `pdf-logo.ts` contains a long embedded image.

| File | Lines | Exports / action dependencies |
|---|---:|---|
| `src/app/about/page.tsx` | 260 | metadata, AboutPage |
| `src/app/actions/admin.ts` | 1270 | createManualBooking, deleteBooking, updateBookingPayment, updateVillaDetails, getChannelConfigs, updateChannelConfig, syncExternalChannels, setDailyPrice, deleteDailyPrice, setDailyPriceRange, deleteDailyPriceRange, updateBookingFullDetails, sendInvoiceEmailAction, approveVerificationBooking, rejectVerificationBooking |
| `src/app/actions/booking.ts` | 880 | calculateStayPrice, createCheckoutSession, getDestinationAvailability, syncExternalCalendars, submitBookingKYC, cancelBooking, checkAvailableVillasForDates, createAwaitingVerificationBooking, getVillaBookingDetails |
| `src/app/actions/care.ts` | 374 | CareSession, getCareSession, logoutCareAction, verifyCarePin, submitCareLog, getTodayCareLogs, getCareLogsHistory |
| `src/app/actions/inquiry.ts` | 187 | submitInquiry, captureBookingLead, getInquiries, deleteInquiry |
| `src/app/actions/login-actions.ts` | 247 | checkEmailAction, verifyAndSetupPasswordAction, loginAction, logoutAction |
| `src/app/actions/partner.ts` | 253 | getOwnerVillaIds, getPartnerDashboardData, blockPartnerDates, deletePartnerBlock |
| `src/app/actions/review.ts` | 44 | submitReview, getReviews |
| `src/app/actions/villa.ts` | 115 | getConciergeRecommendation |
| `src/app/admin/page.tsx` | 95 | metadata, dynamic, AdminPage |
| `src/app/anniversary-celebration-villa-with-private-pool/page.tsx` | 507 | revalidate, metadata, AnniversaryCelebrationPage |
| `src/app/api/debug-availability/route.ts` | 66 | GET |
| `src/app/api/health/route.ts` | 45 | dynamic, GET |
| `src/app/api/ical/[slug]/route.ts` | 105 | GET |
| `src/app/api/test-availability/route.ts` | 40 | GET; actions: booking |
| `src/app/api/villa/[slug]/ical/route.ts` | 75 | GET |
| `src/app/areas/khopoli/page.tsx` | 709 | revalidate, metadata, KhopoliPage |
| `src/app/areas/lonavala/page.tsx` | 769 | revalidate, metadata, LonavalaPage |
| `src/app/areas/page.tsx` | 311 | metadata, AreasPage |
| `src/app/areas/panchgani/page.tsx` | 943 | revalidate, metadata, PanchganiPage |
| `src/app/areas/[region]/page.tsx` | 408 | revalidate, generateStaticParams, generateMetadata, AreaRegionPage |
| `src/app/blog/page.tsx` | 73 | revalidate, metadata, BlogIndexPage |
| `src/app/blog/[slug]/page.tsx` | 644 | revalidate, generateStaticParams, generateMetadata, BlogDetailsPage |
| `src/app/booking/success/page.tsx` | 232 | metadata, BookingSuccessPage |
| `src/app/cancellation-policy/page.tsx` | 111 | metadata, CancellationPolicyPage |
| `src/app/care/care-client-page.tsx` | 126 | CareClientPage; actions: care |
| `src/app/care/layout.tsx` | 35 | metadata, CareLayout |
| `src/app/care/page.tsx` | 20 | dynamic, CarePage; actions: care |
| `src/app/contact/page.tsx` | 258 | metadata, ContactPage |
| `src/app/dashboard/page.tsx` | 104 | metadata, dynamic, DashboardPage |
| `src/app/destinations/page.tsx` | 361 | metadata, DestinationsPage |
| `src/app/error.tsx` | 67 | Error |
| `src/app/escape/escape-client-page.tsx` | 1551 | EscapeClientPage |
| `src/app/escape/page.tsx` | 222 | metadata, EscapePage |
| `src/app/experiences/page.tsx` | 301 | metadata, ExperiencesPage |
| `src/app/faq/page.tsx` | 145 | revalidate, metadata, FaqPage |
| `src/app/global-error.tsx` | 97 | GlobalError |
| `src/app/globals.css` | 600 | Shared or module styles |
| `src/app/layout.tsx` | 177 | viewport, metadata, RootLayout |
| `src/app/loading.tsx` | 9 | Loading |
| `src/app/login/layout.tsx` | 12 | metadata, LoginLayout |
| `src/app/login/page.tsx` | 97 | LoginPage |
| `src/app/login/verify/page.tsx` | 190 | VerifyPage; actions: login-actions |
| `src/app/milestone-birthday-celebration-villa-maharashtra/page.tsx` | 451 | revalidate, metadata, MilestoneBirthdayPage |
| `src/app/not-found.tsx` | 65 | NotFound |
| `src/app/page.tsx` | 60 | metadata, dynamic, Home |
| `src/app/partner/page.tsx` | 198 | metadata, PartnerPage |
| `src/app/privacy/page.tsx` | 100 | metadata, PrivacyPage |
| `src/app/private-pool-party-villa-near-pune-for-family/page.tsx` | 454 | revalidate, metadata, PuneFamilyPoolPartyPage |
| `src/app/private-villa-for-birthday-celebration-near-mumbai/page.tsx` | 488 | revalidate, metadata, BirthdayCelebrationPage |
| `src/app/robots.ts` | 29 | robots |
| `src/app/sitemap.ts` | 195 | sitemap |
| `src/app/stories/page.tsx` | 131 | metadata, StoriesPage |
| `src/app/template.tsx` | 7 | Template |
| `src/app/terms/page.tsx` | 94 | metadata, TermsPage |
| `src/app/villa/[slug]/page.tsx` | 1215 | revalidate, generateStaticParams, generateMetadata, VillaDetailPage; actions: review |
| `src/app/villas/page.tsx` | 158 | revalidate, metadata, VillasPage |
| `src/app/wishlist/page.tsx` | 103 | metadata, dynamic, WishlistPage |
| `src/components/admin/admin-dashboard.tsx` | 3336 | Component/helper module; actions: login-actions, admin, inquiry |
| `src/components/admin/availability-calendar.tsx` | 2296 | AvailabilityCalendar; actions: admin |
| `src/components/admin/bill-calculator.tsx` | 1898 | BillCalculator; actions: admin |
| `src/components/admin/daily-pricing-calendar.tsx` | 1052 | DailyPricingCalendar; actions: admin |
| `src/components/admin/monthly-report.tsx` | 1045 | MonthlyReport |
| `src/components/auth/login-form.tsx` | 205 | LoginForm; actions: login-actions |
| `src/components/blog/blog-browser.module.css` | 31 | Shared or module styles |
| `src/components/blog/blog-browser.tsx` | 68 | GuideSummary, GuideFilter, BlogBrowser |
| `src/components/blog/blog-horizontal-marquee.tsx` | 211 | MarqueeItem, LONAVALA_MARQUEE_ITEMS, BlogHorizontalMarquee |
| `src/components/blog/guide-links.tsx` | 21 | GuideLinks |
| `src/components/care/admin-view.tsx` | 333 | AdminView |
| `src/components/care/camera-watermark.tsx` | 488 | CameraWatermark |
| `src/components/care/caretaker-view.tsx` | 246 | CaretakerView |
| `src/components/care/chef-view.tsx` | 345 | ChefView |
| `src/components/care/pin-pad.tsx` | 212 | PinPad |
| `src/components/chatbot/ai-concierge.tsx` | 6 | AiConcierge |
| `src/components/chatbot/animated-willa-mascot.tsx` | 648 | MascotEmotion, AnimatedWillaMascot |
| `src/components/common/mega-discount-ad-banner.tsx` | 293 | MegaDiscountAdBanner |
| `src/components/common/quick-mobile-lead-form.tsx` | 150 | QuickMobileLeadForm; actions: inquiry |
| `src/components/contact/contact-form.tsx` | 114 | Component/helper module; actions: inquiry |
| `src/components/dashboard/dashboard-client.tsx` | 537 | DashboardClient; actions: booking |
| `src/components/faq/faq-browser.module.css` | 532 | Shared or module styles |
| `src/components/faq/faq-browser.tsx` | 372 | FaqBrowser |
| `src/components/home/booking-bar.tsx` | 1420 | Component/helper module; actions: booking, inquiry |
| `src/components/home/destination-showcase.tsx` | 304 | DestinationLocation |
| `src/components/home/editorial/home-content.tsx` | 116 | HomeContent |
| `src/components/home/editorial/home-experience.tsx` | 103 | HomeExperience; actions: booking |
| `src/components/home/editorial/home.module.css` | 306 | Shared or module styles |
| `src/components/home/editorial/weekday-carousel.tsx` | 81 | WeekdayCarousel |
| `src/components/home/experiences.tsx` | 400 | Component/helper module |
| `src/components/home/featured-villas.tsx` | 137 | Component/helper module |
| `src/components/home/hero-concept-1.tsx` | 458 | HeroConcept1 |
| `src/components/home/hero-concept-2.tsx` | 584 | HeroConcept2 |
| `src/components/home/hero.tsx` | 172 | Hero |
| `src/components/home/highlights-bar.tsx` | 154 | Component/helper module |
| `src/components/home/home-sitelinks.tsx` | 182 | SitelinkItem, homeSitelinksData, HomeSitelinks |
| `src/components/home/infinite-marquee.tsx` | 110 | InfiniteMarquee |
| `src/components/home/partner-section.tsx` | 106 | Component/helper module |
| `src/components/home/seo-content.tsx` | 54 | SEOContent |
| `src/components/home/top-ticker.tsx` | 56 | TopTicker |
| `src/components/home/villa-card.tsx` | 152 | Component/helper module |
| `src/components/home/why-choose-us.tsx` | 120 | Component/helper module |
| `src/components/layout/back-to-top.tsx` | 16 | BackToTop |
| `src/components/layout/call-sticky.tsx` | 27 | Component/helper module |
| `src/components/layout/category-bar.tsx` | 94 | Component/helper module |
| `src/components/layout/floating-widgets.tsx` | 35 | FloatingWidgets |
| `src/components/layout/footer.tsx` | 380 | Component/helper module |
| `src/components/layout/mobile-bottom-nav.tsx` | 161 | MobileBottomNav |
| `src/components/layout/mobile-menu.tsx` | 508 | MobileMenu |
| `src/components/layout/navbar.tsx` | 372 | Component/helper module |
| `src/components/layout/preloader.tsx` | 232 | Preloader |
| `src/components/layout/public-navbar.tsx` | 11 | PublicNavbar |
| `src/components/layout/whatsapp-sticky.tsx` | 38 | Component/helper module |
| `src/components/partner/partner-form.tsx` | 612 | Component/helper module; actions: inquiry |
| `src/components/partner/partner-portal.tsx` | 666 | PartnerPortal; actions: partner, login-actions |
| `src/components/providers/smooth-scroll.tsx` | 59 | SmoothScrollProvider |
| `src/components/stories/review-form.tsx` | 202 | ReviewForm; actions: review |
| `src/components/stories/video-card.tsx` | 212 | VideoCard |
| `src/components/ui/animated-amenity-icons.tsx` | 438 | AnimatedPoolIcon, AnimatedBonfireIcon, AnimatedChefIcon, AnimatedMountainIcon, AnimatedWaterfallIcon, AnimatedGlassFrontageIcon, AnimatedLightingIcon, AnimatedLoungingIcon, AnimatedBalconyIcon, AnimatedLivingHallIcon |
| `src/components/ui/button.tsx` | 59 | Component/helper module |
| `src/components/ui/circular-gallery.css` | 19 | Shared or module styles |
| `src/components/ui/circular-gallery.tsx` | 728 | CircularGalleryProps, CircularGallery |
| `src/components/ui/GhostCursor.tsx` | 554 | Component/helper module |
| `src/components/ui/hover-border-gradient.module.css` | 22 | Shared or module styles |
| `src/components/ui/hover-border-gradient.tsx` | 26 | HoverBorderGradient |
| `src/components/ui/MaskedHeading.css` | 65 | Shared or module styles |
| `src/components/ui/MaskedHeading.tsx` | 364 | MaskedHeadingProps |
| `src/components/ui/RotatingText.css` | 43 | Shared or module styles |
| `src/components/ui/RotatingText.tsx` | 224 | RotatingTextRef, RotatingTextProps |
| `src/components/ui/site-image.tsx` | 21 | SiteImage, PhotoFrame |
| `src/components/ui/text-generate-effect.tsx` | 69 | TextGenerateEffect |
| `src/components/ui/three-d-hover-card.tsx` | 150 | ThreeDHoverCard |
| `src/components/ui/WarpLines.tsx` | 186 | WarpLines |
| `src/components/villa/booking-card.tsx` | 1483 | Component/helper module; actions: booking, inquiry |
| `src/components/villa/booking-modal-flow.tsx` | 670 | BookingModalFlow; actions: inquiry |
| `src/components/villa/food-menu-dialog.tsx` | 180 | FoodMenuDialog |
| `src/components/villa/food-menu-modal.tsx` | 37 | FoodMenuModal |
| `src/components/villa/mobile-booking-controller.tsx` | 585 | MobileBookingController |
| `src/components/villa/property-gallery-viewer.tsx` | 384 | Component/helper module |
| `src/components/villa/property-gallery.tsx` | 48 | PropertyGallery |
| `src/components/villa/review-section.tsx` | 203 | Component/helper module; actions: review |
| `src/components/villa/save-button.tsx` | 91 | SaveButton |
| `src/components/villa/share-button.tsx` | 72 | ShareButton |
| `src/components/villa/wishlist-button.tsx` | 66 | WishlistButton |
| `src/components/villas/ad-landing-showcase.tsx` | 437 | AdLandingShowcase |
| `src/components/villas/hero-orbit-gallery.tsx` | 180 | HeroOrbitGallery |
| `src/components/villas/villa-feature-marquee.tsx` | 89 | FeatureMarqueeItem, VillaFeatureMarquee |
| `src/components/villas/villa-seo-content.tsx` | 18 | VillaSEOContent |
| `src/components/villas/villas-browser.module.css` | 77 | Shared or module styles |
| `src/components/villas/villas-browser.tsx` | 106 | Villa, VillasBrowserProps, VillasBrowser |
| `src/components/villas/villas-client.tsx` | 123 | VillasClient |
| `src/components/wishlist/wishlist-client.tsx` | 102 | WishlistClient |
| `src/data/blogs.ts` | 3111 | BlogSection, BlogPost, blogsData |
| `src/data/faqs.ts` | 284 | FAQItem, FAQCategory, FAQ_CATEGORIES, FAQS_DATA |
| `src/data/guide-navigation.ts` | 98 | guideTopics, getGuideTopic, getRelatedGuides, getGuideBookingLinks, destinationGuides, getPropertyGuides |
| `src/data/owner-config.json` | 4 | Source configuration |
| `src/data/stay-facts.ts` | 5 | CANOPY_MAX_GUESTS, ANGLE_LOCATION, WILLOW_COTTAGE_BASE_PRICE |
| `src/lib/care-translations.ts` | 268 | CareLanguage, translations |
| `src/lib/crypto.ts` | 36 | hashPassword, verifyPassword |
| `src/lib/db.ts` | 46 | prisma |
| `src/lib/ical-sync.ts` | 61 | parseICal |
| `src/lib/lead-notifications.ts` | 273 | ADMIN_NOTIFICATION_EMAIL, sendAdminLeadNotification |
| `src/lib/mail.ts` | 76 | sendEmail |
| `src/lib/pdf-logo.ts` | 10 | STAY_WILLAS_EMBLEM_PNG_DATA_URL, getPdfEmblemDataUrl |
| `src/lib/photo-framing.ts` | 62 | getPhotoFocus, getArticlePhotoRatio |
| `src/lib/property-images.ts` | 22 | resolvePropertyImage |
| `src/lib/schema.ts` | 485 | BASE_URL, ORGANIZATION_SCHEMA, WEBSITE_SCHEMA, BreadcrumbItem, generateBreadcrumbSchema, FAQItem, generateFAQSchema, PropertySchemaInput, generatePropertySchema, DestinationSchemaInput, generateDestinationCollectionSchema, HOMEPAGE_SITELINKS_SCHEMA |
| `src/lib/session.ts` | 116 | SessionPayload, signSessionPayload, verifySessionToken, getSessionUser, requireAdminSession, requirePartnerSession |
| `src/lib/telegram.ts` | 93 | dispatchTelegramCareAlert |
| `src/lib/use-auth.ts` | 36 | UserSession, useAuth |
| `src/lib/use-wishlist.ts` | 81 | useWishlist |
| `src/lib/utils.ts` | 7 | cn |
| `src/lib/whatsapp.ts` | 109 | cleanWhatsAppMessage, encodeWhatsAppMessage, PARTNER_WHATSAPP_NUMBER, PARTNER_BLANK_TEMPLATE, PartnerPropertyConfig, formatPartnerConfigurationMessage, getPartnerBlankWhatsAppUrl |
| `src/proxy.ts` | 71 | proxy, config |

## Supporting files

| File/group | Responsibility |
|---|---|
| `package.json`, lockfile | Runtime dependencies and dev/build/start/lint commands |
| `next.config.ts` | Image optimization, redirects, security/indexing and caching headers |
| `tsconfig.json`, `next-env.d.ts` | TypeScript and framework typing |
| `eslint.config.mjs` | Next.js/TypeScript lint configuration |
| `postcss.config.mjs`, `components.json` | Tailwind/PostCSS and component tooling |
| `prisma.config.ts`, `prisma/schema.prisma` | Database connection configuration and eight database models |
| `prisma/seed.ts` | Property and demo-data bootstrap; not executed |
| `scripts/verify-property-images.mjs` | Asset/alias/graded-pixel checks |
| Other `scripts/` files | Logo updates, Willow image processing/grading and cottage naming; inquiry-clearing utility |
| `fix_keywords.js` | Content keyword maintenance |
| `generate-case-study-pdf.js` | Case-study PDF generation utility |
| `docs/admin-layout-proposal.md` | Proposed operational dashboard layout, not implemented by this review |
| `docs/image-framing-and-willow-grading.md` | Current crop/grading decisions and earlier verification notes |
| `public/` | Photos, video, meal-menu PDFs, icons, crawler information and verification files |
| Root CSV | Search/export data; not application runtime data |
| `scratch/`, raw image collections, `.dist`, `.next`, `node_modules` | Local tooling, intermediate media, build/cache or installed dependencies; not individual application source modules |
| `.env*`, `.clerk/` | Local credentials/configuration; values were not reproduced in this report |
| `README.md`, `AGENTS.md`, `CLAUDE.md`, `.gitignore` | Setup template, local agent instructions and version-control exclusions |
