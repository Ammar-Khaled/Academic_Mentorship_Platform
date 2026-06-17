export function AvailabilityEmptyState({ onCreate }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
      <h3 className="text-lg font-semibold">No availability slots</h3>
      <p className="mt-2 text-sm text-muted-foreground">Add your first recurring slot to start receiving session bookings.</p>
      <button type="button" onClick={onCreate} className="mt-4 inline-flex h-10 items-center rounded-md bg-foreground px-4 text-sm font-medium text-background">
        Create Slot
      </button>
    </div>
  );
}
