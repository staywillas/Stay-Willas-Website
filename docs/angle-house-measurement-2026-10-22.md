# The Angle House measurement setup

Prepared 22 October 2026 for Stay Willas Google Ads account `108-054-8415`.

## What has been configured

- Google Ads conversion action `Angle House | booking enquiry with dates` (ID `7863014541`) was created under **Request quote**. It counts **one** lead per ad click, with a nominal ₹1 value. The Request quote goal was removed from account defaults, so existing campaigns do not adopt it. It must be selected as a campaign-specific goal for the new Angle House campaign.
- The website code sends that Google Ads conversion and a GA4 `generate_lead` event after a dated WhatsApp reservation enquiry is saved to the site's lead database or a verification booking is successfully created. A browser-session key prevents both actions for the same stay dates from counting twice.
- Lead-gate contact capture, phone-link clicks and WhatsApp clicks send separate GA4 events. They are engagement signals, **not** Google Ads lead conversions. A WhatsApp click does not prove a message was sent; a phone-link click does not prove the call was answered.
- Lead records from the Angle House booking flow store available UTM values, Google click IDs and the landing path in the existing enquiry message or provisional booking payload. No database migration is required. No guest name, email or phone is sent in the analytics events.

## Before using this for bidding

1. Deploy the website changes. The Ads action will show **Misconfigured** until Google receives the tag and a valid conversion. Do not infer a lead count from the current status.
2. Use Google Tag Assistant and a controlled booking-flow submission on the deployed site to confirm the GA4 event and Google Ads `send_to` value `AW-18249597691/27FDCI2psKUdEPuFi_5D` fire once **after** a successful save. Check the enquiry in the admin CRM. A test submission should be clearly marked as a test and removed from lead-quality reporting. Google Ads conversion reporting may take time to appear.
3. In the new Angle House Search campaign, choose campaign-specific goals: this **Request quote** action and one verified **Calls from ads** action. The account currently has two enabled 60-second Calls from ads actions; inspect their call-reporting setup before selecting one to avoid duplicate call counts. Keep directions, page views, WhatsApp clicks and generic contact actions out of the bidding goal.
4. Enable a call asset and Google call reporting for the new campaign. A website `tel:` click is tracked as an observation only. Measuring an answered **website** call requires the separate Google forwarding-number setup; it is not yet installed here.
5. Each day, mark each enquiry in the CRM or a simple lead sheet as **unreachable, unqualified, qualified, quoted, or booked**. Record stay dates, group size, quoted price, source and whether a call connected. Review weekly by search term and by *qualified* cost per lead. Upload qualified and booked outcomes to Ads only after the offline conversion workflow and consent/data handling are confirmed.

## Current limits

- The site code is in the local workspace; it is not deployed by this change.
- Ads does not yet have a verified event from the live site. No campaign was launched or budget changed.
- Browser-side analytics can be blocked. The CRM save is the operational record of website enquiries.
- A saved dated enquiry is still an **enquiry**, not proof of a qualified conversation or a booking. Staff qualification remains necessary.

Google references: [web conversion setup](https://support.google.com/google-ads/answer/16560108?hl=en), [primary and secondary actions](https://support.google.com/google-ads/answer/11461796?hl=en).
