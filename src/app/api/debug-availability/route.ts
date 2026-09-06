import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

export async function GET(req: Request) {
  // Prevent unauthorized access in production
  if (process.env.NODE_ENV === "production") {
    const session = await getSessionUser();
    const authHeader = req.headers.get("x-admin-key");
    const adminKey = process.env.ADMIN_API_KEY;
    const isKeyValid = Boolean(adminKey && authHeader === adminKey);

    if (!isKeyValid && (!session || session.role !== "admin")) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
  }
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
