# Stay Willas admin: recommended layout

Keep the panel focused on daily work. Use beige (#F5F2EA) for the canvas, dark blue (#1B3564) for active navigation and primary actions, and near-black (#171717) for body text. Use low-opacity black for dividers and secondary text. Status labels should use words, not different colors.

## What causes clutter today

The current dashboard puts a large branded header, account controls, four large metric cards and nine horizontal tabs above the working area. Those metric cards stay visible on every tab. Overview repeats navigation actions and includes infrastructure information. Long uppercase labels, colored badges, glass surfaces, large corner radii and animated status indicators compete with reservation information.

## Proposed desktop structure

Use a 216px left sidebar with simple text links. Put the current page title and one primary action above the content. Keep the operational content wide; replace oversized cards with compact rows and tables.

| Sidebar group | Pages | Existing functions retained |
| --- | --- | --- |
| Start | Overview | Compact metrics, arrivals/departures and bookings needing attention |
| Operations | Bookings, Calendar, Leads | Reservations, verification, availability, guest inquiries |
| Properties | Properties, Pricing | Property editing, seasonal prices, daily pricing, channel settings |
| Finance | Invoices, Reports | Food/bill calculator, payment details, monthly reporting |

Make **Awaiting verification** a clearly labeled Bookings filter with a count, rather than a separate top-level page. Keep its existing approval/rejection workflow. Keep channel sync in Properties/Calendar. Keep the quick calculator accessible through Invoices. Put account and logout at the bottom of the sidebar.

## Recommended page patterns

- **Overview:** three or four compact summary numbers followed by today's operations and reservations needing attention. Show metrics only here. Replace infrastructure status with a small timestamp beside Refresh.
- **Bookings:** search + property/date/status filters, then a table: guest, property, dates, total, payment status and booking status. One “New booking” button. Clicking a row opens the existing bill/details flow in a side panel; destructive actions remain explicitly labeled.
- **Calendar/Pricing:** property selector and date controls directly above the calendar. Keep bulk-edit actions together in one toolbar.
- **Properties:** a compact table rather than large image cards. Show name, location, capacity and pricing; open details to edit.
- **Leads:** one searchable/filterable table with contact, requested property, dates and follow-up action. Keep inquiry types as plain labels.
- **Invoices/Reports:** retain the calculations and export functions, with consistent form labels and spacing.

## Mobile and visual rules

- Below 900px, replace the sidebar with a “Menu” drawer and keep the current page title visible.
- Use 15–16px body/navigation text, 13px supporting text and 26px page headings. Use one plain sans-serif family.
- Use 8px corners, 1px dividers and 16–24px spacing. Remove decorative gradients, glass blur, glows, pulsing dots, emoji labels and hover zooms.
- Use one navy primary button per working area; secondary actions are beige with a thin dark border.
- Keep status information accessible through text: Confirmed, Pending review, Part paid, Paid and Cancelled. Preserve existing business status values.
- Keep tables within their own scroll container on small screens; never let the whole page overflow horizontally. Keep forms in a single column on phones.

## Implementation boundary

This is a layout proposal, not a replacement for the live admin panel. Apply it to the presentation layer in `src/components/admin/` and the admin page shell. Preserve authentication, booking data, approval rules, pricing math, payments, notifications and export behavior. No admin access or real record changes are needed to review this proposal.
