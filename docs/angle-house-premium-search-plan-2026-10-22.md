# The Angle House: premium Search campaign research and launch plan

Prepared 22 October 2026. This is a proposed campaign and landing-page plan. The keyword research did not change a campaign or website. The subsequent measurement work is recorded in [the measurement setup](./angle-house-measurement-2026-10-22.md).

## Decision

Run a controlled **Google Search** pilot to sell the *entire* Angle House, rather than Performance Max or a broad villa campaign. The likely buyer is planning a family or friends' stay in Kamshet/Lonavala, wants a private 3-bedroom home with a pool, and accepts the published **from ₹13,000/night** rate. Smaller parties can still qualify if they want the full villa and accept its quote. Do not infer spending power from demographics; qualify by the actual trip, price and booking intent.

The property's credible offer is 3 bedrooms, 3 bathrooms, up to 12 guests, a private waterfall pool, a Jacuzzi in the master suite, a glass-fronted house, pet-friendly rules, and book-direct support. The live [property page](https://www.staywillas.com/villa/the-angle-house) states the rate varies by dates and group. Meals and chef services are arranged separately. EkoStay's [Villa Blanco](https://ekostay.com/property/location/villas-in-lonavala/ekostay-villa-blanco) is also a 3 BHK, 12-guest pool villa and has substantially more reviews; its [collection](https://ekostay.com/property/location/villas-in-Lonavala) has advertised a lower starting price. A generic “luxury pool villa” or discount claim is therefore weak positioning.

## Why the previous result is a poor baseline

The Google Ads account's paused `THE ANGLE HOUSE , 19-10 SEARCH CAMPAIGN` spent **₹734.85 on 33 clicks from 19–21 October 2026** and recorded **zero campaign conversions**. Queries that used the budget included 1 BHK, 8 BHK, private villas under ₹3,000/₹5,000, couple stays and named competitor properties. Relevant 3 BHK queries appeared, but the campaign's phrase/broad matching allowed substantial intent leakage. Three days cannot establish a final cost per lead, but the query mix is actionable.

The account's reported `All conversions` include large numbers of Google-hosted local actions. Its imported GA4 `qualify_lead`, `close_convert_lead` and `purchase` actions are hidden and have zero recorded conversions; enabled call-from-ad actions also have zero recorded conversions in the current account view. The inspected repository has a GA4 page tag in `src/app/layout.tsx`, but no explicit Google Ads event for a successful property enquiry, call or WhatsApp conversation. The owner's **2–3 actual leads** are the decision baseline until attribution is fixed. The current bid system should not be judged by directions or clicks to a website.

## Keyword Planner method and interpretation

Data was read from the Stay Willas account's Google Keyword Planner on 22 October 2026. Settings: **Google Search only; English; Mumbai, Pune, Pimpri-Chinchwad, Navi Mumbai and Thane; 1 October 2025–30 September 2026; INR**. Average monthly searches are historical averages for those settings and can include close variants. Keyword volumes overlap and must not be summed into a market-size forecast. `Competition` is advertiser density, not a measure of guest quality; top-of-page low/high bids are historical estimates, not actual or guaranteed CPCs. Google explains the [historical metrics](https://support.google.com/google-ads/answer/6325025?hl=en) and the separate [traffic forecasts](https://support.google.com/google-ads/answer/3022575?hl=en).

### The requested 200–300-search, low-competition pocket

Three directly usable *unbranded* terms were found around 200 searches/month, but **none is labelled Low competition** in the five-city Planner view. The Low results around 200–300 were mostly names of other individual villas, which are poor acquisition targets. Do not call them cheap opportunities based on the Low label.

| Search term | Avg. monthly searches | Competition | Estimated top-of-page bid | Decision |
|---|---:|---|---:|---|
| `private villa in lonavala` | 210 | Medium | ₹6.79–29.41 | Start: full-home intent. |
| `villas near mumbai with private pool` | 210 | Medium | ₹4.97–24.44 | Small test: ad must say Kamshet so “near Mumbai” expectations are clear. |
| `villas near mumbai with pool` | 260 | High | ₹4.74–24.61 | Hold; weaker intent than private pool. |
| `infinity pool villa lonavala` | 260 | Medium | ₹5.98–26.63 | **Reject:** The Angle House advertises a waterfall pool, not an infinity pool. |
| `lonavala bungalow with pool` | 260 | High | ₹9.88–47.05 | Hold; higher cost estimate and broader fit. |
| `1 bhk villa with private pool in lonavala` | 260 | Medium | ₹4.03–14.08 | **Reject:** wrong size, despite lower estimated bids. |
| `palacio premium villa lonavala` | 210 | Low | ₹2.44–32.87 | **Reject:** another property's name. |
| `canvas villa lonavala` | 210 | Low | ₹2.96–21.21 | **Reject:** another property's name. |

The strongest near-origin addition was `villas near pune with swimming pool`: **390/month, Medium, ₹4.51–17.13**. It is cheaper in Planner's estimate than the luxury terms but less specific about destination. Test it only with **Kamshet** visible in the ad. The explicitly premium `luxury villa in lonavala` has **590/month, Medium, ₹10.46–44.90**; `premium villas in lonavala` has only **50/month, High, ₹9.30–53.37**. Premium intent is worth testing, but it is neither the cheapest nor the highest-volume segment.

### Launch keywords

Use **exact match** initially. Exact match still covers searches with the same intent, so inspect search terms. Avoid duplicate near-variants that would only fragment reporting. [Google's match-type explanation](https://support.google.com/google-ads/answer/7478529?hl=en).

| Ad group | Exact keyword | Avg. monthly searches | Competition | Estimated top-of-page bid | Role |
|---|---|---:|---|---:|---|
| 3BR / private pool | `[3 bhk villa in lonavala]` | 720 | Medium | ₹7.58–27.71 | Best size filter. |
| 3BR / private pool | `[villa in lonavala with private pool]` | 880 | Medium | ₹6.99–32.19 | Strong product fit. |
| 3BR / private pool | `[villa in kamshet]` | 480 | Medium | ₹4.52–22.20 | Exact destination. |
| 3BR / private pool | `[kamshet villa with private pool]` | 50 | Medium | ₹2.20–22.02 | Low volume, precise fit. |
| Premium / full home | `[luxury villa in lonavala]` | 590 | Medium | ₹10.46–44.90 | Premium willingness hypothesis; qualify with price. |
| Premium / full home | `[private villa in lonavala]` | 210 | Medium | ₹6.79–29.41 | Entire-home intent. |
| Premium / full home | `[villa with jacuzzi in lonavala]` | 50 | Medium | ₹3.61–19.86 | Distinctive amenity test. |

**Controlled expansion only after query review:** `[villas near pune with swimming pool]` (390, Medium, ₹4.51–17.13), `[villas near mumbai with private pool]` (210, Medium, ₹4.97–24.44), and `[lonavala villa with pool]` (5,400, Medium, ₹6.31–29.90). The last term supplies reach but is broad enough to consume budget quickly; launch it only after negatives and first lead-quality data are in place. `best villa in lonavala with pool` is Low competition but just 140/month with a ₹8.59–40.53 bid estimate and comparison-style intent, so it is not the requested cheap 200–300-volume opportunity.

**Initial exclusions:** 1 BHK, 2 BHK, 4–8 BHK, under ₹3,000, under ₹5,000, sale, monthly rent, day picnic, resort room, and names of other properties/platforms seen in search terms. Apply negatives carefully; do not exclude all smaller groups, price queries, or “near Mumbai/Pune” automatically. Review actual search terms frequently, including close variants. [Google's search terms report](https://support.google.com/google-ads/answer/13738234?hl=en).

## Budget and campaign settings

**Recommended pilot: ₹1,200 average daily budget for 21 days**, after lead tracking and the landing-page first screen are corrected. If it spends at the average rate throughout, the test uses about **₹25,200**; the corresponding full-month budget limit is **₹36,480**. Google may spend up to **2× the average daily budget on an individual day**, subject to its monthly spending rules. This is a controlled learning budget, not a claim that every day will have enough eligible search demand or that it will deliver a given lead count. [Google's spending limits](https://support.google.com/google-ads/answer/10486637?hl=en).

Why ₹1,200: the last Angle House campaign paid about **₹22.27/click** on its short run, while Planner's premium top-of-page range reaches about ₹45. A ₹900/day budget can be enough for niche exact-match terms, but it gives less room to test premium and 3BR intent at the same time. Raising the budget beyond ₹1,200 before qualified-lead data exists is unjustified. Reduce or pause quickly if query quality or contact quality is poor. Increase toward **₹1,800/day** only after qualified cost per lead is acceptable *and* the campaign is losing useful impression share to budget.

- One standard Search campaign, two tightly themed ad groups above, Google Search initially; Search Partners and Display expansion off.
- Target **Mumbai, Pune, Pimpri-Chinchwad, Navi Mumbai and Thane** with **Presence** (people in or regularly in those places), not all India/Maharashtra. Kamshet is the destination in keyword and creative. [Location option definitions](https://support.google.com/google-ads/answer/1722038?hl=en).
- Begin with **Maximize Clicks and a provisional ₹40 maximum CPC bid limit** while true lead conversion data is absent. This is a test ceiling, not an observed optimal bid; too low a ceiling may suppress the luxury auctions. Adjust using delivered CPC, search terms and qualified contacts. Maximize Clicks seeks clicks, so the keyword, negative and ad filters are essential. [Bidding behavior](https://support.google.com/google-ads/answer/6268626?hl=en).
- After a stable stream of verified qualified leads exists, use **Maximize Conversions** with only the qualified lead action in the campaign's bidding goal. Do not switch based on local directions, page views or WhatsApp taps.
- Keep website ads eligible all week: a guest can book a weekday stay on Sunday. Show the call asset only during confirmed answerable hours.

Suggested responsive Search copy themes: **“The Angle House Kamshet”**, **“Entire 3BR Villa For 12”**, **“Private Waterfall Pool”**, **“Jacuzzi In The Master Suite”**, **“From ₹13,000/Night”**, **“Check Dates & Call Direct”**. Descriptions should explicitly say Kamshet, entire villa, capacity and starting rate, with final rate dependent on dates/group. Verify offers and their eligibility before including them. Send every ad to `https://www.staywillas.com/villa/the-angle-house`, not the homepage or `/villas` collection.

## Landing-page changes before spending

The current live page is visually strong, with property photographs, details and a booking panel. A desktop first-screen inspection showed the property name, location, rating and photographs, while **price, 3BR capacity and the booking card were below the first viewport**. The preserved mobile preview likewise places most facts below the photo collage, though a bottom date bar appears. Specific recommendations:

1. **Rework the first screen for paid visitors.** Under “The Angle House,” show a compact, readable line: **“Entire 3-bedroom villa · Kamshet near Lonavala · up to 12 guests · private waterfall pool + Jacuzzi · from ₹13,000/night.”** Put **Check dates**, **Call booking team** and **WhatsApp this villa** near it, while keeping the photography. The header's current **Book Direct** link leads to `/villas`; on this property route, make it property-specific or remove it from the paid path.
2. **Make the first enquiry useful.** Ask for dates (or “dates flexible”), actual guest count, name and phone before classifying a form submission as a lead. Show the starting rate and that meals/extra guests can change the quote. Current `booking-modal-flow.tsx` captures a CRM lead when the visitor submits name and phone to enter the reservation panel, before dates are selected, and populates `guests` with the property's `maxGuests`, not the visitor's group size. This makes lead counts and qualification unreliable.
3. **Keep phone and WhatsApp immediate.** A visitor ready to talk should not have to complete a booking modal first. Prefill WhatsApp with The Angle House, dates and group size when known. Treat an outbound click as a *micro event*, not a qualified lead; confirm that a conversation or answered call took place.
4. **Build confidence without exaggerated savings.** Keep accurate guest reviews, exact capacity, current photography, map/travel context, house rules, cancellation link and current rate/offer terms near the decision path. With only four on-site reviews, make verification and direct-booking contact clear. Do not lead with “lowest price”: a comparable EkoStay property advertises a lower starting rate.
5. **Check production mobile load time.** The repository's prior *local* throttled Lighthouse note recorded an LCP of 4.1 seconds; this is not a production metric. Measure the live paid landing experience on mobile and prioritize the hero image and critical booking controls if it is slow.

## Lead measurement and decision gates

Define a **qualified lead** as a reachable caller/enquirer who wants the entire Angle House, has plausible travel dates or a flexible date window, and accepts the quoted price range for that group. Track: source/campaign/query where available, dates, group size, quoted amount, answered/contacted status, qualified status, booking status and booking contribution. Preserve ad click identifiers/UTMs with appropriate consent for later offline qualification imports.

- **Primary conversion for bidding:** a successfully submitted, validated property enquiry with dates/guest count and deduplication, or an answered call that passes a meaningful duration threshold. Later import *qualified* leads/bookings as stronger signals. A raw lead-gate opening is not enough.
- **Secondary observations:** page view, availability view, call click, WhatsApp click and reservation-button click. Configure campaign goals so these do not enter bidding accidentally. [Google's primary/secondary rules](https://support.google.com/google-ads/answer/11461796?hl=en).
- **First 100 clicks:** verify tracking and inspect every available search term; add negatives for mismatched size, price, competitor property names and stay type.
- **At 250 clicks or 14 days, whichever comes later:** compare *qualified* leads, answered calls, cost per qualified lead and reasons lost. If no qualified leads, change the query mix/offer/page before spending more.
- **Scale gate:** the maximum sustainable qualified-lead cost depends on actual contribution margin and close rate: **maximum break-even CPL = contribution per booking × qualified-lead-to-booking rate**. For illustration only, ₹8,000 contribution and one booking from four qualified leads gives ₹2,000 break-even CPL; a profitable target must be lower. The owner should replace these example numbers with actual booking economics before approving a permanent scale target.

The raw Planner exports are saved with this plan: [property/location](research/angle-house-planner-property-2026-10-22.csv), [premium](research/angle-house-planner-premium-2026-10-22.csv), and [family/near-origin](research/angle-house-planner-family-origin-2026-10-22.csv). They contain many rejected or irrelevant ideas as well as the terms above. No actual CPC or lead forecast is claimed from those exports.
