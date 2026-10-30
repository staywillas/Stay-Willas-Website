# Property UI rollout

The Angle House design now serves all seven current property URLs: The Angle House, Willow Peak's entire estate, Breeze, Crest, Heaven, Canopy Crest and Casa De Reva.

`property-editorial-details.tsx` is the shared server-rendered layout. `property-editorial.ts` provides reviewed photos and concise property-specific copy. The shared stylesheet preserves the homepage's ivory/navy/gold palette, desktop booking sidebar and native mobile photo-and-text carousel. The old property-page markup was removed rather than retained as a second layout.

Property capacities, bedroom/bathroom counts, full descriptions, amenities, reviews, availability and rate overrides still come from the database. Willow Peak is described as Jacuzzi cottages rather than a swimming-pool villa. Cottage photos are shared estate photographs, with a short clarification on individual cottage pages. Existing property URLs, metadata, menus, sharing, saving and review submission remain available.

Willow Peak has links for choosing Breeze, Crest, Heaven or the entire estate. Each page initializes the booking flow with its own unit. A property key keeps client state from carrying between different properties. Individual cottage rates are adapted to the existing booking calculator's estate-rate input convention; its per-cottage division and weekday promotion formulas remain unchanged. No database records or real leads were created during verification.

Validation: TypeScript and focused ESLint passed. All seven property URLs returned HTTP 200 with the correct property heading and shared spaces section. A Webpack production build passed, including all 84 static pages. Desktop and mobile visual/interaction checks covered the shared layout, photo carousels and Willow Peak unit selection. Shared analytics/auth performance limitations from the original Angle House audit still apply; no new site-wide performance score is claimed.

Follow-up refinements move the amenity preview and highlighted “View all” disclosure directly under the hero. The desktop booking sidebar now spans the full left-hand content through the closing section and stops at the footer; short desktop screens can scroll within the booking panel. Angle House's mobile header uses smaller share/save buttons with extended hit areas, tighter spacing and a 4:3 first photo. At 390×700, the first photo ends at 540px, above the fixed booking bar at 626px.

The availability and mobile date buttons use React Bits BorderGlow, adapted from `src/ts-default/Components/BorderGlow` in https://github.com/DavidHDev/react-bits. The original license and copyright notice are included beside the local component. The effect matches the navy buttons, supports keyboard focus, and runs with automatic animation disabled; the mobile glow radius is reduced to fit the booking bar.

Final boundary checks verified the desktop sidebar at 102px while scrolling through reviews. At the footer, the sidebar's bottom aligns with the footer's top and does not overlap it. Closing a booking overlay returns focus without scrolling the page. The amenities disclosure exposes all nine Angle House amenities when opened, without horizontal overflow.

The stay-time consistency review confirms standard check-in from 2:00 PM and check-out by 11:00 AM in the shared property layout, property FAQs, structured data, booking confirmation, global FAQs and terms. Older weekend and corporate blog itineraries were corrected to fit those times; any early arrival or late departure remains subject to advance confirmation and availability. Calendar date normalization and availability calculations were not changed.
