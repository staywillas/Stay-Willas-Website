import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await context.params;
  const slug = resolvedParams.slug;

  const villa = await prisma.villa.findFirst({
    where: {
      OR: [
        { slug },
        { id: slug }
      ]
    },
    include: {
      bookings: {
        where: {
          status: { in: ["CONFIRMED", "PENDING"] }
        }
      }
    }
  });

  if (!villa) {
    return new NextResponse("Villa not found", { status: 404 });
  }

  // Generate standard VCALENDAR feed string
  let ical = "BEGIN:VCALENDAR\r\n";
  ical += "VERSION:2.0\r\n";
  ical += "PRODID:-//Stay Willas//NONSGML Villa Calendar Sync//EN\r\n";
  ical += "CALSCALE:GREGORIAN\r\n";
  ical += "METHOD:PUBLISH\r\n";
  ical += `X-WR-CALNAME:${villa.name} - Stay Willas\r\n`;

  for (const booking of villa.bookings) {
    const startStr = formatDateToICal(booking.checkIn);
    const endStr = formatDateToICal(booking.checkOut);
    
    ical += "BEGIN:VEVENT\r\n";
    ical += `UID:booking-${booking.id}@staywillas.com\r\n`;
    ical += `DTSTAMP:${formatDateToICal(booking.createdAt)}\r\n`;
    // Standard all-day date markers for blockages
    ical += `DTSTART;VALUE=DATE:${startStr.substring(0, 8)}\r\n`;
    ical += `DTEND;VALUE=DATE:${endStr.substring(0, 8)}\r\n`;
    ical += `SUMMARY:Blocked - Stay Willas Stay\r\n`;
    ical += "END:VEVENT\r\n";
  }

  ical += "END:VCALENDAR\r\n";

  return new NextResponse(ical, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="villa-${slug}-calendar.ics"`,
      "Cache-Control": "no-cache, no-store, must-revalidate"
    }
  });
}

function formatDateToICal(date: Date): string {
  const d = new Date(date);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const hours = String(d.getUTCHours()).padStart(2, "0");
  const minutes = String(d.getUTCMinutes()).padStart(2, "0");
  const seconds = String(d.getUTCSeconds()).padStart(2, "0");
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}
