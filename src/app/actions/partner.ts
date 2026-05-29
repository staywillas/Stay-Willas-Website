"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import ownerConfig from "@/data/owner-config.json";

// Typed helper for retrieving owner mapped villa IDs
export async function getOwnerVillaIds(email: string): Promise<string[]> {
  const config = ownerConfig as Record<string, string[]>;
  return config[email] || [];
}

export async function getPartnerDashboardData(ownerEmail: string) {
  try {
    const mappedVillaIds = await getOwnerVillaIds(ownerEmail);
    
    if (mappedVillaIds.length === 0) {
      return {
        success: true,
        villas: [],
        bookings: [],
        stats: {
          totalEarnings: 0,
          activeBookingsCount: 0,
          occupancyRate: 0,
        }
      };
    }

    // Query villas, bookings, and reviews in parallel
    const [villas, bookings] = await Promise.all([
      prisma.villa.findMany({
        where: { id: { in: mappedVillaIds } },
        include: {
          _count: {
            select: { reviews: true }
          }
        }
      }),
      prisma.booking.findMany({
        where: { villaId: { in: mappedVillaIds } },
        orderBy: { checkIn: "asc" }
      })
    ]);

    // Calculate Statistics
    // 1. Total Earnings from confirmed bookings
    const confirmedBookings = bookings.filter(b => b.status === "CONFIRMED" && !b.userId.startsWith("OWNER_BLOCK") && !b.userId.startsWith("MAINTENANCE_BLOCK") && !b.userId.startsWith("CHANNEL_SYNC|"));
    const totalEarnings = confirmedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    // 2. Active bookings count (CONFIRMED + PENDING, excluding custom partner blocks)
    const activeBookings = bookings.filter(b => 
      (b.status === "CONFIRMED" || b.status === "PENDING") && 
      !b.userId.startsWith("OWNER_BLOCK") && 
      !b.userId.startsWith("MAINTENANCE_BLOCK")
    );

    // 3. Occupancy Rate over the next 90 days
    // Count the number of unique days blocked/booked in the next 90 days across all owner villas
    const today = new Date();
    const ninetyDaysLater = new Date();
    ninetyDaysLater.setDate(today.getDate() + 90);

    let totalOccupiedDays = 0;
    const totalPossibleDays = 90 * villas.length;

    if (villas.length > 0) {
      // Loop through each day in the 90-day range and see if it's booked for any villa
      const occupiedSets = villas.map(() => new Set<string>());

      bookings.forEach(b => {
        if (b.status === "CANCELLED") return;
        
        // Find index of this villa in our owner list
        const villaIndex = villas.findIndex(v => v.id === b.villaId);
        if (villaIndex === -1) return;

        const start = new Date(Math.max(b.checkIn.getTime(), today.getTime()));
        const end = new Date(Math.min(b.checkOut.getTime(), ninetyDaysLater.getTime()));

        if (start < end) {
          const current = new Date(start);
          while (current < end) {
            occupiedSets[villaIndex].add(current.toDateString());
            current.setDate(current.getDate() + 1);
          }
        }
      });

      // Sum all occupied days
      totalOccupiedDays = occupiedSets.reduce((sum, set) => sum + set.size, 0);
    }

    const occupancyRate = totalPossibleDays > 0 
      ? Math.round((totalOccupiedDays / totalPossibleDays) * 100) 
      : 0;

    return {
      success: true,
      villas: villas.map(v => ({
        id: v.id,
        name: v.name,
        location: v.location,
        price: v.price,
        images: v.images,
        bedrooms: v.bedrooms,
        reviewsCount: v._count.reviews
      })),
      bookings: bookings.map(b => ({
        id: b.id,
        villaId: b.villaId,
        villaName: villas.find(v => v.id === b.villaId)?.name || "Unknown Property",
        checkIn: b.checkIn.toISOString(),
        checkOut: b.checkOut.toISOString(),
        totalPrice: b.totalPrice,
        status: b.status,
        userId: b.userId,
        isCustomBlock: b.userId.startsWith("OWNER_BLOCK") || b.userId.startsWith("MAINTENANCE_BLOCK"),
        isChannelSync: b.userId.startsWith("CHANNEL_SYNC|")
      })),
      stats: {
        totalEarnings,
        activeBookingsCount: activeBookings.length,
        occupancyRate
      }
    };
  } catch (error: any) {
    console.error("Failed to fetch partner dashboard data:", error);
    return { success: false, error: error.message || "Failed to load partner details." };
  }
}

export async function blockPartnerDates(
  ownerEmail: string,
  formData: {
    villaId: string;
    checkIn: string;
    checkOut: string;
    type: "PERSONAL" | "MAINTENANCE";
    notes: string;
  }
) {
  try {
    // Security check: ensure partner owns this villa
    const ownedVillas = await getOwnerVillaIds(ownerEmail);
    if (!ownedVillas.includes(formData.villaId)) {
      return { success: false, error: "Access Denied: You do not own this property." };
    }

    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);

    if (checkInDate >= checkOutDate) {
      return { success: false, error: "Check-out date must be after check-in date." };
    }

    // Overlap validation: check if dates are already blocked for this villa
    const overlapping = await prisma.booking.findFirst({
      where: {
        villaId: formData.villaId,
        status: { in: ["CONFIRMED", "PENDING", "BLOCKED"] },
        OR: [
          {
            checkIn: { lte: checkInDate },
            checkOut: { gt: checkInDate },
          },
          {
            checkIn: { lt: checkOutDate },
            checkOut: { gte: checkOutDate },
          },
          {
            checkIn: { gte: checkInDate },
            checkOut: { lte: checkOutDate },
          },
        ],
      },
    });

    if (overlapping) {
      return {
        success: false,
        error: `Dates overlap with an existing reservation: ${overlapping.status} (${overlapping.checkIn.toLocaleDateString()} - ${overlapping.checkOut.toLocaleDateString()}).`,
      };
    }

    // Determine custom block type
    const customUserId = formData.type === "MAINTENANCE"
      ? `MAINTENANCE_BLOCK|${formData.notes || "Routine Maintenance"}`
      : `OWNER_BLOCK|${formData.notes || "Owner Personal Use"}`;

    await prisma.booking.create({
      data: {
        villaId: formData.villaId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice: 0,
        status: "CONFIRMED",
        userId: customUserId,
      },
    });

    revalidatePath("/homeowner");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to block partner dates:", error);
    return { success: false, error: error.message || "Failed to block dates." };
  }
}

export async function deletePartnerBlock(ownerEmail: string, bookingId: string) {
  try {
    // 1. Fetch the booking to delete
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      return { success: false, error: "Block booking not found." };
    }

    // 2. Security check: verify this partner owns the villa of the booking
    const ownedVillas = await getOwnerVillaIds(ownerEmail);
    if (!ownedVillas.includes(booking.villaId)) {
      return { success: false, error: "Access Denied: You do not own this property." };
    }

    // 3. Ensure it's a custom partner block
    if (!booking.userId.startsWith("OWNER_BLOCK") && !booking.userId.startsWith("MAINTENANCE_BLOCK")) {
      return { success: false, error: "You can only delete custom partner-created blocks." };
    }

    // 4. Delete
    await prisma.booking.delete({
      where: { id: bookingId }
    });

    revalidatePath("/homeowner");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete partner block:", error);
    return { success: false, error: error.message || "Failed to remove block." };
  }
}
