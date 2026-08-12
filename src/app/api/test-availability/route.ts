import { NextResponse } from "next/server";
import { checkAvailableVillasForDates } from "@/app/actions/booking";

export async function GET(req: Request) {
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
