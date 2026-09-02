"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitInquiry(formData: {
  name: string;
  email: string;
  phone: string;
  message: string;
  villaId?: string;
  type?: "GUEST" | "OWNER" | "BOOKING_LEAD";
}) {
  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        villaId: formData.villaId || null,
        type: formData.type || "GUEST",
      },
    });

    // Revalidate the admin dashboard so the new inquiry shows up instantly
    revalidatePath("/admin");
    
    return { success: true, inquiryId: inquiry.id };
  } catch (error) {
    console.error("Failed to submit inquiry:", error);
    throw new Error("Failed to submit inquiry to the database");
  }
}

/**
 * Automatically captures a booking lead when a user submits their contact info in the booking gate
 */
export async function captureBookingLead(data: {
  name: string;
  phone: string;
  email?: string;
  villaName: string;
  villaId?: string;
}) {
  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email?.trim() || "N/A",
        message: `Direct Booking Lead for ${data.villaName}. Guest entered name & phone in booking gate.`,
        villaId: data.villaId || null,
        type: "BOOKING_LEAD",
      },
    });

    revalidatePath("/admin");
    return { success: true, leadId: inquiry.id };
  } catch (error: any) {
    console.error("Failed to capture booking lead:", error);
    return { success: false, error: error.message };
  }
}

export async function getInquiries(type?: "GUEST" | "OWNER" | "BOOKING_LEAD") {
  try {
    const inquiries = await prisma.inquiry.findMany({
      where: type ? { type } : {},
      orderBy: { createdAt: "desc" },
    });
    return inquiries;
  } catch (error) {
    console.error("Failed to fetch inquiries:", error);
    return [];
  }
}

