/**
 * Calendar Holiday & Long Weekend Discount Schedule (Late 2026 - Mid 2027)
 * 
 * DISCOUNT POLICY:
 * 1. Single Willow Peak Cottages (Breeze, Crest, Heaven): 0% discount (Direct Net Tariff ₹4,999/night).
 * 2. Regular Weekdays (Mon-Thu, non-holiday): 26% direct booking discount with code STAYW26.
 * 3. Long Weekend Dates (Peak Periods): 26% weekday offer REMOVED. Eligible for 5% direct discount.
 * 4. Normal Weekends (Friday, Saturday, Sunday): Eligible for 5% direct discount.
 */

export interface LongWeekendRange {
  id: string;
  name: string;
  start: string; // YYYY-MM-DD (inclusive)
  end: string;   // YYYY-MM-DD (inclusive)
  description: string;
  daysCount: number;
}

export const LONG_WEEKEND_RANGES: LongWeekendRange[] = [
  {
    id: "dussehra-2026",
    name: "Dussehra Long Weekend",
    start: "2026-10-17",
    end: "2026-10-20",
    description: "Sat Oct 17 to Tue Oct 20 (Dussehra on Tuesday)",
    daysCount: 4,
  },
  {
    id: "diwali-2026",
    name: "Diwali & Bhai Dooj Holiday Week",
    start: "2026-11-06",
    end: "2026-11-11",
    description: "Fri Nov 6 to Wed Nov 11 (Dhanteras, Diwali, Govardhan Puja & Bhai Dooj)",
    daysCount: 6,
  },
  {
    id: "guru-nanak-2026",
    name: "Guru Nanak Jayanti Weekend",
    start: "2026-11-21",
    end: "2026-11-24",
    description: "Sat Nov 21 to Tue Nov 24 (Gurpurab on Tuesday)",
    daysCount: 4,
  },
  {
    id: "christmas-new-year-2026-2027",
    name: "Christmas & New Year Holiday Season",
    start: "2026-12-24",
    end: "2027-01-03",
    description: "Thu Dec 24, 2026 to Sun Jan 3, 2027 (Peak festive week)",
    daysCount: 11,
  },
  {
    id: "republic-day-2027",
    name: "Republic Day Long Weekend",
    start: "2027-01-23",
    end: "2027-01-26",
    description: "Sat Jan 23 to Tue Jan 26 (Republic Day on Tuesday)",
    daysCount: 4,
  },
  {
    id: "shivaji-jayanti-2027",
    name: "Chhatrapati Shivaji Maharaj Jayanti Weekend",
    start: "2027-02-19",
    end: "2027-02-21",
    description: "Fri Feb 19 to Sun Feb 21 (Friday holiday in Maharashtra)",
    daysCount: 3,
  },
  {
    id: "maha-shivratri-2027",
    name: "Maha Shivratri Weekend",
    start: "2027-03-05",
    end: "2027-03-07",
    description: "Fri Mar 5 to Sun Mar 7 (Maha Shivratri on Saturday)",
    daysCount: 3,
  },
  {
    id: "holi-2027",
    name: "Holi Long Weekend",
    start: "2027-03-20",
    end: "2027-03-23",
    description: "Sat Mar 20 to Tue Mar 23 (Holika Dahan Mon & Rangwali Holi Tue)",
    daysCount: 4,
  },
  {
    id: "good-friday-2027",
    name: "Good Friday & Easter Weekend",
    start: "2027-03-26",
    end: "2027-03-28",
    description: "Fri Mar 26 to Sun Mar 28 (Good Friday natural 3-day weekend)",
    daysCount: 3,
  },
  {
    id: "ambedkar-ram-navami-2027",
    name: "Ambedkar Jayanti & Ram Navami Holiday Break",
    start: "2027-04-14",
    end: "2027-04-18",
    description: "Wed Apr 14 to Sun Apr 18 (Ambedkar Jayanti Wed & Ram Navami Thu)",
    daysCount: 5,
  },
];

/**
 * Format a Date object to YYYY-MM-DD string using local calendar representation
 */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Check if a date falls inside any designated Long Weekend window
 */
export function checkLongWeekend(date: Date): { isLongWeekend: boolean; holidayName?: string } {
  const key = toDateKey(date);
  for (const range of LONG_WEEKEND_RANGES) {
    if (key >= range.start && key <= range.end) {
      return { isLongWeekend: true, holidayName: range.name };
    }
  }
  return { isLongWeekend: false };
}

/**
 * Check if a night is a weekend night (Friday, Saturday, Sunday)
 */
export function isWeekendNight(date: Date, overrideType?: string): boolean {
  if (
    overrideType === "FRIDAY" || 
    overrideType === "SATURDAY" || 
    overrideType === "SUNDAY" || 
    overrideType === "WEEKEND"
  ) {
    return true;
  }
  const day = date.getDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
  return day === 0 || day === 5 || day === 6;
}

export type NightCategory = "NORMAL_WEEKDAY" | "WEEKEND" | "LONG_WEEKEND";

/**
 * Categorizes a stay night into one of three pricing/offer buckets:
 * - "LONG_WEEKEND": Falls inside a peak holiday window (26% offer removed; eligible for 5% discount)
 * - "WEEKEND": Normal Friday, Saturday, Sunday (eligible for 5% discount)
 * - "NORMAL_WEEKDAY": Normal Mon-Thu night (eligible for 26% discount on villas)
 */
export function categorizeNight(date: Date, overrideType?: string): {
  category: NightCategory;
  label: string;
  discountRate: number; // 0.26 or 0.05
  holidayName?: string;
} {
  const { isLongWeekend, holidayName } = checkLongWeekend(date);

  if (isLongWeekend) {
    return {
      category: "LONG_WEEKEND",
      label: holidayName || "Long Weekend Special",
      discountRate: 0.05,
      holidayName,
    };
  }

  if (isWeekendNight(date, overrideType)) {
    return {
      category: "WEEKEND",
      label: "Weekend Direct Tariff",
      discountRate: 0.05,
    };
  }

  return {
    category: "NORMAL_WEEKDAY",
    label: "Weekday Special",
    discountRate: 0.26,
  };
}
