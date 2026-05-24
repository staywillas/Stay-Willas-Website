/**
 * Simple, robust iCal parser supporting RFC 5545 to extract DTSTART and DTEND dates
 */
export function parseICal(icalText: string): { start: Date; end: Date }[] {
  const events: { start: Date; end: Date }[] = [];
  const lines = icalText.split(/\r?\n/);
  
  let currentEvent: { start?: Date; end?: Date } | null = null;
  
  for (let line of lines) {
    line = line.trim();
    if (line === "BEGIN:VEVENT") {
      currentEvent = {};
    } else if (line === "END:VEVENT") {
      if (currentEvent && currentEvent.start && currentEvent.end) {
        events.push({ start: currentEvent.start, end: currentEvent.end });
      }
      currentEvent = null;
    } else if (currentEvent) {
      if (line.startsWith("DTSTART")) {
        const parts = line.split(":");
        const value = parts[parts.length - 1];
        if (value) {
          currentEvent.start = parseICalDate(value);
        }
      } else if (line.startsWith("DTEND")) {
        const parts = line.split(":");
        const value = parts[parts.length - 1];
        if (value) {
          currentEvent.end = parseICalDate(value);
        }
      }
    }
  }
  
  return events;
}

function parseICalDate(dateStr: string): Date {
  // Format: YYYYMMDDTHHMMSSZ or YYYYMMDD
  const cleanStr = dateStr.replace(/[^0-9]/g, ""); // e.g. 20260601
  
  if (cleanStr.length < 8) {
    return new Date();
  }
  
  const year = parseInt(cleanStr.substring(0, 4));
  const month = parseInt(cleanStr.substring(4, 6)) - 1; // 0-indexed month
  const day = parseInt(cleanStr.substring(6, 8));
  
  if (cleanStr.length >= 14) {
    const hour = parseInt(cleanStr.substring(8, 10));
    const min = parseInt(cleanStr.substring(10, 12));
    const sec = parseInt(cleanStr.substring(12, 14));
    return new Date(Date.UTC(year, month, day, hour, min, sec));
  }
  
  // Date-only format: default to standard check-in/out times (e.g. 12:00:00 UTC)
  return new Date(Date.UTC(year, month, day, 12, 0, 0));
}
