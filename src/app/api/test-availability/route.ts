import { NextResponse } from "next/server";
import { checkAvailableVillasForDates } from "@/app/actions/booking";
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

  const url = new URL(req.url);
  const destination = url.searchParams.get("destination") || "Lonavala";
  const checkIn = url.searchParams.get("checkIn") || undefined;
  const checkOut = url.searchParams.get("checkOut") || undefined;
  const guests = Number(url.searchParams.get("guests")) || 2;

  try {
    const result = await checkAvailableVillasForDates({
      destination,
      checkIn,
      checkOut,
      guests,
    });

    return NextResponse.json({
      input: { destination, checkIn, checkOut, guests },
      result,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
