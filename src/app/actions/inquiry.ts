"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/session";

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

    // Revalidate the admin dashboard so the new inquiry shows up instantly
    revalidatePath("/admin");
    
    return { success: true, inquiryId: inquiry.id };
  } catch (error: any) {
    console.error("Failed to submit inquiry:", error);
    throw new Error(error.message || "Failed to submit inquiry to the database");
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
    const name = (data.name || "").trim().slice(0, 100);
    const phone = (data.phone || "").trim().slice(0, 30);
    const email = (data.email || "N/A").trim().slice(0, 150);
    const villaName = (data.villaName || "").trim().slice(0, 100);

    if (!name || !phone) {
      return { success: false, error: "Name and phone are required." };
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        phone,
        email,
        message: `Direct Booking Lead for ${villaName}. Guest entered name & phone in booking gate.`,
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


