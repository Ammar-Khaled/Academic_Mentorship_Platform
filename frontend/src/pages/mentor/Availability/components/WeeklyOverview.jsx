import { DAY_OPTIONS } from "../constants";

export function WeeklyOverview({ slots = [] }) {
  const counts = DAY_OPTIONS.map((day) => {
    const daySlots = slots.filter((slot) => slot.dayOfWeek === day.value);
    const activeCount = daySlots.filter((s) => s.isActive !== false).length;
    return {
      ...day,
      count: daySlots.length,
      activeCount,
    };
  });

  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Weekly Availability Overview</h2>
        <p className="text-sm text-muted-foreground">Slot count from Monday to Sunday.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {counts.map((item) => (
          <div key={item.value} className="rounded-lg border border-border bg-card p-3">
            <div className="text-xs text-muted-foreground">{item.label}</div>
            <div className="mt-1 text-2xl font-semibold">{item.activeCount} / {item.count}</div>
            <div className="text-xs text-muted-foreground">active / total</div>
          </div>
        ))}
      </div>
    </section>
  );
}
