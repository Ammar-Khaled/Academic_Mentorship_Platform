import { DAY_OPTIONS } from "../constants";
import { formatTimeLabel } from "../utils";

export function SlotsByDay({ groupedSlots }) {
  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Slots Grouped By Day</h2>
        <p className="text-sm text-muted-foreground">Quick weekly breakdown of configured ranges.</p>
      </div>

      <div className="space-y-3">
        {DAY_OPTIONS.map((day) => {
          const daySlots = groupedSlots[day.value] ?? [];

          return (
            <div key={day.value} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{day.label}</h3>
                <span className="text-xs text-muted-foreground">{daySlots.length} slots</span>
              </div>

              {daySlots.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">No slots configured.</p>
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  {daySlots.map((slot) => {
                    const isActive = slot.isActive !== false;
                    return (
                      <span
                        key={slot._id}
                        className={`rounded-md border px-2 py-1 text-xs ${isActive ? "border-border bg-emerald-50 text-emerald-700" : "border-destructive/30 bg-destructive/5 text-destructive"}`}
                      >
                        {formatTimeLabel(slot.startTime)} - {formatTimeLabel(slot.endTime)}
                        {!isActive && " (Inactive)"}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
