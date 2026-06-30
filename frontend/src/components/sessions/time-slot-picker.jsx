import { cn } from "@/lib/utils";

const SLOT_DURATION = 45; // minutes

export function addMinutes(time, mins) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + mins;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(time) {
  const [hourStr, minuteStr] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minuteStr} ${ampm}`;
}
function generateSlotsFromWindows(availabilityWindows) {
  const slots = new Set();

  for (const window of availabilityWindows) {
    let current = toMinutes(window.startTime);
    const end = toMinutes(window.endTime);

    while (current + SLOT_DURATION <= end) {
      const hh = Math.floor(current / 60);
      const mm = current % 60;
      slots.add(`${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`);
      current += SLOT_DURATION;
    }
  }

  return Array.from(slots).sort((a, b) => toMinutes(a) - toMinutes(b));
}

function isSlotBooked(slotStart, bookedRanges) {
  const slotStartMin = toMinutes(slotStart);
  const slotEndMin = slotStartMin + SLOT_DURATION;

  return bookedRanges.some(({ startTime, endTime }) => {
    const bookedStart = new Date(startTime);
    const bookedEnd = new Date(endTime);

    const bookedStartMin = bookedStart.getHours() * 60 + bookedStart.getMinutes();
    const bookedEndMin = bookedEnd.getHours() * 60 + bookedEnd.getMinutes();

    return slotStartMin < bookedEndMin && slotEndMin > bookedStartMin;
  });
}

function isSlotInPast(slotStart, selectedDate) {
  if (!selectedDate) return false;

  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selDay = new Date(selectedDate);
  selDay.setHours(0, 0, 0, 0);

  // Only check if the selected date is today
  if (selDay.getTime() !== today.getTime()) return false;

  const [h, m] = slotStart.split(":").map(Number);
  const slotDate = new Date(selectedDate);
  slotDate.setHours(h, m, 0, 0);

  return slotDate <= now;
}

export function TimeSlotPicker({ value, onChange, availabilityWindows = [], bookedRanges = [], selectedDate, loading = false }) {
  const slots = generateSlotsFromWindows(availabilityWindows);

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-md bg-muted" />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return <p className="py-3 text-center text-sm text-muted-foreground">No available slots for this day. Pick another date.</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-1.5">
      {slots.map((slot) => {
        const endSlot = addMinutes(slot, SLOT_DURATION);
        const booked = isSlotBooked(slot, bookedRanges);
        const past = isSlotInPast(slot, selectedDate);
        const disabled = booked || past;
        const isSelected = value === slot;

        return (
          <button
            type="button"
            key={slot}
            disabled={disabled}
            onClick={() => !disabled && onChange(slot)}
            className={cn(
              "flex flex-col items-center rounded-md border px-1.5 py-1.5 text-xs transition-colors",
              "border-input bg-background hover:bg-accent hover:text-accent-foreground",
              isSelected && "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
              disabled && "pointer-events-none cursor-not-allowed opacity-40",
              booked && "line-through",
            )}>
            <span className="font-medium leading-tight">{formatTime(slot)}</span>
            <span className={cn("text-[10px] leading-tight", isSelected ? "text-primary-foreground/80" : "text-muted-foreground")}>→ {formatTime(endSlot)}</span>
            {booked && <span className="text-[9px] font-semibold text-destructive/80 leading-none">Booked</span>}
            {past && !booked && <span className="text-[9px] font-semibold text-muted-foreground leading-none">Past</span>}
          </button>
        );
      })}
    </div>
  );
}
