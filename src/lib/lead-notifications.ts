import { sendEmail } from "@/lib/mail";
import { format } from "date-fns";

export const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "staywillas@gmail.com";

interface LeadNotificationData {
  type: "BOOKING_GATE_LEAD" | "BOOKING_REQUEST" | "CONFIRMED_BOOKING" | "CALLBACK_REQUEST" | "PARTNER_APPLICATION" | "GENERAL_INQUIRY";
  name: string;
  phone: string;
  email?: string;
  villaName?: string;
  checkIn?: Date | string;
  checkOut?: Date | string;
  guests?: number | string;
  totalPrice?: number | string;
  couponCode?: string;
  addOns?: string[];
  message?: string;
}

export async function sendAdminLeadNotification(data: LeadNotificationData) {
  const {
    type,
    name,
    phone,
    email = "Not provided",
    villaName,
    checkIn,
    checkOut,
    guests,
    totalPrice,
    couponCode,
    addOns,
    message,
  } = data;

  // Format clean phone for tel: and WhatsApp wa.me
  const digitsOnly = phone.replace(/[^0-9]/g, "");
  let waNumber = digitsOnly;
  if (waNumber.length === 10) {
    waNumber = `91${waNumber}`;
  } else if (waNumber.length === 11 && waNumber.startsWith("0")) {
    waNumber = `91${waNumber.slice(1)}`;
  }

  const waPreFill = encodeURIComponent(
    `Hi ${name}! 🌟 This is the Stay Willas Concierge team reaching out regarding your inquiry for ${villaName || "our luxury private pool villas"}. How can we assist with your stay?`
  );
  const waUrl = digitsOnly.length >= 10 ? `https://wa.me/${waNumber}?text=${waPreFill}` : null;
  const telUrl = digitsOnly.length >= 8 ? `tel:+${waNumber}` : null;

  // Determine Badge, Subject & Title based on lead type
  let badgeText = "NEW LEAD";
  let badgeBg = "#1B3564";
  let subject = `🔔 New Lead: ${name} (${phone})`;
  let heading = "New Inquiry Received";

  switch (type) {
    case "BOOKING_GATE_LEAD":
      badgeText = "🎯 DIRECT BOOKING LEAD";
      badgeBg = "#B8860B";
      subject = `🎯 New Lead for ${villaName || "Villa"}: ${name} (${phone})${totalPrice ? ` • ₹${typeof totalPrice === "number" ? totalPrice.toLocaleString("en-IN") : totalPrice}` : ""}`;
      heading = `Guest Lead for ${villaName || "Villa"}`;
      break;
    case "BOOKING_REQUEST":
      badgeText = "🚨 BOOKING REQUEST (AWAITING VERIFICATION)";
      badgeBg = "#DC2626";
      subject = `🚨 Booking Request: ${name} for ${villaName || "Villa"} (₹${typeof totalPrice === "number" ? totalPrice.toLocaleString("en-IN") : totalPrice})`;
      heading = `New Booking Request for ${villaName || "Villa"}`;
      break;
    case "CONFIRMED_BOOKING":
      badgeText = "✅ PAYMENT CONFIRMED BOOKING";
      badgeBg = "#16A34A";
      subject = `🎉 Paid Booking Confirmed: ${name} for ${villaName || "Villa"}`;
      heading = `Confirmed Reservation for ${villaName || "Villa"}`;
      break;
    case "CALLBACK_REQUEST":
      badgeText = "📞 PHONE CALLBACK REQUEST";
      badgeBg = "#2563EB";
      subject = `📞 Quick Callback Request from ${phone}`;
      heading = `Customer Requested a Phone Callback`;
      break;
    case "PARTNER_APPLICATION":
      badgeText = "🏡 HOMEOWNER PARTNER INQUIRY";
      badgeBg = "#4D7C0F";
      subject = `🏡 Homeowner Partnership Inquiry: ${name} (${phone})`;
      heading = `New Luxury Property Partnership Application`;
      break;
    default:
      badgeText = "📬 WEBSITE INQUIRY";
      badgeBg = "#1B3564";
      subject = `📬 Website Inquiry: ${name} (${phone})`;
      heading = `New Customer Inquiry`;
  }

  // Format Dates if present
  const checkInFormatted = checkIn ? (checkIn instanceof Date ? format(checkIn, "EEE, dd MMM yyyy") : String(checkIn)) : null;
  const checkOutFormatted = checkOut ? (checkOut instanceof Date ? format(checkOut, "EEE, dd MMM yyyy") : String(checkOut)) : null;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f7; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0E1B35 0%, #1B3564 100%); padding: 32px 28px; text-align: left; color: #ffffff;">
              <div style="display: inline-block; background-color: ${badgeBg}; color: #ffffff; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; padding: 5px 12px; border-radius: 50px; text-transform: uppercase; margin-bottom: 12px;">
                ${badgeText}
              </div>
              <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; line-height: 1.3;">
                ${heading}
              </h1>
              <p style="margin: 6px 0 0; font-size: 13px; color: #DAA520; font-weight: 600;">
                Stay Willas Lead Alert • Received ${format(new Date(), "dd MMM yyyy, hh:mm a")}
              </p>
            </td>
          </tr>

          <!-- Quick Action Buttons -->
          <tr>
            <td style="padding: 24px 28px 12px; background-color: #FAF8F5; border-bottom: 1px solid #f1f5f9;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom: 8px;">
                    <p style="margin: 0 0 12px; font-size: 13px; font-weight: 700; color: #0E1B35; text-transform: uppercase; letter-spacing: 0.05em;">
                      ⚡ Fast 1-Tap Follow-Up:
                    </p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        ${waUrl ? `
                        <td style="padding-right: 10px;">
                          <a href="${waUrl}" target="_blank" style="display: inline-block; background-color: #25D366; color: #ffffff; font-size: 13px; font-weight: 800; text-decoration: none; padding: 12px 22px; border-radius: 50px; box-shadow: 0 4px 12px rgba(37,211,102,0.3);">
                            💬 Chat on WhatsApp
                          </a>
                        </td>
                        ` : ""}
                        ${telUrl ? `
                        <td>
                          <a href="${telUrl}" style="display: inline-block; background-color: #1B3564; color: #ffffff; font-size: 13px; font-weight: 800; text-decoration: none; padding: 12px 22px; border-radius: 50px; box-shadow: 0 4px 12px rgba(27,53,100,0.25);">
                            📞 Call Guest Now
                          </a>
                        </td>
                        ` : ""}
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Details Table -->
          <tr>
            <td style="padding: 24px 28px;">
              <h2 style="margin: 0 0 16px; font-size: 15px; font-weight: 800; color: #0E1B35; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 2px solid #DAA520; padding-bottom: 8px;">
                Customer & Request Details
              </h2>
              
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 14px; line-height: 1.6;">
                <tr>
                  <td width="35%" style="padding: 8px 0; color: #64748b; font-weight: 600;">Guest Name:</td>
                  <td width="65%" style="padding: 8px 0; color: #0f172a; font-weight: 800;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Phone Number:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-weight: 800;">
                    <a href="tel:${phone}" style="color: #1B3564; text-decoration: underline;">${phone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Email:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-weight: 500;">
                    ${email !== "Not provided" && email !== "N/A" && email !== "no-email@staywillas.com" 
                      ? `<a href="mailto:${email}" style="color: #1B3564; text-decoration: underline;">${email}</a>` 
                      : "<span style='color: #94a3b8;'>Not provided</span>"}
                  </td>
                </tr>
                ${villaName ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Villa Interested:</td>
                  <td style="padding: 8px 0; color: #B8860B; font-weight: 800;">🏰 ${villaName}</td>
                </tr>
                ` : ""}
                ${checkInFormatted && checkOutFormatted ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Dates of Stay:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-weight: 700;">📅 ${checkInFormatted} → ${checkOutFormatted}</td>
                </tr>
                ` : ""}
                ${guests ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Guests Count:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-weight: 700;">👥 ${guests} Guests</td>
                </tr>
                ` : ""}
                ${totalPrice ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Total Estimate:</td>
                  <td style="padding: 8px 0; color: #16A34A; font-weight: 800; font-size: 16px;">₹${typeof totalPrice === "number" ? totalPrice.toLocaleString("en-IN") : totalPrice}</td>
                </tr>
                ` : ""}
                ${couponCode ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Coupon Applied:</td>
                  <td style="padding: 8px 0; color: #DC2626; font-weight: 800;">🏷️ ${couponCode}</td>
                </tr>
                ` : ""}
                ${addOns && addOns.length > 0 ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Selected Add-ons:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${addOns.join(", ")}</td>
                </tr>
                ` : ""}
                ${message ? `
                <tr>
                  <td colspan="2" style="padding: 14px 0 6px; color: #64748b; font-weight: 600;">Message / Customer Notes:</td>
                </tr>
                <tr>
                  <td colspan="2" style="background-color: #FAF8F5; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; color: #334155; font-size: 13px; line-height: 1.5; font-style: italic;">
                    "${message}"
                  </td>
                </tr>
                ` : ""}
              </table>
            </td>
          </tr>

          <!-- Footer & Admin Access -->
          <tr>
            <td style="padding: 20px 28px; background-color: #0E1B35; text-align: center; color: #94a3b8; font-size: 12px;">
              <p style="margin: 0 0 8px; color: #ffffff; font-weight: 700;">Stay Willas Hospitality Management</p>
              <p style="margin: 0 0 12px;">This notification was delivered in real-time to <strong style="color: #DAA520;">staywillas@gmail.com</strong>.</p>
              <a href="https://www.staywillas.com/admin" target="_blank" style="display: inline-block; background-color: #DAA520; color: #0E1B35; font-weight: 800; font-size: 11px; text-decoration: none; padding: 8px 18px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.05em;">
                Open Admin Dashboard
              </a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return await sendEmail({
    to: ADMIN_NOTIFICATION_EMAIL,
    subject,
    html,
  });
}
