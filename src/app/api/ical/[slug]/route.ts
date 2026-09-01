import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Helper to format Date to standard iCal date format (YYYYMMDD)
function formatDateToICS(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

// Helper to sanitize summaries (remove newlines, backslashes, colons)
function sanitizeText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    // Gracefully handle both Next.js 14 (sync) and Next.js 15+ (async) params
    const resolvedParams = typeof (params as any).then === "function" ? await params : (params as { slug: string });
    const { slug } = resolvedParams;

    // 1. Fetch villa from database
    const villa = await prisma.villa.findUnique({
      where: { slug },
      include: {
        bookings: {
          where: {
            status: { in: ["CONFIRMED", "PENDING", "BLOCKED"] },
          },
        },
      },
    });

    if (!villa) {
      return new NextResponse("Villa not found", { status: 404 });
    }

    // 2. Build the standard iCal file header
    let icalContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Stay Willas//Channel Manager Exporter//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      `X-WR-CALNAME:Stay Willas - ${villa.name}`,
      "X-WR-TIMEZONE:Asia/Kolkata",
    ].join("\r\n") + "\r\n";

    // 3. Append events for each booking and blackout block
    const now = new Date();
    const stampDate = formatDateToICS(now) + "T120000Z";

    for (const booking of villa.bookings) {
      let summary = "Reserved";
      
      // Attempt to parse manual booking details to make exporter descriptions detailed
      if (booking.userId.startsWith("{")) {
        try {
          const parsed = JSON.parse(booking.userId);
          if (parsed.type === "MAINTENANCE") {
            summary = `Maintenance: ${parsed.reason}`;
          } else if (parsed.type === "OWNER_USE") {
            summary = `Owner Occupancy: ${parsed.reason}`;
          } else if (parsed.type === "MANUAL") {
            summary = `Manual Booking: ${parsed.name}`;
          }
        } catch (e) {
          // Fallback to Reserved
        }
      } else if (booking.userId.startsWith("CHANNEL_SYNC|")) {
        const parts = booking.userId.split("|");
        summary = `Sync: ${parts[1] || "External Channel"}`;
      }

      icalContent += [
        "BEGIN:VEVENT",
        `UID:booking-${booking.id}@staywillas.com`,
        `DTSTAMP:${stampDate}`,
        `DTSTART;VALUE=DATE:${formatDateToICS(booking.checkIn)}`,
        `DTEND;VALUE=DATE:${formatDateToICS(booking.checkOut)}`,
        `SUMMARY:${sanitizeText(summary)}`,
        "END:VEVENT",
      ].join("\r\n") + "\r\n";
    }

    icalContent += "END:VCALENDAR\r\n";

    // 4. Return standard plaintext .ics stream
    return new NextResponse(icalContent, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${slug}-availability.ics"`,
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
      },
    });
  } catch (error: any) {
    console.error("iCal Export API Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
