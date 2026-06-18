export function AvailabilitySection({
  availability,
}) {
  return (
    <div className="space-y-4">
      {availability.map((day) => (
        <div key={day.dayOfWeek}>
          <h3 className="font-semibold">
            Day {day.dayOfWeek}
          </h3>

          <div className="flex flex-wrap gap-2 mt-2">
            {day.slots.map((slot) => (
              <div
                key={slot}
                className="rounded border px-3 py-1"
              >
                {slot}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}