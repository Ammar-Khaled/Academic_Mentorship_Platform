import { formatTimeLabel, getDayLabel } from "../utils";

export function AvailabilityTable({ slots = [], isDeleting, isToggling, onEdit, onDelete, onToggleStatus }) {
  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Availability Slots</h2>
        <p className="text-sm text-muted-foreground">Manage each slot and toggle active state.</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Day</th>
              <th className="px-4 py-3">Start Time</th>
              <th className="px-4 py-3">End Time</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => {
              const isActive = slot.isActive !== false;

              return (
                <tr key={slot._id} className="border-b border-border">
                  <td className="px-4 py-3 font-medium">{getDayLabel(slot.dayOfWeek)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatTimeLabel(slot.startTime)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatTimeLabel(slot.endTime)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>{isActive ? "Active" : "Inactive"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => onEdit(slot)} className="inline-flex h-8 items-center rounded-md border border-border px-3 text-xs font-medium">
                        Edit
                      </button>
                      <button type="button" onClick={() => onToggleStatus(slot)} disabled={isToggling} className="inline-flex h-8 items-center rounded-md border border-border px-3 text-xs font-medium disabled:opacity-50">
                        {isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button type="button" onClick={() => onDelete(slot)} disabled={isDeleting} className="inline-flex h-8 items-center rounded-md border border-destructive/40 px-3 text-xs font-medium text-destructive disabled:opacity-50">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
