"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/session";
import { sendAdminLeadNotification } from "@/lib/lead-notifications";
import { format } from "date-fns";

export async function submitInquiry(formData: {
  name: string;
  email: string;
  phone: string;
  message: string;
  villaId?: string;
  type?: "GUEST" | "OWNER" | "BOOKING_LEAD";
}) {
  try {
    // Input sanitization & boundary validation
    const name = (formData.name || "").trim().slice(0, 100);
    const email = (formData.email || "").trim().slice(0, 150);
    const phone = (formData.phone || "").trim().slice(0, 30);
    const message = (formData.message || "").trim().slice(0, 2000);

    if (!name || !phone) {
      throw new Error("Name and phone number are required.");
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone,
        message,
        villaId: formData.villaId || null,
        type: formData.type || "GUEST",
      },
    });

    // Optional: resolve villa name if villaId is present
    let villaName = "";
    if (formData.villaId) {
      try {
        const v = await prisma.villa.findUnique({
          where: { id: formData.villaId },
          select: { name: true }
        });
        if (v) villaName = v.name;
      } catch {}
    }

    const isOwner = (formData.type || "GUEST") === "OWNER";
    const isBookingLead = (formData.type || "GUEST") === "BOOKING_LEAD";
    const isCallback = name === "Phone Callback Request";
    const leadType = isOwner 
      ? "PARTNER_APPLICATION" 
      : isBookingLead
      ? "CALLBACK_REQUEST"
      : isCallback 
      ? "CALLBACK_REQUEST" 
      : "GENERAL_INQUIRY";

    sendAdminLeadNotification({
      type: leadType,
      name,
      phone,
      email: email && email !== "no-email@staywillas.com" ? email : undefined,
      villaName: villaName || undefined,
      message,
    }).catch(err => console.error("❌ Failed to dispatch admin inquiry email:", err));

    // Revalidate the admin dashboard so the new inquiry shows up instantly
    try {
      revalidatePath("/admin");
    } catch {}
    
    return { success: true, inquiryId: inquiry.id };
  } catch (error: any) {
    console.error("Failed to submit inquiry:", error);
    throw new Error(error.message || "Failed to submit inquiry to the database");
  }
}

/**
 * Automatically captures a booking lead when a user submits their contact info or reserves for any villa
 */
export async function captureBookingLead(data: {
  name: string;
  phone: string;
  email?: string;
  villaName: string;
  villaId?: string;
  checkIn?: string | Date;
  checkOut?: string | Date;
  guests?: number | string;
  totalPrice?: number | string;
  couponCode?: string;
  addOns?: string[];
  message?: string;
}) {
  try {
    const name = (data.name || "").trim().slice(0, 100);
    const phone = (data.phone || "").trim().slice(0, 30);
    const email = (data.email || "N/A").trim().slice(0, 150);
    const villaName = (data.villaName || "").trim().slice(0, 100);

    if (!name || !phone) {
      return { success: false, error: "Name and phone are required." };
    }

    const checkInStr = data.checkIn ? (data.checkIn instanceof Date ? format(data.checkIn, "dd MMM yyyy") : String(data.checkIn)) : null;
    const checkOutStr = data.checkOut ? (data.checkOut instanceof Date ? format(data.checkOut, "dd MMM yyyy") : String(data.checkOut)) : null;
    const datesDetail = checkInStr && checkOutStr ? ` | Dates: ${checkInStr} to ${checkOutStr}` : "";
    const guestsDetail = data.guests ? ` | Guests: ${data.guests}` : "";
    const priceDetail = data.totalPrice ? ` | Price: ₹${typeof data.totalPrice === "number" ? data.totalPrice.toLocaleString("en-IN") : data.totalPrice}` : "";

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        phone,
        email,
        message: data.message || `Direct Booking Lead for ${villaName}.${datesDetail}${guestsDetail}${priceDetail}`,
        villaId: data.villaId || null,
        type: "BOOKING_LEAD",
      },
    });

    // Trigger instant high-intent email notification to staywillas@gmail.com
    sendAdminLeadNotification({
      type: "BOOKING_GATE_LEAD",
      name,
      phone,
      email: email !== "N/A" ? email : undefined,
      villaName,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: data.guests,
      totalPrice: data.totalPrice,
      couponCode: data.couponCode,
      addOns: data.addOns,
      message: data.message || `Guest started booking for ${villaName}.${datesDetail}${guestsDetail}${priceDetail}`,
    }).catch(err => console.error("❌ Failed to dispatch booking gate lead email:", err));

    try {
      revalidatePath("/admin");
    } catch {}

    return { success: true, leadId: inquiry.id };
  } catch (error: any) {
    console.error("Failed to capture booking lead:", error);
    return { success: false, error: error.message };
  }
}

export async function getInquiries(type?: "GUEST" | "OWNER" | "BOOKING_LEAD") {
  try {
    // Only authenticated admin can view private customer leads & inquiries
    await requireAdminSession();

    const inquiries = await prisma.inquiry.findMany({
      where: type ? { type } : {},
      orderBy: { createdAt: "desc" },
    });
    return inquiries;
  } catch (error) {
    console.error("Unauthorized or failed to fetch inquiries:", error);
    return [];
  }
}

export async function deleteInquiry(id: string) {
  try {
    // Only authenticated admin can delete leads
    await requireAdminSession();

    await prisma.inquiry.delete({
      where: { id },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete inquiry:", error);
    return { success: false, error: error.message || "Failed to delete lead" };
  }
}


