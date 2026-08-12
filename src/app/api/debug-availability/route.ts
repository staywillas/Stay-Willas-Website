import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const villas = await prisma.villa.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        location: true,
        guests: true,
        bookings: {
          where: {
            OR: [
              { status: { in: ["CONFIRMED", "PENDING", "BLOCKED"] } },
              { status: "HELD", createdAt: { gte: tenMinutesAgo } }
            ]
          },
          select: {
            id: true,
            checkIn: true,
            checkOut: true,
            status: true,
          },
          orderBy: { checkIn: "asc" }
        }
      }
    });

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      totalVillas: villas.length,
      villas: villas.map(v => ({
        name: v.name,
        slug: v.slug,
        location: v.location,
        maxGuests: v.guests,
        activeBookings: v.bookings.length,
        bookings: v.bookings.map(b => ({
          id: b.id,
          checkIn: b.checkIn.toISOString(),
          checkOut: b.checkOut.toISOString(),
          status: b.status
        }))
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
