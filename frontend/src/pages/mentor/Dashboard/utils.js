/**
 * Format an ISO date string to a human-readable short format.
 * e.g. "2024-01-15T10:00:00.000Z" → "Mon, Jan 15 · 10:00 AM"
 */
export function formatSessionDate(isoString) {
  if (!isoString) return "—";

  try {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

/**
 * Groups flat availability slots by dayOfWeek.
 * Returns all 7 days, with empty slots array for days with no availability.
 *
 * Input:  [{ _id, mentor, dayOfWeek, startTime, endTime }]
 * Output: [{ dayOfWeek: 0, slots: [...] }, ...]
 */
export function groupAvailabilityByDay(slots = []) {
  const map = {};

  // Initialize all 7 days
  for (let i = 0; i < 7; i++) {
    map[i] = { dayOfWeek: i, slots: [] };
  }

  for (const slot of slots) {
    if (map[slot.dayOfWeek]) {
      map[slot.dayOfWeek].slots.push(slot);
    }
  }

  // Sort slots within each day by startTime
  for (let i = 0; i < 7; i++) {
    map[i].slots.sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  return Object.values(map);
}
