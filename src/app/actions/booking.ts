"use server";

import Stripe from "stripe";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

export async function createCheckoutSession(formData: {
  villaId: string;
  villaName: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  pricePerNight: number;
}) {
  const nights = Math.ceil((formData.checkOut.getTime() - formData.checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const subtotal = formData.pricePerNight * nights;
  const serviceFee = 5000;
  const total = subtotal + serviceFee;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${formData.villaName} - Stay Willas`,
              description: `${nights} nights stay from ${formData.checkIn.toLocaleDateString()} to ${formData.checkOut.toLocaleDateString()}`,
            },
            unit_amount: total * 100, // Stripe wants the price in the lowest currency unit (paise/cents), so multiply by 100
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/villa/${formData.villaId}`,
      metadata: {
        villaId: formData.villaId,
        checkIn: formData.checkIn.toISOString(),
        checkOut: formData.checkOut.toISOString(),
        guests: formData.guests.toString(),
      },
    });

    return { url: session.url };
  } catch (error) {
    console.error("Stripe Error:", error);
    throw new Error("Failed to create checkout session");
  }
}

export async function getDestinationAvailability(region: string) {
  try {
    // 1. Fetch all villas in this region
    const villas = await prisma.villa.findMany({
      where: {
        location: {
          contains: region,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
      },
    });

    const totalVillas = villas.length;
    if (totalVillas === 0) {
      return { success: true, bookings: [], totalVillas: 0 };
    }

    // 2. Fetch all active bookings in this region
    const bookings = await prisma.booking.findMany({
      where: {
        status: { in: ["CONFIRMED", "PENDING", "BLOCKED"] },
        villa: {
          location: {
            contains: region,
            mode: "insensitive",
          },
        },
      },
      select: {
        checkIn: true,
        checkOut: true,
        villaId: true,
      },
    });

    return { 
      success: true, 
      bookings: bookings.map(b => ({
        checkIn: b.checkIn.toISOString(),
        checkOut: b.checkOut.toISOString(),
        villaId: b.villaId
      })), 
      totalVillas 
    };
  } catch (error: any) {
    console.error("Failed to fetch destination availability:", error);
    return { success: false, error: error.message || "Failed to fetch availability data." };
  }
}
