"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

// -------------------------------------------------------------------------
// 1. Manual Bookings / Stays Operations
// -------------------------------------------------------------------------

export async function createManualBooking(formData: {
  villaId: string;
  checkIn: string; // ISO String
  checkOut: string; // ISO String
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  totalPrice: number;
  status: string; // CONFIRMED, PENDING, BLOCKED
  notes?: string;
  type?: "GUEST" | "MAINTENANCE" | "OWNER_USE";
  guests?: number;
  nightlyRate?: number;
}) {
  try {
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);

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
        error: `These dates overlap with an existing booking/blackout: ${overlapping.status} (${overlapping.checkIn.toLocaleDateString()} - ${overlapping.checkOut.toLocaleDateString()}).`,
      };
    }

    // Determine custom JSON serialized userId payload
    let userIdPayload = "";
    if (formData.type === "MAINTENANCE") {
      userIdPayload = JSON.stringify({
        type: "MAINTENANCE",
        reason: formData.guestName || "Routine Maintenance",
      });
    } else if (formData.type === "OWNER_USE") {
      userIdPayload = JSON.stringify({
        type: "OWNER_USE",
        reason: formData.guestName || "Owner Occupancy",
      });
    } else {
      userIdPayload = JSON.stringify({
        type: "MANUAL",
        name: formData.guestName,
        email: formData.guestEmail || "",
        phone: formData.guestPhone || "",
        notes: formData.notes || "",
        guests: formData.guests || 1,
        nightlyRate: formData.nightlyRate || 0,
      });
    }

    const booking = await prisma.booking.create({
      data: {
        villaId: formData.villaId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice: formData.totalPrice,
        status: formData.status,
        userId: userIdPayload,
      },
    });

    revalidatePath("/admin");
    return { success: true, booking };
  } catch (error: any) {
    console.error("Failed to create manual booking:", error);
    return { success: false, error: error.message || "Failed to log reservation." };
  }
}

export async function deleteBooking(bookingId: string) {
  try {
    await prisma.booking.delete({
      where: { id: bookingId },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to cancel/delete booking:", error);
    return { success: false, error: error.message || "Failed to remove block." };
  }
}

// -------------------------------------------------------------------------
// 2. Property Management System (PMS) Operations
// -------------------------------------------------------------------------

export async function updateVillaDetails(data: {
  id: string;
  name: string;
  location: string;
  price: number;
  guests: number;
  baseGuests?: number;
  extraGuestFee?: number;
  fridayPrice?: number | null;
  saturdayPrice?: number | null;
  sundayPrice?: number | null;
  bedrooms: number;
  category: string;
  description: string;
}) {
  try {
    const updated = await prisma.villa.update({
      where: { id: data.id },
      data: {
        name: data.name,
        location: data.location,
        price: data.price,
        guests: data.guests,
        baseGuests: data.baseGuests,
        extraGuestFee: data.extraGuestFee,
        fridayPrice: data.fridayPrice,
        saturdayPrice: data.saturdayPrice,
        sundayPrice: data.sundayPrice,
        bedrooms: data.bedrooms,
        category: data.category,
        description: data.description,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/villas");
    revalidatePath(`/villa/${updated.slug}`);
    return { success: true, villa: updated };
  } catch (error: any) {
    console.error("PMS update failed:", error);
    return { success: false, error: error.message || "Failed to save property specifications." };
  }
}

// -------------------------------------------------------------------------
// 3. Channel Manager (iCal Sync) Operations
// -------------------------------------------------------------------------

const getConfigFilePath = () => {
  const dirPath = path.join(process.cwd(), "src", "data");
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  return path.join(dirPath, "channel-config.json");
};

export async function getChannelConfigs() {
  try {
    const filePath = getConfigFilePath();
    if (!fs.existsSync(filePath)) {
      return {};
    }
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content || "{}");
  } catch (error) {
    console.error("Failed to read channel configs:", error);
    return {};
  }
}

export async function updateChannelConfig(
  villaId: string,
  configs: { airbnb?: string; booking?: string; vrbo?: string }
) {
  try {
    const filePath = getConfigFilePath();
    let data: Record<string, typeof configs> = {};
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      data = JSON.parse(content || "{}");
    }

    data[villaId] = {
      ...data[villaId],
      ...configs,
    };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update channel configs:", error);
    return { success: false, error: error.message || "Failed to store channel configurations." };
  }
}

// ICS file parser in pure TypeScript
function parseICS(icsText: string): Array<{ start: Date; end: Date; uid: string; summary: string }> {
  const events: Array<{ start: Date; end: Date; uid: string; summary: string }> = [];
  const lines = icsText.split(/\r?\n/);
  let currentEvent: any = null;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    // Handle folded lines
    while (i + 1 < lines.length && (lines[i + 1].startsWith(" ") || lines[i + 1].startsWith("\t"))) {
      line += lines[i + 1].substring(1);
      i++;
    }

    const parts = line.split(":");
    if (parts.length < 2) continue;
    const name = parts[0].split(";")[0];
    const value = parts.slice(1).join(":");

    if (name === "BEGIN" && value === "VEVENT") {
      currentEvent = {};
    } else if (name === "END" && value === "VEVENT") {
      if (currentEvent && currentEvent.DTSTART && currentEvent.DTEND) {
        events.push({
          start: parseICSDate(currentEvent.DTSTART),
          end: parseICSDate(currentEvent.DTEND),
          uid: currentEvent.UID || Math.random().toString(),
          summary: currentEvent.SUMMARY || "External Reservation",
        });
      }
      currentEvent = null;
    } else if (currentEvent) {
      currentEvent[name] = value;
    }
  }
  return events;
}

function parseICSDate(dateStr: string): Date {
  const clean = dateStr.replace(/[^0-9T]/g, "");
  const year = parseInt(clean.substring(0, 4));
  const month = parseInt(clean.substring(4, 6)) - 1;
  const day = parseInt(clean.substring(6, 8));

  if (clean.includes("T")) {
    const hour = parseInt(clean.substring(9, 11)) || 0;
    const minute = parseInt(clean.substring(11, 13)) || 0;
    const second = parseInt(clean.substring(13, 15)) || 0;
    if (dateStr.endsWith("Z")) {
      return new Date(Date.UTC(year, month, day, hour, minute, second));
    }
    return new Date(year, month, day, hour, minute, second);
  }

  // All day event, return Date at local midnight
  return new Date(year, month, day, 0, 0, 0);
}

export async function syncExternalChannels() {
  const errors: string[] = [];
  let syncedCount = 0;

  try {
    const configs = await getChannelConfigs();
    const villas = await prisma.villa.findMany();

    for (const villa of villas) {
      const villaConfig = configs[villa.id];
      if (!villaConfig) continue;

      const channels = ["airbnb", "booking", "vrbo"] as const;
      const parsedEvents: Array<{ start: Date; end: Date; uid: string; channel: string }> = [];

      for (const channel of channels) {
        const url = villaConfig[channel];
        if (!url || url.trim() === "") continue;

        try {
          // Fetch the external iCal calendar feed
          const response = await fetch(url, {
            cache: "no-store",
            headers: { "User-Agent": "StayWillas-ChannelManager/1.0" },
          });

          if (!response.ok) {
            throw new Error(`HTTP Error ${response.status} fetching ${channel}`);
          }

          const icsText = await response.text();
          const events = parseICS(icsText);

          for (const ev of events) {
            parsedEvents.push({
              start: ev.start,
              end: ev.end,
              uid: ev.uid,
              channel,
            });
          }
        } catch (err: any) {
          const errMsg = `Error syncing ${villa.name} on ${channel}: ${err.message || err}`;
          console.error(errMsg);
          errors.push(errMsg);
        }
      }

      if (parsedEvents.length > 0) {
        // Delete all existing external channel syncs for this specific villa
        await prisma.booking.deleteMany({
          where: {
            villaId: villa.id,
            userId: { startsWith: "CHANNEL_SYNC|" },
          },
        });

        // Write all parsed bookings to the database in parallel
        await Promise.all(
          parsedEvents.map((ev) =>
            prisma.booking.create({
              data: {
                villaId: villa.id,
                checkIn: ev.start,
                checkOut: ev.end,
                totalPrice: 0,
                status: "CONFIRMED",
                userId: `CHANNEL_SYNC|${ev.channel}|${ev.uid}`,
              },
            })
          )
        );

        syncedCount += parsedEvents.length;
      }
    }

    revalidatePath("/admin");
    return { success: true, syncedCount, errors };
  } catch (error: any) {
    console.error("Channel sync failed entirely:", error);
    return { success: false, error: error.message || "Failed to execute channel manager synchronizations." };
  }
}

export async function setDailyPrice(villaId: string, dateStr: string, price: number) {
  try {
    const targetDate = new Date(dateStr);
    targetDate.setUTCHours(0, 0, 0, 0);

    // Overlap validation: check if the property is booked/blocked on this date
    const bookingOnDate = await prisma.booking.findFirst({
      where: {
        villaId,
        status: { in: ["CONFIRMED", "PENDING", "BLOCKED"] },
        checkIn: { lte: targetDate },
        checkOut: { gt: targetDate },
      },
    });

    if (bookingOnDate) {
      return {
        success: false,
        error: `Cannot override pricing on this date because the property is already booked/blocked (${bookingOnDate.checkIn.toLocaleDateString("en-IN")} - ${bookingOnDate.checkOut.toLocaleDateString("en-IN")}).`,
      };
    }

    const override = await prisma.dailyPrice.upsert({
      where: {
        villaId_date: {
          villaId,
          date: targetDate,
        },
      },
      update: {
        price,
      },
      create: {
        villaId,
        date: targetDate,
        price,
      },
    });

    revalidatePath("/admin");
    return { success: true, override };
  } catch (error: any) {
    console.error("Failed to set daily price:", error);
    return { success: false, error: error.message || "Failed to set daily pricing override." };
  }
}

export async function deleteDailyPrice(villaId: string, dateStr: string) {
  try {
    const targetDate = new Date(dateStr);
    targetDate.setUTCHours(0, 0, 0, 0);

    await prisma.dailyPrice.delete({
      where: {
        villaId_date: {
          villaId,
          date: targetDate,
        },
      },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete daily price:", error);
    return { success: false, error: error.message || "Failed to remove daily pricing override." };
  }
}

export async function setDailyPriceRange(
  villaId: string,
  startDateStr: string,
  endDateStr: string,
  price: number
) {
  try {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    
    // Normalize to midnight UTC
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(0, 0, 0, 0);

    if (start > end) {
      return { success: false, error: "Start date must be on or before end date." };
    }

    // Collect all dates in range
    const datesToOverride: Date[] = [];
    let current = new Date(start);
    while (current <= end) {
      datesToOverride.push(new Date(current));
      current.setUTCDate(current.getUTCDate() + 1);
    }

    // Overlap validation: check if any of these dates overlap with existing confirmed/pending/blocked bookings
    const bookings = await prisma.booking.findMany({
      where: {
        villaId,
        status: { in: ["CONFIRMED", "PENDING", "BLOCKED"] },
        AND: [
          { checkIn: { lt: new Date(end.getTime() + 24 * 60 * 60 * 1000) } },
          { checkOut: { gt: start } }
        ]
      }
    });

    // Check if any specific date is covered by bookings
    const blockedDates: string[] = [];
    for (const d of datesToOverride) {
      const isBooked = bookings.some(b => {
        const check = new Date(d);
        check.setHours(0, 0, 0, 0);
        const bStart = new Date(b.checkIn);
        const bEnd = new Date(b.checkOut);
        bStart.setHours(0, 0, 0, 0);
        bEnd.setHours(0, 0, 0, 0);
        return check >= bStart && check < bEnd;
      });
      if (isBooked) {
        blockedDates.push(d.toLocaleDateString("en-IN"));
      }
    }

    if (blockedDates.length > 0) {
      return {
        success: false,
        error: `Cannot override pricing because the property is already booked/blocked on the following dates: ${blockedDates.join(", ")}`
      };
    }

    // Perform upserts in a database transaction
    const upserts = datesToOverride.map(date => {
      return prisma.dailyPrice.upsert({
        where: {
          villaId_date: {
            villaId,
            date,
          }
        },
        update: {
          price
        },
        create: {
          villaId,
          date,
          price
        }
      });
    });

    const results = await prisma.$transaction(upserts);

    revalidatePath("/admin");
    return { success: true, count: results.length, overrides: results };
  } catch (error: any) {
    console.error("Failed to set daily price range:", error);
    return { success: false, error: error.message || "Failed to set daily price overrides." };
  }
}

export async function deleteDailyPriceRange(
  villaId: string,
  startDateStr: string,
  endDateStr: string
) {
  try {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(0, 0, 0, 0);

    if (start > end) {
      return { success: false, error: "Start date must be on or before end date." };
    }

    await prisma.dailyPrice.deleteMany({
      where: {
        villaId,
        date: {
          gte: start,
          lte: end
        }
      }
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete daily price range:", error);
    return { success: false, error: error.message || "Failed to clear daily pricing overrides." };
  }
}


