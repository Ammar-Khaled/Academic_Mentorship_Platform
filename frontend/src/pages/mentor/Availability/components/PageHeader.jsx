export function PageHeader({ onAdd }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">Mentor Availability</div>
        <h1 className="text-2xl font-semibold tracking-tight">Manage Weekly Availability</h1>
        <p className="text-sm text-muted-foreground">Create, edit, and remove recurring weekly slots for student bookings.</p>
      </div>

      <button type="button" onClick={onAdd} className="inline-flex h-10 items-center rounded-md bg-foreground px-4 text-sm font-medium text-background">
        Add Availability
      </button>
    </div>
  );
}
