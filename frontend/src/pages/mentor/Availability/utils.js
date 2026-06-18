import { DAY_OPTIONS } from "./constants";

export function getDayLabel(dayOfWeek) {
  return DAY_OPTIONS.find((d) => d.value === dayOfWeek)?.label ?? "Unknown";
}

export function formatTimeLabel(time) {
  if (!time || !time.includes(":")) return time ?? "";

  const [h, m] = time.split(":").map(Number);
  const isPm = h >= 12;
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${isPm ? "PM" : "AM"}`;
}

export function timeToMinutes(time) {
  const [h, m] = String(time).split(":").map(Number);
  return h * 60 + m;
}

export function sortSlots(slots = []) {
  return [...slots].sort((a, b) => {
    if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
    return a.startTime.localeCompare(b.startTime);
  });
}

export function groupSlotsByDay(slots = []) {
  const byDay = {};

  for (const day of DAY_OPTIONS) {
    byDay[day.value] = [];
  }

  for (const slot of slots) {
    if (!byDay[slot.dayOfWeek]) byDay[slot.dayOfWeek] = [];
    byDay[slot.dayOfWeek].push(slot);
  }

  for (const dayKey of Object.keys(byDay)) {
    byDay[dayKey].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  return byDay;
}
